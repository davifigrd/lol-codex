/* LoL Codex — Champions: loading, list, cards and A-Z alphabetical index. */
/* ==========================================================================
   2. CHAMPIONS VIA DATA DRAGON
   ========================================================================== */
async function loadChampionsFromDataDragon() {
    const grid = document.getElementById('champions-grid');
    try {
        const url = `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/data/${currentLanguage}/champion.json`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);

        const data = await res.json();
        allChampions = Object.values(data.data).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

        const counter = document.getElementById('countChamps');
        if (counter) counter.textContent = `${allChampions.length} Campeões`;

        renderChampions(allChampions);
    } catch (errObj) {
        console.error('[LoL Codex] Erro ao carregar campeões:', errObj);
        if (grid) {
            grid.innerHTML = `
                <div class="loading-box" style="color:#ef4444;">
                    <i class="fa-solid fa-triangle-exclamation" style="font-size:2rem;"></i>
                    <p>Não foi possível carregar os campeões da API no momento.</p>
                </div>
            `;
        }
    }
}

function identifyChampionPrimaryRole(champ) {
    const tags = champ.tags || [];
    // Classic mapping of class to typical lane
    if (tags.includes('Marksman')) return 'ADC';
    if (tags.includes('Support')) return 'Suporte';
    if (tags.includes('Mage')) return 'Mid';
    if (tags.includes('Assassin')) return 'Mid';
    if (tags.includes('Fighter')) return 'Top';
    if (tags.includes('Tank')) return 'Top';
    return 'Mid';
}

function renderChampions(itemList) {
    const mainGrid = document.getElementById('champions-grid');
    const featuredGrid = document.getElementById('featuredChampGrid');

    if (mainGrid) {
        if (itemList.length === 0) {
            mainGrid.innerHTML = `
                <div class="loading-box">
                    <i class="fa-solid fa-ghost" style="font-size:2rem; color:var(--gold-primary);"></i>
                    <p>Nenhum campeão encontrado para o filtro selecionado.</p>
                </div>
            `;
        } else {
            mainGrid.innerHTML = itemList.map(c => buildChampionCardHTML(c)).join('');
        }
    }

    if (featuredGrid && allChampions.length > 0) {
        featuredGrid.innerHTML = allChampions.slice(0, 4).map(c => buildChampionCardHTML(c)).join('');
    }

    // Updates the balloon after rendering
    try { window.dispatchEvent(new Event('scroll')); } catch (e) {}
}

function buildChampionCardHTML(champ) {
    const splashUrl = getChampionSplashUrl(champ.id);
    const roleKeys = getChampionRoles(champ);
    const rolesHtml = roleKeys.map(r => {
        const url = ROLE_ICONS[r] || ROLE_ICONS.Mid;
        return `<img src="${url}" alt="${r}" title="${r}">`;
    }).join('');
    const rolesTitle = `Rota${roleKeys.length > 1 ? 's' : ''}: ${roleKeys.join(', ')}`;
    const iconUrl = `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/champion/${champ.id}.png`;
    const damageBadges = buildChampionDamageBadges(champ.id);
    const classKeys = getChampionClasses(champ.id, champ.tags);
    const initialLetter = getAlphabeticalLetter(champ.name);

    const tagsHtml = classKeys.map(t => {
        const cls = CLASS_ICONS[t];
        if (cls) {
            return `<span class="tag tag-icon-class" title="${cls.label}"><img src="${cls.url}" alt="${cls.label}" class="tag-class-icon"></span>`;
        }
        return `<span class="tag">${translateTag(t)}</span>`;
    }).join('');

    return `
        <div class="champ-card" data-letter="${initialLetter}" onclick="openChampionModal('${champ.id}')" onmouseenter="applyCardHoverColor(this, '${iconUrl}')">
            <div class="champ-banner" style="background-image: url('${splashUrl}');"></div>
            <!-- Official lane symbols for every lane this champion plays in -->
            <div class="champ-badge-lane${roleKeys.length > 1 ? ' multi-lane' : ''}" title="${rolesTitle}">
                ${rolesHtml}
            </div>
            <div class="champ-info">
                <!-- Name and class icons share one row: class sits to the right of the name -->
                <div class="champ-title-row">
                    <h3 class="champ-name">${champ.name}</h3>
                    <div class="champ-tags">${tagsHtml}</div>
                </div>
                <div class="champ-footer">
                    ${damageBadges}
                </div>
            </div>
        </div>
    `;
}

/* ==========================================================================
   PHONE-BOOK STYLE ALPHABETICAL INDEX (A-Z balloon while scrolling)
   ========================================================================== */
// Extracts the initial alphabetical letter of a name (e.g. "Cho'Gath" -> "C", "Kai'Sa" -> "K")
function getAlphabeticalLetter(labelName) {
    if (!labelName) return '#';
    const m = normalizeSearchText(labelName).match(/[a-z]/i);
    return m ? m[0].toUpperCase() : '#';
}

// Creates and sets up the floating balloon that shows the current list section letter (A-Z)
function setupAlphabeticalIndex() {
    const grid = document.getElementById('champions-grid');
    if (!grid) return;

    const balloonEl = document.createElement('div');
    balloonEl.className = 'alphabet-balloon';
    balloonEl.setAttribute('aria-hidden', 'true');
    balloonEl.textContent = 'A';
    document.body.appendChild(balloonEl);

    let lastLetter = null;
    let hideTimer = null;
    let lastScrollPosition = window.scrollY || window.pageYOffset || 0;
    // Time window in which the balloon stays suppressed (avoids showing on tab changes)
    let suppressUntil = 0;

    // Only active on the champions tab
    function isChampionsTabActive() {
        const activeTabName = document.querySelector('.page-section.active');
        return !!activeTabName && activeTabName.id === 'champions';
    }

    // Sticks the balloon to the scrollbar — follows the scroll position
    function positionOnScrollbar() {
        const balloonHeight = balloonEl.offsetHeight || 38;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progressValue = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
        const topOffset = 12 + progressValue * Math.max(0, window.innerHeight - balloonHeight - 24);
        balloonEl.style.top = topOffset + 'px';
    }

    function hideAlphabetBalloon() {
        balloonEl.classList.remove('visible');
    }

    // Shows the current section letter and repositions next to the scrollbar
    function updateAlphabetBalloon() {
        if (!isChampionsTabActive()) {
            hideAlphabetBalloon();
            lastLetter = null;
            return;
        }

        // First visible card from the top of the usable area
        const cards = grid.querySelectorAll('.champ-card[data-letter]');
        if (!cards.length) return;

        const topLimit = 100;
        let currentLetter = null;
        for (const card of cards) {
            if (card.getBoundingClientRect().bottom > topLimit) {
                currentLetter = card.getAttribute('data-letter');
                break;
            }
        }
        if (!currentLetter) return;

        if (currentLetter !== lastLetter) {
            lastLetter = currentLetter;
            balloonEl.textContent = currentLetter;
        }

        positionOnScrollbar();
        balloonEl.classList.add('visible');
        clearTimeout(hideTimer);
        hideTimer = setTimeout(hideAlphabetBalloon, 900);
    }

    // Repositions without forcing display (used when the list changes)
    function repositionIfVisible() {
        if (!balloonEl.classList.contains('visible')) return;
        if (!isChampionsTabActive()) {
            hideAlphabetBalloon();
            return;
        }
        positionOnScrollbar();
    }

    // Throttled via requestAnimationFrame to avoid overloading the scroll.
    // The balloon appears when the user scrolls UP or DOWN, but never
    // when entering the page nor on programmatic scrolls (tab/filter switch).
    let rafScheduled = false;
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        const positionChanged = y !== lastScrollPosition;
        lastScrollPosition = y;

        // Ignores synthetic scroll (same position) and programmatic tab-switch scrolling
        if (!positionChanged || Date.now() < suppressUntil) return;

        if (rafScheduled) return;
        rafScheduled = true;
        requestAnimationFrame(() => {
            rafScheduled = false;
            updateAlphabetBalloon();
        });
    }, { passive: true });

    window.addEventListener('resize', repositionIfVisible);

    // Suppresses the balloon for a moment after a tab switch (programmatic smooth scroll)
    function suppressBalloonTemporarily() {
        suppressUntil = Date.now() + 900;
        lastScrollPosition = window.scrollY;
        clearTimeout(hideTimer);
        hideAlphabetBalloon();
    }

    window.addEventListener('hashchange', suppressBalloonTemporarily);

    // Repositions when the active tab changes programmatically (and suppresses the display)
    const observer = new MutationObserver(() => {
        suppressBalloonTemporarily();
        setTimeout(repositionIfVisible, 60);
    });
    document.querySelectorAll('.page-section').forEach((sec) => {
        observer.observe(sec, { attributes: true, attributeFilter: ['class'] });
    });

    // Repositions when the cards change (filters/search)
    const observerCards = new MutationObserver(() => setTimeout(repositionIfVisible, 60));
    observerCards.observe(grid, { childList: true, subtree: true });
}
