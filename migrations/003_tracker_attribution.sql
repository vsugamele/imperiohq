-- Fase 3B: Attribution fields
-- Rodar no Supabase Dashboard → SQL Editor

-- 1. Adiciona campos de atribuição em imphq_vendas
ALTER TABLE imphq_vendas
  ADD COLUMN IF NOT EXISTS click_id     TEXT,
  ADD COLUMN IF NOT EXISTS utm_source   TEXT,
  ADD COLUMN IF NOT EXISTS utm_medium   TEXT,
  ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
  ADD COLUMN IF NOT EXISTS utm_content  TEXT,
  ADD COLUMN IF NOT EXISTS utm_term     TEXT;

-- 2. Adiciona converted_at em imphq_clicks
ALTER TABLE imphq_clicks
  ADD COLUMN IF NOT EXISTS converted_at TIMESTAMPTZ;

-- 3. Índices de performance
CREATE INDEX IF NOT EXISTS idx_imphq_vendas_click_id
  ON imphq_vendas(click_id);

CREATE INDEX IF NOT EXISTS idx_imphq_clicks_link_convertido
  ON imphq_clicks(link_id, convertido);
