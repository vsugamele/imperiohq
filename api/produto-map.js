// api/produto-map.js — retorna mapa produto_id_ext → project_id
const { sendJson } = require('../lib/helpers');
const { loadProdutoMap } = require('../lib/projeto');

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHead(204);
    return res.end();
  }

  if (req.method === 'GET') {
    try {
      const map = await loadProdutoMap();
      return sendJson(res, 200, map);
    } catch (err) {
      return sendJson(res, 500, { error: String(err) });
    }
  }

  return sendJson(res, 405, { error: 'Method not allowed' });
};
