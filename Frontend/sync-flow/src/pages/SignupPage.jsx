import React from "react";
import Signup from "../features/auth/Signup";

const SignupPage = () => {
  return (
    <>
      
      <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100">
        
        <div className="flex flex-col lg:flex-row items-center justify-center px-4 py-8 lg:px-12 lg:py-16 gap-10 lg:gap-16 max-w-7xl mx-auto w-full">
          
          
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left flex-1 max-w-lg">
            <img
              src="/sync.png"
              alt="SyncFlow Logo"
              className="w-32 sm:w-32 lg:w-52 xl:w-64 mb-6 select-none pointer-events-none"
            />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              SyncFlow
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-gray-600">
              Manage your projects efficiently with SyncFlow
            </p>
          </div>

          {/* Right Side - Signup Form */}
          <div className="w-full max-w-md lg:max-w-lg flex justify-center">
            <div className="w-full">
              <Signup />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;