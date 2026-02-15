# PropertyConnect

A full-stack web application that connects **property buyers** with **sellers**. Buyers can search properties with filters (price, area, locality, type) and message sellers; sellers can list properties, manage listings, and communicate with buyers.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [How to Run](#how-to-run)
- [How to Use the App](#how-to-use-the-app)
- [Routes Overview](#routes-overview)
- [Technical Implementation](#technical-implementation)
- [License](#license)

---

## Features

### For Everyone
- **Browse properties** – View all listings with images, price, location, area, type (apartment, house, villa, etc.).
- **Search & filter** – Filter by price range, locality, area (sq ft), property type, and minimum bedrooms.
- **Property details** – View full description, price, area, bedrooms/bathrooms, and listed-by info.
- **Reviews** – Logged-in users can leave ratings and reviews; authors can delete their own reviews.

### For Buyers
- **Sign up / Log in as Buyer** – Dedicated buyer flow from “Choose role” → Login or Sign up.
- **Contact seller** – Send a message to the seller from a listing page; continue conversation in Messages.
- **Messages** – Inbox of all conversations; open a thread to view messages and reply.
- **List your property** – Nav link takes buyers to “Choose role” to sign up or log in as Seller.

### For Sellers
- **Sign up / Log in as Seller** – Dedicated seller flow from “Choose role”.
- **Dashboard** – View all your listings with Edit/Delete; see recent buyer messages; quick link to Add listing and Messages.
- **Add listing** – Create a property with title, description, image, price, area, locality, property type, bedrooms, bathrooms, location, country.
- **Edit / Delete listing** – From dashboard or listing page (only owner).
- **Messages** – Reply to buyers from inbox or dashboard “Reply” links.

---

## Tech Stack

| Layer        | Technology |
|-------------|------------|
| **Runtime** | Node.js |
| **Framework** | Express.js 5.x |
| **Database** | MongoDB (Mongoose 8.x) |
| **Authentication** | Passport.js (local strategy), passport-local-mongoose |
| **Sessions** | express-session, connect-flash |
| **Validation** | Joi (listing & review schemas) |
| **Templating** | EJS with ejs-mate (layouts) |
| **File upload** | Multer + multer-storage-cloudinary (Cloudinary) |
| **Styling** | Bootstrap 5, custom CSS, Font Awesome |
| **Method override** | method-override (for PUT/DELETE in forms) |

---

## Project Structure

```
project/
├── app.js                 # Entry point, Express app, DB connect, route mounting
├── cloudConfig.js         # Cloudinary config for image uploads
├── middlewaves.js         # Auth & validation middleware (isLoggedIn, isOwner, isSeller, validateListing, etc.)
├── schema.js             # Joi schemas for listing & review validation
├── package.json
├── .env                   # Not in repo; add locally (see Environment Variables)
├── .gitignore
│
├── models/
│   ├── user.js           # User schema (username, email, password, role: buyer|seller)
│   ├── listing.js        # Listing schema (title, description, image, price, location, locality, area, propertyType, bedrooms, bathrooms, owner, reviews)
│   ├── review.js         # Review schema (rating, comment, author, listing)
│   └── message.js        # Message schema (listing, from, to, body, read, createdAt)
│
├── controllers/
│   ├── user.js           # home, chooseRole, signupForm/User, loginForm/User, logoutUser
│   ├── listing.js        # index (with filters), newForm, createListing, showListing, contactForm, contactSeller, editListing, updateListing, deleteListing
│   ├── review.js         # createReview, destroyReview
│   ├── message.js        # inbox, thread, send, reply
│   └── seller.js         # dashboard
│
├── routes/
│   ├── user.js           # /, /choose-role, /signup, /login, /logout
│   ├── listing.js        # /listings (CRUD, contact)
│   ├── review.js         # /listings/:id/reviews (POST, DELETE)
│   ├── message.js        # /messages (inbox, thread, reply)
│   └── seller.js         # /seller/dashboard
│
├── views/
│   ├── layouts/
│   │   └── boilerplate.ejs
│   ├── includes/
│   │   ├── navbar.ejs
│   │   ├── footer.ejs
│   │   └── flash.ejs
│   ├── home.ejs
│   ├── error.ejs
│   ├── user/
│   │   ├── choose-role.ejs
│   │   ├── login.ejs
│   │   └── sign.ejs
│   ├── listings/
│   │   ├── index.ejs     # Browse + filters
│   │   ├── show.ejs     # Property detail, contact seller, reviews
│   │   ├── new.ejs      # Add listing form (sellers)
│   │   ├── edit.ejs     # Edit listing form
│   │   └── contact.ejs  # First message to seller
│   ├── seller/
│   │   └── dashboard.ejs
│   └── messages/
│       ├── inbox.ejs
│       └── thread.ejs
│
├── public/
│   ├── css/
│   │   ├── style.css
│   │   └── rating.css
│   └── js/
│       └── script.js
│
├── utils/
│   ├── wrapAsync.js
│   └── ExpressError.js
│
└── init/                 # Optional seed/init (if used)
```

---

## Prerequisites

- **Node.js** (v18 or later recommended)
- **MongoDB** running locally (e.g. `mongodb://127.0.0.1:27017`) or a remote URI
- **Cloudinary** account (for property image uploads)

---

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/varshasingh04/COLLEGE-PROJECT.git
   cd COLLEGE-PROJECT
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the project root (see [Environment Variables](#environment-variables)).

4. **Ensure MongoDB is running** (e.g. start MongoDB service or run `mongod`).

---

## Environment Variables

Create a `.env` file in the project root with:

```env
# MongoDB (optional; app defaults to mongodb://127.0.0.1:27017/wanderlust)
# MONGO_URL=mongodb://127.0.0.1:27017/wanderlust

# Cloudinary (required for image uploads)
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret
```

- **Cloudinary**: Get these from [Cloudinary Console](https://cloudinary.com/console). Without them, image upload on new/edit listing will fail.
- **MongoDB**: If you don’t set `MONGO_URL`, the app uses `mongodb://127.0.0.1:27017/wanderlust` (see `app.js`).

---

## How to Run

1. Start MongoDB (if local).
2. From the project root:
   ```bash
   node app.js
   ```
3. Open in browser:
   - **http://localhost:8080** or **http://127.0.0.1:8080**
4. Optional: health check – **http://127.0.0.1:8080/ping**

To use a different port:

```bash
# Windows (PowerShell)
$env:PORT=3000; node app.js

# Linux/Mac
PORT=3000 node app.js
```

---

## How to Use the App

### First-time visitor
1. Open **http://localhost:8080**.
2. Use **Browse Properties** to see all listings (no login required).
3. To contact sellers or message, click **Login / Sign up**.

### Sign up / Log in
1. Click **Login** or **Sign up** → you’ll see **Who are you?**
2. Choose **I'm a Buyer** or **I'm a Seller**.
3. Click **Login** or **New? Sign up**:
   - **Sign up**: Enter username, email (sign up only), password. You’re logged in and redirected by role.
   - **Login**: Enter username and password. You must choose the same role you registered with (buyer or seller).

### As a Buyer
- **Browse** – Use filters (price, locality, area, property type, bedrooms) and click a listing.
- **Contact seller** – On a listing page, click **Contact Seller**, write a message, and send. Conversation appears under **Messages**.
- **Messages** – Open **Messages**, then a thread to read and reply.
- **List your property** – Click **List your property** in the nav → choose Seller and sign up or log in as seller.

### As a Seller
- **Dashboard** – See your listings and recent buyer messages; use **Add Property** or **Messages**.
- **Add listing** – Fill title, description, image, price, area, locality, type, bedrooms/bathrooms, location, country. Submit → redirect to dashboard.
- **Edit / Delete** – From dashboard or listing page (only your listings).
- **Messages** – Reply to buyers from **Messages** or from **Reply** on the dashboard.

---

## Routes Overview

| Method | Route | Description | Access |
|--------|--------|-------------|--------|
| GET | `/` | Home / landing | All |
| GET | `/ping` | Health check (plain text) | All |
| GET | `/choose-role` | Choose Buyer or Seller | All |
| GET | `/signup` | Sign up form (`?role=buyer\|seller`) | All |
| POST | `/signup` | Create account (body: username, email, password, role) | All |
| GET | `/login` | Login form (`?role=buyer\|seller`) | All |
| POST | `/login` | Log in (body: username, password, role) | All |
| GET | `/logout` | Log out | Logged in |
| GET | `/listings` | List all properties (supports filter query params) | All |
| GET | `/listings/new` | Add listing form | Seller only |
| POST | `/listings/new` | Create listing (multipart: listing fields + image) | Seller only |
| GET | `/listings/:id` | Property detail | All |
| GET | `/listings/:id/edit` | Edit form | Owner only |
| PUT | `/listings/:id` | Update listing | Owner only |
| DELETE | `/listings/:id` | Delete listing | Owner only |
| GET | `/listings/:id/contact` | Contact seller form | Logged in |
| POST | `/listings/:id/contact` | Send first message to seller | Logged in |
| POST | `/listings/:id/reviews` | Add review | Logged in |
| DELETE | `/listings/:id/reviews/:reviewId` | Delete own review | Author only |
| GET | `/seller/dashboard` | Seller dashboard | Seller only |
| GET | `/messages` | Inbox (conversation list) | Logged in |
| GET | `/messages/thread/:listingId/:userId` | Conversation thread | Logged in |
| POST | `/messages/thread/:listingId/:userId` | Send reply in thread | Logged in |

**Filter query params for GET `/listings`:**  
`priceMin`, `priceMax`, `locality`, `areaMin`, `areaMax`, `propertyType`, `bedrooms`

---

## Technical Implementation

### Authentication & roles
- **Passport** local strategy with **passport-local-mongoose** (User model).
- **User.role**: `"buyer"` or `"seller"` (default `"buyer"` for existing users).
- **Session**: express-session with cookie (7-day maxAge); flash messages for success/error.
- **Middleware**: `isLoggedIn`, `isOwner` (listing), `isSeller`, `isReviewAuthor`; `saveRedirectUrl` to redirect after login.

### Listings & search
- **Listing** model: title, description, image (Cloudinary), price, location, country, locality, area, propertyType, bedrooms, bathrooms, owner (ref User), reviews (ref Review). Timestamps enabled.
- **Index (browse)**: Mongoose query built from query params (price range, locality regex, area range, propertyType, bedrooms min). Results populated with `owner`, sorted by `createdAt` desc.

### Messaging
- **Message** model: listing (ref), from (ref User), to (ref User), body, read, createdAt.
- **Inbox**: Messages where user is from or to; grouped into threads by (listing + other user); sorted by last message.
- **Thread**: Messages for one listing between current user and one other user; reply form POSTs to same thread URL.

### Validation
- **Joi**: `schema.js` defines `listingSchema` (title, description, location, country, price, image, locality, area, propertyType, bedrooms, bathrooms) and `reviewSchema` (rating 1–5, comment). Used in routes before create/update.

### File upload
- **Multer** with **CloudinaryStorage** (cloudConfig.js). Listing image stored on Cloudinary; URL and filename saved on listing document.

### Error handling
- **wrapAsync** used on async route handlers. Central error middleware in `app.js` and listing router renders `error.ejs` with status code and message.
- **Views** guard against null refs (e.g. `listing.owner`, `review.author`) to avoid runtime errors.

### UI
- **EJS** with **ejs-mate** layout (`boilerplate.ejs`). Navbar shows different links for buyer vs seller; footer and flash messages included in layout.
- **Bootstrap 5** + custom CSS (landing, role selection, auth forms, filters, cards, message bubbles).

---

## License

ISC (see `package.json`).

---

## Repository

- **GitHub**: [https://github.com/varshasingh04/COLLEGE-PROJECT](https://github.com/varshasingh04/COLLEGE-PROJECT)

To push changes:

```bash
git add .
git commit -m "Add README with technical docs and usage"
git push origin main
```

(Use `master` instead of `main` if your default branch is `master`.)
