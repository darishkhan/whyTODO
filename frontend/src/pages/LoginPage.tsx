import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [user, setUser] = useState<User>({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prevState => ({ ...prevState, [name]: value }));
  };

  const loginReguest = async ()=>{
    try {
      const res = await axios.post('http://localhost:5000/api/v1/users/login', user, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });

      if(res.status === 200)
      {
        localStorage.setItem('token', res.data.token);
        navigate('/home');
      }
      else
      {
        console.log("Invalid credentials");
      }
      
    } catch (error) {
      console.log("Error! Login failed!");
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', user);
    
    loginReguest();
  };

  return (
    <div className="flex bg-gray-300 justify-center items-center h-screen">
      <form className="grid w-4/12 bg-white p-8 rounded shadow-md" onSubmit={handleSubmit}>
      <h1 className='text-center text-2xl font-bold mb-5'>Login</h1>
        <input
          type="text"
          placeholder="Email"
          name="email"
          value={user.email}
          onChange={handleChange}
          className="mb-4 p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={user.password}
          onChange={handleChange}
          className="mb-4 p-2 border border-gray-300 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
