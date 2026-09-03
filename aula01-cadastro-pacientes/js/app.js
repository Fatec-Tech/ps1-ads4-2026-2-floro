// Array que guarda os pacientes cadastrados (em memória, só nesta sessão)
const pacientes = [];

// Referências aos elementos do DOM que vamos usar várias vezes
const formulario = document.getElementById('form-paciente');
const tabela = document.getElementById('tabela-pacientes');

// Função responsável por adicionar um paciente ao array
function adicionarPaciente(nome, email, nascimento, telefone) {
	const novoPaciente = { nome, email, nascimento, telefone };
	pacientes.push(novoPaciente);
}

// Função responsável por desenhar a tabela inteira a partir do array
function renderizarTabela() {
	tabela.innerHTML = ''; // limpa a tabela antes de redesenhar

	pacientes.forEach((paciente) => {
		const linha = document.createElement('tr');

		const idade = calcularIdade(paciente.nascimento);

		linha.innerHTML = `
		  <td>${paciente.nome}</td>
		  <td>${paciente.email}</td>
		  <td>${idade}</td>
		  <td>${paciente.telefone || ''}</td>
		  <td>${formatarData(paciente.nascimento)}</td>
		`;

		tabela.appendChild(linha);
	});
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

// Evento disparado quando o formulário é enviado
formulario.addEventListener('submit', (event) => {
	event.preventDefault(); // evita o recarregamento da página

	const nome = document.getElementById('nome').value;
	const email = document.getElementById('email').value;
	const nascimento = document.getElementById('nascimento').value;
	const telefone = document.getElementById('telefone').value;

	// Normaliza e verifica e-mail duplicado (ignora maiúsculas/espaços)
	const normalizedEmail = (email || '').trim().toLowerCase();
	const emailJaExiste = pacientes.some(p => (p.email || '').trim().toLowerCase() === normalizedEmail);

	if (emailJaExiste) {
		alert('E-mail já cadastrado');
		return; // não adiciona paciente duplicado
	}

	adicionarPaciente(nome, email, nascimento, telefone);
	renderizarTabela();

	formulario.reset(); // limpa os campos do formulário
});
