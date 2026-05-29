require('dotenv').config()
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

const conectar = async () => {
  try {
    const client = await pool.connect()
    await client.query('SELECT 1')
    client.release()
    console.log('✅ PostgreSQL conectado correctamente')
    console.log('📊 Base de datos:', process.env.PGDATABASE)
  } catch (error) {
    console.error('❌ Error conectando PostgreSQL:', error.message)
    process.exit(1)
  }
}

const getPool = () => pool

module.exports = { conectar, getPool }