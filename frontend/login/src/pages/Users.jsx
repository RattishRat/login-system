import React, { useEffect, useState } from 'react'

export default function Users() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('http://localhost:4000/api/users', { credentials: 'include' })
      .then(async res => {
        if (!res.ok) {
          const json = await res.json().catch(()=>({}))
          throw new Error(json.error || 'Failed')
        }
        return res.json()
      })
      .then(data => setUsers(data.users))
      .catch(err => setError(err.message))
  }, [])

  if (error) return <div style={{color:'red'}}>{error}</div>
  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map(u => <li key={u.id}>{u.email} — {new Date(u.createdAt).toLocaleString()}</li>)}
      </ul>
    </div>
  )
}
