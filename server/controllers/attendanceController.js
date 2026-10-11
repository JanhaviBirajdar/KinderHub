import { store } from '../services/dataStore.js';

export const getAttendanceByDateAndClass = (req, res) => {
  try {
    const { date, classId } = req.query;
    if (!date || !classId) {
      return res.status(400).json({ message: 'Date and classId query parameters are required.' });
    }

    const attendanceSheet = store.attendances.find(a => a.date === date && a.classId === classId);
    
    // Fetch all enrolled children for this class
    const enrolledChildren = store.children.filter(c => c.classId === classId && c.status === 'Enrolled');

    // If attendance already marked, return it with all child records
    if (attendanceSheet) {
      return res.json({
        exists: true,
        attendance: attendanceSheet,
        children: enrolledChildren
      });
    }

    // Otherwise return default state for easy marking
    const initialRecords = enrolledChildren.map(c => ({
      childId: c._id,
      childName: `${c.firstName} ${c.lastName}`,
      status: 'Present',
      remarks: '',
      checkInTime: '09:00 AM'
    }));

    res.json({
      exists: false,
      date,
      classId,
      records: initialRecords,
      children: enrolledChildren
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const saveAttendance = (req, res) => {
  try {
    const { date, classId, records } = req.body;
    if (!date || !classId || !records) {
      return res.status(400).json({ message: 'Date, classId, and records are required.' });
    }

    const cls = store.classes.find(c => c._id === classId);
    const existingIndex = store.attendances.findIndex(a => a.date === date && a.classId === classId);

    const markedByName = req.user ? req.user.name : 'Teacher Clara';
    const markedById = req.user ? req.user.id : 'usr_003';

    const attendanceDoc = {
      _id: existingIndex !== -1 ? store.attendances[existingIndex]._id : `att_${Date.now()}`,
      date,
      classId,
      className: cls ? `${cls.name} (${cls.section})` : 'Class',
      markedById,
      markedByName,
      records: records.map(r => ({
        childId: r.childId,
        childName: r.childName,
        status: r.status || 'Present',
        remarks: r.remarks || '',
        checkInTime: r.checkInTime || (r.status === 'Present' ? '09:00 AM' : '-')
      })),
      updatedAt: new Date()
    };

    if (existingIndex !== -1) {
      store.attendances[existingIndex] = attendanceDoc;
    } else {
      store.attendances.unshift(attendanceDoc);
    }

    const presentCount = records.filter(r => r.status === 'Present').length;
    const rate = Math.round((presentCount / (records.length || 1)) * 100);

    res.json({
      message: `Attendance for ${date} saved successfully! (${presentCount}/${records.length} Present - ${rate}%)`,
      attendance: attendanceDoc
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAttendanceStats = (req, res) => {
  try {
    const totalSheets = store.attendances.length;
    let totalPresent = 0;
    let totalAbsent = 0;
    let totalLate = 0;
    let totalLeave = 0;

    store.attendances.forEach(sheet => {
      sheet.records.forEach(r => {
        if (r.status === 'Present') totalPresent++;
        else if (r.status === 'Absent') totalAbsent++;
        else if (r.status === 'Late') totalLate++;
        else if (r.status === 'Leave') totalLeave++;
      });
    });

    const total = totalPresent + totalAbsent + totalLate + totalLeave || 1;
    const overallRate = Math.round(((totalPresent + totalLate) / total) * 100);

    res.json({
      totalSheets,
      totalPresent,
      totalAbsent,
      totalLate,
      totalLeave,
      overallRate
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
