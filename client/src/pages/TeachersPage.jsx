import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  School, 
  Award, 
  Calendar, 
  Edit3, 
  CheckCircle2, 
  XCircle,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Trash2
} from 'lucide-react';
import { api } from '../services/api';
import { Modal } from '../components/Modal';
import { Badge } from '../components/Badge';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // '' | 'active' | 'inactive'
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  // Form State
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    designation: 'Lead Educator',
    qualification: 'B.Ed in Early Childhood Education, Montessori Certified',
    assignedClassId: ''
  });

  const toast = useToast();
  const { role } = useAuth();
  const canEdit = role === 'super_admin' || role === 'school_admin';

  const fetchData = async () => {
    try {
      setLoading(true);
      const [teacherList, clsList] = await Promise.all([
        api.getTeachers(),
        api.getClasses()
      ]);
      setTeachers(teacherList);
      setClasses(clsList);
    } catch (err) {
      toast.error('Failed to load educators: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveTeacher = async (e) => {
    e.preventDefault();
    try {
      if (editingTeacher) {
        await api.updateTeacher(editingTeacher._id, form);
        toast.success('Staff record updated successfully!');
      } else {
        await api.createTeacher(form);
        toast.success('New educator added successfully!');
      }
      setShowAddModal(false);
      setEditingTeacher(null);
      setForm({
        name: '',
        email: '',
        phone: '',
        designation: 'Lead Educator',
        qualification: 'B.Ed in Early Childhood Education, Montessori Certified',
        assignedClassId: ''
      });
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleToggleStatus = async (teacher) => {
    try {
      const newStatus = teacher.status === 'active' ? 'inactive' : 'active';
      await api.updateTeacher(teacher._id, { status: newStatus });
      toast.success(`Staff status changed to ${newStatus}`);
      fetchData();
    } catch (err) {
      toast.error('Error updating status: ' + err.message);
    }
  };

  const handleDeleteTeacher = async (teacherId, name) => {
    if (!window.confirm(`Are you sure you want to remove staff member "${name}"? This will automatically unassign them from any active classes.`)) return;
    try {
      await api.deleteTeacher(teacherId);
      toast.success('Staff member removed.');
      fetchData();
    } catch (err) {
      toast.error('Failed to remove staff member: ' + err.message);
    }
  };

  // Metrics
  const totalStaff = teachers.length;
  const activeStaff = teachers.filter(t => t.status === 'active').length;
  const assignedLeads = teachers.filter(t => t.assignedClassId).length;
  const certifiedCount = teachers.filter(t => t.qualification?.toLowerCase().includes('montessori') || t.qualification?.toLowerCase().includes('certified')).length;

  const filtered = teachers.filter(t => {
    const matchesSearch = 
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      (t.designation && t.designation.toLowerCase().includes(search.toLowerCase())) ||
      (t.assignedClassName && t.assignedClassName.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = !statusFilter || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/70 text-purple-700 text-xs font-bold mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Early Childhood Faculty
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2.5">
            Educators & Staff Directory
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Certified preschool educators, pedagogical mentors, teaching assistants, and administrative staff.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => {
              setEditingTeacher(null);
              setForm({
                name: '',
                email: '',
                phone: '',
                designation: 'Lead Educator',
                qualification: 'B.Ed in Early Childhood Education, Montessori Certified',
                assignedClassId: classes[0]?._id || ''
              });
              setShowAddModal(true);
            }}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:from-purple-700 hover:to-indigo-700 transition-all text-xs flex items-center gap-2 shadow-md shadow-purple-200 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Educator / Staff
          </button>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg">
            👩‍🏫
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Faculty</p>
            <p className="text-xl font-extrabold text-slate-800">{totalStaff}</p>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
            ✨
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Staff</p>
            <p className="text-xl font-extrabold text-emerald-600">{activeStaff}</p>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-lg">
            🏫
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Classroom Leads</p>
            <p className="text-xl font-extrabold text-sky-600">{assignedLeads}</p>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg">
            🎓
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Certified Leads</p>
            <p className="text-xl font-extrabold text-amber-600">{certifiedCount}</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search educator, role, email, class..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between">
          <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-2xl border border-slate-200/80">
            {[
              { id: '', label: 'All' },
              { id: 'active', label: 'Active' },
              { id: 'inactive', label: 'Inactive' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === f.id
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <span className="text-xs font-bold text-slate-500 whitespace-nowrap hidden sm:inline-block">
            {filtered.length} Educators
          </span>
        </div>
      </div>

      {/* Staff Grid */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 text-sm flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          <span>Loading educator profiles...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400">
          <Users className="w-12 h-12 text-purple-200 mx-auto mb-2" />
          <p className="font-bold text-slate-600 text-sm">No educators found matching criteria</p>
          <p className="text-xs text-slate-400 mt-1">Try clearing search terms or adding a new faculty member.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(t => (
            <div
              key={t._id}
              className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 space-y-4 flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={t.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'}
                        alt={t.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-100 shadow-sm"
                      />
                      <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ring-2 ring-white ${t.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-800 group-hover:text-purple-700 transition-colors">
                        {t.name}
                      </h3>
                      <p className="text-xs text-purple-600 font-bold mt-0.5">{t.designation || 'Educator'}</p>
                    </div>
                  </div>
                  <Badge variant={t.status === 'active' ? 'Present' : 'Absent'}>
                    {t.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="p-3 bg-slate-50/80 rounded-2xl text-xs space-y-2 border border-slate-100">
                  <p className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                    <span className="font-medium truncate">{t.email}</span>
                  </p>
                  <p className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                    <span className="font-medium">{t.phone}</span>
                  </p>
                  <p className="flex items-center gap-2 text-slate-700 font-bold pt-1.5 border-t border-slate-200/60">
                    <School className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>Assigned Room: <span className="text-purple-700">{t.assignedClassName || 'Unassigned (Floater)'}</span></span>
                  </p>
                </div>

                <div className="text-[11px] text-slate-600 flex items-start gap-2 bg-purple-50/50 p-2.5 rounded-xl border border-purple-100">
                  <Award className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span className="line-clamp-2 font-medium">{t.qualification || 'Certified Early Childhood Educator'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              {canEdit && (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setEditingTeacher(t);
                      setForm({
                        name: t.name,
                        email: t.email,
                        phone: t.phone,
                        designation: t.designation || '',
                        qualification: t.qualification || '',
                        assignedClassId: t.assignedClassId || ''
                      });
                      setShowAddModal(true);
                    }}
                    className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-500" /> Edit Record
                  </button>

                  <button
                    onClick={() => handleToggleStatus(t)}
                    title={t.status === 'active' ? 'Deactivate staff' : 'Activate staff'}
                    className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-colors ${
                      t.status === 'active'
                        ? 'text-rose-600 bg-rose-50 hover:bg-rose-100'
                        : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                    }`}
                  >
                    {t.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>

                  <button
                    onClick={() => handleDeleteTeacher(t._id, t.name)}
                    title="Remove Staff Record"
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Staff Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={editingTeacher ? `Edit Educator: ${editingTeacher.name}` : 'Register Educator / Staff'}
      >
        <form onSubmit={handleSaveTeacher} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Clara Oswald"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                disabled={!!editingTeacher}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="clara.teacher@kinderhub.edu"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400 disabled:opacity-60"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+1 (555) 014-9911"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Designation</label>
              <input
                type="text"
                value={form.designation}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
                placeholder="e.g. Head Teacher - Playgroup"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Assigned Classroom</label>
            <select
              value={form.assignedClassId}
              onChange={(e) => setForm({ ...form, assignedClassId: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
            >
              <option value="">No Class Assignment (General Staff)</option>
              {classes.map(c => (
                <option key={c._id} value={c._id}>{c.name} ({c.section})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Qualifications & Certifications</label>
            <textarea
              rows="2"
              value={form.qualification}
              onChange={(e) => setForm({ ...form, qualification: e.target.value })}
              placeholder="e.g. B.Ed in Early Childhood Education, Montessori Certified, Pediatric First Aid CPR"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-md shadow-purple-200"
            >
              {editingTeacher ? 'Update Record' : 'Add Staff Member'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
