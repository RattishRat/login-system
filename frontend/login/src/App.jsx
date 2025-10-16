import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar'
import Register from './pages/Register'
import Login from './pages/Login'
import Users from './pages/Users'
import UsersCRUD from './pages/UsersCRUD';

function App() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    fetch('http://localhost:4000/api/me', { credentials: 'include' })
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => setUser(data.user))
      .catch(() => setUser(null))
  }, [])

  return (
    <>
      <Navbar user={user} onLogout={() => setUser(null)} />
      <div style={{padding:20}}>
        <Routes>
          <Route path='/' element={user ? <Navigate to='/userscrud' /> : <Navigate to='/login' />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login onLogin={(u) => setUser(u)} />} />
          <Route path='/userscrud' element={user ? <UsersCRUD /> : <Navigate to='/login' />} />
        </Routes>
      </div>
    </>
  )
}
export default App;
