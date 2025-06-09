const { conexao } = require('./bd_sql');

module.exports = {
  listar: async (usuario_id, is_admin) => {
    let sql = `
    SELECT 
      a.id, a.data, a.hora, a.servico, a.usuario_id, a.cliente_id,
      c.nome AS nome_cliente, c.telefone AS telefone_cliente
    FROM atendimentos a
    LEFT JOIN clientes c ON a.cliente_id = c.id
  `;
    let params = [];

    if (!is_admin) {
      sql += ' WHERE a.usuario_id = ?';
      params.push(usuario_id);
    }

    const [result] = await conexao.query(sql, params);
    return result;
  },

  criar: async (data, hora, servico, cliente_id, usuario_id) => {
    const [result] = await conexao.query(
      'INSERT INTO atendimentos (data, hora, servico, cliente_id, usuario_id) VALUES (?, ?, ?, ?, ?)',
      [data, hora, servico, cliente_id, usuario_id]
    );
    return result;
  },

  buscarPorId: async (id, usuario_id, is_admin) => {
    let sql = 'SELECT * FROM atendimentos WHERE id = ?';
    let params = [id];

    if (!is_admin) {
      sql += ' AND usuario_id = ?';
      params.push(usuario_id);
    }

    const [result] = await conexao.query(sql, params);
    return result;
  },

  atualizar: async (id, data, servico, cliente_id, hora) => {
    const sql = 'UPDATE atendimentos SET data = ?, servico = ?, cliente_id = ?, hora = ? WHERE id = ?';
    const [result] = await conexao.query(sql, [data, servico, cliente_id, hora, id]);
    return result;
  },

  deletar: async (id) => {
    const [result] = await conexao.query('DELETE FROM atendimentos WHERE id = ?', [id]);
    return result;
  },

  verificarDono: async (id) => {
    const [result] = await conexao.query('SELECT * FROM atendimentos WHERE id = ?', [id]);
    return result;
  }
};
