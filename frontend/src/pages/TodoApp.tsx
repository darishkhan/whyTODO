import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Todo {
  id: number;
  text: string;
}

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');
  const navigate = useNavigate();

  const fetchTodos = async ()=>{
    try {
      const res = await axios.get('http://localhost:5000/api/v1/todo/alltodos');
      if(res.status!=200)
      {
        navigate('/login');
      }
      setTodos(res.data.todo);
      
    } catch (error:any) {
      console.log(error.response.data.message);
      navigate('/login');
    }
  };

  useEffect(()=>{
    fetchTodos();
  }, [])

  const handleAddTodo = () => {
    if (inputText.trim() !== '') {
      const newTodo: Todo = {
        id: Date.now(),
        text: inputText.trim(),
      };
      setTodos(prevTodos => [...prevTodos, newTodo]);
      setInputText('');
    }
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  return (
    <div className='bg-gray-300 min-h-screen mt-0 p-8'>
    <div className="container mx-auto  w-6/12">
      <div className="grid grid-cols-12 mb-4">
        <input
          type="text"
          placeholder="Enter a new todo"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          className="p-2 col-span-10 border border-gray-300 rounded"
          />
        <button onClick={handleAddTodo} className="bg-blue-500 col-span-2 text-white p-2 ml-2 rounded">
          Add Todo
        </button>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-4">Todo List</h2>
        <ul>
          {todos.map(todo => (
              <li key={todo.id} className="flex items-center justify-between p-2 border-b border-gray-300">
              <span>{todo.text}</span>
              <button onClick={() => handleDeleteTodo(todo.id)} className="text-red-500">
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
          </div>
  );
};

export default TodoApp;
