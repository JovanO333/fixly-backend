const express    = require('express')
const cors       = require('cors')
const { conectar } = require('./src/config/database')
const authRoutes = require('./src/routes/authRoutes')
require('dotenv').config()

const PORT = process.env.PORT || 3000
const app = express()


app.use(cors({
  origin: [
    'http://localhost:5173',
    'fixly-frontendu.vercel.app'  // ← URL real de Vercel
  ],
  credentials: true
}))
app.use(express.json())
//  log para ver requests entrantes
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`)
  next()
})
app.use('/api/auth', authRoutes)


app.get('/', (req, res) => {
  res.json({ mensaje: '🔧 Fixly API corriendo' })

})
//  captura errores globales
app.use((err, req, res, next) => {
  console.error('❌ ERROR GLOBAL:', err)
  res.status(500).json({ ok: false, mensaje: err.message })
})

const iniciar = async () => {
  await conectar()
  app.listen(process.env.PORT, () => {
    console.log(`🚀 Servidor en http://localhost:${process.env.PORT}`)
  })
}

iniciar()

module.exports = app
