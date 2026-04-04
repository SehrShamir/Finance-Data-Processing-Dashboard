const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

const getPaginationMeta = (count, page, limit) => ({
  total: count,
  page,
  limit,
  totalPages: Math.ceil(count / limit),
  hasNext: page * limit < count,
  hasPrev: page > 1,
});

module.exports = { getPagination, getPaginationMeta };
