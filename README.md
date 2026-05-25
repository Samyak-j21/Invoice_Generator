# Premium Tax Invoice Generator & Dashboard

Welcome to the **Premium Tax Invoice Generator** — a classy, high-fidelity, end-to-end invoice management application designed with a clean light-neutral theme (Notion/Stripe-inspired). 

This project features a fully decoupled architecture with a modern React SPA frontend and a lightning-fast, self-contained JSON-file database backend, requiring zero external database setup!

---

## 🎨 Design Philosophy: Classy & Clean Light Mode
- **Stripe & Notion Aesthetics**: Minimal slates, crisp white cards, clean borders, and soft shadows provide a professional SaaS experience.
- **High Readability**: Leverages carefully curated Google Fonts (Outfit for branding/headings and Inter for content) with high-contrast text ratios.
- **No Clumsy Overlays**: Every component, input alignment, and action layout is structured to be immediately intuitive and simple to use.

---

## 🏗️ Simplified Architecture Layout

```text
┌────────────────────────────────────────────────────────┐
│                      FRONTEND                          │
│        React SPA (Vite) + Classy Vanilla CSS           │
└──────────────────────────┬─────────────────────────────┘
                           │
                           │ REST API (JSON)
                           ▼
┌────────────────────────────────────────────────────────┐
│                      BACKEND                           │
│        Express.js Server (Node) running locally        │
└──────────────────────────┬─────────────────────────────┘
                           │
                           │ File Sync
                           ▼
┌────────────────────────────────────────────────────────┐
│                   LOCAL DATABASE                       │
│        Self-contained JSON Storage Folder              │
│       ├─ invoices.json (All Invoices)                  │
│       └─ profile.json  (Your Shop Settings)            │
└────────────────────────────────────────────────────────┘
```

---

## 📖 Step-by-Step Beginner Workflow

Using this invoice generator is incredibly straightforward, even if you have no accounting or technical experience:

### Step 1: Set Up Your Shop Profile (One-Time Setup)
1. Launch the application in your browser.
2. Click **Settings** in the bottom left corner of the navigation sidebar.
3. Fill in your business details:
   - **Shop/Company Name**: e.g., *Cloth Emporium*
   - **Phone & Email**: Your customer contact details.
   - **Billing Address**: Your physical shop location.
   - **GSTIN**: Your 15-digit Tax Identification Number.
   - **Default Shop State**: The state where your business operates (Origin of Supply).
4. Click **Save Settings**.
   *This profile will persist in your local database and automatically pre-fill every invoice you write from now on!*

### Step 2: Create a New Invoice
1. Click **Create Invoice** in the sidebar.
2. Enter your **Client / Customer** details: Name, Address, and **Place of Supply (State)**.
3. In the **Line Items** table, enter the items sold:
   - Type the **Description** and **HSN/SAC** code.
   - Enter **Quantity** and **Unit Price**.
   - Click **Add Line Item** if you sold multiple items.
4. **GST Calculation Engine (Automated)**:
   - The system automatically detects the tax rules. If your Client State matches your Shop State, it splits the tax into **CGST** and **SGST** (each at half-rate).
   - If the states are different, it applies the full rate under **IGST**.
   - You can change the tax rate preset (e.g. `5%`, `12%`, `18%`, `28%`) at any time.
5. **Manual Override**: If you need to charge a special custom tax amount, toggle the **Enable Manual Tax Override** slider and type in your exact tax amount (₹) manually.
6. Select the **Payment Status** (Paid or Pending) and payment method.
7. Click **Save Invoice**!

### Step 3: Manage Your Saved Invoices
1. Go to the **Invoices Log** tab to view your saved logs.
2. Use the **Search bar** to instantly locate invoices by Client Name or Invoice Number.
3. Use the **Filter dropdown** to view only *Paid* or *Pending* invoices.
4. **Action Triggers**:
   - **Preview (Eye Icon)**: Opens a premium, ready-to-print view of your tax invoice.
   - **Edit (Pencil Icon)**: Reloads the invoice back into the creator form to make quick edits.
   - **Delete (Trash Icon)**: Removes the invoice from your database permanently.

### Step 4: Print or Save as PDF
1. Locate your invoice in the **Invoices Log** and click the **Preview (Eye)** button.
2. Click **Print / Save to PDF** at the top.
3. In the browser print dialog that opens:
   - **To Save as PDF**: Set your destination printer to **"Save as PDF"** and click Save.
   - **To Print**: Select your office printer and click Print.
   *The page's print styles will automatically hide the dashboard sidebar and action buttons, giving you a pixel-perfect, clean, physical tax invoice!*

---

## 🛠️ Quick Installation Guide

### Prerequisites
Make sure you have [Node.js](https://nodejs.org) installed on your system.

### Quick Commands

1. **Bootstrap Dependencies**
   Run the following command in the **root** folder to install all required packages:
   ```bash
   npm run install-all
   ```

2. **Start the Application**
   Run the root development command:
   ```bash
   npm run dev
   ```
   Open **[http://localhost:3000](http://localhost:3000)** in your browser to start writing professional invoices!
