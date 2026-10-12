import { store } from '../services/dataStore.js';

// Evaluate real operational database records using transparent rules
export const getPredictiveActionAlerts = (req, res) => {
  try {
    const alerts = [];

    // RULE 1: Repeated Absences (flags students with 2 or more absences in recorded attendance sheets)
    const absenceCounts = {};
    (store.attendances || []).forEach(sheet => {
      (sheet.records || []).forEach(rec => {
        if (rec.status === 'Absent') {
          if (!absenceCounts[rec.childId]) {
            absenceCounts[rec.childId] = { count: 0, dates: [], name: rec.childName };
          }
          absenceCounts[rec.childId].count += 1;
          absenceCounts[rec.childId].dates.push(sheet.date);
        }
      });
    });

    Object.entries(absenceCounts).forEach(([childId, info]) => {
      if (info.count >= 2) {
        const child = store.children.find(c => c._id === childId);
        alerts.push({
          alertId: `ALT-ABS-${childId}`,
          type: 'repeated_absences',
          category: 'Child Attendance & Well-Being',
          severity: info.count >= 3 ? 'Critical' : 'Warning',
          title: `Repeated Absence Flag: ${info.name}`,
          targetEntityId: childId,
          targetEntityName: info.name,
          classroom: child?.className || 'Classroom',
          triggerExplanation: `Transparent Rule Triggered: Student has missed ${info.count} preschool sessions on dates: ${info.dates.join(', ')}.`,
          recommendedAction: `Conduct a compassionate phone check-in with guardian (${child?.parentName || 'Parent'}: ${child?.parentPhone || 'Phone on file'}) to offer health or transportation support.`,
          actionType: 'call_parent',
          status: getAlertResolutionStatus(`ALT-ABS-${childId}`),
          metricValue: `${info.count} Absences`,
          disclaimer: 'Purely operational attendance tally. Does not infer behavioral or health causes.'
        });
      }
    });

    // RULE 2: Overdue Fee Accounts
    (store.invoices || []).forEach(inv => {
      const isOverdue = inv.status === 'Overdue' || (inv.dueDate && new Date(inv.dueDate) < new Date() && inv.balanceAmount > 0);
      if (isOverdue) {
        const daysPast = inv.dueDate ? Math.max(1, Math.floor((new Date() - new Date(inv.dueDate)) / (1000 * 3600 * 24))) : 15;
        alerts.push({
          alertId: `ALT-FEE-${inv._id}`,
          type: 'fee_overdue',
          category: 'Finance & Tuition Operations',
          severity: daysPast > 14 ? 'Critical' : 'Warning',
          title: `Overdue Tuition Balance: ${inv.childName} ($${inv.balanceAmount})`,
          targetEntityId: inv._id,
          targetEntityName: inv.childName,
          classroom: inv.className,
          triggerExplanation: `Transparent Rule Triggered: Invoice #${inv.invoiceNo} (${inv.title}) has an unsettled balance of $${inv.balanceAmount} that is ${daysPast} days past due (Due Date: ${new Date(inv.dueDate).toLocaleDateString()}).`,
          recommendedAction: `Send an automated friendly WhatsApp / SMS payment voucher link or review hardship fee concession options.`,
          actionType: 'send_fee_reminder',
          status: getAlertResolutionStatus(`ALT-FEE-${inv._id}`),
          metricValue: `$${inv.balanceAmount} Outstanding (${daysPast}d past due)`,
          disclaimer: 'Based strictly on billing ledger records.'
        });
      }
    });

    // RULE 3: Classroom Approaching Capacity (Capacity >= 85%)
    (store.classes || []).forEach(cls => {
      const enrolled = cls.enrolledCount || store.children.filter(c => c.classId === cls._id && c.status === 'Enrolled').length;
      const capacity = cls.capacity || 15;
      const occupancyRate = Math.round((enrolled / capacity) * 100);

      if (occupancyRate >= 80) {
        alerts.push({
          alertId: `ALT-CAP-${cls._id}`,
          type: 'class_capacity',
          category: 'Facility & Regulatory Ratios',
          severity: occupancyRate >= 95 ? 'Critical' : 'Warning',
          title: `Capacity Limit Approaching: ${cls.name} (${occupancyRate}%)`,
          targetEntityId: cls._id,
          targetEntityName: `${cls.name} (${cls.section})`,
          classroom: cls.name,
          triggerExplanation: `Transparent Rule Triggered: Current enrollment is ${enrolled}/${capacity} students (${occupancyRate}%). Regulatory student-to-teacher ratio limits may be exceeded with upcoming admissions.`,
          recommendedAction: `Review incoming admissions waitlist and evaluate opening an additional section or assigning an assistant teacher.`,
          actionType: 'review_admissions_waitlist',
          status: getAlertResolutionStatus(`ALT-CAP-${cls._id}`),
          metricValue: `${enrolled}/${capacity} (${occupancyRate}%)`,
          disclaimer: 'Based on verified enrollment rosters.'
        });
      }
    });

    // RULE 4: Admission Inquiries Follow-Up Due (> 3 days in Pending or Under Review)
    (store.admissions || []).forEach(adm => {
      if (adm.status === 'Pending' || adm.status === 'Under Review') {
        const daysOld = adm.createdAt ? Math.floor((new Date() - new Date(adm.createdAt)) / (1000 * 3600 * 24)) : 4;
        if (daysOld >= 2) {
          alerts.push({
            alertId: `ALT-ADM-${adm._id}`,
            type: 'admission_followup',
            category: 'Admissions & Enrollment Pipeline',
            severity: daysOld >= 7 ? 'Critical' : 'Warning',
            title: `Admissions Inquiry Follow-Up Due: ${adm.childFirstName} ${adm.childLastName}`,
            targetEntityId: adm._id,
            targetEntityName: `${adm.childFirstName} ${adm.childLastName}`,
            classroom: adm.preferredClassName || 'Playgroup',
            triggerExplanation: `Transparent Rule Triggered: Application #${adm.applicationNo} has been in '${adm.status}' state for ${daysOld} days without status progression.`,
            recommendedAction: `Contact ${adm.parentName} (${adm.parentEmail || adm.parentPhone}) to confirm classroom tour or schedule family interview.`,
            actionType: 'schedule_tour',
            status: getAlertResolutionStatus(`ALT-ADM-${adm._id}`),
            metricValue: `${daysOld} days pending`,
            disclaimer: 'Pipeline latency rule only.'
          });
        }
      }
    });

    res.json({
      summary: {
        totalActiveAlerts: alerts.filter(a => a.status === 'pending').length,
        criticalAlerts: alerts.filter(a => a.severity === 'Critical' && a.status === 'pending').length,
        resolvedAlerts: alerts.filter(a => a.status === 'resolved' || a.status === 'reviewed').length,
        evaluationTimestamp: new Date().toISOString()
      },
      alerts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Staff marks alert as reviewed or resolved with action notes
export const resolveAlert = (req, res) => {
  try {
    const { alertId } = req.params;
    const { status, actionRemarks } = req.body;

    if (!store.resolvedAlerts) store.resolvedAlerts = {};
    store.resolvedAlerts[alertId] = {
      status: status || 'resolved',
      actionRemarks: actionRemarks || 'Action completed by authorized staff.',
      resolvedByName: req.user?.name || 'Administrator',
      resolvedAt: new Date()
    };

    res.json({
      message: `Alert marked as ${status || 'resolved'} successfully!`,
      alertResolution: store.resolvedAlerts[alertId]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

function getAlertResolutionStatus(alertId) {
  if (store.resolvedAlerts && store.resolvedAlerts[alertId]) {
    return store.resolvedAlerts[alertId].status;
  }
  return 'pending';
}
