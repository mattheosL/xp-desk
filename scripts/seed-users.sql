-- Contas de teste para o banco if-project.
-- A senha precisa ser md5(texto), igual ao INSERT do backend.
-- Username: 3 a 10 caracteres. Senha: 4 a 8 caracteres.
--
-- psql -h localhost -U postgres -d if-project -f scripts/seed-users.sql

INSERT INTO users (username, email, password_hash)
VALUES
    ('mateus', 'mateus@ifce.edu.br', md5('1234')),
    ('maria',  'maria@ifce.edu.br',  md5('1234')),
    ('joao',   'joao@ifce.edu.br',   md5('1234')),
    ('ana',    'ana@ifce.edu.br',    md5('1234'))
ON CONFLICT (email) DO NOTHING;
