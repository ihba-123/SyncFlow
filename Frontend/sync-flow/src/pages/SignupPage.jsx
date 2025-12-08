import React from 'react';
import Signup from '../features/auth/Signup';

const SignupPage = () => {
  return (
    <div className="min-h-screen w-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-white via-gray-50 to-gray-100 p-4 md:p-12">
      
      {/* Logo Section */}
      <div className="flex flex-col items-center md:items-start md:mr-12 mb-6 md:mb-0">
        <img src="sync.png" alt="SyncFlow Logo" className="w-22 sm:w-40 md:w-52 lg:w-60" />
        <h1 className="mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 text-center md:text-left">
          SyncFlow
        </h1>
        <p className="mt-2 text-gray-600 text-sm sm:text-base md:text-lg text-center md:text-left max-w-xs md:max-w-md">
          Manage your projects efficiently with SyncFlow
        </p>
      </div>

   
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl">
        <Signup />
      </div>
    </div>
  );
};

export default SignupPage;
