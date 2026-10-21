/* LoL Codex — Data Dragon version and author summary loading (local JSONs). */
/* ==========================================================================
   1. DATA DRAGON VERSION
   ========================================================================== */
async function loadDDragonVersion() {
    try {
        const response = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
        if (response.ok) {
            const versions = await response.json();
            if (Array.isArray(versions) && versions.length > 0) {
                currentVersion = versions[0];
            }
        }
    } catch (errObj) {
        console.warn(`[LoL Codex] Falha ao obter versões, mantendo: ${currentVersion}`, errObj);
    }
    // Single init log for the whole application
    console.log(`[LoL Codex] Patch ${currentVersion}`);
}

/* ==========================================================================
   1b. AUTHOR SUMMARIES (3 local JSONs + glossary)
   ========================================================================== */
// Cache-busting for the local data JSONs (keep in sync with the ?v= refs
// in index.html, otherwise stale summaries can linger in the browser cache)
const LOCAL_DATA_CACHE_VERSION = '6';

async function loadAuthorSummaries() {
    const loadJSON = async (fetchPath, fallback = {}) => {
        try {
            const res = await fetch(fetchPath);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
        } catch (errObj) {
            // Opening the site via file:// blocks local JSON fetches by design,
            // so the silent fallback is expected and not worth a console warning.
            if (location.protocol !== 'file:') {
                console.warn(`[LoL Codex] Resumo não encontrado (${fetchPath}):`, errObj.message);
            }
            return fallback;
        }
    };

    const [skillEntries, itemsData, runeEntries, glossaryData] = await Promise.all([
        loadJSON(`../data/skill-summary.json?v=${LOCAL_DATA_CACHE_VERSION}`),
        loadJSON(`../data/item-resum.json?v=${LOCAL_DATA_CACHE_VERSION}`).then(async res => {
            const hasEntries = res && Object.keys(res).some(k => !k.startsWith('_'));
            if (hasEntries) return res;
            const legacy = await loadJSON(`../data/item-summary.json?v=${LOCAL_DATA_CACHE_VERSION}`);
            // file:// mirror of data/item-resum.json (same pattern as data/quiz-fallback.js)
            if (legacy && Object.keys(legacy).some(k => !k.startsWith('_'))) return legacy;
            return window.ITEM_RESUM_FALLBACK_DATA || legacy;
        }),
        loadJSON(`../data/rune-summary.json?v=${LOCAL_DATA_CACHE_VERSION}`),
        loadJSON(`../data/glossary.json?v=${LOCAL_DATA_CACHE_VERSION}`)
    ]);

    skillSummaries = skillEntries;
    itemSummaries = itemsData;
    runeSummaries = runeEntries;
    lolGlossary = glossaryData;
}
