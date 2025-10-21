# Campaign CRM

A comprehensive Customer Relationship Management system designed to manage and track your company's marketing campaigns.

## Features

- **Campaign Management**: Create, edit, and track marketing campaigns
- **Contact Management**: Organize and manage customer contacts
- **Lead Tracking**: Monitor leads and conversion funnels  
- **Analytics Dashboard**: View campaign performance metrics
- **Task Management**: Assign and track campaign-related tasks
- **Reporting**: Generate detailed reports on campaign effectiveness

## Tech Stack

- **Frontend**: React 18 with Material-UI
- **Backend**: Node.js with Express
- **Database**: MongoDB with Mongoose
- **Styling**: Material-UI + Emotion
- **Development**: TypeScript support, ESLint, Prettier

## Project Structure

```
campaign-crm/
├── src/                    # React frontend
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   └── types/             # TypeScript type definitions
├── server/                # Node.js backend
│   ├── routes/            # API routes
│   ├── models/            # Database models
│   └── middleware/        # Express middleware
├── tests/                 # Test files
│   ├── unit/              # Unit tests
│   └── integration/       # Integration tests
├── docs/                  # Documentation
└── public/                # Static assets
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas connection)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd campaign-crm
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```bash
   MONGODB_URI=mongodb://localhost:27017/campaign-crm
   PORT=5000
   JWT_SECRET=your-jwt-secret-key
   ```

4. Start the development servers:
   ```bash
   npm run dev
   ```

This will start both the React frontend (port 3000) and Express backend (port 5000).

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the React frontend
- `npm run build` - Build the React app for production
- `npm test` - Run the test suite
- `npm run lint` - Run ESLint on source files
- `npm run format` - Format code with Prettier

## API Endpoints

- `GET /api/campaigns` - Get all campaigns
- `POST /api/campaigns` - Create a new campaign
- `PUT /api/campaigns/:id` - Update a campaign
- `DELETE /api/campaigns/:id` - Delete a campaign
- `GET /api/contacts` - Get all contacts
- `POST /api/contacts` - Create a new contact

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the linter and tests
6. Submit a pull request

## License

This project is licensed under the MIT License.