'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface) {
    const password = await bcrypt.hash('password123', 12);
    const now = new Date();

    await queryInterface.bulkInsert('users', [
      {
        role_id: 3,
        name: 'Admin User',
        email: 'admin@example.com',
        password_hash: password,
        is_active: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        role_id: 2,
        name: 'Analyst User',
        email: 'analyst@example.com',
        password_hash: password,
        is_active: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        role_id: 1,
        name: 'Viewer User',
        email: 'viewer@example.com',
        password_hash: password,
        is_active: true,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
