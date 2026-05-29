const { DataTypes } = require('sequelize')
const db = require('../config/database')

const Calificacion = db.define('Calificacion', {
  id_calificacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_solicitud: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  puntaje: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'calificacion',
  timestamps: false
})

module.exports = Calificacion