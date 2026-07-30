# Demo Switcher Refactor Plan

## Context

The floating Demo Switcher widget (`src/components/DemoSwitcher.tsx`) is broken in 5 ways: stuck top-left, dragging broken, clicking refreshes the page, position resets, and overlaps browser edges. The component must be completely rebuilt from scratch.

The component is rendered at the top level of `App.tsx` (line 59) inside `ErrorBoundary`, above the routes. It uses React 19, Framer Motion 12, React Router 7, Tailwind CSS 4, and TypeScript.

## Root Causes of Current Bugs

| Bug | Root Cause |
|-----|-----------|
| Stuck top-left | Position stored as additive offsets `{x:0, y:0}` from default (24,24), but `handleDragEnd` adds `info.offset` to current position incorrectly, corrupting state |
| Dragging broken | `handleDragEnd` computes new position by adding `info.offset.x/y` to `position.x/y`, but Framer Motion's offset is relative to drag start, not absolute |
| Click refreshes page | Outer element is `<motion.button>` (native `<button>`) and `SVGLogo`'s default `handleClick` calls `window.location.href = '/'` causing full page reload |
| Position resets | Position math is corrupted by wrong drag delta calculation; `useEffect` saves wrong values |
| Overlaps edge | Clamping uses hardcoded `72`/`100` offsets that don't match actual widget size; snap logic can push off-screen |

## Implementation Plan

### 1. Replace `<motion.button>` with `<motion.div>`
- Eliminates native button form-submit behavior and page refresh on click
- Add `role="button"` and `tabIndex={0}` for accessibility
- Handle keyboard activation (Enter/Space) manually

### 2. Position Management — Absolute `{ right, bottom }` in pixels
- Store position as `{ right: number, bottom: number }` where values are CSS distances from viewport edges
- Default: `{ right: 24, bottom: 24 }`
- On mount, read from `localStorage` key `'gc_demo_switcher_pos'`; fall back to default
- On drag end, compute new position from drag delta and save to localStorage

### 3. Drag Handling with Framer Motion Native API
- Use `motion.div` with `drag` prop (enabled on both desktop and mobile)
- `dragMomentum={false}`, `dragElastic={0}`, `dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}`
- `onDragEnd`: receive `(_, info)`, compute `newRight = position.right - info.offset.x`, `newBottom = position.bottom - info.offset.y`
- Clamp to viewport bounds: `right` in `[0, viewportWidth - widgetWidth]`, `bottom` in `[0, viewportHeight - widgetHeight]`
- Snap to nearest edge: compare `right` to `viewportWidth / 2`, snap to `0` (right edge) or `viewportWidth - widgetWidth` (left edge); same for `bottom`
- Save final snapped position to localStorage

### 4. Drag vs Click Detection
- Use a `pointerDownPos` ref to record `{ x, y }` on `pointerDown`
- On `pointerUp`, compute distance from `pointerDownPos` to current pointer position
- If distance > 5px, it was a drag — do not toggle popup
- If distance <= 5px, it was a click — toggle popup
- Alternative: use `onDragStart`/`onDragEnd` callbacks with a `wasDragged` ref that is set to `true` in `onDragStart` and reset via `requestAnimationFrame` after `onDragEnd`, so the `onClick` handler can check it

### 5. Popup Behavior
- Popup opens beside the floating button, positioned using the stored `right`/`bottom` values
- Do not open popup while dragging (check `wasDragged` flag)
- Animate with Framer Motion: `initial={{ opacity: 0, scale: 0.9 }}`, `animate={{ opacity: 1, scale: 1 }}`, `exit={{ opacity: 0, scale: 0.9 }}`
- Close on backdrop click or close button

### 6. Navigation
- Use `useNavigate` from `react-router-dom`
- Customer Mode → `navigate('/')`
- Staff Mode → `navigate('/staff/login')`
- Navigation only happens on menu item click inside popup, never on drag
- No `window.location`, `location.reload()`, or form submission anywhere

### 7. Widget Size and Styling
- 64px × 64px circular logo (`w-16 h-16 rounded-full`)
- Pill below: `h-[24px] px-3 rounded-full` with mode label in uppercase 11px
- Fixed position, `z-[100]`, `cursor-grab active:cursor-grabbing`
- `touch-action="none"` on the drag element

### 8. Prevent Re-render Loops
- Do not put `position` in `useEffect` dependency that triggers saves on every render
- Only save to localStorage in `onDragEnd`, not on every position change
- Use a ref for the drag state to avoid stale closures in callbacks

### 9. File Location
- Keep at `src/components/DemoSwitcher.tsx` (same location, completely rewritten)

## Key Implementation Details

### Position Computation on Drag End
```
newRight = clamp(position.right - info.offset.x, 0, viewportWidth - 64)
newBottom = clamp(position.bottom - info.offset.y, 0, viewportHeight - 64)
// Then snap:
snapRight = newRight < (viewportWidth - 64) / 2 ? 0 : (viewportWidth - 64)
snapBottom = newBottom < (viewportHeight - 64) / 2 ? 0 : (viewportHeight - 64)
```

### Drag vs Click Flag
Use a `dragDistanceRef` to track total pointer movement. In `onPointerDown`, record start position. In `onPointerMove` (on the element, not window), accumulate distance. In `onClick`, check if distance > 5px and skip toggle if so.

Actually, the cleanest approach with Framer Motion: Framer Motion's `onDragStart` fires when a drag begins, and `onDragEnd` fires when it ends. Between these, `isDragging` is true. The `onClick` event fires after `onDragEnd` on the same element. So:

1. Set `isDraggingRef.current = true` in `onDragStart`
2. In `onDragEnd`, set `isDraggingRef.current = false`, compute position, save to localStorage
3. In `onClick`, check `isDraggingRef.current` — if true, it was a drag, ignore

But there's a timing issue: `onClick` fires synchronously after `onDragEnd` in the same event loop tick, so `isDraggingRef.current` will already be `false`. Solution: use `requestAnimationFrame` to defer the reset, or use a separate `wasDragged` flag that persists for one frame.

Better approach: track pointer movement distance directly. In `onPointerDown`, save `{ x, y }`. In `onClick`, check `Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY) > 5`. If so, ignore.

### Popup Positioning
The popup should appear to the left of the floating button when the button is near the right edge, and to the right when near the left edge. Use the stored `right`/`bottom` values to compute popup position:
- `right: position.right + 80` (to the right of the button)
- `bottom: position.bottom` (aligned with button)
- If `position.right < 200`, open to the right; if `position.right > viewportWidth - 200`, open to the left

## Validation Steps

1. **Widget starts at right: 24px, bottom: 24px** — verify default position
2. **Dragging works on desktop and mobile** — test with mouse and touch
3. **Widget stays within viewport** — drag to edges, verify clamping
4. **Widget snaps to nearest edge on release** — drag to left side, release, verify snap
5. **Position persists across reloads** — drag, reload, verify position
6. **Click toggles popup** — click widget, verify popup opens/closes
7. **Drag does not open popup** — drag the widget, verify popup stays closed
8. **Clicking menu items navigates** — select Customer Mode, verify `navigate('/')`; select Staff Mode, verify `navigate('/staff/login')`
9. **No page refresh** — click widget, select mode, verify no reload
10. **No `window.location` or `location.reload()` calls** — grep the final file
11. **No custom `mousemove`/`touchmove` listeners** — grep the final file
12. **No infinite re-renders** — check that localStorage save only happens in `onDragEnd`
13. **Popup does not open while dragging** — rapid drag+click, verify popup stays closed

## Open Questions

- The `SVGLogo` component's default `handleClick` calls `window.location.href = '/'` — this is only triggered when no `onClick` prop is passed. In the new widget, the logo will be inside a `motion.div` (not a button), and the `onClick` will be on the outer container. The `SVGLogo` icon should NOT have its own `onClick` in the widget context. Need to ensure the logo's `onClick` prop is not passed, or that the outer container's click handler prevents the logo's default navigation.
