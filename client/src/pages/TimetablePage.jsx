import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  School, 
  Calendar, 
  User, 
  Sparkles, 
  Sun, 
  Palette, 
  BookOpen, 
  Coffee, 
  Music, 
  TreePine,
  Plus,
  Trash2
} from 'lucide-react';
import { api } from '../services/api';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const TimetablePage = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('All'); // 'All' | 'Monday' | ...

  const [showAddPeriodModal, setShowAddPeriodModal] = useState(false);
  const [targetDay, setTargetDay] = useState('Monday');
  const [periodForm, setPeriodForm] = useState({
    subject: 'Story Circle & Phonics',
    startTime: '10:00 AM',
    endTime: '10:45 AM',
    room: 'Room 101'
  });

  const { role } = useAuth();
  const canEdit = role === 'super_admin' || role === 'school_admin' || role === 'teacher';
  const toast = useToast();

  useEffect(() => {
    const fetchInit = async () => {
      try {
        const clsList = await api.getClasses();
        setClasses(clsList);
        if (clsList.length > 0) {
          setSelectedClassId(clsList[0]._id);
        }
      } catch (err) {
        toast.error('Failed to load classes: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInit();
  }, []);

  useEffect(() => {
    const fetchTimetable = async () => {
      if (!selectedClassId) return;
      try {
        const list = await api.getTimetable(selectedClassId);
        setTimetables(list);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTimetable();
  }, [selectedClassId]);

  const handleAddPeriod = async (e) => {
    e.preventDefault();
    try {
      const currentDaySchedule = timetables.find(t => t.dayOfWeek === targetDay);
      const existingPeriods = currentDaySchedule?.periods || [];
      const updatedPeriods = [...existingPeriods, periodForm];

      await api.updateTimetable({
        classId: selectedClassId,
        dayOfWeek: targetDay,
        periods: updatedPeriods
      });
      toast.success(`New period added to ${targetDay}!`);
      setShowAddPeriodModal(false);
      const list = await api.getTimetable(selectedClassId);
      setTimetables(list);
    } catch (err) {
      toast.error('Failed to update timetable: ' + err.message);
    }
  };

  const handleRemovePeriod = async (day, periodIdx) => {
    if (!window.confirm('Are you sure you want to remove this schedule block?')) return;
    try {
      const currentDaySchedule = timetables.find(t => t.dayOfWeek === day);
      if (!currentDaySchedule) return;
      const updatedPeriods = currentDaySchedule.periods.filter((_, idx) => idx !== periodIdx);

      await api.updateTimetable({
        classId: selectedClassId,
        dayOfWeek: day,
        periods: updatedPeriods
      });
      toast.success('Period removed from schedule.');
      const list = await api.getTimetable(selectedClassId);
      setTimetables(list);
    } catch (err) {
      toast.error('Failed to update schedule: ' + err.message);
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const getSubjectEmoji = (subject) => {
    const sub = subject.toLowerCase();
    if (sub.includes('circle') || sub.includes('welcome')) return '☀️';
    if (sub.includes('art') || sub.includes('sensory')) return '🎨';
    if (sub.includes('snack') || sub.includes('nutrition')) return '🍎';
    if (sub.includes('outdoor') || sub.includes('gross')) return '🌿';
    if (sub.includes('story') || sub.includes('phonics')) return '📚';
    if (sub.includes('music')) return '🎵';
    return '🧸';
  };

  const getSubjectColor = (subject) => {
    const sub = subject.toLowerCase();
    if (sub.includes('circle') || sub.includes('welcome')) return 'border-amber-200 bg-amber-50/60 text-amber-900';
    if (sub.includes('art') || sub.includes('sensory')) return 'border-purple-200 bg-purple-50/60 text-purple-900';
    if (sub.includes('snack') || sub.includes('nutrition')) return 'border-emerald-200 bg-emerald-50/60 text-emerald-900';
    if (sub.includes('outdoor') || sub.includes('gross')) return 'border-teal-200 bg-teal-50/60 text-teal-900';
    if (sub.includes('story') || sub.includes('phonics')) return 'border-sky-200 bg-sky-50/60 text-sky-900';
    return 'border-slate-200 bg-slate-50 text-slate-800';
  };

  const filteredDays = selectedDay === 'All' ? days : days.filter(d => d === selectedDay);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/70 text-purple-700 text-xs font-bold mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Daily Preschool Routine & Rhythm
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2.5">
            Classroom Schedule & Timetable
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Structured preschool rhythm including morning circle time, sensory centers, nutrition breaks, and motor play.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <label className="text-xs font-bold text-slate-500 hidden sm:inline-block">Select Section:</label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-purple-400 shadow-sm"
          >
            {classes.map(c => (
              <option key={c._id} value={c._id}>{c.name} ({c.section})</option>
            ))}
          </select>
          {canEdit && (
            <button
              onClick={() => {
                setTargetDay(selectedDay === 'All' ? 'Monday' : selectedDay);
                setShowAddPeriodModal(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" /> Add Block
            </button>
          )}
        </div>
      </div>

      {/* Day Filter Pills */}
      <div className="flex bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60 gap-1.5 overflow-x-auto max-w-full sm:max-w-fit">
        {['All', ...days].map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedDay === day
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Schedule Grid */}
      <div className="space-y-5">
        {filteredDays.map(day => {
          const schedule = timetables.find(t => t.dayOfWeek === day) || timetables[0];
          return (
            <div key={day} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4 hover:shadow-md transition-all">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600" /> {day}
                </span>
                <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                  9:00 AM – 12:30 PM (Half Day Preschool)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                {schedule?.periods?.map((period, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border space-y-2 transition-all hover:scale-101 ${getSubjectColor(period.subject)}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{getSubjectEmoji(period.subject)}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-extrabold bg-white/90 px-2 py-0.5 rounded-md border border-slate-200/80 shadow-2xs">
                          {period.startTime} – {period.endTime}
                        </span>
                        {canEdit && (
                          <button
                            onClick={() => handleRemovePeriod(day, idx)}
                            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-white/80 transition-colors"
                            title="Remove Period"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="font-extrabold text-sm leading-snug">{period.subject}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-1">📍 {period.room}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Period Modal */}
      {showAddPeriodModal && (
        <Modal isOpen={showAddPeriodModal} onClose={() => setShowAddPeriodModal(false)} title="Add Routine Block to Schedule">
          <form onSubmit={handleAddPeriod} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Day of Week</label>
              <select
                value={targetDay}
                onChange={(e) => setTargetDay(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                {days.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Subject / Routine Activity *</label>
              <input
                type="text"
                required
                value={periodForm.subject}
                onChange={(e) => setPeriodForm({ ...periodForm, subject: e.target.value })}
                placeholder="e.g. Sensory Water Play & Bubbles"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Start Time</label>
                <input
                  type="text"
                  required
                  value={periodForm.startTime}
                  onChange={(e) => setPeriodForm({ ...periodForm, startTime: e.target.value })}
                  placeholder="09:45 AM"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">End Time</label>
                <input
                  type="text"
                  required
                  value={periodForm.endTime}
                  onChange={(e) => setPeriodForm({ ...periodForm, endTime: e.target.value })}
                  placeholder="10:30 AM"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Preschool Area / Room</label>
              <input
                type="text"
                required
                value={periodForm.room}
                onChange={(e) => setPeriodForm({ ...periodForm, room: e.target.value })}
                placeholder="Outdoor Playground / Room 101"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddPeriodModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-extrabold hover:bg-purple-700 shadow-md shadow-purple-200"
              >
                Save Period
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
