import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
const App = () => {
  return (
    <div className='w-screen min-h-screen flex flex-col bg-richblack-800 font-inter'>
      <Routes>
        <Route path = "/" element ={<Home/>}></Route>
      </Routes>
    </div>
  )
}

export default App
