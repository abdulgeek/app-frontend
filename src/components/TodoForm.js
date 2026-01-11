import React, { useState } from 'react';
import axios from 'axios';
import './TodoForm.css';

const TodoForm = ({ onTodoAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/todos`, {
        title: title.trim(),
        description: description.trim(),
      });

      if (response.data && response.data.success) {
        setTitle('');
        setDescription('');
        setError('');
        
        if (onTodoAdded) {
          onTodoAdded(response.data.data);
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to add todo. Please try again.';
      setError(errorMessage);
      console.error('Error adding todo:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (error) setError('');
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  return (
    <div className="todo-form-container">
      <form onSubmit={handleSubmit} className="todo-form">
        <h2 className="form-title">Add New Todo</h2>
        
        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Title <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            className="form-input"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter todo title"
            disabled={isLoading}
            maxLength={100}
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            className="form-textarea"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Enter todo description (optional)"
            disabled={isLoading}
            rows={4}
            maxLength={500}
          />
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={isLoading || !title.trim()}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Adding...
            </>
          ) : (
            'Add Todo'
          )}
        </button>
      </form>
    </div>
  );
};

export default TodoForm;