import React from 'react';
import Login from '../features/auth/Login';

const LoginPage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-white via-gray-50 to-gray-100 px-4 py-8 md:p-12 overflow-x-hidden">
      {/* Logo Section */}
      <div className="flex flex-col items-center md:items-start mb-10 md:mb-0 md:mr-12 lg:mr-16">
        <img 
          src="sync.png" 
          alt="SyncFlow Logo" 
          className="w-22 sm:w-40 md:w-52 lg:w-60" 
        />
        <h1 className="mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 text-center md:text-left
                 tracking-tight leading-none 
                 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent
                 drop-shadow-sm">
  SyncFlow
</h1>
        <p className="mt-2 text-gray-600 text-sm sm:text-base md:text-lg text-center md:text-left max-w-xs md:max-w-md">
          Manage your projects efficiently with SyncFlow
        </p>
      </div>

      {/* Login Section */}
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl flex-shrink-0">
        <Login />
      </div>
    </div>
  );
};

export default LoginPage;