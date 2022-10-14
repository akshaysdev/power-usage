const { DataTypes } = require('sequelize');

/**
 * It creates a table called Session with the following columns: id, userId, accessToken, userAgent,
 * createdAt, and updatedAt
 * @param sequelize - The sequelize instance
 */
const SessionModel = async (sequelize) => {
  const Session = await sequelize.define(
    'Session',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        unique: true,
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
      indexes: [
        {
          unique: false,
          fields: ['userId', 'userAgent'],
        },
      ],
    }
  );

  await Session.sync({ alter: { drop: false } });
};

module.exports = { SessionModel };
