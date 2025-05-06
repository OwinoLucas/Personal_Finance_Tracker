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
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg w-100" style={{ maxWidth: 800, borderRadius: '1rem' }}>
        <div className="card-body p-5">
          <h1 className="card-title text-center mb-4 fw-bold text-primary" style={{ fontSize: '2.2rem', letterSpacing: '0.02em' }}>
            Sign in
          </h1>
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
              error={error?.username}
            />
            <TextInput
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              error={error?.password}
            />
            <ErrorMessage>{error?.non_field_errors}</ErrorMessage>
            <Button type="submit" variant="primary" className="w-100 mb-3" style={{ fontWeight: 600, fontSize: '1.1rem' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            <div className="text-center mt-3">
              <span className="text-secondary">Don't have an account? </span>
              <Link to="/register" className="fw-bold text-primary text-decoration-underline">Sign Up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login; 