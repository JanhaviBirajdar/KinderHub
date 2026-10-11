import bcrypt from 'bcryptjs';
import { store } from '../services/dataStore.js';
import { generateToken } from '../middleware/authMiddleware.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials. Password incorrect.' });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ message: 'Account is deactivated. Contact administration.' });
    }

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = store.users.find(u => u._id === req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = store.users.find(u => u._id === req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password does not match.' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    res.json({ message: 'Password updated successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = store.users.find(u => u.email.toLowerCase() === email?.toLowerCase());
    if (!user) {
      return res.status(404).json({ message: 'No registered account found with this email.' });
    }
    // Return simulated reset token for demo workflow
    const resetToken = `reset-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    res.json({
      message: 'Password reset link and security verification token generated.',
      resetToken,
      instructions: 'For testing, enter your new password with this demo verification token.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, resetToken } = req.body;
    if (!resetToken) {
      return res.status(400).json({ message: 'Reset token is required.' });
    }
    const user = store.users.find(u => u.email.toLowerCase() === email?.toLowerCase());
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.password = await bcrypt.hash(newPassword, 10);
    res.json({ message: 'Password has been reset successfully! You may now sign in.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDemoUsers = (req, res) => {
  const demos = [
    { role: 'Super Admin', email: 'admin@kinderhub.edu', pass: 'Admin@123', name: 'Eleanor Vance', badge: 'Full Control' },
    { role: 'School Admin', email: 'principal@kinderhub.edu', pass: 'Admin@123', name: 'Marcus Sterling', badge: 'Operations' },
    { role: 'Teacher', email: 'clara.teacher@kinderhub.edu', pass: 'Teacher@123', name: 'Clara Oswald', badge: 'Playgroup Lead' },
    { role: 'Parent', email: 'sarah.parent@kinderhub.edu', pass: 'Parent@123', name: 'Sarah Johnson', badge: '2 Children Enrolled' }
  ];
  res.json(demos);
};
