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

// Estados das chaves switches de resumo
let modoResumoHabilidades = false;
let modoResumoItens = false;
let modoResumoRunas = true;
let campeaoModalAbertoAtual = null;

// Símbolos oficiais das rotas de League of Legends (CommunityDragon / Riot Games)
const ICONES_ROTAS = {
    Top: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-top.png',
    Jungle: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-jungle.png',
    Mid: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-middle.png',
    ADC: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-bottom.png',
    Suporte: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-utility.png'
};

/* ==========================================================================
   INICIALIZAÇÃO DA APLICAÇÃO
   ========================================================================== */
document.addEventListener('DOMContentLoaded', async () => {
    configurarNavegacao();
    configurarFiltros();
    configurarEventosModais();

    // 1. Sincroniza a versão oficial do Data Dragon
    await carregarVersaoDDragon();

    // 2. Carrega Campeões, Itens e Runas em paralelo
    await Promise.all([
        carregarCampeoesDoDataDragon(),
        carregarItensDoDataDragon(),
        carregarRunasDoDataDragon()
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
    const splashUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champ.id}_0.jpg`;
    const difficultyLevel = champ.info && champ.info.difficulty ? Math.min(3, Math.ceil(champ.info.difficulty / 3.3)) : 2;

    let dots = '';
    for (let i = 1; i <= 3; i++) {
        dots += `<div class="diff-dot ${i <= difficultyLevel ? 'active' : ''}"></div>`;
    }

    const rotaPrincipal = identificarRotaPrincipalCampeao(champ);
    const iconeRotaUrl = ICONES_ROTAS[rotaPrincipal] || ICONES_ROTAS.Mid;

    return `
        <div class="champ-card" onclick="abrirModalCampeao('${champ.id}')">
            <div class="champ-banner" style="background-image: url('${splashUrl}');"></div>
            <!-- Símbolo da rota oficial do LoL em vez de texto escrito -->
            <div class="champ-badge-lane" title="Rota: ${rotaPrincipal}">
                <img src="${iconeRotaUrl}" alt="${rotaPrincipal}">
            </div>
            <div class="champ-info">
                <h3 class="champ-name">${champ.name}</h3>
                <p class="champ-title">${champ.title}</p>
                <div class="champ-tags">
                    ${(champ.tags || []).map(t => `<span class="tag">${traduzirTag(t)}</span>`).join('')}
                </div>
                <div class="champ-footer">
                    <span>Dificuldade</span>
                    <div class="diff-dots">${dots}</div>
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

function alternarResumoItens(ativado) {
    modoResumoItens = ativado;
    const label = document.getElementById('itemSummaryLabel');
    if (label) label.classList.toggle('switch-label-active', ativado);
    filtrarItens();
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

    // Ícones visuais de atributos em vez de texto escrito
    const iconesAtributos = gerarIconesAtributosItem(item.tags || []);

    // Modo resumo vs detalhado
    const textoExibicao = modoResumoItens
        ? (item.plaintext || 'Item de Summoner\'s Rift.')
        : limparTagsHTML(item.description || item.plaintext || 'Item de Summoner\'s Rift.');

    return `
        <div class="item-card" onclick="abrirModalItem('${item.id}')">
            <div class="item-header">
                <img src="${iconUrl}" class="item-icon" alt="${item.name}" loading="lazy">
                <div class="item-title-wrap">
                    <h4>${item.name}</h4>
                    <!-- Apenas a moeda e o valor, sem a palavra gold -->
                    <span class="item-cost"><i class="fa-solid fa-coins" style="color:var(--gold-bright);"></i> ${preco}</span>
                </div>
            </div>
            <!-- Ícones visuais dos atributos (AD, AP, Armadura, etc.) -->
            <div style="display:flex; flex-wrap:wrap; gap:0.35rem; margin-bottom:0.6rem;">
                ${iconesAtributos}
            </div>
            <p class="item-stats" style="font-size:0.8rem; color:var(--text-body); line-height:1.4;">${textoExibicao}</p>
            <div class="item-passive" style="margin-top:auto; font-size:0.75rem;">
                <i class="fa-solid fa-circle-info" style="color:var(--gold-primary); margin-right:4px;"></i> Detalhes & Receitas
            </div>
        </div>
    `;
}

function gerarIconesAtributosItem(tags) {
    let badges = [];
    if (tags.some(t => ['Damage', 'AttackSpeed', 'CriticalStrike', 'LifeSteal', 'ArmorPenetration'].includes(t))) {
        badges.push(`<span class="stat-icon-badge" title="Dano Físico / Ataque"><i class="fa-solid fa-hand-fist" style="color:#f97316;"></i> AD</span>`);
    }
    if (tags.some(t => ['SpellDamage', 'Mana', 'ManaRegen', 'MagicPenetration'].includes(t))) {
        badges.push(`<span class="stat-icon-badge" title="Poder de Habilidade / Magia"><i class="fa-solid fa-wand-magic-sparkles" style="color:#00A3FF;"></i> AP</span>`);
    }
    if (tags.some(t => ['Armor', 'SpellBlock', 'Health', 'HealthRegen'].includes(t))) {
        badges.push(`<span class="stat-icon-badge" title="Armadura / Defesa / Tanque"><i class="fa-solid fa-shield-halved" style="color:#22c55e;"></i> DEF</span>`);
    }
    if (tags.includes('Boots')) {
        badges.push(`<span class="stat-icon-badge" title="Velocidade de Movimento"><i class="fa-solid fa-shoe-prints" style="color:#a855f7;"></i> Bota</span>`);
    }
    if (tags.includes('CriticalStrike')) {
        badges.push(`<span class="stat-icon-badge" title="Acerto Crítico"><i class="fa-solid fa-crosshairs" style="color:#ef4444;"></i> Crítico</span>`);
    }
    if (badges.length === 0) {
        badges.push(`<span class="stat-icon-badge" title="Utilidade / Loja"><i class="fa-solid fa-gem" style="color:var(--gold-primary);"></i> Item</span>`);
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
        renderizarConteudoModalCampeao(detalhesCampeoesCache[campeaoModalAbertoAtual]);
    }
}

function renderizarConteudoModalCampeao(champData) {
    const modalContent = document.getElementById('champion-modal-content');
    if (!modalContent) return;

    const splashUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champData.id}_0.jpg`;
    const iconUrl = `https://ddragon.leagueoflegends.com/cdn/${versaoAtual}/img/champion/${champData.id}.png`;

    // Passiva
    const passiveImg = champData.passive && champData.passive.image 
        ? `https://ddragon.leagueoflegends.com/cdn/${versaoAtual}/img/passive/${champData.passive.image.full}`
        : '';
    const passiveName = champData.passive ? champData.passive.name : 'Passiva';
    const rawPassiveDesc = champData.passive ? limparTagsHTML(champData.passive.description) : '';
    const passiveDesc = modoResumoHabilidades ? extrairResumoHabilidade(rawPassiveDesc) : rawPassiveDesc;

    // Habilidades Q, W, E, R
    const keys = ['Q', 'W', 'E', 'R'];
    const spellsHtml = (champData.spells || []).map((spell, index) => {
        const spellKey = keys[index] || `H${index + 1}`;
        const spellImg = `https://ddragon.leagueoflegends.com/cdn/${versaoAtual}/img/spell/${spell.image.full}`;
        const rawDesc = limparTagsHTML(spell.description);
        const desc = modoResumoHabilidades ? extrairResumoHabilidade(rawDesc) : rawDesc;
        const cooldown = spell.cooldownBurn ? `${spell.cooldownBurn}s Recarga` : '';
        const custo = spell.costBurn && spell.costBurn !== '0' ? `${spell.costBurn} Custo` : 'Sem Custo';

        return `
            <div class="skill-card" title="${spell.name}">
                <div class="skill-img-wrap">
                    <img src="${spellImg}" alt="${spell.name}" class="skill-img" loading="lazy">
                    <span class="skill-key-badge">${spellKey}</span>
                </div>
                <div class="skill-info">
                    <div class="skill-name">${spell.name}</div>
                    <div style="font-size:0.7rem; color:var(--gold-primary); margin-bottom:0.2rem;">${cooldown} • ${custo}</div>
                    <div class="skill-desc" style="${modoResumoHabilidades ? '-webkit-line-clamp: 3; color:var(--gold-light); font-weight:500;' : ''}">${desc}</div>
                </div>
            </div>
        `;
    }).join('');

    const rolesStr = (champData.tags || []).map(traduzirTag).join(' • ');

    modalContent.innerHTML = `
        <!-- Top Banner do Campeão com Splash Art (Sem Lore/Biografia) -->
        <div style="position:relative; border-radius:var(--radius-md); overflow:hidden; margin-bottom:1.5rem; border:1px solid var(--border-gold);">
            <div style="height:170px; background-image:url('${splashUrl}'); background-size:cover; background-position:center 20%; position:relative;">
                <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(9,20,40,0.2) 0%, rgba(9,20,40,0.95) 100%);"></div>
            </div>
            <div style="display:flex; gap:1.25rem; align-items:flex-end; padding:0 1.5rem 1.25rem 1.5rem; margin-top:-55px; position:relative;">
                <img src="${iconUrl}" style="width:90px; height:90px; border-radius:var(--radius-md); border:2px solid var(--gold-bright); box-shadow:0 0 18px var(--gold-glow); object-fit:cover; background:#000;">
                <div>
                    <span style="color:var(--hextech-cyan-accent); font-size:0.85rem; font-weight:700; letter-spacing:0.05em; text-transform:uppercase;">${rolesStr}</span>
                    <h2 style="font-size:2.2rem; font-family:var(--font-title); color:var(--gold-light); line-height:1.1;">${champData.name}</h2>
                    <p style="color:var(--text-muted); font-size:0.9rem;">${champData.title}</p>
                </div>
            </div>
        </div>

        <!-- Seção de Habilidades com Chave Switch de Resumo -->
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem; flex-wrap:wrap; gap:0.75rem;">
            <h3 style="color:var(--gold-light); font-size:1.15rem; display:flex; align-items:center; gap:0.5rem; margin:0;">
                <i class="fa-solid fa-bolt" style="color:var(--gold-bright);"></i> Habilidades (P, Q, W, E, R)
            </h3>
            
            <!-- Chave Switch de Resumo das Habilidades -->
            <div class="switch-wrapper">
                <span class="${!modoResumoHabilidades ? 'switch-label-active' : ''}">Detalhado</span>
                <label class="hextech-toggle">
                    <input type="checkbox" ${modoResumoHabilidades ? 'checked' : ''} onchange="alternarResumoHabilidadesCampeao(this.checked)">
                    <span class="hextech-slider"></span>
                </label>
                <span class="${modoResumoHabilidades ? 'switch-label-active' : ''}">Resumo</span>
            </div>
        </div>
        
        <div class="skills-grid">
            <!-- Passiva -->
            <div class="skill-card" title="${passiveName}">
                <div class="skill-img-wrap">
                    <img src="${passiveImg}" alt="${passiveName}" class="skill-img" loading="lazy">
                    <span class="skill-key-badge" style="background:#091428; color:var(--hextech-cyan-accent); border-color:var(--hextech-cyan-accent);">P</span>
                </div>
                <div class="skill-info">
                    <div class="skill-name">${passiveName}</div>
                    <div style="font-size:0.7rem; color:var(--hextech-cyan-accent); margin-bottom:0.2rem;">Passiva Inata</div>
                    <div class="skill-desc" style="${modoResumoHabilidades ? '-webkit-line-clamp: 3; color:var(--gold-light); font-weight:500;' : ''}">${passiveDesc}</div>
                </div>
            </div>

            <!-- Q, W, E, R -->
            ${spellsHtml}
        </div>

        <!-- Dica Estratégica -->
        ${champData.allytips && champData.allytips.length > 0 ? `
            <div style="background:rgba(240, 178, 50, 0.1); border:1px solid var(--gold-primary); padding:1rem; border-radius:var(--radius-sm); margin-top:1rem;">
                <h4 style="color:var(--gold-bright); font-size:0.9rem; margin-bottom:0.4rem;"><i class="fa-solid fa-lightbulb"></i> Dica de Mecânica</h4>
                <p style="font-size:0.85rem; color:var(--gold-light); line-height:1.5;">${champData.allytips[0]}</p>
            </div>
        ` : ''}
    `;
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

    const iconUrl = `https://ddragon.leagueoflegends.com/cdn/${versaoAtual}/img/item/${itemId}.png`;
    const precoTotal = item.gold && item.gold.total ? item.gold.total : 0;
    const precoBase = item.gold && item.gold.base ? item.gold.base : precoTotal;

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
            <img src="${iconUrl}" style="width:75px; height:75px; border-radius:var(--radius-md); border:2px solid var(--gold-bright); box-shadow:0 0 15px var(--gold-glow); object-fit:cover; background:#000;">
            <div style="flex-grow:1;">
                <div style="display:flex; gap:0.4rem; margin-bottom:0.3rem;">
                    ${gerarIconesAtributosItem(item.tags || [])}
                </div>
                <h2 style="font-size:1.85rem; font-family:var(--font-title); color:var(--gold-light); line-height:1.2;">${item.name}</h2>
                <div style="display:flex; gap:1rem; align-items:center; margin-top:0.3rem;">
                    <!-- Apenas a moeda e valor, sem a palavra gold -->
                    <span style="color:var(--gold-bright); font-weight:700; font-size:1.1rem;"><i class="fa-solid fa-coins"></i> ${precoTotal}</span>
                    <span style="color:var(--text-muted); font-size:0.82rem;">(Receita: ${precoBase})</span>
                </div>
            </div>
        </div>

        <div style="margin-bottom:1.5rem;">
            <h4 style="color:var(--gold-light); font-size:0.92rem; margin-bottom:0.5rem; display:flex; align-items:center; gap:0.4rem;">
                <i class="fa-solid fa-shield-halved" style="color:var(--gold-bright);"></i> Atributos & Efeitos:
            </h4>
            <div class="item-ddragon-desc" style="background:var(--bg-panel); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem;">
                ${item.description || '<p>Sem descrição adicional.</p>'}
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
}

function closeModal() {
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
    const label = document.getElementById('runeSummaryLabel');
    if (label) label.classList.toggle('switch-label-active', ativado);
    renderizarRunas();
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
                const rawDesc = modoResumoRunas ? r.shortDesc : r.longDesc;
                const desc = limparTagsHTML(rawDesc);

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
                            <img src="https://ddragon.leagueoflegends.com/cdn/img/perk-images/StatMods/StatModsAdaptiveForceIcon.png" class="shard-icon" alt="Força">
                            <div><strong>+9 de Força Adaptativa</strong> (Dano ou AP)</div>
                        </div>
                        <div class="shard-option">
                            <img src="https://ddragon.leagueoflegends.com/cdn/img/perk-images/StatMods/StatModsAttackSpeedIcon.png" class="shard-icon" alt="Vel. Ataque">
                            <div><strong>+10% de Velocidade de Ataque</strong></div>
                        </div>
                        <div class="shard-option">
                            <img src="https://ddragon.leagueoflegends.com/cdn/img/perk-images/StatMods/StatModsCDRIcon.png" class="shard-icon" onerror="this.style.display='none'" alt="Aceleração">
                            <div><strong>+8 de Aceleração de Habilidade</strong> (CDR)</div>
                        </div>
                    </div>
                </div>

                <!-- Linha 2: Flexível -->
                <div class="shard-tier-card">
                    <div class="shard-tier-title"><i class="fa-solid fa-shuffle"></i> Linha 2: Flexível</div>
                    <div class="shard-options">
                        <div class="shard-option">
                            <img src="https://ddragon.leagueoflegends.com/cdn/img/perk-images/StatMods/StatModsAdaptiveForceIcon.png" class="shard-icon" alt="Força">
                            <div><strong>+9 de Força Adaptativa</strong></div>
                        </div>
                        <div class="shard-option">
                            <img src="https://ddragon.leagueoflegends.com/cdn/img/perk-images/StatMods/StatModsMovementSpeedIcon.png" class="shard-icon" alt="Velocidade">
                            <div><strong>+2% de Velocidade de Movimento</strong></div>
                        </div>
                        <div class="shard-option">
                            <img src="https://ddragon.leagueoflegends.com/cdn/img/perk-images/StatMods/StatModsHealthScalingIcon.png" class="shard-icon" alt="Vida">
                            <div><strong>+10 a 180 de Vida</strong> (baseado no nível)</div>
                        </div>
                    </div>
                </div>

                <!-- Linha 3: Defensiva -->
                <div class="shard-tier-card">
                    <div class="shard-tier-title"><i class="fa-solid fa-shield-heart"></i> Linha 3: Defensiva</div>
                    <div class="shard-options">
                        <div class="shard-option">
                            <img src="https://ddragon.leagueoflegends.com/cdn/img/perk-images/StatMods/StatModsArmorIcon.png" class="shard-icon" alt="Armadura">
                            <div><strong>+65 de Vida Plana</strong> imediata</div>
                        </div>
                        <div class="shard-option">
                            <img src="https://ddragon.leagueoflegends.com/cdn/img/perk-images/StatMods/StatModsHealthScalingIcon.png" class="shard-icon" alt="Vida">
                            <div><strong>+10 a 180 de Vida</strong> (baseado no nível)</div>
                        </div>
                        <div class="shard-option">
                            <img src="https://ddragon.leagueoflegends.com/cdn/img/perk-images/StatMods/StatModsMagicResIcon.png" class="shard-icon" onerror="this.style.display='none'" alt="Tenacidade">
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
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const filtrados = todosCampeoes.filter(champ => {
        const rotaDoChamp = identificarRotaPrincipalCampeao(champ);
        const matchRole = (filtroRotaAtiva === 'all') || (rotaDoChamp === filtroRotaAtiva);
        
        const matchQuery = !query || 
            champ.name.toLowerCase().includes(query) || 
            champ.title.toLowerCase().includes(query) ||
            champ.id.toLowerCase().includes(query) ||
            (champ.tags || []).some(t => t.toLowerCase().includes(query) || traduzirTag(t).toLowerCase().includes(query));

        return matchRole && matchQuery;
    });

    renderizarCampeoes(filtrados);
}

function filtrarItens() {
    const searchInput = document.getElementById('itemSearch');
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const filtrados = itensValidosSR.filter(item => {
        const matchCat = itemCorrespondeCategoria(item, filtroCategoriaItemAtiva);
        const matchQuery = !query ||
            item.name.toLowerCase().includes(query) ||
            (item.plaintext && item.plaintext.toLowerCase().includes(query)) ||
            (item.tags && item.tags.some(t => t.toLowerCase().includes(query) || traduzirTag(t).toLowerCase().includes(query)));

        return matchCat && matchQuery;
    });

    renderizarItens(filtrados);
}

function itemCorrespondeCategoria(item, categoria) {
    if (categoria === 'all') return true;
    const tags = item.tags || [];

    switch (categoria) {
        case 'Ataque':
            return tags.some(t => ['Damage', 'CriticalStrike', 'AttackSpeed', 'LifeSteal', 'ArmorPenetration', 'OnHit'].includes(t));
        case 'AP':
            return tags.some(t => ['SpellDamage', 'Mana', 'ManaRegen', 'MagicPenetration', 'AbilityHaste', 'SpellVamp'].includes(t));
        case 'Defesa':
            return tags.some(t => ['Health', 'Armor', 'SpellBlock', 'HealthRegen', 'Tenacity'].includes(t));
        case 'Velocidade':
            return tags.includes('AttackSpeed');
        case 'Critico':
            return tags.includes('CriticalStrike');
        case 'Botas':
            return tags.includes('Boots');
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
        if (e.key === 'Escape') closeModal();
    });

    ['champion-modal', 'item-modal', 'detailModal'].forEach(modalId => {
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
        'Damage': 'Dano',
        'CriticalStrike': 'Crítico',
        'AttackSpeed': 'Vel. de Ataque',
        'LifeSteal': 'Roubo de Vida',
        'ArmorPenetration': 'Penetração de Armadura',
        'Health': 'Vida',
        'Armor': 'Armadura',
        'SpellBlock': 'Resistência Mágica',
        'SpellDamage': 'Poder de Habilidade',
        'Mana': 'Mana',
        'AbilityHaste': 'Aceleração de Habilidade',
        'Boots': 'Botas',
        'Consumable': 'Consumível',
        'GoldPer': 'Ouro'
    };
    return mapa[tag] || tag;
}