const API_BASE_URL = 'http://localhost:3000/api';

async function request(endpoint, options = {}) {
  try {
    const token = localStorage.getItem('weprovision_admin_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.message || `HTTP Error: ${response.status}`);
    }
    return json;
  } catch (error) {
    console.warn(`[API] Request error at ${endpoint}:`, error.message);
    throw error;
  }
}

export const api = {
  // Auth
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  getMe: () => request('/auth/me'),

  // System Settings & Maintenance Mode
  getSettings: () => request('/settings'),
  toggleMaintenance: (maintenanceMode) => request('/settings/maintenance', { method: 'PUT', body: JSON.stringify({ maintenanceMode }) }),

  // Services
  getServices: () => request('/services'),
  toggleServiceStatus: (id) => request(`/services/${id}/toggle`, { method: 'PUT' }),

  // Portfolio
  getPortfolio: () => request('/portfolio'),
  createPortfolio: (data) => request('/portfolio', { method: 'POST', body: JSON.stringify(data) }),
  updatePortfolio: (id, data) => request(`/portfolio/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePortfolio: (id) => request(`/portfolio/${id}`, { method: 'DELETE' }),

  // Inquiries
  getInquiries: () => request('/inquiries'),
  submitInquiry: (data) => request('/inquiries', { method: 'POST', body: JSON.stringify(data) }),
  updateInquiryStatus: (id, status) => request(`/inquiries/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  replyInquiry: (id, data) => request(`/inquiries/${id}/reply`, { method: 'POST', body: JSON.stringify(data) }),
  deleteInquiry: (id) => request(`/inquiries/${id}`, { method: 'DELETE' }),

  // Careers & Applications
  getJobs: () => request('/jobs'),
  createJob: (data) => request('/jobs', { method: 'POST', body: JSON.stringify(data) }),
  deleteJob: (id) => request(`/jobs/${id}`, { method: 'DELETE' }),
  getApplications: () => request('/applications'),
  submitApplication: (data) => request('/applications', { method: 'POST', body: JSON.stringify(data) }),
  updateApplicationStatus: (id, status) => request(`/applications/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) })
};
