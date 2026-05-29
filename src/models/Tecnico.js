const { getPool } = require('../config/database')

class TecnicoModel {

  async crear({ id_usuario, id_categoria, descripcion, experiencia, documento }) {
    const result = await getPool().query(
      `INSERT INTO Tecnicos (id_usuario, id_categoria, descripcion, experiencia, documento)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id_usuario, id_categoria, descripcion || null, experiencia || null, documento || null]
    )
    return result.rows[0]
  }

  async buscarPorUsuario(id_usuario) {
    const result = await getPool().query(
      'SELECT * FROM Tecnicos WHERE id_usuario = $1',
      [id_usuario]
    )
    return result.rows[0] || null
  }

  async buscarPorId(id_tecnico) {
    const result = await getPool().query(
      `SELECT t.*, u.nombre, u.email, u.numero,
              c.nombre AS categoria_nombre
       FROM   Tecnicos    t
       INNER JOIN Usuarios   u ON t.id_usuario   = u.id_usuario
       INNER JOIN Categorias c ON t.id_categoria = c.id_categoria
       WHERE  t.id_tecnico = $1`,
      [id_tecnico]
    )
    return result.rows[0] || null
  }

  async listarTodos() {
    const result = await getPool().query(
      `SELECT t.*, u.nombre, u.email,
              c.nombre AS categoria_nombre
       FROM   Tecnicos    t
       INNER JOIN Usuarios   u ON t.id_usuario   = u.id_usuario
       INNER JOIN Categorias c ON t.id_categoria = c.id_categoria`
    )
    return result.rows
  }

  async actualizar(id_tecnico, { id_categoria, descripcion, experiencia, documento, perfil_completo, estado_verificacion }) {
    await getPool().query(
      `UPDATE Tecnicos
       SET id_categoria        = $1,
           descripcion         = $2,
           experiencia         = $3,
           documento           = $4,
           perfil_completo     = $5,
           estado_verificacion = $6
       WHERE id_tecnico = $7`,
      [
        id_categoria,
        descripcion         || null,
        experiencia         || null,
        documento           || null,
        perfil_completo     ?? false,
        estado_verificacion || 'Pendiente',
        id_tecnico
      ]
    )
  }

  async verificar(id_tecnico) {
    await getPool().query(
      `UPDATE Tecnicos
       SET estado_verificacion = 'Verificado', perfil_completo = true
       WHERE id_tecnico = $1`,
      [id_tecnico]
    )
  }

  async eliminar(id_tecnico) {
    await getPool().query(
      'DELETE FROM Tecnicos WHERE id_tecnico = $1',
      [id_tecnico]
    )
  }
}

module.exports = new TecnicoModel()