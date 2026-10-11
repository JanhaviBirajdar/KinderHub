import bcrypt from 'bcryptjs';
import { store } from '../services/dataStore.js';

export const getTeachers = (req, res) => {
  try {
    const list = store.users
      .filter(u => u.role === 'teacher' || u.role === 'school_admin')
      .map(t => {
        const { password: _, ...teacherData } = t;
        const assignedClass = store.classes.find(c => c._id === t.assignedClassId);
        return {
          ...teacherData,
          assignedClassName: assignedClass ? `${assignedClass.name} (${assignedClass.section})` : 'Unassigned'
        };
      });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTeacher = async (req, res) => {
  try {
    const { name, email, phone, designation, qualification, assignedClassId, role } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    const existing = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash('Teacher@123', 10);
    const newStaff = {
      _id: `usr_${Date.now()}`,
      name,
      email,
      password: hashedPassword,
      role: role || 'teacher',
      phone: phone || '+1 (555) 019-0000',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      status: 'active',
      assignedClassId: assignedClassId || null,
      designation: designation || 'Preschool Educator',
      qualification: qualification || 'Early Childhood Education Diploma',
      createdAt: new Date()
    };

    store.users.push(newStaff);

    // If assigned to a class, update the class model as well
    if (assignedClassId) {
      const cls = store.classes.find(c => c._id === assignedClassId);
      if (cls) {
        cls.classTeacherId = newStaff._id;
        cls.classTeacherName = newStaff.name;
      }
    }

    const { password: _, ...staffWithoutPassword } = newStaff;
    res.status(201).json({ message: 'Staff member added successfully!', staff: staffWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTeacher = (req, res) => {
  try {
    const { id } = req.params;
    const user = store.users.find(u => u._id === id);
    if (!user) return res.status(404).json({ message: 'Staff member not found.' });

    Object.assign(user, req.body);
    if (req.body.assignedClassId) {
      const cls = store.classes.find(c => c._id === req.body.assignedClassId);
      if (cls) {
        cls.classTeacherId = user._id;
        cls.classTeacherName = user.name;
      }
    }

    const { password: _, ...userClean } = user;
    res.json({ message: 'Staff record updated successfully.', staff: userClean });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTeacher = (req, res) => {
  try {
    const { id } = req.params;
    const index = store.users.findIndex(u => u._id === id);
    if (index === -1) return res.status(404).json({ message: 'Staff member not found.' });

    // Unassign from any class
    store.classes.forEach(cls => {
      if (cls.classTeacherId === id) {
        cls.classTeacherId = null;
        cls.classTeacherName = 'Unassigned';
      }
    });

    const deleted = store.users.splice(index, 1)[0];
    const { password: _, ...clean } = deleted;
    res.json({ message: `Staff member ${deleted.name} removed successfully!`, staff: clean });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
