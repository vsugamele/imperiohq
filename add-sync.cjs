// Add Supabase sync to main.js
const fs = require('fs');
const path = require('path');

const mainPath = path.join(process.cwd(), 'src', 'main.js');

const code = `

// Supabase API Costs Sync
window.refreshApiCostsFromSupabase = async function() {
  try {
    const { data } = await window.SB._sb.from('imperio_custos').select('*');
    if (data && data.length > 0) {
      alert('Encontrados ' + data.length + ' registros no Supabase!');
      location.reload();
    } else {
      alert('Nenhum custo encontrado');
    }
  } catch(e) {
    alert('Erro: ' + e.message);
  }
};
console.log('[HQ] Supabase sync loaded');
`;

fs.appendFileSync(mainPath, code);
console.log('Added to main.js');
