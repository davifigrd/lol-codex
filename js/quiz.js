/* LoL Codex — Quiz (standalone page). */
/* ==========================================================================
   QUIZ PAGE — category selection, difficulty selection, multiple-choice and
   reveal modes.
   Data source: ../data/quiz.json (categories → levels → questions).
   Images are resolved against the current Data Dragon version so item,
   map and champion art never go stale.
   ========================================================================== */
const QUIZ_DATA_URL = '../data/quiz.json?v=2';
const QUIZ_FALLBACK_VERSION = '16.20.1';

let quizCategories = [];
let quizLevels = [];
let quizCurrentVersion = QUIZ_FALLBACK_VERSION;
let quizState = null;

/* --------------------------------------------------------------------------
   HELPERS
   -------------------------------------------------------------------------- */
function escapeQuizHtml(value) {
    return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

async function loadQuizDataDragonVersion() {
    try {
        const res = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
        if (res.ok) {
            const versions = await res.json();
            if (Array.isArray(versions) && versions[0]) return versions[0];
        }
    } catch (err) {
        console.warn('[LoL Codex] Quiz: não foi possível sincronizar a versão do Data Dragon.', err);
    }
    return QUIZ_FALLBACK_VERSION;
}

async function loadQuizData() {
    try {
        const res = await fetch(QUIZ_DATA_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (err) {
        // Direct file:// opening blocks local JSON fetches (CORS). Fall back to
        // the generated data/quiz-fallback.js so the quiz still works offline.
        if (window.QUIZ_FALLBACK_DATA) {
            return window.QUIZ_FALLBACK_DATA;
        }
        throw err;
    }
}

// Builds the image URL for a quiz question (item, map or champion splash)
function resolveQuizImage(image) {
    if (!image || !image.type) return '';
    if (image.type === 'champion') {
        return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${encodeURIComponent(image.id)}_0.jpg`;
    }
    if (image.type === 'item') {
        return `https://ddragon.leagueoflegends.com/cdn/${quizCurrentVersion}/img/item/${encodeURIComponent(image.id)}.png`;
    }
    if (image.type === 'map') {
        return `https://ddragon.leagueoflegends.com/cdn/${quizCurrentVersion}/img/map/map${encodeURIComponent(image.id)}.png`;
    }
    if (image.type === 'url') {
        return image.url;
    }
    return '';
}

// Number of questions a category has for a given difficulty level.
function getQuizLevelQuestions(category, levelId) {
    if (!category || !category.levels) return [];
    return Array.isArray(category.levels[levelId]) ? category.levels[levelId] : [];
}

function getQuizCategoryTotal(category) {
    if (!category || !category.levels) return 0;
    return Object.keys(category.levels).reduce((sum, key) => sum + getQuizLevelQuestions(category, key).length, 0);
}

function setupQuizMobileNav() {
    const mobileBtn = document.getElementById('mobileToggleBtn');
    const navMenu = document.getElementById('navMenu');
    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', () => navMenu.classList.toggle('mobile-open'));
    }
}

/* --------------------------------------------------------------------------
   1. CATEGORY SELECTION
   -------------------------------------------------------------------------- */
function renderQuizCategoryScreen() {
    const app = document.getElementById('quiz-app');
    if (!app) return;
    quizState = null;

    if (!quizCategories.length) {
        app.innerHTML = `
            <div class="loading-box" style="color:#ef4444;">
                <i class="fa-solid fa-triangle-exclamation" style="font-size:2rem;"></i>
                <p>Não foi possível carregar as categorias do quiz.</p>
            </div>
        `;
        return;
    }

    app.innerHTML = `
        <div class="quiz-intro">
            <h2 class="quiz-intro-title">Escolha uma categoria</h2>
            <p class="quiz-intro-sub">Cada categoria tem perguntas de múltipla escolha e de revelação com explicação ao final.</p>
        </div>
        <div class="quiz-categories-grid">
            ${quizCategories.map((category) => {
                const total = getQuizCategoryTotal(category);
                return `
                    <button type="button" class="quiz-category-card"
                            onclick="renderQuizLevelScreen('${escapeQuizHtml(category.id)}')">
                        <span class="quiz-category-icon">
                            <i class="fa-solid ${escapeQuizHtml(category.icon || 'fa-circle-question')}"></i>
                        </span>
                        <span class="quiz-category-name">${escapeQuizHtml(category.name)}</span>
                        <span class="quiz-category-desc">${escapeQuizHtml(category.description || '')}</span>
                        <span class="quiz-category-meta">
                            <i class="fa-solid fa-list-check"></i> ${total} perguntas
                            <i class="fa-solid fa-arrow-right"></i>
                        </span>
                    </button>
                `;
            }).join('')}
        </div>
    `;
}

/* --------------------------------------------------------------------------
   2. DIFFICULTY SELECTION
   -------------------------------------------------------------------------- */
function renderQuizLevelScreen(categoryId) {
    const app = document.getElementById('quiz-app');
    if (!app) return;

    const category = quizCategories.find((c) => c.id === categoryId);
    if (!category) {
        renderQuizCategoryScreen();
        return;
    }

    quizState = { category };

    const levels = quizLevels.length
        ? quizLevels
        : [
            { id: 'facil', name: 'Fácil', icon: 'fa-feather' },
            { id: 'media', name: 'Média', icon: 'fa-bolt' },
            { id: 'dificil', name: 'Difícil', icon: 'fa-fire' }
        ];

    app.innerHTML = `
        <div class="quiz-shell">
            <div class="quiz-topbar">
                <button type="button" class="quiz-back-btn" onclick="renderQuizCategoryScreen()">
                    <i class="fa-solid fa-arrow-left"></i> Categorias
                </button>
                <div class="quiz-progress-info">
                    <strong>${escapeQuizHtml(category.name)}</strong>
                    <span>Escolha a dificuldade</span>
                </div>
                <div class="quiz-score" title="Categoria selecionada">
                    <i class="fa-solid ${escapeQuizHtml(category.icon || 'fa-circle-question')}"></i>
                </div>
            </div>

            <div class="quiz-intro">
                <h2 class="quiz-intro-title">Escolha a dificuldade</h2>
                <p class="quiz-intro-sub">A rodada começa somente depois que categoria e dificuldade estiverem escolhidas.</p>
            </div>

            <div class="quiz-levels-grid">
                ${levels.map((level) => {
                    const count = getQuizLevelQuestions(category, level.id).length;
                    const disabled = count === 0;
                    return `
                        <button type="button" class="quiz-level-card level-${escapeQuizHtml(level.id)}"
                                ${disabled ? 'disabled aria-disabled="true"' : ''}
                                onclick="startQuizCategory('${escapeQuizHtml(category.id)}', '${escapeQuizHtml(level.id)}')">
                            <span class="quiz-level-icon">
                                <i class="fa-solid ${escapeQuizHtml(level.icon || 'fa-star')}"></i>
                            </span>
                            <span class="quiz-level-name">${escapeQuizHtml(level.name)}</span>
                            <span class="quiz-level-meta">
                                <i class="fa-solid fa-list-check"></i> ${count} perguntas
                            </span>
                        </button>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

/* --------------------------------------------------------------------------
   3. QUESTION SCREEN
   -------------------------------------------------------------------------- */
function startQuizCategory(categoryId, levelId) {
    const category = quizCategories.find((c) => c.id === categoryId);
    if (!category) return;

    // Never starts before BOTH category and difficulty are selected.
    const questions = getQuizLevelQuestions(category, levelId);
    if (!questions.length) {
        renderQuizLevelScreen(categoryId);
        return;
    }

    const levelMeta = quizLevels.find((l) => l.id === levelId) || { id: levelId, name: levelId };

    quizState = {
        category,
        levelId,
        levelName: levelMeta.name,
        questions,
        index: 0,
        score: 0,
        answered: false,
        revealed: false
    };
    renderQuizQuestion();
}

function renderQuizQuestion() {
    const app = document.getElementById('quiz-app');
    if (!app || !quizState) return;

    const { category, questions, index, score } = quizState;
    const total = questions.length;
    const question = questions[index];
    const progressPercent = Math.round(((index + 1) / total) * 100);
    const isMultiple = question.type !== 'reveal';

    const imageUrl = resolveQuizImage(question.image);
    const imageTypeClass = question.image && question.image.type ? ` is-${question.image.type}` : '';
    const imageHtml = imageUrl
        ? `
            <div class="quiz-question-image-wrap${imageTypeClass}">
                <img src="${escapeQuizHtml(imageUrl)}" alt="Imagem da pergunta" class="quiz-question-image" loading="lazy"
                     onerror="this.closest('.quiz-question-image-wrap').style.display='none';">
            </div>
        `
        : '';

    const optionsHtml = isMultiple
        ? `
            <div class="quiz-options" id="quizOptions">
                ${(question.options || []).map((option, optionIndex) => `
                    <button type="button" class="quiz-option" data-index="${optionIndex}"
                            onclick="answerQuizMultiple(${optionIndex})">
                        <span class="quiz-option-letter">${String.fromCharCode(65 + optionIndex)}</span>
                        <span class="quiz-option-text">${escapeQuizHtml(option)}</span>
                    </button>
                `).join('')}
            </div>
        `
        : `
            <div class="quiz-reveal-box">
                <button type="button" class="quiz-reveal-btn" id="quizRevealBtn" onclick="revealQuizAnswer()">
                    <i class="fa-solid fa-eye"></i> Revelar Resposta
                </button>
                <div class="quiz-reveal-content" id="quizRevealContent" hidden></div>
            </div>
        `;

    app.innerHTML = `
        <div class="quiz-shell">
            <div class="quiz-topbar">
                <button type="button" class="quiz-back-btn" onclick="renderQuizLevelScreen('${escapeQuizHtml(category.id)}')">
                    <i class="fa-solid fa-arrow-left"></i> Dificuldade
                </button>
                <div class="quiz-progress-info">
                    <strong>${escapeQuizHtml(category.name)}</strong>
                    <span>${escapeQuizHtml(quizState.levelName)} · Pergunta ${index + 1} de ${total}</span>
                </div>
                <div class="quiz-score" title="Pontuação atual">
                    <i class="fa-solid fa-star"></i> <span id="quizScoreValue">${score}</span> pts
                </div>
            </div>

            <div class="quiz-progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${index + 1}">
                <span style="width:${progressPercent}%"></span>
            </div>

            <div class="quiz-card">
                <span class="quiz-question-type ${isMultiple ? '' : 'reveal-type'}">
                    <i class="fa-solid ${isMultiple ? 'fa-list-check' : 'fa-image'}"></i>
                    ${isMultiple ? 'Múltipla escolha' : 'Revelar resposta'}
                </span>
                <h2 class="quiz-question">${escapeQuizHtml(question.question)}</h2>
                ${imageHtml}
                ${optionsHtml}
                <div class="quiz-feedback" id="quizFeedback"></div>
                <div class="quiz-actions" id="quizActions"></div>
            </div>
        </div>
    `;

    quizState.answered = false;
    quizState.revealed = false;
}

/* --------------------------------------------------------------------------
   MULTIPLE CHOICE
   -------------------------------------------------------------------------- */
function answerQuizMultiple(selectedIndex) {
    if (!quizState || quizState.answered) return;

    const question = quizState.questions[quizState.index];
    const isCorrect = selectedIndex === question.correctIndex;
    quizState.answered = true;
    if (isCorrect) quizState.score += 1;

    const options = document.querySelectorAll('#quizOptions .quiz-option');
    options.forEach((button) => {
        const buttonIndex = Number(button.dataset.index);
        button.disabled = true;
        if (buttonIndex === question.correctIndex) button.classList.add('correct');
        if (buttonIndex === selectedIndex && !isCorrect) button.classList.add('wrong');
        if (buttonIndex === selectedIndex) button.classList.add('selected');
    });

    const scoreEl = document.getElementById('quizScoreValue');
    if (scoreEl) scoreEl.textContent = quizState.score;

    renderQuizFeedback(isCorrect, question.explanation);
    renderQuizNextAction();
}

/* --------------------------------------------------------------------------
   REVEAL MODE
   -------------------------------------------------------------------------- */
function revealQuizAnswer() {
    if (!quizState || quizState.revealed) return;
    quizState.revealed = true;

    const question = quizState.questions[quizState.index];
    const revealBtn = document.getElementById('quizRevealBtn');
    if (revealBtn) revealBtn.style.display = 'none';

    const content = document.getElementById('quizRevealContent');
    if (!content) return;
    content.hidden = false;
    content.innerHTML = `
        <div class="quiz-answer-box">
            <span class="quiz-answer-label"><i class="fa-solid fa-lightbulb"></i> Resposta</span>
            <strong class="quiz-answer-text">${escapeQuizHtml(question.answer)}</strong>
            <p class="quiz-answer-explanation">${escapeQuizHtml(question.explanation || '')}</p>
        </div>
        <div class="quiz-self-assess">
            <span class="quiz-self-assess-label">Você acertou?</span>
            <button type="button" class="quiz-assess-btn hit" onclick="registerQuizRevealResult(true)">
                <i class="fa-solid fa-check"></i> Acertei
            </button>
            <button type="button" class="quiz-assess-btn miss" onclick="registerQuizRevealResult(false)">
                <i class="fa-solid fa-xmark"></i> Errei
            </button>
        </div>
    `;
}

function registerQuizRevealResult(isCorrect) {
    if (!quizState || quizState.answered) return;
    quizState.answered = true;
    if (isCorrect) quizState.score += 1;

    const scoreEl = document.getElementById('quizScoreValue');
    if (scoreEl) scoreEl.textContent = quizState.score;

    const assessBox = document.querySelector('.quiz-self-assess');
    if (assessBox) {
        assessBox.innerHTML = `
            <span class="quiz-self-assess-label ${isCorrect ? 'is-hit' : 'is-miss'}">
                <i class="fa-solid ${isCorrect ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
                ${isCorrect ? 'Boa! Ponto registrado.' : 'Sem problema — a explicação acima ajuda na próxima.'}
            </span>
        `;
    }

    renderQuizNextAction();
}

/* --------------------------------------------------------------------------
   FEEDBACK + NEXT
   -------------------------------------------------------------------------- */
function renderQuizFeedback(isCorrect, explanation) {
    const feedback = document.getElementById('quizFeedback');
    if (!feedback) return;
    feedback.innerHTML = `
        <div class="quiz-feedback-box ${isCorrect ? 'is-correct' : 'is-wrong'}">
            <span class="quiz-feedback-title">
                <i class="fa-solid ${isCorrect ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
                ${isCorrect ? 'Resposta correta!' : 'Resposta incorreta'}
            </span>
            <p class="quiz-feedback-text">${escapeQuizHtml(explanation || '')}</p>
        </div>
    `;
}

function renderQuizNextAction() {
    const actions = document.getElementById('quizActions');
    if (!actions) return;
    const total = quizState.questions.length;
    const isLast = quizState.index >= total - 1;
    actions.innerHTML = `
        <button type="button" class="quiz-next-btn" onclick="nextQuizQuestion()">
            ${isLast ? 'Ver resultado' : 'Próxima pergunta'}
            <i class="fa-solid ${isLast ? 'fa-flag-checkered' : 'fa-arrow-right'}"></i>
        </button>
    `;
}

function nextQuizQuestion() {
    if (!quizState) return;
    quizState.index += 1;
    if (quizState.index >= quizState.questions.length) {
        renderQuizResults();
    } else {
        renderQuizQuestion();
    }
}

/* --------------------------------------------------------------------------
   RESULTS
   -------------------------------------------------------------------------- */
function renderQuizResults() {
    const app = document.getElementById('quiz-app');
    if (!app || !quizState) return;

    const total = quizState.questions.length;
    const score = quizState.score;
    const percent = Math.round((score / total) * 100);

    let title = 'Continue treinando!';
    let message = 'Reveja as explicações e tente novamente — cada rodada ensina algo novo.';
    let icon = 'fa-seedling';
    if (percent === 100) {
        title = 'Perfeito! Desafiante Hextech!';
        message = 'Você acertou tudo. Seu conhecimento do Rift está no nível dos melhores.';
        icon = 'fa-crown';
    } else if (percent >= 70) {
        title = 'Muito bem!';
        message = 'Excelente desempenho. Ajuste os detalhes e você chega ao 100%.';
        icon = 'fa-medal';
    } else if (percent >= 40) {
        title = 'Bom começo!';
        message = 'Você já domina parte do conteúdo. Releia as explicações e tente de novo.';
        icon = 'fa-star';
    }

    const categoryId = escapeQuizHtml(quizState.category.id);
    const levelId = escapeQuizHtml(quizState.levelId);

    app.innerHTML = `
        <div class="quiz-results">
            <div class="quiz-results-icon">
                <i class="fa-solid ${icon}"></i>
            </div>
            <h2 class="quiz-results-title">${title}</h2>
            <p class="quiz-results-category">Categoria: <strong>${escapeQuizHtml(quizState.category.name)}</strong> · Dificuldade: <strong>${escapeQuizHtml(quizState.levelName)}</strong></p>

            <div class="quiz-results-score">
                <span class="quiz-results-value">${score}<small>/${total}</small></span>
                <span class="quiz-results-percent">${percent}% de acerto</span>
            </div>

            <p class="quiz-results-message">${message}</p>

            <div class="quiz-results-actions">
                <button type="button" class="quiz-next-btn" onclick="startQuizCategory('${categoryId}', '${levelId}')">
                    <i class="fa-solid fa-rotate-right"></i> Jogar novamente
                </button>
                <button type="button" class="quiz-back-btn" onclick="renderQuizLevelScreen('${categoryId}')">
                    <i class="fa-solid fa-gauge-high"></i> Outra dificuldade
                </button>
                <button type="button" class="quiz-back-btn" onclick="renderQuizCategoryScreen()">
                    <i class="fa-solid fa-layer-group"></i> Outra categoria
                </button>
            </div>
        </div>
    `;
}

/* ==========================================================================
   NAVBAR GLOBAL SEARCH (quiz page)
   Lightweight, lazy-loaded version of the index.html search: it only fetches
   the Data Dragon lists on the first keystroke, then redirects to index.html
   with an ?open=champion:id|item:id|rune:id deep link.
   ========================================================================== */
let quizSearchCache = { champions: null, items: null, runes: null };
let quizSearchActiveIdx = -1;
let quizSearchLoading = false;

function normalizeQuizSearchText(value) {
    return String(value == null ? '' : value)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function syncQuizSearchClearBtn(value) {
    const clearBtn = document.getElementById('clearHeaderSearchBtn');
    if (clearBtn) clearBtn.style.display = value && value.length > 0 ? 'flex' : 'none';
}

function clearGlobalSearch() {
    const input = document.getElementById('headerGlobalSearch');
    if (input) {
        input.value = '';
        syncQuizSearchClearBtn('');
        input.focus();
    }
    hideQuizSearchSuggestions();
}

function hideQuizSearchSuggestions() {
    const box = document.getElementById('globalSuggestions');
    if (box) {
        box.classList.remove('show');
        box.innerHTML = '';
    }
    quizSearchActiveIdx = -1;
}

async function ensureQuizSearchData() {
    if (quizSearchCache.champions && quizSearchCache.items && quizSearchCache.runes) return;
    if (quizSearchLoading) return;
    quizSearchLoading = true;
    const base = `https://ddragon.leagueoflegends.com/cdn/${quizCurrentVersion}/data/pt_BR`;
    const [champions, items, runes] = await Promise.all([
        quizSearchCache.champions ? Promise.resolve(quizSearchCache.champions) : fetch(`${base}/champion.json`).then(r => r.json()).catch(() => null),
        quizSearchCache.items ? Promise.resolve(quizSearchCache.items) : fetch(`${base}/item.json`).then(r => r.json()).catch(() => null),
        quizSearchCache.runes ? Promise.resolve(quizSearchCache.runes) : fetch(`${base}/runesReforged.json`).then(r => r.json()).catch(() => null)
    ]);
    if (champions && champions.data) quizSearchCache.champions = Object.values(champions.data);
    if (items && items.data) quizSearchCache.items = Object.values(items.data).filter(i => i.maps && i.maps['11'] === true && i.gold && i.gold.total > 0);
    if (Array.isArray(runes)) quizSearchCache.runes = runes;
    quizSearchLoading = false;
}

function handleQuizSearchInput(event) {
    const query = event.target.value;
    syncQuizSearchClearBtn(query);
    renderQuizSearchSuggestions(query);
}

function renderQuizSearchSuggestions(query) {
    const box = document.getElementById('globalSuggestions');
    if (!box) return;
    const q = normalizeQuizSearchText(query);
    if (q.length < 2) {
        hideQuizSearchSuggestions();
        return;
    }

    const score = (name) => {
        const n = normalizeQuizSearchText(name);
        if (n.startsWith(q)) return 0;
        if (n.includes(q)) return 1;
        return 9;
    };

    const champList = (quizSearchCache.champions || [])
        .map(c => ({ type: 'Campeão', name: c.name, score: score(c.name), icon: `https://ddragon.leagueoflegends.com/cdn/${quizCurrentVersion}/img/champion/${c.id}.png`, href: `index.html?open=champion:${encodeURIComponent(c.id)}` }))
        .filter(r => r.score < 9);
    const itemList = (quizSearchCache.items || [])
        .map(i => ({ type: 'Item', name: i.name, score: score(i.name), icon: `https://ddragon.leagueoflegends.com/cdn/${quizCurrentVersion}/img/item/${i.image ? i.image.full : ''}`, href: `index.html?open=item:${encodeURIComponent(i.id)}` }))
        .filter(r => r.score < 9);
    const runeList = [];
    (quizSearchCache.runes || []).forEach(tree => {
        (tree.slots || []).forEach(slot => (slot.runes || []).forEach(r => {
            const s = score(r.name);
            if (s < 9) runeList.push({ type: 'Runa', name: r.name, score: s, icon: `https://ddragon.leagueoflegends.com/cdn/img/${r.icon}`, href: `index.html?open=rune:${encodeURIComponent(r.id)}` });
        }));
    });

    const all = [...champList, ...itemList, ...runeList]
        .sort((a, b) => a.score - b.score || a.name.length - b.name.length || a.name.localeCompare(b.name, 'pt-BR'));
    const seen = new Set();
    const uniq = [];
    for (const entry of all) {
        const key = entry.type + ':' + entry.name;
        if (seen.has(key)) continue;
        seen.add(key);
        uniq.push(entry);
        if (uniq.length >= 10) break;
    }

    if (!uniq.length) {
        box.innerHTML = `<div class="global-sugg-empty">Nenhum resultado para “${escapeQuizHtml(query)}”</div>`;
        box.classList.add('show');
        quizSearchActiveIdx = -1;
        return;
    }

    box.innerHTML = uniq.map((r, idx) => `
        <div class="global-sugg-item ${idx === 0 ? 'active' : ''}" role="option" data-idx="${idx}">
            <img src="${escapeQuizHtml(r.icon)}" class="sugg-icon" alt="" loading="lazy" onerror="this.style.display='none'">
            <div class="sugg-text">
                <span class="sugg-name">${escapeQuizHtml(r.name)}</span>
                <span class="sugg-type">${escapeQuizHtml(r.type)}</span>
            </div>
        </div>
    `).join('');
    box.classList.add('show');
    quizSearchActiveIdx = 0;

    box.querySelectorAll('.global-sugg-item').forEach((el) => {
        el.addEventListener('mousedown', (ev) => {
            ev.preventDefault();
            const idx = Number(el.getAttribute('data-idx'));
            const target = uniq[idx];
            if (target) window.location.href = target.href;
        });
    });
}

function handleQuizSearchKeydown(event) {
    const box = document.getElementById('globalSuggestions');
    const items = box ? Array.from(box.querySelectorAll('.global-sugg-item')) : [];
    if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (!items.length) return;
        quizSearchActiveIdx = (quizSearchActiveIdx + 1) % items.length;
        items.forEach((el, i) => el.classList.toggle('active', i === quizSearchActiveIdx));
        items[quizSearchActiveIdx].scrollIntoView({ block: 'nearest' });
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (!items.length) return;
        quizSearchActiveIdx = (quizSearchActiveIdx - 1 + items.length) % items.length;
        items.forEach((el, i) => el.classList.toggle('active', i === quizSearchActiveIdx));
        items[quizSearchActiveIdx].scrollIntoView({ block: 'nearest' });
    } else if (event.key === 'Enter') {
        event.preventDefault();
        const chosen = items[quizSearchActiveIdx] || items[0];
        if (chosen) chosen.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
    } else if (event.key === 'Escape') {
        hideQuizSearchSuggestions();
    }
}

function setupQuizGlobalSearch() {
    const input = document.getElementById('headerGlobalSearch');
    if (!input) return;
    // Warm up the Data Dragon lists on first focus (keeps typing responsive).
    input.addEventListener('focus', () => { ensureQuizSearchData(); }, { once: true });
}

/* --------------------------------------------------------------------------
   BOOTSTRAP
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', async () => {
    setupQuizMobileNav();
    setupQuizGlobalSearch();
    if (typeof setupFeedbackWidget === 'function') setupFeedbackWidget();

    const app = document.getElementById('quiz-app');
    try {
        const [version, data] = await Promise.all([loadQuizDataDragonVersion(), loadQuizData()]);
        quizCurrentVersion = version;
        quizCategories = Array.isArray(data && data.categories) ? data.categories : [];
        quizLevels = Array.isArray(data && data.levels) ? data.levels : [];
        renderQuizCategoryScreen();
    } catch (err) {
        console.error('[LoL Codex] Erro ao carregar o quiz:', err);
        if (app) {
            app.innerHTML = `
                <div class="loading-box" style="color:#ef4444;">
                    <i class="fa-solid fa-triangle-exclamation" style="font-size:2rem;"></i>
                    <p>Não foi possível carregar o quiz no momento.</p>
                </div>
            `;
        }
    }
});
