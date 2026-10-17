/* LoL Codex — Global search with real-time suggestions (champions, items and runes). */
function handleGlobalSearchInput(event) {
    const query = event.target.value;
    renderGlobalSuggestions(query, event.target.id);
}

function handleGlobalSearchKeydown(event) {
    const input = event.target;
    const suggBox = getSuggestionBoxFor(input.id);
    const items = suggBox ? Array.from(suggBox.querySelectorAll('.global-sugg-item')) : [];
    const currentEntry = typeof activeIdx[input.id] === 'number' ? activeIdx[input.id] : -1;

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (!items.length) return;
        setActiveSuggestion(suggBox, items, input.id, (currentEntry + 1) % items.length);
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (!items.length) return;
        setActiveSuggestion(suggBox, items, input.id, (currentEntry - 1 + items.length) % items.length);
    } else if (event.key === 'Enter') {
        event.preventDefault();
        if (items.length === 0) {
            // No visible suggestion: open the best result directly
            handleGlobalSearchEnter(input.value);
            return;
        }
        // Goes to the selected result (or the first one in the list)
        const chosenEntry = items[currentEntry] || items[0];
        if (chosenEntry) chosenEntry.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
    } else if (event.key === 'Escape') {
        hideSuggestions(input.id, suggBox);
    }
}

function setActiveSuggestion(suggBox, items, inputId, idx) {
    items.forEach((el) => el.classList.remove('active'));
    const targetElement = items[idx];
    if (!targetElement) return;
    targetElement.classList.add('active');
    targetElement.scrollIntoView({ block: 'nearest' });
    activeIdx[inputId] = idx;
}

let activeIdx = {};
function getSuggestionBoxFor(id) {
    return document.getElementById('globalSuggestions');
}

function renderGlobalSuggestions(query, inputId) {
    const q = normalizeSearchText(query);
    const suggBox = getSuggestionBoxFor(inputId);
    if (!suggBox) return;
    if (q.length < 1) {
        hideSuggestions(inputId, suggBox);
        return;
    }

    // Scoring: 0 = starts with the term, 1 = contains the term, 9 = no match
    const scoringFn = (labelName) => {
        const n = normalizeSearchText(labelName);
        if (n.startsWith(q)) return 0;
        if (n.includes(q)) return 1;
        return 9;
    };
    const sortEntries = (arr) =>
        arr
            .filter((r) => r && r.score < 9)
            .sort((a, b) => a.score - b.score || a.name.length - b.name.length || a.name.localeCompare(b.name, 'pt-BR'));

    // --- Champions ---
    const champs = sortEntries(
        allChampions.map((c) => {
            const score = Math.min(scoringFn(c.name), scoringFn(c.id));
            if (score >= 9) return null;
            return {
                type: 'Campeão',
                name: c.name,
                score,
                icon: `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/champion/${c.id}.png`,
                action: () => openChampionModal(c.id),
            };
        })
    );

    // --- Items ---
    const itemsData = sortEntries(
        validSRItems.map((i) => {
            const score = scoringFn(i.name);
            if (score >= 9) return null;
            const img = i.image ? i.image.full : '';
            return {
                type: 'Item',
                name: i.name,
                score,
                icon: `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/item/${img}`,
                action: () => openItemModal(i.id),
            };
        })
    );

    // --- Runes (categories + individual runes) ---
    const runeEntries = [];
    if (Array.isArray(allRunes)) {
        allRunes.forEach((tree) => {
            const scoreTree = scoringFn(tree.name);
            if (scoreTree < 9) {
                runeEntries.push({
                    type: 'Categoria de runa',
                    name: tree.name,
                    score: scoreTree,
                    icon: `../img/runes/${tree.id}.png`,
                    action: () => {
                        switchTab('runes');
                        if (typeof selectRuneTree === 'function') {
                            selectRuneTree(tree.id);
                        }
                    },
                });
            }
            (tree.slots || []).forEach((slot) =>
                (slot.runes || []).forEach((r) => {
                    const score = scoringFn(r.name);
                    if (score < 9) {
                        runeEntries.push({
                            type: 'Runa',
                            name: r.name,
                            score,
                            icon: `https://ddragon.leagueoflegends.com/cdn/img/${r.icon}`,
                            action: () => {
                                switchTab('runes');
                                if (typeof selectRuneTree === 'function') {
                                    selectRuneTree(tree.id, r.id);
                                }
                            },
                        });
                    }
                })
            );
        });
        runeEntries.sort((a, b) => a.score - b.score || a.name.length - b.name.length || a.name.localeCompare(b.name, 'pt-BR'));
    }

    // Interleaves categories to guarantee result diversity
    const queueRows = [champs, itemsData, runeEntries].filter((f) => f.length);
    const uniq = [];
    const seenEntries = new Set();
    let roundCount = 0;
    while (queueRows.some((f) => f.length) && uniq.length < 10 && roundCount < 60) {
        for (const queueRow of queueRows) {
            while (queueRow.length) {
                const r = queueRow.shift();
                const key = r.type + ':' + r.name;
                if (seenEntries.has(key)) continue;
                seenEntries.add(key);
                uniq.push(r);
                break;
            }
            if (uniq.length >= 10) break;
        }
        roundCount++;
    }

    if (uniq.length === 0) {
        suggBox.innerHTML = `<div class="global-sugg-empty">Nenhum resultado para “${escapeHtmlSearch(query)}”</div>`;
        suggBox.classList.add('show');
        activeIdx[inputId] = -1;
        return;
    }

    suggBox.innerHTML = uniq
        .map(
            (r, idx) => `
        <div class="global-sugg-item" role="option" data-idx="${idx}">
            <img src="${r.icon}" class="sugg-icon" alt="" loading="lazy" onerror="this.style.display='none'">
            <div class="sugg-text">
                <span class="sugg-name">${highlightSearch(r.name, q)}</span>
                <span class="sugg-type">${r.type}</span>
            </div>
        </div>
    `
        )
        .join('');

    suggBox.querySelectorAll('.global-sugg-item').forEach((el) => {
        // mousedown: prevents the input from losing focus before the click is processed
        el.addEventListener('mousedown', (ev) => {
            ev.preventDefault();
            const idx = Number(el.getAttribute('data-idx'));
            const targetElement = uniq[idx];
            if (!targetElement) return;
            const inp = document.getElementById(inputId);
            if (inp) inp.value = targetElement.name;
            hideSuggestions(inputId, suggBox);
            targetElement.action();
        });
    });

    suggBox.classList.add('show');
    activeIdx[inputId] = 0;
    const firstEntry = suggBox.querySelector('.global-sugg-item');
    if (firstEntry) firstEntry.classList.add('active');
}

// Highlights the searched fragment inside the name (raw search, accent tolerant)
function highlightSearch(labelName, q) {
    const i = labelName.toLowerCase().indexOf(q);
    if (i < 0) return escapeHtmlSearch(labelName);
    return (
        escapeHtmlSearch(labelName.slice(0, i)) +
        '<mark>' +
        escapeHtmlSearch(labelName.slice(i, i + q.length)) +
        '</mark>' +
        escapeHtmlSearch(labelName.slice(i + q.length))
    );
}

function escapeHtmlSearch(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function hideSuggestions(inputId, suggBox) {
    if (suggBox) {
        suggBox.classList.remove('show');
        suggBox.innerHTML = '';
    }
    activeIdx[inputId] = -1;
}

function handleGlobalSearchEnter(query) {
    const q = normalizeSearchText(query);
    if (!q) return;
    const champ = allChampions.find(c => normalizeSearchText(c.name).includes(q));
    if (champ) { openChampionModal(champ.id); return; }
    const item = validSRItems.find(i => normalizeSearchText(i.name) === q || normalizeSearchText(i.name).includes(q));
    if (item) { openItemModal(item.id); return; }
    switchTab('champions');
    const ci = document.getElementById('champSearch');
    if (ci) { ci.value = query; filterChampions(); }
}
