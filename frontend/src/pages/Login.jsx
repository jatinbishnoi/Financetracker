import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/transactions'); // redirect after login
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={styles.fullScreen}>
      <div style={styles.card}>
        <h1 style={styles.title}>Login</h1>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Login</button>
        </form>
        <p style={styles.text}>
          New here?{' '}
          <Link to="/register" style={styles.link}>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

// Full screen and responsive styles
const styles = {
  fullScreen: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh', // full height of the viewport
    width: '100%',
    background: 'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)', // gradient background
    padding: '1rem',
    boxSizing: 'border-box',
  },
  card: {
    padding: '2rem',
    borderRadius: '12px',
    backgroundColor: '#fff',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '400px', // responsive width
    textAlign: 'center',
    transition: 'transform 0.3s ease',
  },
  title: {
    marginBottom: '1.5rem',
    color: '#333',
    fontSize: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '0.75rem',
    marginBottom: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  },
  button: {
    padding: '0.75rem',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#4CAF50',
    color: '#fff',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  text: {
    marginTop: '1rem',
    fontSize: '0.95rem',
    color: '#555',
  },
  link: {
    color: '#4CAF50',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: '1rem',
    fontWeight: '500',
  },
};

export default Login;
