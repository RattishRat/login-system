import React from 'react'

export default function Profile({ user }) {
  if (!user) return <div>Loading...</div>
  return (
    <div>
      <h2>Profile</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleString()}</p>
    </div>
  )
}
