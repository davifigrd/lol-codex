/* LoL Codex — Champion/item filters and the attribute filter window. */
/* ==========================================================================
   7. DYNAMIC FILTERS AND SEARCH
   ========================================================================== */
function filterChampions() {
    const searchInput = document.getElementById('champSearch');
    const query = normalizeSearchText(searchInput ? searchInput.value : '');

    // Shows/hides the clear "X" according to the typed text
    const clearBtn = document.getElementById('clearChampSearchBtn');
    if (clearBtn) clearBtn.style.display = searchInput && searchInput.value.length > 0 ? 'flex' : 'none';

    const filteredEntries = allChampions.filter(champ => {
        const champRoles = getChampionRoles(champ);

        // Lane (AND between multiple lanes: a champion must play ALL selected lanes)
        const matchRole = activeRoleFilters.size === 0 ||
            [...activeRoleFilters].every(r => champRoles.includes(r));

        // Class (multi-selection — a champion must have ALL checked classes)
        const matchClass = activeClassFilters.size === 0 ||
            [...activeClassFilters].every(c => championHasClass(champ, c));

        // Attribute / playstyle (multi-selection — must have ALL checked attributes,
        // just like the item filter, to really "funnel" the search)
        const matchAttribute = activeChampionAttributeFilters.size === 0 ||
            [...activeChampionAttributeFilters].every(a => championHasAttribute(champ, a));

        // Searches ONLY by champion name (no title, no tags)
        const matchQuery = !query || normalizeSearchText(champ.name).includes(query);

        return matchRole && matchClass && matchAttribute && matchQuery;
    });

    // Updates the count preview inside the filter window
    const countPreview = document.getElementById('filteredChampsCountPreview');
    if (countPreview) {
        const noFilter = activeRoleFilters.size === 0 && activeClassFilters.size === 0 && activeChampionAttributeFilters.size === 0 && !query;
        countPreview.textContent = noFilter
            ? 'Mostrando todos os campeões'
            : `${filteredEntries.length} campeão(ões) encontrado(s)`;
    }

    renderChampions(filteredEntries);
}

/* ==========================================================================
   CHAMPION FILTER SYSTEM (MINI WINDOW: LANE + CLASS + ATTRIBUTE)
   ========================================================================== */

// Checks whether the champion belongs to a curated/official class
function championHasClass(champ, classKey) {
    return getChampionClasses(champ.id, champ.tags).includes(classKey);
}

// Checks whether the champion has an attribute/playstyle (AD, AP, Tank, CC...)
function championHasAttribute(champ, attr) {
    const profileData = CHAMPION_PROFILES[champ.id] || [];
    return profileData.includes(attr);
}

function toggleChampionClassFilter(classKey) {
    if (activeClassFilters.has(classKey)) {
        activeClassFilters.delete(classKey);
    } else {
        activeClassFilters.add(classKey);
    }
    updateChampionFilterUI();
    filterChampions();
}

function toggleChampionAttributeFilter(attr) {
    if (activeChampionAttributeFilters.has(attr)) {
        activeChampionAttributeFilters.delete(attr);
    } else {
        activeChampionAttributeFilters.add(attr);
    }
    updateChampionFilterUI();
    filterChampions();
}

function selectChampionRole(roleKey) {
    // Multi-selection: clicking a lane toggles it on/off, so champions with
    // more than one lane (e.g. Amumu = Jungle + Support) match any of them.
    if (!roleKey || roleKey === 'all') {
        activeRoleFilters.clear();
    } else if (activeRoleFilters.has(roleKey)) {
        activeRoleFilters.delete(roleKey);
    } else {
        activeRoleFilters.add(roleKey);
    }
    updateChampionFilterUI();
    filterChampions();
}

function removeChampionClassFilter(classKey) {
    activeClassFilters.delete(classKey);
    updateChampionFilterUI();
    filterChampions();
}

function removeChampionAttributeFilter(attr) {
    activeChampionAttributeFilters.delete(attr);
    updateChampionFilterUI();
    filterChampions();
}

function clearAllChampionFilters() {
    activeClassFilters.clear();
    activeChampionAttributeFilters.clear();
    activeRoleFilters.clear();
    updateChampionFilterUI();
    filterChampions();
}

function updateChampionFilterUI() {
    const total = activeClassFilters.size + activeChampionAttributeFilters.size + activeRoleFilters.size;

    // Counter badge on the champion filter button
    const counter = document.getElementById('champFilterCounter');
    if (counter) {
        counter.textContent = total;
        counter.style.display = total > 0 ? 'inline-block' : 'none';
    }

    // Visual state of the filter button
    const filterBtn = document.getElementById('openChampFilterBtn');
    if (filterBtn) filterBtn.classList.toggle('active', total > 0);

    // Lane pills inside the mini window ("all" active only when none selected)
    document.querySelectorAll('#champFilterModalBackdrop .filter-pill-btn[data-role]').forEach(btn => {
        const isActive = btn.dataset.role === 'all'
            ? activeRoleFilters.size === 0
            : activeRoleFilters.has(btn.dataset.role);
        btn.classList.toggle('active', isActive);
    });
    // Class pills
    document.querySelectorAll('#champFilterModalBackdrop .filter-pill-btn[data-class]').forEach(btn => {
        btn.classList.toggle('active', activeClassFilters.has(btn.dataset.class));
    });
    // Attribute pills
    document.querySelectorAll('#champFilterModalBackdrop .filter-pill-btn[data-attr]').forEach(btn => {
        btn.classList.toggle('active', activeChampionAttributeFilters.has(btn.dataset.attr));
    });

    // Lane shortcuts on the main bar (kept in sync)
    document.querySelectorAll('#roleFilterGroup .filter-btn').forEach(btn => {
        const isActive = btn.dataset.role === 'all'
            ? activeRoleFilters.size === 0
            : activeRoleFilters.has(btn.dataset.role);
        btn.classList.toggle('active', isActive);
    });

    // Active filter chips
    const container = document.getElementById('activeChampFiltersContainer');
    if (!container) return;

    const chips = [];
    [...activeRoleFilters].forEach(role => {
        chips.push({ label: `Rota: ${role}`, remove: `selectChampionRole('${role}')` });
    });
    [...activeClassFilters].forEach(classKey => {
        const label = (CLASS_ICONS[classKey] && CLASS_ICONS[classKey].label) || classKey;
        chips.push({ label, remove: `removeChampionClassFilter('${classKey}')` });
    });
    [...activeChampionAttributeFilters].forEach(attr => {
        const label = (ATTRIBUTE_ICONS[attr] && ATTRIBUTE_ICONS[attr].label) || attr;
        chips.push({ label, remove: `removeChampionAttributeFilter('${attr}')` });
    });

    if (chips.length === 0) {
        container.style.display = 'none';
        container.innerHTML = '';
        return;
    }

    container.style.display = 'flex';
    container.innerHTML = chips.map(c => `<span class="filter-chip">
            ${c.label}
            <button class="filter-chip-remove" onclick="${c.remove}" title="Remover filtro">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </span>`).join('') + `
        <button class="filter-chip-clear-all" onclick="clearAllChampionFilters()">
            <i class="fa-solid fa-rotate-left"></i> Limpar tudo
        </button>`;
}

function filterItems() {
    const searchInput = document.getElementById('itemSearch');
    const query = normalizeSearchText(searchInput ? searchInput.value : '');

    // Show/hide the clear-search button
    const clearBtn = document.getElementById('clearItemSearchBtn');
    if (clearBtn) clearBtn.style.display = (searchInput && searchInput.value.length > 0) ? 'flex' : 'none';

    const filteredEntries = validSRItems.filter(item => {
        // Searches ONLY by item name (no description, no tags)
        const matchQuery = !query || normalizeSearchText(item.name).includes(query);

        // If there are no active filters, accept everything
        const matchAttributes = activeAttributeFilters.size === 0 ||
            [...activeAttributeFilters].every(attr => itemHasAttribute(item, attr));

        return matchQuery && matchAttributes;
    });

    // Updates the count preview in the modal
    const countPreview = document.getElementById('filteredItemsCountPreview');
    if (countPreview) {
        countPreview.textContent = activeAttributeFilters.size === 0
            ? 'Mostrando todos os itens'
            : `${filteredEntries.length} item(s) encontrado(s)`;
    }

    renderItems(filteredEntries);
}

/* ==========================================================================
   ITEM FILTER SYSTEM (MINI WINDOW ANCHORED TO THE BUTTON)
   ========================================================================== */

// Positions the mini window right below the button that opened it
function positionFilterPopover(cardId, buttonId) {
    const card = document.getElementById(cardId);
    const btn = document.getElementById(buttonId);
    if (!card || !btn) return;

    const marginValue = 10;
    const r = btn.getBoundingClientRect();
    const widthValue = Math.min(560, window.innerWidth - marginValue * 2);

    let left = r.right - widthValue;
    if (left < marginValue) left = marginValue;

    const top = r.bottom + marginValue;

    card.style.position = 'fixed';
    card.style.width = widthValue + 'px';
    card.style.maxWidth = 'none';
    card.style.left = left + 'px';
    card.style.right = 'auto';
    card.style.top = top + 'px';
    card.style.bottom = 'auto';
    card.style.maxHeight = Math.max(220, window.innerHeight - top - marginValue) + 'px';
}

function openItemFilters() {
    const backdrop = document.getElementById('itemFilterModalBackdrop');
    if (!backdrop) return;
    // Closes the champion mini window, if open
    const champBackdrop = document.getElementById('champFilterModalBackdrop');
    if (champBackdrop) champBackdrop.classList.remove('active');
    positionFilterPopover('itemFilterCard', 'openItemFilterBtn');
    backdrop.classList.add('active');
    const btn = document.getElementById('openItemFilterBtn');
    if (btn) btn.classList.add('active');
    filterItems(); // update the count in the mini window as soon as it opens
}

function closeItemFilters(event) {
    // If called from an overlay click, close; if called directly (no event), always close
    if (event && event.target !== document.getElementById('itemFilterModalBackdrop')) return;
    const backdrop = document.getElementById('itemFilterModalBackdrop');
    if (!backdrop) return;
    backdrop.classList.remove('active');
    // Recalculates the button "lit" state (depends on the selected filters)
    updateItemFilterUI();
}

function openChampionFilters() {
    const backdrop = document.getElementById('champFilterModalBackdrop');
    if (!backdrop) return;
    // Closes the item mini window, if open
    const itemBackdrop = document.getElementById('itemFilterModalBackdrop');
    if (itemBackdrop) itemBackdrop.classList.remove('active');
    positionFilterPopover('champFilterCard', 'openChampFilterBtn');
    backdrop.classList.add('active');
    const btn = document.getElementById('openChampFilterBtn');
    if (btn) btn.classList.add('active');
    updateChampionFilterUI();
    filterChampions(); // update the count in the mini window as soon as it opens
}

function closeChampionFilters(event) {
    if (event && event.target !== document.getElementById('champFilterModalBackdrop')) return;
    const backdrop = document.getElementById('champFilterModalBackdrop');
    if (!backdrop) return;
    backdrop.classList.remove('active');
    // Recalculates the button "lit" state (depends on the selected filters)
    updateChampionFilterUI();
}

function toggleItemAttributeFilter(attr) {
    if (activeAttributeFilters.has(attr)) {
        activeAttributeFilters.delete(attr);
    } else {
        activeAttributeFilters.add(attr);
    }
    updateItemFilterUI();
    filterItems();
}

function removeItemAttributeFilter(attr) {
    activeAttributeFilters.delete(attr);
    updateItemFilterUI();
    filterItems();
}

function clearAllItemFilters() {
    activeAttributeFilters.clear();
    updateItemFilterUI();
    filterItems();
}

function clearItemSearch() {
    const searchInput = document.getElementById('itemSearch');
    if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
    }
    filterItems();
}

function clearChampionSearch() {
    const searchInput = document.getElementById('champSearch');
    if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
    }
    filterChampions();
}

// Readable labels for the filter chips
const ATTRIBUTE_LABELS = {
    AD:         'Dano de Ataque (AD)',
    AP:         'Poder de Habilidade (AP)',
    AS:         'Velocidade de Ataque (AS)',
    CRIT:       'Acerto Crítico (CRIT)',
    LS:         'Roubo de Vida (LS)',
    VAMP:       'Vampirismo (VAMP)',
    LET:        'Letalidade (LET)',
    ARMOR_PEN:  'Penetração de Armadura (A. PEN)',
    MAGIC_PEN:  'Penetração Mágica (M. PEN)',
    HP:         'Vida (HP)',
    ARMOR:      'Armadura (ARMOR)',
    MR:         'Resistência Mágica (MR)',
    HP_REGEN:   'Regeneração de Vida (HP5)',
    TENACITY:   'Tenacidade (TEN)',
    SR:         'Resist. Lentidão (SR)',
    CDR:        'Aceleração de Habilidade (CDR)',
    MANA:       'Mana (MANA)',
    MANA_REGEN: 'Regeneração de Mana (MANA REG.)',
    MOV:        'Velocidade de Movimento (MS)',
    HEAL_SHIELD:'Cura e Resist. do Escudo (E&S)'
};

function updateItemFilterUI() {
    const count = activeAttributeFilters.size;

    // Updates the counter badge on the filter button
    const counter = document.getElementById('itemFilterCounter');
    if (counter) {
        counter.textContent = count;
        counter.style.display = count > 0 ? 'inline-block' : 'none';
    }

    // Updates the visual state of the filter button
    const filterBtn = document.getElementById('openItemFilterBtn');
    if (filterBtn) filterBtn.classList.toggle('active', count > 0);

    // Updates the pill buttons inside the modal
    document.querySelectorAll('#itemFilterModalBackdrop .filter-pill-btn').forEach(btn => {
        const attr = btn.dataset.attr;
        btn.classList.toggle('active', activeAttributeFilters.has(attr));
    });

    // Updates the active filter chips below the control bar
    const container = document.getElementById('activeFiltersContainer');
    if (!container) return;

    if (count === 0) {
        container.style.display = 'none';
        container.innerHTML = '';
        return;
    }

    container.style.display = 'flex';
    const chipsHTML = [...activeAttributeFilters].map(attr => {
        const label = ATTRIBUTE_LABELS[attr] || attr;
        return `<span class="filter-chip">
            ${label}
            <button class="filter-chip-remove" onclick="removeItemAttributeFilter('${attr}')" title="Remover filtro">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </span>`;
    }).join('');

    container.innerHTML = chipsHTML + `
        <button class="filter-chip-clear-all" onclick="clearAllItemFilters()">
            <i class="fa-solid fa-rotate-left"></i> Limpar tudo
        </button>
    `;
}

// Checks whether an item has a given attribute (for the multi-filter system)
function itemHasAttribute(item, attr) {
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
            // Strictly life steal (not omnivamp)
            return tags.includes('LifeSteal') || Boolean(stats.PercentLifeStealMod);
        case 'VAMP':
            // Omnivamp / spell vamp (separate from LS)
            return tags.includes('SpellVamp') || tags.includes('Omnivamp')
                || desc.includes('onivampirismo') || desc.includes('omnivamp');
        case 'LET':
            // Flat lethality
            return tags.includes('ArmorPenetration')
                && (desc.includes('letalidade') || !desc.includes('%'));
        case 'ARMOR_PEN':
            // % armor penetration (A. PEN), separate from flat lethality
            return (tags.includes('ArmorPenetration') && desc.includes('%') && desc.includes('armadura'))
                || (desc.includes('penetra') && desc.includes('armadura') && !desc.includes('letalidade'));
        case 'MAGIC_PEN':
            // Magic penetration — correct icon (not armor)
            return tags.includes('MagicPenetration')
                || (desc.includes('penetra') && (desc.includes('mágica') || desc.includes('magica')));
        case 'HP':
            return tags.includes('Health') || Boolean(stats.FlatHPPoolMod);
        case 'ARMOR':
            return tags.includes('Armor') || Boolean(stats.FlatArmorMod);
        case 'MR':
            return tags.includes('SpellBlock') || tags.includes('MagicResist') || Boolean(stats.FlatSpellBlockMod);
        case 'HP_REGEN':
            return tags.includes('HealthRegen') || Boolean(stats.FlatHPRegenMod) || Boolean(stats.PercentHPRegenMod);
        case 'TENACITY':
            // Strictly tenacity — NOT slow resistance
            return tags.includes('Tenacity') || desc.includes('tenacidade');
        case 'SR':
            // Slow resistance — separate from tenacity
            return desc.includes('resist') && desc.includes('lentidão');
        case 'CDR':
            return tags.includes('CooldownReduction') || tags.includes('AbilityHaste');
        case 'MANA':
            return tags.includes('Mana') || Boolean(stats.FlatMPPoolMod);
        case 'MANA_REGEN':
            return tags.includes('ManaRegen') || Boolean(stats.FlatMPRegenMod) || Boolean(stats.PercentMPRegenMod);
        case 'MOV':
            return tags.includes('Boots') || tags.includes('NonbootsMovement')
                || Boolean(stats.FlatMovementSpeedMod) || Boolean(stats.PercentMovementSpeedMod);
        case 'HEAL_SHIELD':
            return tags.includes('HealAndShieldPower')
                || (desc.includes('cura') && desc.includes('escudo'));
        default:
            return false;
    }
}

/* Global search in the hero */