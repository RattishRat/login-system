import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function NavBar({ user, onLogout }) {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await fetch('http://localhost:4000/api/logout', { method: 'POST', credentials: 'include' })
    onLogout()
    navigate('/login')
  }
  return (
    <nav style={{display:'flex',gap:10,padding:10,borderBottom:'1px solid #ddd'}}>
      <Link to="/">Home</Link>
      {user ? (
        <>
          <Link to="/profile">Profile</Link>
          <Link to="/users">Users</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  )
}
