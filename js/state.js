/* LoL Codex — Global state, constants and user language detection. */
/* ==========================================================================
   LoL Codex - Main Script
   Vanilla ES6+ natively integrated with the Riot Games Data Dragon API
   ========================================================================== */

// 1. Gets the user's browser language (e.g. 'pt-BR', 'en-US', 'es-ES')
function getUserLanguage() {
    const lang = navigator.language || navigator.userLanguage || '';
    if (lang.startsWith('pt')) return 'pt_BR';
    if (lang.startsWith('es')) return 'es_ES';
    return 'en_US'; // International default language
}

// Settings and Global State
let currentVersion = '14.24.1';
let currentLanguage = getUserLanguage();

let allChampions = [];
let allItems = {};
let validSRItems = [];
let allRunes = [];
let championDetailsCache = {};

// Lanes selected in the champion filter (multi-selection: a champion can
// play more than one lane, e.g. Amumu = Jungle + Support). Empty = all lanes.
let activeRoleFilters = new Set();
let activeItemCategory = 'all';

// New attribute filter system (multi-selection via mini window)
let activeAttributeFilters = new Set();
// Global "Info" mode: replaces card descriptions with the ultra-summary bullets
let itemCardsInfoMode = false;

// Champion filters (mini window): classes and attributes/playstyles
let activeClassFilters = new Set();
let activeChampionAttributeFilters = new Set();

// Summary switch key states
let championSummaryMode = false;
let itemSummaryMode = false;
let runeSummaryMode = true;
// Re-entrancy guard when syncing summary mode globally (champions/runes/items)
let syncingSummaryMode = false;
let currentOpenChampionModal = null;

// Author summary and glossary database (loaded from the data/ folder)
let skillSummaries = {};
let itemSummaries = {};
let runeSummaries = {};
let lolGlossary = {};

// CommunityDragon data cache per champion (for the ability videos)
let champCDragonCache = {};

// Base URL of the ability videos (CommunityDragon / Riot CloudFront)
const VIDEO_BASE_URL = 'https://d28xe8vt774jo5.cloudfront.net/';




// Official League of Legends CLASS icons (CommunityDragon / Riot Games)
// Used in the LoL client to represent each champion's class/role