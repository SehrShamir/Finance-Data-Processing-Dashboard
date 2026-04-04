'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('roles', [
      { id: 1, name: 'viewer', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'analyst', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: 'admin', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
