const express             = require('express')
const router              = express.Router()
const AuthController      = require('../controllers/AuthController')
const UsuarioController   = require('../controllers/UsuarioController')
const TecnicoController   = require('../controllers/TecnicoController')
const CategoriaController = require('../controllers/CategoriaController')
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware')

// ── Autenticación (públicas) ──────────────────────────────────────
router.post('/registro/cliente',    AuthController.registroCliente)
router.post('/registro/tecnico',    AuthController.registroTecnico)
router.post('/registro/admin',      AuthController.registroAdmin)
router.post('/login',               AuthController.login)
router.post('/recuperar',           AuthController.recuperarContrasena)
router.post('/cambiar-contrasena',  AuthController.cambiarContrasena)

// ── Perfil (protegida) ────────────────────────────────────────────
router.get('/perfil', verificarToken, AuthController.perfil)

// ── CRUD Usuarios (solo admin) ────────────────────────────────────
router.get('/usuarios',                    verificarToken, soloAdmin, UsuarioController.listar)
router.get('/usuarios/:id',                verificarToken, soloAdmin, UsuarioController.obtener)
router.put('/usuarios/:id',                verificarToken, soloAdmin, UsuarioController.actualizar)
router.delete('/usuarios/:id',             verificarToken, soloAdmin, UsuarioController.eliminar)
router.put('/usuarios/:id/contrasena',     verificarToken, soloAdmin, UsuarioController.cambiarContrasenaAdmin)

// ── CRUD Técnicos (solo admin) ────────────────────────────────────
router.get('/tecnicos',              verificarToken, soloAdmin, TecnicoController.listar)
router.get('/tecnicos/:id',          verificarToken,            TecnicoController.obtener)
router.put('/tecnicos/:id',          verificarToken, soloAdmin, TecnicoController.actualizar)
router.delete('/tecnicos/:id',       verificarToken, soloAdmin, TecnicoController.eliminar)
router.put('/tecnicos/:id/verificar',verificarToken, soloAdmin, TecnicoController.verificar)

module.exports = router