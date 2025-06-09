# Gmax - Sistema de Atendimentos

**Gmax** é um sistema de gerenciamento de atendimentos com autenticação, cadastro de clientes e painel administrativo. Desenvolvido em Node.js com MySQL e frontend HTML/CSS/JS puro.

---

## ✅ Funcionalidades

- Autenticação com JWT
- Cadastro e login de usuários
- Controle de acesso (usuário comum vs administrador)
- Cadastro, listagem, edição e exclusão de:
  - Clientes
  - Atendimentos
- Painel administrativo para gerenciamento geral
- API RESTful protegida

---

## 🚀 Tecnologias Utilizadas

- **Node.js**
- **Express**
- **MySQL**
- **JWT (JSON Web Token)**
- **bcryptjs**
- **HTML5, CSS3 e JS puro**
- **fetch API**

---

## ⚙️ Como rodar localmente

1. **Clone o repositório:**

```bash
git clone https://github.com/huanbernardes/gmax.git
cd gmax


2. Instale as dependências:

npm install

3. Configure o banco de dados
    Crie um banco no MySQL com o nome Gmax
    Importe o arquivo script.sql que está na pasta database/ (ou rode os comandos manualmente)
    Altere o usuário e senha no arquivo models/bd_sql.js se necessário
    
4. Inicie o servidor:
 npm start

 5.Acesse no navegador:
 http://localhost:3000
 
 📁 ESTRUTURA DO PROJETO
 ├── database/
│   └── script.sql          # Script para criação do banco
├── models/
│   └── bd_sql.js           # Conexão com o banco de dados
├── routes/
│   └── (rotas da API)
├── public/
│   ├── login.html
│   ├── painel.html
│   └── style.css
├── controllers/
├── app.js
├── package.json
└── README.md

👤 Acesso Admin
O usuário com o e-mail abaixo é administrador por padrão (ajustável no script.sql):
Email: hbacds1@gmail.com
Senha: (defina ao cadastrar)

🔐 Segurança
Tokens JWT são armazenados no localStorage do navegador
Middleware de autenticação protege rotas sensíveis
is_admin no token define permissões

📌 Observações
O sistema pode ser facilmente adaptado para outros contextos (consultórios, agendamentos, etc.)

Não inclui React ou frameworks front-end pesados por escolha didática

