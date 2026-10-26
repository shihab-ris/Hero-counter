// MLBB Counter Calculation & Draft Analysis Engine

import { INITIAL_HEROES, MLBB_ROLES, MLBB_ITEMS, MLBB_SPELLS, MLBB_EMBLEMS } from './data.js';

export class CounterEngine {
  constructor(heroesList = INITIAL_HEROES) {
    this.heroes = [...heroesList];
    this.heroMap = new Map(this.heroes.map(h => [h.id, h]));
  }

  setHeroes(newList) {
    this.heroes = [...newList];
    this.heroMap = new Map(this.heroes.map(h => [h.id, h]));
  }

  getHeroById(id) {
    return this.heroMap.get(id) || null;
  }

  getAllHeroes() {
    return this.heroes;
  }

  /**
   * Generates a full 6-item situational counter build, emblem setup, and spell tailored to counter a specific opponent.
   */
  getCounterBuild(heroId) {
    const hero = this.getHeroById(heroId);
    if (!hero) return null;

    const tags = (hero.tags || []).join(' ').toLowerCase();
    const dmg = hero.damageType;
    const role = hero.role;
    const items = [];
    let spell = MLBB_SPELLS.FLICKER;
    let emblem = MLBB_EMBLEMS.TANK;
    let rushStrategy = '';

    // 1. BOOTS (Movement Counter)
    if (tags.includes('cc') || tags.includes('stun') || tags.includes('knockup') || dmg === 'Magic') {
      items.push({
        slot: 1,
        slotName: 'Counter Boots',
        item: MLBB_ITEMS.TOUGH_BOOTS,
        reason: 'Essential +22 Magic Defense and 30% CC duration reduction to break out of stun chains.'
      });
    } else {
      items.push({
        slot: 1,
        slotName: 'Counter Boots',
        item: MLBB_ITEMS.WARRIOR_BOOTS,
        reason: '+22 Physical Defense, stacking up to +25 extra physical defense when struck by basic attacks.'
      });
    }

    // 2. PRIMARY DEFENSIVE COUNTER ITEM
    if (dmg === 'Magic') {
      if (tags.includes('continuous') || tags.includes('slow') || ['valir', 'yve', 'lunox', 'joy', 'phoveus'].includes(hero.id)) {
        items.push({
          slot: 2,
          slotName: 'Primary Defense',
          item: MLBB_ITEMS.RADIANT_ARMOR,
          reason: 'Stacks magic damage reduction up to 6 times against continuous multi-tick magic damage.'
        });
        rushStrategy = 'Rush Magic Resist Cloak (Lv 1) and Radiant Armor immediately. Athena’s Shield does NOT work against continuous magic!';
      } else {
        items.push({
          slot: 2,
          slotName: 'Primary Defense',
          item: MLBB_ITEMS.ATHENAS_SHIELD,
          reason: 'Provides 25% instant magic damage reduction for 3s to survive lethal burst combos.'
        });
        rushStrategy = 'Rush Silence Robe (Lv 2) before the 5-minute mark to survive ' + hero.name + '’s level 4 power spike.';
      }
    } else if (dmg === 'True Damage') {
      items.push({
        slot: 2,
        slotName: 'Primary Defense',
        item: MLBB_ITEMS.TWILIGHT_ARMOR,
        reason: 'Armor cannot reduce True Damage! Twilight Armor caps massive single-instance bursts to save your life.'
      });
      rushStrategy = 'Do not stack standard armor against True Damage! Prioritize high raw HP and Twilight Armor.';
    } else if (tags.includes('attack speed') || tags.includes('crit') || ['wanwan', 'claude', 'moskov', 'miya'].includes(hero.id)) {
      items.push({
        slot: 2,
        slotName: 'Primary Defense',
        item: MLBB_ITEMS.BLADE_ARMOR,
        reason: 'Huge physical defense + reflects basic attack damage straight back to ' + hero.name + '.'
      });
      rushStrategy = 'Rush Steel Legplates (component) on your first recall; finish Blade Armor to turn their attack speed into self-harm.';
    } else {
      // Physical Skill Burst (Fanny, Paquito, Saber, Hayabusa, Brody)
      items.push({
        slot: 2,
        slotName: 'Primary Defense',
        item: MLBB_ITEMS.ANTIQUE_CUIRASS,
        reason: 'Reduces ' + hero.name + '’s Physical Attack by 24% when struck by skill combos.'
      });
      rushStrategy = 'Rush Dreadnaught Armor (Lv 2) before boots to immediately cut ' + hero.name + '’s skill burst by 16%.';
    }

    // 3. SECONDARY COUNTER ITEM (Sustain cut / Anti-Heal or Immunity)
    if (tags.includes('heal') || tags.includes('regen') || tags.includes('shield') || tags.includes('sustain') || tags.includes('vamp') || ['estes', 'esmeralda', 'ruby', 'dyrroth', 'yu_zhong', 'baxia', 'fredrinn'].includes(hero.id)) {
      items.push({
        slot: 3,
        slotName: 'Anti-Heal / Shield Cut',
        item: MLBB_ITEMS.DOMINANCE_ICE,
        reason: 'Cuts ' + hero.name + '’s healing and shield generation in half while slowing their attack speed.'
      });
      if (!rushStrategy) rushStrategy = 'Rush Dominance Ice or Sea Halberd first item; fighting ' + hero.name + ' without anti-heal is suicide!';
    } else if (dmg === 'Physical') {
      items.push({
        slot: 3,
        slotName: 'Physical Immunity / Mitigation',
        item: MLBB_ITEMS.WIND_OF_NATURE,
        reason: 'Grants 2s total physical damage immunity to survive ' + hero.name + '’s dive and turn the fight.'
      });
    } else {
      items.push({
        slot: 3,
        slotName: 'Magic Lifeline Shield',
        item: MLBB_ITEMS.ROSE_GOLD_METEOR,
        reason: 'Triggers a massive 510-1350 point magic shield and movement speed boost when your HP drops below 30%.'
      });
    }

    // 4. OFFENSIVE PENETRATION / TANK MELTER
    if (role === 'Tank' || tags.includes('tank') || tags.includes('defense') || tags.includes('shield')) {
      items.push({
        slot: 4,
        slotName: 'Tank Shredder',
        item: MLBB_ITEMS.DEMON_HUNTER_SWORD,
        reason: 'Basic attacks deal 8% of target current HP as extra damage, rapidly melting ' + hero.name + '’s high health pool.'
      });
    } else if (dmg === 'Magic') {
      items.push({
        slot: 4,
        slotName: 'Armor Shred',
        item: MLBB_ITEMS.MALEFIC_ROAR,
        reason: 'Grants up to 40% physical armor penetration to slice through hybrid defensive items.'
      });
    } else {
      items.push({
        slot: 4,
        slotName: 'Offensive Counter',
        item: MLBB_ITEMS.MALEFIC_ROAR,
        reason: 'Ensures your damage scales effectively against their armor progression.'
      });
    }

    // 5. ACTIVE IMMUNITY / UTILITY FREEZE
    items.push({
      slot: 5,
      slotName: 'Clutch Invulnerability',
      item: MLBB_ITEMS.WINTER_CROWN,
      reason: 'Freezes for 2 seconds, dodging ' + hero.name + '’s ultimate completely while retaining skill channeling.'
    });

    // 6. REVIVE / LATE GAME INSURANCE
    items.push({
      slot: 6,
      slotName: 'Late Game Insurance',
      item: MLBB_ITEMS.IMMORTALITY,
      reason: 'Brings you back to life 2.5s after death with shield, denying ' + hero.name + ' easy kill resets.'
    });

    // BATTLE SPELL SELECTION
    if (tags.includes('cc') || tags.includes('stun') || ['atlas', 'tigreal', 'guinevere', 'chou'].includes(hero.id)) {
      spell = MLBB_SPELLS.PURIFY;
    } else if (tags.includes('attack speed') || ['claude', 'wanwan', 'moskov', 'miya'].includes(hero.id)) {
      spell = MLBB_SPELLS.VENGEANCE;
    } else if (tags.includes('slow') || ['valir', 'yve'].includes(hero.id)) {
      spell = MLBB_SPELLS.SPRINT;
    } else {
      spell = MLBB_SPELLS.FLICKER;
    }

    // EMBLEM SELECTION
    if (role === 'Tank' || tags.includes('cc') || tags.includes('burst')) {
      emblem = MLBB_EMBLEMS.TANK;
    } else if (dmg === 'Magic') {
      emblem = MLBB_EMBLEMS.FIGHTER;
    } else {
      emblem = MLBB_EMBLEMS.FIGHTER;
    }

    return {
      opponent: hero,
      items,
      battleSpell: spell,
      emblem,
      rushStrategy: rushStrategy || 'Prioritize defensive tier-2 components early before completing full expensive damage items.'
    };
  }

  /**
   * Get 1v1 duel counter analysis for a specific opponent hero.
   */
  getDuelCounters(opponentId, preferredLane = null) {
    const opponent = this.getHeroById(opponentId);
    if (!opponent) return null;

    const sCounters = [];
    const aCounters = [];
    const bCounters = [];
    const avoidPicks = [];

    // 1. Direct counters defined on opponent.counteredBy
    if (opponent.counteredBy) {
      opponent.counteredBy.forEach(item => {
        const hero = this.getHeroById(item.heroId);
        if (!hero) return;
        if (preferredLane && hero.lane !== preferredLane && hero.secondaryLane !== preferredLane) {
          // If preferred lane is specified and hero does not fit, lower its priority or filter
        }

        const entry = {
          hero,
          tier: item.tier || 'A',
          reason: item.reason,
          score: item.tier === 'S' ? 95 : (item.tier === 'A' ? 82 : 68),
          laneMatch: !preferredLane || hero.lane === preferredLane || hero.secondaryLane === preferredLane
        };

        if (item.tier === 'S') sCounters.push(entry);
        else if (item.tier === 'A') aCounters.push(entry);
        else bCounters.push(entry);
      });
    }

    // 2. Discover heroes that list opponent in their "counters" array
    this.heroes.forEach(hero => {
      if (hero.id === opponent.id) return;
      const alreadyIncluded = [...sCounters, ...aCounters, ...bCounters].some(c => c.hero.id === hero.id);
      if (alreadyIncluded) return;

      if (hero.counters) {
        const match = hero.counters.find(c => c.heroId === opponent.id);
        if (match) {
          aCounters.push({
            hero,
            tier: 'A',
            reason: match.reason,
            score: 80,
            laneMatch: !preferredLane || hero.lane === preferredLane || hero.secondaryLane === preferredLane
          });
        }
      }
    });

    // 3. Populate Avoid picks
    if (opponent.counters) {
      opponent.counters.forEach(item => {
        const victim = this.getHeroById(item.heroId);
        if (victim && !avoidPicks.some(v => v.hero.id === victim.id)) {
          avoidPicks.push({
            hero: victim,
            reason: item.reason || `Vulnerable to ${opponent.name}'s kit.`
          });
        }
      });
    }
    if (opponent.avoidPicks) {
      opponent.avoidPicks.forEach(victimId => {
        const victim = this.getHeroById(victimId);
        if (victim && !avoidPicks.some(v => v.hero.id === victim.id)) {
          avoidPicks.push({
            hero: victim,
            reason: `Highly unfavorable matchup against ${opponent.name}.`
          });
        }
      });
    }

    // Sort counter tiers by score & lane match
    const sortFn = (a, b) => {
      if (preferredLane) {
        if (a.laneMatch && !b.laneMatch) return -1;
        if (!a.laneMatch && b.laneMatch) return 1;
      }
      return b.score - a.score;
    };

    sCounters.sort(sortFn);
    aCounters.sort(sortFn);
    bCounters.sort(sortFn);

    // Resolve Counter Items with details
    const resolvedItems = (opponent.counterItems || []).map(key => {
      return MLBB_ITEMS[key] || { name: key, desc: 'Recommended counter equipment.' };
    });

    // Compute full 6-item situational counter build
    const counterBuild = this.getCounterBuild(opponentId);

    return {
      opponent,
      preferredLane,
      sCounters,
      aCounters,
      bCounters,
      avoidPicks,
      recommendedSpell: opponent.recommendedSpell || (counterBuild ? counterBuild.battleSpell.name : 'Flicker'),
      counterItems: resolvedItems,
      counterBuild,
      tacticalTips: opponent.tacticalTips || [],
      powerSpikes: opponent.powerSpikes || { early: 3, mid: 3, late: 3 }
    };
  }

  /**
   * 5v5 Team Draft Composition Analyzer
   * Calculates enemy threats and generates the highest impact counter picks per role.
   */
  analyzeTeamDraft(enemyIds = [], allyIds = []) {
    const enemyHeroes = enemyIds.map(id => this.getHeroById(id)).filter(Boolean);
    const allyHeroes = allyIds.map(id => this.getHeroById(id)).filter(Boolean);

    if (enemyHeroes.length === 0) {
      return null;
    }

    // 1. Calculate Enemy Threat Profile
    let mobilityScore = 0;
    let ccScore = 0;
    let sustainScore = 0;
    let physBurst = 0;
    let magicBurst = 0;
    let tankiness = 0;

    enemyHeroes.forEach(h => {
      const tagsStr = (h.tags || []).join(' ').toLowerCase();
      const role = h.role;

      if (tagsStr.includes('mobility') || tagsStr.includes('cable') || tagsStr.includes('dash') || tagsStr.includes('wall')) {
        mobilityScore += 30;
      }
      if (tagsStr.includes('cc') || tagsStr.includes('pull') || tagsStr.includes('stun') || tagsStr.includes('taunt') || tagsStr.includes('suppression')) {
        ccScore += 30;
      }
      if (tagsStr.includes('heal') || tagsStr.includes('regen') || tagsStr.includes('sustain') || tagsStr.includes('shield') || tagsStr.includes('vamp')) {
        sustainScore += 30;
      }
      if (h.damageType === 'Physical') {
        physBurst += tagsStr.includes('burst') ? 35 : 20;
      } else if (h.damageType === 'Magic') {
        magicBurst += tagsStr.includes('burst') ? 35 : 20;
      } else if (h.damageType === 'Hybrid' || h.damageType === 'True Damage') {
        physBurst += 15;
        magicBurst += 15;
      }
      if (role === 'Tank' || tagsStr.includes('tank') || tagsStr.includes('shield') || tagsStr.includes('armor')) {
        tankiness += 25;
      }
    });

    const clamp = val => Math.min(100, Math.max(10, Math.round(val)));

    const threatProfile = {
      mobility: clamp(mobilityScore),
      crowdControl: clamp(ccScore),
      sustain: clamp(sustainScore),
      physicalDamage: clamp(physBurst),
      magicDamage: clamp(magicBurst),
      tankiness: clamp(tankiness)
    };

    // 2. Formulate Strategic Vulnerability Insights
    const strategicInsights = [];

    if (threatProfile.mobility >= 50) {
      strategicInsights.push({
        type: 'danger',
        badge: '⚡ High Mobility Alert',
        message: 'The enemy has extreme mobility & dive potential (e.g. Fanny/Ling/Wanwan/Joy).',
        counterAdvice: 'Prioritize Anti-Dash / Grounding heroes like Minsitthar, Khufra, or Phoveus and point-click lock-on (Franco/Saber).'
      });
    }

    if (threatProfile.sustain >= 50) {
      strategicInsights.push({
        type: 'warning',
        badge: '🩸 Heavy Sustain & Shields',
        message: 'Enemy composition features heavy healing, lifesteal, or shields.',
        counterAdvice: 'Baxia is high priority. Every allied core must build Dominance Ice, Sea Halberd, or Glowing Wand immediately.'
      });
    }

    if (threatProfile.crowdControl >= 50) {
      strategicInsights.push({
        type: 'warning',
        badge: '🛡️ Heavy Setter Crowd Control',
        message: 'Enemy relies on big 5-man initiation wombo-combos (Atlas/Tigreal/Terizla).',
        counterAdvice: 'Diggie is SSS-Tier pick to cleanse all CC. Squishies should run Purify battle spell and avoid grouping tight.'
      });
    }

    if (threatProfile.physicalDamage >= 70 && threatProfile.magicDamage <= 25) {
      strategicInsights.push({
        type: 'info',
        badge: '⚔️ Heavy Physical Damage',
        message: 'Enemy damage is overwhelmingly Physical with minimal magic threat.',
        counterAdvice: 'Stack Blade Armor, Antique Cuirass, and Wind of Nature. Magic defense is low priority.'
      });
    } else if (threatProfile.magicDamage >= 70 && threatProfile.physicalDamage <= 25) {
      strategicInsights.push({
        type: 'info',
        badge: '🔮 Heavy Magic Damage',
        message: 'Enemy team is heavily Magic-reliant.',
        counterAdvice: 'Prioritize Athena’s Shield (burst) or Radiant Armor (multi-tick/continuous).'
      });
    }

    if (strategicInsights.length === 0) {
      strategicInsights.push({
        type: 'info',
        badge: '⚖️ Balanced Composition',
        message: 'Enemy team has a balanced spread of damage, mobility, and frontline.',
        counterAdvice: 'Focus on direct lane counters and objective control skirmishers.'
      });
    }

    // 3. Identify unfilled roles in ally team
    const pickedAllyLanes = new Set(allyHeroes.map(h => h.lane));
    const pickedHeroIds = new Set([...enemyIds, ...allyIds]);

    // 4. Score every unpicked hero against the entire enemy team
    const roleRecommendations = {
      Gold: [],
      EXP: [],
      Mid: [],
      Roam: [],
      Jungle: []
    };

    this.heroes.forEach(hero => {
      if (pickedHeroIds.has(hero.id)) return;

      let score = 50; // base score
      const counteredEnemies = [];
      const vulnerableTo = [];

      // Check counters against each enemy hero
      enemyHeroes.forEach(enemy => {
        // Did this hero counter the enemy?
        const isCounter = (hero.counters || []).some(c => c.heroId === enemy.id);
        const enemyCounteredBy = (enemy.counteredBy || []).find(c => c.heroId === hero.id);

        if (enemyCounteredBy) {
          if (enemyCounteredBy.tier === 'S') {
            score += 25;
            counteredEnemies.push({ enemy, tier: 'S', reason: enemyCounteredBy.reason });
          } else {
            score += 15;
            counteredEnemies.push({ enemy, tier: 'A', reason: enemyCounteredBy.reason });
          }
        } else if (isCounter) {
          score += 15;
          const match = hero.counters.find(c => c.heroId === enemy.id);
          counteredEnemies.push({ enemy, tier: 'A', reason: match.reason });
        }

        // Is hero countered by this enemy?
        const isVictim = (enemy.counters || []).some(c => c.heroId === hero.id);
        const heroCounteredByEnemy = (hero.counteredBy || []).find(c => c.heroId === enemy.id);

        if (heroCounteredByEnemy) {
          if (heroCounteredByEnemy.tier === 'S') {
            score -= 22;
            vulnerableTo.push({ enemy, tier: 'S', reason: heroCounteredByEnemy.reason });
          } else {
            score -= 12;
            vulnerableTo.push({ enemy, tier: 'A', reason: heroCounteredByEnemy.reason });
          }
        } else if (isVictim) {
          score -= 12;
          vulnerableTo.push({ enemy, tier: 'A', reason: `Susceptible to ${enemy.name}` });
        }
      });

      // Bonus points for countering specific draft compositions
      if (threatProfile.mobility >= 50 && ['minsitthar', 'khufra', 'phoveus', 'franco', 'saber'].includes(hero.id)) {
        score += 18;
      }
      if (threatProfile.sustain >= 50 && ['baxia', 'dyrroth', 'karrie'].includes(hero.id)) {
        score += 18;
      }
      if (threatProfile.crowdControl >= 50 && ['diggie', 'valentina', 'valir', 'kagura'].includes(hero.id)) {
        score += 20;
      }

      const entry = {
        hero,
        score: Math.max(20, Math.min(99, score)),
        counteredEnemies,
        vulnerableTo,
        isRoleFilled: pickedAllyLanes.has(hero.lane)
      };

      if (roleRecommendations[hero.lane]) {
        roleRecommendations[hero.lane].push(entry);
      }
      if (hero.secondaryLane && roleRecommendations[hero.secondaryLane]) {
        roleRecommendations[hero.secondaryLane].push(entry);
      }
    });

    // Sort each role by score descending
    Object.keys(roleRecommendations).forEach(lane => {
      roleRecommendations[lane].sort((a, b) => b.score - a.score);
    });

    // Determine Top Overall MVP Counter
    let overallMvp = null;
    let highestScore = -1;
    Object.keys(roleRecommendations).forEach(lane => {
      const topHero = roleRecommendations[lane][0];
      if (topHero && topHero.score > highestScore && !topHero.isRoleFilled) {
        highestScore = topHero.score;
        overallMvp = topHero;
      }
    });

    return {
      enemyHeroes,
      allyHeroes,
      threatProfile,
      strategicInsights,
      roleRecommendations,
      overallMvp
    };
  }

  /**
   * Generates a complete 6-item pro build, situational item counter swaps,
   * emblem configuration, and spell loadout for any selected hero.
   */
  getHeroProBuild(heroId) {
    const hero = this.getHeroById(heroId);
    if (!hero) return null;

    const role = (hero.role || '').toLowerCase();
    const tags = (hero.tags || []).join(' ').toLowerCase();

    // Determine boots
    let boots = MLBB_ITEMS.WARRIOR_BOOTS;
    if (role === 'mage' || role === 'tank' || role === 'support' || tags.includes('cc') || hero.damageType === 'Magic') {
      boots = MLBB_ITEMS.TOUGH_BOOTS;
    }

    let coreBuild = [];
    let situationalSwaps = [];
    let primarySpell = MLBB_SPELLS.FLICKER;
    let alternateSpell = MLBB_SPELLS.PURIFY;
    let emblem = MLBB_EMBLEMS.FIGHTER;
    let emblemTalents = ['Thrill (+16 Adaptive Attack)', 'Festival of Blood (+6% Spell Vamp)', 'Brave Smite (Recovers 4% Max HP on Skill Hit)'];

    if (role === 'marksman') {
      emblem = MLBB_EMBLEMS.MARKSMAN;
      emblemTalents = ['Swift (+10% Attack Speed)', 'Weapon Master (+5% Extra Physical Attack)', 'Quantum Charge (Basic attacks grant 30% MS & HP regen)'];
      primarySpell = MLBB_SPELLS.FLICKER;
      alternateSpell = MLBB_SPELLS.AEGIS;

      coreBuild = [
        { slot: 1, item: boots, type: 'Boots', desc: 'Movement speed and defense against early lane trades' },
        { slot: 2, item: MLBB_ITEMS.DEMON_HUNTER_SWORD, type: 'Core Attack', desc: 'On-hit current HP shred + 10% lifesteal' },
        { slot: 3, item: MLBB_ITEMS.WIND_OF_NATURE, type: 'Immunity Active', desc: 'Active skill: 2s complete immunity to all physical damage' },
        { slot: 4, item: MLBB_ITEMS.MALEFIC_ROAR, type: 'Armor Shred', desc: 'Scales physical penetration up to 40% against enemy armor' },
        { slot: 5, item: MLBB_ITEMS.SEA_HALBERD, type: 'Anti-Heal / DPS', desc: 'Reduces enemy healing by 50% and deals 8% extra damage to higher HP foes' },
        { slot: 6, item: MLBB_ITEMS.IMMORTALITY, type: 'Late Game Survival', desc: 'Revives upon death with 16% Max HP and 220-1200 shield' }
      ];

      situationalSwaps = [
        {
          trigger: 'Against High Magic Burst (Eudora, Kadita, Kagura)',
          swapOut: 'Sea Halberd',
          swapIn: MLBB_ITEMS.ATHENAS_SHIELD,
          reason: 'Instantly cuts incoming burst magic damage by 25% for 3 seconds to prevent getting one-shot.'
        },
        {
          trigger: 'Against Hybrid Burst / Late-game Assassins',
          swapOut: 'Sea Halberd',
          swapIn: MLBB_ITEMS.ROSE_GOLD_METEOR,
          reason: 'Auto-triggers a massive 510-1350 magic shield + 25 Physical Def when HP drops below 30%.'
        },
        {
          trigger: 'Against Heavy Tank Comps with high HP',
          swapOut: 'Wind of Nature',
          swapIn: MLBB_ITEMS.MALEFIC_ROAR,
          reason: 'Maximize armor pierce so your tank melting damage reaches maximum threshold.'
        }
      ];
    } else if (role === 'assassin') {
      emblem = MLBB_EMBLEMS.ASSASSIN;
      emblemTalents = ['Rupture (+5 Adaptive Penetration)', 'Master Assassin (+7% Damage in 1v1 duels)', 'Killing Spree (Restores 8% Max HP and 15% MS upon kill)'];
      primarySpell = MLBB_SPELLS.RETRIBUTION;
      alternateSpell = MLBB_SPELLS.FLICKER;

      coreBuild = [
        { slot: 1, item: boots, type: 'Boots', desc: 'Movement & CC duration cut for smooth dive execution' },
        { slot: 2, item: MLBB_ITEMS.MALEFIC_ROAR, type: 'Armor Penetration', desc: 'Cuts through base physical defense on squishy and tanky targets' },
        { slot: 3, item: MLBB_ITEMS.SEA_HALBERD, type: 'Anti-Heal Burst', desc: 'Punishes sustain targets while boosting burst' },
        { slot: 4, item: MLBB_ITEMS.ROSE_GOLD_METEOR, type: 'Lifeline Shield', desc: 'Prevents getting bursted down while diving enemy backlines' },
        { slot: 5, item: MLBB_ITEMS.ANTIQUE_CUIRASS, type: 'Physical Survival', desc: 'Reduces enemy physical attack by 24% when struck by skills' },
        { slot: 6, item: MLBB_ITEMS.IMMORTALITY, type: 'Second Chance', desc: 'Guarantees a resurrection to escape after diving the backline' }
      ];

      situationalSwaps = [
        {
          trigger: 'Against Heavy CC or Magic Burst',
          swapOut: 'Antique Cuirass',
          swapIn: MLBB_ITEMS.ATHENAS_SHIELD,
          reason: 'Provides crucial magic burst shield when enemy mages save abilities for your dive.'
        },
        {
          trigger: 'Against Continuous Magic DPS (Valir, Joy, Yve)',
          swapOut: 'Antique Cuirass',
          swapIn: MLBB_ITEMS.RADIANT_ARMOR,
          reason: 'Stacks magic reduction to survive extended teamfights without taking fatal tick damage.'
        }
      ];
    } else if (role === 'mage') {
      emblem = MLBB_EMBLEMS.MAGE;
      emblemTalents = ['Inspire (+5% Cooldown Reduction)', 'Bargain Hunter (Items cost 95% of standard gold)', 'Lethal Ignition (Extra multi-tick burn on 3-hit combos)'];
      primarySpell = MLBB_SPELLS.FLICKER;
      alternateSpell = MLBB_SPELLS.PURIFY;

      coreBuild = [
        { slot: 1, item: MLBB_ITEMS.TOUGH_BOOTS, type: 'Boots', desc: 'Reduces CC lock time from assassins and roamers' },
        { slot: 2, item: MLBB_ITEMS.GLOWING_WAND, type: 'Anti-Heal Burn', desc: 'Burns target for % Max HP and reduces healing and shields by 50%' },
        { slot: 3, item: MLBB_ITEMS.DIVINE_GLAIVE, type: 'Magic Penetration', desc: 'Scales up to 20% magic penetration to bypass enemy magic defense' },
        { slot: 4, item: MLBB_ITEMS.WINTER_CROWN, type: 'Freeze Immunity', desc: 'Active freeze for 2s to survive assassin dives and dive tower setups' },
        { slot: 5, item: MLBB_ITEMS.ATHENAS_SHIELD, type: 'Defensive Anchor', desc: 'Shields against enemy mage counter-burst' },
        { slot: 6, item: MLBB_ITEMS.IMMORTALITY, type: 'Late Game Safety', desc: 'Resurrects to reposition and recast high-impact spells' }
      ];

      situationalSwaps = [
        {
          trigger: 'Against High Physical Assassins (Saber, Fanny, Hayabusa)',
          swapOut: "Athena's Shield",
          swapIn: MLBB_ITEMS.ANTIQUE_CUIRASS,
          reason: 'Significantly weakens assassin skill combos so you do not die during initial ambush.'
        },
        {
          trigger: 'Against Continuous Magic DPS (Valir, Lunox)',
          swapOut: "Athena's Shield",
          swapIn: MLBB_ITEMS.RADIANT_ARMOR,
          reason: 'Far superior against multi-hit magic skills than instant burst shield.'
        }
      ];
    } else if (role === 'tank' || role === 'support') {
      emblem = MLBB_EMBLEMS.TANK;
      emblemTalents = ['Vitality (+225 Max HP)', 'Tenacity (Gains +15 Physical & Magic Def when low HP)', 'Concussive Blast (Deals AoE HP-scaling magic damage after basic attack)'];
      primarySpell = MLBB_SPELLS.FLICKER;
      alternateSpell = MLBB_SPELLS.VENGEANCE;

      coreBuild = [
        { slot: 1, item: MLBB_ITEMS.TOUGH_BOOTS, type: 'Roam Boots', desc: 'Reduces CC duration to ensure uninterrupted frontline sets' },
        { slot: 2, item: MLBB_ITEMS.DOMINANCE_ICE, type: 'Anti-Heal & Aura', desc: 'Halves enemy healing & attack speed in an AoE around you' },
        { slot: 3, item: MLBB_ITEMS.ATHENAS_SHIELD, type: 'Burst Magic Defense', desc: '25% damage mitigation against enemy burst mage rotations' },
        { slot: 4, item: MLBB_ITEMS.ANTIQUE_CUIRASS, type: 'Skill Attack Debuff', desc: 'Cuts enemy physical ability damage by 24%' },
        { slot: 5, item: MLBB_ITEMS.GUARDIAN_HELMET, type: 'Infinite Sustain', desc: 'Rapid out-of-combat HP regen so you never need to recall' },
        { slot: 6, item: MLBB_ITEMS.IMMORTALITY, type: 'Frontline Revival', desc: 'Ensures you can initiate first and revive to contest objectives' }
      ];

      situationalSwaps = [
        {
          trigger: 'Against High Attack-Speed & Crit Marksmen (Wanwan, Claude, Moskov, Miya)',
          swapOut: 'Guardian Helmet',
          swapIn: MLBB_ITEMS.BLADE_ARMOR,
          reason: 'Massive +70 Physical Defense + reflects 20% basic attack damage back to the attacker.'
        },
        {
          trigger: 'Against High True Damage (Karrie, Lesley, Gord)',
          swapOut: 'Antique Cuirass',
          swapIn: MLBB_ITEMS.TWILIGHT_ARMOR,
          reason: 'Caps heavy single-damage bursts to survive true-damage snipes.'
        },
        {
          trigger: 'When Playing Shield/Regen Tanks (Uranus, Esmeralda, Belerick)',
          swapOut: "Athena's Shield",
          swapIn: MLBB_ITEMS.ORACLE,
          reason: 'Increases all shield and HP regeneration received by +30%.'
        }
      ];
    } else {
      // Fighters
      emblem = MLBB_EMBLEMS.FIGHTER;
      emblemTalents = ['Firmness (+15 Physical & Magic Def)', 'Festival of Blood (+6% to 10% Spell Vamp)', 'Brave Smite (Recovers 4% Max HP upon hitting skill)'];
      primarySpell = MLBB_SPELLS.VENGEANCE;
      alternateSpell = MLBB_SPELLS.FLICKER;

      coreBuild = [
        { slot: 1, item: boots, type: 'Boots', desc: 'Lane trade mobility & defensive mitigation' },
        { slot: 2, item: MLBB_ITEMS.DOMINANCE_ICE, type: 'Anti-Heal & Armor', desc: 'Win 1v1 EXP lane duels by cutting opposing sustain in half' },
        { slot: 3, item: MLBB_ITEMS.ORACLE, type: 'Sustain & Magic Def', desc: 'Amplifies your own shields and HP recovery by 30%' },
        { slot: 4, item: MLBB_ITEMS.SEA_HALBERD, type: 'Physical Punch & Cut', desc: 'Gives high offensive pressure against tanky laners' },
        { slot: 5, item: MLBB_ITEMS.ANTIQUE_CUIRASS, type: 'Teamfight Armor', desc: 'Debuffs physical enemy carries during clash dives' },
        { slot: 6, item: MLBB_ITEMS.IMMORTALITY, type: 'Duel Insurance', desc: 'Enables aggressive frontline zoning with safety net' }
      ];

      situationalSwaps = [
        {
          trigger: 'Against Burst Mage Mid Laners',
          swapOut: 'Oracle',
          swapIn: MLBB_ITEMS.ATHENAS_SHIELD,
          reason: 'Survive ambush rotations when grouping for Turtle or Lord fights.'
        },
        {
          trigger: 'Against Heavy Basic Attack Marksmen',
          swapOut: 'Sea Halberd',
          swapIn: MLBB_ITEMS.BLADE_ARMOR,
          reason: 'Stack armor and reflect physical damage back to marksmen.'
        }
      ];
    }

    return {
      hero,
      coreBuild,
      situationalSwaps,
      emblem,
      emblemTalents,
      primarySpell,
      alternateSpell
    };
  }
}

