const API_BASE_URL = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const json = await response.json();
    return json.data || json;
  } catch (error) {
    console.warn(`[Client API] Endpoint ${endpoint} unreachable:`, error.message);
    throw error;
  }
}

export const clientApi = {
  getServices: () => request('/services'),
  getPortfolio: () => request('/portfolio'),
  getJobs: () => request('/jobs'),
  submitInquiry: (data) => request('/inquiries', { method: 'POST', body: JSON.stringify(data) }),
  submitApplication: (data) => request('/applications', { method: 'POST', body: JSON.stringify(data) })
};
