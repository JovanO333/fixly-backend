const jwt = require('jsonwebtoken')
require('dotenv').config()

const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token      = authHeader && authHeader.split(' ')[1]

  if (!token)
    return res.status(401).json({ ok: false, mensaje: 'Token requerido' })

  try {
    const decoded  = jwt.verify(token, process.env.JWT_SECRET)
    req.usuario    = decoded
    next()
  } catch {
    return res.status(401).json({ ok: false, mensaje: 'Token inválido o expirado' })
  }
}

const soloAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'admin')
    return res.status(403).json({ ok: false, mensaje: 'Acceso solo para administradores' })
  next()
}

const soloTecnico = (req, res, next) => {
  if (req.usuario.rol !== 'tecnico')
    return res.status(403).json({ ok: false, mensaje: 'Acceso solo para técnicos' })
  next()
}

module.exports = { verificarToken, soloAdmin, soloTecnico }