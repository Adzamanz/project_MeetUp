'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EventImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      EventImage.belongsTo(
        models.Event,
        {foreignKey: 'eventId'}
      );
    }
  }
  EventImage.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    eventId: DataTypes.INTEGER,
    url: DataTypes.STRING,
    preview: DataTypes.BOOLEAN,
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
    modelName: 'EventImage',
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    },
    scopes: {
      basic: {
        attributes: {
          exclude: ["eventId","createdAt", "updatedAt"]
        }
      }
    }
  });
  return EventImage;
};
