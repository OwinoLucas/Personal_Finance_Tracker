import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Box,
  Pagination,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  fetchTransactions,
  fetchSummary,
} from '../store/slices/transactionSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import AddTransaction from './AddTransaction';

function Dashboard() {
  const dispatch = useDispatch();
  const { summary, transactions, loading, error } = useSelector((state) => state.transactions);
  const { categories } = useSelector((state) => state.categories);
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    type: '',
    category: '',
  });
  const [categoriesPage, setCategoriesPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchSummary());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filters.startDate && new Date(transaction.date) < filters.startDate) return false;
    if (filters.endDate && new Date(transaction.date) > filters.endDate) return false;
    if (filters.type && transaction.transaction_type !== filters.type) return false;
    if (filters.category && transaction.category !== filters.category) return false;
    return true;
  });

  const categoryData = filteredTransactions.reduce((acc, transaction) => {
    if (transaction.transaction_type === 'expense') {
      const category = transaction.category_name || 'Uncategorized';
      acc[category] = (acc[category] || 0) + parseFloat(transaction.amount);
    }
    return acc;
  }, {});

  const totalExpenses = Object.values(categoryData).reduce((sum, amount) => sum + amount, 0);
  
  // Convert categoryData to array and sort by amount
  const sortedCategories = Object.entries(categoryData)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);

  // Calculate pagination for categories
  const totalCategoryPages = Math.ceil(sortedCategories.length / itemsPerPage);
  const paginatedCategories = sortedCategories.slice(
    (categoriesPage - 1) * itemsPerPage,
    categoriesPage * itemsPerPage
  );

  const handleCategoryPageChange = (event, value) => {
    setCategoriesPage(value);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '1rem' }}>
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="card-title">Total Balance</h6>
              <h4 className="text-primary">KES {summary?.net_balance || 0}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="card-title">Total Income</h6>
              <h4 className="text-success">KES {summary?.total_income || 0}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="card-title">Total Expenses</h6>
              <h4 className="text-danger">KES {summary?.total_expenses || 0}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-3">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={filters.startDate}
                  onChange={(date) => handleFilterChange('startDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </div>
            <div className="col-md-3">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={filters.endDate}
                  onChange={(date) => handleFilterChange('endDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </div>
            <div className="col-md-3">
              <TextField
                select
                label="Type"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                fullWidth
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </TextField>
            </div>
            <div className="col-md-3">
              <TextField
                select
                label="Category"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                fullWidth
              >
                <MenuItem value="">All</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses by Category & Recent Transactions */}
      <div className="row g-3 mb-4">
        {/* Expenses by Category Card */}
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="card-title">Expenses by Category</h6>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <List>
                  {paginatedCategories.map(({ name, amount }) => (
                    <div key={name} className="mb-3">
                      <ListItem disablePadding>
                        <ListItemText
                          primary={name}
                          secondary={`KES ${amount.toFixed(2)} (${((amount / totalExpenses) * 100).toFixed(1)}%)`}
                        />
                        <div style={{ width: '100%', maxWidth: 200 }}>
                          <LinearProgress
                            variant="determinate"
                            value={(amount / totalExpenses) * 100}
                            sx={{ height: 10, borderRadius: 5, backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
                          />
                        </div>
                      </ListItem>
                    </div>
                  ))}
                </List>
              </div>
              <div className="d-flex justify-content-center mt-2">
                <Pagination
                  count={totalCategoryPages}
                  page={categoriesPage}
                  onChange={handleCategoryPageChange}
                  color="primary"
                  size="small"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions Card */}
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="card-title">Recent Transactions</h6>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <List>
                  {filteredTransactions.slice(0, itemsPerPage).map((transaction) => (
                    <div key={transaction.id} className="mb-3">
                      <ListItem disablePadding>
                        <ListItemText
                          primary={transaction.description}
                          secondary={`${new Date(transaction.date).toLocaleDateString()} - KES ${transaction.amount}`}
                        />
                        <Typography color={transaction.transaction_type === 'income' ? 'success.main' : 'error.main'}>
                          {transaction.transaction_type}
                        </Typography>
                      </ListItem>
                    </div>
                  ))}
                </List>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Transaction Form */}
      <div>
        <AddTransaction />
      </div>
    </div>   
  );
}

export default Dashboard;
