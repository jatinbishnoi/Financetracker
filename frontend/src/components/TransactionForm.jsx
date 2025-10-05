import { useState, useEffect } from 'react';
import api from '../api/api';

const TransactionForm = ({ onClose, onSuccess, transaction }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    date: '',
    note: '',
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        date: new Date(transaction.date).toISOString().slice(0, 10),
        note: transaction.note || '',
      });
    }
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (transaction) {
        await api.put(`/transactions/${transaction._id}`, formData);
      } else {
        await api.post('/transactions', formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error saving transaction');
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.heading}>{transaction ? 'Edit Transaction' : 'Add Transaction'}</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Type:
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>

          <label style={styles.label}>
            Amount:
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Category:
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Date:
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Note:
            <input
              type="text"
              name="note"
              value={formData.note}
              onChange={handleChange}
              style={styles.input}
            />
          </label>

          <div style={styles.buttonContainer}>
            <button type="submit" style={styles.submitButton}>
              {transaction ? 'Update' : 'Add'}
            </button>
            <button type="button" style={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '2rem',
    width: '400px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    marginTop: '0.3rem',
    padding: '0.5rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1.5rem',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '6px',
    cursor: 'pointer',
    flex: 1,
    marginRight: '0.5rem',
  },
  cancelButton: {
    backgroundColor: '#F44336',
    color: '#fff',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '6px',
    cursor: 'pointer',
    flex: 1,
    marginLeft: '0.5rem',
  },
};

export default TransactionForm;
