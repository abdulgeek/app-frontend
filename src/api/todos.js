import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.message);
      return Promise.reject({ message: 'Network error. Please check your connection.' });
    } else {
      console.error('Error:', error.message);
      return Promise.reject({ message: 'An unexpected error occurred.' });
    }
  }
);

export const getAllTodos = async () => {
  try {
    const response = await api.get('/todos');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTodoById = async (id) => {
  try {
    if (!id) {
      throw new Error('Todo ID is required');
    }
    const response = await api.get(`/todos/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createTodo = async (todoData) => {
  try {
    if (!todoData || !todoData.title || todoData.title.trim() === '') {
      throw new Error('Todo title is required');
    }
    const response = await api.post('/todos', todoData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTodo = async (id, todoData) => {
  try {
    if (!id) {
      throw new Error('Todo ID is required');
    }
    if (!todoData) {
      throw new Error('Todo data is required');
    }
    const response = await api.put(`/todos/${id}`, todoData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const toggleTodoComplete = async (id, completed) => {
  try {
    if (!id) {
      throw new Error('Todo ID is required');
    }
    const response = await api.patch(`/todos/${id}`, { completed });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTodo = async (id) => {
  try {
    if (!id) {
      throw new Error('Todo ID is required');
    }
    const response = await api.delete(`/todos/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAllTodos = async () => {
  try {
    const response = await api.delete('/todos');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCompletedTodos = async () => {
  try {
    const response = await api.delete('/todos/completed');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  toggleTodoComplete,
  deleteTodo,
  deleteAllTodos,
  deleteCompletedTodos,
};