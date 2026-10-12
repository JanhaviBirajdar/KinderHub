import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  AlertTriangle, 
  CreditCard, 
  School, 
  Users, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Phone, 
  Mail, 
  HelpCircle, 
  ShieldCheck, 
  Filter, 
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { api } from '../services/api';
import { Modal } from '../components/Modal';
import { Badge } from '../components/Badge';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const KinderPredictPage = () => {
  const { role } = useAuth();
  const toast = useToast();

  const [alertsData, setAlertsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all' | 'repeated_absences' | 'fee_overdue' | 'class_capacity' | 'admission_followup'
  const [statusFilter, setStatusFilter] = useState('pending'); // 'all' | 'pending' | 'resolved'
  const [resolvingAlert, setResolvingAlert] = useState(null);
  const [resolveRemarks, setResolveRemarks] = useState('');

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await api.getPredictiveAlerts();
      setAlertsData(res);
    } catch (err) {
      toast.error('Failed to load operational alerts: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleResolveAlert = async (alertId, status = 'resolved') => {
    try {
      await api.resolvePredictAlert(alertId, {
        status,
        actionRemarks: resolveRemarks || 'Reviewed and addressed by staff.'
      });
      toast.success(`Alert marked as ${status} successfully!`);
      setResolvingAlert(null);
      setResolveRemarks('');
      fetchAlerts();
    } catch (err) {
      toast.error('Failed to resolve alert: ' + err.message);
    }
  };

  const allAlerts = alertsData?.alerts || [];
  const filteredAlerts = allAlerts.filter(a => {
    if (selectedFilter !== 'all' && a.type !== selectedFilter) return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    return true;
  });

  const summary = alertsData?.summary;

  return (
    <div className="space-y-8 pb-16 animate-fade-in">
      {/* Hero Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white shadow-xl shadow-orange-500/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-rose-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-extrabold uppercase tracking-wider">
              ⚡ KinderPredict • Rule-Based School Action Dashboard
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Proactive School Operations Engine
            </h2>
            <p className="text-orange-100 text-sm max-w-2xl leading-relaxed">
              Transparent, rule-driven alerts generated directly from preschool database records. Identify repeated absences, overdue fee balances, classroom capacity thresholds, and admissions follow-ups with explicit pedagogical explanations and recommended staff actions.
            </p>
          </div>

          <button
            onClick={fetchAlerts}
            className="px-5 py-2.5 rounded-2xl bg-white text-orange-900 font-extrabold hover:bg-orange-50 transition-all text-xs flex items-center gap-2 shadow-md shrink-0 active:scale-95"
          >
            <RefreshCw className="w-4 h-4 text-orange-600" /> Re-evaluate Rules
          </button>
        </div>
      </div>

      {/* Transparent Rules Disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/90 text-xs text-amber-900 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-extrabold font-heading">
            Ethical Governance & Transparent Deterministic Rules:
          </p>
          <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">
            KinderPredict operates <strong>strictly on observable operational metrics</strong> (roster attendance counts, fee ledger dates, capacity limits, and pipeline age). It makes <strong>no unvalidated statistical inferences or predictive claims</strong> regarding a child's health, intelligence, psychology, or future academic outcomes.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Active Action Flags</span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 font-heading">
              {summary.totalActiveAlerts}
            </p>
            <p className="text-[11px] text-slate-500">Requiring educator or admin review</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Critical Priority</span>
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            </div>
            <p className="text-3xl font-extrabold text-rose-700 font-heading">
              {summary.criticalAlerts}
            </p>
            <p className="text-[11px] text-slate-500">Chronic absences or major overdue balances</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Resolved Flags</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-3xl font-extrabold text-emerald-700 font-heading">
              {summary.resolvedAlerts}
            </p>
            <p className="text-[11px] text-slate-500">Addressed by staff with action remarks</p>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 font-heading">
              Operational Action Flags
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review flagged accounts and execute recommended interventions
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:outline-none"
            >
              <option value="all">All Rule Categories</option>
              <option value="repeated_absences">Repeated Absences</option>
              <option value="fee_overdue">Overdue Fees</option>
              <option value="class_capacity">Class Capacity</option>
              <option value="admission_followup">Admissions Pipeline</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:outline-none"
            >
              <option value="pending">Pending Review</option>
              <option value="resolved">Resolved / Reviewed</option>
              <option value="all">All Statuses</option>
            </select>
          </div>
        </div>

        {/* Alert Cards Deck */}
        {loading && allAlerts.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-8 h-8 border-3 border-amber-300 border-t-amber-600 rounded-full animate-spin mx-auto mb-2" />
            Evaluating database rules...
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            No action flags matching this filter. Operations are running smoothly!
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAlerts.map(alert => {
              const isCritical = alert.severity === 'Critical';
              return (
                <div
                  key={alert.alertId}
                  className={`p-6 rounded-3xl border transition-all space-y-3.5 ${
                    alert.status === 'resolved'
                      ? 'bg-slate-50/70 border-slate-200 opacity-75'
                      : isCritical
                      ? 'bg-gradient-to-r from-rose-50/70 to-orange-50/70 border-rose-200 shadow-xs'
                      : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                        isCritical ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {alert.severity} Priority
                      </span>
                      <span className="text-[11px] font-extrabold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {alert.category}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-sm font-heading">
                        {alert.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-slate-700 bg-white px-2.5 py-1 rounded-xl border border-slate-200 shadow-2xs">
                        {alert.metricValue}
                      </span>
                      {alert.status === 'resolved' ? (
                        <span className="text-emerald-700 font-extrabold bg-emerald-100 px-2 py-0.5 rounded-md text-[10px]">
                          ✓ Resolved
                        </span>
                      ) : (
                        <span className="text-amber-800 font-extrabold bg-amber-100 px-2 py-0.5 rounded-md text-[10px] animate-pulse">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Why this appeared: Transparent rule explanation */}
                  <div className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/80 text-xs space-y-1">
                    <p className="font-extrabold text-slate-800 font-heading text-[11px]">
                      🔍 Transparent Rule Trigger Explanation:
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                      {alert.triggerExplanation}
                    </p>
                  </div>

                  {/* Recommended Action */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-xs space-y-1">
                    <p className="font-extrabold text-amber-900 font-heading text-[11px] flex items-center gap-1.5">
                      <ArrowRight className="w-3.5 h-3.5 text-amber-700" /> Recommended Preschool Action:
                    </p>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {alert.recommendedAction}
                    </p>
                  </div>

                  {/* Action Controls */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="text-[10px] text-slate-400 italic">
                      {alert.disclaimer}
                    </span>

                    {alert.status !== 'resolved' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setResolvingAlert(alert)}
                          className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Mark Action Taken
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL: Resolve Alert Remarks */}
      {resolvingAlert && (
        <Modal
          isOpen={!!resolvingAlert}
          onClose={() => setResolvingAlert(null)}
          title={`Log Staff Action: ${resolvingAlert.title}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-600">
              Confirm action taken to resolve this operational alert. This will be recorded in the preschool administrative audit trail.
            </p>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Staff Action Remarks *
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Spoke with Sarah Johnson. Mia had mild fever, returning tomorrow. Or: Sent payment link via WhatsApp."
                value={resolveRemarks}
                onChange={(e) => setResolveRemarks(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 font-medium"
                required
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setResolvingAlert(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleResolveAlert(resolvingAlert.alertId, 'resolved')}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md"
              >
                Resolve Alert
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
