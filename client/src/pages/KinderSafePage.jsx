import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  QrCode, 
  KeyRound, 
  CheckCircle2, 
  AlertTriangle, 
  Phone, 
  Clock, 
  UserCheck, 
  Users, 
  Plus, 
  AlertOctagon, 
  FileText, 
  Lock, 
  Eye, 
  ShieldAlert, 
  HeartHandshake, 
  RefreshCw, 
  Sparkles,
  Camera,
  X,
  Printer
} from 'lucide-react';
import { api } from '../services/api';
import { Modal } from '../components/Modal';
import { Badge } from '../components/Badge';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const KinderSafePage = () => {
  const { role, user } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('guardians'); // 'guardians' | 'verification' | 'accountability' | 'incidents' | 'audit'
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [safetyProfile, setSafetyProfile] = useState(null);
  const [accountabilityData, setAccountabilityData] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showGeneratePassModal, setShowGeneratePassModal] = useState(false);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [newlyGeneratedPass, setNewlyGeneratedPass] = useState(null);

  // Staff Verification Screen State
  const [verifyInput, setVerifyInput] = useState(''); // Pass code or OTP
  const [verificationResult, setVerificationResult] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [handoverNotes, setHandoverNotes] = useState('');

  // Form: Generate Pass
  const [passForm, setPassForm] = useState({
    guardianName: '',
    guardianRelation: 'Mother',
    guardianPhone: '',
    validHours: 4
  });

  // Form: Log Incident
  const [incForm, setIncForm] = useState({
    childId: '',
    category: 'Minor Scrape/Fall',
    severity: 'Low',
    location: 'Playground soft mulch',
    description: '',
    actionsTaken: '',
    firstAidAdministered: true,
    parentContacted: true
  });

  const isStaff = role === 'super_admin' || role === 'school_admin' || role === 'teacher';
  const isParent = role === 'parent';

  // Fetch children list
  useEffect(() => {
    const fetchKids = async () => {
      try {
        setLoading(true);
        const kidList = await api.getChildren();
        setChildren(kidList);
        if (kidList.length > 0) {
          setSelectedChildId(kidList[0]._id);
          setIncForm(prev => ({ ...prev, childId: kidList[0]._id }));
        }
      } catch (err) {
        toast.error('Failed to load children: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchKids();
  }, []);

  // Fetch child safety profile
  const fetchSafetyData = async (childId) => {
    if (!childId) return;
    try {
      const res = await api.getGuardiansAndSafety(childId);
      setSafetyProfile(res);
      if (res.guardians?.length > 0 && !passForm.guardianName) {
        setPassForm(prev => ({
          ...prev,
          guardianName: res.guardians[0].name,
          guardianRelation: res.guardians[0].relation,
          guardianPhone: res.guardians[0].phone
        }));
      }
    } catch (err) {
      toast.error('Failed to load safety profile: ' + err.message);
    }
  };

  useEffect(() => {
    if (selectedChildId) {
      fetchSafetyData(selectedChildId);
    }
  }, [selectedChildId]);

  // Fetch accountability & incidents when tabs change
  useEffect(() => {
    if (activeTab === 'accountability' && isStaff) {
      loadAccountability();
    } else if (activeTab === 'incidents') {
      loadIncidents();
    } else if (activeTab === 'audit' && isStaff) {
      loadAudit();
    }
  }, [activeTab]);

  const loadAccountability = async () => {
    try {
      setLoading(true);
      const res = await api.getEmergencyAccountability();
      setAccountabilityData(res);
    } catch (err) {
      toast.error('Failed to load accountability: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadIncidents = async () => {
    try {
      setLoading(true);
      const res = await api.getIncidents();
      setIncidents(res);
    } catch (err) {
      toast.error('Failed to load incidents: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadAudit = async () => {
    try {
      setLoading(true);
      const res = await api.getPickupAuditHistory();
      setAuditLogs(res.auditLogs || []);
    } catch (err) {
      toast.error('Failed to load audit history: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Generate Time-Limited Pickup Pass & 6-Digit OTP
  const handleGeneratePass = async (e) => {
    e.preventDefault();
    try {
      const res = await api.generatePickupPass({
        childId: selectedChildId,
        guardianName: passForm.guardianName,
        guardianRelation: passForm.guardianRelation,
        guardianPhone: passForm.guardianPhone,
        validHours: Number(passForm.validHours)
      });

      toast.success('Pickup pass with OTP generated successfully!');
      setNewlyGeneratedPass(res.pass);
      setShowGeneratePassModal(false);
      fetchSafetyData(selectedChildId);
    } catch (err) {
      toast.error('Failed to generate pass: ' + err.message);
    }
  };

  // Verify Pickup Pass (Staff screen)
  const handleVerifyPass = async (e) => {
    e.preventDefault();
    if (!verifyInput.trim()) return;

    try {
      setVerifying(true);
      const isOtp = /^\d{6}$/.test(verifyInput.trim());
      const res = await api.verifyPickupPass({
        passCode: isOtp ? '' : verifyInput.trim(),
        otp: isOtp ? verifyInput.trim() : ''
      });
      setVerificationResult(res);
      toast.success('Pass verified! Cross-check photo and authorized identity.');
    } catch (err) {
      setVerificationResult(null);
      toast.error(err.message || 'Verification check failed.');
    } finally {
      setVerifying(false);
    }
  };

  // Confirm Handover
  const handleConfirmHandover = async () => {
    if (!verificationResult?.pass?._id) return;

    try {
      const res = await api.confirmPickupHandover({
        passId: verificationResult.pass._id,
        handoverNotes: handoverNotes || 'Guardian verified against authorized directory.',
        recipientName: verificationResult.pass.guardianName
      });

      toast.success(res.message);
      setVerificationResult(null);
      setVerifyInput('');
      setHandoverNotes('');
      if (activeTab === 'accountability') loadAccountability();
    } catch (err) {
      toast.error('Failed to confirm pickup: ' + err.message);
    }
  };

  // Create Incident Report
  const handleSaveIncident = async (e) => {
    e.preventDefault();
    if (!incForm.description || !incForm.actionsTaken) {
      toast.error('Description and actions taken are mandatory.');
      return;
    }

    try {
      await api.createIncident(incForm);
      toast.success('Safety incident logged with follow-up tracking.');
      setShowIncidentModal(false);
      setIncForm({
        childId: selectedChildId,
        category: 'Minor Scrape/Fall',
        severity: 'Low',
        location: 'Playground soft mulch',
        description: '',
        actionsTaken: '',
        firstAidAdministered: true,
        parentContacted: true
      });
      loadIncidents();
    } catch (err) {
      toast.error('Failed to record incident: ' + err.message);
    }
  };

  const child = safetyProfile?.child;

  return (
    <div className="space-y-8 pb-16 animate-fade-in">
      {/* Hero Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 text-white shadow-xl shadow-rose-500/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-orange-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-extrabold uppercase tracking-wider">
              🛡️ KinderSafe • Child Safety & Authorized Pickup Protocol
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Secure Pickups & Emergency Readiness
            </h2>
            <p className="text-rose-100 text-sm max-w-2xl leading-relaxed">
              Protect every child with time-limited QR passes, 6-digit OTP verification, real-time emergency reunification headcounts, restricted medical alerts, and incident tracking. <strong>Face-only recognition is strictly prohibited</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => setShowGeneratePassModal(true)}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-2xl bg-white text-rose-900 font-extrabold hover:bg-rose-50 transition-all text-xs flex items-center justify-center gap-2 shadow-md active:scale-95"
            >
              <KeyRound className="w-4 h-4 text-rose-600" /> Generate Pickup Pass / OTP
            </button>

            {isStaff && (
              <button
                onClick={() => setShowIncidentModal(true)}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-rose-500/80 hover:bg-rose-500 text-white font-extrabold transition-all text-xs flex items-center justify-center gap-1.5 backdrop-blur-md border border-white/20"
              >
                <AlertOctagon className="w-4 h-4" /> Log Incident
              </button>
            )}
          </div>
        </div>

        {/* Tab Switcher Pills */}
        <div className="mt-8 pt-6 border-t border-white/15 flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'guardians', label: 'Authorized Guardians & QR Passes', icon: UserCheck },
            { id: 'verification', label: 'Staff Verification Terminal', icon: QrCode },
            { id: 'accountability', label: 'Live Emergency Reunification', icon: AlertTriangle },
            { id: 'incidents', label: 'Incident Reports & First Aid', icon: AlertOctagon },
            { id: 'audit', label: 'Safety Audit Logs', icon: FileText }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === tab.id
                  ? 'bg-white text-rose-900 shadow-md font-extrabold'
                  : 'bg-white/15 hover:bg-white/25 text-white border border-white/10'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Safety Notice Callout */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-extrabold font-heading">
            Zero-Compromise Child Identity Safeguard:
          </p>
          <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">
            KinderSafe protocol strictly mandates that facial recognition is <strong>never used as the sole identity or pickup verification mechanism</strong>. Staff members must verify the time-limited QR token/OTP, inspect the physical government photo ID, and cross-reference with authorized guardians before release.
          </p>
        </div>
      </div>

      {/* TAB 1: Authorized Guardians & Passes */}
      {activeTab === 'guardians' && (
        <div className="space-y-6">
          {/* Child Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-xs font-bold text-slate-500 shrink-0">Select Child:</span>
            {children.map(c => (
              <button
                key={c._id}
                onClick={() => setSelectedChildId(c._id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  selectedChildId === c._id
                    ? 'bg-rose-100 text-rose-900 border border-rose-300 shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{c.firstName} {c.lastName}</span>
              </button>
            ))}
          </div>

          {child && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Child Medical & Emergency Contacts Alert */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <img src={child.photo} alt={child.firstName} className="w-14 h-14 rounded-2xl object-cover border border-rose-200" />
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 font-heading">
                      {child.firstName} {child.lastName}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">Class: {child.className} • Blood: {child.bloodGroup}</p>
                  </div>
                </div>

                {/* Health & Allergy Box */}
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-xs space-y-1.5">
                  <p className="font-extrabold text-amber-900 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" /> Critical Health Alert
                  </p>
                  <p className="text-slate-700">
                    <strong>Allergies:</strong> {child.allergies?.length > 0 ? child.allergies.join(', ') : 'None reported.'}
                  </p>
                  <p className="text-slate-600 text-[11px]">
                    <strong>Medical Notes:</strong> {child.medicalNotes || 'No chronic health alerts.'}
                  </p>
                </div>

                {/* Emergency Contact */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <p className="font-extrabold text-slate-700">Primary Emergency Contact:</p>
                  <p className="font-bold text-slate-900">{child.emergencyContact?.name} ({child.emergencyContact?.relation})</p>
                  <p className="text-rose-700 font-bold">{child.emergencyContact?.phone}</p>
                </div>
              </div>

              {/* Authorized Guardians List */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900 font-heading">
                      Authorized Pickup Guardians
                    </h4>
                    <p className="text-xs text-slate-400">Individuals legally permitted to pick up {child.firstName}</p>
                  </div>
                  <button
                    onClick={() => setShowGeneratePassModal(true)}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> Generate Pass
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(safetyProfile.guardians || []).map(g => (
                    <div key={g._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
                      <img src={g.photo} alt={g.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                      <div className="flex-1 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <p className="font-extrabold text-slate-900 font-heading">{g.name}</p>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {g.relation}
                          </span>
                        </div>
                        <p className="text-slate-600 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" /> {g.phone}
                        </p>
                        <p className="text-[10px] text-emerald-700 font-bold">
                          ✓ Identity & Relationship Verified
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Active Pickup Passes for Child */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h5 className="font-extrabold text-slate-800 text-xs">Active Time-Limited Passes:</h5>
                  {(safetyProfile.activePasses || []).length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No active passes currently generated. Click "Generate Pickup Pass" to create one.</p>
                  ) : (
                    safetyProfile.activePasses.map(pass => (
                      <div key={pass._id} className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-rose-900 font-mono text-sm">{pass.passCode}</span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
                              ACTIVE
                            </span>
                          </div>
                          <p className="text-slate-600">
                            Guardian: <strong>{pass.guardianName}</strong> ({pass.guardianRelation})
                          </p>
                          <p className="text-[11px] text-rose-700 font-semibold">
                            Expires at: {new Date(pass.expiresAt).toLocaleTimeString()}
                          </p>
                        </div>

                        {/* OTP Pill */}
                        <div className="p-2.5 rounded-xl bg-white border border-rose-200 text-center shadow-xs">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">6-Digit OTP</p>
                          <p className="text-lg font-extrabold font-mono text-rose-800 tracking-widest">{pass.otp}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Staff Verification Terminal */}
      {activeTab === 'verification' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs max-w-2xl mx-auto space-y-6">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 font-heading flex items-center gap-2">
              <QrCode className="w-5 h-5 text-rose-600" /> Staff Pickup Verification Terminal
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Enter the 6-digit OTP presented by guardian or scan/enter Pass Code to validate pickup clearance.
            </p>
          </div>

          {/* Verification Form */}
          <form onSubmit={handleVerifyPass} className="flex gap-2">
            <input
              type="text"
              placeholder="Enter 6-digit OTP (e.g. 492815) or Pass Code..."
              value={verifyInput}
              onChange={(e) => setVerifyInput(e.target.value)}
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <button
              type="submit"
              disabled={verifying}
              className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2"
            >
              {verifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              Verify Clearance
            </button>
          </form>

          {/* Verification Result Card */}
          {verificationResult && (
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4 animate-pop-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="font-extrabold text-emerald-900 font-heading text-sm">
                    Authorized Pickup Pass Validated!
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-slate-500">
                  {verificationResult.pass.passCode}
                </span>
              </div>

              {/* Side-by-Side Child & Guardian Match */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Child */}
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-2">
                  <p className="font-extrabold text-slate-400 uppercase tracking-wider text-[10px]">Student Details</p>
                  <div className="flex items-center gap-3">
                    <img src={verificationResult.child?.photo} alt="Child" className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <p className="font-extrabold text-slate-900 font-heading">{verificationResult.child?.firstName} {verificationResult.child?.lastName}</p>
                      <p className="text-slate-500 text-[11px]">{verificationResult.child?.className}</p>
                    </div>
                  </div>
                  {verificationResult.child?.allergies?.length > 0 && (
                    <p className="text-[11px] text-amber-800 font-bold bg-amber-50 p-1.5 rounded-lg border border-amber-200">
                      ⚠️ Allergy: {verificationResult.child.allergies.join(', ')}
                    </p>
                  )}
                </div>

                {/* Guardian */}
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-2">
                  <p className="font-extrabold text-slate-400 uppercase tracking-wider text-[10px]">Authorized Guardian</p>
                  <div className="flex items-center gap-3">
                    <img src={verificationResult.pass.guardianPhoto} alt="Guardian" className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <p className="font-extrabold text-slate-900 font-heading">{verificationResult.pass.guardianName}</p>
                      <p className="text-emerald-700 font-bold text-[11px]">Relation: {verificationResult.pass.guardianRelation}</p>
                      <p className="text-slate-400 text-[10px]">{verificationResult.pass.guardianPhone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Handover Notes Input */}
              <div>
                <label className="block font-bold text-slate-700 text-xs mb-1">
                  Handover Verification Remarks *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Physical photo ID checked and verified against authorized list."
                  value={handoverNotes}
                  onChange={(e) => setHandoverNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setVerificationResult(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmHandover}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Confirm Safe Handover
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Live Emergency Accountability & Reunification */}
      {activeTab === 'accountability' && accountabilityData && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 font-heading flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" /> Live Emergency Reunification Roster
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time on-campus headcount tracking based on today's attendance and verified pickups
              </p>
            </div>
            <button
              onClick={loadAccountability}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-50"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Roster
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <p className="text-2xl font-extrabold text-slate-800 font-heading">{accountabilityData.summary.totalEnrolled}</p>
              <p className="text-[11px] font-bold text-slate-400">Total Enrolled</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
              <p className="text-2xl font-extrabold text-emerald-800 font-heading">{accountabilityData.summary.currentlyOnCampus}</p>
              <p className="text-[11px] font-bold text-emerald-700">Currently On Campus</p>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 text-center">
              <p className="text-2xl font-extrabold text-purple-800 font-heading">{accountabilityData.summary.pickedUpOffCampus}</p>
              <p className="text-[11px] font-bold text-purple-700">Picked Up (Off Campus)</p>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-center">
              <p className="text-2xl font-extrabold text-rose-800 font-heading">{accountabilityData.summary.absentToday}</p>
              <p className="text-[11px] font-bold text-rose-700">Absent Today</p>
            </div>
          </div>

          {/* Student Accountability Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Class</th>
                  <th className="px-4 py-3">Turnout Status</th>
                  <th className="px-4 py-3">Emergency Status</th>
                  <th className="px-4 py-3">Emergency Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {accountabilityData.roster.map(r => (
                  <tr key={r._id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-bold text-slate-900 flex items-center gap-2.5">
                      <img src={r.photo} alt={r.name} className="w-7 h-7 rounded-lg object-cover" />
                      <span>{r.name}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{r.className}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.attendanceStatus === 'Present' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {r.attendanceStatus} ({r.checkInTime})
                      </span>
                    </td>
                    <td className="px-4 py-3 font-extrabold">
                      <span className={`px-2.5 py-1 rounded-xl text-[11px] ${
                        r.safetyStatus.includes('On Campus') 
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                          : r.isPickedUp
                          ? 'bg-purple-100 text-purple-900 border border-purple-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {r.safetyStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <span className="font-bold">{r.emergencyContact?.name}</span>: {r.emergencyContact?.phone}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Incident Reports */}
      {activeTab === 'incidents' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 font-heading">
                Safety & First Aid Incident Log
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Official preschool record of minor playground falls, allergies, and actions taken
              </p>
            </div>
            {isStaff && (
              <button
                onClick={() => setShowIncidentModal(true)}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Log Incident
              </button>
            )}
          </div>

          <div className="space-y-3">
            {incidents.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center p-8">No safety incidents recorded.</p>
            ) : (
              incidents.map(inc => (
                <div key={inc._id} className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-rose-800 font-mono">{inc.incidentId}</span>
                      <span className="font-bold text-slate-900">{inc.childName} ({inc.className})</span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                        {inc.category}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-semibold">{inc.date} • {inc.time}</span>
                  </div>

                  <p className="text-slate-700 leading-relaxed">
                    <strong>Incident Description:</strong> {inc.description}
                  </p>
                  <p className="text-slate-600">
                    <strong>Action Taken:</strong> {inc.actionsTaken}
                  </p>

                  <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
                    <span>First Aid Administered: <strong>{inc.firstAidAdministered ? 'Yes' : 'No'}</strong> • Parent Contacted: <strong>{inc.parentContacted ? 'Yes' : 'No'}</strong></span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Status: {inc.followUpStatus}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 5: Safety Audit History */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-lg font-extrabold text-slate-900 font-heading">
            Safety Audit History & Drill Records
          </h3>
          <div className="space-y-3 text-xs">
            {auditLogs.map(log => (
              <div key={log._id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-mono text-[10px] font-extrabold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                    {log.actionType}
                  </span>
                  <p className="text-slate-800 font-medium mt-1">{log.details}</p>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold shrink-0">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: Generate Pickup Pass */}
      <Modal
        isOpen={showGeneratePassModal}
        onClose={() => setShowGeneratePassModal(false)}
        title="Generate Time-Limited Pickup Pass & OTP"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleGeneratePass} className="space-y-4 text-xs">
          <p className="text-slate-500 text-[11px]">
            Pass is cryptographically signed and valid for authorized guardians only. Expires automatically after duration.
          </p>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Guardian Name *</label>
            <input
              type="text"
              value={passForm.guardianName}
              onChange={(e) => setPassForm({ ...passForm, guardianName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Relationship</label>
              <select
                value={passForm.guardianRelation}
                onChange={(e) => setPassForm({ ...passForm, guardianRelation: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
              >
                <option value="Mother">Mother</option>
                <option value="Father">Father</option>
                <option value="Grandmother">Grandmother</option>
                <option value="Grandfather">Grandfather</option>
                <option value="Authorized Caretaker">Authorized Caretaker</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Pass Validity Window</label>
              <select
                value={passForm.validHours}
                onChange={(e) => setPassForm({ ...passForm, validHours: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
              >
                <option value={2}>2 Hours</option>
                <option value={4}>4 Hours (Standard)</option>
                <option value={8}>8 Hours (Full Day)</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowGeneratePassModal(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md"
            >
              Generate Pass & OTP
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: Log Incident */}
      <Modal
        isOpen={showIncidentModal}
        onClose={() => setShowIncidentModal(false)}
        title="Log Child Safety or First Aid Incident"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSaveIncident} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Student *</label>
            <select
              value={incForm.childId}
              onChange={(e) => setIncForm({ ...incForm, childId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
            >
              {children.map(c => (
                <option key={c._id} value={c._id}>{c.firstName} {c.lastName} ({c.className})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <select
                value={incForm.category}
                onChange={(e) => setIncForm({ ...incForm, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
              >
                <option value="Minor Scrape/Fall">Minor Scrape/Fall</option>
                <option value="Allergy Exposure">Allergy Exposure</option>
                <option value="Behavioral Disruption">Behavioral Disruption</option>
                <option value="Illness/Fever">Illness/Fever</option>
                <option value="Playground Bump">Playground Bump</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Severity</label>
              <select
                value={incForm.severity}
                onChange={(e) => setIncForm({ ...incForm, severity: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
              >
                <option value="Low">Low (First Aid on site)</option>
                <option value="Medium">Medium (Parent contacted)</option>
                <option value="High">High (Medical review)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Incident Description *</label>
            <textarea
              rows={2}
              placeholder="Describe what occurred, location, and child's state..."
              value={incForm.description}
              onChange={(e) => setIncForm({ ...incForm, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Action Taken & First Aid *</label>
            <textarea
              rows={2}
              placeholder="Describe first aid applied, parent communication, and recovery..."
              value={incForm.actionsTaken}
              onChange={(e) => setIncForm({ ...incForm, actionsTaken: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
              required
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowIncidentModal(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md"
            >
              Record Incident Log
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
