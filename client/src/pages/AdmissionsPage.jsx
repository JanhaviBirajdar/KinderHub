import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Search, 
  Plus, 
  CheckCircle, 
  XCircle, 
  Clock, 
  UserPlus, 
  FileText, 
  Phone, 
  Mail, 
  Sparkles,
  ArrowRight,
  LayoutGrid,
  List,
  MapPin,
  Calendar,
  Baby,
  Filter,
  CheckCircle2,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { api } from '../services/api';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { useToast } from '../context/ToastContext';

export const AdmissionsPage = () => {
  const [admissions, setAdmissions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Modals
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');

  // Form State
  const [form, setForm] = useState({
    childFirstName: '',
    childLastName: '',
    dob: '2023-04-10',
    gender: 'Female',
    preferredClassId: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    address: '',
    medicalNotes: ''
  });

  const toast = useToast();

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      const [list, clsList] = await Promise.all([
        api.getAdmissions({ search, status: statusFilter }),
        api.getClasses()
      ]);
      setAdmissions(list);
      setClasses(clsList);
      if (clsList.length > 0 && !form.preferredClassId) {
        setForm(prev => ({ ...prev, preferredClassId: clsList[0]._id }));
      }
    } catch (err) {
      toast.error('Failed to load admissions: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, [search, statusFilter]);

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    try {
      await api.submitAdmission(form);
      toast.success('Admission enquiry submitted successfully!');
      setShowApplyModal(false);
      setForm({
        childFirstName: '',
        childLastName: '',
        dob: '2023-04-10',
        gender: 'Female',
        preferredClassId: classes[0]?._id || '',
        parentName: '',
        parentEmail: '',
        parentPhone: '',
        address: '',
        medicalNotes: ''
      });
      fetchAdmissions();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUpdateStatus = async (status) => {
    if (!selectedApp) return;
    try {
      await api.updateAdmissionStatus(selectedApp._id, { status, adminNotes });
      toast.success(`Application marked as ${status}!`);
      setSelectedApp(null);
      fetchAdmissions();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleConvertStudent = async (appId) => {
    try {
      const res = await api.convertAdmissionToChild(appId);
      toast.success(res.message);
      if (selectedApp) setSelectedApp(null);
      fetchAdmissions();
    } catch (err) {
      toast.error('Conversion failed: ' + err.message);
    }
  };

  const handleDeleteAdmission = async (appId, name) => {
    if (!window.confirm(`Are you sure you want to remove admission enquiry for "${name}"?`)) return;
    try {
      await api.deleteAdmission(appId);
      toast.success('Admission enquiry deleted.');
      if (selectedApp && selectedApp._id === appId) setSelectedApp(null);
      fetchAdmissions();
    } catch (err) {
      toast.error('Failed to delete enquiry: ' + err.message);
    }
  };

  // Metrics
  const totalCount = admissions.length;
  const pendingCount = admissions.filter(a => a.status === 'Pending').length;
  const reviewCount = admissions.filter(a => a.status === 'Under Review').length;
  const approvedCount = admissions.filter(a => a.status === 'Approved').length;

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/70 text-purple-700 text-xs font-bold mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Admissions & Enrollment Hub
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2.5">
            Admissions Pipeline
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review applicant inquiries, schedule assessments, and transition accepted candidates into enrolled students.
          </p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:from-purple-700 hover:to-indigo-700 transition-all text-xs flex items-center gap-2 shadow-md shadow-purple-200 active:scale-95"
        >
          <Plus className="w-4 h-4" /> New Admission Enquiry
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg">
            📋
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Enquiries</p>
            <p className="text-xl font-extrabold text-slate-800">{totalCount}</p>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg">
            ⏳
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Review</p>
            <p className="text-xl font-extrabold text-amber-600">{pendingCount}</p>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-lg">
            🔍
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Under Review</p>
            <p className="text-xl font-extrabold text-sky-600">{reviewCount}</p>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
            🎉
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Approved / Enrolled</p>
            <p className="text-xl font-extrabold text-emerald-600">{approvedCount}</p>
          </div>
        </div>
      </div>

      {/* Filter & View Bar */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search candidate name, App #, parent..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-between overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-2xl border border-slate-200/80">
            {['', 'Pending', 'Under Review', 'Approved', 'Rejected'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {st || 'All'}
              </button>
            ))}
          </div>

          {/* Toggle Grid/Table */}
          <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60 ml-2">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white text-purple-600 shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white text-purple-600 shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Applications Content */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 text-sm flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          <span>Loading preschool applications...</span>
        </div>
      ) : admissions.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400">
          <Baby className="w-12 h-12 text-purple-200 mx-auto mb-2" />
          <p className="font-bold text-slate-600 text-sm">No applications found</p>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria or register a new candidate.</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {admissions.map(app => (
            <div
              key={app._id}
              className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
                    {app.applicationNo}
                  </span>
                  <Badge variant={app.status}>{app.status}</Badge>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-100 to-pink-100 border border-purple-200 flex items-center justify-center font-extrabold text-purple-700 text-base shadow-xs">
                    {app.childFirstName?.[0]}{app.childLastName?.[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">
                      {app.childFirstName} {app.childLastName}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span>DOB: {app.dob}</span> • <span className="font-medium text-slate-600">{app.gender}</span>
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50/80 rounded-2xl text-xs space-y-1.5 border border-slate-100">
                  <p className="flex items-center justify-between">
                    <span className="text-slate-400">Class Interest:</span>
                    <span className="font-bold text-purple-700">{app.preferredClassName}</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span className="text-slate-400">Parent / Guardian:</span>
                    <span className="font-semibold text-slate-700">{app.parentName}</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span className="text-slate-400">Phone:</span>
                    <span className="font-medium text-slate-600">{app.parentPhone}</span>
                  </p>
                </div>
              </div>

              {/* Card Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setSelectedApp(app);
                    setAdminNotes(app.adminNotes || '');
                  }}
                  className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" /> Review Details
                </button>

                {app.status === 'Approved' && !app.convertedChildId && (
                  <button
                    onClick={() => handleConvertStudent(app._id)}
                    className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-white text-xs transition-colors shadow-sm flex items-center gap-1"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Enroll
                  </button>
                )}

                {app.convertedChildId && (
                  <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Enrolled
                  </span>
                )}

                <button
                  onClick={() => handleDeleteAdmission(app._id, `${app.childFirstName} ${app.childLastName}`)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete Enquiry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-bold">
                <tr>
                  <th className="px-5 py-4">App Number</th>
                  <th className="px-5 py-4">Child Candidate</th>
                  <th className="px-5 py-4">Preferred Class</th>
                  <th className="px-5 py-4">Parent / Guardian</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {admissions.map(app => (
                  <tr key={app._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 font-extrabold text-purple-700">
                      {app.applicationNo}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-purple-100/60 text-purple-700 font-bold flex items-center justify-center text-xs">
                          {app.childFirstName?.[0]}{app.childLastName?.[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{app.childFirstName} {app.childLastName}</p>
                          <p className="text-[11px] text-slate-400">DOB: {app.dob} • {app.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-700">
                      <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-lg border border-purple-100 font-bold">
                        {app.preferredClassName}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-700">{app.parentName}</p>
                      <p className="text-[11px] text-slate-500">{app.parentPhone}</p>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={app.status}>{app.status}</Badge>
                    </td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setAdminNotes(app.adminNotes || '');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 transition-colors"
                      >
                        Review
                      </button>
                      {app.status === 'Approved' && !app.convertedChildId && (
                        <button
                          onClick={() => handleConvertStudent(app._id)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-white transition-colors shadow-sm inline-flex items-center gap-1"
                        >
                          <UserPlus className="w-3.5 h-3.5" /> Convert to Student
                        </button>
                      )}
                      {app.convertedChildId && (
                        <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200 inline-flex items-center gap-1">
                          ✓ Enrolled
                        </span>
                      )}
                      <button
                        onClick={() => handleDeleteAdmission(app._id, `${app.childFirstName} ${app.childLastName}`)}
                        className="px-2 py-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors inline-flex items-center"
                        title="Delete Enquiry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Review Application: ${selectedApp.applicationNo}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-5 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl space-y-2 border border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-800 text-sm">
                  {selectedApp.childFirstName} {selectedApp.childLastName}
                </h4>
                <Badge variant={selectedApp.status}>{selectedApp.status}</Badge>
              </div>
              <p><span className="text-slate-400">Class Preference:</span> <span className="font-semibold text-slate-700">{selectedApp.preferredClassName}</span></p>
              <p><span className="text-slate-400">Parent:</span> <span className="font-semibold text-slate-700">{selectedApp.parentName} ({selectedApp.parentPhone})</span></p>
              <p><span className="text-slate-400">Parent Email:</span> <span className="font-semibold text-slate-700">{selectedApp.parentEmail || '—'}</span></p>
              <p><span className="text-slate-400">Address:</span> <span className="font-semibold text-slate-700">{selectedApp.address || '—'}</span></p>
              <p><span className="text-slate-400">Health / Dietary Notes:</span> <span className="font-semibold text-slate-700">{selectedApp.medicalNotes || 'None'}</span></p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Administrative Notes & Assessment Feedback</label>
              <textarea
                rows="3"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Enter interview feedback, classroom readiness, or status reasoning..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdateStatus('Under Review')}
                  className="px-3.5 py-2 rounded-xl bg-sky-100 text-sky-800 font-bold hover:bg-sky-200 transition-colors"
                >
                  Under Review
                </button>
                <button
                  onClick={() => handleUpdateStatus('Rejected')}
                  className="px-3.5 py-2 rounded-xl bg-rose-100 text-rose-800 font-bold hover:bg-rose-200 transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleDeleteAdmission(selectedApp._id, `${selectedApp.childFirstName} ${selectedApp.childLastName}`)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-bold transition-colors inline-flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdateStatus('Approved')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-200"
                >
                  Approve Application
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* New Application Modal */}
      <Modal isOpen={showApplyModal} onClose={() => setShowApplyModal(false)} title="New Admission Enquiry">
        <form onSubmit={handleSubmitApplication} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Child First Name *</label>
              <input
                type="text"
                required
                value={form.childFirstName}
                onChange={(e) => setForm({ ...form, childFirstName: e.target.value })}
                placeholder="e.g. Liam"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Child Last Name *</label>
              <input
                type="text"
                required
                value={form.childLastName}
                onChange={(e) => setForm({ ...form, childLastName: e.target.value })}
                placeholder="e.g. Miller"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Date of Birth *</label>
              <input
                type="date"
                required
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Gender</label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Preferred Class *</label>
              <select
                value={form.preferredClassId}
                onChange={(e) => setForm({ ...form, preferredClassId: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
              >
                {classes.map(c => (
                  <option key={c._id} value={c._id}>{c.name} ({c.ageGroup})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Parent Name *</label>
              <input
                type="text"
                required
                value={form.parentName}
                onChange={(e) => setForm({ ...form, parentName: e.target.value })}
                placeholder="e.g. Jessica Taylor"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Parent Phone *</label>
              <input
                type="text"
                required
                value={form.parentPhone}
                onChange={(e) => setForm({ ...form, parentPhone: e.target.value })}
                placeholder="+1 (555) 441-2099"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Parent Email</label>
            <input
              type="email"
              value={form.parentEmail}
              onChange={(e) => setForm({ ...form, parentEmail: e.target.value })}
              placeholder="parent@example.com"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Residential Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Street address..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Medical / Allergies / Notes</label>
            <textarea
              rows="2"
              value={form.medicalNotes}
              onChange={(e) => setForm({ ...form, medicalNotes: e.target.value })}
              placeholder="Any dietary restrictions, allergies, or special preschool accommodations..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowApplyModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-md shadow-purple-200"
            >
              Submit Application
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
