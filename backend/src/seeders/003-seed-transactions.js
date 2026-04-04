'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    const [users] = await queryInterface.sequelize.query(
      "SELECT id, email FROM users WHERE email IN ('admin@example.com', 'analyst@example.com')"
    );

    const adminId = users.find((u) => u.email === 'admin@example.com')?.id;
    const analystId = users.find((u) => u.email === 'analyst@example.com')?.id;

    if (!adminId || !analystId) return;

    const transactions = [];

    for (let monthOffset = 5; monthOffset >= 0; monthOffset--) {
      const date = new Date();
      date.setMonth(date.getMonth() - monthOffset);

      transactions.push(
        {
          user_id: adminId,
          amount: 5000.0,
          type: 'income',
          category: 'salary',
          description: 'Monthly salary',
          transaction_date: new Date(date.getFullYear(), date.getMonth(), 1),
          createdAt: now,
          updatedAt: now,
        },
        {
          user_id: analystId,
          amount: 3500.0,
          type: 'income',
          category: 'salary',
          description: 'Monthly salary',
          transaction_date: new Date(date.getFullYear(), date.getMonth(), 1),
          createdAt: now,
          updatedAt: now,
        },
        {
          user_id: adminId,
          amount: Math.round(Math.random() * 800 + 200),
          type: 'income',
          category: 'freelance',
          description: 'Freelance project',
          transaction_date: new Date(date.getFullYear(), date.getMonth(), 15),
          createdAt: now,
          updatedAt: now,
        }
      );

      const expenseCategories = ['food', 'transport', 'utilities', 'housing', 'entertainment', 'shopping'];
      expenseCategories.forEach((category, i) => {
        const amounts = { food: 400, transport: 150, utilities: 120, housing: 1200, entertainment: 200, shopping: 300 };
        transactions.push({
          user_id: i % 2 === 0 ? adminId : analystId,
          amount: amounts[category] + Math.round(Math.random() * 50),
          type: 'expense',
          category,
          description: `${category} expenses`,
          transaction_date: new Date(date.getFullYear(), date.getMonth(), 10 + i),
          createdAt: now,
          updatedAt: now,
        });
      });
    }

    await queryInterface.bulkInsert('transactions', transactions);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('transactions', null, {});
  },
};
