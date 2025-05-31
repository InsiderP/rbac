# User Management API

A RESTful API for managing users and admins with authentication and authorization features.

## Features

- User and Admin management
- JWT-based authentication
- Role-based authorization
- Input validation
- Pagination for user listing
- MongoDB database integration
- Unit tests

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd user-management-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/user_management
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h
```

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Documentation

### Authentication

All endpoints except user creation require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Endpoints

#### Create User/Admin
- **POST** `/api/users`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "middleName": "Smith", // optional
    "department": "IT", // optional
    "role": "user" // optional, defaults to "user"
  }
  ```

#### List Users (Admin only)
- **GET** `/api/users?page=1&limit=10`
- **Query Parameters:**
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)

#### Get User Profile
- **GET** `/api/users/:id`
- Users can only view their own profile
- Admins can view any profile

#### Update User Profile
- **PATCH** `/api/users/:id`
- **Body:**
  ```json
  {
    "firstName": "Updated",
    "lastName": "Name",
    "middleName": "New",
    "department": "HR",
    "password": "newpassword"
  }
  ```
- Users can only update their own profile
- Admins can update any profile

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Security Features

- Password hashing using bcrypt
- JWT token-based authentication
- Role-based access control
- Input validation and sanitization
- Protected routes
- Secure password storage

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 