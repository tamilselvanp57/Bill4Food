import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDB } from './db.js'
import menuRouter from './routes/menu.js'
import ordersRouter from './routes/orders.js'
import settingsRouter from './routes/settings.js'
import { seedIfEmpty } from './seed.js'

const app = express()
const PORT = Number(process.env.PORT) || 5000
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

app.use(cors({ origin: CLIENT_ORIGIN }))
app.use(express.json())

app.get('/health', (_, res) => {
  res.json({ ok: true })
})

app.use('/api/menu', menuRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/settings', settingsRouter)

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: err.message || 'Server error' })
})

const uri = process.env.MONGODB_URI
if (!uri) {
  console.error('Set MONGODB_URI in .env (e.g. mongodb://127.0.0.1:27017/bill4food)')
  process.exit(1)
}

connectDB(uri)
  .then(() => seedIfEmpty())
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Bill4Food API http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
