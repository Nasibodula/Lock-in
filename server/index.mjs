import 'dotenv/config'
import express from 'express'
import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import rateLimit from 'express-rate-limit'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const { MONGODB_URI, JWT_SECRET, PORT = 3000 } = process.env
if (!MONGODB_URI || !JWT_SECRET) { console.error('Set MONGODB_URI and JWT_SECRET'); process.exit(1) }

const client = new MongoClient(MONGODB_URI)
await client.connect()
const db = client.db(process.env.DB_NAME || 'lockin')
const users = db.collection('users')
const states = db.collection('states')
await users.createIndex({ email: 1 }, { unique: true })
await states.createIndex({ userId: 1 }, { unique: true })

const app = express()
app.use(express.json({ limit: '2mb' }))

const authLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30 })
const clean = e => String(e || '').trim().toLowerCase()
const sign = id => jwt.sign({ sub: String(id) }, JWT_SECRET, { expiresIn: '90d' })

app.post('/api/auth/signup', authLimit, async (req, res) => {
  const email = clean(req.body.email)
  const password = String(req.body.password || '')
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Enter a valid email.' })
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' })
  try {
    const r = await users.insertOne({ email, hash: await bcrypt.hash(password, 10), createdAt: new Date() })
    res.json({ token: sign(r.insertedId), email })
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ error: 'That email already has an account.' })
    throw e
  }
})

app.post('/api/auth/login', authLimit, async (req, res) => {
  const email = clean(req.body.email)
  const u = await users.findOne({ email })
  const ok = u && await bcrypt.compare(String(req.body.password || ''), u.hash)
  if (!ok) return res.status(401).json({ error: 'Wrong email or password.' })
  res.json({ token: sign(u._id), email })
})

const need = (req, res, next) => {
  const t = (req.headers.authorization || '').replace(/^Bearer /, '')
  try { req.uid = jwt.verify(t, JWT_SECRET).sub; next() }
  catch { res.status(401).json({ error: 'Please log in again.' }) }
}

app.get('/api/data', need, async (req, res) => {
  const d = await states.findOne({ userId: req.uid })
  res.json({ state: d ? d.state : null, updatedAt: d ? d.updatedAt : null })
})

app.put('/api/data', need, async (req, res) => {
  const s = req.body.state
  if (!s || !Array.isArray(s.habits) || typeof s.log !== 'object' || typeof s.start !== 'string')
    return res.status(400).json({ error: 'Invalid data.' })
  const updatedAt = new Date()
  await states.updateOne({ userId: req.uid }, { $set: { state: s, updatedAt } }, { upsert: true })
  res.json({ updatedAt })
})

// serve the built app
const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')
app.use(express.static(dist))
app.use((req, res) => res.sendFile(path.join(dist, 'index.html')))

app.use((err, req, res, next) => { console.error(err); res.status(500).json({ error: 'Server error.' }) })
app.listen(PORT, () => console.log('Lock-in server on ' + PORT))