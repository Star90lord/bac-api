"# BAC-API (Role-Based Access Control API)

A production-ready RESTful API for user authentication and role-based access control (RBAC), built with Node.js, Express, and MongoDB. This API provides secure user registration, login, and profile management with JWT-based authentication and role-based permissions.

## Features

- **User Authentication**: Secure registration and login with password hashing (bcrypt)
- **JWT Tokens**: Stateless authentication using JSON Web Tokens
- **Role-Based Access Control**: Support for user roles (e.g., 'user', 'admin') with middleware for access control
- **Rate Limiting**: Protection against brute-force attacks with express-rate-limit
- **CORS Support**: Cross-origin resource sharing enabled for frontend integration
- **MongoDB Integration**: User data stored in MongoDB with Mongoose ODM
- **Environment Configuration**: Secure environment variable management with dotenv
- **Frontend Integration**: Basic HTML/CSS/JS frontend for demonstration

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken), bcrypt for password hashing
- **Security**: express-rate-limit, CORS
- **Frontend**: Vanilla HTML, CSS, JavaScript (for demo purposes)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Star90lord/bac-api.git
   cd bac-api
   ```

2. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the `backend` directory:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. **Start MongoDB**:
   Ensure MongoDB is running locally or update `MONGO_URI` for a cloud instance.

5. **Run the backend server**:
   ```bash
   npm start
   ```
   The server will start on `http://localhost:5000`.

## Usage

### API Endpoints

#### Authentication Routes (`/api/auth`)
- `POST /api/auth/register` - Register a new user
  - Body: `{ "name": "string", "email": "string", "password": "string" }`
- `POST /api/auth/login` - Login user
  - Body: `{ "email": "string", "password": "string" }`

#### User Routes (`/api/users`) - Requires Authentication
- `GET /api/users/profile` - Get user profile (protected route)

### Frontend Demo

1. Navigate to the `frontend` directory.
2. Open `index.html` in a web browser to access the login page.
3. Use the signup page to create an account, then login to access the dashboard.

### Example API Usage

**Register a User**:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

**Login**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Get Profile** (with JWT token):
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Project Structure

```
bac-api/
├── backend/
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   └── userController.js    # User management logic
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT verification
│   │   ├── roleMiddleware.js    # Role-based access control
│   │   └── rateLimiter.js       # Rate limiting
│   ├── models/
│   │   └── User.js              # User schema
│   ├── routes/
│   │   ├── authRoutes.js        # Auth routes
│   │   └── userRoutes.js        # User routes
│   ├── config/
│   │   └── db.js                # Database connection
│   ├── utils/
│   │   └── generateToken.js     # JWT token generation
│   ├── app.js                   # Express app setup
│   ├── server.js                # Server entry point
│   ├── .env                     # Environment variables
│   └── package.json             # Dependencies
├── frontend/
│   ├── index.html               # Login page
│   ├── signup.html              # Registration page
│   ├── dashboard.html           # User dashboard
│   ├── style.css                # Styles
│   └── script.js                # Frontend logic
└── README.md                    # This file
```

## Security Features

- Passwords are hashed using bcrypt before storage
- JWT tokens expire after 30 days
- Rate limiting prevents excessive requests (100 per 15 minutes per IP)
- CORS configured for secure cross-origin requests
- Input validation and error handling

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions or issues, please open an issue on GitHub or contact the maintainers." 
