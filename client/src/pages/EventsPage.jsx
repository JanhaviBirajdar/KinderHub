import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Plus, 
  MapPin, 
  Clock, 
  Users, 
  Sparkles, 
  Cake, 
  Coffee, 
  Bus,
  Search,
  CheckCircle2,
  Filter,
  Edit3,
  Trash2
} from 'lucide-react';
import { api } from '../services/api';
import { Modal } from '../components/Modal';
import { Badge } from '../components/Badge';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [search, setSearch] = useState('');

  // Form State
  const [form, setForm] = useState({
    title: '',
    description: '',
    eventType: 'Celebration',
    startDate: '2026-10-25T10:00',
    endDate: '2026-10-25T12:00',
    targetAudience: 'All',
    location: 'Preschool Garden'
  });

  const toast = useToast();
  const { role } = useAuth();
  const canCreate = role === 'super_admin' || role === 'school_admin';

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const list = await api.getEvents();
      setEvents(list);
    } catch (err) {
      toast.error('Failed to load events: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const [editingEvent, setEditingEvent] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    eventType: 'Celebration',
    startDate: '2026-10-25T10:00',
    endDate: '2026-10-25T12:00',
    targetAudience: 'All',
    location: 'Preschool Garden'
  });

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await api.createEvent(form);
      toast.success('Preschool event scheduled successfully!');
      setShowAddModal(false);
      setForm({
        title: '',
        description: '',
        eventType: 'Celebration',
        startDate: '2026-10-25T10:00',
        endDate: '2026-10-25T12:00',
        targetAudience: 'All',
        location: 'Preschool Garden'
      });
      fetchEvents();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleOpenEditEvent = (ev) => {
    setEditingEvent(ev);
    setEditForm({
      title: ev.title || '',
      description: ev.description || '',
      eventType: ev.eventType || 'Celebration',
      startDate: ev.startDate ? new Date(ev.startDate).toISOString().slice(0, 16) : '2026-10-25T10:00',
      endDate: ev.endDate ? new Date(ev.endDate).toISOString().slice(0, 16) : '2026-10-25T12:00',
      targetAudience: ev.targetAudience || 'All',
      location: ev.location || 'Preschool Garden'
    });
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    try {
      await api.updateEvent(editingEvent._id, editForm);
      toast.success('Event updated successfully!');
      setEditingEvent(null);
      fetchEvents();
    } catch (err) {
      toast.error('Update failed: ' + err.message);
    }
  };

  const handleDeleteEvent = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove event "${title}"?`)) return;
    try {
      await api.deleteEvent(id);
      toast.success('Event deleted.');
      fetchEvents();
    } catch (err) {
      toast.error('Delete failed: ' + err.message);
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'Celebration': return '🎉';
      case 'Field Trip': return '🚌';
      case 'Parent-Teacher Meeting': return '☕';
      case 'Sports Day': return '🏅';
      case 'Holiday': return '🎈';
      default: return '🌟';
    }
  };

  const filteredEvents = events.filter(ev => {
    const matchesSearch = 
      ev.title.toLowerCase().includes(search.toLowerCase()) ||
      ev.description.toLowerCase().includes(search.toLowerCase()) ||
      ev.location.toLowerCase().includes(search.toLowerCase());
    const matchesType = !filterType || ev.eventType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/70 text-purple-700 text-xs font-bold mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Campus Celebrations & Community
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2.5">
            Preschool Events & Calendar
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Family celebrations, pajama days, sensory pumpkin patch field trips, and parent-teacher growth consultations.
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:from-purple-700 hover:to-indigo-700 transition-all text-xs flex items-center gap-2 shadow-md shadow-purple-200 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Event / Celebration
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search event title, venue, details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-2xl border border-slate-200/80 overflow-x-auto w-full md:w-auto">
          {['', 'Celebration', 'Field Trip', 'Parent-Teacher Meeting', 'Sports Day'].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                filterType === t
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {t || 'All Events'}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 text-sm flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          <span>Loading calendar events...</span>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400">
          <Calendar className="w-12 h-12 text-purple-200 mx-auto mb-2" />
          <p className="font-bold text-slate-600 text-sm">No events found</p>
          <p className="text-xs text-slate-400 mt-1">Try selecting a different filter or schedule a new event.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredEvents.map(ev => {
            const dateObj = new Date(ev.startDate);
            const monthStr = dateObj.toLocaleDateString('en-US', { month: 'short' });
            const dayNum = dateObj.getDate();
            const timeStr = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

            return (
              <div
                key={ev._id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      {/* Calendar Date Block */}
                      <div className="w-14 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex flex-col items-center justify-center shadow-md shadow-purple-200 shrink-0">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider">{monthStr}</span>
                        <span className="text-xl font-black leading-none">{dayNum}</span>
                      </div>

                      <div>
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100 mb-1">
                          {getEventIcon(ev.eventType)} {ev.eventType}
                        </span>
                        <h3 className="text-base sm:text-lg font-extrabold text-slate-800 group-hover:text-purple-700 transition-colors">
                          {ev.title}
                        </h3>
                      </div>
                    </div>

                    <Badge variant="neutral">{ev.targetAudience}</Badge>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {ev.description}
                  </p>

                  <div className="p-3 bg-slate-50/80 rounded-2xl text-xs space-y-1.5 border border-slate-100">
                    <p className="text-slate-600 flex items-center gap-2 font-medium">
                      <Clock className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                      <span>Starts at {timeStr}</span>
                    </p>
                    <p className="text-slate-600 flex items-center gap-2 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                      <span>{ev.location}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Preschool Campus Life</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-purple-600">Open to families</span>
                    {canCreate && (
                      <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
                        <button
                          onClick={() => handleOpenEditEvent(ev)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                          title="Edit Event"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(ev._id, ev.title)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Event Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Schedule New Preschool Event">
        <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Event Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. 🧸 Teddy Bear Picnic & Pajama Day"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Event Type</label>
              <select
                value={form.eventType}
                onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
              >
                <option value="Celebration">Celebration</option>
                <option value="Field Trip">Field Trip</option>
                <option value="Parent-Teacher Meeting">Parent-Teacher Meeting</option>
                <option value="Holiday">Holiday</option>
                <option value="Sports Day">Sports Day</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Audience</label>
              <select
                value={form.targetAudience}
                onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
              >
                <option value="All">All School</option>
                <option value="Parents">Parents Only</option>
                <option value="Teachers">Teachers Only</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Start Date & Time *</label>
              <input
                type="datetime-local"
                required
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">End Date & Time</label>
              <input
                type="datetime-local"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Campus Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. Preschool Sunshine Garden"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Description & Instructions</label>
            <textarea
              rows="3"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What to bring, dress code, schedule details..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
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
              Publish Event
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Event Modal */}
      {editingEvent && (
        <Modal isOpen={!!editingEvent} onClose={() => setEditingEvent(null)} title={`Edit Event: ${editingEvent.title}`}>
          <form onSubmit={handleUpdateEvent} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Event Title *</label>
              <input
                type="text"
                required
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Event Type</label>
                <select
                  value={editForm.eventType}
                  onChange={(e) => setEditForm({ ...editForm, eventType: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
                >
                  <option value="Celebration">Celebration</option>
                  <option value="Field Trip">Field Trip</option>
                  <option value="Parent-Teacher Meeting">Parent-Teacher Meeting</option>
                  <option value="Holiday">Holiday</option>
                  <option value="Sports Day">Sports Day</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Audience</label>
                <select
                  value={editForm.targetAudience}
                  onChange={(e) => setEditForm({ ...editForm, targetAudience: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
                >
                  <option value="All">All School</option>
                  <option value="Parents">Parents Only</option>
                  <option value="Teachers">Teachers Only</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Start Date & Time *</label>
                <input
                  type="datetime-local"
                  required
                  value={editForm.startDate}
                  onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">End Date & Time *</label>
                <input
                  type="datetime-local"
                  required
                  value={editForm.endDate}
                  onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Location / Venue *</label>
              <input
                type="text"
                required
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Description & Instructions</label>
              <textarea
                rows="3"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-md shadow-purple-200"
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
