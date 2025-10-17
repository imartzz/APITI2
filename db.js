const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres', // Ex: postgres
  host: process.env.DB_HOST || 'loop.postgres.database.azure.com',
  database: process.env.DB_NAME || 'loop',
  password: process.env.DB_PASSWORD || 'TI2PUCMG!',
  port: process.env.DB_PORT || 5432,
  // Se estiver usando SSL (altamente recomendado no Azure):
  ssl: {
      rejectUnauthorized: process.env.NODE_ENV === 'production' 
  }
});

pool.on('error', (err) => {
  console.error('Erro inesperado no pool do PostgreSQL:', err);
  // Opcional: encerrar o processo para forçar o reinício
  process.exit(-1);
});

// Exporta o pool para que outros arquivos possam executar consultas
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool // Exporta o pool inteiro se precisar de transações complexas
};