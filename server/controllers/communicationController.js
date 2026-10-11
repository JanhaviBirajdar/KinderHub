import { store } from '../services/dataStore.js';

export const getAnnouncements = (req, res) => {
  try {
    const { audience } = req.query;
    let list = [...store.announcements];

    if (audience && audience !== 'All') {
      list = list.filter(a => a.targetAudience === 'All' || a.targetAudience === audience);
    }

    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAnnouncement = (req, res) => {
  try {
    const { title, content, targetAudience, priority } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }

    const newAnn = {
      _id: `ann_${Date.now()}`,
      title,
      content,
      targetAudience: targetAudience || 'All',
      priority: priority || 'Normal',
      authorName: req.user ? req.user.name : 'School Administration',
      createdAt: new Date()
    };

    store.announcements.unshift(newAnn);
    res.status(201).json({ message: 'Announcement published successfully!', announcement: newAnn });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = (req, res) => {
  try {
    const userId = req.user.id;
    const list = store.messages.filter(m => m.senderId === userId || m.receiverId === userId);
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = (req, res) => {
  try {
    const { receiverId, subject, message, childName } = req.body;
    if (!receiverId || !subject || !message) {
      return res.status(400).json({ message: 'Recipient, subject, and message body are required.' });
    }

    const receiver = store.users.find(u => u._id === receiverId);
    if (!receiver) return res.status(404).json({ message: 'Recipient user not found.' });

    const newMsg = {
      _id: `msg_${Date.now()}`,
      senderId: req.user.id,
      senderName: req.user.name,
      senderRole: req.user.role,
      receiverId: receiver._id,
      receiverName: receiver.name,
      childName: childName || '',
      subject,
      message,
      read: false,
      createdAt: new Date()
    };

    store.messages.unshift(newMsg);
    res.status(201).json({ message: 'Message sent successfully!', messageData: newMsg });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLeaveRequests = (req, res) => {
  try {
    let list = [...store.leaveRequests];

    // If parent, only return their leave requests
    if (req.user && req.user.role === 'parent') {
      list = list.filter(l => l.parentId === req.user.id);
    }

    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createLeaveRequest = (req, res) => {
  try {
    const { childId, startDate, endDate, reason } = req.body;
    if (!childId || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: 'Child, dates, and reason are required.' });
    }

    const child = store.children.find(c => c._id === childId);
    if (!child) return res.status(404).json({ message: 'Child not found.' });

    const newLeave = {
      _id: `lv_${Date.now()}`,
      childId: child._id,
      childName: `${child.firstName} ${child.lastName}`,
      parentId: req.user.id,
      parentName: req.user.name,
      startDate,
      endDate,
      reason,
      status: 'Pending',
      adminRemarks: '',
      createdAt: new Date()
    };

    store.leaveRequests.unshift(newLeave);
    res.status(201).json({ message: 'Leave request submitted for review.', leaveRequest: newLeave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLeaveStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminRemarks } = req.body;
    const leave = store.leaveRequests.find(l => l._id === id);
    if (!leave) return res.status(404).json({ message: 'Leave request not found.' });

    if (status) leave.status = status;
    if (adminRemarks !== undefined) leave.adminRemarks = adminRemarks;
    leave.updatedAt = new Date();

    res.json({ message: `Leave request status updated to ${leave.status}.`, leaveRequest: leave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAnnouncement = (req, res) => {
  try {
    const { id } = req.params;
    const index = store.announcements.findIndex(a => a._id === id);
    if (index === -1) return res.status(404).json({ message: 'Announcement not found.' });

    const deleted = store.announcements.splice(index, 1)[0];
    res.json({ message: `Announcement "${deleted.title}" deleted successfully.`, announcement: deleted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteLeaveRequest = (req, res) => {
  try {
    const { id } = req.params;
    const index = store.leaveRequests.findIndex(l => l._id === id);
    if (index === -1) return res.status(404).json({ message: 'Leave request not found.' });

    if (req.user && req.user.role === 'parent' && store.leaveRequests[index].parentId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this request.' });
    }

    const deleted = store.leaveRequests.splice(index, 1)[0];
    res.json({ message: 'Leave request removed successfully.', leaveRequest: deleted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
