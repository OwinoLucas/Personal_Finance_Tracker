import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/categories/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch categories');
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
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
export const createCategory = (categoryData) => async (dispatch) => {
  try {
    const response = await axiosInstance.post('/api/categories/', categoryData);
    dispatch(addCategory(response.data));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const editCategory = (id, categoryData) => async (dispatch) => {
  try {
    const response = await axiosInstance.put(`/api/categories/${id}/`, categoryData);
    dispatch(updateCategory(response.data));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const removeCategory = (id) => async (dispatch) => {
  try {
    await axiosInstance.delete(`/api/categories/${id}/`);
    dispatch(deleteCategory(id));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export default categorySlice.reducer; 