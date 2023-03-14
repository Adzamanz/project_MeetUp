'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendence extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Attendence.belongsTo(
        models.Event,
        {foreignKey: 'eventId'}
      );
      Attendence.belongsTo(
        models.User,
        {foreignKey: 'userId'}
      );
    }
  }
  Attendence.init({
    id: DataTypes.INTEGER,
    eventId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    status: DataTypes.ENUM,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Attendence',
  });
  return Attendence;
};