const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        error: data.detail || data.message || 'Something went wrong.',
        data: null,
      };
    }

    return {
      success: true,
      status: response.status,
      error: null,
      data,
    };
  } catch (error) {
    return {
      success: false,
      status: 0,
      error: 'Unable to connect to the server. Please check your connection and try again.',
      data: null,
    };
  }
}

export async function getHealth() {
  return request('/api/health');
}

export async function getStats() {
  return request('/api/stats');
}

export async function submitReport(reportData) {
  return request('/api/reports', {
    method: 'POST',
    body: JSON.stringify(reportData),
  });
}

export async function getReports(params = {}) {
  const query = new URLSearchParams();

  if (params.page) query.set('page', params.page);
  if (params.limit) query.set('limit', params.limit);
  if (params.search) query.set('search', params.search);
  if (params.category) query.set('category', params.category);
  if (params.status) query.set('status', params.status);

  const queryString = query.toString();
  const endpoint = `/api/reports${queryString ? `?${queryString}` : ''}`;

  return request(endpoint);
}

export async function getReport(reportCode) {
  return request(`/api/reports/${reportCode}`);
}
