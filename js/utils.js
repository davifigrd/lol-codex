/* LoL Codex — Misc utilities (text normalization, HTML cleanup, tag translation). */
/* ==========================================================================
   9. UTILITIES
   ========================================================================== */
// Normalizes text for search: removes accents, lowercases, trims
function normalizeSearchText(str) {
    if (!str) return '';
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function stripHtmlTags(str) {
    if (!str) return '';
    return str.replace(/<[^>]*>/g, '').trim();
}

/* ==========================================================================
   SUMMARY MODE (DETAILED / SUMMARIZED) — global sync + localStorage
   The choice is shared by champions, runes and items AND persisted, so the
   site always opens with the version the user prefers.
   ========================================================================== */
const SUMMARY_MODE_STORAGE_KEY = 'lol_codex_summary_mode';

function persistSummaryMode(enabled) {
    try {
        localStorage.setItem(SUMMARY_MODE_STORAGE_KEY, enabled ? '1' : '0');
    } catch (e) {
        // localStorage unavailable (e.g. private mode): keep session-only value
    }
}

// Restores the saved preference on startup, before anything renders.
// The champion/item modal switches are built from the state when opened,
// so only the static switches of the page need syncing here.
function restoreSummaryModePreference() {
    let savedValue = null;
    try {
        savedValue = localStorage.getItem(SUMMARY_MODE_STORAGE_KEY);
    } catch (e) {
        return; // localStorage unavailable: keep the defaults
    }
    if (savedValue !== '0' && savedValue !== '1') return;

    const enabled = savedValue === '1';
    championSummaryMode = enabled;
    itemSummaryMode = enabled;
    runeSummaryMode = enabled;

    const staticSwitches = [
        { toggle: 'runeSummaryToggle', detLabel: 'runeDetailsLabel', resLabel: 'runeSummaryLabel' },
        { toggle: 'itemSummaryToggle', detLabel: 'itemDetailsLabel', resLabel: 'itemSummaryLabel' }
    ];
    staticSwitches.forEach(({ toggle, detLabel, resLabel }) => {
        const toggleEl = document.getElementById(toggle);
        if (toggleEl) toggleEl.checked = enabled;
        const detEl = document.getElementById(detLabel);
        const resEl = document.getElementById(resLabel);
        if (detEl) detEl.classList.toggle('switch-label-active', !enabled);
        if (resEl) resEl.classList.toggle('switch-label-active', enabled);
    });
}

// Syncs summary mode (detailed/summary) between champions, runes and items.
// That way, enabling summary in one place summarizes the whole site.
function syncSummaryMode(sourceId, enabled) {
    if (syncingSummaryMode) return;
    syncingSummaryMode = true;
    try {
        persistSummaryMode(enabled);
        if (sourceId !== 'runes' && runeSummaryMode !== enabled && typeof toggleRuneSummary === 'function') {
            toggleRuneSummary(enabled);
        }
        if (sourceId !== 'items' && itemSummaryMode !== enabled && typeof toggleItemSummary === 'function') {
            toggleItemSummary(enabled);
        }
        if (sourceId !== 'champions' && championSummaryMode !== enabled && typeof toggleChampionSummary === 'function') {
            toggleChampionSummary(enabled);
        }
    } finally {
        syncingSummaryMode = false;
    }
}

function translateTag(tag) {
    const lookupMap = {
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
    return lookupMap[tag] || tag;
}

/* ==========================================================================
   SCROLL LOCK — locks the background page scroll while a modal is open.
   Only the modal content (.modal-container) stays scrollable.
   ========================================================================== */
let pageScrollLocked = false;
let pageScrollSavedPadding = '';

function lockPageScroll() {
    if (pageScrollLocked) return;
    pageScrollLocked = true;
    // Without the scrollbar the layout gets wider: compensate with padding
    // so the background content does not "jump".
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    pageScrollSavedPadding = document.body.style.paddingRight;
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.classList.add('scroll-locked');
    document.documentElement.classList.add('scroll-locked');
}

function unlockPageScroll() {
    if (!pageScrollLocked) return;
    pageScrollLocked = false;
    document.body.classList.remove('scroll-locked');
    document.documentElement.classList.remove('scroll-locked');
    document.body.style.paddingRight = pageScrollSavedPadding;
}

// Watches the .active class of every modal: any open/close path
// (X button, overlay click, ESC, closeModal()) keeps the lock consistent.
function setupModalScrollLock() {
    const applyState = () => {
        if (document.querySelector('.modal-overlay.active')) lockPageScroll();
        else unlockPageScroll();
    };

    const observer = new MutationObserver(applyState);
    document
        .querySelectorAll('.modal-overlay')
        .forEach((overlay) => observer.observe(overlay, { attributes: true, attributeFilter: ['class'] }));

    applyState();
}