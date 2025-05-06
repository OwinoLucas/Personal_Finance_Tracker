import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../store/slices/categorySlice';
import Button from '../components/ui/Button';
import TextInput from '../components/ui/TextInput';

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
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger" role="alert">{error}</div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Categories</h2>
        <Button onClick={handleOpen} className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i> Add Category
        </Button>
      </div>
      <div className="row g-4">
        {categories.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info text-center my-4">
              <i className="bi bi-emoji-smile fs-3 mb-2 d-block"></i>
              No categories yet. Click <strong>Add Category</strong> to create your first one!
            </div>
          </div>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column justify-content-between">
                  <h5 className="card-title">{category.name}</h5>
                  <div className="mt-3 d-flex gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm d-flex align-items-center"
                      onClick={() => handleEdit(category)}
                    >
                      <i className="bi bi-pencil me-1"></i> Edit
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm d-flex align-items-center"
                      onClick={() => handleDelete(category.id)}
                    >
                      <i className="bi bi-trash me-1"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for Add/Edit Category */}
      <div className={`modal fade${open ? ' show d-block' : ''}`} tabIndex="-1" style={open ? { background: 'rgba(0,0,0,0.5)' } : {}}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{editingCategory ? 'Edit Category' : 'Add Category'}</h5>
              <button type="button" className="btn-close" onClick={handleClose}></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <TextInput
                  label="Category Name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ name: e.target.value })}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleClose}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingCategory ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Categories;
