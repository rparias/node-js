import express from 'express'
import { PORT } from './config.js'

const app = express()

app.disable('x-powered-by') // Disable 'X-Powered-By' header for security

app.get('/', (req, res) => {
  console.log('request received:', req.method, req.url)
  res.end('Hello, World!')
})

app.post('/login', (req, res) => {})

app.post('/register', (req, res) => {})

app.post('/logout', (req, res) => {})

app.post('/protected', (req, res) => {})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
