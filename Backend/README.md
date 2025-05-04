# Personal Finance Tracker - Backend

Django REST Framework backend for the Personal Finance Tracker application.

## Features

- RESTful API endpoints
- JWT Authentication
- MySQL Database Integration
- Transaction and Category Management
- Financial Summary Calculations
- Filtering and Search Capabilities
- Recurring Transaction Support

## Prerequisites

- Python 3.8 or higher
- MySQL Server
- pip (Python package manager)

## Setup Instructions

1. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure MySQL:
   - Create a new MySQL database
   - Update the database settings in `backend/settings.py`:
     ```python
     DATABASES = {
         'default': {
             'ENGINE': 'django.db.backends.mysql',
             'NAME': 'your_database_name',
             'USER': 'your_mysql_username',
             'PASSWORD': 'your_mysql_password',
             'HOST': 'localhost',
             'PORT': '3306',
         }
     }
     ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Create a superuser:
   ```bash
   python manage.py createsuperuser
   ```

6. Start the development server:
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000/api/`

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register/`
  - Register a new user
  - Required fields: username, email, password, password2

- `POST /api/auth/login/`
  - Login user
  - Required fields: username, password
  - Returns: token, user data

- `POST /api/auth/logout/`
  - Logout user
  - Requires authentication

### Transaction Endpoints

- `GET /api/transactions/`
  - List all transactions
  - Query parameters: 
    - start_date: Filter by start date
    - end_date: Filter by end date
    - type: Filter by transaction type (income/expense)
    - category: Filter by category ID

- `POST /api/transactions/`
  - Create a new transaction
  - Required fields: amount, description, transaction_type, category, date

- `GET /api/transactions/{id}/`
  - Get a specific transaction

- `PUT /api/transactions/{id}/`
  - Update a transaction

- `DELETE /api/transactions/{id}/`
  - Delete a transaction

- `GET /api/transactions/summary/`
  - Get financial summary
  - Returns: total_income, total_expenses, balance

### Category Endpoints

- `GET /api/categories/`
  - List all categories

- `POST /api/categories/`
  - Create a new category
  - Required fields: name

- `GET /api/categories/{id}/`
  - Get a specific category

- `PUT /api/categories/{id}/`
  - Update a category

- `DELETE /api/categories/{id}/`
  - Delete a category

## Testing the API

1. Start the development server:
   ```bash
   python manage.py runserver
   ```

2. Use tools like Postman or curl to test the endpoints:
   ```bash
   # Example: Register a new user
   curl -X POST http://localhost:8000/api/auth/register/ \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","email":"test@example.com","password":"testpass123","password2":"testpass123"}'
   ```

## Project Structure

```
Backend/
├── finance_tracker/        # Main Django app
│   ├── migrations/        # Database migrations
│   ├── models.py          # Database models
│   ├── serializers.py     # API serializers
│   ├── views.py           # API views
│   ├── urls.py            # URL routing
│   ├── admin.py           # Admin configuration
│   ├── apps.py            # App configuration
│   ├── tests.py           # Test cases
│   └── __init__.py        # Package initialization
├── backend/               # Django project settings
│   ├── settings.py        # Project settings
│   ├── urls.py            # Project URL configuration
│   ├── wsgi.py            # WSGI configuration
│   └── __init__.py        # Package initialization
├── manage.py              # Django management script
├── requirements.txt       # Python dependencies
└── README.md              # This file
```

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
python manage.py test
```

## Contributing

Please read the main README.md for contribution guidelines. 