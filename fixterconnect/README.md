# FixterConnect

A platform connecting clients with contractors for various home services.

## Project Structure

This is a monorepo containing three packages:

- **packages/core** - Shared TypeScript types and API client
- **packages/web** - React frontend application
- **packages/server** - Express backend API server

## Quick Start

### 1. Install Dependencies

From the root directory:

```bash
npm install
```

### 2. Seed the Database

Create test accounts:

```bash
cd packages/server
npm run seed
```

### 3. Start the Backend Server

In one terminal:

```bash
cd packages/server
npm run dev
```

The backend will run on **http://localhost:3001**

### 4. Start the Frontend

In another terminal:

```bash
cd packages/web
npm start
```

The frontend will run on **http://localhost:3000**

### 5. Access the Application

Open your browser to **http://localhost:3000**

## Test Accounts

After running the seed script, you can login with:

**Client Account:**
- Username: `testclient`
- Password: `client123`

**Contractor Account:**
- Username: `testcontractor`
- Password: `contractor123`

## Features

- User authentication (Client & Contractor)
- Role-based access control
- Protected routes
- JWT token management
- Responsive UI

## Technology Stack

### Frontend
- React 19
- TypeScript
- React Router
- Context API (State Management)

### Backend
- Node.js
- Express
- TypeScript
- bcrypt (Password hashing)
- JWT (Authentication)
- In-memory database (for development)

### Shared
- TypeScript
- Axios (API client)

## Development

### Backend Development

The backend uses an in-memory database for development. Data will be lost when the server restarts. For production, you should replace this with a persistent database (PostgreSQL, MySQL, MongoDB, etc.).

### Frontend Development

The React app uses react-scripts and supports hot-reloading during development.

## API Endpoints

- `POST /api/login` - User login
- `POST /api/create-account` - Create new account
- `GET /health` - Server health check

## Next Steps

- Implement sign-up functionality in the frontend
- Add more endpoints for services, bookings, etc.
- Replace in-memory database with a persistent solution
- Add more comprehensive error handling
- Implement password reset functionality
- Add user profile management

## License

Private
