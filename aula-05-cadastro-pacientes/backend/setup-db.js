// Cria a tabela "pacientes" no Supabase e insere os dados iniciais.
// Uso: npm run db:setup  (pode ser executado várias vezes sem duplicar nada)
const pool = require('./db');

const PACIENTES_INICIAIS = [
	['Maria Silva', 'maria.silva@email.com', '1990-04-12'],
	['João Pereira', 'joao.pereira@email.com', '1985-11-30'],
	['Ana Costa', 'ana.costa@email.com', '2001-07-08'],
];

async function configurarBanco() {
	try {
		await pool.query(`
			CREATE TABLE IF NOT EXISTS pacientes (
				id SERIAL PRIMARY KEY,
				nome VARCHAR(100) NOT NULL,
				email VARCHAR(150) NOT NULL,
				nascimento DATE NOT NULL
			)
		`);

		// E-mail único, sem diferenciar maiúsculas de minúsculas
		await pool.query(`
			CREATE UNIQUE INDEX IF NOT EXISTS pacientes_email_unico
			ON pacientes (LOWER(email))
		`);

		// Só insere os dados iniciais se a tabela estiver vazia
		const { rows } = await pool.query('SELECT COUNT(*)::int AS total FROM pacientes');
		if (rows[0].total === 0) {
			for (const [nome, email, nascimento] of PACIENTES_INICIAIS) {
				await pool.query(
					'INSERT INTO pacientes (nome, email, nascimento) VALUES ($1, $2, $3)',
					[nome, email, nascimento]
				);
			}
			console.log(`${PACIENTES_INICIAIS.length} pacientes iniciais inseridos.`);
		}

		console.log('Tabela "pacientes" pronta.');
	} catch (erro) {
		console.error('Erro ao configurar o banco:', erro.message);
		process.exitCode = 1;
	} finally {
		await pool.end(); // encerra a conexão para o script terminar
	}
}

configurarBanco();
