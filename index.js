import express from 'express'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import { PORT, SECRET_JWT_KEY } from './config.js'
import { UserRepository } from './user-repository.js'

const app = express()

app.set('view engine', 'ejs') // Set EJS as the view engine

app.use(express.json()) // Middleware to parse JSON bodies
app.use(cookieParser()) // Middleware to parse cookies
app.use((req, res, next) => { // Middleware to verify JWT token
  const token = req.cookies.access_token
  req.session = { user: null }

  if (token) {
    const data = jwt.verify(token, SECRET_JWT_KEY) // { _id, username }
    req.session.user = data // Attach user data to the session
  }

  next()
})

app.disable('x-powered-by') // Disable 'X-Powered-By' header for security

app.get('/', (req, res) => {
  const { user } = req.session
  res.render('index', user)
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await UserRepository.login({ username, password })
    const token = jwt.sign(
      { id: user._id, username: user.username },
      SECRET_JWT_KEY,
      { expiresIn: '1h' }
    )
    res
      .cookie('access_token', token, {
        httpOnly: true, // Cookie is not accessible via JavaScript, only available on the server side
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'Strict', // Prevent CSRF attacks. Only availabe from same domain
        maxAge: 3600000 // 1 hour
      })
      .json({ user })
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

app.post('/logout', (req, res) => {
  res
    .clearCookie('access_token')
    .json({ message: 'Logged out successfully' })
})

app.get('/protected', (req, res) => {
  const { user } = req.session

  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  res.render('protected', user)
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
