# 🎬 YouTube Backend API

A fully functional YouTube-inspired RESTful API built using **Node.js, Express, MongoDB, and Mongoose**.

It includes user authentication, video uploads with Cloudinary, comments, likes, subscriptions, pagination, and aggregation queries — all organized using a clean and scalable structure.

---

## 🚀 Features

### 🔐 Authentication & Authorization

- JWT-based authentication (Access + Refresh tokens)
- Password hashing with bcrypt
- Protected routes via middleware
- Ownership-based authorization checks
- Token refresh mechanism
- Logout with token invalidation

---

### 🎥 Video Management

- Upload video (Cloudinary integration)
- Update video details
- Delete video (with Cloudinary cleanup)
- Toggle publish/unpublish
- Video views tracking
- Pagination support

---

### 💬 Comment System

- Add comment to video
- Update comment (owner only)
- Delete comment (owner only)
- Paginated comment listing
- Populated user data (username, avatar)

---

### ❤️ Like System

- Like / Unlike videos
- Like / Unlike comments
- Compound unique indexes (prevent duplicate likes)
- Fetch total likes
- Check if current user liked content
- Get all liked videos

---

### 📡 Subscription / Channel System

- Subscribe to channels
- Unsubscribe from channels
- Fetch subscriber count
- Fetch subscribed channels
- Aggregation pipelines for profile data

---

### 📊 Aggregation Pipelines

Used for:

- Subscriber count
- Channel statistics
- Data transformation & shaping

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (Authentication)
- Cloudinary (Media Storage)
- Multer (File Uploads)

---

## 📁 Project Structure

```txt
YOUTUBE-BACKEND/
│
├── public/           # Temporary media storage (deleted after Cloudinary upload)
│
├── src/
│   ├── controllers/  # Business logic for routes
│   ├── db/           # Database connection configuration
│   ├── middlewares/  # Auth, multer, error handling, etc.
│   ├── models/       # Mongoose schemas & data models
│   ├── routes/       # Express routes
│   ├── utils/        # Helper & reusable utility functions
│   ├── app.js        # Express app configuration (middlewares + routes)
│   └── server.js     # Application entry point
│
├── .env
├── .env.sample      # Sample environment variables
└── README.md        # Project documentation

```

---

# 📡 API Routes (v1)

Base URL: `/api/v1`

---

## 🔐 Authentication Routes

Base: `/api/v1/auth`

| Method | Endpoint         | Description                                         |
| ------ | ---------------- | --------------------------------------------------- |
| POST   | `/register`      | Register new user (avatar & cover upload supported) |
| POST   | `/login`         | Login user                                          |
| POST   | `/refresh-token` | Refresh access token                                |
| POST   | `/logout`        | Logout user (Protected)                             |

---

## 👤 User Routes

Base: `/api/v1/users`
(Protected — requires JWT)

| Method | Endpoint                     | Description            |
| ------ | ---------------------------- | ---------------------- |
| GET    | `/current-user`              | Get logged-in user     |
| GET    | `/:username/channel-profile` | Get channel profile    |
| POST   | `/change-password`           | Change password        |
| PATCH  | `/update-account`            | Update account details |
| PATCH  | `/avatar`                    | Update avatar          |
| PATCH  | `/cover-image`               | Update cover image     |

---

## 🎥 Video Routes

Base: `/api/v1/videos`
(Protected — requires JWT)

| Method | Endpoint                   | Description                         |
| ------ | -------------------------- | ----------------------------------- |
| GET    | `/`                        | Get my videos (paginated)           |
| GET    | `/:videoId`                | Get video by ID (+ increment views) |
| POST   | `/upload`                  | Upload new video                    |
| PATCH  | `/:videoId/details`        | Update video details                |
| PATCH  | `/:videoId/thumbnail`      | Update thumbnail                    |
| PATCH  | `/:videoId/toggle-publish` | Toggle publish status               |
| DELETE | `/:videoId/delete`         | Delete video                        |

---

## 💬 Comment Routes

Base: `/api/v1/comments`
(Protected — requires JWT)

| Method | Endpoint             | Description                    |
| ------ | -------------------- | ------------------------------ |
| POST   | `/:videoId`          | Add comment to video           |
| GET    | `/:videoId`          | Get video comments (paginated) |
| PATCH  | `/:commentId/update` | Update comment                 |
| DELETE | `/:commentId/delete` | Delete comment                 |

---

## ❤️ Like Routes

Base: `/api/v1/likes`
(Protected — requires JWT)

| Method | Endpoint        | Description                          |
| ------ | --------------- | ------------------------------------ |
| POST   | `/v/:videoId`   | Toggle video like                    |
| POST   | `/c/:commentId` | Toggle comment like                  |
| GET    | `/v/:videoId`   | Get video likes                      |
| GET    | `/c/:commentId` | Get comment likes                    |
| GET    | `/liked-videos` | Get all videos liked by current user |

---

## 📡 Subscription Routes

Base: `/api/v1/subscriptions`
(Protected — requires JWT)

| Method | Endpoint                  | Description                     |
| ------ | ------------------------- | ------------------------------- |
| POST   | `/c/:channelId`           | Toggle subscribe/unsubscribe    |
| GET    | `/u/:userId/subscribers`  | Get channel subscribers         |
| GET    | `/u/:userId/subscribedTo` | Get channels user subscribed to |

---

# 🧠 Key Backend Concepts Implemented

- JWT Authentication with refresh tokens
- Multer file uploads
- Cloudinary media storage
- Atomic MongoDB updates (`$inc` for views)
- Compound unique indexes (for likes)
- Aggregation pipelines (subscriber count, channel stats)
- Pagination (videos & comments)
- Ownership-based authorization
- Centralized error handling middleware
- Versioned API structure (`/api/v1`)

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Tehseen100/youtube-backend.git
cd youtube-backend
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Create .env file

Add the following variables:

```Bash
PORT=3000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:3000
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4️⃣ Start the server

```Bash
npm run dev
```

Server will run on:

```Bash
http://localhost:3000
```

## 👨‍💻 Author

**Tehseen Javed**  
Backend Developer (Node.js | MongoDB) <br>
Computer Systems Engineering Student @ Dawood University of Engineering & Technology <br>
GitHub: https://github.com/Tehseen100

---
