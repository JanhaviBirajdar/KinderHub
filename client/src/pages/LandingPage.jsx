import React, { useState } from 'react';
import { 
  Baby, 
  School, 
  Sparkles, 
  CalendarCheck, 
  CreditCard, 
  Heart, 
  ShieldCheck, 
  ArrowRight, 
  Users, 
  Award,
  CheckCircle2,
  Clock,
  ClipboardList
} from 'lucide-react';
import { Modal } from '../components/Modal';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export const LandingPage = ({ onGoToLogin, onDirectDemoLogin }) => {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyForm, setApplyForm] = useState({
    childFirstName: '',
    childLastName: '',
    dob: '2023-05-10',
    gender: 'Female',
    preferredClassId: 'cls_001',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    address: '',
    medicalNotes: ''
  });

  const toast = useToast();

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await api.submitAdmission(applyForm);
      toast.success('Your preschool enquiry was submitted! Our admissions office will reach out.');
      setShowApplyModal(false);
      setApplyForm({
        childFirstName: '',
        childLastName: '',
        dob: '2023-05-10',
        gender: 'Female',
        preferredClassId: 'cls_001',
        parentName: '',
        parentEmail: '',
        parentPhone: '',
        address: '',
        medicalNotes: ''
      });
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFE] text-slate-800 font-sans selection:bg-purple-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-purple-100/80 px-6 sm:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 via-pink-400 to-amber-300 flex items-center justify-center text-2xl shadow-md shadow-purple-200">
            🧸
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-heading">
              Kinder<span className="text-purple-600">Hub</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Preschool Management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowApplyModal(true)}
            className="hidden sm:inline-flex px-4 py-2 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs transition-colors border border-purple-200"
          >
            Admission Enquiry
          </button>
          <button
            onClick={onGoToLogin}
            className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all shadow-md shadow-purple-200 flex items-center gap-1.5"
          >
            Sign In to Portal <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 sm:px-12 py-16 sm:py-24 max-w-6xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-extrabold shadow-sm">
          <Sparkles className="w-4 h-4 text-purple-500" />
          Next-Generation Early Learning Operations
        </div>

        <h2 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight font-heading max-w-3xl mx-auto">
          Nurturing young minds with <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">joyful clarity & care.</span>
        </h2>

        <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          The comprehensive management platform designed for preschools, daycares, and kindergartens. Unify student health records, daily attendance, tuition invoices, developmental milestones, and parent communication.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onDirectDemoLogin('super_admin')}
            className="px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm transition-all shadow-xl shadow-purple-200 flex items-center gap-2"
          >
            Explore as Super Admin <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDirectDemoLogin('teacher')}
            className="px-5 py-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-sm transition-all border border-emerald-200"
          >
            Teacher Portal Demo
          </button>
          <button
            onClick={() => onDirectDemoLogin('parent')}
            className="px-5 py-3.5 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-800 font-bold text-sm transition-all border border-orange-200"
          >
            Parent Portal Demo
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 text-left">
          {/* Card 1 */}
          <div className="p-8 rounded-3xl bg-white border border-purple-100 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-xl">
              👶
            </div>
            <h3 className="text-lg font-bold text-slate-800">Child & Health Management</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automated child IDs, strict allergy safety warnings, emergency contact rosters, and authorized pickup credentials.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-3xl bg-white border border-sky-100 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center text-xl">
              🎨
            </div>
            <h3 className="text-lg font-bold text-slate-800">5-Domain Milestone Tracking</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Track preschool developmental progress across Language, Motor Skills, Creativity, Social-Emotional, and Cognitive growth without competitive rankings.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-3xl bg-white border border-amber-100 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl">
              💳
            </div>
            <h3 className="text-lg font-bold text-slate-800">Tuition & Fee Automation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Transparent term tuition invoicing, partial payment support, multiple payment methods (Cash, UPI, Wire), and printable official receipts.
            </p>
          </div>
        </div>
      </section>

      {/* Online Admission Enquiry Modal */}
      <Modal isOpen={showApplyModal} onClose={() => setShowApplyModal(false)} title="Online Preschool Admission Enquiry">
        <form onSubmit={handleApply} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Child First Name *</label>
              <input
                type="text"
                required
                value={applyForm.childFirstName}
                onChange={(e) => setApplyForm({ ...applyForm, childFirstName: e.target.value })}
                placeholder="e.g. Maya"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Child Last Name *</label>
              <input
                type="text"
                required
                value={applyForm.childLastName}
                onChange={(e) => setApplyForm({ ...applyForm, childLastName: e.target.value })}
                placeholder="e.g. Vance"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Date of Birth *</label>
              <input
                type="date"
                required
                value={applyForm.dob}
                onChange={(e) => setApplyForm({ ...applyForm, dob: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Preferred Group</label>
              <select
                value={applyForm.preferredClassId}
                onChange={(e) => setApplyForm({ ...applyForm, preferredClassId: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="cls_001">Playgroup (2 – 3 Years)</option>
                <option value="cls_002">Nursery (3 – 4 Years)</option>
                <option value="cls_003">Junior KG (4 – 5 Years)</option>
                <option value="cls_004">Senior KG (5 – 6 Years)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Parent Name *</label>
              <input
                type="text"
                required
                value={applyForm.parentName}
                onChange={(e) => setApplyForm({ ...applyForm, parentName: e.target.value })}
                placeholder="e.g. Jessica Vance"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Parent Phone *</label>
              <input
                type="text"
                required
                value={applyForm.parentPhone}
                onChange={(e) => setApplyForm({ ...applyForm, parentPhone: e.target.value })}
                placeholder="+1 (555) 019-2026"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Parent Email Address</label>
            <input
              type="email"
              value={applyForm.parentEmail}
              onChange={(e) => setApplyForm({ ...applyForm, parentEmail: e.target.value })}
              placeholder="parent@example.com"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Special Notes / Inquiries</label>
            <textarea
              rows="2"
              value={applyForm.medicalNotes}
              onChange={(e) => setApplyForm({ ...applyForm, medicalNotes: e.target.value })}
              placeholder="Full-day or half-day preference, allergies, etc."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowApplyModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-md shadow-purple-200"
            >
              Submit Admission Enquiry
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
