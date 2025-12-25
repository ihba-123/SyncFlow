import React from 'react'
import UserProfileEdit from '../../features/profile/UserProfile'
const Dashboard = () => {

  return (  
    <div className="">
     <p className="text-black dark:text-white">
  This text is black in light mode, white in dark mode
</p>

<div className="border border-gray-800 dark:border-white/20">
  This border inverts color with theme
</div>
    </div>
  )
}

export default Dashboard
