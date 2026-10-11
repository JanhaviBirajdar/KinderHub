import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  UserCheck, 
  GraduationCap, 
  Heart,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/Modal';
import { api } from '../services/api';

export const LoginPage = ({ onSwitchToLanding }) => {
  const [email, setEmail] = useState('admin@kinderhub.edu');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Forgot Password Modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetTokenInfo, setResetTokenInfo] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  const { login } = useAuth();
  const toast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(email, password);
      toast.success('Signed in successfully! Welcome to KinderHub.');
    } catch (err) {
      toast.error(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    try {
      setLoading(true);
      await login(demoEmail, demoPass);
      toast.success('Signed in with demo role!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await api.forgotPassword(forgotEmail);
      setResetTokenInfo(res);
      toast.success('Reset token generated! Enter new password.');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await api.resetPassword({
        email: forgotEmail,
        newPassword,
        resetToken: resetTokenInfo.resetToken
      });
      toast.success('Password reset successfully! You can now sign in.');
      setShowForgotModal(false);
      setResetTokenInfo(null);
      setPassword(newPassword);
      setEmail(forgotEmail);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-100/60 via-sky-50 to-pink-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Side: Brand & Visuals */}
        <div className="p-8 sm:p-12 bg-gradient-to-br from-purple-600 via-indigo-600 to-sky-600 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner">
                🧸
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight">KinderHub</h1>
                <p className="text-xs text-purple-200 uppercase tracking-wider font-semibold">
                  Preschool Management
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-6">
              <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
                Early Learning Operations
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold leading-snug">
                Where joyful beginnings meet seamless preschool operations.
              </h2>
              <p className="text-purple-100 text-xs leading-relaxed">
                Connect administrators, certified educators, and families with transparent attendance, fee vouchers, and 5-domain milestone portfolios.
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/20 text-[11px] text-purple-200 flex items-center justify-between">
            <span>© 2026 KinderHub Academy</span>
            <button
              onClick={onSwitchToLanding}
              className="text-white font-bold hover:underline"
            >
              ← Back to Overview
            </button>
          </div>
        </div>

        {/* Right Side: Login Form & One-Click Demo Logins */}
        <div className="p-8 sm:p-12 space-y-6 flex flex-col justify-center">
          <div>
            <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              Sign In to Your Account
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Select a quick demo persona below or enter your credentials.
            </p>
          </div>

          {/* Quick 1-Click Demo Buttons */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              1-Click Demo Personas:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('admin@kinderhub.edu', 'Admin@123')}
                className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 text-xs font-bold flex items-center gap-2 transition-all text-left"
              >
                <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                <div>
                  <p className="leading-none">Super Admin</p>
                  <p className="text-[9px] text-purple-600 font-normal">Full control</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('principal@kinderhub.edu', 'Admin@123')}
                className="p-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 text-xs font-bold flex items-center gap-2 transition-all text-left"
              >
                <UserCheck className="w-4 h-4 text-sky-600 shrink-0" />
                <div>
                  <p className="leading-none">School Admin</p>
                  <p className="text-[9px] text-sky-600 font-normal">Operations</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('clara.teacher@kinderhub.edu', 'Teacher@123')}
                className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 transition-all text-left"
              >
                <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <p className="leading-none">Lead Teacher</p>
                  <p className="text-[9px] text-emerald-600 font-normal">Playgroup</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('sarah.parent@kinderhub.edu', 'Parent@123')}
                className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-800 text-xs font-bold flex items-center gap-2 transition-all text-left"
              >
                <Heart className="w-4 h-4 text-orange-600 shrink-0" />
                <div>
                  <p className="leading-none">Parent Portal</p>
                  <p className="text-[9px] text-orange-600 font-normal">2 Enrolled</p>
                </div>
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] text-slate-400 font-bold uppercase absolute">
              Or Manual Sign-in
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@kinderhub.edu"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-400 font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-purple-600 hover:underline font-bold text-[11px]"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-400 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm transition-all shadow-lg shadow-purple-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In to KinderHub'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => {
          setShowForgotModal(false);
          setResetTokenInfo(null);
        }}
        title="Account Recovery & Password Reset"
        maxWidth="max-w-md"
      >
        {!resetTokenInfo ? (
          <form onSubmit={handleForgotPassword} className="space-y-4 text-xs">
            <p className="text-slate-600">
              Enter your registered preschool account email to receive a secure password reset token.
            </p>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="e.g. admin@kinderhub.edu"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700"
              >
                Generate Reset Token
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 space-y-1">
              <p className="font-bold text-purple-900">Security Token Verified</p>
              <p className="text-[11px] text-purple-700 font-mono break-all">
                Token: {resetTokenInfo.resetToken}
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new secure password"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
              >
                Reset Password & Continue
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
