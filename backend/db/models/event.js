'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsToMany(
        models.User,
          {
            through: models.Attendance,
            foreignKey: 'eventId',
            otherKey: 'userId',
          }
      );
      Event.belongsTo(
        models.Group,
        {foreignKey: 'groupId'}
      );
      Event.belongsTo(
        models.Venue,
        {foreignKey: 'venueId'}
      );
      Event.hasMany(
        models.EventImage,
        {foreignKey: 'eventId', hooks: true}
      );
    }
  }
  Event.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    groupId: DataTypes.INTEGER,
    venueId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    capacity: DataTypes.INTEGER,
    type: DataTypes.ENUM('Online', 'In person'),
    price: DataTypes.FLOAT,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
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
    modelName: 'Event',
  });
  return Event;
};
