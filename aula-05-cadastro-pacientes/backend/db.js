// Conexão com o PostgreSQL (Supabase).
// As credenciais NUNCA ficam no código: vêm de variáveis de ambiente
// (arquivo .env localmente, aba Environment no Render).
require('dotenv').config();
const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
	console.error(
		'Variável DATABASE_URL não definida. Crie o arquivo .env (veja .env.example).'
	);
	process.exit(1);
}

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	// O Supabase exige conexão criptografada (SSL). Com DB_SSL=true ligamos o SSL.
	// rejectUnauthorized: false aceita o certificado do pooler sem validar a cadeia,
	// o que é comum em ambiente de estudo; em produção real prefira validar o certificado.
	ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

module.exports = pool;
