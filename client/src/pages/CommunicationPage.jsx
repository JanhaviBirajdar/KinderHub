import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  MessageSquare, 
  HeartHandshake, 
  Plus, 
  Send, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  Sparkles,
  ShieldAlert,
  Calendar,
  AlertCircle,
  Baby
} from 'lucide-react';
import { api } from '../services/api';
import { Modal } from '../components/Modal';
import { Badge } from '../components/Badge';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const CommunicationPage = () => {
  const [activeTab, setActiveTab] = useState('announcements'); // 'announcements' | 'messages' | 'leaves'
  const [announcements, setAnnouncements] = useState([]);
  const [messages, setMessages] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [showMsgModal, setShowMsgModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // Forms
  const [annForm, setAnnForm] = useState({
    title: '',
    content: '',
    targetAudience: 'All',
    priority: 'Normal'
  });

  const [msgForm, setMsgForm] = useState({
    receiverId: '',
    subject: '',
    message: '',
    childName: ''
  });

  const [leaveForm, setLeaveForm] = useState({
    childId: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reason: ''
  });

  const toast = useToast();
  const { user, role } = useAuth();
  const canPublishAnn = role === 'super_admin' || role === 'school_admin' || role === 'teacher';
  const canReviewLeaves = role === 'super_admin' || role === 'school_admin' || role === 'teacher';

  const fetchData = async () => {
    try {
      setLoading(true);
      const [annList, msgList, leaveList, teachList, kidList] = await Promise.all([
        api.getAnnouncements(),
        api.getMessages(),
        api.getLeaves(),
        api.getTeachers(),
        api.getChildren()
      ]);
      setAnnouncements(annList);
      setMessages(msgList);
      setLeaves(leaveList);
      setTeachers(teachList);
      setChildren(kidList);
      if (teachList.length > 0 && !msgForm.receiverId) {
        setMsgForm(prev => ({ ...prev, receiverId: teachList[0]._id }));
      }
      if (kidList.length > 0 && !leaveForm.childId) {
        setLeaveForm(prev => ({ ...prev, childId: kidList[0]._id }));
      }
    } catch (err) {
      toast.error('Failed to load communication feed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateAnn = async (e) => {
    e.preventDefault();
    try {
      await api.createAnnouncement(annForm);
      toast.success('Announcement published to campus bulletin!');
      setShowAnnModal(false);
      setAnnForm({
        title: '',
        content: '',
        targetAudience: 'All',
        priority: 'Normal'
      });
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSendMsg = async (e) => {
    e.preventDefault();
    try {
      await api.sendMessage(msgForm);
      toast.success('Message sent successfully!');
      setShowMsgModal(false);
      setMsgForm({
        receiverId: teachers[0]?._id || '',
        subject: '',
        message: '',
        childName: ''
      });
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCreateLeave = async (e) => {
    e.preventDefault();
    try {
      await api.createLeave(leaveForm);
      toast.success('Leave request submitted for review!');
      setShowLeaveModal(false);
      setLeaveForm({
        childId: children[0]?._id || '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        reason: ''
      });
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUpdateLeaveStatus = async (id, status) => {
    try {
      await api.updateLeaveStatus(id, { status, adminRemarks: `Marked as ${status}` });
      toast.success(`Leave request ${status.toLowerCase()}!`);
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/70 text-purple-700 text-xs font-bold mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Preschool Communication Hub
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2.5">
            Communication & Parent Connect
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Broadcast campus notices, exchange direct educator messages, and track student absence requests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'announcements' && canPublishAnn && (
            <button
              onClick={() => setShowAnnModal(true)}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:from-purple-700 hover:to-indigo-700 transition-all text-xs flex items-center gap-2 shadow-md shadow-purple-200 active:scale-95"
            >
              <Plus className="w-4 h-4" /> Post Campus Notice
            </button>
          )}

          {activeTab === 'messages' && (
            <button
              onClick={() => setShowMsgModal(true)}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:from-purple-700 hover:to-indigo-700 transition-all text-xs flex items-center gap-2 shadow-md shadow-purple-200 active:scale-95"
            >
              <Send className="w-4 h-4" /> New Message
            </button>
          )}

          {activeTab === 'leaves' && (
            <button
              onClick={() => setShowLeaveModal(true)}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:from-purple-700 hover:to-indigo-700 transition-all text-xs flex items-center gap-2 shadow-md shadow-purple-200 active:scale-95"
            >
              <Plus className="w-4 h-4" /> Submit Absence Request
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60 gap-1.5 max-w-fit">
        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'announcements'
              ? 'bg-white text-purple-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Megaphone className="w-4 h-4" /> Campus Bulletins ({announcements.length})
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'messages'
              ? 'bg-white text-purple-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Direct Messages ({messages.length})
        </button>
        <button
          onClick={() => setActiveTab('leaves')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'leaves'
              ? 'bg-white text-purple-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <HeartHandshake className="w-4 h-4" /> Leave Requests ({leaves.length})
        </button>
      </div>

      {/* Tab 1: Announcements */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          {announcements.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400">
              <Megaphone className="w-12 h-12 text-purple-200 mx-auto mb-2" />
              <p className="font-bold text-slate-600 text-sm">No announcements published yet</p>
              <p className="text-xs text-slate-400 mt-1">Post your first bulletin to keep families and staff updated.</p>
            </div>
          ) : (
            announcements.map(ann => (
              <div
                key={ann._id}
                className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3.5 hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={ann.priority === 'Urgent' ? 'Absent' : (ann.priority === 'Important' ? 'Late' : 'neutral')}>
                      {ann.priority} Priority
                    </Badge>
                    <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
                      Audience: {ann.targetAudience}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-semibold">
                    {new Date(ann.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-800">{ann.title}</h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{ann.content}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5 font-medium">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Published by <strong className="text-slate-700">{ann.authorName}</strong>
                  </span>
                  <span className="text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded-md">
                    Campus Notice
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Messages */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400">
              <MessageSquare className="w-12 h-12 text-purple-200 mx-auto mb-2" />
              <p className="font-bold text-slate-700 text-sm">No message threads found</p>
              <p className="text-xs text-slate-400 mt-1">Start a conversation with an educator or staff member.</p>
            </div>
          ) : (
            messages.map(msg => (
              <div
                key={msg._id}
                className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3 hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-800">{msg.subject}</h4>
                    <p className="text-xs text-purple-600 font-bold mt-0.5">
                      From: {msg.senderName} ({msg.senderRole?.replace('_', ' ')}) • To: {msg.receiverName}
                    </p>
                    {msg.childName && (
                      <span className="inline-flex items-center gap-1 text-[11px] bg-purple-50 text-purple-700 border border-purple-100 px-2.5 py-0.5 rounded-lg mt-1.5 font-bold">
                        <Baby className="w-3 h-3" /> Child Context: {msg.childName}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="p-4 bg-slate-50/80 rounded-2xl text-xs text-slate-700 leading-relaxed border border-slate-100">
                  {msg.message}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Leave Requests */}
      {activeTab === 'leaves' && (
        <div className="space-y-4">
          {leaves.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400">
              <HeartHandshake className="w-12 h-12 text-purple-200 mx-auto mb-2" />
              <p className="font-bold text-slate-700 text-sm">No leave requests logged</p>
              <p className="text-xs text-slate-400 mt-1">Absence and sick leave applications will appear here.</p>
            </div>
          ) : (
            leaves.map(lv => (
              <div
                key={lv._id}
                className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3 hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-800">
                      Child: {lv.childName}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Requested by: <span className="font-bold text-slate-700">{lv.parentName}</span> • Dates: <strong className="text-purple-700 font-extrabold">{lv.startDate} to {lv.endDate}</strong>
                    </p>
                  </div>
                  <Badge variant={lv.status}>{lv.status}</Badge>
                </div>

                <div className="p-3.5 bg-slate-50/80 rounded-2xl text-xs text-slate-700 border border-slate-100">
                  <p><span className="text-slate-400 font-medium">Reason for absence:</span> {lv.reason}</p>
                  {lv.adminRemarks && (
                    <p className="text-[11px] text-purple-700 font-bold mt-1.5 pt-1.5 border-t border-slate-200/60">
                      Preschool Note: {lv.adminRemarks}
                    </p>
                  )}
                </div>

                {canReviewLeaves && lv.status === 'Pending' && (
                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleUpdateLeaveStatus(lv._id, 'Rejected')}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-colors"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleUpdateLeaveStatus(lv._id, 'Approved')}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold transition-colors shadow-sm"
                    >
                      Approve Leave
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Post Notice Modal */}
      <Modal isOpen={showAnnModal} onClose={() => setShowAnnModal(false)} title="Broadcast Campus Bulletin">
        <form onSubmit={handleCreateAnn} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Title *</label>
            <input
              type="text"
              required
              value={annForm.title}
              onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
              placeholder="e.g. 🍁 Seasonal Flu Prevention Reminder"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Audience</label>
              <select
                value={annForm.targetAudience}
                onChange={(e) => setAnnForm({ ...annForm, targetAudience: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
              >
                <option value="All">All School</option>
                <option value="Parents">Parents Only</option>
                <option value="Teachers">Teachers Only</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Priority</label>
              <select
                value={annForm.priority}
                onChange={(e) => setAnnForm({ ...annForm, priority: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
              >
                <option value="Normal">Normal</option>
                <option value="Important">Important</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Content *</label>
            <textarea
              rows="4"
              required
              value={annForm.content}
              onChange={(e) => setAnnForm({ ...annForm, content: e.target.value })}
              placeholder="Full announcement details..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAnnModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-md shadow-purple-200"
            >
              Publish Bulletin
            </button>
          </div>
        </form>
      </Modal>

      {/* New Message Modal */}
      <Modal isOpen={showMsgModal} onClose={() => setShowMsgModal(false)} title="Send Direct Message">
        <form onSubmit={handleSendMsg} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Recipient *</label>
            <select
              value={msgForm.receiverId}
              onChange={(e) => setMsgForm({ ...msgForm, receiverId: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
            >
              {teachers.map(t => (
                <option key={t._id} value={t._id}>{t.name} ({t.designation || 'Staff'})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Regarding Child (Optional)</label>
            <input
              type="text"
              value={msgForm.childName}
              onChange={(e) => setMsgForm({ ...msgForm, childName: e.target.value })}
              placeholder="e.g. Mia Johnson"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Subject *</label>
            <input
              type="text"
              required
              value={msgForm.subject}
              onChange={(e) => setMsgForm({ ...msgForm, subject: e.target.value })}
              placeholder="e.g. Question regarding autumn outdoor boots"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Message *</label>
            <textarea
              rows="4"
              required
              value={msgForm.message}
              onChange={(e) => setMsgForm({ ...msgForm, message: e.target.value })}
              placeholder="Type your message..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowMsgModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-md shadow-purple-200"
            >
              Send Message
            </button>
          </div>
        </form>
      </Modal>

      {/* Submit Leave Modal */}
      <Modal isOpen={showLeaveModal} onClose={() => setShowLeaveModal(false)} title="Submit Absence / Leave Request">
        <form onSubmit={handleCreateLeave} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Select Child *</label>
            <select
              value={leaveForm.childId}
              onChange={(e) => setLeaveForm({ ...leaveForm, childId: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
            >
              {children.map(c => (
                <option key={c._id} value={c._id}>{c.firstName} {c.lastName} ({c.className})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={leaveForm.startDate}
                onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">End Date *</label>
              <input
                type="date"
                required
                value={leaveForm.endDate}
                onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Reason for Absence *</label>
            <textarea
              rows="3"
              required
              value={leaveForm.reason}
              onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
              placeholder="e.g. Pediatric dental appointment or out-of-town family trip..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowLeaveModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-md shadow-purple-200"
            >
              Submit Request
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
