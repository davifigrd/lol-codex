/* LoL Codex — Items: loading, list, cards and detailed modal. */
/* ==========================================================================
   3. ITEMS VIA DATA DRAGON (ATTRIBUTE SYMBOLS, NO GOLD WORD)
   ========================================================================== */
async function loadItemsFromDataDragon() {
    const grid = document.getElementById('items-grid');
    try {
        const url = `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/data/${currentLanguage}/item.json`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);

        const data = await res.json();
        allItems = data.data || {};

        // Filters to valid Summoner's Rift items only
        validSRItems = Object.entries(allItems)
            .filter(([id, item]) => {
                const inSummonersRift = item.maps && item.maps['11'] === true;
                const canPurchase = item.gold && item.gold.purchasable !== false && item.gold.total > 0;
                const availableInStore = item.inStore !== false;
                return inSummonersRift && canPurchase && availableInStore;
            })
            .map(([id, item]) => ({ id, ...item }))
            .sort((a, b) => b.gold.total - a.gold.total);

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

    grid.innerHTML = itemList.map(item => buildItemCardHTML(item)).join('');
}

function buildItemCardHTML(item) {
    const iconUrl = `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/item/${item.id}.png`;
    const priceValue = item.gold && item.gold.total ? item.gold.total : 0;

    // Visual attribute icons instead of written text (passing the full item to analyze tags and stats)
    const attributeIcons = buildItemAttributeIcons(item);

    // Summary vs detailed mode: Summary = author text from the JSON; Detailed = clean DDragon plaintext
    const itemSummaryData = itemSummaries[item.id];
    let displayText;
    if (itemSummaryMode && itemSummaryData && itemSummaryData.resumo && !itemSummaryData.resumo.startsWith('TODO:')) {
        displayText = itemSummaryData.resumo;
    } else {
        displayText = item.plaintext || stripHtmlTags(item.description || '') || 'Item de Summoner\'s Rift.';
    }

    return `
        <div class="item-card" onclick="openItemModal('${item.id}')" onmouseenter="applyCardHoverColor(this, '${iconUrl}')">
            <div class="item-header">
                <img src="${iconUrl}" class="item-icon" alt="${item.name}" loading="lazy">
                <div class="item-title-wrap">
                    <div class="item-name-row" style="display:flex; align-items:center; justify-content:space-between; gap:0.5rem;">
                        <h4>${item.name}</h4>
                        <!-- Only the coin and the value, without the word gold -->
                        <span class="item-cost"><i class="fa-solid fa-coins" style="color:var(--gold-bright);"></i> ${priceValue}</span>
                    </div>
                    <!-- Attribute badges below the item name (e.g. Trinity Force > AD LP AS) -->
                    <div class="item-badges" style="display:flex; flex-wrap:wrap; gap:0.35rem; margin-top:0.35rem;">
                        ${attributeIcons}
                    </div>
                </div>
            </div>
            <p class="item-stats" style="font-size:0.8rem; color:var(--text-body); line-height:1.4;">${displayText}</p>
        </div>
    `;
}

function buildItemAttributeIcons(itemOrTags) {
    const item = (typeof itemOrTags === 'object' && !Array.isArray(itemOrTags)) ? itemOrTags : null;
    const tags = Array.isArray(itemOrTags) ? itemOrTags : (item?.tags || []);
    const stats = item?.stats || {};

    let badges = [];

    // Physical Damage (AD)
    if (tags.includes('Damage') || Boolean(stats.FlatPhysicalDamageMod)) {
        badges.push(`<span class="stat-icon-badge stat-badge-ad" title="Dano Físico (AD)"><span class="stat-img-icon stat-img-ad" aria-hidden="true"></span> AD</span>`);
    }

    // Ability Power (AP)
    if (tags.includes('SpellDamage') || Boolean(stats.FlatMagicDamageMod)) {
        badges.push(`<span class="stat-icon-badge stat-badge-ap" title="Poder de Habilidade (AP)"><span class="stat-img-icon stat-img-ap" aria-hidden="true"></span> AP</span>`);
    }

    // Armor (ARMOR) - STRICTLY items that grant armor, NEVER just health!
    if (tags.includes('Armor') || Boolean(stats.FlatArmorMod)) {
        badges.push(`<span class="stat-icon-badge stat-badge-armor" title="Armadura (ARMOR)"><span class="stat-img-icon stat-img-armor" aria-hidden="true"></span> ARMOR</span>`);
    }

    // Health (HP) - Items that grant health
    if (tags.includes('Health') || Boolean(stats.FlatHPPoolMod)) {
        badges.push(`<span class="stat-icon-badge stat-badge-health" title="Vida (LP)"><span class="stat-img-icon stat-img-health" aria-hidden="true"></span> LP</span>`);
    }

    // Attack Speed (AS)
    if (tags.includes('AttackSpeed') || Boolean(stats.PercentAttackSpeedMod)) {
        badges.push(`<span class="stat-icon-badge stat-badge-as" title="Velocidade de Ataque (AS)"><span class="stat-img-icon stat-img-as" aria-hidden="true"></span> AS</span>`);
    }

    // Ability Haste (CDR)
    if (tags.includes('CooldownReduction') || tags.includes('AbilityHaste')) {
        badges.push(`<span class="stat-icon-badge stat-badge-cdr" title="Aceleração de Habilidade (CDR)"><span class="stat-img-icon stat-img-cdr" aria-hidden="true"></span> CDR</span>`);
    }

    // Critical Strike (CRIT)
    if (tags.includes('CriticalStrike') || Boolean(stats.FlatCritChanceMod)) {
        badges.push(`<span class="stat-icon-badge stat-badge-crit" title="Acerto Crítico (CRIT)"><span class="stat-img-icon stat-img-crit" aria-hidden="true"></span> CRIT</span>`);
    }

    // Life Steal (LS)
    if (tags.includes('LifeSteal') || tags.includes('SpellVamp') || tags.includes('Omnivamp') || Boolean(stats.PercentLifeStealMod)) {
        badges.push(`<span class="stat-icon-badge stat-badge-ls" title="Roubo de Vida (LS)"><span class="stat-img-icon stat-img-ls" aria-hidden="true"></span> LS</span>`);
    }

    // Magic Resist (MR)
    if (tags.includes('SpellBlock') || tags.includes('MagicResist') || Boolean(stats.FlatSpellBlockMod)) {
        badges.push(`<span class="stat-icon-badge stat-badge-mr" title="Resistência Mágica (MR)"><span class="stat-img-icon stat-img-mr" aria-hidden="true"></span> MR</span>`);
    }

    // Penetration (PEN)
    if (tags.includes('ArmorPenetration') || tags.includes('MagicPenetration')) {
        badges.push(`<span class="stat-icon-badge stat-badge-pen" title="Penetração (PEN)"><span class="stat-img-icon stat-img-pen" aria-hidden="true"></span> PEN</span>`);
    }

    // Mana (MANA)
    if (tags.includes('Mana') || tags.includes('ManaRegen') || Boolean(stats.FlatMPPoolMod)) {
        badges.push(`<span class="stat-icon-badge stat-badge-mana" title="Mana (MANA)"><span class="stat-img-icon stat-img-mana" aria-hidden="true"></span> MANA</span>`);
    }

    // Boots / Movement Speed (MS)
    if (tags.includes('Boots') || tags.includes('NonbootsMovement') || Boolean(stats.FlatMovementSpeedMod) || Boolean(stats.PercentMovementSpeedMod)) {
        badges.push(`<span class="stat-icon-badge stat-badge-mov" title="Botas / Movimento (MOV)"><span class="stat-img-icon stat-img-mov" aria-hidden="true"></span> MOV</span>`);
    }

    if (badges.length === 0) {
        badges.push(`<span class="stat-icon-badge" title="Item de Suporte / Utilidade" style="border-color:var(--border-color); color:var(--gold-light);"><i class="fa-solid fa-sparkles" style="color:var(--gold-bright);"></i> UTIL</span>`);
    }

    return badges.join('');
}


/* ==========================================================================
   5. DETAILED ITEM MODAL (RECIPES AND PRICE WITHOUT THE GOLD WORD)
   ========================================================================== */
function openItemModal(itemId) {
    const modal = document.getElementById('item-modal');
    const modalContent = document.getElementById('item-modal-content');
    if (!modal || !modalContent) return;

    const item = allItems[itemId];
    if (!item) return;

    currentOpenItemModal = itemId; // Tracks the open item to re-render on switch toggle

    const iconUrl = `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/item/${itemId}.png`;
    const totalPrice = item.gold && item.gold.total ? item.gold.total : 0;

    // Applies the item's predominant color to the modal border and glow
    getDominantColor(iconUrl).then(colorHex => {
        const modalContainer = document.querySelector('#item-modal .modal-container');
        if (modalContainer) {
            modalContainer.style.setProperty('--modal-accent-color', colorHex.rgb);
            modalContainer.style.setProperty('--modal-accent-glow', colorHex.rgba);
        }
        const itemAvatar = document.getElementById('item-modal-avatar');
        if (itemAvatar) {
            itemAvatar.style.borderColor = colorHex.rgb;
            itemAvatar.style.boxShadow = `0 0 20px ${colorHex.rgba}`;
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

    modalContent.innerHTML = `
        <div style="display:flex; gap:1.25rem; align-items:center; margin-bottom:1.5rem; border-bottom:1px solid var(--border-color); padding-bottom:1.25rem;">
            <img id="item-modal-avatar" src="${iconUrl}" style="width:75px; height:75px; border-radius:var(--radius-md); border:2px solid var(--gold-bright); box-shadow:0 0 15px var(--gold-glow); object-fit:cover; background:#000; transition:border-color 0.3s ease, box-shadow 0.3s ease;">
            <div style="flex-grow:1;">
                <h2 style="font-size:1.85rem; font-family:var(--font-title); color:var(--gold-light); line-height:1.2;">${item.name}</h2>
                <!-- Attribute badges below the item name (e.g. Trinity Force > AD LP AS) -->
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
            <div class="item-ddragon-desc" style="background:var(--bg-panel); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem;">
                ${(() => {
            const itemModalSummary = itemSummaries[itemId];
            const baseDesc = item.description || '<p>Sem descrição adicional.</p>';
            if (itemSummaryMode) {
                const resumoText = (itemModalSummary && itemModalSummary.resumo && !itemModalSummary.resumo.startsWith('TODO:')) ? itemModalSummary.resumo : null;
                return `
                    ${baseDesc}
                    <div style="margin-top:1rem; padding:0.8rem; background:rgba(200,155,60,0.08); border:1px solid rgba(200,155,60,0.25); border-radius:var(--radius-sm);">
                        <div style="color:var(--gold-light); font-weight:700; font-size:0.88rem; margin-bottom:0.35rem; display:flex; align-items:center; gap:0.4rem;">
                            <i class="fa-solid fa-file-lines"></i> Resumo
                        </div>
                        <p style="color:var(--text-body); margin:0; line-height:1.6;">${resumoText ? resumoText : '<em style="color:var(--text-muted);">Resumo autoral ainda não escrito.</em>'}</p>
                    </div>
                `;
            }
            return baseDesc;
        })()}
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
