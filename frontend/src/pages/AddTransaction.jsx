import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormControlLabel, Switch} from '@mui/material';
import { addTransaction, updateTransaction, deleteTransaction } from '../store/slices/transactionSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import Button from '../components/ui/Button';
import TextInput from '../components/ui/TextInput';
import ErrorMessage from '../components/ui/ErrorMessage';

function AddTransaction({ hideTransactionsTable = false }) {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  const { transactions } = useSelector((state) => state.transactions);
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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

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

    // Convert date and end_date to ISO strings if they are Date objects, otherwise use as is
    const formatDate = (val) => {
      if (!val) return null;
      if (typeof val === 'string') return val; // already in YYYY-MM-DD
      if (val instanceof Date) return val.toISOString().split('T')[0];
      return '';
    };

    const payload = {
      ...formData,
      date: formatDate(formData.date),
      end_date: formatDate(formData.end_date),
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

  const handleEdit = (transaction) => {
    setEditData({ ...transaction });
    setEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditDateChange = (e) => {
    setEditData((prev) => ({ ...prev, date: e.target.value }));
  };

  const handleEditEndDateChange = (e) => {
    setEditData((prev) => ({ ...prev, end_date: e.target.value }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const formatDate = (val) => {
      if (!val) return null;
      if (typeof val === 'string') return val;
      if (val instanceof Date) return val.toISOString().split('T')[0];
      return '';
    };
    dispatch(updateTransaction({
      id: editData.id,
      transactionData: {
        ...editData,
        date: formatDate(editData.date),
        end_date: formatDate(editData.end_date),
      },
    }));
    setEditModalOpen(false);
    setEditData(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      dispatch(deleteTransaction(id));
    }
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
      {!hideTransactionsTable && (
        <>
          <hr className="my-4" />
          <h5 className="mb-3 fw-bold">All Transactions</h5>
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Recurring</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr><td colSpan="7" className="text-center">No transactions yet.</td></tr>
                ) : (
                  transactions.map((t) => (
                    <tr key={t.id}>
                      <td>{t.date}</td>
                      <td>{t.description}</td>
                      <td>{t.amount}</td>
                      <td>{t.transaction_type}</td>
                      <td>{categories.find(c => c.id === t.category)?.name || t.category}</td>
                      <td>{t.is_recurring ? 'Yes' : 'No'}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(t)}>
                          Edit
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(t.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {editModalOpen && editData && (
            <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Transaction</h5>
                    <button type="button" className="btn-close" onClick={() => setEditModalOpen(false)}></button>
                  </div>
                  <form onSubmit={handleEditSubmit}>
                    <div className="modal-body">
                      <div className="mb-3">
                        <label className="form-label">Amount</label>
                        <input type="number" className="form-control" name="amount" value={editData.amount} onChange={handleEditChange} required />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <input type="text" className="form-control" name="description" value={editData.description} onChange={handleEditChange} required />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Type</label>
                        <select className="form-select" name="transaction_type" value={editData.transaction_type} onChange={handleEditChange} required>
                          <option value="income">Income</option>
                          <option value="expense">Expense</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Category</label>
                        <select className="form-select" name="category" value={editData.category} onChange={handleEditChange} required>
                          <option value="">Select category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Date</label>
                        <input type="date" className="form-control" name="date" value={editData.date} onChange={handleEditDateChange} required />
                      </div>
                      {editData.is_recurring && (
                        <>
                          <div className="mb-3">
                            <label className="form-label">Frequency</label>
                            <select className="form-select" name="frequency" value={editData.frequency} onChange={handleEditChange} required>
                              <option value="">Select frequency</option>
                              <option value="daily">Daily</option>
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                              <option value="yearly">Yearly</option>
                            </select>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">End Date</label>
                            <input type="date" className="form-control" name="end_date" value={editData.end_date || ''} onChange={handleEditEndDateChange} required />
                          </div>
                        </>
                      )}
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={() => setEditModalOpen(false)}>Cancel</button>
                      <button type="submit" className="btn btn-primary">Save Changes</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AddTransaction;
