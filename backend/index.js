require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'please_change_this';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));

// JWT token generation
function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '2h' });
}

// Auth middleware
async function authMiddleware(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, createdAt: true },
    });
    if (!user) return res.status(401).json({ error: 'Invalid token' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Registration
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return res.status(400).json({ error: 'Invalid email' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hashed } });
    const { password: _pw, ...safeUser } = user;

    return res.json({ message: 'User created', user: safeUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = generateToken(user.id);
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, ////
      sameSite: 'lax',
      maxAge: 2 * 60 * 60 * 1000, // 2 hours
    });

    const { password: _pw, ...safeUser } = user;
    return res.json({ message: 'Logged in', user: safeUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Logout
app.post('/api/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
  res.json({ message: 'Logged out' });
});

// Get current authenticated user
app.get('/api/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});


// ✅ CRUD operations for tickets
app.get('/api/tickets', authMiddleware, async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      include: { author: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ tickets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/tickets', authMiddleware, async (req, res) => {
  const { title, content, published } = req.body;
  try {
    const ticket = await prisma.ticket.create({
      data: {
        title,
        content,
        published,
        authorId: req.user.id,
      },
    });
    res.json(ticket);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/tickets/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, content, published } = req.body;
  try {
    const ticket = await prisma.ticket.update({
      where: { id: Number(id) },
      data: { title, content, published },
    });
    res.json(ticket);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/tickets/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.ticket.delete({ where: { id: Number(id) } });
    res.json({ message: 'Ticket deleted' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
