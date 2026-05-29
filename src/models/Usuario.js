const { getPool } = require('../config/database')

class UsuarioModel {

  async buscarPorEmail(email) {
    const result = await getPool().query(
      'SELECT * FROM Usuarios WHERE email = $1',
      [email]
    )
    return result.rows[0] || null
  }

  async buscarPorId(id_usuario) {
    const result = await getPool().query(
      'SELECT * FROM Usuarios WHERE id_usuario = $1',
      [id_usuario]
    )
    return result.rows[0] || null
  }

  async crear({ nombre, email, contrasena, numero, rol }) {
    const result = await getPool().query(
      `INSERT INTO Usuarios (nombre, email, contrasena, numero, rol, estado)
       VALUES ($1, $2, $3, $4, $5, true)
       RETURNING *`,
      [nombre, email, contrasena, numero || null, rol]
    )
    return result.rows[0]
  }

  async actualizarContrasena(id_usuario, contrasena) {
    await getPool().query(
      'UPDATE Usuarios SET contrasena = $1 WHERE id_usuario = $2',
      [contrasena, id_usuario]
    )
  }

  async bloquear(id_usuario) {
    await getPool().query(
      'UPDATE Usuarios SET estado = false WHERE id_usuario = $1',
      [id_usuario]
    )
  }

  async listarTodos() {
    const result = await getPool().query(
      'SELECT id_usuario, nombre, email, numero, rol, estado FROM Usuarios'
    )
    return result.rows
  }

  async actualizar(id_usuario, { nombre, email, numero, rol, estado }) {
    await getPool().query(
      `UPDATE Usuarios
       SET nombre=$1, email=$2, numero=$3, rol=$4, estado=$5
       WHERE id_usuario=$6`,
      [nombre, email, numero || null, rol, estado, id_usuario]
    )
  }

  async eliminar(id_usuario) {
    await getPool().query(
      'DELETE FROM Usuarios WHERE id_usuario = $1',
      [id_usuario]
    )
  }
}

module.exports = new UsuarioModel()