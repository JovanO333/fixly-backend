import 'dotenv/config'
import express from 'express'

const app = express()

console.log('DB:', process.env.DB_NAME)

app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000')
})