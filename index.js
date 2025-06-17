import express from 'express'
import { PORT } from './config.js'
import { UserRepository } from './user-repository.js'

const app = express()

app.set('view engine', 'ejs') // Set EJS as the view engine

app.use(express.json()) // Middleware to parse JSON bodies

app.disable('x-powered-by') // Disable 'X-Powered-By' header for security

app.get('/', (req, res) => {
  console.log('request received:', req.method, req.url)
  res.render('index')
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await UserRepository.login({ username, password })
    res.json({ user })
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
})

app.post('/register', async (req, res) => {
  const { username, password } = req.body

  try {
    const userId = await UserRepository.create({ username, password })
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
