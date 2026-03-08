// api/r/[slug].js — redirect de link de rastreio
const { handleTrackerRedirect } = require('../../lib/tracker-server');

module.exports = async (req, res) => {
  const slug = req.query.slug || '';
  return handleTrackerRedirect(req, res, slug);
};
