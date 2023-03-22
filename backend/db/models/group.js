'use strict';
const {
  Model
} = require('sequelize');
// const { all } = require('../../routes');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

        Group.belongsToMany(
          models.User,
            {
              through: models.Membership,
              foreignKey: 'groupId',
              otherKey: 'userId',
            }
        );
        Group.hasMany(
          models.GroupImage,
          {foreignKey: 'groupId', hooks: true}
        );
        Group.hasMany(
          models.Venue,
          {foreignKey: 'groupId', hooks: true}
        );
        Group.hasMany(
          models.Event,
          {foreignKey: 'groupId', hooks: true}
        );

    }
  }
  Group.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
    name: {
      type: DataTypes.STRING
    },
    about: {
      type: DataTypes.STRING
    },
    type: {
      type: DataTypes.ENUM("Online", "In-person")
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
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
    modelName: 'Group',
  });
  return Group;
};
