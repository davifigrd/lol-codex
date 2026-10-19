/* LoL Codex — Discreet footer feedback widget (support / contact form). */
/* ==========================================================================
   FEEDBACK WIDGET
   Small Hextech-styled window opened by the discreet icon at the bottom
   right of the footer. Validates the fields and applies an internal
   anti-spam limit of 3 messages per day (stored in localStorage, never
   shown to the user). The destination e-mail is intentionally NOT present
   anywhere in the code: fill FEEDBACK_ENDPOINT with a Formspree/EmailJS
   URL when deploying. While it is empty, the submission is simulated
   (resolved as a success) so the flow can be tested locally.
   ========================================================================== */
const FEEDBACK_ENDPOINT = ''; // e.g. 'https://formspree.io/f/xxxxxxxx'

const FEEDBACK_STORAGE_KEY = 'lol_codex_feedback_envios';
const FEEDBACK_MAX_SENDS_PER_DAY = 3;
const FEEDBACK_DAY_MS = 24 * 60 * 60 * 1000;
const FEEDBACK_TEXTAREA_MIN_HEIGHT = 88;

// ---------- Message field auto-grow ----------
// The textarea cannot be resized by the user (resize: none). It grows on its
// own as the text is typed, stepping up in whole content "blocks" (two text
// lines each) instead of growing strictly line-by-line.
function autoGrowFeedbackMessage() {
    const field = document.getElementById('feedbackMessage');
    if (!field) return;

    field.style.height = 'auto';
    const styles = window.getComputedStyle(field);
    const lineHeight = parseFloat(styles.lineHeight) || 20;
    const padding = (parseFloat(styles.paddingTop) || 0) + (parseFloat(styles.paddingBottom) || 0);
    const borders = (parseFloat(styles.borderTopWidth) || 0) + (parseFloat(styles.borderBottomWidth) || 0);

    const block = lineHeight * 2;
    const contentHeight = Math.max(field.scrollHeight - padding, lineHeight * 2);
    const blocks = Math.max(2, Math.ceil(contentHeight / block));
    const target = padding + borders + blocks * block;

    field.style.height = `${Math.max(FEEDBACK_TEXTAREA_MIN_HEIGHT, target)}px`;
}

// ---------- Anti-spam (internal only, max 3 sends/day) ----------
function readFeedbackSends() {
    try {
        const raw = localStorage.getItem(FEEDBACK_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        return [];
    }
}

function feedbackSendsLeftToday() {
    const now = Date.now();
    const recent = readFeedbackSends().filter((ts) => now - ts < FEEDBACK_DAY_MS);
    return Math.max(0, FEEDBACK_MAX_SENDS_PER_DAY - recent.length);
}

function registerFeedbackSend() {
    try {
        const now = Date.now();
        const recent = readFeedbackSends().filter((ts) => now - ts < FEEDBACK_DAY_MS);
        recent.push(now);
        localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(recent));
    } catch (e) {
        // localStorage unavailable: limit simply does not persist
    }
}

// ---------- Widget open / close ----------
function isFeedbackWidgetOpen() {
    const widget = document.getElementById('feedbackWidget');
    return !!(widget && widget.classList.contains('open'));
}

function openFeedbackWidget() {
    const widget = document.getElementById('feedbackWidget');
    if (!widget) return;
    widget.classList.add('open');
    widget.setAttribute('aria-hidden', 'false');
    const openBtn = document.getElementById('feedbackOpenBtn');
    if (openBtn) openBtn.classList.add('active');
    // Recalculate the message field height for the now-visible widget
    autoGrowFeedbackMessage();
    // Small delay so the focus lands after the opening animation
    setTimeout(() => {
        const nameField = document.getElementById('feedbackName');
        if (nameField) nameField.focus();
    }, 180);
}

function closeFeedbackWidget() {
    const widget = document.getElementById('feedbackWidget');
    if (!widget) return;
    widget.classList.remove('open');
    widget.setAttribute('aria-hidden', 'true');
    const openBtn = document.getElementById('feedbackOpenBtn');
    if (openBtn) openBtn.classList.remove('active');
    clearFeedbackErrors();
}

function toggleFeedbackWidget() {
    if (isFeedbackWidgetOpen()) closeFeedbackWidget();
    else openFeedbackWidget();
}

// ---------- Validation helpers ----------
function clearFeedbackErrors() {
    ['feedbackName', 'feedbackEmail', 'feedbackMessage'].forEach((id) => {
        const field = document.getElementById(id);
        if (field) field.classList.remove('invalid');
        const error = document.getElementById(`${id}Error`);
        if (error) error.textContent = '';
    });
}

function setFeedbackFieldError(id, message) {
    const field = document.getElementById(id);
    if (field) field.classList.add('invalid');
    const error = document.getElementById(`${id}Error`);
    if (error) error.textContent = message;
}

// Basic e-mail format check (regex based on the RFC-lite pattern)
function isValidEmailFormat(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

/**
 * Validates all fields. Returns { valid, values } — on failure the
 * inline messages are already written below each field.
 */
function validateFeedbackForm() {
    clearFeedbackErrors();

    const nameField = document.getElementById('feedbackName');
    const emailField = document.getElementById('feedbackEmail');
    const messageField = document.getElementById('feedbackMessage');

    const name = (nameField ? nameField.value : '').trim();
    const email = (emailField ? emailField.value : '').trim();
    const message = (messageField ? messageField.value : '').trim();

    let valid = true;

    if (!name) {
        setFeedbackFieldError('feedbackName', 'Preencha o campo Nome.');
        valid = false;
    }

    if (!email) {
        setFeedbackFieldError('feedbackEmail', 'Preencha o campo E-mail.');
        valid = false;
    } else if (!isValidEmailFormat(email)) {
        setFeedbackFieldError('feedbackEmail', 'Digite um e-mail válido.');
        valid = false;
    }

    if (!message) {
        setFeedbackFieldError('feedbackMessage', 'Escreva sua mensagem.');
        valid = false;
    }

    return { valid, values: { name, email, message } };
}

// ---------- Toast (same visual language as the runes toast) ----------
function showFeedbackToast(message, isError = false) {
    let toast = document.getElementById('feedback-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'feedback-toast';
        toast.className = 'feedback-toast';
        document.body.appendChild(toast);
    }
    toast.innerHTML = isError
        ? `<i class="fa-solid fa-triangle-exclamation"></i> <span>${message}</span>`
        : `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;
    toast.classList.toggle('error', isError);
    toast.classList.add('show');
    clearTimeout(showFeedbackToast._timer);
    showFeedbackToast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ---------- Submission ----------
/**
 * Sends the message. While FEEDBACK_ENDPOINT is empty the network call is
 * simulated (always resolves), keeping the destination e-mail out of the
 * public code.
 */
function dispatchFeedbackMessage(payload) {
    if (FEEDBACK_ENDPOINT) {
        return fetch(FEEDBACK_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(payload)
        }).then((res) => {
            if (!res.ok) throw new Error(`Falha no envio: ${res.status}`);
            return res;
        });
    }
    // Simulated submission (no endpoint configured yet)
    return new Promise((resolve) => setTimeout(resolve, 700));
}

function setupFeedbackWidget() {
    const form = document.getElementById('feedbackForm');
    if (!form) return;

    // Live cleanup of the error when the user types again
    ['feedbackName', 'feedbackEmail', 'feedbackMessage'].forEach((id) => {
        const field = document.getElementById(id);
        if (!field) return;
        field.addEventListener('input', () => {
            field.classList.remove('invalid');
            const error = document.getElementById(`${id}Error`);
            if (error) error.textContent = '';
        });
    });

    // Auto-grows the message field as the user types (blocks, not line-by-line)
    const messageField = document.getElementById('feedbackMessage');
    if (messageField) {
        messageField.addEventListener('input', autoGrowFeedbackMessage);
        autoGrowFeedbackMessage();
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        // Internal anti-spam: max 3 messages per day
        if (feedbackSendsLeftToday() <= 0) {
            showFeedbackToast('Limite de mensagens atingido. Tente novamente mais tarde.', true);
            return;
        }

        const { valid, values } = validateFeedbackForm();
        if (!valid) return;

        const submitBtn = document.getElementById('feedbackSubmitBtn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
        }

        dispatchFeedbackMessage({
            nome: values.name,
            email: values.email,
            mensagem: values.message,
            origem: 'LoL Codex — Widget de Feedback'
        })
            .then(() => {
                registerFeedbackSend();
                form.reset();
                autoGrowFeedbackMessage();
                clearFeedbackErrors();
                closeFeedbackWidget();
                showFeedbackToast('Mensagem enviada com sucesso!');
            })
            .catch(() => {
                showFeedbackToast('Erro ao enviar. Tente novamente.', true);
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar';
                }
            });
    });

    // ESC closes the widget (when it is open and no other modal is)
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && isFeedbackWidgetOpen()) closeFeedbackWidget();
    });

    // Start hidden (aria-hidden for assistive tech)
    const widget = document.getElementById('feedbackWidget');
    if (widget) widget.setAttribute('aria-hidden', 'true');
}
