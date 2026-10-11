import { store } from '../services/dataStore.js';

export const getActivities = (req, res) => {
  try {
    const { classId, category } = req.query;
    let list = [...store.activities];

    if (classId) list = list.filter(a => a.classId === classId);
    if (category) list = list.filter(a => a.category.toLowerCase() === category.toLowerCase());

    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createActivity = (req, res) => {
  try {
    const { title, description, category, classId, learningObjectives, materialsNeeded, teacherNotes, photos } = req.body;
    if (!title || !description || !classId) {
      return res.status(400).json({ message: 'Title, description, and class are required.' });
    }

    const cls = store.classes.find(c => c._id === classId);
    const newAct = {
      _id: `act_${Date.now()}`,
      title,
      description,
      category: category || 'Sensory & Play',
      classId,
      className: cls ? `${cls.name} (${cls.section})` : 'Playgroup',
      date: new Date().toISOString().split('T')[0],
      learningObjectives: Array.isArray(learningObjectives) ? learningObjectives : (learningObjectives ? [learningObjectives] : []),
      materialsNeeded: materialsNeeded || '',
      teacherNotes: teacherNotes || '',
      photos: photos || ['https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=300&auto=format&fit=crop&q=80'],
      createdByName: req.user ? req.user.name : 'Teacher Clara',
      createdAt: new Date()
    };

    store.activities.unshift(newAct);
    res.status(201).json({ message: 'Activity logged successfully!', activity: newAct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProgressRecords = (req, res) => {
  try {
    const { childId } = req.query;
    let list = [...store.progressRecords];

    if (childId) list = list.filter(p => p.childId === childId);

    // If parent role, restrict to their children
    if (req.user && req.user.role === 'parent') {
      const parentUser = store.users.find(u => u._id === req.user.id);
      const parentChildrenIds = parentUser?.childrenIds || [];
      list = list.filter(p => parentChildrenIds.includes(p.childId));
    }

    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProgressRecord = (req, res) => {
  try {
    const { childId, term, domains, generalNotes } = req.body;
    if (!childId || !domains) {
      return res.status(400).json({ message: 'Child ID and 5-domain scores are required.' });
    }

    const child = store.children.find(c => c._id === childId);
    if (!child) return res.status(404).json({ message: 'Child not found.' });

    const newRecord = {
      _id: `prog_${Date.now()}`,
      childId: child._id,
      childName: `${child.firstName} ${child.lastName}`,
      className: child.className,
      term: term || 'Term 1 (Autumn 2026)',
      evaluationDate: new Date(),
      evaluatorName: req.user ? req.user.name : 'Class Teacher',
      domains: {
        language: domains.language || { score: 4, observation: 'Developing rich vocabulary.' },
        motorSkills: domains.motorSkills || { score: 4, observation: 'Steady motor coordination.' },
        creativity: domains.creativity || { score: 4, observation: 'Creative artistic expression.' },
        socialSkills: domains.socialSkills || { score: 4, observation: 'Shares nicely with companions.' },
        cognitive: domains.cognitive || { score: 4, observation: 'High problem-solving interest.' }
      },
      generalNotes: generalNotes || 'Demonstrating consistent positive development.',
      createdAt: new Date()
    };

    store.progressRecords.unshift(newRecord);
    res.status(201).json({ message: 'Development milestone evaluation recorded!', progress: newRecord });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteActivity = (req, res) => {
  try {
    const { id } = req.params;
    const index = store.activities.findIndex(a => a._id === id);
    if (index === -1) return res.status(404).json({ message: 'Activity not found.' });

    const deleted = store.activities.splice(index, 1)[0];
    res.json({ message: `Activity "${deleted.title}" deleted successfully.`, activity: deleted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProgressRecord = (req, res) => {
  try {
    const { id } = req.params;
    const index = store.progressRecords.findIndex(p => p._id === id);
    if (index === -1) return res.status(404).json({ message: 'Progress record not found.' });

    const deleted = store.progressRecords.splice(index, 1)[0];
    res.json({ message: 'Milestone evaluation record deleted.', record: deleted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
