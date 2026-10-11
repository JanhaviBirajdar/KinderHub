const API_BASE = '/api';

// Helper for HTTP requests with JWT token
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('kinderhub_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
};

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getMe: () => request('/auth/me'),
  changePassword: (passwords) => request('/auth/change-password', { method: 'POST', body: JSON.stringify(passwords) }),
  forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (payload) => request('/auth/reset-password', { method: 'POST', body: JSON.stringify(payload) }),
  getDemoUsers: () => request('/auth/demo-users'),

  // Dashboard & Metrics
  getDashboardSummary: () => request('/dashboard/summary'),

  // Children
  getChildren: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/children${q ? `?${q}` : ''}`);
  },
  getChildById: (id) => request(`/children/${id}`),
  createChild: (data) => request('/children', { method: 'POST', body: JSON.stringify(data) }),
  updateChild: (id, data) => request(`/children/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  archiveChild: (id) => request(`/children/${id}`, { method: 'DELETE' }),
  deleteChildPermanent: (id) => request(`/children/${id}/permanent`, { method: 'DELETE' }),

  // Admissions
  getAdmissions: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/admissions${q ? `?${q}` : ''}`);
  },
  submitAdmission: (data) => request('/admissions', { method: 'POST', body: JSON.stringify(data) }),
  updateAdmissionStatus: (id, data) => request(`/admissions/${id}/status`, { method: 'PATCH', body: JSON.stringify(data) }),
  convertAdmissionToChild: (id) => request(`/admissions/${id}/convert`, { method: 'POST' }),
  deleteAdmission: (id) => request(`/admissions/${id}`, { method: 'DELETE' }),

  // Classes
  getClasses: () => request('/classes'),
  getClassById: (id) => request(`/classes/${id}`),
  createClass: (data) => request('/classes', { method: 'POST', body: JSON.stringify(data) }),
  updateClass: (id, data) => request(`/classes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteClass: (id) => request(`/classes/${id}`, { method: 'DELETE' }),

  // Teachers & Staff
  getTeachers: () => request('/teachers'),
  createTeacher: (data) => request('/teachers', { method: 'POST', body: JSON.stringify(data) }),
  updateTeacher: (id, data) => request(`/teachers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTeacher: (id) => request(`/teachers/${id}`, { method: 'DELETE' }),

  // Attendance
  getAttendance: (date, classId) => request(`/attendance?date=${encodeURIComponent(date)}&classId=${encodeURIComponent(classId)}`),
  saveAttendance: (data) => request('/attendance', { method: 'POST', body: JSON.stringify(data) }),
  getAttendanceStats: () => request('/attendance/stats'),

  // Fees & Invoicing
  getInvoices: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/fees/invoices${q ? `?${q}` : ''}`);
  },
  getInvoiceById: (id) => request(`/fees/invoices/${id}`),
  createInvoice: (data) => request('/fees/invoices', { method: 'POST', body: JSON.stringify(data) }),
  deleteInvoice: (id) => request(`/fees/invoices/${id}`, { method: 'DELETE' }),
  recordPayment: (data) => request('/fees/payments', { method: 'POST', body: JSON.stringify(data) }),
  getFeeStructures: () => request('/fees/structures'),
  getFeeSummaries: () => request('/fees/summaries'),

  // Activities & Progress
  getActivities: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/activities${q ? `?${q}` : ''}`);
  },
  createActivity: (data) => request('/activities', { method: 'POST', body: JSON.stringify(data) }),
  deleteActivity: (id) => request(`/activities/${id}`, { method: 'DELETE' }),
  getProgressRecords: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/activities/progress${q ? `?${q}` : ''}`);
  },
  createProgressRecord: (data) => request('/activities/progress', { method: 'POST', body: JSON.stringify(data) }),
  deleteProgressRecord: (id) => request(`/activities/progress/${id}`, { method: 'DELETE' }),

  // Schedule & Events
  getTimetable: (classId) => request(`/schedule/timetable${classId ? `?classId=${classId}` : ''}`),
  updateTimetable: (data) => request('/schedule/timetable', { method: 'PUT', body: JSON.stringify(data) }),
  getEvents: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/schedule/events${q ? `?${q}` : ''}`);
  },
  createEvent: (data) => request('/schedule/events', { method: 'POST', body: JSON.stringify(data) }),
  updateEvent: (id, data) => request(`/schedule/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEvent: (id) => request(`/schedule/events/${id}`, { method: 'DELETE' }),

  // Communication
  getAnnouncements: (audience) => request(`/communication/announcements${audience ? `?audience=${audience}` : ''}`),
  createAnnouncement: (data) => request('/communication/announcements', { method: 'POST', body: JSON.stringify(data) }),
  deleteAnnouncement: (id) => request(`/communication/announcements/${id}`, { method: 'DELETE' }),
  getMessages: () => request('/communication/messages'),
  sendMessage: (data) => request('/communication/messages', { method: 'POST', body: JSON.stringify(data) }),
  getLeaves: () => request('/communication/leaves'),
  createLeave: (data) => request('/communication/leaves', { method: 'POST', body: JSON.stringify(data) }),
  updateLeaveStatus: (id, data) => request(`/communication/leaves/${id}/status`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteLeave: (id) => request(`/communication/leaves/${id}`, { method: 'DELETE' }),

  // Reports
  getReports: (type) => request(`/reports?type=${type}`)
};
