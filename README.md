#  RBAC-API

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express.js-Backend-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![JWT](https://img.shields.io/badge/Auth-JWT-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

A production-ready **Role-Based Access Control (RBAC)** API built with Node.js, Express, and MongoDB.  
This project demonstrates secure authentication, scalable backend architecture, and real-world authorization patterns.

---

## Live Demo

**API Base URL:**  
 https://your-api.onrender.com

 **Frontend Demo:**  
 https://your-frontend.vercel.app

>  Note: Free hosting services may take a few seconds to wake up.

---

##  Screenshots

###  Authentication Flow
![Login](./docs/screenshots/login.png)

###  User Dashboard
![Dashboard](./docs/screenshots/dashboard.png)

###  Admin Panel (RBAC)
![Admin](./docs/screenshots/admin.png)

---

##  Features

###  Authentication
- Secure user registration & login
- Password hashing using bcrypt
- JWT-based authentication
- Stateless session handling

###  Authorization (RBAC)
- Role-based access (`user`, `admin`)
- Middleware-driven permission control
- Admin-only protected routes

###  Backend Engineering
- Clean modular architecture
- Separation of concerns (routes, controllers, middleware, models)
- Centralized error handling
- Rate limiting & CORS security

###  Frontend (Vanilla JS)
- Login & signup UI
- Token storage and handling
- Route protection (guard.js)
- Dashboard rendering

---

##  Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- bcryptjs

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript

---

##  API Reference

###  Auth Routes
| Method | Endpoint | Description |
|-------|--------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Authenticate user |

###  User Routes
| Method | Endpoint | Access | Description |
|-------|--------|--------|-------------|
| GET | `/api/users/me` | Protected | Get current user |
| GET | `/api/users/all` | Admin only | Get all users |

---

##  Architecture

```
Client → Routes → Middleware → Controllers → Models → Database
```

### Request Flow

1. Client sends request to API  
2. Route matches endpoint  
3. Authentication middleware verifies JWT  
4. Role middleware checks permissions  
5. Controller executes business logic  
6. Response returned to client  

---

##  Getting Started

### 1. Clone Repository
```bash
git clone https://github.com/Star90lord/bac-api.git
cd bac-api
```

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4. Run the Server

```bash
npm start
```

Server will run at:

```
http://localhost:5000
```

### 5. Run the Frontend

Open:

```
frontend/pages/index.html
```

---

## API Testing

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
-H "Content-Type: application/json" \
-d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login User

```bash
curl -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"john@example.com","password":"password123"}'
```

### Get Current User

```bash
curl -X GET http://localhost:5000/api/users/me \
-H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Project Structure

```text
bac-api/
├── backend/
│   ├── config/        # Database configuration
│   ├── controllers/   # Business logic
│   ├── middleware/    # Auth, role, rate limiting
│   ├── models/        # Mongoose schemas
│   ├── routes/        # API routes
│   ├── utils/         # Helper functions
│   ├── app.js         # Express setup
│   └── server.js      # Entry point
│
├── frontend/
│   ├── css/
│   ├── js/
│   └── pages/
│
├── docs/
│   └── screenshots/
│
└── README.md
```

---

## Security

* Passwords are hashed before storage
* JWT enables stateless authentication
* Protected routes require valid Bearer tokens
* Role-based middleware enforces authorization
* Rate limiting prevents brute-force attacks

---

## Future Improvements

* Refresh token implementation
* Email verification system
* Password reset flow
* API documentation (Swagger)
* Docker containerization
* Unit & integration testing (Jest, Supertest)
* CI/CD pipeline

---

## Use Cases

* Backend portfolio project
* Authentication system reference
* RBAC learning implementation
* Starter template for scalable APIs

---

##  Contributing

Contributions are welcome.
Please maintain the modular architecture and clean code practices when extending the project.

---

##  Author

**Your Name**
GitHub: [https://github.com/Star90lord](https://github.com/Star90lord)

---

