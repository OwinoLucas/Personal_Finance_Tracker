import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/transactions/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching transactions');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'transactions/fetchCategories',
  async () => {
    const response = await axiosInstance.get('/api/categories/');
    return response.data;
  }
);

export const fetchSummary = createAsyncThunk(
  'transactions/fetchSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/transactions/summary/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching summary');
    }
  }
);

export const addTransaction = createAsyncThunk(
  'transactions/addTransaction',
  async (transactionData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/transactions/', transactionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error adding transaction');
    }
  }
);

export const updateTransaction = createAsyncThunk(
  'transactions/updateTransaction',
  async ({ id, transactionData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/api/transactions/${id}/`, transactionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error updating transaction');
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/transactions/${id}/`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error deleting transaction');
    }
  }
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    transactions: [],
    categories: [],
    summary: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      // Fetch Summary
      .addCase(fetchSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Transaction
      .addCase(addTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.push(action.payload);
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Transaction
      .addCase(updateTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.transactions.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Transaction
      .addCase(deleteTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = state.transactions.filter(t => t.id !== action.payload);
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default transactionSlice.reducer; 