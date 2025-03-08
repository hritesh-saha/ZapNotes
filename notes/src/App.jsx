import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignIn,SignUp} from "@clerk/clerk-react";
import Login from './components/Login';
import Home from './components/Home';
function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="login" element={<Login/>}/>
        <Route path="signup" element={<SignIn/>}/>
        <Route path="/" element={<Home/>}/>
      </Routes>
    </Router>
  )
}

export default App
