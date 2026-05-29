const bcrypt  = require('bcryptjs')
const Usuario = require('../models/Usuario')
const Tecnico = require('../models/Tecnico')

// ─── LISTAR TODOS ────────────────────────────────────────────────
exports.listar = async (req, res) => {
  try {
    const usuarios = await Usuario.listarTodos()
    res.status(200).json({ ok: true, data: usuarios })
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error en el servidor', error: error.message })
  }
}

// ─── OBTENER UNO ─────────────────────────────────────────────────
exports.obtener = async (req, res) => {
  try {
    const usuario = await Usuario.buscarPorId(parseInt(req.params.id))
    if (!usuario)
      return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado' })

    res.status(200).json({ ok: true, data: usuario })
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error en el servidor', error: error.message })
  }
}

// ─── ACTUALIZAR ──────────────────────────────────────────────────
exports.actualizar = async (req, res) => {
  try {
    const id      = parseInt(req.params.id)
    const usuario = await Usuario.buscarPorId(id)
    if (!usuario)
      return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado' })

    const { nombre, email, numero, rol, estado } = req.body
    await Usuario.actualizar(id, {
      nombre:  nombre  || usuario.nombre,
      email:   email   || usuario.email,
      numero:  numero  !== undefined ? numero : usuario.numero,
      rol:     rol     || usuario.rol,
      //estado viene como string "true"/"false" del body,
      estado: estado !== undefined ? (estado === true || estado === 'true') : usuario.estado
    })

    const actualizado = await Usuario.buscarPorId(id)
    res.status(200).json({ ok: true, mensaje: 'Usuario actualizado', data: actualizado })
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error en el servidor', error: error.message })
  }
}

// ─── ELIMINAR ────────────────────────────────────────────────────
exports.eliminar = async (req, res) => {
  try {
    const id      = parseInt(req.params.id)
    const usuario = await Usuario.buscarPorId(id)
    if (!usuario)
      return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado' })

    await Usuario.eliminar(id)
    res.status(200).json({ ok: true, mensaje: 'Usuario eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error en el servidor', error: error.message })
  }
}

// ─── CAMBIAR CONTRASEÑA (admin) ──────────────────────────────────
exports.cambiarContrasenaAdmin = async (req, res) => {
  try {
    const id              = parseInt(req.params.id)
    const { nuevaContrasena } = req.body

    if (!nuevaContrasena || nuevaContrasena.length < 8)
      return res.status(400).json({ ok: false, mensaje: 'Mínimo 8 caracteres' })

    const usuario = await Usuario.buscarPorId(id)
    if (!usuario)
      return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado' })

    const hash = await bcrypt.hash(nuevaContrasena, 10)
    await Usuario.actualizarContrasena(id, hash)

    res.status(200).json({ ok: true, mensaje: 'Contraseña actualizada' })
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error en el servidor', error: error.message })
  }
}