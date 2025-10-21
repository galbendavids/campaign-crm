# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Essential Commands
- `npm run dev` - Start both frontend and backend in development mode (React on port 3000, Express on port 5000)
- `npm run server` - Start only the Express backend server
- `npm run client` - Start only the React frontend
- `npm run build` - Build React app for production
- `npm test` - Run the test suite
- `npm run lint` - Run ESLint on source files (both src/ and server/)
- `npm run format` - Format code with Prettier

### Testing
- Run all tests: `npm test`
- For single test files, use: `npm test -- --testPathPattern=path/to/test`
- Tests are located in `/tests/` with separate `/tests/unit/` and `/tests/integration/` directories

### Database Setup
- MongoDB is required (local or Atlas connection)
- Default connection: `mongodb://localhost:27017/campaign-crm`
- Environment variables should be set in `.env` file (see `.env.example`)

## Architecture Overview

### Full-Stack Architecture
This is a **MERN stack application** (MongoDB, Express, React, Node.js) with a clear separation between frontend and backend:

**Frontend**: React 18 application using Material-UI for components, React Router for navigation, and Axios for API calls. The React development server proxies API requests to the Express backend.

**Backend**: Express.js REST API server with MongoDB database using Mongoose ODM. CORS-enabled for cross-origin requests.

### Project Structure
```
├── src/                    # React frontend application
│   ├── components/         # Reusable UI components (Header, etc.)
│   ├── pages/             # Route-level page components (Dashboard, Campaigns, Contacts, Reports)
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   └── types/             # TypeScript type definitions
├── server/                # Express.js backend API
│   ├── models/            # Mongoose database models (Campaign, Contact)
│   ├── routes/            # Express route handlers (campaigns.js, contacts.js)
│   └── middleware/        # Express middleware functions
├── tests/                 # Test suites
│   ├── unit/              # Unit tests
│   └── integration/       # Integration tests
└── public/                # Static assets served by React
```

### Key Architectural Patterns

**Database Models**: 
- Mongoose schemas with validation, enum constraints, and timestamps
- Campaign model tracks marketing campaigns with metrics (impressions, clicks, conversions)
- Contact model manages leads/customers with status tracking and tagging

**API Design**: 
- RESTful endpoints following `/api/{resource}` pattern
- Standard HTTP methods (GET, POST, PUT, DELETE) for CRUD operations
- Consistent error handling with appropriate status codes

**Frontend Routing**: 
- Single-page application using React Router v6
- Material-UI theme provider for consistent styling across components
- Route-based code splitting with main sections: Dashboard, Campaigns, Contacts, Reports

**State Management**: 
- Currently using React's built-in state management
- API calls made with Axios from components directly

### Development Flow
The application runs both frontend and backend simultaneously in development:
1. React dev server (port 3000) serves the frontend with hot reloading
2. Express server (port 5000) provides the REST API
3. React's proxy setting forwards `/api/*` requests to the backend
4. MongoDB connection is established when the Express server starts

### Key Dependencies
- **UI Framework**: Material-UI v5 with Emotion for styling
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios for API requests
- **Database**: MongoDB with Mongoose ODM
- **Dev Tools**: Nodemon for backend hot reloading, Concurrently for running both servers
- **Code Quality**: ESLint and Prettier for consistent code formatting