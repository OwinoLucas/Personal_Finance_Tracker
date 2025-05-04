import { useEffect, Fragment } from 'react';
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
} from '@mui/material';
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

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchSummary());
    dispatch(fetchCategories());
  }, [dispatch]);

  const categoryData = transactions.reduce((acc, transaction) => {
    if (transaction.transaction_type === 'expense') {
      const category = transaction.category_name || 'Uncategorized';
      acc[category] = (acc[category] || 0) + parseFloat(transaction.amount);
    }
    return acc;
  }, {});

  const totalExpenses = Object.values(categoryData).reduce((sum, amount) => sum + amount, 0);

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

        {/* Expenses by Category & Recent Transactions */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <Card style={{ flex: 1, minWidth: '300px' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Expenses by Category</Typography>
              <List>
                {Object.entries(categoryData).map(([category, amount]) => (
                  <div key={category} style={{ marginBottom: '1rem' }}>
                    <ListItem disablePadding>
                      <ListItemText
                        primary={category}
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
            </CardContent>
          </Card>

          <Card style={{ flex: 1, minWidth: '300px' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Transactions</Typography>
              <List>
                {transactions.slice(0, 5).map((transaction) => (
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
