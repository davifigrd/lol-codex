/* LoL Codex — Quiz Hextech (standalone page). */
/* ==========================================================================
   QUIZ PAGE — category selection, multiple-choice and reveal modes.
   Data source: ../data/quiz.json (categories → questions).
   Images are resolved against the current Data Dragon version so item,
   map and champion art never go stale.
   ========================================================================== */
const QUIZ_DATA_URL = '../data/quiz.json?v=1';
const QUIZ_FALLBACK_VERSION = '16.20.1';

let quizCategories = [];
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
            console.warn('[LoL Codex] Quiz: usando fallback local (file://).', err.message);
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

function setupQuizMobileNav() {
    const mobileBtn = document.getElementById('mobileToggleBtn');
    const navMenu = document.getElementById('navMenu');
    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', () => navMenu.classList.toggle('mobile-open'));
    }
}

/* --------------------------------------------------------------------------
   CATEGORY SELECTION
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
                const total = (category.questions || []).length;
                return `
                    <button type="button" class="quiz-category-card"
                            onclick="startQuizCategory('${escapeQuizHtml(category.id)}')">
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

function startQuizCategory(categoryId) {
    const category = quizCategories.find((c) => c.id === categoryId);
    if (!category || !Array.isArray(category.questions) || category.questions.length === 0) return;

    quizState = {
        category,
        index: 0,
        score: 0,
        answered: false,
        revealed: false
    };
    renderQuizQuestion();
}

/* --------------------------------------------------------------------------
   QUESTION SCREEN
   -------------------------------------------------------------------------- */
function renderQuizQuestion() {
    const app = document.getElementById('quiz-app');
    if (!app || !quizState) return;

    const { category, index, score } = quizState;
    const total = category.questions.length;
    const question = category.questions[index];
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
                <button type="button" class="quiz-back-btn" onclick="renderQuizCategoryScreen()">
                    <i class="fa-solid fa-arrow-left"></i> Categorias
                </button>
                <div class="quiz-progress-info">
                    <strong>${escapeQuizHtml(category.name)}</strong>
                    <span>Pergunta ${index + 1} de ${total}</span>
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

    const question = quizState.category.questions[quizState.index];
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

    const question = quizState.category.questions[quizState.index];
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
    const total = quizState.category.questions.length;
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
    if (quizState.index >= quizState.category.questions.length) {
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

    const total = quizState.category.questions.length;
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

    app.innerHTML = `
        <div class="quiz-results">
            <div class="quiz-results-icon">
                <i class="fa-solid ${icon}"></i>
            </div>
            <h2 class="quiz-results-title">${title}</h2>
            <p class="quiz-results-category">Categoria: <strong>${escapeQuizHtml(quizState.category.name)}</strong></p>

            <div class="quiz-results-score">
                <span class="quiz-results-value">${score}<small>/${total}</small></span>
                <span class="quiz-results-percent">${percent}% de acerto</span>
            </div>

            <p class="quiz-results-message">${message}</p>

            <div class="quiz-results-actions">
                <button type="button" class="quiz-next-btn" onclick="startQuizCategory('${escapeQuizHtml(quizState.category.id)}')">
                    <i class="fa-solid fa-rotate-right"></i> Jogar novamente
                </button>
                <button type="button" class="quiz-back-btn" onclick="renderQuizCategoryScreen()">
                    <i class="fa-solid fa-layer-group"></i> Escolher outra categoria
                </button>
            </div>
        </div>
    `;
}

/* --------------------------------------------------------------------------
   BOOTSTRAP
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', async () => {
    setupQuizMobileNav();
    if (typeof setupFeedbackWidget === 'function') setupFeedbackWidget();

    const app = document.getElementById('quiz-app');
    try {
        const [version, data] = await Promise.all([loadQuizDataDragonVersion(), loadQuizData()]);
        quizCurrentVersion = version;
        quizCategories = Array.isArray(data && data.categories) ? data.categories : [];
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
