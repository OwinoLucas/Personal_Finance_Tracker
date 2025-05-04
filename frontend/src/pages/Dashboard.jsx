import { useEffect, Fragment, useState } from 'react';
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
    <Fragment>
      <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Summary Cards */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <Card style={{ minWidth: '250px', flex: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Total Balance</Typography>
              <Typography variant="h4" color="primary">
                KES {summary?.net_balance || 0}
              </Typography>
            </CardContent>
          </Card>
          <Card style={{ minWidth: '250px', flex: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Total Income</Typography>
              <Typography variant="h4" color="success.main">
                KES {summary?.total_income || 0}
              </Typography>
            </CardContent>
          </Card>
          <Card style={{ minWidth: '250px', flex: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Total Expenses</Typography>
              <Typography variant="h4" color="error.main">
                KES {summary?.total_expenses || 0}
              </Typography>
            </CardContent>
          </Card>
        </div>

        {/* Filter Section */}
        <Card style={{ marginBottom: '2rem' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={filters.startDate}
                  onChange={(date) => handleFilterChange('startDate', date)}
                  renderInput={(params) => <TextField {...params} />}
                />
                <DatePicker
                  label="End Date"
                  value={filters.endDate}
                  onChange={(date) => handleFilterChange('endDate', date)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              <TextField
                select
                label="Type"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                style={{ minWidth: 120 }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </TextField>
              <TextField
                select
                label="Category"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                style={{ minWidth: 120 }}
              >
                <MenuItem value="">All</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </CardContent>
        </Card>

        {/* Expenses by Category & Recent Transactions */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {/* Expenses by Category Card */}
          <Card style={{ flex: 1, minWidth: '300px', maxHeight: '400px' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Expenses by Category</Typography>
              <div style={{ 
                maxHeight: '300px', 
                overflowY: 'auto',
                paddingRight: '8px',
                scrollbarWidth: 'thin',
                scrollbarColor: '#888 #f1f1f1'
              }}>
                <List>
                  {paginatedCategories.map(({ name, amount }) => (
                    <div key={name} style={{ marginBottom: '1rem' }}>
                      <ListItem disablePadding>
                        <ListItemText
                          primary={name}
                          secondary={`KES ${amount.toFixed(2)} (${((amount / totalExpenses) * 100).toFixed(1)}%)`}
                        />
                        <div style={{ width: '100%', maxWidth: 200 }}>
                          <LinearProgress
                            variant="determinate"
                            value={(amount / totalExpenses) * 100}
                            sx={{
                              height: 10,
                              borderRadius: 5,
                              backgroundColor: 'rgba(0, 0, 0, 0.1)',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: 'primary.main',
                              },
                            }}
                          />
                        </div>
                      </ListItem>
                    </div>
                  ))}
                </List>
              </div>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination
                  count={totalCategoryPages}
                  page={categoriesPage}
                  onChange={handleCategoryPageChange}
                  color="primary"
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>

          {/* Recent Transactions Card */}
          <Card style={{ flex: 1, minWidth: '300px', maxHeight: '400px' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Transactions</Typography>
              <div style={{ 
                maxHeight: '300px', 
                overflowY: 'auto',
                paddingRight: '8px',
                scrollbarWidth: 'thin',
                scrollbarColor: '#888 #f1f1f1'
              }}>
                <List>
                  {filteredTransactions.slice(0, itemsPerPage).map((transaction) => (
                    <div key={transaction.id} style={{ marginBottom: '1rem' }}>
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
            </CardContent>
          </Card>
        </div>

        {/* Add Transaction Form */}
        <div>
          <AddTransaction />
        </div>
      </div>
    </Fragment>
  );
}

export default Dashboard;
