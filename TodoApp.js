// TodoApp.js

import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './TodoApp.css';

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error retrieving data from localStorage:', error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }, [key, value]);

  return [value, setValue];
}

function TodoApp() {
  const initialTodos = [
    { id: 1, title: 'Buy groceries', description: 'Buy fruits and vegetables', completed: false },
    { id: 2, title: 'Finish homework', description: 'Complete math assignment', completed: true },
    { id: 3, title: 'Walk the dog', description: 'Take the dog for a walk in the park', completed: false }
  ];

  const [todos, setTodos] = useLocalStorage('todos', initialTodos);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [selectedTodos, setSelectedTodos] = useState([]);

  const handleToggleTodoCompletion = (todoId) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteSelectedTodos = () => {
    setTodos((prevTodos) => prevTodos.filter((todo) => !selectedTodos.includes(todo.id)));
    setSelectedTodos([]);
    toast.success('Selected todos have been deleted', { autoClose: 2000 });
  };

  const handleSelectTodo = (todoId) => {
    if (selectedTodos.includes(todoId)) {
      setSelectedTodos((prevSelectedTodos) => prevSelectedTodos.filter((id) => id !== todoId));
    } else {
      setSelectedTodos((prevSelectedTodos) => [...prevSelectedTodos, todoId]);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (newTodoTitle.trim() === '') {
      toast.error('Please enter a todo title', { autoClose: 2000 });
      return;
    }
    if (newTodoDescription.trim() === '') {
      toast.error('Please enter a todo description', { autoClose: 2000 });
      return;
    }

    const newTodo = {
      id: Date.now(),
      title: newTodoTitle,
      description: newTodoDescription,
      completed: false
    };
    setTodos((prevTodos) => [...prevTodos, newTodo]);
    setNewTodoTitle('');
    setNewTodoDescription('');
  };

  return (
    <div className="container">
      <h1 className="title">Todo App</h1>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="todoTitle"
          placeholder="Enter a new todo title"
          value={newTodoTitle}
          onChange={(event) => setNewTodoTitle(event.target.value)}
        />
        <input
          type="text"
          name="todoDescription"
          placeholder="Enter a new todo description"
          value={newTodoDescription}
          onChange={(event) => setNewTodoDescription(event.target.value)}
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={todo.completed ? 'completed' : ''}
            onClick={() => handleToggleTodoCompletion(todo.id)}
          >
            <input
              type="checkbox"
              checked={selectedTodos.includes(todo.id)}
              onChange={() => handleSelectTodo(todo.id)}
            />
            <div>
              <h3>{todo.title}</h3>
              <p>{todo.description}</p>
              <span>{todo.completed ? 'Completed' : 'Not Completed'}</span>
            </div>
          </li>
        ))}
      </ul>
      <button
        className="delete-btn"
        onClick={handleDeleteSelectedTodos}
        disabled={selectedTodos.length === 0}
      >
        Delete Selected
      </button>
      <ToastContainer />
    </div>
  );
}

export default TodoApp;
