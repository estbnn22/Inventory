Simple CRUD inventory app to track products, stock levels, and low-stock alerts.  
Built with modern tooling so it’s easy to extend into a real-world business tool.

🔗 **Live demo:** https://inventory-one-eosin.vercel.app  

---

## Features

- 🧾 **Product management (CRUD)**
  - Create, read, update, and delete products
  - Store fields like name, SKU, quantity, price, and description

- 📉 **Stock tracking**
  - See current quantity for each product at a glance
  - Visual indicator for **low-stock items**

- ✏️ **Inline updates**
  - Edit product details from the UI without touching the database directly

- 🧹 **Clean, simple UI**
  - Built with modern React/Next.js patterns
  - Responsive layout that works on desktop and mobile

- 🗄️ **Real database**
  - Uses Prisma + PostgreSQL for actual persistent data (not just mock JSON)

---

## Tech Stack

- **Framework:** Next.js (App Router, TypeScript)
- **Database ORM:** Prisma
- **Database:** PostgreSQL
- **Styling:** Tailwind CSS (and utility-first styling)
- **Auth (optional / WIP):** Stack Auth
- **Deployment:** Vercel

- How It Works

Next.js App Router renders the UI and handles routing.

Forms / UI actions trigger server actions or API routes.

These actions use Prisma to read/write data in PostgreSQL:

Creating new products

Updating quantities

Deleting products

The UI re-renders with the latest data so you always see up-to-date stock levels.
