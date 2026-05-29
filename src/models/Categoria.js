const { getPool } = require('../config/database')

class CategoriaModel {

  async listarTodas() {
    const result = await getPool().query(
      'SELECT * FROM Categorias WHERE estado = true'
    )
    return result.rows
  }

  async buscarPorId(id_categoria) {
    const result = await getPool().query(
      'SELECT * FROM Categorias WHERE id_categoria = $1',
      [id_categoria]
    )
    return result.rows[0] || null
  }

  async crear({ nombre, descripcion }) {
    const result = await getPool().query(
      `INSERT INTO Categorias (nombre, descripcion, estado)
       VALUES ($1, $2, true)
       RETURNING *`,
      [nombre, descripcion || null]
    )
    return result.rows[0]
  }

  async actualizar(id_categoria, { nombre, descripcion, estado }) {
    const result = await getPool().query(
      `UPDATE Categorias
       SET nombre=$1, descripcion=$2, estado=$3
       WHERE id_categoria=$4
       RETURNING *`,
      [nombre, descripcion || null, estado, id_categoria]
    )
    return result.rows[0]
  }

  async eliminar(id_categoria) {
    await getPool().query(
      'DELETE FROM Categorias WHERE id_categoria = $1',
      [id_categoria]
    )
  }
}

module.exports = new CategoriaModel()