import React, { useState } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../redux/authSlice';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // let's setstate in store
  const dispatch = useDispatch();
  // const user = useSelector((state) => state.user);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Make an API request to your backend for login
      const response = await axios.post('http://localhost:8000/api/auth/login/', {
        email,
        password,
      });

      // Save token to local storage (or manage state)
      localStorage.setItem('user', JSON.stringify(response.data));
      dispatch(loginSuccess(response.data.token));
      toast.success("Login successful.");

      // Redirect to dashboard
      navigate('/Dashboard');
    } catch (error) {
      // Display error notification
      toast.error("Invalid email or password.");
      console.error("Login failed:", error);
    }
  };
  
  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <video autoPlay loop muted className="absolute top-0 left-0 w-full h-full object-cover z-[-1] opacity-80">
        <source src="/7.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-lg border border-gray-300 transform transition duration-500 ease-in-out hover:scale-105 animate-fade-in">
        <div className="mb-6 text-center">
          <img 
            src="/logo.png" 
            alt="Company Logo" 
            className="w-24 h-24 mx-auto rounded-full border border-gray-200 p-2 animate-logo"
          />
        </div>

        <h2 className="mb-2 text-xl font-semibold text-center text-gray-800 animate-text-fade-in">
          Welcome Back
        </h2>
        <p className="mb-6 text-center text-gray-500 text-sm animate-text-fade-in">
          Log in to your CRM account
        </p>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Email</label>
            <Input 
              type="email" 
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none focus:ring-green-900-2 focus:ring-green-800 transform hover:scale-105 glow-on-focus"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Password</label>
            <Input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-900 transform hover:scale-105 glow-on-focus"
            />
          </div>

          <Button type="submit" className="w-full py-3 text-white font-bold bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:ring-green-600 transition duration-300 transform hover:scale-105 ripple">
            Log In
          </Button>
        </form>

        <div className="mt-4 text-center">
          <a href="#" className="text-sm text-green-900 hover:underline">Forgot password?</a>
        </div>
      </div>

      {/* CSS for Animations */}
      <style jsx> {`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        .animate-text-fade-in {
          animation: fade-in 0.5s ease-out forwards;
          animation-delay: 0.3s; /* Delayed fade-in for text */
        }
        .animate-logo {
          animation: fade-in 0.5s ease-out forwards;
          animation-delay: 0.2s; /* Delayed fade-in for logo */
        }
        .glow-on-focus {
          position: relative;
        }
        .glow-on-focus:focus {
          box-shadow: 0 0 5px rgba(66, 153, 225, 1),
                      0 0 10px rgba(66, 153, 225, 1),
                      0 0 15px rgba(66, 153, 225, 1);
          outline: none;
          transition: all 0.3s ease;
        }
        .glow-on-focus:focus::placeholder {
          color: transparent; /* Hide placeholder text on focus for a cleaner look */
        }
        .ripple {
          position: relative;
          overflow: hidden;
        }
        .ripple::after {
          content: '';
          position: absolute;
          width: 300%;
          height: 300%;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.7);
          opacity: 0;
          pointer-events: none;
          transform: scale(0);
          animation: ripple-effect 0.6s linear forwards;
        }
        .ripple:focus::after {
          animation: ripple-effect 0.6s linear forwards;
        }
        @keyframes ripple-effect {
          to {
            opacity: 0;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
