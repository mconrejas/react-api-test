Full-stack project using **Vite (React) + Express + TypeScript**  

## **Project Setup**

### **Prerequisites**
Ensure you have the following installed:
- **Node.js** (`>= 16.x.x`)
- **yarn** (`>= 1.x.x`)

---

## **Getting Started**

### **1. Clone the Repository**
```sh
git clone https://github.com/mconrejas/react-api-test.git
cd react-api-test
```

### **2️. Install Dependencies**
```sh
yarn install
```

---

## **Available Scripts**

### **Development Mode (Auto-restarts on changes)**
```sh
yarn dev
```
- Runs the **Express server** with **Nodemon**
- Watches `/src/server` for changes & restarts automatically.

---

### **Start Production Server**
```sh
yarn start
```
- Runs the **Express server** in **production mode**.
- Uses `cross-env` to set `NODE_ENV=production`.

---

### **Build Frontend (Vite)**
```sh
yarn build
```
- Builds the **React frontend** using **Vite**.
- Outputs files to `/dist`.

---

## **Project Structure**
```
react-api-test
├── src
│   ├── client         # Frontend (React + Vite)
│   ├── server         # Backend (Express + TypeScript)
│   ├── public         # Static assets (uploads, images, etc.)
│   ├── types          # TypeScript types
│   └── tests          # Unit & Integration tests
├── package.json       # Dependencies & scripts
├── tsconfig.json      # TypeScript configuration
├── vite.config.ts     # Vite configuration
└── README.md          # Documentation
```
---

## **Tech Stack**
- **Frontend:** Vite + React + TypeScript
- **Backend:** Express + TypeScript
- **Styling:** TailwindCSS / SCSS
- **State Management:** Redux Toolkit
- **Validation:** Zod
- **Database (Mocked):** In-memory array (Replace with DB)
- **Testing:** Vitest + React Testing Library

---

## **Running Tests**
```sh
npx vitest
```
- Runs all unit & integration tests.
- Ensure `supertest` is installed for API testing.