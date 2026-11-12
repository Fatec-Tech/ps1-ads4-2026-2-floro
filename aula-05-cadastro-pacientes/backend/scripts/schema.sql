CREATE TABLE IF NOT EXISTS pacientes (
  id         SERIAL PRIMARY KEY,
  nome       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL UNIQUE,
  nascimento DATE         NOT NULL
);

-- Exercício 4: CREATE TABLE IF NOT EXISTS não altera uma tabela que já existe,
-- então a coluna nova entra com ALTER TABLE (IF NOT EXISTS permite rodar de novo).
ALTER TABLE pacientes ADD COLUMN IF NOT EXISTS telefone VARCHAR(20);

-- Dados iniciais (os mesmos das aulas anteriores)
-- ON CONFLICT DO NOTHING (sem indicar a coluna) ignora qualquer linha que viole uma restrição UNIQUE.
INSERT INTO pacientes (nome, email, nascimento) VALUES
  ('Maria Silva',  'maria.silva@email.com',  '1990-04-12'),
  ('João Pereira', 'joao.pereira@email.com', '1985-11-30'),
  ('Ana Costa',    'ana.costa@email.com',    '2001-07-08')
ON CONFLICT DO NOTHING;
