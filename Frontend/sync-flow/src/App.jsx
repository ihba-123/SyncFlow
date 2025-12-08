import React from 'react'
import LandingPageRoute from './routes/LandingPageRoute'
import {Routes , Route} from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPageRoute/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/signup" element={<SignupPage/>}/>
        <Route path="*" element={<div>404 Not Found</div>}/>
        </Routes>
    </div>
  )
}

export default App
