# Flipkart Clone — Full Stack E-Commerce App
link : https://flipkart-clone-tawny.vercel.app/

A full-stack e-commerce application inspired by Flipkart.

## Tech Stack

| Layer     | Technology          |
|-----------|---------------------|
| Frontend  | React (Vite)        |
| Backend   | Node.js + Express   |
| Database  | MySQL (railways)              |

## Project Structure

```
scaler-flipkart-clone/
├── frontend/          # React (Vite) app
└── backend/           # Node.js + Express API
```

## Getting Started

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (`backend/.env`)
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=flipkart_clone
JWT_SECRET=your_jwt_secret
```

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:5000/api
```

## Features
- User authentication (register/login)
- Product listing with search and filters
- Product detail page
- Add to cart / remove from cart
- Order placement

