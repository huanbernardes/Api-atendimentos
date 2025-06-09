const mysql = require('mysql2/promise');

const conexao = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Gmax'
});

class Tabelas {
    async init() {
    await this.criarTabelaUsuarios();
    await this.criarTabelaClientes(); 
    await this.criarTabelaAtendimentos();
}

    async criarTabelaAtendimentos() {
        const sql = `
            CREATE TABLE IF NOT EXISTS atendimentos (
            id INT PRIMARY KEY AUTO_INCREMENT,
            data DATE,
            hora TIME,
            servico VARCHAR(100),
            cliente_id INT,
            usuario_id INT,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
            FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL
        )
        `;
        try {
            await conexao.query(sql);
            console.log("Tabela atendimentos criada com sucesso");
        } catch (err) {
            console.log("Erro ao criar tabela atendimentos:", err.message);
        }
    }

    async criarTabelaUsuarios() {
        const sql = `
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                senha VARCHAR(255) NOT NULL,
                is_admin BOOLEAN DEFAULT FALSE
            )
        `;
        try {
            await conexao.query(sql);
            console.log("Tabela usuarios criada com sucesso");
        } catch (err) {
            console.log("Erro ao criar tabela usuarios:", err.message);
        }
    }

    async criarTabelaClientes() {
        const sql = `
            CREATE TABLE IF NOT EXISTS clientes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                telefone VARCHAR(20),
                usuario_id INT,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
            )
        `;
        try {
            await conexao.query(sql);
            console.log("Tabela clientes criada com sucesso");
        } catch (err) {
            console.log("Erro ao criar tabela clientes:", err.message);
        }
    }
}

const tabelas = new Tabelas();
module.exports = { conexao, tabelas };
