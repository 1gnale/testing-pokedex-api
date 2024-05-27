const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('pokemon', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hp: {
      type: DataTypes.STRING
    },
    str: {
      type: DataTypes.STRING
    },
    def: {
      type: DataTypes.STRING
    },
    spd: {
      type: DataTypes.STRING
    },
    height: {
      type: DataTypes.STRING
    },
    weight: {
      type: DataTypes.STRING
    },
    img: {
      type: DataTypes.TEXT
    }
  },
  {
    timestamps: false,
  });
};