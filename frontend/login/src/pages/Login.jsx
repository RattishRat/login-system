import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login({ onLogin }) {
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [error,setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    setError(null)
    const res = await fetch('http://localhost:4000/api/login',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      credentials:'include',
      body: JSON.stringify({email,password})
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Login failed'); return }
    onLogin(data.user)
    navigate('/userscrud')
  }

  return (
     <div className="auth-container">
    <form onSubmit={handleSubmit} style={{maxWidth:420}}>
      <h2>Login</h2>
      {error && <div style={{color:'red'}}>{error}</div>}
      <div>
        <label>Email</label>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
      </div>
      <div>
        <label>Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={8} />
      </div>
      <button type="submit">Login</button>
    </form>
    </div>
  )
}
