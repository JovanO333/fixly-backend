const { getPool } = require('../config/database')

exports.listar = async (req, res) => {
  try {
    const result = await getPool().query(
      'SELECT id_categoria, nombre FROM Categorias WHERE estado = true'
    )
    res.json({ ok: true, data: result.rows })
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message })
  }
}