import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    addCategory: (state, action) => {
      state.categories.push(action.payload);
    },
    updateCategory: (state, action) => {
      const index = state.categories.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
    deleteCategory: (state, action) => {
      state.categories = state.categories.filter(c => c.id !== action.payload);
    },
  },
});

export const {
  setCategories,
  setLoading,
  setError,
  addCategory,
  updateCategory,
  deleteCategory,
} = categorySlice.actions;

// Async thunks
export const fetchCategories = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get('http://localhost:8000/api/categories/');
    dispatch(setCategories(response.data));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const createCategory = (categoryData) => async (dispatch) => {
  try {
    const response = await axios.post('http://localhost:8000/api/categories/', categoryData);
    dispatch(addCategory(response.data));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const editCategory = (id, categoryData) => async (dispatch) => {
  try {
    const response = await axios.put(`http://localhost:8000/api/categories/${id}/`, categoryData);
    dispatch(updateCategory(response.data));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const removeCategory = (id) => async (dispatch) => {
  try {
    await axios.delete(`http://localhost:8000/api/categories/${id}/`);
    dispatch(deleteCategory(id));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export default categorySlice.reducer; 