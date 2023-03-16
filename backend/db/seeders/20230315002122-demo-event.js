'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Events';
    return queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        venueId: 1,
        name: "The Doctor",
        description: "Weekly talk of the Doctor",
        capacity: 99,
        type: 'In person',
        price: 0,
        startDate: new Date("1695-12-17T11:34:00"),
        endDate: new Date("1695-12-18T11:34:00"),
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['The Doctor'] }
    }, {});
  }
};
