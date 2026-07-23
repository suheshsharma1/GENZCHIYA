// GenZ Chiya – Viva PPT Generator
// Run: node generate_ppt.cjs
// Output: viva_presentation.pptx

const PptxGenJS = require('pptxgenjs');
const pptx = new PptxGenJS();

// ─── Brand Colors ───────────────────────────────────────────────────────────
const EMERALD = '1B3B2B';
const AMBER   = 'D4A373';
const CREAM   = 'FAF7F2';
const DARK    = '2D3A34';
const WHITE   = 'FFFFFF';
const LIGHT   = 'E8F0EC';

// ─── Helper: Title Slide ────────────────────────────────────────────────────
function addTitleSlide(title, subtitle) {
  const slide = pptx.addSlide();
  slide.background = { color: EMERALD };

  slide.addText(title, {
    x: 0.4, y: 1.5, w: 9.2, h: 1.6,
    fontSize: 36, bold: true, color: WHITE,
    fontFace: 'Georgia', align: 'center', wrap: true
  });

  slide.addText(subtitle, {
    x: 0.4, y: 3.4, w: 9.2, h: 0.8,
    fontSize: 18, color: AMBER,
    fontFace: 'Calibri', align: 'center', wrap: true
  });

  slide.addText('GenZ Chiya – Smart Tea Café Ordering System', {
    x: 0.4, y: 4.5, w: 9.2, h: 0.5,
    fontSize: 13, color: LIGHT, align: 'center', italic: true
  });
}

// ─── Helper: Section Heading Slide ──────────────────────────────────────────
function addSectionSlide(number, title) {
  const slide = pptx.addSlide();
  slide.background = { color: AMBER };

  slide.addText(`Section ${number}`, {
    x: 0.4, y: 2.0, w: 9.2, h: 0.6,
    fontSize: 16, bold: true, color: EMERALD, align: 'center'
  });
  slide.addText(title, {
    x: 0.4, y: 2.7, w: 9.2, h: 1.0,
    fontSize: 30, bold: true, color: WHITE,
    fontFace: 'Georgia', align: 'center', wrap: true
  });
}

// ─── Helper: Content Slide ──────────────────────────────────────────────────
function addContentSlide(heading, bullets) {
  const slide = pptx.addSlide();
  slide.background = { color: CREAM };

  // Heading bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 1.0, fill: { color: EMERALD }
  });
  slide.addText(heading, {
    x: 0.3, y: 0.1, w: 9.4, h: 0.8,
    fontSize: 20, bold: true, color: WHITE, fontFace: 'Georgia', valign: 'middle'
  });

  // Bullet items
  const items = bullets.map(b => ({
    text: b,
    options: { fontSize: 15, color: DARK, bullet: { indent: 20 }, breakLine: true, paraSpaceAfter: 4 }
  }));

  slide.addText(items, {
    x: 0.4, y: 1.15, w: 9.2, h: 5.2, valign: 'top', wrap: true
  });
}

// ─── Helper: Two-Column Slide ───────────────────────────────────────────────
function addTwoColSlide(heading, leftTitle, leftItems, rightTitle, rightItems) {
  const slide = pptx.addSlide();
  slide.background = { color: CREAM };

  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 1.0, fill: { color: EMERALD }
  });
  slide.addText(heading, {
    x: 0.3, y: 0.1, w: 9.4, h: 0.8,
    fontSize: 20, bold: true, color: WHITE, fontFace: 'Georgia', valign: 'middle'
  });

  // Left column
  slide.addText(leftTitle, {
    x: 0.3, y: 1.15, w: 4.4, h: 0.45,
    fontSize: 13, bold: true, color: EMERALD
  });
  slide.addText(leftItems.map(b => ({ text: b, options: { fontSize: 13, color: DARK, bullet: { indent: 15 }, breakLine: true, paraSpaceAfter: 4 } })), {
    x: 0.3, y: 1.65, w: 4.4, h: 4.7, valign: 'top', wrap: true
  });

  // Divider
  slide.addShape(pptx.ShapeType.line, {
    x: 4.95, y: 1.1, w: 0, h: 5.3,
    line: { color: AMBER, width: 1.5 }
  });

  // Right column
  slide.addText(rightTitle, {
    x: 5.2, y: 1.15, w: 4.4, h: 0.45,
    fontSize: 13, bold: true, color: EMERALD
  });
  slide.addText(rightItems.map(b => ({ text: b, options: { fontSize: 13, color: DARK, bullet: { indent: 15 }, breakLine: true, paraSpaceAfter: 4 } })), {
    x: 5.2, y: 1.65, w: 4.4, h: 4.7, valign: 'top', wrap: true
  });
}

// ─── Helper: Q&A Slide ──────────────────────────────────────────────────────
function addQASlide(question, answer) {
  const slide = pptx.addSlide();
  slide.background = { color: CREAM };

  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 1.0, fill: { color: EMERALD }
  });
  slide.addText('Viva Q&A', {
    x: 0.3, y: 0.1, w: 9.4, h: 0.8,
    fontSize: 20, bold: true, color: WHITE, fontFace: 'Georgia', valign: 'middle'
  });

  slide.addText('Q: ' + question, {
    x: 0.4, y: 1.1, w: 9.2, h: 0.9,
    fontSize: 16, bold: true, color: EMERALD, wrap: true
  });

  slide.addShape(pptx.ShapeType.rect, {
    x: 0.3, y: 2.1, w: 9.4, h: 3.7,
    fill: { color: 'EEF5F1' },
    line: { color: AMBER, width: 1 }
  });

  slide.addText('A: ' + answer, {
    x: 0.5, y: 2.25, w: 9.0, h: 3.4,
    fontSize: 14, color: DARK, wrap: true, valign: 'top'
  });
}

// ─── Helper: Code Slide ─────────────────────────────────────────────────────
function addCodeSlide(heading, label, code, explanation) {
  const slide = pptx.addSlide();
  slide.background = { color: CREAM };

  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 1.0, fill: { color: EMERALD } });
  slide.addText(heading, {
    x: 0.3, y: 0.1, w: 9.4, h: 0.8,
    fontSize: 20, bold: true, color: WHITE, fontFace: 'Georgia', valign: 'middle'
  });

  slide.addText(label, {
    x: 0.4, y: 1.1, w: 9.2, h: 0.4,
    fontSize: 13, bold: true, color: AMBER
  });

  slide.addShape(pptx.ShapeType.rect, {
    x: 0.3, y: 1.55, w: 9.4, h: 2.0,
    fill: { color: '1A2420' }, line: { color: '2D3A34' }
  });
  slide.addText(code, {
    x: 0.4, y: 1.6, w: 9.2, h: 1.85,
    fontSize: 11, color: '86EFAC', fontFace: 'Courier New', valign: 'top', wrap: true
  });

  slide.addText('📝  ' + explanation, {
    x: 0.4, y: 3.65, w: 9.2, h: 2.5,
    fontSize: 13, color: DARK, wrap: true, valign: 'top'
  });
}

// ═══════════════════════════════════════════════════════════════════════════
//                         SLIDE GENERATION
// ═══════════════════════════════════════════════════════════════════════════

// SLIDE 1 – Title
addTitleSlide(
  '☕  GenZ Chiya\nViva Presentation',
  'BCA 7th Semester | Frontend Module'
);

// SLIDE 2 – My Responsibilities
addContentSlide('My Responsibilities in This Project', [
  '1.  Menu Management — built the customer-facing digital catalog',
  '2.  UI/UX Design — color system, dark/light mode, modals, layouts',
  '3.  Product Images — photo loading, hover zoom, aspect-ratio layout',
  '4.  Category Management — create / rename / delete / filter categories',
  '5.  Availability Status — In Stock vs Out of Stock badge logic',
  '6.  Responsive Design — mobile → tablet → desktop using Tailwind CSS',
  '7.  UI Animations — Framer Motion transitions, toasts, slide-drawers',
  '8.  UI Testing — layout tests, interaction tests, dark-mode checks',
]);

// SLIDE 3 – Section: Data Layer
addSectionSlide('1', 'Data Layer & TypeScript Types');

// SLIDE 4 – products.ts
addContentSlide('File: src/data/products.ts', [
  'Why it exists: Stores the static café menu — all teas, coffees, cold drinks.',
  'Exports two things:',
  '   • products[ ] — array of 20 drink objects (id, name, price, category, image, available…)',
  '   • CATEGORY_MAP — maps code → label e.g. "tea" → "Tea"',
  'Each product has an image field pointing to /images/products/ folder.',
  'The available: true/false flag controls whether the item can be ordered.',
  'Customization presets (teaCustomizations, coffeeCustomizations) define sugar levels, milk types, and add-ons.',
]);

// SLIDE 5 – types/index.ts
addContentSlide('File: src/types/index.ts — TypeScript Interfaces', [
  'Why it exists: Enforces data shapes at compile time (TypeScript safety).',
  '',
  'interface Product {',
  '   id: string          — unique product code e.g. "tea-01"',
  '   name: string        — display name e.g. "Milk Tea"',
  '   price: number       — price in Rs.',
  '   category: string    — e.g. "tea", "coffee", "cold-drinks"',
  '   image: string       — path to photo e.g. /images/products/Milk Tea.jpg',
  '   available: boolean  — IN STOCK = true, OUT OF STOCK = false',
  '   featured?: boolean  — optional highlight flag',
  '}',
]);

// SLIDE 6 – Section: Global State
addSectionSlide('2', 'Global State Management — AppContext');

// SLIDE 7 – AppContext.tsx
addContentSlide('File: src/context/AppContext.tsx — Key Functions', [
  'Uses React Context API + useState to share data across all pages.',
  '',
  'toggleProductAvailability(productId)',
  '   → Flips available flag: true → false or false → true',
  '   → One click marks item as Sold Out everywhere instantly',
  '',
  'addCategory(name) → Creates a new category; prevents duplicates',
  'renameCategory(old, new) → Updates category name in all products',
  'deleteCategory(name) → Removes the category AND its products',
  'updateProductImage(productId, imageUrl) → Changes a product\'s photo',
  'All data is saved to localStorage so it persists after page refresh.',
]);

// SLIDE 8 – Section: Menu Page
addSectionSlide('3', 'Menu Management — MenuPage.tsx');

// SLIDE 9 – MenuPage Overview
addContentSlide('File: src/pages/MenuPage.tsx — Overview', [
  'This is the MAIN customer-facing page. My most important file.',
  '',
  'What it renders:',
  '   1. Sticky header with logo, table badge, dark mode toggle',
  '   2. Live search bar with instant filter results',
  '   3. Horizontal category filter pills',
  '   4. Responsive product card grid (2 / 3 / 4 columns)',
  '   5. Customization modal popup (milk, sugar, add-ons)',
  '   6. Floating cart button with slide-out mini-cart',
  '   7. Full cart drawer panel',
  '   8. Checkout form + payment method selection',
]);

// SLIDE 10 – Category Filtering Code
addCodeSlide(
  'Category Filtering Logic',
  'MenuPage.tsx – Lines 88–95',
  `const filteredProducts = useMemo(() => {
  return products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
}, [products, searchQuery, selectedCategory]);`,
  'useMemo recalculates only when products, searchQuery, or selectedCategory changes — this keeps the filter fast. Both the search text AND the selected category tab are applied together at the same time.'
);

// SLIDE 11 – Section: Images & Availability
addSectionSlide('4', 'Product Images & Availability Status');

// SLIDE 12 – Product Images
addContentSlide('How Product Images Are Managed', [
  'Images are stored in: public/images/products/',
  'We have 17 product photos: Milk Tea.jpg, Black Coffee.jpg, etc.',
  '',
  'In products.ts, each item has an image field:',
  '   image: "/images/products/Milk Tea.jpg"',
  '',
  'In the product card (MenuPage.tsx):',
  '   • Container uses aspect-square (1:1 ratio) so all cards are same height',
  '   • object-cover crops and fills the box without stretching',
  '   • On hover: scale-105 with transition-transform duration-500 → smooth zoom',
  '',
  'If no image exists, the admin panel shows "No Image" placeholder.',
]);

// SLIDE 13 – Availability Code
addCodeSlide(
  'Out of Stock Implementation',
  'MenuPage.tsx – Availability overlay + button disable',
  `{!product.available && (
  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]
                  flex items-center justify-center">
    <span className="bg-red-600 text-white font-bold text-xs
                     uppercase px-3 py-1 rounded-md tracking-wider">
      Sold Out
    </span>
  </div>
)}

{product.available ? (
  <button onClick={() => handleOpenCustomizations(product)}>Add</button>
) : (
  <span>Unavailable</span>
)}`,
  'When available = false: a dark blurred overlay covers the image, showing "Sold Out". The Add button is completely replaced by the word "Unavailable" — customers cannot add it to the cart.'
);

// SLIDE 14 – Section: Responsive Design
addSectionSlide('5', 'Responsive Design with Tailwind CSS');

// SLIDE 15 – Responsive Design
addTwoColSlide(
  'Responsive Design — How It Works',
  '📱 Mobile (default)',
  [
    'grid-cols-2 → 2 product columns',
    'max-w-xl → narrow container',
    'Drawer fills full screen width',
    'Mini-cart collapses on small screens',
    'Search bar takes full width',
    'Category pills scroll horizontally',
  ],
  '🖥️ Tablet / Desktop (md: lg:)',
  [
    'md:grid-cols-3 → 3 columns on tablet',
    'lg:grid-cols-4 → 4 columns on desktop',
    'max-w-7xl → wider container',
    'Modals centered with max-w-md',
    'Admin splits into two panels side by side',
    'sm:items-center → horizontal toolbar layout',
  ]
);

// SLIDE 16 – Section: Animations
addSectionSlide('6', 'UI Animations with Framer Motion');

// SLIDE 17 – Animations
addContentSlide('Animations Using Framer Motion', [
  'Library used: framer-motion (installed via npm)',
  '',
  '1. Cart Drawer — Slides in from the right side:',
  '   initial={{ x: "100%" }} → animate={{ x: 0 }}',
  '   transition={{ type: "spring", damping: 25, stiffness: 220 }}',
  '',
  '2. Customization Modal — Slides up from bottom:',
  '   initial={{ y: "100%", opacity: 0 }} → animate={{ y: 0, opacity: 1 }}',
  '',
  '3. Toast Notification — Fades up from bottom:',
  '   "Milk Tea added to cart" message auto-dismisses after 2.6 seconds',
  '',
  '4. Product Card layout animation with motion.div layout prop — cards reorder smoothly when switching categories.',
  '',
  '5. Floating Cart Button — Slides in from right on page load.',
]);

// SLIDE 18 – Animations Code
addCodeSlide(
  'Cart Drawer Animation — Code Example',
  'MenuPage.tsx – Spring slide-over animation',
  `<motion.div
  initial={{ x: '100%' }}
  animate={{ x: 0 }}
  exit={{ x: '100%' }}
  transition={{ type: 'spring', damping: 25, stiffness: 220 }}
  className="w-screen max-w-md bg-white flex flex-col shadow-2xl"
>
  {/* Cart contents */}
</motion.div>`,
  'initial sets starting position (off-screen right). animate is the final position. exit runs when the drawer closes. The spring type creates a natural elastic feel. AnimatePresence wrapper is needed so exit animations play when component unmounts.'
);

// SLIDE 19 – Section: Category Management Admin
addSectionSlide('7', 'Category Management (Admin Dashboard)');

// SLIDE 20 – Category Management
addContentSlide('How Category Management Works', [
  'Located in: Admin Dashboard → Menu Tab (SplitDashboard.tsx)',
  '',
  'Admin Actions Available:',
  '   ✅  Add Category — type a new name, click Create',
  '   ✏️  Rename Category — changes name in all products automatically',
  '   🗑️  Delete Category — removes category AND all its products',
  '   📦  Move Products — bulk-move items to a different category',
  '   🔼  Collapse/Expand — fold category folder to save space',
  '',
  'Customer Side (MenuPage.tsx):',
  '   • Category pills are generated from CATEGORY_MAP',
  '   • Clicking a pill sets selectedCategory state',
  '   • filteredProducts useMemo re-runs instantly',
  '   • Shows "X items available" count below heading',
]);

// SLIDE 21 – Section: UI Testing
addSectionSlide('8', 'UI Testing Strategy');

// SLIDE 22 – Testing
addContentSlide('UI Testing Approach', [
  'No automated test framework (Jest/Cypress) was used for this project.',
  'Testing was done manually through systematic UI verification:',
  '',
  '✅  Functionality Tests:',
  '   • Add every product to cart, verify price calculation is correct',
  '   • Apply coupon codes and verify discount reflects in total',
  '   • Mark products Out of Stock → verify card shows overlay + button disabled',
  '   • Filter by each category → confirm correct products appear',
  '   • Search for product name → verify live filtering works',
  '',
  '✅  Responsiveness Tests:',
  '   • Resized browser from 320px mobile to 1920px desktop',
  '   • Tested on Chrome DevTools Device Emulation (iPhone, iPad, Desktop)',
  '',
  '✅  Visual Tests:',
  '   • Dark Mode / Light Mode toggle tested on every page',
  '   • Verified all images load correctly with correct aspect ratio',
  '   • Checked all animations run without layout shift or jank',
]);

// SLIDE 23 – Viva Q&A 1
addQASlide(
  'What was your responsibility in this project?',
  'I was responsible for the complete frontend catalog experience. I built the Menu Management system where customers browse and order drinks, handled Category Management in the admin dashboard, implemented the In-Stock/Out-of-Stock logic, managed product image loading, created all UI animations with Framer Motion, made the layout fully responsive using Tailwind CSS breakpoints, and performed manual UI testing across devices and browsers.'
);

// SLIDE 24 – Viva Q&A 2
addQASlide(
  'How does category filtering work in your code?',
  'We have a state variable called selectedCategory. When a customer clicks a category pill like "Tea", it sets selectedCategory = "tea". A useMemo hook then filters the products array — it keeps only products where product.category equals the selected value. The filtered list renders instantly without any page reload. If "All Items" is selected, no filter is applied and every product shows.'
);

// SLIDE 25 – Viva Q&A 3
addQASlide(
  'What happens when a product is Out of Stock?',
  'Each product has an available boolean field. When it is false, three things happen in the UI: (1) A dark semi-transparent overlay appears over the product image showing a red "Sold Out" badge. (2) The "Add" button is completely replaced by a grey "Unavailable" text — customers cannot click it. (3) In the admin panel, a red "Out" badge shows on the card. The admin can toggle this with one click using the toggleProductAvailability function.'
);

// SLIDE 26 – Viva Q&A 4
addQASlide(
  'How is the website responsive? What Tailwind classes did you use?',
  'We used Tailwind CSS mobile-first breakpoints. The product grid uses: grid-cols-2 md:grid-cols-3 lg:grid-cols-4 — this gives 2 columns on phones, 3 on tablets, 4 on desktops. The cart drawer uses max-w-md to stay compact. The admin dashboard uses flex-col on mobile but switches to side-by-side panels on lg: screens. Container widths use max-w-xl for customer pages and max-w-7xl for admin.'
);

// SLIDE 27 – Viva Q&A 5
addQASlide(
  'Which animations did you use and why?',
  'We used the Framer Motion library. The cart drawer slides in from the right using initial={{ x: "100%" }} and animate={{ x: 0 }} with a spring transition — this feels natural and smooth. The customization modal slides up from the bottom on mobile (like a native app). Success toast messages fade up and auto-dismiss after 2.6 seconds using AnimatePresence. Product cards animate layout changes when switching categories. These micro-interactions make the app feel premium and engaging.'
);

// SLIDE 28 – Improvements
addContentSlide('Future Improvements I Can Suggest', [
  '1.  WebP image format — convert JPGs to WebP for 30–50% smaller file sizes',
  '2.  Real-time availability — WebSocket updates so Out-of-Stock changes show instantly on customer phones without refreshing',
  '3.  Skeleton loading placeholders while product images are downloading',
  '4.  Automated testing with Playwright — write tests for add-to-cart, search, and checkout flows',
  '5.  Image upload to cloud — use Cloudinary or Firebase Storage instead of local files so images persist after redeployment',
  '6.  Drag-and-drop category reordering in admin panel',
  '7.  Pagination or infinite scroll for larger menus with 50+ items',
]);

// SLIDE 29 – React Concepts Used
addTwoColSlide(
  'React Concepts Used in My Module',
  'Core React',
  [
    'useState — track selected category, cart, modal state',
    'useEffect — sync URL table param, cleanup timers',
    'useMemo — filter products without re-running every render',
    'useRef — cart toast timer reference',
    'useContext — access global products, cart via useApp()',
    'Conditional Rendering — show Sold Out overlay when !available',
    'Array.map() — render product cards, category pills',
    'Props — pass product data into card components',
  ],
  'Tailwind & Libraries',
  [
    'framer-motion — AnimatePresence, motion.div',
    'lucide-react — icons (Search, Heart, ShoppingBag…)',
    'react-router-dom — navigate to /tracking/:orderId',
    'Tailwind dark: prefix — dark mode variants',
    'Tailwind grid — responsive column layout',
    'Tailwind aspect-square — uniform card images',
    'TypeScript — type-safe product/cart interfaces',
    'LocalStorage — data persistence across refreshes',
  ]
);

// SLIDE 30 – Closing Slide
{
  const slide = pptx.addSlide();
  slide.background = { color: EMERALD };
  slide.addText('Thank You! ☕', {
    x: 0.4, y: 1.8, w: 9.2, h: 1.0,
    fontSize: 36, bold: true, color: WHITE,
    fontFace: 'Georgia', align: 'center'
  });
  slide.addText('GenZ Chiya — Smart Tea Café Ordering System', {
    x: 0.4, y: 3.0, w: 9.2, h: 0.6,
    fontSize: 16, color: AMBER, align: 'center', italic: true
  });
  slide.addText('Ready for your questions!', {
    x: 0.4, y: 3.8, w: 9.2, h: 0.5,
    fontSize: 14, color: LIGHT, align: 'center'
  });
}

// ─── Save File ───────────────────────────────────────────────────────────────
const OUTPUT = 'C:/Users/suhes/.gemini/antigravity-ide/brain/919c2a76-5f74-40f1-bcc2-1c9b2816dec3/GenZChiya_Viva_Presentation.pptx';
pptx.writeFile({ fileName: OUTPUT })
  .then(() => console.log('✅  PPT saved to:', OUTPUT))
  .catch(err => { console.error('❌  Error:', err); process.exit(1); });
