# Personal Finance Tracker

A full-stack web application for tracking personal finances, built with Django and React.

## Features

- User authentication (login/register)
- Track income and expenses
- Categorize transactions
- View financial summaries and charts
- Responsive design

## Tech Stack

### Backend
- Django
- Django REST framework
- MySQL 

### Frontend
- React
- Redux Toolkit
- Material-UI
- Recharts
- React Router

## Setup Instructions

### Backend Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run migrations:
```bash
python manage.py migrate
```

4. Start the development server:
```bash
python manage.py runserver
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## API Endpoints

### Authentication
- POST /api/auth/register/ - Register a new user
- POST /api/auth/login/ - Login user
- POST /api/auth/logout/ - Logout user

### Transactions
- GET /api/transactions/ - List all transactions
- POST /api/transactions/ - Create a new transaction
- GET /api/transactions/{id}/ - Get a specific transaction
- PUT /api/transactions/{id}/ - Update a transaction
- DELETE /api/transactions/{id}/ - Delete a transaction
- GET /api/transactions/summary/ - Get financial summary

### Categories
- GET /api/categories/ - List all categories
- POST /api/categories/ - Create a new category
- GET /api/categories/{id}/ - Get a specific category
- PUT /api/categories/{id}/ - Update a category
- DELETE /api/categories/{id}/ - Delete a category

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///db.sqlite3
```

## License

MIT 