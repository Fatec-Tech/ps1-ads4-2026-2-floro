const http = require('http');

// Por enquanto, os dados ainda vivem em memória, dentro do próprio servidor
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
	// Exercício 2: quarto paciente adicionado direto no servidor (o frontend não foi alterado)
	{
		id: 4,
		nome: 'Carlos Lima',
		email: 'carlos.lima@email.com',
		nascimento: '1995-02-20',
	},
];

const servidor = http.createServer((req, res) => {
	// Libera o acesso para que o frontend, rodando em outra porta, possa consumir esta API
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Content-Type', 'application/json');

	if (req.method === 'GET' && req.url === '/pacientes') {
		res.writeHead(200);
		res.end(JSON.stringify(pacientes));
		return;
	}

	// Exercício 1: GET /pacientes/total → { "total": N }
	if (req.method === 'GET' && req.url === '/pacientes/total') {
		res.writeHead(200);
		res.end(JSON.stringify({ total: pacientes.length }));
		return;
	}

	// Qualquer outra rota/método não tratado cai aqui
	res.writeHead(404);
	res.end(JSON.stringify({ erro: 'Rota não encontrada' }));
});

const PORTA = 3000;

servidor.listen(PORTA, () => {
	console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
