import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
import User from '../models/User.js';

const signAccess = (user) =>
  jwt.sign({ id: user._id, businessId: user.businessId, tokenVersion: user.tokenVersion }, process.env.JWT_SECRET, { expiresIn: '15m' });

const signRefresh = (user) =>
  jwt.sign({ id: user._id, businessId: user.businessId, tokenVersion: user.tokenVersion }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    const businessId = new mongoose.Types.ObjectId();
    const user = await User.create({ name, email, password, businessId });

    const accessToken = signAccess(user);
    const refresh = signRefresh(user);

    res.cookie('jid', refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/refresh_token'
    });

    return res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, businessId: user.businessId },
      accessToken
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Registration error' });
  }
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const accessToken = signAccess(user);
    const refresh = signRefresh(user);

    res.cookie('jid', refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/refresh_token'
    });

    return res.json({
      user: { id: user._id, name: user.name, email: user.email, businessId: user.businessId },
      accessToken
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Login error' });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.jid;
    if (!token) return res.status(401).json({ ok: false, accessToken: '' });

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ ok: false, accessToken: '' });
    }

    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ ok: false, accessToken: '' });
    if (user.tokenVersion !== payload.tokenVersion) return res.status(401).json({ ok: false, accessToken: '' });

    const accessToken = signAccess(user);
    const refresh = signRefresh(user);
    res.cookie('jid', refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/refresh_token'
    });

    return res.json({ ok: true, accessToken });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, accessToken: '' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('jid', { path: '/api/refresh_token' });
  res.json({ message: 'Logged out' });
};

export const revokeTokensForUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { $inc: { tokenVersion: 1 } });
    res.clearCookie('jid', { path: '/api/refresh_token' });
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false });
  }
};
