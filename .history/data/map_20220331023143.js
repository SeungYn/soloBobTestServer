import SQ from 'sequelize';
import { sequelize } from '../db/database.js';
const DataTypes = SQ.DataTypes;

const Map = sequelize.define('map', {
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

//한신대 식당 가져오기
export async function getAllMaps(location) {
  Map.findAll({
    where: { location },
  }).then((data) => console.log(data));
}
