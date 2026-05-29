const Tecnico = require('../models/Tecnico')

exports.listar = async (req, res) => {
  try {
    const tecnicos = await Tecnico.listarTodos()
    res.status(200).json({ ok: true, data: tecnicos })
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error en el servidor', error: error.message })
  }
}

exports.obtener = async (req, res) => {
  try {
    const tecnico = await Tecnico.buscarPorId(parseInt(req.params.id))
    if (!tecnico)
      return res.status(404).json({ ok: false, mensaje: 'Técnico no encontrado' })
    res.status(200).json({ ok: true, data: tecnico })
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error en el servidor', error: error.message })
  }
}

exports.actualizar = async (req, res) => {
  try {
    const id      = parseInt(req.params.id)
    const tecnico = await Tecnico.buscarPorId(id)
    if (!tecnico)
      return res.status(404).json({ ok: false, mensaje: 'Técnico no encontrado' })

    await Tecnico.actualizar(id, req.body)
    const actualizado = await Tecnico.buscarPorId(id)
    res.status(200).json({ ok: true, mensaje: 'Técnico actualizado', data: actualizado })
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error en el servidor', error: error.message })
  }
}

exports.eliminar = async (req, res) => {
  try {
    const id      = parseInt(req.params.id)
    const tecnico = await Tecnico.buscarPorId(id)
    if (!tecnico)
      return res.status(404).json({ ok: false, mensaje: 'Técnico no encontrado' })

    await Tecnico.eliminar(id)
    res.status(200).json({ ok: true, mensaje: 'Técnico eliminado' })
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error en el servidor', error: error.message })
  }
}

// método verificar del modelo directamente
exports.verificar = async (req, res) => {
  try {
    const id      = parseInt(req.params.id)
    const tecnico = await Tecnico.buscarPorId(id)
    if (!tecnico)
      return res.status(404).json({ ok: false, mensaje: 'Técnico no encontrado' })

    await Tecnico.verificar(id)
    res.status(200).json({ ok: true, mensaje: 'Técnico verificado correctamente' })
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error en el servidor', error: error.message })
  }

}