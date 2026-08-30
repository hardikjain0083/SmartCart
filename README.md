# SmartCart — Smart Shopping Cart Web App

A full-stack MERN application where customers can scan product barcodes using a live camera or upload barcode images to fetch product details and build a shopping cart. Includes a full Admin Portal for product management.

## Tech Stack
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Frontend**: React.js (Vite), Tailwind CSS
- **Auth**: JWT (Admin only)
- **Barcode Camera Scanning**: `html5-qrcode`
- **Barcode Image Decoding**: Python (`pyzbar` + `Pillow`)

---

## Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on port `27017`
- [Python 3](https://www.python.org/) with `pip`

---

## Setup & Installation

### 1. Install Python Dependencies
```bash
pip install pyzbar pillow
```

> **Windows Note**: `pyzbar` on Windows requires the [zbar DLL](https://sourceforge.net/projects/zbar/files/zbar/0.10/zbar-0.10-setup.exe/download). Install it first.

### 2. Setup the Backend
```bash
cd server
npm install
```

Copy `.env` (already included) or verify contents:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/smartcart
JWT_SECRET=smartcart_super_secret_jwt_key_2024
```

### 3. Seed the Database
Make sure MongoDB is running, then:
```bash
cd server
npm run seed
```

This inserts **5 demo products** and an **admin account**:
- Email: `admin@smartcart.com`
- Password: `password123`

Demo product barcodes you can test:
| Barcode        | Product               |
|----------------|-----------------------|
| 8901234567890  | Organic Apple Juice   |
| 8901234567891  | Whole Wheat Bread     |
| 8901234567892  | Almond Milk (1L)      |
| 8901234567893  | Dark Chocolate Bar    |
| 8901234567894  | Arabica Coffee Beans  |

### 4. Setup the Frontend
```bash
cd client
npm install
```

---

## Running the App

### Start the Backend Server
```bash
cd server
npm start
# Server runs on http://localhost:5000
```

### Start the Frontend Dev Server
```bash
cd client
npm run dev
# Client runs on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

---

## Pages & Routes

### Customer Interface
| Route   | Description                           |
|---------|---------------------------------------|
| `/`     | Live camera scanner + image upload    |
| `/cart` | Shopping cart with checkout           |

### Admin Portal
| Route                    | Description                    |
|--------------------------|--------------------------------|
| `/admin/login`           | Admin login                    |
| `/admin/dashboard`       | Stats overview                 |
| `/admin/products`        | Product list with search       |
| `/admin/products/new`    | Add a single product           |
| `/admin/products/bulk`   | Bulk import via CSV            |

---

## Testing the Scanner via Postman
Before connecting the frontend, test the critical endpoint:
```
GET http://localhost:5000/api/scan/8901234567890
```
Expected response: Full product object with name, price, stock, etc.

---

## How to Add Your First Product (via Admin)
1. Navigate to `http://localhost:5173/admin/login`
2. Login with `admin@smartcart.com` / `password123`
3. Go to **Add Product** in the sidebar
4. Fill in the barcode (this is the number the scanner will match against) and other fields
5. Hit **Save Product**
6. Go to the home page and scan that barcode!

---

## Bulk Upload CSV Format
Download the template from the Bulk Upload page, or use this format:
```csv
barcode,productName,brand,category,price,mrp,stock,aisleNumber
1234567890123,Product Name,Brand,Category,9.99,12.99,50,1A
```

---

## Folder Structure
```
/server
  /models        - Product.js, Cart.js, Admin.js
  /routes        - products.js, scan.js, cart.js, adminAuth.js
  /uploads       - Uploaded product images
  /python_scripts- decode.py (barcode image decoder)
  server.js
  seed.js
  .env

/client
  /src
    /components  - Scanner.jsx, AdminLayout.jsx
    /pages       - Home, Cart, AdminLogin, AdminDashboard, ProductList, AddProduct, BulkUpload
    /context     - CartContext.jsx
    App.jsx
```
