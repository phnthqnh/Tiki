import { Outlet } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'


function App() {

  return (
    <>
      <Home />
      <Outlet />
    </>
  )
}

export default App
