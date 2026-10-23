/* LoL Codex — Themed tooltip replacing the browser's native balloon (title). */
/* ==========================================================================
   THEME TOOLTIP
   - Removes the native title (default black balloon) before the browser
     draws it, and shows a balloon with the site's colors.
   - Also works on dynamically created elements (event delegation).
   ========================================================================== */
(() => {
    const SHOW_DELAY = 140; // ms before showing (avoids flicker when passing quickly)
    const OFFSET_X = 14;
    const OFFSET_Y = 18;

    let tip = null;
    let activeTarget = null; // element whose tooltip is visible
    let pendingTarget = null; // candidate waiting for the delay
    let pendingText = '';
    let pendingX = 0;
    let pendingY = 0;
    let showTimer = null;

    // Moves the title content -> data-tooltip-text, making sure the native
    // balloon never gets drawn.
    const readTooltipText = (el) => {
        const stored = el.getAttribute('data-tooltip-text');
        if (stored !== null) return stored;

        const title = el.getAttribute('title');
        if (!title) return '';

        el.setAttribute('data-tooltip-text', title);
        el.removeAttribute('title');

        // Keeps it readable for screen readers when the element has no
        // visible content nor alt (icons, dividers, etc).
        if (!el.getAttribute('aria-label') && !el.getAttribute('alt') && !el.textContent.trim()) {
            el.setAttribute('aria-label', title);
        }
        return title;
    };

    const findTarget = (node) => {
        if (!node || node.nodeType !== 1 || typeof node.closest !== 'function') return null;
        // Sections explicitly marked as tooltip-free (e.g. the "last champions"
        // showcase on the home page) never show a balloon.
        if (node.closest('[data-no-tooltip]')) return null;
        return node.closest('[title], [data-tooltip-text]');
    };

    const place = (x, y) => {
        const rect = tip.getBoundingClientRect();
        let left = x + OFFSET_X;
        let top = y + OFFSET_Y;

        // Flips the balloon when close to the window edges.
        if (left + rect.width > window.innerWidth - 8) left = x - rect.width - OFFSET_X;
        if (top + rect.height > window.innerHeight - 8) top = y - rect.height - OFFSET_Y;

        tip.style.left = `${Math.round(Math.max(8, left))}px`;
        tip.style.top = `${Math.round(Math.max(8, top))}px`;
    };

    const hide = () => {
        if (showTimer) {
            clearTimeout(showTimer);
            showTimer = null;
        }
        pendingTarget = null;
        pendingText = '';
        if (!activeTarget) return;

        activeTarget = null;
        tip.classList.remove('visible');
        document.removeEventListener('mousemove', followPointer);
    };

    const followPointer = (event) => {
        if (!activeTarget || findTarget(event.target) !== activeTarget) {
            hide();
            return;
        }
        place(event.clientX, event.clientY);
    };

    const showNow = () => {
        showTimer = null;
        if (!pendingTarget || !pendingText) {
            pendingTarget = null;
            return;
        }
        activeTarget = pendingTarget;
        pendingTarget = null;
        tip.textContent = pendingText;
        place(pendingX, pendingY);
        tip.classList.add('visible');
        document.addEventListener('mousemove', followPointer, { passive: true });
    };

    const schedule = (target, x, y) => {
        if (showTimer) clearTimeout(showTimer);

        pendingTarget = target;
        pendingText = readTooltipText(target);
        pendingX = x;
        pendingY = y;

        if (!pendingText) {
            pendingTarget = null;
            showTimer = null;
            return;
        }
        showTimer = setTimeout(showNow, SHOW_DELAY);
    };

    const onmouseover = (event) => {
        const target = findTarget(event.target);
        if (target === activeTarget) return; // still over the same element
        hide();
        if (target) schedule(target, event.clientX, event.clientY);
    };

    const onfocusin = (event) => {
        const target = findTarget(event.target);
        if (!target || target === activeTarget) return;
        hide();
        const rect = target.getBoundingClientRect();
        schedule(target, rect.left + rect.width / 2, rect.bottom);
    };

    const init = () => {
        tip = document.createElement('div');
        tip.className = 'hextech-tooltip';
        tip.setAttribute('role', 'tooltip');
        document.body.appendChild(tip);

        document.addEventListener('mouseover', onmouseover);
        document.addEventListener('focusin', onfocusin);
        document.addEventListener('focusout', hide);
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') hide();
        }, true);
        // Any scroll (including inside modals) invalidates the balloon position.
        document.addEventListener('scroll', hide, true);
        document.documentElement.addEventListener('mouseleave', hide);
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
