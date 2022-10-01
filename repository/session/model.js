const { DataTypes } = require('sequelize');

const SessionModel = async (sequelize) => {
  await sequelize.define(
    'Session',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.STRING,
        references: {
          model: sequelize.models.User,
          key: 'id',
        },
        allowNull: false,
      },
      accessToken: {
        type: DataTypes.STRING(500),
        allowNull: false,
        unique: true,
      },
      userAgent: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
    }
  );

  await sequelize.sync({});
};

module.exports = { SessionModel };
