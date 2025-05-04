# Personal Finance Tracker - Frontend

React-based frontend for the Personal Finance Tracker application.

## Features

- Modern, responsive UI using Material-UI
- Redux for state management
- Protected routes and authentication
- Interactive charts and data visualization
- Transaction and category management
- Filtering and pagination
- Recurring transactions support

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Setup Instructions

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory:
   ```
   REACT_APP_API_URL=http://localhost:8000/api
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## Project Structure

```
frontend/
├── public/             # Static files
├── src/
│   ├── api/           # API configuration and calls
│   ├── components/    # Reusable UI components
│   ├── pages/         # Page components
│   ├── store/         # Redux store and slices
│   ├── utils/         # Utility functions
│   ├── App.jsx        # Main application component
│   └── index.js       # Entry point
├── package.json       # Dependencies and scripts
└── README.md          # This file
```

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App

## Dependencies

- @mui/material: UI components
- @mui/icons-material: Material icons
- @reduxjs/toolkit: State management
- axios: HTTP client
- react-router-dom: Routing
- recharts: Data visualization
- date-fns: Date manipulation

## Development

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:
   ```bash
   git commit -m 'Add your feature'
   ```

3. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```

## Testing

Run the test suite:
```bash
npm test
```

## Building for Production

1. Build the application:
   ```bash
   npm run build
   ```

2. The build files will be in the `build/` directory

## Contributing

Please read the main README.md for contribution guidelines.
