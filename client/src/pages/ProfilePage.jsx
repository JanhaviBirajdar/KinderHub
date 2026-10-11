import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Lock, 
  ShieldCheck, 
  Key, 
  CheckCircle, 
  Server, 
  Sparkles,
  Phone,
  Mail
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const ProfilePage = () => {
  const { user, role } = useAuth();
  const toast = useToast();

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [updating, setUpdating] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New password and confirmation do not match.');
      return;
    }

    try {
      setUpdating(true);
      await api.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      toast.success('Your account security password has been changed!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-purple-600" />
          User Profile & Security Settings
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage your credentials, encrypted authentication password, and contact profile.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4 text-center">
          <div className="relative inline-block mx-auto">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200'}
              alt={user?.name || 'User'}
              className="w-24 h-24 rounded-3xl object-cover border-4 border-purple-50 shadow-md mx-auto"
            />
            <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 ring-4 ring-white" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-800">{user?.name}</h3>
            <p className="text-xs text-purple-700 font-extrabold uppercase tracking-wider capitalize">
              {role.replace('_', ' ')}
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl text-xs space-y-2 text-left border border-slate-100">
            <p className="flex items-center gap-2 text-slate-600">
              <Mail className="w-3.5 h-3.5 text-purple-500" />
              <span className="font-semibold text-slate-800 truncate">{user?.email}</span>
            </p>
            <p className="flex items-center gap-2 text-slate-600">
              <Phone className="w-3.5 h-3.5 text-purple-500" />
              <span className="font-semibold text-slate-800">{user?.phone || '+1 (555) 019-2026'}</span>
            </p>
            <p className="flex items-center gap-2 text-slate-600 pt-1 border-t border-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-bold">JWT 256-bit Encrypted</span>
            </p>
          </div>
        </div>

        {/* Right Column: Change Password & System Status */}
        <div className="md:col-span-2 space-y-6">
          {/* Change Password Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Lock className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-slate-800 text-base">Change Password</h3>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Current Password *</label>
                <input
                  type="password"
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">New Password *</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    placeholder="At least 6 characters"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Confirm New Password *</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    placeholder="Repeat new password"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all shadow-md shadow-purple-200 disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>

          {/* System & Architecture Information */}
          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-700">
              <Server className="w-4 h-4 text-purple-600" />
              <span>KinderHub System Architecture</span>
            </div>
            <p className="text-slate-500">
              Frontend: React 19 + Vite 8 + Tailwind CSS • Backend: Node.js / Express.js • Database: MongoDB / In-Memory Seeded Store • Auth: JWT + Bcryptjs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
