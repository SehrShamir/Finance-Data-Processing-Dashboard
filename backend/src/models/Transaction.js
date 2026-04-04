const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const INCOME_CATEGORIES = ['salary', 'freelance', 'investment', 'rental', 'other_income'];
const EXPENSE_CATEGORIES = [
  'food',
  'transport',
  'utilities',
  'housing',
  'healthcare',
  'entertainment',
  'education',
  'shopping',
  'other_expense',
];
const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

const Transaction = sequelize.define(
  'Transaction',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: 0.01,
      },
    },
    type: {
      type: DataTypes.ENUM('income', 'expense'),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [ALL_CATEGORIES],
      },
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    transaction_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    tableName: 'transactions',
    timestamps: true,
    paranoid: true,
  }
);

module.exports = Transaction;
module.exports.INCOME_CATEGORIES = INCOME_CATEGORIES;
module.exports.EXPENSE_CATEGORIES = EXPENSE_CATEGORIES;
module.exports.ALL_CATEGORIES = ALL_CATEGORIES;
