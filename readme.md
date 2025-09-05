# 📦 Inventory & Billing Management System

The **Inventory & Billing Management System** is a backend application built with **Node.js, Express, and MongoDB**.  
It helps small businesses manage **products, customers, vendors, transactions, and reports** efficiently.  

This project demonstrates **JWT-based authentication, session management, and CRUD operations** for essential business entities.  

---

## 🚀 Features

- 👤 **User Authentication** (Register, Login, Logout) with JWT & bcryptjs  
- 🛍️ **Product Management** (Add, Edit, Delete, Search, Stock Tracking)  
- 👥 **Customer & Vendor Management** (Unified schema for contacts with search functionality)  
- 💰 **Transaction Management** (Sales & Purchases, Auto stock updates, Total calculation)  
- 📊 **Reports** (Inventory stock levels, Transaction history with filters)  
- 🔑 **Role-based data ownership** – each business manages its own data  

---

## 📡 API Endpoints

### 🔑 Authentication
- `POST /api/auth/register` – Register new user  
- `POST /api/auth/login` – Login & get JWT  
- `GET /api/auth/logout` – Logout  

### 🛍️ Products
- `GET /api/products` – List products  
- `POST /api/products` – Add product  
- `PUT /api/products/:id` – Update product  
- `DELETE /api/products/:id` – Delete product  

### 👥 Customers/Vendors
- `GET /api/contacts` – List customers/vendors  
- `POST /api/contacts` – Add customer/vendor  
- `PUT /api/contacts/:id` – Update customer/vendor  
- `DELETE /api/contacts/:id` – Delete customer/vendor  

### 💰 Transactions
- `GET /api/transactions` – List transactions  
- `POST /api/transactions` – Record transaction  

### 📊 Reports
- `GET /api/reports/inventory` – Inventory report  
- `GET /api/reports/transactions` – Transaction report  

---

## 🛠️ Tech Stack

**Backend:**  
- Node.js  
- Express.js  

**Database:**  
- MongoDB (Mongoose ODM)  

**Authentication & Security:**  
- JWT (jsonwebtoken)  
- bcryptjs (Password hashing)  

**Middleware & Validation:**  
- express-validator  
- cookie-parser  
- cors  

---

## 📁 Project Structure

```bash
backend/
├── server.js
├── .env
├── package.json
├── src/
│   ├── models/
│   │   ├── user.model.js
│   │   ├── product.model.js
│   │   ├── contact.model.js
│   │   └── transaction.model.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   ├── contact.controller.js
│   │   ├── transaction.controller.js
│   │   └── report.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   └── routes/
│       ├── auth.routes.js
│       ├── product.routes.js
│       ├── contact.routes.js
│       ├── transaction.routes.js
│       └── report.routes.js
