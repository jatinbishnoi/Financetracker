import { useEffect, useState } from 'react';
import api from '../api/api'; // ✅ using your existing api.js
import { toast } from 'react-toastify';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update role
  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdating(true);
      await api.put('/users/role', { userId, newRole });
      toast.success('Role updated successfully');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating role');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading users...</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>User Management</h1>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Current Role</th>
              <th style={styles.th}>Previous Roles</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} style={styles.row}>
                <td style={styles.td}>{u.name}</td>
                <td style={styles.td}>{u.email}</td>
                <td style={styles.td}>{u.currentRole}</td>
                <td style={styles.td}>
                  {u.roleHistory?.length
                    ? u.roleHistory.map((r, i) => (
                        <span key={i} style={styles.roleTag}>
                          {r.role}
                        </span>
                      ))
                    : '—'}
                </td>
                <td style={styles.td}>
                  <select
                    disabled={updating}
                    value={u.currentRole}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    style={styles.select}
                  >
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
    fontFamily: 'Segoe UI, sans-serif',
  },
  heading: {
    textAlign: 'center',
    fontSize: '2rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
  },
  tableContainer: {
    overflowX: 'auto',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
    borderRadius: '10px',
    backgroundColor: '#fff',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: '#f3f4f6',
    padding: '0.75rem',
    borderBottom: '1px solid #e5e7eb',
    textAlign: 'left',
    fontWeight: '600',
  },
  td: {
    padding: '0.75rem',
    borderBottom: '1px solid #e5e7eb',
  },
  row: {
    transition: '0.2s',
  },
  roleTag: {
    display: 'inline-block',
    backgroundColor: '#e5e7eb',
    color: '#111827',
    padding: '0.2rem 0.5rem',
    borderRadius: '6px',
    marginRight: '0.3rem',
    fontSize: '0.85rem',
  },
  select: {
    padding: '0.4rem 0.6rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
};

export default UsersPage;
