/* LoL Codex — Predominant color extraction from splash arts and per-champion color cache. */
/* ==========================================================================
   4.1. DYNAMIC PREDOMINANT COLOR EXTRACTION — HSL Cluster Voting
   Groups pixels by hue into 36 buckets of 10° and picks the bucket
   with the highest saturation × accumulated weight. Ignores grays and extremes.
   ========================================================================== */
const COLOR_CACHE_VERSION = 'v4'; // Bump this to invalidate the cache
const COLOR_CACHE_KEY = `lol_codex_cores_${COLOR_CACHE_VERSION}`;
const dynamicColorCache = {};

// Fixed official/faithful thematic colors for champions whose outfit/identity
// is very specific and can be masked by the icon background (e.g. green ninja Akali)
const CUSTOM_CHAMPION_COLORS = {
    'Akali': { r: 16, g: 185, b: 129 },       // Emerald ninja green from the classic outfit
    'Zac': { r: 34, g: 197, b: 94 },          // Slime green
    'Singed': { r: 132, g: 204, b: 22 },      // Toxic green
    'Vladimir': { r: 220, g: 38, b: 38 },     // Blood red hemomancer
    'Briar': { r: 232, g: 98, b: 143 },       // Rose pink from her hair
    'Caitlyn': { r: 46, g: 124, b: 214 },     // Officer blue from her outfit
    'Camille': { r: 227, g: 230, b: 234 },    // Silver white from her hair
    'Cassiopeia': { r: 43, g: 112, b: 74 },   // Dark green from her snake scales
    'Chogath': { r: 163, g: 44, b: 59 },      // Demonic red from his skin
    'Diana': { r: 230, g: 228, b: 222 },      // Moonlight white from her hair
    'Ekko': { r: 26, g: 195, b: 214 },        // Cyan from his time blade
    'Ezreal': { r: 46, g: 134, b: 224 },      // Arcane blue from his abilities
    'Fiddlesticks': { r: 133, g: 36, b: 44 }, // Dark scarecrow red
    'Galio': { r: 221, g: 225, b: 229 },      // Pale stone white
    'Garen': { r: 58, g: 114, b: 200 },       // Demacian blue from his cape
    'Hwei': { r: 238, g: 155, b: 47 },        // Warm fire orange from his paintings
    'Illaoi': { r: 67, g: 160, b: 71 },       // Spiritual green from her idol
    'Irelia': { r: 227, g: 90, b: 133 },      // Pink from her outfit
    'KogMaw': { r: 173, g: 219, b: 39 },      // Acid bile green
    'Lillia': { r: 159, g: 99, b: 206 },      // Dream purple
    'Locke': { r: 61, g: 94, b: 232 },        // Deep blue from her outfit
    'Lucian': { r: 69, g: 76, b: 87 },        // Lightened black from his gear
    'Nunu': { r: 63, g: 188, b: 227 },        // Light frosted blue
    'Quinn': { r: 42, g: 76, b: 155 },        // Dark blue from her armor and Valor
    'Rengar': { r: 32, g: 190, b: 154 },      // Hunter teal from his splash art
    'Renata': { r: 232, g: 230, b: 225 },     // White from her suit
    'Riven': { r: 56, g: 169, b: 77 },        // Runic green from her sword
    'Sejuani': { r: 98, g: 180, b: 230 },     // Frost light blue
    'Senna': { r: 27, g: 165, b: 174 },       // Blue-green from her splash art
    'Shyvana': { r: 217, g: 59, b: 43 },      // Dragonfire red
    'TahmKench': { r: 111, g: 140, b: 62 },   // Moss green from his skin
    'Tryndamere': { r: 223, g: 227, b: 232 }, // White from his fur
    'Urgot': { r: 147, g: 194, b: 46 },       // Zaun toxic green
    'Varus': { r: 190, g: 53, b: 53 },        // Blood red from his corruption
    'Zaahen': { r: 220, g: 58, b: 46 },       // Crimson from his splash art
    'Zoe': { r: 239, g: 130, b: 54 }          // Orange from her hair
};

// Clears old cache versions on startup
(function clearOldCache() {
    try {
        ['lol_codex_cores_cache', 'lol_codex_cores_v1', 'lol_codex_cores_v2', 'lol_codex_cores_v3'].forEach(k => {
            if (localStorage.getItem(k)) localStorage.removeItem(k);
        });
        const savedValue = localStorage.getItem(COLOR_CACHE_KEY);
        if (savedValue) Object.assign(dynamicColorCache, JSON.parse(savedValue));
    } catch (e) { }
})();

function saveColorCache() {
    try {
        localStorage.setItem(COLOR_CACHE_KEY, JSON.stringify(dynamicColorCache));
    } catch (e) { }
}

// Converts RGB to HSL, returning { h: 0-360, s: 0-1, l: 0-1 }
function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    if (max === min) return { h: 0, s: 0, l };
    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h;
    switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        default: h = ((r - g) / d + 4) / 6;
    }
    return { h: h * 360, s, l };
}

// Converts HSL back to RGB (returns { r, g, b })
function hslToRgb(h, s, l) {
    h /= 360;
    const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    return {
        r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
        g: Math.round(hue2rgb(p, q, h) * 255),
        b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255)
    };
}

function getDominantColor(imgUrl) {
    if (!imgUrl) return Promise.resolve({ rgb: 'rgb(200, 170, 110)', rgba: 'rgba(200, 170, 110, 0.65)', rgbaGlow: 'rgba(200, 170, 110, 0.35)' });

    // Checks whether it is a champion URL with a priority custom color
    for (const [champKey, customColor] of Object.entries(CUSTOM_CHAMPION_COLORS)) {
        if (imgUrl.includes(`champion/${champKey}.png`)) {
            const res = {
                rgb: `rgb(${customColor.r}, ${customColor.g}, ${customColor.b})`,
                rgba: `rgba(${customColor.r}, ${customColor.g}, ${customColor.b}, 0.65)`,
                rgbaGlow: `rgba(${customColor.r}, ${customColor.g}, ${customColor.b}, 0.35)`
            };
            dynamicColorCache[imgUrl] = res;
            return Promise.resolve(res);
        }
    }

    if (dynamicColorCache[imgUrl]) {
        return Promise.resolve(dynamicColorCache[imgUrl]);
    }

    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                // Uses 48×48 for more sampling without excessive cost
                canvas.width = 48;
                canvas.height = 48;
                ctx.drawImage(img, 0, 0, 48, 48);

                const data = ctx.getImageData(0, 0, 48, 48).data;

                // 36 buckets of 10° each covering 0-360°
                const BUCKETS = 36;
                const buckets = new Float64Array(BUCKETS); // accumulated score per hue bucket

                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
                    if (a < 128) continue;

                    const { h, s, l } = rgbToHsl(r, g, b);

                    // Discards grays (s < 0.15), very dark (l < 0.10) and very light/blown out (l > 0.92)
                    if (s < 0.15 || l < 0.10 || l > 0.92) continue;

                    // Score: saturation * (1 - |l - 0.5|*1.4) — favors mid, saturated tones
                    // The closer to l=0.5 and s=1.0, the higher the score
                    const luminanceWeight = 1 - Math.abs(l - 0.5) * 1.4;
                    const score = s * Math.max(0, luminanceWeight);

                    const bucket = Math.floor(h / (360 / BUCKETS)) % BUCKETS;
                    buckets[bucket] += score;
                }

                // Finds the dominant bucket (with 3-bucket window smoothing)
                let maxVal = -1, bestBucket = 0;
                for (let i = 0; i < BUCKETS; i++) {
                    // Smooths with neighbors to avoid artificial spikes on a single color edge
                    const smoothed = (buckets[(i - 1 + BUCKETS) % BUCKETS] * 0.25)
                        + (buckets[i] * 0.5)
                        + (buckets[(i + 1) % BUCKETS] * 0.25);
                    if (smoothed > maxVal) {
                        maxVal = smoothed;
                        bestBucket = i;
                    }
                }

                let bestColor;
                if (maxVal <= 0) {
                    // Fallback: no dominant hue (icon is too gray/white/black)
                    bestColor = { r: 200, g: 170, b: 110 };
                } else {
                    // Central hue of the winning bucket, with saturation and lightness calibrated for UI
                    const hue = (bestBucket + 0.5) * (360 / BUCKETS);
                    bestColor = hslToRgb(hue, 0.85, 0.52);
                }

                const result = {
                    rgb: `rgb(${bestColor.r}, ${bestColor.g}, ${bestColor.b})`,
                    rgba: `rgba(${bestColor.r}, ${bestColor.g}, ${bestColor.b}, 0.65)`,
                    rgbaGlow: `rgba(${bestColor.r}, ${bestColor.g}, ${bestColor.b}, 0.35)`
                };

                dynamicColorCache[imgUrl] = result;
                saveColorCache();
                resolve(result);
            } catch (err) {
                const fb = { rgb: 'rgb(200, 170, 110)', rgba: 'rgba(200, 170, 110, 0.65)', rgbaGlow: 'rgba(200, 170, 110, 0.35)' };
                resolve(fb);
            }
        };

        img.onerror = () => {
            const fb = { rgb: 'rgb(200, 170, 110)', rgba: 'rgba(200, 170, 110, 0.65)', rgbaGlow: 'rgba(200, 170, 110, 0.35)' };
            resolve(fb);
        };

        img.src = imgUrl;
    });
}

function applyCardHoverColor(cardEl, imgUrl) {
    if (cardEl.dataset.colorLoaded) return;
    getDominantColor(imgUrl).then(colorHex => {
        if (!colorHex) return;
        cardEl.style.setProperty('--card-glow-color', colorHex.rgb);
        cardEl.style.setProperty('--card-glow-rgba', colorHex.rgba);
        cardEl.dataset.colorLoaded = 'true';
    });
}

function escapeForAttribute(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/'/g, '&#39;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function formatDescriptionWithGlossary(textValue) {
    if (!textValue) return '';

    const searchTerms = Object.keys(lolGlossary).filter(k => !k.startsWith('_')).sort((a, b) => b.length - a.length);
    if (searchTerms.length === 0) {
        return textValue.replace(/\n/g, '<br>');
    }

    const pattern = `\\b(${searchTerms.map(t => t.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|')})\\b`;
    const regex = new RegExp(pattern, 'g');

    // Splits HTML tags from plain text to avoid corrupting official tags (e.g. <physicalDamage>, <br>)
    const parts = textValue.split(/(<[^>]+>)/g);
    const resultValue = parts.map(partItem => {
        if (partItem.startsWith('<') && partItem.endsWith('>')) {
            return partItem; // Keeps the official HTML tag intact
        }
        return partItem.replace(regex, (match) => {
            const uppercase = match.toUpperCase();
            const tooltip = lolGlossary[uppercase] || lolGlossary[match];
            if (!tooltip) return match;
            // title attr: handled by js/tooltip.js (themed, fixed-position,
            // never contributes to the modal's horizontal overflow)
            return `<span class="lol-glossary-term" title="${escapeForAttribute(tooltip)}">${match}</span>`;
        });
    }).join('');

    return resultValue.replace(/\n/g, '<br>');
}

/* ==========================================================================
   4.3. PARAGRAPH KEYWORDS + APHELIOS WEAPONS — Tinted Spans
   Keywords that open a paragraph (Passiva:, Ativa:, Reconjurar:...) are
   wrapped in .skill-keyword, tinted with the champion's own predominant
   color (--modal-accent-color set by JS on the modal container).
   Aphelios weapon names get their official weapon hues via .aw-* classes.
   ========================================================================== */
const SKILL_KEYWORD_REGEX = /\b(Passiva|Passivo|Ativa|Ativo|Alternar|Reconjurar)\b(\s*\d+)?(\s*:)/gi;

function colorizeSkillKeywords(textValue) {
    if (!textValue) return textValue || '';

    // Splits HTML tags from plain text so official tags and glossary spans stay intact
    const parts = String(textValue).split(/(<[^>]+>)/g);
    return parts.map(partItem => {
        if (partItem.startsWith('<') && partItem.endsWith('>')) {
            return partItem;
        }
        return partItem.replace(SKILL_KEYWORD_REGEX, (match, word, num, colon) =>
            `<span class="skill-keyword">${word}${num || ''}</span>${colon}`);
    }).join('');
}

/* ==========================================================================
   4.2.1. EFFECT COLORS — Physical/Magic damage, stun and shield
   Official Data Dragon tags (<physicalDamage>, <magicDamage>, <status>,
   <shield>...) and plain PT-BR terms are wrapped in themed spans so the
   player instantly reads the nature of the effect.
   ========================================================================== */
const EFFECT_TAG_CLASS_MAP = {
    physicaldamage: 'fx-dano-fisico',   // Physical damage — red
    magicdamage: 'fx-dano-magico',      // Magic damage — blue/purple
    truedamage: 'fx-dano-verdadeiro',   // True damage — white/gray
    status: 'fx-stun',                  // Crowd control / stun — yellow
    stun: 'fx-stun',
    root: 'fx-stun',
    taunt: 'fx-stun',
    charm: 'fx-stun',
    fear: 'fx-stun',
    silence: 'fx-stun',
    shield: 'fx-shield',                // Shield — green
    healing: 'fx-cura'                  // Healing — light green
};

// Converts official DDragon effect tags into themed spans
function colorizeEffectTags(textValue) {
    if (!textValue) return textValue || '';
    return String(textValue).replace(
        /<(physicalDamage|magicDamage|trueDamage|status|stun|root|taunt|charm|fear|silence|shield|healing)>(.*?)<\/\1>/gi,
        (match, tag, inner) => {
            const cssClass = EFFECT_TAG_CLASS_MAP[tag.toLowerCase()];
            return cssClass ? `<span class="${cssClass}">${inner}</span>` : match;
        }
    );
}

// Plain PT-BR/EN effect terms (used on text that carries no official tag)
const EFFECT_TERM_PATTERNS = [
    { regex: /\b(dano f[íi]sico)\b/gi, cssClass: 'fx-dano-fisico' },
    { regex: /\b(dano m[áa]gico)\b/gi, cssClass: 'fx-dano-magico' },
    { regex: /\b(dano verdadeiro)\b/gi, cssClass: 'fx-dano-verdadeiro' },
    { regex: /\b(atordoa(?:d[oa]|mento)|stun|sil[êe]ncio|medo|amedrontado|encantado)\b/gi, cssClass: 'fx-stun' },
    { regex: /\b(escudo|shield)\b/gi, cssClass: 'fx-shield' },
    { regex: /\b(cura|curar|regenera\w*)\b/gi, cssClass: 'fx-cura' }
];

// Wraps plain-text effect terms without touching existing tags or attributes
function colorizeEffectTerms(textValue) {
    if (!textValue) return textValue || '';
    const parts = String(textValue).split(/(<[^>]+>)/g);
    return parts.map(partItem => {
        if (partItem.startsWith('<') && partItem.endsWith('>')) return partItem;
        let out = partItem;
        EFFECT_TERM_PATTERNS.forEach(({ regex, cssClass }) => {
            out = out.replace(regex, (match) => `<span class="${cssClass}">${match}</span>`);
        });
        return out;
    }).join('');
}

// Combines both passes: official effect tags + plain-text terms.
// Used by item and rune descriptions, which do not go through the champion modal.
function colorizeEffectDescriptions(textValue) {
    return colorizeEffectTerms(colorizeEffectTags(textValue));
}

const APHELIOS_WEAPON_CLASSES = {
    Calibrum: 'aw-calibrum',     // Sniper rifle — moon green
    Severum: 'aw-severum',       // Scythe-pistol — crimson red
    Gravitum: 'aw-gravitum',     // Gravity cannon — void purple
    Infernum: 'aw-infernum',     // Flamethrower — frost blue fire
    Crescendum: 'aw-crescendum'  // Chakram — pale gold
};

function colorizeApheliosWeapons(textValue) {
    if (!textValue) return textValue || '';

    const names = Object.keys(APHELIOS_WEAPON_CLASSES);
    const regex = new RegExp(`\\b(${names.join('|')})\\b`, 'g');
    const parts = String(textValue).split(/(<[^>]+>)/g);
    return parts.map(partItem => {
        if (partItem.startsWith('<') && partItem.endsWith('>')) {
            return partItem;
        }
        return partItem.replace(regex, (match) =>
            `<span class="aphelios-weapon ${APHELIOS_WEAPON_CLASSES[match]}">${match}</span>`);
    }).join('');
}

/* Single entry point used by the champion modal: official effect tags are
   converted to themed colors first, then glossary tooltips, keyword tinting
   and (only for Aphelios) weapon name hues. */
function formatSkillDescriptionForModal(textValue, championId) {
    let html = colorizeEffectTags(textValue);
    html = formatDescriptionWithGlossary(html);
    html = colorizeEffectTerms(html);
    html = colorizeSkillKeywords(html);
    if (championId === 'Aphelios') {
        html = colorizeApheliosWeapons(html);
    }
    return html;
}
