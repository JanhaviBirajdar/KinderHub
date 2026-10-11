import { store } from '../services/dataStore.js';

export const getChildren = (req, res) => {
  try {
    const { search, classId, status } = req.query;
    let list = [...store.children];

    // If parent role, only return children belonging to this parent!
    if (req.user && req.user.role === 'parent') {
      const parentUser = store.users.find(u => u._id === req.user.id);
      const parentChildrenIds = parentUser?.childrenIds || [];
      list = list.filter(c => c.parentId === req.user.id || parentChildrenIds.includes(c._id));
    }

    // If teacher role, only allow assigned class children unless admin
    if (req.user && req.user.role === 'teacher' && req.user.assignedClassId) {
      // teacher can view children in their class
      list = list.filter(c => c.classId === req.user.assignedClassId);
    }

    if (classId) {
      list = list.filter(c => c.classId === classId);
    }

    if (status) {
      list = list.filter(c => c.status.toLowerCase() === status.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c => 
        c.firstName.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        c.childId.toLowerCase().includes(q) ||
        (c.parentName && c.parentName.toLowerCase().includes(q))
      );
    }

    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChildById = (req, res) => {
  try {
    const { id } = req.params;
    const child = store.children.find(c => c._id === id || c.childId === id);
    if (!child) return res.status(404).json({ message: 'Child record not found.' });

    // Authorization check for parents
    if (req.user && req.user.role === 'parent' && child.parentId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied: You can only view your own linked children.' });
    }

    // Attach related histories
    const attendanceHistory = [];
    store.attendances.forEach(att => {
      const rec = att.records.find(r => r.childId === child._id);
      if (rec) {
        attendanceHistory.push({
          date: att.date,
          status: rec.status,
          remarks: rec.remarks,
          checkInTime: rec.checkInTime,
          markedBy: att.markedByName
        });
      }
    });

    const feeInvoices = store.invoices.filter(inv => inv.childId === child._id);
    const progressReports = store.progressRecords.filter(p => p.childId === child._id);

    res.json({
      ...child,
      attendanceHistory,
      feeInvoices,
      progressReports
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createChild = (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dob,
      gender,
      bloodGroup,
      classId,
      section,
      parentId,
      emergencyContact,
      allergies,
      medicalNotes,
      authorizedPickups,
      photo
    } = req.body;

    if (!firstName || !lastName || !dob || !classId) {
      return res.status(400).json({ message: 'Child name, date of birth, and class are required.' });
    }

    const cls = store.classes.find(c => c._id === classId);
    const count = store.children.length + 1;
    const newChildId = `KH-2026-${String(count).padStart(3, '0')}`;

    // Find parent user or fallback
    const parent = store.users.find(u => u._id === parentId) || { name: 'Guardian', phone: emergencyContact?.phone || '' };

    const newChild = {
      _id: `ch_${Date.now()}`,
      childId: newChildId,
      firstName,
      lastName,
      dob,
      gender: gender || 'Female',
      bloodGroup: bloodGroup || 'O+',
      classId,
      className: cls ? `${cls.name} (${cls.section})` : 'Playgroup',
      section: section || (cls ? cls.section : 'A'),
      admissionDate: new Date().toISOString().split('T')[0],
      parentId: parentId || 'usr_005',
      parentName: parent.name,
      parentPhone: parent.phone || emergencyContact?.phone || '',
      emergencyContact: emergencyContact || { name: 'Mother', phone: '+1 (555) 012-3456', relation: 'Mother' },
      allergies: Array.isArray(allergies) ? allergies : (allergies ? [allergies] : []),
      medicalNotes: medicalNotes || 'None',
      authorizedPickups: authorizedPickups || [{ name: parent.name, relation: 'Parent', phone: parent.phone || '' }],
      photo: photo || 'https://images.unsplash.com/photo-1595454223600-91fb57d42531?w=150&auto=format&fit=crop&q=80',
      status: 'Enrolled'
    };

    store.children.unshift(newChild);
    if (cls) cls.enrolledCount = (cls.enrolledCount || 0) + 1;

    res.status(201).json({
      message: `Child ${firstName} ${lastName} enrolled successfully with ID ${newChildId}!`,
      child: newChild
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateChild = (req, res) => {
  try {
    const { id } = req.params;
    const index = store.children.findIndex(c => c._id === id);
    if (index === -1) return res.status(404).json({ message: 'Child not found.' });

    const updated = {
      ...store.children[index],
      ...req.body,
      _id: store.children[index]._id, // preserve ID
      childId: store.children[index].childId
    };

    if (req.body.classId) {
      const cls = store.classes.find(c => c._id === req.body.classId);
      if (cls) updated.className = `${cls.name} (${cls.section})`;
    }

    store.children[index] = updated;
    res.json({ message: 'Child details updated successfully.', child: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const archiveChild = (req, res) => {
  try {
    const { id } = req.params;
    const child = store.children.find(c => c._id === id);
    if (!child) return res.status(404).json({ message: 'Child not found.' });

    child.status = child.status === 'Archived' ? 'Enrolled' : 'Archived';
    res.json({ message: `Child enrollment status updated to ${child.status}.`, child });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteChildPermanent = (req, res) => {
  try {
    const { id } = req.params;
    const index = store.children.findIndex(c => c._id === id);
    if (index === -1) return res.status(404).json({ message: 'Child not found.' });

    const deleted = store.children.splice(index, 1)[0];
    const cls = store.classes.find(c => c._id === deleted.classId);
    if (cls && cls.enrolledCount > 0) cls.enrolledCount--;

    res.json({ message: `Child record ${deleted.firstName} ${deleted.lastName} permanently deleted.`, child: deleted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
