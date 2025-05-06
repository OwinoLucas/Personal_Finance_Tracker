import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions, fetchSummary } from '../store/slices/transactionSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import AddTransaction from './AddTransaction';

function Dashboard() {
  const dispatch = useDispatch();
  const { summary, transactions, loading, error } = useSelector((state) => state.transactions);
  const { categories } = useSelector((state) => state.categories);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    startDate: '',
    endDate: '',
  });
  const [categoriesPage, setCategoriesPage] = useState(1);
  const itemsPerPage = 5;
  const [transactionsPage, setTransactionsPage] = useState(1);
  const transactionsPerPage = 5;

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchSummary());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    setTransactionsPage(1);
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filters.type && transaction.transaction_type !== filters.type) return false;
    if (filters.category && transaction.category !== filters.category) return false;
    if (filters.startDate && new Date(transaction.date) < new Date(filters.startDate)) return false;
    if (filters.endDate && new Date(transaction.date) > new Date(filters.endDate)) return false;
    return true;
  });

  const sortedFilteredTransactions = [...filteredTransactions].sort((a, b) => new Date(b.date) - new Date(a.date));

  const categoryData = filteredTransactions.reduce((acc, transaction) => {
    if (transaction.transaction_type === 'expense') {
      const category = transaction.category_name || 'Uncategorized';
      acc[category] = (acc[category] || 0) + parseFloat(transaction.amount);
    }
    return acc;
  }, {});

  const totalExpenses = Object.values(categoryData).reduce((sum, amount) => sum + amount, 0);
  const sortedCategories = Object.entries(categoryData)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);
  const totalCategoryPages = Math.ceil(sortedCategories.length / itemsPerPage);
  const paginatedCategories = sortedCategories.slice(
    (categoriesPage - 1) * itemsPerPage,
    categoriesPage * itemsPerPage
  );

  const totalTransactionPages = Math.ceil(sortedFilteredTransactions.length / transactionsPerPage);
  const paginatedTransactions = sortedFilteredTransactions.slice(
    (transactionsPage - 1) * transactionsPerPage,
    transactionsPage * transactionsPerPage
  );

  const handleCategoryPageChange = (e) => {
    setCategoriesPage(Number(e.target.getAttribute('data-page')));
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-4" role="alert">{error}</div>
    );
  }

  return (
    <div className="container py-4">
      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body d-flex align-items-center">
              <i className="bi bi-wallet2 text-primary fs-2 me-3"></i>
              <div>
                <h6 className="card-title mb-1 fw-bold">Total Balance</h6>
                <h4 className="text-primary mb-0">KES {summary?.net_balance || 0}</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body d-flex align-items-center">
              <i className="bi bi-arrow-down-circle text-success fs-2 me-3"></i>
              <div>
                <h6 className="card-title mb-1 fw-bold">Total Income</h6>
                <h4 className="text-success mb-0">KES {summary?.total_income || 0}</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body d-flex align-items-center">
              <i className="bi bi-arrow-up-circle text-danger fs-2 me-3"></i>
              <div>
                <h6 className="card-title mb-1 fw-bold">Total Expenses</h6>
                <h4 className="text-danger mb-0">KES {summary?.total_expenses || 0}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-3">
              <label className="form-label">Type</label>
              <select
                className="form-select"
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
              >
                <option value="">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">All</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Expenses by Category Card */}
        <div className="col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h6 className="card-title mb-3 fw-bold"><i className="bi bi-pie-chart-fill me-2"></i>Expenses by Category</h6>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {paginatedCategories.length === 0 ? (
                  <div className="alert alert-info text-center my-4">
                    <i className="bi bi-emoji-smile fs-3 mb-2 d-block"></i>
                    No expenses recorded yet.
                  </div>
                ) : (
                  paginatedCategories.map(({ name, amount }) => (
                    <div key={name} className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span>{name}</span>
                        <span className="fw-semibold">KES {amount.toFixed(2)} <span className="text-muted">({((amount / totalExpenses) * 100).toFixed(1)}%)</span></span>
                      </div>
                      <div className="progress" style={{ height: 10 }}>
                        <div
                          className="progress-bar bg-danger"
                          role="progressbar"
                          style={{ width: `${(amount / totalExpenses) * 100}%` }}
                          aria-valuenow={(amount / totalExpenses) * 100}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {/* Pagination */}
              {paginatedCategories.length > 0 && (
                <div className="d-flex justify-content-center mt-2 align-items-center gap-1">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setCategoriesPage(categoriesPage - 1)}
                    disabled={categoriesPage === 1}
                    aria-label="Previous"
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                  {[...Array(totalCategoryPages)].map((_, idx) => (
                    <button
                      key={idx}
                      className={`btn btn-sm mx-1 ${categoriesPage === idx + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
                      data-page={idx + 1}
                      onClick={handleCategoryPageChange}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setCategoriesPage(categoriesPage + 1)}
                    disabled={categoriesPage === totalCategoryPages || totalCategoryPages === 0}
                    aria-label="Next"
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Transactions Card */}
        <div className="col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h6 className="card-title mb-3 fw-bold"><i className="bi bi-clock-history me-2"></i>Recent Transactions</h6>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {paginatedTransactions.length === 0 ? (
                  <div className="alert alert-info text-center my-4">
                    <i className="bi bi-emoji-smile fs-3 mb-2 d-block"></i>
                    No transactions yet. Start by adding your first transaction!
                    {/* <div className="mt-3">
                      <a href="/transactions/new" className="btn btn-primary">
                        <i className="bi bi-plus-circle me-2"></i> Add Transaction
                      </a>
                    </div> */}
                  </div>
                ) : (
                  paginatedTransactions.map((transaction) => (
                    <div key={transaction.id} className="mb-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <span className={`me-2 ${transaction.transaction_type === 'income' ? 'text-success' : 'text-danger'}`}>
                            <i className={`bi ${transaction.transaction_type === 'income' ? 'bi-arrow-down-circle' : 'bi-arrow-up-circle'}`}></i>
                          </span>
                          <span className="fw-semibold">{transaction.description}</span>
                          <span className="badge bg-light text-secondary ms-2">
                            {typeof transaction.date === 'string' || transaction.date instanceof String
                              ? new Date(transaction.date).toLocaleDateString()
                              : 'Invalid date'}
                          </span>
                        </div>
                        <span className={`fw-bold ${transaction.transaction_type === 'income' ? 'text-success' : 'text-danger'}`}>KES {transaction.amount}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {/* Pagination for Recent Transactions */}
              {paginatedTransactions.length > 0 && totalTransactionPages > 1 && (
                <div className="d-flex justify-content-center mt-2 align-items-center gap-1">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setTransactionsPage(transactionsPage - 1)}
                    disabled={transactionsPage === 1}
                    aria-label="Previous"
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                  {[...Array(totalTransactionPages)].map((_, idx) => (
                    <button
                      key={idx}
                      className={`btn btn-sm mx-1 ${transactionsPage === idx + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setTransactionsPage(idx + 1)}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setTransactionsPage(transactionsPage + 1)}
                    disabled={transactionsPage === totalTransactionPages}
                    aria-label="Next"
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Transaction Form */}
      <div className="mt-4">
        <AddTransaction />
      </div>
    </div>
  );
}

export default Dashboard;
