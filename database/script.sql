-- Cria o banco de dados se ainda não existir
CREATE DATABASE IF NOT EXISTS Gmax;
USE Gmax;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE
);

-- Tabela de clientes
CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  telefone VARCHAR(20),
  usuario_id INT,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabela de atendimentos
CREATE TABLE IF NOT EXISTS atendimentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  data DATE NOT NULL,
  hora TIME NOT NULL,
  servico VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'pendente',
  cliente_id INT NOT NULL,
  usuario_id INT NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

-- Torna um usuário específico administrador
UPDATE usuarios SET is_admin = true WHERE email = "hbacds1@gmail.com";

-- Consultas para verificar dados
SELECT * FROM usuarios;
SELECT * FROM clientes;
SELECT * FROM atendimentos;

-- Consulta com JOIN para visualização completa no painel admin
SELECT 
  a.id,
  a.data,
  a.hora,
  a.servico,
  a.status,
  c.nome AS nome_cliente,
  c.telefone AS telefone_cliente,
  u.nome AS nome_usuario
FROM atendimentos a
JOIN clientes c ON a.cliente_id = c.id
JOIN usuarios u ON a.usuario_id = u.id;
