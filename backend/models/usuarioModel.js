const { conexao } = require('./bd_sql');  // ou 'db' se seu arquivo usa esse nome

async function criar({ nome, email, senha }) {
  const [result] = await conexao.query(
    'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
    [nome, email, senha]
  );
  return { id: result.insertId, nome, email };
}

async function buscarPorEmail(email) {
  const [rows] = await conexao.query('SELECT * FROM usuarios WHERE email = ?', [email]);
  return rows[0];
}

module.exports = {
  criar,
  buscarPorEmail
};
