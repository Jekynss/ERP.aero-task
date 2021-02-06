'use strict';
module.exports = (sequelize, DataTypes) => {
  const token = sequelize.define('Tokens', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user_id: {
      type: DataTypes.STRING,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    },
    refresh_token: {
      type: DataTypes.STRING
    }
  }, {});

  token.associate = function (models) {
     models.Tokens.belongsTo(models.Users, {
       foreignKey: 'user_id',
       as: 'user_token',
     });
  };
  return token;
};