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
                console.log(`[LoL Codex] Sincronizado: Versão ${currentVersion} | Idioma ${currentLanguage}`);
            }
        }
    } catch (errObj) {
        console.warn(`[LoL Codex] Falha ao obter versões, mantendo: ${currentVersion}`, errObj);
    }
}

/* ==========================================================================
   1b. AUTHOR SUMMARIES (3 local JSONs + glossary)
   ========================================================================== */
// Cache-busting for the local data JSONs (keep in sync with the ?v= refs
// in index.html, otherwise stale summaries can linger in the browser cache)
const LOCAL_DATA_CACHE_VERSION = '4';

async function loadAuthorSummaries() {
    const loadJSON = async (fetchPath, fallback = {}) => {
        try {
            const res = await fetch(fetchPath);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
        } catch (errObj) {
            console.warn(`[LoL Codex] Resumo não encontrado (${fetchPath}):`, errObj.message);
            return fallback;
        }
    };

    const [skillEntries, itemsData, runeEntries, glossaryData] = await Promise.all([
        loadJSON(`../data/skill-summary.json?v=${LOCAL_DATA_CACHE_VERSION}`),
        loadJSON(`../data/item-summary.json?v=${LOCAL_DATA_CACHE_VERSION}`),
        loadJSON(`../data/rune-summary.json?v=${LOCAL_DATA_CACHE_VERSION}`),
        loadJSON(`../data/glossary.json?v=${LOCAL_DATA_CACHE_VERSION}`)
    ]);

    skillSummaries = skillEntries;
    itemSummaries = itemsData;
    runeSummaries = runeEntries;
    lolGlossary = glossaryData;
    console.log('[LoL Codex] Resumos autorais e glossário carregados:', {
        championList: Object.keys(skillSummaries).filter(k => !k.startsWith('_')).length,
        itemsData: Object.keys(itemSummaries).filter(k => !k.startsWith('_')).length,
        runeEntries: Object.keys(runeSummaries).filter(k => !k.startsWith('_')).length,
        glossaryTerms: Object.keys(lolGlossary).filter(k => !k.startsWith('_')).length
    });
}
