const { conexao } = require('./bd_sql');

class ClienteModel {
    async listarTodos() {
        const [rows] = await conexao.query('SELECT * FROM clientes');
        return rows;
    }

    async buscarPorId(id) {
        const [rows] = await conexao.query('SELECT * FROM clientes WHERE id = ?', [id]);
        return rows[0];
    }

    async criar(cliente) {
        const sql = 'INSERT INTO clientes (nome, email, telefone) VALUES (?, ?, ?)';
        const valores = [cliente.nome, cliente.email, cliente.telefone];
        const [resultado] = await conexao.query(sql, valores);
        return { id: resultado.insertId, ...cliente };
    }

    async atualizar(id, cliente) {
        const sql = 'UPDATE clientes SET nome = ?, email = ?, telefone = ? WHERE id = ?';
        const valores = [cliente.nome, cliente.email, cliente.telefone, id];
        await conexao.query(sql, valores);
        return { id, ...cliente };
    }

    async deletar(id) {
        await conexao.query('DELETE FROM clientes WHERE id = ?', [id]);
        return { mensagem: 'Cliente deletado com sucesso' };
    }
}

module.exports = new ClienteModel();
