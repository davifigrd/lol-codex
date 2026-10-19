/* LoL Codex — Items: loading, list, cards and detailed modal. */
/* ==========================================================================
   3. ITEMS VIA DATA DRAGON (ATTRIBUTE SYMBOLS, NO GOLD WORD)
   ========================================================================== */

// ============================================================
// RARITY SYSTEM
// Border colors:
// * Itens Iniciais: Borda cinza/branca (#a0a0a0)
// * Itens Básicos: Borda verde (#22c55e)
// * Itens Épicos: Borda roxa (#a855f7)
// * Itens Lendários: Borda dourada (#eab308)
// * Botas: Borda azul (#3b82f6)
// ============================================================
const ITEM_RARITY = {
    STARTER: {
        color: '#a0a0a0',
        label: 'Iniciais'
    },
    BASIC: {
        color: '#22c55e',
        label: 'Básicos'
    },
    EPIC: {
        color: '#a855f7',
        label: 'Épicos'
    },
    LEGENDARY: {
        color: '#eab308',
        label: 'Lendários'
    },
    BOOTS: {
        color: '#3b82f6',
        label: 'Botas'
    }
};

// Display order for categories: Botas, Iniciais, Básicos, Épicos, Lendários
const RARITY_ORDER = ['BOOTS', 'STARTER', 'BASIC', 'EPIC', 'LEGENDARY'];

// Items removed or internal duplicates that should never show in 5v5 normal shop
const EXCLUDED_ITEM_IDS = new Set([
    '2421', // Armaguarda Despedaçada (item quebrado pós-zhonya)
    '1105', // Duplicata interna de Broto de Esmagamusgo
    '1106', // Duplicata interna de Cria de Andabrisas
    '1107', // Duplicata interna de Filhote de Garrabrasa
]);

// Known starters and consumables
const STARTER_ITEM_IDS = new Set([
    '1054', // Escudo de Doran
    '1055', // Lâmina de Doran
    '1056', // Anel de Doran
    '1082', // Lacre Sombrio
    '1083', // Abatedora
    '1101', // Filhote de Garrabrasa
    '1102', // Cria de Andabrisas
    '1103', // Broto de Esmagamusgo
    '2003', // Poção de Vida
    '2031', // Poção com Refil
    '2033', // Poção Corrupta (se houver)
    '2055', // Sentinela de Controle
    '2138', // Elixir de Ferro
    '2139', // Elixir da Feitiçaria
    '2140', // Elixir da Ira
    '3865', // Atlas Mundial
    '3340', // Sentinela Invisível
    '3363', // Alteração Vidente
    '3364', // Lente do Oráculo
]);

/**
 * Classifies an item into one of the 5 official rarity tiers:
 * BOOTS > STARTER > LEGENDARY > EPIC > BASIC
 */
function getItemRarity(item) {
    const tags = item.tags || [];
    const from = item.from || [];
    const into = item.into || [];
    const gold = item.gold?.total || 0;

    // 1. Boots
    if (tags.includes('Boots') || ['1001', '3006', '3009', '3010', '3020', '3047', '3111', '3158'].includes(item.id)) {
        return 'BOOTS';
    }

    // 2. Starter items / Consumables
    if (STARTER_ITEM_IDS.has(item.id)) {
        return 'STARTER';
    }
    const isStarterByTag = tags.includes('Lane') || tags.includes('Jungle') || tags.includes('Consumable') || tags.includes('Trinket');
    if (isStarterByTag && from.length === 0 && into.length === 0) {
        return 'STARTER';
    }

    // 3. Legendary: completed final items (no upgrades, or high cost quest items)
    // Support quest upgrades (3869, 3870, 3871, 3876, 3877) and Mejai (3041)
    if (into.length === 0 && (from.length > 0 || gold >= 2200)) {
        return 'LEGENDARY';
    }
    if (gold >= 2600 && into.length === 0) {
        return 'LEGENDARY';
    }

    // 4. Epic: intermediate components that have components AND build into other items
    if (from.length > 0 && into.length > 0) {
        return 'EPIC';
    }
    if (into.length > 0 && (item.depth || 1) >= 2) {
        return 'EPIC';
    }

    // 5. Basic: base tier-1 components that build into something (Long sword, Ruby crystal, etc.)
    return 'BASIC';
}

async function loadItemsFromDataDragon() {
    const grid = document.getElementById('items-grid');
    try {
        const url = `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/data/${currentLanguage}/item.json`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);

        const data = await res.json();
        allItems = data.data || {};

        // Filters strictly to valid, active Summoner's Rift items
        validSRItems = Object.entries(allItems)
            .filter(([id, item]) => {
                if (EXCLUDED_ITEM_IDS.has(id)) return false;
                // Arena / alternate-mode copies reuse 6-digit IDs (32xxxx / 66xxxx)
                // and would otherwise duplicate the real 5v5 item names.
                if (id.length > 4) return false;
                const inSummonersRift = item.maps && item.maps['11'] === true;
                const canPurchase = item.gold && item.gold.purchasable !== false && item.gold.total > 0;
                const availableInStore = item.inStore !== false;
                const notSpecialChamp = !item.requiredChampion;
                return inSummonersRift && canPurchase && availableInStore && notSpecialChamp;
            })
            .map(([id, item]) => ({ id, ...item }))
            .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

        const counter = document.getElementById('countItems');
        if (counter) counter.textContent = `${validSRItems.length} Itens`;

        renderItems(validSRItems);
    } catch (errObj) {
        console.error('[LoL Codex] Erro ao carregar itens:', errObj);
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

// ID of the item currently open in the modal (to re-render on switch toggle)
let currentOpenItemModal = null;

function toggleItemSummary(enabled) {
    itemSummaryMode = enabled;
    syncSummaryMode('items', enabled);

    // Syncs toggles and labels between the main page and the modal
    const mainToggle = document.getElementById('itemSummaryToggle');
    if (mainToggle && mainToggle.checked !== enabled) mainToggle.checked = enabled;

    const mainDetLabel = document.getElementById('itemDetailsLabel');
    const mainResLabel = document.getElementById('itemSummaryLabel');
    if (mainDetLabel) mainDetLabel.classList.toggle('switch-label-active', !enabled);
    if (mainResLabel) mainResLabel.classList.toggle('switch-label-active', enabled);

    // Smooth fade out on the item grid
    const grid = document.getElementById('items-grid');
    if (grid) {
        grid.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        grid.style.opacity = '0';
        grid.style.transform = 'translateY(4px)';
        setTimeout(() => {
            filterItems();
            grid.style.opacity = '1';
            grid.style.transform = 'translateY(0)';
        }, 200);
    } else {
        filterItems();
    }

    // Smooth transition on the item modal if it is open
    if (currentOpenItemModal && allItems[currentOpenItemModal]) {
        const modalDetLabel = document.getElementById('itemModalSwitchLabelDet');
        const modalResLabel = document.getElementById('itemModalSwitchLabelRes');
        if (modalDetLabel) modalDetLabel.classList.toggle('switch-label-active', !enabled);
        if (modalResLabel) modalResLabel.classList.toggle('switch-label-active', enabled);

        const modalToggle = document.querySelector('#item-modal-content .hextech-toggle input');
        if (modalToggle && modalToggle.checked !== enabled) modalToggle.checked = enabled;

        const modalDesc = document.querySelector('#item-modal-content .item-ddragon-desc');
        if (modalDesc) {
            modalDesc.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
            modalDesc.style.opacity = '0';
            modalDesc.style.transform = 'translateY(4px)';
            setTimeout(() => {
                openItemModal(currentOpenItemModal);
            }, 200);
        } else {
            openItemModal(currentOpenItemModal);
        }
    }
}

/**
 * Groups and sorts items by rarity category, alphabetically within each group.
 */
function groupItemsByRarity(itemList) {
    const groups = {};
    RARITY_ORDER.forEach(r => { groups[r] = []; });

    itemList.forEach(item => {
        const rarity = getItemRarity(item);
        if (groups[rarity]) {
            groups[rarity].push(item);
        } else {
            groups['BASIC'].push(item);
        }
    });

    // Sort alphabetically within each category
    Object.keys(groups).forEach(key => {
        groups[key].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    });

    return groups;
}

function isItemFilterActive() {
    const searchInput = document.getElementById('itemSearch');
    const hasQuery = Boolean(searchInput && searchInput.value.trim().length > 0);
    const hasAttrFilters = typeof activeAttributeFilters !== 'undefined' && activeAttributeFilters.size > 0;
    return hasQuery || hasAttrFilters;
}

function renderItems(itemList) {
    const grid = document.getElementById('items-grid');
    if (!grid) return;

    if (itemList.length === 0) {
        grid.innerHTML = `
            <div class="loading-box">
                <i class="fa-solid fa-gem" style="font-size:2rem; color:var(--gold-primary);"></i>
                <p>Nenhum item encontrado para esta categoria ou busca.</p>
            </div>
        `;
        return;
    }

    const isFiltered = isItemFilterActive();

    // Quando o usuário filtra (busca ou atributos), renderiza direto em grade sem separação de categorias
    if (isFiltered) {
        grid.classList.add('is-filtered');
        const sorted = [...itemList].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
        grid.innerHTML = sorted.map(item => buildItemCardHTML(item, getItemRarity(item))).join('');
        return;
    }

    // Sem nenhum filtro ativo: separa nas 5 categorias (Botas, Iniciais, Básicos, Épicos, Lendários)
    grid.classList.remove('is-filtered');
    const groups = groupItemsByRarity(itemList);
    let html = '';

    RARITY_ORDER.forEach(rarityKey => {
        const items = groups[rarityKey];
        if (!items || items.length === 0) return;

        const rarityInfo = ITEM_RARITY[rarityKey];
        html += `
            <div class="item-rarity-section" data-rarity="${rarityKey}" data-rarity-label="${rarityInfo.label}">
                <div class="item-rarity-header" style="--rarity-color: ${rarityInfo.color};">
                    <span class="item-rarity-dot" style="background:${rarityInfo.color};"></span>
                    <span class="item-rarity-title">${rarityInfo.label}</span>
                    <span class="item-rarity-count">${items.length} itens</span>
                </div>
                <div class="item-rarity-grid">
                    ${items.map(item => buildItemCardHTML(item, rarityKey)).join('')}
                </div>
            </div>
        `;
    });

    grid.innerHTML = html;
}

/**
 * Builds the card HTML for an item with:
 * - Direct colored border on the image icon based on rarity
 * - Info button on the card for quick ultra-summarized bullets
 * - Resumido mode replacing official text with author text
 */
function buildItemCardHTML(item, rarityKey) {
    const iconUrl = `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/item/${item.id}.png`;
    const priceValue = item.gold && item.gold.total ? item.gold.total : 0;
    const rarityInfo = ITEM_RARITY[rarityKey] || ITEM_RARITY.BASIC;
    const rarityColor = rarityInfo.color;

    // Visual attribute badges below item name
    const attributeIcons = buildItemAttributeIcons(item);

    // Summary vs detailed mode:
    // Resumido = author text from data/item-resum.json / item-summary.json
    // Detalhado = clean DDragon text
    const itemSummaryData = itemSummaries[item.id];
    let displayText = '';
    if (itemSummaryMode && itemSummaryData && itemSummaryData.resumo && !itemSummaryData.resumo.startsWith('TODO:')) {
        displayText = itemSummaryData.resumo;
    } else {
        displayText = item.plaintext || stripHtmlTags(item.description || '') || 'Item de Summoner\'s Rift.';
    }

    // Ultra-summarized bullets card
    const infoCardHtml = buildItemInfoCard(item);

    return `
        <div class="item-card" data-item-id="${item.id}" onclick="openItemModal('${item.id}')" onmouseenter="applyCardHoverColor(this, '${iconUrl}')">
            <div class="item-header">
                <div class="item-icon-wrap" style="--rarity-border-color: ${rarityColor};">
                    <img src="${iconUrl}" class="item-icon rarity-${rarityKey.toLowerCase()}" style="border-color: ${rarityColor} !important;" alt="${item.name}" loading="lazy">
                </div>
                <div class="item-title-wrap">
                    <div class="item-name-row" style="display:flex; align-items:center; justify-content:space-between; gap:0.4rem;">
                        <h4 title="${item.name}">${item.name}</h4>
                        <div style="display:flex; align-items:center; gap:0.45rem;">
                            <span class="item-cost"><i class="fa-solid fa-coins" style="color:var(--gold-bright);"></i> ${priceValue}</span>
                            <button type="button" class="item-card-info-btn" onclick="toggleCardQuickInfo(event, '${item.id}')" title="Ver resumo em tópicos">
                                <i class="fa-solid fa-circle-info"></i>
                            </button>
                        </div>
                    </div>
                    <!-- Attribute badges below the item name -->
                    <div class="item-badges">
                        ${attributeIcons}
                    </div>
                </div>
            </div>
            <p class="item-stats">${displayText}</p>
            ${infoCardHtml}
        </div>
    `;
}

/**
 * Toggles quick ultra-summarized bullets on an individual card
 */
function toggleCardQuickInfo(event, itemId) {
    if (event) event.stopPropagation();
    const bulletsEl = document.getElementById(`quick-bullets-${itemId}`);
    const btn = event?.currentTarget;
    if (!bulletsEl) return;

    const isExpanded = bulletsEl.classList.contains('expanded');
    bulletsEl.classList.toggle('expanded', !isExpanded);
    bulletsEl.classList.toggle('collapsed', isExpanded);
    if (btn) btn.classList.toggle('active', !isExpanded);
    // The summary replaces the description on this specific card
    const card = bulletsEl.closest('.item-card');
    if (card) card.classList.toggle('info-open', !isExpanded);
}

/**
 * Builds the ultra-summarized info card (shown on Info toggle).
 * Uses yellow bullets (◆) with keywords matching Hextech aesthetic.
 */
function buildItemInfoCard(item) {
    const summaryData = itemSummaries[item.id];
    const bullets = [];

    // 1. Key numerical stats
    const stats = item.stats || {};
    const statMap = [
        ['FlatPhysicalDamageMod',   v => `+${Math.round(v)} Dano de Ataque`],
        ['FlatMagicDamageMod',      v => `+${Math.round(v)} Poder de Habilidade`],
        ['FlatArmorMod',            v => `+${Math.round(v)} Armadura`],
        ['FlatSpellBlockMod',       v => `+${Math.round(v)} Resistência Mágica`],
        ['FlatHPPoolMod',           v => `+${Math.round(v)} Vida`],
        ['FlatMPPoolMod',           v => `+${Math.round(v)} Mana`],
        ['FlatCritChanceMod',       v => `+${Math.round(v*100)}% Acerto Crítico`],
        ['PercentAttackSpeedMod',   v => `+${Math.round(v*100)}% Vel. de Ataque`],
        ['PercentLifeStealMod',     v => `+${Math.round(v*100)}% Roubo de Vida`],
        ['FlatMovementSpeedMod',    v => `+${Math.round(v)} Vel. de Movimento`],
        ['FlatHPRegenMod',         v => `+${Math.round(v)} Regen. de Vida`],
    ];

    statMap.forEach(([key, fmt]) => {
        if (stats[key] && stats[key] !== 0) {
            bullets.push(`<span class="bullet-stat-val">${fmt(stats[key])}</span>`);
        }
    });

    // 2. Extract keywords / passives from description if available
    const desc = item.description || '';
    const cleanDesc = stripHtmlTags(desc);

    // Check lethality
    if (desc.toLowerCase().includes('letalidade')) {
        const letMatch = desc.match(/(\d+)\s*letalidade/i) || cleanDesc.match(/letalidade/i);
        if (letMatch && letMatch[1]) {
            bullets.push(`<span class="bullet-keyword">Letalidade:</span> +${letMatch[1]}`);
        } else {
            bullets.push(`<span class="bullet-keyword">Letalidade</span>`);
        }
    }

    // Check armor pen
    if (desc.toLowerCase().includes('penetra') && desc.toLowerCase().includes('armadura') && !desc.toLowerCase().includes('letalidade')) {
        const penMatch = desc.match(/(\d+)%\s*de penetra/i);
        if (penMatch) {
            bullets.push(`<span class="bullet-keyword">Pen. Armadura:</span> +${penMatch[1]}%`);
        } else {
            bullets.push(`<span class="bullet-keyword">Penetração de Armadura %</span>`);
        }
    }

    // Check magic pen
    if (desc.toLowerCase().includes('penetra') && (desc.toLowerCase().includes('mágica') || desc.toLowerCase().includes('magica'))) {
        bullets.push(`<span class="bullet-keyword">Penetração Mágica</span>`);
    }

    // Check ability haste / CDR
    if (item.tags?.includes('AbilityHaste') || desc.toLowerCase().includes('aceleração de habilidade')) {
        const ahMatch = desc.match(/(\d+)\s*acelera/i);
        if (ahMatch) {
            bullets.push(`<span class="bullet-keyword">Acel. de Habilidade:</span> +${ahMatch[1]}`);
        } else {
            bullets.push(`<span class="bullet-keyword">Aceleração de Habilidade</span>`);
        }
    }

    // Check named passives
    const passiveNames = [];
    const passiveRegex = /<passive>([^<]+)<\/passive>|<unique>([^<]+)<\/unique>/gi;
    let pMatch;
    while ((pMatch = passiveRegex.exec(desc)) !== null) {
        const pName = (pMatch[1] || pMatch[2] || '').trim();
        if (pName && !passiveNames.includes(pName) && pName.length < 35) {
            passiveNames.push(pName);
        }
    }
    passiveNames.slice(0, 2).forEach(pName => {
        bullets.push(`<span class="bullet-keyword">${pName}</span>`);
    });

    // Author keywords if present
    if (summaryData?.keywords && Array.isArray(summaryData.keywords)) {
        summaryData.keywords.slice(0, 2).forEach(kw => {
            bullets.push(`<span class="bullet-keyword">${kw}</span>`);
        });
    }

    if (bullets.length === 0) {
        bullets.push(`<span class="bullet-keyword">Item de Utilidade</span>`);
    }

    const bulletHtml = bullets.slice(0, 4).map(b =>
        `<div class="quick-bullet-item"><span class="hextech-bullet">◆</span> ${b}</div>`
    ).join('');

    return `
        <div class="item-quick-bullets" id="quick-bullets-${item.id}">
            ${bulletHtml}
        </div>
    `;
}

/**
 * Builds the visual attribute badges below the item name
 * Standardized with official Portuguese names and siglas in parentheses:
 * AD, AP, AS, CRIT, LS, VAMP, LET, A. PEN, M. PEN, HP, ARMOR, MR, HP5, TEN, SR, CDR, MANA, MANA REG., MS, E&S
 */
function buildItemAttributeIcons(itemOrTags) {
    const item = (typeof itemOrTags === 'object' && !Array.isArray(itemOrTags)) ? itemOrTags : null;
    const tags = Array.isArray(itemOrTags) ? itemOrTags : (item?.tags || []);
    const stats = item?.stats || {};
    const desc = (item?.description || '').toLowerCase();

    let badges = [];

    // 1. Dano de Ataque (AD)
    if (tags.includes('Damage') || Boolean(stats.FlatPhysicalDamageMod)) {
        badges.push(`<span class="stat-icon-badge stat-badge-ad" title="Dano de Ataque (AD)"><span class="stat-img-icon stat-img-ad" aria-hidden="true"></span> AD</span>`);
    }

    // 2. Poder de Habilidade (AP)
    if (tags.includes('SpellDamage') || Boolean(stats.FlatMagicDamageMod)) {
        badges.push(`<span class="stat-icon-badge stat-badge-ap" title="Poder de Habilidade (AP)"><span class="stat-img-icon stat-img-ap" aria-hidden="true"></span> AP</span>`);
    }

    // 3. Velocidade de Ataque (AS)
    if (tags.includes('AttackSpeed') || Boolean(stats.PercentAttackSpeedMod)) {
        badges.push(`<span class="stat-icon-badge stat-badge-as" title="Velocidade de Ataque (AS)"><span class="stat-img-icon stat-img-as" aria-hidden="true"></span> AS</span>`);
    }

    // 4. Acerto Crítico (CRIT)
    if (tags.includes('CriticalStrike') || Boolean(stats.FlatCritChanceMod)) {
        badges.push(`<span class="stat-icon-badge stat-badge-crit" title="Acerto Crítico (CRIT)"><span class="stat-img-icon stat-img-crit" aria-hidden="true"></span> CRIT</span>`);
    }

    // 5. Roubo de Vida (LS) — strictly life steal
    if (tags.includes('LifeSteal') || Boolean(stats.PercentLifeStealMod)) {
        badges.push(`<span class="stat-icon-badge stat-badge-ls" title="Roubo de Vida (LS)"><span class="stat-img-icon stat-img-ls" aria-hidden="true"></span> LS</span>`);
    }

    // 6. Vampirismo (VAMP) — omnivamp / spell vamp
    if (tags.includes('SpellVamp') || tags.includes('Omnivamp') || desc.includes('onivampirismo') || desc.includes('vampirismo') || desc.includes('omnivamp')) {
        badges.push(`<span class="stat-icon-badge stat-badge-vamp" title="Vampirismo (VAMP)"><span class="stat-img-icon stat-img-vamp" aria-hidden="true"></span> VAMP</span>`);
    }

    // 7. Letalidade (LET)
    if (desc.includes('letalidade')) {
        badges.push(`<span class="stat-icon-badge stat-badge-let" title="Letalidade (LET)"><span class="stat-img-icon stat-img-let" aria-hidden="true"></span> LET</span>`);
    }

    // 8. Penetração de Armadura (A. PEN) — % armor penetration separated from lethality
    const hasArmorPen = (desc.includes('penetra') && desc.includes('armadura')) || desc.includes('reduz a armadura') || desc.includes('reduzir a armadura') || (tags.includes('ArmorPenetration') && !desc.includes('letalidade'));
    if (hasArmorPen && !desc.includes('letalidade')) {
        badges.push(`<span class="stat-icon-badge stat-badge-armorpen" title="Penetração de Armadura (A. PEN)"><span class="stat-img-icon stat-img-pen" aria-hidden="true"></span> A. PEN</span>`);
    }

    // 9. Penetração Mágica (M. PEN) — with the magic penetration icon
    if (tags.includes('MagicPenetration') || (desc.includes('penetra') && (desc.includes('mágica') || desc.includes('magica')))) {
        badges.push(`<span class="stat-icon-badge stat-badge-magicpen" title="Penetração Mágica (M. PEN)"><span class="stat-img-icon stat-img-magicpen" aria-hidden="true"></span> M. PEN</span>`);
    }

    // 10. Vida (HP)
    if (tags.includes('Health') || Boolean(stats.FlatHPPoolMod)) {
        badges.push(`<span class="stat-icon-badge stat-badge-health" title="Vida (HP)"><span class="stat-img-icon stat-img-health" aria-hidden="true"></span> HP</span>`);
    }

    // 11. Armadura (ARMOR)
    if (tags.includes('Armor') || Boolean(stats.FlatArmorMod)) {
        badges.push(`<span class="stat-icon-badge stat-badge-armor" title="Armadura (ARMOR)"><span class="stat-img-icon stat-img-armor" aria-hidden="true"></span> ARMOR</span>`);
    }

    // 12. Resistência Mágica (MR)
    if (tags.includes('SpellBlock') || tags.includes('MagicResist') || Boolean(stats.FlatSpellBlockMod)) {
        badges.push(`<span class="stat-icon-badge stat-badge-mr" title="Resistência Mágica (MR)"><span class="stat-img-icon stat-img-mr" aria-hidden="true"></span> MR</span>`);
    }

    // 13. Regeneração de Vida (HP5)
    if (tags.includes('HealthRegen') || Boolean(stats.FlatHPRegenMod) || Boolean(stats.PercentHPRegenMod)) {
        badges.push(`<span class="stat-icon-badge stat-badge-hpregen" title="Regeneração de Vida (HP5)"><span class="stat-img-icon stat-img-hpregen" aria-hidden="true"></span> HP5</span>`);
    }

    // 14. Tenacidade (TEN) — strictly tenacity
    if (tags.includes('Tenacity') || desc.includes('tenacidade')) {
        badges.push(`<span class="stat-icon-badge stat-badge-tenacity" title="Tenacidade (TEN)"><span class="stat-img-icon stat-img-tenacity" aria-hidden="true"></span> TEN</span>`);
    }

    // 15. Resist. Lentidão (SR) — slow resistance
    if (desc.includes('lentidão') && (desc.includes('resist') || desc.includes('reduz a eficácia'))) {
        badges.push(`<span class="stat-icon-badge stat-badge-sr" title="Resist. Lentidão (SR)"><span class="stat-img-icon stat-img-tenacity" aria-hidden="true" style="filter:hue-rotate(120deg);"></span> SR</span>`);
    }

    // 16. Aceleração de Habilidade (CDR)
    if (tags.includes('CooldownReduction') || tags.includes('AbilityHaste') || desc.includes('aceleração de habilidade')) {
        badges.push(`<span class="stat-icon-badge stat-badge-cdr" title="Aceleração de Habilidade (CDR)"><span class="stat-img-icon stat-img-cdr" aria-hidden="true"></span> CDR</span>`);
    }

    // 17. Mana (MANA)
    if (tags.includes('Mana') || Boolean(stats.FlatMPPoolMod)) {
        badges.push(`<span class="stat-icon-badge stat-badge-mana" title="Mana (MANA)"><span class="stat-img-icon stat-img-mana" aria-hidden="true"></span> MANA</span>`);
    }

    // 18. Regeneração de Mana (MANA REG.)
    if (tags.includes('ManaRegen') || Boolean(stats.FlatMPRegenMod) || Boolean(stats.PercentMPRegenMod)) {
        badges.push(`<span class="stat-icon-badge stat-badge-manaregen" title="Regeneração de Mana (MANA REG.)"><span class="stat-img-icon stat-img-mana" aria-hidden="true" style="filter:brightness(1.4) hue-rotate(15deg);"></span> MANA REG.</span>`);
    }

    // 19. Velocidade de Movimento (MS)
    if (tags.includes('Boots') || tags.includes('NonbootsMovement') || Boolean(stats.FlatMovementSpeedMod) || Boolean(stats.PercentMovementSpeedMod)) {
        badges.push(`<span class="stat-icon-badge stat-badge-mov" title="Velocidade de Movimento (MS)"><span class="stat-img-icon stat-img-mov" aria-hidden="true"></span> MS</span>`);
    }

    // 20. Cura e Resistência do Escudo (E&S)
    if (tags.includes('HealAndShieldPower') || (desc.includes('cura') && desc.includes('escudo'))) {
        badges.push(`<span class="stat-icon-badge stat-badge-healshield" title="Cura e Resist. do Escudo (E&S)"><i class="fa-solid fa-heart-pulse" style="color:#34d399; font-size:11px;"></i> E&S</span>`);
    }

    if (badges.length === 0) {
        badges.push(`<span class="stat-icon-badge" title="Item de Suporte / Utilidade" style="border-color:var(--border-color); color:var(--gold-light);"><i class="fa-solid fa-sparkles" style="color:var(--gold-bright);"></i> UTIL</span>`);
    }

    return badges.join('');
}

/* ==========================================================================
   5. DETAILED ITEM MODAL (RECIPES, PRICE & STAT LINES WITH VISUAL ICONS)
   ========================================================================== */
function openItemModal(itemId) {
    const modal = document.getElementById('item-modal');
    const modalContent = document.getElementById('item-modal-content');
    if (!modal || !modalContent) return;

    const item = allItems[itemId];
    if (!item) return;

    currentOpenItemModal = itemId;

    const rarityKey = getItemRarity({ ...item, id: itemId });
    const rarityInfo = ITEM_RARITY[rarityKey] || ITEM_RARITY.BASIC;
    const rarityColor = rarityInfo.color;

    const iconUrl = `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/item/${itemId}.png`;
    const totalPrice = item.gold && item.gold.total ? item.gold.total : 0;

    // Dominant color accent
    getDominantColor(iconUrl).then(colorHex => {
        const modalContainer = document.querySelector('#item-modal .modal-container');
        if (modalContainer) {
            modalContainer.style.setProperty('--modal-accent-color', colorHex.rgb);
            modalContainer.style.setProperty('--modal-accent-glow', colorHex.rgba);
        }
        const itemAvatar = document.getElementById('item-modal-avatar');
        if (itemAvatar) {
            itemAvatar.style.borderColor = rarityColor;
            itemAvatar.style.boxShadow = `0 0 20px ${rarityColor}88`;
        }
    });

    const componentsHtml = (item.from && item.from.length > 0)
        ? item.from.map(compId => {
            const comp = allItems[compId];
            if (!comp) return '';
            const compImg = `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/item/${compId}.png`;
            return `
                <div class="recipe-chip" onclick="openItemModal('${compId}')" title="${comp.name}">
                    <img src="${compImg}" alt="${comp.name}">
                    <span>${comp.name}</span>
                    <small>(<i class="fa-solid fa-coins"></i> ${comp.gold ? comp.gold.total : 0})</small>
                </div>
            `;
        }).join('')
        : '<p style="font-size:0.8rem; color:var(--text-muted);">Item básico (não possui componentes prévios).</p>';

    const buildHtmlString = (item.into && item.into.length > 0)
        ? item.into.map(intoId => {
            const intoItem = allItems[intoId];
            if (!intoItem) return '';
            const intoImg = `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/item/${intoId}.png`;
            return `
                <div class="recipe-chip" onclick="openItemModal('${intoId}')" title="${intoItem.name}">
                    <img src="${intoImg}" alt="${intoItem.name}">
                    <span>${intoItem.name}</span>
                    <small>(<i class="fa-solid fa-coins"></i> ${intoItem.gold ? intoItem.gold.total : 0})</small>
                </div>
            `;
        }).join('')
        : '';

    // Rarity badge
    const rarityBadgeHtml = `
        <span style="font-size:0.75rem; font-weight:700; padding:0.18rem 0.65rem; border-radius:4px; background:${rarityColor}22; border:1px solid ${rarityColor}66; color:${rarityColor}; margin-left:0.5rem; text-transform:uppercase; letter-spacing:0.05em;">
            ${rarityInfo.label}
        </span>
    `;

    // Attribute lines with visual icons
    const statLinesHtml = buildModalStatLines(item);

    // Description: in "Resumido" mode, strictly replaces the official Riot description with author text
    const descriptionHtml = (() => {
        const itemModalSummary = itemSummaries[itemId];
        if (itemSummaryMode) {
            const resumoText = (itemModalSummary && itemModalSummary.resumo && !itemModalSummary.resumo.startsWith('TODO:'))
                ? itemModalSummary.resumo
                : null;
            return resumoText
                ? `<div style="padding:0.25rem 0;"><p style="color:var(--text-body); margin:0; line-height:1.7; font-size:0.95rem;">${resumoText}</p></div>`
                : `<em style="color:var(--text-muted); font-size:0.9rem;">Resumo autoral ainda não escrito.</em>`;
        }
        return typeof colorizeEffectDescriptions === 'function'
            ? colorizeEffectDescriptions(item.description)
            : (item.description || '<p>Sem descrição adicional.</p>');
    })();

    modalContent.innerHTML = `
        <div style="display:flex; gap:1.25rem; align-items:center; margin-bottom:1.5rem; border-bottom:1px solid var(--border-color); padding-bottom:1.25rem;">
            <img id="item-modal-avatar" src="${iconUrl}" style="width:75px; height:75px; border-radius:var(--radius-md); border:2px solid ${rarityColor}; box-shadow:0 0 15px ${rarityColor}88; object-fit:cover; background:#000; transition:border-color 0.3s ease, box-shadow 0.3s ease;">
            <div style="flex-grow:1;">
                <div style="display:flex; align-items:center; flex-wrap:wrap; gap:0.35rem;">
                    <h2 style="font-size:1.85rem; font-family:var(--font-title); color:var(--gold-light); line-height:1.2;">${item.name}</h2>
                    ${rarityBadgeHtml}
                </div>
                <!-- Attribute badges below the item name -->
                <div style="display:flex; gap:0.4rem; margin-top:0.35rem; flex-wrap:wrap;">
                    ${buildItemAttributeIcons(item)}
                </div>
                <div style="display:flex; gap:1rem; align-items:center; margin-top:0.3rem;">
                    <!-- Only the coin and the value, without the word gold -->
                    <span style="color:var(--gold-bright); font-weight:700; font-size:1.1rem;"><i class="fa-solid fa-coins"></i> ${totalPrice}</span>
                </div>
            </div>
        </div>

        <div style="margin-bottom:1.5rem;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.5rem; gap:0.75rem; flex-wrap:wrap;">
                <h4 style="color:var(--gold-light); font-size:0.92rem; margin:0; display:flex; align-items:center; gap:0.4rem;">
                    <i class="fa-solid fa-shield-halved" style="color:var(--gold-bright);"></i> Atributos &amp; Efeitos:
                </h4>
                <div class="switch-wrapper" style="font-size:0.8rem;">
                    <span id="itemModalSwitchLabelDet" class="${!itemSummaryMode ? 'switch-label-active' : ''}">Detalhado</span>
                    <label class="hextech-toggle">
                        <input type="checkbox" ${itemSummaryMode ? 'checked' : ''} onchange="toggleItemSummary(this.checked)">
                        <span class="hextech-slider"></span>
                    </label>
                    <span id="itemModalSwitchLabelRes" class="${itemSummaryMode ? 'switch-label-active' : ''}">Resumido</span>
                </div>
            </div>

            <!-- Visual Attribute lines with icons -->
            ${statLinesHtml}

            <div class="item-ddragon-desc" style="background:var(--bg-panel); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem; margin-top:0.75rem;">
                ${descriptionHtml}
            </div>
        </div>

        <div class="recipe-section">
            <div class="recipe-header"><i class="fa-solid fa-screwdriver-wrench" style="color:var(--gold-bright);"></i> Construído a partir de (Componentes):</div>
            <div class="recipe-grid">
                ${componentsHtml}
            </div>
        </div>

        ${buildHtmlString ? `
            <div class="recipe-section" style="border-top:none; padding-top:0.75rem;">
                <div class="recipe-header"><i class="fa-solid fa-arrow-up-right-from-square" style="color:var(--hextech-cyan-accent);"></i> Evolui para:</div>
                <div class="recipe-grid">
                    ${buildHtmlString}
                </div>
            </div>
        ` : ''}
    `;

    modal.classList.add('active');
}

/**
 * Builds stat lines with visual icons for the item modal
 * (e.g. [Icon AD] +70 Dano de Ataque, [Icon AP] +130 Poder de Habilidade)
 */
function buildModalStatLines(item) {
    const stats = item.stats || {};
    const desc = (item.description || '').toLowerCase();
    const lines = [];

    const statDefs = [
        { key: 'FlatPhysicalDamageMod',  label: 'Dano de Ataque (AD)',            icon: 'ad',          fmt: v => `+${Math.round(v)}` },
        { key: 'FlatMagicDamageMod',     label: 'Poder de Habilidade (AP)',       icon: 'ap',          fmt: v => `+${Math.round(v)}` },
        { key: 'FlatArmorMod',           label: 'Armadura (ARMOR)',               icon: 'armor',       fmt: v => `+${Math.round(v)}` },
        { key: 'FlatSpellBlockMod',      label: 'Resistência Mágica (MR)',        icon: 'mr',          fmt: v => `+${Math.round(v)}` },
        { key: 'FlatHPPoolMod',          label: 'Vida (HP)',                      icon: 'health',      fmt: v => `+${Math.round(v)}` },
        { key: 'FlatMPPoolMod',          label: 'Mana (MANA)',                    icon: 'mana',        fmt: v => `+${Math.round(v)}` },
        { key: 'FlatCritChanceMod',      label: 'Acerto Crítico (CRIT)',          icon: 'crit',        fmt: v => `+${Math.round(v*100)}%` },
        { key: 'PercentAttackSpeedMod',  label: 'Velocidade de Ataque (AS)',      icon: 'as',          fmt: v => `+${Math.round(v*100)}%` },
        { key: 'PercentLifeStealMod',    label: 'Roubo de Vida (LS)',             icon: 'ls',          fmt: v => `+${Math.round(v*100)}%` },
        { key: 'FlatMovementSpeedMod',   label: 'Velocidade de Movimento (MS)',   icon: 'mov',         fmt: v => `+${Math.round(v)}` },
        { key: 'FlatHPRegenMod',         label: 'Regeneração de Vida (HP5)',      icon: 'hpregen',     fmt: v => `+${Math.round(v)}` },
        { key: 'FlatMPRegenMod',         label: 'Regeneração de Mana (MANA REG.)',icon: 'manaregen',   fmt: v => `+${Math.round(v)}` },
    ];

    statDefs.forEach(({ key, label, icon, fmt }) => {
        if (stats[key] && stats[key] !== 0) {
            lines.push(`
                <div class="modal-stat-line">
                    <span class="stat-img-icon stat-img-${icon}" style="width:18px;height:18px;" aria-hidden="true"></span>
                    <span class="modal-stat-value">${fmt(stats[key])}</span>
                    <span class="modal-stat-label">${label}</span>
                </div>
            `);
        }
    });

    // Special stats from description (Letalidade, Penetração Mágica, Tenacidade, etc.)
    if (desc.includes('letalidade')) {
        const match = desc.match(/(\d+)\s*letalidade/i);
        const val = match ? `+${match[1]}` : '';
        lines.push(`
            <div class="modal-stat-line">
                <span class="stat-img-icon stat-img-let" style="width:18px;height:18px;" aria-hidden="true"></span>
                <span class="modal-stat-value">${val}</span>
                <span class="modal-stat-label">Letalidade (LET)</span>
            </div>
        `);
    }

    if (item.tags?.includes('MagicPenetration') || (desc.includes('penetra') && (desc.includes('mágica') || desc.includes('magica')))) {
        lines.push(`
            <div class="modal-stat-line">
                <span class="stat-img-icon stat-img-magicpen" style="width:18px;height:18px;" aria-hidden="true"></span>
                <span class="modal-stat-value"></span>
                <span class="modal-stat-label">Penetração Mágica (M. PEN)</span>
            </div>
        `);
    }

    if (item.tags?.includes('Tenacity') || desc.includes('tenacidade')) {
        lines.push(`
            <div class="modal-stat-line">
                <span class="stat-img-icon stat-img-tenacity" style="width:18px;height:18px;" aria-hidden="true"></span>
                <span class="modal-stat-value"></span>
                <span class="modal-stat-label">Tenacidade (TEN)</span>
            </div>
        `);
    }

    if (lines.length === 0) return '';

    return `
        <div class="modal-stat-grid">
            ${lines.join('')}
        </div>
    `;
}

function closeItemModal() {
    const modal = document.getElementById('item-modal');
    if (modal) modal.classList.remove('active');
    currentOpenItemModal = null;
}

function closeModal() {
    closeAbilityVideo();
    closeChampionModal();
    closeItemModal();
    const detailModal = document.getElementById('detailModal');
    if (detailModal) detailModal.classList.remove('active');
}
