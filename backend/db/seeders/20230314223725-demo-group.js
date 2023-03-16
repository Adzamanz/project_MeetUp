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
        type: "In person",
        private: true,
        city: "Los Angeles",
        state: "Denial",
      },
      {
        organizerId: 2,
        name: 'Pickle Rick Fandom',
        about: "PICKLE RIIIIIIIIIICK",
        type: "In person",
        private: false,
        city: "Denver",
        state: "Decay",
      }
    ])

  },

  async down (queryImnterface, Sequelize) {

    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Time Travellers Anonymous', 'Pickle Rick Fandom'] }
    }, {});
  }
};
