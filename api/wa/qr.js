// api/wa/qr.js — stub: WhatsApp bridge requer servidor local
const { sendJson } = require('../../lib/helpers');

module.exports = async (req, res) => {
  return sendJson(res, 503, {
    error: 'WhatsApp bridge não disponível na versão cloud. Use o servidor local (npm start).'
  });
};
