// Arquivo com os pacientes iniciais.
// Para testar o tratamento de erro (Exercício 4), troque por 'data/inexistente.json'.
const URL_DADOS = 'data/pacientes.json';

// Exercício 1: tempo de espera artificial (em ms) antes do fetch,
// só para dar tempo de ver a mensagem "Carregando pacientes..."
const ATRASO_SIMULADO_MS = 1000;

// Array que guarda os pacientes. Cada um tem uma "origem":
// 'json' (veio do arquivo) ou 'manual' (cadastrado no formulário nesta sessão)
const pacientes = [];

// Estado do carregamento inicial: 'carregando' | 'ok' | 'erro'
let estadoCarga = 'carregando';

const formulario = document.getElementById('form-paciente');
const tabela = document.getElementById('tabela');
const corpoTabela = document.getElementById('tabela-pacientes');
const mensagemCarregando = document.getElementById('carregando');
const mensagemErro = document.getElementById('erro-carregamento');
const listaVazia = document.getElementById('lista-vazia');
const blocoContadores = document.getElementById('contadores');
const contador = document.getElementById('contador-pacientes');
const contadorOrigem = document.getElementById('contador-origem');

function adicionarPaciente(nome, email, nascimento, telefone, origem) {
	pacientes.push({ nome, email, nascimento, telefone, origem });
}

function criarCelula(texto) {
	const celula = document.createElement('td');
	celula.textContent = texto; // textContent evita injeção de HTML
	return celula;
}

function renderizarTabela() {
	corpoTabela.innerHTML = '';

	pacientes.forEach((paciente) => {
		const linha = document.createElement('tr');

		linha.appendChild(criarCelula(paciente.nome));
		linha.appendChild(criarCelula(paciente.email));
		linha.appendChild(criarCelula(calcularIdade(paciente.nascimento)));
		linha.appendChild(criarCelula(paciente.telefone || '—'));
		linha.appendChild(criarCelula(formatarData(paciente.nascimento)));
		linha.appendChild(
			criarCelula(paciente.origem === 'json' ? 'Arquivo JSON' : 'Cadastro manual')
		);

		corpoTabela.appendChild(linha);
	});

	// Exercício 3: lista vazia → mensagem no lugar da tabela
	// (só depois que a carga terminou com sucesso, para não aparecer enquanto carrega)
	const vazia = pacientes.length === 0 && estadoCarga === 'ok';
	listaVazia.classList.toggle('d-none', !vazia);
	tabela.classList.toggle('d-none', pacientes.length === 0);

	atualizarContadores();
}

// Exercício 2: quantidade de pacientes vindos do JSON x cadastrados manualmente
function atualizarContadores() {
	const doJson = pacientes.filter((p) => p.origem === 'json').length;
	const manuais = pacientes.filter((p) => p.origem === 'manual').length;

	contador.textContent = `Total de pacientes: ${pacientes.length}`;
	contadorOrigem.textContent = `Do arquivo JSON: ${doJson} | Cadastrados manualmente nesta sessão: ${manuais}`;

	// Os contadores só aparecem depois de uma carga bem-sucedida
	// ou quando já existe algum paciente cadastrado manualmente.
	blocoContadores.classList.toggle(
		'd-none',
		estadoCarga === 'carregando' || (estadoCarga === 'erro' && pacientes.length === 0)
	);
}

function formatarData(dataISO) {
	const [ano, mes, dia] = dataISO.split('-');
	return `${dia}/${mes}/${ano}`;
}

// Calcula a idade baseada na data ISO (YYYY-MM-DD)
function calcularIdade(dataISO) {
	if (!dataISO) return '';
	const [ano, mes, dia] = dataISO.split('-').map(Number);
	const hoje = new Date();
	let idade = hoje.getFullYear() - ano;
	const mesHoje = hoje.getMonth() + 1;
	if (mesHoje < mes || (mesHoje === mes && hoje.getDate() < dia)) {
		idade--;
	}
	return idade;
}

// Espera um tempo (usada para simular a latência de rede)
function esperar(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// Busca os pacientes iniciais a partir do arquivo JSON
async function carregarPacientesIniciais() {
	try {
		// Exercício 1: setTimeout de 1 segundo ANTES do fetch
		await esperar(ATRASO_SIMULADO_MS);

		const resposta = await fetch(URL_DADOS);

		// Nem toda resposta é sucesso (um 404 NÃO cai no catch sozinho)
		if (!resposta.ok) {
			throw new Error(`Erro HTTP: ${resposta.status}`);
		}

		const dados = await resposta.json(); // converte a resposta em objeto JS

		dados.forEach((paciente) => {
			adicionarPaciente(
				paciente.nome,
				paciente.email,
				paciente.nascimento,
				paciente.telefone,
				'json'
			);
		});

		estadoCarga = 'ok';
		mensagemCarregando.classList.add('d-none');
		mensagemErro.classList.add('d-none');
	} catch (erro) {
		console.error('Não foi possível carregar os pacientes:', erro);

		// Exercício 4: feedback visual amigável para o usuário (não só no console)
		estadoCarga = 'erro';
		mensagemCarregando.classList.add('d-none');
		mensagemErro.textContent =
			'Não foi possível carregar a lista de pacientes. ' +
			'Confira se a página está sendo aberta por um servidor local (Live Server) ' +
			'e tente novamente.';
		mensagemErro.classList.remove('d-none');
	}

	renderizarTabela();
}

formulario.addEventListener('submit', (event) => {
	event.preventDefault();

	const nome = document.getElementById('nome').value;
	const email = document.getElementById('email').value;
	const nascimento = document.getElementById('nascimento').value;
	const telefone = document.getElementById('telefone').value;

	// Não permite e-mail repetido (considera também os pacientes vindos do JSON)
	const emailNormalizado = email.trim().toLowerCase();
	const emailJaExiste = pacientes.some(
		(p) => (p.email || '').trim().toLowerCase() === emailNormalizado
	);

	if (emailJaExiste) {
		alert('E-mail já cadastrado');
		return;
	}

	adicionarPaciente(nome, email, nascimento, telefone, 'manual');
	renderizarTabela();

	formulario.reset();
});

// Assim que o script carrega, já dispara a busca dos dados iniciais
carregarPacientesIniciais();
