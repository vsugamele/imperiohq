const fs = require('fs');

let c = fs.readFileSync('src/main.js', 'utf8');

// Find where the window exports end
const windowExportLine = 'window.deleteApiCusto = deleteApiCusto;';
const endIdx = c.lastIndexOf(windowExportLine);

if (endIdx > 0) {
    // Find where my code starts
    const afterExports = c.indexOf('// AI Cost Supabase Sync', endIdx);
    if (afterExports > 0) {
        // Remove my added code
        c = c.substring(0, afterExports);
    }
    
    // Add the function properly before the final }
    const codeToAdd = `
// Supabase API Costs Sync
window.refreshApiCostsFromSupabase = async function() {
  try {
    const { data } = await window.SB._sb.from('imperio_custos').select('*');
    if (data && data.length > 0) {
      alert('Encontrados ' + data.length + ' custos!');
      location.reload();
    } else {
      alert('Nenhum custo encontrado');
    }
  } catch(e) {
    alert('Erro: ' + e.message);
  }
};
console.log('[HQ] Supabase sync ready');
`;
    
    c = c.trimEnd() + '\n' + codeToAdd;
    fs.writeFileSync('src/main.js', c);
    console.log('Fixed - removed duplicates and added proper function');
} else {
    console.log('Could not find export line');
}
