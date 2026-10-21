/* LoL Codex — Tab navigation, UI events and modals. */
/* ==========================================================================
   8. NAVIGATION, TABS AND UI
   ========================================================================== */
function setupNavigation() {
    const mobileBtn = document.getElementById('mobileToggleBtn');
    const navMenu = document.getElementById('navMenu');
    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', () => navMenu.classList.toggle('mobile-open'));
    }

    // Deep links from the standalone Quiz page (index.html#items, #runes, ...)
    // must activate the matching tab instead of only jumping to a hidden section.
    const applyHashTab = () => {
        const tabId = (window.location.hash || '').replace('#', '');
        if (!tabId) return;
        const target = document.getElementById(tabId);
        if (target && target.classList.contains('page-section')) switchTab(tabId);
    };
    window.addEventListener('hashchange', applyHashTab);
    applyHashTab();
}

// Closes the global search preview when clicking outside the header field
function setupGlobalSearch() {
    document.addEventListener('click', (e) => {
        if (e.target.closest('.header-search')) return;
        document.querySelectorAll('.global-suggestions.show').forEach((box) => {
            box.classList.remove('show');
            activeIdx['headerGlobalSearch'] = -1;
        });
    });
}

function switchTab(tabId) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

    const target = document.getElementById(tabId);
    if (target) target.classList.add('active');

    const activeLink = document.querySelector(`.nav-link[href="#${tabId}"]`);
    if (activeLink) activeLink.classList.add('active');

    const navMenu = document.getElementById('navMenu');
    if (navMenu) navMenu.classList.remove('mobile-open');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupFilters() {
    document.querySelectorAll('#roleFilterGroup .filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetBtn = e.target.closest('.filter-btn');
            if (!targetBtn) return;
            // Delegated to the unified system (syncs with the filter mini window)
            selectChampionRole(targetBtn.dataset.role);
        });
    });

    document.querySelectorAll('#itemCatFilterGroup .filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetBtn = e.target.closest('.filter-btn');
            if (!targetBtn) return;
            document.querySelectorAll('#itemCatFilterGroup .filter-btn').forEach(b => b.classList.remove('active'));
            targetBtn.classList.add('active');
            filterItems();
        });
    });

    // Initial state of the champion filters (chips / counter / pills)
    updateChampionFilterUI();
}

// Repositions the filter mini windows when the page scrolls or the window resizes
function repositionFilterPopovers() {
    const itemBackdrop = document.getElementById('itemFilterModalBackdrop');
    if (itemBackdrop && itemBackdrop.classList.contains('active')) {
        positionFilterPopover('itemFilterCard', 'openItemFilterBtn');
    }
    const champBackdrop = document.getElementById('champFilterModalBackdrop');
    if (champBackdrop && champBackdrop.classList.contains('active')) {
        positionFilterPopover('champFilterCard', 'openChampFilterBtn');
    }
}

function setupModalEvents() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close the champion filter mini window if it is open
            const champBackdrop = document.getElementById('champFilterModalBackdrop');
            if (champBackdrop && champBackdrop.classList.contains('active')) {
                closeChampionFilters();
                return;
            }
            // Close the item filter mini window if it is open
            const filterBackdrop = document.getElementById('itemFilterModalBackdrop');
            if (filterBackdrop && filterBackdrop.classList.contains('active')) {
                closeItemFilters();
                return;
            }
            closeModal();
        }
    });

    // Keeps the mini windows stuck to their buttons
    window.addEventListener('resize', repositionFilterPopovers);
    let rafScheduled = false;
    window.addEventListener('scroll', () => {
        if (rafScheduled) return;
        rafScheduled = true;
        requestAnimationFrame(() => {
            rafScheduled = false;
            repositionFilterPopovers();
        });
    }, { passive: true });

    ['champion-modal', 'item-modal', 'detailModal', 'ability-video-modal'].forEach(modalId => {
        const modalEl = document.getElementById(modalId);
        if (modalEl) {
            modalEl.addEventListener('click', (e) => {
                if (e.target === modalEl) closeModal();
            });
        }
    });
}
