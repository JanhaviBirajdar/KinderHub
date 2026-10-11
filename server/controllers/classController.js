import { store } from '../services/dataStore.js';

export const getClasses = (req, res) => {
  try {
    const list = store.classes.map(cls => {
      const enrolled = store.children.filter(c => c.classId === cls._id && c.status === 'Enrolled').length;
      return {
        ...cls,
        enrolledCount: enrolled,
        occupancyRate: Math.round((enrolled / (cls.capacity || 20)) * 100)
      };
    });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getClassById = (req, res) => {
  try {
    const { id } = req.params;
    const cls = store.classes.find(c => c._id === id);
    if (!cls) return res.status(404).json({ message: 'Class not found.' });

    const enrolledChildren = store.children.filter(c => c.classId === cls._id);
    res.json({ ...cls, enrolledChildren });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createClass = (req, res) => {
  try {
    const { name, section, capacity, roomNumber, classTeacherId, colorBadge, ageGroup, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Class name is required.' });

    const teacher = store.users.find(u => u._id === classTeacherId);

    const newClass = {
      _id: `cls_${Date.now()}`,
      name,
      section: section || 'A',
      academicYear: '2026-2027',
      capacity: Number(capacity) || 20,
      roomNumber: roomNumber || 'Room 103',
      classTeacherId: classTeacherId || null,
      classTeacherName: teacher ? teacher.name : 'Unassigned',
      colorBadge: colorBadge || 'lavender',
      ageGroup: ageGroup || '3 – 4 Years',
      description: description || '',
      enrolledCount: 0
    };

    store.classes.push(newClass);
    res.status(201).json({ message: 'Class created successfully!', class: newClass });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateClass = (req, res) => {
  try {
    const { id } = req.params;
    const index = store.classes.findIndex(c => c._id === id);
    if (index === -1) return res.status(404).json({ message: 'Class not found.' });

    const teacher = req.body.classTeacherId 
      ? store.users.find(u => u._id === req.body.classTeacherId) 
      : null;

    const updated = {
      ...store.classes[index],
      ...req.body,
      classTeacherName: teacher ? teacher.name : store.classes[index].classTeacherName
    };

    store.classes[index] = updated;
    res.json({ message: 'Class details updated successfully.', class: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteClass = (req, res) => {
  try {
    const { id } = req.params;
    const index = store.classes.findIndex(c => c._id === id);
    if (index === -1) return res.status(404).json({ message: 'Class not found.' });

    const enrolledStudents = store.children.filter(c => c.classId === id && c.status === 'Enrolled');
    if (enrolledStudents.length > 0) {
      return res.status(400).json({ 
        message: `Cannot delete classroom section with ${enrolledStudents.length} active students enrolled. Reassign students first.` 
      });
    }

    const deleted = store.classes.splice(index, 1)[0];
    res.json({ message: `Class ${deleted.name} (${deleted.section}) deleted successfully!`, class: deleted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
