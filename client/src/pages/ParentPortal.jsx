import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Baby, 
  CalendarCheck, 
  CreditCard, 
  Sparkles, 
  Clock, 
  MessageSquare, 
  Printer, 
  Download, 
  Plus, 
  ShieldAlert,
  ChevronRight,
  Smile,
  Sun,
  Coffee,
  CheckCircle2,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { api } from '../services/api';
import { Badge } from '../components/Badge';
import { StatsCard } from '../components/StatsCard';
import { ReceiptModal } from '../components/ReceiptModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const ParentPortal = ({ onNavigate }) => {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [childDetails, setChildDetails] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  const toast = useToast();

  useEffect(() => {
    const fetchParentData = async () => {
      try {
        setLoading(true);
        const [kids, invList] = await Promise.all([
          api.getChildren(),
          api.getInvoices()
        ]);
        setChildren(kids);
        setInvoices(invList);
        if (kids.length > 0) {
          setSelectedChildId(kids[0]._id);
        }
      } catch (err) {
        toast.error('Failed to load parent portal: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchParentData();
  }, []);

  useEffect(() => {
    const fetchSelectedChild = async () => {
      if (!selectedChildId) return;
      try {
        const full = await api.getChildById(selectedChildId);
        setChildDetails(full);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSelectedChild();
  }, [selectedChildId]);

  const activeChild = childDetails || children.find(c => c._id === selectedChildId);

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Parent Welcome Hero Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white shadow-xl shadow-purple-500/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-extrabold uppercase tracking-wider">
              ❤️ Family & Guardian Portal
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Welcome, {user?.name || 'Sarah'}! 🌸
            </h2>
            <p className="text-pink-100 text-sm max-w-xl">
              Stay connected with your child's daily learning joys, nutritional meals, attendance check-ins, and preschool milestones.
            </p>
          </div>

          {/* Child Switcher Pills */}
          {children.length > 0 && (
            <div className="bg-white/15 backdrop-blur-md p-1.5 rounded-2xl flex items-center gap-1.5 border border-white/20 self-stretch sm:self-auto overflow-x-auto">
              {children.map(child => (
                <button
                  key={child._id}
                  onClick={() => setSelectedChildId(child._id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 whitespace-nowrap ${
                    selectedChildId === child._id
                      ? 'bg-white text-purple-700 shadow-md font-extrabold scale-102'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <img src={child.photo} alt={child.firstName} className="w-6 h-6 rounded-full object-cover ring-1 ring-white/50" />
                  {child.firstName}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Selected Child Info & Health Safety Overview */}
      {activeChild && (
        <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={activeChild.photo}
                alt={activeChild.firstName}
                className="w-20 h-20 rounded-3xl object-cover border-4 border-purple-50 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 ring-2 ring-white flex items-center justify-center text-[10px] text-white">
                ✓
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-2xl font-extrabold text-slate-800">
                  {activeChild.firstName} {activeChild.lastName}
                </h3>
                <Badge variant={activeChild.status}>{activeChild.status}</Badge>
              </div>
              <p className="text-xs text-purple-600 font-bold mt-0.5">
                {activeChild.className} • Child ID: {activeChild.childId} • Age: {activeChild.age || '3 Years'}
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1.5">
                <span>Enrolled: {activeChild.admissionDate}</span>
                <span>•</span>
                <span className="font-semibold text-slate-600">Blood Group: {activeChild.bloodGroup || 'O+'}</span>
                {activeChild.allergies?.length > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Allergy: {activeChild.allergies.join(', ')}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={() => onNavigate('kindergrowth')}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Sparkles className="w-4 h-4 text-purple-700" /> Growth Journey AI
            </button>
            <button
              onClick={() => onNavigate('kinderconnect')}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-teal-100 hover:bg-teal-200 text-teal-800 font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Heart className="w-4 h-4 text-teal-700" /> Daily Updates (MR/HI)
            </button>
            <button
              onClick={() => onNavigate('kindersafe')}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <ShieldAlert className="w-4 h-4 text-rose-700" /> Pickup Pass / OTP
            </button>
            <button
              onClick={() => onNavigate('kinderquest')}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-800 font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Sun className="w-4 h-4 text-amber-700" /> Wonder Quests
            </button>
          </div>
        </div>
      )}

      {/* Daily Child Highlights Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-bold">
            ☀️
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Today's Check-in</p>
            <p className="text-base font-extrabold text-slate-800">8:45 AM (On Time)</p>
            <p className="text-[11px] text-emerald-600 font-semibold">Checked in by Lead Teacher</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold">
            🍎
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nutrition & Meals</p>
            <p className="text-base font-extrabold text-slate-800">Ate All Morning Snack</p>
            <p className="text-[11px] text-slate-500">Fresh organic apple slices & oats</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl font-bold">
            🎨
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Learning Rhythm</p>
            <p className="text-base font-extrabold text-slate-800">Sensory Water Play</p>
            <p className="text-[11px] text-purple-600 font-semibold">Fine motor exploration</p>
          </div>
        </div>
      </div>

      {/* Grid: Attendance & Fee Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Child Attendance History */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-purple-600" /> Recent Attendance History
            </h3>
            <Badge variant="Present">95% Turnout</Badge>
          </div>

          <div className="space-y-2.5">
            {activeChild?.attendanceHistory?.length > 0 ? (
              activeChild.attendanceHistory.slice(0, 5).map((att, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs hover:bg-purple-50/30 transition-colors">
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {att.date}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Check-in: <span className="font-semibold text-slate-600">{att.checkInTime}</span> • {att.remarks || 'Healthy & cheerful'}
                    </p>
                  </div>
                  <Badge variant={att.status}>{att.status}</Badge>
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-slate-400 text-xs font-semibold">No recent attendance records logged yet.</p>
            )}
          </div>
        </div>

        {/* Tuition Invoices & Printable Receipts */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" /> Tuition Invoices & Receipts
            </h3>
            <button
              onClick={() => onNavigate('fees')}
              className="text-xs font-bold text-purple-600 hover:text-purple-800"
            >
              All Invoices →
            </button>
          </div>

          <div className="space-y-3">
            {invoices.filter(i => i.childId === selectedChildId).length > 0 ? (
              invoices.filter(i => i.childId === selectedChildId).map(inv => (
                <div key={inv._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs hover:bg-slate-100/60 transition-colors">
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-800 text-sm">{inv.title}</p>
                    <p className="text-slate-500 font-semibold">
                      Total: ${inv.totalAmount} • Paid: <span className="text-emerald-600 font-bold">${inv.paidAmount}</span>
                    </p>
                    <p className="text-[11px] text-slate-400">Due: {inv.dueDate}</p>
                  </div>
                  <div className="text-right space-y-1.5">
                    <Badge variant={inv.status}>{inv.status}</Badge>
                    <div>
                      <button
                        onClick={() => setActiveReceipt(inv)}
                        className="text-[11px] font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200 inline-flex items-center gap-1 transition-colors"
                      >
                        <Printer className="w-3 h-3" /> View Receipt
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-slate-400 text-xs font-semibold">No outstanding or recent tuition statements.</p>
            )}
          </div>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      {activeReceipt && (
        <ReceiptModal
          isOpen={!!activeReceipt}
          onClose={() => setActiveReceipt(null)}
          invoice={activeReceipt}
        />
      )}
    </div>
  );
};
