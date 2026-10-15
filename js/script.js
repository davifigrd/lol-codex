/* ==========================================================================
   LoL Codex - Script Principal
   Vanilla ES6+ integrado nativamente à API Data Dragon da Riot Games
   ========================================================================== */

// 1. Pega o idioma do navegador do usuário (ex: 'pt-BR', 'en-US', 'es-ES')
function obterIdiomaUsuario() {
    const lang = navigator.language || navigator.userLanguage || '';
    if (lang.startsWith('pt')) return 'pt_BR';
    if (lang.startsWith('es')) return 'es_ES';
    return 'en_US'; // Idioma padrão internacional
}

// Configurações e Estado Global
let versaoAtual = '14.24.1';
let idiomaAtual = obterIdiomaUsuario();

let todosCampeoes = [];
let todosItens = {};
let itensValidosSR = [];
let todasRunas = [];
let detalhesCampeoesCache = {};

let filtroRotaAtiva = 'all';
let filtroCategoriaItemAtiva = 'all';

// Novo sistema de filtros de atributos (multi-seleção via janelinha)
let filtrosAtributosAtivos = new Set();
let mostrarDescricaoCardsItens = false;

// Estados das chaves switches de resumo
let modoResumoHabilidades = false;
let modoResumoItens = false;
let modoResumoRunas = true;
let campeaoModalAbertoAtual = null;

// Banco de dados de resumos autorais e glossário (carregados da pasta data/)
let resumoHabilidades = {};
let resumoItens = {};
let resumoRunas = {};
let glossarioLol = {};

// Cache de dados do CommunityDragon por campeão (para os vídeos das habilidades)
let champCDragonCache = {};

// URL base dos vídeos de habilidades (CommunityDragon / CloudFront da Riot)
const VIDEO_BASE_URL = 'https://d28xe8vt774jo5.cloudfront.net/';




// Ícones oficiais de CLASSE de League of Legends (CommunityDragon / Riot Games)
// Usados no cliente do LoL para representar a classe/função de cada campeão
const ICONES_CLASSES = {
    Fighter: { url: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/npe-ft-role-icon-fighter.png', label: 'Lutador' },
    Tank: { url: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/npe-ft-role-icon-tank.png', label: 'Tanque' },
    Mage: { url: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/npe-ft-role-icon-mage.png', label: 'Mago' },
    Assassin: { url: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/npe-ft-role-icon-assassin.png', label: 'Assassino' },
    Marksman: { url: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/npe-ft-role-icon-marksman.png', label: 'Atirador' },
    Support: { url: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/npe-ft-role-icon-support.png', label: 'Suporte' }
};

// Ícones oficiais de ROTA (para o card e filtros por posição)
const ICONES_ROTAS = {
    Top: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-top.png',
    Jungle: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-jungle.png',
    Mid: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-middle.png',
    ADC: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-bottom.png',
    Suporte: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-utility.png'
};

// =========================================================================
// ÍCONES DE DANO / ESPECIAIS — usados nos cards de campeão e itens
// Todos usando FontAwesome 6 Free (sem ícones Pro)
// =========================================================================
const ICONES_ATRIBUTO = {
    AD: { class: 'stat-img-ad', color: '#ff7700', label: 'Dano Físico (AD)' },
    AP: { class: 'stat-img-ap', color: '#b84af5', label: 'Poder de Habilidade (AP)' },
    Heal: { class: 'stat-img-health', color: '#22c55e', label: 'Cura / Vida' },
    Shield: { class: 'stat-img-mr', color: '#06b6d4', label: 'Escudo / Resistência Mágica' },
    Tank: { class: 'stat-img-armor', color: '#f59e0b', label: 'Armadura (ARMOR)' },
    CC: { class: 'stat-img-tenacity', color: '#60a5fa', label: 'Controle de Grupo' },
    Dash: { class: 'stat-img-mov', color: '#60a5fa', label: 'Mobilidade / Dash' },
    Stealth: { icon: 'fa-solid fa-eye-slash', color: '#94a3b8', label: 'Furtividade' },
    Summon: { icon: 'fa-solid fa-dragon', color: '#f59e0b', label: 'Invocações' },
    True: { class: 'stat-img-pen', color: '#e2e8f0', label: 'Dano Verdadeiro / Penetração' },
    Global: { icon: 'fa-solid fa-earth-americas', color: '#06b6d4', label: 'Habilidade Global' },
    Execute: { icon: 'fa-solid fa-skull', color: '#ef4444', label: 'Execução' },
    Zone: { icon: 'fa-solid fa-circle-radiation', color: '#fb923c', label: 'Controle de Zona' }
};

// Perfis de dano/especiais por campeão (ID do Data Dragon)
// Limitado a 3 badges no card; os mais importantes primeiro
const PERFIS_CAMPEAO = {
    Aatrox: ['AD', 'Heal'],
    Ahri: ['AP', 'CC', 'Dash'],
    Akali: ['AP', 'Dash', 'Stealth'],
    Akshan: ['AD', 'Dash'],
    Alistar: ['Tank', 'CC', 'Heal'],
    Ambessa: ['AD', 'Dash'],
    Amumu: ['Tank', 'CC'],
    Anivia: ['AP', 'CC', 'Zone'],
    Annie: ['AP', 'CC', 'Summon'],
    Aphelios: ['AD', 'Zone'],
    Ashe: ['AD', 'CC'],
    AurelionSol: ['AP', 'Zone'],
    Aurora: ['AP', 'Stealth'],
    Azir: ['AP', 'Summon', 'Zone'],
    Bard: ['AP', 'CC'],
    BelVeth: ['AD', 'Dash'],
    Blitzcrank: ['Tank', 'CC'],
    Brand: ['AP', 'Zone'],
    Braum: ['Tank', 'CC', 'Shield'],
    Briar: ['AD', 'Heal', 'Dash'],
    Caitlyn: ['AD', 'CC', 'Zone'],
    Camille: ['AD', 'Dash', 'CC'],
    Cassiopeia: ['AP', 'CC', 'Zone'],
    Chogath: ['Tank', 'CC', 'True'],
    Corki: ['AD', 'AP'],
    Darius: ['AD', 'CC', 'Execute'],
    Diana: ['AP', 'Dash', 'CC'],
    DrMundo: ['Tank', 'Heal'],
    Draven: ['AD'],
    Ekko: ['AP', 'Dash', 'Heal'],
    Elise: ['AP', 'Summon', 'Dash'],
    Evelynn: ['AP', 'Stealth', 'Dash'],
    Ezreal: ['AD', 'Dash'],
    Fiddlesticks: ['AP', 'CC', 'Summon'],
    Fiora: ['AD', 'True'],
    Fizz: ['AP', 'Dash', 'CC'],
    Galio: ['AP', 'Tank', 'CC'],
    Gangplank: ['AD', 'Zone'],
    Garen: ['AD', 'Tank', 'Execute'],
    Gnar: ['AD', 'CC', 'Dash'],
    Gragas: ['AP', 'CC', 'Dash'],
    Graves: ['AD', 'Dash'],
    Gwen: ['AP', 'True'],
    Hecarim: ['AD', 'Dash', 'Heal'],
    Heimerdinger: ['AP', 'Summon', 'CC'],
    Hwei: ['AP', 'CC', 'Zone'],
    Illaoi: ['AD', 'Summon'],
    Irelia: ['AD', 'Dash', 'CC'],
    Ivern: ['AP', 'Summon', 'Shield'],
    Janna: ['AP', 'Shield', 'CC'],
    JarvanIV: ['AD', 'CC', 'Zone'],
    Jax: ['AD', 'Heal'],
    Jayce: ['AD', 'AP'],
    Jhin: ['AD', 'CC', 'Zone'],
    Jinx: ['AD', 'CC'],
    KSante: ['Tank', 'CC', 'Dash'],
    Kaisa: ['AD', 'AP', 'Dash'],
    Kalista: ['AD', 'Dash'],
    Karma: ['AP', 'Shield', 'CC'],
    Karthus: ['AP', 'Zone', 'Global'],
    Kassadin: ['AP', 'Dash'],
    Katarina: ['AP', 'Dash', 'Execute'],
    Kayle: ['AP', 'True', 'Heal'],
    Kayn: ['AD', 'Dash', 'Heal'],
    Kennen: ['AP', 'CC'],
    Khazix: ['AD', 'Stealth', 'Execute'],
    Kindred: ['AD', 'Zone'],
    Kled: ['AD', 'Dash', 'CC'],
    KogMaw: ['AD', 'AP', 'Zone'],
    LeBlanc: ['AP', 'Dash', 'CC'],
    LeeSin: ['AD', 'Dash', 'CC'],
    Leona: ['Tank', 'CC', 'Zone'],
    Lillia: ['AP', 'Dash', 'CC'],
    Lissandra: ['AP', 'CC', 'Zone'],
    Lucian: ['AD', 'Dash'],
    Lulu: ['AP', 'CC', 'Shield'],
    Lux: ['AP', 'CC', 'Shield'],
    Malphite: ['Tank', 'CC'],
    Malzahar: ['AP', 'CC', 'Summon'],
    Maokai: ['Tank', 'CC', 'Heal'],
    MasterYi: ['AD', 'True', 'Heal'],
    Milio: ['AP', 'Shield', 'Heal'],
    MissFortune: ['AD', 'Zone'],
    MonkeyKing: ['AD', 'Heal', 'Stealth'],
    Mordekaiser: ['AP', 'Zone'],
    Morgana: ['AP', 'CC', 'Shield'],
    Naafiri: ['AD', 'Dash', 'Execute'],
    Nami: ['AP', 'CC', 'Heal'],
    Nasus: ['AD', 'Tank', 'CC'],
    Nautilus: ['Tank', 'CC', 'Zone'],
    Neeko: ['AP', 'CC', 'Zone'],
    Nidalee: ['AP', 'Heal', 'Dash'],
    Nilah: ['AD', 'Heal', 'Dash'],
    Nocturne: ['AD', 'Stealth', 'Global'],
    Nunu: ['Tank', 'CC', 'Heal'],
    Olaf: ['AD', 'Heal'],
    Orianna: ['AP', 'CC', 'Shield'],
    Ornn: ['Tank', 'CC'],
    Pantheon: ['AD', 'CC', 'Global'],
    Poppy: ['Tank', 'CC'],
    Pyke: ['AD', 'CC', 'Execute'],
    Qiyana: ['AD', 'Stealth', 'CC'],
    Quinn: ['AD', 'Dash', 'CC'],
    Rakan: ['AP', 'CC', 'Shield'],
    Rammus: ['Tank', 'CC'],
    RekSai: ['AD', 'Dash', 'True'],
    Rell: ['Tank', 'CC', 'Zone'],
    Renata: ['AP', 'CC', 'Shield'],
    Renekton: ['AD', 'Dash', 'CC'],
    Rengar: ['AD', 'Stealth', 'Execute'],
    Riven: ['AD', 'Shield', 'Dash'],
    Rumble: ['AP', 'Zone', 'CC'],
    Ryze: ['AP', 'CC', 'Zone'],
    Samira: ['AD', 'Dash'],
    Sejuani: ['Tank', 'CC', 'Zone'],
    Senna: ['AD', 'CC', 'Heal'],
    Seraphine: ['AP', 'CC', 'Heal'],
    Sett: ['AD', 'Tank', 'True'],
    Shaco: ['AD', 'Stealth', 'Summon'],
    Shen: ['Tank', 'CC', 'Global'],
    Shyvana: ['AD', 'AP', 'Zone'],
    Singed: ['Tank', 'CC', 'Zone'],
    Sion: ['Tank', 'CC', 'Zone'],
    Sivir: ['AD', 'Zone', 'Shield'],
    Skarner: ['Tank', 'CC'],
    Smolder: ['AD', 'AP', 'Zone'],
    Sona: ['AP', 'CC', 'Heal'],
    Soraka: ['AP', 'CC', 'Heal'],
    Swain: ['AP', 'CC', 'Heal'],
    Sylas: ['AP', 'Dash', 'Heal'],
    Syndra: ['AP', 'CC', 'Zone'],
    TahmKench: ['Tank', 'CC', 'Heal'],
    Taliyah: ['AP', 'CC', 'Global'],
    Talon: ['AD', 'Stealth', 'Dash'],
    Taric: ['Tank', 'CC', 'Heal'],
    Teemo: ['AP', 'Stealth', 'Zone'],
    Thresh: ['Tank', 'CC', 'Shield'],
    Tristana: ['AD', 'Dash', 'Zone'],
    Trundle: ['AD', 'Tank', 'CC'],
    Tryndamere: ['AD', 'Dash', 'Execute'],
    TwistedFate: ['AP', 'CC', 'Global'],
    Twitch: ['AD', 'Stealth', 'Zone'],
    Udyr: ['Tank', 'CC', 'Heal'],
    Urgot: ['AD', 'Tank', 'Execute'],
    Varus: ['AD', 'CC', 'Zone'],
    Vayne: ['AD', 'True', 'Execute'],
    Veigar: ['AP', 'CC', 'Execute'],
    VelKoz: ['AP', 'CC', 'True'],
    Vex: ['AP', 'CC', 'Zone'],
    Vi: ['AD', 'CC', 'Dash'],
    Viego: ['AD', 'Stealth', 'Heal'],
    Viktor: ['AP', 'CC', 'Zone'],
    Vladimir: ['AP', 'Heal', 'Zone'],
    Volibear: ['Tank', 'CC'],
    Warwick: ['Tank', 'CC', 'Heal'],
    Wukong: ['AD', 'Stealth', 'CC'],
    Xayah: ['AD', 'CC', 'Dash'],
    Xerath: ['AP', 'CC', 'Global'],
    XinZhao: ['AD', 'CC', 'Heal'],
    Yasuo: ['AD', 'Dash', 'Shield'],
    Yone: ['AD', 'AP', 'Dash'],
    Yorick: ['AD', 'Summon', 'Zone'],
    Yuumi: ['AP', 'Heal', 'Shield'],
    Zac: ['Tank', 'CC', 'Dash'],
    Zed: ['AD', 'Stealth', 'Execute'],
    Zeri: ['AD', 'Dash', 'Shield'],
    Ziggs: ['AP', 'Zone', 'CC'],
    Zilean: ['AP', 'CC', 'Zone'],
    Zoe: ['AP', 'CC', 'Zone'],
    Zyra: ['AP', 'CC', 'Summon']
};

// Gera os badges HTML de dano/especiais para um campeão (até 3 badges no card)
function gerarBadgesDanoCampeao(champId) {
    const perfil = PERFIS_CAMPEAO[champId];
    if (!perfil || perfil.length === 0) return '';
    return perfil.slice(0, 3).map(key => {
        const attr = ICONES_ATRIBUTO[key];
        if (!attr) return '';
        const iconeHtml = attr.class
            ? `<span class="stat-img-icon ${attr.class}" aria-hidden="true"></span>`
            : `<i class="${attr.icon}" style="color:${attr.color}; font-size:11px;"></i>`;
        return `<span class="champ-damage-badge" title="${attr.label}">${iconeHtml} ${key}</span>`;
    }).join('');
}

// Gera badges de dano completos para o modal do campeão (todos os badges)
function gerarBadgesDanoModalCampeao(champId) {
    const perfil = PERFIS_CAMPEAO[champId];
    if (!perfil || perfil.length === 0) return '';
    return perfil.map(key => {
        const attr = ICONES_ATRIBUTO[key];
        if (!attr) return '';
        const badgeClass = key === 'AD' ? 'stat-badge-ad' : key === 'AP' ? 'stat-badge-ap' : key === 'Tank' ? 'stat-badge-armor' : key === 'Heal' ? 'stat-badge-health' : key === 'Shield' ? 'stat-badge-mr' : '';
        const iconeHtml = attr.class
            ? `<span class="stat-img-icon ${attr.class}" style="width:16px; height:16px;" aria-hidden="true"></span>`
            : `<i class="${attr.icon}" style="color:${attr.color}; font-size:12px;"></i>`;
        return `<span class="stat-icon-badge ${badgeClass}" title="${attr.label}">${iconeHtml} ${attr.label}</span>`;
    }).join('');
}

/* ==========================================================================
   INICIALIZAÇÃO DA APLICAÇÃO
   ========================================================================== */
document.addEventListener('DOMContentLoaded', async () => {
    configurarNavegacao();
    configurarFiltros();
    configurarEventosModais();

    // 1. Sincroniza a versão oficial do Data Dragon
    await carregarVersaoDDragon();

    // 2. Carrega Campeões, Itens, Runas e Resumos Autorais em paralelo
    await Promise.all([
        carregarCampeoesDoDataDragon(),
        carregarItensDoDataDragon(),
        carregarRunasDoDataDragon(),
        carregarResumosAutorais()
    ]);
});

/* ==========================================================================
   1. VERSÃO DO DATA DRAGON
   ========================================================================== */
async function carregarVersaoDDragon() {
    try {
        const response = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
        if (response.ok) {
            const versions = await response.json();
            if (Array.isArray(versions) && versions.length > 0) {
                versaoAtual = versions[0];
                console.log(`[LoL Codex] Sincronizado: Versão ${versaoAtual} | Idioma ${idiomaAtual}`);
            }
        }
    } catch (erro) {
        console.warn(`[LoL Codex] Falha ao obter versões, mantendo: ${versaoAtual}`, erro);
    }
}

/* ==========================================================================
   1b. RESUMOS AUTORAIS (3 JSONs locais)
   ========================================================================== */
async function carregarResumosAutorais() {
    const carregarJSON = async (caminho, fallback = {}) => {
        try {
            const res = await fetch(caminho);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
        } catch (erro) {
            console.warn(`[LoL Codex] Resumo não encontrado (${caminho}):`, erro.message);
            return fallback;
        }
    };

    const [habilidades, itens, runas, glossario] = await Promise.all([
        carregarJSON('../data/skill-resum.json'),
        carregarJSON('../data/item-resum.json'),
        carregarJSON('../data/rune-resum.json'),
        carregarJSON('../data/glossary.json')
    ]);

    resumoHabilidades = habilidades;
    resumoItens = itens;
    resumoRunas = runas;
    glossarioLol = glossario;
    console.log('[LoL Codex] Resumos autorais e glossário carregados:', {
        campeoes: Object.keys(resumoHabilidades).filter(k => !k.startsWith('_')).length,
        itens: Object.keys(resumoItens).filter(k => !k.startsWith('_')).length,
        runas: Object.keys(resumoRunas).filter(k => !k.startsWith('_')).length,
        termosGlossario: Object.keys(glossarioLol).filter(k => !k.startsWith('_')).length
    });
}

/* ==========================================================================
   2. CAMPEÕES VIA DATA DRAGON
   ========================================================================== */
async function carregarCampeoesDoDataDragon() {
    const grid = document.getElementById('champions-grid');
    try {
        const url = `https://ddragon.leagueoflegends.com/cdn/${versaoAtual}/data/${idiomaAtual}/champion.json`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);

        const data = await res.json();
        todosCampeoes = Object.values(data.data).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

        const counter = document.getElementById('countChamps');
        if (counter) counter.textContent = `${todosCampeoes.length} Campeões`;

        renderizarCampeoes(todosCampeoes);
    } catch (erro) {
        console.error('[LoL Codex] Erro ao carregar campeões:', erro);
        if (grid) {
            grid.innerHTML = `
                <div class="loading-box" style="color:#ef4444;">
                    <i class="fa-solid fa-triangle-exclamation" style="font-size:2rem;"></i>
                    <p>Não foi possível carregar os campeões da API no momento.</p>
                </div>
            `;
        }
    }
}

function identificarRotaPrincipalCampeao(champ) {
    const tags = champ.tags || [];
    // Mapeamento clássico de classe para rota típica
    if (tags.includes('Marksman')) return 'ADC';
    if (tags.includes('Support')) return 'Suporte';
    if (tags.includes('Mage')) return 'Mid';
    if (tags.includes('Assassin')) return 'Mid';
    if (tags.includes('Fighter')) return 'Top';
    if (tags.includes('Tank')) return 'Top';
    return 'Mid';
}

function renderizarCampeoes(lista) {
    const mainGrid = document.getElementById('champions-grid');
    const featuredGrid = document.getElementById('featuredChampGrid');

    if (mainGrid) {
        if (lista.length === 0) {
            mainGrid.innerHTML = `
                <div class="loading-box">
                    <i class="fa-solid fa-ghost" style="font-size:2rem; color:var(--gold-primary);"></i>
                    <p>Nenhum campeão encontrado para o filtro selecionado.</p>
                </div>
            `;
        } else {
            mainGrid.innerHTML = lista.map(c => criarCardCampeaoHTML(c)).join('');
        }
    }

    if (featuredGrid && todosCampeoes.length > 0) {
        featuredGrid.innerHTML = todosCampeoes.slice(0, 4).map(c => criarCardCampeaoHTML(c)).join('');
    }
}

function criarCardCampeaoHTML(champ) {
    const splashId = champ.id === 'Fiddlesticks' ? 'FiddleSticks' : champ.id;
    const splashUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${splashId}_0.jpg`;
    const rotaPrincipal = identificarRotaPrincipalCampeao(champ);
    const iconeRotaUrl = ICONES_ROTAS[rotaPrincipal] || ICONES_ROTAS.Mid;
    const iconUrl = `https://ddragon.leagueoflegends.com/cdn/${versaoAtual}/img/champion/${champ.id}.png`;
    const badgesDano = gerarBadgesDanoCampeao(champ.id);

    return `
        <div class="champ-card" onclick="abrirModalCampeao('${champ.id}')" onmouseenter="aplicarCorCardHover(this, '${iconUrl}')">
            <div class="champ-banner" style="background-image: url('${splashUrl}');"></div>
            <!-- Símbolo da rota oficial do LoL em vez de texto escrito -->
            <div class="champ-badge-lane" title="Rota: ${rotaPrincipal}">
                <img src="${iconeRotaUrl}" alt="${rotaPrincipal}">
            </div>
            <div class="champ-info">
                <h3 class="champ-name">${champ.name}</h3>
                <div class="champ-tags">
                    ${(champ.tags || []).map(t => {
        const cls = ICONES_CLASSES[t];
        if (cls) {
            return `<span class="tag tag-icon-class" title="${cls.label}"><img src="${cls.url}" alt="${cls.label}" class="tag-class-icon"></span>`;
        }
        return `<span class="tag">${traduzirTag(t)}</span>`;
    }).join('')}
                </div>
                <div class="champ-footer">
                    ${badgesDano}
                </div>
            </div>
        </div>
    `;
}


/* ==========================================================================
   3. ITENS VIA DATA DRAGON (COM SÍMBOLOS DE ATRIBUTOS E SEM A PALAVRA GOLD)
   ========================================================================== */
async function carregarItensDoDataDragon() {
    const grid = document.getElementById('items-grid');
    try {
        const url = `https://ddragon.leagueoflegends.com/cdn/${versaoAtual}/data/${idiomaAtual}/item.json`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);

        const data = await res.json();
        todosItens = data.data || {};

        // Filtra somente itens válidos de Summoner's Rift
        itensValidosSR = Object.entries(todosItens)
            .filter(([id, item]) => {
                const emSummonersRift = item.maps && item.maps['11'] === true;
                const podeComprar = item.gold && item.gold.purchasable !== false && item.gold.total > 0;
                const disponivelNaLoja = item.inStore !== false;
                return emSummonersRift && podeComprar && disponivelNaLoja;
            })
            .map(([id, item]) => ({ id, ...item }))
            .sort((a, b) => b.gold.total - a.gold.total);

        const counter = document.getElementById('countItems');
        if (counter) counter.textContent = `${itensValidosSR.length} Itens`;

        renderizarItens(itensValidosSR);
    } catch (erro) {
        console.error('[LoL Codex] Erro ao carregar itens:', erro);
        if (grid) {
            grid.innerHTML = `
                <div class="loading-box" style="color:#ef4444;">
                    <i class="fa-solid fa-triangle-exclamation" style="font-size:2rem;"></i>
                    <p>Não foi possível carregar os itens no momento.</p>
                </div>
            `;
        }
    }
}

// ID do item atualmente aberto no modal (para re-renderizar ao trocar o switch)
let itemModalAbertoAtual = null;

function alternarResumoItens(ativado) {
    modoResumoItens = ativado;

    // Sincroniza toggles e labels da página principal e do modal
    const mainToggle = document.getElementById('itemSummaryToggle');
    if (mainToggle && mainToggle.checked !== ativado) mainToggle.checked = ativado;

    const mainDetLabel = document.getElementById('itemDetailsLabel');
    const mainResLabel = document.getElementById('itemSummaryLabel');
    if (mainDetLabel) mainDetLabel.classList.toggle('switch-label-active', !ativado);
    if (mainResLabel) mainResLabel.classList.toggle('switch-label-active', ativado);

    // Fade out suave na grid de itens
    const grid = document.getElementById('items-grid');
    if (grid) {
        grid.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        grid.style.opacity = '0';
        grid.style.transform = 'translateY(4px)';
        setTimeout(() => {
            filtrarItens();
            grid.style.opacity = '1';
            grid.style.transform = 'translateY(0)';
        }, 200);
    } else {
        filtrarItens();
    }

    // Transição suave no modal de item se estiver aberto
    if (itemModalAbertoAtual && todosItens[itemModalAbertoAtual]) {
        const modalDetLabel = document.getElementById('itemModalSwitchLabelDet');
        const modalResLabel = document.getElementById('itemModalSwitchLabelRes');
        if (modalDetLabel) modalDetLabel.classList.toggle('switch-label-active', !ativado);
        if (modalResLabel) modalResLabel.classList.toggle('switch-label-active', ativado);

        const modalToggle = document.querySelector('#item-modal-content .hextech-toggle input');
        if (modalToggle && modalToggle.checked !== ativado) modalToggle.checked = ativado;

        const modalDesc = document.querySelector('#item-modal-content .item-ddragon-desc');
        if (modalDesc) {
            modalDesc.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
            modalDesc.style.opacity = '0';
            modalDesc.style.transform = 'translateY(4px)';
            setTimeout(() => {
                abrirModalItem(itemModalAbertoAtual);
            }, 200);
        } else {
            abrirModalItem(itemModalAbertoAtual);
        }
    }
}

function renderizarItens(lista) {
    const grid = document.getElementById('items-grid');
    if (!grid) return;

    if (lista.length === 0) {
        grid.innerHTML = `
            <div class="loading-box">
                <i class="fa-solid fa-gem" style="font-size:2rem; color:var(--gold-primary);"></i>
                <p>Nenhum item encontrado para esta categoria ou busca.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = lista.map(item => criarCardItemHTML(item)).join('');
}

function criarCardItemHTML(item) {
    const iconUrl = `https://ddragon.leagueoflegends.com/cdn/${versaoAtual}/img/item/${item.id}.png`;
    const preco = item.gold && item.gold.total ? item.gold.total : 0;

    // Ícones visuais de atributos em vez de texto escrito (passando o item completo para analisar tags e stats)
    const iconesAtributos = gerarIconesAtributosItem(item);

    // Modo resumo vs detalhado: Resumo = texto autoral do JSON; Detalhado = plaintext limpo do DDragon
    const resumoItem = resumoItens[item.id];
    let textoExibicao;
    if (modoResumoItens && resumoItem && resumoItem.resumo && !resumoItem.resumo.startsWith('TODO:')) {
        textoExibicao = resumoItem.resumo;
    } else {
        textoExibicao = item.plaintext || limparTagsHTML(item.description || '') || 'Item de Summoner\'s Rift.';
    }

    return `
        <div class="item-card" onclick="abrirModalItem('${item.id}')" onmouseenter="aplicarCorCardHover(this, '${iconUrl}')">
            <div class="item-header">
                <img src="${iconUrl}" class="item-icon" alt="${item.name}" loading="lazy">
                <div class="item-title-wrap">
                    <div class="item-name-row" style="display:flex; align-items:center; justify-content:space-between; gap:0.5rem;">
                        <h4>${item.name}</h4>
                        <!-- Apenas a moeda e o valor, sem a palavra gold -->
                        <span class="item-cost"><i class="fa-solid fa-coins" style="color:var(--gold-bright);"></i> ${preco}</span>
                    </div>
                    <!-- Badges de atributos abaixo do nome do item (ex: Força da Trindade > AD LP AS) -->
                    <div class="item-badges" style="display:flex; flex-wrap:wrap; gap:0.35rem; margin-top:0.35rem;">
                        ${iconesAtributos}
                    </div>
                </div>
            </div>
            <p class="item-stats" style="font-size:0.8rem; color:var(--text-body); line-height:1.4;">${textoExibicao}</p>
        </div>
    `;
}

function gerarIconesAtributosItem(itemOuTags) {
    const item = (typeof itemOuTags === 'object' && !Array.isArray(itemOuTags)) ? itemOuTags : null;
    const tags = Array.isArray(itemOuTags) ? itemOuTags : (item?.tags || []);
    const stats = item?.stats || {};

    let badges = [];

    // Dano Físico (AD)
    if (tags.includes('Damage') || Boolean(stats.FlatPhysicalDamageMod)) {
        badges.push(`<span class="stat-icon-badge stat-badge-ad" title="Dano Físico (AD)"><span class="stat-img-icon stat-img-ad" aria-hidden="true"></span> AD</span>`);
    }

    // Poder de Habilidade (AP)
    if (tags.includes('SpellDamage') || Boolean(stats.FlatMagicDamageMod)) {
        badges.push(`<span class="stat-icon-badge stat-badge-ap" title="Poder de Habilidade (AP)"><span class="stat-img-icon stat-img-ap" aria-hidden="true"></span> AP</span>`);
    }

    // Armadura (ARMOR) - Estritamente itens que concedem armadura, NUNCA apenas vida!
    if (tags.includes('Armor') || Boolean(stats.FlatArmorMod)) {
        badges.push(`<span class="stat-icon-badge stat-badge-armor" title="Armadura (ARMOR)"><span class="stat-img-icon stat-img-armor" aria-hidden="true"></span> ARMOR</span>`);
    }

    // Vida (LP) - Itens que concedem vida
    if (tags.includes('Health') || Boolean(stats.FlatHPPoolMod)) {
        badges.push(`<span class="stat-icon-badge stat-badge-health" title="Vida (LP)"><span class="stat-img-icon stat-img-health" aria-hidden="true"></span> LP</span>`);
    }

    // Velocidade de Ataque (AS)
    if (tags.includes('AttackSpeed') || Boolean(stats.PercentAttackSpeedMod)) {
        badges.push(`<span class="stat-icon-badge stat-badge-as" title="Velocidade de Ataque (AS)"><span class="stat-img-icon stat-img-as" aria-hidden="true"></span> AS</span>`);
    }

    // Aceleração de Habilidade (CDR)
    if (tags.includes('CooldownReduction') || tags.includes('AbilityHaste')) {
        badges.push(`<span class="stat-icon-badge stat-badge-cdr" title="Aceleração de Habilidade (CDR)"><span class="stat-img-icon stat-img-cdr" aria-hidden="true"></span> CDR</span>`);
    }

    // Crítico (CRIT)
    if (tags.includes('CriticalStrike') || Boolean(stats.FlatCritChanceMod)) {
        badges.push(`<span class="stat-icon-badge stat-badge-crit" title="Acerto Crítico (CRIT)"><span class="stat-img-icon stat-img-crit" aria-hidden="true"></span> CRIT</span>`);
    }

    // Roubo de Vida (LS)
    if (tags.includes('LifeSteal') || tags.includes('SpellVamp') || tags.includes('Omnivamp') || Boolean(stats.PercentLifeStealMod)) {
        badges.push(`<span class="stat-icon-badge stat-badge-ls" title="Roubo de Vida (LS)"><span class="stat-img-icon stat-img-ls" aria-hidden="true"></span> LS</span>`);
    }

    // Resistência Mágica (MR)
    if (tags.includes('SpellBlock') || tags.includes('MagicResist') || Boolean(stats.FlatSpellBlockMod)) {
        badges.push(`<span class="stat-icon-badge stat-badge-mr" title="Resistência Mágica (MR)"><span class="stat-img-icon stat-img-mr" aria-hidden="true"></span> MR</span>`);
    }

    // Penetração (PEN)
    if (tags.includes('ArmorPenetration') || tags.includes('MagicPenetration')) {
        badges.push(`<span class="stat-icon-badge stat-badge-pen" title="Penetração (PEN)"><span class="stat-img-icon stat-img-pen" aria-hidden="true"></span> PEN</span>`);
    }

    // Mana (MANA)
    if (tags.includes('Mana') || tags.includes('ManaRegen') || Boolean(stats.FlatMPPoolMod)) {
        badges.push(`<span class="stat-icon-badge stat-badge-mana" title="Mana (MANA)"><span class="stat-img-icon stat-img-mana" aria-hidden="true"></span> MANA</span>`);
    }

    // Botas / Velocidade de Movimento (MOV)
    if (tags.includes('Boots') || tags.includes('NonbootsMovement') || Boolean(stats.FlatMovementSpeedMod) || Boolean(stats.PercentMovementSpeedMod)) {
        badges.push(`<span class="stat-icon-badge stat-badge-mov" title="Botas / Movimento (MOV)"><span class="stat-img-icon stat-img-mov" aria-hidden="true"></span> MOV</span>`);
    }

    if (badges.length === 0) {
        badges.push(`<span class="stat-icon-badge" title="Item de Suporte / Utilidade" style="border-color:var(--border-color); color:var(--gold-light);"><i class="fa-solid fa-sparkles" style="color:var(--gold-bright);"></i> UTIL</span>`);
    }

    return badges.join('');
}


/* ==========================================================================
   4. MODAL DETALHADO DE CAMPEÕES (COM CHAVE SWITCH E SEM LORE)
   ========================================================================== */
async function abrirModalCampeao(championId) {
    const modal = document.getElementById('champion-modal');
    const modalContent = document.getElementById('champion-modal-content');
    if (!modal || !modalContent) return;

    campeaoModalAbertoAtual = championId;

    modalContent.innerHTML = `
        <div class="loading-box" style="padding:4rem 1rem;">
            <div class="loading-spinner"></div>
            <p style="color:var(--gold-light);">Carregando habilidades de <strong>${championId}</strong>...</p>
        </div>
    `;
    modal.classList.add('active');

    try {
        let champData = detalhesCampeoesCache[championId];

        if (!champData) {
            const url = `https://ddragon.leagueoflegends.com/cdn/${versaoAtual}/data/${idiomaAtual}/champion/${championId}.json`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Falha na requisição: ${res.status}`);
            const json = await res.json();
            champData = json.data[championId];
            detalhesCampeoesCache[championId] = champData;
        }

        renderizarConteudoModalCampeao(champData);
    } catch (err) {
        console.error(`[LoL Codex] Erro ao carregar detalhes de ${championId}:`, err);
        modalContent.innerHTML = `
            <div class="loading-box" style="color:#ef4444;">
                <i class="fa-solid fa-triangle-exclamation" style="font-size:2rem;"></i>
                <p>Falha ao buscar os detalhes de <strong>${championId}</strong>.</p>
                <button class="filter-btn" style="margin-top:1rem;" onclick="fecharModalCampeao()">Fechar</button>
            </div>
        `;
    }
}

function alternarResumoHabilidadesCampeao(ativado) {
    modoResumoHabilidades = ativado;
    if (campeaoModalAbertoAtual && detalhesCampeoesCache[campeaoModalAbertoAtual]) {
        // Fade out suave antes de re-renderizar o conteúdo
        const grid = document.querySelector('#champion-modal-content .skills-grid');
        if (grid) {
            grid.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
            grid.style.opacity = '0';
            grid.style.transform = 'translateY(4px)';
            setTimeout(() => {
                renderizarConteudoModalCampeao(detalhesCampeoesCache[campeaoModalAbertoAtual]);
            }, 200);
        } else {
            renderizarConteudoModalCampeao(detalhesCampeoesCache[campeaoModalAbertoAtual]);
        }
    }
}

/* ==========================================================================
   4.1. EXTRAÇÃO DE COR PREDOMINANTE DINÂMICA — HSL Cluster Voting
   Agrupa os pixels por matiz (hue) em 36 buckets de 10° e escolhe o
   bucket com maior saturação×peso acumulado. Ignora cinzas e extremos.
   ========================================================================== */
const COR_CACHE_VERSION = 'v4'; // Incrementar aqui para invalidar o cache
const COR_CACHE_KEY = `lol_codex_cores_${COR_CACHE_VERSION}`;
const cacheCoresDinamicas = {};

// Cores temáticas fiéis/oficiais fixadas para campeões onde a roupa/identidade
// é muito específica e pode ser mascarada pelo fundo do ícone (ex: Akali ninja verde)
const CORES_CUSTOMIZADAS_CAMPEAO = {
    'Akali': { r: 16, g: 185, b: 129 },       // Verde ninja esmeralda característico da roupa clássica
    'Zac': { r: 34, g: 197, b: 94 },          // Verde gosma
    'Singed': { r: 132, g: 204, b: 22 },      // Verde tóxico
    'Vladimir': { r: 220, g: 38, b: 38 }      // Vermelho sangue hemomante
};

// Limpa versões antigas do cache ao iniciar
(function limparCacheAntigo() {
    try {
        ['lol_codex_cores_cache', 'lol_codex_cores_v1', 'lol_codex_cores_v2', 'lol_codex_cores_v3'].forEach(k => {
            if (localStorage.getItem(k)) localStorage.removeItem(k);
        });
        const salvo = localStorage.getItem(COR_CACHE_KEY);
        if (salvo) Object.assign(cacheCoresDinamicas, JSON.parse(salvo));
    } catch (e) { }
})();

function salvarCacheCores() {
    try {
        localStorage.setItem(COR_CACHE_KEY, JSON.stringify(cacheCoresDinamicas));
    } catch (e) { }
}

// Converte RGB para HSL, retornando { h: 0-360, s: 0-1, l: 0-1 }
function rgbParaHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    if (max === min) return { h: 0, s: 0, l };
    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h;
    switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        default: h = ((r - g) / d + 4) / 6;
    }
    return { h: h * 360, s, l };
}

// Converte HSL de volta para RGB (retorna { r, g, b })
function hslParaRgb(h, s, l) {
    h /= 360;
    const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    return {
        r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
        g: Math.round(hue2rgb(p, q, h) * 255),
        b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255)
    };
}

function obterCorPredominante(imgUrl) {
    if (!imgUrl) return Promise.resolve({ rgb: 'rgb(200, 170, 110)', rgba: 'rgba(200, 170, 110, 0.65)', rgbaGlow: 'rgba(200, 170, 110, 0.35)' });

    // Verifica se é uma URL de campeão com cor customizada prioritária
    for (const [champKey, corCustom] of Object.entries(CORES_CUSTOMIZADAS_CAMPEAO)) {
        if (imgUrl.includes(`champion/${champKey}.png`)) {
            const res = {
                rgb: `rgb(${corCustom.r}, ${corCustom.g}, ${corCustom.b})`,
                rgba: `rgba(${corCustom.r}, ${corCustom.g}, ${corCustom.b}, 0.65)`,
                rgbaGlow: `rgba(${corCustom.r}, ${corCustom.g}, ${corCustom.b}, 0.35)`
            };
            cacheCoresDinamicas[imgUrl] = res;
            return Promise.resolve(res);
        }
    }

    if (cacheCoresDinamicas[imgUrl]) {
        return Promise.resolve(cacheCoresDinamicas[imgUrl]);
    }

    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                // Usa 48×48 para ter mais amostragem sem custo excessivo
                canvas.width = 48;
                canvas.height = 48;
                ctx.drawImage(img, 0, 0, 48, 48);

                const data = ctx.getImageData(0, 0, 48, 48).data;

                // 36 buckets de 10° cada cobrindo 0-360°
                const BUCKETS = 36;
                const buckets = new Float64Array(BUCKETS); // score acumulado por hue bucket

                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
                    if (a < 128) continue;

                    const { h, s, l } = rgbParaHsl(r, g, b);

                    // Descarta cinzas (s < 0.15), muito escuros (l < 0.10) e muito claros/estourados (l > 0.92)
                    if (s < 0.15 || l < 0.10 || l > 0.92) continue;

                    // Score: saturação * (1 - |l - 0.5|*1.4) — favorece tons médios e saturados
                    // Quanto mais perto de l=0.5 e s=1.0, maior o score
                    const luminanceWeight = 1 - Math.abs(l - 0.5) * 1.4;
                    const score = s * Math.max(0, luminanceWeight);

                    const bucket = Math.floor(h / (360 / BUCKETS)) % BUCKETS;
                    buckets[bucket] += score;
                }

                // Encontra o bucket dominante (com suavização de janela de 3 buckets)
                let maxVal = -1, bestBucket = 0;
                for (let i = 0; i < BUCKETS; i++) {
                    // Suaviza com vizinhos para evitar picos artificiais numa única borda de cor
                    const smoothed = (buckets[(i - 1 + BUCKETS) % BUCKETS] * 0.25)
                        + (buckets[i] * 0.5)
                        + (buckets[(i + 1) % BUCKETS] * 0.25);
                    if (smoothed > maxVal) {
                        maxVal = smoothed;
                        bestBucket = i;
                    }
                }

                let bestColor;
                if (maxVal <= 0) {
                    // Fallback: nenhum hue dominante (ícone muito cinza/branco/preto)
                    bestColor = { r: 200, g: 170, b: 110 };
                } else {
                    // Hue central do bucket vencedor, com saturação e luminosidade calibradas para UI
                    const hue = (bestBucket + 0.5) * (360 / BUCKETS);
                    bestColor = hslParaRgb(hue, 0.85, 0.52);
                }

                const result = {
                    rgb: `rgb(${bestColor.r}, ${bestColor.g}, ${bestColor.b})`,
                    rgba: `rgba(${bestColor.r}, ${bestColor.g}, ${bestColor.b}, 0.65)`,
                    rgbaGlow: `rgba(${bestColor.r}, ${bestColor.g}, ${bestColor.b}, 0.35)`
                };

                cacheCoresDinamicas[imgUrl] = result;
                salvarCacheCores();
                resolve(result);
            } catch (err) {
                const fb = { rgb: 'rgb(200, 170, 110)', rgba: 'rgba(200, 170, 110, 0.65)', rgbaGlow: 'rgba(200, 170, 110, 0.35)' };
                resolve(fb);
            }
        };

        img.onerror = () => {
            const fb = { rgb: 'rgb(200, 170, 110)', rgba: 'rgba(200, 170, 110, 0.65)', rgbaGlow: 'rgba(200, 170, 110, 0.35)' };
            resolve(fb);
        };

        img.src = imgUrl;
    });
}

function aplicarCorCardHover(cardEl, imgUrl) {
    if (cardEl.dataset.corCarregada) return;
    obterCorPredominante(imgUrl).then(cor => {
        if (!cor) return;
        cardEl.style.setProperty('--card-glow-color', cor.rgb);
        cardEl.style.setProperty('--card-glow-rgba', cor.rgba);
        cardEl.dataset.corCarregada = 'true';
    });
}

function escaparParaAtributo(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/'/g, '&#39;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function formatarDescricaoComGlossario(texto) {
    if (!texto) return '';

    const termos = Object.keys(glossarioLol).filter(k => !k.startsWith('_')).sort((a, b) => b.length - a.length);
    if (termos.length === 0) {
        return texto.replace(/\n/g, '<br>');
    }

    const pattern = `\\b(${termos.map(t => t.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|')})\\b`;
    const regex = new RegExp(pattern, 'g');

    // Divide entre tags HTML e texto puro para não corromper tags oficiais (ex: <physicalDamage>, <br>)
    const partes = texto.split(/(<[^>]+>)/g);
    const resultado = partes.map(parte => {
        if (parte.startsWith('<') && parte.endsWith('>')) {
            return parte; // Preserva tag HTML oficial intacta
        }
        return parte.replace(regex, (match) => {
            const uppercase = match.toUpperCase();
            const tooltip = glossarioLol[uppercase] || glossarioLol[match];
            if (!tooltip) return match;
            return `<span class="lol-glossary-term" data-tooltip="${escaparParaAtributo(tooltip)}">${match}</span>`;
        });
    }).join('');

    return resultado.replace(/\n/g, '<br>');
}

function renderizarConteudoModalCampeao(champData) {
    const modalContent = document.getElementById('champion-modal-content');
    if (!modalContent) return;

    const splashId = champData.id === 'Fiddlesticks' ? 'FiddleSticks' : champData.id;
    const splashUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${splashId}_0.jpg`;
    const iconUrl = `https://ddragon.leagueoflegends.com/cdn/${versaoAtual}/img/champion/${champData.id}.png`;
    const champKeyPad = String(champData.key || '').padStart(4, '0');
    const safeChampName = escaparParaAtributo(champData.name);

    // Aplica a cor predominante do campeão dinamicamente na borda, luz, nome e detalhes da janela modal
    obterCorPredominante(iconUrl).then(cor => {
        const modalContainer = document.querySelector('#champion-modal .modal-container');
        if (modalContainer) {
            modalContainer.style.setProperty('--modal-accent-color', cor.rgb);
            modalContainer.style.setProperty('--modal-accent-glow', cor.rgba);
            modalContainer.style.setProperty('--modal-accent-border', cor.rgba.replace('0.65', '0.25'));
            modalContainer.style.setProperty('--modal-accent-glow-soft', cor.rgba.replace('0.65', '0.15'));
        }
        const champAvatar = document.getElementById('champ-modal-avatar');
        if (champAvatar) {
            champAvatar.style.borderColor = cor.rgb;
            champAvatar.style.boxShadow = `0 0 20px ${cor.rgba}`;
        }
        // Aplica cor dinâmica no nome do campeão
        const champNameEl = document.getElementById('champ-modal-name');
        if (champNameEl) {
            champNameEl.style.color = cor.rgb;
            champNameEl.style.textShadow = `0 0 18px ${cor.rgba}`;
        }
    });

    // Passiva: No modo detalhado, preserva 100% fiel com o Data Dragon / LoL (com tags <physicalDamage>, etc.)
    const passiveImg = champData.passive && champData.passive.image
        ? `https://ddragon.leagueoflegends.com/cdn/${versaoAtual}/img/passive/${champData.passive.image.full}`
        : '';
    const passiveName = champData.passive ? champData.passive.name : 'Passiva';
    const safePassiveName = escaparParaAtributo(passiveName);
    const rawPassiveDesc = champData.passive ? (champData.passive.description || '') : '';

    // Busca o resumo autoral no JSON (ou usa o texto oficial como fallback)
    const resumoChamp = modoResumoHabilidades ? (resumoHabilidades[champData.id] || null) : null;
    const indicadorFallback = modoResumoHabilidades && !resumoChamp
        ? '<span style="font-size:0.72rem; color:var(--text-muted); font-style:italic;">(Resumo autoral ainda não escrito)</span><br>'
        : '';

    const passiveDesc = resumoChamp
        ? (resumoChamp.P && !resumoChamp.P.startsWith('TODO:') ? resumoChamp.P : `${indicadorFallback}${rawPassiveDesc}`)
        : rawPassiveDesc;

    // Habilidades Q, W, E, R
    const keys = ['Q', 'W', 'E', 'R'];
    const spellsHtml = (champData.spells || []).map((spell, index) => {
        const spellKey = keys[index] || `H${index + 1}`;
        const spellImg = `https://ddragon.leagueoflegends.com/cdn/${versaoAtual}/img/spell/${spell.image.full}`;
        const safeSpellName = escaparParaAtributo(spell.name);

        // No modo detalhado, 100% fiel ao Data Dragon com todas as quebras de linha e tags
        const rawDesc = spell.description || '';

        let desc;
        if (resumoChamp && resumoChamp[spellKey] && !resumoChamp[spellKey].startsWith('TODO:')) {
            desc = resumoChamp[spellKey];
        } else if (modoResumoHabilidades && !resumoChamp) {
            desc = `${indicadorFallback}${rawDesc}`;
        } else {
            desc = rawDesc;
        }

        const cooldown = spell.cooldownBurn ? `${spell.cooldownBurn}s Recarga` : '';
        const custo = spell.costBurn && spell.costBurn !== '0' ? `${spell.costBurn} Custo` : 'Sem Custo';

        return `
            <div class="skill-card">
                <div class="skill-img-wrap" onclick="abrirVideoHabilidade('${champKeyPad}', '${spellKey}', '${safeChampName}', '${safeSpellName}')" title="Clique para assistir ao vídeo da habilidade ${spellKey}">
                    <img src="${spellImg}" alt="${spell.name}" class="skill-img" loading="lazy">
                    <div class="skill-img-play-overlay"><i class="fa-solid fa-play"></i></div>
                    <span class="skill-key-badge">${spellKey}</span>
                </div>
                <div class="skill-info">
                    <div class="skill-header-row">
                        <div class="skill-title-group">
                            <h4 class="skill-name">${spell.name}</h4>
                            <span class="skill-meta-tags">${cooldown ? cooldown + ' • ' : ''}${custo}</span>
                        </div>
                    </div>
                    <div class="skill-desc" style="${modoResumoHabilidades && resumoChamp ? 'color:var(--gold-light); font-weight:500;' : ''}">${formatarDescricaoComGlossario(desc)}</div>
                </div>
            </div>
        `;
    }).join('');

    const rolesStr = (champData.tags || []).map(t => {
        const cls = ICONES_CLASSES[t];
        if (cls) return `<img src="${cls.url}" alt="${cls.label}" title="${cls.label}" class="modal-class-icon">`;
        return `<span style="font-size:0.85rem; font-weight:700; color:var(--hextech-cyan-accent);">${traduzirTag(t)}</span>`;
    }).join('');

    modalContent.innerHTML = `
        <!-- Top Banner do Campeão com Splash Art (Sem Lore/Biografia) -->
        <div style="position:relative; border-radius:var(--radius-md); overflow:hidden; margin-bottom:1.5rem; border:1px solid var(--modal-accent-border, var(--border-gold));">
            <div style="height:170px; background-image:url('${splashUrl}'); background-size:cover; background-position:center 20%; position:relative;">
                <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(9,20,40,0.2) 0%, rgba(9,20,40,0.95) 100%);"></div>
            </div>
            <div style="display:flex; gap:1.25rem; align-items:flex-end; padding:0 1.5rem 1.25rem 1.5rem; margin-top:-55px; position:relative;">
                <img id="champ-modal-avatar" src="${iconUrl}" style="width:90px; height:90px; border-radius:var(--radius-md); border:2px solid var(--gold-bright); box-shadow:0 0 18px var(--gold-glow); object-fit:cover; background:#000; transition:border-color 0.3s ease, box-shadow 0.3s ease;">
                <div>
                    <div style="display:flex; align-items:center; gap:0.4rem; margin-bottom:0.2rem;">${rolesStr}</div>
                    <h2 id="champ-modal-name" style="font-size:2.2rem; font-family:var(--font-title); color:var(--gold-light); line-height:1.1; transition:color 0.35s ease, text-shadow 0.35s ease;">${champData.name}</h2>
                    <!-- Badges de dano/especiais do campeão -->
                    <div style="display:flex; flex-wrap:wrap; gap:0.35rem; margin-top:0.5rem;">
                        ${gerarBadgesDanoModalCampeao(champData.id)}
                    </div>
                </div>
            </div>
        </div>

        <!-- Seção de Habilidades com Chave Switch de Resumo -->
        <div style="display:flex; align-items:center; justify-content:flex-end; margin-bottom:1rem; flex-wrap:wrap; gap:0.75rem;">
            <!-- Chave Switch de Resumo das Habilidades -->
            <div class="switch-wrapper">
                <span class="${!modoResumoHabilidades ? 'switch-label-active' : ''}">Detalhado</span>
                <label class="hextech-toggle">
                    <input type="checkbox" ${modoResumoHabilidades ? 'checked' : ''} onchange="alternarResumoHabilidadesCampeao(this.checked)">
                    <span class="hextech-slider"></span>
                </label>
                <span class="${modoResumoHabilidades ? 'switch-label-active' : ''}">Resumido</span>
            </div>
        </div>
        
        <div class="skills-grid">
            <!-- Passiva -->
            <div class="skill-card">
                <div class="skill-img-wrap" onclick="abrirVideoHabilidade('${champKeyPad}', 'P', '${safeChampName}', '${safePassiveName}')" title="Clique para assistir ao vídeo da Passiva">
                    <img src="${passiveImg}" alt="${passiveName}" class="skill-img" loading="lazy">
                    <div class="skill-img-play-overlay"><i class="fa-solid fa-play"></i></div>
                    <span class="skill-key-badge">P</span>
                </div>
                <div class="skill-info">
                    <div class="skill-header-row">
                        <div class="skill-title-group">
                            <h4 class="skill-name">${passiveName}</h4>
                            <span class="skill-meta-tags">Passiva Inata</span>
                        </div>
                    </div>
                    <div class="skill-desc" style="${modoResumoHabilidades && resumoChamp ? 'color:var(--gold-light); font-weight:500;' : ''}">${formatarDescricaoComGlossario(passiveDesc)}</div>
                </div>
            </div>

            <!-- Q, W, E, R -->
            ${spellsHtml}
        </div>
    `;
}


/* ==========================================================================
   4.2. MODAL DE VÍDEO DE PRÉVIA DA HABILIDADE (CDN OFICIAL RIOT / CATALYST)
   ========================================================================== */
function abrirVideoHabilidade(champKeyPad, slotKey, champName, skillName) {
    const modal = document.getElementById('ability-video-modal');
    const container = document.getElementById('ability-video-content');
    if (!modal || !container) return;

    // CDN oficial da Riot Games utilizado pelo aplicativo Catalyst e pelo cliente LoL
    const mp4Url = `https://d28xe8vt774jo5.cloudfront.net/champion-abilities/${champKeyPad}/ability_${champKeyPad}_${slotKey}1.mp4`;
    const webmUrl = `https://d28xe8vt774jo5.cloudfront.net/champion-abilities/${champKeyPad}/ability_${champKeyPad}_${slotKey}1.webm`;

    // Subtítulo removido conforme solicitação
    container.innerHTML = `
        <div style="display:flex; align-items:center; justify-content:center; gap:0.6rem; margin-bottom:1rem; flex-wrap:wrap;">
            <span class="badge" style="background:#091428; border:1.5px solid var(--gold-bright); color:var(--gold-bright); font-size:0.9rem; padding:0.25rem 0.65rem; border-radius:var(--radius-sm); font-weight:800;">${slotKey}</span>
            <h3 style="font-family:var(--font-title); color:var(--gold-light); font-size:1.35rem; margin:0;">${champName} — ${skillName}</h3>
        </div>
        <div class="ability-video-player-wrap">
            <video id="active-ability-video" controls autoplay loop playsinline>
                <source src="${mp4Url}" type="video/mp4">
                <source src="${webmUrl}" type="video/webm">
                Seu navegador não suporta a reprodução deste vídeo.
            </video>
        </div>
        <div id="video-fallback-msg" style="display:none; margin-top:0.75rem; font-size:0.8rem; color:#f87171; background:rgba(239,68,68,0.12); border:1px solid #ef4444; padding:0.6rem; border-radius:var(--radius-sm);">
            <i class="fa-solid fa-circle-exclamation"></i> O vídeo oficial da Riot para esta habilidade não pôde ser carregado.<br>
            <span style="font-size:0.75rem; color:var(--text-muted);">URL testada: <code>${mp4Url}</code></span>
        </div>
    `;

    const videoEl = document.getElementById('active-ability-video');
    if (videoEl) {
        videoEl.play().catch(() => {
            videoEl.muted = true;
            videoEl.play().catch(e => console.warn('Autoplay bloqueado pelo navegador:', e));
        });

        const sources = videoEl.querySelectorAll('source');
        if (sources.length > 0) {
            const lastSource = sources[sources.length - 1];
            lastSource.addEventListener('error', () => {
                const fallback = document.getElementById('video-fallback-msg');
                if (fallback) fallback.style.display = 'block';
            });
        }
    }

    modal.classList.add('active');
}

function fecharVideoHabilidade() {
    const modal = document.getElementById('ability-video-modal');
    if (modal) {
        modal.classList.remove('active');
        const videoEl = document.getElementById('active-ability-video');
        if (videoEl) {
            videoEl.pause();
            videoEl.removeAttribute('src');
            videoEl.load();
        }
        const container = document.getElementById('ability-video-content');
        if (container) container.innerHTML = '';
    }
}

function fecharVideoHabilidadeSeClicarOverlay(event) {
    if (event.target && event.target.id === 'ability-video-modal') {
        fecharVideoHabilidade();
    }
}

function extrairResumoHabilidade(texto) {
    if (!texto) return '';
    // Pega a primeira frase mais relevante para formar um resumo rápido
    const frases = texto.split(/(?<=[.!?])\s+/);
    return frases[0] || texto;
}

function fecharModalCampeao() {
    const modal = document.getElementById('champion-modal');
    if (modal) modal.classList.remove('active');
    campeaoModalAbertoAtual = null;
}

/* ==========================================================================
   5. MODAL DETALHADO DE ITENS (RECEITAS E PREÇO SEM A PALAVRA GOLD)
   ========================================================================= */
function abrirModalItem(itemId) {
    const modal = document.getElementById('item-modal');
    const modalContent = document.getElementById('item-modal-content');
    if (!modal || !modalContent) return;

    const item = todosItens[itemId];
    if (!item) return;

    itemModalAbertoAtual = itemId; // Rastreia o item aberto para re-renderizar no switch

    const iconUrl = `https://ddragon.leagueoflegends.com/cdn/${versaoAtual}/img/item/${itemId}.png`;
    const precoTotal = item.gold && item.gold.total ? item.gold.total : 0;
    const precoBase = item.gold && item.gold.base ? item.gold.base : precoTotal;

    // Aplica a cor predominante do item dinamicamente na borda e luz da janela modal
    obterCorPredominante(iconUrl).then(cor => {
        const modalContainer = document.querySelector('#item-modal .modal-container');
        if (modalContainer) {
            modalContainer.style.setProperty('--modal-accent-color', cor.rgb);
            modalContainer.style.setProperty('--modal-accent-glow', cor.rgba);
        }
        const itemAvatar = document.getElementById('item-modal-avatar');
        if (itemAvatar) {
            itemAvatar.style.borderColor = cor.rgb;
            itemAvatar.style.boxShadow = `0 0 20px ${cor.rgba}`;
        }
    });

    const componentesHtml = (item.from && item.from.length > 0)
        ? item.from.map(compId => {
            const comp = todosItens[compId];
            if (!comp) return '';
            const compImg = `https://ddragon.leagueoflegends.com/cdn/${versaoAtual}/img/item/${compId}.png`;
            return `
                <div class="recipe-chip" onclick="abrirModalItem('${compId}')" title="${comp.name}">
                    <img src="${compImg}" alt="${comp.name}">
                    <span>${comp.name}</span>
                    <small>(<i class="fa-solid fa-coins"></i> ${comp.gold ? comp.gold.total : 0})</small>
                </div>
            `;
        }).join('')
        : '<p style="font-size:0.8rem; color:var(--text-muted);">Item básico (não possui componentes prévios).</p>';

    const constroiEmHtml = (item.into && item.into.length > 0)
        ? item.into.map(intoId => {
            const intoItem = todosItens[intoId];
            if (!intoItem) return '';
            const intoImg = `https://ddragon.leagueoflegends.com/cdn/${versaoAtual}/img/item/${intoId}.png`;
            return `
                <div class="recipe-chip" onclick="abrirModalItem('${intoId}')" title="${intoItem.name}">
                    <img src="${intoImg}" alt="${intoItem.name}">
                    <span>${intoItem.name}</span>
                    <small>(<i class="fa-solid fa-coins"></i> ${intoItem.gold ? intoItem.gold.total : 0})</small>
                </div>
            `;
        }).join('')
        : '';

    modalContent.innerHTML = `
        <div style="display:flex; gap:1.25rem; align-items:center; margin-bottom:1.5rem; border-bottom:1px solid var(--border-color); padding-bottom:1.25rem;">
            <img id="item-modal-avatar" src="${iconUrl}" style="width:75px; height:75px; border-radius:var(--radius-md); border:2px solid var(--gold-bright); box-shadow:0 0 15px var(--gold-glow); object-fit:cover; background:#000; transition:border-color 0.3s ease, box-shadow 0.3s ease;">
            <div style="flex-grow:1;">
                <h2 style="font-size:1.85rem; font-family:var(--font-title); color:var(--gold-light); line-height:1.2;">${item.name}</h2>
                <!-- Badges de atributos abaixo do nome do item (ex: Força da Trindade > AD LP AS) -->
                <div style="display:flex; gap:0.4rem; margin-top:0.35rem; flex-wrap:wrap;">
                    ${gerarIconesAtributosItem(item)}
                </div>
                <div style="display:flex; gap:1rem; align-items:center; margin-top:0.3rem;">
                    <!-- Apenas a moeda e valor, sem a palavra gold -->
                    <span style="color:var(--gold-bright); font-weight:700; font-size:1.1rem;"><i class="fa-solid fa-coins"></i> ${precoTotal}</span>
                    <span style="color:var(--text-muted); font-size:0.82rem;">(Receita: ${precoBase})</span>
                </div>
            </div>
        </div>

        <div style="margin-bottom:1.5rem;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.5rem; gap:0.75rem; flex-wrap:wrap;">
                <h4 style="color:var(--gold-light); font-size:0.92rem; margin:0; display:flex; align-items:center; gap:0.4rem;">
                    <i class="fa-solid fa-shield-halved" style="color:var(--gold-bright);"></i> Atributos &amp; Efeitos:
                </h4>
                <div class="switch-wrapper" style="font-size:0.8rem;">
                    <span id="itemModalSwitchLabelDet" class="${!modoResumoItens ? 'switch-label-active' : ''}">Detalhado</span>
                    <label class="hextech-toggle">
                        <input type="checkbox" ${modoResumoItens ? 'checked' : ''} onchange="alternarResumoItens(this.checked)">
                        <span class="hextech-slider"></span>
                    </label>
                    <span id="itemModalSwitchLabelRes" class="${modoResumoItens ? 'switch-label-active' : ''}">Resumido</span>
                </div>
            </div>
            <div class="item-ddragon-desc" style="background:var(--bg-panel); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem;">
                ${(() => {
            const resumoItemModal = resumoItens[itemId];
            if (modoResumoItens) {
                if (resumoItemModal && resumoItemModal.resumo && !resumoItemModal.resumo.startsWith('TODO:')) {
                    return `<p style="color:var(--gold-light); font-weight:500;">${resumoItemModal.resumo}</p>`;
                }
                const fallbackText = item.plaintext || limparTagsHTML(item.description || '') || 'Descrição não disponível.';
                return `<span style="font-size:0.72rem; color:var(--text-muted); font-style:italic;">(Resumo autoral ainda não escrito)</span><br><p>${fallbackText}</p>`;
            }
            return item.description || '<p>Sem descrição adicional.</p>';
        })()}
            </div>
        </div>


        <div class="recipe-section">
            <div class="recipe-header"><i class="fa-solid fa-screwdriver-wrench" style="color:var(--gold-bright);"></i> Construído a partir de (Componentes):</div>
            <div class="recipe-grid">
                ${componentesHtml}
            </div>
        </div>

        ${constroiEmHtml ? `
            <div class="recipe-section" style="border-top:none; padding-top:0.75rem;">
                <div class="recipe-header"><i class="fa-solid fa-arrow-up-right-from-square" style="color:var(--hextech-cyan-accent);"></i> Evolui para:</div>
                <div class="recipe-grid">
                    ${constroiEmHtml}
                </div>
            </div>
        ` : ''}
    `;

    modal.classList.add('active');
}

function fecharModalItem() {
    const modal = document.getElementById('item-modal');
    if (modal) modal.classList.remove('active');
    itemModalAbertoAtual = null;
}

function closeModal() {
    fecharVideoHabilidade();
    fecharModalCampeao();
    fecharModalItem();
    const detailModal = document.getElementById('detailModal');
    if (detailModal) detailModal.classList.remove('active');
}

/* ==========================================================================
   6. RUNAS REFORJADAS E STAT SHARDS (SUB-RUNAS E TERCIÁRIAS COM SWITCH)
   ========================================================================== */
async function carregarRunasDoDataDragon() {
    const container = document.getElementById('runes-container');
    try {
        const url = `https://ddragon.leagueoflegends.com/cdn/${versaoAtual}/data/${idiomaAtual}/runesReforged.json`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);

        todasRunas = await res.json();
        renderizarRunas();
    } catch (erro) {
        console.error('[LoL Codex] Erro ao carregar runas:', erro);
        if (container) {
            container.innerHTML = `
                <div class="loading-box" style="color:#ef4444;">
                    <i class="fa-solid fa-triangle-exclamation" style="font-size:2rem;"></i>
                    <p>Não foi possível carregar as runas da API no momento.</p>
                </div>
            `;
        }
    }
}

function alternarResumoRunas(ativado) {
    modoResumoRunas = ativado;
    const detLabel = document.getElementById('runeDetailsLabel');
    const resLabel = document.getElementById('runeSummaryLabel');
    if (detLabel) detLabel.classList.toggle('switch-label-active', !ativado);
    if (resLabel) resLabel.classList.toggle('switch-label-active', ativado);

    const container = document.getElementById('runes-container');
    if (container) {
        container.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        container.style.opacity = '0';
        container.style.transform = 'translateY(4px)';
        setTimeout(() => {
            renderizarRunas();
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }, 200);
    } else {
        renderizarRunas();
    }
}

function renderizarRunas() {
    const container = document.getElementById('runes-container');
    if (!container || todasRunas.length === 0) return;

    const arvoresHtml = todasRunas.map(tree => {
        const treeIcon = `https://ddragon.leagueoflegends.com/cdn/img/${tree.icon}`;

        // Slots da árvore: Slot 0 = Keystones; Slots 1, 2, 3 = Sub-runas
        const slotsHtml = tree.slots.map((slot, sIdx) => {
            const slotNome = sIdx === 0 ? 'Runa Essencial (Keystone)' : `Sub-Runa (Linha ${sIdx})`;

            const runasSlotHtml = slot.runes.map(r => {
                const runeIcon = `https://ddragon.leagueoflegends.com/cdn/img/${r.icon}`;

                // Modo resumo: busca texto autoral no JSON, fallback para shortDesc da Riot
                let desc;
                if (modoResumoRunas) {
                    const resumoRuna = resumoRunas[r.name];
                    if (resumoRuna && resumoRuna.resumo && !resumoRuna.resumo.startsWith('TODO:')) {
                        desc = resumoRuna.resumo;
                    } else {
                        desc = limparTagsHTML(r.shortDesc); // Fallback para o shortDesc oficial
                    }
                } else {
                    desc = limparTagsHTML(r.longDesc); // Modo detalhado: descrição completa
                }

                return `
                    <div class="rune-item ${sIdx === 0 ? 'keystone' : ''}" title="${r.name}">
                        <img src="${runeIcon}" alt="${r.name}" class="rune-item-img" loading="lazy">
                        <div>
                            <div class="rune-item-name">${r.name}</div>
                            <div class="rune-item-desc">${desc}</div>
                        </div>
                    </div>
                `;
            }).join('');


            return `
                <div class="rune-slot-col">
                    <span class="rune-slot-label">${slotNome}</span>
                    <div style="display:flex; flex-direction:column; gap:0.5rem;">
                        ${runasSlotHtml}
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="rune-tree-box">
                <div class="rune-tree-header">
                    <img src="${treeIcon}" alt="${tree.name}">
                    <div>
                        <h3 class="rune-tree-title">${tree.name}</h3>
                        <span style="font-size:0.8rem; color:var(--text-muted);">Árvore Principal e Sub-runas</span>
                    </div>
                </div>
                <div class="rune-slots-grid">
                    ${slotsHtml}
                </div>
            </div>
        `;
    }).join('');

    // Fragmentos de Atributos (Runas Terciárias / Stat Shards)
    const statShardsHtml = `
        <div class="stat-shards-section">
            <h3 class="stat-shards-title">
                <i class="fa-solid fa-cubes-stacked" style="color:var(--gold-bright);"></i> Fragmentos de Atributos (Runas Terciárias)
            </h3>
            <p class="stat-shards-subtitle">Três linhas de escolhas bônus de atributos para personalizar a sobrevivência e poder do seu campeão:</p>

            <div class="stat-shards-grid">
                <!-- Linha 1: Ofensiva -->
                <div class="shard-tier-card">
                    <div class="shard-tier-title"><i class="fa-solid fa-swords"></i> Linha 1: Ofensiva</div>
                    <div class="shard-options">
                        <div class="shard-option">
                            <img src="https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodsadaptiveforceicon.png" class="shard-icon" alt="Força">
                            <div><strong>+9 de Força Adaptativa</strong> (Dano ou AP)</div>
                        </div>
                        <div class="shard-option">
                            <img src="https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodsattackspeedicon.png" class="shard-icon" alt="Vel. Ataque">
                            <div><strong>+10% de Velocidade de Ataque</strong></div>
                        </div>
                        <div class="shard-option">
                            <img src="https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodscdrscalingicon.png" class="shard-icon" alt="Aceleração">
                            <div><strong>+8 de Aceleração de Habilidade</strong> (CDR)</div>
                        </div>
                    </div>
                </div>

                <!-- Linha 2: Flexível -->
                <div class="shard-tier-card">
                    <div class="shard-tier-title"><i class="fa-solid fa-shuffle"></i> Linha 2: Flexível</div>
                    <div class="shard-options">
                        <div class="shard-option">
                            <img src="https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodsadaptiveforceicon.png" class="shard-icon" alt="Força">
                            <div><strong>+9 de Força Adaptativa</strong></div>
                        </div>
                        <div class="shard-option">
                            <img src="https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodsmovementspeedicon.png" class="shard-icon" alt="Velocidade">
                            <div><strong>+2% de Velocidade de Movimento</strong></div>
                        </div>
                        <div class="shard-option">
                            <img src="https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodshealthscalingicon.png" class="shard-icon" alt="Vida">
                            <div><strong>+10 a 180 de Vida</strong> (baseado no nível)</div>
                        </div>
                    </div>
                </div>

                <!-- Linha 3: Defensiva -->
                <div class="shard-tier-card">
                    <div class="shard-tier-title"><i class="fa-solid fa-shield-heart"></i> Linha 3: Defensiva</div>
                    <div class="shard-options">
                        <div class="shard-option">
                            <img src="https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodshealthplusicon.png" class="shard-icon" alt="Vida Plana">
                            <div><strong>+65 de Vida Plana</strong> imediata</div>
                        </div>
                        <div class="shard-option">
                            <img src="https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodshealthscalingicon.png" class="shard-icon" alt="Vida">
                            <div><strong>+10 a 180 de Vida</strong> (baseado no nível)</div>
                        </div>
                        <div class="shard-option">
                            <img src="https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodstenacityicon.png" class="shard-icon" alt="Tenacidade">
                            <div><strong>+10% de Tenacidade</strong> e Resistência a Redução</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = `
        <div class="runes-detailed-container">
            ${arvoresHtml}
            ${statShardsHtml}
        </div>
    `;
}

/* ==========================================================================
   7. FILTROS E PESQUISAS DINÂMICAS
   ========================================================================== */
function filtrarCampeoes() {
    const searchInput = document.getElementById('champSearch');
    const query = normalizarTextoBusca(searchInput ? searchInput.value : '');

    const filtrados = todosCampeoes.filter(champ => {
        const rotaDoChamp = identificarRotaPrincipalCampeao(champ);
        const matchRole = (filtroRotaAtiva === 'all') || (rotaDoChamp === filtroRotaAtiva);

        // Busca APENAS pelo nome do campeão (sem título, sem tags)
        const matchQuery = !query || normalizarTextoBusca(champ.name).includes(query);

        return matchRole && matchQuery;
    });

    renderizarCampeoes(filtrados);
}

function filtrarItens() {
    const searchInput = document.getElementById('itemSearch');
    const query = normalizarTextoBusca(searchInput ? searchInput.value : '');

    // Mostrar/ocultar botão limpar busca
    const clearBtn = document.getElementById('clearItemSearchBtn');
    if (clearBtn) clearBtn.style.display = (searchInput && searchInput.value.length > 0) ? 'block' : 'none';

    const filtrados = itensValidosSR.filter(item => {
        // Busca APENAS pelo nome do item (sem descrição, sem tags)
        const matchQuery = !query || normalizarTextoBusca(item.name).includes(query);

        // Se não há filtros ativos, aceita todos
        const matchAtributos = filtrosAtributosAtivos.size === 0 ||
            [...filtrosAtributosAtivos].every(attr => itemPossuiAtributo(item, attr));

        return matchQuery && matchAtributos;
    });

    // Atualizar prévia de contagem no modal
    const countPreview = document.getElementById('filteredItemsCountPreview');
    if (countPreview) {
        countPreview.textContent = filtrosAtributosAtivos.size === 0
            ? 'Mostrando todos os itens'
            : `${filtrados.length} item(s) encontrado(s)`;
    }

    renderizarItens(filtrados);
}

/* ==========================================================================
   SISTEMA DE FILTROS DE ITENS (JANELINHA MODAL)
   ========================================================================== */

function abrirModalFiltrosItens() {
    const backdrop = document.getElementById('itemFilterModalBackdrop');
    if (!backdrop) return;
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    filtrarItens(); // atualiza contagem no modal logo ao abrir
}

function fecharModalFiltrosItens(event) {
    // Se chamada via click no backdrop, fecha; se chamada diretamente (sem event), fecha sempre
    if (event && event.target !== document.getElementById('itemFilterModalBackdrop')) return;
    const backdrop = document.getElementById('itemFilterModalBackdrop');
    if (!backdrop) return;
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
}

function toggleFiltroAtributoItem(attr) {
    if (filtrosAtributosAtivos.has(attr)) {
        filtrosAtributosAtivos.delete(attr);
    } else {
        filtrosAtributosAtivos.add(attr);
    }
    atualizarInterfaceFiltrosItens();
    filtrarItens();
}

function removerFiltroAtributoItem(attr) {
    filtrosAtributosAtivos.delete(attr);
    atualizarInterfaceFiltrosItens();
    filtrarItens();
}

function limparTodosFiltrosItens() {
    filtrosAtributosAtivos.clear();
    atualizarInterfaceFiltrosItens();
    filtrarItens();
}

function limparBuscaItem() {
    const searchInput = document.getElementById('itemSearch');
    if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
    }
    filtrarItens();
}

function alternarExibicaoDescricaoItens() {
    mostrarDescricaoCardsItens = !mostrarDescricaoCardsItens;
    const grid = document.getElementById('items-grid');
    const btn = document.getElementById('itemInfoToggleBtn');
    if (grid) {
        if (mostrarDescricaoCardsItens) {
            grid.classList.remove('hide-item-desc');
        } else {
            grid.classList.add('hide-item-desc');
        }
    }
    if (btn) btn.classList.toggle('active', mostrarDescricaoCardsItens);
}

// Rótulos legíveis para os chips de filtro
const ROTULOS_ATRIBUTO = {
    AD: 'Dano de Ataque (AD)',
    AP: 'Poder de Habilidade (AP)',
    AS: 'Velocidade de Ataque (AS)',
    CRIT: 'Acerto Crítico (CRIT)',
    LS: 'Roubo de Vida (LS)',
    VAMP: 'Onivampirismo',
    ARMOR_PEN: 'Letalidade / Pen. Armadura',
    MAGIC_PEN: 'Penetração Mágica',
    HP: 'Vida / Saúde (LP)',
    ARMOR: 'Armadura (ARMOR)',
    MR: 'Resistência Mágica (MR)',
    HP_REGEN: 'Regeneração de Vida',
    TENACITY: 'Tenacidade / Resist. Lentidão',
    CDR: 'Aceleração de Habilidade (CDR)',
    MANA: 'Mana',
    MANA_REGEN: 'Regeneração de Mana',
    MOV: 'Velocidade de Movimento / Botas',
    HEAL_SHIELD: 'Cura e Resistência do Escudo'
};

function atualizarInterfaceFiltrosItens() {
    const count = filtrosAtributosAtivos.size;

    // Atualiza badge de contador no botão de filtros
    const counter = document.getElementById('itemFilterCounter');
    if (counter) {
        counter.textContent = count;
        counter.style.display = count > 0 ? 'inline-block' : 'none';
    }

    // Atualiza estado visual do botão de filtros
    const filterBtn = document.getElementById('openItemFilterBtn');
    if (filterBtn) filterBtn.classList.toggle('active', count > 0);

    // Atualiza os botões pill dentro do modal
    document.querySelectorAll('#itemFilterModalBackdrop .filter-pill-btn').forEach(btn => {
        const attr = btn.dataset.attr;
        btn.classList.toggle('active', filtrosAtributosAtivos.has(attr));
    });

    // Atualiza chips de filtros ativos abaixo da barra de controles
    const container = document.getElementById('activeFiltersContainer');
    if (!container) return;

    if (count === 0) {
        container.style.display = 'none';
        container.innerHTML = '';
        return;
    }

    container.style.display = 'flex';
    const chipsHTML = [...filtrosAtributosAtivos].map(attr => {
        const label = ROTULOS_ATRIBUTO[attr] || attr;
        return `<span class="filter-chip">
            ${label}
            <button class="filter-chip-remove" onclick="removerFiltroAtributoItem('${attr}')" title="Remover filtro">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </span>`;
    }).join('');

    container.innerHTML = chipsHTML + `
        <button class="filter-chip-clear-all" onclick="limparTodosFiltrosItens()">
            <i class="fa-solid fa-rotate-left"></i> Limpar tudo
        </button>
    `;
}

// Verifica se um item possui determinado atributo (para o sistema de multi-filtro)
function itemPossuiAtributo(item, attr) {
    const tags = item.tags || [];
    const stats = item.stats || {};
    const desc = (item.description || '').toLowerCase();

    switch (attr) {
        case 'AD':
            return tags.includes('Damage') || Boolean(stats.FlatPhysicalDamageMod);
        case 'AP':
            return tags.includes('SpellDamage') || Boolean(stats.FlatMagicDamageMod);
        case 'AS':
            return tags.includes('AttackSpeed') || Boolean(stats.PercentAttackSpeedMod);
        case 'CRIT':
            return tags.includes('CriticalStrike') || Boolean(stats.FlatCritChanceMod);
        case 'LS':
            return tags.includes('LifeSteal') || Boolean(stats.PercentLifeStealMod);
        case 'VAMP':
            return tags.includes('SpellVamp') || tags.includes('Omnivamp') || desc.includes('onivampirismo') || desc.includes('omnivamp');
        case 'ARMOR_PEN':
            return tags.includes('ArmorPenetration') || desc.includes('letalidade') || desc.includes('penetra') && desc.includes('armadura');
        case 'MAGIC_PEN':
            return tags.includes('MagicPenetration') || desc.includes('penetra') && desc.includes('mágica');
        case 'HP':
            return tags.includes('Health') || Boolean(stats.FlatHPPoolMod);
        case 'ARMOR':
            return tags.includes('Armor') || Boolean(stats.FlatArmorMod);
        case 'MR':
            return tags.includes('SpellBlock') || tags.includes('MagicResist') || Boolean(stats.FlatSpellBlockMod);
        case 'HP_REGEN':
            return tags.includes('HealthRegen') || Boolean(stats.FlatHPRegenMod) || Boolean(stats.PercentHPRegenMod);
        case 'TENACITY':
            return tags.includes('Tenacity') || desc.includes('tenacidade') || desc.includes('resist') && desc.includes('lentidão');
        case 'CDR':
            return tags.includes('CooldownReduction') || tags.includes('AbilityHaste');
        case 'MANA':
            return tags.includes('Mana') || Boolean(stats.FlatMPPoolMod);
        case 'MANA_REGEN':
            return tags.includes('ManaRegen') || Boolean(stats.FlatMPRegenMod) || Boolean(stats.PercentMPRegenMod);
        case 'MOV':
            return tags.includes('Boots') || tags.includes('NonbootsMovement') || Boolean(stats.FlatMovementSpeedMod) || Boolean(stats.PercentMovementSpeedMod);
        case 'HEAL_SHIELD':
            return tags.includes('HealAndShieldPower') || desc.includes('cura e') || desc.includes('escudo') && desc.includes('poder');
        default:
            return false;
    }
}

function itemCorrespondeCategoria(item, categoria) {
    if (categoria === 'all') return true;
    const tags = item.tags || [];
    const stats = item.stats || {};

    switch (categoria) {
        case 'AD':
            return tags.includes('Damage') || Boolean(stats.FlatPhysicalDamageMod);
        case 'AP':
            return tags.includes('SpellDamage') || Boolean(stats.FlatMagicDamageMod);
        case 'ARMOR':
            // ESTRITAMENTE itens que concedem armadura, NUNCA apenas vida!
            return tags.includes('Armor') || Boolean(stats.FlatArmorMod);
        case 'LP':
            // Filtro específico para Vida
            return tags.includes('Health') || Boolean(stats.FlatHPPoolMod);
        case 'AS':
            return tags.includes('AttackSpeed') || Boolean(stats.PercentAttackSpeedMod);
        case 'CRIT':
            return tags.includes('CriticalStrike') || Boolean(stats.FlatCritChanceMod);
        case 'MOV':
            return tags.includes('Boots') || tags.includes('NonbootsMovement') || Boolean(stats.FlatMovementSpeedMod) || Boolean(stats.PercentMovementSpeedMod);
        case 'LS':
            return tags.includes('LifeSteal') || tags.includes('SpellVamp') || tags.includes('Omnivamp') || Boolean(stats.PercentLifeStealMod);
        case 'CDR':
            return tags.includes('CooldownReduction') || tags.includes('AbilityHaste');
        case 'MR':
            return tags.includes('SpellBlock') || tags.includes('MagicResist') || Boolean(stats.FlatSpellBlockMod);
        case 'PEN':
            return tags.includes('ArmorPenetration') || tags.includes('MagicPenetration');
        case 'MANA':
            return tags.includes('Mana') || tags.includes('ManaRegen') || Boolean(stats.FlatMPPoolMod);
        default:
            return true;
    }
}

/* Busca Global no Hero */
function handleGlobalSearch(event) {
    if (event.key === 'Enter') {
        const query = event.target.value.toLowerCase().trim();
        if (!query) return;

        const champ = todosCampeoes.find(c => c.name.toLowerCase().includes(query) || c.id.toLowerCase().includes(query));
        if (champ) {
            abrirModalCampeao(champ.id);
            return;
        }

        const item = itensValidosSR.find(i => i.name.toLowerCase().includes(query));
        if (item) {
            abrirModalItem(item.id);
            return;
        }

        switchTab('champions');
        const champInput = document.getElementById('champSearch');
        if (champInput) {
            champInput.value = query;
            filtrarCampeoes();
        }
    }
}

/* ==========================================================================
   8. NAVEGAÇÃO, TABS E INTERFACE
   ========================================================================== */
function configurarNavegacao() {
    const mobileBtn = document.getElementById('mobileToggleBtn');
    const navMenu = document.getElementById('navMenu');
    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', () => navMenu.classList.toggle('mobile-open'));
    }
}

function switchTab(tabId) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

    const target = document.getElementById(tabId);
    if (target) target.classList.add('active');

    const activeLink = document.querySelector(`.nav-link[href="#${tabId}"]`);
    if (activeLink) activeLink.classList.add('active');

    const navMenu = document.getElementById('navMenu');
    if (navMenu) navMenu.classList.remove('mobile-open');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function configurarFiltros() {
    document.querySelectorAll('#roleFilterGroup .filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetBtn = e.target.closest('.filter-btn');
            if (!targetBtn) return;
            document.querySelectorAll('#roleFilterGroup .filter-btn').forEach(b => b.classList.remove('active'));
            targetBtn.classList.add('active');
            filtroRotaAtiva = targetBtn.dataset.role;
            filtrarCampeoes();
        });
    });

    document.querySelectorAll('#itemCatFilterGroup .filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetBtn = e.target.closest('.filter-btn');
            if (!targetBtn) return;
            document.querySelectorAll('#itemCatFilterGroup .filter-btn').forEach(b => b.classList.remove('active'));
            targetBtn.classList.add('active');
            filtroCategoriaItemAtiva = targetBtn.dataset.cat;
            filtrarItens();
        });
    });
}

function configurarEventosModais() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Fechar janelinha de filtros se estiver aberta
            const filterBackdrop = document.getElementById('itemFilterModalBackdrop');
            if (filterBackdrop && filterBackdrop.classList.contains('active')) {
                fecharModalFiltrosItens();
                return;
            }
            closeModal();
        }
    });

    ['champion-modal', 'item-modal', 'detailModal', 'ability-video-modal'].forEach(modalId => {
        const modalEl = document.getElementById(modalId);
        if (modalEl) {
            modalEl.addEventListener('click', (e) => {
                if (e.target === modalEl) closeModal();
            });
        }
    });
}

/* ==========================================================================
   9. UTILITÁRIOS
   ========================================================================== */
// Normaliza texto para busca: remove acentos, converte para minúsculas, trim
function normalizarTextoBusca(str) {
    if (!str) return '';
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function limparTagsHTML(str) {
    if (!str) return '';
    return str.replace(/<[^>]*>/g, '').trim();
}

function traduzirTag(tag) {
    const mapa = {
        'Fighter': 'Lutador',
        'Tank': 'Tanque',
        'Mage': 'Mago',
        'Assassin': 'Assassino',
        'Marksman': 'Atirador',
        'Support': 'Suporte',
        'Damage': 'Dano Físico AD',
        'CriticalStrike': 'Crítico CRIT',
        'AttackSpeed': 'Velocidade de Ataque AS',
        'LifeSteal': 'Roubo de Vida LS',
        'SpellVamp': 'Vampirismo LS',
        'ArmorPenetration': 'Penetração de Armadura Letalidade PEN',
        'MagicPenetration': 'Penetração Mágica PEN',
        'Health': 'Vida LP HP',
        'Armor': 'Armadura ARMOR Defesa',
        'SpellBlock': 'Resistência Mágica MR',
        'SpellDamage': 'Poder de Habilidade AP Magia',
        'Mana': 'Mana MANA',
        'AbilityHaste': 'Aceleração de Habilidade CDR Haste',
        'CooldownReduction': 'Redução de Recarga CDR',
        'Boots': 'Botas MOV Movimento',
        'NonbootsMovement': 'Velocidade de Movimento MOV',
        'Consumable': 'Consumível',
        'GoldPer': 'Ouro'
    };
    return mapa[tag] || tag;
}