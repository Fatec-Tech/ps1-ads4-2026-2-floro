const API_URL = 'https://pokeapi.co/api/v2/pokemon';

const pokemonGrid = document.getElementById('pokemonGrid');
const loading = document.getElementById('loading');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

// Função para buscar os detalhes individuais de um Pokémon
async function fetchPokemonData(urlOrName) {
	const url = urlOrName.startsWith('http')
		? urlOrName
		: `${API_URL}/${urlOrName.toLowerCase().trim()}`;

	const response = await fetch(url);
	if (!response.ok) {
		throw new Error('Pokémon não encontrado');
	}
	console.log('Response:', response); // Log da resposta para depuração
	return await response.json();
}

// Função para carregar a lista inicial (ex: primeiros 20)
async function loadInitialPokemon(limit = 20) {
	showLoading(true);
	pokemonGrid.innerHTML = '';

	try {
		const response = await fetch(`${API_URL}?limit=${limit}`);
		const data = await response.json();

		// Faz requisição paralela dos detalhes de cada um dos itens listados
		const pokemonPromises = data.results.map((item) =>
			fetchPokemonData(item.url)
		);
		const pokemonList = await Promise.all(pokemonPromises);

		// Renderiza cada card
		pokemonList.forEach(renderPokemonCard);
	} catch (error) {
		showError('Erro ao carregar a lista de Pokémon.');
		console.error(error);
	} finally {
		showLoading(false);
	}
}

// Função para criar a estrutura visual do Card no Bootstrap
function renderPokemonCard(pokemon) {
	console.log('Rendering Pokémon:', pokemon); // Log do Pokémon para depuração
	// Pega a imagem oficial de alta qualidade (dream_world ou official-artwork)
	const imageUrl =
		pokemon.sprites.other['official-artwork'].front_default ||
		pokemon.sprites.front_default;

	// Mapeia os tipos para Badges do Bootstrap
	const typesBadges = pokemon.types
		.map(
			(t) =>
				`<span class="badge bg-secondary badge-type">${t.type.name}</span>`
		)
		.join('');

	// Formata peso (em kg) e altura (em m)
	const heightInMeters = (pokemon.height / 10).toFixed(1);
	const weightInKg = (pokemon.weight / 10).toFixed(1);

	const cardHTML = `
        <div class="col">
          <div class="card h-100 shadow-sm pokemon-card border-0" data-id="${pokemon.id}" role="button" tabindex="0" aria-label="Ver detalhes de ${pokemon.name}">
            <div class="text-center p-3 bg-white rounded-top">
              <img src="${imageUrl}" class="card-img-top img-fluid" style="max-height: 160px; object-fit: contain;" alt="${pokemon.name}">
            </div>
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h5 class="card-title text-capitalize fw-bold m-0">${pokemon.name}</h5>
                <small class="text-muted">#${String(pokemon.id).padStart(3, '0')}</small>
              </div>
              <div class="mb-3">
                ${typesBadges}
              </div>
              <div class="row text-center border-top pt-2">
                <div class="col-6 border-end">
                  <small class="text-muted d-block">Altura</small>
                  <strong>${heightInMeters} m</strong>
                </div>
                <div class="col-6">
                  <small class="text-muted d-block">Peso</small>
                  <strong>${weightInKg} kg</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

	pokemonGrid.insertAdjacentHTML('beforeend', cardHTML);
}

// Busca específica por nome ou ID
async function handleSearch() {
	const query = searchInput.value.trim();
	if (!query) {
		loadInitialPokemon();
		return;
	}

	showLoading(true);
	pokemonGrid.innerHTML = '';

	try {
		const pokemon = await fetchPokemonData(query);
		renderPokemonCard(pokemon);
	} catch (error) {
		showError(`Nenhum Pokémon encontrado com o termo "${query}".`);
	} finally {
		showLoading(false);
	}
}

// Utilitários de UI
function showLoading(state) {
	if (state) {
		loading.classList.remove('d-none');
	} else {
		loading.classList.add('d-none');
	}
}

function showError(message) {
	pokemonGrid.innerHTML = `
        <div class="col-12">
          <div class="alert alert-warning text-center" role="alert">
            ${message}
          </div>
        </div>
      `;
}

// ---------- Modal de detalhes ----------

const modalElement = document.getElementById('pokemonModal');
const modalTitle = document.getElementById('pokemonModalTitle');
const modalBody = document.getElementById('pokemonModalBody');
const pokemonModal = new bootstrap.Modal(modalElement);

// Cache simples: evita buscar de novo um Pokémon já aberto
const pokemonCache = new Map();
// Guarda o último id pedido para ignorar respostas antigas (cliques rápidos)
let ultimoIdSolicitado = null;

// Cores das barras de progresso de cada status
const STATUS_EXIBIDOS = [
	{ chave: 'hp', rotulo: 'HP', cor: 'bg-success' },
	{ chave: 'attack', rotulo: 'Ataque', cor: 'bg-danger' },
	{ chave: 'defense', rotulo: 'Defesa', cor: 'bg-warning' },
	{ chave: 'speed', rotulo: 'Velocidade', cor: 'bg-info' },
];

// Valor de referência para calcular a largura da barra (status base raramente passam de 150)
const STATUS_MAXIMO = 150;

function formatarId(id) {
	return `#${String(id).padStart(3, '0')}`;
}

function renderizarStatus(pokemon) {
	return STATUS_EXIBIDOS.map(({ chave, rotulo, cor }) => {
		const item = pokemon.stats.find((s) => s.stat.name === chave);
		const valor = item ? item.base_stat : 0;
		const largura = Math.min(100, (valor / STATUS_MAXIMO) * 100);

		return `
        <div class="mb-3">
          <div class="d-flex justify-content-between">
            <small class="fw-bold">${rotulo}</small>
            <small class="fw-bold">${valor}</small>
          </div>
          <div class="progress" style="height: 10px;">
            <div class="progress-bar ${cor}" role="progressbar" style="width: ${largura}%;"
                 aria-valuenow="${valor}" aria-valuemin="0" aria-valuemax="${STATUS_MAXIMO}"
                 aria-label="${rotulo}: ${valor}"></div>
          </div>
        </div>`;
	}).join('');
}

function renderizarHabilidades(pokemon) {
	return pokemon.abilities
		.map(
			(a) =>
				`<span class="badge text-bg-dark me-1 mb-1 text-capitalize">${a.ability.name}${
					a.is_hidden ? ' (Oculta)' : ''
				}</span>`
		)
		.join('');
}

function renderizarSprite(url, legenda, nome) {
	const imagem = url
		? `<img src="${url}" alt="${nome} - ${legenda}">`
		: '<div class="text-muted small py-4">Indisponível</div>';

	return `
        <div class="col-6">
          <div class="sprite-box">
            ${imagem}
            <div class="small text-secondary">${legenda}</div>
          </div>
        </div>`;
}

function renderizarSprites(pokemon) {
	const s = pokemon.sprites;
	return `
      <div class="row g-2">
        ${renderizarSprite(s.front_default, 'Normal (Frente)', pokemon.name)}
        ${renderizarSprite(s.back_default, 'Normal (Costas)', pokemon.name)}
        ${renderizarSprite(s.front_shiny, 'Shiny (Frente)', pokemon.name)}
        ${renderizarSprite(s.back_shiny, 'Shiny (Costas)', pokemon.name)}
      </div>`;
}

function renderizarAudio(pokemon) {
	const som = pokemon.cries && (pokemon.cries.latest || pokemon.cries.legacy);
	if (!som) {
		return '<p class="text-muted small mb-0">Este Pokémon não possui áudio disponível.</p>';
	}
	return `<audio controls preload="none" class="w-100" src="${som}"></audio>`;
}

function renderizarModal(pokemon) {
	modalTitle.textContent = `${pokemon.name} ${formatarId(pokemon.id)}`;
	modalBody.innerHTML = `
      <div class="row g-4">
        <div class="col-md-6">
          <h6 class="fw-bold mb-3">Variações de Sprites</h6>
          ${renderizarSprites(pokemon)}
          <h6 class="fw-bold mt-4 mb-2">Voz / Som (Cry)</h6>
          ${renderizarAudio(pokemon)}
        </div>
        <div class="col-md-6">
          <h6 class="fw-bold mb-3">Status Base</h6>
          ${renderizarStatus(pokemon)}
          <h6 class="fw-bold mt-4 mb-2">Habilidades</h6>
          ${renderizarHabilidades(pokemon)}
        </div>
      </div>`;
}

function mostrarSpinnerNoModal() {
	modalBody.innerHTML = `
      <div class="text-center py-5">
        <div class="spinner-border text-danger" role="status">
          <span class="visually-hidden">Carregando...</span>
        </div>
      </div>`;
}

async function openPokemonModal(id) {
	ultimoIdSolicitado = id;
	modalTitle.textContent = 'Carregando...';
	mostrarSpinnerNoModal(); // feedback visual enquanto os dados chegam
	pokemonModal.show();

	try {
		let pokemon = pokemonCache.get(id);
		if (!pokemon) {
			pokemon = await fetchPokemonData(String(id));
			pokemonCache.set(id, pokemon);
		}

		// Se o usuário já clicou em outro card, descarta esta resposta
		if (ultimoIdSolicitado !== id) return;

		renderizarModal(pokemon);
	} catch (error) {
		if (ultimoIdSolicitado !== id) return;
		console.error(error);
		modalTitle.textContent = 'Erro';
		modalBody.innerHTML = `
        <div class="alert alert-warning mb-0" role="alert">
          Não foi possível carregar os detalhes deste Pokémon. Tente novamente.
        </div>`;
	}
}

// Delegação de eventos: um único listener cobre todos os cards (inclusive os criados depois)
function abrirModalDoCard(event) {
	const card = event.target.closest('.pokemon-card');
	if (!card) return;
	openPokemonModal(Number(card.dataset.id));
}

pokemonGrid.addEventListener('click', abrirModalDoCard);
pokemonGrid.addEventListener('keydown', (e) => {
	if (e.key === 'Enter' || e.key === ' ') {
		e.preventDefault();
		abrirModalDoCard(e);
	}
});

// Ao fechar o modal, para o áudio que estiver tocando
modalElement.addEventListener('hidden.bs.modal', () => {
	const audio = modalBody.querySelector('audio');
	if (audio) audio.pause();
	ultimoIdSolicitado = null;
});

// Eventos
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
	if (e.key === 'Enter') handleSearch();
});

// Inicialização
loadInitialPokemon();
