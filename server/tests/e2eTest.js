// Kinder Hub End-to-End Integration Test Suite
// Verifies all core business logic, RBAC, calculations, and error handling

const BASE_URL = 'http://localhost:5000/api';

let adminToken = '';
let teacherToken = '';
let parentToken = '';
let testClassId = '';
let testChildId = '';
let testAdmissionId = '';
let testInvoiceId = '';

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

async function runTests() {
  console.log('\n🚀 Starting Kinder Hub Comprehensive E2E Test Suite...\n');

  // ==========================================
  // 1. Authentication & Login Verification
  // ==========================================
  console.log('📌 Test Group 1: Authentication & Invalid Login Error Handling');
  
  // 1.1 Invalid credentials
  const badLogin = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'nonexistent@kinderhub.com', password: 'wrongpassword' })
  });
  assert(badLogin.status === 401 && badLogin.data?.message?.includes('Invalid'), 
    'Invalid credentials returns 401 with error message', JSON.stringify(badLogin.data));

  // 1.2 Missing fields
  const missingLogin = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'admin@kinderhub.com' })
  });
  assert(missingLogin.status === 400, 
    'Missing login password returns 400 Bad Request');

  // 1.3 Super Admin Login
  const adminRes = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'admin@kinderhub.com', password: 'admin123' })
  });
  assert(adminRes.ok && adminRes.data?.token && adminRes.data?.user?.role === 'super_admin', 
    'Super Admin login returns 200 with JWT token and super_admin role');
  adminToken = adminRes.data?.token;

  // 1.4 Teacher Login
  const teacherRes = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'clara@kinderhub.com', password: 'teacher123' })
  });
  assert(teacherRes.ok && teacherRes.data?.token && teacherRes.data?.user?.role === 'teacher', 
    'Teacher login returns 200 with JWT token and teacher role');
  teacherToken = teacherRes.data?.token;

  // 1.5 Parent Login
  const parentRes = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'sarah@kinderhub.com', password: 'parent123' })
  });
  assert(parentRes.ok && parentRes.data?.token && parentRes.data?.user?.role === 'parent', 
    'Parent login returns 200 with JWT token and parent role');
  parentToken = parentRes.data?.token;

  // ==========================================
  // 2. Role-Based Access Control (RBAC)
  // ==========================================
  console.log('\n📌 Test Group 2: Role-Based Permissions & Route Guards');

  // 2.1 Unauthenticated access to protected route
  const unauthReq = await request('/dashboard/summary');
  assert(unauthReq.status === 401, 
    'Unauthenticated request to /dashboard/summary rejected with 401');

  // 2.2 Super Admin access to dashboard
  const adminDash = await request('/dashboard/summary', {}, adminToken);
  assert(adminDash.ok && adminDash.data?.overview?.totalChildren !== undefined, 
    'Super Admin authorized to access /dashboard/summary with live metrics');

  // 2.3 Parent forbidden from admin dashboard
  const parentDash = await request('/dashboard/summary', {}, parentToken);
  assert(parentDash.status === 403, 
    'Parent forbidden from accessing /dashboard/summary (HTTP 403)');

  // 2.4 Parent forbidden from creating classrooms
  const parentCreateClass = await request('/classes', {
    method: 'POST',
    body: JSON.stringify({ name: 'Unauthorized Class', section: 'Z' })
  }, parentToken);
  assert(parentCreateClass.status === 403, 
    'Parent forbidden from creating classrooms (HTTP 403)');

  // 2.5 Teacher forbidden from deleting faculty records
  const teacherDeleteStaff = await request('/teachers/tch_001', {
    method: 'DELETE'
  }, teacherToken);
  assert(teacherDeleteStaff.status === 403, 
    'Teacher forbidden from deleting other staff records (HTTP 403)');

  // ==========================================
  // 3. Child Registration & CRUD Lifecycle
  // ==========================================
  console.log('\n📌 Test Group 3: Child Registration & Portfolio CRUD');

  // Get available classes first
  const classesList = await request('/classes', {}, adminToken);
  testClassId = classesList.data?.[0]?._id;
  assert(classesList.ok && testClassId, 
    'Fetched available classes for child enrollment');

  // 3.1 Child validation error on missing required fields
  const invalidChild = await request('/children', {
    method: 'POST',
    body: JSON.stringify({ firstName: 'Incomplete' })
  }, adminToken);
  assert(invalidChild.status === 400, 
    'Registration with missing fields returns 400 validation error');

  // 3.2 Enroll child successfully
  const newChildPayload = {
    firstName: 'Oliver',
    lastName: 'Bennett',
    dob: '2023-05-18',
    gender: 'Male',
    bloodGroup: 'B+',
    classId: testClassId,
    section: 'A',
    emergencyContact: {
      name: 'Claire Bennett',
      phone: '+1 (555) 902-1144',
      relation: 'Mother'
    },
    allergies: ['Peanuts', 'Dust Mites'],
    medicalNotes: 'Carries emergency EpiPen in backpack',
    authorizedPickups: [{
      name: 'Claire Bennett',
      phone: '+1 (555) 902-1144',
      relation: 'Mother'
    }]
  };
  const createChildRes = await request('/children', {
    method: 'POST',
    body: JSON.stringify(newChildPayload)
  }, adminToken);
  assert(createChildRes.status === 201 && createChildRes.data?.childId, 
    `Child Oliver Bennett enrolled with ID ${createChildRes.data?.childId}`);
  testChildId = createChildRes.data?._id;

  // 3.3 Fetch Child Detail
  const getChildRes = await request(`/children/${testChildId}`, {}, adminToken);
  assert(getChildRes.ok && getChildRes.data?.firstName === 'Oliver' && getChildRes.data?.allergies?.includes('Peanuts'), 
    'Child profile fetched with correct allergy alert & medical notes');

  // 3.4 Update Child Profile
  const updateChildRes = await request(`/children/${testChildId}`, {
    method: 'PUT',
    body: JSON.stringify({
      emergencyContact: {
        name: 'Claire Bennett (Updated)',
        phone: '+1 (555) 902-9999',
        relation: 'Mother'
      }
    })
  }, adminToken);
  assert(updateChildRes.ok && updateChildRes.data?.emergencyContact?.phone === '+1 (555) 902-9999', 
    'Child emergency contact updated successfully');

  // 3.5 Archive / Toggle Child Status
  const archiveChildRes = await request(`/children/${testChildId}/archive`, {
    method: 'PATCH'
  }, adminToken);
  assert(archiveChildRes.ok && archiveChildRes.data?.status === 'Archived', 
    'Child status toggled to Archived');

  // 3.6 Re-enroll Child
  const reEnrollRes = await request(`/children/${testChildId}/archive`, {
    method: 'PATCH'
  }, adminToken);
  assert(reEnrollRes.ok && reEnrollRes.data?.status === 'Enrolled', 
    'Child status re-enrolled to active status');

  // ==========================================
  // 4. Admissions Workflow & Student Conversion
  // ==========================================
  console.log('\n📌 Test Group 4: Admissions Workflow & Student Conversion');

  // 4.1 Submit new admission enquiry
  const newAdmission = {
    childFirstName: 'Aria',
    childLastName: 'Montgomery',
    dob: '2023-08-20',
    gender: 'Female',
    preferredClassId: testClassId,
    parentName: 'Ella Montgomery',
    parentEmail: 'ella@example.com',
    parentPhone: '+1 (555) 831-4422',
    address: '42 Blossom Grove',
    medicalNotes: 'No allergies known'
  };
  const submitAdmRes = await request('/admissions', {
    method: 'POST',
    body: JSON.stringify(newAdmission)
  });
  assert(submitAdmRes.status === 201 && submitAdmRes.data?.applicationNo, 
    `Admission enquiry submitted successfully with App No: ${submitAdmRes.data?.applicationNo}`);
  testAdmissionId = submitAdmRes.data?._id;

  // 4.2 Review and Approve Admission
  const approveAdmRes = await request(`/admissions/${testAdmissionId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'Approved', adminNotes: 'Interview passed with flying colors.' })
  }, adminToken);
  assert(approveAdmRes.ok && approveAdmRes.data?.status === 'Approved', 
    'Admission status updated to Approved with admin notes');

  // 4.3 Convert Admission to Enrolled Child
  const convertRes = await request(`/admissions/${testAdmissionId}/convert`, {
    method: 'POST'
  }, adminToken);
  assert(convertRes.ok && convertRes.data?.childId, 
    `Approved admission converted into enrolled student (ID: ${convertRes.data?.childId})`);

  // Verify converted child exists in directory
  const convertedChild = await request(`/children/${convertRes.data?.child?._id}`, {}, adminToken);
  assert(convertedChild.ok && convertedChild.data?.firstName === 'Aria', 
    'Converted student immediately visible in Children Directory');

  // Clean up converted student
  await request(`/children/${convertRes.data?.child?._id}/permanent`, { method: 'DELETE' }, adminToken);
  await request(`/admissions/${testAdmissionId}`, { method: 'DELETE' }, adminToken);

  // ==========================================
  // 5. Attendance Operations & Live Metrics
  // ==========================================
  console.log('\n📌 Test Group 5: Daily Attendance & Turnout Tracking');

  const todayStr = new Date().toISOString().split('T')[0];

  // 5.1 Load attendance sheet for section
  const attSheet = await request(`/attendance?date=${todayStr}&classId=${testClassId}`, {}, teacherToken);
  assert(attSheet.ok && Array.isArray(attSheet.data?.records), 
    'Attendance sheet loaded for classroom section');

  // 5.2 Mark attendance for enrolled child
  const markRes = await request('/attendance/mark', {
    method: 'POST',
    body: JSON.stringify({
      date: todayStr,
      classId: testClassId,
      records: [{
        childId: testChildId,
        childName: 'Oliver Bennett',
        status: 'Present',
        checkInTime: '08:45 AM',
        remarks: 'Eager and cheerful today'
      }]
    })
  }, teacherToken);
  assert(markRes.ok && markRes.data?.presentCount >= 1, 
    'Turnout logged by teacher; live presentCount updated');

  // ==========================================
  // 6. Tuition Invoicing & Partial/Full Payments
  // ==========================================
  console.log('\n📌 Test Group 6: Tuition Invoices & Payment Calculations');

  // 6.1 Generate Tuition Invoice
  const invoicePayload = {
    childId: testChildId,
    title: 'Mid-Autumn Term Tuition & Materials',
    monthYear: 'November 2026',
    dueDate: '2026-11-20',
    subtotal: 1200,
    discount: 100,
    lineItems: [
      { description: 'Early Childhood Curriculum', amount: 1000 },
      { description: 'Art Supplies & Sensory Toys', amount: 200 }
    ]
  };
  const createInvRes = await request('/fees/invoices', {
    method: 'POST',
    body: JSON.stringify(invoicePayload)
  }, adminToken);
  assert(createInvRes.status === 201 && createInvRes.data?.totalAmount === 1100, 
    `Invoice generated with totalAmount: $1,100 ($1,200 subtotal - $100 discount)`);
  testInvoiceId = createInvRes.data?._id;

  // 6.2 Record Partial Payment ($400)
  const partPayRes = await request('/fees/payments', {
    method: 'POST',
    body: JSON.stringify({
      invoiceId: testInvoiceId,
      amount: 400,
      paymentMethod: 'UPI',
      transactionRef: 'UPI-PART-4001',
      notes: 'Initial parent installment'
    })
  }, adminToken);
  assert(partPayRes.ok && partPayRes.data?.invoice?.paidAmount === 400 && partPayRes.data?.invoice?.balanceAmount === 700 && partPayRes.data?.invoice?.status === 'Partial', 
    'Partial payment correctly recalculated: paid=$400, balance=$700, status=Partial');

  // 6.3 Record Full Remainder Payment ($700)
  const fullPayRes = await request('/fees/payments', {
    method: 'POST',
    body: JSON.stringify({
      invoiceId: testInvoiceId,
      amount: 700,
      paymentMethod: 'Card',
      transactionRef: 'CARD-FINAL-7002',
      notes: 'Term settlement completed'
    })
  }, adminToken);
  assert(fullPayRes.ok && fullPayRes.data?.invoice?.paidAmount === 1100 && fullPayRes.data?.invoice?.balanceAmount === 0 && fullPayRes.data?.invoice?.status === 'Paid', 
    'Final payment correctly recalculated: paid=$1100, balance=$0, status=Paid');

  // 6.4 Verify receipt generation
  assert(fullPayRes.data?.receipt?.receiptNo && fullPayRes.data?.receipt?.amount === 700, 
    `Official receipt generated (${fullPayRes.data?.receipt?.receiptNo})`);

  // ==========================================
  // 7. Parent Portal Data Integrity
  // ==========================================
  console.log('\n📌 Test Group 7: Parent Portal Access & Communications');

  // 7.1 Parent fetching children roster
  const parentKids = await request('/children', {}, parentToken);
  assert(parentKids.ok && Array.isArray(parentKids.data), 
    'Parent successfully accessed enrolled child portfolio');

  // 7.2 Parent submitting leave request
  const leaveRes = await request('/communication/leaves', {
    method: 'POST',
    body: JSON.stringify({
      childId: testChildId,
      startDate: '2026-11-02',
      endDate: '2026-11-04',
      reason: 'Family wedding out of state'
    })
  }, parentToken);
  assert(leaveRes.status === 201 && leaveRes.data?.status === 'Pending', 
    'Parent submitted absence request with status=Pending');

  // Teacher approves leave
  const approveLeave = await request(`/communication/leaves/${leaveRes.data?._id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'Approved', adminRemarks: 'Have a wonderful trip!' })
  }, teacherToken);
  assert(approveLeave.ok && approveLeave.data?.status === 'Approved', 
    'Educator reviewed and approved absence request');

  // Clean up leave request
  await request(`/communication/leaves/${leaveRes.data?._id}`, { method: 'DELETE' }, adminToken);

  // ==========================================
  // 8. Operational Compliance & Audit Reports
  // ==========================================
  console.log('\n📌 Test Group 8: Compliance & Regulatory Reports');

  const attReport = await request('/reports?type=attendance', {}, adminToken);
  assert(attReport.ok && Array.isArray(attReport.data?.records), 
    'Attendance regulatory compliance report generated dynamically');

  const feeReport = await request('/reports?type=fees', {}, adminToken);
  assert(feeReport.ok && Array.isArray(feeReport.data?.records), 
    'Fee collection ledger report generated dynamically');

  const enrollReport = await request('/reports?type=enrollment', {}, adminToken);
  assert(enrollReport.ok && Array.isArray(enrollReport.data?.records), 
    'Enrollment ratios report generated dynamically');

  // ==========================================
  // 9. Integrity Safeguards & Deletion Validation
  // ==========================================
  console.log('\n📌 Test Group 9: Integrity Safeguards & Edge Cases');

  // 9.1 Deleting classroom with active enrolled students should be rejected
  const deleteActiveCls = await request(`/classes/${testClassId}`, {
    method: 'DELETE'
  }, adminToken);
  assert(deleteActiveCls.status === 400 && deleteActiveCls.data?.message?.includes('enrolled students'), 
    'Deletion of classroom with active students blocked with safety validation error');

  // 9.2 Clean up test child & test invoice
  const deleteChildPerm = await request(`/children/${testChildId}/permanent`, {
    method: 'DELETE'
  }, adminToken);
  assert(deleteChildPerm.ok, 
    'Permanently deleted test child record Oliver Bennett');

  const deleteInvRes = await request(`/fees/invoices/${testInvoiceId}`, {
    method: 'DELETE'
  }, adminToken);
  assert(deleteInvRes.ok, 
    'Cleaned up test invoice');

  // ==========================================
  // Summary
  // ==========================================
  console.log('\n==========================================');
  console.log(`🏁 Total E2E Tests: ${passedCount + failedCount}`);
  console.log(`✅ Passed: ${passedCount}`);
  console.log(`❌ Failed: ${failedCount}`);
  console.log('==========================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
