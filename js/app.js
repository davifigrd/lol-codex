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
});
