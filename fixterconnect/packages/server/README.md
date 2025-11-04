# FixterConnect Server

Backend API server for the FixterConnect application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up the database and seed with test data:
```bash
npm run seed
```

3. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

## Test Accounts

After running the seed script, you can use these test accounts:

**Customer:**
- Username: `testcustomer`
- Password: `customer123`

**Contractor:**
- Username: `testcontractor`
- Password: `contractor123`

## API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/create-account` - Create new account

### Health Check
- `GET /health` - Server health status

## Environment Variables

See `.env.example` for required environment variables.

## Technology Stack

- Node.js with TypeScript
- Express.js
- Better-SQLite3 (Database)
- bcrypt (Password hashing)
- JWT (Authentication tokens)
