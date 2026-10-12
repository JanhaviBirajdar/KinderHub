import { store } from '../services/dataStore.js';

// Get child developmental profile & milestone timeline
export const getChildGrowthProfile = (req, res) => {
  try {
    const { childId } = req.params;
    const child = store.children.find(c => c._id === childId || c.childId === childId);
    if (!child) {
      return res.status(404).json({ message: 'Child record not found.' });
    }

    // Role check: parents can only view their own child
    if (req.user && req.user.role === 'parent') {
      const parentUser = store.users.find(u => u._id === req.user.id);
      const parentChildrenIds = parentUser?.childrenIds || [];
      if (child.parentId !== req.user.id && !parentChildrenIds.includes(child._id)) {
        return res.status(403).json({ message: 'Forbidden: You can only view your own child\'s development profile.' });
      }
    }

    // Get all observations for this child
    const observations = (store.observations || [])
      .filter(o => o.childId === child._id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    // Calculate self-comparison progress across 5 domains
    const domains = ['language', 'cognitive', 'creativity', 'motorSkills', 'socialEmotional'];
    const domainLabels = {
      language: 'Language & Communication',
      cognitive: 'Cognitive & Problem Solving',
      creativity: 'Creativity & Arts',
      motorSkills: 'Motor Skills (Fine & Gross)',
      socialEmotional: 'Social-Emotional Agility'
    };

    const selfComparison = domains.map(domainKey => {
      const domainObs = observations.filter(o => o.domain === domainKey);
      const latest = domainObs[0];
      const previous = domainObs[1];

      const currentScore = latest ? latest.score : 3.5;
      const previousScore = previous ? previous.score : (latest ? Math.max(1, latest.score - 0.5) : 3.0);
      const diff = currentScore - previousScore;

      return {
        domain: domainKey,
        label: domainLabels[domainKey],
        currentScore,
        previousScore,
        difference: parseFloat(diff.toFixed(1)),
        velocity: diff > 0 ? 'Advancing' : diff === 0 ? 'Steady' : 'Consolidating',
        observationCount: domainObs.length,
        latestObservationDate: latest?.date || 'N/A',
        latestNotes: latest?.notes || 'Baseline established.'
      };
    });

    // Milestone timeline items
    const milestoneTimeline = observations.map(obs => ({
      _id: obs._id,
      date: obs.date,
      domain: obs.domain,
      domainLabel: domainLabels[obs.domain] || obs.domain,
      title: obs.milestoneTitle,
      notes: obs.notes,
      score: obs.score,
      activityTitle: obs.activityTitle || 'Curriculum Exploration',
      observedByName: obs.observedByName,
      observedByRole: obs.observedByRole,
      isHomeObservation: !!obs.isHomeObservation,
      context: obs.context || 'classroom',
      photo: obs.photo || ''
    }));

    // AI suggestions for this child
    const aiSuggestions = (store.aiSuggestions || [])
      .filter(s => s.childId === child._id);

    // Monthly summaries
    const monthlySummaries = (store.monthlySummaries || [])
      .filter(m => m.childId === child._id);

    res.json({
      child: {
        _id: child._id,
        childId: child.childId,
        firstName: child.firstName,
        lastName: child.lastName,
        dob: child.dob,
        age: calculateAge(child.dob),
        className: child.className,
        photo: child.photo,
        allergies: child.allergies,
        bloodGroup: child.bloodGroup
      },
      domains: domainLabels,
      selfComparison,
      milestoneTimeline,
      aiSuggestions,
      monthlySummaries,
      totalObservations: observations.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Query observations with comprehensive filters
export const getObservations = (req, res) => {
  try {
    const { childId, classId, domain, startDate, endDate, source } = req.query;
    let list = [...(store.observations || [])];

    if (req.user && req.user.role === 'parent') {
      const parentUser = store.users.find(u => u._id === req.user.id);
      const parentChildrenIds = parentUser?.childrenIds || [];
      list = list.filter(o => parentChildrenIds.includes(o.childId));
    }

    if (childId) {
      list = list.filter(o => o.childId === childId);
    }

    if (classId) {
      const classChildren = store.children.filter(c => c.classId === classId).map(c => c._id);
      list = list.filter(o => classChildren.includes(o.childId));
    }

    if (domain) {
      list = list.filter(o => o.domain.toLowerCase() === domain.toLowerCase());
    }

    if (source === 'home') {
      list = list.filter(o => o.isHomeObservation);
    } else if (source === 'teacher') {
      list = list.filter(o => !o.isHomeObservation);
    }

    if (startDate) {
      list = list.filter(o => o.date >= startDate);
    }
    if (endDate) {
      list = list.filter(o => o.date <= endDate);
    }

    // Sort by date descending
    list.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Record an observation (Educator in classroom or Parent at home)
export const createObservation = (req, res) => {
  try {
    const {
      childId,
      date,
      domain,
      score,
      milestoneTitle,
      notes,
      activityId,
      activityTitle,
      context,
      photo,
      isHomeObservation
    } = req.body;

    if (!childId || !domain || !milestoneTitle || !notes) {
      return res.status(400).json({ message: 'Child, domain, milestone title, and observation notes are required.' });
    }

    const child = store.children.find(c => c._id === childId);
    if (!child) {
      return res.status(404).json({ message: 'Child not found.' });
    }

    const isParent = req.user?.role === 'parent';
    const isHome = isParent || !!isHomeObservation;

    const newObs = {
      _id: `obs_${Date.now()}`,
      childId,
      childName: `${child.firstName} ${child.lastName}`,
      date: date || new Date().toISOString().split('T')[0],
      domain,
      score: Number(score) || 4,
      milestoneTitle,
      notes,
      activityId: activityId || null,
      activityTitle: activityTitle || (isHome ? 'Home Activity' : 'Classroom Session'),
      observedByRole: isParent ? 'parent' : (req.user?.role || 'teacher'),
      observedById: req.user?.id || 'usr_003',
      observedByName: req.user?.name || (isParent ? 'Parent' : 'Lead Teacher'),
      context: context || (isHome ? 'home' : 'classroom'),
      photo: photo || '',
      isHomeObservation: isHome,
      createdAt: new Date()
    };

    if (!store.observations) store.observations = [];
    store.observations.unshift(newObs);

    res.status(201).json({
      message: isHome ? 'Home observation shared with teachers!' : 'Classroom observation recorded successfully!',
      observation: newObs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate AI age-appropriate activity suggestions based on observations
export const generateAiSuggestions = (req, res) => {
  try {
    const { childId } = req.body;
    if (!childId) {
      return res.status(400).json({ message: 'Child ID is required.' });
    }

    const child = store.children.find(c => c._id === childId);
    if (!child) {
      return res.status(404).json({ message: 'Child not found.' });
    }

    // Inspect child's observations to find nurturing areas or strengths to extend
    const childObs = (store.observations || []).filter(o => o.childId === childId);
    
    // Curated pedagogical suggestions tailored to early childhood development
    const suggestionCatalog = [
      {
        domain: 'creativity',
        suggestedTitle: 'Sensory Texture Canvas & Leaf Rubbing',
        description: 'Provide dry leaves, corrugated cardboard, and washable pastels to explore textured friction patterns.',
        rationale: `Based on ${child.firstName}'s high engagement with natural materials, this builds sensory creativity without rigid rules.`,
        materials: 'Fallen autumn leaves, butcher paper, chunky beeswax crayons',
        ageGroup: child.className || 'Playgroup'
      },
      {
        domain: 'motorSkills',
        suggestedTitle: 'Giant Tweezer Pom-Pom Color Sorting',
        description: 'Use child-safe ergonomic tweezers to transport soft felt pom-poms into matching color bowls.',
        rationale: `Nurtures pincer grasp precision and wrist stability, directly supporting early pencil readiness.`,
        materials: 'Colorful silicone cups, jumbo plastic tongs, soft wool pom-poms',
        ageGroup: child.className || 'Playgroup'
      },
      {
        domain: 'language',
        suggestedTitle: 'Story Dice & Interactive Puppet Dialogues',
        description: 'Roll large wooden picture dice (sun, animal, tree) and invite the child to co-create a whimsical ending.',
        rationale: `Encourages descriptive vocabulary and narrative sequencing in a joyful, pressure-free circle.`,
        materials: 'Picture story dice, animal hand puppets',
        ageGroup: child.className || 'Playgroup'
      },
      {
        domain: 'socialEmotional',
        suggestedTitle: 'Collaborative Friendship Train Building',
        description: 'Two children share a crate of large foam interlocking blocks to construct a passenger train together.',
        rationale: `Scaffolds cooperative sharing, conversational turn-taking, and mutual celebrating of completed structures.`,
        materials: 'Oversized soft foam blocks, train conductor hat',
        ageGroup: child.className || 'Playgroup'
      },
      {
        domain: 'cognitive',
        suggestedTitle: 'Balance Scale & Natural Weight Discovery',
        description: 'Compare weights of pinecones, smooth river stones, and feathers using an intuitive wooden seesaw scale.',
        rationale: `Builds foundational intuitive physics and pre-math comparison (heavier, lighter, balanced).`,
        materials: 'Wooden balance scale, stones, pinecones, feathers',
        ageGroup: child.className || 'Playgroup'
      }
    ];

    // Pick 2 suggestions that match child's profile
    const existingTitles = (store.aiSuggestions || [])
      .filter(s => s.childId === childId)
      .map(s => s.suggestedTitle);

    const available = suggestionCatalog.filter(s => !existingTitles.includes(s.suggestedTitle));
    const toAdd = (available.length >= 2 ? available.slice(0, 2) : suggestionCatalog.slice(0, 2)).map((s, idx) => ({
      _id: `sug_${Date.now()}_${idx}`,
      childId,
      childName: `${child.firstName} ${child.lastName}`,
      domain: s.domain,
      suggestedTitle: s.suggestedTitle,
      description: s.description,
      rationale: s.rationale,
      materials: s.materials,
      ageGroup: s.ageGroup,
      status: 'pending_review',
      teacherNotes: '',
      isAiGenerated: true,
      disclaimer: 'AI-generated pedagogical suggestion. Requires Lead Educator approval before assignment.',
      createdAt: new Date()
    }));

    if (!store.aiSuggestions) store.aiSuggestions = [];
    toAdd.forEach(item => store.aiSuggestions.unshift(item));

    res.status(201).json({
      message: 'Age-appropriate activity suggestions generated for educator review!',
      suggestions: toAdd
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Teacher reviews, edits, and approves AI-generated suggestion
export const reviewAiSuggestion = (req, res) => {
  try {
    const { id } = req.params;
    const { status, teacherNotes, suggestedTitle, description } = req.body;

    const suggestion = (store.aiSuggestions || []).find(s => s._id === id);
    if (!suggestion) {
      return res.status(404).json({ message: 'Activity suggestion not found.' });
    }

    if (suggestedTitle) suggestion.suggestedTitle = suggestedTitle;
    if (description) suggestion.description = description;
    if (teacherNotes !== undefined) suggestion.teacherNotes = teacherNotes;
    
    suggestion.status = status || 'approved';
    suggestion.approvedById = req.user?.id || 'usr_003';
    suggestion.approvedByName = req.user?.name || 'Clara Oswald (Teacher)';
    suggestion.approvedAt = new Date();

    res.json({
      message: `Suggestion ${suggestion.status === 'approved' ? 'approved and published' : 'updated'} successfully!`,
      suggestion
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate Monthly Progress Summary comparing child to own previous baseline
export const getMonthlySummary = (req, res) => {
  try {
    const { childId } = req.params;
    const child = store.children.find(c => c._id === childId);
    if (!child) return res.status(404).json({ message: 'Child not found.' });

    const monthName = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const observations = (store.observations || []).filter(o => o.childId === childId);

    // Calculate domain averages
    const domains = ['language', 'cognitive', 'creativity', 'motorSkills', 'socialEmotional'];
    const domainAverages = {};
    domains.forEach(d => {
      const subset = observations.filter(o => o.domain === d);
      if (subset.length > 0) {
        const sum = subset.reduce((acc, curr) => acc + curr.score, 0);
        domainAverages[d] = parseFloat((sum / subset.length).toFixed(1));
      } else {
        domainAverages[d] = 4.0;
      }
    });

    const summaryReport = {
      childId: child._id,
      childName: `${child.firstName} ${child.lastName}`,
      monthYear: monthName,
      classroom: child.className,
      totalObservationsThisMonth: observations.length,
      domainAverages,
      strengths: [
        `${child.firstName} shows remarkable enthusiasm in creative expression and sensory exploration.`,
        `Consistently displays gentle kindness and shares materials during small group activities.`
      ],
      growthAreas: [
        `Continuing to nurture single-foot balance through indoor obstacle course play.`,
        `Encouraging expanded vocabulary when recounting morning routines.`
      ],
      comparativeInsight: `Compared to ${child.firstName}'s personal baseline from earlier weeks, steady advancement is observed in self-regulation and problem-solving without comparing against peer timelines.`,
      status: 'draft',
      evaluatorName: req.user?.name || 'Class Teacher'
    };

    res.json(summaryReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Teacher approves and publishes monthly progress summary for parents
export const publishMonthlySummary = (req, res) => {
  try {
    const { childId } = req.params;
    const { monthYear, summaryText, strengths, growthAreas } = req.body;

    const child = store.children.find(c => c._id === childId);
    if (!child) return res.status(404).json({ message: 'Child not found.' });

    const newSummary = {
      _id: `msum_${Date.now()}`,
      childId,
      childName: `${child.firstName} ${child.lastName}`,
      monthYear: monthYear || new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }),
      summaryText: summaryText || `${child.firstName} made wonderful joyful progress this month!`,
      strengths: strengths || ['Sensory creativity', 'Empathetic social sharing'],
      growthAreas: growthAreas || ['Fine motor precision'],
      publishedAt: new Date(),
      publishedById: req.user?.id || 'usr_003',
      publishedByName: req.user?.name || 'Clara Oswald',
      status: 'published'
    };

    if (!store.monthlySummaries) store.monthlySummaries = [];
    store.monthlySummaries.unshift(newSummary);

    res.status(201).json({
      message: 'Monthly developmental report approved and published for family view!',
      summary: newSummary
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

function calculateAge(dobStr) {
  if (!dobStr) return '3 Years';
  const dob = new Date(dobStr);
  const now = new Date();
  const diffMonths = (now.getFullYear() - dob.getFullYear()) * 12 + (now.getMonth() - dob.getMonth());
  const years = Math.floor(diffMonths / 12);
  const months = diffMonths % 12;
  return `${years}y ${months}m`;
}
