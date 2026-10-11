import React, { useState, useEffect } from 'react';
import { 
  Baby, 
  Search, 
  Plus, 
  Filter, 
  HeartHandshake, 
  ShieldAlert, 
  Phone, 
  Calendar, 
  Eye, 
  Edit3, 
  Archive, 
  CheckCircle2, 
  AlertTriangle,
  UserCheck,
  FileText,
  Clock,
  Sparkles,
  LayoutGrid,
  List,
  Heart,
  Droplet,
  Trash2
} from 'lucide-react';
import { api } from '../services/api';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const ChildrenPage = () => {
  const [childrenList, setChildrenList] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  
  // Modals
  const [selectedChild, setSelectedChild] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingChild, setEditingChild] = useState(null);
  const [activeProfileTab, setActiveProfileTab] = useState('info'); // 'info' | 'medical' | 'attendance' | 'fees'

  // Form State for Edit Child
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '2023-01-15',
    gender: 'Female',
    bloodGroup: 'O+',
    classId: '',
    section: 'A',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: 'Mother',
    allergies: '',
    medicalNotes: '',
    status: 'Enrolled'
  });

  // Form State for Add Child
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '2023-01-15',
    gender: 'Female',
    bloodGroup: 'O+',
    classId: '',
    section: 'A',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: 'Mother',
    allergies: '',
    medicalNotes: '',
    pickupName: '',
    pickupPhone: '',
    pickupRelation: 'Mother'
  });

  const toast = useToast();
  const { role } = useAuth();
  const canEdit = role === 'super_admin' || role === 'school_admin';

  const fetchData = async () => {
    try {
      setLoading(true);
      const [kids, clsList] = await Promise.all([
        api.getChildren({ search, classId: selectedClass, status: selectedStatus }),
        api.getClasses()
      ]);
      setChildrenList(kids);
      setClasses(clsList);
      if (clsList.length > 0 && !formData.classId) {
        setFormData(prev => ({ ...prev, classId: clsList[0]._id }));
      }
    } catch (err) {
      toast.error('Failed to load children: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, selectedClass, selectedStatus]);

  const handleOpenDetail = async (child) => {
    try {
      const fullChild = await api.getChildById(child._id);
      setSelectedChild(fullChild);
      setActiveProfileTab('info');
    } catch (err) {
      toast.error('Failed to load child details: ' + err.message);
    }
  };

  const handleAddChild = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.classId) {
      toast.warning('Please enter first name, last name, and select a class.');
      return;
    }

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dob: formData.dob,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        classId: formData.classId,
        section: formData.section,
        emergencyContact: {
          name: formData.emergencyName || 'Primary Guardian',
          phone: formData.emergencyPhone || '+1 (555) 012-3456',
          relation: formData.emergencyRelation
        },
        allergies: formData.allergies ? formData.allergies.split(',').map(s => s.trim()) : [],
        medicalNotes: formData.medicalNotes || 'None',
        authorizedPickups: [{
          name: formData.pickupName || formData.emergencyName || 'Mother',
          phone: formData.pickupPhone || formData.emergencyPhone || '+1 (555) 012-3456',
          relation: formData.pickupRelation
        }]
      };

      await api.createChild(payload);
      toast.success(`Child ${formData.firstName} enrolled successfully!`);
      setShowAddModal(false);
      setFormData({
        firstName: '',
        lastName: '',
        dob: '2023-01-15',
        gender: 'Female',
        bloodGroup: 'O+',
        classId: classes[0]?._id || '',
        section: 'A',
        emergencyName: '',
        emergencyPhone: '',
        emergencyRelation: 'Mother',
        allergies: '',
        medicalNotes: '',
        pickupName: '',
        pickupPhone: '',
        pickupRelation: 'Mother'
      });
      fetchData();
    } catch (err) {
      toast.error('Enrollment error: ' + err.message);
    }
  };

  const handleToggleArchive = async (id) => {
    try {
      await api.archiveChild(id);
      toast.success('Child status toggled successfully.');
      fetchData();
      if (selectedChild) setSelectedChild(null);
    } catch (err) {
      toast.error('Error updating child: ' + err.message);
    }
  };

  const handleOpenEdit = (child) => {
    setEditingChild(child);
    setEditFormData({
      firstName: child.firstName || '',
      lastName: child.lastName || '',
      dob: child.dob || '2023-01-15',
      gender: child.gender || 'Female',
      bloodGroup: child.bloodGroup || 'O+',
      classId: child.classId || (classes[0]?._id || ''),
      section: child.section || 'A',
      emergencyName: child.emergencyContact?.name || '',
      emergencyPhone: child.emergencyContact?.phone || '',
      emergencyRelation: child.emergencyContact?.relation || 'Mother',
      allergies: child.allergies ? child.allergies.join(', ') : '',
      medicalNotes: child.medicalNotes || '',
      status: child.status || 'Enrolled'
    });
    setShowEditModal(true);
  };

  const handleUpdateChild = async (e) => {
    e.preventDefault();
    if (!editFormData.firstName || !editFormData.lastName || !editFormData.classId) {
      toast.warning('Please provide first name, last name, and select a class.');
      return;
    }

    try {
      const payload = {
        firstName: editFormData.firstName,
        lastName: editFormData.lastName,
        dob: editFormData.dob,
        gender: editFormData.gender,
        bloodGroup: editFormData.bloodGroup,
        classId: editFormData.classId,
        section: editFormData.section,
        status: editFormData.status,
        emergencyContact: {
          name: editFormData.emergencyName || 'Primary Guardian',
          phone: editFormData.emergencyPhone || '+1 (555) 012-3456',
          relation: editFormData.emergencyRelation || 'Mother'
        },
        allergies: editFormData.allergies ? editFormData.allergies.split(',').map(s => s.trim()).filter(Boolean) : [],
        medicalNotes: editFormData.medicalNotes || 'None'
      };

      await api.updateChild(editingChild._id, payload);
      toast.success(`Child ${editFormData.firstName} updated successfully!`);
      setShowEditModal(false);
      setEditingChild(null);
      if (selectedChild && selectedChild._id === editingChild._id) {
        const fullChild = await api.getChildById(editingChild._id);
        setSelectedChild(fullChild);
      }
      fetchData();
    } catch (err) {
      toast.error('Update error: ' + err.message);
    }
  };

  const handleDeletePermanent = async (id, name) => {
    if (!window.confirm(`Are you sure you want to PERMANENTLY delete record for ${name || 'this student'}? This action cannot be undone.`)) {
      return;
    }
    try {
      await api.deleteChildPermanent(id);
      toast.success('Child record permanently deleted.');
      if (selectedChild && selectedChild._id === id) {
        setSelectedChild(null);
      }
      fetchData();
    } catch (err) {
      toast.error('Permanent deletion failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-slide-up">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight font-heading flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-purple-100 text-purple-700">
              <Baby className="w-6 h-6" />
            </span>
            Children Directory
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Enrolled preschoolers, allergy alerts, pickup authorizations, and comprehensive portfolios.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Grid vs Table View Mode Switcher */}
          <div className="bg-white p-1 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-all ${
                viewMode === 'grid' 
                  ? 'bg-purple-100 text-purple-700 font-bold shadow-xs' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-xl transition-all ${
                viewMode === 'table' 
                  ? 'bg-purple-100 text-purple-700 font-bold shadow-xs' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Table Roster View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {canEdit && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 rounded-2xl bg-purple-600 text-white font-extrabold hover:bg-purple-700 transition-all text-xs flex items-center gap-2 shadow-md shadow-purple-200 active:scale-95"
            >
              <Plus className="w-4 h-4" /> Enroll New Child
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search student name, ID (e.g. KH-2026-001)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="">All Classes</option>
            {classes.map(c => (
              <option key={c._id} value={c._id}>{c.name} ({c.section})</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="">All Statuses</option>
            <option value="Enrolled">Enrolled</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Children Directory View */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading children directory...</div>
      ) : childrenList.length === 0 ? (
        <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
          <p className="text-3xl">🧸</p>
          <p className="font-extrabold text-slate-700 font-heading">No child records found matching your filters.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {childrenList.map(child => {
            const hasAllergies = child.allergies && child.allergies.length > 0;
            return (
              <div 
                key={child._id} 
                className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-[0_4px_20px_-2px_rgba(148,163,184,0.08)] hover:shadow-[0_12px_28px_-4px_rgba(148,163,184,0.16)] transition-all duration-300 space-y-4 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div className="space-y-3">
                  {/* Top Bar with Avatar, ID & Status */}
                  <div className="flex items-start justify-between">
                    <div className="relative">
                      <img 
                        src={child.photo || 'https://images.unsplash.com/photo-1595454223600-91fb57d42531?w=150'} 
                        alt={child.firstName} 
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-100 shadow-xs group-hover:scale-105 transition-transform"
                      />
                      {hasAllergies && (
                        <span 
                          title={`Allergies: ${child.allergies.join(', ')}`} 
                          className="absolute -top-1.5 -right-1.5 p-1 bg-amber-500 text-white rounded-full text-[10px] shadow-sm animate-pulse"
                        >
                          <ShieldAlert className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <Badge variant={child.status}>{child.status}</Badge>
                  </div>

                  {/* Child Info */}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100 font-heading">
                        {child.childId}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-0.5">
                        <Droplet className="w-2.5 h-2.5 text-rose-500" /> {child.bloodGroup}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 mt-1 font-heading">
                      {child.firstName} {child.lastName}
                    </h3>
                    <p className="text-xs text-purple-700 font-bold">
                      {child.className || 'Preschool Class'}
                    </p>
                  </div>

                  {/* Guardian & Emergency Phone */}
                  <div className="p-3 bg-slate-50/80 rounded-2xl text-xs space-y-1 border border-slate-100">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Guardian Contact</p>
                    <p className="font-bold text-slate-700 truncate">{child.parentName || child.emergencyContact?.name}</p>
                    <p className="text-slate-500 flex items-center gap-1 text-[11px] font-medium">
                      <Phone className="w-3 h-3 text-purple-500" />
                      {child.parentPhone || child.emergencyContact?.phone}
                    </p>
                  </div>

                  {/* Allergy Pill */}
                  {hasAllergies && (
                    <div className="px-2.5 py-1 bg-amber-50 border border-amber-200/70 rounded-xl text-[11px] text-amber-800 font-bold flex items-center gap-1.5 truncate">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="truncate">{child.allergies.join(', ')}</span>
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                  <button
                    onClick={() => handleOpenDetail(child)}
                    className="flex-1 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5" /> Full Profile
                  </button>
                  {canEdit && (
                    <>
                      <button
                        onClick={() => handleOpenEdit(child)}
                        title="Edit Child Details"
                        className="p-2 rounded-xl text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleToggleArchive(child._id)}
                        title={child.status === 'Archived' ? 'Re-enroll' : 'Archive'}
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePermanent(child._id, `${child.firstName} ${child.lastName}`)}
                        title="Permanently Delete Child Record"
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-bold">
                <tr>
                  <th className="px-5 py-3.5">Student</th>
                  <th className="px-5 py-3.5">ID / Blood</th>
                  <th className="px-5 py-3.5">Classroom</th>
                  <th className="px-5 py-3.5">Guardian & Emergency</th>
                  <th className="px-5 py-3.5">Medical / Allergies</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {childrenList.map(child => (
                  <tr key={child._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img src={child.photo} alt={child.firstName} className="w-9 h-9 rounded-xl object-cover border" />
                        <div>
                          <p className="font-extrabold text-slate-800 text-sm">{child.firstName} {child.lastName}</p>
                          <p className="text-[11px] text-slate-400">{child.dob}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded text-[11px]">
                        {child.childId}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">Blood: {child.bloodGroup}</p>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-700">
                      {child.className}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-slate-800">{child.parentName}</p>
                      <p className="text-[11px] text-slate-500">{child.parentPhone}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      {child.allergies?.length > 0 ? (
                        <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          ⚠️ {child.allergies[0]}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs font-medium">None</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={child.status}>{child.status}</Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-1.5">
                      <button
                        onClick={() => handleOpenDetail(child)}
                        className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 font-bold text-purple-700 transition-colors"
                      >
                        Profile
                      </button>
                      {canEdit && (
                        <>
                          <button
                            onClick={() => handleOpenEdit(child)}
                            className="px-2 py-1.5 rounded-xl text-slate-400 hover:text-purple-600 transition-colors"
                            title="Edit Record"
                          >
                            <Edit3 className="w-3.5 h-3.5 inline" />
                          </button>
                          <button
                            onClick={() => handleToggleArchive(child._id)}
                            className="px-2 py-1.5 rounded-xl text-slate-400 hover:text-slate-700 transition-colors"
                            title="Archive / Toggle Status"
                          >
                            <Archive className="w-3.5 h-3.5 inline" />
                          </button>
                          <button
                            onClick={() => handleDeletePermanent(child._id, `${child.firstName} ${child.lastName}`)}
                            className="px-2 py-1.5 rounded-xl text-slate-400 hover:text-rose-600 transition-colors"
                            title="Permanently Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5 inline" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Child Full Profile Modal */}
      {selectedChild && (
        <Modal 
          isOpen={!!selectedChild} 
          onClose={() => setSelectedChild(null)} 
          title={`Student Portfolio: ${selectedChild.firstName} ${selectedChild.lastName}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-6">
            {/* Top Mini Header */}
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4.5 rounded-3xl bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 border border-purple-100">
              <img 
                src={selectedChild.photo} 
                alt={selectedChild.firstName} 
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
              />
              <div className="text-center sm:text-left flex-1">
                <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                  <h3 className="text-xl font-extrabold text-slate-800 font-heading">
                    {selectedChild.firstName} {selectedChild.lastName}
                  </h3>
                  <Badge variant={selectedChild.status}>{selectedChild.status}</Badge>
                  {canEdit && (
                    <button
                      onClick={() => handleOpenEdit(selectedChild)}
                      className="px-2.5 py-1 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs font-bold inline-flex items-center gap-1 transition-colors ml-1"
                      title="Edit Student Info"
                    >
                      <Edit3 className="w-3 h-3" /> Edit Profile
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  ID: <span className="font-bold text-purple-700">{selectedChild.childId}</span> • Class: {selectedChild.className} • Blood: {selectedChild.bloodGroup}
                </p>
              </div>
            </div>

            {/* Profile Tabs */}
            <div className="flex border-b border-slate-200 gap-2">
              {[
                { id: 'info', label: 'Personal & Guardian', icon: UserCheck },
                { id: 'medical', label: 'Medical & Pickups', icon: ShieldAlert },
                { id: 'attendance', label: 'Attendance History', icon: Clock },
                { id: 'fees', label: 'Tuition Invoices', icon: FileText },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveProfileTab(tab.id)}
                  className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                    activeProfileTab === tab.id
                      ? 'border-purple-600 text-purple-700'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Personal & Guardian */}
            {activeProfileTab === 'info' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4.5 bg-slate-50/80 rounded-2xl space-y-2 border border-slate-100">
                  <p className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px] font-heading">Student Information</p>
                  <p><span className="text-slate-400">Date of Birth:</span> <span className="font-bold text-slate-700">{selectedChild.dob}</span></p>
                  <p><span className="text-slate-400">Gender:</span> <span className="font-bold text-slate-700">{selectedChild.gender}</span></p>
                  <p><span className="text-slate-400">Admission Date:</span> <span className="font-bold text-slate-700">{selectedChild.admissionDate}</span></p>
                  <p><span className="text-slate-400">Blood Group:</span> <span className="font-bold text-slate-700">{selectedChild.bloodGroup}</span></p>
                </div>

                <div className="p-4.5 bg-slate-50/80 rounded-2xl space-y-2 border border-slate-100">
                  <p className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px] font-heading">Primary Emergency Contact</p>
                  <p><span className="text-slate-400">Name:</span> <span className="font-bold text-slate-700">{selectedChild.emergencyContact?.name}</span></p>
                  <p><span className="text-slate-400">Relationship:</span> <span className="font-bold text-slate-700">{selectedChild.emergencyContact?.relation}</span></p>
                  <p><span className="text-slate-400">Emergency Phone:</span> <span className="font-bold text-purple-700">{selectedChild.emergencyContact?.phone}</span></p>
                </div>
              </div>
            )}

            {/* Tab 2: Medical & Authorized Pickups */}
            {activeProfileTab === 'medical' && (
              <div className="space-y-4 text-xs">
                <div className="p-4.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-extrabold font-heading">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    Allergy & Health Safety Alert
                  </div>
                  <p className="text-slate-700 font-medium">
                    Allergies: {selectedChild.allergies?.length > 0 ? selectedChild.allergies.join(', ') : 'None reported.'}
                  </p>
                  <p className="text-slate-600">
                    Medical Accommodations: <span className="font-bold text-slate-800">{selectedChild.medicalNotes || 'No chronic health needs.'}</span>
                  </p>
                </div>

                <div className="p-4.5 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-3">
                  <p className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px] font-heading">Authorized Pickup Roster</p>
                  <div className="space-y-2">
                    {selectedChild.authorizedPickups?.map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200/70 shadow-xs">
                        <div>
                          <p className="font-bold text-slate-800">{p.name}</p>
                          <p className="text-[11px] text-slate-400">{p.relation}</p>
                        </div>
                        <p className="font-bold text-purple-700 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {p.phone}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Attendance History */}
            {activeProfileTab === 'attendance' && (
              <div className="space-y-3 text-xs">
                <div className="border border-slate-100 rounded-2xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100/70 text-slate-600 font-bold text-[11px]">
                      <tr>
                        <th className="px-4 py-2.5">Date</th>
                        <th className="px-4 py-2.5">Status</th>
                        <th className="px-4 py-2.5">Check-in Time</th>
                        <th className="px-4 py-2.5">Teacher Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedChild.attendanceHistory?.length > 0 ? (
                        selectedChild.attendanceHistory.map((att, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-2.5 font-bold text-slate-700">{att.date}</td>
                            <td className="px-4 py-2.5"><Badge variant={att.status}>{att.status}</Badge></td>
                            <td className="px-4 py-2.5 text-slate-500">{att.checkInTime}</td>
                            <td className="px-4 py-2.5 text-slate-600">{att.remarks || '—'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-4 py-6 text-center text-slate-400 font-semibold">
                            No attendance history logged yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 4: Fee Invoices */}
            {activeProfileTab === 'fees' && (
              <div className="space-y-3 text-xs">
                <div className="border border-slate-100 rounded-2xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100/70 text-slate-600 font-bold text-[11px]">
                      <tr>
                        <th className="px-4 py-2.5">Invoice #</th>
                        <th className="px-4 py-2.5">Term</th>
                        <th className="px-4 py-2.5">Total Amount</th>
                        <th className="px-4 py-2.5">Paid</th>
                        <th className="px-4 py-2.5">Balance</th>
                        <th className="px-4 py-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedChild.feeInvoices?.length > 0 ? (
                        selectedChild.feeInvoices.map((inv) => (
                          <tr key={inv._id}>
                            <td className="px-4 py-2.5 font-extrabold text-purple-700">{inv.invoiceNo}</td>
                            <td className="px-4 py-2.5 text-slate-700">{inv.monthYear}</td>
                            <td className="px-4 py-2.5 font-bold text-slate-800">${inv.totalAmount}</td>
                            <td className="px-4 py-2.5 text-emerald-600 font-bold">${inv.paidAmount}</td>
                            <td className="px-4 py-2.5 text-rose-600 font-extrabold">${inv.balanceAmount}</td>
                            <td className="px-4 py-2.5"><Badge variant={inv.status}>{inv.status}</Badge></td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-4 py-6 text-center text-slate-400 font-semibold">
                            No invoices generated for this student.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Add New Child Modal Form */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Enroll New Preschooler">
        <form onSubmit={handleAddChild} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">First Name *</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-400"
                placeholder="e.g. Liam"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-400"
                placeholder="e.g. Miller"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Date of Birth *</label>
              <input
                type="date"
                required
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Class *</label>
              <select
                value={formData.classId}
                onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                {classes.map(c => (
                  <option key={c._id} value={c._id}>{c.name} ({c.section})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Emergency Contact Name</label>
              <input
                type="text"
                value={formData.emergencyName}
                onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                placeholder="e.g. Rachel Miller"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Emergency Contact Phone</label>
              <input
                type="text"
                value={formData.emergencyPhone}
                onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                placeholder="+1 (555) 019-9988"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Allergies (comma separated)</label>
            <input
              type="text"
              value={formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              placeholder="e.g. Peanuts, Strawberries, Dairy"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Medical / Health Notes</label>
            <textarea
              rows="2"
              value={formData.medicalNotes}
              onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
              placeholder="Any special accommodations or instructions..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-extrabold hover:bg-purple-700 shadow-md shadow-purple-200 active:scale-95"
            >
              Complete Enrollment
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Child Modal Form */}
      {editingChild && (
        <Modal isOpen={showEditModal} onClose={() => { setShowEditModal(false); setEditingChild(null); }} title={`Edit Preschooler: ${editingChild.firstName} ${editingChild.lastName}`}>
          <form onSubmit={handleUpdateChild} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  value={editFormData.firstName}
                  onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  value={editFormData.lastName}
                  onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Date of Birth *</label>
                <input
                  type="date"
                  required
                  value={editFormData.dob}
                  onChange={(e) => setEditFormData({ ...editFormData, dob: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Gender</label>
                <select
                  value={editFormData.gender}
                  onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Status</label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  <option value="Enrolled">Enrolled</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Class *</label>
                <select
                  value={editFormData.classId}
                  onChange={(e) => setEditFormData({ ...editFormData, classId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  {classes.map(c => (
                    <option key={c._id} value={c._id}>{c.name} ({c.section})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Blood Group</label>
                <select
                  value={editFormData.bloodGroup}
                  onChange={(e) => setEditFormData({ ...editFormData, bloodGroup: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Emergency Contact Name</label>
                <input
                  type="text"
                  value={editFormData.emergencyName}
                  onChange={(e) => setEditFormData({ ...editFormData, emergencyName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Emergency Contact Phone</label>
                <input
                  type="text"
                  value={editFormData.emergencyPhone}
                  onChange={(e) => setEditFormData({ ...editFormData, emergencyPhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Allergies (comma separated)</label>
              <input
                type="text"
                value={editFormData.allergies}
                onChange={(e) => setEditFormData({ ...editFormData, allergies: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Medical / Health Notes</label>
              <textarea
                rows="2"
                value={editFormData.medicalNotes}
                onChange={(e) => setEditFormData({ ...editFormData, medicalNotes: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => { setShowEditModal(false); setEditingChild(null); }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-extrabold hover:bg-purple-700 shadow-md shadow-purple-200 active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
