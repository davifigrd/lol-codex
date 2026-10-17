/* LoL Codex — Detailed champion modal and ability preview videos. */
/* ==========================================================================
   4. DETAILED CHAMPION MODAL (SWITCH KEY, NO LORE)
   ========================================================================== */
async function openChampionModal(championId) {
    const modal = document.getElementById('champion-modal');
    const modalContent = document.getElementById('champion-modal-content');
    if (!modal || !modalContent) return;

    currentOpenChampionModal = championId;

    modalContent.innerHTML = `
        <div class="loading-box" style="padding:4rem 1rem;">
            <div class="loading-spinner"></div>
            <p style="color:var(--gold-light);">Carregando habilidades de <strong>${championId}</strong>...</p>
        </div>
    `;
    modal.classList.add('active');

    try {
        let champData = championDetailsCache[championId];

        if (!champData) {
            const url = `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/data/${currentLanguage}/champion/${championId}.json`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Falha na requisição: ${res.status}`);
            const json = await res.json();
            champData = json.data[championId];
            championDetailsCache[championId] = champData;
        }

        renderChampionModalContent(champData);
    } catch (err) {
        console.error(`[LoL Codex] Erro ao carregar detalhes de ${championId}:`, err);
        modalContent.innerHTML = `
            <div class="loading-box" style="color:#ef4444;">
                <i class="fa-solid fa-triangle-exclamation" style="font-size:2rem;"></i>
                <p>Falha ao buscar os detalhes de <strong>${championId}</strong>.</p>
                <button class="filter-btn" style="margin-top:1rem;" onclick="closeChampionModal()">Fechar</button>
            </div>
        `;
    }
}

function toggleChampionSummary(enabled) {
    championSummaryMode = enabled;
    // Summary mode is global: it also reflects on runes and items
    syncSummaryMode('champions', enabled);
    if (currentOpenChampionModal && championDetailsCache[currentOpenChampionModal]) {
        // Smooth fade out before re-rendering the content
        const grid = document.querySelector('#champion-modal-content .skills-grid');
        if (grid) {
            grid.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
            grid.style.opacity = '0';
            grid.style.transform = 'translateY(4px)';
            setTimeout(() => {
                renderChampionModalContent(championDetailsCache[currentOpenChampionModal]);
            }, 200);
        } else {
            renderChampionModalContent(championDetailsCache[currentOpenChampionModal]);
        }
    }
}

function renderChampionModalContent(champData) {
    const modalContent = document.getElementById('champion-modal-content');
    if (!modalContent) return;

    const splashUrl = getChampionSplashUrl(champData.id);
    const iconUrl = `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/champion/${champData.id}.png`;
    const champKeyPad = String(champData.key || '').padStart(4, '0');
    const safeChampName = escapeForAttribute(champData.name);

    // Applies the champion's predominant color to the modal border, glow, name and details
    getDominantColor(iconUrl).then(colorHex => {
        const modalContainer = document.querySelector('#champion-modal .modal-container');
        if (modalContainer) {
            modalContainer.style.setProperty('--modal-accent-color', colorHex.rgb);
            modalContainer.style.setProperty('--modal-accent-glow', colorHex.rgba);
            modalContainer.style.setProperty('--modal-accent-border', colorHex.rgba.replace('0.65', '0.25'));
            modalContainer.style.setProperty('--modal-accent-glow-soft', colorHex.rgba.replace('0.65', '0.15'));
        }
        const champAvatar = document.getElementById('champ-modal-avatar');
        if (champAvatar) {
            champAvatar.style.borderColor = colorHex.rgb;
            champAvatar.style.boxShadow = `0 0 20px ${colorHex.rgba}`;
        }
        // Applies dynamic color to the champion name
        const champNameEl = document.getElementById('champ-modal-name');
        if (champNameEl) {
            champNameEl.style.color = colorHex.rgb;
            champNameEl.style.textShadow = `0 0 18px ${colorHex.rgba}`;
        }
    });

    // Passive: in detailed mode it stays 100% faithful to Data Dragon / LoL (with <physicalDamage> tags, etc.)
    const passiveImg = champData.passive && champData.passive.image
        ? `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/passive/${champData.passive.image.full}`
        : '';
    const passiveName = champData.passive ? champData.passive.name : 'Passiva';
    const safePassiveName = escapeForAttribute(passiveName);
    const rawPassiveDesc = champData.passive ? (champData.passive.description || '') : '';

    // Fetches the author summary from the JSON (or falls back to the official text)
    const champSummary = championSummaryMode ? (skillSummaries[champData.id] || null) : null;
    const fallbackIndicator = championSummaryMode && !champSummary
        ? '<span style="font-size:0.72rem; color:var(--text-muted); font-style:italic;">(Resumo autoral ainda não escrito)</span><br>'
        : '';

    const passiveDesc = champSummary
        ? (champSummary.P && !champSummary.P.startsWith('TODO:') ? champSummary.P : `${fallbackIndicator}${rawPassiveDesc}`)
        : rawPassiveDesc;

    // Abilities Q, W, E, R
    const keys = ['Q', 'W', 'E', 'R'];
    const spellsHtml = (champData.spells || []).map((spell, index) => {
        const spellKey = keys[index] || `H${index + 1}`;
        const spellImg = `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/spell/${spell.image.full}`;
        const safeSpellName = escapeForAttribute(spell.name);

        // In detailed mode, 100% faithful to Data Dragon with all line breaks and tags
        const rawDesc = spell.description || '';

        let desc;
        if (champSummary && champSummary[spellKey] && !champSummary[spellKey].startsWith('TODO:')) {
            desc = champSummary[spellKey];
        } else if (championSummaryMode && !champSummary) {
            desc = `${fallbackIndicator}${rawDesc}`;
        } else {
            desc = rawDesc;
        }

        const cooldown = spell.cooldownBurn ? `${spell.cooldownBurn}s Recarga` : '';
        const costValue = spell.costBurn && spell.costBurn !== '0' ? `${spell.costBurn} Custo` : 'Sem Custo';

        return `
            <div class="skill-card">
                <div class="skill-img-wrap" onclick="openAbilityVideo('${champKeyPad}', '${spellKey}', '${safeChampName}', '${safeSpellName}')" title="Clique para assistir ao vídeo da habilidade ${spellKey}">
                    <img src="${spellImg}" alt="${spell.name}" class="skill-img" loading="lazy">
                    <div class="skill-img-play-overlay"><i class="fa-solid fa-play"></i></div>
                    <span class="skill-key-badge">${spellKey}</span>
                </div>
                <div class="skill-info">
                    <div class="skill-header-row">
                        <div class="skill-title-group">
                            <h4 class="skill-name">${spell.name}</h4>
                            <span class="skill-meta-tags">${cooldown ? cooldown + ' • ' : ''}${costValue}</span>
                        </div>
                    </div>
                    <div class="skill-desc" style="${championSummaryMode && champSummary ? 'color:var(--gold-light); font-weight:500;' : ''}">${formatSkillDescriptionForModal(desc, champData.id)}</div>
                </div>
            </div>
        `;
    }).join('');

    const rolesStr = getChampionClasses(champData.id, champData.tags).map(t => {
        const cls = CLASS_ICONS[t];
        if (cls) return `<img src="${cls.url}" alt="${cls.label}" title="${cls.label}" class="modal-class-icon">`;
        return `<span style="font-size:0.85rem; font-weight:700; color:var(--hextech-cyan-accent);">${translateTag(t)}</span>`;
    }).join('');

    // Official symbols for every lane the champion plays (Top/Jungle/Mid/ADC/Support)
    const champRoleKeys = getChampionRoles(champData);
    const rolesString = champRoleKeys.map(r => {
        const url = ROLE_ICONS[r] || ROLE_ICONS.Mid;
        return `<img src="${url}" alt="${r}" title="${r}" class="modal-lane-icon">`;
    }).join('');
    const rolesLabel = `Rota${champRoleKeys.length > 1 ? 's' : ''}: ${champRoleKeys.join(', ')}`;

    modalContent.innerHTML = `
        <!-- Champion top banner with splash art (no lore/biography) -->
        <div style="position:relative; border-radius:var(--radius-md); overflow:hidden; margin-bottom:1.5rem; border:1px solid var(--modal-accent-border, var(--border-gold));">
            <div style="height:170px; background-image:url('${splashUrl}'); background-size:cover; background-position:center 20%; position:relative;">
                <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(9,20,40,0.2) 0%, rgba(9,20,40,0.95) 100%);"></div>
            </div>
            <div style="display:flex; gap:1.25rem; align-items:flex-end; padding:0 1.5rem 1.25rem 1.5rem; margin-top:-55px; position:relative;">
                <img id="champ-modal-avatar" src="${iconUrl}" style="width:90px; height:90px; border-radius:var(--radius-md); border:2px solid var(--gold-bright); box-shadow:0 0 18px var(--gold-glow); object-fit:cover; background:#000; transition:border-color 0.3s ease, box-shadow 0.3s ease;">
                <div>
                    <div style="display:flex; align-items:center; gap:0.4rem; margin-bottom:0.2rem;">${rolesStr}
                        <span class="modal-lane-divider" title="${rolesLabel}"></span>
                        <span class="modal-lane-group" title="${rolesLabel}">${rolesString}</span>
                    </div>
                    <h2 id="champ-modal-name" style="font-size:2.2rem; font-family:var(--font-title); color:var(--gold-light); line-height:1.1; transition:color 0.35s ease, text-shadow 0.35s ease;">${champData.name}</h2>
                    <!-- Champion damage/special badges -->
                    <div style="display:flex; flex-wrap:wrap; gap:0.35rem; margin-top:0.5rem;">
                        ${buildChampionModalDamageBadges(champData.id)}
                    </div>
                </div>
            </div>
        </div>

        <!-- Abilities section with summary switch -->
        <div style="display:flex; align-items:center; justify-content:flex-end; margin-bottom:1rem; flex-wrap:wrap; gap:0.75rem;">
            <!-- Abilities summary switch -->
            <div class="switch-wrapper">
                <span class="${!championSummaryMode ? 'switch-label-active' : ''}">Detalhado</span>
                <label class="hextech-toggle">
                    <input type="checkbox" ${championSummaryMode ? 'checked' : ''} onchange="toggleChampionSummary(this.checked)">
                    <span class="hextech-slider"></span>
                </label>
                <span class="${championSummaryMode ? 'switch-label-active' : ''}">Resumido</span>
            </div>
        </div>
        
        <div class="skills-grid">
            <!-- Passive -->
            <div class="skill-card">
                <div class="skill-img-wrap" onclick="openAbilityVideo('${champKeyPad}', 'P', '${safeChampName}', '${safePassiveName}')" title="Clique para assistir ao vídeo da Passiva">
                    <img src="${passiveImg}" alt="${passiveName}" class="skill-img" loading="lazy">
                    <div class="skill-img-play-overlay"><i class="fa-solid fa-play"></i></div>
                    <span class="skill-key-badge">P</span>
                </div>
                <div class="skill-info">
                    <div class="skill-header-row">
                        <div class="skill-title-group">
                            <h4 class="skill-name">${passiveName}</h4>
                            <span class="skill-meta-tags">Passiva Inata</span>
                        </div>
                    </div>
                    <div class="skill-desc" style="${championSummaryMode && champSummary ? 'color:var(--gold-light); font-weight:500;' : ''}">${formatSkillDescriptionForModal(passiveDesc, champData.id)}</div>
                </div>
            </div>

            <!-- Q, W, E, R -->
            ${spellsHtml}
        </div>
    `;
}


/* ==========================================================================
   4.2. ABILITY PREVIEW VIDEO MODAL (RIOT OFFICIAL CDN / CATALYST)
   ========================================================================== */
function openAbilityVideo(champKeyPad, slotKey, champName, skillName) {
    const modal = document.getElementById('ability-video-modal');
    const container = document.getElementById('ability-video-content');
    if (!modal || !container) return;

    // Riot Games official CDN used by the Catalyst app and the LoL client
    const mp4Url = `https://d28xe8vt774jo5.cloudfront.net/champion-abilities/${champKeyPad}/ability_${champKeyPad}_${slotKey}1.mp4`;
    const webmUrl = `https://d28xe8vt774jo5.cloudfront.net/champion-abilities/${champKeyPad}/ability_${champKeyPad}_${slotKey}1.webm`;

    // Subtitle removed as requested
    container.innerHTML = `
        <div style="display:flex; align-items:center; justify-content:center; gap:0.6rem; margin-bottom:1rem; flex-wrap:wrap;">
            <span class="badge" style="background:#091428; border:1.5px solid var(--gold-bright); color:var(--gold-bright); font-size:0.9rem; padding:0.25rem 0.65rem; border-radius:var(--radius-sm); font-weight:800;">${slotKey}</span>
            <h3 style="font-family:var(--font-title); color:var(--gold-light); font-size:1.35rem; margin:0;">${champName} — ${skillName}</h3>
        </div>
        <div class="ability-video-player-wrap">
            <video id="active-ability-video" controls autoplay loop playsinline>
                <source src="${mp4Url}" type="video/mp4">
                <source src="${webmUrl}" type="video/webm">
                Seu navegador não suporta a reprodução deste vídeo.
            </video>
        </div>
        <div id="video-fallback-msg" style="display:none; margin-top:0.75rem; font-size:0.8rem; color:#f87171; background:rgba(239,68,68,0.12); border:1px solid #ef4444; padding:0.6rem; border-radius:var(--radius-sm);">
            <i class="fa-solid fa-circle-exclamation"></i> O vídeo oficial da Riot para esta habilidade não pôde ser carregado.<br>
            <span style="font-size:0.75rem; color:var(--text-muted);">URL testada: <code>${mp4Url}</code></span>
        </div>
    `;

    const videoEl = document.getElementById('active-ability-video');
    if (videoEl) {
        videoEl.play().catch(() => {
            videoEl.muted = true;
            videoEl.play().catch(e => console.warn('Autoplay bloqueado pelo navegador:', e));
        });

        const sources = videoEl.querySelectorAll('source');
        if (sources.length > 0) {
            const lastSource = sources[sources.length - 1];
            lastSource.addEventListener('error', () => {
                const fallback = document.getElementById('video-fallback-msg');
                if (fallback) fallback.style.display = 'block';
            });
        }
    }

    modal.classList.add('active');
}

function closeAbilityVideo() {
    const modal = document.getElementById('ability-video-modal');
    if (modal) {
        modal.classList.remove('active');
        const videoEl = document.getElementById('active-ability-video');
        if (videoEl) {
            videoEl.pause();
            videoEl.removeAttribute('src');
            videoEl.load();
        }
        const container = document.getElementById('ability-video-content');
        if (container) container.innerHTML = '';
    }
}

function closeAbilityVideoOnOverlayClick(event) {
    if (event.target && event.target.id === 'ability-video-modal') {
        closeAbilityVideo();
    }
}

function extractSkillSummary(textValue) {
    if (!textValue) return '';
    // Grabs the first most relevant sentence to build a quick summary
    const phraseList = textValue.split(/(?<=[.!?])\s+/);
    return phraseList[0] || textValue;
}

function closeChampionModal() {
    const modal = document.getElementById('champion-modal');
    if (modal) modal.classList.remove('active');
    currentOpenChampionModal = null;
}
