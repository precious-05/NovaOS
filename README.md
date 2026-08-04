
# NovaOS Backend

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express-4.18.x-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-7.x-green)
![JWT](https://img.shields.io/badge/JWT-Auth-orange)
![License](https://img.shields.io/badge/License-MIT-blue)

## Description

NovaOS Backend is the foundation of the AI Employee Operating System. This repository contains the core authentication system, database models, and shared middleware that all other modules depend on.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Running the Server](#running-the-server)
- [Testing](#testing)
- [Team Member Modules](#team-member-modules)
- [Contributing](#contributing)

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18.x | Runtime Environment |
| Express | 4.18.x | Web Framework |
| MongoDB | 7.x | Database |
| Mongoose | 7.x | ODM |
| JWT | 9.x | Authentication |
| Bcryptjs | 2.4.x | Password Hashing |
| Jest | 29.x | Testing |
| Nodemon | 3.x | Development Server |

## Project Structure

```
novaos-backend/
│
├── .env
├── .gitignore
├── package.json
├── server.js
│
├── src/
│   ├── app.js
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── shared/
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── errorHandler.js
│   │   │
│   │   └── utils/
│   │       └── constants.js
│   │
│   ├── modules/
│   │   └── auth/
│   │       ├── model.js
│   │       ├── controller.js
│   │       ├── routes.js
│   │       └── validator.js
│   │
│   └── docs/
│       └── API_CONTRACT.md
│
└── tests/
    └── auth.test.js
```

## Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Steps

1. Clone the repository

```bash
git clone https://github.com/your-username/NovaOS-backend.git
cd NovaOS-backend
```

2. Install dependencies

```bash
npm install
```

3. Create .env file (see Environment Variables section)

4. Start MongoDB

```bash
# Local MongoDB
mongod

# OR using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

5. Run the server

```bash
npm run dev
```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/novaos_db
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/novaos_db |
| JWT_SECRET | Secret key for JWT signing | Required |
| JWT_EXPIRES_IN | JWT token expiry time | 7d |
| NODE_ENV | Environment (development/production) | development |

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user with company | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user profile | Yes |

### Sample Requests

#### Register

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "companyName": "Acme Corp"
}
```

#### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile (Protected)

```bash
GET /api/auth/me
Authorization: Bearer <your-jwt-token>
```

## Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

## Testing

Run all tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm test:watch
```

## Team Member Modules

| Member | Module | Prefix | Status |
|--------|--------|--------|--------|
| Member 1 | Foundation / Auth | `/api/auth` | Complete |
| Member 2 | Communication | `/api/communication` | Pending |
| Member 3 | Sales | `/api/sales` | Pending |
| Member 4 | Productivity | `/api/productivity` | Pending |
| Member 5 | Reporting | `/api/reports` | Pending |

### For Team Members

When creating your module, follow these rules:

1. Create your module in `src/modules/<your-module>/`
2. Use the `authMiddleware` for protected routes
3. Reference `API_CONTRACT.md` for route prefixes
4. Do not modify shared/ or other modules' folders

### Using Auth Middleware

```javascript
const authMiddleware = require('../../shared/middleware/authMiddleware');

router.post('/your-route', authMiddleware, yourController);
```

## Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String,        // unique
  passwordHash: String,
  companyId: ObjectId,  // ref -> companies
  role: String,         // "owner" | "member"
  createdAt: Date
}
```

### Companies Collection

```javascript
{
  _id: ObjectId,
  name: String,
  plan: String,         // "basic" | "pro" | "business"
  createdAt: Date
}
```

## Contributing

1. Create a feature branch: `feature/<module-name>-member<number>`
2. Only modify your module's folder
3. Do not modify shared/ or other modules' folders
4. Test your APIs before merging
5. Follow the merge order: Member 1 → Member 2,3,4 → Member 5



