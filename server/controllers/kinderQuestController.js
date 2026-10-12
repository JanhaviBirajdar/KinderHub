import { store } from '../services/dataStore.js';

// Get child's play-based learning journey (Garden of Wonder)
export const getQuestJourney = (req, res) => {
  try {
    const { childId } = req.params;
    const child = store.children.find(c => c._id === childId || c.childId === childId);
    if (!child) return res.status(404).json({ message: 'Child not found.' });

    // Authorization check for parents
    if (req.user && req.user.role === 'parent') {
      const parentUser = store.users.find(u => u._id === req.user.id);
      const parentChildrenIds = parentUser?.childrenIds || [];
      if (child.parentId !== req.user.id && !parentChildrenIds.includes(child._id)) {
        return res.status(403).json({ message: 'Forbidden: You can only view your own child\'s quest journey.' });
      }
    }

    let journey = (store.questJourneys || []).find(j => j.childId === child._id);
    if (!journey) {
      // Initialize default preschool Garden of Wonder journey
      journey = initializeDefaultJourney(child._id, `${child.firstName} ${child.lastName}`);
      if (!store.questJourneys) store.questJourneys = [];
      store.questJourneys.push(journey);
    }

    // Calculate gentle non-competitive progress
    let totalActs = 0;
    let completedActs = 0;
    journey.chapters.forEach(ch => {
      totalActs += ch.activities.length;
      completedActs += ch.activities.filter(a => a.completed).length;
    });

    const completionPercent = totalActs > 0 ? Math.round((completedActs / totalActs) * 100) : 0;

    res.json({
      child: {
        _id: child._id,
        name: `${child.firstName} ${child.lastName}`,
        className: child.className,
        photo: child.photo
      },
      journeyTheme: 'Wonder Garden Adventure',
      completionPercent,
      completedActivitiesCount: completedActs,
      totalActivitiesCount: totalActs,
      chapters: journey.chapters,
      gentleNotice: 'KinderQuest is non-competitive and play-based. No rankings or timers are used, focusing purely on joyful early childhood curiosity.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Complete an educational mini-activity
export const completeQuestActivity = (req, res) => {
  try {
    const { childId, chapterId, activityId, reflectionNotes } = req.body;
    if (!childId || !chapterId || !activityId) {
      return res.status(400).json({ message: 'Child ID, chapter ID, and activity ID are required.' });
    }

    let journey = (store.questJourneys || []).find(j => j.childId === childId);
    if (!journey) {
      const child = store.children.find(c => c._id === childId);
      journey = initializeDefaultJourney(childId, child ? `${child.firstName} ${child.lastName}` : 'Child');
      if (!store.questJourneys) store.questJourneys = [];
      store.questJourneys.push(journey);
    }

    const chapter = journey.chapters.find(c => c.chapterId === chapterId);
    if (!chapter) return res.status(404).json({ message: 'Chapter not found.' });

    const activity = chapter.activities.find(a => a.activityId === activityId);
    if (!activity) return res.status(404).json({ message: 'Activity not found.' });

    activity.completed = true;
    activity.completedAt = new Date();
    activity.reflectionNotes = reflectionNotes || 'Completed with great joy and curiosity!';

    // Update chapter completed count
    chapter.completedActivitiesCount = chapter.activities.filter(a => a.completed).length;
    if (chapter.completedActivitiesCount === chapter.activities.length) {
      chapter.badge.unlocked = true;
    }

    res.json({
      message: `Bravo! Activity "${activity.title}" completed. Badge earned: "${chapter.badge.name}"!`,
      activity,
      chapterBadge: chapter.badge
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Teacher unlocks next learning chapter based on classroom readiness
export const unlockChapter = (req, res) => {
  try {
    const { childId, chapterId } = req.body;
    let journey = (store.questJourneys || []).find(j => j.childId === childId);
    if (!journey) return res.status(404).json({ message: 'Journey not found.' });

    const chapter = journey.chapters.find(c => c.chapterId === chapterId);
    if (!chapter) return res.status(404).json({ message: 'Chapter not found.' });

    chapter.unlocked = true;

    res.json({
      message: `Chapter "${chapter.title}" unlocked for child's next learning step!`,
      chapter
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

function initializeDefaultJourney(childId, childName) {
  return {
    _id: `qj_${childId}`,
    childId,
    childName,
    chapters: [
      {
        chapterId: 'ch_sprout',
        title: 'Chapter 1: Sprout Sanctuary 🌱',
        theme: 'Color & Texture Discovery',
        unlocked: true,
        completedActivitiesCount: 2,
        totalActivities: 3,
        activities: [
          {
            activityId: 'act_match_colors',
            title: 'Rainbow Leaf Match',
            type: 'matching',
            instructions: 'Match pairs of matching autumn leaf colors (red, yellow, orange).',
            completed: true,
            completedAt: new Date('2026-10-09'),
            offlineExtension: 'Collect real fallen leaves on your family evening walk and sort by color!'
          },
          {
            activityId: 'act_sort_shapes',
            title: 'Wooden Block Shapes Sorting',
            type: 'sorting',
            instructions: 'Sort circles, squares, and triangles into their hollow wooden slots.',
            completed: true,
            completedAt: new Date('2026-10-10'),
            offlineExtension: 'Point out shapes around the house (clock is circle, window is square).'
          },
          {
            activityId: 'act_trace_sand',
            title: 'Finger Tracing in Sand Tray',
            type: 'tracing',
            instructions: 'Gently trace wavy river lines and circles using index finger in colored sand.',
            completed: false,
            completedAt: null,
            offlineExtension: 'Spread dry semolina (suji) on a tray and practice drawing cheerful smiles.'
          }
        ],
        badge: {
          name: 'Green Sprout Explorer',
          icon: '🌱',
          unlocked: false
        }
      },
      {
        chapterId: 'ch_butterfly',
        title: 'Chapter 2: Butterfly Valley 🦋',
        theme: 'Counting & Rhythm',
        unlocked: true,
        completedActivitiesCount: 1,
        totalActivities: 3,
        activities: [
          {
            activityId: 'act_count_caterpillars',
            title: 'Counting Hungry Caterpillars (1 to 5)',
            type: 'counting',
            instructions: 'Count 5 colorful caterpillar beads onto a pipe cleaner string.',
            completed: true,
            completedAt: new Date('2026-10-11'),
            offlineExtension: 'Count apples or spoons together during family dinner setup.'
          },
          {
            activityId: 'act_story_puppet',
            title: 'The Friendly Fox puppet Tale',
            type: 'storytelling',
            instructions: 'Use animal puppets to make happy greetings and practice "please" and "thank you".',
            completed: false,
            completedAt: null,
            offlineExtension: 'Tell a bedtime story where your child chooses the magical animal companion.'
          },
          {
            activityId: 'act_creative_clay',
            title: 'Playdough Flower Sculpting',
            type: 'creativity',
            instructions: 'Roll playdough balls and press yellow flower centers with child-safe stamps.',
            completed: false,
            completedAt: null,
            offlineExtension: 'Knead soft wheat dough (atta) together to make tiny dough animals.'
          }
        ],
        badge: {
          name: 'Golden Butterfly Friend',
          icon: '🦋',
          unlocked: false
        }
      },
      {
        chapterId: 'ch_whispering',
        title: 'Chapter 3: Whispering Woods 🌳',
        theme: 'Nature Sounds & Rhymes',
        unlocked: false,
        completedActivitiesCount: 0,
        totalActivities: 2,
        activities: [
          {
            activityId: 'act_sound_match',
            title: 'Bird Song Rhythm Clapping',
            type: 'matching',
            instructions: 'Listen to chirping birds and clap in matching rhythmic patterns.',
            completed: false,
            completedAt: null,
            offlineExtension: 'Step outside at dusk and close your eyes to count 3 different outdoor sounds.'
          },
          {
            activityId: 'act_tree_story',
            title: 'The Grand Banyan Tree Story',
            type: 'storytelling',
            instructions: 'Recount who lives in the big tree (squirrels, owls, green parrots).',
            completed: false,
            completedAt: null,
            offlineExtension: 'Draw a big tree and color leaves with green fingerprints.'
          }
        ],
        badge: {
          name: 'Guardian of the Woods',
          icon: '🌳',
          unlocked: false
        }
      }
    ]
  };
}
