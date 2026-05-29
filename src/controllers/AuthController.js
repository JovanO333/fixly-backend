const bcrypt   = require('bcryptjs')
const jwt      = require('jsonwebtoken')
const crypto   = require('crypto')
const Usuario  = require('../models/Usuario')
const Tecnico  = require('../models/Tecnico')
require('dotenv').config()

// tokens temporales en memoria (en producción usar Redis o BD)
const tokensRecuperacion = {}

// ─── REGISTRO CLIENTE ────────────────────────────────────────────
exports.registroCliente = async (req, res) => {
  try {
    const { nombre, email, contrasena, numero } = req.body

    if (!nombre || !email || !contrasena)
      return res.status(400).json({ ok: false, mensaje: 'Nombre, email y contraseña son obligatorios' })

    if (contrasena.length < 8)
      return res.status(400).json({ ok: false, mensaje: 'La contraseña debe tener mínimo 8 caracteres' })

    const existe = await Usuario.buscarPorEmail(email)
    if (existe)
      return res.status(400).json({ ok: false, mensaje: 'El correo ya está registrado' })

    const hash    = await bcrypt.hash(contrasena, 10)
    const usuario = await Usuario.crear({ nombre, email, contrasena: hash, numero, rol: 'cliente' })

    res.status(201).json({
      ok: true,
      mensaje: 'Cliente registrado correctamente',
      data: {
        id_usuario: usuario.id_usuario,
        nombre:     usuario.nombre,
        email:      usuario.email,
        rol:        usuario.rol
      }
    })
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error en el servidor', error: error.message })
  }
}

// ─── REGISTRO TÉCNICO ────────────────────────────────────────────
exports.registroTecnico = async (req, res) => {
  try {
    const { nombre, email, contrasena, numero, id_categoria, descripcion, experiencia, documento } = req.body

    if (!nombre || !email || !contrasena || !id_categoria)
      return res.status(400).json({ ok: false, mensaje: 'Faltan campos obligatorios' })

    if (contrasena.length < 8)
      return res.status(400).json({ ok: false, mensaje: 'La contraseña debe tener mínimo 8 caracteres' })

    const existe = await Usuario.buscarPorEmail(email)
    if (existe)
      return res.status(400).json({ ok: false, mensaje: 'El correo ya está registrado' })

    const hash    = await bcrypt.hash(contrasena, 10)
    const usuario = await Usuario.crear({ nombre, email, contrasena: hash, numero, rol: 'tecnico' })

    const tecnico = await Tecnico.crear({
      id_usuario:   usuario.id_usuario,
      id_categoria: parseInt(id_categoria),
      descripcion,
      experiencia:  parseInt(experiencia) || null,
      documento
    })

    res.status(201).json({
      ok: true,
      mensaje: 'Técnico registrado. Pendiente de verificación.',
      data: {
        id_usuario:  usuario.id_usuario,
        id_tecnico:  tecnico.id_tecnico,
        nombre:      usuario.nombre,
        email:       usuario.email,
        rol:         usuario.rol,
        estado_verificacion: tecnico.estado_verificacion
      }
    })
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error en el servidor', error: error.message })
  }
}

// ─── REGISTRO ADMIN ──────────────────────────────────────────────
exports.registroAdmin = async (req, res) => {
  try {
    const { nombre, email, contrasena, numero } = req.body

    if (!nombre || !email || !contrasena)
      return res.status(400).json({ ok: false, mensaje: 'Faltan campos obligatorios' })

    const existe = await Usuario.buscarPorEmail(email)
    if (existe)
      return res.status(400).json({ ok: false, mensaje: 'El correo ya está registrado' })

    const hash    = await bcrypt.hash(contrasena, 10)
    const usuario = await Usuario.crear({ nombre, email, contrasena: hash, numero, rol: 'admin' })

    res.status(201).json({
      ok: true,
      mensaje: 'Administrador registrado correctamente',
      data: {
        id_usuario: usuario.id_usuario,
        nombre:     usuario.nombre,
        email:      usuario.email,
        rol:        usuario.rol
      }
    })
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error en el servidor', error: error.message })
  }
}

// ─── LOGIN ───────────────────────────────────────────────────────
exports.login = async (req, res) => {
  
  try {
    const { email, contrasena } = req.body

    if (!email || !contrasena)
      return res.status(400).json({ ok: false, mensaje: 'Email y contraseña son obligatorios' })

    const usuario = await Usuario.buscarPorEmail(email)
    if (!usuario)
      return res.status(401).json({ ok: false, mensaje: 'Credenciales inválidas' })

    if (!usuario.estado)
      return res.status(401).json({ ok: false, mensaje: 'Cuenta bloqueada. Contacta soporte.' })

    const hash = usuario['contrasena'] || usuario['contrasena'] || usuario.contrasena
    const valida = await bcrypt.compare(contrasena, usuario.contrasena)
    if (!valida)
      return res.status(401).json({ ok: false, mensaje: 'Credenciales inválidas' })

    // Si es técnico adjuntamos sus datos
    let datosTecnico = null
    if (usuario.rol === 'tecnico') {
      datosTecnico = await Tecnico.buscarPorUsuario(usuario.id_usuario)
    }

    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    )

    res.status(200).json({
      ok: true,
      mensaje: 'Login exitoso',
      data: {
        token,
        usuario: {
          id_usuario: usuario.id_usuario,
          nombre:     usuario.nombre,
          email:      usuario.email,
          rol:        usuario.rol,
          tecnico:    datosTecnico
        }
      }
    })
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error en el servidor', error: error.message })
  }
}

// ─── RECUPERAR CONTRASEÑA ────────────────────────────────────────
exports.recuperarContrasena = async (req, res) => {
  try {
    const { email } = req.body

    if (!email)
      return res.status(400).json({ ok: false, mensaje: 'El email es obligatorio' })

    const usuario = await Usuario.buscarPorEmail(email)
    if (!usuario)
      return res.status(404).json({ ok: false, mensaje: 'Correo no registrado' })

    const token  = crypto.randomBytes(32).toString('hex')
    const expira = Date.now() + 15 * 60 * 1000  // 15 minutos

    tokensRecuperacion[token] = { id_usuario: usuario.id_usuario, expira }

    res.status(200).json({
      ok: true,
      mensaje: 'Token generado. En producción se enviaría por correo.',
      token   // en producción NO devolver el token, enviarlo por email
    })
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error en el servidor', error: error.message })
  }
}

// ─── CAMBIAR CONTRASEÑA ──────────────────────────────────────────
exports.cambiarContrasena = async (req, res) => {
  try {
    const { token, nuevaContrasena } = req.body

    if (!token || !nuevaContrasena)
      return res.status(400).json({ ok: false, mensaje: 'Token y nueva contraseña son obligatorios' })

    if (nuevaContrasena.length < 8)
      return res.status(400).json({ ok: false, mensaje: 'Mínimo 8 caracteres' })

    const datos = tokensRecuperacion[token]
    if (!datos)
      return res.status(400).json({ ok: false, mensaje: 'Token inválido' })

    if (Date.now() > datos.expira) {
      delete tokensRecuperacion[token]
      return res.status(400).json({ ok: false, mensaje: 'Token expirado' })
    }

    const hash = await bcrypt.hash(nuevaContrasena, 10)
    await Usuario.actualizarContrasena(datos.id_usuario, hash)
    delete tokensRecuperacion[token]

    res.status(200).json({ ok: true, mensaje: 'Contraseña actualizada correctamente' })
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error en el servidor', error: error.message })
  }
}

// ─── PERFIL (ruta protegida) ─────────────────────────────────────
exports.perfil = async (req, res) => {
  try {
    const usuario = await Usuario.buscarPorId(req.usuario.id_usuario)
    if (!usuario)
      return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado' })

    let datosTecnico = null
    if (usuario.rol === 'tecnico') {
      datosTecnico = await Tecnico.buscarPorUsuario(usuario.id_usuario)
    }

    res.status(200).json({
      ok: true,
      data: {
        id_usuario: usuario.id_usuario,
        nombre:     usuario.nombre,
        email:      usuario.email,
        numero:     usuario.numero,
        rol:        usuario.rol,
        estado:     usuario.estado,
        tecnico:    datosTecnico
      }
    })
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error en el servidor', error: error.message })
  }
}