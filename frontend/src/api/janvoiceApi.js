// Default to 8002 because this project runs multiple local servers during dev.
// You can override with VITE_API_BASE_URL.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8002';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    let detail = 'Request failed';
    try {
      const data = await res.json();
      detail = data?.detail || JSON.stringify(data);
    } catch {
      // ignore
    }
    throw new Error(detail);
  }

  return res.json();
}

export function mapBackendComplaint(c) {
  return {
    backendId: c.id,
    id: c.public_id,
    title: c.title,
    description: c.description,
    department: c.department,
    category: c.category,
    location: c.location,
    status: c.status,
    priority: c.urgency,
    date: (c.created_at || '').split('T')[0] || new Date().toISOString().split('T')[0],
    attachments: c.attachments || { photos: [], videos: [] },
    language: c.language,
    urgency: c.urgency,
  };
}

export async function submitComplaint(payload) {
  const data = await request('/submit-complaint', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return mapBackendComplaint(data);
}

export async function getComplaints() {
  const data = await request('/complaints');
  return (data.items || []).map(mapBackendComplaint);
}

export async function getComplaint(id) {
  const data = await request(`/complaints/${id}`);
  return mapBackendComplaint(data);
}

export async function aiClassify(description, language = 'English') {
  return request('/ai/classify', {
    method: 'POST',
    body: JSON.stringify({ description, language }),
  });
}

export async function aiChat(messages, language = 'English') {
  return request('/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ messages, language }),
  });
}

export async function getPlaceSuggestions(query) {
  const data = await request(`/geo/places?q=${encodeURIComponent(query)}`, { method: 'GET' });
  return data.items || [];
}

export async function reverseGeocode(lat, lon) {
  return request(`/geo/reverse?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`, { method: 'GET' });
}

export async function analyzeImage(imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);

  const res = await fetch(`${API_BASE_URL}/ai/analyze-image`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    let detail = 'Image analysis failed';
    try {
      const data = await res.json();
      detail = data?.detail || JSON.stringify(data);
    } catch {
      // ignore
    }
    throw new Error(detail);
  }

  return res.json();
}

