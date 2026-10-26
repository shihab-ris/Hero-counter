// Main Application Logic for MLBB Counter-Pick Strategy Assistant

import { INITIAL_HEROES, MLBB_ROLES, MLBB_ITEMS, MLBB_SPELLS, MLBB_STRATEGY_GUIDES } from './data.js';
import { CounterEngine } from './counterEngine.js';
import { soundFX } from './audio.js';

class MLBBApp {
  constructor() {
    this.heroes = this.loadHeroes();
    this.engine = new CounterEngine(this.heroes);

    // App State
    this.currentMode = 'home'; // 'home' | 'duel' | 'builds' | 'draft' | 'database'
    this.selectedOpponentId = 'fanny';
    this.duelLaneFilter = null;
    this.rosterSearchQuery = '';
    this.selectedSkillTab = 'passive'; // 'passive' | 'skill1' | 'skill2' | 'ultimate'
    this.activeCodexTab = 'heroes'; // 'heroes' | 'items'
    this.itemCategoryFilter = 'ALL';
    this.itemSearchQuery = '';

    // Builds State
    this.selectedBuildHeroId = 'fanny';
    this.buildsLaneFilter = null;
    this.buildsSearchQuery = '';

    // Home State
    this.homeSearchQuery = '';

    // Draft State (Pre-filled with iconic sample matchup for immediate wow effect)
    this.enemyDraft = ['fanny', 'wanwan', 'tigreal'];
    this.allyDraft = ['khufra'];
    this.draftPickingTarget = { side: 'enemy', slot: 3 }; // where next hero pick will go
    this.draftActiveRoleTab = 'Gold';

    // Database Search
    this.dbSearchQuery = '';
    this.dbLaneFilter = 'ALL';

    // DOM Elements
    this.initElements();
    this.bindEvents();
    this.render();
  }

  loadHeroes() {
    const saved = localStorage.getItem('mlbb_custom_heroes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with INITIAL_HEROES so user always sees the complete 133 roster
          const savedMap = new Map(parsed.map(h => [h.id, h]));
          const merged = INITIAL_HEROES.map(h => savedMap.get(h.id) || h);
          const initialIds = new Set(INITIAL_HEROES.map(h => h.id));
          parsed.forEach(h => {
            if (!initialIds.has(h.id)) merged.push(h);
          });
          return merged.map(h => ({
            ...h,
            avatar: h.avatar || `assets/heroes/${h.id}.png`
          }));
        }
      } catch (e) {
        console.error('Failed to parse saved heroes:', e);
      }
    }
    return [...INITIAL_HEROES];
  }

  getHeroAvatarHtml(hero, cssClass = '', extraStyles = '') {
    if (!hero) return '';
    const initials = hero.name ? hero.name.substring(0, 2).toUpperCase() : '??';
    const avatarUrl = hero.avatar || `assets/heroes/${hero.id}.png`;
    return `
      <div class="${cssClass}" style="background: ${hero.avatarBg || '#1e293b'}; ${extraStyles}">
        <img src="${avatarUrl}" alt="${hero.name}" loading="lazy" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit; display: block;">
        <span style="display: none; align-items: center; justify-content: center; width: 100%; height: 100%; font-family: var(--font-heading); font-weight: 700; color: white;">${initials}</span>
      </div>
    `;
  }

  getItemSymbolHtml(item, cssClass = 'slot-item-symbol', extraStyles = '') {
    if (!item) return `<span class="fallback-item-icon">🛡️</span>`;
    const itemType = (item.type || 'Defense').toLowerCase();
    const iconUrl = item.img || (item.id ? `assets/items/${item.id}.png` : null);
    const altName = item.name || 'Equipment';
    const fallbackEmoji = item.icon || '🛡️';

    if (iconUrl) {
      return `
        <div class="item-symbol-wrap item-type-${itemType}" style="${extraStyles}">
          <img src="${iconUrl}" alt="${altName}" class="${cssClass}" loading="lazy" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';" />
          <span class="fallback-item-icon" style="display: none;">${fallbackEmoji}</span>
        </div>
      `;
    }
    return `<div class="item-symbol-wrap item-type-${itemType}" style="${extraStyles}"><span class="fallback-item-icon">${fallbackEmoji}</span></div>`;
  }

  getSpellSymbolHtml(spell, cssClass = 'loadout-symbol-img', extraStyles = '') {
    if (!spell) return `<span class="fallback-item-icon">✨</span>`;
    const spellUrl = spell.img || (spell.id ? `assets/spells/${spell.id}.png` : null);
    const altName = spell.name || 'Battle Spell';
    const fallbackEmoji = spell.icon || '✨';

    if (spellUrl) {
      return `
        <div class="spell-symbol-wrap" style="${extraStyles}">
          <img src="${spellUrl}" alt="${altName}" class="${cssClass}" loading="lazy" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';" />
          <span class="fallback-item-icon" style="display: none;">${fallbackEmoji}</span>
        </div>
      `;
    }
    return `<div class="spell-symbol-wrap" style="${extraStyles}"><span class="fallback-item-icon">${fallbackEmoji}</span></div>`;
  }

  getSpellSymbolByNameHtml(spellName, cssClass = 'mini-item-symbol') {
    if (!spellName) return '';
    const clean = spellName.toLowerCase().replace(/[^a-z]/g, '');
    const found = Object.values(MLBB_SPELLS).find(s => s.name.toLowerCase() === spellName.toLowerCase() || s.id === clean);
    if (found) {
      return this.getSpellSymbolHtml(found, cssClass);
    }
    return `<span class="spell-symbol-wrap"><img src="assets/spells/${clean}.png" alt="${spellName}" class="${cssClass}" onerror="this.style.display='none';" /></span>`;
  }

  getEmblemSymbolHtml(emblem, cssClass = 'loadout-symbol-img', extraStyles = '') {
    if (!emblem) return `<span class="fallback-item-icon">🛡️</span>`;
    const emblemUrl = emblem.img || (emblem.id ? `assets/emblems/${emblem.id}.png` : null);
    const altName = emblem.name || 'Emblem';
    const fallbackEmoji = emblem.icon || '🛡️';

    if (emblemUrl) {
      return `
        <div class="emblem-symbol-wrap" style="${extraStyles}">
          <img src="${emblemUrl}" alt="${altName}" class="${cssClass}" loading="lazy" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';" />
          <span class="fallback-item-icon" style="display: none;">${fallbackEmoji}</span>
        </div>
      `;
    }
    return `<div class="emblem-symbol-wrap" style="${extraStyles}"><span class="fallback-item-icon">${fallbackEmoji}</span></div>`;
  }

  saveHeroes() {
    localStorage.setItem('mlbb_custom_heroes', JSON.stringify(this.heroes));
    this.engine.setHeroes(this.heroes);
  }

  resetToDefaultHeroes() {
    localStorage.removeItem('mlbb_custom_heroes');
    this.heroes = [...INITIAL_HEROES];
    this.engine.setHeroes(this.heroes);
    this.render();
  }

  initElements() {
    // Header & Tabs
    this.tabHome = document.getElementById('tabHome');
    this.tabDuel = document.getElementById('tabDuel');
    this.tabBuilds = document.getElementById('tabBuilds');
    this.tabDraft = document.getElementById('tabDraft');
    this.tabDatabase = document.getElementById('tabDatabase');
    this.btnSoundToggle = document.getElementById('btnSoundToggle');

    // Panels
    this.panelHome = document.getElementById('panelHome');
    this.panelDuel = document.getElementById('panelDuel');
    this.panelBuilds = document.getElementById('panelBuilds');
    this.panelDraft = document.getElementById('panelDraft');
    this.panelDatabase = document.getElementById('panelDatabase');

    // Home elements
    this.homeHeroSearch = document.getElementById('homeHeroSearch');
    this.btnHomeSearch = document.getElementById('btnHomeSearch');
    this.homeSearchResults = document.getElementById('homeSearchResults');
    this.btnLaunchCounter = document.getElementById('btnLaunchCounter');
    this.btnLaunchBuilds = document.getElementById('btnLaunchBuilds');
    this.btnLaunchDraft = document.getElementById('btnLaunchDraft');
    this.btnLaunchCodex = document.getElementById('btnLaunchCodex');
    this.homeMetaGrid = document.getElementById('homeMetaGrid');

    // Duel elements
    this.duelOpponentSearch = document.getElementById('duelOpponentSearch');
    this.btnDuelSearch = document.getElementById('btnDuelSearch');
    this.duelLanePillsContainer = document.getElementById('duelLanePills');
    this.duelRosterGrid = document.getElementById('duelRosterGrid');
    this.duelSpotlightAvatar = document.getElementById('duelSpotlightAvatar');
    this.duelSpotlightName = document.getElementById('duelSpotlightName');
    this.duelSpotlightTags = document.getElementById('duelSpotlightTags');
    this.duelIntelCard = document.getElementById('duelIntelCard');
    this.duelSkillsCard = document.getElementById('duelSkillsCard');
    this.duelCounterBuildCard = document.getElementById('duelCounterBuildCard');
    this.duelResultsContainer = document.getElementById('duelResultsContainer');

    // Builds elements
    this.buildsHeroSearch = document.getElementById('buildsHeroSearch');
    this.btnBuildsSearch = document.getElementById('btnBuildsSearch');
    this.buildsLanePillsContainer = document.getElementById('buildsLanePills');
    this.buildsRosterGrid = document.getElementById('buildsRosterGrid');
    this.buildsSpotlightAvatar = document.getElementById('buildsSpotlightAvatar');
    this.buildsSpotlightName = document.getElementById('buildsSpotlightName');
    this.buildsSpotlightTags = document.getElementById('buildsSpotlightTags');
    this.buildsHeroHeader = document.getElementById('buildsHeroHeader');
    this.buildsCoreGrid = document.getElementById('buildsCoreGrid');
    this.buildsSwapsList = document.getElementById('buildsSwapsList');
    this.buildsLoadoutGrid = document.getElementById('buildsLoadoutGrid');

    // Draft elements
    this.enemySlotsContainer = document.getElementById('enemySlots');
    this.allySlotsContainer = document.getElementById('allySlots');
    this.threatBarsGrid = document.getElementById('threatBarsGrid');
    this.draftInsightsContainer = document.getElementById('draftInsights');
    this.draftRoleTabsContainer = document.getElementById('draftRoleTabs');
    this.draftRoleRecsContainer = document.getElementById('draftRoleRecs');
    this.draftRosterPicker = document.getElementById('draftRosterPicker');
    this.draftHeroSearch = document.getElementById('draftHeroSearch');
    this.btnDraftSearch = document.getElementById('btnDraftSearch');

    // Database elements
    this.btnCodexHeroes = document.getElementById('btnCodexHeroes');
    this.btnCodexItems = document.getElementById('btnCodexItems');
    this.dbHeroView = document.getElementById('dbHeroView');
    this.dbItemView = document.getElementById('dbItemView');
    this.dbHeroSearch = document.getElementById('dbHeroSearch');
    this.btnDbHeroSearch = document.getElementById('btnDbHeroSearch');
    this.dbLaneFilterSelect = document.getElementById('dbLaneFilter');
    this.dbRosterGrid = document.getElementById('dbRosterGrid');
    this.dbItemSearch = document.getElementById('dbItemSearch');
    this.btnDbItemSearch = document.getElementById('btnDbItemSearch');
    this.dbItemCategoryFilter = document.getElementById('dbItemCategoryFilter');
    this.dbItemsGrid = document.getElementById('dbItemsGrid');
    this.btnNewHero = document.getElementById('btnNewHero');
    this.btnExportJson = document.getElementById('btnExportJson');
    this.btnImportJson = document.getElementById('btnImportJson');
    this.fileImportInput = document.getElementById('fileImportInput');

    // Modal
    this.modalOverlay = document.getElementById('modalOverlay');
    this.modalBody = document.getElementById('modalBody');
    this.modalTitle = document.getElementById('modalTitle');
    this.btnModalClose = document.getElementById('btnModalClose');

    // Update sound toggle button icon
    this.updateSoundIcon();
  }

  updateSoundIcon() {
    if (this.btnSoundToggle) {
      this.btnSoundToggle.innerHTML = soundFX.isMuted() ? '🔇' : '🔊';
      this.btnSoundToggle.title = soundFX.isMuted() ? 'Unmute SFX' : 'Mute SFX';
    }
  }

  bindEvents() {
    // Sound Toggle
    this.btnSoundToggle.addEventListener('click', () => {
      const muted = soundFX.toggleMute();
      this.updateSoundIcon();
      if (!muted) soundFX.playSelect();
    });

    // Navigation Tabs
    const switchTab = (mode) => {
      soundFX.playSelect();
      this.currentMode = mode;
      [this.tabHome, this.tabDuel, this.tabBuilds, this.tabDraft, this.tabDatabase].forEach(t => t && t.classList.remove('active'));
      [this.panelHome, this.panelDuel, this.panelBuilds, this.panelDraft, this.panelDatabase].forEach(p => p && p.classList.remove('active'));

      if (mode === 'home') {
        if (this.tabHome) this.tabHome.classList.add('active');
        if (this.panelHome) this.panelHome.classList.add('active');
        this.renderHomeView();
      } else if (mode === 'duel') {
        if (this.tabDuel) this.tabDuel.classList.add('active');
        if (this.panelDuel) this.panelDuel.classList.add('active');
        this.renderDuelView();
      } else if (mode === 'builds') {
        if (this.tabBuilds) this.tabBuilds.classList.add('active');
        if (this.panelBuilds) this.panelBuilds.classList.add('active');
        this.renderBuildsView();
      } else if (mode === 'draft') {
        if (this.tabDraft) this.tabDraft.classList.add('active');
        if (this.panelDraft) this.panelDraft.classList.add('active');
        this.renderDraftView();
      } else if (mode === 'database') {
        if (this.tabDatabase) this.tabDatabase.classList.add('active');
        if (this.panelDatabase) this.panelDatabase.classList.add('active');
        this.renderDatabaseView();
      }
    };
    this.switchTab = switchTab;

    if (this.tabHome) this.tabHome.addEventListener('click', () => switchTab('home'));
    if (this.tabDuel) this.tabDuel.addEventListener('click', () => switchTab('duel'));
    if (this.tabBuilds) this.tabBuilds.addEventListener('click', () => switchTab('builds'));
    if (this.tabDraft) this.tabDraft.addEventListener('click', () => switchTab('draft'));
    if (this.tabDatabase) this.tabDatabase.addEventListener('click', () => switchTab('database'));

    // Feature Launchpad buttons on Home
    if (this.btnLaunchCounter) this.btnLaunchCounter.addEventListener('click', () => switchTab('duel'));
    if (this.btnLaunchBuilds) this.btnLaunchBuilds.addEventListener('click', () => switchTab('builds'));
    if (this.btnLaunchDraft) this.btnLaunchDraft.addEventListener('click', () => switchTab('draft'));
    if (this.btnLaunchCodex) this.btnLaunchCodex.addEventListener('click', () => switchTab('database'));

    // Home Fast Search
    this.setupHomeSearch();

    // Builds Hero Search
    const executeBuildsSearch = () => {
      const q = (this.buildsHeroSearch ? this.buildsHeroSearch.value : '').toLowerCase().trim();
      this.buildsSearchQuery = q;
      this.renderBuildsRosterPicker();
      if (q) {
        const heroes = this.engine.getAllHeroes();
        const matches = heroes.filter(h => {
          const matchSearch = h.name.toLowerCase().includes(q) || h.role.toLowerCase().includes(q);
          const matchLane = !this.buildsLaneFilter || h.lane === this.buildsLaneFilter || h.secondaryLane === this.buildsLaneFilter;
          return matchSearch && matchLane;
        });
        if (matches.length > 0) {
          soundFX.playLockIn();
          this.selectedBuildHeroId = matches[0].id;
          this.renderBuildsRosterPicker();
          this.renderBuildsWorkshop();
        }
      }
    };

    if (this.buildsHeroSearch) {
      this.buildsHeroSearch.addEventListener('input', (e) => {
        this.buildsSearchQuery = e.target.value.toLowerCase().trim();
        this.renderBuildsRosterPicker();
      });
      this.buildsHeroSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          executeBuildsSearch();
        }
      });
    }
    if (this.btnBuildsSearch) {
      this.btnBuildsSearch.addEventListener('click', executeBuildsSearch);
    }

    // Codex Mode Switcher
    if (this.btnCodexHeroes && this.btnCodexItems) {
      this.btnCodexHeroes.addEventListener('click', () => {
        soundFX.playSelect();
        this.activeCodexTab = 'heroes';
        this.btnCodexHeroes.classList.add('active');
        this.btnCodexItems.classList.remove('active');
        if (this.dbHeroView) this.dbHeroView.style.display = 'block';
        if (this.dbItemView) this.dbItemView.style.display = 'none';
        this.renderDatabaseView();
      });

      this.btnCodexItems.addEventListener('click', () => {
        soundFX.playSelect();
        this.activeCodexTab = 'items';
        this.btnCodexItems.classList.add('active');
        this.btnCodexHeroes.classList.remove('active');
        if (this.dbHeroView) this.dbHeroView.style.display = 'none';
        if (this.dbItemView) this.dbItemView.style.display = 'block';
        this.renderItemsCodexView();
      });
    }

    // Item Codex search
    const executeDbItemSearch = () => {
      const q = (this.dbItemSearch ? this.dbItemSearch.value : '').toLowerCase().trim();
      this.itemSearchQuery = q;
      this.renderItemsCodexView();
    };

    if (this.dbItemSearch) {
      this.dbItemSearch.addEventListener('input', (e) => {
        this.itemSearchQuery = e.target.value;
        this.renderItemsCodexView();
      });
      this.dbItemSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          executeDbItemSearch();
        }
      });
    }
    if (this.btnDbItemSearch) {
      this.btnDbItemSearch.addEventListener('click', executeDbItemSearch);
    }

    // Duel Opponent Search
    const executeDuelSearch = () => {
      const q = (this.duelOpponentSearch ? this.duelOpponentSearch.value : '').toLowerCase().trim();
      this.rosterSearchQuery = q;
      this.renderDuelRosterPicker();
      if (q) {
        const heroes = this.engine.getAllHeroes();
        const matches = heroes.filter(h => {
          const matchSearch = h.name.toLowerCase().includes(q) || h.role.toLowerCase().includes(q);
          const matchLane = !this.duelLaneFilter || h.lane === this.duelLaneFilter || h.secondaryLane === this.duelLaneFilter;
          return matchSearch && matchLane;
        });
        if (matches.length > 0) {
          soundFX.playLockIn();
          this.selectedOpponentId = matches[0].id;
          this.renderDuelRosterPicker();
          this.renderDuelMatchup();
        }
      }
    };

    if (this.duelOpponentSearch) {
      this.duelOpponentSearch.addEventListener('input', (e) => {
        this.rosterSearchQuery = e.target.value.toLowerCase().trim();
        this.renderDuelRosterPicker();
      });
      this.duelOpponentSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          executeDuelSearch();
        }
      });
    }
    if (this.btnDuelSearch) {
      this.btnDuelSearch.addEventListener('click', executeDuelSearch);
    }

    // Draft Hero Search
    const executeDraftSearch = () => {
      const q = (this.draftHeroSearch ? this.draftHeroSearch.value : '').toLowerCase().trim();
      this.renderDraftHeroPicker(q);
      if (q) {
        const heroes = this.engine.getAllHeroes();
        const pickedSet = new Set([...this.enemyDraft, ...this.allyDraft]);
        const matches = heroes.filter(h => {
          const matchSearch = h.name.toLowerCase().includes(q) || h.lane.toLowerCase().includes(q) || h.role.toLowerCase().includes(q);
          return matchSearch && !pickedSet.has(h.id);
        });
        if (matches.length > 0) {
          soundFX.playLockIn();
          this.addDraftPick(this.draftPickingTarget.side, this.draftPickingTarget.slot, matches[0].id);
        }
      }
    };

    if (this.draftHeroSearch) {
      this.draftHeroSearch.addEventListener('input', (e) => {
        this.renderDraftHeroPicker(e.target.value.toLowerCase().trim());
      });
      this.draftHeroSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          executeDraftSearch();
        }
      });
    }
    if (this.btnDraftSearch) {
      this.btnDraftSearch.addEventListener('click', executeDraftSearch);
    }

    // Database search
    const executeDbHeroSearch = () => {
      const q = (this.dbHeroSearch ? this.dbHeroSearch.value : '').toLowerCase().trim();
      this.dbSearchQuery = q;
      this.renderDatabaseView();
      if (q) {
        const heroes = this.engine.getAllHeroes();
        const matches = heroes.filter(h => {
          const matchSearch = h.name.toLowerCase().includes(q) || (h.tags && h.tags.some(t => t.toLowerCase().includes(q)));
          const matchLane = this.dbLaneFilter === 'ALL' || h.lane === this.dbLaneFilter || h.secondaryLane === this.dbLaneFilter;
          return matchSearch && matchLane;
        });
        if (matches.length === 1 || (matches.length > 0 && matches[0].name.toLowerCase() === q)) {
          soundFX.playLockIn();
          this.viewHeroDetails(matches[0].id);
        }
      }
    };

    if (this.dbHeroSearch) {
      this.dbHeroSearch.addEventListener('input', (e) => {
        this.dbSearchQuery = e.target.value.toLowerCase().trim();
        this.renderDatabaseView();
      });
      this.dbHeroSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          executeDbHeroSearch();
        }
      });
    }
    if (this.btnDbHeroSearch) {
      this.btnDbHeroSearch.addEventListener('click', executeDbHeroSearch);
    }
    this.dbLaneFilterSelect.addEventListener('change', (e) => {
      this.dbLaneFilter = e.target.value;
      this.renderDatabaseView();
    });

    // Custom Hero & JSON management
    this.btnNewHero.addEventListener('click', () => this.openHeroEditorModal(null));
    this.btnExportJson.addEventListener('click', () => this.exportMetaJson());
    this.btnImportJson.addEventListener('click', () => this.fileImportInput.click());
    this.fileImportInput.addEventListener('change', (e) => this.importMetaJson(e));

    // Modal Close
    this.btnModalClose.addEventListener('click', () => this.closeModal());
    this.modalOverlay.addEventListener('click', (e) => {
      if (e.target === this.modalOverlay) this.closeModal();
    });
  }

  render() {
    if (this.currentMode === 'home') {
      this.renderHomeView();
    } else if (this.currentMode === 'duel') {
      this.renderDuelView();
    } else if (this.currentMode === 'builds') {
      this.renderBuildsView();
    } else if (this.currentMode === 'draft') {
      this.renderDraftView();
    } else {
      this.renderDatabaseView();
    }
  }

  // ==================== HOME MODE VIEW ====================
  renderHomeView() {
    this.renderHomeMetaGrid();
  }

  renderHomeMetaGrid() {
    if (!this.homeMetaGrid) return;
    const metaChampions = [
      { id: 'wanwan', lane: 'Gold Lane', role: 'Marksman', icon: '🏹', reason: 'Invulnerable ultimate teamwipe capability + true damage shred.' },
      { id: 'yu_zhong', lane: 'EXP Lane', role: 'Fighter', icon: '⚔️', reason: 'Black Dragon form backline dive with overwhelming spell vamp.' },
      { id: 'lunox', lane: 'Mid Lane', role: 'Mage', icon: '🔮', reason: 'High magic penetration chaos bursts + brilliance invulnerability.' },
      { id: 'khufra', lane: 'Roamer', role: 'Tank', icon: '🛡️', reason: 'Bouncing ball cancels all dash skills; game-winning tyrant setups.' },
      { id: 'fanny', lane: 'Jungler', role: 'Assassin', icon: '⚡', reason: 'Unmatched map-wide cable mobility and instant wall burst combos.' }
    ];

    this.homeMetaGrid.innerHTML = metaChampions.map(c => {
      const hero = this.engine.getHeroById(c.id);
      if (!hero) return '';
      const avatarHtml = this.getHeroAvatarHtml(hero, 'meta-champion-avatar');
      return `
        <div class="meta-champion-card">
          <div class="meta-champion-lane-badge">
            <span>${c.icon}</span> ${c.lane}
          </div>
          <div class="meta-champion-header">
            ${avatarHtml}
            <div class="meta-champion-info">
              <h4>${hero.name}</h4>
              <span class="meta-champion-role">${hero.role} • ${hero.damageType}</span>
            </div>
          </div>
          <p class="meta-champion-reason">${c.reason}</p>
          <div class="meta-champion-actions">
            <button class="btn-primary" onclick="window.mlbbApp.selectDuelOpponent('${hero.id}')" title="Analyze counters against ${hero.name}">
              🎯 Counter
            </button>
            <button class="btn-secondary" onclick="window.mlbbApp.selectBuildHero('${hero.id}')" title="Inspect pro build for ${hero.name}">
              🛡️ Build
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  setupHomeSearch() {
    if (!this.homeHeroSearch || !this.homeSearchResults) return;

    const executeHomeSearch = () => {
      const query = (this.homeHeroSearch.value || '').toLowerCase().trim();
      if (!query) {
        this.homeHeroSearch.focus();
        soundFX.playHover();
        return;
      }
      const heroes = this.engine.getAllHeroes();
      // First priority: exact name or id match
      let match = heroes.find(h => h.name.toLowerCase() === query || h.id === query);
      if (!match) {
        // Second priority: starts with query
        match = heroes.find(h => h.name.toLowerCase().startsWith(query));
      }
      if (!match) {
        // Third priority: includes query in name, role, or lane
        match = heroes.find(h => 
          h.name.toLowerCase().includes(query) || 
          h.role.toLowerCase().includes(query) || 
          h.lane.toLowerCase().includes(query)
        );
      }

      if (match) {
        soundFX.playLockIn();
        this.closeHomeSearch();
        this.selectDuelOpponent(match.id);
      } else {
        soundFX.playHover();
        this.homeSearchResults.innerHTML = `
          <div style="padding: 1rem; text-align: center; color: var(--text-dim); font-size: 0.88rem;">
            No heroes found matching "${query}"
          </div>
        `;
        this.homeSearchResults.classList.add('open');
      }
    };

    if (this.btnHomeSearch) {
      this.btnHomeSearch.addEventListener('click', () => {
        executeHomeSearch();
      });
    }

    this.homeHeroSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        executeHomeSearch();
      } else if (e.key === 'Escape') {
        this.closeHomeSearch();
      }
    });

    this.homeHeroSearch.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (!query) {
        this.homeSearchResults.classList.remove('open');
        this.homeSearchResults.innerHTML = '';
        return;
      }

      const heroes = this.engine.getAllHeroes();
      const matches = heroes.filter(h => 
        h.name.toLowerCase().includes(query) || 
        h.role.toLowerCase().includes(query) || 
        h.lane.toLowerCase().includes(query)
      ).slice(0, 6);

      if (matches.length === 0) {
        this.homeSearchResults.innerHTML = `
          <div style="padding: 1rem; text-align: center; color: var(--text-dim); font-size: 0.88rem;">
            No heroes found matching "${query}"
          </div>
        `;
        this.homeSearchResults.classList.add('open');
        return;
      }

      this.homeSearchResults.innerHTML = matches.map(h => `
        <div class="home-search-item">
          <div class="home-search-item-info">
            ${this.getHeroAvatarHtml(h, 'home-search-item-avatar')}
            <div>
              <strong style="color: #fff; font-size: 0.95rem;">${h.name}</strong>
              <div style="font-size: 0.78rem; color: var(--text-dim);">${h.lane} Lane • ${h.role}</div>
            </div>
          </div>
          <div class="home-search-item-actions">
            <button class="btn-primary" style="padding: 0.35rem 0.65rem; font-size: 0.78rem;" onclick="window.mlbbApp.selectDuelOpponent('${h.id}'); window.mlbbApp.closeHomeSearch();">
              🎯 Counter
            </button>
            <button class="btn-secondary" style="padding: 0.35rem 0.65rem; font-size: 0.78rem;" onclick="window.mlbbApp.selectBuildHero('${h.id}'); window.mlbbApp.closeHomeSearch();">
              🛡️ Build
            </button>
          </div>
        </div>
      `).join('');
      this.homeSearchResults.classList.add('open');
    });

    document.addEventListener('click', (e) => {
      if (this.homeHeroSearch && this.homeSearchResults && !this.homeHeroSearch.contains(e.target) && !this.homeSearchResults.contains(e.target) && (!this.btnHomeSearch || !this.btnHomeSearch.contains(e.target))) {
        this.closeHomeSearch();
      }
    });
  }

  closeHomeSearch() {
    if (this.homeSearchResults) {
      this.homeSearchResults.classList.remove('open');
    }
  }

  selectDuelOpponent(heroId) {
    this.selectedOpponentId = heroId;
    this.switchTab('duel');
  }

  selectBuildHero(heroId) {
    this.selectedBuildHeroId = heroId;
    this.switchTab('builds');
  }

  // ==================== BUILDS WORKSHOP VIEW ====================
  renderBuildsView() {
    this.renderBuildsLanePills();
    this.renderBuildsRosterPicker();
    this.renderBuildsWorkshop();
  }

  renderBuildsLanePills() {
    if (!this.buildsLanePillsContainer) return;
    const lanes = [
      { id: null, label: 'All Lanes' },
      { id: 'Gold', label: '🏹 Gold' },
      { id: 'EXP', label: '⚔️ EXP' },
      { id: 'Mid', label: '🔮 Mid' },
      { id: 'Roam', label: '🛡️ Roam' },
      { id: 'Jungle', label: '⚡ Jungle' }
    ];

    this.buildsLanePillsContainer.innerHTML = lanes.map(l => `
      <button class="lane-pill ${this.buildsLaneFilter === l.id ? 'active' : ''}" data-lane="${l.id || ''}">
        ${l.label}
      </button>
    `).join('');

    this.buildsLanePillsContainer.querySelectorAll('.lane-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        soundFX.playSelect();
        const lane = btn.getAttribute('data-lane') || null;
        this.buildsLaneFilter = lane;
        this.renderBuildsLanePills();
        this.renderBuildsRosterPicker();
      });
      btn.addEventListener('mouseenter', () => soundFX.playHover());
    });
  }

  renderBuildsRosterPicker() {
    if (!this.buildsRosterGrid) return;
    const heroes = this.engine.getAllHeroes();
    const filtered = heroes.filter(h => {
      const matchSearch = !this.buildsSearchQuery || h.name.toLowerCase().includes(this.buildsSearchQuery) || h.role.toLowerCase().includes(this.buildsSearchQuery);
      const matchLane = !this.buildsLaneFilter || h.lane === this.buildsLaneFilter || h.secondaryLane === this.buildsLaneFilter;
      return matchSearch && matchLane;
    });

    if (filtered.length === 0) {
      this.buildsRosterGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; color: var(--text-dim); padding: 1.5rem 0;">
          No heroes match search criteria.
        </div>
      `;
      return;
    }

    this.buildsRosterGrid.innerHTML = filtered.map(h => {
      const isSelected = h.id === this.selectedBuildHeroId;
      return `
        <button class="hero-thumb-btn ${isSelected ? 'selected' : ''}" data-id="${h.id}" title="${h.name} (${h.lane} Lane - ${h.role})">
          ${this.getHeroAvatarHtml(h, 'hero-thumb-avatar')}
          <span class="hero-thumb-name">${h.name}</span>
        </button>
      `;
    }).join('');

    this.buildsRosterGrid.querySelectorAll('.hero-thumb-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        soundFX.playLockIn();
        this.selectedBuildHeroId = btn.getAttribute('data-id');
        this.renderBuildsRosterPicker();
        this.renderBuildsWorkshop();
      });
      btn.addEventListener('mouseenter', () => soundFX.playHover());
    });
  }

  renderBuildsWorkshop() {
    const buildData = this.engine.getHeroProBuild(this.selectedBuildHeroId);
    if (!buildData || !buildData.hero) return;

    const hero = buildData.hero;
    const initials = hero.name.substring(0, 2).toUpperCase();
    const avatarUrl = hero.avatar || `assets/heroes/${hero.id}.png`;

    // 1. Update Spotlight in Sidebar
    if (this.buildsSpotlightAvatar) {
      this.buildsSpotlightAvatar.style.background = hero.avatarBg || '#1e293b';
      this.buildsSpotlightAvatar.innerHTML = `
        <img src="${avatarUrl}" alt="${hero.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit; display: block;" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';">
        <span style="display: none; align-items: center; justify-content: center; width: 100%; height: 100%; font-family: var(--font-heading); font-weight: 800; color: white;">${initials}</span>
      `;
    }
    if (this.buildsSpotlightName) this.buildsSpotlightName.textContent = hero.name;
    if (this.buildsSpotlightTags) {
      this.buildsSpotlightTags.innerHTML = `
        <span class="tag-badge lane-badge">${hero.lane} Lane</span>
        <span class="tag-badge">${hero.role}</span>
        <span class="tag-badge">${hero.damageType}</span>
        <span class="tag-badge" style="color: ${hero.difficulty === 'Hard' || hero.difficulty === 'Very Hard' ? 'var(--danger-red)' : 'var(--victory-green)'}">${hero.difficulty}</span>
      `;
    }

    // 2. Builds Hero Header Overview Card
    if (this.buildsHeroHeader) {
      const earlySpike = (hero.powerSpikes?.early || 3) / 5 * 100;
      const midSpike = (hero.powerSpikes?.mid || 4) / 5 * 100;
      const lateSpike = (hero.powerSpikes?.late || 4) / 5 * 100;

      this.buildsHeroHeader.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="width: 56px; height: 56px; border-radius: var(--radius-md); overflow: hidden; border: 2px solid var(--mythic-gold); box-shadow: 0 0 15px rgba(245, 158, 11, 0.3);">
              ${this.getHeroAvatarHtml(hero)}
            </div>
            <div>
              <h3 style="font-family: var(--font-heading); font-size: 1.4rem; color: #fff; margin-bottom: 0.2rem;">${hero.name} Pro Build & Equipment Matrix</h3>
              <div class="tags-row">
                <span class="tag-badge lane-badge">${hero.lane} Lane</span>
                <span class="tag-badge">${hero.role}</span>
                <span class="tag-badge">${hero.damageType} Damage</span>
                <span class="tag-badge" style="color: var(--neon-cyan);">${hero.tags ? hero.tags.join(' • ') : 'Standard Kit'}</span>
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn-primary" onclick="window.mlbbApp.selectDuelOpponent('${hero.id}')">
              🎯 View Counter Matchup
            </button>
            <button class="btn-secondary" onclick="window.mlbbApp.viewHeroDetails('${hero.id}')">
              📖 Open Dossier
            </button>
          </div>
        </div>

        <div class="intel-block">
          <span class="intel-label">⚡ Power Spike Curve</span>
          <div class="power-spike-bars">
            <div class="spike-col">
              <span class="spike-name">Early Game (Lv 1-4)</span>
              <div class="spike-bar-wrap"><div class="spike-bar-fill" style="width: ${earlySpike}%; background: ${earlySpike >= 60 ? 'var(--victory-green)' : 'var(--danger-red)'};"></div></div>
            </div>
            <div class="spike-col">
              <span class="spike-name">Mid Game (Lv 5-11)</span>
              <div class="spike-bar-wrap"><div class="spike-bar-fill" style="width: ${midSpike}%; background: var(--mythic-gold);"></div></div>
            </div>
            <div class="spike-col">
              <span class="spike-name">Late Game (Lv 12-15)</span>
              <div class="spike-bar-wrap"><div class="spike-bar-fill" style="width: ${lateSpike}%; background: ${lateSpike >= 80 ? 'var(--neon-cyan)' : 'var(--text-dim)'};"></div></div>
            </div>
          </div>
        </div>
      `;
    }

    // 3. Render 6-Item Core Grid
    if (this.buildsCoreGrid) {
      this.buildsCoreGrid.innerHTML = buildData.coreBuild.map((slot, idx) => {
        const item = slot.item;
        const symbolHtml = this.getItemSymbolHtml(item, 'build-slot-symbol');
        return `
          <div class="build-slot-card" onclick="window.mlbbApp.openItemDetailsModal('${item.id}')" title="Click to inspect passives & stats for ${item.name}">
            <span class="build-slot-num">Slot ${idx + 1}</span>
            <span class="build-slot-type-badge">${slot.type}</span>
            <div class="build-slot-icon-wrap">
              ${symbolHtml}
            </div>
            <div class="build-slot-name">${item.name}</div>
            <div class="build-slot-desc">${slot.desc}</div>
            <span style="font-size: 0.72rem; color: var(--mythic-gold); margin-top: auto;">🔍 Click to Inspect</span>
          </div>
        `;
      }).join('');
    }

    // 4. Render Situational Swaps List
    if (this.buildsSwapsList) {
      if (!buildData.situationalSwaps || buildData.situationalSwaps.length === 0) {
        this.buildsSwapsList.innerHTML = `<div style="color: var(--text-dim); padding: 1rem;">No specific situational adjustments needed.</div>`;
      } else {
        this.buildsSwapsList.innerHTML = buildData.situationalSwaps.map(swap => {
          const swapInItem = swap.swapIn;
          const symbolHtml = this.getItemSymbolHtml(swapInItem, 'mini-item-symbol');
          return `
            <div class="situational-swap-item">
              <div class="swap-item-trigger">
                <span class="swap-trigger-badge">⚡ ${swap.trigger}</span>
                <p class="swap-trigger-reason">${swap.reason}</p>
              </div>
              <div class="swap-item-action-box">
                <div class="swap-box-item" style="opacity: 0.75;" title="Standard build item">
                  <span style="color: var(--text-dim); font-size: 0.8rem;">Swap out:</span>
                  <strong style="color: #cbd5e1; font-size: 0.85rem;">${swap.swapOut}</strong>
                </div>
                <span class="swap-arrow">➔</span>
                <div class="swap-box-item" onclick="window.mlbbApp.openItemDetailsModal('${swapInItem.id}')" title="Click to inspect ${swapInItem.name}">
                  <span style="color: var(--victory-green); font-size: 0.8rem; font-weight: 700;">Equip:</span>
                  ${symbolHtml}
                  <strong style="color: #ffffff; font-size: 0.85rem;">${swapInItem.name}</strong>
                  <span style="color: var(--mythic-gold); font-size: 0.72rem;">🔍</span>
                </div>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // 5. Render Loadout Grid (Emblem + Spell)
    if (this.buildsLoadoutGrid) {
      const emblem = buildData.emblem || MLBB_EMBLEMS.FIGHTER;
      const primarySpell = buildData.primarySpell || MLBB_SPELLS.FLICKER;
      const altSpell = buildData.alternateSpell || MLBB_SPELLS.PURIFY;

      const emblemImg = this.getEmblemSymbolHtml(emblem, 'loadout-symbol-img');
      const spellImg = this.getSpellSymbolHtml(primarySpell, 'loadout-symbol-img');
      const altSpellImg = this.getSpellSymbolHtml(altSpell, 'mini-item-symbol');

      this.buildsLoadoutGrid.innerHTML = `
        <div class="build-loadout-card">
          <h4>
            <span>🛡️</span> Primary Emblem: ${emblem.name} Emblem
          </h4>
          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
            ${emblemImg}
            <div style="font-size: 0.88rem; color: #94a3b8;">
              Tailored for ${hero.role} scaling with maximum stat efficiency.
            </div>
          </div>
          <div class="loadout-talents-list">
            ${buildData.emblemTalents.map(t => `<div class="talent-pill">✦ ${t}</div>`).join('')}
          </div>
        </div>

        <div class="build-loadout-card">
          <h4>
            <span>✨</span> Recommended Battle Spell
          </h4>
          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem;">
            ${spellImg}
            <div>
              <strong style="color: #ffffff; font-size: 1.05rem;">${primarySpell.name}</strong>
              <div style="font-size: 0.82rem; color: var(--mythic-gold);">Standard Priority Pick</div>
            </div>
          </div>
          <p style="font-size: 0.85rem; color: #cbd5e1; line-height: 1.45; margin-bottom: 0.75rem;">
            ${primarySpell.desc || 'Crucial positioning tool for aggressive flash initiations or escaping deadly ambush chains.'}
          </p>
          <div style="margin-top: auto; padding-top: 0.75rem; border-top: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-size: 0.8rem; color: var(--text-dim);">Situational Alternative:</span>
            <div style="display: inline-flex; align-items: center; gap: 0.4rem;">
              ${altSpellImg}
              <strong style="color: var(--neon-cyan); font-size: 0.85rem;">${altSpell.name}</strong>
            </div>
          </div>
        </div>
      `;
    }
  }

  // ==================== DUEL MODE VIEW ====================
  renderDuelView() {
    this.renderDuelLanePills();
    this.renderDuelRosterPicker();
    this.renderDuelMatchup();
  }

  renderDuelLanePills() {
    const lanes = [
      { id: null, label: 'All Lanes' },
      { id: 'Gold', label: '🏹 Gold' },
      { id: 'EXP', label: '⚔️ EXP' },
      { id: 'Mid', label: '🔮 Mid' },
      { id: 'Roam', label: '🛡️ Roam' },
      { id: 'Jungle', label: '⚡ Jungle' }
    ];

    this.duelLanePillsContainer.innerHTML = lanes.map(l => `
      <button class="lane-pill ${this.duelLaneFilter === l.id ? 'active' : ''}" data-lane="${l.id || ''}">
        ${l.label}
      </button>
    `).join('');

    this.duelLanePillsContainer.querySelectorAll('.lane-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        soundFX.playSelect();
        const lane = btn.getAttribute('data-lane') || null;
        this.duelLaneFilter = lane;
        this.renderDuelLanePills();
        this.renderDuelRosterPicker();
        this.renderDuelMatchup();
      });
      btn.addEventListener('mouseenter', () => soundFX.playHover());
    });
  }

  renderDuelRosterPicker() {
    const heroes = this.engine.getAllHeroes();
    const filtered = heroes.filter(h => {
      const matchSearch = !this.rosterSearchQuery || h.name.toLowerCase().includes(this.rosterSearchQuery) || h.role.toLowerCase().includes(this.rosterSearchQuery);
      const matchLane = !this.duelLaneFilter || h.lane === this.duelLaneFilter || h.secondaryLane === this.duelLaneFilter;
      return matchSearch && matchLane;
    });

    if (filtered.length === 0) {
      this.duelRosterGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; color: var(--text-dim); padding: 1.5rem 0;">
          No heroes match search criteria.
        </div>
      `;
      return;
    }

    this.duelRosterGrid.innerHTML = filtered.map(h => {
      const isSelected = h.id === this.selectedOpponentId;
      return `
        <button class="hero-thumb-btn ${isSelected ? 'selected' : ''}" data-id="${h.id}" title="${h.name} (${h.lane} Lane - ${h.role})">
          ${this.getHeroAvatarHtml(h, 'hero-thumb-avatar')}
          <span class="hero-thumb-name">${h.name}</span>
        </button>
      `;
    }).join('');

    this.duelRosterGrid.querySelectorAll('.hero-thumb-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        soundFX.playLockIn();
        this.selectedOpponentId = btn.getAttribute('data-id');
        this.renderDuelRosterPicker();
        this.renderDuelMatchup();
      });
      btn.addEventListener('mouseenter', () => soundFX.playHover());
    });
  }

  renderDuelMatchup() {
    const analysis = this.engine.getDuelCounters(this.selectedOpponentId, this.duelLaneFilter);
    if (!analysis) return;

    const opp = analysis.opponent;
    const initials = opp.name.substring(0, 2).toUpperCase();
    const oppAvatarUrl = opp.avatar || `assets/heroes/${opp.id}.png`;

    // 1. Spotlight header
    this.duelSpotlightAvatar.style.background = opp.avatarBg || '#1e293b';
    this.duelSpotlightAvatar.innerHTML = `
      <img src="${oppAvatarUrl}" alt="${opp.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit; display: block;" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';">
      <span style="display: none; align-items: center; justify-content: center; width: 100%; height: 100%; font-family: var(--font-heading); font-weight: 800; color: white;">${initials}</span>
    `;
    this.duelSpotlightName.textContent = opp.name;
    this.duelSpotlightTags.innerHTML = `
      <span class="tag-badge lane-badge">${opp.lane} Lane</span>
      <span class="tag-badge">${opp.role}</span>
      <span class="tag-badge">${opp.damageType}</span>
      <span class="tag-badge" style="color: ${opp.difficulty === 'Hard' || opp.difficulty === 'Very Hard' ? 'var(--danger-red)' : 'var(--victory-green)'}">${opp.difficulty}</span>
    `;

    // 2. Tactical Matchup Intel Card
    const earlyPercent = (analysis.powerSpikes.early / 5) * 100;
    const midPercent = (analysis.powerSpikes.mid / 5) * 100;
    const latePercent = (analysis.powerSpikes.late / 5) * 100;

    const itemsHtml = analysis.counterItems.map(item => {
      const itObj = Object.values(MLBB_ITEMS).find(x => x.name.toLowerCase() === item.name.toLowerCase() || (x.id && item.name.toLowerCase().includes(x.id))) || item;
      const symbolHtml = this.getItemSymbolHtml(itObj, 'mini-item-symbol');
      const itemId = itObj.id || (typeof item === 'string' ? item : item.name);
      return `
        <div class="item-chip clickable-item-slot" title="Click to inspect stats & passives for ${item.name}" onclick="window.mlbbApp.openItemDetailsModal('${itemId}')">
          ${symbolHtml}
          <strong>${item.name}</strong>
          <span style="font-size: 0.72rem; color: var(--mythic-gold); margin-left: 0.2rem;">🔍</span>
        </div>
      `;
    }).join('');

    const tipsHtml = analysis.tacticalTips.map((tip, idx) => `
      <li style="margin-bottom: 0.35rem; color: #cbd5e1;">
        <strong style="color: var(--neon-cyan);">Tip ${idx+1}:</strong> ${tip}
      </li>
    `).join('');

    this.duelIntelCard.innerHTML = `
      <div class="intel-block">
        <span class="intel-label">⚡ Power Spike Timeline</span>
        <div class="power-spike-bars">
          <div class="spike-col">
            <span class="spike-name">Early (Lv 1-4)</span>
            <div class="spike-bar-wrap">
              <div class="spike-bar-fill" style="width: ${earlyPercent}%; background: ${earlyPercent > 60 ? 'var(--danger-red)' : 'var(--victory-green)'};"></div>
            </div>
          </div>
          <div class="spike-col">
            <span class="spike-name">Mid Game</span>
            <div class="spike-bar-wrap">
              <div class="spike-bar-fill" style="width: ${midPercent}%; background: ${midPercent > 60 ? 'var(--mythic-gold)' : 'var(--victory-green)'};"></div>
            </div>
          </div>
          <div class="spike-col">
            <span class="spike-name">Late Game</span>
            <div class="spike-bar-wrap">
              <div class="spike-bar-fill" style="width: ${latePercent}%; background: ${latePercent > 60 ? 'var(--danger-red)' : 'var(--victory-green)'};"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="intel-block">
        <span class="intel-label">✨ Recommended Battle Spell</span>
        <div class="intel-content" style="display: flex; align-items: center; gap: 0.6rem; color: var(--neon-cyan); font-weight: 700; font-size: 1.05rem;">
          ${this.getSpellSymbolByNameHtml(analysis.recommendedSpell, 'mini-item-symbol')}
          <span>${analysis.recommendedSpell}</span>
        </div>
      </div>


      <div class="intel-block" style="grid-column: 1 / -1;">
        <span class="intel-label">🛡️ Essential Counter Items to Build (Click to Inspect Passives)</span>
        <div class="counter-items-wrap">
          ${itemsHtml}
        </div>
      </div>

      <div class="intel-block" style="grid-column: 1 / -1;">
        <span class="intel-label">🎯 Matchup Tactical Guide</span>
        <ul style="list-style: none; font-size: 0.88rem; line-height: 1.5; margin-top: 0.25rem;">
          ${tipsHtml}
        </ul>
      </div>
    `;

    // 2.2 Opponent Hero Skills & Passive Codex
    this.renderDuelHeroSkills(opp);

    // 2.5 Complete Situational Counter Build Card
    if (this.duelCounterBuildCard) {
      this.duelCounterBuildCard.innerHTML = this.renderCounterBuildHtml(analysis.counterBuild, opp.name);
    }

    // 3. Render Tier Lists
    let tierHtml = '';

    // S-Tier
    if (analysis.sCounters.length > 0) {
      tierHtml += `
        <div class="tier-section">
          <div class="tier-header">
            <div class="tier-title-group">
              <span class="tier-badge s-tier">S-TIER</span>
              <strong style="font-family: var(--font-heading); font-size: 1.15rem; color: var(--mythic-gold);">HARD COUNTER ADVANTAGE</strong>
            </div>
            <span class="tier-desc">Heavy kit negation & favorable matchup</span>
          </div>
          <div class="counter-cards-grid">
            ${analysis.sCounters.map(c => this.renderCounterCard(c, opp)).join('')}
          </div>
        </div>
      `;
    }

    // A-Tier
    if (analysis.aCounters.length > 0) {
      tierHtml += `
        <div class="tier-section" style="margin-top: 1rem;">
          <div class="tier-header">
            <div class="tier-title-group">
              <span class="tier-badge a-tier">A-TIER</span>
              <strong style="font-family: var(--font-heading); font-size: 1.15rem; color: #38bdf8;">SKILL / SOFT COUNTER</strong>
            </div>
            <span class="tier-desc">Favorable trades with proper positioning & cooldown exploitation</span>
          </div>
          <div class="counter-cards-grid">
            ${analysis.aCounters.map(c => this.renderCounterCard(c, opp)).join('')}
          </div>
        </div>
      `;
    }

    // Avoid / Danger Picks
    if (analysis.avoidPicks.length > 0) {
      tierHtml += `
        <div class="tier-section" style="margin-top: 1rem;">
          <div class="tier-header" style="border-bottom-color: rgba(244, 63, 94, 0.3);">
            <div class="tier-title-group">
              <span class="tier-badge avoid-tier">DANGER</span>
              <strong style="font-family: var(--font-heading); font-size: 1.15rem; color: var(--danger-red);">DO NOT PICK INTO ${opp.name.toUpperCase()}</strong>
            </div>
            <span class="tier-desc">Severe kit disadvantage; heavily exploited by ${opp.name}</span>
          </div>
          <div class="counter-cards-grid">
            ${analysis.avoidPicks.map(v => this.renderAvoidCard(v, opp)).join('')}
          </div>
        </div>
      `;
    }

    this.duelResultsContainer.innerHTML = tierHtml;

    // Attach click listeners to cards
    this.duelResultsContainer.querySelectorAll('.counter-card').forEach(card => {
      card.addEventListener('mouseenter', () => soundFX.playHover());
    });
  }

  renderDuelHeroSkills(opponent) {
    if (!this.duelSkillsCard) return;
    if (!opponent) {
      this.duelSkillsCard.innerHTML = '';
      return;
    }

    const skills = opponent.skills || {
      passive: { name: `${opponent.name} Passive`, tag: 'Inherent Trait', desc: 'Unique combat passive enhancing combat effectiveness.', counterTip: 'Watch ability cooldowns and engage after trigger.' },
      skill1: { name: `${opponent.name} Skill 1`, tag: 'Primary Ability', desc: 'Core attack or utility skill.', counterTip: 'Maintain safe distance and dodge projectile trajectory.' },
      skill2: { name: `${opponent.name} Skill 2`, tag: 'Secondary Ability', desc: 'Mobility or crowd control skill.', counterTip: 'Bait out this skill before committing your main burst.' },
      ultimate: { name: `${opponent.name} Ultimate`, tag: 'Finishing Move', desc: 'High-impact teamfight or burst ultimate.', counterTip: 'Respect ultimate cooldown; use defensive active items or crowd control to disrupt.' }
    };

    const activeTab = this.selectedSkillTab || 'passive';
    const activeSkill = skills[activeTab] || skills.passive;

    const tabsConfig = [
      { key: 'passive', label: 'Passive', icon: '🛡️' },
      { key: 'skill1', label: 'Skill 1', icon: '1️⃣' },
      { key: 'skill2', label: 'Skill 2', icon: '2️⃣' },
      { key: 'ultimate', label: 'Ultimate', icon: '⚡' }
    ];

    this.duelSkillsCard.innerHTML = `
      <div class="skills-header-row">
        <div class="skills-title-group">
          <span>🔮</span>
          <h3>${opponent.name} Ability & Passive Intelligence</h3>
        </div>
        <div class="skill-tabs-nav">
          ${tabsConfig.map(t => `
            <button class="skill-tab-btn ${activeTab === t.key ? 'active' : ''}" data-skill="${t.key}">
              <span>${t.icon}</span> ${t.label}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="skill-display-panel">
        <div class="skill-badge-row">
          <span class="skill-tag-pill">${activeSkill.tag || 'Hero Ability'}</span>
          <span style="font-size: 0.78rem; color: var(--text-dim); text-transform: uppercase; font-family: var(--font-heading); font-weight: 700;">
            Slot: ${activeTab === 'passive' ? 'Passive Trait' : activeTab.toUpperCase()}
          </span>
        </div>
        <div class="skill-name-title">${activeSkill.name}</div>
        <p class="skill-desc-text">${activeSkill.desc}</p>
        <div class="skill-counter-box">
          <div class="skill-counter-header">
            <span>🎯</span> HOW TO COUNTER THIS SKILL
          </div>
          <div class="skill-counter-desc">${activeSkill.counterTip}</div>
        </div>
      </div>
    `;

    this.duelSkillsCard.querySelectorAll('.skill-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        soundFX.playSelect();
        this.selectedSkillTab = btn.getAttribute('data-skill');
        this.renderDuelHeroSkills(opponent);
      });
      btn.addEventListener('mouseenter', () => soundFX.playHover());
    });
  }

  renderCounterBuildHtml(counterBuild, oppName) {
    if (!counterBuild) return '';
    const build = counterBuild;

    return `
      <div class="build-header-wrap">
        <div class="panel-header" style="margin-bottom: 0;">
          <h3 class="panel-title" style="color: var(--neon-cyan); display: flex; align-items: center; gap: 0.65rem;">
            <span>🛡️</span>
            <span>Situational Counter Build vs <span style="color: var(--mythic-gold);">${oppName}</span></span>
          </h3>
          <span class="rank-tag">Complete 6-Item Adaptive Build</span>
        </div>
        <p class="build-subtitle">Adaptive anti-carry loadout engineered to dismantle ${oppName}'s kit advantages, survive burst windows, and secure lane dominance.</p>
      </div>

      <div class="rush-alert-banner">
        <div class="rush-radar-icon">
          💡
        </div>
        <div class="rush-text-wrap">
          <div class="rush-tag">ITEMIZATION RUSH STRATEGY</div>
          <span class="rush-desc">${build.rushStrategy}</span>
        </div>
      </div>

      <!-- In-Game 6-Slot Quick-Rack Equipment Bar -->
      <div class="inventory-quick-rack">
        <div class="inventory-rack-label">EQUIPMENT LOADOUT PREVIEW (CLICK TO INSPECT PASSIVES)</div>
        <div class="inventory-rack-slots">
          ${build.items.map((slot, idx) => `
            <div class="rack-slot-item clickable-item-slot" title="${slot.item.name} — Click to inspect stats & passives" onclick="window.mlbbApp.openItemDetailsModal('${slot.item.id}')">
              <span class="rack-slot-num">#${idx + 1}</span>
              ${this.getItemSymbolHtml(slot.item, 'rack-item-img')}
              <span class="rack-item-name">${slot.item.name}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 6-Item Detailed Breakdown Cards (Balanced 3x2 Grid) -->
      <div class="build-slots-grid">
        ${build.items.map((slot, idx) => `
          <div class="build-slot-card clickable-item-slot" onclick="window.mlbbApp.openItemDetailsModal('${slot.item.id}')">
            <div class="slot-card-header">
              <span class="slot-phase-pill">
                <span class="slot-order">#0${idx + 1}</span>
                <span class="slot-name-text">${slot.slotName}</span>
              </span>
              <span class="slot-type-badge type-${(slot.item.type || 'defense').toLowerCase()}">${slot.item.type || 'DEFENSE'}</span>
            </div>

            <div class="slot-item-hero-row">
              ${this.getItemSymbolHtml(slot.item, 'slot-item-symbol')}
              <div class="slot-item-titles">
                <strong class="slot-item-title">${slot.item.name}</strong>
                <span class="slot-item-subcat">${slot.slotName}</span>
              </div>
            </div>

            <div class="slot-item-desc">${slot.item.desc}</div>

            <div class="slot-counter-reason">
              <div class="reason-header">
                <span>🎯</span>
                <strong>TACTICAL ADVANTAGE</strong>
              </div>
              <p class="reason-text">${slot.reason}</p>
            </div>

            <button class="item-inspect-hint" onclick="event.stopPropagation(); window.mlbbApp.openItemDetailsModal('${slot.item.id}')">
              Inspect Stats & Passives 🔍
            </button>
          </div>
        `).join('')}
      </div>

      <!-- Emblem & Battle Spell Loadout Row -->
      <div class="emblem-spell-row">
        <div class="loadout-subcard">
          <div class="loadout-card-top">
            <span class="slot-tag-label">RECOMMENDED EMBLEM SETUP</span>
            <span class="tactical-pill">Core Synergy</span>
          </div>
          <div class="loadout-card-body">
            ${this.getEmblemSymbolHtml(build.emblem, 'loadout-symbol-img')}
            <div class="loadout-title-box">
              <h4 class="loadout-title">${build.emblem.name}</h4>
              <span class="loadout-subtitle">${build.emblem.desc}</span>
            </div>
          </div>
          <div class="loadout-talents-list">
            <div class="talent-row"><span class="talent-tier">Tier 1:</span> <span>${build.emblem.talents.tier1}</span></div>
            <div class="talent-row"><span class="talent-tier">Tier 2:</span> <span>${build.emblem.talents.tier2}</span></div>
            <div class="talent-row core-talent"><span class="talent-tier">Core Talent:</span> <span class="talent-core-name">${build.emblem.talents.tier3}</span></div>
          </div>
        </div>

        <div class="loadout-subcard">
          <div class="loadout-card-top">
            <span class="slot-tag-label">OPTIMAL BATTLE SPELL</span>
            <span class="tactical-pill gold-pill">Engage Neutralizer</span>
          </div>
          <div class="loadout-card-body">
            ${this.getSpellSymbolHtml(build.battleSpell, 'loadout-symbol-img')}
            <div class="loadout-title-box">
              <h4 class="loadout-title" style="color: var(--mythic-gold);">${build.battleSpell.name}</h4>
              <span class="loadout-subtitle">${build.battleSpell.desc}</span>
            </div>
          </div>
          <div class="tactical-spell-rule">
            <strong>🎯 Tactical Rule:</strong> Save <em>${build.battleSpell.name}</em> specifically to shut down <strong>${oppName}</strong>'s critical engagement window.
          </div>
        </div>
      </div>
    `;
  }

  renderCounterCard(entry, opponent) {
    const hero = entry.hero;
    return `
      <div class="counter-card" data-hero-id="${hero.id}">
        <div class="card-top-row">
          ${this.getHeroAvatarHtml(hero, 'card-avatar')}
          <div class="card-info">
            <h4>
              ${hero.name}
              ${entry.tier === 'S' ? '<span style="color: var(--mythic-gold); font-size: 0.85rem;">★ S-Tier</span>' : ''}
            </h4>
            <div class="card-tags">
              <span class="tag-badge lane-badge">${hero.lane}</span>
              <span class="tag-badge">${hero.role}</span>
              <span class="tag-badge">${hero.damageType}</span>
            </div>
          </div>
        </div>

        <div class="card-reason">
          ${entry.reason}
        </div>

        <div class="card-footer-stats">
          <div class="score-meter">
            <span>⚡ Match Score:</span>
            <span>${entry.score}%</span>
          </div>
          <button class="btn-secondary" style="padding: 0.3rem 0.65rem; font-size: 0.75rem;" onclick="window.mlbbApp.quickDraftHero('${hero.id}', 'ally')">
            + Pick in Draft
          </button>
        </div>
      </div>
    `;
  }

  renderAvoidCard(entry, opponent) {
    const hero = entry.hero;
    return `
      <div class="counter-card avoid-card" data-hero-id="${hero.id}">
        <div class="card-top-row">
          ${this.getHeroAvatarHtml(hero, 'card-avatar')}
          <div class="card-info">
            <h4 style="color: #fca5a5;">
              ${hero.name}
              <span style="color: var(--danger-red); font-size: 0.8rem;">⚠️ High Risk</span>
            </h4>
            <div class="card-tags">
              <span class="tag-badge lane-badge">${hero.lane}</span>
              <span class="tag-badge">${hero.role}</span>
            </div>
          </div>
        </div>

        <div class="card-reason danger">
          ${entry.reason}
        </div>

        <div class="card-footer-stats">
          <span style="color: var(--danger-red); font-weight: 600;">Severely Countered</span>
          <span style="color: var(--text-dim); font-size: 0.75rem;">Winrate drop vs ${opponent.name}</span>
        </div>
      </div>
    `;
  }

  // ==================== 5V5 DRAFT MODE VIEW ====================
  renderDraftView() {
    this.renderDraftSlots();
    this.renderDraftHeroPicker();
    this.renderDraftAnalysis();
  }

  renderDraftSlots() {
    // Enemy Slots (Red)
    const enemyLanes = ['Gold', 'EXP', 'Mid', 'Roam', 'Jungle'];
    this.enemySlotsContainer.innerHTML = [0, 1, 2, 3, 4].map(idx => {
      const heroId = this.enemyDraft[idx];
      const hero = heroId ? this.engine.getHeroById(heroId) : null;
      const isActive = this.draftPickingTarget.side === 'enemy' && this.draftPickingTarget.slot === idx;
      
      if (hero) {
        return `
          <div class="draft-slot filled" data-side="enemy" data-slot="${idx}">
            ${this.getHeroAvatarHtml(hero, 'slot-avatar')}
            <button class="btn-remove-slot" title="Remove" onclick="event.stopPropagation(); window.mlbbApp.removeDraftPick('enemy', ${idx})">✕</button>
            <span style="position: absolute; bottom: 2px; font-size: 0.65rem; font-weight: 700; color: white; text-shadow: 0 1px 3px black; background: rgba(0,0,0,0.65); padding: 0 4px; border-radius: 2px; max-width: 90%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${hero.name}
            </span>
          </div>
        `;
      } else {
        return `
          <div class="draft-slot ${isActive ? 'active-slot' : ''}" data-side="enemy" data-slot="${idx}">
            <div class="slot-placeholder">
              <span class="slot-role-icon">⚔️</span>
              <span>Slot ${idx+1}</span>
            </div>
          </div>
        `;
      }
    }).join('');

    // Ally Slots (Blue)
    this.allySlotsContainer.innerHTML = [0, 1, 2, 3, 4].map(idx => {
      const heroId = this.allyDraft[idx];
      const hero = heroId ? this.engine.getHeroById(heroId) : null;
      const isActive = this.draftPickingTarget.side === 'ally' && this.draftPickingTarget.slot === idx;

      if (hero) {
        return `
          <div class="draft-slot filled" data-side="ally" data-slot="${idx}">
            ${this.getHeroAvatarHtml(hero, 'slot-avatar')}
            <button class="btn-remove-slot" title="Remove" onclick="event.stopPropagation(); window.mlbbApp.removeDraftPick('ally', ${idx})">✕</button>
            <span style="position: absolute; bottom: 2px; font-size: 0.65rem; font-weight: 700; color: white; text-shadow: 0 1px 3px black; background: rgba(0,0,0,0.65); padding: 0 4px; border-radius: 2px; max-width: 90%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${hero.name}
            </span>
          </div>
        `;
      } else {
        return `
          <div class="draft-slot ${isActive ? 'active-slot' : ''}" data-side="ally" data-slot="${idx}">
            <div class="slot-placeholder">
              <span class="slot-role-icon">🛡️</span>
              <span>Slot ${idx+1}</span>
            </div>
          </div>
        `;
      }
    }).join('');

    // Click to choose active slot
    const allSlots = [...this.enemySlotsContainer.querySelectorAll('.draft-slot'), ...this.allySlotsContainer.querySelectorAll('.draft-slot')];
    allSlots.forEach(el => {
      el.addEventListener('click', () => {
        soundFX.playSelect();
        const side = el.getAttribute('data-side');
        const slot = parseInt(el.getAttribute('data-slot'), 10);
        this.draftPickingTarget = { side, slot };
        this.renderDraftSlots();
      });
      el.addEventListener('mouseenter', () => soundFX.playHover());
    });
  }

  renderDraftHeroPicker(query = '') {
    const heroes = this.engine.getAllHeroes();
    const pickedSet = new Set([...this.enemyDraft, ...this.allyDraft]);

    const filtered = heroes.filter(h => {
      const matchesSearch = !query || h.name.toLowerCase().includes(query) || h.lane.toLowerCase().includes(query) || h.role.toLowerCase().includes(query);
      return matchesSearch;
    });

    this.draftRosterPicker.innerHTML = filtered.map(h => {
      const isPicked = pickedSet.has(h.id);
      return `
        <button class="hero-thumb-btn ${isPicked ? 'picked' : ''}" data-id="${h.id}" ${isPicked ? 'disabled style="opacity: 0.35; filter: grayscale(1); cursor: not-allowed;"' : ''} title="${h.name} (${h.lane})">
          ${this.getHeroAvatarHtml(h, 'hero-thumb-avatar')}
          <span class="hero-thumb-name">${h.name}</span>
        </button>
      `;
    }).join('');

    this.draftRosterPicker.querySelectorAll('.hero-thumb-btn:not([disabled])').forEach(btn => {
      btn.addEventListener('click', () => {
        soundFX.playLockIn();
        const heroId = btn.getAttribute('data-id');
        this.addDraftPick(this.draftPickingTarget.side, this.draftPickingTarget.slot, heroId);
      });
      btn.addEventListener('mouseenter', () => soundFX.playHover());
    });
  }

  addDraftPick(side, slotIndex, heroId) {
    if (side === 'enemy') {
      this.enemyDraft[slotIndex] = heroId;
      // Auto-advance slot
      const nextSlot = this.enemyDraft.findIndex((h, i) => i > slotIndex && !h);
      if (nextSlot !== -1) {
        this.draftPickingTarget = { side: 'enemy', slot: nextSlot };
      } else {
        const allyEmpty = this.allyDraft.findIndex(h => !h);
        if (allyEmpty !== -1) {
          this.draftPickingTarget = { side: 'ally', slot: allyEmpty };
        }
      }
    } else {
      this.allyDraft[slotIndex] = heroId;
      const nextSlot = this.allyDraft.findIndex((h, i) => i > slotIndex && !h);
      if (nextSlot !== -1) {
        this.draftPickingTarget = { side: 'ally', slot: nextSlot };
      }
    }

    this.renderDraftSlots();
    this.renderDraftHeroPicker();
    this.renderDraftAnalysis();
  }

  removeDraftPick(side, slotIndex) {
    soundFX.playSelect();
    if (side === 'enemy') {
      this.enemyDraft.splice(slotIndex, 1);
      this.draftPickingTarget = { side: 'enemy', slot: Math.max(0, this.enemyDraft.length) };
    } else {
      this.allyDraft.splice(slotIndex, 1);
      this.draftPickingTarget = { side: 'ally', slot: Math.max(0, this.allyDraft.length) };
    }
    this.renderDraftSlots();
    this.renderDraftHeroPicker();
    this.renderDraftAnalysis();
  }

  quickDraftHero(heroId, side = 'ally') {
    const targetArray = side === 'ally' ? this.allyDraft : this.enemyDraft;
    if (targetArray.includes(heroId)) return;
    if (targetArray.length >= 5) {
      alert(`The ${side} team already has 5 heroes selected!`);
      return;
    }
    targetArray.push(heroId);
    soundFX.playLockIn();
    this.renderDraftSlots();
    this.renderDraftHeroPicker();
    this.renderDraftAnalysis();

    // Switch to draft tab to view results
    if (this.currentMode !== 'draft') {
      this.tabDraft.click();
    }
  }

  renderDraftAnalysis() {
    const analysis = this.engine.analyzeTeamDraft(this.enemyDraft, this.allyDraft);
    if (!analysis) {
      this.threatBarsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; color: var(--text-dim); padding: 1.5rem 0;">
          Select at least 1 enemy hero above to calculate composite threat matrix and counter recommendations.
        </div>
      `;
      this.draftInsightsContainer.innerHTML = '';
      this.draftRoleRecsContainer.innerHTML = '';
      return;
    }

    // 1. Render Threat Bars
    const tp = analysis.threatProfile;
    const threats = [
      { label: '⚡ Mobility & Dive', val: tp.mobility, color: 'var(--neon-cyan)' },
      { label: '🛡️ Crowd Control / Setters', val: tp.crowdControl, color: 'var(--mythic-gold)' },
      { label: '🩸 Sustain & Shields', val: tp.sustain, color: 'var(--victory-green)' },
      { label: '⚔️ Physical Burst', val: tp.physicalDamage, color: 'var(--danger-red)' },
      { label: '🔮 Magic Burst', val: tp.magicDamage, color: 'var(--cyber-purple)' },
      { label: '🏰 Frontline Tankiness', val: tp.tankiness, color: '#38bdf8' }
    ];

    this.threatBarsGrid.innerHTML = threats.map(t => `
      <div class="threat-item">
        <div class="threat-top">
          <span style="color: var(--text-muted);">${t.label}</span>
          <span style="font-family: var(--font-heading); font-weight: 700; color: ${t.color};">${t.val}%</span>
        </div>
        <div class="threat-meter">
          <div class="threat-fill" style="width: ${t.val}%; background: ${t.color};"></div>
        </div>
      </div>
    `).join('');

    // 2. Render Strategic Vulnerability Alerts
    this.draftInsightsContainer.innerHTML = analysis.strategicInsights.map(si => `
      <div class="insight-card ${si.type}">
        <div class="insight-badge" style="color: ${si.type === 'danger' ? 'var(--danger-red)' : (si.type === 'warning' ? 'var(--mythic-gold)' : 'var(--neon-cyan)')};">
          ${si.badge}
        </div>
        <div class="insight-text">${si.message}</div>
        <div class="insight-advice">💡 Counterplay: ${si.counterAdvice}</div>
      </div>
    `).join('');

    // 3. Render Role Recommendations Tabs
    const lanes = ['Gold', 'EXP', 'Mid', 'Roam', 'Jungle'];
    this.draftRoleTabsContainer.innerHTML = lanes.map(lane => {
      const topRec = (analysis.roleRecommendations[lane] || [])[0];
      const isFilled = analysis.allyHeroes.some(h => h.lane === lane || h.secondaryLane === lane);
      return `
        <button class="lane-pill ${this.draftActiveRoleTab === lane ? 'active' : ''}" data-role-tab="${lane}">
          ${lane} Lane ${isFilled ? '✓' : (topRec ? `(${topRec.hero.name})` : '')}
        </button>
      `;
    }).join('');

    this.draftRoleTabsContainer.querySelectorAll('.lane-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        soundFX.playSelect();
        this.draftActiveRoleTab = btn.getAttribute('data-role-tab');
        this.renderDraftRoleRecs(analysis);
        this.renderDraftAnalysis();
      });
      btn.addEventListener('mouseenter', () => soundFX.playHover());
    });

    this.renderDraftRoleRecs(analysis);
  }

  renderDraftRoleRecs(analysis) {
    const list = analysis.roleRecommendations[this.draftActiveRoleTab] || [];
    if (list.length === 0) {
      this.draftRoleRecsContainer.innerHTML = `
        <div style="text-align: center; color: var(--text-dim); padding: 1.5rem 0;">
          No unpicked heroes available for this role.
        </div>
      `;
      return;
    }

    this.draftRoleRecsContainer.innerHTML = `
      <div class="counter-cards-grid">
        ${list.slice(0, 4).map((entry, idx) => {
          const hero = entry.hero;
          const initials = hero.name.substring(0, 2).toUpperCase();
          const counteredNames = entry.counteredEnemies.map(ce => ce.enemy.name).join(', ') || 'General synergy';
          const isTopMvp = analysis.overallMvp && analysis.overallMvp.hero.id === hero.id;

          return `
            <div class="counter-card" style="${isTopMvp ? 'border: 2px solid var(--mythic-gold); box-shadow: 0 0 20px var(--mythic-gold-glow);' : ''}">
              <div class="card-top-row">
                ${this.getHeroAvatarHtml(hero, 'card-avatar')}
                <div class="card-info">
                  <h4>
                    ${hero.name}
                    ${isTopMvp ? '<span class="rank-tag" style="font-size: 0.6rem;">★ DRAFT MVP</span>' : ''}
                  </h4>
                  <div class="card-tags">
                    <span class="tag-badge lane-badge">${hero.lane}</span>
                    <span class="tag-badge">${hero.role}</span>
                  </div>
                </div>
              </div>

              <div class="card-reason">
                <strong>Directly counters:</strong> ${counteredNames}.
                ${entry.counteredEnemies[0] ? `<br><small style="color: #94a3b8;">${entry.counteredEnemies[0].reason}</small>` : ''}
              </div>

              <div class="card-footer-stats">
                <div class="score-meter">
                  <span>Match Score:</span>
                  <span>${entry.score}%</span>
                </div>
                <button class="btn-primary" style="padding: 0.35rem 0.85rem; font-size: 0.8rem;" onclick="window.mlbbApp.quickDraftHero('${hero.id}', 'ally')">
                  Lock Pick
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // ==================== HERO DATABASE & META VIEW ====================
  renderDatabaseView() {
    if (this.activeCodexTab === 'items') {
      this.renderItemsCodexView();
      return;
    }

    const heroes = this.engine.getAllHeroes();
    const filtered = heroes.filter(h => {
      const matchSearch = !this.dbSearchQuery || h.name.toLowerCase().includes(this.dbSearchQuery) || h.tags.some(t => t.toLowerCase().includes(this.dbSearchQuery));
      const matchLane = this.dbLaneFilter === 'ALL' || h.lane === this.dbLaneFilter || h.secondaryLane === this.dbLaneFilter;
      return matchSearch && matchLane;
    });

    if (filtered.length === 0) {
      this.dbRosterGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; color: var(--text-dim); padding: 3rem;">
          No heroes match your filter criteria.
        </div>
      `;
      return;
    }

    this.dbRosterGrid.innerHTML = filtered.map(h => {
      const hardCountersCount = (h.counteredBy || []).filter(c => c.tier === 'S').length;
      const countersCount = (h.counters || []).length;

      return `
        <div class="database-hero-card" data-id="${h.id}">
          <div class="card-top-row">
            ${this.getHeroAvatarHtml(h, 'card-avatar')}
            <div class="card-info">
              <h4 style="font-size: 1.25rem;">${h.name}</h4>
              <div class="card-tags">
                <span class="tag-badge lane-badge">${h.lane} Lane</span>
                <span class="tag-badge">${h.role}</span>
                <span class="tag-badge">${h.damageType}</span>
              </div>
            </div>
          </div>

          <div style="font-size: 0.8rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 0.25rem;">
            <div><strong>Key Archetype:</strong> ${h.tags ? h.tags.slice(0, 2).join(' • ') : 'Standard'}</div>
            <div><strong>Counters:</strong> ${countersCount} heroes</div>
            <div><strong>Hard Countered By:</strong> ${hardCountersCount} S-Tier threats</div>
          </div>

          <div class="card-footer-stats" style="margin-top: auto;">
            <button class="btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;" onclick="event.stopPropagation(); window.mlbbApp.viewHeroDetails('${h.id}')">
              View Guide & Skills
            </button>
            <button class="btn-primary" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;" onclick="event.stopPropagation(); window.mlbbApp.selectDuelOpponent('${h.id}')">
              Find Counters →
            </button>
          </div>
        </div>
      `;
    }).join('');

    this.dbRosterGrid.querySelectorAll('.database-hero-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        this.viewHeroDetails(id);
      });
      card.addEventListener('mouseenter', () => soundFX.playHover());
    });
  }

  // ==================== EQUIPMENT PASSIVES & CODEX VIEW ====================
  renderItemsCodexView() {
    if (!this.dbItemsGrid) return;

    // Render Category Filter Pills
    if (this.dbItemCategoryFilter) {
      const categories = [
        { id: 'ALL', label: 'All Items' },
        { id: 'Defense', label: '🛡️ Defense' },
        { id: 'Attack', label: '⚔️ Attack' },
        { id: 'Magic', label: '🔮 Magic' },
        { id: 'Movement', label: '👢 Movement' }
      ];

      this.dbItemCategoryFilter.innerHTML = categories.map(c => `
        <button class="lane-pill ${this.itemCategoryFilter === c.id ? 'active' : ''}" data-cat="${c.id}">
          ${c.label}
        </button>
      `).join('');

      this.dbItemCategoryFilter.querySelectorAll('.lane-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          soundFX.playSelect();
          this.itemCategoryFilter = btn.getAttribute('data-cat');
          this.renderItemsCodexView();
        });
        btn.addEventListener('mouseenter', () => soundFX.playHover());
      });
    }

    const items = Object.values(MLBB_ITEMS);
    const searchLower = (this.itemSearchQuery || '').toLowerCase().trim();

    const filtered = items.filter(item => {
      const itemCat = item.category || item.type || 'Defense';
      const matchCat = this.itemCategoryFilter === 'ALL' || itemCat.toLowerCase() === this.itemCategoryFilter.toLowerCase();

      let matchSearch = true;
      if (searchLower) {
        const passivesText = (item.uniquePassives || []).map(p => `${p.name} ${p.effect}`).join(' ').toLowerCase();
        const activesText = (item.uniqueActives || []).map(a => `${a.name} ${a.effect}`).join(' ').toLowerCase();
        const statsText = (item.stats || []).join(' ').toLowerCase();
        const nameText = (item.name || '').toLowerCase();
        const synergyText = (item.counterSynergy || '').toLowerCase();
        const descText = (item.desc || '').toLowerCase();

        matchSearch = nameText.includes(searchLower) ||
          passivesText.includes(searchLower) ||
          activesText.includes(searchLower) ||
          statsText.includes(searchLower) ||
          synergyText.includes(searchLower) ||
          descText.includes(searchLower);
      }

      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      this.dbItemsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; color: var(--text-dim); padding: 3rem;">
          No equipment items match "${this.itemSearchQuery}". Try another keyword (e.g. "anti-heal", "shield", "deter", "magic").
        </div>
      `;
      return;
    }

    this.dbItemsGrid.innerHTML = filtered.map(item => {
      const statsChips = (item.stats || []).map(s => `<span class="stat-chip">${s}</span>`).join('');
      const passivesList = (item.uniquePassives || []).map(p => `
        <div style="margin-bottom: 0.35rem;">
          <strong class="passive-preview-title">${p.name}:</strong>
          <span style="color: #cbd5e1; font-size: 0.78rem;"> ${p.effect}</span>
        </div>
      `).join('');

      const activesList = (item.uniqueActives || []).map(a => `
        <div style="margin-bottom: 0.35rem; color: var(--neon-cyan);">
          <strong style="color: var(--neon-cyan); font-size: 0.78rem;">Active - ${a.name} (CD: ${a.cooldown || '60s'}):</strong>
          <span style="color: #bae6fd; font-size: 0.78rem;"> ${a.effect}</span>
        </div>
      `).join('');

      return `
        <div class="item-codex-card" data-id="${item.id}" onclick="window.mlbbApp.openItemDetailsModal('${item.id}')">
          <div class="item-codex-top">
            ${this.getItemSymbolHtml(item, 'slot-item-symbol')}
            <div class="item-codex-meta">
              <div class="item-codex-title">${item.name}</div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span class="slot-type-badge type-${(item.category || item.type || 'defense').toLowerCase()}">${item.category || item.type || 'DEFENSE'}</span>
                <span class="item-cost-badge">💰 ${item.cost || 2000} Gold</span>
              </div>
            </div>
          </div>

          <div class="item-stats-chips">
            ${statsChips}
          </div>

          <div class="item-codex-passives-preview">
            ${passivesList || ''}
            ${activesList || ''}
          </div>

          <div style="font-size: 0.78rem; color: #86efac; line-height: 1.4; background: rgba(16, 185, 129, 0.08); padding: 0.5rem 0.65rem; border-radius: var(--radius-sm); border-left: 2px solid var(--victory-green);">
            <strong>🎯 Counter Synergies:</strong> ${item.counterSynergy || item.desc}
          </div>

          <div style="margin-top: auto; display: flex; justify-content: flex-end;">
            <button class="item-inspect-hint" onclick="event.stopPropagation(); window.mlbbApp.openItemDetailsModal('${item.id}')">
              Inspect Full Passives & Actives 🔍
            </button>
          </div>
        </div>
      `;
    }).join('');

    this.dbItemsGrid.querySelectorAll('.item-codex-card').forEach(card => {
      card.addEventListener('mouseenter', () => soundFX.playHover());
    });
  }

  openItemDetailsModal(itemId) {
    soundFX.playSelect();
    const cleanId = String(itemId).toLowerCase().replace(/[^a-z0-9_]/g, '_');
    const upperId = cleanId.toUpperCase();
    const item = MLBB_ITEMS[itemId] || 
      MLBB_ITEMS[upperId] ||
      Object.values(MLBB_ITEMS).find(x => x.id === cleanId || x.name.toLowerCase() === String(itemId).toLowerCase() || (x.id && cleanId.includes(x.id))) ||
      {
        id: cleanId,
        name: itemId,
        type: 'Defense',
        category: 'Defense',
        cost: 2000,
        stats: ['+Specialized Defense Attributes'],
        desc: 'Advanced equipment item designed for tactical counterplay.',
        uniquePassives: [{ name: 'Unique Passive', effect: 'Provides defensive advantages against enemy threats.' }],
        counterSynergy: 'Core counter equipment built to neutralize specific opponent advantages.'
      };

    this.modalTitle.textContent = `${item.name} — Equipment & Passive Dossier`;

    const passivesHtml = (item.uniquePassives && item.uniquePassives.length > 0)
      ? item.uniquePassives.map(p => `
          <div class="dossier-passive-item">
            <div class="dossier-passive-name">⚡ ${p.name}</div>
            <div class="dossier-passive-desc">${p.effect}</div>
          </div>
        `).join('')
      : `<div class="dossier-passive-item"><div class="dossier-passive-desc">No unique passive attributes.</div></div>`;

    const activesHtml = (item.uniqueActives && item.uniqueActives.length > 0)
      ? `
        <div class="item-dossier-section">
          <div class="item-dossier-section-title" style="color: var(--neon-cyan);">
            <span>⚡</span> UNIQUE ACTIVE ABILITIES
          </div>
          <div class="dossier-passives-list">
            ${item.uniqueActives.map(a => `
              <div class="dossier-passive-item active-ability">
                <div class="dossier-passive-name" style="color: var(--neon-cyan); display: flex; justify-content: space-between; align-items: center;">
                  <span>🎯 Active: ${a.name}</span>
                  ${a.cooldown ? `<span style="font-size: 0.75rem; background: rgba(0,240,255,0.15); border: 1px solid rgba(0,240,255,0.3); padding: 0.15rem 0.5rem; border-radius: 4px; color: var(--neon-cyan);">CD: ${a.cooldown}</span>` : ''}
                </div>
                <div class="dossier-passive-desc">${a.effect}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `
      : '';

    const statsChipsHtml = (item.stats && item.stats.length > 0)
      ? item.stats.map(s => `<span class="stat-chip" style="font-size: 0.85rem; padding: 0.35rem 0.75rem;">${s}</span>`).join('')
      : `<span class="stat-chip">+Standard Attributes</span>`;

    this.modalBody.innerHTML = `
      <div class="item-dossier-wrap">
        <!-- Hero Header -->
        <div class="item-dossier-hero">
          ${this.getItemSymbolHtml(item, 'item-dossier-symbol')}
          <div class="item-dossier-meta">
            <h2 class="item-dossier-name">${item.name}</h2>
            <div class="item-dossier-badges">
              <span class="slot-type-badge type-${(item.category || item.type || 'defense').toLowerCase()}">${item.category || item.type || 'DEFENSE'}</span>
              <span class="dossier-cost-pill">💰 ${item.cost || 2000} Gold</span>
            </div>
          </div>
        </div>

        <!-- Base Stats -->
        <div class="item-dossier-section">
          <div class="item-dossier-section-title">
            <span>📊</span> BASE ATTRIBUTES & STATS
          </div>
          <div class="item-stats-chips">
            ${statsChipsHtml}
          </div>
        </div>

        <!-- Unique Passives -->
        <div class="item-dossier-section">
          <div class="item-dossier-section-title" style="color: var(--mythic-gold);">
            <span>🛡️</span> UNIQUE PASSIVES & COMBAT TRIGGERS
          </div>
          <div class="dossier-passives-list">
            ${passivesHtml}
          </div>
        </div>

        <!-- Unique Actives (if any) -->
        ${activesHtml}

        <!-- Tactical Counter Synergy & Usage -->
        <div class="item-dossier-section">
          <div class="item-dossier-section-title" style="color: var(--victory-green);">
            <span>🎯</span> MATCHUP COUNTER SYNERGY & STRATEGY
          </div>
          <div class="dossier-synergy-box">
            ${item.counterSynergy || item.desc}
          </div>
        </div>

        <!-- Footer Action -->
        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 0.5rem;">
          <button class="btn-primary" onclick="window.mlbbApp.closeModal()">Close Dossier</button>
        </div>
      </div>
    `;

    this.openModal();
  }

  selectDuelOpponent(heroId) {
    soundFX.playSelect();
    this.selectedOpponentId = heroId;
    this.tabDuel.click();
  }

  viewHeroDetails(heroId) {
    const hero = this.engine.getHeroById(heroId);
    if (!hero) return;

    soundFX.playSelect();

    const countersList = (hero.counters || []).map(c => {
      const target = this.engine.getHeroById(c.heroId);
      return `<li style="margin-bottom: 0.35rem;"><strong>${target ? target.name : c.heroId}:</strong> ${c.reason}</li>`;
    }).join('') || '<li>None defined</li>';

    const counteredByList = (hero.counteredBy || []).map(c => {
      const target = this.engine.getHeroById(c.heroId);
      return `<li style="margin-bottom: 0.35rem;"><span class="tier-badge ${c.tier === 'S' ? 's-tier' : 'a-tier'}" style="font-size: 0.7rem;">${c.tier}</span> <strong>${target ? target.name : c.heroId}:</strong> ${c.reason}</li>`;
    }).join('') || '<li>None defined</li>';

    const itemsChipsHtml = (hero.counterItems || []).map(k => {
      const itemObj = MLBB_ITEMS[k] || Object.values(MLBB_ITEMS).find(x => x.name.toLowerCase() === k.toLowerCase() || (x.id && k.toLowerCase().includes(x.id)));
      const itemName = itemObj ? itemObj.name : k;
      const itemId = itemObj ? itemObj.id : k;
      return `<button class="item-chip clickable-item-slot" style="display: inline-flex; margin: 0.2rem;" onclick="window.mlbbApp.openItemDetailsModal('${itemId}')"><strong>${itemName}</strong> <span style="color: var(--mythic-gold); font-size: 0.7rem;">🔍</span></button>`;
    }).join(' ') || '<span style="color: var(--text-muted);">Standard builds</span>';

    const counterBuild = this.engine.getCounterBuild(heroId);

    this.modalTitle.textContent = `${hero.name} — Hero Strategy & Counter Dossier`;
    this.modalBody.innerHTML = `
      <div style="display: flex; gap: 1.25rem; align-items: center; margin-bottom: 1.25rem;">
        ${this.getHeroAvatarHtml(hero, 'modal-hero-avatar', 'width: 72px; height: 72px; border-radius: var(--radius-md); overflow: hidden; flex-shrink: 0; box-shadow: 0 4px 15px rgba(0,0,0,0.5);')}
        <div>
          <h2 style="font-family: var(--font-heading); font-size: 1.75rem; text-transform: uppercase;">${hero.name}</h2>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.25rem;">
            <span class="tag-badge lane-badge">${hero.lane} Lane</span>
            <span class="tag-badge">${hero.role}</span>
            <span class="tag-badge">${hero.damageType}</span>
            <span class="tag-badge">Difficulty: ${hero.difficulty}</span>
          </div>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <!-- Hero Skills & Passive Breakdown in Dossier -->
        ${hero.skills ? `
        <div style="background: var(--bg-elevated); padding: 1.15rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); display: flex; flex-direction: column; gap: 0.85rem;">
          <h4 style="color: var(--neon-cyan); font-family: var(--font-heading); font-size: 1.15rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>🔮</span> COMPLETE SKILLS & PASSIVE BREAKDOWN
          </h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.75rem;">
            ${[
              { key: 'passive', label: 'Passive Ability', icon: '🛡️', skill: hero.skills.passive },
              { key: 'skill1', label: 'Skill 1', icon: '1️⃣', skill: hero.skills.skill1 },
              { key: 'skill2', label: 'Skill 2', icon: '2️⃣', skill: hero.skills.skill2 },
              { key: 'ultimate', label: 'Ultimate Ability', icon: '⚡', skill: hero.skills.ultimate }
            ].filter(item => Boolean(item.skill)).map(item => `
              <div style="background: rgba(14,21,37,0.85); border: 1px solid rgba(255,255,255,0.08); border-radius: var(--radius-sm); padding: 0.85rem; display: flex; flex-direction: column; gap: 0.4rem;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span style="font-size: 0.72rem; color: var(--neon-cyan); font-weight: 800; font-family: var(--font-heading);">${item.icon} ${item.label.toUpperCase()}</span>
                  <span class="skill-tag-pill" style="font-size: 0.65rem; padding: 0.1rem 0.45rem;">${item.skill.tag || 'Ability'}</span>
                </div>
                <strong style="color: white; font-size: 0.95rem; font-family: var(--font-heading);">${item.skill.name}</strong>
                <p style="font-size: 0.8rem; color: #cbd5e1; line-height: 1.45; margin: 0;">${item.skill.desc}</p>
                <div style="background: rgba(16, 185, 129, 0.1); border-left: 2px solid var(--victory-green); padding: 0.4rem 0.6rem; border-radius: 3px; font-size: 0.76rem; color: #d1fae5; margin-top: auto;">
                  <strong>🎯 How to Counter:</strong> ${item.skill.counterTip}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <div style="background: var(--bg-elevated); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <h4 style="color: var(--mythic-gold); margin-bottom: 0.5rem; font-family: var(--font-heading); font-size: 1.1rem;">⚡ Heroes That ${hero.name} Counters</h4>
          <ul style="padding-left: 1.25rem; font-size: 0.88rem; color: #cbd5e1;">
            ${countersList}
          </ul>
        </div>

        <div style="background: var(--bg-elevated); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <h4 style="color: var(--danger-red); margin-bottom: 0.5rem; font-family: var(--font-heading); font-size: 1.1rem;">🛡️ Heroes That Hard-Counter ${hero.name}</h4>
          <ul style="padding-left: 1.25rem; font-size: 0.88rem; color: #cbd5e1;">
            ${counteredByList}
          </ul>
        </div>

        ${counterBuild ? `
        <div style="background: var(--bg-elevated); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <h4 style="color: var(--neon-cyan); margin-bottom: 0.75rem; font-family: var(--font-heading); font-size: 1.15rem;">🛡️ Situational Counter Equipment Build (Click Item for Passives)</h4>
          <div class="rush-alert-banner" style="margin-bottom: 0.75rem; padding: 0.5rem 0.75rem;">
            <span>💡</span>
            <span style="font-size: 0.82rem;"><strong>Rush Tip:</strong> ${counterBuild.rushStrategy}</span>
          </div>
          <div class="modal-build-grid">
            ${counterBuild.items.map(s => `
              <div class="modal-build-slot clickable-item-slot" title="Click to inspect passives for ${s.item.name}" onclick="window.mlbbApp.openItemDetailsModal('${s.item.id}')">
                <span class="slot-tag-label" style="font-size: 0.68rem;">${s.slotName}</span>
                <div class="modal-item-row">
                  ${this.getItemSymbolHtml(s.item, 'modal-item-symbol')}
                  <strong style="font-size: 0.88rem;">${s.item.name}</strong>
                </div>
                <span class="modal-item-reason">${s.reason}</span>
                <span style="font-size: 0.7rem; color: var(--mythic-gold); margin-top: auto;">Inspect Passives 🔍</span>
              </div>
            `).join('')}
          </div>
          <div class="modal-build-footer">
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              <strong>Battle Spell:</strong>
              ${this.getSpellSymbolHtml(counterBuild.battleSpell, 'mini-inline-spell')}
              <span style="color: var(--mythic-gold); font-weight: 700;">${counterBuild.battleSpell.name}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              <strong>Emblem:</strong>
              ${this.getEmblemSymbolHtml(counterBuild.emblem, 'mini-inline-emblem')}
              <span style="color: var(--neon-cyan); font-weight: 700;">${counterBuild.emblem.name}</span>
            </div>
          </div>
        </div>
        ` : ''}

        <div style="background: var(--bg-elevated); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); font-size: 0.9rem;">
          <div><strong>Core Equipment Counters:</strong> ${itemsChipsHtml}</div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 0.5rem;">
          <button class="btn-secondary" onclick="window.mlbbApp.openHeroEditorModal('${hero.id}')">Edit Matchup Data</button>
          <button class="btn-primary" onclick="window.mlbbApp.selectDuelOpponent('${hero.id}'); window.mlbbApp.closeModal();">Analyze As Opponent</button>
        </div>
      </div>
    `;

    this.openModal();
  }

  // ==================== CUSTOM HERO / META EDITOR ====================
  openHeroEditorModal(heroId = null) {
    soundFX.playSelect();
    const hero = heroId ? this.engine.getHeroById(heroId) : null;
    const isEditing = Boolean(hero);

    this.modalTitle.textContent = isEditing ? `Edit Hero: ${hero.name}` : `Create New Custom Hero / Roster Entry`;

    const allHeroes = this.engine.getAllHeroes();
    const heroOptions = allHeroes.map(h => `<option value="${h.id}">${h.name} (${h.lane})</option>`).join('');

    this.modalBody.innerHTML = `
      <form id="heroEditorForm" style="display: flex; flex-direction: column; gap: 0.85rem;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem;">
          <div class="form-group">
            <label class="form-label">Hero Name *</label>
            <input type="text" id="editHeroName" class="form-input" required value="${hero ? hero.name : ''}" placeholder="e.g. Cici">
          </div>
          <div class="form-group">
            <label class="form-label">Hero ID (Lowercase slug) *</label>
            <input type="text" id="editHeroId" class="form-input" required value="${hero ? hero.id : ''}" ${isEditing ? 'readonly style="opacity: 0.7;"' : ''} placeholder="e.g. cici">
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.85rem;">
          <div class="form-group">
            <label class="form-label">Primary Lane *</label>
            <select id="editHeroLane" class="form-select">
              <option value="Gold" ${hero && hero.lane === 'Gold' ? 'selected' : ''}>Gold Lane</option>
              <option value="EXP" ${hero && hero.lane === 'EXP' ? 'selected' : ''}>EXP Lane</option>
              <option value="Mid" ${hero && hero.lane === 'Mid' ? 'selected' : ''}>Mid Lane</option>
              <option value="Roam" ${hero && hero.lane === 'Roam' ? 'selected' : ''}>Roam</option>
              <option value="Jungle" ${hero && hero.lane === 'Jungle' ? 'selected' : ''}>Jungle</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Role *</label>
            <select id="editHeroRole" class="form-select">
              <option value="Marksman" ${hero && hero.role === 'Marksman' ? 'selected' : ''}>Marksman</option>
              <option value="Fighter" ${hero && hero.role === 'Fighter' ? 'selected' : ''}>Fighter</option>
              <option value="Mage" ${hero && hero.role === 'Mage' ? 'selected' : ''}>Mage</option>
              <option value="Assassin" ${hero && hero.role === 'Assassin' ? 'selected' : ''}>Assassin</option>
              <option value="Tank" ${hero && hero.role === 'Tank' ? 'selected' : ''}>Tank</option>
              <option value="Support" ${hero && hero.role === 'Support' ? 'selected' : ''}>Support</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Damage Type *</label>
            <select id="editHeroDmg" class="form-select">
              <option value="Physical" ${hero && hero.damageType === 'Physical' ? 'selected' : ''}>Physical</option>
              <option value="Magic" ${hero && hero.damageType === 'Magic' ? 'selected' : ''}>Magic</option>
              <option value="True Damage" ${hero && hero.damageType === 'True Damage' ? 'selected' : ''}>True Damage</option>
              <option value="Hybrid" ${hero && hero.damageType === 'Hybrid' ? 'selected' : ''}>Hybrid</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Key Archetype Tags (Comma separated)</label>
          <input type="text" id="editHeroTags" class="form-input" value="${hero && hero.tags ? hero.tags.join(', ') : ''}" placeholder="e.g. High Mobility, Spell Vamp, Knockup">
        </div>

        <div class="form-group">
          <label class="form-label">Recommended Battle Spell</label>
          <input type="text" id="editHeroSpell" class="form-input" value="${hero && hero.recommendedSpell ? hero.recommendedSpell : 'Flicker'}" placeholder="e.g. Purify / Flicker">
        </div>

        <div class="form-group">
          <label class="form-label">Tactical Counter Tip 1</label>
          <input type="text" id="editHeroTip1" class="form-input" value="${hero && hero.tacticalTips ? hero.tacticalTips[0] || '' : ''}" placeholder="Key weakness to exploit...">
        </div>

        <div class="form-group">
          <label class="form-label">Tactical Counter Tip 2</label>
          <input type="text" id="editHeroTip2" class="form-input" value="${hero && hero.tacticalTips ? hero.tacticalTips[1] || '' : ''}" placeholder="Positioning or cooldown tip...">
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
          ${isEditing ? `
            <button type="button" class="btn-secondary" style="color: var(--danger-red); border-color: rgba(244,63,94,0.4);" onclick="window.mlbbApp.deleteCustomHero('${hero.id}')">
              Delete Hero
            </button>
          ` : '<span></span>'}
          <div style="display: flex; gap: 0.75rem;">
            <button type="button" class="btn-secondary" onclick="window.mlbbApp.closeModal()">Cancel</button>
            <button type="submit" class="btn-primary">Save Hero Entry</button>
          </div>
        </div>
      </form>
    `;

    const form = document.getElementById('heroEditorForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveHeroFromForm(heroId);
    });

    this.openModal();
  }

  saveHeroFromForm(originalHeroId) {
    const id = (document.getElementById('editHeroId').value || '').trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
    const name = document.getElementById('editHeroName').value.trim();
    const lane = document.getElementById('editHeroLane').value;
    const role = document.getElementById('editHeroRole').value;
    const damageType = document.getElementById('editHeroDmg').value;
    const tags = document.getElementById('editHeroTags').value.split(',').map(t => t.trim()).filter(Boolean);
    const spell = document.getElementById('editHeroSpell').value.trim();
    const tip1 = document.getElementById('editHeroTip1').value.trim();
    const tip2 = document.getElementById('editHeroTip2').value.trim();

    if (!id || !name) {
      alert('Please provide Hero Name and valid ID.');
      return;
    }

    const existingIndex = this.heroes.findIndex(h => h.id === (originalHeroId || id));
    const baseObj = existingIndex !== -1 ? this.heroes[existingIndex] : {
      counters: [],
      counteredBy: [],
      avoidPicks: [],
      counterItems: ['DOMINANCE_ICE', 'ATHENAS_SHIELD'],
      powerSpikes: { early: 3, mid: 4, late: 4 }
    };

    const updatedHero = {
      ...baseObj,
      id: id,
      name: name,
      lane: lane,
      role: role,
      damageType: damageType,
      difficulty: baseObj.difficulty || 'Medium',
      avatarBg: baseObj.avatarBg || 'linear-gradient(135deg, #0284c7, #38bdf8)',
      tags: tags.length > 0 ? tags : ['Custom Meta Pick'],
      recommendedSpell: spell || 'Flicker',
      tacticalTips: [tip1, tip2].filter(Boolean)
    };

    if (existingIndex !== -1) {
      this.heroes[existingIndex] = updatedHero;
    } else {
      this.heroes.push(updatedHero);
    }

    this.saveHeroes();
    soundFX.playTierS();
    this.closeModal();
    this.render();
  }

  deleteCustomHero(heroId) {
    if (!confirm(`Are you sure you want to delete ${heroId}?`)) return;
    this.heroes = this.heroes.filter(h => h.id !== heroId);
    this.saveHeroes();
    soundFX.playSelect();
    this.closeModal();
    this.render();
  }

  exportMetaJson() {
    soundFX.playSelect();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.heroes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `mlbb_counter_meta_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  importMetaJson(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported) && imported.length > 0) {
          this.heroes = imported;
          this.saveHeroes();
          soundFX.playTierS();
          alert(`Successfully imported ${imported.length} heroes!`);
          this.render();
        } else {
          alert('Invalid JSON file structure. Expected an array of MLBB heroes.');
        }
      } catch (err) {
        alert('Failed to parse JSON file: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  openModal() {
    this.modalOverlay.classList.add('open');
  }

  closeModal() {
    this.modalOverlay.classList.remove('open');
  }
}

// Global App Initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.mlbbApp = new MLBBApp();
  });
} else {
  window.mlbbApp = new MLBBApp();
}
