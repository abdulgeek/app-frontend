const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const config = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

export const apiConfig = {
  todos: {
    getAll: () => getApiUrl('/todos'),
    getById: (id) => getApiUrl(`/todos/${id}`),
    create: () => getApiUrl('/todos'),
    update: (id) => getApiUrl(`/todos/${id}`),
    delete: (id) => getApiUrl(`/todos/${id}`),
  },
};

export default config;