const dashboardService = require('../services/dashboard.service');
const { success } = require('../utils/ApiResponse');

const summary = async (req, res) => {
  const data = await dashboardService.getSummary(req.query, req.user);
  return success(res, data);
};

const trends = async (req, res) => {
  const data = await dashboardService.getTrends(req.query, req.user);
  return success(res, data);
};

const categories = async (req, res) => {
  const data = await dashboardService.getCategories(req.query, req.user);
  return success(res, data);
};

const recent = async (req, res) => {
  const data = await dashboardService.getRecent(req.user);
  return success(res, data);
};

module.exports = { summary, trends, categories, recent };
