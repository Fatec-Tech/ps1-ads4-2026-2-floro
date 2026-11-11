const express = require('express');
const cors = require('cors');
const pool = require('./db'); // conexão com o PostgreSQL (Supabase)

const app = express();

app.use(cors());
app.use(express.json());

// ---------- Auxiliares ----------

// to_char devolve a data como texto "AAAA-MM-DD". Sem isso o driver converteria o DATE
// em um objeto Date do JavaScript e o JSON sairia com horário e fuso (ex.: 1990-04-12T03:00:00.000Z).
const COLUNAS = `id, nome, email, to_char(nascimento, 'YYYY-MM-DD') AS nascimento`;

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function nascimentoValido(nascimento) {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(nascimento)) return false;
	const [ano, mes, dia] = nascimento.split('-').map(Number);
	const data = new Date(ano, mes - 1, dia);
	// O JavaScript "corrige" datas inexistentes (31/02 vira 03/03); comparar de volta as rejeita
	if (
		data.getFullYear() !== ano ||
		data.getMonth() !== mes - 1 ||
		data.getDate() !== dia
	) {
		return false;
	}
	const hoje = new Date();
	hoje.setHours(0, 0, 0, 0);
	return data <= hoje;
}

// Valida os campos. Devolve { status, erro } se houver problema, ou null se estiver tudo certo.
function validarCampos({ nome, email, nascimento }) {
	if (!nome || !email || !nascimento) {
		return { status: 400, erro: 'Nome, e-mail e nascimento são obrigatórios' };
	}
	if (!REGEX_EMAIL.test(email)) {
		return { status: 400, erro: 'Formato de e-mail inválido' };
	}
	if (!nascimentoValido(nascimento)) {
		return { status: 400, erro: 'Data de nascimento inválida ou no futuro' };
	}
	return null;
}

// Converte o :id da URL em número inteiro válido para o banco (ou null)
function lerId(texto) {
	const id = Number(texto);
	return Number.isInteger(id) && id > 0 && id <= 2147483647 ? id : null;
}

// Envolve cada rota para tratar erros do banco sem derrubar o servidor
function rota(funcao) {
	return (req, res) => {
		Promise.resolve(funcao(req, res)).catch((erro) => {
			// 23505 = violação de UNIQUE no PostgreSQL (e-mail repetido)
			if (erro.code === '23505') {
				return res.status(409).json({ erro: 'E-mail já cadastrado' });
			}
			console.error('Erro na rota:', erro);
			res.status(500).json({ erro: 'Erro interno do servidor' });
		});
	};
}

// ---------- Rotas ----------

// READ (lista) — GET /pacientes  (aceita ?nome=ana)
app.get(
	'/pacientes',
	rota(async (req, res) => {
		const { nome } = req.query;

		if (nome) {
			// Escapa % e _ para que sejam tratados como texto comum no ILIKE
			const termo = String(nome).trim().replace(/[\\%_]/g, '\\$&');
			const { rows } = await pool.query(
				`SELECT ${COLUNAS} FROM pacientes WHERE nome ILIKE $1 ORDER BY id`,
				[`%${termo}%`]
			);
			return res.json(rows);
		}

		const { rows } = await pool.query(`SELECT ${COLUNAS} FROM pacientes ORDER BY id`);
		res.json(rows);
	})
);

// READ (total) — GET /pacientes/total (antes de '/pacientes/:id', senão "total" vira um id)
app.get(
	'/pacientes/total',
	rota(async (req, res) => {
		const { rows } = await pool.query('SELECT COUNT(*)::int AS total FROM pacientes');
		res.json({ total: rows[0].total });
	})
);

// READ (um) — GET /pacientes/:id
app.get(
	'/pacientes/:id',
	rota(async (req, res) => {
		const id = lerId(req.params.id);
		const { rows } = id
			? await pool.query(`SELECT ${COLUNAS} FROM pacientes WHERE id = $1`, [id])
			: { rows: [] };

		if (rows.length === 0) {
			return res.status(404).json({ erro: 'Paciente não encontrado' });
		}
		res.json(rows[0]);
	})
);

// CREATE — POST /pacientes
app.post(
	'/pacientes',
	rota(async (req, res) => {
		const { nome, email, nascimento } = req.body ?? {};

		const problema = validarCampos({ nome, email, nascimento });
		if (problema) return res.status(problema.status).json({ erro: problema.erro });

		// Os valores vão como parâmetros ($1, $2, $3): nunca concatene texto do usuário no SQL
		// (isso evitaria SQL Injection).
		const { rows } = await pool.query(
			`INSERT INTO pacientes (nome, email, nascimento)
			 VALUES ($1, $2, $3)
			 RETURNING ${COLUNAS}`,
			[nome, email, nascimento]
		);

		res.status(201).json(rows[0]);
	})
);

// UPDATE (completo) — PUT /pacientes/:id
app.put(
	'/pacientes/:id',
	rota(async (req, res) => {
		const id = lerId(req.params.id);
		if (!id) return res.status(404).json({ erro: 'Paciente não encontrado' });

		const { nome, email, nascimento } = req.body ?? {};

		const problema = validarCampos({ nome, email, nascimento });
		if (problema) return res.status(problema.status).json({ erro: problema.erro });

		const { rows } = await pool.query(
			`UPDATE pacientes SET nome = $1, email = $2, nascimento = $3
			 WHERE id = $4
			 RETURNING ${COLUNAS}`,
			[nome, email, nascimento, id]
		);

		if (rows.length === 0) {
			return res.status(404).json({ erro: 'Paciente não encontrado' });
		}
		res.json(rows[0]);
	})
);

// UPDATE (parcial) — PATCH /pacientes/:id
app.patch(
	'/pacientes/:id',
	rota(async (req, res) => {
		const id = lerId(req.params.id);
		if (!id) return res.status(404).json({ erro: 'Paciente não encontrado' });

		const campos = req.body ?? {};
		const enviados = ['nome', 'email', 'nascimento'].filter((c) => campos[c] !== undefined);
		if (enviados.length === 0) {
			return res
				.status(400)
				.json({ erro: 'Envie ao menos um campo: nome, email ou nascimento' });
		}

		const atual = await pool.query(`SELECT ${COLUNAS} FROM pacientes WHERE id = $1`, [id]);
		if (atual.rows.length === 0) {
			return res.status(404).json({ erro: 'Paciente não encontrado' });
		}

		// Valida o resultado final (campos novos + os que já existiam)
		const resultado = { ...atual.rows[0], ...campos };
		const problema = validarCampos(resultado);
		if (problema) return res.status(problema.status).json({ erro: problema.erro });

		const { rows } = await pool.query(
			`UPDATE pacientes SET nome = $1, email = $2, nascimento = $3
			 WHERE id = $4
			 RETURNING ${COLUNAS}`,
			[resultado.nome, resultado.email, resultado.nascimento, id]
		);
		res.json(rows[0]);
	})
);

// DELETE — DELETE /pacientes/:id
app.delete(
	'/pacientes/:id',
	rota(async (req, res) => {
		const id = lerId(req.params.id);
		const resultado = id
			? await pool.query('DELETE FROM pacientes WHERE id = $1', [id])
			: { rowCount: 0 };

		if (resultado.rowCount === 0) {
			return res.status(404).json({ erro: 'Paciente não encontrado' });
		}
		res.status(204).send();
	})
);

const PORTA = process.env.PORT || 3000;

app.listen(PORTA, () => {
	console.log(`Servidor rodando na porta ${PORTA}`);
});
