import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import ErrorMessage from '../components/ui/ErrorMessage';
import Button from '../components/ui/Button';
import TextInput from '../components/ui/TextInput';
import { login } from '../store/slices/authSlice';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(formData));
    if (!result.error) {
      navigate('/');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow w-100" style={{ maxWidth: 400 }}>
        <div className="card-body">
          <h1 className="card-title text-center mb-4">Sign in</h1>
          <form onSubmit={handleSubmit}>
            <TextInput
              label="Username"
              name="username"
              type="text"
              autoComplete="username"
              autoFocus
              required
              value={formData.username}
              onChange={handleChange}
            />
            <TextInput
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
            />
            <ErrorMessage>{error}</ErrorMessage>
            <Button type="submit" variant="primary" className="w-100 mb-3">
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            <div className="text-center">
              <span className="text-secondary">Don't have an account? </span>
              <Link to="/register" className="text-primary">Sign Up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login; 