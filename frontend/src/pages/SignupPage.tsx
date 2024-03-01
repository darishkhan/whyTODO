import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const SignupPage: React.FC = () => {
  const [user, setUser] = useState<User>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prevState => ({ ...prevState, [name]: value }));
  };

  const signupReguest = async ()=>{
    try {
      const res = await axios.post('http://localhost:5000/api/v1/user/signup', user);

      if(res.status === 200)
      {
        localStorage.setItem('token', "Bearer "+res.data.token);
        navigate('/home');
      }
      else
      {
        console.log("Invalid credentials");
      }
      
    } catch (error) {
      console.log("Error! Signup failed!");
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signup:', user);
    signupReguest();
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-300">
      <form className="w-4/12 bg-white p-8 rounded shadow-md" onSubmit={handleSubmit}>
      <h1 className='text-center text-2xl font-bold mb-5'>Signup</h1>

        <input
          type="email"
          placeholder="Email"
          name="email"
          value={user.email}
          onChange={handleChange}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={user.password}
          onChange={handleChange}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="text"
          placeholder="First Name"
          name="firstName"
          value={user.firstName}
          onChange={handleChange}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="text"
          placeholder="Last Name"
          name="lastName"
          value={user.lastName}
          onChange={handleChange}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
