# Premium Tax Invoice Generator & Dashboard

Welcome to the **Premium Tax Invoice Generator** — a state-of-the-art, professionally polished, end-to-end invoice management application designed with a decoupled React SPA frontend and a fast native MongoDB Node.js backend.

## 🚀 Key Features

### 1. Architectural Restructuring
The project is strictly separated into modular, maintainable workspaces:
- `/frontend`: Responsive SPA built with **React**, **Vite**, **Lucide Icons**, and **Canvas Confetti**.
- `/backend`: Scalable API server powered by **Express.js** and the official **MongoDB Native Driver** (fully bypassed Mongoose for lightweight, direct driver speed).
- `/root`: Orchestrated run environment utilizing **Concurrently** to deploy both spaces with a single command.

### 2. Premium Design & Styling (Vanilla CSS)
- **Glassmorphic Components**: Sleek transparent sidebars, cards, and modal sheets styled with modern CSS variables, clean dropshadows, and backdrop filters.
- **Micro-Animations**: Butter-smooth transition curves on form field highlights, table row hovers, state controls, and dashboard analytics progress charts.
- **Inter & Outfit Typography**: Premium visual hierarchy leveraging curated Google Font typography instead of plain browser system defaults.
- **Custom Print Sheet Layout**: Clean `@media print` rules ensure beautiful, vector-quality, print-ready document exports and physical prints.

### 3. Advanced Indian GST Engine
- **Origin-Destination Checking**: Automatically calculates CGST (Central GST) and SGST (State GST) at standard half-rates for *Intra-State* supplies (where Supplier State matches the Client Place of Supply state).
- **IGST Calculations**: Automatically applies the full Integrated GST (IGST) rate for *Inter-State* supply cases.
- **Interactive Manual Override**: Switch to manual tax mode at any time using a slider toggle. Fades out standard calculators and applies your manual override values directly.

### 4. Interactive Financial Dashboard
- **Live Metrics Log**: View Total Invoices log size, Cumulative Lifetime Revenue, Collected Paid Amount, and outstanding Pending Amount in real-time.
- **Collection Progress Ratio**: Color-coded linear progress bars rendering ratio of Paid vs Unpaid receivables dynamically.
- **Saved Shop Profile Settings**: Save your customized default shop details (Name, Address, Email, Phone, GSTIN, Origin State, and Logo) to MongoDB. It auto-fills every new invoice!

---

## 🛠️ Installation & Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org) installed on your system.

### Quick Setup

1. **Bootstrap Workspace Dependencies**
   Run the following command in the **root** project directory to install dependencies for the workspace, frontend, and backend together:
   ```bash
   npm run install-all
   ```

2. **Start Dev Environments**
   Run the root development script:
   ```bash
   npm run dev
   ```
   This command starts the backend and frontend simultaneously:
   - **Backend API**: Listening on [http://localhost:5000](http://localhost:5000)
   - **Frontend App**: Listening on [http://localhost:3000](http://localhost:3000) (Proxied `/api` requests to backend).

---

## 📂 Project Directory Structure

```text
invoice-generator/
├── backend/                  # Node.js API Workspace
│   ├── db.js                 # MongoClient initialization
│   ├── server.js             # Express CRUD routes
│   └── .env                  # Port and MongoDB Connection string
├── frontend/                 # React SPA Workspace
│   ├── src/
│   │   ├── components/       # Custom visual components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── InvoiceForm.jsx
│   │   │   ├── InvoiceList.jsx
│   │   │   └── InvoicePreview.jsx
│   │   ├── styles/           # Modern styling engine
│   │   │   ├── variables.css
│   │   │   ├── index.css
│   │   │   └── App.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js        # Vite + Proxy configs
│   └── index.html
└── package.json              # Concurrently workflow scripts
```
