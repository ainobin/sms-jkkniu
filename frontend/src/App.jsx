import { useState } from 'react'
import './App.css'
import {Header, Footer, Login, RegisterForm} from './components/index.js'


function App() {
  

  return (
    <div className='min-h-screen flex flex-col'>
      <Header/>
      <main className='justify-center items-center flex flex-col flex-1'>

        <RegisterForm/>
      
      </main>
      <Footer/>
    </div>
  )
}

export default App
