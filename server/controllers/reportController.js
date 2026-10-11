import { store } from '../services/dataStore.js';

export const getReportsData = (req, res) => {
  try {
    const { type } = req.query; // 'attendance' | 'fees' | 'enrollment'

    if (type === 'attendance') {
      const records = [];
      store.attendances.forEach(att => {
        att.records.forEach(r => {
          records.push({
            date: att.date,
            className: att.className,
            childName: r.childName,
            status: r.status,
            checkIn: r.checkInTime,
            remarks: r.remarks,
            markedBy: att.markedByName
          });
        });
      });
      return res.json({ type: 'attendance', count: records.length, records });
    }

    if (type === 'fees') {
      const records = store.invoices.map(inv => ({
        invoiceNo: inv.invoiceNo,
        childName: inv.childName,
        className: inv.className,
        parentName: inv.parentName,
        term: inv.title,
        monthYear: inv.monthYear,
        totalAmount: inv.totalAmount,
        paidAmount: inv.paidAmount,
        balanceAmount: inv.balanceAmount,
        status: inv.status
      }));
      return res.json({ type: 'fees', count: records.length, records });
    }

    // Default: enrollment & capacity
    const records = store.classes.map(cls => {
      const children = store.children.filter(c => c.classId === cls._id);
      return {
        className: `${cls.name} (${cls.section})`,
        academicYear: cls.academicYear,
        ageGroup: cls.ageGroup,
        capacity: cls.capacity,
        enrolledCount: children.length,
        availableSeats: Math.max(0, cls.capacity - children.length),
        leadTeacher: cls.classTeacherName
      };
    });

    res.json({ type: 'enrollment', count: records.length, records });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
