import React from 'react';
import { Modal } from './Modal';
import { Printer, CheckCircle, ShieldCheck } from 'lucide-react';

export const ReceiptModal = ({ isOpen, onClose, receipt, invoice }) => {
  if (!receipt && !invoice) return null;

  const data = receipt || invoice;
  const isPaid = (invoice?.status === 'Paid') || (receipt?.amount > 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Official Tuition & Fee Receipt" maxWidth="max-w-xl">
      <div className="space-y-6 printable-receipt">
        {/* Receipt Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-400 flex items-center justify-center text-white text-2xl shadow-md">
              🧸
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Kinder Hub</h2>
              <p className="text-xs text-slate-500">Preschool & Early Learning Academy</p>
              <p className="text-[11px] text-slate-400">742 Blossom Lane, Sunshine Hills • Tel: (555) 019-2026</p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5" /> PAID RECEIPT
            </span>
            <p className="text-xs font-bold text-slate-700 mt-1">
              {receipt?.receiptNo || invoice?.invoiceNo || 'REC-2026-801'}
            </p>
            <p className="text-[11px] text-slate-400">
              {new Date(receipt?.paymentDate || invoice?.createdAt || Date.now()).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Student & Parent Info Box */}
        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm">
          <div>
            <p className="text-xs text-slate-400 font-medium">Student Name</p>
            <p className="font-bold text-slate-800">{data.childName || 'Mia Johnson'}</p>
            <p className="text-xs text-slate-500">Class: {data.className || 'Playgroup (Butterflies)'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Billed To Parent</p>
            <p className="font-bold text-slate-800">{data.parentName || 'Sarah Johnson'}</p>
            <p className="text-xs text-slate-500">Method: {receipt?.paymentMethod || 'UPI / Instant Transfer'}</p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="border border-slate-100 rounded-2xl overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-100/70 text-slate-600 text-xs uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-3 text-slate-700">
                  {invoice?.title || 'Preschool Tuition & Learning Curriculum'}
                  <div className="text-xs text-slate-400">Includes educational materials, art supplies & snack program</div>
                </td>
                <td className="px-4 py-3 text-right font-medium text-slate-800">
                  ${receipt?.amount || invoice?.totalAmount || 1420}.00
                </td>
              </tr>
              {invoice?.discount > 0 && (
                <tr className="text-emerald-700 bg-emerald-50/50">
                  <td className="px-4 py-2">Approved Sibling / Early Bird Concession</td>
                  <td className="px-4 py-2 text-right">-${invoice.discount}.00</td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-slate-50/80 font-bold border-t border-slate-200">
              <tr>
                <td className="px-4 py-3 text-slate-700">Total Paid Amount</td>
                <td className="px-4 py-3 text-right text-emerald-600 text-base">
                  ${receipt?.amount || invoice?.paidAmount || 1420}.00
                </td>
              </tr>
              {invoice?.balanceAmount > 0 && (
                <tr className="text-xs text-rose-600 font-semibold">
                  <td className="px-4 py-1.5">Remaining Balance Due</td>
                  <td className="px-4 py-1.5 text-right">${invoice.balanceAmount}.00</td>
                </tr>
              )}
            </tfoot>
          </table>
        </div>

        {/* Seal and Verification */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Electronically verified by KinderHub Accounting Portal</span>
          </div>
          <div className="text-right italic">
            Authorized Signature: <span className="font-semibold text-slate-600">E. Vance (Admin)</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end gap-3 no-print pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors text-sm"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-md shadow-purple-200 text-sm"
          >
            <Printer className="w-4 h-4" /> Print / Save as PDF
          </button>
        </div>
      </div>
    </Modal>
  );
};
