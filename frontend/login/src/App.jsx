import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar'
import Register from './pages/Register'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Users from './pages/Users'
import UsersCRUD from './pages/UsersCRUD';

function App() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    fetch('http://localhost:4000/api/profile', { credentials: 'include' })
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => setUser(data.user))
      .catch(() => setUser(null))
  }, [])

  return (
    <>
      <NavBar user={user} onLogout={() => setUser(null)} />
      <div style={{padding:20}}>
        <Routes>
          <Route path='/' element={user ? <Navigate to='/profile' /> : <Navigate to='/login' />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login onLogin={(u) => setUser(u)} />} />
          <Route path='/profile' element={user ? <Profile user={user} /> : <Navigate to='/login' />} />
          <Route path='/users' element={user ? <Users /> : <Navigate to='/login' />} />
           <Route path="/users" element={<UsersCRUD />} />
        </Routes>
      </div>
    </>
  )
}
export default App;
