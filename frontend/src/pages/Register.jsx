import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import ErrorMessage from '../components/ui/ErrorMessage';
import Button from '../components/ui/Button';
import TextInput from '../components/ui/TextInput';
import { register } from '../store/slices/authSlice';

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    setLocalError('');
    const result = await dispatch(register(formData));
    if (!result.error) {
      navigate('/');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg w-100" style={{ maxWidth: 800, borderRadius: '1rem' }}>
        <div className="card-body p-5">
          <h1 className="card-title text-center mb-4 fw-bold text-primary" style={{ fontSize: '2.2rem', letterSpacing: '0.02em' }}>
            Sign up
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
              label="Email Address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              error={error?.email}
            />
            <TextInput
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              error={error?.password}
            />
            <TextInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              error={localError || error?.password2}
            />
            <ErrorMessage>{error?.non_field_errors}</ErrorMessage>
            <Button type="submit" variant="primary" className="w-100 mb-3" style={{ fontWeight: 600, fontSize: '1.1rem' }} disabled={loading}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
            <div className="text-center mt-3">
              <span className="text-secondary">Already have an account? </span>
              <Link to="/login" className="fw-bold text-primary text-decoration-underline">Sign in</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register; 