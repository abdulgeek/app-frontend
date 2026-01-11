import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TodoList.css';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
      setError('Failed to fetch todos. Please try again later.');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    
    if (!newTodo.trim()) {
      setError('Please enter a todo item.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await axios.post(`${API_URL}/todos`, {
        title: newTodo.trim(),
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
    try {
      setError('');
      const response = await axios.put(`${API_URL}/todos/${id}`, {
        completed: !completed
      });
      setTodos(todos.map(todo => 
        todo._id === id ? response.data : todo
      ));
    } catch (err) {
      setError('Failed to update todo. Please try again.');
      console.error('Error updating todo:', err);
    }
  };

  const startEditing = (id, title) => {
    setEditingId(id);
    setEditingText(title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingText('');
  };

  const saveEdit = async (id) => {
    if (!editingText.trim()) {
      setError('Todo title cannot be empty.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await axios.put(`${API_URL}/todos/${id}`, {
        title: editingText.trim()
      });
      setTodos(todos.map(todo => 
        todo._id === id ? response.data : todo
      ));
      setEditingId(null);
      setEditingText('');
    } catch (err) {
      setError('Failed to update todo. Please try again.');
      console.error('Error updating todo:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      saveEdit(id);
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
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

  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    
    try {
      setLoading(true);
      setError('');
      await Promise.all(
        completedTodos.map(todo => axios.delete(`${API_URL}/todos/${todo._id}`))
      );
      setTodos(todos.filter(todo => !todo.completed));
    } catch (err) {
      setError('Failed to clear completed todos. Please try again.');
      console.error('Error clearing completed todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTodos = getFilteredTodos();
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="todo-list-container">
      <div className="todo-list-wrapper">
        <h1 className="todo-list-title">My Todo List</h1>
        
        {error && (
          <div className="error-message">
            <span>{error}</span>
            <button 
              className="error-close"
              onClick={() => setError('')}
              aria-label="Close error message"
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={addTodo} className="todo-input-form">
          <input
            type="text"
            className="todo-input"
            placeholder="What needs to be done?"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            disabled={loading}
            maxLength={200}
          />
          <button 
            type="submit" 
            className="add-button"
            disabled={loading || !newTodo.trim()}
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </form>

        {todos.length > 0 && (
          <div className="filter-buttons">
            <button
              className={`filter-button ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({todos.length})
            </button>
            <button
              className={`filter-button ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active ({activeTodosCount})
            </button>
            <button
              className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed ({completedTodosCount})
            </button>
          </div>
        )}

        {loading && todos.length === 0 ? (
          <div className="loading-message">Loading todos...</div>
        ) : filteredTodos.length === 0 ? (
          <div className="empty-message">
            {todos.length === 0 
              ? 'No todos yet. Add one above!' 
              : `No ${filter} todos.`}
          </div>
        ) : (
          <ul className="todo-list">
            {filteredTodos.map((todo) => (
              <li key={todo._id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <div className="todo-content">
                  <input
                    type="checkbox"
                    className="todo-checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo._id, todo.completed)}
                    disabled={loading}
                    aria-label={`Mark ${todo.title} as ${todo.completed ? 'incomplete' : 'complete'}`}
                  />
                  
                  {editingId === todo._id ? (
                    <input
                      type="text"
                      className="todo-edit-input"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e, todo._id)}
                      onBlur={() => saveEdit(todo._id)}
                      autoFocus
                      maxLength={200}
                    />
                  ) : (
                    <span 
                      className="todo-text"
                      onDoubleClick={() => startEditing(todo._id, todo.title)}
                      title="Double click to edit"
                    >
                      {todo.title}
                    </span>
                  )}
                </div>

                <div className="todo-actions">
                  {editingId === todo._id ? (
                    <>
                      <button
                        className="action-button save-button"
                        onClick={() => saveEdit(todo._id)}
                        disabled={loading}
                        aria-label="Save changes"
                      >
                        Save
                      </button>
                      <button
                        className="action-button cancel-button"
                        onClick={cancelEditing}
                        disabled={loading}
                        aria-label="Cancel editing"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="action-button edit-button"
                        onClick={() => startEditing(todo._id, todo.title)}
                        disabled={loading}
                        aria-label="Edit todo"
                      >
                        Edit
                      </button>
                      <button
                        className="action-button delete-button"
                        onClick={() => deleteTodo(todo._id)}
                        disabled={loading}
                        aria-label="Delete todo"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {todos.length > 0 && (
          <div className="todo-footer">
            <span className="todo-count">
              {activeTodosCount} {activeTodosCount === 1 ? 'item' : 'items'} left
            </span>
            {completedTodosCount > 0 && (
              <button
                className="clear-completed-button"
                onClick={clearCompleted}
                disabled={loading}
              >
                Clear Completed
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList;