-- Cria o banco se não existir
CREATE DATABASE IF NOT EXISTS Profitalo;
USE Profitalo;

-- Tabela de atendimentos
CREATE TABLE IF NOT EXISTS atendimentos (
       id INT PRIMARY KEY AUTO_INCREMENT,
       data_atendimento DATE,
       hora TIME,
       servico VARCHAR(100),
       cliente VARCHAR(100)
     )

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  telefone VARCHAR(20)
);




UPDATE usuarios SET is_admin = true WHERE email = "hbacds1@gmail.com";