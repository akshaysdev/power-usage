const { DataTypes } = require('sequelize');

const { applianceTypeEnum } = require('../../constants');

const PowerUsageModel = async (sequelize) => {
  await sequelize.define(
    'PowerUsage',
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
      fromTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      toTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      duration: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      unitConsumed: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      applianceType: {
        type: DataTypes.ENUM,
        values: applianceTypeEnum,
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
    }
  );

  await sequelize.sync({ });
};

module.exports = { PowerUsageModel };
