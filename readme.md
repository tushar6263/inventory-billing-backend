# 📦 Backend for Inventory & Billing Management System

A simple backend system built with **Node.js, Express, and MongoDB** to help small businesses manage **products, customers, vendors, transactions, and reports**.

This project demonstrates **JWT-based authentication, role-based data ownership, and CRUD operations** for core business entities.

---

## 🚀 Features

### 🔑 User Authentication
- Register & login with **email/username + password**
- **JWT-based authentication** with session management
- Each business manages its **own isolated data**

### 🛒 Product Management
- Add, edit, delete, and list products  
- Schema includes:
```json
{ "name": "", "description": "", "price": 0, "stock": 0, "category": "", "businessId": "" }
Stock tracking (increase/decrease)

Search products by name or category

👥 Customer & Vendor Management
Manage both customers & vendors in one schema

Schema includes:

json
Copy code
{ "name": "", "phone": "", "email": "", "address": "", "type": "customer|vendor", "businessId": "" }
CRUD operations + search functionality

💰 Transaction Management
Record sales (to customers) and purchases (from vendors)

Schema includes:

json
Copy code
{ "type": "sale|purchase", "customerId": "", "vendorId": "", "products": [{ "productId": "", "quantity": 0, "price": 0 }], "totalAmount": 0, "date": "", "businessId": "" }
Automatically updates product stock

Calculates transaction totals

📊 Reports
Inventory report with stock levels

Transaction history with filters (date, type, customer/vendor)

📡 API Endpoints
Authentication
POST /api/auth/register – Register new user

POST /api/auth/login – Login and get JWT

GET /api/auth/logout – Logout

Products
GET /api/products – List products

POST /api/products – Add product

PUT /api/products/:id – Update product

DELETE /api/products/:id – Delete product

Customers/Vendors
GET /api/contacts – List customers/vendors

POST /api/contacts – Add customer/vendor

PUT /api/contacts/:id – Update customer/vendor

DELETE /api/contacts/:id – Delete customer/vendor

Transactions
GET /api/transactions – List transactions

POST /api/transactions – Record transaction

Reports
GET /api/reports/inventory – Inventory report

GET /api/reports/transactions – Transaction report

🛠️ Tech Stack
Node.js + Express – Backend framework

MongoDB (Mongoose) – Database

JWT (jsonwebtoken) – Authentication

bcryptjs – Password hashing

express-validator – Input validation

cookie-parser + cors – Middleware

yaml
Copy code

---

👉 Do you want me to also add a **Setup & Installation** section (with `npm install`, `.env` config, and how to run server), so anyone cloning your repo can run it instantly?






Ask ChatGPT





ChatGPT can make m