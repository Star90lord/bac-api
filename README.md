# RBAC-API

A professional role-based access control API built with Node.js, Express, MongoDB, and a lightweight vanilla JavaScript frontend. The project demonstrates a complete authentication workflow with secure login, protected routes, and role-aware access for `user` and `admin` accounts.

## Overview

RBAC-API is a compact full-stack reference project focused on authentication and authorization fundamentals. It combines a modular Express backend with a simple frontend interface to demonstrate how protected APIs and role-based access control work together in a real application flow.

## Key Features

- User registration and login
- Password hashing with bcrypt
- JWT-based authentication
- Protected profile access
- Role-based route authorization
- Admin-only user listing
- Rate limiting and CORS support
- Lightweight frontend for login, signup, and dashboard flows

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens
- bcrypt / bcryptjs
- HTML, CSS, and vanilla JavaScript

## API Endpoints

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`

### User Routes

- `GET /api/users/me`
- `GET /api/users/all` for `admin` users only

## Getting Started

### Clone the repository

```bash
git clone [https://github.com/Star90lord/bac-api.git](https://github.com/Star90lord/bac-api/)
cd bac-api
```

### Install dependencies

```bash
cd backend
npm install
```

### Start the backend server

```bash
npm start
```

The API runs on `http://localhost:5000`.

### Open the frontend

Open `frontend/pages/index.html` in your browser to access the login flow.

## Example Requests

### Register a user

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"password123\"}"
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"john@example.com\",\"password\":\"password123\"}"
```

### Get current user

```bash
curl -X GET http://localhost:5000/api/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Project Structure

```text
bac-api/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── rateLimiter.js
│   │   └── roleMiddleware.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── app.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   └── guard.js
│   └── pages/
│       ├── dashboard.html
│       ├── index.html
│       └── signup.html
├── .gitattributes
├── .gitignore
└── README.md
```

## Architecture Notes

- Controllers contain request handling logic
- Middleware manages authentication, authorization, and rate limiting
- Models define MongoDB schemas and hooks
- Routes keep the API surface organized and maintainable
- Frontend scripts are separated by responsibility for cleaner client-side behavior

## Security

- Passwords are hashed before storage
- JWTs are used for stateless authentication
- Protected routes require a valid bearer token
- Admin-only routes are guarded through dedicated role middleware
- Rate limiting reduces abuse on public endpoints

## Use Case

This project is well suited for:

- authentication system demos
- RBAC learning projects
- starter templates for Node.js APIs
- portfolio or internship-ready backend showcases

## Contributing

Contributions and improvements are welcome. If you extend the project, keep the current route, controller, middleware, and model separation intact to preserve clarity and maintainability.
