import React from 'react'
import './App.css'
import {Header, Footer} from './components/index.js'
import { Outlet } from 'react-router-dom'

function App() {
  return (
    
    <div className="w-full h-16 md:h-20 items-center justify-between px-4 relative">
            <Header/>
                <Outlet/>
            <Footer/>
    </div>
  )
}

export default App
