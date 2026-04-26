# Flipkart Clone — Full Project Documentation

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack — What & Why](#2-tech-stack--what--why)
3. [Project Folder Structure](#3-project-folder-structure)
4. [Database Design (MySQL)](#4-database-design-mysql)
5. [Backend Architecture](#5-backend-architecture)
6. [Frontend Architecture](#6-frontend-architecture)
7. [How Everything Connects](#7-how-everything-connects)
8. [Key Features Explained](#8-key-features-explained)
9. [Deployment Architecture](#9-deployment-architecture)
10. [Interview Questions & Answers](#10-interview-questions--answers)

---

## 1. Project Overview

This is a full-stack e-commerce web application inspired by Flipkart. Users can browse products by category, search by name, add items to their cart, and place orders with a delivery address. The application supports user authentication (register/login) with JWT tokens.

**Core Flows:**
- Guest: Browse products, view product details
- Logged-in user: Add to cart, manage quantities, checkout, view orders

---

## 2. Tech Stack — What & Why

### Frontend

| Technology | Why Used |
|---|---|
| **React 18** | Component-based UI library. Makes it easy to build reusable pieces (ProductCard, Navbar, CartItem) and manage UI state efficiently using hooks. |
| **Vite** | Build tool that is significantly faster than Create React App. Hot Module Replacement (HMR) updates the browser instantly during development without a full refresh. |
| **React Router v6** | Enables client-side navigation between pages (Home, Cart, Checkout, Orders) without full page reloads, giving a Single Page Application experience. |
| **Axios** | HTTP client for making API calls to the backend. Chosen over `fetch` because it automatically parses JSON, handles request/response interceptors (used for attaching JWT tokens), and has cleaner error handling. |
| **Tailwind CSS** | Utility-first CSS framework. Allows writing styles directly in JSX without switching to CSS files, making responsive design faster using built-in breakpoint prefixes (`sm:`, `md:`). |
| **React Context API** | Used for global state (Auth and Cart) that needs to be accessible across many components without prop drilling. Chosen over Redux because the state is simple and doesn't need complex reducers. |

### Backend

| Technology | Why Used |
|---|---|
| **Node.js** | JavaScript runtime that allows running JS on the server. Non-blocking I/O makes it efficient for API servers handling many concurrent requests. |
| **Express.js** | Minimal and flexible web framework for Node.js. Used to define REST API routes and middleware cleanly. |
| **JWT (jsonwebtoken)** | JSON Web Tokens for stateless authentication. The server issues a token on login; the client sends it with every request. No session is stored on the server, making it scalable. |
| **bcryptjs** | Used to hash user passwords before storing in the database. Even if the database is compromised, plaintext passwords are never exposed. |
| **mysql2** | MySQL driver for Node.js. Used with `pool.promise()` for async/await based database queries and connection pooling (reuses connections instead of creating a new one per request). |
| **cors** | Middleware to allow the frontend (hosted on Vercel) to make requests to the backend (hosted on Render). Without this, browsers block cross-origin requests. |
| **dotenv** | Loads environment variables from a `.env` file into `process.env`. Keeps secrets (DB passwords, JWT secret) out of source code. |

### Database

| Technology | Why Used |
|---|---|
| **MySQL** | Relational database. The data in this project (users, products, cart items, orders) is structured and has clear relationships between tables, making a relational database the right choice. |
| **Railway** | Cloud-hosted MySQL. Provides a managed database with a public proxy endpoint, so both local development and Render (backend) can connect to the same database. |

### Deployment

| Service | What runs there | Why |
|---|---|---|
| **Vercel** | React frontend | Purpose-built for frontend frameworks. Automatic deployments from GitHub, global CDN, free tier. |
| **Render** | Express backend | Managed Node.js hosting with automatic deployments, environment variable management, free tier. |
| **Railway** | MySQL database | Managed MySQL with public networking, easy to set up, Railway variables map directly to connection config. |

---

## 3. Project Folder Structure

```
scaler-flipkart-clone/
│
├── backend/
│   ├── server.js                  # Entry point — Express app, middleware, routes
│   ├── config/
│   │   ├── db.js                  # MySQL connection pool (mysql2)
│   │   ├── env.js                 # Loads .env, validates required variables
│   │   └── migrations/            # SQL DDL files (table definitions)
│   │       ├── 001_users.sql
│   │       ├── 002_products.sql
│   │       ├── 003_cart.sql
│   │       └── 004_orders.sql
│   ├── models/                    # Database query functions (no raw SQL in controllers)
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── controllers/               # Business logic — reads request, calls model, sends response
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   └── orderController.js
│   ├── routes/                    # URL definitions — maps HTTP method + path to controller
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   └── orderRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT verification — protects private routes
│   ├── scripts/
│   │   ├── migrate.js             # Runs all SQL migration files
│   │   ├── seedProducts.js        # Inserts 20 sample products with images
│   │   └── resetProducts.js       # Truncates products + product_images tables
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── vercel.json                # Tells Vercel to serve index.html for all routes (React Router fix)
│   ├── vite.config.js             # Vite config — dev proxy /api → localhost:5000
│   ├── tailwind.config.js         # Tailwind custom colors (flipblue, fliporange, etc.)
│   └── src/
│       ├── main.jsx               # App entry — BrowserRouter > AuthProvider > CartProvider > App
│       ├── App.jsx                # Route definitions, lifts category state
│       ├── context/
│       │   ├── AuthContext.jsx    # isAuthenticated, user, login(), logout()
│       │   └── CartContext.jsx    # items, total, itemCount, addItem(), changeQuantity(), deleteItem()
│       ├── services/              # Axios API call functions (keeps components clean)
│       │   ├── api.js             # Axios instance with base URL + JWT interceptor
│       │   ├── authService.js
│       │   ├── productService.js
│       │   ├── cartService.js
│       │   └── orderService.js
│       ├── components/
│       │   ├── Navbar/            # Blue sticky nav, search, user dropdown, cart badge
│       │   ├── CategorySidebar/   # Horizontal category filter bar below navbar
│       │   ├── ProductCard/       # Product tile with Add to Cart / stepper
│       │   ├── CartItem/          # Single cart row with quantity controls
│       │   ├── ImageCarousel/     # Thumbnail strip + main image with zoom
│       │   ├── Loader/            # Spinner component
│       │   └── ProtectedRoute/    # Redirects to /login if not authenticated
│       └── pages/
│           ├── HomePage.jsx       # Product grid, search, category filter, pagination
│           ├── ProductDetailPage.jsx
│           ├── CartPage.jsx
│           ├── CheckoutPage.jsx   # Delivery address form + order summary
│           ├── OrderDetailPage.jsx
│           ├── OrdersPage.jsx
│           ├── LoginPage.jsx
│           └── RegisterPage.jsx
```

---

## 4. Database Design (MySQL)

### Tables and Relationships

```
users
  id (PK)
  name
  email (UNIQUE)
  password        ← bcrypt hashed, never stored as plaintext
  created_at

products
  id (PK)
  name
  description
  price           ← original MRP
  discount_price  ← selling price (nullable — no discount if NULL)
  category
  brand
  stock
  created_at

product_images
  id (PK)
  product_id (FK → products.id)   ← one product has many images
  image_url
  sort_order      ← controls display order (0 = primary image)

cart_items
  id (PK)
  user_id (FK → users.id)
  product_id (FK → products.id)
  quantity
  UNIQUE KEY (user_id, product_id)  ← prevents duplicate entries per user

orders
  id (PK)
  user_id (FK → users.id)
  total_amount
  status          ← ENUM: pending, confirmed, shipped, delivered, cancelled
  shipping_name
  shipping_phone
  shipping_address
  shipping_city
  shipping_pincode
  created_at

order_items
  id (PK)
  order_id (FK → orders.id)
  product_id (FK → products.id)
  product_name    ← snapshot of name at time of purchase
  brand           ← snapshot of brand
  price_at_purchase  ← snapshot of price — important: product price can change later
  quantity
  image           ← snapshot of primary image URL
```

### Why Snapshots in order_items?

When a user places an order, `price_at_purchase`, `product_name`, and `image` are copied from the products table. This is intentional — if the product's price changes in the future, past orders still show the correct price that was charged.

### Relationships Diagram

```
users ──────< cart_items >────── products
  │                                  │
  │                             product_images
  │
  └──────< orders ──────< order_items
```

---

## 5. Backend Architecture

### Pattern: MVC (Model-View-Controller)

The backend follows the MVC pattern, separating concerns:

```
HTTP Request
     │
     ▼
  Routes          (define URL + method → controller function)
     │
     ▼
Middleware         (authMiddleware.js — verifies JWT, sets req.user)
     │
     ▼
Controllers        (business logic — validate, call model, send response)
     │
     ▼
Models             (database queries — all SQL lives here)
     │
     ▼
MySQL (Railway)
```

### All API Endpoints

```
Auth
  POST   /api/auth/register     — create user (hash password, return token)
  POST   /api/auth/login        — verify email+password, return JWT
  GET    /api/auth/me           — return logged-in user info (protected)

Products
  GET    /api/products          — list products (search, category, page, limit params)
  GET    /api/products/:id      — single product with all images

Cart                            (all protected — require JWT)
  GET    /api/cart              — get user's cart items with product details
  POST   /api/cart              — add item (or return error if already exists)
  PUT    /api/cart/:id          — update quantity of a cart item
  DELETE /api/cart/:id          — remove a cart item

Orders                          (all protected — require JWT)
  POST   /api/orders            — place order (transaction: insert order + items + decrement stock + clear cart)
  GET    /api/orders            — list all orders for the logged-in user
  GET    /api/orders/:id        — single order details with items

Health
  GET    /api/health            — returns { status: "ok", db: "connected" }
```

### Authentication Flow

```
1. User registers → password hashed with bcrypt (10 salt rounds) → stored in DB
2. User logs in   → bcrypt.compare(input, hash) → if match, sign JWT with user id + secret
3. JWT returned   → frontend stores in localStorage
4. Protected request → client sends "Authorization: Bearer <token>"
5. authMiddleware → jwt.verify(token, secret) → sets req.user = { id, email }
6. Controller uses req.user.id to scope queries to that user's data
```

### Order Placement Transaction

Placing an order uses a MySQL transaction to ensure all-or-nothing execution:

```
BEGIN TRANSACTION
  1. INSERT into orders (get orderId)
  2. INSERT into order_items (for each cart item)
  3. UPDATE products SET stock = stock - quantity (for each item)
  4. DELETE from cart_items WHERE user_id = ?
COMMIT   ← only if all 4 steps succeed
ROLLBACK ← if any step fails, nothing is changed
```

---

## 6. Frontend Architecture

### Component Hierarchy

```
main.jsx
  └── BrowserRouter
        └── AuthProvider         (Context: user, isAuthenticated, login, logout)
              └── CartProvider   (Context: items, total, itemCount, addItem...)
                    └── App
                          ├── Navbar
                          │     └── CategoryBar   (only on homepage)
                          └── Routes
                                ├── /                → HomePage
                                │     └── ProductCard (grid)
                                ├── /product/:id     → ProductDetailPage
                                │     └── ImageCarousel
                                ├── /login           → LoginPage
                                ├── /register        → RegisterPage
                                └── ProtectedRoute (requires login)
                                      ├── /cart      → CartPage
                                      │     └── CartItem
                                      ├── /checkout  → CheckoutPage
                                      ├── /orders    → OrdersPage
                                      └── /order/:id → OrderDetailPage
```

### State Management Strategy

| State | Where it lives | Why |
|---|---|---|
| `isAuthenticated`, `user` | AuthContext | Needed across Navbar, ProtectedRoute, all pages |
| `items`, `total`, `itemCount` | CartContext | Needed in Navbar (badge), ProductCard (stepper), CartPage |
| `category` | App.jsx (lifted state) | Shared between Navbar's CategoryBar and HomePage's filter |
| `search` | URL (`?search=`) | Allows sharing/bookmarking search results, back button works |
| `products`, `loading`, `page` | HomePage local state | Only needed in one component |
| `product` | ProductDetailPage local state | Only needed in one component |

### How the Axios API Service Works

`src/services/api.js` creates a single Axios instance used by all service files:

```
baseURL = VITE_API_URL (production Render URL) OR '/api' (dev proxy via Vite)

Request interceptor:
  → reads token from localStorage
  → adds "Authorization: Bearer <token>" header to every request automatically

Response interceptor:
  → if 401 received → clears token from localStorage → redirects to /login
```

This means no individual service file needs to handle authentication headers — it's handled centrally.

### How React Router Client-Side Navigation Works

React Router intercepts link clicks and browser history events. Instead of the browser making a new HTTP request to the server (which would return 404 for `/cart` since the server only knows about `/`), React Router handles the URL change in JavaScript and renders the correct component.

**The `vercel.json` fix:** In production on Vercel, if a user refreshes `/cart`, Vercel's server tries to find a file at that path, fails, and returns 404. The `vercel.json` rewrite rule tells Vercel to always serve `index.html` for any path — then React Router takes over and renders the right page.

---

## 7. How Everything Connects

### Full Request Lifecycle Example — "Add to Cart"

```
1. User clicks "Add to Cart" on ProductCard
      │
2. ProductCard calls addItem(productId, 1) from CartContext
      │
3. CartContext calls cartService.addToCart({ productId, quantity: 1 })
      │
4. cartService calls api.post('/cart', { product_id, quantity })
      │
5. Axios attaches JWT from localStorage → "Authorization: Bearer eyJ..."
      │
6. Request hits Render → Express → /api/cart route → authMiddleware
      │
7. authMiddleware verifies JWT → extracts user id → sets req.user
      │
8. cartController.addToCart() runs:
   - Checks if item already in cart (Cart model query)
   - If not: INSERT into cart_items
   - If yes: returns 409 Conflict error
      │
9. Controller responds with 201 + new cart item
      │
10. CartContext receives response → calls fetchCart() to refresh all items
      │
11. CartContext state updates → all subscribed components re-render:
    - Navbar badge count updates
    - ProductCard shows stepper (− qty +) instead of "Add to Cart"
```

### Environment Variables Connection Map

```
Railway MySQL
  └── gives you: HOST, PORT, USER, PASSWORD, DATABASE
        │
        └── set as env vars on Render (DB_HOST, DB_PORT, etc.)
              └── backend/config/db.js reads them via process.env
                    └── mysql2 pool connects to Railway

Render (backend)
  └── gives you: public URL (https://flipkart-xxx.onrender.com)
        │
        └── set as VITE_API_URL on Vercel
              └── frontend/src/services/api.js uses import.meta.env.VITE_API_URL
                    └── all Axios requests go to this URL

Vercel (frontend)
  └── gives you: public URL (https://flipkart-xxx.vercel.app)
        │
        └── set as CORS_ORIGIN on Render
              └── backend/server.js allows requests only from this origin
```

---

## 8. Key Features Explained

### Cart Quantity Stepper

When a product is in the cart, the "Add to Cart" button transforms into a `− qty +` stepper. This works because:

1. `CartContext` holds the full list of cart items from the backend
2. `ProductCard` reads `items` from CartContext and checks: `items.find(i => i.product_id === product.id)`
3. If found → renders stepper; if not → renders button
4. `−` at quantity 1 calls `deleteItem()` (removes from cart entirely)
5. `+` is capped at `Math.min(product.stock, 10)` to respect stock limits

### Image Carousel

Each product has multiple images stored in the `product_images` table. The carousel:
- Shows thumbnail strip for quick navigation
- Main image click toggles zoom (CSS scale transform)
- Prev/Next arrows cycle through images circularly
- Dot indicators show current position

### Protected Routes

`ProtectedRoute` component wraps pages that require login (Cart, Checkout, Orders). It checks `isAuthenticated` from AuthContext. If false, it redirects to `/login`. The original target URL is passed as `location.state` so after login the user is redirected back to where they were going.

### Search — URL as State

The search term lives in the URL as `?search=keyword` rather than in component state. Benefits:
- Refreshing the page preserves the search
- Back/forward browser buttons work correctly
- The URL can be shared
- Navbar input stays in sync with the URL via a `useEffect` that watches `location.search`

---

## 9. Deployment Architecture

```
User's Browser
      │
      │ HTTPS
      ▼
  Vercel CDN                        (serves React app — static files)
  flipkart-clone.vercel.app
      │
      │ HTTPS API calls (VITE_API_URL)
      ▼
  Render Web Service                (runs Node.js / Express)
  flipkart-clone.onrender.com
      │
      │ MySQL protocol over SSL (port from Railway)
      ▼
  Railway MySQL                     (managed database)
  gondola.proxy.rlwy.net
```

### Why Three Separate Services?

- **Separation of concerns:** Frontend, backend, and database each have different scaling needs and deployment cycles
- **Security:** Database is not directly exposed to the internet — only the backend connects to it
- **Independent deployments:** Updating the frontend doesn't require redeploying the backend and vice versa

---

## 10. Interview Questions & Answers

---

### Basic Level

**Q: What is React and why did you use it?**

React is a JavaScript library for building user interfaces using reusable components. I used it because our UI has many repetitive pieces — product cards, cart items — that can be defined once and reused. React's virtual DOM efficiently updates only the changed parts of the UI, which makes the app feel fast.

---

**Q: What is the difference between `props` and `state` in React?**

`props` are read-only data passed from a parent component to a child. `state` is data managed inside a component that can change. When state changes, React re-renders the component. In this project, `product` in `ProductDetailPage` is state (it changes when the API responds), while the `product` object passed to `ProductCard` is a prop.

---

**Q: What is a REST API?**

REST (Representational State Transfer) is a style of building APIs using standard HTTP methods. GET retrieves data, POST creates data, PUT updates data, DELETE removes data. In this project, `GET /api/products` fetches the product list and `POST /api/cart` adds an item to the cart.

---

**Q: What is JWT and how does authentication work in your project?**

JWT (JSON Web Token) is a compact, self-contained token used to verify identity. When a user logs in, the backend signs a token containing the user's ID with a secret key and sends it to the frontend. The frontend stores it in `localStorage` and sends it in the `Authorization` header with every subsequent request. The backend verifies the token on protected routes without needing to check a database session table.

---

**Q: Why did you store passwords using bcrypt instead of plain text?**

Plain text passwords are a massive security risk — if the database is ever breached, all user passwords are exposed. bcrypt hashes the password in a one-way process, so the original password cannot be recovered from the hash. When a user logs in, bcrypt compares the input against the stored hash.

---

**Q: What is `useEffect` in React?**

`useEffect` is a hook that runs side effects (API calls, subscriptions, timers) after a component renders. The dependency array controls when it re-runs. For example, in `ProductDetailPage`, `useEffect` fetches product data whenever the `id` URL parameter changes.

---

**Q: What is the difference between `localStorage` and cookies?**

`localStorage` stores data in the browser with no expiry, only cleared explicitly. Cookies are sent automatically with every HTTP request to the server and can have expiry dates. I used `localStorage` for the JWT token because it's simple to access in JavaScript and the backend verifies it manually from the Authorization header.

---

**Q: What is CORS and why is it needed?**

CORS (Cross-Origin Resource Sharing) is a browser security mechanism that blocks JavaScript on one domain from making requests to a different domain by default. Our frontend is on `vercel.app` and backend is on `onrender.com` — different domains. The backend must include CORS headers to explicitly allow this, which we configured using the `cors` npm package.

---

**Q: What is the difference between `==` and `===` in JavaScript?**

`==` compares values with type coercion (`1 == "1"` is true). `===` compares value and type strictly (`1 === "1"` is false). We always use `===` in this project to avoid unexpected type coercion bugs.

---

**Q: What are environment variables and why did you use them?**

Environment variables are values set outside the source code, specific to the environment (development, production). We used them to store sensitive data like database credentials and the JWT secret so they are never committed to GitHub. They are loaded via `dotenv` in the backend and via Vite's `import.meta.env` in the frontend.

---

### Moderate Level

**Q: Explain the MVC pattern used in your backend.**

MVC stands for Model-View-Controller:
- **Model** (`models/Product.js`): All database queries. The model doesn't know anything about HTTP.
- **Controller** (`controllers/productController.js`): Reads the HTTP request, calls the model, sends the HTTP response. Contains business logic.
- **View**: Not applicable here — we have a separate React frontend instead.
- **Routes** (`routes/productRoutes.js`): Maps HTTP method + URL path to the appropriate controller function.

This separation keeps the code organized. If we switch from MySQL to MongoDB, we only change the models — controllers stay the same.

---

**Q: Why did you use Context API instead of Redux for state management?**

Redux adds significant boilerplate — actions, reducers, dispatch — which is justified for large applications with very complex state. This project has two global state concerns: authentication and cart. Context API handles both cleanly with minimal code. Using Redux here would be over-engineering.

---

**Q: What is a database transaction and where did you use it?**

A transaction is a group of database operations that either all succeed or all fail together (atomicity). We used a transaction when placing an order. The steps are: insert the order, insert order items, decrement product stock, and clear the cart. If any step fails (e.g., a product goes out of stock mid-transaction), the entire transaction rolls back, preventing partial data like a cleared cart with no order created.

---

**Q: What is connection pooling in MySQL?**

Creating a new database connection for every HTTP request is expensive (takes time and resources). A connection pool maintains a set of pre-established connections and reuses them. When a request needs the database, it borrows a connection from the pool and returns it when done. We configured a pool of 10 connections with `mysql2`, which means up to 10 simultaneous database operations can happen without waiting.

---

**Q: How does the Axios interceptor work in your project?**

An interceptor is a function that runs on every request or response before it reaches your code. We have:
- **Request interceptor:** Reads the JWT from localStorage and adds it as the `Authorization: Bearer <token>` header to every outgoing request automatically. No individual service file needs to do this manually.
- **Response interceptor:** If any response comes back with a 401 status (unauthorized), it clears the token and redirects to `/login` — centralized session expiry handling.

---

**Q: Why is there a `product_images` table instead of storing images directly in the `products` table?**

A product can have multiple images, but a relational database column holds one value per row. Storing multiple images in one column (as a comma-separated string) would break the First Normal Form of database normalization and make querying difficult. A separate `product_images` table with a foreign key creates a proper one-to-many relationship, making it easy to add, remove, or reorder images independently.

---

**Q: Why did you snapshot `price_at_purchase` in the `order_items` table?**

Product prices change over time. If we stored only a reference to the product ID in the order, and the product's price was updated later, the order history would show the wrong price. By copying the price at the moment of purchase into `order_items.price_at_purchase`, historical orders always reflect what the customer actually paid.

---

**Q: What is the difference between `async/await` and `.then()/.catch()`?**

Both handle Promises (asynchronous operations). `.then()/.catch()` is the older chaining style. `async/await` is syntactic sugar built on top of Promises that makes asynchronous code look and behave like synchronous code, which is easier to read and debug — especially when multiple async operations depend on each other. We used `async/await` throughout the project with `try/catch` for error handling.

---

**Q: How does your app stay responsive (mobile-friendly)?**

We used Tailwind CSS's responsive prefix system. Classes like `flex-col md:flex-row` mean: stack vertically on mobile, side-by-side on screens wider than 768px. Key responsive changes:
- Product grid: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`
- Product detail / cart / checkout: two-column layout stacks to single column on mobile
- Navbar: user name and "Cart" text hidden on small screens, only icons shown
- ImageCarousel: fixed 340px box changed to 100% width with `aspect-ratio: 1`

---

**Q: What happens if two users try to add the same last item to the cart simultaneously?**

The `stock` decrement happens inside a transaction when the order is placed, not when the item is added to the cart. At order placement, the backend checks available stock and decrements it atomically. If both users try to place an order and one goes through first, the second will either see reduced stock or an out-of-stock error. The cart is a wishlist — the final stock check happens at checkout.

---

**Q: How does the search feature work?**

The search query is stored in the URL as `?search=keyword` (using React Router's `useSearchParams`). When the user submits the search form, the URL is updated. The `HomePage` component reads the URL parameter and passes it to the backend API as a query parameter. The backend runs `WHERE name LIKE '%keyword%'` on the products table. Storing search in the URL means the search is preserved on refresh and the back button works correctly.

---

**Q: How would you improve this project if given more time?**

- Add a proper payment gateway integration (Razorpay / Stripe)
- Add product reviews and ratings
- Implement Redis caching for the product listing to reduce database load
- Add image upload (Cloudinary) instead of Unsplash URLs
- Add an admin dashboard for managing products and orders
- Implement proper pagination with cursor-based pagination for better performance at scale
- Add full-text search using MySQL FULLTEXT index or Elasticsearch
- Write unit tests for controllers and integration tests for API endpoints

---

*This documentation covers the complete architecture, design decisions, and expected interview topics for the Flipkart Clone project.*
