const { DataTypes } = require('sequelize')
const db = require('../config/database')

const Notificacion = db.define('Notificacion', {
  id_notificacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_solicitud: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  leida: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'notificacion',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
})

module.exports = Notificacion