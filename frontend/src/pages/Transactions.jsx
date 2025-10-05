import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import TransactionForm from '../components/TransactionForm';

const Transactions = () => {
  const { user, logout } = useAuth(); // get logout from AuthContext
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: '', category: '', search: '' });
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);

  const [showForm, setShowForm] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);

  // Fetch transactions from backend
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      const { data } = await api.get('/transactions', { params });
      setTransactions(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  // Paginate transactions
  const paginatedTransactions = useMemo(() => {
    const start = (page - 1) * perPage;
    return transactions.slice(start, start + perPage);
  }, [transactions, page]);

  // Delete transaction
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      console.error(err);
    }
  };

  // Open add form
  const handleAdd = () => {
    setEditTransaction(null);
    setShowForm(true);
  };

  // Open edit form
  const handleEdit = (transaction) => {
    setEditTransaction(transaction);
    setShowForm(true);
  };

  // Navigate to analytics
  const goToAnalytics = () => {
    navigate('/analytics');
  };

  // Logout user
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Transactions</h1>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {user.role !== 'read-only' && (
          <button style={styles.addButton} onClick={handleAdd}>
            + Add Transaction
          </button>
        )}
        <button
          style={{ ...styles.addButton, backgroundColor: '#2196F3' }}
          onClick={goToAnalytics}
        >
          View Analytics
        </button>
        <button
          style={{ ...styles.addButton, backgroundColor: '#f44336' }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          style={styles.input}
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <input
          type="text"
          placeholder="Search notes"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Category"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          style={styles.input}
        />
      </div>

      {loading ? (
        <p style={styles.loading}>Loading...</p>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Note</th>
                {user.role !== 'read-only' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((t) => (
                <tr key={t._id} style={styles.row}>
                  <td>{new Date(t.date).toLocaleDateString()}</td>
                  <td style={t.type === 'income' ? styles.income : styles.expense}>{t.type}</td>
                  <td>{t.amount.toLocaleString()}</td>
                  <td>{t.category}</td>
                  <td>{t.note}</td>
                  {user.role !== 'read-only' && (
                    <td>
                      <button style={styles.editButton} onClick={() => handleEdit(t)}>
                        Edit
                      </button>
                      <button style={styles.deleteButton} onClick={() => handleDelete(t._id)}>
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div style={styles.pagination}>
            {Array.from({ length: Math.ceil(transactions.length / perPage) }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                style={{
                  ...styles.pageButton,
                  fontWeight: page === i + 1 ? 'bold' : 'normal',
                  backgroundColor: page === i + 1 ? '#4CAF50' : '#fff',
                  color: page === i + 1 ? '#fff' : '#333',
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <TransactionForm
          transaction={editTransaction}
          onClose={() => setShowForm(false)}
          onSuccess={fetchTransactions}
        />
      )}
    </div>
  );
};
// ...styles remain the same as before

const styles = {
  container: {
    padding: '2rem',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  heading: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '1.5rem',
    fontSize: '2.2rem',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    padding: '0.7rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '1rem',
    fontWeight: '600',
    transition: '0.3s',
  },
  filters: {
    display: 'flex',
    gap: '0.8rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },
  input: {
    padding: '0.5rem 0.8rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    minWidth: '140px',
    flex: '1',
    transition: '0.2s',
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#555',
  },
  tableContainer: {
    overflowX: 'auto',
    borderRadius: '10px',
    boxShadow: '0 6px 15px rgba(0,0,0,0.05)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    minWidth: '700px',
  },
  row: {
    transition: '0.2s',
  },
  income: {
    color: '#00C49F',
    fontWeight: '600',
  },
  expense: {
    color: '#FF6384',
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: '#2196F3',
    color: '#fff',
    border: 'none',
    padding: '0.4rem 0.8rem',
    marginRight: '0.3rem',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: '0.2s',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    color: '#fff',
    border: 'none',
    padding: '0.4rem 0.8rem',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: '0.2s',
  },
  pagination: {
    marginTop: '1.5rem',
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '0.3rem',
  },
  pageButton: {
    padding: '0.45rem 0.9rem',
    border: '1px solid #ccc',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: '#fff',
    transition: '0.2s',
  },
};

export default Transactions;
