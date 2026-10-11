import { store } from '../services/dataStore.js';

export const getTimetables = (req, res) => {
  try {
    const { classId } = req.query;
    let list = [...store.timetables];
    if (classId) list = list.filter(t => t.classId === classId);
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEvents = (req, res) => {
  try {
    const { eventType } = req.query;
    let list = [...store.events];
    if (eventType) list = list.filter(e => e.eventType.toLowerCase() === eventType.toLowerCase());
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createEvent = (req, res) => {
  try {
    const { title, description, eventType, startDate, endDate, targetAudience, location, colorTag } = req.body;
    if (!title || !startDate) {
      return res.status(400).json({ message: 'Event title and start date are required.' });
    }

    const newEvent = {
      _id: `ev_${Date.now()}`,
      title,
      description: description || '',
      eventType: eventType || 'Celebration',
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : new Date(startDate),
      targetAudience: targetAudience || 'All',
      location: location || 'KinderHub Campus',
      colorTag: colorTag || 'lavender',
      createdAt: new Date()
    };

    store.events.unshift(newEvent);
    res.status(201).json({ message: 'Event created successfully!', event: newEvent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEvent = (req, res) => {
  try {
    const { id } = req.params;
    const index = store.events.findIndex(e => e._id === id);
    if (index === -1) return res.status(404).json({ message: 'Event not found.' });

    const updated = {
      ...store.events[index],
      ...req.body,
      _id: store.events[index]._id,
      updatedAt: new Date()
    };

    store.events[index] = updated;
    res.json({ message: 'Event details updated successfully.', event: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEvent = (req, res) => {
  try {
    const { id } = req.params;
    const index = store.events.findIndex(e => e._id === id);
    if (index === -1) return res.status(404).json({ message: 'Event not found.' });

    const deleted = store.events.splice(index, 1)[0];
    res.json({ message: `Event "${deleted.title}" deleted successfully.`, event: deleted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTimetable = (req, res) => {
  try {
    const { classId, dayOfWeek, periods } = req.body;
    if (!classId || !dayOfWeek || !periods) {
      return res.status(400).json({ message: 'Class ID, day of week, and periods array are required.' });
    }

    let item = store.timetables.find(t => t.classId === classId && t.dayOfWeek === dayOfWeek);
    if (item) {
      item.periods = periods;
      item.updatedAt = new Date();
    } else {
      const cls = store.classes.find(c => c._id === classId);
      item = {
        _id: `tt_${Date.now()}`,
        classId,
        className: cls ? cls.name : 'Class',
        dayOfWeek,
        periods,
        updatedAt: new Date()
      };
      store.timetables.push(item);
    }

    res.json({ message: `Timetable for ${dayOfWeek} updated successfully!`, timetable: item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
