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
    TANK: { class: 'stat-img-armor', color: '#f59e0b', label: 'Tanque (TANK)' },
    HEAL: { class: 'stat-img-health', color: '#22c55e', label: 'Cura (HEAL)' },
    SHIELD: { icon: 'fa-solid fa-shield', color: '#22d3ee', label: 'Escudo (SHIELD)' },
    CC: { class: 'stat-img-tenacity', color: '#60a5fa', label: 'Controle de Grupo (CC)' },
    DASH: { class: 'stat-img-mov', color: '#60a5fa', label: 'Mobilidade (DASH)' },
    STEALTH: { icon: 'fa-solid fa-eye-slash', color: '#94a3b8', label: 'Furtividade (STEALTH)' },
    PETS: { icon: 'fa-solid fa-dragon', color: '#f59e0b', label: 'Invocações (PETS)' },
    TD: { class: 'stat-img-pen', color: '#e2e8f0', label: 'Dano Verdadeiro (TD)' },
    GLOBAL: { icon: 'fa-solid fa-earth-americas', color: '#06b6d4', label: 'Global (GLOBAL)' },
    BURST: { icon: 'fa-solid fa-burst', color: '#ef4444', label: 'Explosão de dano (BURST)' },
    ZONE: { icon: 'fa-solid fa-circle-radiation', color: '#fb923c', label: 'Controle de Zona (ZONE)' },
    ENGAGE: { icon: 'fa-solid fa-bolt', color: '#facc15', label: 'Iniciação (ENGAGE)' },
    PEEL: { icon: 'fa-solid fa-hand-holding-heart', color: '#34d399', label: 'Proteção (PEEL)' },
    POKE: { icon: 'fa-solid fa-crosshairs', color: '#38bdf8', label: 'Alcance (POKE)' },
    SPLIT: { icon: 'fa-solid fa-code-branch', color: '#a78bfa', label: 'Pressão Lateral (SPLIT)' },
    DPS: { icon: 'fa-solid fa-infinity', color: '#fb7185', label: 'Dano Contínuo (DPS)' },
    TF: { icon: 'fa-solid fa-people-group', color: '#60a5fa', label: 'Luta em Equipe (TF)' }
};

// Damage/special profiles per champion (Data Dragon ID)
// Limited to 3 badges on the card; most important ones first
const CHAMPION_PROFILES = {
    Aatrox: ['AD', 'HEAL', 'DPS', 'SPLIT'],
    Ahri: ['AP', 'CC', 'DASH', 'BURST', 'POKE'],
    Akali: ['AP', 'DASH', 'STEALTH', 'BURST'],
    Akshan: ['AD', 'DASH', 'DPS', 'BURST'],
    Alistar: ['TANK', 'CC', 'HEAL', 'ENGAGE', 'PEEL', 'TF'],
    Ambessa: ['AD', 'DASH', 'SPLIT', 'DPS'],
    Amumu: ['TANK', 'CC', 'ENGAGE', 'TF'],
    Anivia: ['AP', 'CC', 'ZONE', 'POKE', 'TF'],
    Annie: ['AP', 'CC', 'PETS', 'BURST'],
    Aphelios: ['AD', 'ZONE', 'DPS'],
    Ashe: ['AD', 'CC', 'DPS', 'POKE', 'TF'],
    AurelionSol: ['AP', 'ZONE', 'TF', 'POKE'],
    Aurora: ['AP', 'STEALTH', 'BURST', 'POKE'],
    Azir: ['AP', 'PETS', 'ZONE', 'DPS', 'TF', 'POKE'],
    Bard: ['AP', 'CC', 'ENGAGE', 'PEEL', 'TF'],
    Belveth: ['AD', 'DASH', 'DPS', 'SPLIT'],
    Blitzcrank: ['TANK', 'CC', 'ENGAGE', 'PEEL', 'TF'],
    Brand: ['AP', 'ZONE', 'BURST', 'POKE', 'TF'],
    Braum: ['TANK', 'CC', 'SHIELD', 'PEEL', 'TF'],
    Briar: ['AD', 'HEAL', 'DASH', 'DPS', 'SPLIT'],
    Caitlyn: ['AD', 'CC', 'ZONE', 'DPS', 'POKE'],
    Camille: ['AD', 'DASH', 'CC', 'SPLIT', 'BURST'],
    Cassiopeia: ['AP', 'CC', 'ZONE', 'DPS', 'POKE'],
    Chogath: ['TANK', 'CC', 'TD', 'TF', 'ENGAGE'],
    Corki: ['AD', 'AP', 'POKE', 'DPS'],
    Darius: ['AD', 'CC', 'BURST', 'DPS', 'SPLIT'],
    Diana: ['AP', 'DASH', 'CC', 'BURST', 'ENGAGE', 'TF'],
    DrMundo: ['TANK', 'HEAL', 'SPLIT', 'DPS'],
    Draven: ['AD', 'DPS', 'BURST'],
    Ekko: ['AP', 'DASH', 'HEAL', 'BURST', 'SPLIT'],
    Elise: ['AP', 'PETS', 'DASH', 'BURST', 'POKE'],
    Evelynn: ['AP', 'STEALTH', 'DASH', 'BURST'],
    Ezreal: ['AD', 'DASH', 'POKE', 'DPS'],
    Fiddlesticks: ['AP', 'CC', 'PETS', 'ENGAGE', 'TF', 'BURST'],
    Fiora: ['AD', 'TD', 'SPLIT', 'DPS'],
    Fizz: ['AP', 'DASH', 'CC', 'BURST'],
    Galio: ['AP', 'TANK', 'CC', 'ENGAGE', 'PEEL', 'TF'],
    Gangplank: ['AD', 'ZONE', 'BURST', 'SPLIT', 'POKE'],
    Garen: ['AD', 'TANK', 'BURST', 'DPS', 'SPLIT'],
    Gnar: ['AD', 'CC', 'DASH', 'TF', 'SPLIT'],
    Gragas: ['AP', 'CC', 'DASH', 'ENGAGE', 'BURST', 'TF'],
    Graves: ['AD', 'DASH', 'BURST', 'DPS'],
    Gwen: ['AP', 'TD', 'SPLIT', 'DPS'],
    Hecarim: ['AD', 'DASH', 'HEAL', 'ENGAGE', 'DPS', 'TF'],
    Heimerdinger: ['AP', 'PETS', 'CC', 'POKE', 'TF'],
    Hwei: ['AP', 'CC', 'ZONE', 'POKE', 'TF', 'BURST'],
    Illaoi: ['AD', 'PETS', 'DPS', 'SPLIT', 'TF'],
    Irelia: ['AD', 'DASH', 'CC', 'SPLIT', 'DPS'],
    Ivern: ['AP', 'PETS', 'SHIELD', 'PEEL', 'TF'],
    Janna: ['AP', 'SHIELD', 'CC', 'PEEL', 'TF'],
    JarvanIV: ['AD', 'CC', 'ZONE', 'ENGAGE', 'TF', 'SPLIT'],
    Jax: ['AD', 'HEAL', 'SPLIT', 'DPS'],
    Jayce: ['AD', 'AP', 'POKE', 'BURST', 'SPLIT'],
    Jhin: ['AD', 'CC', 'ZONE', 'POKE', 'BURST', 'TF'],
    Jinx: ['AD', 'CC', 'DPS', 'TF'],
    KSante: ['TANK', 'CC', 'DASH', 'ENGAGE', 'SPLIT', 'TF'],
    Kaisa: ['AD', 'AP', 'DASH', 'BURST', 'DPS'],
    Kalista: ['AD', 'DASH', 'DPS', 'POKE'],
    Karma: ['AP', 'SHIELD', 'CC', 'POKE', 'PEEL', 'TF'],
    Karthus: ['AP', 'ZONE', 'GLOBAL', 'POKE', 'TF', 'DPS'],
    Kassadin: ['AP', 'DASH', 'BURST', 'SPLIT'],
    Katarina: ['AP', 'DASH', 'BURST', 'TF'],
    Kayle: ['AP', 'TD', 'HEAL', 'DPS', 'TF'],
    Kayn: ['AD', 'DASH', 'HEAL', 'BURST', 'SPLIT', 'DPS'],
    Kennen: ['AP', 'CC', 'ENGAGE', 'TF', 'BURST'],
    Khazix: ['AD', 'STEALTH', 'BURST', 'SPLIT'],
    Kindred: ['AD', 'ZONE', 'DPS'],
    Kled: ['AD', 'DASH', 'CC', 'SPLIT', 'ENGAGE', 'DPS'],
    KogMaw: ['AD', 'AP', 'ZONE', 'DPS', 'POKE'],
    Leblanc: ['AP', 'DASH', 'CC', 'BURST', 'POKE'],
    LeeSin: ['AD', 'DASH', 'CC', 'ENGAGE', 'SPLIT'],
    Leona: ['TANK', 'CC', 'ZONE', 'ENGAGE', 'PEEL', 'TF'],
    Lillia: ['AP', 'DASH', 'CC', 'ENGAGE', 'TF'],
    Lissandra: ['AP', 'CC', 'ZONE', 'ENGAGE', 'BURST', 'TF'],
    Locke: ['AP', 'DASH', 'BURST'],
    Lucian: ['AD', 'DASH', 'DPS', 'BURST'],
    Lulu: ['AP', 'CC', 'SHIELD', 'PEEL', 'POKE'],
    Lux: ['AP', 'CC', 'SHIELD', 'POKE', 'BURST', 'PEEL'],
    Malphite: ['TANK', 'CC', 'ENGAGE', 'TF'],
    Malzahar: ['AP', 'CC', 'PETS', 'POKE', 'BURST', 'TF'],
    Maokai: ['TANK', 'CC', 'HEAL', 'ENGAGE', 'PEEL', 'TF'],
    MasterYi: ['AD', 'TD', 'HEAL', 'DPS', 'SPLIT'],
    Mel: ['AP', 'SHIELD', 'CC', 'POKE', 'PEEL', 'BURST'],
    Milio: ['AP', 'SHIELD', 'HEAL', 'PEEL', 'TF'],
    MissFortune: ['AD', 'ZONE', 'DPS', 'TF', 'POKE'],
    MonkeyKing: ['AD', 'HEAL', 'STEALTH', 'ENGAGE', 'DPS', 'SPLIT', 'TF'],
    Mordekaiser: ['AP', 'ZONE', 'DPS', 'SPLIT', 'TF'],
    Morgana: ['AP', 'CC', 'SHIELD', 'PEEL', 'POKE', 'TF'],
    Naafiri: ['AD', 'DASH', 'BURST'],
    Nami: ['AP', 'CC', 'HEAL', 'PEEL', 'POKE', 'TF'],
    Nasus: ['AD', 'TANK', 'CC', 'SPLIT', 'DPS'],
    Nautilus: ['TANK', 'CC', 'ZONE', 'ENGAGE', 'PEEL', 'TF'],
    Neeko: ['AP', 'CC', 'ZONE', 'ENGAGE', 'BURST', 'TF'],
    Nidalee: ['AP', 'HEAL', 'DASH', 'POKE', 'BURST'],
    Nilah: ['AD', 'HEAL', 'DASH', 'DPS', 'BURST'],
    Nocturne: ['AD', 'STEALTH', 'GLOBAL', 'DPS', 'BURST', 'SPLIT'],
    Nunu: ['TANK', 'CC', 'HEAL', 'ENGAGE', 'TF'],
    Olaf: ['AD', 'HEAL', 'DPS', 'SPLIT'],
    Orianna: ['AP', 'CC', 'SHIELD', 'POKE', 'PEEL', 'TF'],
    Ornn: ['TANK', 'CC', 'ENGAGE', 'TF'],
    Pantheon: ['AD', 'CC', 'GLOBAL', 'BURST', 'POKE', 'ENGAGE'],
    Poppy: ['TANK', 'CC', 'ENGAGE', 'PEEL', 'TF'],
    Pyke: ['AD', 'CC', 'BURST', 'ENGAGE', 'PEEL'],
    Qiyana: ['AD', 'STEALTH', 'CC', 'BURST', 'TF'],
    Quinn: ['AD', 'DASH', 'CC', 'DPS', 'SPLIT'],
    Rakan: ['AP', 'CC', 'SHIELD', 'ENGAGE', 'PEEL', 'TF'],
    Rammus: ['TANK', 'CC', 'ENGAGE', 'TF'],
    RekSai: ['AD', 'DASH', 'TD', 'BURST', 'SPLIT'],
    Rell: ['TANK', 'CC', 'ZONE', 'ENGAGE', 'PEEL', 'TF'],
    Renata: ['AP', 'CC', 'SHIELD', 'PEEL', 'TF'],
    Renekton: ['AD', 'DASH', 'CC', 'DPS', 'SPLIT'],
    Rengar: ['AD', 'STEALTH', 'BURST', 'SPLIT'],
    Riven: ['AD', 'SHIELD', 'DASH', 'BURST', 'SPLIT', 'DPS'],
    Rumble: ['AP', 'ZONE', 'CC', 'TF', 'BURST', 'POKE'],
    Ryze: ['AP', 'CC', 'ZONE', 'DPS', 'SPLIT', 'TF'],
    Samira: ['AD', 'DASH', 'DPS', 'BURST', 'TF'],
    Sejuani: ['TANK', 'CC', 'ZONE', 'ENGAGE', 'TF'],
    Senna: ['AD', 'CC', 'HEAL', 'POKE', 'PEEL', 'DPS'],
    Seraphine: ['AP', 'CC', 'HEAL', 'POKE', 'PEEL', 'TF'],
    Sett: ['AD', 'TANK', 'TD', 'DPS', 'SPLIT', 'ENGAGE'],
    Shaco: ['AD', 'STEALTH', 'PETS', 'BURST', 'SPLIT'],
    Shen: ['TANK', 'CC', 'GLOBAL', 'PEEL', 'TF', 'ENGAGE'],
    Shyvana: ['AD', 'AP', 'ZONE', 'DPS', 'SPLIT', 'TF'],
    Singed: ['TANK', 'CC', 'ZONE', 'SPLIT', 'TF'],
    Sion: ['TANK', 'CC', 'ZONE', 'ENGAGE', 'TF', 'SPLIT'],
    Sivir: ['AD', 'ZONE', 'SHIELD', 'DPS', 'POKE', 'TF'],
    Skarner: ['TANK', 'CC', 'ENGAGE', 'TF'],
    Smolder: ['AD', 'AP', 'ZONE', 'DPS', 'POKE'],
    Sona: ['AP', 'CC', 'HEAL', 'PEEL', 'TF', 'POKE'],
    Soraka: ['AP', 'CC', 'HEAL', 'PEEL', 'TF'],
    Swain: ['AP', 'CC', 'HEAL', 'DPS', 'POKE', 'TF'],
    Sylas: ['AP', 'DASH', 'HEAL', 'BURST', 'SPLIT'],
    Syndra: ['AP', 'CC', 'ZONE', 'BURST', 'POKE', 'TF'],
    TahmKench: ['TANK', 'CC', 'HEAL', 'PEEL', 'TF'],
    Taliyah: ['AP', 'CC', 'GLOBAL', 'POKE', 'TF', 'BURST'],
    Talon: ['AD', 'STEALTH', 'DASH', 'BURST', 'SPLIT'],
    Taric: ['TANK', 'CC', 'HEAL', 'PEEL', 'ENGAGE', 'TF'],
    Teemo: ['AP', 'STEALTH', 'ZONE', 'POKE', 'SPLIT', 'DPS'],
    Thresh: ['TANK', 'CC', 'SHIELD', 'ENGAGE', 'PEEL', 'TF'],
    Tristana: ['AD', 'DASH', 'ZONE', 'DPS', 'BURST'],
    Trundle: ['AD', 'TANK', 'CC', 'SPLIT', 'DPS'],
    Tryndamere: ['AD', 'DASH', 'BURST', 'SPLIT', 'DPS'],
    TwistedFate: ['AP', 'CC', 'GLOBAL', 'POKE', 'BURST', 'TF'],
    Twitch: ['AD', 'STEALTH', 'ZONE', 'DPS', 'TF'],
    Udyr: ['TANK', 'CC', 'HEAL', 'DPS', 'SPLIT', 'ENGAGE'],
    Urgot: ['AD', 'TANK', 'BURST', 'DPS', 'SPLIT', 'POKE'],
    Varus: ['AD', 'CC', 'ZONE', 'DPS', 'POKE'],
    Vayne: ['AD', 'TD', 'BURST', 'DPS', 'SPLIT'],
    Veigar: ['AP', 'CC', 'BURST', 'POKE', 'TF'],
    Velkoz: ['AP', 'CC', 'TD', 'POKE', 'BURST', 'TF'],
    Vex: ['AP', 'CC', 'ZONE', 'BURST', 'POKE', 'TF'],
    Vi: ['AD', 'CC', 'DASH', 'ENGAGE', 'BURST', 'SPLIT'],
    Viego: ['AD', 'STEALTH', 'HEAL', 'DPS', 'BURST', 'SPLIT'],
    Viktor: ['AP', 'CC', 'ZONE', 'POKE', 'TF', 'BURST'],
    Vladimir: ['AP', 'HEAL', 'ZONE', 'DPS', 'TF', 'BURST'],
    Volibear: ['TANK', 'CC', 'DPS', 'SPLIT', 'ENGAGE'],
    Warwick: ['TANK', 'CC', 'HEAL', 'DPS', 'SPLIT', 'ENGAGE'],
    Xayah: ['AD', 'CC', 'DASH', 'DPS', 'TF'],
    Xerath: ['AP', 'CC', 'GLOBAL', 'POKE', 'BURST', 'TF'],
    XinZhao: ['AD', 'CC', 'HEAL', 'DPS', 'SPLIT', 'ENGAGE'],
    Yasuo: ['AD', 'DASH', 'SHIELD', 'DPS', 'SPLIT', 'BURST'],
    Yone: ['AD', 'AP', 'DASH', 'DPS', 'SPLIT', 'BURST'],
    Yorick: ['AD', 'PETS', 'ZONE', 'SPLIT', 'DPS', 'TF'],
    Yuumi: ['AP', 'HEAL', 'SHIELD', 'PEEL'],
    Yunara: ['AD', 'CC', 'DASH', 'DPS', 'BURST', 'POKE'],
    Zaahen: ['AD', 'HEAL', 'CC', 'DPS', 'SPLIT', 'ENGAGE'],
    Zac: ['TANK', 'CC', 'DASH', 'ENGAGE', 'TF'],
    Zed: ['AD', 'STEALTH', 'BURST', 'SPLIT'],
    Zeri: ['AD', 'DASH', 'SHIELD', 'DPS', 'POKE'],
    Ziggs: ['AP', 'ZONE', 'CC', 'POKE', 'BURST', 'TF'],
    Zilean: ['AP', 'CC', 'ZONE', 'PEEL', 'POKE', 'TF'],
    Zoe: ['AP', 'CC', 'ZONE', 'POKE', 'BURST', 'TF'],
    Zyra: ['AP', 'CC', 'PETS', 'POKE', 'TF', 'BURST'],
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
        const badgeClassName = key === 'AD' ? 'stat-badge-ad' : key === 'AP' ? 'stat-badge-ap' : key === 'TANK' ? 'stat-badge-armor' : key === 'HEAL' ? 'stat-badge-health' : key === 'SHIELD' ? 'stat-badge-shield' : '';
        const iconHtml = attr.class
            ? `<span class="stat-img-icon ${attr.class}" style="width:16px; height:16px;" aria-hidden="true"></span>`
            : `<i class="${attr.icon}" style="color:${attr.color}; font-size:12px;"></i>`;
        return `<span class="stat-icon-badge ${badgeClassName}" title="${attr.label}">${iconHtml} ${attr.label}</span>`;
    }).join('');
}
