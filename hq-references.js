/**
 * Imperio HQ - References System
 * 
 * Armazena referências de criativos (imagens/vídeos) para inspiration
 * URL: https://api/githubusercontent ou Drive
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../../knowledge/hq-references.json');

function loadReferences() {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveReferences(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// CLI commands
const args = process.argv.slice(2);
const cmd = args[0];

if (cmd === 'add') {
  // add <url> <tipo> <nicho> [tags] [projeto] [notas]
  const refs = loadReferences();
  const newRef = {
    id: Date.now().toString(36),
    url: args[1],
    tipo: args[2] || 'criativo',
    nicho: args[3] || '',
    tags: args[4] ? args[4].split(',') : [],
    projeto_vinculado: args[4] || '',
    notas: args.slice(5).join(' ') || '',
    created_at: new Date().toISOString()
  };
  refs.push(newRef);
  saveReferences(refs);
  console.log('✓ Reference added:', newRef.id);
  
} else if (cmd === 'list') {
  const refs = loadReferences();
  console.log(`Total: ${refs.length} references`);
  refs.forEach(r => {
    console.log(`- [${r.tipo}] ${r.nicho} | ${r.url.substring(0, 50)}...`);
  });
  
} else if (cmd === 'search') {
  const query = args.slice(1).join(' ').toLowerCase();
  const refs = loadReferences();
  const results = refs.filter(r => 
    r.nicho.toLowerCase().includes(query) ||
    r.tags.some(t => t.toLowerCase().includes(query)) ||
    r.projeto_vinculado.toLowerCase().includes(query)
  );
  console.log(`Found ${results.length} results:`);
  results.forEach(r => console.log(`- ${r.url}`));
  
} else if (cmd === 'delete') {
  const id = args[1];
  const refs = loadReferences();
  const filtered = refs.filter(r => r.id !== id);
  saveReferences(filtered);
  console.log('✓ Deleted:', id);
  
} else {
  console.log(`
Imperio HQ References
=====================
Usage: node hq-references.js [command]

Commands:
  add <url> <tipo> <nicho> [tags] [projeto] [notas]
    Example: node hq-references.js add "https://..." imagem igaming "igaming,slots" "Laíse" "notas aqui"
  
  list                              - List all references
  search <query>                    - Search references
  delete <id>                       - Delete by ID

Tipos: imagem, video, criativo, outro
  `);
}
