const { DataTypes } = require('sequelize');

const SessionModel = async (sequelize) => {
  await sequelize.define(
    'Session',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        references: {
          model: 'User',
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
