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
        bgImage: '../img/runes/bg_8000.jpg',
        runeIconUrl: '../img/runes/crest_8000.png',
        slotNames: ['Runas Essenciais', 'Heroísmo', 'Lenda', 'Combate']
    },
    8100: {
        id: 8100,
        key: 'Domination',
        labelName: 'Dominação',
        subtitleText: 'Cace e elimine presas — Dano explosivo e acesso ao alvo',
        colorHex: '#dc3545',
        secondaryColorHex: '#e84057',
        glowColor: 'rgba(220, 53, 69, 0.55)',
        bgImage: '../img/runes/bg_8100.jpg',
        runeIconUrl: '../img/runes/crest_8100.png',
        slotNames: ['Runas Essenciais', 'Malevolência', 'Rastreamento', 'Caçador']
    },
    8200: {
        id: 8200,
        key: 'Sorcery',
        labelName: 'Feitiçaria',
        subtitleText: 'Liberte a destruição — Habilidades fortalecidas e manipulação de recursos',
        colorHex: '#7242f5',
        secondaryColorHex: '#9fa8da',
        glowColor: 'rgba(114, 66, 245, 0.55)',
        bgImage: '../img/runes/bg_8200.jpg',
        runeIconUrl: '../img/runes/crest_8200.png',
        slotNames: ['Runas Essenciais', 'Artefato', 'Excelência', 'Poder']
    },
    8400: {
        id: 8400,
        key: 'Resolve',
        labelName: 'Determinação',
        subtitleText: 'Viva para sempre — Durabilidade e controle de grupo',
        colorHex: '#5bc8ac',
        secondaryColorHex: '#28a745',
        glowColor: 'rgba(91, 200, 172, 0.55)',
        bgImage: '../img/runes/bg_8400.jpg',
        runeIconUrl: '../img/runes/crest_8400.png',
        slotNames: ['Runas Essenciais', 'Força', 'Resistência', 'Vitalidade']
    },
    8300: {
        id: 8300,
        key: 'Inspiration',
        labelName: 'Inspiração',
        subtitleText: 'Dobre as regras — Ferramentas criativas e manipulação das regras',
        colorHex: '#49adc9',
        secondaryColorHex: '#00c0ff',
        glowColor: 'rgba(73, 173, 201, 0.55)',
        bgImage: '../img/runes/bg_8300.jpg',
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
let activeRuneTree = 8000;         // Active primary tree (8000 = Precision)
let activeSecondaryTree = 8400;    // Active secondary tree (8400 = Resolve)
let runeViewMode = 'client';    // 'client' (visual LoL workbench) or 'list' (one-by-one explanation)
let runePageName = 'Blitz: Yasuo Meio';

// Saved rune selections per tree
let runeSelection = {
    8000: { keystone: 8008, slot1: 9111, slot2: 9104, slot3: 8299 }, // Fleet Footwork, Triumph, Legend: Alacrity, Last Stand
    8100: { keystone: 8112, slot1: 8139, slot2: 8138, slot3: 8105 }, // Electrocute, Taste of Blood, Eyeball Collection, Ravenous Hunter
    8200: { keystone: 8229, slot1: 8226, slot2: 8210, slot3: 8236 }, // Arcane Comet, Manaflow Band, Transcendence, Gathering Storm
    8400: { keystone: 8437, slot1: 8446, slot2: 8429, slot3: 8451 }, // Grasp of the Undying, Demolish, Conditioning, Overgrowth
    8300: { keystone: 8351, slot1: 8304, slot2: 8345, slot3: 8410 }, // Glacial Augment, Magical Footwear, Biscuit Delivery, Approach Velocity
    secondaryList: {
        8400: [8444, 8429] // Example: Wind's Blessing, Conditioning
    },
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

        // Restores customizations saved in localStorage, if any
        restoreSavedRunePage();

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

    // If the secondary tree equals the primary one, swap the secondary
    if (activeSecondaryTree === activeRuneTree) {
        const otherEntries = [8000, 8100, 8200, 8400, 8300].filter(id => id !== activeRuneTree);
        activeSecondaryTree = otherEntries[0];
    }

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

function selectSecondaryTree(runeTreeId) {
    const idNum = Number(runeTreeId);
    if (idNum === activeRuneTree || !RUNE_TREES_METADATA[idNum]) return;
    activeSecondaryTree = idNum;

    // Initializes default secondary selections if they do not exist
    if (!runeSelection.secondaryList[activeSecondaryTree]) {
        const secondaryTreeRef = allRunes.find(t => t.id === activeSecondaryTree);
        if (secondaryTreeRef && secondaryTreeRef.slots.length >= 4) {
            runeSelection.secondaryList[activeSecondaryTree] = [
                secondaryTreeRef.slots[1].runes[0].id,
                secondaryTreeRef.slots[2].runes[0].id
            ];
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

function selectSecondaryRune(slotIndex, runeId) {
    if (!runeSelection.secondaryList[activeSecondaryTree]) {
        runeSelection.secondaryList[activeSecondaryTree] = [];
    }

    let arr = runeSelection.secondaryList[activeSecondaryTree];
    const runeTree = allRunes.find(t => t.id === activeSecondaryTree);
    const slotRunes = runeTree && runeTree.slots[slotIndex] ? runeTree.slots[slotIndex].runes.map(r => r.id) : [];

    // If a rune was already selected on this same row, replace it
    arr = arr.filter(id => !slotRunes.includes(id));
    arr.push(runeId);

    // Keeps at most 2 secondary picks
    if (arr.length > 2) {
        arr.shift();
    }
    runeSelection.secondaryList[activeSecondaryTree] = arr;

    const runeEntry = runeTree && runeTree.slots[slotIndex] ? runeTree.slots[slotIndex].runes.find(r => r.id === runeId) : null;
    if (runeEntry) {
        currentInspectedRune = {
            entryType: 'runa',
            rawData: runeEntry,
            runeTree: runeTree,
            slotIndex: slotIndex,
            slotName: `Secundária — ${RUNE_TREES_METADATA[activeSecondaryTree].slotNames[slotIndex] || 'Sub-runa'}`
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

function inspectRuneHover(runeId, slotIndex, runeTreeId, isSecondary = false) {
    const runeTree = allRunes.find(t => t.id === runeTreeId);
    if (!runeTree || !runeTree.slots[slotIndex]) return;
    const runeEntry = runeTree.slots[slotIndex].runes.find(r => r.id === runeId);
    if (!runeEntry) return;

    const prefixStr = isSecondary ? 'Secundária — ' : '';
    currentInspectedRune = {
        entryType: 'runa',
        rawData: runeEntry,
        runeTree: runeTree,
        slotIndex: slotIndex,
        slotName: prefixStr + (RUNE_TREES_METADATA[runeTreeId].slotNames[slotIndex] || (slotIndex === 0 ? 'Runa Essencial' : 'Sub-runa'))
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
   SAVE AND PERSISTENCE
   ========================================================================== */
function saveRunePage() {
    const rawData = {
        labelName: runePageName,
        primaryTree: activeRuneTree,
        secondaryTreeChoice: activeSecondaryTree,
        selectionList: runeSelection
    };
    try {
        localStorage.setItem('lol_codex_rune_page', JSON.stringify(rawData));
        showRuneToast('Página de Runas salva com sucesso!');
    } catch (e) {
        console.error('Erro ao salvar runas:', e);
    }
}

function restoreSavedRunePage() {
    try {
        const savedValue = localStorage.getItem('lol_codex_rune_page');
        if (savedValue) {
            const obj = JSON.parse(savedValue);
            if (obj.primaryTree && RUNE_TREES_METADATA[obj.primaryTree]) {
                activeRuneTree = obj.primaryTree;
            }
            if (obj.secondaryTreeChoice && RUNE_TREES_METADATA[obj.secondaryTreeChoice]) {
                activeSecondaryTree = obj.secondaryTreeChoice;
            }
            if (obj.selectionList) {
                runeSelection = { ...runeSelection, ...obj.selectionList };
            }
            if (obj.labelName) {
                runePageName = obj.labelName;
            }
        }
    } catch (e) {
        console.warn('Erro ao restaurar página de runas:', e);
    }
}

function resetRunePage() {
    runeSelection[activeRuneTree] = {};
    const runeTree = allRunes.find(t => t.id === activeRuneTree);
    if (runeTree) {
        runeSelection[activeRuneTree].keystone = runeTree.slots[0].runes[0].id;
        runeSelection[activeRuneTree].slot1 = runeTree.slots[1].runes[0].id;
        runeSelection[activeRuneTree].slot2 = runeTree.slots[2].runes[0].id;
        runeSelection[activeRuneTree].slot3 = runeTree.slots[3].runes[0].id;
    }
    showRuneToast('Seleções redefinidas para o padrão.');
    renderRunes();
}

function editRunePageName() {
    const newValue = prompt('Nome da Página de Runas:', runePageName);
    if (newValue && newValue.trim()) {
        runePageName = newValue.trim();
        saveRunePage();
        renderRunes();
    }
}

function showRuneToast(msg) {
    let toast = document.getElementById('lol-runes-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'lol-runes-toast';
        toast.className = 'lol-runes-toast';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${msg}</span>`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
}

/* ==========================================================================
   LOL CLIENT UI RENDERING
   ========================================================================== */
function renderRunes() {
    const container = document.getElementById('runes-container');
    if (!container || !allRunes || allRunes.length === 0) return;

    const activeMeta = RUNE_TREES_METADATA[activeRuneTree] || RUNE_TREES_METADATA[8000];
    const primaryTree = allRunes.find(t => t.id === activeRuneTree) || allRunes[0];
    const secondaryMeta = RUNE_TREES_METADATA[activeSecondaryTree] || RUNE_TREES_METADATA[8400];
    const secondaryTreeChoice = allRunes.find(t => t.id === activeSecondaryTree) || allRunes[3];

    // Ensures selected picks for the primary tree
    if (!runeSelection[activeRuneTree]) {
        runeSelection[activeRuneTree] = {
            keystone: primaryTree.slots[0].runes[0].id,
            slot1: primaryTree.slots[1].runes[0].id,
            slot2: primaryTree.slots[2].runes[0].id,
            slot3: primaryTree.slots[3].runes[0].id
        };
    }
    const primaryChoices = runeSelection[activeRuneTree];

    // Ensures picks for the secondary tree
    if (!runeSelection.secondaryList[activeSecondaryTree] || runeSelection.secondaryList[activeSecondaryTree].length < 2) {
        runeSelection.secondaryList[activeSecondaryTree] = [
            secondaryTreeChoice.slots[1].runes[0].id,
            secondaryTreeChoice.slots[2].runes[0].id
        ];
    }
    const secondaryChoices = runeSelection.secondaryList[activeSecondaryTree];

    // If no rune has been inspected yet, set the active keystone
    if (!currentInspectedRune) {
        const ksId = primaryChoices.keystone || primaryTree.slots[0].runes[0].id;
        const ksObj = primaryTree.slots[0].runes.find(r => r.id === ksId) || primaryTree.slots[0].runes[0];
        currentInspectedRune = {
            entryType: 'runa',
            rawData: ksObj,
            runeTree: primaryTree,
            slotIndex: 0,
            slotName: 'Runa Essencial (Keystone)'
        };
    }

    // HTML of the Primary Tree selectors
    const allTreeIds = [8000, 8100, 8200, 8400, 8300];
    const primaryMiniIconsHtml = allTreeIds
        .filter(id => id !== activeRuneTree)
        .map(id => {
            const m = RUNE_TREES_METADATA[id];
            return `
                <button type="button" class="lol-path-mini-btn" onclick="selectRuneTree(${id})" title="${m.labelName} — ${m.subtitleText}">
                    <img src="${m.runeIconUrl}" alt="${m.labelName}">
                </button>
            `;
        }).join('');

    // HTML of the Secondary Tree selectors
    const secondaryMiniIconsHtml = allTreeIds
        .filter(id => id !== activeRuneTree && id !== activeSecondaryTree)
        .map(id => {
            const m = RUNE_TREES_METADATA[id];
            return `
                <button type="button" class="lol-path-mini-btn" onclick="selectSecondaryTree(${id})" title="${m.labelName} — ${m.subtitleText}">
                    <img src="${m.runeIconUrl}" alt="${m.labelName}">
                </button>
            `;
        }).join('');

    // 1. Primary tree rows (Keystones + 3 Sub-runes)
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

    const subSlotsHtml = [1, 2, 3].map(slotIdx => {
        const slot = primaryTree.slots[slotIdx];
        const cacheKey = `slot${slotIdx}`;
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
                <div class="lol-runes-badge-group">
                    ${runesHtml}
                </div>
            </div>
        `;
    }).join('');

    // 2. Secondary column (3 sub-rune rows, pick up to 2)
    const subSlotsSecondaryHtml = [1, 2, 3].map(slotIdx => {
        const slot = secondaryTreeChoice.slots[slotIdx];
        const runesHtml = slot.runes.map(r => {
            const isSelected = secondaryChoices.includes(r.id);
            const runeIcon = `https://ddragon.leagueoflegends.com/cdn/img/${r.icon}`;
            return `
                <div class="lol-rune-badge lol-subrune-badge lol-secondary-badge ${isSelected ? 'selected' : ''}"
                     onclick="selectSecondaryRune(${slotIdx}, ${r.id})"
                     onmouseenter="inspectRuneHover(${r.id}, ${slotIdx}, ${activeSecondaryTree}, true)"
                     title="${r.name}">
                    <div class="lol-rune-ring">
                        <img src="${runeIcon}" alt="${r.name}" class="lol-rune-icon">
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="lol-rune-tier-row lol-sec-tier-row" data-tier="${slotIdx}">
                <div class="lol-tier-divider"></div>
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
                     title="${op.labelName} — ${op.desc}">
                    <img src="${op.icon}" alt="${op.labelName}" class="lol-shard-img">
                </div>
            `;
        }).join('');

        return `
            <div class="lol-shard-tier-row">
                <div class="lol-shard-badges-group">
                    ${optionsHtml}
                </div>
            </div>
        `;
    }).join('');

    // Explanatory section ("one for each, meaning precision explains its 3 runes, then the sub runes one by one...")
    let rowByRowExplanationHtml = '';
    if (runeViewMode === 'lista') {
        rowByRowExplanationHtml = buildRowByRowExplanation(primaryTree, activeMeta);
    }

    container.innerHTML = `
        <div class="lol-runes-client-wrapper" style="--tree-theme-color:${activeMeta.colorHex}; --tree-theme-glow:${activeMeta.glowColor}; --sec-theme-color:${secondaryMeta.colorHex};">
            <!-- Official atmospheric background of the tree with monument and pedestal -->
            <div class="lol-runes-backdrop" style="background-image: url('${activeMeta.bgImage}');">
                <div class="lol-backdrop-vignette"></div>
            </div>

            <div class="lol-runes-window">
                <!-- Client top bar (page name, save button, +, trash) -->
                <div class="lol-client-header">
                    <div class="lol-header-title-box">
                        <button type="button" class="lol-edit-name-btn" onclick="editRunePageName()" title="Renomear página de runas">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <h2 class="lol-page-name" onclick="editRunePageName()">${runePageName}</h2>
                        <i class="fa-solid fa-chevron-down lol-dropdown-arrow"></i>
                    </div>

                    <div class="lol-header-actions">
                        <button type="button" class="lol-client-action-btn" onclick="saveRunePage()" title="Salvar escolhas de runas">
                            <span>SALVAR</span>
                        </button>
                        <button type="button" class="lol-client-icon-btn" onclick="editRunePageName()" title="Nova página">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                        <button type="button" class="lol-client-icon-btn" onclick="resetRunePage()" title="Redefinir escolhas">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>

                <!-- Main body with 3 columns: primary tree | secondary tree + shards | monument + inspector -->
                <div class="lol-client-body-layout">
                    <!-- Column 1: primary tree -->
                    <div class="lol-primary-column">
                        <!-- Primary selector header -->
                        <div class="lol-path-selector-row">
                            <div class="lol-active-path-crest" title="${activeMeta.labelName} (Árvore Principal)">
                                <div class="lol-crest-halo"></div>
                                <img src="${activeMeta.runeIconUrl}" alt="${activeMeta.labelName}" class="lol-crest-img">
                            </div>
                            <div class="lol-alt-paths-group">
                                ${primaryMiniIconsHtml}
                            </div>
                        </div>

                        <!-- Tree content with side timeline -->
                        <div class="lol-tree-slots-content">
                            <!-- Timeline line on the left with connector dots -->
                            <div class="lol-timeline-track">
                                <span class="lol-timeline-node ${primaryChoices.keystone ? 'active' : ''}"></span>
                                <span class="lol-timeline-node ${primaryChoices.slot1 ? 'active' : ''}"></span>
                                <span class="lol-timeline-node ${primaryChoices.slot2 ? 'active' : ''}"></span>
                                <span class="lol-timeline-node ${primaryChoices.slot3 ? 'active' : ''}"></span>
                            </div>

                            <!-- Group of the 4 tree rows -->
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

                                <!-- 3 sub-runes of the primary tree -->
                                <div class="lol-subrunes-section">
                                    ${subSlotsHtml}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Column 2: secondary tree + attribute shards -->
                    <div class="lol-secondary-column">
                        <!-- Secondary tree selector -->
                        <div class="lol-path-selector-row lol-sec-selector-row">
                            <div class="lol-active-path-crest lol-sec-crest" title="${secondaryMeta.labelName} (Árvore Secundária)">
                                <div class="lol-crest-halo" style="border-color:${secondaryMeta.colorHex};"></div>
                                <img src="${secondaryMeta.runeIconUrl}" alt="${secondaryMeta.labelName}" class="lol-crest-img">
                            </div>
                            <div class="lol-alt-paths-group">
                                ${secondaryMiniIconsHtml}
                            </div>
                        </div>

                        <!-- Secondary slots and shards with timeline -->
                        <div class="lol-tree-slots-content lol-sec-content">
                            <div class="lol-timeline-track lol-sec-timeline">
                                <span class="lol-timeline-node ${secondaryChoices.length >= 1 ? 'active' : ''}"></span>
                                <span class="lol-timeline-node ${secondaryChoices.length >= 2 ? 'active' : ''}"></span>
                                <span class="lol-timeline-node"></span>
                                <span class="lol-timeline-node shard-node active"></span>
                                <span class="lol-timeline-node shard-node active"></span>
                                <span class="lol-timeline-node shard-node active"></span>
                            </div>

                            <div class="lol-slots-rows-group">
                                <!-- Secondary sub-runes (pick 2) -->
                                <div class="lol-sec-subrunes-group">
                                    ${subSlotsSecondaryHtml}
                                </div>

                                <!-- Attribute shards -->
                                <div class="lol-shards-section">
                                    ${statShardsHtml}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Column 3: mystic pedestal + rune detail inspector -->
                    <div class="lol-inspector-column">
                        <!-- Rune monument / floating pedestal -->
                        <div class="lol-monument-pedestal">
                            <div class="lol-pedestal-light-orb"></div>
                            <img src="${activeMeta.runeIconUrl}" alt="${activeMeta.labelName}" class="lol-monument-crest-floating">
                        </div>

                        <!-- Floating rune inspection card -->
                        <div id="lol-rune-inspector-card" class="lol-rune-inspector-card">
                            <!-- Filled via updateInspectorCard() -->
                        </div>
                    </div>
                </div>

                <!-- Footer / bottom bar (grid mode vs explanatory list mode, detailed checkbox, quick navigation) -->
                <div class="lol-client-footer">
                    <div class="lol-footer-left">
                        <div class="lol-view-toggles">
                            <button type="button" class="lol-view-btn ${runeViewMode === 'client' ? 'active' : ''}"
                                    onclick="toggleRuneViewMode('client')" title="Interface do Cliente LoL (Interativa)">
                                <i class="fa-solid fa-table-cells-large"></i>
                            </button>
                            <button type="button" class="lol-view-btn ${runeViewMode === 'lista' ? 'active' : ''}"
                                    onclick="toggleRuneViewMode('lista')" title="Guia Explicativo (Runas explicadas uma a uma)">
                                <i class="fa-solid fa-list-ul"></i>
                            </button>
                        </div>

                        <label class="lol-compare-checkbox-label">
                            <input type="checkbox" id="lolRuneDetailedCheckbox" ${!runeSummaryMode ? 'checked' : ''}
                                   onchange="toggleRuneSummary(!this.checked)">
                            <span>Exibir descrições detalhadas durante a comparação (ou segure Shift)</span>
                        </label>
                    </div>

                    <div class="lol-footer-right">
                        <div class="lol-quick-tree-pills">
                            ${allTreeIds.map(id => {
                                const m = RUNE_TREES_METADATA[id];
                                const isActive = id === activeRuneTree;
                                return `
                                    <button type="button" class="lol-tree-pill ${isActive ? 'active' : ''}"
                                            onclick="selectRuneTree(${id})"
                                            style="${isActive ? `border-color:${m.colorHex}; color:${m.secondaryColorHex};` : ''}">
                                        <img src="${m.runeIconUrl}" alt="${m.labelName}">
                                        <span>${m.labelName}</span>
                                    </button>
                                `;
                            }).join('')}
                        </div>
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
            <div class="lol-inspector-footer">
                <span class="lol-inspector-tip"><i class="fa-solid fa-circle-info"></i> Fragmentos personalizam atributos defensivos e ofensivos da sua rota.</span>
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
        <div class="lol-inspector-footer">
            <span class="lol-inspector-tip">
                <i class="fa-solid fa-mouse-pointer"></i> Clique na runa para selecioná-la na sua página de runas.
            </span>
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
