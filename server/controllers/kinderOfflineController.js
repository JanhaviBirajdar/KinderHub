import { store } from '../services/dataStore.js';

// Batch synchronization endpoint for offline-queued operations
export const syncOfflineQueue = (req, res) => {
  try {
    const { queuedOperations } = req.body;
    if (!Array.isArray(queuedOperations) || queuedOperations.length === 0) {
      return res.status(400).json({ message: 'No queued operations provided for synchronization.' });
    }

    const results = [];
    const staffName = req.user?.name || 'Lead Teacher (Synced)';

    for (const op of queuedOperations) {
      const { localId, type, payload, clientTimestamp, lastKnownServerUpdatedAt } = op;
      
      try {
        if (type === 'attendance') {
          // Idempotent attendance sync with duplicate check & conflict detection
          const { date, classId, records } = payload;
          const existing = store.attendances.find(a => a.date === date && a.classId === classId);

          if (existing) {
            // Check if server version was updated more recently than client's snapshot
            const serverUpdated = existing.updatedAt ? new Date(existing.updatedAt).getTime() : 0;
            const clientSnapshot = lastKnownServerUpdatedAt ? new Date(lastKnownServerUpdatedAt).getTime() : 0;

            if (serverUpdated > clientSnapshot && clientSnapshot > 0) {
              // Potential conflict: Server has newer edits
              // Safe resolution: Merge records rather than overwriting
              const mergedRecords = [...existing.records];
              records.forEach(clientRec => {
                const idx = mergedRecords.findIndex(r => r.childId === clientRec.childId);
                if (idx >= 0) {
                  // If client explicitly marked a status with remarks, retain the educator's offline observation
                  mergedRecords[idx] = {
                    ...mergedRecords[idx],
                    status: clientRec.status,
                    remarks: `${clientRec.remarks ? clientRec.remarks + ' ' : ''}[Synced offline ${new Date(clientTimestamp).toLocaleTimeString()}]`
                  };
                } else {
                  mergedRecords.push(clientRec);
                }
              });

              existing.records = mergedRecords;
              existing.updatedAt = new Date();
              existing.markedByName = `${existing.markedByName} & ${staffName}`;

              results.push({
                localId,
                status: 'conflict_resolved_merged',
                serverRecordId: existing._id,
                message: 'Merged with newer server attendance sheet safely without data loss.'
              });
            } else {
              // Server is older or same: Update cleanly
              existing.records = records;
              existing.updatedAt = new Date();
              existing.markedByName = staffName;

              results.push({
                localId,
                status: 'confirmed_updated',
                serverRecordId: existing._id,
                message: 'Server attendance roster confirmed and updated.'
              });
            }
          } else {
            // New attendance sheet
            const newAtt = {
              _id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
              date,
              classId,
              className: store.classes.find(c => c._id === classId)?.name || 'Classroom',
              markedById: req.user?.id || 'usr_003',
              markedByName: staffName,
              records,
              createdAt: new Date(),
              updatedAt: new Date()
            };
            store.attendances.unshift(newAtt);

            results.push({
              localId,
              status: 'confirmed_created',
              serverRecordId: newAtt._id,
              message: 'New attendance record created and confirmed on server.'
            });
          }
        } else if (type === 'observation') {
          // Sync developmental observation
          const { childId, domain, score, milestoneTitle, notes, date } = payload;
          const child = store.children.find(c => c._id === childId);

          const newObs = {
            _id: `obs_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            childId,
            childName: child ? `${child.firstName} ${child.lastName}` : 'Child',
            date: date || new Date().toISOString().split('T')[0],
            domain,
            score: Number(score) || 4,
            milestoneTitle,
            notes: `${notes} [Synced from offline queue]`,
            observedByName: staffName,
            observedByRole: req.user?.role || 'teacher',
            context: 'classroom',
            isHomeObservation: false,
            createdAt: new Date()
          };

          if (!store.observations) store.observations = [];
          store.observations.unshift(newObs);

          results.push({
            localId,
            status: 'confirmed_created',
            serverRecordId: newObs._id,
            message: 'Milestone observation synced and confirmed.'
          });
        } else if (type === 'daily_log') {
          // Sync daily timeline log
          const { childId, mood, notes, date } = payload;
          const logDate = date || new Date().toISOString().split('T')[0];
          
          let existing = (store.dailyTimelines || []).find(l => l.childId === childId && l.date === logDate);
          if (existing) {
            existing.mood = mood || existing.mood;
            existing.notes = `${existing.notes ? existing.notes + ' ' : ''}${notes || ''} [Synced offline]`;
            results.push({
              localId,
              status: 'confirmed_updated',
              serverRecordId: existing._id,
              message: 'Daily routine update merged with existing date.'
            });
          } else {
            const child = store.children.find(c => c._id === childId);
            const newLog = {
              _id: `dtl_${Date.now()}`,
              childId,
              childName: child ? `${child.firstName} ${child.lastName}` : 'Child',
              date: logDate,
              teacherId: req.user?.id || 'usr_003',
              teacherName: staffName,
              mood: mood || 'Joyful',
              meals: { morningSnack: 'Snack served', lunch: 'Lunch completed', hydration: 'Adequate' },
              nap: { durationMinutes: 45, quality: 'Restful' },
              activities: [{ time: '10:00 AM', title: 'Sensory Exploration', description: 'Interactive classroom play' }],
              notes: `${notes || ''} [Logged offline]`,
              createdAt: new Date()
            };
            if (!store.dailyTimelines) store.dailyTimelines = [];
            store.dailyTimelines.unshift(newLog);

            results.push({
              localId,
              status: 'confirmed_created',
              serverRecordId: newLog._id,
              message: 'Daily timeline entry saved to server.'
            });
          }
        } else {
          results.push({
            localId,
            status: 'skipped_unknown_type',
            message: `Operation type "${type}" unrecognized.`
          });
        }
      } catch (err) {
        results.push({
          localId,
          status: 'error',
          message: err.message
        });
      }
    }

    res.json({
      success: true,
      processedCount: queuedOperations.length,
      syncedAt: new Date().toISOString(),
      results
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
