const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares: rodam antes de todas as rotas
app.use(cors()); // libera o acesso do frontend (outra origem)
app.use(express.json()); // converte o body JSON em objeto, disponível em req.body

// "Banco de dados" em memória (será substituído na Aula 5)
// Atenção: a API é pública. Não cadastre dados pessoais ou reais.
const pacientes = [
	{
		id: 1,
		nome: 'Maria Silva',
		email: 'maria.silva@email.com',
		nascimento: '1990-04-12',
	},
	{
		id: 2,
		nome: 'João Pereira',
		email: 'joao.pereira@email.com',
		nascimento: '1985-11-30',
	},
	{
		id: 3,
		nome: 'Ana Costa',
		email: 'ana.costa@email.com',
		nascimento: '2001-07-08',
	},
];
let proximoId = 4;

// ---------- Funções auxiliares de validação ----------

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function emailValido(email) {
	return REGEX_EMAIL.test(email);
}

// Aceita apenas datas reais no formato AAAA-MM-DD que não estejam no futuro
function nascimentoValido(nascimento) {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(nascimento)) return false;

	const data = new Date(`${nascimento}T00:00:00`);
	if (Number.isNaN(data.getTime())) return false;

	const hoje = new Date();
	hoje.setHours(0, 0, 0, 0);
	return data <= hoje;
}

function emailJaCadastrado(email, ignorarId = null) {
	const alvo = email.trim().toLowerCase();
	return pacientes.some(
		(p) => p.id !== ignorarId && p.email.trim().toLowerCase() === alvo
	);
}

// Valida os campos recebidos. Devolve uma mensagem de erro ou null se estiver tudo certo.
// Retorna também o status HTTP apropriado (400 = requisição inválida, 409 = conflito).
function validarCampos({ nome, email, nascimento }, ignorarId = null) {
	if (!nome || !email || !nascimento) {
		return {
			status: 400,
			erro: 'Nome, e-mail e nascimento são obrigatórios',
		};
	}
	if (!emailValido(email)) {
		return { status: 400, erro: 'Formato de e-mail inválido' };
	}
	if (!nascimentoValido(nascimento)) {
		return {
			status: 400,
			erro: 'Data de nascimento inválida ou no futuro',
		};
	}
	if (emailJaCadastrado(email, ignorarId)) {
		return { status: 409, erro: 'E-mail já cadastrado' };
	}
	return null;
}

// ---------- Rotas ----------

// READ (lista) — GET /pacientes
// Suporta filtro por nome: GET /pacientes?nome=ana
app.get('/pacientes', (req, res) => {
	const { nome } = req.query;

	if (nome) {
		const termo = String(nome).trim().toLowerCase();
		const filtrados = pacientes.filter((p) =>
			p.nome.toLowerCase().includes(termo)
		);
		return res.json(filtrados);
	}

	res.json(pacientes);
});

// READ (total) — GET /pacientes/total
// IMPORTANTE: esta rota precisa vir ANTES de '/pacientes/:id'.
// O Express testa as rotas na ordem em que foram declaradas; se '/:id' vier primeiro,
// ela "captura" a palavra "total" como se fosse um id, Number('total') vira NaN
// e a resposta seria 404 (Paciente não encontrado).
app.get('/pacientes/total', (req, res) => {
	res.json({ total: pacientes.length });
});

// READ (um) — GET /pacientes/:id
app.get('/pacientes/:id', (req, res) => {
	const id = Number(req.params.id); // req.params.id é texto, por isso a conversão
	const paciente = pacientes.find((p) => p.id === id);

	if (!paciente) {
		return res.status(404).json({ erro: 'Paciente não encontrado' });
	}

	res.json(paciente);
});

// CREATE — POST /pacientes
app.post('/pacientes', (req, res) => {
	const { nome, email, nascimento } = req.body ?? {};

	const problema = validarCampos({ nome, email, nascimento });
	if (problema) {
		return res.status(problema.status).json({ erro: problema.erro });
	}

	const novoPaciente = { id: proximoId++, nome, email, nascimento };
	pacientes.push(novoPaciente);

	res.status(201).json(novoPaciente);
});

// UPDATE (substituição completa) — PUT /pacientes/:id
app.put('/pacientes/:id', (req, res) => {
	const id = Number(req.params.id);
	const paciente = pacientes.find((p) => p.id === id);

	if (!paciente) {
		return res.status(404).json({ erro: 'Paciente não encontrado' });
	}

	const { nome, email, nascimento } = req.body ?? {};

	const problema = validarCampos({ nome, email, nascimento }, id);
	if (problema) {
		return res.status(problema.status).json({ erro: problema.erro });
	}

	paciente.nome = nome;
	paciente.email = email;
	paciente.nascimento = nascimento;

	res.json(paciente);
});

// UPDATE (parcial) — PATCH /pacientes/:id
// Diferença para o PUT: o PUT exige o recurso COMPLETO (todos os campos),
// enquanto o PATCH altera apenas os campos que vierem no corpo da requisição.
app.patch('/pacientes/:id', (req, res) => {
	const id = Number(req.params.id);
	const paciente = pacientes.find((p) => p.id === id);

	if (!paciente) {
		return res.status(404).json({ erro: 'Paciente não encontrado' });
	}

	const campos = req.body ?? {};
	const permitidos = ['nome', 'email', 'nascimento'];
	const enviados = permitidos.filter((c) => campos[c] !== undefined);

	if (enviados.length === 0) {
		return res
			.status(400)
			.json({ erro: 'Envie ao menos um campo: nome, email ou nascimento' });
	}

	// Valida o resultado final (campos novos + campos que já existiam)
	const resultado = { ...paciente, ...campos };
	const problema = validarCampos(resultado, id);
	if (problema) {
		return res.status(problema.status).json({ erro: problema.erro });
	}

	enviados.forEach((c) => {
		paciente[c] = campos[c];
	});

	res.json(paciente);
});

// DELETE — DELETE /pacientes/:id
app.delete('/pacientes/:id', (req, res) => {
	const id = Number(req.params.id);
	const indice = pacientes.findIndex((p) => p.id === id);

	if (indice === -1) {
		return res.status(404).json({ erro: 'Paciente não encontrado' });
	}

	pacientes.splice(indice, 1);

	res.status(204).send(); // 204 = deu certo, e não há corpo na resposta
});

// Em produção (Render) a porta vem da variável de ambiente PORT
const PORTA = process.env.PORT || 3000;

app.listen(PORTA, () => {
	console.log(`Servidor rodando na porta ${PORTA}`);
});
