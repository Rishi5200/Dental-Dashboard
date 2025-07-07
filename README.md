# ENTNT Dental Center Management Dashboard (Frontend)

This project is a **frontend‑only** React application that simulates a Dental Center Management system
with **Admin (Dentist)** and **Patient** roles.  
All data is stored in **`localStorage`** – no backend or external APIs are used.

## ✨ Features

| Role | Capability |
|------|------------|
| Admin | • Login / logout<br/>• Manage patients (CRUD)<br/>• Manage incidents / appointments per patient<br/>• Calendar view of appointments<br/>• Dashboard KPIs |
| Patient | • Login / logout<br/>• View own info, upcoming appointments & history |

Other highlights:

* React 18 with **Vite** • functional components  
* **React Router v6** navigation & protected routes  
* Context API for **auth** & **data** state management  
* **MUI v5** for fast, responsive UI  
* Reusable dialogs / tables with basic form validation  
* Seeded sample data inserted on first load  
* No build‑time or run‑time dependencies beyond those declared in `package.json`.

## 🔧 Getting started locally

```bash
# 1. Install deps
npm install

# 2. Start dev server
npm run dev
```

The app will open at **http://localhost:5173**

### Hard‑coded credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@entnt.in` | `admin123` |
| Patient | `john@entnt.in` | `patient123` |

## 🗂️ Project structure

```
├── public/
├── src/
│   ├── context/               # Auth & Data providers
│   ├── components/            # Shared components (PrivateRoute…
│   ├── pages/                 # Route components
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

## 📦 Deployment

Because this is a pure static SPA built with Vite, you can deploy the **`dist/`** folder to
Vercel, Netlify, GitHub Pages or any static host:

```bash
npm run build
# upload dist/ folder
```

---

> **Note**  
> This implementation covers the core assignment requirements.  
> Feel free to enhance validation, add drag‑&‑drop file uploads, improve UX, or wire up a real backend later.  
> PRs are welcome!
