import express from 'express'
import { PORT } from './config.js'
import { UserRepository } from './user-repository.js'

const app = express()

app.use(express.json()) // Middleware to parse JSON bodies

app.disable('x-powered-by') // Disable 'X-Powered-By' header for security

app.get('/', (req, res) => {
  console.log('request received:', req.method, req.url)
  res.end('Hello, World!')
})

app.post('/login', (req, res) => {})

app.post('/register', (req, res) => {
  const { username, password } = req.body

  try {
    const userId = UserRepository.create({ username, password })
    res.status(201).json({ message: 'User created successfully', userId })
  } catch (error) {
    console.error('Error creating user:', error)
    res.status(400).json({ error: error.message })
  }
})

app.post('/logout', (req, res) => {})

app.post('/protected', (req, res) => {})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
