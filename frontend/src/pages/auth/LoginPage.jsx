import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

const LoginPage = () => {
     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     const [error, setError] = useState('');
     const { login } = useAuth();
     const navigate = useNavigate();

     const handleSubmit = async (e) => {
          e.preventDefault();
          const success = await login(email, password);
          if (!success) setError('Invalid email or password please contact the admin if you are not able to login');
     };

     return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
               <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-6 text-center">Inventory System</h2>

                    {error && (
                         <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-center">
                              {error}
                         </div>
                    )}

                    <form onSubmit={handleSubmit}>
                         <div className="mb-4">
                              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                   Email
                              </label>
                              <input
                                   type="email"
                                   id="email"
                                   value={email}
                                   onChange={(e) => setEmail(e.target.value)}
                                   className="mt-1 p-2 w-full border rounded-md"
                                   required
                              />
                         </div>

                         <div className="mb-6">
                              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                   Password
                              </label>
                              <input
                                   type="password"
                                   id="password"
                                   value={password}
                                   onChange={(e) => setPassword(e.target.value)}
                                   className="mt-1 p-2 w-full border rounded-md"
                                   required
                              />
                         </div>

                         <button
                              type="submit"
                              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                         >
                              Sign In
                         </button>
                    </form>
               </div>
          </div>
     );
};

export default LoginPage;