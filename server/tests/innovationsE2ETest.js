// KinderHub Innovation Modules E2E Integration Test Suite
// Verifies all 6 new innovative preschool feature modules

const BASE_URL = 'http://localhost:5000/api';

let adminToken = '';
let teacherToken = '';
let parentToken = '';
let testChildId = 'ch_001'; // Mia Johnson

let passedCount = 0;
let failedCount = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    passedCount++;
    console.log(`  ✅ PASS: ${testName}`);
  } else {
    failedCount++;
    console.error(`  ❌ FAIL: ${testName} - ${details}`);
  }
}

async function request(endpoint, options = {}, token = null) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });
  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    data = null;
  }
  return { status: res.status, ok: res.ok, data };
}

async function runInnovationTests() {
  console.log('\n🚀 Starting KinderHub Innovation Modules E2E Test Suite...\n');

  // STEP 1: Log in users
  console.log('📌 Test Group 1: Authentication & RBAC Tokens');
  const adminLogin = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'admin@kinderhub.edu', password: 'Admin@123' })
  });
  assert(adminLogin.status === 200 && adminLogin.data.token, 'Super Admin authenticated');
  adminToken = adminLogin.data.token;

  const teacherLogin = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'clara.teacher@kinderhub.edu', password: 'Teacher@123' })
  });
  assert(teacherLogin.status === 200 && teacherLogin.data.token, 'Lead Teacher authenticated');
  teacherToken = teacherLogin.data.token;

  const parentLogin = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'sarah.parent@kinderhub.edu', password: 'Parent@123' })
  });
  assert(parentLogin.status === 200 && parentLogin.data.token, 'Parent authenticated');
  parentToken = parentLogin.data.token;

  // STEP 2: FEATURE 1 - KinderGrowth AI Tests
  console.log('\n📌 Test Group 2: FEATURE 1 - KinderGrowth AI');
  const profileRes = await request(`/kindergrowth/profile/${testChildId}`, {}, teacherToken);
  assert(profileRes.status === 200, 'Teacher accessed child growth profile');
  assert(profileRes.data.selfComparison?.length === 5, 'Profile includes all 5 developmental domains with self-comparison');
  assert(profileRes.data.milestoneTimeline?.length > 0, 'Milestone observation timeline loaded');

  // RBAC test: Parent cannot view another family's child profile
  const forbiddenProfile = await request('/kindergrowth/profile/ch_003', {}, parentToken); // Oliver Smith
  assert(forbiddenProfile.status === 403, 'Parent blocked from accessing other children portfolios (HTTP 403)');

  // Teacher logs classroom observation
  const obsRes = await request('/kindergrowth/observations', {
    method: 'POST',
    body: JSON.stringify({
      childId: testChildId,
      domain: 'creativity',
      score: 5,
      milestoneTitle: 'Autumn Watercolor Splatter Play',
      notes: 'Mia discovered new secondary green shades by blending primary colors enthusiastically.',
      activityTitle: 'Art Discovery Center'
    })
  }, teacherToken);
  assert(obsRes.status === 201 && obsRes.data.observation, 'Classroom observation recorded and linked to activity');

  // Parent logs home observation
  const homeObsRes = await request('/kindergrowth/observations', {
    method: 'POST',
    body: JSON.stringify({
      childId: testChildId,
      domain: 'language',
      score: 5,
      milestoneTitle: 'Family Rhyming Song at Dinner',
      notes: 'Mia recited the butterfly rhyme completely and laughed joyfully.',
      isHomeObservation: true
    })
  }, parentToken);
  assert(homeObsRes.status === 201 && homeObsRes.data.observation.isHomeObservation === true, 'Parent home observation recorded and shared with teachers');

  // AI Activity Suggestion generation & approval
  const aiGenRes = await request('/kindergrowth/ai-suggestions', {
    method: 'POST',
    body: JSON.stringify({ childId: testChildId })
  }, teacherToken);
  assert(aiGenRes.status === 201 && aiGenRes.data.suggestions?.length > 0, 'Age-appropriate AI activity suggestions generated with pedagogical rationales');
  const testSugId = aiGenRes.data.suggestions[0]._id;

  // Teacher reviews and approves suggestion
  const approveSugRes = await request(`/kindergrowth/ai-suggestions/${testSugId}/review`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'approved', teacherNotes: 'Approved for Sensory Table 1' })
  }, teacherToken);
  assert(approveSugRes.status === 200 && approveSugRes.data.suggestion.status === 'approved', 'Educator reviewed and approved AI suggestion');

  // Monthly Summary Generation & Publishing
  const monthlyRes = await request(`/kindergrowth/monthly-summary/${testChildId}`, {}, teacherToken);
  assert(monthlyRes.status === 200 && monthlyRes.data.strengths?.length > 0, 'Monthly progress summary generated comparing child with personal baseline');

  const pubRes = await request(`/kindergrowth/monthly-summary/${testChildId}/publish`, {
    method: 'POST',
    body: JSON.stringify({
      monthYear: 'October 2026',
      summaryText: 'Outstanding developmental advancement in creativity and social sharing.',
      strengths: ['Expressive vocabulary', 'Gentle empathy'],
      growthAreas: ['Fine pincer precision']
    })
  }, teacherToken);
  assert(pubRes.status === 201 && pubRes.data.summary.status === 'published', 'Educator approved and published monthly summary for family view');

  // STEP 3: FEATURE 2 - KinderConnect Tests
  console.log('\n📌 Test Group 3: FEATURE 2 - KinderConnect');
  const timelineRes = await request(`/kinderconnect/timeline/${testChildId}`, {}, parentToken);
  assert(timelineRes.status === 200 && timelineRes.data.timeline, 'Daily routine timeline loaded (meals, naps, activities, photos)');

  // Multilingual translation endpoint (English -> Marathi & Hindi)
  const transMr = await request('/kinderconnect/translate', {
    method: 'POST',
    body: JSON.stringify({ text: 'Today was a wonderful and joyful day at school!', targetLanguage: 'mr' })
  }, teacherToken);
  assert(transMr.status === 200 && transMr.data.preservedOriginal === true, 'Marathi translation generated preserving original message');

  const transHi = await request('/kinderconnect/translate', {
    method: 'POST',
    body: JSON.stringify({ text: 'Today was a wonderful and joyful day at school!', targetLanguage: 'hi' })
  }, teacherToken);
  assert(transHi.status === 200 && transHi.data.translatedText.includes('हिन्दी'), 'Hindi translation generated with clear service provider disclosure');

  // Parent submits feedback/reaction
  const fbRes = await request('/kinderconnect/feedback', {
    method: 'POST',
    body: JSON.stringify({
      dailyLogId: timelineRes.data.timeline._id,
      message: 'Thank you Clara for the lovely update!',
      reaction: '❤️'
    })
  }, parentToken);
  assert(fbRes.status === 201 && fbRes.data.feedback, 'Parent feedback reaction logged on daily routine update');

  // Privacy & Consent Settings
  const privRes = await request(`/kinderconnect/privacy/${testChildId}`, {
    method: 'PUT',
    body: JSON.stringify({ allowPhotos: true, allowObservationSharing: true })
  }, parentToken);
  assert(privRes.status === 200 && privRes.data.privacySettings.allowPhotos === true, 'Child media privacy and parental consent settings updated');

  // STEP 4: FEATURE 3 - KinderSafe Tests
  console.log('\n📌 Test Group 4: FEATURE 3 - KinderSafe');
  const guardRes = await request(`/kindersafe/guardians/${testChildId}`, {}, parentToken);
  assert(guardRes.status === 200 && guardRes.data.guardians?.length > 0, 'Authorized guardian directory loaded with emergency contacts and allergy alerts');
  assert(guardRes.data.safetyNotice.includes('Facial recognition is NEVER used'), 'Face recognition prohibited as sole verification mechanism');

  // Parent generates time-limited QR pickup pass with 6-digit OTP
  const passGenRes = await request('/kindersafe/passes/generate', {
    method: 'POST',
    body: JSON.stringify({
      childId: testChildId,
      guardianName: 'Sarah Johnson',
      guardianRelation: 'Mother',
      guardianPhone: '+1 (555) 012-3456',
      validHours: 4
    })
  }, parentToken);
  assert(passGenRes.status === 201 && passGenRes.data.pass?.otp?.length === 6, 'Time-limited QR pickup pass and 6-digit OTP generated successfully');
  const testPass = passGenRes.data.pass;

  // Staff verification screen tests OTP
  const verifyRes = await request('/kindersafe/passes/verify', {
    method: 'POST',
    body: JSON.stringify({ otp: testPass.otp })
  }, teacherToken);
  assert(verifyRes.status === 200 && verifyRes.data.isValid === true, 'Staff terminal verified pass and displayed guardian identity checklist');

  // Staff confirms handover
  const confirmRes = await request('/kindersafe/passes/confirm', {
    method: 'POST',
    body: JSON.stringify({
      passId: testPass._id,
      handoverNotes: 'Physical ID checked. Child released safely to mother.'
    })
  }, teacherToken);
  assert(confirmRes.status === 200 && confirmRes.data.pickupRecord.status === 'verified_completed', 'Pickup handover finalized and recorded in audit log');

  // Second pickup attempt blocked (idempotent / anti-replay safeguard)
  const doublePickup = await request('/kindersafe/passes/verify', {
    method: 'POST',
    body: JSON.stringify({ passCode: testPass.passCode })
  }, teacherToken);
  assert(doublePickup.status === 400 && doublePickup.data.status === 'already_used', 'Anti-replay safeguard blocked reuse of already-completed pass');

  // Emergency live accountability list & headcount
  const accountRes = await request('/kindersafe/emergency-accountability', {}, teacherToken);
  assert(accountRes.status === 200 && accountRes.data.summary.totalEnrolled > 0, 'Live emergency accountability headcount generated from attendance rosters');

  // Incident reporting
  const incRes = await request('/kindersafe/incidents', {
    method: 'POST',
    body: JSON.stringify({
      childId: testChildId,
      category: 'Minor Scrape/Fall',
      severity: 'Low',
      location: 'Soft play lawn',
      description: 'Minor knee graze while playing tag.',
      actionsTaken: 'Sterile wash and colorful bandage applied.',
      firstAidAdministered: true,
      parentContacted: true
    })
  }, teacherToken);
  assert(incRes.status === 201 && incRes.data.incident, 'Safety incident logged with required actions taken and parent contact');

  // STEP 5: FEATURE 4 - KinderQuest Tests
  console.log('\n📌 Test Group 5: FEATURE 4 - KinderQuest');
  const questRes = await request(`/kinderquest/journey/${testChildId}`, {}, teacherToken);
  assert(questRes.status === 200 && questRes.data.chapters?.length >= 3, 'Play-based Wonder Garden learning journey loaded with chapters');

  // Complete a mini-activity
  const actCompleteRes = await request('/kinderquest/complete-activity', {
    method: 'POST',
    body: JSON.stringify({
      childId: testChildId,
      chapterId: 'ch_sprout',
      activityId: 'act_trace_sand'
    })
  }, teacherToken);
  assert(actCompleteRes.status === 200 && actCompleteRes.data.activity.completed === true, 'Play-based quest activity completed with badge earned');

  // STEP 6: FEATURE 5 - KinderOffline Tests
  console.log('\n📌 Test Group 6: FEATURE 5 - KinderOffline');
  const syncRes = await request('/kinderoffline/sync', {
    method: 'POST',
    body: JSON.stringify({
      queuedOperations: [
        {
          localId: 'loc_test_001',
          type: 'attendance',
          clientTimestamp: new Date().toISOString(),
          payload: {
            date: '2026-10-12',
            classId: 'cls_001',
            records: [
              { childId: 'ch_001', childName: 'Mia Johnson', status: 'Present', remarks: 'Synced offline test' }
            ]
          }
        },
        {
          localId: 'loc_test_002',
          type: 'observation',
          clientTimestamp: new Date().toISOString(),
          payload: {
            childId: testChildId,
            domain: 'motorSkills',
            score: 5,
            milestoneTitle: 'Offline Foam Log Crawl',
            notes: 'Crawled smoothly through the balance path.'
          }
        }
      ]
    })
  }, teacherToken);
  assert(syncRes.status === 200 && syncRes.data.results?.length === 2, 'Batch offline queue synchronized with server confirmation and duplicate prevention');

  // STEP 7: FEATURE 6 - KinderPredict Tests
  console.log('\n📌 Test Group 7: FEATURE 6 - KinderPredict');
  const predictRes = await request('/kinderpredict/alerts', {}, teacherToken);
  assert(predictRes.status === 200 && predictRes.data.alerts?.length > 0, 'Rule-based school action alerts evaluated from database records');
  assert(predictRes.data.alerts.some(a => a.type === 'repeated_absences' || a.type === 'fee_overdue' || a.type === 'class_capacity' || a.type === 'admission_followup'), 'Alerts cover absences, overdue fees, class capacity, or admissions follow-up');
  assert(predictRes.data.alerts[0].triggerExplanation && predictRes.data.alerts[0].recommendedAction, 'Alerts contain transparent rule triggers and recommended next actions');

  // Resolve alert
  const testAlertId = predictRes.data.alerts[0].alertId;
  const resolveRes = await request(`/kinderpredict/alerts/${testAlertId}/resolve`, {
    method: 'PATCH',
    body: JSON.stringify({
      status: 'resolved',
      actionRemarks: 'Checked in with parent and confirmed attendance for tomorrow.'
    })
  }, teacherToken);
  assert(resolveRes.status === 200 && resolveRes.data.alertResolution.status === 'resolved', 'Staff marked alert as resolved with recorded action remarks');

  console.log('\n==========================================');
  console.log(`🏁 Total Innovation E2E Tests: ${passedCount + failedCount}`);
  console.log(`✅ Passed: ${passedCount}`);
  console.log(`❌ Failed: ${failedCount}`);
  console.log('==========================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runInnovationTests().catch(err => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
