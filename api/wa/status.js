// api/wa/status.js — stub: WhatsApp bridge requer servidor local
const { sendJson } = require('../../lib/helpers');

module.exports = async (req, res) => {
  return sendJson(res, 200, {
    connected: false,
    message:   'WhatsApp bridge não disponível na versão cloud. Use o servidor local (npm start).'
  });
};
