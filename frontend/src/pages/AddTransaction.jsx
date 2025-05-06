import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormControlLabel, Switch} from '@mui/material';
import { addTransaction } from '../store/slices/transactionSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import Button from '../components/ui/Button';
import TextInput from '../components/ui/TextInput';
import ErrorMessage from '../components/ui/ErrorMessage';

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
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const validate = () => {
    const newErrors = {};
    if (!formData.amount) newErrors.amount = 'Amount is required.';
    if (!formData.description) newErrors.description = 'Description is required.';
    if (!formData.transaction_type) newErrors.transaction_type = 'Type is required.';
    if (!formData.category) newErrors.category = 'Category is required.';
    if (!formData.date) newErrors.date = 'Date is required.';
    if (formData.is_recurring) {
      if (!formData.frequency) newErrors.frequency = 'Frequency is required for recurring transactions.';
      if (!formData.end_date) newErrors.end_date = 'End date is required for recurring transactions.';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      date,
    }));
    setErrors((prev) => ({ ...prev, date: undefined }));
  };

  const handleEndDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      end_date: date,
    }));
    setErrors((prev) => ({ ...prev, end_date: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setGeneralError('Please fix the errors below.');
      return;
    }
    setErrors({});
    setGeneralError('');
    const payload = {
      ...formData,
      date: formData.date ? formData.date.toISOString().split('T')[0] : null,
      end_date: formData.end_date ? formData.end_date.toISOString().split('T')[0] : null,
    };
    dispatch(addTransaction(payload));
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
                <h5 className="card-title mb-0 fw-bold">Add New Transaction</h5>
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
              <form onSubmit={handleSubmit} noValidate>
                {generalError && <ErrorMessage>{generalError}</ErrorMessage>}
                <div className="row g-3">
                  <div className="col-12">
                    <TextInput
                      label="Amount"
                      name="amount"
                      type="number"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                      error={errors.amount}
                    />
                  </div>
                  <div className="col-12">
                    <TextInput
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      error={errors.description}
                    />
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="mb-3">
                      <label className="form-label">Type</label>
                      <select
                        className={`form-select${errors.transaction_type ? ' is-invalid' : ''}`}
                        name="transaction_type"
                        value={formData.transaction_type}
                        onChange={handleChange}
                        required
                      >
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                      </select>
                      {errors.transaction_type && <div className="invalid-feedback">{errors.transaction_type}</div>}
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <select
                        className={`form-select${errors.category ? ' is-invalid' : ''}`}
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="mb-3">
                      <label className="form-label">Date</label>
                      <input
                        type="date"
                        className={`form-control${errors.date ? ' is-invalid' : ''}`}
                        name="date"
                        value={formData.date ? new Date(formData.date).toISOString().split('T')[0] : ''}
                        onChange={handleChange}
                        required
                      />
                      {errors.date && <div className="invalid-feedback">{errors.date}</div>}
                    </div>
                  </div>
                  {formData.is_recurring && (
                    <>
                      <div className="col-12 col-sm-6">
                        <div className="mb-3">
                          <label className="form-label">Frequency</label>
                          <select
                            className={`form-select${errors.frequency ? ' is-invalid' : ''}`}
                            name="frequency"
                            value={formData.frequency}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select frequency</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                          </select>
                          {errors.frequency && <div className="invalid-feedback">{errors.frequency}</div>}
                        </div>
                      </div>
                      <div className="col-12 col-sm-6">
                        <div className="mb-3">
                          <label className="form-label">End Date</label>
                          <input
                            type="date"
                            className={`form-control${errors.end_date ? ' is-invalid' : ''}`}
                            name="end_date"
                            value={formData.end_date ? new Date(formData.end_date).toISOString().split('T')[0] : ''}
                            onChange={handleChange}
                            required
                          />
                          {errors.end_date && <div className="invalid-feedback">{errors.end_date}</div>}
                        </div>
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
