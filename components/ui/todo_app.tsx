"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Plus, Edit, Save, Trash, CheckSquare, Square } from "lucide-react";

// Define the Todo type
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');
  const [filter, setFilter] = useState<string>('all');
  const [editingTodo, setEditingTodo] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      const newTodoItem: Todo = {
        id: Date.now(),
        text: newTodo,
        completed: false,
      };
      setTodos([...todos, newTodoItem]);
      setNewTodo('');
    }
  };

  const toggleTodoCompletion = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEditing = (id: number, text: string) => {
    setEditingTodo(id);
    setEditingText(text);
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditingText(e.target.value);
  };

  const saveEdit = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, text: editingText } : todo
      )
    );
    setEditingTodo(null);
    setEditingText('');
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'active') return !todo.completed;
    return true;
  });

return (
  <div className='flex flex-col items-center justify-center h-screen bg-black text-white'>
    <div className="max-w-lg mx-auto p-4 bg-gray-800 rounded">
      <h1 className="text-3xl font-bold mb-4">Todo App</h1>
      <form onSubmit={handleSubmit} className="mb-4 flex">
        <input
          type="text"
          value={newTodo}
          onChange={handleInputChange}
          placeholder="Enter a new task"
          className="border border-gray-600 p-2 flex-grow mr-2 rounded bg-gray-700 text-white"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center"
        >
          <Plus className="mr-1" /> Add Todo
        </button>
      </form>
      <div className="mb-4 flex justify-between">
        <button
          onClick={() => setFilter('all')}
          className={`p-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`p-2 rounded ${filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'}`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`p-2 rounded ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'}`}
        >
          Completed
        </button>
      </div>
      <ul className="list-none p-0">
        {filteredTodos.map(todo => (
          <li
            key={todo.id}
            className={`flex items-center mb-2 p-2 rounded ${
              todo.completed ? 'bg-gray-600 line-through' : 'bg-gray-700'
            }`}
          >
            <button
              onClick={() => toggleTodoCompletion(todo.id)}
              className="mr-2 text-white"
            >
              {todo.completed ? <CheckSquare /> : <Square />}
            </button>
            {editingTodo === todo.id ? (
              <input
                type="text"
                value={editingText}
                onChange={handleEditChange}
                className="border border-gray-600 p-2 flex-grow mr-2 rounded bg-gray-700 text-white"
              />
            ) : (
              <span className="flex-grow">{todo.text}</span>
            )}
            {editingTodo === todo.id ? (
              <button
                onClick={() => saveEdit(todo.id)}
                className="bg-green-500 text-white p-1 rounded hover:bg-green-600 mr-2 flex items-center"
              >
                <Save className="mr-1" /> Save
              </button>
            ) : (
              <button
                onClick={() => startEditing(todo.id, todo.text)}
                className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600 mr-2 flex items-center"
              >
                <Edit className="mr-1" /> Edit
              </button>
            )}
            <button
              onClick={() => deleteTodo(todo.id)}
              className="bg-red-500 text-white p-1 rounded hover:bg-red-600 flex items-center"
            >
              <Trash className="mr-1" /> Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
            }
export default TodoApp;