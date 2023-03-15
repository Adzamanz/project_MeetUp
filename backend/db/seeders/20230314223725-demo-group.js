'use strict';


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    options.tableName = 'Groups';
    return queryInterface.bulkInsert(options, [
      {
        organizerId: 1,
        name: 'Time Travellers Anonymous',
        about: "For the ones addicted to time travel",
        type: 2,
        private: true,
        city: "Los Angeles",
        state: "Denial",
      },
      {
        organizerId: 2,
        name: 'Pickle Rick Fandom',
        about: "PICKLE RIIIIIIIIIICK",
        type: 1,
        private: false,
        city: "Denver",
        state: "Decay",
      }
    ])

  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [] }
    }, {});
  }
};
