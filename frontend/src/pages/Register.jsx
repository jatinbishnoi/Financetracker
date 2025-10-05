import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // default role
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password, role);
      navigate('/login'); // redirect to login
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={styles.fullScreen}>
      <div style={styles.card}>
        <h1 style={styles.title}>Register</h1>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />
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
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={styles.select}
          >
            <option value="user">User</option>
            <option value="read-only">Read-Only</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" style={styles.button}>Register</button>
        </form>
        <p style={styles.text}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  fullScreen: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)',
    padding: '1rem',
    boxSizing: 'border-box',
  },
  card: {
    padding: '2rem',
    borderRadius: '12px',
    backgroundColor: '#fff',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '400px',
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
  select: {
    padding: '0.75rem',
    marginBottom: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    outline: 'none',
    cursor: 'pointer',
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

export default Register;
