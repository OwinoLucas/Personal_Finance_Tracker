# Personal Finance Tracker

A full-stack web application for tracking personal income and expenses with detailed categorization and visualization.

## Features

- User Authentication (Register, Login, Logout)
- Transaction Management (Add, Edit, Delete)
- Category Management
- Dashboard with Financial Overview
- Expense Visualization
- Recurring Transactions
- Transaction Filtering
- Responsive Design

## Technology Stack

### Backend
- Django
- Django REST Framework
- MySQL Database
- JWT Authentication
- Django CORS Headers

### Frontend
- React
- Redux for State Management
- Material-UI for UI Components
- Axios for API Calls
- Recharts for Data Visualization

## Project Structure

```
personal_finance_tracker/
├── Backend/                # Django backend
│   ├── finance_tracker/   # Main Django app
│   │   ├── migrations/    # Database migrations
│   │   ├── models.py      # Database models
│   │   ├── serializers.py # API serializers
│   │   ├── views.py       # API views
│   │   ├── urls.py        # URL routing
│   │   ├── admin.py       # Admin configuration
│   │   ├── apps.py        # App configuration
│   │   └── tests.py       # Test cases
│   ├── backend/           # Django project settings
│   ├── manage.py          # Django management script
│   ├── requirements.txt   # Python dependencies
│   └── README.md          # Backend documentation
├── frontend/              # React frontend
│   ├── public/           # Static files
│   ├── src/              # Source code
│   │   ├── api/         # API configuration
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── store/       # Redux store
│   │   ├── utils/       # Utility functions
│   │   ├── App.jsx      # Main component
│   │   └── index.js     # Entry point
│   ├── package.json     # Node dependencies
│   └── README.md        # Frontend documentation
├── venv/                 # Python virtual environment
└── README.md            # Project documentation
```

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd personal_finance_tracker
   ```

2. Set up the backend:
   ```bash
   cd Backend
   # Follow Backend/README.md for setup instructions
   ```

3. Set up the frontend:
   ```bash
   cd frontend
   # Follow frontend/README.md for setup instructions
   ```

4. Start the development servers:
   - Backend: `http://localhost:8000`
   - Frontend: `http://localhost:3000`

## API Documentation

The API documentation is available at `http://localhost:8000/api/docs/` when the backend server is running.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 