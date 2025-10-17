const express = require('express');
const db = require('./config/db'); // Importa a configuração de conexão
const app = express();
const PORT = process.env.PORT || 8080; // Usa a porta do ambiente ou 8080

// Middleware para processar JSON (se você for usar rotas POST/PUT)
app.use(express.json());

// ------------------------------------------------------------------
// ROTA DE TESTE DE BANCO DE DADOS (CORRIGE O "Cannot GET /db-test")
// ------------------------------------------------------------------
app.get('/db-test', async (req, res) => {
    try {
        // Consulta simples para testar a conexão com o PostgreSQL
        const result = await db.query('SELECT current_timestamp;');

        res.status(200).json({
            status: 'Conexão com Banco de Dados PostgreSQL OK',
            timestamp_servidor_bd: result.rows[0].current_timestamp
        });
    } catch (error) {
        console.error('Falha ao conectar ou consultar o BD:', error);
        // Retorna 500 (Erro Interno do Servidor) se a conexão falhar
        res.status(500).json({
            status: 'ERRO: Falha na Conexão com o Banco de Dados',
            detalhes: error.message,
            dica: 'Verifique as credenciais no Azure (DB_HOST, DB_USER, etc.) e o IP do Firewall.'
        });
    }
});

// ------------------------------------------------------------------
// ROTA PRINCIPAL (EXEMPLO DE ROTA DE NEGÓCIO)
// ------------------------------------------------------------------
app.get('/', (req, res) => {
    res.send('API está no ar. Use /db-test para verificar a conexão com o BD.');
});


// ------------------------------------------------------------------
// ROTA PARA BUSCAR TODOS OS USUÁRIOS (EXEMPLO DE USO DAS SUAS TABELAS)
// ------------------------------------------------------------------
app.get('/api/usuarios', async (req, res) => {
    try {
        // Faz uma consulta na tabela 'usuario' do seu DER
        const result = await db.query('SELECT id, nome, email, created_at FROM usuario;');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ erro: 'Não foi possível buscar usuários.' });
    }
});


// ------------------------------------------------------------------
// INICIALIZAÇÃO DO SERVIDOR
// ------------------------------------------------------------------
app.listen(PORT, () => {
    console.log(`Servidor Express rodando na porta ${PORT}`);
});