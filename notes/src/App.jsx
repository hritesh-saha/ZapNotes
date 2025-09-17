import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './components/Home';
import ChapterDetails from './components/ChapterDetails';
import Quiz from './components/Quiz';
function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/chapter/:id" element={<ChapterDetails />} />
        <Route path="/topic/:id" element={<ChapterDetails />} />
        <Route path="/quiz" element={<Quiz/>} />
      </Routes>
    </Router>
  )
}

export default App
