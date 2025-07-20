import { useEffect, useState } from 'react';
import './App.css';
import { createTodo, deleteTodo, getTodos, updateTodo } from './firebase';

import type { Todo } from './interfaces/todo';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  const getAllTodos = async () => {
    const todos = await getTodos();
    setTodos(todos);
  };

  const addTodo = async () => {
    if (newTodo.trim() === '') return;

    const todo = {
      text: newTodo,
      completed: false
    };

    await createTodo(todo);
    await getAllTodos();
    setNewTodo('');
  };


  const toggleTodo = async (id: string) => {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
      await updateTodo({ ...todo, completed: !todo.completed });
    }
    await getAllTodos();
  };

  const removeTodo = async (id: string) => {
    await deleteTodo(id);
    await getAllTodos();
  };

  useEffect(() => {
    const fetchTodos = async () => {
      await getAllTodos();
    };
    fetchTodos();
  }, []); 


return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">Todo List</h1>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Añadir nueva tarea..."
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={addTodo}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Añadir
          </button>
        </div>

        <ul className="space-y-2">
          {todos.map(todo => (
            <li
              key={todo.id}
              className="flex items-center justify-between bg-white p-4 rounded shadow"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id ?? '')}
                  className="h-5 w-5"
                />
                <span className={`${todo.completed ? 'line-through text-gray-500' : ''}`}>
                  {todo.text}
                </span>
              </div>
              <button
                onClick={() => removeTodo(todo.id ?? '')}
                className="text-red-500 hover:text-red-700"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App