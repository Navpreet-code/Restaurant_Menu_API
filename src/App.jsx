import { useState } from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import './App.css';
import { Meal } from './Component/Meal'
import { Meal1 } from './Component/Meal1'

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<Meal/>} />
        <Route path="/Meal" element={<Meal1/>} />
    </Routes>
    </BrowserRouter>
            
    </>
  )
}

export default App
