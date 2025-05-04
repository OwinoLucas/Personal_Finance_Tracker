import { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../store/slices/categorySlice';

function Categories() {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.categories);
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '' });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleOpen = () => {
    setOpen(true);
    setEditingCategory(null);
    setFormData({ name: '' });
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCategory(null);
    setFormData({ name: '' });
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name });
    setOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      dispatch(updateCategory({ id: editingCategory.id, ...formData }));
    } else {
      dispatch(createCategory(formData));
    }
    handleClose();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      dispatch(deleteCategory(id));
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  return (
    <Fragment>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}>
          <Typography variant="h4">Categories</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpen}
            size="large"
          >
            Add Category
          </Button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
          {categories.map((category) => (
            <div
              key={category.id}
              style={{
                flex: '1 1 calc(25% - 1.5rem)',
                minWidth: '250px',
                display: 'flex',
              }}
            >
              <Card elevation={3} style={{ width: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {category.name}
                  </Typography>
                </CardContent>
                <CardActions>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(category)}
                      size="large"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(category.id)}
                      size="large"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </CardActions>
              </Card>
            </div>
          ))}
        </div>

        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              minHeight: '300px',
              maxHeight: '400px'
            }
          }}
        >
          <DialogTitle>
            {editingCategory ? 'Edit Category' : 'Add Category'}
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
              <TextField
                autoFocus
                margin="dense"
                label="Category Name"
                type="text"
                fullWidth
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                required
                sx={{ mb: 3 }}
              />
            </form>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleClose} variant="outlined" size="large">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              size="large"
            >
              {editingCategory ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Fragment>
  );
}

export default Categories;
