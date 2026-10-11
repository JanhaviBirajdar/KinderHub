import React, { useState, useEffect } from 'react';
import { 
  School, 
  Users, 
  Plus, 
  Edit3, 
  Baby, 
  CheckCircle, 
  AlertCircle, 
  Sparkles,
  Eye,
  Search,
  BookOpen,
  MapPin,
  Smile,
  Trash2
} from 'lucide-react';
import { api } from '../services/api';
import { Modal } from '../components/Modal';
import { Badge } from '../components/Badge';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const ClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [selectedClassChildren, setSelectedClassChildren] = useState(null);
  const [modalSearch, setModalSearch] = useState('');

  // Form State
  const [form, setForm] = useState({
    name: '',
    section: 'A',
    capacity: 20,
    roomNumber: 'Room 101',
    classTeacherId: '',
    ageGroup: '2 – 3 Years',
    colorBadge: 'lavender',
    description: ''
  });

  const toast = useToast();
  const { role } = useAuth();
  const canEdit = role === 'super_admin' || role === 'school_admin';

  const fetchData = async () => {
    try {
      setLoading(true);
      const [clsList, teacherList] = await Promise.all([
        api.getClasses(),
        api.getTeachers()
      ]);
      setClasses(clsList);
      setTeachers(teacherList);
    } catch (err) {
      toast.error('Failed to load classes: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveClass = async (e) => {
    e.preventDefault();
    try {
      if (editingClass) {
        await api.updateClass(editingClass._id, form);
        toast.success('Class details updated!');
      } else {
        await api.createClass(form);
        toast.success('New class group created successfully!');
      }
      setShowAddModal(false);
      setEditingClass(null);
      setForm({
        name: '',
        section: 'A',
        capacity: 20,
        roomNumber: 'Room 101',
        classTeacherId: '',
        ageGroup: '2 – 3 Years',
        colorBadge: 'lavender',
        description: ''
      });
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleViewEnrolled = async (cls) => {
    try {
      const full = await api.getClassById(cls._id);
      setSelectedClassChildren(full);
      setModalSearch('');
    } catch (err) {
      toast.error('Error fetching students: ' + err.message);
    }
  };

  const handleDeleteClass = async (classId, className) => {
    if (!window.confirm(`Are you sure you want to delete classroom "${className}"?`)) return;
    try {
      await api.deleteClass(classId);
      toast.success('Classroom deleted successfully.');
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Metrics
  const totalClasses = classes.length;
  const totalCapacity = classes.reduce((sum, c) => sum + (c.capacity || 20), 0);
  const totalEnrolled = classes.reduce((sum, c) => sum + (c.enrolledCount || 0), 0);
  const overallOccupancy = totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0;

  const filteredClasses = classes.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.section.toLowerCase().includes(search.toLowerCase()) ||
    (c.roomNumber && c.roomNumber.toLowerCase().includes(search.toLowerCase())) ||
    (c.classTeacherName && c.classTeacherName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/70 text-purple-700 text-xs font-bold mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Classroom Environments & Ratios
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2.5">
            Classroom Sections & Groups
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure preschool developmental levels, capacity thresholds, room allocations, and lead educator appointments.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => {
              setEditingClass(null);
              setForm({
                name: '',
                section: 'A',
                capacity: 20,
                roomNumber: 'Room 101',
                classTeacherId: teachers[0]?._id || '',
                ageGroup: '2 – 3 Years',
                colorBadge: 'lavender',
                description: ''
              });
              setShowAddModal(true);
            }}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:from-purple-700 hover:to-indigo-700 transition-all text-xs flex items-center gap-2 shadow-md shadow-purple-200 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Classroom Group
          </button>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg">
            🏫
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Rooms</p>
            <p className="text-xl font-extrabold text-slate-800">{totalClasses}</p>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-lg">
            👶
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Enrolled</p>
            <p className="text-xl font-extrabold text-sky-600">{totalEnrolled}</p>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg">
            🎒
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Capacity</p>
            <p className="text-xl font-extrabold text-amber-600">{totalCapacity}</p>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
            📊
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg Occupancy</p>
            <p className="text-xl font-extrabold text-emerald-600">{overallOccupancy}%</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search classroom, room number, or educator..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
          />
        </div>

        <span className="text-xs font-bold text-slate-500 hidden sm:inline-block">
          Showing {filteredClasses.length} Classroom Groups
        </span>
      </div>

      {/* Class Cards Grid */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 text-sm flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          <span>Loading classroom groups...</span>
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400">
          <School className="w-12 h-12 text-purple-200 mx-auto mb-2" />
          <p className="font-bold text-slate-600 text-sm">No classroom groups match your search</p>
          <p className="text-xs text-slate-400 mt-1">Try modifying your search or add a new classroom section.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {filteredClasses.map(cls => {
            const occupancy = Math.round(((cls.enrolledCount || 0) / (cls.capacity || 20)) * 100);
            const isFull = (cls.enrolledCount || 0) >= (cls.capacity || 20);

            return (
              <div
                key={cls._id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
                      {cls.ageGroup}
                    </span>
                    <Badge variant={cls.colorBadge || 'lavender'}>{cls.roomNumber}</Badge>
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-slate-800 group-hover:text-purple-700 transition-colors">
                      {cls.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">
                      Section: {cls.section}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2">
                      {cls.description || 'Focus on play, social development, and discovery.'}
                    </p>
                  </div>

                  {/* Teacher Info */}
                  <div className="p-3 bg-slate-50/80 rounded-2xl text-xs space-y-1 border border-slate-100">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Class Teacher</p>
                    <p className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                      <Users className="w-3.5 h-3.5 text-purple-600" />
                      {cls.classTeacherName || 'Unassigned'}
                    </p>
                  </div>

                  {/* Capacity Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-500 text-[11px]">Enrollment</span>
                      <span className={isFull ? 'text-rose-600 font-extrabold' : 'text-slate-700 font-bold'}>
                        {cls.enrolledCount || 0} / {cls.capacity} ({occupancy}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          occupancy > 90 ? 'bg-gradient-to-r from-rose-500 to-red-500' : occupancy > 60 ? 'bg-gradient-to-r from-amber-400 to-orange-400' : 'bg-gradient-to-r from-emerald-400 to-teal-500'
                        }`}
                        style={{ width: `${Math.min(100, occupancy)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleViewEnrolled(cls)}
                    className="flex-1 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Students
                  </button>

                  {canEdit && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingClass(cls);
                          setForm({
                            name: cls.name,
                            section: cls.section,
                            capacity: cls.capacity,
                            roomNumber: cls.roomNumber,
                            classTeacherId: cls.classTeacherId || '',
                            ageGroup: cls.ageGroup,
                            colorBadge: cls.colorBadge || 'lavender',
                            description: cls.description || ''
                          });
                          setShowAddModal(true);
                        }}
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Edit Classroom"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClass(cls._id, cls.name)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Classroom"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Enrolled Students Modal */}
      {selectedClassChildren && (
        <Modal
          isOpen={!!selectedClassChildren}
          onClose={() => setSelectedClassChildren(null)}
          title={`Enrolled in ${selectedClassChildren.name} (${selectedClassChildren.section})`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-slate-700 text-xs">
                Total Children: <span className="text-purple-600 font-extrabold">{selectedClassChildren.enrolledChildren?.length || 0}</span>
              </span>
              <span className="text-slate-500 font-medium bg-slate-100 px-2.5 py-1 rounded-lg">
                Room: {selectedClassChildren.roomNumber}
              </span>
            </div>

            {/* Modal Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter student list..."
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {selectedClassChildren.enrolledChildren?.filter(c => 
                modalSearch === '' || 
                c.firstName.toLowerCase().includes(modalSearch.toLowerCase()) || 
                c.lastName.toLowerCase().includes(modalSearch.toLowerCase()) ||
                c.childId.toLowerCase().includes(modalSearch.toLowerCase())
              ).length > 0 ? (
                selectedClassChildren.enrolledChildren
                  .filter(c => 
                    modalSearch === '' || 
                    c.firstName.toLowerCase().includes(modalSearch.toLowerCase()) || 
                    c.lastName.toLowerCase().includes(modalSearch.toLowerCase()) ||
                    c.childId.toLowerCase().includes(modalSearch.toLowerCase())
                  )
                  .map(c => (
                    <div key={c._id} className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100 hover:bg-purple-50/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <img src={c.photo} alt={c.firstName} className="w-9 h-9 rounded-full object-cover border border-purple-200 shadow-xs" />
                        <div>
                          <p className="font-bold text-slate-800 text-xs">{c.firstName} {c.lastName}</p>
                          <p className="text-[11px] text-slate-400">ID: {c.childId} • Parent: {c.parentName}</p>
                        </div>
                      </div>
                      <Badge variant={c.status}>{c.status}</Badge>
                    </div>
                  ))
              ) : (
                <p className="text-center py-6 text-slate-400 font-semibold">
                  {modalSearch ? 'No matching children found.' : 'No students currently enrolled in this section.'}
                </p>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Create / Edit Class Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={editingClass ? `Edit Class: ${editingClass.name}` : 'Create Classroom Section'}
      >
        <form onSubmit={handleSaveClass} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Class Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Playgroup or Nursery"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Section / Nickname</label>
              <input
                type="text"
                value={form.section}
                onChange={(e) => setForm({ ...form, section: e.target.value })}
                placeholder="e.g. Butterflies or Room A"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Age Group</label>
              <input
                type="text"
                value={form.ageGroup}
                onChange={(e) => setForm({ ...form, ageGroup: e.target.value })}
                placeholder="e.g. 2 – 3 Years"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Max Capacity</label>
              <input
                type="number"
                min="5"
                max="30"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Room Number</label>
              <input
                type="text"
                value={form.roomNumber}
                onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Assigned Class Teacher</label>
            <select
              value={form.classTeacherId}
              onChange={(e) => setForm({ ...form, classTeacherId: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
            >
              <option value="">Select Lead Teacher...</option>
              {teachers.map(t => (
                <option key={t._id} value={t._id}>{t.name} ({t.designation || 'Teacher'})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Class Description & Goals</label>
            <textarea
              rows="2"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Sensory exploration, language enrichment, and gentle independence..."
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
              {editingClass ? 'Update Class' : 'Create Class'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
