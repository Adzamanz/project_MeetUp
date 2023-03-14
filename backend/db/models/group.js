'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Group.init({
    id: {
      type: DataTypes.INTEGER
    },
    organizerId: {
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING
    },
    about: {
      type: DataTypes.STRING
    },
    type: {
      type: DataTypes.ENUM("In Person", "Virtual")
    },
    private: {
      type: DataTypes.BOOLEAN
    },
    city: {
      type: DataTypes.STRING
    },
    state: {
      type: DataTypes.STRING
    },
    createdAt:{
      type: DataTypes.DATE
    } ,
    updatedAt: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
