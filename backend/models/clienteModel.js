const db = require('../models/bd_sql').conexao;

module.exports = {
  async listarTodos() {
    const [results] = await db.query('SELECT * FROM clientes');
    return results;
  },

  async listarPorUsuario(usuario_id) {
    const [result] = await db.query(
      'SELECT id, nome, email, telefone FROM clientes WHERE usuario_id = ?',
      [usuario_id]
    );
    return result;
  },

  async buscarPorUsuarioId(usuario_id) {
    const [result] = await db.query(
      'SELECT id, nome, email, telefone FROM clientes WHERE usuario_id = ?',
      [usuario_id]
    );
    return result[0]; // Retorna apenas 1 cliente vinculado ao usuário
  },

  async buscarPorId(id) {
    const [results] = await db.query('SELECT * FROM clientes WHERE id = ?', [id]);
    return results[0]; // retorna só o primeiro
  },

  async criar({ nome, email, telefone, usuario_id }) {
    console.log('SALVANDO CLIENTE NO BANCO...');
    console.log('Dados:', nome, email, telefone, usuario_id);

    const [result] = await db.query(
      'INSERT INTO clientes (nome, email, telefone, usuario_id) VALUES (?, ?, ?, ?)',
      [nome, email, telefone, usuario_id]
    );

    return { id: result.insertId, nome, email, telefone, usuario_id };
  },

  async atualizar(id, dados) {
    const [result] = await db.query(
      'UPDATE clientes SET nome = ?, email = ?, telefone = ? WHERE id = ?',
      [dados.nome, dados.email, dados.telefone, id]
    );

    if (result.affectedRows === 0)
      throw new Error('Cliente não encontrado');

    return { id, ...dados };
  },

  async deletar(id) {
    const [result] = await db.query('DELETE FROM clientes WHERE id = ?', [id]);
    if (result.affectedRows === 0)
      throw new Error('Cliente não encontrado');
  }
};
