# GENZCHIYA — Smart Tea Café

A contactless digital ordering system for table-side dining. Customers scan a QR code, browse the menu, customize orders, and pay online or via cash. Staff manage orders, menu, and sales from a unified dashboard.

---

## Features

- **QR-based table ordering** — each table has a scannable QR code
- **Digital menu** with categories, search, and favorites
- **Customizable products** (sugar, milk, add-ons)
- **Cart & checkout** with promo codes
- **Multiple payment methods** — Khalti, eSewa, Cash
- **Order tracking** for customers and kitchen
- **Staff dashboard** — Cashier Focus, Split Screen, Kitchen Focus
- **Menu editor** with categories, bulk actions, and image management
- **Sales reports** with charts and CSV export
- **Promo code manager**
- **Table QR generator** with printable layout

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Charts | Recharts |
| PDF | jsPDF + html2canvas |
| QR | qrcode |
| Routing | React Router v7 |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

App starts at `http://localhost:5173`

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

---

## Project Structure

```
src/
  components/     # Reusable UI (SVGLogo, PaymentLogo, PaymentModal, ReceiptPDF)
  context/        # AppContext (global state, localStorage persistence)
  data/           # products.ts, coupons.ts
  pages/          # LandingPage, MenuPage, HistoryPage, SplitDashboard, etc.
  types/          # TypeScript interfaces (Order, Product, Coupon, PaymentDetails)
  utils/          # PDF receipt generation
public/
  images/         # Product images, logo
```

---

## Payment Methods — Configuration

Payment is handled in `src/pages/MenuPage.tsx` and `src/components/PaymentModal.tsx`. The app supports three methods:

| Method | Key | Status |
|--------|-----|--------|
| Khalti | `khalti` | Simulated / needs live credentials |
| eSewa | `esewa` | Simulated / needs live credentials |
| Cash | `cash` | Always available |

### Environment Variables

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

| Variable | Purpose |
|----------|---------|
| `VITE_KHALTI_MERCHANT_ID` | Public merchant identifier for Khalti |
| `VITE_KHALTI_SECRET_KEY` | **Private** — used only in backend verification |
| `VITE_KHALTI_VERIFY_URL` | Khalti verification endpoint |
| `VITE_ESEWA_MERCHANT_ID` | Public merchant identifier for eSewa |
| `VITE_ESEWA_SECRET_KEY` | **Private** — used only in backend verification |
| `VITE_ESEWA_VERIFY_URL` | eSewa verification endpoint |

> **Security:** `.env.local` is gitignored. Never expose secret keys in frontend code or commit them to Git. Secret keys should only be used in a backend/verification proxy.

### Current Implementation

`src/components/PaymentModal.tsx` is a **frontend simulation** — it mimics the wallet flow (credentials → OTP → processing → success) with timeouts and a mock transaction ID. This is safe for demos and testing.

### Going Live

1. **Register** for Khalti and eSewa merchant accounts (see [Payment Setup](#payment-setup) below).
2. **Add a backend** (Vercel Serverless Function, Express, etc.) that:
   - Receives the payment verification request from the frontend
   - Calls the Khalti/eSewa verify endpoint with your **secret key** (server-side only)
   - Returns success/failure to the frontend
3. **Update `PaymentModal.tsx`** to call your backend verify endpoint instead of `setTimeout` simulation.
4. **Wire the verification result** to `placeOrder` in `src/context/AppContext.tsx` — only mark `payment.status = 'success'` after server-side confirmation.

### Merchant Registration

- **Khalti:** `https://merchant.khalti.com` — register business, submit documents, wait approval (2–5 days).
- **eSewa:** `https://merchant.esewa.com.np` — same process.

After approval you receive **Merchant ID** and **Secret Key**. Put them in `.env.local`.

---

## Important Notes

### localStorage Keys

| Key | Purpose |
|-----|---------|
| `gc_products` | Cached product list |
| `gc_categories` | Category order |
| `gc_orders` | All orders (customer + mock) |
| `gc_cart` | Current cart |
| `gc_active_table` | Currently selected table (not persisted across sessions) |
| `gc_active_coupon` | Applied coupon |
| `gc_coupons` | Available promo codes |
| `gc_favorites` | Favorited product IDs |
| `gc_user_role` | Staff role (`customer`, `cashier`, `kitchen`) |
| `gc_theme` | `dark` or `light` |
| `gc_qr_base_url` | QR destination URL |
| `gc_tracking_order` | Currently tracked order |
| `gc_profile_name` | Customer profile name |
| `gc_profile_phone` | Customer phone |
| `gc_profile_email` | Customer email |
| `gc_menu_version` | Menu migration version |
| `gc_demo_switcher_pos` | Demo bubble position |

### Order Statuses

```
pending → accepted → preparing → ready → served → completed
                          ↓
                      rejected
```

### Product Categories

Default categories: `tea`, `coffee`, `cold-drinks`. Staff can add/rename/delete categories via the Menu Editor.

### Demo Data

On first load, 20 mock orders are generated and stored in `gc_orders`. These simulate 9 AM–8 PM sales over the last 30 days for dashboard charts.

### Resetting Data

Click **RefreshCw** (Reset System DB) in the dashboard header to clear all localStorage and regenerate mock data.

---

## Staff Roles

| Role | Access |
|------|--------|
| Cashier | Accept/reject orders, mark ready/served, edit menu, view reports |
| Kitchen | View preparing/ready tickets, mark ready |
| Customer | Browse menu, order, track, view history |

Staff login is simulated via `gc_user_role`. The **DemoSwitcher** bubble (visible on non-home pages) lets you switch between Cashier and Kitchen views during development.

---

## Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel login
vercel
```

The `vercel.json` rewrites all routes to `/index.html` (SPA fallback).

### Environment Variables

No `.env` is required for the demo. For production payments, add:

```
KHALTI_MERCHANT_ID=
KHALTI_SECRET_KEY=
ESEWA_MERCHANT_ID=
ESEWA_SECRET_KEY=
```

---

## Known Limitations

- Payment is a frontend simulation (no real gateway integration yet).
- Orders are stored in `localStorage` only — not synced to a backend.
- QR codes work on the same local network; set `gc_qr_base_url` to your LAN IP for real-device scanning.
- Customer identity is per-session (table-based), not per-user account.

---

## License

Private — GENZCHIYA Smart Dining. All rights reserved.
