import React, { useEffect, useState } from 'react';

export default function UsersCRUD() {
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', published: false });
  const [editingId, setEditingId] = useState(null);

  const API_URL = 'http://localhost:4000/api/tickets';

  const fetchTickets = async () => {
    try {
      const res = await fetch(API_URL, { credentials: 'include' });
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (err) {
      console.error(err);
      setTickets([]);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
          credentials: 'include',
        });
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
          credentials: 'include',
        });
      }

      setForm({ title: '', content: '', published: false });
      setEditingId(null);
      fetchTickets();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (ticket) => {
    setForm({
      title: ticket.title,
      content: ticket.content || '',
      published: ticket.published,
    });
    setEditingId(ticket.id);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE', credentials: 'include' });
      fetchTickets();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h1>Create a post</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
        <label>
          Published:
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
          />
        </label>
        <button type="submit">{editingId ? 'Update' : 'Add'} Post</button>
      </form>

      <ul>
        {tickets.length === 0 ? (
          <p>No events found</p>
        ) : (
          tickets.map((ticket) => (
            <li key={ticket.id}>
              <strong>{ticket.title}</strong> {ticket.published ? '(Published)' : '(Draft)'}
              <p>{ticket.content}</p>
              <small>Author: {ticket.author.name || ticket.author.email}</small>
              <button onClick={() => handleEdit(ticket)}>Edit</button>
              <button onClick={() => handleDelete(ticket.id)}>Delete</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
