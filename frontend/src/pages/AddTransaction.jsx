import { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { addTransaction } from '../store/slices/transactionSlice';
import { fetchCategories } from '../store/slices/categorySlice';

function AddTransaction() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories } = useSelector((state) => state.categories);
  const { loading, error } = useSelector((state) => state.transactions);

  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    transaction_type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addTransaction(formData))
      .unwrap()
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.error('Error adding transaction:', error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <CircularProgress />
      </div>
    );
  }

  return (
    <Fragment>
      <div className="container" style={{ padding: '2rem' }}>
        <div className="card" style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div className="form-header">
            <Typography variant="h4" gutterBottom>
              Add New Transaction
            </Typography>

            {error && (
              <Alert severity="error" style={{ marginBottom: '1.5rem' }}>
                {error}
              </Alert>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div className="form-field" style={{ flex: '1 1 45%' }}>
                <TextField
                  fullWidth
                  required
                  label="Amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: 'KES ',
                  }}
                />
              </div>
              <div className="form-field" style={{ flex: '1 1 45%' }}>
                <TextField
                  fullWidth
                  required
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="form-field" style={{ flex: '1 1 45%' }}>
                <TextField
                  fullWidth
                  required
                  select
                  label="Type"
                  name="transaction_type"
                  value={formData.transaction_type}
                  onChange={handleChange}
                >
                  <MenuItem value="income">Income</MenuItem>
                  <MenuItem value="expense">Expense</MenuItem>
                </TextField>
              </div>
              <div className="form-field" style={{ flex: '1 1 45%' }}>
                <TextField
                  fullWidth
                  required
                  select
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <div className="form-field" style={{ flex: '1 1 45%' }}>
                <TextField
                  fullWidth
                  required
                  label="Date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>
            </div>

            <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Add Transaction
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
}

export default AddTransaction;
