import { store } from '../services/dataStore.js';

export const getAdmissions = (req, res) => {
  try {
    const { status, search } = req.query;
    let list = [...store.admissions];

    if (status) {
      list = list.filter(a => a.status.toLowerCase() === status.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(a => 
        a.childFirstName.toLowerCase().includes(q) ||
        a.childLastName.toLowerCase().includes(q) ||
        a.applicationNo.toLowerCase().includes(q) ||
        a.parentName.toLowerCase().includes(q)
      );
    }

    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAdmission = (req, res) => {
  try {
    const {
      childFirstName,
      childLastName,
      dob,
      gender,
      preferredClassId,
      parentName,
      parentEmail,
      parentPhone,
      address,
      medicalNotes
    } = req.body;

    if (!childFirstName || !childLastName || !dob || !preferredClassId || !parentName || !parentPhone) {
      return res.status(400).json({ message: 'Child details, parent contact, and class preference are required.' });
    }

    const cls = store.classes.find(c => c._id === preferredClassId);
    const count = store.admissions.length + 101;
    const applicationNo = `ADM-2026-${count}`;

    const newApp = {
      _id: `adm_${Date.now()}`,
      applicationNo,
      childFirstName,
      childLastName,
      dob,
      gender: gender || 'Female',
      preferredClassId,
      preferredClassName: cls ? cls.name : 'Playgroup',
      parentName,
      parentEmail: parentEmail || '',
      parentPhone,
      address: address || '',
      medicalNotes: medicalNotes || '',
      documents: [{ name: 'Enquiry_Submission.pdf', url: '#' }],
      status: 'Pending',
      adminNotes: 'Application received online.',
      createdAt: new Date()
    };

    store.admissions.unshift(newApp);
    res.status(201).json({
      message: `Admission enquiry submitted successfully with Application No: ${applicationNo}`,
      admission: newApp
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAdmissionStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    const app = store.admissions.find(a => a._id === id);
    if (!app) return res.status(404).json({ message: 'Admission application not found.' });

    if (status) app.status = status;
    if (adminNotes !== undefined) app.adminNotes = adminNotes;
    app.updatedAt = new Date();

    res.json({ message: `Application status changed to ${app.status}`, admission: app });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const convertToEnrolledChild = (req, res) => {
  try {
    const { id } = req.params;
    const app = store.admissions.find(a => a._id === id);
    if (!app) return res.status(404).json({ message: 'Application not found.' });

    if (app.status !== 'Approved') {
      return res.status(400).json({ message: 'Application must be approved before converting to enrolled student.' });
    }

    if (app.convertedChildId) {
      return res.status(400).json({ message: 'This application has already been converted to an enrolled student.' });
    }

    const count = store.children.length + 1;
    const newChildId = `KH-2026-${String(count).padStart(3, '0')}`;
    const cls = store.classes.find(c => c._id === app.preferredClassId) || store.classes[0];

    // Find or create parent
    let parentUser = store.users.find(u => u.email.toLowerCase() === app.parentEmail.toLowerCase());
    if (!parentUser) {
      parentUser = {
        _id: `usr_${Date.now()}`,
        name: app.parentName,
        email: app.parentEmail || `parent.${count}@example.com`,
        password: '$2a$10$demoHashedPasswordParent',
        role: 'parent',
        phone: app.parentPhone,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        status: 'active',
        childrenIds: [],
        createdAt: new Date()
      };
      store.users.push(parentUser);
    }

    const newChild = {
      _id: `ch_${Date.now()}`,
      childId: newChildId,
      firstName: app.childFirstName,
      lastName: app.childLastName,
      dob: app.dob,
      gender: app.gender,
      bloodGroup: 'O+',
      classId: cls._id,
      className: `${cls.name} (${cls.section})`,
      section: cls.section,
      admissionDate: new Date().toISOString().split('T')[0],
      parentId: parentUser._id,
      parentName: app.parentName,
      parentPhone: app.parentPhone,
      emergencyContact: { name: app.parentName, phone: app.parentPhone, relation: 'Parent' },
      allergies: [],
      medicalNotes: app.medicalNotes || 'None',
      authorizedPickups: [{ name: app.parentName, relation: 'Parent', phone: app.parentPhone }],
      photo: 'https://images.unsplash.com/photo-1595454223600-91fb57d42531?w=150&auto=format&fit=crop&q=80',
      status: 'Enrolled'
    };

    store.children.unshift(newChild);
    parentUser.childrenIds = [...(parentUser.childrenIds || []), newChild._id];
    cls.enrolledCount = (cls.enrolledCount || 0) + 1;
    app.convertedChildId = newChild._id;
    app.adminNotes = (app.adminNotes ? app.adminNotes + ' ' : '') + `Converted to student ${newChildId}.`;

    res.json({
      message: `Application converted to enrolled child ${newChild.firstName} (${newChildId})!`,
      child: newChild,
      admission: app
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAdmission = (req, res) => {
  try {
    const { id } = req.params;
    const index = store.admissions.findIndex(a => a._id === id);
    if (index === -1) return res.status(404).json({ message: 'Admission enquiry not found.' });

    const deleted = store.admissions.splice(index, 1)[0];
    res.json({ message: `Admission enquiry ${deleted.applicationNo} removed successfully.`, admission: deleted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
