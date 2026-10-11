import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck, 
  Calendar, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Save, 
  Sparkles, 
  BarChart2, 
  Check, 
  UserX, 
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { Badge } from '../components/Badge';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const AttendancePage = () => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(todayStr);
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  
  // Attendance records state for current sheet
  const [records, setRecords] = useState([]);
  const [isExisting, setIsExisting] = useState(false);
  const [markedBy, setMarkedBy] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const toast = useToast();
  const { user } = useAuth();

  // Load initial classes
  useEffect(() => {
    const initClasses = async () => {
      try {
        const clsList = await api.getClasses();
        setClasses(clsList);
        if (clsList.length > 0) {
          const defaultClass = (user?.role === 'teacher' && user?.assignedClassId)
            ? user.assignedClassId
            : clsList[0]._id;
          setSelectedClassId(defaultClass);
        }
      } catch (err) {
        toast.error('Failed to load classes: ' + err.message);
      }
    };
    initClasses();
  }, [user]);

  // Load attendance when date or class changes
  const fetchAttendanceSheet = async () => {
    if (!selectedClassId || !date) return;
    try {
      setLoading(true);
      const res = await api.getAttendance(date, selectedClassId);
      setIsExisting(res.exists);

      if (res.exists) {
        setRecords(res.attendance.records || []);
        setMarkedBy(res.attendance.markedByName || 'Teacher');
      } else {
        setRecords(res.records || []);
        setMarkedBy('');
      }
    } catch (err) {
      toast.error('Error fetching attendance: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceSheet();
  }, [date, selectedClassId]);

  const handleStatusChange = (childId, status) => {
    setRecords(prev => prev.map(r => {
      if (r.childId === childId) {
        return {
          ...r,
          status,
          checkInTime: status === 'Present' ? '08:55 AM' : (status === 'Late' ? '09:25 AM' : '-')
        };
      }
      return r;
    }));
  };

  const handleRemarksChange = (childId, remarks) => {
    setRecords(prev => prev.map(r => r.childId === childId ? { ...r, remarks } : r));
  };

  const handleMarkAllPresent = () => {
    setRecords(prev => prev.map(r => ({
      ...r,
      status: 'Present',
      checkInTime: '08:55 AM'
    })));
    toast.info('All classroom students marked as Present! 🟢');
  };

  // Stats calculation
  const totalStudents = records.length;
  const presentCount = records.filter(r => r.status === 'Present').length;
  const lateCount = records.filter(r => r.status === 'Late').length;
  const absentCount = records.filter(r => r.status === 'Absent').length;
  const leaveCount = records.filter(r => r.status === 'Leave').length;
  const attendanceRate = totalStudents > 0 
    ? Math.round(((presentCount + lateCount) / totalStudents) * 100) 
    : 0;

  const handleSaveAttendance = async () => {
    if (records.length === 0) {
      toast.warning('No enrolled students in this class to record attendance for.');
      return;
    }

    try {
      setSaving(true);
      const res = await api.saveAttendance({
        date,
        classId: selectedClassId,
        records
      });
      toast.success(res.message);
      setIsExisting(true);
      setMarkedBy(user?.name || 'Lead Educator');
    } catch (err) {
      toast.error('Save failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight font-heading flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-emerald-100 text-emerald-700">
              <CalendarCheck className="w-6 h-6" />
            </span>
            Daily Attendance Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Log drop-offs, track punctuality, record health leaves, and audit live attendance statistics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleMarkAllPresent}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 font-extrabold text-xs transition-colors shadow-2xs"
          >
            Mark All Present
          </button>
          <button
            onClick={handleSaveAttendance}
            disabled={saving || records.length === 0}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-200 disabled:opacity-50 active:scale-95"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Attendance Sheet'}
          </button>
        </div>
      </div>

      {/* Date & Classroom Toolbar */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 mb-1 uppercase font-heading">Roster Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 mb-1 uppercase font-heading">Classroom Group</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-400"
            >
              {classes.map(c => (
                <option key={c._id} value={c._id}>{c.name} ({c.section}) - {c.roomNumber}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Audit Status Badge */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {isExisting ? (
            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Saved & Audited
              </span>
              <p className="text-[10px] text-slate-400 mt-0.5">Recorded by {markedBy || 'Teacher'}</p>
            </div>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
              <Clock className="w-3.5 h-3.5 text-amber-600" /> Unsaved Daily Draft
            </span>
          )}
        </div>
      </div>

      {/* Live Breakdown Cards with Progress Bar */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <span className="text-xs font-extrabold text-slate-800 font-heading">
            Class Attendance Distribution ({totalStudents} Students)
          </span>
          <span className="text-xs font-extrabold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
            {attendanceRate}% Total Turnout
          </span>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
          {totalStudents > 0 && (
            <>
              <div 
                style={{ width: `${(presentCount / totalStudents) * 100}%` }} 
                className="bg-emerald-500 h-full transition-all duration-500" 
                title={`Present: ${presentCount}`}
              />
              <div 
                style={{ width: `${(lateCount / totalStudents) * 100}%` }} 
                className="bg-amber-400 h-full transition-all duration-500" 
                title={`Late: ${lateCount}`}
              />
              <div 
                style={{ width: `${(leaveCount / totalStudents) * 100}%` }} 
                className="bg-sky-400 h-full transition-all duration-500" 
                title={`Leave: ${leaveCount}`}
              />
              <div 
                style={{ width: `${(absentCount / totalStudents) * 100}%` }} 
                className="bg-rose-500 h-full transition-all duration-500" 
                title={`Absent: ${absentCount}`}
              />
            </>
          )}
        </div>

        {/* Segment Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
            <span className="font-bold text-emerald-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Present
            </span>
            <span className="font-extrabold text-emerald-900 text-sm">{presentCount}</span>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-center justify-between">
            <span className="font-bold text-amber-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Late Arrival
            </span>
            <span className="font-extrabold text-amber-900 text-sm">{lateCount}</span>
          </div>

          <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-center justify-between">
            <span className="font-bold text-sky-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500" /> Health Leave
            </span>
            <span className="font-extrabold text-sky-900 text-sm">{leaveCount}</span>
          </div>

          <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-100 flex items-center justify-between">
            <span className="font-bold text-rose-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Absent
            </span>
            <span className="font-extrabold text-rose-900 text-sm">{absentCount}</span>
          </div>
        </div>
      </div>

      {/* Attendance Sheet Roster Table */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading classroom attendance sheet...</div>
      ) : records.length === 0 ? (
        <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-2">
          <p className="text-3xl">🧸</p>
          <p className="font-extrabold text-slate-700 font-heading">No students enrolled in this classroom section yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-bold">
                <tr>
                  <th className="px-5 py-3.5">Student</th>
                  <th className="px-5 py-3.5">Attendance Status</th>
                  <th className="px-5 py-3.5">Check-in Time</th>
                  <th className="px-5 py-3.5">Daily Observation / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map(r => (
                  <tr key={r.childId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-800 text-sm">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {r.childName?.charAt(0) || 'K'}
                        </span>
                        <span>{r.childName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="inline-flex rounded-2xl bg-slate-100/90 p-1 gap-1 border border-slate-200/60 shadow-2xs">
                        {[
                          { id: 'Present', label: 'Present', activeBg: 'bg-emerald-600 text-white' },
                          { id: 'Late', label: 'Late', activeBg: 'bg-amber-500 text-white' },
                          { id: 'Leave', label: 'Leave', activeBg: 'bg-sky-600 text-white' },
                          { id: 'Absent', label: 'Absent', activeBg: 'bg-rose-600 text-white' }
                        ].map(st => {
                          const isSelected = r.status === st.id;
                          return (
                            <button
                              key={st.id}
                              type="button"
                              onClick={() => handleStatusChange(r.childId, st.id)}
                              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all ${
                                isSelected
                                  ? `${st.activeBg} shadow-sm scale-102`
                                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                              }`}
                            >
                              {st.label}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-600 font-mono">
                      {r.checkInTime}
                    </td>
                    <td className="px-5 py-3.5">
                      <input
                        type="text"
                        value={r.remarks || ''}
                        onChange={(e) => handleRemarksChange(r.childId, e.target.value)}
                        placeholder="e.g. Happy drop-off, cheerful energy, ate snack..."
                        className="w-full px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-400 transition-all"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
