import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './TodoItem.css';

const TodoItem = ({ todo, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleToggleComplete = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      await onUpdate(todo._id, { completed: !todo.completed });
    } catch (err) {
      setError('Failed to update todo status');
      console.error('Error toggling todo:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(todo.text);
    setError('');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText(todo.text);
    setError('');
  };

  const handleSaveEdit = async () => {
    if (!editText.trim()) {
      setError('Todo text cannot be empty');
      return;
    }

    if (editText.trim() === todo.text) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onUpdate(todo._id, { text: editText.trim() });
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update todo');
      console.error('Error updating todo:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (isLoading) return;
    
    if (!window.confirm('Are you sure you want to delete this todo?')) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onDelete(todo._id);
    } catch (err) {
      setError('Failed to delete todo');
      console.error('Error deleting todo:', err);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleInputChange = (e) => {
    setEditText(e.target.value);
    if (error) setError('');
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} ${isLoading ? 'loading' : ''}`}>
      <div className="todo-item-content">
        <input
          type="checkbox"
          className="todo-checkbox"
          checked={todo.completed}
          onChange={handleToggleComplete}
          disabled={isLoading || isEditing}
          aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
        />

        {isEditing ? (
          <input
            type="text"
            className="todo-edit-input"
            value={editText}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            autoFocus
            maxLength={500}
            aria-label="Edit todo text"
          />
        ) : (
          <span className="todo-text" onClick={handleToggleComplete}>
            {todo.text}
          </span>
        )}
      </div>

      <div className="todo-item-actions">
        {isEditing ? (
          <>
            <button
              className="btn btn-save"
              onClick={handleSaveEdit}
              disabled={isLoading}
              aria-label="Save changes"
              title="Save (Enter)"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
              </svg>
            </button>
            <button
              className="btn btn-cancel"
              onClick={handleCancelEdit}
              disabled={isLoading}
              aria-label="Cancel editing"
              title="Cancel (Esc)"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-edit"
              onClick={handleEdit}
              disabled={isLoading}
              aria-label={`Edit "${todo.text}"`}
              title="Edit"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
              </svg>
            </button>
            <button
              className="btn btn-delete"
              onClick={handleDelete}
              disabled={isLoading}
              aria-label={`Delete "${todo.text}"`}
              title="Delete"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
              </svg>
            </button>
          </>
        )}
      </div>

      {error && (
        <div className="todo-item-error" role="alert">
          {error}
        </div>
      )}

      {todo.createdAt && (
        <div className="todo-item-date">
          {new Date(todo.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      )}
    </div>
  );
};

TodoItem.propTypes = {
  todo: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    createdAt: PropTypes.string
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default TodoItem;