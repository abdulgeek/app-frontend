import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${API_URL}/todos`);
      setTodos(response.data);
    } catch (err) {
      setError('Failed to fetch todos. Please check your connection.');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) {
      setError('Todo text cannot be empty');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await axios.post(`${API_URL}/todos`, {
        text: newTodo.trim(),
        completed: false
      });
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (err) {
      setError('Failed to add todo. Please try again.');
      console.error('Error adding todo:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateTodo = async (id, updates) => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.put(`${API_URL}/todos/${id}`, updates);
      setTodos(todos.map(todo => todo._id === id ? response.data : todo));
      setEditingId(null);
      setEditingText('');
    } catch (err) {
      setError('Failed to update todo. Please try again.');
      console.error('Error updating todo:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    try {
      setLoading(true);
      setError('');
      await axios.delete(`${API_URL}/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (err) {
      setError('Failed to delete todo. Please try again.');
      console.error('Error deleting todo:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (id, completed) => {
    await updateTodo(id, { completed: !completed });
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEdit = async (id) => {
    if (!editingText.trim()) {
      setError('Todo text cannot be empty');
      return;
    }
    await updateTodo(id, { text: editingText.trim() });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const getFilteredTodos = () => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const clearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    completedTodos.forEach(todo => deleteTodo(todo._id));
  };

  const filteredTodos = getFilteredTodos();
  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="app">
      <div className="container">
        <header className="app-header">
          <h1>Todo List</h1>
          <p className="subtitle">Manage your tasks efficiently</p>
        </header>

        {error && (
          <div className="error-message">
            <span>{error}</span>
            <button onClick={() => setError('')} className="close-btn">×</button>
          </div>
        )}

        <form onSubmit={addTodo} className="add-todo-form">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
            className="todo-input"
            disabled={loading}
          />
          <button type="submit" className="add-btn" disabled={loading}>
            {loading ? 'Adding...' : 'Add'}
          </button>
        </form>

        <div className="filter-buttons">
          <button
            className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('all')}
          >
            All ({todos.length})
          </button>
          <button
            className={filter === 'active' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('active')}
          >
            Active ({activeCount})
          </button>
          <button
            className={filter === 'completed' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('completed')}
          >
            Completed ({completedCount})
          </button>
        </div>

        {loading && todos.length === 0 ? (
          <div className="loading">Loading todos...</div>
        ) : filteredTodos.length === 0 ? (
          <div className="empty-state">
            <p>{filter === 'all' ? 'No todos yet. Add one above!' : `No ${filter} todos.`}</p>
          </div>
        ) : (
          <ul className="todo-list">
            {filteredTodos.map((todo) => (
              <li key={todo._id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                {editingId === todo._id ? (
                  <div className="edit-mode">
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="edit-input"
                      autoFocus
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          saveEdit(todo._id);
                        } else if (e.key === 'Escape') {
                          cancelEdit();
                        }
                      }}
                    />
                    <div className="edit-actions">
                      <button onClick={() => saveEdit(todo._id)} className="save-btn">
                        Save
                      </button>
                      <button onClick={cancelEdit} className="cancel-btn">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="todo-content">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleComplete(todo._id, todo.completed)}
                        className="checkbox"
                      />
                      <span className="todo-text">{todo.text}</span>
                    </div>
                    <div className="todo-actions">
                      <button
                        onClick={() => startEditing(todo._id, todo.text)}
                        className="edit-btn"
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTodo(todo._id)}
                        className="delete-btn"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}

        {todos.length > 0 && (
          <div className="footer">
            <span className="todo-count">
              {activeCount} {activeCount === 1 ? 'item' : 'items'} left
            </span>
            {completedCount > 0 && (
              <button onClick={clearCompleted} className="clear-completed-btn">
                Clear completed
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;