import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async () => {
    const response = await axios.get(`${API_URL}/transactions/`);
    return response.data;
  }
);

export const fetchCategories = createAsyncThunk(
  'transactions/fetchCategories',
  async () => {
    const response = await axios.get(`${API_URL}/categories/`);
    return response.data;
  }
);

export const fetchSummary = createAsyncThunk(
  'transactions/fetchSummary',
  async () => {
    const response = await axios.get(`${API_URL}/transactions/summary/`);
    return response.data;
  }
);

export const addTransaction = createAsyncThunk(
  'transactions/addTransaction',
  async (transactionData) => {
    const response = await axios.post(`${API_URL}/transactions/`, transactionData);
    return response.data;
  }
);

export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (id) => {
    await axios.delete(`${API_URL}/transactions/${id}/`);
    return id;
  }
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    transactions: [],
    categories: [],
    summary: {
      totalIncome: 0,
      totalExpenses: 0,
      netBalance: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      // Fetch Summary
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.summary = action.payload;
      })
      // Add Transaction
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.transactions.push(action.payload);
      })
      // Delete Transaction
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(
          (transaction) => transaction.id !== action.payload
        );
      });
  },
});

export default transactionSlice.reducer; 