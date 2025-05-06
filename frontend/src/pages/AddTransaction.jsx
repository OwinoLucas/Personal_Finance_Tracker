import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Card,
  CardContent,
  Typography,
  FormControlLabel,
  Switch,
  Box,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addTransaction } from '../store/slices/transactionSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import Button from '../components/ui/Button';
import TextInput from '../components/ui/TextInput';

function AddTransaction() {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    transaction_type: 'expense',
    category: '',
    date: new Date(),
    is_recurring: false,
    frequency: '',
    end_date: null,
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      date,
    }));
  };

  const handleEndDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      end_date: date,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addTransaction(formData));
    setFormData({
      amount: '',
      description: '',
      transaction_type: 'expense',
      category: '',
      date: new Date(),
      is_recurring: false,
      frequency: '',
      end_date: null,
    });
  };

  return (
    <div className="container my-4">
      <div className="row g-3 mb-4">
        <div className="col">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">Add New Transaction</h5>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_recurring}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        is_recurring: e.target.checked
                      }))}
                    />
                  }
                  label="Recurring Transaction"
                />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12">
                    <TextInput
                      label="Amount"
                      name="amount"
                      type="number"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <TextInput
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12 col-sm-6">
                    <FormControl fullWidth>
                      <InputLabel>Type</InputLabel>
                      <Select
                        name="transaction_type"
                        value={formData.transaction_type}
                        onChange={handleChange}
                        required
                      >
                        <MenuItem value="income">Income</MenuItem>
                        <MenuItem value="expense">Expense</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div className="col-12 col-sm-6">
                    <FormControl fullWidth>
                      <InputLabel>Category</InputLabel>
                      <Select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        {categories.map((category) => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="col-12 col-sm-6">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Date"
                        value={formData.date}
                        onChange={handleDateChange}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </LocalizationProvider>
                  </div>
                  {formData.is_recurring && (
                    <>
                      <div className="col-12 col-sm-6">
                        <FormControl fullWidth>
                          <InputLabel>Frequency</InputLabel>
                          <Select
                            name="frequency"
                            value={formData.frequency}
                            onChange={handleChange}
                            required
                          >
                            <MenuItem value="daily">Daily</MenuItem>
                            <MenuItem value="weekly">Weekly</MenuItem>
                            <MenuItem value="monthly">Monthly</MenuItem>
                            <MenuItem value="yearly">Yearly</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                      <div className="col-12 col-sm-6">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            label="End Date"
                            value={formData.end_date}
                            onChange={handleEndDateChange}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                          />
                        </LocalizationProvider>
                      </div>
                    </>
                  )}
                  <div className="col-12 d-flex justify-content-end">
                    <Button type="submit" className="btn-primary">
                      Add Transaction
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTransaction;
