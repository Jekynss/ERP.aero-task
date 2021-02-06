'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('Users', {
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    }
  }, {});

  user.associate = function (models) {
    user.hasOne(models.Tokens, { 
      foreignKey: 'user_id', 
      as: 'refresh_token', 
      onDelete: 'CASCADE' 
    });
  };

  return user;
};