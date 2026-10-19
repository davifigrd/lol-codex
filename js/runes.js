/* LoL Codex — Reforged Runes & Stat Shards in the official LoL client style */
/* ==========================================================================
   REFORGED RUNES — UI FAITHFUL TO THE LEAGUE OF LEGENDS CLIENT
   ========================================================================== */

// Metadata of the 5 Rune Trees (colors, subtitles and official client art)
const RUNE_TREES_METADATA = {
    8000: {
        id: 8000,
        key: 'Precision',
        labelName: 'Precisão',
        subtitleText: 'Torne-se uma lenda — Ataques aprimorados e dano sustentado',
        colorHex: '#c8aa6e',
        secondaryColorHex: '#f0b232',
        glowColor: 'rgba(200, 170, 110, 0.55)',
        runeIconUrl: '../img/runes/crest_8000.png',
        slotNames: ['Runas Essenciais', 'Heroísmo', 'Lenda', 'Combate']
    },
    8100: {
        id: 8100,
        key: 'Domination',
        labelName: 'Dominação',
        subtitleText: 'Cace e elimine presas — Dano explosivo e acesso ao alvo',
        colorHex: '#dc2626',
        secondaryColorHex: '#ef4444',
        glowColor: 'rgba(220, 38, 38, 0.55)',
        runeIconUrl: '../img/runes/crest_8100.png',
        slotNames: ['Runas Essenciais', 'Malevolência', 'Rastreamento', 'Caçador']
    },
    8200: {
        id: 8200,
        key: 'Sorcery',
        labelName: 'Feitiçaria',
        subtitleText: 'Liberte a destruição — Habilidades fortalecidas e manipulação de recursos',
        colorHex: '#3b82f6',
        secondaryColorHex: '#8b5cf6',
        glowColor: 'rgba(59, 130, 246, 0.55)',
        runeIconUrl: '../img/runes/crest_8200.png',
        slotNames: ['Runas Essenciais', 'Artefato', 'Excelência', 'Poder']
    },
    8400: {
        id: 8400,
        key: 'Resolve',
        labelName: 'Determinação',
        subtitleText: 'Viva para sempre — Durabilidade e controle de grupo',
        colorHex: '#22c55e',
        secondaryColorHex: '#10b981',
        glowColor: 'rgba(34, 197, 94, 0.55)',
        runeIconUrl: '../img/runes/crest_8400.png',
        slotNames: ['Runas Essenciais', 'Força', 'Resistência', 'Vitalidade']
    },
    8300: {
        id: 8300,
        key: 'Inspiration',
        labelName: 'Inspiração',
        subtitleText: 'Dobre as regras — Ferramentas criativas e manipulação das regras',
        colorHex: '#06b6d4',
        secondaryColorHex: '#0ac8b9',
        glowColor: 'rgba(6, 182, 212, 0.55)',
        runeIconUrl: '../img/runes/crest_8300.png',
        slotNames: ['Runas Essenciais', 'Engenho', 'Amanhã', 'Além']
    }
};

// Stat Shards (Tertiary Runes)
const RUNE_STAT_SHARDS = [
    {
        rowEntry: 1,
        labelName: 'Ofensiva',
        runeIconUrl: 'fa-solid fa-swords',
        optionList: [
            {
                id: 'shard_af_1',
                labelName: '+9 de Força Adaptativa',
                desc: 'Concede 9 de Dano de Ataque (AD) ou 15 de Poder de Habilidade (AP) adaptativo.',
                icon: 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodsadaptiveforceicon.png'
            },
            {
                id: 'shard_as_1',
                labelName: '+10% de Velocidade de Ataque',
                desc: 'Aumenta a velocidade de ataque básica do campeão em 10%.',
                icon: 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodsattackspeedicon.png'
            },
            {
                id: 'shard_ah_1',
                labelName: '+8 de Aceleração de Habilidade',
                desc: 'Concede 8 de Aceleração de Habilidade (CDR) para recarregar habilidades mais rápido.',
                icon: 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodscdrscalingicon.png'
            }
        ]
    },
    {
        rowEntry: 2,
        labelName: 'Flexível',
        runeIconUrl: 'fa-solid fa-shuffle',
        optionList: [
            {
                id: 'shard_af_2',
                labelName: '+9 de Força Adaptativa',
                desc: 'Concede 9 de Dano de Ataque (AD) ou 15 de Poder de Habilidade (AP) adaptativo.',
                icon: 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodsadaptiveforceicon.png'
            },
            {
                id: 'shard_ms_2',
                labelName: '+2% de Velocidade de Movimento',
                desc: 'Aumenta a velocidade de movimento para acelerar rotações e esquivas.',
                icon: 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodsmovementspeedicon.png'
            },
            {
                id: 'shard_hp_scaling_2',
                labelName: '+10 a 180 de Vida Escalonável',
                desc: 'Concede vida máxima adicional que aumenta progressivamente a cada nível (10-180).',
                icon: 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodshealthscalingicon.png'
            }
        ]
    },
    {
        rowEntry: 3,
        labelName: 'Defensiva',
        runeIconUrl: 'fa-solid fa-shield-heart',
        optionList: [
            {
                id: 'shard_hp_flat_3',
                labelName: '+65 de Vida Plana',
                desc: 'Concede 65 de Vida máxima imediatamente desde o primeiro segundo da partida.',
                icon: 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodshealthplusicon.png'
            },
            {
                id: 'shard_hp_scaling_3',
                labelName: '+10 a 180 de Vida Escalonável',
                desc: 'Concede vida máxima adicional que aumenta progressivamente a cada nível (10-180).',
                icon: 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodshealthscalingicon.png'
            },
            {
                id: 'shard_tenacity_3',
                labelName: '+10% de Tenacidade e Lentidão',
                desc: 'Reduz a duração de atordoamentos, imobilizações e lentidões sofridas em 10%.',
                icon: 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/statmodstenacityicon.png'
            }
        ]
    }
];

// Rune Page state in the LoL client style
let activeRuneTree = 8000;         // Active tree (8000 = Precision)
// View mode: 'client' = compact 2x2 grid (icons + hover/click balloon),
// 'lista' = expanded list (titles + descriptions visible inline).
// Defaults: Desktop = grid, Mobile = expanded list.
let runeViewMode = (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 768px)').matches)
    ? 'lista'
    : 'client';

// Saved rune selections per tree
let runeSelection = {
    8000: { keystone: 8008, slot1: 9111, slot2: 9104, slot3: 8299 }, // Fleet Footwork, Triumph, Legend: Alacrity, Last Stand
    8100: { keystone: 8112, slot1: 8139, slot2: 8138, slot3: 8105 }, // Electrocute, Taste of Blood, Eyeball Collection, Ravenous Hunter
    8200: { keystone: 8229, slot1: 8226, slot2: 8210, slot3: 8236 }, // Arcane Comet, Manaflow Band, Transcendence, Gathering Storm
    8400: { keystone: 8437, slot1: 8446, slot2: 8429, slot3: 8451 }, // Grasp of the Undying, Demolish, Conditioning, Overgrowth
    8300: { keystone: 8351, slot1: 8304, slot2: 8345, slot3: 8410 }, // Glacial Augment, Magical Footwear, Biscuit Delivery, Approach Velocity
    shards: [1, 0, 0] // Indices of the 3 shard rows (Attack Speed, Force, Flat Health)
};

// Rune currently inspected in the right panel
let currentInspectedRune = null;

/* ==========================================================================
   LOADING AND INITIALIZATION
   ========================================================================== */
async function loadRunesFromDataDragon() {
    const container = document.getElementById('runes-container');
    try {
        const url = `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/data/${currentLanguage}/runesReforged.json`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);

        allRunes = await res.json();

        renderRunes();
    } catch (errObj) {
        console.error('[LoL Codex] Erro ao carregar runas:', errObj);
        if (container) {
            container.innerHTML = `
                <div class="loading-box" style="color:#ef4444;">
                    <i class="fa-solid fa-triangle-exclamation" style="font-size:2rem;"></i>
                    <p>Não foi possível carregar as runas da API da Riot no momento.</p>
                </div>
            `;
        }
    }
}

function toggleRuneSummary(enabled) {
    runeSummaryMode = enabled;
    syncSummaryMode('runes', enabled);
    const detLabel = document.getElementById('runeDetailsLabel');
    const resLabel = document.getElementById('runeSummaryLabel');
    if (detLabel) detLabel.classList.toggle('switch-label-active', !enabled);
    if (resLabel) resLabel.classList.toggle('switch-label-active', enabled);

    // Syncs both the section top key and the client checkbox
    const topToggle = document.getElementById('runeSummaryToggle');
    if (topToggle && topToggle.checked !== enabled) topToggle.checked = enabled;

    const cb = document.getElementById('lolRuneDetailedCheckbox');
    if (cb && cb.checked !== !enabled) cb.checked = !enabled;

    // Re-renders or updates the inspection card
    updateInspectorCard();
    if (runeViewMode === 'lista') {
        renderRunes();
    }
}

function toggleRuneViewMode(newMode) {
    runeViewMode = newMode;
    renderRunes();
}

function selectRuneTree(runeTreeId, focusRuneId = null) {
    if (!RUNE_TREES_METADATA[runeTreeId]) return;
    activeRuneTree = Number(runeTreeId);

    if (focusRuneId) {
        const runeObject = findRuneById(focusRuneId);
        if (runeObject) {
            currentInspectedRune = {
                entryType: 'runa',
                rawData: runeObject.runeEntry,
                runeTree: runeObject.tree,
                slotIndex: runeObject.slotIndex,
                slotName: RUNE_TREES_METADATA[runeObject.tree.id].slotNames[runeObject.slotIndex] || 'Sub-runa'
            };
        }
    } else {
        // Default: inspects that tree's selected keystone
        const runeTree = allRunes.find(t => t.id === activeRuneTree);
        if (runeTree && runeTree.slots[0] && runeTree.slots[0].runes[0]) {
            const ksId = (runeSelection[activeRuneTree] && runeSelection[activeRuneTree].keystone) || runeTree.slots[0].runes[0].id;
            const ks = runeTree.slots[0].runes.find(r => r.id === ksId) || runeTree.slots[0].runes[0];
            currentInspectedRune = {
                entryType: 'runa',
                rawData: ks,
                runeTree: runeTree,
                slotIndex: 0,
                slotName: 'Runa Essencial (Keystone)'
            };
        }
    }

    renderRunes();
}

function selectPrimaryRune(slotIndex, runeId) {
    if (!runeSelection[activeRuneTree]) {
        runeSelection[activeRuneTree] = {};
    }
    const cacheKey = slotIndex === 0 ? 'keystone' : `slot${slotIndex}`;
    runeSelection[activeRuneTree][cacheKey] = runeId;

    // Updates the inspection
    const runeTree = allRunes.find(t => t.id === activeRuneTree);
    const runeEntry = runeTree && runeTree.slots[slotIndex] ? runeTree.slots[slotIndex].runes.find(r => r.id === runeId) : null;
    if (runeEntry) {
        currentInspectedRune = {
            entryType: 'runa',
            rawData: runeEntry,
            runeTree: runeTree,
            slotIndex: slotIndex,
            slotName: RUNE_TREES_METADATA[activeRuneTree].slotNames[slotIndex] || 'Sub-runa'
        };
    }

    renderRunes();
}

function selectStatShard(rowIndex, shardIndex) {
    runeSelection.shards[rowIndex] = shardIndex;
    const shard = RUNE_STAT_SHARDS[rowIndex].optionList[shardIndex];
    if (shard) {
        currentInspectedRune = {
            entryType: 'shard',
            rawData: shard,
            rowName: RUNE_STAT_SHARDS[rowIndex].labelName,
            rowIndex: rowIndex
        };
    }
    renderRunes();
}

function inspectRuneHover(runeId, slotIndex, runeTreeId) {
    const runeTree = allRunes.find(t => t.id === runeTreeId);
    if (!runeTree || !runeTree.slots[slotIndex]) return;
    const runeEntry = runeTree.slots[slotIndex].runes.find(r => r.id === runeId);
    if (!runeEntry) return;

    currentInspectedRune = {
        entryType: 'runa',
        rawData: runeEntry,
        runeTree: runeTree,
        slotIndex: slotIndex,
        slotName: RUNE_TREES_METADATA[runeTreeId].slotNames[slotIndex] || (slotIndex === 0 ? 'Runa Essencial' : 'Sub-runa')
    };
    updateInspectorCard();
}

function inspectShardHover(rowIndex, shardIndex) {
    const shard = RUNE_STAT_SHARDS[rowIndex].optionList[shardIndex];
    if (!shard) return;
    currentInspectedRune = {
        entryType: 'shard',
        rawData: shard,
        rowName: RUNE_STAT_SHARDS[rowIndex].labelName,
        rowIndex: rowIndex
    };
    updateInspectorCard();
}

/* ==========================================================================
   DESCRIPTION FORMATTING WITH OFFICIAL LOL COLORS
   ========================================================================== */
function formatRuneDescription(rune, summaryActive = runeSummaryMode) {
    if (!rune) return '';

    // In summary mode, try the author summary first, then shortDesc
    if (summaryActive) {
        const authorSummary = runeSummaries[rune.name];
        if (authorSummary && authorSummary.resumo && !authorSummary.resumo.startsWith('TODO:')) {
            return `<p class="lol-rune-p">${authorSummary.resumo}</p>`;
        }
        if (rune.shortDesc) {
            return `<p class="lol-rune-p">${stripHtmlTags(rune.shortDesc)}</p>`;
        }
    }

    // Detailed mode: formats the original Data Dragon tags with authentic client colors
    let raw = rune.longDesc || rune.shortDesc || '';
    if (!raw) return '<p class="lol-rune-p">Nenhuma descrição disponível para esta runa.</p>';

    let formattedValue = raw
        .replace(/<lol-uikit-tooltipped-keyword[^>]*>(.*?)<\/lol-uikit-tooltipped-keyword>/gi, '$1')
        .replace(/<font color=['"]?#([0-9a-fA-F]{3,6})['"]?>(.*?)<\/font>/gi, '<span style="color:#$1; font-weight:600;">$2</span>')
        .replace(/<rules>(.*?)<\/rules>/gi, '<span class="lol-rune-rules">$1</span>')
        .replace(/<status>(.*?)<\/status>/gi, '<span class="lol-rune-status">$1</span>')
        .replace(/<attention>(.*?)<\/attention>/gi, '<span class="lol-rune-attention">$1</span>')
        .replace(/<keywordMajor>(.*?)<\/keywordMajor>/gi, '<span class="lol-rune-keyword">$1</span>');

    // Themed effect colors (physical/magic damage, stun, shield) on plain text
    if (typeof colorizeEffectTerms === 'function') {
        formattedValue = colorizeEffectTerms(formattedValue);
    }

    return `<div class="lol-rune-rich-desc">${formattedValue}</div>`;
}

function findRuneById(runeId) {
    if (!Array.isArray(allRunes)) return null;
    for (const tree of allRunes) {
        for (let sIdx = 0; sIdx < (tree.slots || []).length; sIdx++) {
            const r = tree.slots[sIdx].runes.find(x => x.id === Number(runeId));
            if (r) return { runeEntry: r, tree, slotIndex: sIdx };
        }
    }
    return null;
}

/* ==========================================================================
   LOL CLIENT UI RENDERING
   ========================================================================== */
/**
 * Builds a high-resolution vector backdrop (inline SVG data URI) tinted with
 * the active tree's official colors. Replaces the old low-res blurred
 * background jpg (300x420) with a crisp, infinitely scalable composition.
 */
function buildRuneTreeBackdrop(meta) {
    const primaryColor = meta.colorHex;
    const secondaryColor = meta.secondaryColorHex;
    const svgMarkup = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 900" preserveAspectRatio="xMidYMid slice">
            <defs>
                <radialGradient id="glow" cx="74%" cy="28%" r="72%">
                    <stop offset="0%" stop-color="${secondaryColor}" stop-opacity="0.34"/>
                    <stop offset="45%" stop-color="${primaryColor}" stop-opacity="0.12"/>
                    <stop offset="100%" stop-color="#010a13" stop-opacity="0"/>
                </radialGradient>
                <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="#010a13" stop-opacity="0.98"/>
                    <stop offset="55%" stop-color="#010a13" stop-opacity="0.72"/>
                    <stop offset="100%" stop-color="#010a13" stop-opacity="0.18"/>
                </linearGradient>
            </defs>
            <rect width="1400" height="900" fill="#010a13"/>
            <rect width="1400" height="900" fill="url(#glow)"/>
            <g fill="none" stroke="${primaryColor}">
                <circle cx="1030" cy="330" r="270" stroke-width="2" opacity="0.30"/>
                <circle cx="1030" cy="330" r="340" stroke-width="1" stroke-dasharray="16 22" opacity="0.22"/>
                <circle cx="1030" cy="330" r="420" stroke-width="1" opacity="0.12"/>
                <polygon points="1030,-30 1385,330 1030,690 675,330" stroke-width="1.5" opacity="0.20"/>
                <polygon points="1030,60 1290,330 1030,600 770,330" stroke-width="1" opacity="0.16"/>
                <g stroke-width="1" opacity="0.14">
                    <line x1="1030" y1="-60" x2="1030" y2="720"/>
                    <line x1="640" y1="330" x2="1420" y2="330"/>
                    <line x1="755" y1="55" x2="1305" y2="605"/>
                    <line x1="1305" y1="55" x2="755" y2="605"/>
                </g>
                <circle cx="1030" cy="330" r="64" stroke-width="2.5" opacity="0.45"/>
                <circle cx="1030" cy="330" r="30" stroke-width="1.5" opacity="0.55" stroke="${secondaryColor}"/>
            </g>
            <rect width="1400" height="900" fill="url(#fade)"/>
        </svg>
    `;
    const svgCompact = svgMarkup.replace(/\s+/g, ' ').trim();
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgCompact)}`;
}

function renderRunes() {
    const container = document.getElementById('runes-container');
    if (!container || !allRunes || allRunes.length === 0) return;

    const activeMeta = RUNE_TREES_METADATA[activeRuneTree] || RUNE_TREES_METADATA[8000];
    const primaryTree = allRunes.find(t => t.id === activeRuneTree) || allRunes[0];

    // Ensures selected picks for the active tree
    if (!runeSelection[activeRuneTree]) {
        runeSelection[activeRuneTree] = {
            keystone: primaryTree.slots[0].runes[0].id,
            slot1: primaryTree.slots[1].runes[0].id,
            slot2: primaryTree.slots[2].runes[0].id,
            slot3: primaryTree.slots[3].runes[0].id
        };
    }
    const primaryChoices = runeSelection[activeRuneTree];

    // If no rune has been inspected yet, set the active keystone
    if (!currentInspectedRune) {
        const ksId = primaryChoices.keystone || primaryTree.slots[0].runes[0].id;
        const ksObj = primaryTree.slots[0].runes.find(r => r.id === ksId) || primaryTree.slots[0].runes[0];
        currentInspectedRune = {
            entryType: 'runa',
            rawData: ksObj,
            runeTree: primaryTree,
            slotIndex: 0,
            slotName: 'Runas Essenciais (Keystone)'
        };
    }

    const allTreeIds = [8000, 8100, 8200, 8400, 8300];

    // Top selector: the 5 official trees
    const treeTabsHtml = allTreeIds
        .map(id => {
            const m = RUNE_TREES_METADATA[id];
            const isActive = id === activeRuneTree;
            return `
                <button type="button"
                        class="lol-tree-tab ${isActive ? 'active' : ''}"
                        onclick="selectRuneTree(${id})"
                        title="${m.labelName} — ${m.subtitleText}"
                        style="${isActive ? `--tab-color:${m.colorHex}; --tab-glow:${m.glowColor}; --tab-secondary:${m.secondaryColorHex};` : ''}">
                    <img src="${m.runeIconUrl}" alt="${m.labelName}">
                    <span>${m.labelName}</span>
                </button>
            `;
        }).join('');

    // 1. Keystones (top row of the active tree)
    const slotKeystone = primaryTree.slots[0];
    const keystonesHtml = slotKeystone.runes.map(r => {
        const isSelected = primaryChoices.keystone === r.id;
        const runeIcon = `https://ddragon.leagueoflegends.com/cdn/img/${r.icon}`;
        return `
            <div class="lol-rune-badge lol-keystone-badge ${isSelected ? 'selected' : ''}"
                 onclick="selectPrimaryRune(0, ${r.id})"
                 onmouseenter="inspectRuneHover(${r.id}, 0, ${activeRuneTree})"
                 title="${r.name}">
                <div class="lol-rune-ring">
                    <img src="${runeIcon}" alt="${r.name}" class="lol-rune-icon">
                </div>
            </div>
        `;
    }).join('');

    // 2. Rows 1, 2 and 3 stacked vertically
    const subSlotsHtml = [1, 2, 3].map(slotIdx => {
        const slot = primaryTree.slots[slotIdx];
        const cacheKey = `slot${slotIdx}`;
        const rowName = activeMeta.slotNames[slotIdx] || `Linha ${slotIdx}`;
        const runesHtml = slot.runes.map(r => {
            const isSelected = primaryChoices[cacheKey] === r.id;
            const runeIcon = `https://ddragon.leagueoflegends.com/cdn/img/${r.icon}`;
            return `
                <div class="lol-rune-badge lol-subrune-badge ${isSelected ? 'selected' : ''}"
                     onclick="selectPrimaryRune(${slotIdx}, ${r.id})"
                     onmouseenter="inspectRuneHover(${r.id}, ${slotIdx}, ${activeRuneTree})"
                     title="${r.name}">
                    <div class="lol-rune-ring">
                        <img src="${runeIcon}" alt="${r.name}" class="lol-rune-icon">
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="lol-rune-tier-row" data-tier="${slotIdx}">
                <div class="lol-tier-divider"></div>
                <div class="lol-tier-row-header">
                    <span class="lol-tier-row-num">${slotIdx}</span>
                    <span class="lol-tier-row-name">${rowName}</span>
                </div>
                <div class="lol-runes-badge-group">
                    ${runesHtml}
                </div>
            </div>
        `;
    }).join('');

    // 3. Stat Shards
    const statShardsHtml = RUNE_STAT_SHARDS.map((tier, lIdx) => {
        const selectedIndex = runeSelection.shards[lIdx] ?? 0;
        const optionsHtml = tier.optionList.map((op, oIdx) => {
            const isSelected = selectedIndex === oIdx;
            return `
                <div class="lol-shard-badge ${isSelected ? 'selected' : ''}"
                     onclick="selectStatShard(${lIdx}, ${oIdx})"
                     onmouseenter="inspectShardHover(${lIdx}, ${oIdx})"
                     title="${op.labelName}">
                    <img src="${op.icon}" alt="${op.labelName}" class="lol-shard-img">
                </div>
            `;
        }).join('');

        return `
            <div class="lol-shard-tier-row">
                <span class="lol-shard-row-label" title="Linha ${tier.rowEntry} — ${tier.labelName}">
                    <i class="${tier.runeIconUrl}"></i>
                    <em>Linha ${tier.rowEntry} · ${tier.labelName}</em>
                </span>
                <div class="lol-shard-badges-group">
                    ${optionsHtml}
                </div>
            </div>
        `;
    }).join('');

    // Explanatory section (each rune explained one by one)
    let rowByRowExplanationHtml = '';
    if (runeViewMode === 'lista') {
        rowByRowExplanationHtml = buildRowByRowExplanation(primaryTree, activeMeta);
    }

    container.innerHTML = `
        <div class="lol-runes-client-wrapper" style="--tree-theme-color:${activeMeta.colorHex}; --tree-theme-secondary:${activeMeta.secondaryColorHex}; --tree-theme-glow:${activeMeta.glowColor};">
            <!-- High-resolution vector backdrop tinted with the tree's official colors -->
            <div class="lol-runes-backdrop" style="background-image: url('${buildRuneTreeBackdrop(activeMeta)}');">
                <div class="lol-backdrop-vignette"></div>
            </div>

            <div class="lol-runes-window">
                <!-- Top selector: the 5 rune trees -->
                <div class="lol-tree-tabs">
                    <div class="lol-tree-tabs-list">
                        ${treeTabsHtml}
                    </div>
                    <div class="lol-tree-tabs-info">
                        <span class="lol-tree-tabs-crest"><img src="${activeMeta.runeIconUrl}" alt="${activeMeta.labelName}"></span>
                        <div>
                            <h3 class="lol-tree-tabs-name">${activeMeta.labelName}</h3>
                            <p class="lol-tree-tabs-sub">${activeMeta.subtitleText}</p>
                        </div>
                    </div>
                </div>

                <!-- Main body: active tree (left) | inspector + shards (right) -->
                <div class="lol-runes-main-layout">
                    <!-- Column 1: keystones + rows 1/2/3 of the active tree -->
                    <div class="lol-primary-column">
                        <div class="lol-tree-slots-content">
                            <!-- Timeline line on the left with connector dots -->
                            <div class="lol-timeline-track">
                                <span class="lol-timeline-node ${primaryChoices.keystone ? 'active' : ''}"></span>
                                <span class="lol-timeline-node ${primaryChoices.slot1 ? 'active' : ''}"></span>
                                <span class="lol-timeline-node ${primaryChoices.slot2 ? 'active' : ''}"></span>
                                <span class="lol-timeline-node ${primaryChoices.slot3 ? 'active' : ''}"></span>
                            </div>

                            <div class="lol-slots-rows-group">
                                <!-- Keystones (core runes) -->
                                <div class="lol-keystone-section">
                                    <div class="lol-keystones-header">
                                        <span class="lol-keystones-line"></span>
                                        <span class="lol-keystones-title">RUNAS ESSENCIAIS</span>
                                        <span class="lol-keystones-line"></span>
                                    </div>
                                    <div class="lol-keystones-row">
                                        ${keystonesHtml}
                                    </div>
                                </div>

                                <!-- 3 sub-rune rows of the active tree -->
                                <div class="lol-subrunes-section">
                                    ${subSlotsHtml}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Column 2: live rune inspector + attribute shards -->
                    <div class="lol-runes-side-column">
                        <!-- Floating rune inspection card (hover/click explanation) -->
                        <div id="lol-rune-inspector-card" class="lol-rune-inspector-card">
                            <!-- Filled via updateInspectorCard() -->
                        </div>

                        <!-- Attribute shards -->
                        <div class="lol-shards-section">
                            <div class="lol-shards-title">
                                <i class="fa-solid fa-cubes-stacked"></i> Fragmentos de Atributos
                            </div>
                            ${statShardsHtml}
                        </div>
                    </div>
                </div>

                <!-- Footer bar (client view vs explanatory list, detailed/summarized) -->
                <div class="lol-client-footer">
                    <div class="lol-footer-left">
                        <div class="lol-view-toggles">
                            <button type="button" class="lol-view-btn ${runeViewMode === 'client' ? 'active' : ''}"
                                    onclick="toggleRuneViewMode('client')" title="Grade 2x2 (Compacto) — Ícones das runas; passe o mouse para ver a explicação">
                                <i class="fa-solid fa-table-cells-large"></i>
                            </button>
                            <button type="button" class="lol-view-btn ${runeViewMode === 'lista' ? 'active' : ''}"
                                    onclick="toggleRuneViewMode('lista')" title="Lista 3 pontos + 3 linhas (Expandido) — Títulos e descrições visíveis">
                                <i class="fa-solid fa-list"></i>
                            </button>
                        </div>

                        <label class="lol-compare-checkbox-label">
                            <input type="checkbox" id="lolRuneDetailedCheckbox" ${!runeSummaryMode ? 'checked' : ''}
                                   onchange="toggleRuneSummary(!this.checked)">
                            <span>Exibir descrições detalhadas</span>
                        </label>
                    </div>
                </div>
            </div>

            <!-- Explanatory guide section (shows keystones and each sub-rune one by one) -->
            ${rowByRowExplanationHtml}
        </div>
    `;

    // Updates the inspection card in the right panel
    updateInspectorCard();
}

/* ==========================================================================
   RUNE INSPECTION CARD UPDATE
   ========================================================================== */
function updateInspectorCard() {
    const card = document.getElementById('lol-rune-inspector-card');
    if (!card) return;

    if (!currentInspectedRune) {
        card.innerHTML = `
            <div class="lol-inspector-empty">
                <i class="fa-solid fa-wand-magic-sparkles"></i>
                <p>Passe o mouse ou clique em qualquer runa para visualizar sua explicação detalhada.</p>
            </div>
        `;
        return;
    }

    if (currentInspectedRune.entryType === 'shard') {
        const shard = currentInspectedRune.rawData;
        card.innerHTML = `
            <div class="lol-inspector-header">
                <div class="lol-inspector-icon-box shard-icon-box">
                    <img src="${shard.icon}" alt="${shard.labelName}" class="lol-inspector-icon">
                </div>
                <div>
                    <span class="lol-inspector-badge">Fragmento de Atributo • Linha ${currentInspectedRune.rowIndex + 1} (${currentInspectedRune.rowName})</span>
                    <h3 class="lol-inspector-title">${shard.labelName}</h3>
                </div>
            </div>
            <div class="lol-inspector-body">
                <p class="lol-rune-p">${shard.desc}</p>
            </div>
        `;
        return;
    }

    // Normal rune (Keystone or Sub-rune)
    const runeEntry = currentInspectedRune.rawData;
    const runeTree = currentInspectedRune.runeTree;
    const isKeystone = currentInspectedRune.slotIndex === 0;
    const treeMeta = RUNE_TREES_METADATA[runeTree.id] || RUNE_TREES_METADATA[8000];
    const runeIcon = `https://ddragon.leagueoflegends.com/cdn/img/${runeEntry.icon}`;
    const descHtml = formatRuneDescription(runeEntry, runeSummaryMode);

    card.innerHTML = `
        <div class="lol-inspector-header">
            <div class="lol-inspector-icon-box ${isKeystone ? 'keystone-box' : ''}" style="--badge-glow:${treeMeta.glowColor};">
                <img src="${runeIcon}" alt="${runeEntry.name}" class="lol-inspector-icon">
            </div>
            <div>
                <span class="lol-inspector-badge" style="color:${treeMeta.colorHex};">
                    ${isKeystone ? 'Runa Essencial (Keystone)' : currentInspectedRune.slotName} • ${treeMeta.labelName}
                </span>
                <h3 class="lol-inspector-title">${runeEntry.name}</h3>
            </div>
        </div>
        <div class="lol-inspector-body">
            ${descHtml}
        </div>
    `;
}

/* ==========================================================================
   ONE-BY-ONE EXPLANATORY GUIDE (List Mode / Full Breakdown)
   ========================================================================== */
function buildRowByRowExplanation(runeTree, meta) {
    // 1. Keystones explained one by one
    const keystones = runeTree.slots[0].runes;
    const keystonesCards = keystones.map(r => {
        const runeIcon = `https://ddragon.leagueoflegends.com/cdn/img/${r.icon}`;
        const descHtml = formatRuneDescription(r, runeSummaryMode);
        return `
            <div class="lol-guide-rune-card keystone-card">
                <div class="lol-guide-card-header">
                    <img src="${runeIcon}" alt="${r.name}" class="lol-guide-rune-img">
                    <div>
                        <span class="lol-guide-tier-tag" style="color:${meta.colorHex};">Runa Essencial</span>
                        <h4 class="lol-guide-rune-name">${r.name}</h4>
                    </div>
                </div>
                <div class="lol-guide-card-desc">
                    ${descHtml}
                </div>
            </div>
        `;
    }).join('');

    // 2. Sub-runes row by row (Row 1, Row 2, Row 3)
    const subSlotsHtml = [1, 2, 3].map(slotIdx => {
        const slot = runeTree.slots[slotIdx];
        const slotName = meta.slotNames[slotIdx] || `Sub-runas • Linha ${slotIdx}`;
        const runesCards = slot.runes.map(r => {
            const runeIcon = `https://ddragon.leagueoflegends.com/cdn/img/${r.icon}`;
            const descHtml = formatRuneDescription(r, runeSummaryMode);
            return `
                <div class="lol-guide-rune-card">
                    <div class="lol-guide-card-header">
                        <img src="${runeIcon}" alt="${r.name}" class="lol-guide-rune-img">
                        <div>
                            <span class="lol-guide-tier-tag">Linha ${slotIdx}</span>
                            <h4 class="lol-guide-rune-name">${r.name}</h4>
                        </div>
                    </div>
                    <div class="lol-guide-card-desc">
                        ${descHtml}
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="lol-guide-tier-section">
                <div class="lol-guide-tier-title">
                    <span class="lol-tier-num">${slotIdx}</span>
                    <h3>Linha ${slotIdx}: ${slotName}</h3>
                </div>
                <div class="lol-guide-tier-grid">
                    ${runesCards}
                </div>
            </div>
        `;
    }).join('');

    // 3. Stat Shards explained
    const shardsCardsHtml = RUNE_STAT_SHARDS.map((tier, lIdx) => {
        const optionsHtml = tier.optionList.map(op => `
            <div class="lol-guide-shard-item">
                <img src="${op.icon}" alt="${op.labelName}" class="lol-guide-shard-img">
                <div>
                    <strong>${op.labelName}</strong>
                    <p>${op.desc}</p>
                </div>
            </div>
        `).join('');

        return `
            <div class="lol-guide-shard-card">
                <div class="lol-guide-shard-title"><i class="${tier.runeIconUrl}"></i> Linha ${tier.rowEntry}: ${tier.labelName}</div>
                <div class="lol-guide-shard-list">
                    ${optionsHtml}
                </div>
            </div>
        `;
    }).join('');

    return `
        <div class="lol-runes-explanation-section">
            <div class="lol-explanation-header">
                <img src="${meta.runeIconUrl}" alt="${meta.labelName}" class="lol-explanation-crest">
                <div>
                    <h3 class="lol-explanation-title">Compêndio Completo: Árvore de ${meta.labelName}</h3>
                    <p class="lol-explanation-sub">${meta.subtitleText}</p>
                </div>
            </div>

            <!-- Keystones section -->
            <div class="lol-guide-tier-section keystone-section">
                <div class="lol-guide-tier-title">
                    <i class="fa-solid fa-crown" style="color:${meta.colorHex};"></i>
                    <h3>Runas Essenciais de ${meta.labelName} (Keystones)</h3>
                </div>
                <div class="lol-guide-keystones-grid">
                    ${keystonesCards}
                </div>
            </div>

            <!-- Sub-rune sections row by row -->
            <div class="lol-guide-subrunes-wrapper">
                ${subSlotsHtml}
            </div>

            <!-- Attribute shards section -->
            <div class="lol-guide-shards-section">
                <div class="lol-guide-tier-title">
                    <i class="fa-solid fa-cubes-stacked" style="color:var(--gold-bright);"></i>
                    <h3>Fragmentos de Atributos (Runas Terciárias)</h3>
                </div>
                <div class="lol-guide-shards-grid">
                    ${shardsCardsHtml}
                </div>
            </div>
        </div>
    `;
}
