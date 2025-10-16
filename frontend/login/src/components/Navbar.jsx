import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await fetch('http://localhost:4000/api/logout', { method: 'POST', credentials: 'include' })
    onLogout()
    navigate('/login')
  }
  return (
    <nav style={{display:'flex',gap:10,padding:10,borderBottom:'1px solid #ddd'}}>
      <Link to="/"></Link>
      {user ? (
        <>
          <Link to="/userscrud" class="lol" >Events feed</Link>
          <Link to="/users" class="lol">Users</Link>
          <button onClick={handleLogout} class="lol">Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" class="lolol">Login</Link>
          <Link to="/register" class="lolol">Register</Link>
        </>
      )}
    </nav>
  )
}
