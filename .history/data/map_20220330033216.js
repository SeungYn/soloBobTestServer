import SQ from 'sequelize';
import { sequelize } from '../db/database.js';
const DataTypes = SQ.DataTypes;

const Maps = sequelize.define('maps', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: false,
    primaryKey: true,
  },

  address_name: {
    type: DataTypes.STRING(120),
    allowNull: false,
  },
});
