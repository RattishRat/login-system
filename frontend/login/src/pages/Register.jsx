import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [error,setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    setError(null)
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    const res = await fetch('http://localhost:4000/api/register',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({email,password}),
      credentials: 'include',
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Registration failed'); return }
    alert('Registered — now log in')
    navigate('/login')
  }

  return (
    <form onSubmit={handleSubmit} style={{maxWidth:420}}>
      <h2>Register</h2>
      {error && <div style={{color:'red'}}>{error}</div>}
      <div>
        <label>Email</label>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
      </div>
      <div>
        <label>Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={8} />
      </div>
      <button type="submit">Register</button>
    </form>
  )
}
