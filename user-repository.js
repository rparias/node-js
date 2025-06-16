import DBLocal from 'db-local'
import crypto from 'node:crypto'

const { Schema } = new DBLocal({ path: './db' })

const User = Schema('User', {
  _id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

export class UserRepository {
  static create ({ username, password }) {
    // 1. validate username (with zod)
    if (typeof username !== 'string') throw new Error('Username must be a string')
    if (username.length < 3) throw new Error('Username must be at least 3 characters long')

    if (typeof password !== 'string') throw new Error('Password must be a string')
    if (password.length < 6) throw new Error('Password must be at least 6 characters long')

    // 2. check if user already exists
    const user = User.findOne({ username })
    if (user) throw new Error('User already exists')

    const id = crypto.randomUUID() // if DB supports auto-increment, use that instead

    User.create({
      _id: id,
      username,
      password // Note: Password should be hashed in a real application
    }).save()

    return id
  }

  static login ({ username, password }) {}
}
