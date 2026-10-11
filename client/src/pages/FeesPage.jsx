import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Search, 
  Plus, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Printer, 
  FileText, 
  Calendar,
  Sparkles,
  Receipt,
  Layers,
  CheckCircle2,
  TrendingUp,
  Tag,
  Trash2
} from 'lucide-react';
import { api } from '../services/api';
import { Modal } from '../components/Modal';
import { Badge } from '../components/Badge';
import { StatsCard } from '../components/StatsCard';
import { ReceiptModal } from '../components/ReceiptModal';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const FeesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [children, setChildren] = useState([]);
  const [feeStructures, setFeeStructures] = useState([]);
  const [summaries, setSummaries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modals
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showStructuresModal, setShowStructuresModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [activeReceipt, setActiveReceipt] = useState(null);

  // Payment Form State
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentMethod: 'UPI',
    transactionRef: '',
    notes: 'Paid via instant gateway'
  });

  // Invoice Form State
  const [invoiceForm, setInvoiceForm] = useState({
    childId: '',
    title: 'Autumn Term Tuition & Activities',
    monthYear: 'November 2026',
    dueDate: '2026-11-20',
    subtotal: 1520,
    discount: 0
  });

  const toast = useToast();
  const { role } = useAuth();
  const canManage = role === 'super_admin' || role === 'school_admin';

  const fetchData = async () => {
    try {
      setLoading(true);
      const [invList, kidList, structList, sumData] = await Promise.all([
        api.getInvoices({ status: statusFilter }),
        api.getChildren(),
        api.getFeeStructures(),
        api.getFeeSummaries()
      ]);
      setInvoices(invList);
      setChildren(kidList);
      setFeeStructures(structList);
      setSummaries(sumData);
      if (kidList.length > 0 && !invoiceForm.childId) {
        setInvoiceForm(prev => ({ ...prev, childId: kidList[0]._id }));
      }
    } catch (err) {
      toast.error('Failed to load fee records: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      await api.createInvoice(invoiceForm);
      toast.success('Invoice created successfully!');
      setShowInvoiceModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    try {
      const res = await api.recordPayment({
        invoiceId: selectedInvoice._id,
        amount: Number(paymentForm.amount),
        paymentMethod: paymentForm.paymentMethod,
        transactionRef: paymentForm.transactionRef || `TXN-${Date.now()}`,
        notes: paymentForm.notes
      });
      toast.success(res.message);
      setShowPaymentModal(false);
      setActiveReceipt(res.receipt);
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    if (!window.confirm('Are you sure you want to cancel and delete this invoice?')) return;
    try {
      await api.deleteInvoice(invoiceId);
      toast.success('Invoice deleted successfully.');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete invoice: ' + err.message);
    }
  };

  const totalBilled = summaries?.totalBilled ?? 0;
  const totalCollected = summaries?.totalCollected ?? 0;
  const totalPending = summaries?.totalPending ?? 0;
  const collectionPct = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;

  return (
    <div className="space-y-6 pb-12 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight font-heading flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-purple-100 text-purple-700">
              <CreditCard className="w-6 h-6" />
            </span>
            Tuition & Fee Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Automated invoices, partial installment tracking, multi-channel payment reconciliation, and printable vouchers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowStructuresModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 font-extrabold text-xs transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4 text-purple-600" /> Fee Structures
          </button>

          {canManage && (
            <button
              onClick={() => setShowInvoiceModal(true)}
              className="px-5 py-2.5 rounded-2xl bg-purple-600 text-white font-extrabold hover:bg-purple-700 transition-all text-xs flex items-center gap-2 shadow-md shadow-purple-200 active:scale-95"
            >
              <Plus className="w-4 h-4" /> Generate Invoice
            </button>
          )}
        </div>
      </div>

      {/* Summary Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatsCard
          title="Total Invoiced"
          value={`$${Number(totalBilled).toLocaleString()}.00`}
          subtitle="Enrolled student billings"
          icon={DollarSign}
          color="lavender"
          trend={{ value: 'Live Account Totals', isPositive: true }}
        />
        <StatsCard
          title="Total Collected"
          value={`$${Number(totalCollected).toLocaleString()}.00`}
          subtitle="Verified payment receipts"
          icon={CheckCircle}
          color="mint"
          trend={{ value: `${collectionPct}% Collected`, isPositive: collectionPct >= 50 }}
        />
        <StatsCard
          title="Outstanding Balance"
          value={`$${Number(totalPending).toLocaleString()}.00`}
          subtitle="Due before final term date"
          icon={Clock}
          color="peach"
          trend={{ value: totalPending > 0 ? 'Installments pending' : 'Zero balance', isPositive: totalPending === 0 }}
        />
      </div>

      {/* Filter Tabs & Counter */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['', 'Paid', 'Partial', 'Unpaid', 'Overdue'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st || 'All Invoices'}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 font-bold hidden sm:inline">
          {invoices.length} Invoices Found
        </span>
      </div>

      {/* Invoices Table */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading fee invoices...</div>
      ) : invoices.length === 0 ? (
        <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-2">
          <p className="text-3xl">💳</p>
          <p className="font-extrabold text-slate-700 font-heading">No invoices found for this selection.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-bold">
                <tr>
                  <th className="px-5 py-3.5">Invoice #</th>
                  <th className="px-5 py-3.5">Student / Class</th>
                  <th className="px-5 py-3.5">Billing Term</th>
                  <th className="px-5 py-3.5">Total Due</th>
                  <th className="px-5 py-3.5">Paid Amount</th>
                  <th className="px-5 py-3.5">Balance</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map(inv => (
                  <tr key={inv._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4 font-extrabold text-purple-700 font-mono">
                      {inv.invoiceNo}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-extrabold text-slate-800 text-sm">{inv.childName}</p>
                      <p className="text-[11px] text-slate-400">{inv.className} • Parent: {inv.parentName}</p>
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-700">
                      {inv.monthYear}
                    </td>
                    <td className="px-5 py-4 font-extrabold text-slate-900 text-sm font-mono">
                      ${inv.totalAmount}
                    </td>
                    <td className="px-5 py-4 text-emerald-600 font-extrabold font-mono">
                      ${inv.paidAmount}
                    </td>
                    <td className="px-5 py-4 text-rose-600 font-extrabold font-mono">
                      ${inv.balanceAmount}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={inv.status}>{inv.status}</Badge>
                    </td>
                    <td className="px-5 py-4 text-right space-x-1.5 whitespace-nowrap">
                      {inv.balanceAmount > 0 && (
                        <button
                          onClick={() => {
                            setSelectedInvoice(inv);
                            setPaymentForm({
                              amount: String(inv.balanceAmount),
                              paymentMethod: 'UPI',
                              transactionRef: `UPI-${Date.now().toString().slice(-6)}`,
                              notes: 'Tuition installment credited'
                            });
                            setShowPaymentModal(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 font-extrabold text-white transition-colors shadow-2xs"
                        >
                          Record Payment
                        </button>
                      )}
                      <button
                        onClick={() => setActiveReceipt(inv)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-extrabold text-slate-700 transition-colors inline-flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" /> Receipt
                      </button>
                      {canManage && (
                        <button
                          onClick={() => handleDeleteInvoice(inv._id)}
                          className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors inline-flex items-center gap-1"
                          title="Delete / Cancel Invoice"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {selectedInvoice && (
        <Modal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          title={`Record Payment for ${selectedInvoice.invoiceNo}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-1">
              <p className="font-extrabold text-slate-800 text-sm font-heading">{selectedInvoice.childName} ({selectedInvoice.className})</p>
              <p className="text-slate-500 font-medium">
                Total Billed: ${selectedInvoice.totalAmount} • Remaining Balance: <span className="font-extrabold text-rose-600">${selectedInvoice.balanceAmount}</span>
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Payment Amount ($) *</label>
              <input
                type="number"
                min="1"
                max={selectedInvoice.balanceAmount}
                required
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-extrabold text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Payment Channel *</label>
              <select
                value={paymentForm.paymentMethod}
                onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                <option value="UPI">UPI / Instant QR Demo</option>
                <option value="Cash">Cash at Reception Desk</option>
                <option value="Bank Transfer">Direct Bank Wire</option>
                <option value="Card">Debit / Credit Card</option>
                <option value="Online Demo">Verified Online Gateway (Demo)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Reference / Transaction ID</label>
              <input
                type="text"
                value={paymentForm.transactionRef}
                onChange={(e) => setPaymentForm({ ...paymentForm, transactionRef: e.target.value })}
                placeholder="TXN-98231..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-extrabold hover:bg-purple-700 shadow-md shadow-purple-200 active:scale-95"
              >
                Confirm & Issue Receipt
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Fee Structures Modal */}
      <Modal
        isOpen={showStructuresModal}
        onClose={() => setShowStructuresModal(false)}
        title="Classroom Fee Structures (AY 2026-27)"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-500">
            Standard tuition fees, activity charges, meals, and educational materials configured by developmental level.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {feeStructures.map(struct => (
              <div key={struct._id} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                  <h4 className="font-extrabold text-slate-800 text-sm font-heading">{struct.className}</h4>
                  <span className="font-extrabold text-purple-700 font-mono text-sm">${struct.totalAmount} / term</span>
                </div>
                <div className="space-y-1 text-slate-600">
                  <p className="flex justify-between"><span>Admission Fee:</span> <span className="font-bold">${struct.admissionFee}</span></p>
                  <p className="flex justify-between"><span>Tuition Fee:</span> <span className="font-bold">${struct.tuitionFee}</span></p>
                  <p className="flex justify-between"><span>Activity & Materials:</span> <span className="font-bold">${struct.activityFee}</span></p>
                  <p className="flex justify-between"><span>Nutritional Snacks:</span> <span className="font-bold">${struct.mealFee}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Generate Fee Invoice Modal */}
      <Modal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        title="Generate New Student Invoice"
      >
        <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Select Enrolled Student *</label>
            <select
              value={invoiceForm.childId}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, childId: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            >
              {children.map(c => (
                <option key={c._id} value={c._id}>{c.firstName} {c.lastName} ({c.className})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Billing Month / Term *</label>
              <input
                type="text"
                required
                value={invoiceForm.monthYear}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, monthYear: e.target.value })}
                placeholder="e.g. November 2026"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Payment Due Date *</label>
              <input
                type="date"
                required
                value={invoiceForm.dueDate}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Base Tuition Amount ($) *</label>
              <input
                type="number"
                min="100"
                required
                value={invoiceForm.subtotal}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, subtotal: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Approved Concession ($)</label>
              <input
                type="number"
                min="0"
                value={invoiceForm.discount}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, discount: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowInvoiceModal(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-extrabold hover:bg-purple-700 shadow-md shadow-purple-200 active:scale-95"
            >
              Generate Invoice
            </button>
          </div>
        </form>
      </Modal>

      {/* Printable Receipt Modal */}
      {activeReceipt && (
        <ReceiptModal
          isOpen={!!activeReceipt}
          onClose={() => setActiveReceipt(null)}
          receipt={activeReceipt.receiptNo ? activeReceipt : null}
          invoice={activeReceipt.invoiceNo ? activeReceipt : null}
        />
      )}
    </div>
  );
};
