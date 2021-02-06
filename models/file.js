'use strict';
module.exports = (sequelize, DataTypes) => {
  const file = sequelize.define('files', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING
    },
    extension: {
      type: DataTypes.STRING
    },
    mime: {
      type: DataTypes.STRING
    },
    size: {
      type: DataTypes.INTEGER
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {});

  return file;
};