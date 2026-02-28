# Imperio HQ - Sistema de Referências

## Objetivo
Armazenar referências de criativos (imagens/vídeos) para inspiração e pesquisa de nichos.

## Uso

```bash
# Adicionar referência
node scripts/ops/hq-references.js add <url> <tipo> <nicho> [tags] [projeto] [notas]

# Listar todas
node scripts/ops/hq-references.js list

# Buscar
node scripts/ops/hq-references.js search <query>

# Deletar
node scripts/ops/hq-references.js delete <id>
```

## Exemplos

```bash
# Adicionar imagem de referência
node scripts/ops/hq-references.js add "https://drive.google.com/..." imagem igaming "slots,bet" "Laíse" "Post optimizado"

# Adicionar vídeo
node scripts/ops/hq-references.js add "https://youtube.com/..." video petselect "dogs,uk" "PetSelectUK" "Reel de пример"

# Buscar por nicho
node scripts/ops/hq-references.js search igaming

# Buscar por tag
node scripts/ops/hq-references.js search slots
```

## Parâmetros

| Parâmetro | Obrigatório | Descrição |
|-----------|-------------|-----------|
| url | Sim | URL da referência (Drive, GitHub, YouTube, etc) |
| tipo | Sim | imagem, video, criativo, outro |
| nicho | Sim | Nicho (igaming, petselect, forex, etc) |
| tags | Não | Tags separadas por vírgula |
| projeto | Não | Projeto vinculado |
| notas | Não | Notas adicionais |

## Arquivo de Dados

`knowledge/hq-references.json`

---
Updated: 2026-02-28
