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
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow w-100" style={{ maxWidth: 400 }}>
        <div className="card-body">
          <h1 className="card-title text-center mb-4">Sign up</h1>
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
              label="Email Address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <TextInput
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
            />
            <TextInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <ErrorMessage>{localError || error}</ErrorMessage>
            <Button type="submit" variant="primary" className="w-100 mb-3" disabled={loading}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
            <div className="text-center">
              <span className="text-secondary">Already have an account? </span>
              <Link to="/login" className="text-primary">Sign in</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register; 