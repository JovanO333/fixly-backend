const { DataTypes } = require('sequelize')
const db = require('../config/database')

const Solicitud = db.define('Solicitud', {
  id_solicitud: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_tecnico: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  id_categoria: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING(30),
    defaultValue: 'pendiente',
    validate: {
      isIn: [['pendiente', 'asignado', 'en_camino', 'en_curso', 'finalizado', 'cancelado']]
    }
  },
  ubicacion: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  precio_estimado: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  precio_final: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  }
}, {
  tableName: 'solicitud',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})

module.exports = Solicitud