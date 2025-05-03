import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  fetchTransactions,
  fetchSummary,
} from '../store/slices/transactionSlice';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function Dashboard() {
  const dispatch = useDispatch();
  const { summary, transactions } = useSelector((state) => state.transactions);

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchSummary());
  }, [dispatch]);

  const categoryData = transactions.reduce((acc, transaction) => {
    if (transaction.transaction_type === 'expense') {
      const category = transaction.category_name || 'Uncategorized';
      acc[category] = (acc[category] || 0) + parseFloat(transaction.amount);
    }
    return acc;
  }, {});

  const pieData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Income
              </Typography>
              <Typography variant="h5" component="h2" color="primary">
                ${summary.totalIncome.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Expenses
              </Typography>
              <Typography variant="h5" component="h2" color="error">
                ${summary.totalExpenses.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Net Balance
              </Typography>
              <Typography
                variant="h5"
                component="h2"
                color={summary.netBalance >= 0 ? 'success.main' : 'error.main'}
              >
                ${summary.netBalance.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Expenses by Category
            </Typography>
            <Box sx={{ height: 300 }}>
              <PieChart width={400} height={300}>
                <Pie
                  data={pieData}
                  cx={200}
                  cy={150}
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            <TransactionList />
          </Paper>
        </Grid>

        {/* Add Transaction Form */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Add New Transaction
            </Typography>
            <TransactionForm />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 