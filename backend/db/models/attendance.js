'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    static associate(models) {
      Attendance.belongsTo(
        models.Event,
        {foreignKey: 'eventId'}
      );
      Attendance.belongsTo(
        models.User,
        {foreignKey: 'userId'}
      );
    }
  }
  Attendance.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    eventId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    status:{
      type: DataTypes.ENUM("Attending","Waitlist","Pending"),
      defaultValue: "Pending",
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Attendance',
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    },
  });
  return Attendance;
};
