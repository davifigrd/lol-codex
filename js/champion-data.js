/* LoL Codex — Static champion data: classes, lanes, profiles and damage badges. */
const CLASS_ICONS = {
    Fighter: { url: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/npe-ft-role-icon-fighter.png', label: 'Lutador' },
    Tank: { url: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/npe-ft-role-icon-tank.png', label: 'Tanque' },
    Mage: { url: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/npe-ft-role-icon-mage.png', label: 'Mago' },
    Assassin: { url: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/npe-ft-role-icon-assassin.png', label: 'Assassino' },
    Marksman: { url: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/npe-ft-role-icon-marksman.png', label: 'Atirador' },
    Support: { url: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/npe-ft-role-icon-support.png', label: 'Suporte' }
};

// CLASS overrides per champion (Data Dragon ID).
// Riot tags some champions with a second class based on their ability damage
// scaling (e.g. "Mage" on marksmen like Jhin/Kog'Maw), which confuses
// players. Here the class reflects the champion's real in-game identity.
// Champions outside this map fall back to the official Data Dragon tags.
const CLASS_CORRECTIONS = {
    Azir: ['Mage'],
    Corki: ['Marksman'],
    Ezreal: ['Marksman'],
    Jhin: ['Marksman'],
    Kaisa: ['Marksman'],
    Kayle: ['Fighter', 'Marksman'],
    KogMaw: ['Marksman'],
    MissFortune: ['Marksman'],
    Smolder: ['Marksman'],
    TwistedFate: ['Mage'],
    Varus: ['Marksman'],
    Vladimir: ['Mage']
};

// Returns a champion's classes, preferring the curated correction and falling back
// to the official Data Dragon tags when there is no correction.
function getChampionClasses(champId, officialTags) {
    if (CLASS_CORRECTIONS[champId]) return CLASS_CORRECTIONS[champId];
    return Array.isArray(officialTags) ? officialTags : [];
}

// =========================================================================
// SPLASH ART URL (card banner and modal header)
// Some default splash arts depict TWO champions together (duo releases such
// as Kayle/Morgana or Xayah/Rakan). For those the official "centered" art
// from Data Dragon is used — it always shows only the champion alone.
// =========================================================================
const SOLO_SPLASH_OVERRIDES = ['Kayle', 'Morgana', 'Rakan', 'Xayah'];

function getChampionSplashUrl(champId) {
    if (SOLO_SPLASH_OVERRIDES.includes(champId)) {
        return `https://ddragon.leagueoflegends.com/cdn/img/champion/centered/${champId}_0.jpg`;
    }
    // The splash folder keeps the classic "FiddleSticks" capitalization
    const splashId = champId === 'Fiddlesticks' ? 'FiddleSticks' : champId;
    return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${splashId}_0.jpg`;
}

// Official LANE icons (for the card and the position filters)
const ROLE_ICONS = {
    Top: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-top.png',
    Jungle: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-jungle.png',
    Mid: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-middle.png',
    ADC: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-bottom.png',
    Suporte: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-utility.png'
};

// =========================================================================
// LANES / POSITIONS OF EACH CHAMPION (Data Dragon ID)
// A champion can play more than one lane; the order indicates the primary lane.
// values must be exactly: 'Top', 'Jungle', 'Mid', 'ADC', 'Support'.
// Covers ALL 173 champions (manually reviewed list). Future champions
// outside this map use a class-based fallback (tags).
// =========================================================================
const CHAMPION_ROLES = {
    Aatrox: ['Top', 'Jungle'],
    Ahri: ['Mid'],
    Akali: ['Mid', 'Top'],
    Akshan: ['Mid'],
    Alistar: ['Suporte'],
    Ambessa: ['Top', 'Jungle'],
    Amumu: ['Jungle', 'Suporte'],
    Anivia: ['Mid', 'Top'],
    Annie: ['Mid'],
    Aphelios: ['ADC'],
    Ashe: ['ADC', 'Suporte'],
    AurelionSol: ['Mid', 'ADC'],
    Aurora: ['Mid', 'Top'],
    Azir: ['Mid'],
    Bard: ['Suporte'],
    Belveth: ['Jungle'],
    Blitzcrank: ['Suporte'],
    Brand: ['Suporte', 'Mid', 'ADC'],
    Braum: ['Suporte'],
    Briar: ['Jungle'],
    Caitlyn: ['ADC'],
    Camille: ['Top', 'Suporte'],
    Cassiopeia: ['Mid'],
    Chogath: ['Top', 'Jungle'],
    Corki: ['ADC', 'Top'],
    Darius: ['Top', 'Jungle'],
    Diana: ['Jungle', 'Mid'],
    Draven: ['ADC'],
    DrMundo: ['Top'],
    Ekko: ['Mid', 'Jungle'],
    Elise: ['Jungle', 'Suporte'],
    Evelynn: ['Jungle'],
    Ezreal: ['ADC'],
    Fiddlesticks: ['Jungle', 'Suporte'],
    Fiora: ['Top'],
    Fizz: ['Mid', 'Jungle'],
    Galio: ['Mid', 'Suporte'],
    Gangplank: ['Top'],
    Garen: ['Top', 'Mid'],
    Gnar: ['Top'],
    Gragas: ['Top', 'Jungle', 'Mid'],
    Graves: ['Jungle'],
    Gwen: ['Top', 'Jungle', 'Mid'],
    Hecarim: ['Jungle'],
    Heimerdinger: ['Top'],
    Hwei: ['Mid', 'Suporte', 'ADC'],
    Illaoi: ['Top'],
    Irelia: ['Top', 'Mid'],
    Ivern: ['Jungle'],
    Janna: ['Suporte'],
    JarvanIV: ['Jungle'],
    Jax: ['Top', 'Jungle'],
    Jayce: ['Top', 'Mid', 'Jungle'],
    Jhin: ['ADC'],
    Jinx: ['ADC'],
    Kaisa: ['ADC'],
    Kalista: ['ADC'],
    Karma: ['Suporte'],
    Karthus: ['Jungle', 'ADC'],
    Kassadin: ['Mid'],
    Katarina: ['Mid', 'ADC'],
    Kayle: ['Top', 'Mid'],
    Kayn: ['Jungle'],
    Kennen: ['Top'],
    Khazix: ['Jungle'],
    Kindred: ['Jungle'],
    Kled: ['Top'],
    KogMaw: ['ADC', 'Mid'],
    KSante: ['Top'],
    Leblanc: ['Mid', 'Suporte'],
    LeeSin: ['Jungle'],
    Leona: ['Suporte'],
    Lillia: ['Jungle'],
    Lissandra: ['Mid', 'Top'],
    Locke: ['Mid', 'Jungle'],
    Lucian: ['ADC', 'Mid'],
    Lulu: ['Suporte'],
    Lux: ['Suporte', 'Mid'],
    Malphite: ['Top', 'Jungle', 'Mid'],
    Malzahar: ['Mid', 'Top'],
    Maokai: ['Suporte', 'Jungle'],
    MasterYi: ['Jungle', 'Top'],
    Mel: ['Mid', 'Suporte', 'ADC'],
    Milio: ['Suporte'],
    MissFortune: ['ADC'],
    MonkeyKing: ['Top', 'Jungle'],
    Mordekaiser: ['Top'],
    Morgana: ['Suporte'],
    Naafiri: ['Mid', 'Jungle'],
    Nami: ['Suporte'],
    Nasus: ['Top', 'Mid'],
    Nautilus: ['Suporte'],
    Neeko: ['Suporte'],
    Nidalee: ['Jungle'],
    Nilah: ['ADC'],
    Nocturne: ['Jungle'],
    Nunu: ['Jungle'],
    Olaf: ['Top'],
    Orianna: ['Mid'],
    Ornn: ['Top'],
    Pantheon: ['Top', 'Suporte', 'Jungle', 'Mid'],
    Poppy: ['Top', 'Suporte'],
    Pyke: ['Suporte'],
    Qiyana: ['Mid', 'Jungle'],
    Quinn: ['Top', 'Jungle'],
    Rakan: ['Suporte'],
    Rammus: ['Jungle'],
    RekSai: ['Jungle'],
    Rell: ['Suporte'],
    Renata: ['Suporte'],
    Renekton: ['Top'],
    Rengar: ['Jungle'],
    Riven: ['Top'],
    Rumble: ['Top'],
    Ryze: ['Mid', 'Top'],
    Samira: ['ADC'],
    Sejuani: ['Jungle'],
    Senna: ['Suporte'],
    Seraphine: ['Suporte', 'ADC'],
    Sett: ['Top'],
    Shaco: ['Jungle', 'Suporte'],
    Shen: ['Top', 'Suporte'],
    Shyvana: ['Jungle'],
    Singed: ['Top'],
    Sion: ['Top'],
    Sivir: ['ADC'],
    Skarner: ['Jungle'],
    Smolder: ['ADC', 'Mid'],
    Sona: ['Suporte'],
    Soraka: ['Suporte'],
    Swain: ['Mid', 'Suporte', 'Top', 'ADC'],
    Sylas: ['Mid', 'Top', 'Suporte'],
    Syndra: ['Mid', 'ADC'],
    TahmKench: ['Suporte', 'Top'],
    Taliyah: ['Jungle', 'Mid'],
    Talon: ['Mid', 'Jungle'],
    Taric: ['Suporte'],
    Teemo: ['Top', 'Suporte', 'Jungle'],
    Thresh: ['Suporte'],
    Tristana: ['ADC'],
    Trundle: ['Top', 'Jungle'],
    Tryndamere: ['Top'],
    TwistedFate: ['Mid'],
    Twitch: ['ADC'],
    Udyr: ['Jungle', 'Top'],
    Urgot: ['Top'],
    Varus: ['ADC', 'Top'],
    Vayne: ['ADC', 'Top'],
    Veigar: ['Mid', 'ADC'],
    Velkoz: ['Mid', 'Suporte', 'ADC'],
    Vex: ['Mid'],
    Vi: ['Jungle'],
    Viego: ['Jungle'],
    Viktor: ['Mid', 'ADC'],
    Vladimir: ['Mid', 'Top', 'ADC'],
    Volibear: ['Top', 'Jungle'],
    Warwick: ['Jungle', 'Top'],
    Xayah: ['ADC'],
    Xerath: ['Mid', 'Suporte', 'ADC'],
    XinZhao: ['Jungle'],
    Yasuo: ['Mid', 'Top', 'ADC'],
    Yone: ['Mid', 'Top'],
    Yorick: ['Top'],
    Yunara: ['ADC'],
    Yuumi: ['Suporte'],
    Zaahen: ['Top'],
    Zac: ['Jungle', 'Top'],
    Zed: ['Mid', 'Jungle'],
    Zeri: ['ADC'],
    Ziggs: ['Mid', 'ADC'],
    Zilean: ['Suporte'],
    Zoe: ['Mid', 'Suporte'],
    Zyra: ['Suporte', 'Jungle']
};;

// Lists every lane (in priority order) where a champion plays.
// Uses the curated map and, as a fallback for future champions, estimates from the class.
function getChampionRoles(champ) {
    if (!champ) return [];
    const roleKeys = CHAMPION_ROLES[champ.id];
    if (roleKeys && roleKeys.length > 0) return roleKeys;
    return [identifyChampionPrimaryRole(champ)];
}

// =========================================================================
// DAMAGE / SPECIAL ICONS — used on champion and item cards
// All using FontAwesome 6 Free (no Pro icons)
// =========================================================================
const ATTRIBUTE_ICONS = {
    AD: { class: 'stat-img-ad', color: '#ff7700', label: 'Dano Físico (AD)' },
    AP: { class: 'stat-img-ap', color: '#b84af5', label: 'Poder de Habilidade (AP)' },
    Heal: { class: 'stat-img-health', color: '#22c55e', label: 'Cura / Vida' },
    Shield: { class: 'stat-img-mr', color: '#06b6d4', label: 'Escudo / Resistência Mágica' },
    Tank: { class: 'stat-img-armor', color: '#f59e0b', label: 'Armadura (ARMOR)' },
    CC: { class: 'stat-img-tenacity', color: '#60a5fa', label: 'Controle de Grupo' },
    Dash: { class: 'stat-img-mov', color: '#60a5fa', label: 'Mobilidade / Dash' },
    Stealth: { icon: 'fa-solid fa-eye-slash', color: '#94a3b8', label: 'Furtividade' },
    Summon: { icon: 'fa-solid fa-dragon', color: '#f59e0b', label: 'Invocações' },
    True: { class: 'stat-img-pen', color: '#e2e8f0', label: 'Dano Verdadeiro / Penetração' },
    Global: { icon: 'fa-solid fa-earth-americas', color: '#06b6d4', label: 'Habilidade Global' },
    Execute: { icon: 'fa-solid fa-skull', color: '#ef4444', label: 'Execução' },
    Zone: { icon: 'fa-solid fa-circle-radiation', color: '#fb923c', label: 'Controle de Zona' }
};

// Damage/special profiles per champion (Data Dragon ID)
// Limited to 3 badges on the card; most important ones first
const CHAMPION_PROFILES = {
    Aatrox: ['AD', 'Heal'],
    Ahri: ['AP', 'CC', 'Dash'],
    Akali: ['AP', 'Dash', 'Stealth'],
    Akshan: ['AD', 'Dash'],
    Alistar: ['Tank', 'CC', 'Heal'],
    Ambessa: ['AD', 'Dash'],
    Amumu: ['Tank', 'CC'],
    Anivia: ['AP', 'CC', 'Zone'],
    Annie: ['AP', 'CC', 'Summon'],
    Aphelios: ['AD', 'Zone'],
    Ashe: ['AD', 'CC'],
    AurelionSol: ['AP', 'Zone'],
    Aurora: ['AP', 'Stealth'],
    Azir: ['AP', 'Summon', 'Zone'],
    Bard: ['AP', 'CC'],
    Belveth: ['AD', 'Dash'],
    Blitzcrank: ['Tank', 'CC'],
    Brand: ['AP', 'Zone'],
    Braum: ['Tank', 'CC', 'Shield'],
    Briar: ['AD', 'Heal', 'Dash'],
    Caitlyn: ['AD', 'CC', 'Zone'],
    Camille: ['AD', 'Dash', 'CC'],
    Cassiopeia: ['AP', 'CC', 'Zone'],
    Chogath: ['Tank', 'CC', 'True'],
    Corki: ['AD', 'AP'],
    Darius: ['AD', 'CC', 'Execute'],
    Diana: ['AP', 'Dash', 'CC'],
    DrMundo: ['Tank', 'Heal'],
    Draven: ['AD'],
    Ekko: ['AP', 'Dash', 'Heal'],
    Elise: ['AP', 'Summon', 'Dash'],
    Evelynn: ['AP', 'Stealth', 'Dash'],
    Ezreal: ['AD', 'Dash'],
    Fiddlesticks: ['AP', 'CC', 'Summon'],
    Fiora: ['AD', 'True'],
    Fizz: ['AP', 'Dash', 'CC'],
    Galio: ['AP', 'Tank', 'CC'],
    Gangplank: ['AD', 'Zone'],
    Garen: ['AD', 'Tank', 'Execute'],
    Gnar: ['AD', 'CC', 'Dash'],
    Gragas: ['AP', 'CC', 'Dash'],
    Graves: ['AD', 'Dash'],
    Gwen: ['AP', 'True'],
    Hecarim: ['AD', 'Dash', 'Heal'],
    Heimerdinger: ['AP', 'Summon', 'CC'],
    Hwei: ['AP', 'CC', 'Zone'],
    Illaoi: ['AD', 'Summon'],
    Irelia: ['AD', 'Dash', 'CC'],
    Ivern: ['AP', 'Summon', 'Shield'],
    Janna: ['AP', 'Shield', 'CC'],
    JarvanIV: ['AD', 'CC', 'Zone'],
    Jax: ['AD', 'Heal'],
    Jayce: ['AD', 'AP'],
    Jhin: ['AD', 'CC', 'Zone'],
    Jinx: ['AD', 'CC'],
    KSante: ['Tank', 'CC', 'Dash'],
    Kaisa: ['AD', 'AP', 'Dash'],
    Kalista: ['AD', 'Dash'],
    Karma: ['AP', 'Shield', 'CC'],
    Karthus: ['AP', 'Zone', 'Global'],
    Kassadin: ['AP', 'Dash'],
    Katarina: ['AP', 'Dash', 'Execute'],
    Kayle: ['AP', 'True', 'Heal'],
    Kayn: ['AD', 'Dash', 'Heal'],
    Kennen: ['AP', 'CC'],
    Khazix: ['AD', 'Stealth', 'Execute'],
    Kindred: ['AD', 'Zone'],
    Kled: ['AD', 'Dash', 'CC'],
    KogMaw: ['AD', 'AP', 'Zone'],
    Leblanc: ['AP', 'Dash', 'CC'],
    LeeSin: ['AD', 'Dash', 'CC'],
    Leona: ['Tank', 'CC', 'Zone'],
    Lillia: ['AP', 'Dash', 'CC'],
    Lissandra: ['AP', 'CC', 'Zone'],
    Locke: ['AP', 'Dash', 'Execute'],
    Lucian: ['AD', 'Dash'],
    Lulu: ['AP', 'CC', 'Shield'],
    Lux: ['AP', 'CC', 'Shield'],
    Malphite: ['Tank', 'CC'],
    Malzahar: ['AP', 'CC', 'Summon'],
    Maokai: ['Tank', 'CC', 'Heal'],
    MasterYi: ['AD', 'True', 'Heal'],
    Mel: ['AP', 'Shield', 'CC'],
    Milio: ['AP', 'Shield', 'Heal'],
    MissFortune: ['AD', 'Zone'],
    MonkeyKing: ['AD', 'Heal', 'Stealth'],
    Mordekaiser: ['AP', 'Zone'],
    Morgana: ['AP', 'CC', 'Shield'],
    Naafiri: ['AD', 'Dash', 'Execute'],
    Nami: ['AP', 'CC', 'Heal'],
    Nasus: ['AD', 'Tank', 'CC'],
    Nautilus: ['Tank', 'CC', 'Zone'],
    Neeko: ['AP', 'CC', 'Zone'],
    Nidalee: ['AP', 'Heal', 'Dash'],
    Nilah: ['AD', 'Heal', 'Dash'],
    Nocturne: ['AD', 'Stealth', 'Global'],
    Nunu: ['Tank', 'CC', 'Heal'],
    Olaf: ['AD', 'Heal'],
    Orianna: ['AP', 'CC', 'Shield'],
    Ornn: ['Tank', 'CC'],
    Pantheon: ['AD', 'CC', 'Global'],
    Poppy: ['Tank', 'CC'],
    Pyke: ['AD', 'CC', 'Execute'],
    Qiyana: ['AD', 'Stealth', 'CC'],
    Quinn: ['AD', 'Dash', 'CC'],
    Rakan: ['AP', 'CC', 'Shield'],
    Rammus: ['Tank', 'CC'],
    RekSai: ['AD', 'Dash', 'True'],
    Rell: ['Tank', 'CC', 'Zone'],
    Renata: ['AP', 'CC', 'Shield'],
    Renekton: ['AD', 'Dash', 'CC'],
    Rengar: ['AD', 'Stealth', 'Execute'],
    Riven: ['AD', 'Shield', 'Dash'],
    Rumble: ['AP', 'Zone', 'CC'],
    Ryze: ['AP', 'CC', 'Zone'],
    Samira: ['AD', 'Dash'],
    Sejuani: ['Tank', 'CC', 'Zone'],
    Senna: ['AD', 'CC', 'Heal'],
    Seraphine: ['AP', 'CC', 'Heal'],
    Sett: ['AD', 'Tank', 'True'],
    Shaco: ['AD', 'Stealth', 'Summon'],
    Shen: ['Tank', 'CC', 'Global'],
    Shyvana: ['AD', 'AP', 'Zone'],
    Singed: ['Tank', 'CC', 'Zone'],
    Sion: ['Tank', 'CC', 'Zone'],
    Sivir: ['AD', 'Zone', 'Shield'],
    Skarner: ['Tank', 'CC'],
    Smolder: ['AD', 'AP', 'Zone'],
    Sona: ['AP', 'CC', 'Heal'],
    Soraka: ['AP', 'CC', 'Heal'],
    Swain: ['AP', 'CC', 'Heal'],
    Sylas: ['AP', 'Dash', 'Heal'],
    Syndra: ['AP', 'CC', 'Zone'],
    TahmKench: ['Tank', 'CC', 'Heal'],
    Taliyah: ['AP', 'CC', 'Global'],
    Talon: ['AD', 'Stealth', 'Dash'],
    Taric: ['Tank', 'CC', 'Heal'],
    Teemo: ['AP', 'Stealth', 'Zone'],
    Thresh: ['Tank', 'CC', 'Shield'],
    Tristana: ['AD', 'Dash', 'Zone'],
    Trundle: ['AD', 'Tank', 'CC'],
    Tryndamere: ['AD', 'Dash', 'Execute'],
    TwistedFate: ['AP', 'CC', 'Global'],
    Twitch: ['AD', 'Stealth', 'Zone'],
    Udyr: ['Tank', 'CC', 'Heal'],
    Urgot: ['AD', 'Tank', 'Execute'],
    Varus: ['AD', 'CC', 'Zone'],
    Vayne: ['AD', 'True', 'Execute'],
    Veigar: ['AP', 'CC', 'Execute'],
    Velkoz: ['AP', 'CC', 'True'],
    Vex: ['AP', 'CC', 'Zone'],
    Vi: ['AD', 'CC', 'Dash'],
    Viego: ['AD', 'Stealth', 'Heal'],
    Viktor: ['AP', 'CC', 'Zone'],
    Vladimir: ['AP', 'Heal', 'Zone'],
    Volibear: ['Tank', 'CC'],
    Warwick: ['Tank', 'CC', 'Heal'],
    Xayah: ['AD', 'CC', 'Dash'],
    Xerath: ['AP', 'CC', 'Global'],
    XinZhao: ['AD', 'CC', 'Heal'],
    Yasuo: ['AD', 'Dash', 'Shield'],
    Yone: ['AD', 'AP', 'Dash'],
    Yorick: ['AD', 'Summon', 'Zone'],
    Yuumi: ['AP', 'Heal', 'Shield'],
    Yunara: ['AD', 'CC', 'Dash'],
    Zaahen: ['AD', 'Heal', 'CC'],
    Zac: ['Tank', 'CC', 'Dash'],
    Zed: ['AD', 'Stealth', 'Execute'],
    Zeri: ['AD', 'Dash', 'Shield'],
    Ziggs: ['AP', 'Zone', 'CC'],
    Zilean: ['AP', 'CC', 'Zone'],
    Zoe: ['AP', 'CC', 'Zone'],
    Zyra: ['AP', 'CC', 'Summon']
};

// Builds the damage/special HTML badges for a champion (up to 3 badges on the card)
function buildChampionDamageBadges(champId) {
    const profileData = CHAMPION_PROFILES[champId];
    if (!profileData || profileData.length === 0) return '';
    return profileData.slice(0, 3).map(key => {
        const attr = ATTRIBUTE_ICONS[key];
        if (!attr) return '';
        const iconHtml = attr.class
            ? `<span class="stat-img-icon ${attr.class}" aria-hidden="true"></span>`
            : `<i class="${attr.icon}" style="color:${attr.color}; font-size:11px;"></i>`;
        return `<span class="champ-damage-badge" title="${attr.label}">${iconHtml} ${key}</span>`;
    }).join('');
}

// Builds the full damage badges for the champion modal (all badges)
function buildChampionModalDamageBadges(champId) {
    const profileData = CHAMPION_PROFILES[champId];
    if (!profileData || profileData.length === 0) return '';
    return profileData.map(key => {
        const attr = ATTRIBUTE_ICONS[key];
        if (!attr) return '';
        const badgeClassName = key === 'AD' ? 'stat-badge-ad' : key === 'AP' ? 'stat-badge-ap' : key === 'Tank' ? 'stat-badge-armor' : key === 'Heal' ? 'stat-badge-health' : key === 'Shield' ? 'stat-badge-mr' : '';
        const iconHtml = attr.class
            ? `<span class="stat-img-icon ${attr.class}" style="width:16px; height:16px;" aria-hidden="true"></span>`
            : `<i class="${attr.icon}" style="color:${attr.color}; font-size:12px;"></i>`;
        return `<span class="stat-icon-badge ${badgeClassName}" title="${attr.label}">${iconHtml} ${attr.label}</span>`;
    }).join('');
}
