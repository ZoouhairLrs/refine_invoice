import React from 'react';
import { Input } from '@/components/ui/Input'; // Adjust the import path based on your project structure.
import { Button } from '@/components/ui/Button'; // Adjust the import path based on your project structure.

const LoginPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Side - CRM Background Image with Subtle Animation */}
      <div className="relative w-1/2 h-screen bg-cover bg-center crm-bg-image"
           style={{ backgroundImage: 'url(/backgroundLogin.jpg)' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-800 to-blue-600 opacity-80"></div>
        {/* CRM Branding Text (Optional) */}
        <div className="absolute top-20 left-16 text-white z-10">
          <h1 className="text-5xl font-bold">CRM Dashboard</h1>
          <p className="mt-4 text-lg text-gray-200">Your ultimate tool to manage relationships</p>
        </div>
      </div>

      {/* Right Side - Smaller Login Form */}
      <div className="flex items-center justify-center w-1/2 p-10 bg-white shadow-md">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg border border-gray-200">
          {/* Company/CRM Logo */}
          <div className="mb-6 text-center">
            <img src="logo.png" alt="Company Logo" className="w-20 mx-auto"/>
          </div>

          {/* Welcome Text */}
          <h2 className="mb-4 text-2xl font-bold text-center text-gray-800">
            Log in to CRM
          </h2>
          <p className="mb-6 text-center text-gray-500">Enter your credentials to continue</p>

          {/* Form */}
          <form>
            {/* Email Input */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <Input 
                type="email" 
                placeholder="yourname@example.com"
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
              />
            </div>

            {/* Password Input */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <Input 
                type="password" 
                placeholder="Enter your password"
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
              />
            </div>

            {/* Login Button */}
            <Button className="w-full py-2.5 text-base font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500 transition duration-300">
              Log In
            </Button>
          </form>

          {/* Forgot Password */}
          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-indigo-600 hover:underline">
              Forgot your password?
            </a>
          </div>
        </div>
      </div>

      {/* CSS for CRM Layout Enhancements */}
      <style jsx>{`
        .crm-bg-image {
          animation: fadeIn 1.5s ease-in-out;
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateX(-50%);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @media (max-width: 1024px) {
          .crm-bg-image {
            display: none;
          }
          .w-1/2 {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
