/* LoL Codex — Application bootstrap (entry point). */
/* ==========================================================================
   APPLICATION BOOTSTRAP
   ========================================================================== */
document.addEventListener('DOMContentLoaded', async () => {
    restoreSummaryModePreference();
    setupNavigation();
    setupGlobalSearch();
    setupFilters();
    setupModalEvents();
    setupAlphabeticalIndex();
    setupModalScrollLock();
    setupFeedbackWidget();

    // 1. Sync the official Data Dragon version
    await loadDDragonVersion();

    // 2. Load Champions, Items, Runes and author summaries in parallel
    await Promise.all([
        loadChampionsFromDataDragon(),
        loadItemsFromDataDragon(),
        loadRunesFromDataDragon(),
        loadAuthorSummaries()
    ]);

    // Keeps the balloon up to date right after the filtered list renders
    setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
        window.dispatchEvent(new Event('scroll'));
    }, 300);

    // 3. Cross-page deep links coming from the Quiz page search bar
    //    (?open=champion:id | item:id | rune:id)
    applyOpenParamFromUrl();
});

/* ==========================================================================
   DEEP LINKS — ?open=champion:id | item:id | rune:id
   ========================================================================== */
// Opens the matching tab and entity, then strips the query parameter so a
// page refresh does not reopen the same item over and over.
function applyOpenParamFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('open');
    if (!raw) return;

    const separatorIdx = raw.indexOf(':');
    const kind = separatorIdx >= 0 ? raw.slice(0, separatorIdx) : raw;
    const id = separatorIdx >= 0 ? decodeURIComponent(raw.slice(separatorIdx + 1)) : '';

    try {
        if (kind === 'champion' && typeof openChampionModal === 'function') {
            switchTab('champions');
            openChampionModal(id);
        } else if (kind === 'item' && typeof openItemModal === 'function') {
            switchTab('items');
            openItemModal(id);
        } else if (kind === 'rune' && typeof selectRuneTree === 'function') {
            switchTab('runes');
            // Finds the tree that owns the rune so the correct panel is active
            let ownerTreeId = null;
            if (Array.isArray(allRunes)) {
                allRunes.forEach((tree) => {
                    (tree.slots || []).forEach((slot) => {
                        if ((slot.runes || []).some((r) => String(r.id) === String(id))) {
                            ownerTreeId = tree.id;
                        }
                    });
                });
            }
            if (ownerTreeId) selectRuneTree(ownerTreeId, id);
            else switchTab('runes');
        }
    } catch (err) {
        console.warn('[LoL Codex] Não foi possível abrir o link direto:', err);
    }

    // Cleans the URL (?open=...) without reloading the page
    params.delete('open');
    const query = params.toString();
    const cleanUrl = window.location.pathname + (query ? `?${query}` : '') + window.location.hash;
    window.history.replaceState({}, document.title, cleanUrl);
}
