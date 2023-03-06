import SQ from 'sequelize';
import { sequelize } from '../db/database.js';
const DataTypes = SQ.DataTypes;

const Maps = sequelize.define('maps', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: false,
    primaryKey: true,
  },

  address: {
    type: DataTypes.STRING(120),
    allowNull: false,
  },

  name: {
    type: DataTypes.STRING(120),
    allowNull: false,
  },

  latitude: {
    type: DataTypes.STRING(120),
    allowNull: false,
  },
  longitude: {
    type: DataTypes.STRING(120),
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING(120),
    allowNull: false,
  },
});
