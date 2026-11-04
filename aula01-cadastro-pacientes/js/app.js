// Chave usada para guardar os pacientes no localStorage do navegador
const CHAVE_STORAGE = 'pacientes-aula01';

// Array que guarda os pacientes cadastrados.
// Agora é carregado do localStorage, então sobrevive ao recarregamento da página.
let pacientes = carregarDoStorage();

// Estado da tela: termo da busca e sentido da ordenação ('' = ordem de cadastro)
let termoBusca = '';
let ordemNome = '';

// Referências aos elementos do DOM que vamos usar várias vezes
const formulario = document.getElementById('form-paciente');
const tabela = document.getElementById('tabela-pacientes');
const contador = document.getElementById('contador-pacientes');
const campoBusca = document.getElementById('busca');
const cabecalhoNome = document.getElementById('th-nome');
const setaOrdem = document.getElementById('seta-ordem');

// ---------- Persistência (localStorage) ----------

function carregarDoStorage() {
	try {
		const salvo = localStorage.getItem(CHAVE_STORAGE);
		const lista = salvo ? JSON.parse(salvo) : [];
		return Array.isArray(lista) ? lista : [];
	} catch (erro) {
		// JSON corrompido ou storage indisponível: começa vazio
		console.error('Não foi possível ler o localStorage:', erro);
		return [];
	}
}

function salvarNoStorage() {
	try {
		localStorage.setItem(CHAVE_STORAGE, JSON.stringify(pacientes));
	} catch (erro) {
		console.error('Não foi possível salvar no localStorage:', erro);
	}
}

// ---------- Dados ----------

// Função responsável por adicionar um paciente ao array
function adicionarPaciente(nome, email, nascimento, telefone) {
	// O id permite remover o paciente certo mesmo com a tabela filtrada/ordenada
	const id = Date.now() + Math.random();
	const novoPaciente = { id, nome, email, nascimento, telefone };
	pacientes.push(novoPaciente);
	salvarNoStorage();
}

// Remove o paciente com o id informado
function removerPaciente(id) {
	pacientes = pacientes.filter((paciente) => paciente.id !== id);
	salvarNoStorage();
	renderizarTabela();
}

// Aplica busca por nome e ordenação sem alterar o array original
function obterPacientesVisiveis() {
	let lista = pacientes.filter((paciente) =>
		paciente.nome.toLowerCase().includes(termoBusca.toLowerCase())
	);

	if (ordemNome) {
		const fator = ordemNome === 'asc' ? 1 : -1;
		lista = [...lista].sort(
			(a, b) => fator * a.nome.localeCompare(b.nome, 'pt-BR')
		);
	}

	return lista;
}

// ---------- Interface ----------

function criarCelula(texto) {
	const celula = document.createElement('td');
	celula.textContent = texto; // textContent evita injeção de HTML
	return celula;
}

// Função responsável por desenhar a tabela inteira a partir do array
function renderizarTabela() {
	tabela.innerHTML = ''; // limpa a tabela antes de redesenhar

	obterPacientesVisiveis().forEach((paciente) => {
		const linha = document.createElement('tr');

		linha.appendChild(criarCelula(paciente.nome));
		linha.appendChild(criarCelula(paciente.email));
		linha.appendChild(criarCelula(calcularIdade(paciente.nascimento)));
		linha.appendChild(criarCelula(paciente.telefone || ''));
		linha.appendChild(criarCelula(formatarData(paciente.nascimento)));

		// Botão "Remover" de cada linha
		const celulaAcoes = document.createElement('td');
		const botaoRemover = document.createElement('button');
		botaoRemover.type = 'button';
		botaoRemover.textContent = 'Remover';
		botaoRemover.className = 'btn btn-sm btn-outline-danger';
		botaoRemover.addEventListener('click', () => removerPaciente(paciente.id));
		celulaAcoes.appendChild(botaoRemover);
		linha.appendChild(celulaAcoes);

		tabela.appendChild(linha);
	});

	// O contador mostra o total cadastrado (e quantos aparecem quando há filtro)
	const visiveis = tabela.children.length;
	contador.textContent =
		termoBusca && visiveis !== pacientes.length
			? `Total de pacientes: ${pacientes.length} (exibindo ${visiveis})`
			: `Total de pacientes: ${pacientes.length}`;

	setaOrdem.textContent = ordemNome === 'asc' ? '▲' : ordemNome === 'desc' ? '▼' : '';
}

// Função utilitária só para formatar a data no padrão dd/mm/aaaa
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

// ---------- Eventos ----------

// Evento disparado quando o formulário é enviado
formulario.addEventListener('submit', (event) => {
	event.preventDefault(); // evita o recarregamento da página

	const nome = document.getElementById('nome').value;
	const email = document.getElementById('email').value;
	const nascimento = document.getElementById('nascimento').value;
	const telefone = document.getElementById('telefone').value;

	// Normaliza e verifica e-mail duplicado (ignora maiúsculas/espaços)
	const normalizedEmail = (email || '').trim().toLowerCase();
	const emailJaExiste = pacientes.some(
		(p) => (p.email || '').trim().toLowerCase() === normalizedEmail
	);

	if (emailJaExiste) {
		alert('E-mail já cadastrado');
		return; // não adiciona paciente duplicado
	}

	adicionarPaciente(nome, email, nascimento, telefone);
	renderizarTabela();

	formulario.reset(); // limpa os campos do formulário
});

// Busca em tempo real: a cada letra digitada a tabela é filtrada por nome
campoBusca.addEventListener('input', () => {
	termoBusca = campoBusca.value.trim();
	renderizarTabela();
});

// Ordenação: cada clique no cabeçalho "Nome" alterna A-Z → Z-A
cabecalhoNome.addEventListener('click', () => {
	ordemNome = ordemNome === 'asc' ? 'desc' : 'asc';
	renderizarTabela();
});

// Desenha os pacientes que já estavam salvos assim que a página abre
renderizarTabela();
