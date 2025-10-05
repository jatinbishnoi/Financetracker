import User from '../models/User.js';

// Get all users (for admin)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('name email currentRole roleHistory');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user role
export const updateUserRole = async (req, res) => {
  try {
    const { userId, newRole } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.roleHistory.push({ role: user.currentRole });
    user.currentRole = newRole;

    await user.save();
    res.json({ message: 'Role updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get role history of a user
export const getUserRoleHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('name email currentRole roleHistory');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
