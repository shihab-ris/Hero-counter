// Bundled MLBB Counter Assistant for standalone (file://) and server (http://) compatibility
(function() {
  'use strict';
// Mobile Legends: Bang Bang (MLBB) Meta & Counter-Pick Dataset
// Accurate to current competitive meta and lane assignments

const MLBB_ROLES = {
  GOLD: { id: 'Gold', name: 'Gold Lane', icon: '🏹', desc: 'Marksman / Late Game Carry' },
  EXP: { id: 'EXP', name: 'EXP Lane', icon: '⚔️', desc: 'Fighter / Frontline Duelist' },
  MID: { id: 'Mid', name: 'Mid Lane', icon: '🔮', desc: 'Mage / High Burst & Rotation' },
  ROAM: { id: 'Roam', name: 'Roamer', icon: '🛡️', desc: 'Tank & Support / Vision & Setups' },
  JUNGLE: { id: 'Jungle', name: 'Jungler', icon: '⚡', desc: 'Assassin & Fighter / Objective Control' }
};

const MLBB_ITEMS = {
  WARRIOR_BOOTS: {
      "id": "warrior_boots",
      "name": "Warrior Boots",
      "type": "Movement",
      "cost": 720,
      "icon": "\ud83d\udc62",
      "img": "assets/items/warrior_boots.png",
      "stats": [
          "+40 Movement Speed",
          "+22 Physical Defense"
      ],
      "desc": "+40 Movement Speed, +22 Physical Defense. Gains up to +20 extra physical defense when struck by basic attacks.",
      "uniquePassives": [
          {
              "name": "Valor",
              "effect": "Gains 4 extra Physical Defense (up to 20) for 3s each time a basic attack is received."
          }
      ],
      "uniqueActives": [],
      "counterSynergy": "Essential early game lane defense against physical basic-attack marksmen (Wanwan, Claude, Moskov, Miya) and physical brawlers."
  },
  TOUGH_BOOTS: {
      "id": "tough_boots",
      "name": "Tough Boots",
      "type": "Movement",
      "cost": 700,
      "icon": "\ud83e\udd7e",
      "img": "assets/items/tough_boots.png",
      "stats": [
          "+40 Movement Speed",
          "+22 Magic Defense"
      ],
      "desc": "+40 Movement Speed, +22 Magic Defense. Reduces duration of Crowd Control and slow effects by 30%.",
      "uniquePassives": [
          {
              "name": "Fortitude",
              "effect": "Reduces the duration of Crowd Control (stun, airborne, freeze, silence) and slow effects by 30%."
          }
      ],
      "uniqueActives": [],
      "counterSynergy": "Mandatory against heavy CC team compositions (Atlas, Tigreal, Guinevere, Chou, Valir) to prevent fatal stun-locks."
  },
  DOMINANCE_ICE: {
      "id": "dominance_ice",
      "name": "Dominance Ice",
      "type": "Defense",
      "cost": 2010,
      "icon": "\u2744\ufe0f",
      "img": "assets/items/dominance_ice.png",
      "stats": [
          "+500 Mana",
          "+70 Physical Defense",
          "+5% Movement Speed"
      ],
      "desc": "Reduces nearby enemy HP Regen & Shield by 50% + slows enemy attack speed by 30%.",
      "uniquePassives": [
          {
              "name": "Lifebane",
              "effect": "Reduces the Shield and HP Regen of nearby enemy heroes to 50% of the original value."
          },
          {
              "name": "Arctic Cold",
              "effect": "Reduces the Attack Speed of nearby enemy heroes to 70% of the original value."
          }
      ],
      "uniqueActives": [],
      "counterSynergy": "The ultimate anti-sustain aura. Hard-counters high-regen and shield heroes (Estes, Esmeralda, Ruby, Yu Zhong, Uranus, Fredrinn) and cuts basic-attack DPS."
  },
  SEA_HALBERD: {
      "id": "sea_halberd",
      "name": "Sea Halberd",
      "type": "Attack",
      "cost": 2050,
      "icon": "\ud83d\udd31",
      "img": "assets/items/sea_halberd.png",
      "stats": [
          "+80 Physical Attack",
          "+20% Attack Speed"
      ],
      "desc": "Physical anti-heal (halves regen & shields) + deals bonus damage to enemies with higher extra HP.",
      "uniquePassives": [
          {
              "name": "Lifebane",
              "effect": "Dealing damage to a target reduces their Shield and HP Regen to 50% of the original amount for 3 seconds."
          },
          {
              "name": "Punish",
              "effect": "Increases damage by 8% against enemy heroes with higher extra HP than your own."
          }
      ],
      "uniqueActives": [],
      "counterSynergy": "Primary offensive anti-heal choice for Marksmen and Physical Fighters to shred sustain champions and high-HP tanks."
  },
  GLOWING_WAND: {
      "id": "glowing_wand",
      "name": "Glowing Wand",
      "type": "Magic",
      "cost": 2120,
      "icon": "\ud83d\udd25",
      "img": "assets/items/glowing_wand.png",
      "stats": [
          "+75 Magic Power",
          "+400 HP",
          "+5% Movement Speed"
      ],
      "desc": "Burns target for % Max HP magic damage + inflicts 50% anti-heal and shield reduction.",
      "uniquePassives": [
          {
              "name": "Scorch",
              "effect": "Magic damage burns targets for 1.5% of their Max HP per second for 3 seconds (up to 6 times)."
          },
          {
              "name": "Lifebane",
              "effect": "Dealing damage to a target reduces their Shield and HP Regen to 50% for 3 seconds."
          }
      ],
      "uniqueActives": [],
      "counterSynergy": "Core item for Mages to apply anti-heal while burning tanky, high-health targets (Baxia, Fredrinn, Uranus, Terizla)."
  },
  ATHENAS_SHIELD: {
      "id": "athenas_shield",
      "name": "Athena's Shield",
      "type": "Defense",
      "cost": 2150,
      "icon": "\ud83d\udee1\ufe0f",
      "img": "assets/items/athenas_shield.png",
      "stats": [
          "+900 HP",
          "+62 Magic Defense",
          "+2 HP Regen"
      ],
      "desc": "Grants 25% magic damage reduction for 3 seconds upon taking magic damage. Best against burst mages.",
      "uniquePassives": [
          {
              "name": "Shield",
              "effect": "Triggers upon taking Magic Damage. Reduces incoming Magic Damage by 25% for 3s (including the initial triggering hit). Recharges after 10s out of combat."
          }
      ],
      "uniqueActives": [],
      "counterSynergy": "Absolute hard counter to one-shot magic burst heroes (Kadita, Kagura, Pharsa, Lunox, Eudora, Harley). Note: Ineffective against continuous burn mages."
  },
  RADIANT_ARMOR: {
      "id": "radiant_armor",
      "name": "Radiant Armor",
      "type": "Defense",
      "cost": 1880,
      "icon": "\u2728",
      "img": "assets/items/radiant_armor.png",
      "stats": [
          "+950 HP",
          "+40 Magic Defense",
          "+12 HP Regen"
      ],
      "desc": "Stacks up to 6 times to provide massive continuous magic damage reduction. Best against multi-tick mages.",
      "uniquePassives": [
          {
              "name": "Holy Blessing",
              "effect": "Takes 5-8 Magic Damage reduction upon receiving Magic Damage (scales with level), stacking up to 6 times for 3s (up to 48 flat reduction per tick)."
          }
      ],
      "uniqueActives": [],
      "counterSynergy": "Hard counters continuous, multi-tick magic damage dealers (Valir, Yve, Chang'e, Joy, Kimmy). Completely outperforms Athena's Shield in sustained teamfights."
  },
  BLADE_ARMOR: {
      "id": "blade_armor",
      "name": "Blade Armor",
      "type": "Defense",
      "cost": 1960,
      "icon": "\ud83d\udde1\ufe0f",
      "img": "assets/items/blade_armor.png",
      "stats": [
          "+90 Physical Defense",
          "+20% Critical Damage Reduction"
      ],
      "desc": "High physical defense + reflects 20% basic attack damage back to attacker. Crushes attack-speed marksmen.",
      "uniquePassives": [
          {
              "name": "Bladed Armor",
              "effect": "When struck by a Basic Attack, reflects 20% of incoming damage + 20% of hero's total Physical Defense back to attacker as Physical Damage and slows them by 15% for 1s."
          }
      ],
      "uniqueActives": [],
      "counterSynergy": "Devastates basic-attack marksmen (Wanwan, Claude, Moskov, Miya, Bruno). High attack speed opponents essentially damage themselves to death."
  },
  ANTIQUE_CUIRASS: {
      "id": "antique_cuirass",
      "name": "Antique Cuirass",
      "type": "Defense",
      "cost": 2170,
      "icon": "\ud83e\uddba",
      "img": "assets/items/antique_cuirass.png",
      "stats": [
          "+920 HP",
          "+54 Physical Defense",
          "+4 HP Regen"
      ],
      "desc": "Reduces attacker\u2019s Physical Attack by 8% per stack (up to 24%) when hit by skills. Hard counters skill assassins.",
      "uniquePassives": [
          {
              "name": "Deter",
              "effect": "When struck by an enemy hero's skill, reduces the attacker's Physical Attack by 8% for 2s, stacking up to 3 times (max 24% Physical Attack reduction)."
          }
      ],
      "uniqueActives": [],
      "counterSynergy": "Hard counters skill-reliant physical assassins and burst duelists (Fanny, Paquito, Saber, Hayabusa, Brody, Lancelot, Terizla)."
  },
  TWILIGHT_ARMOR: {
      "id": "twilight_armor",
      "name": "Twilight Armor",
      "type": "Defense",
      "cost": 2100,
      "icon": "\ud83c\udf0c",
      "img": "assets/items/twilight_armor.png",
      "stats": [
          "+1200 HP",
          "+20 Physical Defense"
      ],
      "desc": "Reduces single-instance physical and true damage exceeding 600. Shuts down one-shot burst and crit snipers.",
      "uniquePassives": [
          {
              "name": "Twilight",
              "effect": "Upon taking single-instance damage exceeding 600, reduces the portion exceeding 600 by 20% + 5% of extra HP."
          }
      ],
      "uniqueActives": [],
      "counterSynergy": "Life-saver against single-hit nukers and True Damage snipers (Lesley, Aldous, Brody, Karrie) where standard armor is bypassed."
  },
  WIND_OF_NATURE: {
      "id": "wind_of_nature",
      "name": "Wind of Nature (WoN)",
      "type": "Attack",
      "cost": 1910,
      "icon": "\ud83c\udf43",
      "img": "assets/items/wind_of_nature.png",
      "stats": [
          "+30 Physical Attack",
          "+20% Attack Speed",
          "+10% Physical Lifesteal"
      ],
      "desc": "Active skill: Grants 2 seconds of total immunity to all Physical Damage (1s for non-marksmen).",
      "uniquePassives": [],
      "uniqueActives": [
          {
              "name": "Wind Chant",
              "effect": "Active: Grants complete immunity to all Physical Damage for 2 seconds (duration halved to 1s for non-Marksmen). Cooldown: 70 seconds."
          }
      ],
      "counterSynergy": "Essential active survival item for Marksmen to completely negate assassin dives (Fanny cable combos, Ling tempest, Hayabusa ult, Saber ult)."
  },
  WINTER_CROWN: {
      "id": "winter_crown",
      "name": "Winter Crown",
      "type": "Defense",
      "cost": 2110,
      "icon": "\ud83d\udc51",
      "img": "assets/items/winter_crown.png",
      "stats": [
          "+45 Adaptive Attack",
          "+400 HP",
          "+5% Cooldown Reduction"
      ],
      "desc": "Active skill: Freezes hero for 2 seconds (completely invulnerable and untargetable; skills can continue channeling).",
      "uniquePassives": [],
      "uniqueActives": [
          {
              "name": "Frozen",
              "effect": "Active: Freezes hero for 2s, becoming invulnerable and untargetable. Ongoing channeling skills are maintained during freeze. Cooldown: 100 seconds."
          }
      ],
      "counterSynergy": "Universal clutch invulnerability for any role. Perfect for dodging lethal ultimates (Hayabusa Shadow Kill, Harley Ring, Aldous dive, Pharsa bombard)."
  },
  IMMORTALITY: {
      "id": "immortality",
      "name": "Immortality",
      "type": "Defense",
      "cost": 2120,
      "icon": "\u26b0\ufe0f",
      "img": "assets/items/immortality.png",
      "stats": [
          "+800 HP",
          "+20 Physical Defense"
      ],
      "desc": "Resurrects 2.5s after death with 16% Max HP and a 220-1200 point shield. Essential late-game insurance.",
      "uniquePassives": [
          {
              "name": "Immortal",
              "effect": "Resurrects 2.5 seconds upon death with 16% Max HP and a shield absorbing 220\u20131200 damage that lasts 3s. Cooldown: 210 seconds."
          }
      ],
      "uniqueActives": [],
      "counterSynergy": "Crucial late-game insurance against pick-offs and wipeouts. Buys precious seconds for team repositioning or second-chance counter-attacks."
  },
  ROSE_GOLD_METEOR: {
      "id": "rose_gold_meteor",
      "name": "Rose Gold Meteor",
      "type": "Attack",
      "cost": 2120,
      "icon": "\ud83c\udf39",
      "img": "assets/items/rose_gold_meteor.png",
      "stats": [
          "+60 Physical Attack",
          "+23 Magic Defense",
          "+10% Physical Lifesteal"
      ],
      "desc": "Grants a 510-1350 point magic shield and bonus magic defense when HP falls below 30%.",
      "uniquePassives": [
          {
              "name": "Lifeline",
              "effect": "When HP drops below 30%, immediately gains a 510\u20131350 shield (scales with level) and +25 Magic Defense for 3 seconds. Cooldown: 40 seconds."
          }
      ],
      "uniqueActives": [],
      "counterSynergy": "Provides emergency survivability for physical carries against sudden magic burst assassinations (Kagura, Kadita, Gusion)."
  },
  DEMON_HUNTER_SWORD: {
      "id": "demon_hunter_sword",
      "name": "Demon Hunter Sword (DHS)",
      "type": "Attack",
      "cost": 2180,
      "icon": "\ud83d\udde1\ufe0f",
      "img": "assets/items/demon_hunter_sword.png",
      "stats": [
          "+35 Physical Attack",
          "+25% Attack Speed"
      ],
      "desc": "Basic attacks deal 8% of target\u2019s current HP as extra physical damage. Melts high-HP tanks and sustain brawlers.",
      "uniquePassives": [
          {
              "name": "Devour",
              "effect": "Basic attacks deal 8% of the target's current HP as extra Physical Damage (capped at 60 against creeps)."
          },
          {
              "name": "Devour (Lifesteal)",
              "effect": "Basic attacks grant 3% Physical Lifesteal for 3s (stacks up to 5 times for 15% lifesteal)."
          }
      ],
      "uniqueActives": [],
      "counterSynergy": "Mandatory tank-melter against HP-stacking frontliners (Fredrinn, Baxia, Uranus, Belerick, Tigreal, Hylos)."
  },
  MALEFIC_ROAR: {
      "id": "malefic_roar",
      "name": "Malefic Roar",
      "type": "Attack",
      "cost": 2060,
      "icon": "\ud83d\udd2b",
      "img": "assets/items/malefic_roar.png",
      "stats": [
          "+60 Physical Attack"
      ],
      "desc": "Grants Physical Penetration scaling up to 40% based on the target\u2019s physical defense. Shreds armored tanks.",
      "uniquePassives": [
          {
              "name": "Armor Buster",
              "effect": "Each point of the enemy's Physical Defense increases Physical Penetration by 0.125% (up to 40% extra Physical Penetration)."
          }
      ],
      "uniqueActives": [],
      "counterSynergy": "Premier armor-piercing weapon for physical damage dealers against enemies building Blade Armor and Antique Cuirass."
  },
  DIVINE_GLAIVE: {
      "id": "divine_glaive",
      "name": "Divine Glaive",
      "type": "Magic",
      "cost": 1970,
      "icon": "\ud83e\ude84",
      "img": "assets/items/divine_glaive.png",
      "stats": [
          "+65 Magic Power"
      ],
      "desc": "Grants Magic Penetration scaling up to 30% based on target\u2019s magic defense. Melts high-magic-defense tanks.",
      "uniquePassives": [
          {
              "name": "Spellbreaker",
              "effect": "Each point of the enemy's Magic Defense increases Magic Penetration by 0.1% (capped at 20% extra penetration)."
          }
      ],
      "uniqueActives": [],
      "counterSynergy": "Essential magic penetration item for Mages when enemies build Athena's Shield or Radiant Armor."
  },
  ORACLE: {
      "id": "oracle",
      "name": "Oracle",
      "type": "Defense",
      "cost": 2060,
      "icon": "\ud83d\udc9a",
      "img": "assets/items/oracle.png",
      "stats": [
          "+850 HP",
          "+42 Magic Defense",
          "+10% Cooldown Reduction"
      ],
      "desc": "+850 HP, +42 Magic Def, +10% CDR. Boosts all shield absorption and HP regen by 30%.",
      "uniquePassives": [
          {
              "name": "Bless",
              "effect": "Increases all shield absorption effects and HP regeneration effects received by 30%."
          }
      ],
      "uniqueActives": [],
      "counterSynergy": "Supercharges sustain heroes (Esmeralda, Uranus, Ruby, Yu Zhong) while giving magic defense against poke."
  },
  GUARDIAN_HELMET: {
      "id": "guardian_helmet",
      "name": "Guardian Helmet",
      "type": "Defense",
      "cost": 2200,
      "icon": "\ud83e\ude96",
      "img": "assets/items/guardian_helmet.png",
      "stats": [
          "+1550 HP",
          "+20 HP Regen"
      ],
      "desc": "+1550 HP. Regenerates up to 2.5% max HP per second outside of combat. Provides infinite map sustain.",
      "uniquePassives": [
          {
              "name": "Recovery",
              "effect": "Regenerates 2.5% Max HP per second outside of combat (reduced to 0.5% per second while in combat)."
          }
      ],
      "uniqueActives": [],
      "counterSynergy": "Provides infinite roaming sustain for tanks and frontliners, eliminating the need to recall to base between teamfights."
  },
};

const MLBB_EMBLEMS = {
  TANK: {
    id: 'tank',
    name: 'Custom Tank Emblem',
    icon: '🛡️',
    img: 'assets/emblems/tank.png',
    talents: { tier1: 'Firmness (+Physical & Magic Def)', tier2: 'Tenacity (+15 Def when HP < 50%)', tier3: 'Brave Smite (Skill hits restore 4% Max HP)' },
    desc: 'Best for frontliners dueling high damage or CC threats.'
  },
  FIGHTER: {
    id: 'fighter',
    name: 'Custom Fighter Emblem',
    icon: '⚔️',
    img: 'assets/emblems/fighter.png',
    talents: { tier1: 'Thrill (+Adaptive Attack)', tier2: 'Festival of Blood (+Spell Vamp stacks)', tier3: 'Brave Smite / War Cry' },
    desc: 'Max sustain and extended trade dominance.'
  },
  ASSASSIN: {
    id: 'assassin',
    name: 'Custom Assassin Emblem',
    icon: '⚡',
    img: 'assets/emblems/assassin.png',
    talents: { tier1: 'Rupture (+Adaptive Penetration)', tier2: 'Master Assassin (+7% Damage against isolated targets)', tier3: 'Killing Spree (Restores 8% HP & grants 15% Mov Speed on kill)' },
    desc: 'Maximum burst pick-off efficiency.'
  },
  MAGE: {
    id: 'mage',
    name: 'Custom Mage Emblem',
    icon: '🔮',
    img: 'assets/emblems/mage.png',
    talents: { tier1: 'Inspire (+5% Cooldown Reduction)', tier2: 'Bargain Hunter (Equipment cost 95%)', tier3: 'Lethal Ignition (Triple hit scorches bonus damage)' },
    desc: 'High rotation and burst kill pressure.'
  },
  MARKSMAN: {
    id: 'marksman',
    name: 'Custom Marksman Emblem',
    icon: '🏹',
    img: 'assets/emblems/marksman.png',
    talents: { tier1: 'Swift (+10% Attack Speed)', tier2: 'Weapons Master (+5% Bonus Attack)', tier3: 'Weakness Finder (Basic attacks slow enemy by 90% and cut attack speed)' },
    desc: 'Kiting control and armor penetration DPS.'
  }
};

const MLBB_SPELLS = {
  PURIFY: { id: 'purify', name: 'Purify', icon: '✨', img: 'assets/spells/purify.png', desc: 'Immediately removes all Crowd Control (except suppression) and gains 1.2s CC immunity.' },
  FLICKER: { id: 'flicker', name: 'Flicker', icon: '⚡', img: 'assets/spells/flicker.png', desc: 'Teleport a short distance for repositioning, escape, or surprise initiation.' },
  VENGEANCE: { id: 'vengeance', name: 'Vengeance', icon: '🛡️', img: 'assets/spells/vengeance.png', desc: 'Reduces incoming damage by 35% and reflects 35% damage back. Obliterates attack-speed marksmen.' },
  PETRIFY: { id: 'petrify', name: 'Petrify', icon: '🗿', img: 'assets/spells/petrify.png', desc: 'Petrifies nearby enemies for 0.8s and slows them by 50%.' },
  SPRINT: { id: 'sprint', name: 'Sprint', icon: '👟', img: 'assets/spells/sprint.png', desc: '50% bonus movement speed and immunity to slow effects for 6s.' },
  RETRIBUTION: { id: 'retribution', name: 'Retribution', icon: '🗡️', img: 'assets/spells/retribution.png', desc: 'Essential spell for Junglers for creep farming and turtle/lord smite.' },
  AEGIS: { id: 'aegis', name: 'Aegis', icon: '🔰', img: 'assets/spells/aegis.png', desc: 'Generates a strong immediate shield for self and nearby lowest ally.' }
};

const INITIAL_HEROES = [
  {
    "id": "yin",
    "avatar": "assets/heroes/yin.png",
    "name": "Yin",
    "role": "Fighter",
    "lane": "EXP",
    "damageType": "Magic",
    "difficulty": "Medium",
    "color": "#f97316",
    "avatarBg": "linear-gradient(135deg, #c2410c, #ea580c)",
    "skills": {
      "passive": {
        "name": "Leave It to Me",
        "tag": "Passive • Fighter Synergy",
        "desc": "If there are no allied heroes within 4 units of Yin, his damage is increased to 120% and he gains 8% Spell Vamp.",
        "counterTip": "Track Yin's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Charged Punch",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Yin gains 60% extra Movement Speed (decays over 3s). Yin can launch an enhanced Basic Attack that deals 25( +100% Total Physical Attack) (Physical Damage) within the duration. Upon hitting an enemy with the enhanced Basic Attack, Yin will throw another charged punch forward, dealing 360( +200% Extra Physical Attack) (Physical Damage) to enemies in the path. Successfully throwing the charged punch reduces the skill's cooldown by 35%.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Instant Blast",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Yin dashes forward, leaving a (Golden Ring) behind while dealing 75( +35% Extra Physical Attack) (Physical Damage) to enemies along the way. He gains 30% extra Damage Reduction for 4s if an enemy hero is hit. After 1s, the (Golden Ring) will catch up with Yin, dealing 150( +70% Extra Physical Attack) (Physical Damage) to enemies it passes through and stunning them for 1s.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "My Turn",
        "tag": "Ultimate • High Impact",
        "desc": "After a short delay, Yin locks onto an enemy hero ((cannot lock onto pets or clones)) and pulls them into his domain for up to 8s and turns into (Lieh). When in the domain, the two cannot be affected by other heroes' skills. (Lieh) has stronger skills and 50 extra (Physical & Magic Defense) that last 8s. The domain will end early if either of the two is killed. If (Lieh) successfully kills the enemy, he'll recover 20% Max HP, leave the domain with the cooldowns of (Frenzy Strike) and (Instant Blast) reset, and continue to fight as (Lieh) for 8s. If Yin fails to pull his target into his domain, the skill will enter a 3s cooldown.",
        "counterTip": "Respect Yin's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Fighter Carry",
      "Magic Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "alucard",
        "reason": "Sustained frontline presence out-trades in close quarter duels."
      },
      {
        "heroId": "zilong",
        "reason": "Absorbs initial charge and overpowers in prolonged trades."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dominance_ice",
        "tier": "S",
        "reason": "Dominance Ice cuts lifesteal and shield regeneration by 50%."
      },
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Constant knockbacks and slow firewall kite Yin endlessly."
      },
      {
        "heroId": "baxia",
        "tier": "A",
        "reason": "Inherent anti-heal passive and mobility neutralize sustain."
      }
    ],
    "avoidPicks": [
      "valir",
      "karrie",
      "baxia"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Yin's core kit advantage.",
      "Watch for Yin's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Yin during key objective contests."
    ],
    "secondaryLane": "Jungle"
  },
  {
    "id": "ixia",
    "avatar": "assets/heroes/ixia.png",
    "name": "Ixia",
    "role": "Marksman",
    "lane": "Gold",
    "damageType": "Physical",
    "difficulty": "Medium",
    "color": "#fbbf24",
    "avatarBg": "linear-gradient(135deg, #d97706, #f59e0b)",
    "skills": {
      "passive": {
        "name": "Siphon Starlium",
        "tag": "Passive • Marksman Synergy",
        "desc": "Ixia's Basic Attacks and skills apply a stack of (Starlium Charge) to enemies on hit. When Ixia performs a Basic Attack on an enemy with two stacks of (Starlium Charge), the attack will consume the stacks and be replaced with (Siphon Starlium), dealing ( +150% Total Physical Attack) (+20000% Lifesteal) plus (+10*Hero Level) (Physical Damage) to the target. Ixia recovers HP equal to the damage dealt by (Siphon Starlium) (only 20(+10000% Lifesteal)% against non-hero units). (Siphon Starlium) can trigger on all enemies in front of Ixia that are within her Basic Attack range, but it cannot Crit. Ixia's Basic Attacks cannot trigger Lifesteal.",
        "counterTip": "Track Ixia's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Dual Beam",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Ixia fires 2 Starlium-charged energy beams along the ground in the target direction, dealing 75( +80% Total Physical Attack) (Physical Damage) to enemies in a rectangular area and slowing enemy heroes by 40%. Upon hitting an enemy hero, Ixia also gains 40% Movement Speed for 2s. Enemies hit by both beams will take double damage.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Star Helix",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Ixia unleashes a canister of Starlium energy in the target direction, knocking back nearby enemies, and pulling enemies in range to the center line after a short delay and dealing 200( +60% Total Physical Attack) (Physical Damage).",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Full Barrage",
        "tag": "Ultimate • High Impact",
        "desc": "Ixia reassembles her weapon into 6 smaller weapons and enters the (Barrage) state for 4s. In this state, Ixia's Basic Attacks and skills can hit enemies in the large fan-shaped area in front of her but not outside it. Ixia's Basic Attacks can hit up to 6 enemy units (prioritizes heroes), and (Siphon Starlium) will fire simultaneously with her normal Basic Attacks.",
        "counterTip": "Respect Ixia's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Marksman Carry",
      "Physical Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 2,
      "mid": 4,
      "late": 5
    },
    "counters": [
      {
        "heroId": "tigreal",
        "reason": "Can out-range and kite Tigreal outside his melee engage radius."
      },
      {
        "heroId": "hylos",
        "reason": "High DPS melts Hylos HP pool from safe distance."
      }
    ],
    "counteredBy": [
      {
        "heroId": "saber",
        "tier": "S",
        "reason": "Instant point-and-click lock on airborne deletes Ixia before repositioning."
      },
      {
        "heroId": "blade_armor",
        "tier": "S",
        "reason": "Blade Armor reflects basic attack physical damage right back."
      },
      {
        "heroId": "khufra",
        "tier": "A",
        "reason": "Bouncing Ball and Tyrants Rage halt escape dashes."
      }
    ],
    "avoidPicks": [
      "saber",
      "khufra",
      "fanny"
    ],
    "recommendedSpell": "Flicker / Vengeance",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Ixia's core kit advantage.",
      "Watch for Ixia's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Ixia during key objective contests."
    ]
  },
  {
    "id": "fredrinn",
    "avatar": "assets/heroes/fredrinn.png",
    "name": "Fredrinn",
    "role": "Tank",
    "lane": "Jungle",
    "secondaryLane": "EXP",
    "damageType": "Physical",
    "difficulty": "Medium",
    "color": "#b45309",
    "avatarBg": "linear-gradient(135deg, #78350f, #d97706)",
    "skills": {
      "passive": {
        "name": "Crystalline Armor",
        "tag": "Passive • Crystal HP & Damage Storage",
        "desc": "Fredrinn stores 85% of incoming damage as Crystal Energy. Hitting skills converts 30% of Crystal Energy back into real HP.",
        "counterTip": "Dominance Ice or Sea Halberd stops him from converting Crystal Energy into HP."
      },
      "skill1": {
        "name": "Piercing Strike",
        "tag": "Skill 1 • Sword Thrust & Slow",
        "desc": "Fredrinn thrusts his sword forward, dealing physical damage and slowing by 30%. Adds 1 combo point.",
        "counterTip": "Dodge the thrust to starve him of combo points."
      },
      "skill2": {
        "name": "Brave Assault",
        "tag": "Skill 2 • Dash & Airborne Knockup",
        "desc": "Fredrinn dashes forward. Next basic attack knocks the target airborne for 0.3s. Adds 1 combo point.",
        "counterTip": "Track his combo points; at 3 points he unlocks his massive taunt and execute."
      },
      "ultimate": {
        "name": "Appraiser's Wrath",
        "tag": "Ultimate • Giant Crystal Execute Slam",
        "desc": "Requires combo points. Fredrinn slams his broadsword in a massive cone, dealing physical damage + 35%–40% of his stored Crystal Energy.",
        "counterTip": "If Fredrinn has high grey Crystal HP, his ultimate can one-shot squishies! Sidestep the cone or activate Winter Crown."
      }
    },
    "tags": [
      "Crystal Energy Taunt",
      "Massive Execution Ult",
      "Unkillable Frontline"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 5,
      "late": 5
    },
    "counters": [
      {
        "heroId": "paquito",
        "reason": "Out-tanks Paquito and taunts him with Appraiser’s Wrath."
      },
      {
        "heroId": "chou",
        "reason": "Absorbs Chou combo and converts grey health into massive execution damage."
      }
    ],
    "counteredBy": [
      {
        "heroId": "karrie",
        "tier": "S",
        "reason": "Karrie percentage Max HP true damage shreds Fredrinn massive health bar."
      },
      {
        "heroId": "lunox",
        "tier": "S",
        "reason": "Lunox continuous magic pen tears through Fredrinn defenses."
      },
      {
        "heroId": "dyrroth",
        "tier": "S",
        "reason": "Dyrroth 75% defense break cancels Fredrinn armor advantage."
      },
      {
        "heroId": "valir",
        "tier": "A",
        "reason": "Valir slows and stuns keep Fredrinn kited forever."
      }
    ],
    "avoidPicks": [
      "paquito",
      "chou",
      "saber"
    ],
    "recommendedSpell": "Retribution",
    "counterItems": [
      "DOMINANCE_ICE",
      "SEA_HALBERD",
      "TWILIGHT_ARMOR"
    ],
    "tacticalTips": [
      "Watch Fredrinn grey HP bar! When his grey bar is full, his ultimate Appraiser’s Wrath can deal 4,000+ damage in one slam.",
      "Build anti-heal to stop him from converting his grey health into real HP."
    ]
  },
  {
    "id": "joy",
    "avatar": "assets/heroes/joy.png",
    "name": "Joy",
    "role": "Assassin",
    "lane": "Jungle",
    "secondaryLane": "EXP",
    "damageType": "Magic",
    "difficulty": "Very Hard",
    "color": "#facc15",
    "avatarBg": "linear-gradient(135deg, #854d0e, #eab308)",
    "skills": {
      "passive": {
        "name": "Humph, Joy's Lucky Day!",
        "tag": "Passive • Shield & Speed on Beat",
        "desc": "Joy gains a shield and 100% decaying movement speed whenever her skills hit on the musical beat rhythm.",
        "counterTip": "Interrupt her musical rhythm with hard CC so she fails her beat-timed dashes."
      },
      "skill1": {
        "name": "Look, Leonin Crystal!",
        "tag": "Skill 1 • Crystal Target Anchor",
        "desc": "Joy summons a Leonin Crystal at target location, dealing magic damage. Can be used as a stepping stone for Skill 2.",
        "counterTip": "Stay away from the crystal; Joy uses it to stack her dashes safely."
      },
      "skill2": {
        "name": "Spring!",
        "tag": "Skill 2 • Quad Rhythm Dash",
        "desc": "Joy dashes in a direction. Hitting an enemy or crystal allows her to cast Spring! again (up to 4 times). Hitting on beat grants CC immunity.",
        "counterTip": "Minsitthar or Khufra stops her Spring! dashes completely. Build Radiant Armor to mitigate her multi-dash damage."
      },
      "ultimate": {
        "name": "Ha, Electrifying Beats!",
        "tag": "Ultimate • CC-Immune Lightning Storm",
        "desc": "Unlocked only by hitting 4 Spring! dashes. Joy becomes CC immune, gains movement speed, and fires 8 lightning strikes dealing heavy magic burst.",
        "counterTip": "Radiant Armor is the absolute hard counter to her 8-hit lightning storm."
      }
    },
    "tags": [
      "Rhythm Beats",
      "CC Immunity While Dancing",
      "High Speed Magic Burst"
    ],
    "powerSpikes": {
      "early": 4,
      "mid": 5,
      "late": 4
    },
    "counters": [
      {
        "heroId": "pharsa",
        "reason": "Rhythm dashes straight into Pharsa air strike with CC immunity."
      },
      {
        "heroId": "yve",
        "reason": "Dashes past Yve galactic slow field and deletes her."
      },
      {
        "heroId": "beatrix",
        "reason": "Unstoppable high-speed dive wipes Beatrix."
      }
    ],
    "counteredBy": [
      {
        "heroId": "minsitthar",
        "tier": "S",
        "reason": "King’s Calling grounds Joy, preventing rhythm dashes completely."
      },
      {
        "heroId": "phoveus",
        "tier": "S",
        "reason": "Joy multiple rhythm dashes trigger Phoveus ultimate non-stop."
      },
      {
        "heroId": "khufra",
        "tier": "S",
        "reason": "Bouncing Ball interrupts Joy rhythm dash, ruining her beat chain."
      },
      {
        "heroId": "franco",
        "tier": "A",
        "reason": "Suppresses Joy while she dances."
      }
    ],
    "avoidPicks": [
      "pharsa",
      "yve",
      "beatrix"
    ],
    "recommendedSpell": "Retribution / Vengeance",
    "counterItems": [
      "RADIANT_ARMOR",
      "ATHENAS_SHIELD"
    ],
    "tacticalTips": [
      "If Joy misses the musical rhythm beat on her dash, she loses CC immunity and cannot unlock her ultimate!",
      "Minsitthar or Khufra breaks her rhythm instantly.",
      "Buy Radiant Armor against her continuous magic damage ultimate."
    ]
  },
  {
    "id": "cici",
    "avatar": "assets/heroes/cici.png",
    "name": "Cici",
    "role": "Fighter",
    "lane": "EXP",
    "damageType": "Physical",
    "difficulty": "Easy",
    "color": "#f97316",
    "avatarBg": "linear-gradient(135deg, #c2410c, #ea580c)",
    "skills": {
      "passive": {
        "name": "Performer's Delight",
        "tag": "Passive • Fighter Synergy",
        "desc": "Cici generates a stack of Delight after dealing damage, increasing her Movement Speed by 0.75% and Spell Vamp by 0.75% per stack up to 10 times, doubling the effects at full stacks.",
        "counterTip": "Track Cici's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Yo-Yo Blitz",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Cici uses Yoyo to continuously attack the nearest enemy within range (prioritizing heroes) for 3.5s, hitting them up to 10 times, and dealing (Physical Damage) equal to 60 plus 3( )% of the target's Max HP per hit. Cici can move and use other skills during this attack. If there is no enemy within range, Yoyo will attack Turrets or the Base instead. This skill deals 20% extra damage to Minions.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Buoyant Bounce",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Cici leaps to a target location. If she lands on any unit (not including Turrets and Base), she can leap again in the Joystick's direction. If she lands on an enemy with the first leap, she deals 200( +40% Total Physical Attack) (Physical Damage) to them.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Curtain Call",
        "tag": "Ultimate • High Impact",
        "desc": "Cici throws Yoyo at the target enemy hero and links them with another nearby enemy hero, dealing 100( +10% Total Physical Attack) (Physical Damage), slowing them by 30%, and pulling them together for 4s. During this time, Cici can use (Yo-Yo Blitz) to attack both linked targets at the same time. If only one target is within the range of (Yo-Yo Blitz), Cici will attack the target twice, but the damage of the second attack will be reduced to 20%.",
        "counterTip": "Respect Cici's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Fighter Carry",
      "Physical Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "alucard",
        "reason": "Sustained frontline presence out-trades in close quarter duels."
      },
      {
        "heroId": "zilong",
        "reason": "Absorbs initial charge and overpowers in prolonged trades."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dominance_ice",
        "tier": "S",
        "reason": "Dominance Ice cuts lifesteal and shield regeneration by 50%."
      },
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Constant knockbacks and slow firewall kite Cici endlessly."
      },
      {
        "heroId": "baxia",
        "tier": "A",
        "reason": "Inherent anti-heal passive and mobility neutralize sustain."
      }
    ],
    "avoidPicks": [
      "valir",
      "karrie",
      "baxia"
    ],
    "recommendedSpell": "Flicker / Vengeance",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Cici's core kit advantage.",
      "Watch for Cici's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Cici during key objective contests."
    ],
    "secondaryLane": "Roam"
  },
  {
    "id": "novaria",
    "avatar": "assets/heroes/novaria.png",
    "name": "Novaria",
    "role": "Mage",
    "lane": "Mid",
    "damageType": "Magic",
    "difficulty": "Hard",
    "color": "#c084fc",
    "avatarBg": "linear-gradient(135deg, #7e22ce, #c084fc)",
    "skills": {
      "passive": {
        "name": "Star Trail",
        "tag": "Passive • Mage Synergy",
        "desc": "(Astral Spheres) summoned by Novaria will continuously slow nearby enemies by 20% and grant vision of them.",
        "counterTip": "Track Novaria's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Astral Meteor",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Novaria summons an (Astral Sphere) at the target location, continuously dealing 75( +25% Total Magic Power) (Magic Damage) to nearby enemies. After 2s, the sphere will explode, dealing (Magic Damage) equal to 260( +50% Total Magic Power) plus 4% of the enemy's Max HP to nearby enemies, and increasing (Astral Sphere's) slow effect to 2.5 times the original slow effect.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Astral Recall",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Novaria summons an (Astral Sphere) at a distance and draws it towards her. At the same time, Novaria gains 20% Movement Speed and can pass through terrain. Passing through a wall will increase the Movement Speed bonus to 60%. When the (Astral Sphere) reaches Novaria, she can cast (Star Shatter) to launch it in a target direction within 5s. The sphere will explode when hitting an enemy hero, dealing (Magic Damage) equal to 230( +45% Total Magic Power) plus 4% of the target's Max HP. The damage will increase based on the (Astral Sphere's) travel distance (starting from when the sphere is summoned), up to 2.5 times the original damage.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Astral Echo",
        "tag": "Ultimate • High Impact",
        "desc": "Novaria scatters (Astral Echo) in the target direction, briefly slowing enemy heroes hit by 50% while applying (Astral Ring) on them, increasing their hitbox by 2.5 times and revealing their surrounding area. This effect lasts 8s.",
        "counterTip": "Respect Novaria's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Mage Carry",
      "Magic Damage",
      "High Skill Ceiling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "High burst combo deletes squishy immobile marksmen instantly."
      },
      {
        "heroId": "miya",
        "reason": "AoE magic damage out-bursts Miya in early/mid game teamfights."
      }
    ],
    "counteredBy": [
      {
        "heroId": "athenas_shield",
        "tier": "S",
        "reason": "Athena’s Shield absorbs 25% of magic burst, preventing one-shots."
      },
      {
        "heroId": "ling",
        "tier": "S",
        "reason": "Ling wall-jumping bypasses ground skillshots and dives Novaria effortlessly."
      },
      {
        "heroId": "saber",
        "tier": "A",
        "reason": "Airborne lock prevents Novaria from casting defensive spells."
      }
    ],
    "avoidPicks": [
      "ling",
      "fanny",
      "saber"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Novaria's core kit advantage.",
      "Watch for Novaria's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Novaria during key objective contests."
    ]
  },
  {
    "id": "arlott",
    "avatar": "assets/heroes/arlott.png",
    "name": "Arlott",
    "role": "Fighter",
    "lane": "EXP",
    "damageType": "Physical",
    "difficulty": "Medium",
    "color": "#f97316",
    "avatarBg": "linear-gradient(135deg, #c2410c, #ea580c)",
    "skills": {
      "passive": {
        "name": "Demon Gaze",
        "tag": "Passive • Fighter Synergy",
        "desc": "Arlott possesses a demonic eye that will (Mark) enemy units near Arlott that become affected by control effects for 8s. The eye will also automatically (Mark) a nearby enemy hero in vision every 8s.",
        "counterTip": "Track Arlott's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Dauntless Strike",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Arlott swings his lance forward, dealing 200( +60% Total Physical Attack) (Physical Damage) and briefly stunning targets in an area. Targets hit by the further part of the AOE will be stunned for 1s instead.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Vengeance",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Arlott charges at an enemy, dealing 135( +60% Total Physical Attack) (Physical Damage) (this skill cannot be interrupted during movement). If Arlott's target is (Marked), this skill will deal double damage, immediately refresh its cooldown, and restore ( +90% Total Physical Attack) HP to Arlott (only restores 50% of that amount when used on a non-hero unit.)",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Final Slash",
        "tag": "Ultimate • High Impact",
        "desc": "Arlott cleaves in front of him, dealing 400( +80% Total Physical Attack) (Physical Damage) to targets in the area while pushing them to the end of the AOE and briefly revealing their location.",
        "counterTip": "Respect Arlott's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Fighter Carry",
      "Physical Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "alucard",
        "reason": "Sustained frontline presence out-trades in close quarter duels."
      },
      {
        "heroId": "zilong",
        "reason": "Absorbs initial charge and overpowers in prolonged trades."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dominance_ice",
        "tier": "S",
        "reason": "Dominance Ice cuts lifesteal and shield regeneration by 50%."
      },
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Constant knockbacks and slow firewall kite Arlott endlessly."
      },
      {
        "heroId": "baxia",
        "tier": "A",
        "reason": "Inherent anti-heal passive and mobility neutralize sustain."
      }
    ],
    "avoidPicks": [
      "valir",
      "karrie",
      "baxia"
    ],
    "recommendedSpell": "Flicker / Vengeance",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Arlott's core kit advantage.",
      "Watch for Arlott's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Arlott during key objective contests."
    ],
    "secondaryLane": "Roam"
  },
  {
    "id": "xavier",
    "avatar": "assets/heroes/xavier.png",
    "name": "Xavier",
    "role": "Mage",
    "lane": "Mid",
    "damageType": "Magic",
    "difficulty": "Easy",
    "color": "#c084fc",
    "avatarBg": "linear-gradient(135deg, #7e22ce, #c084fc)",
    "skills": {
      "passive": {
        "name": "Transcendence",
        "tag": "Passive • Mage Synergy",
        "desc": "Xavier enhances his subsequent skills each time his skill hits an enemy hero. (Stage I:) Increases Movement Speed by 50% when subsequent skills hit, decaying over 1.2s. (Stage II:) Width of subsequent skills will be greatly increased. (Stage III:) Skill Cooldown reduced by 4s (12s for the Ultimate). At (Stage III), Xavier enters the (Transcendence) state. (Transcendence:) All of Xavier's skills are enhanced to (Stage III) state for 5s (this duration is extended by 1s each time Xavier's skill hits an enemy).",
        "counterTip": "Track Xavier's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Infinite Extension",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Xavier fires a Mystic Bullet that deals 425( +150% Total Magic Power) (Magic Damage) to enemies it passes through. The Bullet's flying distance increases each time it hits an enemy or the (Mystic Barrier) (up to 5 times).",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Mystic Field",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Xavier conjures a (Mystic Barrier) that lasts 5s. Enemies that come into contact with the Barrier will take 125( +60% Total Magic Power) (Magic Damage) and be slowed by 50%, while allies will gain 50% extra Movement Speed that decays over 1.2s. When hit by Xavier's other skills, the Barrier expands into a (Mystic Field) for 3s, dealing 300( +120% Total Magic Power) (Magic Damage) to enemies within and immobilizing them for 1.2s.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Dawning Light",
        "tag": "Ultimate • High Impact",
        "desc": "Xavier unleashes a beam of Mystic magic in the target direction, dealing 650( +150% Total Magic Power) (Magic Damage) to all enemies along its path. Once cast, he also directly enters the (Transcendence) state and resets the state's duration.",
        "counterTip": "Respect Xavier's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Mage Carry",
      "Magic Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "High burst combo deletes squishy immobile marksmen instantly."
      },
      {
        "heroId": "miya",
        "reason": "AoE magic damage out-bursts Miya in early/mid game teamfights."
      }
    ],
    "counteredBy": [
      {
        "heroId": "athenas_shield",
        "tier": "S",
        "reason": "Athena’s Shield absorbs 25% of magic burst, preventing one-shots."
      },
      {
        "heroId": "ling",
        "tier": "S",
        "reason": "Ling wall-jumping bypasses ground skillshots and dives Xavier effortlessly."
      },
      {
        "heroId": "saber",
        "tier": "A",
        "reason": "Airborne lock prevents Xavier from casting defensive spells."
      }
    ],
    "avoidPicks": [
      "ling",
      "fanny",
      "saber"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Xavier's core kit advantage.",
      "Watch for Xavier's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Xavier during key objective contests."
    ]
  },
  {
    "id": "julian",
    "avatar": "assets/heroes/julian.png",
    "name": "Julian",
    "role": "Fighter",
    "lane": "EXP",
    "damageType": "Magic",
    "difficulty": "Easy",
    "color": "#f97316",
    "avatarBg": "linear-gradient(135deg, #c2410c, #ea580c)",
    "skills": {
      "passive": {
        "name": "Smith's Legacy",
        "tag": "Passive • Fighter Synergy",
        "desc": "After casting two different skills, Julian enhances his third skill. Casting the enhanced skill makes all his skills go on a 9-6s Cooldown (decreases with his level), but his Basic Attacks within the next 5s will deal 75( +100% Total Physical Attack) (+120% Total Magic Power) (Magic Damage) and pull the target toward him. Julian gains 15% extra Hybrid Lifesteal for 5s each time he hits an enemy hero with his skills (up to 3 stacks).",
        "counterTip": "Track Julian's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Scythe",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Julian hurls a flying scythe in the target direction, dealing 380( +140% Total Magic Power) (Magic Damage) to enemies along the way and slowing them by 30% for 1s. The scythe disappears upon hitting a non-minion enemy.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Sword",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Julian summons a flying sword and dashes in the target direction, dealing 400( +80% Total Magic Power) (Magic Damage) to enemies along the way.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Chain",
        "tag": "Ultimate • High Impact",
        "desc": "Julian casts chains at the target location, dealing 300( +100% Total Magic Power) (Magic Damage) to enemies hit after a short delay and immobilizing them for 1.2s.",
        "counterTip": "Respect Julian's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Fighter Carry",
      "Magic Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "alucard",
        "reason": "Sustained frontline presence out-trades in close quarter duels."
      },
      {
        "heroId": "zilong",
        "reason": "Absorbs initial charge and overpowers in prolonged trades."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dominance_ice",
        "tier": "S",
        "reason": "Dominance Ice cuts lifesteal and shield regeneration by 50%."
      },
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Constant knockbacks and slow firewall kite Julian endlessly."
      },
      {
        "heroId": "baxia",
        "tier": "A",
        "reason": "Inherent anti-heal passive and mobility neutralize sustain."
      }
    ],
    "avoidPicks": [
      "valir",
      "karrie",
      "baxia"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Julian's core kit advantage.",
      "Watch for Julian's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Julian during key objective contests."
    ],
    "secondaryLane": "Roam"
  },
  {
    "id": "chip",
    "avatar": "assets/heroes/chip.png",
    "name": "Chip",
    "role": "Support",
    "lane": "Roam",
    "damageType": "Magic",
    "difficulty": "Hard",
    "color": "#06b6d4",
    "avatarBg": "linear-gradient(135deg, #0891b2, #06b6d4)",
    "skills": {
      "passive": {
        "name": "Snack Time!",
        "tag": "Passive • Support Synergy",
        "desc": "Chip starts eating potato chips once every 2s when out of combat, regenerating HP equal to 300 plus 15% of lost HP after finishing a whole bag (requires 4 bites). After eating a bag of chips, Chip will be full and cannot eat again for 5s. (The bite count will be saved if he enters combat before finishing a whole bag.)",
        "counterTip": "Track Chip's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Crash Course",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Chip rams his hovercraft into the ground, dealing (Magic Damage) equal to 150 plus 5% of target's Max HP and applying (Chip's Mark) on enemy heroes hit. Chip gains a 300( +60% Total Magic Power) Shield upon hitting an enemy hero, which increases by 25% for each additional enemy hero hit. Chip's next Basic Attack will become ranged and also hit all nearby enemies with (Chip's Mark), detonating the mark to deal 200( +40% Total Magic Power) (Magic Damage) and stun each target for 0.6s.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Overtime",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Chip rushes for 2s, gaining up to 65% extra Movement Speed, after which he maintains the max speed for 2s. Chip's next Basic Attack will cause him to charge at the enemy, dealing 200( +30% Total Magic Power) (Magic Damage) and knocking them back slightly.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Shortcut",
        "tag": "Ultimate • High Impact",
        "desc": "Chip drops the (Main Portal) on an enemy hero, dealing 200( +60% Total Magic Power) (Magic Damage) and slowing them by 25%. The Main Portal deals 2 times the damage and slow effect after a delay. Meanwhile, he creates (Connecting Portals) near allied heroes (10 units away) and behind the allied Base. The (Main Portal) and (Connecting Portals) last up to 15s. (Connecting Portal): Heroes (on both teams) can teleport from (Connecting Portals) to the (Main Portal), and allied heroes gain Burst Movement Speed for 1.5s. (Main Portal): The Main Portal inherits 70% of Chip's attributes. Heroes can stand on the (Main Portal) for 2s to return to the (Connecting Portal) they came from. Casting skills or launching Basic Attacks will reset the stand time.",
        "counterTip": "Respect Chip's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Support Carry",
      "Magic Damage",
      "High Skill Ceiling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "alucard",
        "reason": "Sustained frontline presence out-trades in close quarter duels."
      },
      {
        "heroId": "zilong",
        "reason": "Absorbs initial charge and overpowers in prolonged trades."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dominance_ice",
        "tier": "S",
        "reason": "Dominance Ice cuts lifesteal and shield regeneration by 50%."
      },
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Constant knockbacks and slow firewall kite Chip endlessly."
      },
      {
        "heroId": "baxia",
        "tier": "A",
        "reason": "Inherent anti-heal passive and mobility neutralize sustain."
      }
    ],
    "avoidPicks": [
      "valir",
      "karrie",
      "baxia"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Chip's core kit advantage.",
      "Watch for Chip's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Chip during key objective contests."
    ]
  },
  {
    "id": "nolan",
    "avatar": "assets/heroes/nolan.png",
    "name": "Nolan",
    "role": "Assassin",
    "lane": "Jungle",
    "damageType": "Physical",
    "difficulty": "Hard",
    "color": "#38bdf8",
    "avatarBg": "linear-gradient(135deg, #0284c7, #38bdf8)",
    "skills": {
      "passive": {
        "name": "Dimensional Rift",
        "tag": "Passive • Assassin Synergy",
        "desc": "Nolan's skills will leave a (Rift). When a rift comes into contact with another rift, they will (activate) and pull enemies to their center and deal 220( +140% Extra Physical Attack) (Physical Damage) after a short delay. Each time a rift activation hits an enemy, Nolan will gain 15 Energy. If an enemy is hit by multiple rift activations, the damage after the first hit will be reduced by 40%. (Cosmic Leap): If Nolan does not deal or take damage for 5s, he enhances his next Basic Attack to dash to the target, dealing ( +120% Total Physical Attack) (Physical Damage) and leaving a (Rift). (Damage to and from Minions or Creeps will not prevent Nolan from getting this effect.)",
        "counterTip": "Track Nolan's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Expansion",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Nolan cuts a rectangular area in front of him with his cosmic gauge, dealing 230( +40% Total Physical Attack) (Physical Damage) and leaving a (Rift) at the first enemy hit.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Gauge",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Nolan charges in the target direction and slashes with his cosmic gauge, dealing 70( +13% Total Physical Attack) (Physical Damage) to enemies in his path and leaving a (Rift).",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Fracture",
        "tag": "Ultimate • High Impact",
        "desc": "Nolan slashes the target location 3 times, dealing 120( +50% Extra Physical Attack) (Physical Damage) with each slash while leaving 3 rifts. The rifts will activate automatically while Nolan dashes backward.",
        "counterTip": "Respect Nolan's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Assassin Carry",
      "Physical Damage",
      "High Skill Ceiling"
    ],
    "powerSpikes": {
      "early": 4,
      "mid": 5,
      "late": 3
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "Rapid mobility bridges distance and eliminates isolated targets."
      },
      {
        "heroId": "gord",
        "reason": "Blinks past Gord stuns and deletes during channel."
      }
    ],
    "counteredBy": [
      {
        "heroId": "khufra",
        "tier": "S",
        "reason": "Bouncing Ball cancels dash abilities and grounds momentum."
      },
      {
        "heroId": "franco",
        "tier": "S",
        "reason": "Suppression ultimate cannot be purified and locks Nolan down."
      },
      {
        "heroId": "antique_cuirass",
        "tier": "A",
        "reason": "Reduces skill damage scaling by 12% across multi-hit combos."
      }
    ],
    "avoidPicks": [
      "khufra",
      "franco",
      "minsitthar"
    ],
    "recommendedSpell": "Retribution",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Nolan's core kit advantage.",
      "Watch for Nolan's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Nolan during key objective contests."
    ]
  },
  {
    "id": "melissa",
    "avatar": "assets/heroes/melissa.png",
    "name": "Melissa",
    "role": "Marksman",
    "lane": "Gold",
    "damageType": "Physical",
    "difficulty": "Medium",
    "color": "#fbbf24",
    "avatarBg": "linear-gradient(135deg, #d97706, #f59e0b)",
    "skills": {
      "passive": {
        "name": "Doll Buster",
        "tag": "Passive • Marksman Synergy",
        "desc": "\"My tailor shop excels at fixing and 'fixing' dolls. Am I right, Muddles?\" (Melissa deals 125% damage to Minions, Creeps, and Summoned Units.)",
        "counterTip": "Track Melissa's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Falling!",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "\"Watch me slide forward and increase my Attack Speed for 3 seconds— Ah, that was just boring…\" \"(Muddles), go that way!\" \"(Cuddles), come here!\" (The skill's cooldown is reduced by 0.5s each time Melissa damages the enemy by attacking (Muddles).)",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Eyes on You!",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "\"The plan's like this: Throw (Muddles) out to hold down the bad guys, and then… I come on stage!\" \"I puncture the bad guys, while (Giggles) hit (Muddles) to punish them as well! Hee, fantastic!\" ((Muddles) deals 250( +80% Total Physical Attack) (Physical Damage) on the first hit and links nearby enemies for up to 6s. Linked enemies are slowed by 60% that decays over 1.5s and can break the link by moving out of the range. (Muddles) will return to Melissa early when there are no enemies around and immediately if she's too far away. When (Muddles) is present, you can tap the (Attack Minion) button to directly attack (Muddles), though it cannot trigger the multi-hit damage.)",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Go Away!",
        "tag": "Ultimate • High Impact",
        "desc": "(Cuddles), protect me! For 4 seconds, let no bad guys come close. Unless I say otherwise! (When activated, the field knocks back enemies in the area and deals them 500( +100% Total Magic Power) (Magic Damage). It'll then continuously knock back enemies who attempt to enter the field, dealing them 50( +10% Total Magic Power) (Magic Damage) and briefly slowing them. The field will also interrupt the enemy's movement skills unless they're immune to control effects. The field will move with Melissa once, when she's about to move out of the boundary. (Passive): Melissa's Physical & Magic Defense are increased by 3. This effect is increased to 5 times when the skill is active.)",
        "counterTip": "Respect Melissa's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Marksman Carry",
      "Physical Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 2,
      "mid": 4,
      "late": 5
    },
    "counters": [
      {
        "heroId": "tigreal",
        "reason": "Can out-range and kite Tigreal outside his melee engage radius."
      },
      {
        "heroId": "hylos",
        "reason": "High DPS melts Hylos HP pool from safe distance."
      }
    ],
    "counteredBy": [
      {
        "heroId": "saber",
        "tier": "S",
        "reason": "Instant point-and-click lock on airborne deletes Melissa before repositioning."
      },
      {
        "heroId": "blade_armor",
        "tier": "S",
        "reason": "Blade Armor reflects basic attack physical damage right back."
      },
      {
        "heroId": "khufra",
        "tier": "A",
        "reason": "Bouncing Ball and Tyrants Rage halt escape dashes."
      }
    ],
    "avoidPicks": [
      "saber",
      "khufra",
      "fanny"
    ],
    "recommendedSpell": "Flicker / Vengeance",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Melissa's core kit advantage.",
      "Watch for Melissa's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Melissa during key objective contests."
    ]
  },
  {
    "id": "valentina",
    "avatar": "assets/heroes/valentina.png",
    "name": "Valentina",
    "role": "Mage",
    "lane": "Mid",
    "damageType": "Magic",
    "difficulty": "Hard",
    "color": "#8b5cf6",
    "avatarBg": "linear-gradient(135deg, #6d28d9, #8b5cf6)",
    "skills": {
      "passive": {
        "name": "Primal Force",
        "tag": "Passive • EXP Steal & HP Lifesteal",
        "desc": "Valentina gains bonus EXP when hitting enemy heroes. If her level is higher than the target, converts 32%–60% of damage dealt into HP.",
        "counterTip": "Do not let Valentina establish an early level advantage where her passive life-steal turns into endless sustain."
      },
      "skill1": {
        "name": "Shadow Strike",
        "tag": "Skill 1 • Fan Blast & Terrify",
        "desc": "Valentina launches shadow waves in a cone, slowing enemies. Hitting enemies with Shadow Marks applies Terrify for 1s.",
        "counterTip": "Dodge the second hit to prevent the 1s Terrify CC lock."
      },
      "skill2": {
        "name": "Arcane Shade",
        "tag": "Skill 2 • Double Dash & Shadow Bolts",
        "desc": "Valentina dashes forward and fires 3 shadow bolts, reducing Skill 1 cooldown. Can be cast again within 6s.",
        "counterTip": "Valentina has double dash mobility; bait both dashes before committing melee burst."
      },
      "ultimate": {
        "name": "I Am You",
        "tag": "Ultimate • Steal Opponent Ultimate",
        "desc": "Valentina copies target enemy hero’s ultimate and gains the ability to cast it for 20s, while gaining the target’s basic attack form.",
        "counterTip": "Avoid drafting game-changing ultimates (Atlas, Yu Zhong, Faramis, Guinevere) without counterplay; Valentina will copy them against you!"
      }
    },
    "tags": [
      "Ultimate Steal",
      "Terrify CC",
      "High Versatility Counter"
    ],
    "powerSpikes": {
      "early": 4,
      "mid": 5,
      "late": 5
    },
    "counters": [
      {
        "heroId": "tigreal",
        "reason": "Steals Tigreal Implosion and casts it back with higher magic damage."
      },
      {
        "heroId": "atlas",
        "reason": "Steals Fatal Links and pulls the entire enemy team."
      },
      {
        "heroId": "minotaur",
        "reason": "Steals Minoan Fury for free teamwide knockups."
      }
    ],
    "counteredBy": [
      {
        "heroId": "fanny",
        "tier": "S",
        "reason": "Fanny ult is useless for Valentina to steal, and Fanny dives and deletes Valentina."
      },
      {
        "heroId": "ling",
        "tier": "S",
        "reason": "High mobility assassin dives Valentina before she can chain skills."
      },
      {
        "heroId": "kadita",
        "tier": "A",
        "reason": "Petrify into Rough Waves burst one-shots Valentina before she reacts."
      }
    ],
    "avoidPicks": [
      "tigreal",
      "atlas",
      "minotaur"
    ],
    "recommendedSpell": "Flicker / Purify",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR"
    ],
    "tacticalTips": [
      "Never draft heroes with game-changing teamfight ultimates (Tigreal, Atlas) into Valentina, as she turns them against you.",
      "Draft heroes with low-impact ultimates that give her little value."
    ]
  },
  {
    "id": "floryn",
    "avatar": "assets/heroes/floryn.png",
    "name": "Floryn",
    "role": "Support",
    "lane": "Roam",
    "damageType": "Magic",
    "difficulty": "Easy",
    "color": "#06b6d4",
    "avatarBg": "linear-gradient(135deg, #0891b2, #06b6d4)",
    "skills": {
      "passive": {
        "name": "Dew",
        "tag": "Passive • Support Synergy",
        "desc": "Dew's (Lantern) will permanently increase Floryn's attributes by a small amount. After leaving combat for 5s, Floryn can share the (Flower of Hope) with an allied hero (30s cooldown), which will grant them a 150( +80% Total Magic Power) shield each time they are healed by Floryn. Floryn will never sell the (Lantern).",
        "counterTip": "Track Floryn's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Sprout",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Floryn casts a blob of energy ahead that explodes upon hitting an enemy, dealing 175( +90% Total Magic Power) (Magic Damage) to nearby enemies and stunning them for 0.7s (and revealing their positions briefly).",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Sow",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Floryn tosses an Energy Seed at the target enemy, dealing 180( +100% Total Magic Power) (Magic Damage). Healing Fruits will then spawn and bounce to nearby allied heroes, restoring their (HP) by 175( +90% Total Magic Power).",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Bloom",
        "tag": "Ultimate • High Impact",
        "desc": "Floryn resonates with Dew's power, restoring 250( +100% Total Magic Power) (HP) to all allied heroes 2 times no matter where they are on the battlefield. This effect also removes any Healing Reduction or Shield Reduction effects on allied heroes, and makes them immune to those effects for 2s.",
        "counterTip": "Respect Floryn's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Support Carry",
      "Magic Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "alucard",
        "reason": "Sustained frontline presence out-trades in close quarter duels."
      },
      {
        "heroId": "zilong",
        "reason": "Absorbs initial charge and overpowers in prolonged trades."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dominance_ice",
        "tier": "S",
        "reason": "Dominance Ice cuts lifesteal and shield regeneration by 50%."
      },
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Constant knockbacks and slow firewall kite Floryn endlessly."
      },
      {
        "heroId": "baxia",
        "tier": "A",
        "reason": "Inherent anti-heal passive and mobility neutralize sustain."
      }
    ],
    "avoidPicks": [
      "valir",
      "karrie",
      "baxia"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Floryn's core kit advantage.",
      "Watch for Floryn's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Floryn during key objective contests."
    ],
    "secondaryLane": "Mid"
  },
  {
    "id": "aulus",
    "avatar": "assets/heroes/aulus.png",
    "name": "Aulus",
    "role": "Fighter",
    "lane": "EXP",
    "damageType": "Physical",
    "difficulty": "Medium",
    "color": "#f97316",
    "avatarBg": "linear-gradient(135deg, #c2410c, #ea580c)",
    "skills": {
      "passive": {
        "name": "Fighting Spirit",
        "tag": "Passive • Fighter Synergy",
        "desc": "Aulus adds a stack of (Fighting Spirit) to his axe per second for 3s after dealing damage to any enemy (up to 4 stacks). Each stack grants 3-12 extra (Physical Attack) and 1-4 (Physical Penetration) (scales with (Undying Fury) level). Aulus also gains 10% extra Movement Speed and 27-125 Basic Attack Damage at max (Fighting Spirit) stacks (scales with level).",
        "counterTip": "Track Aulus's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Aulus, Charge!",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Aulus removes all slow effects and gains 30% extra Movement Speed and 20% Damage Reduction against attacks from the front for 5s. Aulus gains 1% Damage Reduction for every 10 extra Physical Attack, up to 60%.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Skill 2",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Mobility or crowd control skill.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "The Power of Axe",
        "tag": "Ultimate • High Impact",
        "desc": "Aulus brandishes his axe, dealing 150( +120% Extra Physical Attack) (Physical Damage) to enemies in a fan-shaped area, and enhancing up to 6 of his next Basic Attacks for 3s according to the enemies hit (3 per Hero or Creep, 1 per Minion). Enhanced Basic Attacks gain 100% extra Attack Speed and restore 50 (HP) to Aulus.",
        "counterTip": "Respect Aulus's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Fighter Carry",
      "Physical Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "alucard",
        "reason": "Sustained frontline presence out-trades in close quarter duels."
      },
      {
        "heroId": "zilong",
        "reason": "Absorbs initial charge and overpowers in prolonged trades."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dominance_ice",
        "tier": "S",
        "reason": "Dominance Ice cuts lifesteal and shield regeneration by 50%."
      },
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Constant knockbacks and slow firewall kite Aulus endlessly."
      },
      {
        "heroId": "baxia",
        "tier": "A",
        "reason": "Inherent anti-heal passive and mobility neutralize sustain."
      }
    ],
    "avoidPicks": [
      "valir",
      "karrie",
      "baxia"
    ],
    "recommendedSpell": "Flicker / Vengeance",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Aulus's core kit advantage.",
      "Watch for Aulus's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Aulus during key objective contests."
    ],
    "secondaryLane": "Jungle"
  },
  {
    "id": "natan",
    "avatar": "assets/heroes/natan.png",
    "name": "Natan",
    "role": "Marksman",
    "lane": "Gold",
    "damageType": "Hybrid",
    "difficulty": "Easy",
    "color": "#fbbf24",
    "avatarBg": "linear-gradient(135deg, #d97706, #f59e0b)",
    "skills": {
      "passive": {
        "name": "Theory of Everything",
        "tag": "Passive • Marksman Synergy",
        "desc": "Natan gains a stack of (Entanglement) each time he or his (Reverse-Clone) hits an enemy with a skill (up to 6 stacks). Each stack lasts 5s and grants 7.5% Attack Speed and 7.5% Movement Speed. Natan's Basic Attack projectiles will return to Natan after reaching the maximum range, dealing an extra 30( +50% Total Physical Attack) (+70% Total Magic Power) (Magic Damage) to enemies along the way (inherits a portion of Attack Effects).",
        "counterTip": "Track Natan's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Superposition",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Natan shoots a dense mass of energy in the target direction, dealing 225( +100% Total Physical Attack) (+140% Total Magic Power) (Magic Damage) to enemies in its path.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Interference!",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Natan launches a Gravitational Attractor in the target direction, dealing 150( +50% Total Physical Attack) (+70% Total Magic Power) (Magic Damage) to enemies in its path and knocking them back. The Attractor detonates upon reaching the maximum range, dealing 30( +10% Total Physical Attack) (+14% Total Magic Power) (Magic Damage) to nearby enemies and knocking them back.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Entropy?",
        "tag": "Ultimate • High Impact",
        "desc": "Natan summons a (Reverse-Clone) at a target location 6 units away that lasts 10s, inherits 35% of his attack attributes (and a portion of Attack Effects), and will copy his moves and attacks in reverse. (Use Again): Natan switches places with the (Reverse-Clone). Each cast reduces other skills' remaining cooldowns by 50%. The (Reverse-Clone) will disappear if Natan is too far away, while the cooldown of this skill will be reduced by the remaining duration.",
        "counterTip": "Respect Natan's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Marksman Carry",
      "Hybrid Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 2,
      "mid": 4,
      "late": 5
    },
    "counters": [
      {
        "heroId": "tigreal",
        "reason": "Can out-range and kite Tigreal outside his melee engage radius."
      },
      {
        "heroId": "hylos",
        "reason": "High DPS melts Hylos HP pool from safe distance."
      }
    ],
    "counteredBy": [
      {
        "heroId": "saber",
        "tier": "S",
        "reason": "Instant point-and-click lock on airborne deletes Natan before repositioning."
      },
      {
        "heroId": "blade_armor",
        "tier": "S",
        "reason": "Blade Armor reflects basic attack physical damage right back."
      },
      {
        "heroId": "khufra",
        "tier": "A",
        "reason": "Bouncing Ball and Tyrants Rage halt escape dashes."
      }
    ],
    "avoidPicks": [
      "saber",
      "khufra",
      "fanny"
    ],
    "recommendedSpell": "Flicker / Vengeance",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Natan's core kit advantage.",
      "Watch for Natan's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Natan during key objective contests."
    ]
  },
  {
    "id": "mathilda",
    "avatar": "assets/heroes/mathilda.png",
    "name": "Mathilda",
    "role": "Support",
    "lane": "Roam",
    "damageType": "Magic",
    "difficulty": "Medium",
    "color": "#06b6d4",
    "avatarBg": "linear-gradient(135deg, #0891b2, #06b6d4)",
    "skills": {
      "passive": {
        "name": "Ancestral Guidance",
        "tag": "Passive • Support Synergy",
        "desc": "Mathilda gains (Ancestral Guidance) while moving. When it's fully charged, her next Basic Attack will be enhanced, dealing 200( +100% Total Physical Attack) (+100% Total Magic Power) (Magic Damage) to the target and granting her 80 extra Movement Speed that decays over 2.5s.",
        "counterTip": "Track Mathilda's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Soul Bloom",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Mathilda resonates with the power of her ancestors for 4s, attracting wisps as her movement distance increases (up to 6 wisps). At the end of the skill's duration, or when Mathilda casts this skill again, the wisps will seek and attack nearby enemies, each dealing 275( +80% Total Magic Power) (Magic Damage) and revealing the enemies' positions briefly. Subsequent damage dealt by wisps to the same target decays to 40%.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Guiding Wind",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Mathilda leaps in the target direction and creates a field around her, gaining a 500( +180% Total Magic Power) shield and 25% extra Movement Speed for 3s. Allied heroes who come into contact with the field will receive a 60% shield and (Guiding Wind). The first allied hero that triggers (Guiding Wind) will be guided to Mathilda, and both of them will gain the same Movement Speed boost. When casting this skill during (Circling Eagle), Mathilda won't change her position. (Guiding Wind) expires 2s after the hero leaves Mathilda's field.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Circling Eagle",
        "tag": "Ultimate • High Impact",
        "desc": "Mathilda applies a (Soul Mark) to the target enemy hero and circles around them for up to 3.5s, during which her wisps will fly into nearby enemies, each dealing 40( +15% Total Magic Power) (Magic Damage). The Soul Mark will also slow the target by 15% and (Soul Bloom) will prioritize targets with Soul Mark. Within the duration, Mathilda can select an area to dash to. At the end of the duration, she'll dash at the target with (Soul Mark), dealing 320( +120% Total Magic Power) (Magic Damage) while knocking enemies in her path airborne for 0.6s and transferring the (Soul Mark) to the first enemy hero that she knocks airborne. Mathilda gains Control Immunity and a 400( +160% Total Magic Power) shield for the skill duration.",
        "counterTip": "Respect Mathilda's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Support Carry",
      "Magic Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "alucard",
        "reason": "Sustained frontline presence out-trades in close quarter duels."
      },
      {
        "heroId": "zilong",
        "reason": "Absorbs initial charge and overpowers in prolonged trades."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dominance_ice",
        "tier": "S",
        "reason": "Dominance Ice cuts lifesteal and shield regeneration by 50%."
      },
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Constant knockbacks and slow firewall kite Mathilda endlessly."
      },
      {
        "heroId": "baxia",
        "tier": "A",
        "reason": "Inherent anti-heal passive and mobility neutralize sustain."
      }
    ],
    "avoidPicks": [
      "valir",
      "karrie",
      "baxia"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Mathilda's core kit advantage.",
      "Watch for Mathilda's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Mathilda during key objective contests."
    ],
    "secondaryLane": "Mid"
  },
  {
    "id": "aamon",
    "avatar": "assets/heroes/aamon.png",
    "name": "Aamon",
    "role": "Assassin",
    "lane": "Jungle",
    "damageType": "Magic",
    "difficulty": "Medium",
    "color": "#38bdf8",
    "avatarBg": "linear-gradient(135deg, #0284c7, #38bdf8)",
    "skills": {
      "passive": {
        "name": "Invisible Armor",
        "tag": "Passive • Assassin Synergy",
        "desc": "Aamon enters the (Camouflage) state each time he hits an enemy with a skill, during which he cannot be targeted, restores 25( +15% Total Magic Power) plus 3% of his lost HP every 0.6s, and gains 60% extra Movement Speed that rapidly decays over 3s. Upon leaving the (Camouflage) state, Aamon immediately resets his Basic Attack's cooldown and enhances his Basic Attacks within the next 2.5s. Each enhanced Basic Attack deals 70( +100% Total Physical Attack) (+115% Total Magic Power) (Magic Damage) and reduces Aamon's skill cooldowns by 0.5s. The first enhanced Basic Attack's damage is increased to 120% if Aamon leaves the (Camouflage) state actively.",
        "counterTip": "Track Aamon's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Soul Shards",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "(Passive:) Aamon charges his armor each time he casts a skill or hits an enemy with a skill or enhanced Basic Attack. At 5 charges, Aamon throws 5 shards at the target on his next attack, each shard dealing 50( +15% Total Magic Power) (Magic Damage). The shards will then scatter around the target. (Active:) Aamon throws a shard at a nearby enemy, dealing 175( +60% Total Magic Power) (Magic Damage).",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Slayer Shards",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Aamon throws a shard forward, dealing 120( +50% Total Magic Power) (Magic Damage) to enemies along the way. The shard will return to Aamon after a short delay and allow him to enter the (Camouflage) state. If the shard hits a non-minion enemy, it'll slow them by 50% for 2s and return to Aamon immediately.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Endless Shards",
        "tag": "Ultimate • High Impact",
        "desc": "Aamon throws all shards at a designated enemy and slows them by 30% for 1.5s. After a short delay, the shards will fly to the enemy's location again, each dealing 90( +24% Total Magic Power)-150( +40% Total Magic Power) (Magic Damage). The number of shards increases with Aamon's armor charges and the shards on the ground (8-25). The damage dealt increases with the target's lost HP, to the max when the target's HP is below 30%. The same target takes less damage from subsequent attacks.",
        "counterTip": "Respect Aamon's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Assassin Carry",
      "Magic Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 4,
      "mid": 5,
      "late": 3
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "Rapid mobility bridges distance and eliminates isolated targets."
      },
      {
        "heroId": "gord",
        "reason": "Blinks past Gord stuns and deletes during channel."
      }
    ],
    "counteredBy": [
      {
        "heroId": "khufra",
        "tier": "S",
        "reason": "Bouncing Ball cancels dash abilities and grounds momentum."
      },
      {
        "heroId": "franco",
        "tier": "S",
        "reason": "Suppression ultimate cannot be purified and locks Aamon down."
      },
      {
        "heroId": "antique_cuirass",
        "tier": "A",
        "reason": "Reduces skill damage scaling by 12% across multi-hit combos."
      }
    ],
    "avoidPicks": [
      "khufra",
      "franco",
      "minsitthar"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Aamon's core kit advantage.",
      "Watch for Aamon's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Aamon during key objective contests."
    ]
  },
  {
    "id": "beatrix",
    "avatar": "assets/heroes/beatrix.png",
    "name": "Beatrix",
    "role": "Marksman",
    "lane": "Gold",
    "damageType": "Physical",
    "difficulty": "Hard",
    "color": "#ec4899",
    "avatarBg": "linear-gradient(135deg, #be185d, #ec4899)",
    "skills": {
      "passive": {
        "name": "Mechanical Genius",
        "tag": "Passive • 4 Weapon Loadouts",
        "desc": "Beatrix carries 4 custom weapons: Renner (Long-Range Sniper), Bennett (Area Bombardment), Wesker (Shotgun Burst), and Nibiru (Submachine Rapid Fire). Cannot crit, converts crit chance to physical attack.",
        "counterTip": "Identify her equipped weapon: stay scattered vs Bennett, keep distance vs Wesker shotgun, dodge Renner linear trajectory."
      },
      "skill1": {
        "name": "Masterful Gunner",
        "tag": "Skill 1 • Primary Weapon Swap",
        "desc": "Beatrix swaps her primary weapon with her secondary weapon, altering her basic attack pattern and ultimate skill.",
        "counterTip": "Punish her during weapon swap animations where she cannot instantly counter-attack."
      },
      "skill2": {
        "name": "Tactical Reposition",
        "tag": "Skill 2 • Dash & Instant Reload",
        "desc": "Beatrix dashes forward and instantly reloads her currently equipped weapon.",
        "counterTip": "Track her dash cooldown. Once her dash is burned, she has no escape mobility."
      },
      "ultimate": {
        "name": "Weapon Ultimates",
        "tag": "Ultimate • Quad Strategic Artillery",
        "desc": "Renner’s Apathy (Long-range snipe), Bennett’s Rage (Carpet bombing), Wesker’s Elation (Massive shotgun blast), Nibiru’s Passion (6-volley submachine fire).",
        "counterTip": "Renner snipe shows a red laser line—sidestep when you see it. Use Wind of Nature when she approaches with Wesker."
      }
    },
    "tags": [
      "4 Weapons",
      "Insane Burst",
      "Long Range Sniper"
    ],
    "powerSpikes": {
      "early": 4,
      "mid": 4,
      "late": 5
    },
    "counters": [
      {
        "heroId": "miya",
        "reason": "Out-bursts and out-ranges Miya at all stages of the game."
      },
      {
        "heroId": "layla",
        "reason": "Wesker shotgun or Renner sniper one-shots immobile marksmen."
      }
    ],
    "counteredBy": [
      {
        "heroId": "hayabusa",
        "tier": "S",
        "reason": "High mobility assassin can dive Beatrix and shadow away from sniper/shotgun."
      },
      {
        "heroId": "chou",
        "tier": "S",
        "reason": "The Way of Dragon kicks her out of position before she can react."
      },
      {
        "heroId": "franco",
        "tier": "A",
        "reason": "Iron Hook punishes her when she roots herself using Renner sniper ult."
      },
      {
        "heroId": "saber",
        "tier": "A",
        "reason": "Point-and-click airborne lock-on burst deletes Beatrix."
      }
    ],
    "avoidPicks": [
      "layla",
      "miya",
      "karrie"
    ],
    "recommendedSpell": "Flicker",
    "counterItems": [
      "WIND_OF_NATURE",
      "ANTIQUE_CUIRASS",
      "TWILIGHT_ARMOR"
    ],
    "tacticalTips": [
      "Renner sniper roots her in place while aiming; use this exact moment for dive ganks.",
      "Buy Twilight Armor or Wind of Nature to negate her single-bullet burst.",
      "Flank her from bushes; frontal engages are suicidal against her Wesker shotgun."
    ]
  },
  {
    "id": "yve",
    "avatar": "assets/heroes/yve.png",
    "name": "Yve",
    "role": "Mage",
    "lane": "Mid",
    "damageType": "Magic",
    "difficulty": "Hard",
    "color": "#6366f1",
    "avatarBg": "linear-gradient(135deg, #3730a3, #6366f1)",
    "skills": {
      "passive": {
        "name": "Starlight Grace",
        "tag": "Passive • Movement Speed & Ult Taps",
        "desc": "Yve gains movement speed stacks when hitting skills (up to 10 stacks), converting into extra taps during her ultimate.",
        "counterTip": "Keep her moving so she cannot safely build up maximum Starlight Grace stacks."
      },
      "skill1": {
        "name": "Void Blast",
        "tag": "Skill 1 • Center Burst & Speed",
        "desc": "Yve detonates Galactic Energy, dealing magic damage. Enemies in the center circle take double damage and grant Yve bonus movement speed.",
        "counterTip": "Stay out of the inner circle to avoid the doubled damage burst."
      },
      "skill2": {
        "name": "Void Crystal",
        "tag": "Skill 2 • Continuous Slow Zone",
        "desc": "Yve summons a crystal that radiates energy in a direction, dealing continuous magic damage and slowing enemies by up to 60%.",
        "counterTip": "Radiant Armor completely trivializes the continuous multi-tick damage of Void Crystal."
      },
      "ultimate": {
        "name": "Real World Manipulation",
        "tag": "Ultimate • 7x7 Grid Chessboard",
        "desc": "Yve creates a massive 7x7 grid board. Tapping deals magic damage; sliding across grids slows enemies by 60% and deals continuous damage. Grants a shield and CC immunity (except suppression).",
        "counterTip": "Suppression (Franco / Kaja) immediately cancels her ultimate! Non-suppression CC only stuns without canceling the board."
      }
    },
    "tags": [
      "Galactic Grid Slow",
      "Area Control",
      "Shield While Channeling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 5,
      "late": 5
    },
    "counters": [
      {
        "heroId": "estes",
        "reason": "Galactic grid creates unavoidable 75% slows over Estes group."
      },
      {
        "heroId": "terizla",
        "reason": "Kites Terizla to death with continuous slow taps."
      }
    ],
    "counteredBy": [
      {
        "heroId": "franco",
        "tier": "S",
        "reason": "Suppression (Bloody Hunt) cancels Yve ultimate channel."
      },
      {
        "heroId": "yu_zhong",
        "tier": "S",
        "reason": "Dragon form ignores slow field and knocks up Yve."
      },
      {
        "heroId": "claude",
        "tier": "A",
        "reason": "Blinks behind Yve and shreds her channeled shield with Blazing Duet."
      }
    ],
    "avoidPicks": [
      "estes",
      "terizla"
    ],
    "recommendedSpell": "Flicker / Purify",
    "counterItems": [
      "RADIANT_ARMOR",
      "ATHENAS_SHIELD"
    ],
    "tacticalTips": [
      "Normal stuns do NOT cancel Yve ultimate (she gains immunity to normal CC while channeling). Only SUPPRESSION (Franco / Kaja) or petrify cancels it!",
      "Buy Radiant Armor instead of Athena’s Shield against Yve, because her grid deals continuous multi-tick magic damage."
    ]
  },
  {
    "id": "paquito",
    "avatar": "assets/heroes/paquito.png",
    "name": "Paquito",
    "role": "Fighter",
    "lane": "EXP",
    "secondaryLane": "Jungle",
    "damageType": "Physical",
    "difficulty": "Hard",
    "color": "#d97706",
    "avatarBg": "linear-gradient(135deg, #b45309, #d97706)",
    "skills": {
      "passive": {
        "name": "Champ Stance",
        "tag": "Passive • Skill Reset & Enhanced Form",
        "desc": "Paquito builds Champ Stance stacks by hitting enemies with skills. At 3 stacks, his next skill is enhanced with no cooldown and deals bonus effects.",
        "counterTip": "Watch his stack bar above his head. Disengage when he has 3 stacks ready."
      },
      "skill1": {
        "name": "Heavy Left Punch",
        "tag": "Skill 1 • Shield Punch",
        "desc": "Paquito throws a heavy punch, dealing damage and gaining a massive shield. Enhanced version doubles the shield value.",
        "counterTip": "Do not trade basic attacks while his punch shield is active."
      },
      "skill2": {
        "name": "Jab",
        "tag": "Skill 2 • Dash Uppercut",
        "desc": "Paquito dashes forward and throws a fierce jab, dealing physical damage to all enemies in his path.",
        "counterTip": "Antique Cuirass reduces his rapid skill sequence by 24% immediately."
      },
      "ultimate": {
        "name": "Knockout Strike",
        "tag": "Ultimate • Hook & Uppercut Knockup",
        "desc": "Paquito throws an elbow strike slowing enemies, then hooks forward. Enhanced version pushes enemies back and knocks them airborne.",
        "counterTip": "Use Purify or maintain distance so he cannot chain Knockout Strike into multiple skill resets."
      }
    },
    "tags": [
      "Boxing Combos",
      "Thick Shields",
      "High Mobility Burst"
    ],
    "powerSpikes": {
      "early": 4,
      "mid": 5,
      "late": 4
    },
    "counters": [
      {
        "heroId": "chou",
        "reason": "Out-shields and out-trades Chou in lane brawls."
      },
      {
        "heroId": "brody",
        "reason": "Fast dash combo closes the gap and bursts Brody before windup."
      },
      {
        "heroId": "beatrix",
        "reason": "Extreme burst gap-closer wipes Beatrix off the map."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dyrroth",
        "tier": "S",
        "reason": "Destroys Paquito early game with 75% defense break."
      },
      {
        "heroId": "khufra",
        "tier": "S",
        "reason": "Bouncing Ball interrupts all of Paquito dash-punches."
      },
      {
        "heroId": "minsitthar",
        "tier": "S",
        "reason": "King’s Calling completely grounds Paquito, preventing Champ Stance combos."
      },
      {
        "heroId": "ruby",
        "tier": "A",
        "reason": "Constant micro-stuns and lifesteal disrupt Paquito rhythm."
      }
    ],
    "avoidPicks": [
      "chou",
      "brody",
      "beatrix"
    ],
    "recommendedSpell": "Flicker / Retribution",
    "counterItems": [
      "ANTIQUE_CUIRASS",
      "DOMINANCE_ICE"
    ],
    "tacticalTips": [
      "Fight him when his Champ Stance bar has 0 or 1 stacks. At 2 or 3 stacks, he gets a free skill reset with bonus shield.",
      "Antique Cuirass reduces his physical attack by 24% because all his damage comes from skill combos."
    ]
  },
  {
    "id": "edith",
    "avatar": "assets/heroes/edith.png",
    "name": "Edith",
    "role": "Tank",
    "lane": "Roam",
    "damageType": "Magic",
    "difficulty": "Easy",
    "color": "#10b981",
    "avatarBg": "linear-gradient(135deg, #047857, #10b981)",
    "skills": {
      "passive": {
        "name": "Overload",
        "tag": "Passive • Tank Synergy",
        "desc": "After each skill cast, Edith and Phylax become Overloaded for 3s, during which all Basic Attacks will trigger chain lightning, dealing extra (Magic Damage) equal to ( +30% Total Magic Power) plus 4(+0.25*Hero Level)% of the target's Max HP to up to 4 enemies. Chain lightning damage against Minions is increased to 150%.",
        "counterTip": "Track Edith's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Earth Shatter",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "After a 0.75s delay, Edith controls Phylax to launch an earth-shattering blow in a designated direction, dealing 225( +10% Total HP) (Physical Damage) to enemies hit (deals 120% damage to Minions) and knocking them airborne for 1s. This skill won't be interrupted by regular control effects (excluding Suppression).",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Onward",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Edith controls Phylax to charge in the target direction, dealing 90( +3% Total HP) (Physical Damage) to enemies along the way. If Phylax hits an enemy hero during the charge, it will stop immediately and throw them over its shoulder, dealing 108( +5% Total HP) (Physical Damage).",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Primal Wrath",
        "tag": "Ultimate • High Impact",
        "desc": "(Passive:) When inside Phylax, Edith can accumulate Wrath according to the damage she receives (calculated before damage reduction). (Active:) Edith ejects herself forward from Phylax, knocking back nearby enemies. After that, she takes flight and can perform ranged Basic Attacks, each dealing 35( +75% Total Physical Attack) (+25% Total Magic Power) (Magic Damage). Edith also gains new skills in this state. When in flight, Edith gains 350( +5% Total HP)-350( +20% Total HP) extra Shield, 50%-150% extra Attack Speed and 5%-20% Hybrid Lifesteal based on the Wrath she accumulated, and converts each point of (Extra Physical Defense) and (Extra Magic Defense) into 3.2 (Magic Power). The flight state lasts up to 8s.",
        "counterTip": "Respect Edith's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Tank Carry",
      "Magic Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "Frontline crowd control locks down squishy carries."
      },
      {
        "heroId": "miya",
        "reason": "Heavy armor and taunts/stuns disrupt basic attack rhythm."
      }
    ],
    "counteredBy": [
      {
        "heroId": "karrie",
        "tier": "S",
        "reason": "Lightwheel True Damage completely bypasses high armor and magic defense."
      },
      {
        "heroId": "lunox",
        "tier": "S",
        "reason": "Chaos magic penetration shreds % Max HP frontliners."
      },
      {
        "heroId": "demon_hunter_sword",
        "tier": "A",
        "reason": "DHS passive deals 8% current HP on every basic attack."
      }
    ],
    "avoidPicks": [
      "karrie",
      "lunox",
      "claude"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Edith's core kit advantage.",
      "Watch for Edith's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Edith during key objective contests."
    ],
    "secondaryLane": "EXP"
  },
  {
    "id": "phoveus",
    "avatar": "assets/heroes/phoveus.png",
    "name": "Phoveus",
    "role": "Fighter",
    "lane": "EXP",
    "secondaryLane": "Mid",
    "damageType": "Magic",
    "difficulty": "Medium",
    "color": "#7c3aed",
    "avatarBg": "linear-gradient(135deg, #4c1d95, #7c3aed)",
    "skills": {
      "passive": {
        "name": "Demonic Intuition",
        "tag": "Passive • Dash Detection Cooldown Cut",
        "desc": "Astaros senses enemy blinks or dashes within 8 yards, reducing Phoveus skill cooldowns by 1s.",
        "counterTip": "DO NOT PICK DASH HEROES (Wanwan, Harith, Lancelot) against Phoveus; every dash reduces his cooldowns."
      },
      "skill1": {
        "name": "Malefic Terror",
        "tag": "Skill 1 • Monolith Slam & Shield",
        "desc": "Phoveus slams his monolith, dealing magic damage, slowing by 25%, and gaining a shield.",
        "counterTip": "Do not stand close to minions where his shield generation scales higher."
      },
      "skill2": {
        "name": "Astaros Eye",
        "tag": "Skill 2 • Eye Summon & Pull",
        "desc": "Phoveus summons Astaros Eye. After 1s, pulls enemies toward the center.",
        "counterTip": "Walk out of the circular eye zone before the 1s detonation."
      },
      "ultimate": {
        "name": "Demonic Force",
        "tag": "Ultimate • Instant Dash Punish Dive",
        "desc": "Whenever an enemy hero dashes/blinks within 10 yards, Phoveus can instantly activate Demonic Force to dive directly onto them, dealing heavy magic damage and gaining a shield. Can be cast up to 6 times consecutively.",
        "counterTip": "Hardest counter to Wanwan and dash assassins in MLBB. If fighting Phoveus, stop dashing and use Flicker only when necessary."
      }
    },
    "tags": [
      "Ultimate Anti-Dash Punisher",
      "Demonic Force Shield",
      "Heavy Magic Slam"
    ],
    "powerSpikes": {
      "early": 4,
      "mid": 5,
      "late": 5
    },
    "counters": [
      {
        "heroId": "wanwan",
        "reason": "Every hop Wanwan does triggers Phoveus Demonic Force slam and gives him giant shields."
      },
      {
        "heroId": "joy",
        "reason": "Joy rhythm dashes trigger endless Phoveus slams."
      },
      {
        "heroId": "ruby",
        "reason": "Ruby hop passive gives Phoveus non-stop ultimate triggers."
      },
      {
        "heroId": "fanny",
        "reason": "Cable spam charges Phoveus Demonic Force instantly."
      }
    ],
    "counteredBy": [
      {
        "heroId": "esmeralda",
        "tier": "S",
        "reason": "Esmeralda absorbs all the massive shields Phoveus generates from his ult slams."
      },
      {
        "heroId": "dyrroth",
        "tier": "A",
        "reason": "Dyrroth does not rely on dashes; he walks in and shreds Phoveus."
      },
      {
        "heroId": "baxia",
        "tier": "A",
        "reason": "Baxia cuts Phoveus shields and magic damage."
      }
    ],
    "avoidPicks": [
      "wanwan",
      "joy",
      "ruby",
      "fanny"
    ],
    "recommendedSpell": "Flicker / Flameshot",
    "counterItems": [
      "RADIANT_ARMOR",
      "ATHENAS_SHIELD",
      "DOMINANCE_ICE"
    ],
    "tacticalTips": [
      "NEVER draft dash-heavy heroes (Wanwan, Joy, Ruby) into Phoveus; each dash lowers his ult cooldown and triggers a slam.",
      "Esmeralda is Phoveus number 1 nightmare because she eats his shields as fast as he generates them."
    ]
  },
  {
    "id": "gloo",
    "avatar": "assets/heroes/gloo.png",
    "name": "Gloo",
    "role": "Tank",
    "lane": "Roam",
    "damageType": "Magic",
    "difficulty": "Hard",
    "color": "#10b981",
    "avatarBg": "linear-gradient(135deg, #047857, #10b981)",
    "skills": {
      "passive": {
        "name": "Stick, Stick",
        "tag": "Passive • Tank Synergy",
        "desc": "Enemies gain a stack of (Sticky) each time they're hit by Gloo's skills, decreasing their Movement Speed by 6% for 6s. Stacks up to 5. Each stack of (Sticky) on an enemy reduces their damage dealt to Gloo by 6%.",
        "counterTip": "Track Gloo's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Slam, Slam",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Gloo reaches out and slams the ground, dealing 80( +80% Total Magic Power) (Magic Damage) to the enemy. At the final location, a (Goo) is left behind that explodes after 3s to deal 200( +8% Total HP) (Magic Damage) to nearby enemies and immobilize them for 1s. If Gloo touches the (Goo), it will explode immediately, reset the skill's CD, and heal Gloo for 3% of Max HP.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Pass, Pass",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Gloo stretches forth to deal 100( +50% Total Magic Power) (Magic Damage) to enemies in its path, immobilizing them for 0.5s. If this skill hits a (Goo), Gloo will charge over to it, dragging enemies in its path in the same direction for a distance.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Split, Split",
        "tag": "Ultimate • High Impact",
        "desc": "Gloo splits into (Goos) for 10s, during which it gains 35% extra Movement Speed, recovers 1.5% Max HP per second, and deals 120( +25% Total Magic Power) (Magic Damage) every 0.25s to enemies it comes into contact with. (Grab, Grab): Gloo attaches itself to the target enemy hero with max (Sticky) stacks for up to 9s, recovering 25% Max HP. For the duration, Gloo transfers 80% of the damage he receives (calculated before damage reduction; excluding damage from turrets) to its host, and its Basic Attacks deal 120( +50% Total Magic Power) (Magic Damage). (Go, Go): Gloo leaves its host early. Cooldown is lowered to 5s if the host dies while Gloo is still attached to it.",
        "counterTip": "Respect Gloo's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Tank Carry",
      "Magic Damage",
      "High Skill Ceiling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "Frontline crowd control locks down squishy carries."
      },
      {
        "heroId": "miya",
        "reason": "Heavy armor and taunts/stuns disrupt basic attack rhythm."
      }
    ],
    "counteredBy": [
      {
        "heroId": "karrie",
        "tier": "S",
        "reason": "Lightwheel True Damage completely bypasses high armor and magic defense."
      },
      {
        "heroId": "lunox",
        "tier": "S",
        "reason": "Chaos magic penetration shreds % Max HP frontliners."
      },
      {
        "heroId": "demon_hunter_sword",
        "tier": "A",
        "reason": "DHS passive deals 8% current HP on every basic attack."
      }
    ],
    "avoidPicks": [
      "karrie",
      "lunox",
      "claude"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Gloo's core kit advantage.",
      "Watch for Gloo's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Gloo during key objective contests."
    ],
    "secondaryLane": "EXP"
  },
  {
    "id": "brody",
    "avatar": "assets/heroes/brody.png",
    "name": "Brody",
    "role": "Marksman",
    "lane": "Gold",
    "damageType": "Physical",
    "difficulty": "Medium",
    "color": "#e11d48",
    "avatarBg": "linear-gradient(135deg, #9f1239, #e11d48)",
    "skills": {
      "passive": {
        "name": "Abyss Corrosion",
        "tag": "Passive • Abyss Marks & Basic Attack Windup",
        "desc": "Brody can move while winding up his basic attack, but has slower attack speed. Basic attacks deal high physical damage and apply Abyss Marks (up to 4 stacks), increasing damage taken.",
        "counterTip": "Brody’s basic attack cannot be cancelled once locked on, but Antique Cuirass cuts his follow-up burst drastically."
      },
      "skill1": {
        "name": "Abyss Impact",
        "tag": "Skill 1 • Piercing Shockwave",
        "desc": "Brody launches a shockwave in a line, dealing physical damage and slowing enemies by 45%. Deals bonus damage and extra marks per target pierced.",
        "counterTip": "Do not stand directly behind minions where his shockwave gains max piercing damage."
      },
      "skill2": {
        "name": "Corrosive Strike",
        "tag": "Skill 2 • Stun & Backflip",
        "desc": "Brody dashes to an enemy, stunning them for 0.8s and inflicting 1 Abyss Mark, then backflips to safe distance gaining 45% movement speed.",
        "counterTip": "Anticipate the stun and use Purify; engage immediately when he lands from his backflip."
      },
      "ultimate": {
        "name": "Torn-Apart Memory",
        "tag": "Ultimate • Multi-Target Execution",
        "desc": "Brody locks onto all targets within 8 yards, firing bullets that deal physical damage + % missing HP bonus per Abyss Mark on the target.",
        "counterTip": "Use Wind of Nature or Winter Crown when you see the ultimate channeling, especially if you have 4 Abyss Marks."
      }
    },
    "tags": [
      "Early Game Lane Bully",
      "Long Range Lock-on Ult",
      "High AD Burst"
    ],
    "powerSpikes": {
      "early": 5,
      "mid": 4,
      "late": 3
    },
    "counters": [
      {
        "heroId": "lesley",
        "reason": "Dominates Lesley in early trades with Abyss Corrosion burst."
      },
      {
        "heroId": "wanwan",
        "reason": "Stun and huge single-shot damage prevents Wanwan from jumping freely."
      },
      {
        "heroId": "claude",
        "reason": "Zones Claude from minion waves early before Claude has core items."
      }
    ],
    "counteredBy": [
      {
        "heroId": "paquito",
        "tier": "S",
        "reason": "Paquito close-quarter combo locks Brody down through his slow wind-up."
      },
      {
        "heroId": "ling",
        "tier": "S",
        "reason": "Can dive Brody and use Tempest of Blades to become untargetable during Brody ult."
      },
      {
        "heroId": "lolita",
        "tier": "A",
        "reason": "Blocks Brody basic attack projectiles and Torn-Apart Memory ultimate."
      },
      {
        "heroId": "franco",
        "tier": "A",
        "reason": "Hooks Brody while he charges his slow basic attack wind-up."
      }
    ],
    "avoidPicks": [
      "lesley",
      "wanwan",
      "claude"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "WIND_OF_NATURE",
      "ANTIQUE_CUIRASS",
      "BLADE_ARMOR"
    ],
    "tacticalTips": [
      "Brody has a very slow attack animation windup. CC or interrupt him while he charges his basic attack.",
      "Do not trade with Brody when you have 4 Abyss marks on you; his ultimate will execute you."
    ]
  },
  {
    "id": "khaleed",
    "avatar": "assets/heroes/khaleed.png",
    "name": "Khaleed",
    "role": "Fighter",
    "lane": "EXP",
    "damageType": "Physical",
    "difficulty": "Medium",
    "color": "#f97316",
    "avatarBg": "linear-gradient(135deg, #c2410c, #ea580c)",
    "skills": {
      "passive": {
        "name": "Sand Walk",
        "tag": "Passive • Fighter Synergy",
        "desc": "Khaleed accumulates (Desert Power) while moving. After (Desert Power) is fully charged, he will glide on sand, increasing Movement Speed by 35%, making his next Basic Attack deal 50( +140% Total Physical Attack) (Physical Damage) to the target (cannot Crit), and reducing the target's Movement Speed by 40% for 1.5s.",
        "counterTip": "Track Khaleed's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Desert Tornado",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Khaleed whirls his scimitar, dealing 200( +140% Total Physical Attack) (Physical Damage) to enemies in the area and pulling them toward him. This skill can be used up to 3 time(s) in a row. This skill deals 50% damage to Minions and Creeps.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Quicksand Guard",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Khaleed protects himself with the power of the quicksand, restoring 60 plus 5% of his lost HP and 10 (Desert Power) every 0.5s, reducing damage taken by 35% for up to 4s. While channeling, quicksand appears under his feet, slowing the enemy by 60%. This skill is a Focused Cast. Any other controls will interrupt this skill.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Raging Sandstorm",
        "tag": "Ultimate • High Impact",
        "desc": "Khaleed rides the sandstorm and charges toward a designated location, dealing 100( +50% Total Physical Attack) (Physical Damage) to enemies along the way and knocking them toward his destination. Khaleed is immune to control effects during this process. Upon reaching the destination, Khaleed will smash the ground, dealing 450( +160% Total Physical Attack) (Physical Damage) to enemies in the area and stunning them for 1s, and fully charge his (Desert Power).",
        "counterTip": "Respect Khaleed's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Fighter Carry",
      "Physical Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "alucard",
        "reason": "Sustained frontline presence out-trades in close quarter duels."
      },
      {
        "heroId": "zilong",
        "reason": "Absorbs initial charge and overpowers in prolonged trades."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dominance_ice",
        "tier": "S",
        "reason": "Dominance Ice cuts lifesteal and shield regeneration by 50%."
      },
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Constant knockbacks and slow firewall kite Khaleed endlessly."
      },
      {
        "heroId": "baxia",
        "tier": "A",
        "reason": "Inherent anti-heal passive and mobility neutralize sustain."
      }
    ],
    "avoidPicks": [
      "valir",
      "karrie",
      "baxia"
    ],
    "recommendedSpell": "Flicker / Vengeance",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Khaleed's core kit advantage.",
      "Watch for Khaleed's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Khaleed during key objective contests."
    ],
    "secondaryLane": "Roam"
  },
  {
    "id": "benedetta",
    "avatar": "assets/heroes/benedetta.png",
    "name": "Benedetta",
    "role": "Assassin",
    "lane": "Jungle",
    "damageType": "Physical",
    "difficulty": "Hard",
    "color": "#38bdf8",
    "avatarBg": "linear-gradient(135deg, #0284c7, #38bdf8)",
    "skills": {
      "passive": {
        "name": "Elapsed Daytime",
        "tag": "Passive • Assassin Synergy",
        "desc": "When holding down the (Basic Attack) button, Benedetta enters the Swordout state and charges up Sword Intent. If the (Basic Attack) button is released after the Sword Intent is fully charged, Benedetta will use Swordout Slash in (the direction she's facing) and dash forward, dealing ( +215% Total Physical Attack) (Physical Damage) to enemies on the path (counts as Skill Damage and is reduced to 50% on Minions and Creeps). Benedetta can only use Swordout Slash when her Sword Intent is fully charged and she is in Swordout state by holding down the (Basic Attack) button. Benedetta also gains Sword Intent by dealing damage with her Basic Attacks and skills.",
        "counterTip": "Track Benedetta's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Phantom Slash",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Benedetta withdraws swiftly and leaves a shadow in front. After a short delay, her shadow slashes forward in a fan-shaped area, dealing 200( +75% Total Physical Attack) (Physical Damage) and slowing the enemies by 60% for 0.5s. Meanwhile, Benedetta dashes forward to slash, dealing 75( +100% Total Physical Attack) (Physical Damage). (If the target is hit by her shadow, damage caused by Benedetta herself will increase to 200%.)",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "An Eye for An Eye",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Benedetta raises her weapon to defend, gaining Control Immunity and blocking damage from any source for 0.8s. After this, she stabs in the designated direction, dealing 300( +80% Total Physical Attack) (Physical Damage). If Benedetta successfully fends off any damage while defending, she will gain full (Sword Intent). If she fends off any control effects, her subsequent stab stuns the target for 1.5s.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Alecto: Final Blow",
        "tag": "Ultimate • High Impact",
        "desc": "Benedetta clenches Alecto, dashes forward (Benedetta is untargetable during the dash), and performs a slash after a short delay, detonating the Sword Intent along the path. For 2.5s, the Sword Intent deals up to a total of 1560( +1105% Extra Physical Attack) (Physical Damage) to enemies within and slows them by 50%.",
        "counterTip": "Respect Benedetta's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Assassin Carry",
      "Physical Damage",
      "High Skill Ceiling"
    ],
    "powerSpikes": {
      "early": 4,
      "mid": 5,
      "late": 3
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "Rapid mobility bridges distance and eliminates isolated targets."
      },
      {
        "heroId": "gord",
        "reason": "Blinks past Gord stuns and deletes during channel."
      }
    ],
    "counteredBy": [
      {
        "heroId": "khufra",
        "tier": "S",
        "reason": "Bouncing Ball cancels dash abilities and grounds momentum."
      },
      {
        "heroId": "franco",
        "tier": "S",
        "reason": "Suppression ultimate cannot be purified and locks Benedetta down."
      },
      {
        "heroId": "antique_cuirass",
        "tier": "A",
        "reason": "Reduces skill damage scaling by 12% across multi-hit combos."
      }
    ],
    "avoidPicks": [
      "khufra",
      "franco",
      "minsitthar"
    ],
    "recommendedSpell": "Retribution",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Benedetta's core kit advantage.",
      "Watch for Benedetta's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Benedetta during key objective contests."
    ],
    "secondaryLane": "EXP"
  },
  {
    "id": "barats",
    "avatar": "assets/heroes/barats.png",
    "name": "Barats",
    "role": "Tank",
    "lane": "Roam",
    "damageType": "Magic",
    "difficulty": "Medium",
    "color": "#10b981",
    "avatarBg": "linear-gradient(135deg, #047857, #10b981)",
    "skills": {
      "passive": {
        "name": "Detona's Welcome",
        "tag": "Passive • Tank Synergy",
        "desc": "After a short delay, Detona charges in the target direction, dealing 120( +70% Total Physical Attack) (+1% Total HP) (Physical Damage) to the first enemy hit, devouring and suppressing them for 1.2s before spitting them out. If the target hits an enemy hero or a wall after being spit out, the target will cause an explosion, they and nearby enemies will take an additional 180( +105% Total Physical Attack) (+2% Total HP) (Physical Damage) and be stunned for 1s. For the duration, Barats becomes immune to control effects. If the channeling is canceled, 60% of the skill cooldown will be refunded. (Passive): Detona gains 4 stacks of (Big Guy) upon respawn.",
        "counterTip": "Track Barats's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "So-Called Teamwork",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Detona spits contaminated oil in the target direction, dealing 60( +7% Total HP) (Physical Damage) to enemies in a fan-shaped area. Barats then ignites the oil with a firecracker, dealing 120( +200% Total Physical Attack) (Physical Damage) to enemies in the area. The area of effect of (So-Called Teamwork) increases with the number of (Big Guy) stacks.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Missile \"Expert\"",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Barats fires two missiles at the target location, dealing 100( +75% Total Physical Attack) (Physical Damage) and slowing enemies by 40% for 1s. The missiles expel fumes from their exhausts upon landing, dealing 100( +75% Total Physical Attack) (Physical Damage) to enemies in a rectangular area and pushing them toward Barats.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Big Guy",
        "tag": "Ultimate • High Impact",
        "desc": "Detona gains a stack of (Big Guy) for 12s each time it or Barats damages an enemy with their skills (up to 10 stacks). Each stack of (Big Guy) increases Detona's size, and grants 4-10 extra Hybrid Defense (scales with the level of (Detona's Welcome)) and 5% extra Resilience. At max stacks, Detona's Basic Attacks will be replaced with (Trample), which deals ( +140% Total Physical Attack) (+4% Total HP) (Physical Damage) to enemies in a circular area, slows them by 40% for 0.2s, and refreshes the duration of (Big Guy) with each hit.",
        "counterTip": "Respect Barats's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Tank Carry",
      "Magic Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "Frontline crowd control locks down squishy carries."
      },
      {
        "heroId": "miya",
        "reason": "Heavy armor and taunts/stuns disrupt basic attack rhythm."
      }
    ],
    "counteredBy": [
      {
        "heroId": "karrie",
        "tier": "S",
        "reason": "Lightwheel True Damage completely bypasses high armor and magic defense."
      },
      {
        "heroId": "lunox",
        "tier": "S",
        "reason": "Chaos magic penetration shreds % Max HP frontliners."
      },
      {
        "heroId": "demon_hunter_sword",
        "tier": "A",
        "reason": "DHS passive deals 8% current HP on every basic attack."
      }
    ],
    "avoidPicks": [
      "karrie",
      "lunox",
      "claude"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Barats's core kit advantage.",
      "Watch for Barats's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Barats during key objective contests."
    ],
    "secondaryLane": "EXP"
  },
  {
    "id": "popol_and_kupa",
    "avatar": "assets/heroes/popol_and_kupa.png",
    "name": "Popol and Kupa",
    "role": "Marksman",
    "lane": "Gold",
    "damageType": "Physical",
    "difficulty": "Medium",
    "color": "#fbbf24",
    "avatarBg": "linear-gradient(135deg, #d97706, #f59e0b)",
    "skills": {
      "passive": {
        "name": "We Are Friends",
        "tag": "Passive • Marksman Synergy",
        "desc": "Kupa recovers 10% Max HP per second after not taking damage for 5s. When Kupa is killed, Popol can (Pray) for 3s to bring Kupa back to the battlefield. Cooldown: 30s. Every 3 consecutive attacks from Kupa will enhance Popol's next Basic Attack to deal ( +220% Total Physical Attack) (Physical Damage). Kupa has 2500 ( +1200% Total Physical Attack) Max HP and inherits 100% of Popol's other attributes and passive equipment effects (excluding Jungling and Roaming equipment effects). Kupa deals an additional damage against Creeps.",
        "counterTip": "Track Popol and Kupa's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Bite 'em, Kupa!",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Popol throws a spear at the target enemy, dealing 80( +100% Total Physical Attack) (Physical Damage) while simultaneously commanding Kupa to lunge at the target, dealing an additional 100( +75% Total Physical Attack) (Physical Damage). Kupa will continue to attack the target for 3s. (Alpha Wolf Form): Kupa stuns the enemy for 1s and bites them 3 times in quick succession.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Kupa, Help!",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Popol summons Kupa back to his side, gaining a 240( +200% Extra Physical Attack) shield while dealing 240( +50% Total Physical Attack) (Physical Damage) to nearby enemies and slowing them by 35% for 0.5s. Kupa will then assist Popol to attack nearby enemies for 3s. (Alpha Wolf Form): Kupa darts back to Popol, knocking nearby enemies airborne for 0.2s. The shield and damage are increased to 125%.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Popol's Surprise",
        "tag": "Ultimate • High Impact",
        "desc": "Popol sets a trap at the target location that will detonate after a short delay once triggered, dealing 70( +20% Total Magic Power) (Magic Damage) to the enemy that steps on it, immobilizing them for 1s, and creating a frost zone for 4s. Enemies in the frost zone will have their Movement Speed reduced by 20%. Popol gains a trap charge every 22s (up to 3). Up to 3 traps can exist at the same time on the battlefield, each lasting up to 60s.",
        "counterTip": "Respect Popol and Kupa's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Marksman Carry",
      "Physical Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 2,
      "mid": 4,
      "late": 5
    },
    "counters": [
      {
        "heroId": "tigreal",
        "reason": "Can out-range and kite Tigreal outside his melee engage radius."
      },
      {
        "heroId": "hylos",
        "reason": "High DPS melts Hylos HP pool from safe distance."
      }
    ],
    "counteredBy": [
      {
        "heroId": "saber",
        "tier": "S",
        "reason": "Instant point-and-click lock on airborne deletes Popol and Kupa before repositioning."
      },
      {
        "heroId": "blade_armor",
        "tier": "S",
        "reason": "Blade Armor reflects basic attack physical damage right back."
      },
      {
        "heroId": "khufra",
        "tier": "A",
        "reason": "Bouncing Ball and Tyrants Rage halt escape dashes."
      }
    ],
    "avoidPicks": [
      "saber",
      "khufra",
      "fanny"
    ],
    "recommendedSpell": "Flicker / Vengeance",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Popol and Kupa's core kit advantage.",
      "Watch for Popol and Kupa's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Popol and Kupa during key objective contests."
    ]
  },
  {
    "id": "yu_zhong",
    "avatar": "assets/heroes/yu_zhong.png",
    "name": "Yu Zhong",
    "role": "Fighter",
    "lane": "EXP",
    "damageType": "Physical",
    "difficulty": "Medium",
    "color": "#059669",
    "avatarBg": "linear-gradient(135deg, #065f46, #059669)",
    "skills": {
      "passive": {
        "name": "Cursing Touch",
        "tag": "Passive • Sha Residue & HP Drain",
        "desc": "Yu Zhong applies Sha Residue on hit. At 5 stacks, Sha Eruption triggers, dealing % target HP damage, restoring 6% of Yu Zhong’s lost HP, and granting 30% movement speed.",
        "counterTip": "Dominance Ice and Sea Halberd are mandatory to cut his massive Sha Eruption healing in half."
      },
      "skill1": {
        "name": "Dragon Tail",
        "tag": "Skill 1 • Cloak Spin",
        "desc": "Yu Zhong spins his cloak into blades. Hitting enemies with the outer sharpened edge deals 250% damage and applies 2 stacks of Sha Residue.",
        "counterTip": "Step into his inner radius or disengage outward; avoid getting clipped by the outer blade edge."
      },
      "skill2": {
        "name": "Soul Grip",
        "tag": "Skill 2 • Dragon Soul Stun & Slow",
        "desc": "Yu Zhong releases dragon soul forward, dealing damage and slowing enemies. His next basic attack is enhanced and dashes to the target.",
        "counterTip": "Dodge the linear projectile to prevent his empowered gap-closer basic attack."
      },
      "ultimate": {
        "name": "Black Dragon Form",
        "tag": "Ultimate • Dragon Flight & Knockback",
        "desc": "Yu Zhong transforms into a Black Dragon, becoming CC immune, ignoring terrain, and knocking back enemies he collides with. Afterward enters Dragonoid state with increased HP and skill AoE.",
        "counterTip": "Disengage when he transforms into dragon form; kite his Dragonoid state until his enhanced stats expire."
      }
    },
    "tags": [
      "Dragon Form Backline Dive",
      "Massive HP Regen",
      "AOE Bruiser"
    ],
    "powerSpikes": {
      "early": 5,
      "mid": 5,
      "late": 3
    },
    "counters": [
      {
        "heroId": "esmeralda",
        "reason": "Sha Residue stacks trigger continuous damage and burst through Esmeralda sustain."
      },
      {
        "heroId": "pharsa",
        "reason": "Black Dragon Form flies over all terrain and terrain walls directly onto Pharsa."
      },
      {
        "heroId": "yve",
        "reason": "Ignores Yve ultimate grid slow in dragon form and lands on her head."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dyrroth",
        "tier": "S",
        "reason": "Dyrroth breaks Yu Zhong physical defense by 75% and wins level 1-4 trades easily."
      },
      {
        "heroId": "baxia",
        "tier": "S",
        "reason": "Baxia passive cuts Yu Zhong passive Sha Residue healing by 50% continuously."
      },
      {
        "heroId": "franco",
        "tier": "A",
        "reason": "Suppresses Yu Zhong right when he transitions out of Black Dragon Form."
      },
      {
        "heroId": "valir",
        "tier": "A",
        "reason": "Pushes Yu Zhong away and cleanses dragon petrify with ult."
      }
    ],
    "avoidPicks": [
      "pharsa",
      "yve",
      "uranus"
    ],
    "recommendedSpell": "Petrify / Flicker",
    "counterItems": [
      "DOMINANCE_ICE",
      "SEA_HALBERD",
      "ANTIQUE_CUIRASS"
    ],
    "tacticalTips": [
      "Buy Dominance Ice or Sea Halberd FIRST item. Yu Zhong power relies 80% on his Sha Residue HP eruption.",
      "Disengage when your Sha Essence bar fills to 5 stacks. Wait for the purple bar to expire before re-engaging."
    ]
  },
  {
    "id": "carmilla",
    "avatar": "assets/heroes/carmilla.png",
    "name": "Carmilla",
    "role": "Support",
    "lane": "Roam",
    "damageType": "Magic",
    "difficulty": "Medium",
    "color": "#06b6d4",
    "avatarBg": "linear-gradient(135deg, #0891b2, #06b6d4)",
    "skills": {
      "passive": {
        "name": "Vampire Pact",
        "tag": "Passive • Support Synergy",
        "desc": "Each time Carmilla deals damage to an enemy hero, she steals 7-11 Physical & Magic Defense (scales with level) from them. The stolen Physical & Magic Defense can stack up to 5 times and lasts 5s. However, Carmilla can only steal defense from the same enemy hero once every 5s.",
        "counterTip": "Track Carmilla's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Crimson Flower",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Carmilla summons two Crimson Flowers that circle around her for 5s, dealing 100( +50% Total Magic Power) (Magic Damage) each time they hit an enemy and slowing them by 10% for 0.8s (the slow effect stacks up to 50%). The circling speed of the Crimson Flowers also increases with each hit. Carmilla recovers 75( +35% Total Magic Power) HP each time a Crimson Flower deals damage (only recovers 30% of that amount when hitting Minions).",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Bloodbath",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Carmilla accumulates Bloodbath Energy, gaining 70% Movement Speed that decays over 4.5s. (Use Again): Carmilla unleashes the accumulated Bloodbath Energy on the target enemy hero or Creep, dealing 150( +120% Total Magic Power) (Magic Damage) and stunning them for 0.6s. The damage and stun duration scale with the accumulation time (up to 100%).",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Curse of Blood",
        "tag": "Ultimate • High Impact",
        "desc": "Carmilla casts Curse of Blood on the target location, slowing enemies hit by 50%. After 0.8s, enemies still within the area will take 450( +130% Total Magic Power) (Magic Damage), and will be immobilized for 1s, slowed by 15% and linked for 5s. When a linked enemy takes damage or becomes controlled, all the other linked targets take 50% of the damage and become controlled for 100% of the duration. Enemies can move away from one another to break the link.",
        "counterTip": "Respect Carmilla's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Support Carry",
      "Magic Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "alucard",
        "reason": "Sustained frontline presence out-trades in close quarter duels."
      },
      {
        "heroId": "zilong",
        "reason": "Absorbs initial charge and overpowers in prolonged trades."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dominance_ice",
        "tier": "S",
        "reason": "Dominance Ice cuts lifesteal and shield regeneration by 50%."
      },
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Constant knockbacks and slow firewall kite Carmilla endlessly."
      },
      {
        "heroId": "baxia",
        "tier": "A",
        "reason": "Inherent anti-heal passive and mobility neutralize sustain."
      }
    ],
    "avoidPicks": [
      "valir",
      "karrie",
      "baxia"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Carmilla's core kit advantage.",
      "Watch for Carmilla's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Carmilla during key objective contests."
    ]
  },
  {
    "id": "atlas",
    "avatar": "assets/heroes/atlas.png",
    "name": "Atlas",
    "role": "Tank",
    "lane": "Roam",
    "damageType": "Magic",
    "difficulty": "Medium",
    "color": "#0284c7",
    "avatarBg": "linear-gradient(135deg, #075985, #0284c7)",
    "skills": {
      "passive": {
        "name": "Frigid Breath",
        "tag": "Passive • Cold Aura & Defense Buff",
        "desc": "Atlas generates Frigid Breath whenever he casts a skill, slowing enemy attack speed and movement speed by 50% while gaining hybrid defense.",
        "counterTip": "Kite Atlas from distance to avoid being inside the Frigid Breath slow aura."
      },
      "skill1": {
        "name": "Annihilate",
        "tag": "Skill 1 • Triple Ground Slam",
        "desc": "Atlas slams the ground, creating 3 overlapping explosions that deal magic damage.",
        "counterTip": "Stay near the edge to take only 1 explosion rather than the tripled central blast."
      },
      "skill2": {
        "name": "Perfect Match",
        "tag": "Skill 2 • Ejection Dash & Stun",
        "desc": "Atlas ejects from his Mecha Sentry, gaining 40% movement speed and CC immunity. When reunited, stuns nearby enemies for 1s.",
        "counterTip": "Watch for the Mecha reconnection circle; spread out before he reunites and initiates."
      },
      "ultimate": {
        "name": "Fatal Links",
        "tag": "Ultimate • Multi-Hero Chain Pull",
        "desc": "Atlas attaches chains to all surrounding enemy heroes. Channels briefly, then leaps and slams all chained enemies to a designated location, stunning them.",
        "counterTip": "Purify or Diggie Time Journey is mandatory to break the chains and prevent the teamwipe slam."
      }
    },
    "tags": [
      "Fatal Links Slam",
      "Ejected State Mobility",
      "AOE Freeze Passive"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 5,
      "late": 5
    },
    "counters": [
      {
        "heroId": "estes",
        "reason": "Pulls Estes and his clustered teammates together for an instant team wipe."
      },
      {
        "heroId": "layla",
        "reason": "Fast ejection dive easily catches immobile backline."
      }
    ],
    "counteredBy": [
      {
        "heroId": "diggie",
        "tier": "S",
        "reason": "Time Journey completely nullifies Fatal Links, turning Atlas into a free target."
      },
      {
        "heroId": "valentina",
        "tier": "S",
        "reason": "Steals Fatal Links and pulls Atlas squishy backline instead."
      },
      {
        "heroId": "chou",
        "tier": "A",
        "reason": "Shunpo CC immunity allows Chou to walk freely out of Fatal Links and kick Atlas away."
      },
      {
        "heroId": "valir",
        "tier": "A",
        "reason": "Searing Torrent pushes ejected Atlas away before he can cast ultimate."
      }
    ],
    "avoidPicks": [
      "estes",
      "layla"
    ],
    "recommendedSpell": "Flicker",
    "counterItems": [
      "DOMINANCE_ICE",
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR"
    ],
    "tacticalTips": [
      "Atlas shines when enemies group together. If enemy drafts Atlas, DO NOT group in narrow corridors.",
      "Purify or Diggie is a MUST-PICK against Atlas."
    ]
  },
  {
    "id": "luo_yi",
    "avatar": "assets/heroes/luo_yi.png",
    "name": "Luo Yi",
    "role": "Mage",
    "lane": "Mid",
    "damageType": "Magic",
    "difficulty": "Medium",
    "color": "#c084fc",
    "avatarBg": "linear-gradient(135deg, #7e22ce, #c084fc)",
    "skills": {
      "passive": {
        "name": "Duality",
        "tag": "Passive • Mage Synergy",
        "desc": "Luo Yi's skills can create (Sigils of Yin/Yang) on the battlefield. Each Sigil lasts up to 6s. Sigils of opposite attributes will trigger (Yin-Yang Reaction) when they are within a certain distance, dealing 365 (+20*Hero Level) (+190% Total Magic Power) (Magic Damage) to the marked enemies, stunning them for 0.3s, and pulling them toward each other. Each time Luo Yi applies a new Sigil to a marked enemy, she gains a 300 (+10*Hero Level) (+150% Total Magic Power) shield (up to 3 stacks) and 50% extra Movement Speed that decays over 2s.",
        "counterTip": "Track Luo Yi's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Dispersion",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Luo Yi casts the energy of (Yin/Yang) in the target direction, dealing 210( +135% Total Magic Power) (Magic Damage) to the first enemy hit and those behind them in a fan-shaped area. Enemy heroes hit are marked with a (Sigil of Yin/Yang). Luo Yi stores up to 4 (Dispersion) charges and gains 1 charge every 8s. She also immediately gains 1 charge each time (Yin-Yang Reaction) is triggered. The state of this skill changes on each cast.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Rotation",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Luo Yi summons (Fire of Yang/Aqua of Yin) at the target location, dealing 250( +50% Total Magic Power) (Magic Damage) to enemies hit and slowing them by 60% for 0.5s. (Fire of Yan/Aqua of Yin) then remains at the location for 6s, dealing 50( +10% Total Magic Power) (Magic Damage) every 0.7s to nearby enemies. It can also trigger (Yin-Yang Reaction) with Sigils of opposite attributes. The state of this skill changes on each cast.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Diversion",
        "tag": "Ultimate • High Impact",
        "desc": "Luo Yi creates a Teleport Circle around herself and marks the target location (within 28 units) as its destination. After a 3s delay, allied heroes (including herself) within the Circle will be teleported to the location. (Passive): Luo Yi's Cooldown Reduction is increased by 6%.",
        "counterTip": "Respect Luo Yi's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Mage Carry",
      "Magic Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "High burst combo deletes squishy immobile marksmen instantly."
      },
      {
        "heroId": "miya",
        "reason": "AoE magic damage out-bursts Miya in early/mid game teamfights."
      }
    ],
    "counteredBy": [
      {
        "heroId": "athenas_shield",
        "tier": "S",
        "reason": "Athena’s Shield absorbs 25% of magic burst, preventing one-shots."
      },
      {
        "heroId": "ling",
        "tier": "S",
        "reason": "Ling wall-jumping bypasses ground skillshots and dives Luo Yi effortlessly."
      },
      {
        "heroId": "saber",
        "tier": "A",
        "reason": "Airborne lock prevents Luo Yi from casting defensive spells."
      }
    ],
    "avoidPicks": [
      "ling",
      "fanny",
      "saber"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Luo Yi's core kit advantage.",
      "Watch for Luo Yi's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Luo Yi during key objective contests."
    ]
  },
  {
    "id": "cecilion",
    "avatar": "assets/heroes/cecilion.png",
    "name": "Cecilion",
    "role": "Mage",
    "lane": "Mid",
    "damageType": "Magic",
    "difficulty": "Medium",
    "color": "#c084fc",
    "avatarBg": "linear-gradient(135deg, #7e22ce, #c084fc)",
    "skills": {
      "passive": {
        "name": "Overflowing",
        "tag": "Passive • Mage Synergy",
        "desc": "Cecilion gains 10 extra Max Mana and recovers 10 Mana each time his skill hits an enemy. Cooldown: 1s. Cecilion has higher Max Mana and Mana Regen, and his skill damage scales with his Max Mana.",
        "counterTip": "Track Cecilion's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Bat Impact",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Cecilion commands a giant bat to dive at the target location, gaining 30% extra Movement Speed for 1s, dealing 85( +80% Total Magic Power) (+7% Total Mana) (Magic Damage) to enemies in its path. The bat also deals 170( +160% Total Magic Power) (+14% Total Mana) extra (Magic Damage) to those near the landing point, and applies (Overflowing) effect once. Each subsequent cast within 6s increases this skill's Mana cost by 1.8 times (up to 4 stacks).",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Sanguine Claws",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Cecilion summons a pair of opposing claws at the target location that will clasp together after a short delay, pulling enemies in their paths to the center while dealing them 200( +45% Total Magic Power) (+1% Total Mana) (Magic Damage) and immobilizing them for 1s.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Bats Feast",
        "tag": "Ultimate • High Impact",
        "desc": "Cecilion unleashes his Blood Demon power, gaining 60% extra Movement Speed (decays over the duration) and Slow Immunity for 1.5s. Meanwhile, he fires 36 bolts of blood energy at nearby enemies, each dealing 35( +8% Total Magic Power) (+0% Total Mana) (Magic Damage) to the enemy hit and slowing them by 3% (up to 30%) for 1s. Each bolt also restores 10 plus 1% of Cecilion's lost HP for him on hit.",
        "counterTip": "Respect Cecilion's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Mage Carry",
      "Magic Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "High burst combo deletes squishy immobile marksmen instantly."
      },
      {
        "heroId": "miya",
        "reason": "AoE magic damage out-bursts Miya in early/mid game teamfights."
      }
    ],
    "counteredBy": [
      {
        "heroId": "athenas_shield",
        "tier": "S",
        "reason": "Athena’s Shield absorbs 25% of magic burst, preventing one-shots."
      },
      {
        "heroId": "ling",
        "tier": "S",
        "reason": "Ling wall-jumping bypasses ground skillshots and dives Cecilion effortlessly."
      },
      {
        "heroId": "saber",
        "tier": "A",
        "reason": "Airborne lock prevents Cecilion from casting defensive spells."
      }
    ],
    "avoidPicks": [
      "ling",
      "fanny",
      "saber"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Cecilion's core kit advantage.",
      "Watch for Cecilion's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Cecilion during key objective contests."
    ]
  },
  {
    "id": "wanwan",
    "avatar": "assets/heroes/wanwan.png",
    "name": "Wanwan",
    "role": "Marksman",
    "lane": "Gold",
    "damageType": "Physical",
    "difficulty": "Hard",
    "color": "#38bdf8",
    "avatarBg": "linear-gradient(135deg, #0284c7, #38bdf8)",
    "skills": {
      "passive": {
        "name": "Tiger Pace",
        "tag": "Passive • Weakness Shred & Hop",
        "desc": "Wanwan reveals the Weaknesses of enemy heroes hit by her weapons (4 points around the target). Hitting a weakness deals True Damage equal to 2.5% of target Max HP. Breaking all weaknesses increases her damage by 30% and unlocks Crossbow of Tang. Wanwan hops a short distance after each basic attack scaling with attack speed.",
        "counterTip": "Back against terrain or walls so Wanwan cannot hit your rear weakness, completely preventing her ultimate unlock."
      },
      "skill1": {
        "name": "Swallow's Path",
        "tag": "Skill 1 • Slow & Stun Trigger",
        "desc": "Wanwan fires a Fire Swallow in a direction, dealing physical damage and triggering swallow daggers behind enemies that fly back, dealing damage and stunning targets hit twice for 0.5s.",
        "counterTip": "Avoid standing directly between Wanwan and the returning fire swallows to avoid the stun."
      },
      "skill2": {
        "name": "Needles in Flowers",
        "tag": "Skill 2 • Purify & AoE Slow",
        "desc": "Wanwan instantly removes all Crowd Control effects on herself, releases deadly needles to nearby enemies, and gains a burst of movement speed.",
        "counterTip": "Do not blow your key CC ultimate until she has burned Needles in Flowers, or use Suppression which cannot be cleansed."
      },
      "ultimate": {
        "name": "Crossbow of Tang",
        "tag": "Ultimate • Invulnerable Finisher",
        "desc": "Unlocked only after breaking all 4 enemy weaknesses. Wanwan leaps into the air and becomes untargetable and invulnerable, firing rapid continuous darts at the target for 2.5s. Killing a target extends duration and switches focus to nearby enemies.",
        "counterTip": "Use Wind of Nature (WoN) or Winter Crown immediately to become immune while she is in the air. Group with allies to share dart damage."
      }
    },
    "tags": [
      "High Mobility",
      "Invulnerable Ultimate",
      "True Damage Passive"
    ],
    "powerSpikes": {
      "early": 2,
      "mid": 4,
      "late": 5
    },
    "counters": [
      {
        "heroId": "claude",
        "reason": "Can trigger Tiger Pace easily on Claude during his Blazing Duet."
      },
      {
        "heroId": "estes",
        "reason": "Ultimate Crossbow of Tang cannot be targeted or stopped by healers."
      },
      {
        "heroId": "uranus",
        "reason": "High mobility kites Uranus; weakness breaks shred high HP pools."
      }
    ],
    "counteredBy": [
      {
        "heroId": "phoveus",
        "tier": "S",
        "reason": "Every jump Wanwan does triggers Phoveus ultimate shield and dive directly on her."
      },
      {
        "heroId": "khufra",
        "tier": "S",
        "reason": "Bouncing Ball completely cancels Wanwan hop-dashes and knocks her up."
      },
      {
        "heroId": "minsitthar",
        "tier": "S",
        "reason": "King's Calling grounds Wanwan, making it impossible to hop or trigger ult."
      },
      {
        "heroId": "lolita",
        "tier": "A",
        "reason": "Guardian shield completely blocks all darts from Wanwan basic attacks."
      },
      {
        "heroId": "saber",
        "tier": "A",
        "reason": "Point-and-click airborne burst deletes Wanwan before she can break weaknesses."
      }
    ],
    "avoidPicks": [
      "claude",
      "tigreal",
      "uranus"
    ],
    "recommendedSpell": "Inspire / Aegis",
    "counterItems": [
      "BLADE_ARMOR",
      "WIND_OF_NATURE",
      "ANTIQUE_CUIRASS"
    ],
    "tacticalTips": [
      "Do not let her break all 4 weakness points. Face your back against a wall so she cannot hit the rear weakness.",
      "Pick heroes with Suppression (Franco / Kaja) or Grounding (Minsitthar) since Purify cannot cleanse Suppression.",
      "Buy Blade Armor and Vengeance to reflect her rapid basic attacks back at her."
    ]
  },
  {
    "id": "silvanna",
    "avatar": "assets/heroes/silvanna.png",
    "name": "Silvanna",
    "role": "Fighter",
    "lane": "EXP",
    "damageType": "Magic",
    "difficulty": "Easy",
    "color": "#f97316",
    "avatarBg": "linear-gradient(135deg, #c2410c, #ea580c)",
    "skills": {
      "passive": {
        "name": "Knightess' Resolve",
        "tag": "Passive • Fighter Synergy",
        "desc": "Silvanna's Basic Attacks deal 25( +45% Total Physical Attack) (+75% Total Magic Power) (Magic Damage). Silvanna's attacks apply a mark on enemy heroes for 5s on hit, each mark reducing their Physical & Magic Defense by 3-6 (up to 5 stacks). Silvanna deals 30% extra damage to enemy heroes with the max number of marks.",
        "counterTip": "Track Silvanna's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Cometic Lance",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Silvanna dashes forward. Upon reaching the max range or hitting a non-Minion enemy, she swings her lance, dealing 250( +100% Total Magic Power) (Magic Damage) to nearby enemies and stunning them for 1s.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Spiral Strangling",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Silvanna thrusts her lance in the target direction and spins it 6 times while gaining a 350( +150% Total Magic Power) shield. Each spin deals 165( +45% Total Magic Power) (Magic Damage) and slightly pulls targets toward the center. Silvanna spins 1 additional time for every 50% of extra Attack Speed she possesses. The skill deals only 50% damage against Minions. (Spiral Strangling) counts as a Basic Attack but cannot Crit.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Imperial Justice",
        "tag": "Ultimate • High Impact",
        "desc": "Silvanna leaps to the target location and creates a Circle of Light upon landing, dealing 350( +110% Total Magic Power) (Magic Damage) to enemies in the area, slowing them by 40% for 1.5s, and restraining the closest enemy hero to the area for 3.5s. (This skill cannot be interrupted.) Silvanna gains 100% Attack Speed and 40% Lifesteal when in the Circle.",
        "counterTip": "Respect Silvanna's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Fighter Carry",
      "Magic Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "alucard",
        "reason": "Sustained frontline presence out-trades in close quarter duels."
      },
      {
        "heroId": "zilong",
        "reason": "Absorbs initial charge and overpowers in prolonged trades."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dominance_ice",
        "tier": "S",
        "reason": "Dominance Ice cuts lifesteal and shield regeneration by 50%."
      },
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Constant knockbacks and slow firewall kite Silvanna endlessly."
      },
      {
        "heroId": "baxia",
        "tier": "A",
        "reason": "Inherent anti-heal passive and mobility neutralize sustain."
      }
    ],
    "avoidPicks": [
      "valir",
      "karrie",
      "baxia"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Silvanna's core kit advantage.",
      "Watch for Silvanna's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Silvanna during key objective contests."
    ],
    "secondaryLane": "Roam"
  },
  {
    "id": "baxia",
    "avatar": "assets/heroes/baxia.png",
    "name": "Baxia",
    "role": "Tank",
    "lane": "Jungle",
    "secondaryLane": "EXP",
    "damageType": "Magic",
    "difficulty": "Easy",
    "color": "#059669",
    "avatarBg": "linear-gradient(135deg, #064e3b, #10b981)",
    "skills": {
      "passive": {
        "name": "Baxia Mark",
        "tag": "Passive • Built-in 50% Anti-Heal & Flat DR",
        "desc": "Baxia reduces incoming damage by 25. Hitting enemies with skills applies Baxia Mark, reducing the target’s Shield and HP Regen by 50% for 4s.",
        "counterTip": "Baxia has passive Dominance Ice built into his kit! Sustain brawlers (Uranus, Estes, Esmeralda) are naturally hard-countered."
      },
      "skill1": {
        "name": "Baxia-Shield Prowess",
        "tag": "Skill 1 • Rolling Shield & Stun Jump",
        "desc": "Baxia rolls into a giant shield gaining 65% movement speed. Colliding with an enemy knocks back and stuns for 0.8s. Can leap over obstacles.",
        "counterTip": "Stand behind a minion or tank; minions block his roll and prevent him from reaching backline squishies."
      },
      "skill2": {
        "name": "Shield of Spirit",
        "tag": "Skill 2 • Spammable % HP Shield Toss",
        "desc": "Baxia throws his shield forward, dealing % Max HP magic damage and slowing by 50%. Hitting an enemy reduces cooldown by 85%.",
        "counterTip": "Sidestep his shield throw; if he misses, his cooldown does not reset."
      },
      "ultimate": {
        "name": "Tortoise's Puissance",
        "tag": "Ultimate • Lava Trail & Speed Rush",
        "desc": "Baxia accelerates forward, leaving a trail of lava that deals continuous magic damage and slows enemies by 15% while increasing his damage reduction.",
        "counterTip": "Do not fight inside his lava trail. Radiant Armor reduces the lava ticks to almost 0 damage."
      }
    },
    "tags": [
      "Built-in Anti-Heal Passive",
      "Rolling Shield Gank",
      "Fast Objective Clear"
    ],
    "powerSpikes": {
      "early": 4,
      "mid": 5,
      "late": 4
    },
    "counters": [
      {
        "heroId": "estes",
        "reason": "Passive Baxia Mark reduces healing by 50% continuously; stacks with Dominance Ice to shut down Estes."
      },
      {
        "heroId": "esmeralda",
        "reason": "Prevents Esmeralda from stacking shield in teamfights."
      },
      {
        "heroId": "ruby",
        "reason": "Destroys Ruby spell-vamp lifesteal."
      },
      {
        "heroId": "yu_zhong",
        "reason": "Cuts Yu Zhong Sha Residue healing dramatically."
      }
    ],
    "counteredBy": [
      {
        "heroId": "karrie",
        "tier": "S",
        "reason": "Karrie true damage bypasses Baxia damage-reduction passive completely."
      },
      {
        "heroId": "lunox",
        "tier": "S",
        "reason": "Lunox chaos penetration melts Baxia high magic armor."
      },
      {
        "heroId": "valir",
        "tier": "A",
        "reason": "Valir knockback stops Baxia shield roll in its tracks."
      },
      {
        "heroId": "dyrroth",
        "tier": "A",
        "reason": "75% physical armor reduction shreds Baxia."
      }
    ],
    "avoidPicks": [
      "estes",
      "esmeralda",
      "ruby",
      "yu_zhong"
    ],
    "recommendedSpell": "Retribution",
    "counterItems": [
      "RADIANT_ARMOR",
      "DOMINANCE_ICE",
      "ATHENAS_SHIELD"
    ],
    "tacticalTips": [
      "Baxia is the ULTIMATE hard counter to any team with heavy sustain or healers (Estes, Esmeralda, Ruby).",
      "Do not draft Baxia into Karrie or Lunox as their true damage / magic pen shreds his passive."
    ]
  },
  {
    "id": "masha",
    "avatar": "assets/heroes/masha.png",
    "name": "Masha",
    "role": "Fighter",
    "lane": "EXP",
    "damageType": "Physical",
    "difficulty": "Easy",
    "color": "#f97316",
    "avatarBg": "linear-gradient(135deg, #c2410c, #ea580c)",
    "skills": {
      "passive": {
        "name": "Ancient Strength",
        "tag": "Passive • Fighter Synergy",
        "desc": "Blessed by the Bear King, Masha has 3 HP bars and won't die until all of them are depleted. She can ignore an instance of damage each time she loses an HP bar. When Masha only has two HP bars left, skills will only require 50% of their original HP Cost to cast. When Masha only has one HP bar left, she doesn't need to spend HP to cast skills.",
        "counterTip": "Track Masha's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Wild Power",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "(Passive): Masha gains (Power of the Wild) which causes her Basic Attacks to deal extra (Physical Damage) equal to 1( )% of the target's Max HP (up to 60 against Creeps and doesn't take effect on Turrets or Base). (Active): Masha spends 24% HP to increase her Movement Speed by 60% for 1.5s. She also increases the extra (Physical Damage) from (Power of the Wild) by 2( )% of the target's Max HP and gains 50% extra Attack Speed for her next two Basic Attacks.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Howl Shock",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Masha spends 24% HP to roar at enemies, dealing 200( +100% Total Physical Attack) (Physical Damage) and reducing their Attack Speed by 50% for 2s.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Thunderclap",
        "tag": "Ultimate • High Impact",
        "desc": "Masha spends 34% HP to lunge at an enemy hero (immune to control effects during the lunge), dealing 200( +200% Total Physical Attack) (Physical Damage), slowing them by 25% for 2s, and knocking back nearby enemies. The cooldown of this skill will be reset each time Masha loses an HP bar.",
        "counterTip": "Respect Masha's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Fighter Carry",
      "Physical Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "alucard",
        "reason": "Sustained frontline presence out-trades in close quarter duels."
      },
      {
        "heroId": "zilong",
        "reason": "Absorbs initial charge and overpowers in prolonged trades."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dominance_ice",
        "tier": "S",
        "reason": "Dominance Ice cuts lifesteal and shield regeneration by 50%."
      },
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Constant knockbacks and slow firewall kite Masha endlessly."
      },
      {
        "heroId": "baxia",
        "tier": "A",
        "reason": "Inherent anti-heal passive and mobility neutralize sustain."
      }
    ],
    "avoidPicks": [
      "valir",
      "karrie",
      "baxia"
    ],
    "recommendedSpell": "Flicker / Vengeance",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Masha's core kit advantage.",
      "Watch for Masha's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Masha during key objective contests."
    ],
    "secondaryLane": "Roam"
  },
  {
    "id": "lylia",
    "avatar": "assets/heroes/lylia.png",
    "name": "Lylia",
    "role": "Mage",
    "lane": "Mid",
    "damageType": "Magic",
    "difficulty": "Medium",
    "color": "#c084fc",
    "avatarBg": "linear-gradient(135deg, #7e22ce, #c084fc)",
    "skills": {
      "passive": {
        "name": "Angry Gloom",
        "tag": "Passive • Mage Synergy",
        "desc": "Lylia gets power from Gloom, increasing her Movement Speed by 15%. Each Gloom upgrade further increases this bonus by 5%. Gloom gains an upgrade every time he devours Shadow Energy, up to 5 times. Gloom upgrade increases the detonation damage of Shadow Energy.",
        "counterTip": "Track Lylia's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Magic Shockwave",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Lylia sends out Gloom with a shockwave, dealing 250( +100% Total Magic Power) (Magic Damage) to enemies in a line and slowing them by 30% for 1.5s. If Gloom touches Shadow Energy, he will devour and detonate it.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Shadow Energy",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Lylia condenses Shadow Energy at the target location, dealing 90( +50% Total Magic Power) (Magic Damage) to enemies hit and slowing them by 80%. Shadow Energy can be detonated by Gloom's devour, dealing 220( +100% Total Magic Power) (Magic Damage) to the enemies nearby. Each Gloom upgrade increases the detonation damage by 30%, up to 120%. A max level Gloom will restore 50% of Shadow Energy's Recharge Time when it hits an enemy hero. Lylia starts with the Shadow Energy skill.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Black Shoes",
        "tag": "Ultimate • High Impact",
        "desc": "Lylia returns to the Black Shoes' location 4s ago and restores her HP and Mana to the previous state, and an extra 10% Max HP. She also gains 20% extra Movement Speed for 2s.",
        "counterTip": "Respect Lylia's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Mage Carry",
      "Magic Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "High burst combo deletes squishy immobile marksmen instantly."
      },
      {
        "heroId": "miya",
        "reason": "AoE magic damage out-bursts Miya in early/mid game teamfights."
      }
    ],
    "counteredBy": [
      {
        "heroId": "athenas_shield",
        "tier": "S",
        "reason": "Athena’s Shield absorbs 25% of magic burst, preventing one-shots."
      },
      {
        "heroId": "ling",
        "tier": "S",
        "reason": "Ling wall-jumping bypasses ground skillshots and dives Lylia effortlessly."
      },
      {
        "heroId": "saber",
        "tier": "A",
        "reason": "Airborne lock prevents Lylia from casting defensive spells."
      }
    ],
    "avoidPicks": [
      "ling",
      "fanny",
      "saber"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Lylia's core kit advantage.",
      "Watch for Lylia's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Lylia during key objective contests."
    ]
  },
  {
    "id": "xborg",
    "avatar": "assets/heroes/xborg.png",
    "name": "X.Borg",
    "role": "Fighter",
    "lane": "EXP",
    "damageType": "Physical",
    "difficulty": "Medium",
    "color": "#f97316",
    "avatarBg": "linear-gradient(135deg, #c2410c, #ea580c)",
    "skills": {
      "passive": {
        "name": "Firaga Armor",
        "tag": "Passive • Fighter Synergy",
        "desc": "X.Borg's Firaga Armor inherits 120% of his Max HP and absorbs all incoming damage when it's active. When the Armor is destroyed, X.Borg will disengage from it and roll in the direction of the Joystick (he is immune to damage during this process). The Armor's energy will gradually regenerate while X.Borg is in the Armorless State. At full energy, X.Borg re-equips the Armor and restores it to 30% of his Max HP. X.Borg's fire damage causes enemies to heat up. Enemies at maximum temperature will drop Firaga supplies when they take fire damage from X.Borg. Picking up a Firaga supply restores 10% of the Armor's HP, or 10 energy while in the Armorless State.",
        "counterTip": "Track X.Borg's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Fire Missiles",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "X.Borg sprays fire in the target direction, dealing 25( +60% Total Physical Attack) (+40% Total Magic Power) (Physical Damage) 7 times over 2s to enemies in range (only deals 75% damage against Minions). Enemies at maximum temperature are dealt (True Damage) instead. (Armorless) State: The attack area becomes narrower but longer, while the damage is reduced to 60% of that in (Armored) state.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Fire Stake",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "X.Borg shoots 5 Fire Stakes at the edge of the fan-shaped indicator and retrieves them after 1.7s, each dealing 50( +20% Total Physical Attack) (Physical Damage) and pulling the enemies in the path toward him. Firaga Supplies in the path will also be retrieved if touched by Fire Stakes. (Armorless) State: X.Borg adjusts Fire Stake Launcher to increase its range and shorten the distance between Fire Stakes.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Last Insanity",
        "tag": "Ultimate • High Impact",
        "desc": "X.Borg charges in the target direction while rotating and spraying fire, dealing 200( +130% Extra Physical Attack) (+90% Total Magic Power) (Physical Damage) 7 times and slowing enemies hit by 25%. He stops upon running into an enemy hero and will slow them by an additional 40%. After 3s from the start of the skill, X.Borg's (Firaga Armor) will detonate, dealing (True Damage) to nearby enemies equal to 300 plus 15% of their Max HP. If the Armor is destroyed before it can self-detonate, it will only deal 50% of the damage. When his Armor detonates, X.Borg will dash a short distance in the Joystick's direction and enter the (Armorless) state while removing all debuffs from himself. This skill cannot be used in the (Armorless) state. (Use Again): X.Borg stops spraying fire and immediately detonates his (Firaga Armor).",
        "counterTip": "Respect X.Borg's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Fighter Carry",
      "Physical Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "alucard",
        "reason": "Sustained frontline presence out-trades in close quarter duels."
      },
      {
        "heroId": "zilong",
        "reason": "Absorbs initial charge and overpowers in prolonged trades."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dominance_ice",
        "tier": "S",
        "reason": "Dominance Ice cuts lifesteal and shield regeneration by 50%."
      },
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Constant knockbacks and slow firewall kite X.Borg endlessly."
      },
      {
        "heroId": "baxia",
        "tier": "A",
        "reason": "Inherent anti-heal passive and mobility neutralize sustain."
      }
    ],
    "avoidPicks": [
      "valir",
      "karrie",
      "baxia"
    ],
    "recommendedSpell": "Flicker / Vengeance",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle X.Borg's core kit advantage.",
      "Watch for X.Borg's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down X.Borg during key objective contests."
    ],
    "secondaryLane": "Roam"
  },
  {
    "id": "ling",
    "avatar": "assets/heroes/ling.png",
    "name": "Ling",
    "role": "Assassin",
    "lane": "Jungle",
    "damageType": "Physical",
    "difficulty": "Hard",
    "color": "#06b6d4",
    "avatarBg": "linear-gradient(135deg, #0e7490, #22d3ee)",
    "skills": {
      "passive": {
        "name": "Cloud Walker",
        "tag": "Passive • Wall Walking & Lightness",
        "desc": "Ling leaps on walls, gaining 4 Lightness points per second on walls. Doubles his critical chance but reduces critical damage.",
        "counterTip": "AoE crowd control skills that hit the wall knock Ling off and inflict heavy stun duration."
      },
      "skill1": {
        "name": "Finch Poise",
        "tag": "Skill 1 • Wall Leap",
        "desc": "Ling leaps onto a designated wall. Gains passive Critical Chance boost.",
        "counterTip": "Ward jungle buffs and use heroes like Franco or Kaja to suppress him as soon as he lands."
      },
      "skill2": {
        "name": "Defiant Sword",
        "tag": "Skill 2 • Thrust & Dash",
        "desc": "Ling stabs in a target direction, dealing physical damage and applying on-hit effects. When cast from a wall, dashes down and slows enemies.",
        "counterTip": "Antique Cuirass reduces this rapid dash damage effectively."
      },
      "ultimate": {
        "name": "Tempest of Blades",
        "tag": "Ultimate • Invulnerable Sword Field",
        "desc": "Ling leaps into the air, becoming invulnerable for 1.5s, knocks enemies airborne, and creates a sword field with 4 eyes. Touching eyes resets Skill 2 and restores Lightness.",
        "counterTip": "Stand on the eyes of the sword field or use CC right as he dashes to an eye to break his reset chain."
      }
    },
    "tags": [
      "Wall Walking",
      "Untargetable Tempest Ult",
      "Fast Backline Split"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 5,
      "late": 5
    },
    "counters": [
      {
        "heroId": "beatrix",
        "reason": "Leaps from walls and assassinates Beatrix with Tempest of Blades."
      },
      {
        "heroId": "lesley",
        "reason": "Wall mobility easily traverses vision to catch Lesley in camouflage."
      },
      {
        "heroId": "pharsa",
        "reason": "Dives directly on Pharsa during her artillery channel."
      }
    ],
    "counteredBy": [
      {
        "heroId": "minsitthar",
        "tier": "S",
        "reason": "King’s Calling disables wall leaping and dash skills completely."
      },
      {
        "heroId": "khufra",
        "tier": "S",
        "reason": "Bouncing Ball knocks Ling off walls and cancels his dashes."
      },
      {
        "heroId": "franco",
        "tier": "S",
        "reason": "Suppresses Ling the moment he lands from Tempest of Blades."
      },
      {
        "heroId": "saber",
        "tier": "A",
        "reason": "Target-lock ultimate deletes Ling before he can jump to safety."
      },
      {
        "heroId": "ruby",
        "tier": "A",
        "reason": "Micro-stuns disrupt Ling sword retrieval during ultimate."
      }
    ],
    "avoidPicks": [
      "pharsa",
      "beatrix",
      "lesley"
    ],
    "recommendedSpell": "Retribution",
    "counterItems": [
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE",
      "BLADE_ARMOR"
    ],
    "tacticalTips": [
      "Invade his Purple Buff relentlessly. Ling without energy cannot jump onto walls.",
      "Stand on Ling’s fallen swords during his Tempest of Blades to block him or predict where he will dash next."
    ]
  },
  {
    "id": "terizla",
    "avatar": "assets/heroes/terizla.png",
    "name": "Terizla",
    "role": "Fighter",
    "lane": "EXP",
    "damageType": "Physical",
    "difficulty": "Easy",
    "color": "#b91c1c",
    "avatarBg": "linear-gradient(135deg, #450a0a, #b91c1c)",
    "skills": {
      "passive": {
        "name": "Body of Smith",
        "tag": "Passive • % Damage Reduction",
        "desc": "For every 2.5% HP lost, Terizla gains 1% Damage Reduction (up to 30% Damage Reduction). Cannot gain Attack Speed; extra attack speed converts to Physical Attack.",
        "counterTip": "Terizla gets drastically tankier the lower his health gets. Do not underestimate his survivability when low on HP."
      },
      "skill1": {
        "name": "Revenge Strike",
        "tag": "Skill 1 • Fissure & Movement Speed",
        "desc": "Terizla smashes the ground, sending a fissure that deals damage, slows enemies by 30%, and explodes after 3s dealing 20% target missing HP damage. Terizla gains movement speed.",
        "counterTip": "Disengage when marked with the fissure; the explosion damage scales with missing HP."
      },
      "skill2": {
        "name": "Execution Strike",
        "tag": "Skill 2 • 3-Stage Hammer Smash",
        "desc": "Terizla swings his warhammer 3 times in a fan area. The 3rd swing deals immense physical damage and slows enemies by 30%.",
        "counterTip": "Antique Cuirass reduces this 3-hit skill burst by 24%. Kite backward during his swings."
      },
      "ultimate": {
        "name": "Penalty Zone",
        "tag": "Ultimate • Jump Slam & Scaffold Pull",
        "desc": "Terizla leaps and slams down, dealing physical damage, slowing by 80%, and creating a scaffold with chains that repeatedly pull enemies back to the center 3 times.",
        "counterTip": "Save Purify or Flicker to escape the scaffold chains, or pick Diggie to grant team CC immunity."
      }
    },
    "tags": [
      "Massive Damage Reduction",
      "AOE Hammer Slam",
      "Teamfight Chain Pull"
    ],
    "powerSpikes": {
      "early": 4,
      "mid": 5,
      "late": 4
    },
    "counters": [
      {
        "heroId": "chou",
        "reason": "Passive Body of Smith gives up to 30% damage reduction, nullifying Chou burst."
      },
      {
        "heroId": "paquito",
        "reason": "Out-tanks Paquito boxing combos with passive and zones him with Execution."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dyrroth",
        "tier": "S",
        "reason": "Dyrroth armor reduction penetrates Terizla defensive stats easily."
      },
      {
        "heroId": "karrie",
        "tier": "S",
        "reason": "Karrie True Damage ignores Terizla passive damage reduction."
      },
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Valir constant knockback and push completely counters Terizla slow hammer animations."
      },
      {
        "heroId": "diggie",
        "tier": "A",
        "reason": "Time Journey cleanses Terizla Penalty Zone chains for the whole team."
      }
    ],
    "avoidPicks": [
      "chou",
      "paquito"
    ],
    "recommendedSpell": "Flicker / Vengeance",
    "counterItems": [
      "SEA_HALBERD",
      "DOMINANCE_ICE",
      "TWILIGHT_ARMOR"
    ],
    "tacticalTips": [
      "Terizla gains higher damage reduction the lower his HP is (up to 30%). Do not dive him expecting an easy finish.",
      "Pick mobile heroes or True Damage carries (Karrie / Lesley) to completely bypass his damage reduction."
    ]
  },
  {
    "id": "dyrroth",
    "avatar": "assets/heroes/dyrroth.png",
    "name": "Dyrroth",
    "role": "Fighter",
    "lane": "EXP",
    "secondaryLane": "Jungle",
    "damageType": "Physical",
    "difficulty": "Easy",
    "color": "#dc2626",
    "avatarBg": "linear-gradient(135deg, #7f1d1d, #dc2626)",
    "skills": {
      "passive": {
        "name": "Wrath of the Abyss",
        "tag": "Passive • Circle Strike & Healing",
        "desc": "When rage reaches 50%, Dyrroth enhances his skills. Every 2 basic attacks triggers Circle Strike, dealing physical damage and regenerating HP based on damage dealt.",
        "counterTip": "Cuts through armor naturally; kite him with ranged heroes and build Dominance Ice to stop his HP regen."
      },
      "skill1": {
        "name": "Burst Strike",
        "tag": "Skill 1 • Linear Shockwave",
        "desc": "Dyrroth releases burst strikes in a line, dealing physical damage and slowing enemies by 25%–50%.",
        "counterTip": "Sidestep the straight-line blast to avoid the slow."
      },
      "skill2": {
        "name": "Spectre Step",
        "tag": "Skill 2 • 75% Armor Shred",
        "desc": "Dyrroth dashes forward. Casting again unleashes Fatal Strike, dealing damage and reducing the target’s Physical Defense by up to 75% for 4s.",
        "counterTip": "His 75% armor shred makes raw HP (Guardian Helmet / Twilight Armor) more effective than stacking pure physical defense."
      },
      "ultimate": {
        "name": "Abyssal Strike",
        "tag": "Ultimate • Missing HP Finisher",
        "desc": "Dyrroth charges and unleashes a lethal downward strike, dealing massive physical damage + % missing HP to enemies in a fan area.",
        "counterTip": "Has a noticeable wind-up animation; use Flicker or dash behind him while he is charging to dodge completely."
      }
    },
    "tags": [
      "75% Armor Shred",
      "Early Game Monster",
      "Tank Executioner"
    ],
    "powerSpikes": {
      "early": 5,
      "mid": 4,
      "late": 2
    },
    "counters": [
      {
        "heroId": "yu_zhong",
        "reason": "Second skill shreds Yu Zhong defense by 75%, winning every trade."
      },
      {
        "heroId": "esmeralda",
        "reason": "Destroys Esmeralda before she can build defense or shield."
      },
      {
        "heroId": "paquito",
        "reason": "Out-damages Paquito in early levels with Spectre Step armor break."
      },
      {
        "heroId": "uranus",
        "reason": "Abysm Strike execute terminates Uranus despite his regeneration."
      }
    ],
    "counteredBy": [
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Valir knockback, fireball stuns, and slows prevent Dyrroth from ever reaching him."
      },
      {
        "heroId": "franco",
        "tier": "A",
        "reason": "Hooks and suppresses Dyrroth before he can dive."
      },
      {
        "heroId": "diggie",
        "tier": "A",
        "reason": "Reverse Time pulls Dyrroth back and cancels his dive."
      }
    ],
    "avoidPicks": [
      "esmeralda",
      "yu_zhong",
      "uranus",
      "chou"
    ],
    "recommendedSpell": "Petrify / Flicker",
    "counterItems": [
      "ANTIQUE_CUIRASS",
      "DOMINANCE_ICE",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Never duel Dyrroth at level 1 or 2. Respect his 75% physical defense reduction and clear minions safely from range.",
      "Dyrroth falls off dramatically in late-game 5v5 teamfights because he lacks reliable escape mechanisms."
    ]
  },
  {
    "id": "esmeralda",
    "avatar": "assets/heroes/esmeralda.png",
    "name": "Esmeralda",
    "role": "Fighter",
    "lane": "EXP",
    "secondaryLane": "Mid",
    "damageType": "Hybrid",
    "difficulty": "Medium",
    "color": "#9333ea",
    "avatarBg": "linear-gradient(135deg, #581c87, #9333ea)",
    "skills": {
      "passive": {
        "name": "Starmoon Casket",
        "tag": "Passive • Hybrid Damage & Shield Absorption",
        "desc": "Esmeralda deals both Physical and Magic Damage on hits. Her attacks grant enemies shields, but Esmeralda absorbs enemy shields directly into her own shield (up to 50% Max HP).",
        "counterTip": "NEVER pick shield heroes like Athena’s Shield, Lolita, or Angela into Esmeralda; she absorbs your shields into her own health!"
      },
      "skill1": {
        "name": "Frostmoon Shield",
        "tag": "Skill 1 • Shield Generation & Speed",
        "desc": "Esmeralda generates a 400–850 shield and gains 40% movement speed, rapidly absorbing surrounding enemy shields.",
        "counterTip": "Dominance Ice and Sea Halberd halve her shield gain and movement speed advantage."
      },
      "skill2": {
        "name": "Stardust Dance",
        "tag": "Skill 2 • Dual Wave Spin",
        "desc": "Esmeralda spins her ribbons, dealing physical and magic damage to surrounding enemies. Reduces Skill 1 cooldown by 1.3s per hero hit.",
        "counterTip": "Avoid letting her hit multiple allies with each spin to prevent rapid Skill 1 shield spam."
      },
      "ultimate": {
        "name": "Falling Starmoon",
        "tag": "Ultimate • Charge & Airborne Burst",
        "desc": "Esmeralda charges and leaps to target location, dealing hybrid damage and immobilizing enemies for 1s.",
        "counterTip": "Watch for her wind-up jump trajectory; sidestep the impact zone to avoid the immobilize."
      }
    },
    "tags": [
      "Shield Stealer",
      "Hybrid Damage",
      "Sustained Brawler"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 5,
      "late": 4
    },
    "counters": [
      {
        "heroId": "lolita",
        "reason": "Feasts on Lolita passive shield and shield barrier."
      },
      {
        "heroId": "phoveus",
        "reason": "Absorbs all of Phoveus bonus shields for herself."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dyrroth",
        "tier": "S",
        "reason": "Dyrroth 75% defense break and Abysm Strike execute deletes Esmeralda early."
      },
      {
        "heroId": "baxia",
        "tier": "S",
        "reason": "Baxia passive and Dominance Ice completely stops her shield generation."
      },
      {
        "heroId": "karrie",
        "tier": "S",
        "reason": "Karrie true damage ignores Esmeralda massive shield layer."
      },
      {
        "heroId": "lesley",
        "tier": "A",
        "reason": "Lesley true damage crits pass right through her shield."
      }
    ],
    "avoidPicks": [
      "lolita",
      "phoveus"
    ],
    "recommendedSpell": "Purify / Sprint",
    "counterItems": [
      "DOMINANCE_ICE",
      "SEA_HALBERD",
      "ATHENAS_SHIELD"
    ],
    "tacticalTips": [
      "Never draft heroes that grant shields to allies (like Lolita) into Esmeralda; she eats their shields.",
      "Dominance Ice or Sea Halberd cuts her shield generation rate in half."
    ]
  },
  {
    "id": "guinevere",
    "avatar": "assets/heroes/guinevere.png",
    "name": "Guinevere",
    "role": "Fighter",
    "lane": "EXP",
    "damageType": "Magic",
    "difficulty": "Medium",
    "color": "#f97316",
    "avatarBg": "linear-gradient(135deg, #c2410c, #ea580c)",
    "skills": {
      "passive": {
        "name": "Super Magic",
        "tag": "Passive • Fighter Synergy",
        "desc": "Guinevere deals 25% extra damage to airborne enemies and deals ( +80% Total Physical Attack) (+60% Total Magic Power) (Magic Damage) with her Basic Attacks. Guinevere builds Super Magic each time she deals damage. Once fully charged, her next Basic Attack becomes guided, dealing 80( +100% Total Physical Attack) (+120% Total Magic Power) (Magic damage) on hit and restoring 80 HP plus 8% of her lost HP. Enemies hit by Guinevere's skills or enhanced Basic Attack will be marked for 5s. Those with 3 marks will be knocked airborne when hit by her Violet Requiem.",
        "counterTip": "Track Guinevere's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Energy Wave",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Guinevere releases an energy orb in the target direction, dealing 300( +125% Total Magic Power) (Magic Damage) and slowing enemies by 50% for 1.2s. Successfully hitting an enemy reduces all her skill cooldowns by 1s.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Spatial Migration",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Guinevere leaps to the target location, dealing 250( +80% Total Magic Power) (Magic Damage). Enemy heroes and Creeps hit will be knocked airborne for 1s and take 125( +50% Total Magic Power) additional (Magic Damage). (Use Again): Guinevere blinks toward the target direction and leaves an illusion behind. If the illusion takes damage, it will restore Super Magic for Guinevere and explode after 1.5s, dealing 100( +30% Total Magic Power) (Magic Damage) to nearby enemies.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Violet Requiem",
        "tag": "Ultimate • High Impact",
        "desc": "Guinevere creates a force field around her, gaining Control Immunity while attacking nearby enemies 11 times within 2s, dealing 880( +385% Total Magic Power) (Magic Damage) in total. Airborne enemies hit will be knocked airborne again, up to 8 additional times.",
        "counterTip": "Respect Guinevere's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Fighter Carry",
      "Magic Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "alucard",
        "reason": "Sustained frontline presence out-trades in close quarter duels."
      },
      {
        "heroId": "zilong",
        "reason": "Absorbs initial charge and overpowers in prolonged trades."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dominance_ice",
        "tier": "S",
        "reason": "Dominance Ice cuts lifesteal and shield regeneration by 50%."
      },
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Constant knockbacks and slow firewall kite Guinevere endlessly."
      },
      {
        "heroId": "baxia",
        "tier": "A",
        "reason": "Inherent anti-heal passive and mobility neutralize sustain."
      }
    ],
    "avoidPicks": [
      "valir",
      "karrie",
      "baxia"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Guinevere's core kit advantage.",
      "Watch for Guinevere's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Guinevere during key objective contests."
    ],
    "secondaryLane": "Roam"
  },
  {
    "id": "khufra",
    "avatar": "assets/heroes/khufra.png",
    "name": "Khufra",
    "role": "Tank",
    "lane": "Roam",
    "damageType": "Physical",
    "difficulty": "Hard",
    "color": "#ca8a04",
    "avatarBg": "linear-gradient(135deg, #78350f, #d97706)",
    "skills": {
      "passive": {
        "name": "Spell Siphon",
        "tag": "Passive • Ranged Attack & HP Regen",
        "desc": "Every 12s, Khufra’s next basic attack has extended range, slows the target by 30%, and restores 8% of his Max HP.",
        "counterTip": "Bait his extended basic attack before committing to trades in lane."
      },
      "skill1": {
        "name": "Tyrant's Revenge",
        "tag": "Skill 1 • Slingshot Long Knockup",
        "desc": "Khufra pulls himself back and launches forward, knocking up the first enemy hero hit for up to 1.1s.",
        "counterTip": "Keep moving unpredictably; dodge the linear charge line when you see him stretching his bandages."
      },
      "skill2": {
        "name": "Bouncing Ball",
        "tag": "Skill 2 • Anti-Dash Bounce Barrier",
        "desc": "Khufra wraps into a bouncing ball, gaining 75% defense. Any enemy attempting to use a blink/dash skill through him is knocked airborne and stopped.",
        "counterTip": "Hard counters Fanny, Harith, Wanwan, Ling, and Lancelot. DO NOT USE DASH SKILLS while he is bouncing."
      },
      "ultimate": {
        "name": "Tyrant's Rage",
        "tag": "Ultimate • Wave Pull & Wall Stun",
        "desc": "Khufra pulls all surrounding enemies toward his front. If knocked into a wall, targets take extra damage and are stunned for 1.25s.",
        "counterTip": "Do not stand near walls when Khufra is in front of your team."
      }
    },
    "tags": [
      "Bouncing Ball Anti-Dash",
      "Long Range Elastic Launch",
      "Wall Slam Stun"
    ],
    "powerSpikes": {
      "early": 4,
      "mid": 5,
      "late": 4
    },
    "counters": [
      {
        "heroId": "fanny",
        "reason": "Bouncing Ball completely stops Fanny cables and knocks her up."
      },
      {
        "heroId": "ling",
        "reason": "Knocks Ling out of his wall jump and interrupts dashes."
      },
      {
        "heroId": "wanwan",
        "reason": "Cancels Wanwan hop-dashes."
      },
      {
        "heroId": "joy",
        "reason": "Interrupts Joy rhythm dashes."
      },
      {
        "heroId": "paquito",
        "reason": "Bouncing ball cancels Paquito jab combos."
      }
    ],
    "counteredBy": [
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Valir constant knockback cancels Khufra Tyrant’s Revenge charge and ball bounce."
      },
      {
        "heroId": "diggie",
        "tier": "S",
        "reason": "Time Journey frees allies from Tyrant’s Rage wall slam."
      },
      {
        "heroId": "karrie",
        "tier": "A",
        "reason": "Karrie true damage ignores Khufra Bouncing Ball defense buff."
      }
    ],
    "avoidPicks": [
      "fanny",
      "ling",
      "wanwan",
      "joy",
      "paquito"
    ],
    "recommendedSpell": "Flicker / Petrify",
    "counterItems": [
      "DOMINANCE_ICE",
      "ATHENAS_SHIELD",
      "BLADE_ARMOR"
    ],
    "tacticalTips": [
      "Khufra Bouncing Ball knocks up ANY hero that tries to dash through him. Do not use dash skills into him.",
      "Valir is Khufra hardest counter because his fireball stuns knock Khufra out of his charging windup."
    ]
  },
  {
    "id": "badang",
    "avatar": "assets/heroes/badang.png",
    "name": "Badang",
    "role": "Fighter",
    "lane": "EXP",
    "damageType": "Physical",
    "difficulty": "Easy",
    "color": "#f97316",
    "avatarBg": "linear-gradient(135deg, #c2410c, #ea580c)",
    "skills": {
      "passive": {
        "name": "Chivalry Fist",
        "tag": "Passive • Fighter Synergy",
        "desc": "After every 4 Basic Attacks, Badang's next Basic Attack deals 50( +30% Total Physical Attack) extra (Physical Damage) to enemies hit and knocks them back. Enemies that are knocked into obstacles will be stunned for 0.6s (minions and creeps are stunned directly). (Fist Wind) generated by Badang's skills can also trigger this effect.",
        "counterTip": "Track Badang's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Fist Wind",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Badang unleashes a gust of (Fist Wind) in the target direction, dealing 125( +90% Total Physical Attack) (Physical Damage) to enemies hit, slowing them by 30% for 1.5s, and knocking them back. The (Fist Wind) will explode upon hitting an obstacle, dealing 100( +60% Total Physical Attack) (Physical Damage) to nearby enemies. (Fist Wind) can trigger attack effects and grants Badang 1 (Chivalry Fist) stack upon cast. Badang stores up to 2 (Fist Wind) charges and restores 1 charge every 10.4s.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Fist Break",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Badang dashes in the target direction, dealing 230( +50% Total Physical Attack) (Physical Damage) to enemies in his path while gaining a 350( +150% Total Physical Attack) shield that lasts 5s. He stops immediately upon hitting an enemy hero, slightly knocking them back while creating an obstacle that lasts 4s behind them. Enemies hit by the obstacle are dealt 130( +30% Total Physical Attack) (Physical Damage). (Use Again): Badang removes the obstacle he created.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Fist Crack",
        "tag": "Ultimate • High Impact",
        "desc": "Badang throws a flurry of punches in the target direction, dealing 60( +54% Total Physical Attack) (Physical Damage) to enemies hit multiple times (can trigger attack effects). The (Fist Wind) generated by the punches will explode upon hitting an obstacle, dealing 30( +27% Total Physical Attack) (Physical Damage) to nearby enemies. Badang is immune to control effects for the duration.",
        "counterTip": "Respect Badang's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Fighter Carry",
      "Physical Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "alucard",
        "reason": "Sustained frontline presence out-trades in close quarter duels."
      },
      {
        "heroId": "zilong",
        "reason": "Absorbs initial charge and overpowers in prolonged trades."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dominance_ice",
        "tier": "S",
        "reason": "Dominance Ice cuts lifesteal and shield regeneration by 50%."
      },
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Constant knockbacks and slow firewall kite Badang endlessly."
      },
      {
        "heroId": "baxia",
        "tier": "A",
        "reason": "Inherent anti-heal passive and mobility neutralize sustain."
      }
    ],
    "avoidPicks": [
      "valir",
      "karrie",
      "baxia"
    ],
    "recommendedSpell": "Flicker / Vengeance",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Badang's core kit advantage.",
      "Watch for Badang's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Badang during key objective contests."
    ],
    "secondaryLane": "Roam"
  },
  {
    "id": "granger",
    "avatar": "assets/heroes/granger.png",
    "name": "Granger",
    "role": "Marksman",
    "lane": "Jungle",
    "damageType": "Physical",
    "difficulty": "Medium",
    "color": "#fbbf24",
    "avatarBg": "linear-gradient(135deg, #d97706, #f59e0b)",
    "skills": {
      "passive": {
        "name": "Caprice",
        "tag": "Passive • Marksman Synergy",
        "desc": "Granger can load his gun with up to 6 bullets at a time. Each 6th bullet is guaranteed to Crit. Granger's Basic Attack deals 50( +110% Total Physical Attack) (Physical Damage), but he only gains 40% of his total extra Attack Speed.",
        "counterTip": "Track Granger's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Rhapsody",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Granger immediately reloads his gun and fires continuously in the target direction, dealing 35( +70% Total Physical Attack) (Physical Damage) with each shot (deals 120 extra damage against Creeps).",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Rondo",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Granger blinks in the designated direction, and his next 2 Basic Attacks deal extra 25% of damage in 5s. Each time (Rhapsody) hits an enemy hero, the CD of this skill will be reduced by 0.5s.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Death Sonata",
        "tag": "Ultimate • High Impact",
        "desc": "Granger immediately reloads and fires a cannon shot in the target direction with the super cannon hidden in his violin case. The cannon shot will pass through Minions and explode upon hitting an enemy hero, dealing (Physical Damage) equal to 80( +70% Total Physical Attack) plus 12% of the target's lost HP to enemies in the area and slowing them by 80%. Granger can fire the super cannon 3 times at the cost of 2 bullets per shot, and can move once in the target direction after each shot. When (Death Sonata) ends, its cooldown will be reduced by 15% for every 2 bullets remaining.",
        "counterTip": "Respect Granger's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Marksman Carry",
      "Physical Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 2,
      "mid": 4,
      "late": 5
    },
    "counters": [
      {
        "heroId": "tigreal",
        "reason": "Can out-range and kite Tigreal outside his melee engage radius."
      },
      {
        "heroId": "hylos",
        "reason": "High DPS melts Hylos HP pool from safe distance."
      }
    ],
    "counteredBy": [
      {
        "heroId": "saber",
        "tier": "S",
        "reason": "Instant point-and-click lock on airborne deletes Granger before repositioning."
      },
      {
        "heroId": "blade_armor",
        "tier": "S",
        "reason": "Blade Armor reflects basic attack physical damage right back."
      },
      {
        "heroId": "khufra",
        "tier": "A",
        "reason": "Bouncing Ball and Tyrants Rage halt escape dashes."
      }
    ],
    "avoidPicks": [
      "saber",
      "khufra",
      "fanny"
    ],
    "recommendedSpell": "Retribution",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Granger's core kit advantage.",
      "Watch for Granger's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Granger during key objective contests."
    ]
  },
  {
    "id": "faramis",
    "avatar": "assets/heroes/faramis.png",
    "name": "Faramis",
    "role": "Support",
    "lane": "Roam",
    "damageType": "Physical",
    "difficulty": "Medium",
    "color": "#06b6d4",
    "avatarBg": "linear-gradient(135deg, #0891b2, #06b6d4)",
    "skills": {
      "passive": {
        "name": "Vicious Retrieval",
        "tag": "Passive • Support Synergy",
        "desc": "Every 4s, Faramis' next skill against enemy heroes and summoned objects generates a soul fragment on the spot. Faramis can absorb the soul fragment to restore 100( +50% Total Magic Power) HP and gain 2 extra Magic Power (up to 40 stacks). Upon death, he consumes the absorbed soul fragments to reduce the respawn timer, each reducing the timer by 3% (up to 90%). Enemies that die around Faramis also have a chance to drop soul fragments.",
        "counterTip": "Track Faramis's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Shadow Stampede",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Faramis enters the Shadow state for 3s, gaining 70% extra Movement Speed, 25 extra Physical & Magic Defense, 20% cooldown reduction of this skill, and the ability to move through terrain. Enemy heroes that come into contact with Faramis in this state are dealt 250( +60% Total Magic Power) (Magic Damage) and applied with a (Nether Mark). Upon leaving the Shadow state, Faramis drags all the marked enemy heroes toward him, dealing 250( +60% Total Magic Power) (Magic Damage). Use Again: Faramis leaves the Shadow state early and drags marked enemies toward him. The range of soul fragment absorption is increased while this skill is active.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Ghost Bursters",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Faramis gathers Nether energy in a fan-shaped area ahead, dealing 330( +144% Total Magic Power) (Magic Damage) to enemies within. The energy will then split and bounce to nearby enemies, dealing 200( +86% Total Magic Power) (Magic Damage) (splits up to 2 time(s) on enemy hero hits and 1 time(s) on non-enemy hero hits).",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Nether Realm",
        "tag": "Ultimate • High Impact",
        "desc": "Faramis turns his surroundings into the (Nether Realm) for 6s, making affected allied heroes (including himself) enter the (Specter) state and granting them 400 plus 10( +5% Total Magic Power)% extra HP and 50% extra Movement Speed for 1s. When the (Specter) state breaks, the hero will clear all debuffs and enter a brief Resurrection state for 1.3s. An allied hero's (Specter) state ends when they leave the (Nether Realm).",
        "counterTip": "Respect Faramis's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Support Carry",
      "Physical Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "alucard",
        "reason": "Sustained frontline presence out-trades in close quarter duels."
      },
      {
        "heroId": "zilong",
        "reason": "Absorbs initial charge and overpowers in prolonged trades."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dominance_ice",
        "tier": "S",
        "reason": "Dominance Ice cuts lifesteal and shield regeneration by 50%."
      },
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Constant knockbacks and slow firewall kite Faramis endlessly."
      },
      {
        "heroId": "baxia",
        "tier": "A",
        "reason": "Inherent anti-heal passive and mobility neutralize sustain."
      }
    ],
    "avoidPicks": [
      "valir",
      "karrie",
      "baxia"
    ],
    "recommendedSpell": "Flicker / Vengeance",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Faramis's core kit advantage.",
      "Watch for Faramis's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Faramis during key objective contests."
    ],
    "secondaryLane": "Mid"
  },
  {
    "id": "kimmy",
    "avatar": "assets/heroes/kimmy.png",
    "name": "Kimmy",
    "role": "Marksman",
    "lane": "Gold",
    "damageType": "Hybrid",
    "difficulty": "Very Hard",
    "color": "#fbbf24",
    "avatarBg": "linear-gradient(135deg, #d97706, #f59e0b)",
    "skills": {
      "passive": {
        "name": "Chemist's Instinct",
        "tag": "Passive • Marksman Synergy",
        "desc": "Kimmy can move and aim in different directions when using her Spray Gun, but cannot lock onto a specific enemy. Kimmy's Spray Gun attack restores 5 energy on hit and deals ( +22% Total Physical Attack) (+24% Total Magic Power) (Magic Damage) per bullet (increases by 1% for every hero level). Kimmy can move while shooting but cannot gain extra Attack Speed. Instead, every 10% Attack Speed she receives will be converted into 5 Movement Speed. Kimmy restores 15 energy each time she kills an enemy.",
        "counterTip": "Track Kimmy's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Energy Transformation",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "(Hold): Kimmy continuously shoots Chemical Bolts in the target direction, each bolt consuming 4 energy and dealing 20( +22% Total Physical Attack) (+24% Total Magic Power) (Magic Damage) to the enemy hit. Chemical Bolts that fail to hit an enemy will explode at the end of their paths, dealing the same amount of damage to nearby enemies. The Chemical Bolts can Crit.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Chemical Refinement",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Kimmy shoots out enhanced Chemical Spray and recoils in the opposite direction. Enemies that come into contact with the Spray left on the path will take 14( +30% Total Physical Attack) (+40% Total Magic Power) (Magic Damage) every 0.5s and be slowed by 40% for 4s. Kimmy also restores 30 energy upon casting this skill.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Maximum Charge",
        "tag": "Ultimate • High Impact",
        "desc": "After a period of charging, Kimmy launches a Luminous Chemical Attack in a designated direction. The projectile will explode upon hitting an enemy or reaching the maximum range, dealing 130( +100% Total Physical Attack) (+115% Total Magic Power)-238( +185% Total Physical Attack) (+211% Total Magic Power) (Magic Damage) to the primary target (scales with charging time) and 83% damage to nearby enemies.",
        "counterTip": "Respect Kimmy's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Marksman Carry",
      "Hybrid Damage",
      "High Skill Ceiling"
    ],
    "powerSpikes": {
      "early": 2,
      "mid": 4,
      "late": 5
    },
    "counters": [
      {
        "heroId": "tigreal",
        "reason": "Can out-range and kite Tigreal outside his melee engage radius."
      },
      {
        "heroId": "hylos",
        "reason": "High DPS melts Hylos HP pool from safe distance."
      }
    ],
    "counteredBy": [
      {
        "heroId": "saber",
        "tier": "S",
        "reason": "Instant point-and-click lock on airborne deletes Kimmy before repositioning."
      },
      {
        "heroId": "blade_armor",
        "tier": "S",
        "reason": "Blade Armor reflects basic attack physical damage right back."
      },
      {
        "heroId": "khufra",
        "tier": "A",
        "reason": "Bouncing Ball and Tyrants Rage halt escape dashes."
      }
    ],
    "avoidPicks": [
      "saber",
      "khufra",
      "fanny"
    ],
    "recommendedSpell": "Flicker / Vengeance",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Kimmy's core kit advantage.",
      "Watch for Kimmy's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Kimmy during key objective contests."
    ],
    "secondaryLane": "Jungle"
  },
  {
    "id": "belerick",
    "avatar": "assets/heroes/belerick.png",
    "name": "Belerick",
    "role": "Tank",
    "lane": "Roam",
    "secondaryLane": "EXP",
    "damageType": "Magic",
    "difficulty": "Easy",
    "color": "#15803d",
    "avatarBg": "linear-gradient(135deg, #14532d, #15803d)",
    "skills": {
      "passive": {
        "name": "Deadly Thorns",
        "tag": "Passive • HP Scaling & Thorn Retaliation",
        "desc": "Belerick gains 30% more HP from equipment and emblems. Upon taking 50 damage, has a 25% chance to shoot thorns at the nearest enemy dealing magic damage.",
        "counterTip": "Basic-attack heroes (Claude, Miya, Moskov, Wanwan) trigger thousands of retaliatory thorn procs; buy Demon Hunter Sword."
      },
      "skill1": {
        "name": "Ancient Seed",
        "tag": "Skill 1 • Vine Line & Taunt",
        "desc": "Belerick releases vines in a line, dealing magic damage and taunting enemies caught for 1.2s.",
        "counterTip": "Sidestep the vine path to avoid the 1.2s taunt."
      },
      "skill2": {
        "name": "Nature's Strike",
        "tag": "Skill 2 • Speed Burst & Regen Slam",
        "desc": "Belerick gains 80% decaying movement speed, enhances next basic attack to slow target and restores 240 (+10% Lost HP).",
        "counterTip": "Disengage when he sprints forward; do not let him trade free HP regen on your carry."
      },
      "ultimate": {
        "name": "Wrath of Dryad",
        "tag": "Ultimate • AoE Taunt Vine Field",
        "desc": "Belerick casts a circular vine domain that expands, taunting all nearby enemies for 1.5s and triggering Deadly Thorns frequently.",
        "counterTip": "Purify breaks the taunt. Avoid clumping melee heroes inside his Wrath of Dryad."
      }
    },
    "tags": [
      "Damage Deflection Thorns",
      "AOE Taunt Root",
      "Bonus HP Scaling"
    ],
    "powerSpikes": {
      "early": 2,
      "mid": 4,
      "late": 5
    },
    "counters": [
      {
        "heroId": "claude",
        "reason": "Deadly Thorns reflects Claude rapid basic attacks, causing Claude to kill himself."
      },
      {
        "heroId": "moskov",
        "reason": "Reflects Moskov piercing spears and taunts him."
      },
      {
        "heroId": "wanwan",
        "reason": "Thorns trigger repeatedly from Wanwan rapid basic attacks."
      }
    ],
    "counteredBy": [
      {
        "heroId": "karrie",
        "tier": "S",
        "reason": "Karrie true damage shreds Belerick enormous HP pool before thorns finish her."
      },
      {
        "heroId": "dyrroth",
        "tier": "S",
        "reason": "Dyrroth breaks his armor by 75% and executes him."
      },
      {
        "heroId": "valir",
        "tier": "A",
        "reason": "Valir kiting prevents Belerick from ever getting close enough to Taunt."
      }
    ],
    "avoidPicks": [
      "claude",
      "moskov",
      "wanwan"
    ],
    "recommendedSpell": "Flicker / Vengeance",
    "counterItems": [
      "BLADE_ARMOR",
      "DOMINANCE_ICE",
      "ATHENAS_SHIELD"
    ],
    "tacticalTips": [
      "Combine Belerick with Blade Armor and Vengeance battle spell to create an unbeatable counter against attack-speed marksmen.",
      "Do not pick high attack-speed heroes into Belerick; each hit triggers a chance of thorn counter-attack."
    ]
  },
  {
    "id": "minsitthar",
    "avatar": "assets/heroes/minsitthar.png",
    "name": "Minsitthar",
    "role": "Fighter",
    "lane": "EXP",
    "secondaryLane": "Roam",
    "damageType": "Physical",
    "difficulty": "Medium",
    "color": "#ca8a04",
    "avatarBg": "linear-gradient(135deg, #713f12, #ca8a04)",
    "skills": {
      "passive": {
        "name": "All United",
        "tag": "Passive • Extra Gold & Stun Trigger",
        "desc": "Minsitthar and allies gain bonus gold on kills. Basic attacks and skills apply marks; at 5 stacks, the target is stunned for 0.8s and Minsitthar heals.",
        "counterTip": "Do not engage in prolonged basic-attack trades where Minsitthar can reach 5 stacks."
      },
      "skill1": {
        "name": "Spear of Glory",
        "tag": "Skill 1 • Piercing Hook Pull",
        "desc": "Minsitthar thrusts his spear forward, piercing through enemies and pulling the furthest enemy hero back to himself on return.",
        "counterTip": "Unlike Franco hook which hits the front target, Minsitthar pulls the FURTHEST target hit. Keep track of his spear reach."
      },
      "skill2": {
        "name": "Shield Assault",
        "tag": "Skill 2 • Phalanx Barrier & Rapid Thrusts",
        "desc": "Minsitthar raises his Golden Shield, reducing damage from the front by 25%–50% and executing rapid spear thrusts that deal damage and slow.",
        "counterTip": "Flank from behind or sides to bypass his 50% front damage reduction barrier."
      },
      "ultimate": {
        "name": "King's Calling",
        "tag": "Ultimate • Royal Guard & Anti-Dash Grounding",
        "desc": "Minsitthar summons Royal Guards in a circular field. Enemies inside CANNOT USE ANY BLINK OR DASH SKILLS (Grounding effect) and are slowed by 20%.",
        "counterTip": "Hard counters Fanny, Harith, Ling, Wanwan, Chou, and Benedetta. Walk out of the circle immediately; dashes are completely disabled inside."
      }
    },
    "tags": [
      "Grounding Ultimate",
      "Anti-Dash King",
      "Spear Hook & Stun"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 5,
      "late": 4
    },
    "counters": [
      {
        "heroId": "wanwan",
        "reason": "King’s Calling disables Wanwan hop-dash passive entirely."
      },
      {
        "heroId": "fanny",
        "reason": "King’s Calling grounds Fanny, preventing steel cable dashes."
      },
      {
        "heroId": "ling",
        "reason": "Prevents Ling from leaping or climbing walls."
      },
      {
        "heroId": "joy",
        "reason": "Joy cannot dash to beat the rhythm inside King’s Calling."
      },
      {
        "heroId": "chou",
        "reason": "Chou cannot use Jeet Kune Do or Shunpo inside the arena."
      }
    ],
    "counteredBy": [
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Valir pushes Minsitthar away and cleanses himself with Vengeance Flame."
      },
      {
        "heroId": "diggie",
        "tier": "S",
        "reason": "Time Journey cleanses Minsitthar spear pull and stun."
      },
      {
        "heroId": "terizla",
        "tier": "A",
        "reason": "Terizla does not need dash skills; he out-slams Minsitthar."
      }
    ],
    "avoidPicks": [
      "fanny",
      "ling",
      "wanwan",
      "joy",
      "chou"
    ],
    "recommendedSpell": "Flicker",
    "counterItems": [
      "DOMINANCE_ICE",
      "ANTIQUE_CUIRASS"
    ],
    "tacticalTips": [
      "Minsitthar is the ULTIMATE counter to dash-reliant team compositions. Lock him in when enemy picks Fanny/Ling/Wanwan.",
      "If caught in his King’s Calling arena, walk out immediately or use Winter Crown; do not spam dash skills as they are disabled."
    ]
  },
  {
    "id": "thamuz",
    "avatar": "assets/heroes/thamuz.png",
    "name": "Thamuz",
    "role": "Fighter",
    "lane": "EXP",
    "damageType": "Physical",
    "difficulty": "Medium",
    "color": "#f97316",
    "avatarBg": "linear-gradient(135deg, #c2410c, #ea580c)",
    "skills": {
      "passive": {
        "name": "Grand Lord Lava",
        "tag": "Passive • Fighter Synergy",
        "desc": "When Thamuz is holding his (Scythes), each of his Basic Attacks has a chance to conjure a burst of Lava Energy beneath the target that erupts after a 0.7s delay, dealing 50( +110% Total Physical Attack) (True Damage). When without (Scythes), Thamuz gains 25% extra Movement Speed and will enhance his next Basic Attack after retrieving the (Scythes). The enhanced Basic Attack slows the target by 30% and is guaranteed to trigger Lava Energy.",
        "counterTip": "Track Thamuz's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Molten Scythes",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Thamuz tosses (Scythes) in the target direction. After travelling for a certain distance or hitting the first enemy hero, they deal 120( +60% Total Physical Attack) (Physical Damage). The (Scythes) will then slow nearby enemies by 30% and deal 45( +20% Extra Physical Attack) (Physical Damage) every 0.5s. After leaving Thamuz for a period of time or a certain distance, the (Scythes) will return to Thamuz and drag enemies in their path to him. Thamuz can approach the Scythes or cast the skill again to retrieve them.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Chasm Trample",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Thamuz jumps to a designated area to deal 230( +60% Extra Physical Attack) (Physical Damage) and slow the enemy units by 25% for 2s upon landing. If the Scythes are still travelling, they will return to Thamuz and (Molten Scythes) will reset its CD instantly.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Cauterant Inferno",
        "tag": "Ultimate • High Impact",
        "desc": "Thamuz spouts the lava stored in his body, dealing 300( +80% Total Physical Attack) (Physical Damage) to nearby enemies and creating a (Cauterant Zone) around him. The (Cauterant Zone) lasts 9s and deals 30( +10% Extra Physical Attack) (Physical Damage) every 0.5s to enemies in the area. Meanwhile, Thamuz gains 500 extra Max HP, heals himself by the same amount, and increases his Attack Speed by 1.3 times. He also recovers 1.5% Max HP each time he deals damage with Basic Attacks or his (Scythes).",
        "counterTip": "Respect Thamuz's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Fighter Carry",
      "Physical Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "alucard",
        "reason": "Sustained frontline presence out-trades in close quarter duels."
      },
      {
        "heroId": "zilong",
        "reason": "Absorbs initial charge and overpowers in prolonged trades."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dominance_ice",
        "tier": "S",
        "reason": "Dominance Ice cuts lifesteal and shield regeneration by 50%."
      },
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Constant knockbacks and slow firewall kite Thamuz endlessly."
      },
      {
        "heroId": "baxia",
        "tier": "A",
        "reason": "Inherent anti-heal passive and mobility neutralize sustain."
      }
    ],
    "avoidPicks": [
      "valir",
      "karrie",
      "baxia"
    ],
    "recommendedSpell": "Flicker / Vengeance",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Thamuz's core kit advantage.",
      "Watch for Thamuz's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Thamuz during key objective contests."
    ],
    "secondaryLane": "Roam"
  },
  {
    "id": "harith",
    "avatar": "assets/heroes/harith.png",
    "name": "Harith",
    "role": "Mage",
    "lane": "Mid",
    "damageType": "Magic",
    "difficulty": "Medium",
    "color": "#c084fc",
    "avatarBg": "linear-gradient(135deg, #7e22ce, #c084fc)",
    "skills": {
      "passive": {
        "name": "Key Insight",
        "tag": "Passive • Mage Synergy",
        "desc": "Harith gains insight from his Key. He gains 7% Hybrid Lifesteal for each nearby enemy hero, stacking up to 35%.",
        "counterTip": "Track Harith's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Synchro Fission",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Harith creates a phantom of himself in a distant location. Harith and his phantom will then release (Synchro Fission) toward each other, dealing 236( +84% Total Magic Power) (Magic Damage) to all enemy units on the path. When the 2 energy waves collide, an explosion occurs, dealing 590( +210% Total Magic Power) (Magic Damage) to all enemies in the explosion area.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Chrono Dash",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Harith dashes towards the target direction. When he arrives, he steals Magic Power from nearby enemy heroes, generates a shield that absorbs at least 185( +140% Total Magic Power) damage and enhances his next Basic Attack. Harith's enhanced Basic Attack deals 225( +100% Total Physical Attack)(+100% Total Magic Power) (Magic Damage) and slows enemies by 40%. Hitting an enemy with Harith's enhanced Basic Attack reduces the cooldown of (Chrono Dash) by 3s.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Zaman Force",
        "tag": "Ultimate • High Impact",
        "desc": "Harith uses his Key to summon the Zaman Force. When the multidimensional rift appears, the cooldown of (Chrono Dash) is reduced by 4s. The rift initially slows enemy heroes in the area by 70%, and will continuously slow enemy heroes by 35% afterwards. If Harith comes into contact with the rift using (Chrono Dash), he will absorb the energy within and reduce the cooldown of (Synchro Fission) by 1s and (Chrono Dash) by 3s. Harith gains 15% Resilience while on the rift.",
        "counterTip": "Respect Harith's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Mage Carry",
      "Magic Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "High burst combo deletes squishy immobile marksmen instantly."
      },
      {
        "heroId": "miya",
        "reason": "AoE magic damage out-bursts Miya in early/mid game teamfights."
      }
    ],
    "counteredBy": [
      {
        "heroId": "athenas_shield",
        "tier": "S",
        "reason": "Athena’s Shield absorbs 25% of magic burst, preventing one-shots."
      },
      {
        "heroId": "ling",
        "tier": "S",
        "reason": "Ling wall-jumping bypasses ground skillshots and dives Harith effortlessly."
      },
      {
        "heroId": "saber",
        "tier": "A",
        "reason": "Airborne lock prevents Harith from casting defensive spells."
      }
    ],
    "avoidPicks": [
      "ling",
      "fanny",
      "saber"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Harith's core kit advantage.",
      "Watch for Harith's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Harith during key objective contests."
    ],
    "secondaryLane": "Gold"
  },
  {
    "id": "kadita",
    "avatar": "assets/heroes/kadita.png",
    "name": "Kadita",
    "role": "Mage",
    "lane": "Mid",
    "secondaryLane": "Roam",
    "damageType": "Magic",
    "difficulty": "Medium",
    "color": "#0284c7",
    "avatarBg": "linear-gradient(135deg, #0369a1, #0284c7)",
    "skills": {
      "passive": {
        "name": "Thalassophobia",
        "tag": "Passive • Ocean Blessing HP Restore",
        "desc": "Every 30s, after taking damage, Kadita restores 65% of the HP lost over 4s upon completing the wave blessing.",
        "counterTip": "Do not commit poke skills pointlessly; finish her with hard burst before her passive heals back 65% of the damage."
      },
      "skill1": {
        "name": "Ocean Oddity",
        "tag": "Skill 1 • Wave Ride & CC Immunity",
        "desc": "Kadita rides an ocean wave forward, gaining CC immunity, 50% damage reduction, and dealing magic damage. Can be cast again to halt.",
        "counterTip": "Do not waste CC while she is riding the wave; wait until the wave ends before counter-engaging."
      },
      "skill2": {
        "name": "Breath of the Ocean",
        "tag": "Skill 2 • Geyser Knockup",
        "desc": "Kadita summons an ocean geyser beneath enemies, knocking them airborne for 1.5s after a short delay.",
        "counterTip": "Has a 0.75s activation delay—watch the floor animation and walk or dash out of the circle."
      },
      "ultimate": {
        "name": "Rough Waves",
        "tag": "Ultimate • Untargetable Tsunami Dive",
        "desc": "Kadita dives into the ocean, becoming untargetable and releasing 6 tsunamis that deal massive magic damage and slow, then return to her for second burst.",
        "counterTip": "Athena’s Shield and Winter Crown completely neutralize this lethal one-shot dive. Scatter so the returning waves do not multi-hit."
      }
    },
    "tags": [
      "Wave Immunity",
      "Insane AOE Burst",
      "Petrify Assassin Mage"
    ],
    "powerSpikes": {
      "early": 5,
      "mid": 5,
      "late": 3
    },
    "counters": [
      {
        "heroId": "pharsa",
        "reason": "Swims under Pharsa air strike immune to CC and deletes her with Rough Waves."
      },
      {
        "heroId": "yve",
        "reason": "Dives through Yve slow field with Ocean Oddity and one-shots her."
      }
    ],
    "counteredBy": [
      {
        "heroId": "diggie",
        "tier": "S",
        "reason": "Time Journey cleanses Kadita Breath of the Ocean knockup and gives massive shields."
      },
      {
        "heroId": "franco",
        "tier": "S",
        "reason": "Suppression catches Kadita when she emerges from wave."
      },
      {
        "heroId": "chou",
        "tier": "A",
        "reason": "Shunpo immunity dodges wave and kicks Kadita away from allies."
      }
    ],
    "avoidPicks": [
      "pharsa",
      "yve",
      "layla"
    ],
    "recommendedSpell": "Petrify",
    "counterItems": [
      "ATHENAS_SHIELD",
      "WINTER_CROWN"
    ],
    "tacticalTips": [
      "Kadita combo always relies on Petrify + Rough Waves. Buy Athena’s Shield or Winter Crown to survive the burst.",
      "Check bushes with skillshots; Kadita relies almost entirely on bush ambushes."
    ]
  },
  {
    "id": "leomord",
    "avatar": "assets/heroes/leomord.png",
    "name": "Leomord",
    "role": "Fighter",
    "lane": "EXP",
    "damageType": "Physical",
    "difficulty": "Hard",
    "color": "#f97316",
    "avatarBg": "linear-gradient(135deg, #c2410c, #ea580c)",
    "skills": {
      "passive": {
        "name": "The Oath Keeper",
        "tag": "Passive • Fighter Synergy",
        "desc": "Leomord's Basic Attacks are guaranteed to Crit against enemies below 50% Max HP, dealing 200% damage. Leomord converts every 1% Crit Chance gained into 1 Physical Attack.",
        "counterTip": "Track Leomord's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Momentum",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Leomord gains a 150( +50% Total Physical Attack) shield and begins channeling, slowing enemies in the target direction by 25%. When the channeling is complete or interrupted, he thrusts his sword in the same direction, dealing up to 500( +180% Total Physical Attack) (Physical Damage) to enemies hit (scales with channel time) and slowing them by 40% for 1s. Leomord can cast this skill again to actively interrupt the channeling.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Decimation Assault",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Leomord charges in a designated direction, dealing 300( +50% Total Physical Attack) (Physical Damage) to enemies along the way and slowing them by 30% for 1s.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Phantom Steed",
        "tag": "Ultimate • High Impact",
        "desc": "Leomord summons (Barbiel) to rush to him, knocking back and dealing 350( +100% Total Physical Attack) (Physical Damage) to all enemies in its path. If (Barbiel) comes in contact with Leomord, they will enter the Mounted State, gaining 30% Movement Speed that decays over 2s. (Mounted State): Leomord gains a brand-new set of skills, and his Basic Attack can be used while moving and hits a circular area to deal AOE damage. Leomord also gains 60 Movement Speed and 30 Physical & Magic Defense.",
        "counterTip": "Respect Leomord's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Fighter Carry",
      "Physical Damage",
      "High Skill Ceiling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "alucard",
        "reason": "Sustained frontline presence out-trades in close quarter duels."
      },
      {
        "heroId": "zilong",
        "reason": "Absorbs initial charge and overpowers in prolonged trades."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dominance_ice",
        "tier": "S",
        "reason": "Dominance Ice cuts lifesteal and shield regeneration by 50%."
      },
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Constant knockbacks and slow firewall kite Leomord endlessly."
      },
      {
        "heroId": "baxia",
        "tier": "A",
        "reason": "Inherent anti-heal passive and mobility neutralize sustain."
      }
    ],
    "avoidPicks": [
      "valir",
      "karrie",
      "baxia"
    ],
    "recommendedSpell": "Flicker / Vengeance",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Leomord's core kit advantage.",
      "Watch for Leomord's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Leomord during key objective contests."
    ],
    "secondaryLane": "Roam"
  },
  {
    "id": "claude",
    "avatar": "assets/heroes/claude.png",
    "name": "Claude",
    "role": "Marksman",
    "lane": "Gold",
    "damageType": "Physical",
    "difficulty": "Hard",
    "color": "#fbbf24",
    "avatarBg": "linear-gradient(135deg, #d97706, #f59e0b)",
    "skills": {
      "passive": {
        "name": "Battle Side-by-side",
        "tag": "Passive • Dexter Dual Attack",
        "desc": "Claude’s monkey Dexter assists in all basic attacks, dealing 20 (+35% Total Physical Attack) Physical Damage and inheriting basic attack on-hit effects (including DHS and Golden Staff).",
        "counterTip": "Dexter triggers Demon Hunter Sword on-hit effects twice per attack, making Claude shred tanks without high physical armor."
      },
      "skill1": {
        "name": "Art of Thief",
        "tag": "Skill 1 • Speed Steal Buff",
        "desc": "Claude attacks enemies in a fan-shaped area, dealing physical damage and stealing 4% Movement Speed and 4% Attack Speed per target hit, stacking up to 5 times (doubled against heroes).",
        "counterTip": "Do not group together with minions; hitting multiple units gives Claude maximum attack and movement speed stacks instantly."
      },
      "skill2": {
        "name": "Battle Mirror Image",
        "tag": "Skill 2 • Teleport & Clone Swap",
        "desc": "Claude places a mirror image of Dexter at a target location that attacks nearby enemies. Casting again instantly swaps locations with Dexter.",
        "counterTip": "Watch Dexter’s hologram placement; bait Claude into swapping or save hard CC right at his return point."
      },
      "ultimate": {
        "name": "Blazing Duet",
        "tag": "Ultimate • Rapid AoE Barrage",
        "desc": "Claude and Dexter rapidly shoot nearby enemies for 3 seconds, triggering basic attack on-hit effects and gaining a shield. Deals bonus damage to minions.",
        "counterTip": "Hard CC (Knockup, Stun, Freeze, Petrification) immediately cancels Blazing Duet! Use Vengeance or Blade Armor to reflect huge damage."
      }
    },
    "tags": [
      "Teamfight AOE",
      "High Mobility",
      "Attack Speed Scaling"
    ],
    "powerSpikes": {
      "early": 1,
      "mid": 4,
      "late": 5
    },
    "counters": [
      {
        "heroId": "uranus",
        "reason": "Demon Hunter Sword melt + high mobility renders Uranus harmless."
      },
      {
        "heroId": "esmeralda",
        "reason": "Can kite Esmeralda effortlessly and melt shield with DHS."
      },
      {
        "heroId": "tigreal",
        "reason": "Can easily blink out of Tigreal setup with Battle Mirror Image."
      }
    ],
    "counteredBy": [
      {
        "heroId": "lolita",
        "tier": "S",
        "reason": "Lolita's shield completely blocks Claude's entire Blazing Duet ultimate."
      },
      {
        "heroId": "belerick",
        "tier": "S",
        "reason": "Deflects Claude high attack speed basic attacks and taunts him instantly."
      },
      {
        "heroId": "franco",
        "tier": "S",
        "reason": "Suppresses Claude the instant he blinks in to ult, cancelling Blazing Duet."
      },
      {
        "heroId": "lesley",
        "tier": "A",
        "reason": "Outranges Claude significantly in early game lane trades."
      },
      {
        "heroId": "saber",
        "tier": "A",
        "reason": "Instant point-and-click lock-on deletion before Claude can mirror swap."
      }
    ],
    "avoidPicks": [
      "uranus",
      "baxia",
      "estes"
    ],
    "recommendedSpell": "Purify / Sprint",
    "counterItems": [
      "BLADE_ARMOR",
      "WIND_OF_NATURE",
      "DOMINANCE_ICE"
    ],
    "tacticalTips": [
      "Save your hard Crowd Control for the exact second he dives in with Blazing Duet.",
      "Lolita shield completely absorbs his ultimate; Belerick passive causes Claude to kill himself.",
      "Harass him aggressively in early game before he completes Demon Hunter Sword."
    ]
  },
  {
    "id": "vale",
    "avatar": "assets/heroes/vale.png",
    "name": "Vale",
    "role": "Mage",
    "lane": "Mid",
    "damageType": "Magic",
    "difficulty": "Easy",
    "color": "#c084fc",
    "avatarBg": "linear-gradient(135deg, #7e22ce, #c084fc)",
    "skills": {
      "passive": {
        "name": "Windtalk",
        "tag": "Passive • Mage Synergy",
        "desc": "Vale gains 1 stack of (Windtalk) each time he gets a kill or an assist that increases his Movement Speed by 8. This effect can stack up to 10 times.",
        "counterTip": "Track Vale's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Wind Blade",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Vale unleashes two wind blades toward the left and right of a target area, each dealing 250( +80% Total Magic Power) (Magic Damage) to enemies hit.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Windblow",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Vale sends a whirlwind in the target direction, dealing 300( +40% Total Magic Power) (Magic Damage) to enemies hit and knocking them airborne for 1s (each enemy can only be knocked airborne 1 time). When the whirlwind reaches its destination, it will remain for 1.6s while continuously dealing a total of 200( +80% Total Magic Power) (Magic Damage) to enemies in range.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Windstorm",
        "tag": "Ultimate • High Impact",
        "desc": "Vale summons a windstorm at the target location, dealing a total of 150( +40% Total Magic Power) (Magic Damage) to enemies in the area and slowing them by 20% while continuously pulling them into its center. After 1.6s, the windstorm will explode, dealing 1000( +200% Total Magic Power) (Magic Damage). The remaining whirlwinds will also be pulled into the center.",
        "counterTip": "Respect Vale's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Mage Carry",
      "Magic Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "High burst combo deletes squishy immobile marksmen instantly."
      },
      {
        "heroId": "miya",
        "reason": "AoE magic damage out-bursts Miya in early/mid game teamfights."
      }
    ],
    "counteredBy": [
      {
        "heroId": "athenas_shield",
        "tier": "S",
        "reason": "Athena’s Shield absorbs 25% of magic burst, preventing one-shots."
      },
      {
        "heroId": "ling",
        "tier": "S",
        "reason": "Ling wall-jumping bypasses ground skillshots and dives Vale effortlessly."
      },
      {
        "heroId": "saber",
        "tier": "A",
        "reason": "Airborne lock prevents Vale from casting defensive spells."
      }
    ],
    "avoidPicks": [
      "ling",
      "fanny",
      "saber"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Vale's core kit advantage.",
      "Watch for Vale's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Vale during key objective contests."
    ]
  },
  {
    "id": "hanzo",
    "avatar": "assets/heroes/hanzo.png",
    "name": "Hanzo",
    "role": "Assassin",
    "lane": "Jungle",
    "damageType": "Physical",
    "difficulty": "Very Hard",
    "color": "#38bdf8",
    "avatarBg": "linear-gradient(135deg, #0284c7, #38bdf8)",
    "skills": {
      "passive": {
        "name": "Ame no Habakiri",
        "tag": "Passive • Assassin Synergy",
        "desc": "When units die near Hanzo, the demon Hanekage absorbs their souls and converts them into (Demon Blood). Hanzo gains 2 (Demon Blood) for each non-hero unit and 20 (Demon Blood) for each hero that dies in his vicinity.",
        "counterTip": "Track Hanzo's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Ninjutsu: Demon Feast",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Every 5 basic attacks by Hanzo (temporarily unlocks) this ability for 6.5s. Hanzo uses Ame no Habakiri to devour a target and digest them over a period of time. By doing so Hanzo gets 10 (Demon Blood). (Can only be used against Minions and Creeps. Targeting Lord or Turtle deals 500 (True Damage)).",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Ninjutsu: Soul Reap",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Hanzo summons demonic spikes at the target location, dealing 160( +60% Total Physical Attack) immediate (Physical Damage). If an enemy is hit, the skill will strike again after 0.5s, dealing 40( +15% Total Physical Attack) (Physical Damage) to targets in the area and slowing them by 40% until no target is hit or dealing additional damage for 8 times. Every unit hit grants him 1 (Demon Blood).",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Kinjutsu: Pinnacle Ninja",
        "tag": "Ultimate • High Impact",
        "desc": "Hanzo gains 25 Demon Blood and sends out the demon (Hanekage) in the target direction while gaining a new set of skills. (Hanekage) consumes 10 (Demon Blood) every second while he is out. Hanzo's body will be slowly pulled to Hanekage's location as Demon Blood depletes. (Hanekage) can move through terrain and gains 35% Movement Speed and 30% Attack Speed, but his Physical & Magic Defense are reduced by 50.0%. If (Hanekage) is killed, he will be drawn back to Hanzo's body, stunning Hanzo for 3s and weakening him for 8s (slowing him by 55%, reducing his Physical & Magic Defense by 100%, and revealing his location to enemies). If (Hanzo's body) is killed, he will die immediately and Hanekage will disappear. (Use Again): Hanekage returns to Hanzo's body (the additional skill button will summon Hanzo's body to Hanekage instead).",
        "counterTip": "Respect Hanzo's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Assassin Carry",
      "Physical Damage",
      "High Skill Ceiling"
    ],
    "powerSpikes": {
      "early": 4,
      "mid": 5,
      "late": 3
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "Rapid mobility bridges distance and eliminates isolated targets."
      },
      {
        "heroId": "gord",
        "reason": "Blinks past Gord stuns and deletes during channel."
      }
    ],
    "counteredBy": [
      {
        "heroId": "khufra",
        "tier": "S",
        "reason": "Bouncing Ball cancels dash abilities and grounds momentum."
      },
      {
        "heroId": "franco",
        "tier": "S",
        "reason": "Suppression ultimate cannot be purified and locks Hanzo down."
      },
      {
        "heroId": "antique_cuirass",
        "tier": "A",
        "reason": "Reduces skill damage scaling by 12% across multi-hit combos."
      }
    ],
    "avoidPicks": [
      "khufra",
      "franco",
      "minsitthar"
    ],
    "recommendedSpell": "Retribution",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Hanzo's core kit advantage.",
      "Watch for Hanzo's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Hanzo during key objective contests."
    ]
  },
  {
    "id": "lunox",
    "avatar": "assets/heroes/lunox.png",
    "name": "Lunox",
    "role": "Mage",
    "lane": "Mid",
    "secondaryLane": "Jungle",
    "damageType": "Magic",
    "difficulty": "Hard",
    "color": "#f43f5e",
    "avatarBg": "linear-gradient(135deg, #be123c, #f43f5e)",
    "skills": {
      "passive": {
        "name": "Dreamland Twist",
        "tag": "Passive • Cooldown to Defense / Penetration",
        "desc": "Lunox cannot gain Cooldown Reduction. In Chaos state, CDR converts into Magic Penetration. In Order state, CDR converts into Magic & Physical Defense.",
        "counterTip": "In Chaos state she shreds tanks with near 100% Magic Penetration; in Order state she has massive bonus defense."
      },
      "skill1": {
        "name": "Starlight Pulse",
        "tag": "Skill 1 • Order Heal & Poke",
        "desc": "Lunox fires starlight, dealing magic damage and restoring HP based on damage dealt (doubled against heroes). Adds 1 Order mark.",
        "counterTip": "Cut her sustain with Glowing Wand or Dominance Ice."
      },
      "skill2": {
        "name": "Chaos Assault",
        "tag": "Skill 2 • % Max HP Magic Burst",
        "desc": "Lunox fires chaos energy, dealing magic damage + 2.5%–5% of the target’s Max HP. Adds 1 Chaos mark.",
        "counterTip": "High-HP tanks melt against Chaos Assault; build Radiant Armor to survive the rapid spam."
      },
      "ultimate": {
        "name": "Order & Chaos Brilliance",
        "tag": "Ultimate • Invulnerability / Rapid Chaos Spam",
        "desc": "Order: Lunox enters Light of Order, becoming completely invulnerable and untargetable for 3s while dealing AoE damage. Chaos: Dashes forward and spams Chaos Assault with 0s cooldown.",
        "counterTip": "Do not waste abilities while she is golden/invulnerable in Order Ult. Burst her down as soon as she switches to Chaos form."
      }
    },
    "tags": [
      "Order & Chaos",
      "Invulnerable Brilliance",
      "Tank Melting Magic Pen"
    ],
    "powerSpikes": {
      "early": 4,
      "mid": 5,
      "late": 5
    },
    "counters": [
      {
        "heroId": "fredrinn",
        "reason": "Chaos Darkening converts magic resistance into raw percentage HP shred."
      },
      {
        "heroId": "baxia",
        "reason": "Melts high magic defense tanks with immense magic penetration."
      },
      {
        "heroId": "tigreal",
        "reason": "Uses Light Brilliance to become untargetable and immune to Tigreal setups."
      }
    ],
    "counteredBy": [
      {
        "heroId": "lolita",
        "tier": "S",
        "reason": "Lolita shield blocks Lunox Chaos Assault continuous projectile bursts."
      },
      {
        "heroId": "saber",
        "tier": "S",
        "reason": "Saber instant airborne combo deletes Lunox before she can shift into Light form."
      },
      {
        "heroId": "belerick",
        "tier": "A",
        "reason": "Belerick taunt locks Lunox in place during Chaos form."
      }
    ],
    "avoidPicks": [
      "fredrinn",
      "baxia",
      "tigreal"
    ],
    "recommendedSpell": "Flicker",
    "counterItems": [
      "RADIANT_ARMOR",
      "ATHENAS_SHIELD",
      "BLADE_ARMOR"
    ],
    "tacticalTips": [
      "Catch Lunox when she is in Chaos mode (Darkness). In Chaos mode, she has ZERO invulnerability and is very squishy.",
      "Radiant Armor is superior to Athena’s Shield against Lunox because her Chaos Assault fires rapid continuous magic pulses."
    ]
  },
  {
    "id": "aldous",
    "avatar": "assets/heroes/aldous.png",
    "name": "Aldous",
    "role": "Fighter",
    "lane": "EXP",
    "damageType": "Magic",
    "difficulty": "Hard",
    "color": "#f97316",
    "avatarBg": "linear-gradient(135deg, #c2410c, #ea580c)",
    "skills": {
      "passive": {
        "name": "Contract: Transform",
        "tag": "Passive • Fighter Synergy",
        "desc": "After every 2 Basic Attacks, Aldous gains a 500 (+3 times the number of (Soul Steal) stacks) shield for 3s on his next Basic Attack. This effect can only be triggered once every 5s.",
        "counterTip": "Track Aldous's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Contract: Soul Steal",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Aldous unleashes his inner energy to enhance his next Basic Attack to deal (Physical Damage) equal to 200( +100% Total Physical Attack) plus 5 times the number of (Soul Steal) stacks. If this attack kills an enemy hero/Siege Minion/other non-hero unit, Aldous will gain 10/10/4 stacks of (Soul Steal) (up to 650 stacks). The enhanced Basic Attack deals 300% extra Base Damage to Minions or Creeps. Aldous gets an extra 5/2 stack(s) of (Soul Steal) when a nearby enemy Siege Minion/other non-hero unit dies.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Contract: Explosion",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Aldous assumes a defensive stance, gaining 30% Damage Reduction and 20% extra Movement Speed for 2s or until manual cancellation. He then deals 100( +20% Total Physical Attack)-200( +40% Total Physical Attack) (Physical Damage) to nearby enemies and stuns them for 0.5-1s (scales with defensive stance duration).",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Contract: Chase Fate",
        "tag": "Ultimate • High Impact",
        "desc": "Aldous gains vision of all enemy heroes for 5s. During this time, if Aldous uses this skill again, he can dash toward an enemy hero. When Aldous hits that enemy hero, he will deal (Physical Damage) equal to 250 plus 8% of the target's Max HP and knock back the target for 1s. (Aldous can interrupt target's Recall during the dash.)",
        "counterTip": "Respect Aldous's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Fighter Carry",
      "Magic Damage",
      "High Skill Ceiling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "alucard",
        "reason": "Sustained frontline presence out-trades in close quarter duels."
      },
      {
        "heroId": "zilong",
        "reason": "Absorbs initial charge and overpowers in prolonged trades."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dominance_ice",
        "tier": "S",
        "reason": "Dominance Ice cuts lifesteal and shield regeneration by 50%."
      },
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Constant knockbacks and slow firewall kite Aldous endlessly."
      },
      {
        "heroId": "baxia",
        "tier": "A",
        "reason": "Inherent anti-heal passive and mobility neutralize sustain."
      }
    ],
    "avoidPicks": [
      "valir",
      "karrie",
      "baxia"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Aldous's core kit advantage.",
      "Watch for Aldous's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Aldous during key objective contests."
    ],
    "secondaryLane": "Roam"
  },
  {
    "id": "selena",
    "avatar": "assets/heroes/selena.png",
    "name": "Selena",
    "role": "Assassin",
    "lane": "Jungle",
    "damageType": "Magic",
    "difficulty": "Hard",
    "color": "#38bdf8",
    "avatarBg": "linear-gradient(135deg, #0284c7, #38bdf8)",
    "skills": {
      "passive": {
        "name": "Symbiosis",
        "tag": "Passive • Assassin Synergy",
        "desc": "Selena can switch freely between her two forms. (Elven Form): Selena applies (Abyssal Mark) when her skills deal damage. Marks last 8s and can stack up to 2 times. (Abyssal Form): Selena's Basic Attacks become melee and deal ( +25% Total Magic Power) additional (Magic Damage). Her skills deal 240-450( +40% Total Magic Power) additional (Magic Damage) to enemies with (Abyssal Mark) and reduce their mark stacks by 1. This damage is increased to 200% against Creeps.",
        "counterTip": "Track Selena's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Abyssal Trap",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Selena summons an Abyssal Devil to lurk underground. The Abyssal Devil will attach itself to any enemy that approaches, inflicting a stack of (Abyssal Mark) and reducing their Movement Speed by 50% for 1s. The Abyssal Devil then explodes, dealing 350( +150% Total Magic Power) (Magic Damage) to enemies in the area and reducing their Movement Speed by 50% for 1s. Each additional Abyssal Devil on an enemy increases the final damage by 50%. Each Abyssal Devil can lurk up to 60s and up to 3 Abyssal Devils can exist at the same time.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Abyssal Arrow",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Selena fires an abyssal wraith in the target direction that stops when it hits an enemy hero, Creep, or Summon, dealing 250( +20% Total Magic Power) to 500( +40% Total Magic Power) (Magic Damage) to the target hit and stunning them for 0.5s to 3s (the damage and stun duration increase with the wraith's travel distance). The wraith will pick up (Abyssal Trap) as it travels over it and will apply the traps to the enemy target upon stunning them. If the wraith stuns an enemy for 1s or longer, Selena will gain 40% Movement Speed for 2s.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Primal Darkness",
        "tag": "Ultimate • High Impact",
        "desc": "Selena enters Abyssal Form and gains 20% Movement Speed for 0.8s. This also immediately resets the cooldown of (Soul Eater) and (Garotte).",
        "counterTip": "Respect Selena's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Assassin Carry",
      "Magic Damage",
      "High Skill Ceiling"
    ],
    "powerSpikes": {
      "early": 4,
      "mid": 5,
      "late": 3
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "Rapid mobility bridges distance and eliminates isolated targets."
      },
      {
        "heroId": "gord",
        "reason": "Blinks past Gord stuns and deletes during channel."
      }
    ],
    "counteredBy": [
      {
        "heroId": "khufra",
        "tier": "S",
        "reason": "Bouncing Ball cancels dash abilities and grounds momentum."
      },
      {
        "heroId": "franco",
        "tier": "S",
        "reason": "Suppression ultimate cannot be purified and locks Selena down."
      },
      {
        "heroId": "antique_cuirass",
        "tier": "A",
        "reason": "Reduces skill damage scaling by 12% across multi-hit combos."
      }
    ],
    "avoidPicks": [
      "khufra",
      "franco",
      "minsitthar"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Selena's core kit advantage.",
      "Watch for Selena's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Selena during key objective contests."
    ],
    "secondaryLane": "Mid"
  },
  {
    "id": "kaja",
    "avatar": "assets/heroes/kaja.png",
    "name": "Kaja",
    "role": "Support",
    "lane": "Roam",
    "damageType": "Physical",
    "difficulty": "Hard",
    "color": "#06b6d4",
    "avatarBg": "linear-gradient(135deg, #0891b2, #06b6d4)",
    "skills": {
      "passive": {
        "name": "Wrath Sanction",
        "tag": "Passive • Support Synergy",
        "desc": "Kaja achieves Wrath Sanction every 6s. His next Basic Attack will send lightning at enemies, dealing (Magic Damage) equal to 100( +100% Total Magic Power) plus 4% of targets' Max HP and (paralyzing) them. The lightning will jump to enemies nearby as well (up to 3 times). Increases damage by 200% of targets' Max HP on Minions and Creeps. (Paralyze): Slows enemy heroes and summons while reducing their damage by 3% (up to 8 stacks) for 5s.",
        "counterTip": "Track Kaja's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Ring of Order",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Kaja releases a Ringed Electric Blade that quickly expands and contracts, dealing 135( +70% Total Magic Power) (Magic Damage) to enemies hit on its way out and back and (paralyzing) them. Enemies hit will also have their positions revealed briefly. Each time Electric Blade deals damage, Kaja restores 100 HP (decays to 30% after multiple hits).",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Lightning Bomb",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Kaja dashes in the target direction while leaving 3 Lightning Bombs along the way. The Bombs will explode upon enemy contact, dealing 150( +35% Total Magic Power) (Magic Damage) to the enemies and (paralyzing) them.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Divine Judgment",
        "tag": "Ultimate • High Impact",
        "desc": "Kaja deals 200( +100% Total Magic Power) (Magic Damage) to a designated enemy hero, suppresses and (paralyzes) them for 1.5s. During the suppression, Kaja can drag the enemy hero along with him.",
        "counterTip": "Respect Kaja's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Support Carry",
      "Physical Damage",
      "High Skill Ceiling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "alucard",
        "reason": "Sustained frontline presence out-trades in close quarter duels."
      },
      {
        "heroId": "zilong",
        "reason": "Absorbs initial charge and overpowers in prolonged trades."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dominance_ice",
        "tier": "S",
        "reason": "Dominance Ice cuts lifesteal and shield regeneration by 50%."
      },
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Constant knockbacks and slow firewall kite Kaja endlessly."
      },
      {
        "heroId": "baxia",
        "tier": "A",
        "reason": "Inherent anti-heal passive and mobility neutralize sustain."
      }
    ],
    "avoidPicks": [
      "valir",
      "karrie",
      "baxia"
    ],
    "recommendedSpell": "Flicker / Vengeance",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Kaja's core kit advantage.",
      "Watch for Kaja's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Kaja during key objective contests."
    ]
  },
  {
    "id": "uranus",
    "avatar": "assets/heroes/uranus.png",
    "name": "Uranus",
    "role": "Tank",
    "lane": "Roam",
    "damageType": "Physical",
    "difficulty": "Easy",
    "color": "#10b981",
    "avatarBg": "linear-gradient(135deg, #047857, #10b981)",
    "skills": {
      "passive": {
        "name": "Radiance",
        "tag": "Passive • Tank Synergy",
        "desc": "Uranus absorbs the energy generated by incoming attacks to strengthen himself, regenerating a certain amount of HP every 0.8s. Each stack lasts 10s. When at max stacks (20), Uranus regenerates 48-224 HP (scales with level).",
        "counterTip": "Track Uranus's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Ionic Edge",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Uranus releases two energy blades that orbit around him, dealing 155( +30% Total Magic Power) (Magic Damage) to enemy targets and slowing them by 30% for 2s. Each time this skill deals damage to a target, they will be marked with a stack for 6s (max of 1 stack per target per cast). Each stack increases the damage of this skill by 40% (to a max of 320%). Each energy blade will only deal damage to the same target once.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Transcendent Ward",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Uranus charges to the target location, dealing 80( +20% Total Magic Power) (Magic Damage) to enemies along the way, and 160( +80% Total Magic Power) (Magic Damage) to enemies at the target location and slowing them by 25%. Uranus also generates a 300( +200% Total Magic Power) shield for 4s. The shield explodes at the end of its duration or when destroyed, dealing 300( +150% Total Magic Power) (Magic Damage) to enemies nearby.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Consecration",
        "tag": "Ultimate • High Impact",
        "desc": "Uranus unleashes the energy stored within his body, removing slow effects on himself, recovering 200 HP, and gaining 60% Movement Speed for 8s (decays over time). Uranus directly gains 5 stacks of Radiance, increasing shields received and HP Regen by 20% for 8s.",
        "counterTip": "Respect Uranus's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Tank Carry",
      "Physical Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "Frontline crowd control locks down squishy carries."
      },
      {
        "heroId": "miya",
        "reason": "Heavy armor and taunts/stuns disrupt basic attack rhythm."
      }
    ],
    "counteredBy": [
      {
        "heroId": "karrie",
        "tier": "S",
        "reason": "Lightwheel True Damage completely bypasses high armor and magic defense."
      },
      {
        "heroId": "lunox",
        "tier": "S",
        "reason": "Chaos magic penetration shreds % Max HP frontliners."
      },
      {
        "heroId": "demon_hunter_sword",
        "tier": "A",
        "reason": "DHS passive deals 8% current HP on every basic attack."
      }
    ],
    "avoidPicks": [
      "karrie",
      "lunox",
      "claude"
    ],
    "recommendedSpell": "Flicker / Vengeance",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Uranus's core kit advantage.",
      "Watch for Uranus's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Uranus during key objective contests."
    ],
    "secondaryLane": "EXP"
  },
  {
    "id": "lesley",
    "avatar": "assets/heroes/lesley.png",
    "name": "Lesley",
    "role": "Marksman",
    "lane": "Gold",
    "damageType": "True Damage",
    "difficulty": "Medium",
    "color": "#a855f7",
    "avatarBg": "linear-gradient(135deg, #7e22ce, #a855f7)",
    "skills": {
      "passive": {
        "name": "Lethal Shot",
        "tag": "Passive • True Damage Critical",
        "desc": "After not taking damage for 5s, Lesley’s next basic attack gains increased range, 50% critical chance, and deals True Damage. Using any skill resets Lethal Shot.",
        "counterTip": "Buy Twilight Armor! Traditional physical defense cannot reduce her True Damage, but Twilight Armor caps the single-hit burst."
      },
      "skill1": {
        "name": "Master of Camouflage",
        "tag": "Skill 1 • Camouflage & Movement",
        "desc": "Lesley enters Camouflage state for 3s, gaining 40% movement speed and 75-200 Physical Attack. Taking or dealing damage breaks camouflage.",
        "counterTip": "Hit her with AoE skills to break her camouflage and cancel the bonus movement speed."
      },
      "skill2": {
        "name": "Tactical Grenade",
        "tag": "Skill 2 • Knockback Disengage",
        "desc": "Lesley throws a tactical grenade forward, knocking back enemies in a cone and jumping backward a short distance.",
        "counterTip": "Bait her grenade before committing your gap-closer dash or flash engage."
      },
      "ultimate": {
        "name": "Ultimate Snipe",
        "tag": "Ultimate • Locked-On Sniping",
        "desc": "Lesley locks onto an enemy hero and fires 4 fatal bullets in succession, revealing the target and dealing physical damage + % missing HP.",
        "counterTip": "Allies with high HP or shields can body-block the bullets by standing between Lesley and the targeted ally."
      }
    },
    "tags": [
      "True Damage Crit",
      "Camouflage",
      "Late Game Monster"
    ],
    "powerSpikes": {
      "early": 2,
      "mid": 3,
      "late": 5
    },
    "counters": [
      {
        "heroId": "uranus",
        "reason": "Lesley late game true damage ignores all physical & magic armor entirely."
      },
      {
        "heroId": "esmeralda",
        "reason": "True damage crits directly bypass Esmeralda shield."
      },
      {
        "heroId": "terizla",
        "reason": "Kites Terizla easily and bypasses his damage-reduction passive."
      }
    ],
    "counteredBy": [
      {
        "heroId": "brody",
        "tier": "S",
        "reason": "Brody crushes Lesley early game with immense physical burst and stun."
      },
      {
        "heroId": "ling",
        "tier": "S",
        "reason": "Wall walk easily catches up to Lesley camouflage and assassinates her."
      },
      {
        "heroId": "fanny",
        "tier": "S",
        "reason": "Fanny cable dive easily reaches Lesley from across screens."
      },
      {
        "heroId": "saber",
        "tier": "A",
        "reason": "Saber Triple Sweep locks onto Lesley even during camouflage."
      }
    ],
    "avoidPicks": [
      "uranus",
      "esmeralda",
      "baxia",
      "terizla"
    ],
    "recommendedSpell": "Flicker",
    "counterItems": [
      "TWILIGHT_ARMOR",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Armor does NOT reduce Lesley damage in late game because her passive converts it to True Damage. Buy Twilight Armor!",
      "End the match before the 15-minute mark; late-game Lesley can two-shot squishies from extreme range.",
      "Use area-of-effect skills into bushes to knock her out of camouflage."
    ]
  },
  {
    "id": "change",
    "avatar": "assets/heroes/change.png",
    "name": "Chang'e",
    "role": "Mage",
    "lane": "Mid",
    "damageType": "Magic",
    "difficulty": "Easy",
    "color": "#c084fc",
    "avatarBg": "linear-gradient(135deg, #7e22ce, #c084fc)",
    "skills": {
      "passive": {
        "name": "Trouble Maker",
        "tag": "Passive • Mage Synergy",
        "desc": "Each time Chang'e deals damage to an enemy, she leaves a mark on them. Each mark reduces the target's Movement Speed by 1%, stacking up to 20%.",
        "counterTip": "Track Chang'e's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Starmoon Shockwave",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Chang'e sends an energy sphere in the target direction, dealing 350( +130% Total Magic Power) (Magic Damage) to enemies in its path and slowing them by 10% for 1.5s. (Crescent Moon): The (Crescent Moon) sends 4 extra energy spheres along with Chang'e's, each dealing 20% damage and slowing enemies hit. The slow effect can stack (up to 20%).",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Crescent Moon",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Chang'e summons the (Crescent Moon), gaining a permanent 300( +150% Total Magic Power) shield and 10% Movement Speed (that lasts until the shield is destroyed). Each time Chang'e casts a skill, she also gains 50% Movement Speed that decays over 2.5s. (Crescent Moon) also allows Chang'e's Basic Attacks to deal 20( +35% Total Physical Attack) (+35% Total Magic Power) additional (Magic Damage) 2 times. Each time Chang'e deals Magic Damage with her Basic Attack and skills, the cooldown of this skill is reduced by 0.2s.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Meteor Shower",
        "tag": "Ultimate • High Impact",
        "desc": "Chang'e fires 30 meteors in the target direction over 4s, each dealing 60( +33% Total Magic Power) (Magic Damage) to the first enemy hit. This skill deals 100% extra damage to Minions and Creeps. Chang'e also gains 10% Movement Speed for the duration. (Crescent Moon): The (Crescent Moon) also fires meteors along with Chang'e, each dealing 33% damage.",
        "counterTip": "Respect Chang'e's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Mage Carry",
      "Magic Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "High burst combo deletes squishy immobile marksmen instantly."
      },
      {
        "heroId": "miya",
        "reason": "AoE magic damage out-bursts Miya in early/mid game teamfights."
      }
    ],
    "counteredBy": [
      {
        "heroId": "athenas_shield",
        "tier": "S",
        "reason": "Athena’s Shield absorbs 25% of magic burst, preventing one-shots."
      },
      {
        "heroId": "ling",
        "tier": "S",
        "reason": "Ling wall-jumping bypasses ground skillshots and dives Chang'e effortlessly."
      },
      {
        "heroId": "saber",
        "tier": "A",
        "reason": "Airborne lock prevents Chang'e from casting defensive spells."
      }
    ],
    "avoidPicks": [
      "ling",
      "fanny",
      "saber"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Chang'e's core kit advantage.",
      "Watch for Chang'e's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Chang'e during key objective contests."
    ]
  },
  {
    "id": "jawhead",
    "avatar": "assets/heroes/jawhead.png",
    "name": "Jawhead",
    "role": "Fighter",
    "lane": "EXP",
    "damageType": "Magic",
    "difficulty": "Medium",
    "color": "#f97316",
    "avatarBg": "linear-gradient(135deg, #c2410c, #ea580c)",
    "skills": {
      "passive": {
        "name": "Mecha Suppression",
        "tag": "Passive • Fighter Synergy",
        "desc": "Each time Jawhead deals damage to a target, he inflicts a stack of Mecha Suppression on them for 3s (up to 10 stacks). Each stack of Mecha Suppression increases the amount of Basic Attack damage Jawhead deals to the target by 8%.",
        "counterTip": "Track Jawhead's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Smart Missiles",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Jawhead launches up to 12 missiles at random nearby enemies over 5s, each missile dealing 135( +30% Total Physical Attack) (Physical Damage) to the enemy hit.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Ejector",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Jawhead gains 30% Movement Speed and a 250( +180% Total Physical Attack) shield for 5s. (Use Again): Jawhead flings the nearest unit (prioritizes heroes) to the target location, dealing 300( +80% Total Physical Attack) (Physical Damage) to enemies in the area and stunning them for 0.5s. Can be used on allied heroes and they will not take damage.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Unstoppable Force",
        "tag": "Ultimate • High Impact",
        "desc": "Jawhead charges into the target enemy hero, dealing 350( +150% Total Physical Attack) (Physical Damage) and briefly stunning them. Enemies around the target are knocked back and dealt the same amount of the damage. Jawhead is immune to control effects during the charge.",
        "counterTip": "Respect Jawhead's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Fighter Carry",
      "Magic Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "alucard",
        "reason": "Sustained frontline presence out-trades in close quarter duels."
      },
      {
        "heroId": "zilong",
        "reason": "Absorbs initial charge and overpowers in prolonged trades."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dominance_ice",
        "tier": "S",
        "reason": "Dominance Ice cuts lifesteal and shield regeneration by 50%."
      },
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Constant knockbacks and slow firewall kite Jawhead endlessly."
      },
      {
        "heroId": "baxia",
        "tier": "A",
        "reason": "Inherent anti-heal passive and mobility neutralize sustain."
      }
    ],
    "avoidPicks": [
      "valir",
      "karrie",
      "baxia"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Jawhead's core kit advantage.",
      "Watch for Jawhead's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Jawhead during key objective contests."
    ],
    "secondaryLane": "Jungle"
  },
  {
    "id": "angela",
    "avatar": "assets/heroes/angela.png",
    "name": "Angela",
    "role": "Support",
    "lane": "Roam",
    "damageType": "Magic",
    "difficulty": "Medium",
    "color": "#06b6d4",
    "avatarBg": "linear-gradient(135deg, #0891b2, #06b6d4)",
    "skills": {
      "passive": {
        "name": "Smart Heart",
        "tag": "Passive • Support Synergy",
        "desc": "Angela gains 7.5% extra Movement Speed for 4s each time she casts a skill (up to 30%). When she's attached to an allied hero, the Movement Speed boost is transferred to the allied hero.",
        "counterTip": "Track Angela's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Love Waves",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Angela sends (Love Waves) in the target direction, dealing 170( +80% Total Magic Power) (Magic Damage) to enemies hit, revealing their positions briefly, and applying a stack of (Lover's Mark) (up to 5 stacks). Each stack of (Lover's Mark) increases the damage by 20% and slows enemies hit by 8% for 3s. (Love Waves) also restore 150( +75% Total Magic Power) HP to allied heroes hit. Angela can store up to 5 charges of this skill and the recharge time is affected by Cooldown Reduction.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Puppet-on-a-String",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Angela launches a (Puppet String) at the target enemy, dealing 300( +40% Total Magic Power) (Magic Damage) and gradually slowing them by up to 80%. If the enemy is still connected to the string after 3s, they'll be immobilized for 1.5s and dealt 450( +60% Total Magic Power) (Magic Damage). Each stack of (Lover's Mark) increases the final damage by 20%.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Heartguard",
        "tag": "Ultimate • High Impact",
        "desc": "Angela begins channeling, applying a 1000( +200% Total Magic Power) shield that lasts 6s to the target allied hero regardless of distance. After the channeling is complete, she attaches herself to the allied hero for 12s, during which she can cast skills at zero Mana cost. Angela can cast this skill again to cancel the channeling or detach herself from the allied hero. The attaching state will end early if the allied hero is killed.",
        "counterTip": "Respect Angela's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Support Carry",
      "Magic Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "alucard",
        "reason": "Sustained frontline presence out-trades in close quarter duels."
      },
      {
        "heroId": "zilong",
        "reason": "Absorbs initial charge and overpowers in prolonged trades."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dominance_ice",
        "tier": "S",
        "reason": "Dominance Ice cuts lifesteal and shield regeneration by 50%."
      },
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Constant knockbacks and slow firewall kite Angela endlessly."
      },
      {
        "heroId": "baxia",
        "tier": "A",
        "reason": "Inherent anti-heal passive and mobility neutralize sustain."
      }
    ],
    "avoidPicks": [
      "valir",
      "karrie",
      "baxia"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Angela's core kit advantage.",
      "Watch for Angela's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Angela during key objective contests."
    ],
    "secondaryLane": "Mid"
  },
  {
    "id": "hanabi",
    "avatar": "assets/heroes/hanabi.png",
    "name": "Hanabi",
    "role": "Marksman",
    "lane": "Gold",
    "damageType": "Magic",
    "difficulty": "Easy",
    "color": "#fbbf24",
    "avatarBg": "linear-gradient(135deg, #d97706, #f59e0b)",
    "skills": {
      "passive": {
        "name": "Ninjutsu: Petal Barrage",
        "tag": "Passive • Marksman Synergy",
        "desc": "Hanabi's Basic Attacks and skills will launch Petal Blades after hitting a target, bouncing up to 4 times to nearby enemies (the first bounce deals 40% of the initial damage, and subsequent bounces deal 85% of the previous). Bounces from her Basic Attacks inherit a portion of Attack Effects.",
        "counterTip": "Track Hanabi's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Ninjutsu: Equinox",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "(Passive): The secret Ninjutsu of the Scarlet Shadow makes Hanabi immune to control effects when she has a shield from any source. (Active): Hanabi gains a 300( +40% Total Physical Attack) shield for 5s. When the shield is active, Hanabi gains 20% Movement Speed and 25% Attack Speed, and 20% of her damage dealt to enemy heroes will be added to this shield (only adds 10% of the damage dealt to non-hero units). This shield cannot exceed 50% of Hanabi's max HP.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Ninjutsu: Soul Scroll",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Hanabi fires the energy Kunai in the targeted direction, dealing 450( +80% Total Physical Attack) (Physical Damage) to enemies along the way and reducing their Movement Speed by 60% for 1s. Enemy units hit will also be marked, allowing Hanabi's next Bounce Damage from Basic Attacks to deal 30( +100% Total Physical Attack) (Physical Damage) on them with no damage decay.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Forbidden Jutsu: Higanbana",
        "tag": "Ultimate • High Impact",
        "desc": "Hanabi throws Higanbana in the targeted direction, dealing 300( +50% Total Physical Attack) (Physical Damage) to the first enemy hero hit and immobilizing them for 0.8s. After 1s, Higanbana will bloom at the location of the first hit, dealing 300( +50% Total Physical Attack) (Physical Damage) to nearby enemies. Subsequent hits on the same target decay to 20% damage.",
        "counterTip": "Respect Hanabi's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Marksman Carry",
      "Magic Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 2,
      "mid": 4,
      "late": 5
    },
    "counters": [
      {
        "heroId": "tigreal",
        "reason": "Can out-range and kite Tigreal outside his melee engage radius."
      },
      {
        "heroId": "hylos",
        "reason": "High DPS melts Hylos HP pool from safe distance."
      }
    ],
    "counteredBy": [
      {
        "heroId": "saber",
        "tier": "S",
        "reason": "Instant point-and-click lock on airborne deletes Hanabi before repositioning."
      },
      {
        "heroId": "blade_armor",
        "tier": "S",
        "reason": "Blade Armor reflects basic attack physical damage right back."
      },
      {
        "heroId": "khufra",
        "tier": "A",
        "reason": "Bouncing Ball and Tyrants Rage halt escape dashes."
      }
    ],
    "avoidPicks": [
      "saber",
      "khufra",
      "fanny"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Hanabi's core kit advantage.",
      "Watch for Hanabi's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Hanabi during key objective contests."
    ]
  },
  {
    "id": "gusion",
    "avatar": "assets/heroes/gusion.png",
    "name": "Gusion",
    "role": "Assassin",
    "lane": "Jungle",
    "damageType": "Magic",
    "difficulty": "Very Hard",
    "color": "#38bdf8",
    "avatarBg": "linear-gradient(135deg, #0284c7, #38bdf8)",
    "skills": {
      "passive": {
        "name": "Dagger Specialist",
        "tag": "Passive • Assassin Synergy",
        "desc": "Each skill cast adds a rune to Gusion's dagger (stacks up to 4 times). Each stack enhances Gusion's next Basic Attack to deal additional damage equal to 3% of the target's lost HP and restore 50( +25% Total Magic Power) HP to himself.",
        "counterTip": "Track Gusion's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Sword Spike",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Gusion throws a dagger in the target direction, dealing 200( +50% Total Magic Power) (Magic Damage) to the first enemy hit and marking them. (Use Again): Gusion moves behind the marked enemy, dealing 200( +100% Total Magic Power) (Magic Damage) to them. This skill cannot be interrupted while Gusion is moving behind the marked enemy.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Shadowblade Slaughter",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Gusion throws a volley of daggers in the target direction, each dealing 100( +40% Total Magic Power) (Magic Damage) to enemies hit and slowing them by 6% for 2s (when hit by multiple daggers, the slow effect can stack up to 30%). (Use Again): Gusion recalls the daggers, each dealing 65( +40% Total Magic Power) (Magic Damage) to enemies in its path.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Incandescence",
        "tag": "Ultimate • High Impact",
        "desc": "Gusion dashes to the target location, resetting the cooldown of (Sword Spike) and (Shadowblade Slaughter). If (Shadowblade Slaughter) was cast once before the reset, Gusion can throw another five daggers on his next (Shadowblade Slaughter) cast, and recall a total of ten daggers afterward. (Use Again): Gusion dashes a short distance in the target direction.",
        "counterTip": "Respect Gusion's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Assassin Carry",
      "Magic Damage",
      "High Skill Ceiling"
    ],
    "powerSpikes": {
      "early": 4,
      "mid": 5,
      "late": 3
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "Rapid mobility bridges distance and eliminates isolated targets."
      },
      {
        "heroId": "gord",
        "reason": "Blinks past Gord stuns and deletes during channel."
      }
    ],
    "counteredBy": [
      {
        "heroId": "khufra",
        "tier": "S",
        "reason": "Bouncing Ball cancels dash abilities and grounds momentum."
      },
      {
        "heroId": "franco",
        "tier": "S",
        "reason": "Suppression ultimate cannot be purified and locks Gusion down."
      },
      {
        "heroId": "antique_cuirass",
        "tier": "A",
        "reason": "Reduces skill damage scaling by 12% across multi-hit combos."
      }
    ],
    "avoidPicks": [
      "khufra",
      "franco",
      "minsitthar"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Gusion's core kit advantage.",
      "Watch for Gusion's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Gusion during key objective contests."
    ]
  },
  {
    "id": "martis",
    "avatar": "assets/heroes/martis.png",
    "name": "Martis",
    "role": "Fighter",
    "lane": "EXP",
    "damageType": "Magic",
    "difficulty": "Medium",
    "color": "#f97316",
    "avatarBg": "linear-gradient(135deg, #c2410c, #ea580c)",
    "skills": {
      "passive": {
        "name": "Ashura's Wrath",
        "tag": "Passive • Fighter Synergy",
        "desc": "Each time Martis uses a skill, his Attack Speed will be increased by 30%, 120% maximum. Lasts 4s. He gains (+6*Hero Level) extra Attack at full stacks.",
        "counterTip": "Track Martis's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Ashura Aura",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Martis draws enemies to a fan-shaped area in front of him and deals 350( +130% Extra Physical Attack) (Physical Damage), slowing them by 40% for 2s.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Mortal Coil",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Martis strikes in the target direction three times, each time dealing 225( +120% Extra Physical Attack) (Physical Damage) to enemies hit. Enemies hit by the first and third strike are also knocked back. The attack direction can be changed once using the Joystick. (Use Again): Martis leaps in the target direction, dealing 300( +150% Extra Physical Attack) (Physical Damage) to enemies in his path and knocking them airborne. Martis gains Control Immunity and 60% Damage Reduction when casting this skill.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Decimation",
        "tag": "Ultimate • High Impact",
        "desc": "Martis lunges at a designated enemy hero, dealing 800( +100% Total Physical Attack) (Physical Damage) (deals True Damage if the enemy's HP is below 50%). If the enemy is killed by this skill, Martis can cast the skill again within 10s and gains 100% extra Movement Speed that gradually decays over 5s. Each successive cast also increases the skill's damage by 15% (up to 30%).",
        "counterTip": "Respect Martis's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Fighter Carry",
      "Magic Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "alucard",
        "reason": "Sustained frontline presence out-trades in close quarter duels."
      },
      {
        "heroId": "zilong",
        "reason": "Absorbs initial charge and overpowers in prolonged trades."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dominance_ice",
        "tier": "S",
        "reason": "Dominance Ice cuts lifesteal and shield regeneration by 50%."
      },
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Constant knockbacks and slow firewall kite Martis endlessly."
      },
      {
        "heroId": "baxia",
        "tier": "A",
        "reason": "Inherent anti-heal passive and mobility neutralize sustain."
      }
    ],
    "avoidPicks": [
      "valir",
      "karrie",
      "baxia"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Martis's core kit advantage.",
      "Watch for Martis's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Martis during key objective contests."
    ],
    "secondaryLane": "Jungle"
  },
  {
    "id": "valir",
    "avatar": "assets/heroes/valir.png",
    "name": "Valir",
    "role": "Mage",
    "lane": "Mid",
    "secondaryLane": "Roam",
    "damageType": "Magic",
    "difficulty": "Medium",
    "color": "#ea580c",
    "avatarBg": "linear-gradient(135deg, #9a3412, #f97316)",
    "skills": {
      "passive": {
        "name": "Ashing",
        "tag": "Passive • Stun & % HP Explosion",
        "desc": "Valir’s skills ignite enemies. At 3 stacks, the blaze detonates, dealing 8% Max HP magic damage and stunning the target for 1s.",
        "counterTip": "Radiant Armor is essential against his multi-tick burn; Sprint or Purify prevents the slow and stun chain."
      },
      "skill1": {
        "name": "Burst Fireball",
        "tag": "Skill 1 • Fireball Reset on Hit",
        "desc": "Valir casts a fireball that explodes on hit, slowing by 30%. Hitting an enemy hero resets the fireball charge immediately.",
        "counterTip": "Sidestep his fireball; if he misses an enemy hero, his charge goes on a lengthy cooldown."
      },
      "skill2": {
        "name": "Searing Torrent",
        "tag": "Skill 2 • Knockback Fire Wave",
        "desc": "Valir unleashes a torrent of flames forward, knocking back all approaching enemies and leaving a slow zone.",
        "counterTip": "Short-range melee assassins should bait Searing Torrent before committing their gap closer."
      },
      "ultimate": {
        "name": "Vengeance Flame",
        "tag": "Ultimate • Built-in Purify & Skill Boost",
        "desc": "Valir removes all CC on himself, increases movement speed by 50%, and empowers Skill 1 and Skill 2 range and damage for 9s.",
        "counterTip": "Do not engage immediately when his Vengeance Flame is ignited; wait for the 9s buff window to expire."
      }
    },
    "tags": [
      "Anti-Melee Kiting King",
      "Built-in Purify Ult",
      "Infinite Stun Fireballs"
    ],
    "powerSpikes": {
      "early": 5,
      "mid": 5,
      "late": 4
    },
    "counters": [
      {
        "heroId": "dyrroth",
        "reason": "Pushes Dyrroth back with Searing Torrent and stuns him from outside melee range."
      },
      {
        "heroId": "baxia",
        "reason": "Interrupts Baxia rolling shield with fireballs and knocks him away."
      },
      {
        "heroId": "khufra",
        "reason": "Interrupts Khufra Tyrant’s Revenge charge and Bouncing Ball."
      },
      {
        "heroId": "terizla",
        "reason": "Kites Terizla slow hammer slams effortlessly with continuous slows and stuns."
      },
      {
        "heroId": "tigreal",
        "reason": "Knocks Tigreal back and purifies his Implosion with Vengeance Flame."
      }
    ],
    "counteredBy": [
      {
        "heroId": "pharsa",
        "tier": "S",
        "reason": "Pharsa outranges Valir by a mile; bombs him from safety."
      },
      {
        "heroId": "yve",
        "tier": "S",
        "reason": "Yve galactic grid out-ranges Valir and slows him down."
      },
      {
        "heroId": "hayabusa",
        "tier": "A",
        "reason": "Shadow dive burst deletes Valir without needing to walk in frontally."
      },
      {
        "heroId": "ling",
        "tier": "A",
        "reason": "Leaps from walls onto Valir head before Valir can push."
      }
    ],
    "avoidPicks": [
      "dyrroth",
      "baxia",
      "khufra",
      "terizla",
      "tigreal"
    ],
    "recommendedSpell": "Sprint / Flicker",
    "counterItems": [
      "RADIANT_ARMOR",
      "ATHENAS_SHIELD"
    ],
    "tacticalTips": [
      "Valir is the ultimate counter to short-range melee fighters and tanks. He makes it impossible for them to engage.",
      "Valir’s ultimate acts as a built-in Purify, removing all CC. Do not try to lock him down with single CC."
    ]
  },
  {
    "id": "helcurt",
    "avatar": "assets/heroes/helcurt.png",
    "name": "Helcurt",
    "role": "Assassin",
    "lane": "Jungle",
    "damageType": "Physical",
    "difficulty": "Medium",
    "color": "#38bdf8",
    "avatarBg": "linear-gradient(135deg, #0284c7, #38bdf8)",
    "skills": {
      "passive": {
        "name": "Race Advantage",
        "tag": "Passive • Assassin Synergy",
        "desc": "Enemy heroes who inflict control effects on Helcurt will be silenced for 1.5s. Cooldown: 4s.",
        "counterTip": "Track Helcurt's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Shadow Transition",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Helcurt blinks to the target location, dealing 150( +70% Total Physical Attack) (Physical Damage) to enemies hit and slowing them by 90% (decays over 1.5s). Hitting an enemy hero or creep with this skill grants Helcurt 1 (Deadly Stinger). (Dark Night Falls): Enemies hit are also silenced for 1.5s.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Deadly Stinger",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "(Passive): Each Basic Attack grants 1 (Deadly Stinger). Up to 5 stingers can be stored for 8s, after which the number of stingers will decrease over time. (Active): Helcurt fires all (Deadly Stingers) in the target direction, each dealing 180( +80% Extra Physical Attack) (Physical Damage) to enemies (Minions and Creeps only take 70% of the damage) and slowing them by 8% for 3s (the slow effect can stack). (Deadly Stinger) counts as a Basic Attack, but it cannot Crit.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Dark Night Falls",
        "tag": "Ultimate • High Impact",
        "desc": "Helcurt summons the (Dark Night), greatly reducing all enemy heroes' sight range for 3.5s. He also gains 10% extra Attack Speed and 65% extra Movement Speed for 8s and 1 (Deadly Stinger). The number of Stingers won't drop during the night. (Dark Night Falls) has no effect on enemy Helcurt. (Passive): Helcurt's Attack Speed is increased by 10%.",
        "counterTip": "Respect Helcurt's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Assassin Carry",
      "Physical Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 4,
      "mid": 5,
      "late": 3
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "Rapid mobility bridges distance and eliminates isolated targets."
      },
      {
        "heroId": "gord",
        "reason": "Blinks past Gord stuns and deletes during channel."
      }
    ],
    "counteredBy": [
      {
        "heroId": "khufra",
        "tier": "S",
        "reason": "Bouncing Ball cancels dash abilities and grounds momentum."
      },
      {
        "heroId": "franco",
        "tier": "S",
        "reason": "Suppression ultimate cannot be purified and locks Helcurt down."
      },
      {
        "heroId": "antique_cuirass",
        "tier": "A",
        "reason": "Reduces skill damage scaling by 12% across multi-hit combos."
      }
    ],
    "avoidPicks": [
      "khufra",
      "franco",
      "minsitthar"
    ],
    "recommendedSpell": "Retribution",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Helcurt's core kit advantage.",
      "Watch for Helcurt's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Helcurt during key objective contests."
    ]
  },
  {
    "id": "pharsa",
    "avatar": "assets/heroes/pharsa.png",
    "name": "Pharsa",
    "role": "Mage",
    "lane": "Mid",
    "damageType": "Magic",
    "difficulty": "Medium",
    "color": "#a855f7",
    "avatarBg": "linear-gradient(135deg, #581c87, #a855f7)",
    "skills": {
      "passive": {
        "name": "Spiritual Unity",
        "tag": "Passive • Verri Magic Strike",
        "desc": "Every 10s, her bird companion Verri strikes the enemy Pharsa attacks, dealing extra magic damage and slowing them by 60%.",
        "counterTip": "Her first poke trade has burst slow; do not take free hits from Verri."
      },
      "skill1": {
        "name": "Curse of Crow",
        "tag": "Skill 1 • Magic Mark & Stun",
        "desc": "Pharsa casts spell at target area, applying a curse mark. Subsequent damage from Pharsa stuns marked enemies for 1s.",
        "counterTip": "Cleanse the curse mark or stay back until the mark expires so she cannot stun you."
      },
      "skill2": {
        "name": "Energy Impact",
        "tag": "Skill 2 • Linear Burst",
        "desc": "Pharsa releases magic energy in a line, dealing high magic damage to all enemies hit.",
        "counterTip": "Avoid lining up in corridors where Energy Impact hits multiple targets."
      },
      "ultimate": {
        "name": "Feathered Air Strike",
        "tag": "Ultimate • Long-Range Artillery Bombardment",
        "desc": "Pharsa soars in place and fires up to 4 massive air bombardments at long range over 8s, dealing devastating magic damage.",
        "counterTip": "Pharsa is completely stationary during her ultimate. Flank her with assassins (Fanny, Ling, Saber, Helcurt) or use Athena’s Shield."
      }
    },
    "tags": [
      "Artillery Air Strike",
      "High Ground Defense",
      "Bird Form Roam"
    ],
    "powerSpikes": {
      "early": 4,
      "mid": 5,
      "late": 4
    },
    "counters": [
      {
        "heroId": "estes",
        "reason": "Feathered Air Strike blankets the entire Estes healing circle with massive magic bombardment."
      },
      {
        "heroId": "layla",
        "reason": "Blasts immobile marksmen from completely outside their vision range."
      }
    ],
    "counteredBy": [
      {
        "heroId": "yu_zhong",
        "tier": "S",
        "reason": "Black Dragon Form flies over walls and knocks Pharsa out of her ultimate."
      },
      {
        "heroId": "ling",
        "tier": "S",
        "reason": "Leaps from walls directly into Pharsa artillery circle and assassinates her."
      },
      {
        "heroId": "chou",
        "tier": "S",
        "reason": "Flicker Shunpo kick cancels Pharsa ultimate immediately."
      },
      {
        "heroId": "franco",
        "tier": "A",
        "reason": "Hooks Pharsa while she is rooted in place casting Feathered Air Strike."
      },
      {
        "heroId": "kadita",
        "tier": "A",
        "reason": "Swims in with Ocean Oddity and bursts Pharsa instantly."
      }
    ],
    "avoidPicks": [
      "estes",
      "layla",
      "miya"
    ],
    "recommendedSpell": "Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "WINTER_CROWN"
    ],
    "tacticalTips": [
      "Pharsa is completely stationary while casting Feathered Air Strike. Target her immediately with long-range hooks or dive assassins.",
      "Pick Athena’s Shield to absorb the initial burst blast from her air strike."
    ]
  },
  {
    "id": "zhask",
    "avatar": "assets/heroes/zhask.png",
    "name": "Zhask",
    "role": "Mage",
    "lane": "Mid",
    "damageType": "Magic",
    "difficulty": "Medium",
    "color": "#c084fc",
    "avatarBg": "linear-gradient(135deg, #7e22ce, #c084fc)",
    "skills": {
      "passive": {
        "name": "Decimation",
        "tag": "Passive • Mage Synergy",
        "desc": "Upon death, Zhask summons a frenzied (Nightmaric Spawn) on the spot, which gradually loses HP over time until death.",
        "counterTip": "Track Zhask's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Nightmaric Spawn",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Zhask summons a (Nightmaric Spawn) that gains 50% of his Attributes plus an additional 20 (Magic Power). (Nightmaric Spawn) will automatically attack nearby enemies, each attack dealing 120 (+(120% Magic Power)) (Magic Damage). After every 3 attacks, it fires a (Death Ray) at the target, dealing 90 (+(15% Magic Power)) (Magic Damage) and slowing them by up to 60% for 0.6s. If Zhask is too far away from (Nightmaric Spawn), it will disappear. (Death Ray) is considered a Basic Attack but cannot Crit. (Fusion Enhanced): The damage of (Nightmaric Spawn) is increased to 200%, and it can be repositioned.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Mind Eater",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Zhask fires a penetrating psychic beam in the designated direction, dealing 300( +100% Total Magic Power) (Magic Damage) to enemies along the way. (Nightmaric Spawn) will also cast (Mind Eater) at the same location. If an enemy is hit by both beams, they will be stunned for 0.5s. (Fusion Enhanced): The damage of Zhask and (Nightmaric Spawn) is fused together, dealing 540( +180% Total Magic Power) (Magic Damage).",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Hive Clones",
        "tag": "Ultimate • High Impact",
        "desc": "Zhask releases a swarm of (Hive Clones) in the targeted direction. The clones will explode and deal 110( +35% Total Magic Power) (Magic Damage) to enemies on contact, reducing their Movement Speed by 80% for 1s. If (Hive Clones) find no target, they will burrow into the ground and ambush enemies passing by. (Fusion Enhanced): Zhask releases several swarms of (Hive Clones). Subsequent damage dealt to the same target decays to 20%.",
        "counterTip": "Respect Zhask's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Mage Carry",
      "Magic Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "High burst combo deletes squishy immobile marksmen instantly."
      },
      {
        "heroId": "miya",
        "reason": "AoE magic damage out-bursts Miya in early/mid game teamfights."
      }
    ],
    "counteredBy": [
      {
        "heroId": "athenas_shield",
        "tier": "S",
        "reason": "Athena’s Shield absorbs 25% of magic burst, preventing one-shots."
      },
      {
        "heroId": "ling",
        "tier": "S",
        "reason": "Ling wall-jumping bypasses ground skillshots and dives Zhask effortlessly."
      },
      {
        "heroId": "saber",
        "tier": "A",
        "reason": "Airborne lock prevents Zhask from casting defensive spells."
      }
    ],
    "avoidPicks": [
      "ling",
      "fanny",
      "saber"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Zhask's core kit advantage.",
      "Watch for Zhask's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Zhask during key objective contests."
    ]
  },
  {
    "id": "diggie",
    "avatar": "assets/heroes/diggie.png",
    "name": "Diggie",
    "role": "Support",
    "lane": "Roam",
    "damageType": "Magic",
    "difficulty": "Medium",
    "color": "#eab308",
    "avatarBg": "linear-gradient(135deg, #a16207, #eab308)",
    "skills": {
      "passive": {
        "name": "Young Again",
        "tag": "Passive • Egg Form Vision & Taunts",
        "desc": "Upon death, Diggie transforms into an egg, gaining new skills and moving freely without taking damage. Resurrects at the egg’s current position.",
        "counterTip": "Do not reveal your recall position near Diggie’s egg; he provides free vision to his entire team."
      },
      "skill1": {
        "name": "Auto Alarm Bomb",
        "tag": "Skill 1 • Chasing Nest Bombs",
        "desc": "Diggie throws an owl alarm bomb that stays in bushes. When an enemy approaches, the bomb chases and explodes, dealing magic damage.",
        "counterTip": "Do not blindly face-check bushes where multiple Diggie bombs can instantly one-shot squishy heroes."
      },
      "skill2": {
        "name": "Reverse Time",
        "tag": "Skill 2 • Tether Snapback Pull",
        "desc": "Diggie tethers an enemy hero. After 4s, the target is pulled back to the center of the tether and slowed by 80%.",
        "counterTip": "Use Purify or sprint out of the tether radius to break the leash before the pull activates."
      },
      "ultimate": {
        "name": "Time Journey",
        "tag": "Ultimate • Teamwide CC Immunity & Shield",
        "desc": "Diggie grants all surrounding allied heroes complete Crowd Control immunity and a massive 650–1050 point shield for 3s.",
        "counterTip": "Hard counters heavy setter tanks (Atlas, Tigreal, Guinevere). Bait Time Journey before committing teamfight combo ultimates."
      }
    },
    "tags": [
      "Universal CC Cleanse",
      "Alarm Owl Bombs",
      "Wombo-Combo Ruiner"
    ],
    "powerSpikes": {
      "early": 4,
      "mid": 5,
      "late": 5
    },
    "counters": [
      {
        "heroId": "tigreal",
        "reason": "Time Journey cleanses Tigreal Implosion completely and gives entire team giant shields."
      },
      {
        "heroId": "atlas",
        "reason": "Time Journey completely nullifies Atlas Fatal Links ultimate."
      },
      {
        "heroId": "kadita",
        "reason": "Cleanses Kadita knockup and shields team against Rough Waves."
      },
      {
        "heroId": "terizla",
        "reason": "Cleanses Terizla Penalty Zone chains."
      }
    ],
    "counteredBy": [
      {
        "heroId": "franco",
        "tier": "S",
        "reason": "Suppression CANNOT be cleansed by Diggie ultimate. Franco hook + suppress still works."
      },
      {
        "heroId": "chou",
        "tier": "A",
        "reason": "Chou can bait out Diggie ultimate and kick priority target afterwards."
      },
      {
        "heroId": "esmeralda",
        "tier": "A",
        "reason": "Esmeralda absorbs the massive shields Diggie grants to his allies."
      }
    ],
    "avoidPicks": [
      "tigreal",
      "atlas",
      "terizla",
      "kadita"
    ],
    "recommendedSpell": "Flicker / Revitalize",
    "counterItems": [
      "DOMINANCE_ICE",
      "ATHENAS_SHIELD"
    ],
    "tacticalTips": [
      "Diggie is the single highest priority counter against heavy crowd control and setter tanks (Atlas/Tigreal).",
      "Never trigger your setter ultimate (Atlas/Tigreal) before baiting out Diggie’s Time Journey first.",
      "Diggie cannot cleanse Suppression (Franco/Kaja)."
    ]
  },
  {
    "id": "hylos",
    "avatar": "assets/heroes/hylos.png",
    "name": "Hylos",
    "role": "Tank",
    "lane": "Roam",
    "damageType": "Magic",
    "difficulty": "Easy",
    "color": "#10b981",
    "avatarBg": "linear-gradient(135deg, #047857, #10b981)",
    "skills": {
      "passive": {
        "name": "Thickened Blood",
        "tag": "Passive • Tank Synergy",
        "desc": "Hylos gains 1.5 extra Max HP for every 1 extra Max Mana he possesses. When out of Mana, Hylos can use his HP for skill casts.",
        "counterTip": "Track Hylos's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Law and Order",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Hylos gains 50% Movement Speed and causes his next Basic Attack within 3s to deal 300( +80% Total Magic Power) (Magic Damage) to the target, and knock back and stun them for 1s. [C8This damage counts as Skill Damage.] [C8The extra Movement Speed rapidly decays over the duration and ends after the next Basic Attack.]",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Ring of Punishment",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Hylos releases the (Ring of Punishment), dealing 100( +20% Total Magic Power) (Magic Damage) to nearby enemies per second while slowing them by 4% and reducing their Attack Speed by 7.5% for 2.5s (up to 8 stacks). Each stack also increases the enemy's damage taken from the (Ring of Punishment) by 5%. The (Ring of Punishment) consumes 30 Mana per second when it's active. (Use Again): Hylos cancels the (Ring of Punishment).",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Glorious Pathway",
        "tag": "Ultimate • High Impact",
        "desc": "Hylos creates a huge pathway in the target direction, reducing enemies' Movement Speed by 75% for 1s. The pathway lasts 6s. When on the pathway, Hylos gains Slow Immunity and recovers 3% of his Max HP per second. Allied heroes moving along the pathway gain 60% extra Movement Speed, while enemy heroes on the pathway will be slowed by 25%.",
        "counterTip": "Respect Hylos's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Tank Carry",
      "Magic Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "Frontline crowd control locks down squishy carries."
      },
      {
        "heroId": "miya",
        "reason": "Heavy armor and taunts/stuns disrupt basic attack rhythm."
      }
    ],
    "counteredBy": [
      {
        "heroId": "karrie",
        "tier": "S",
        "reason": "Lightwheel True Damage completely bypasses high armor and magic defense."
      },
      {
        "heroId": "lunox",
        "tier": "S",
        "reason": "Chaos magic penetration shreds % Max HP frontliners."
      },
      {
        "heroId": "demon_hunter_sword",
        "tier": "A",
        "reason": "DHS passive deals 8% current HP on every basic attack."
      }
    ],
    "avoidPicks": [
      "karrie",
      "lunox",
      "claude"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Hylos's core kit advantage.",
      "Watch for Hylos's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Hylos during key objective contests."
    ],
    "secondaryLane": "Jungle"
  },
  {
    "id": "harley",
    "avatar": "assets/heroes/harley.png",
    "name": "Harley",
    "role": "Assassin",
    "lane": "Jungle",
    "damageType": "Physical",
    "difficulty": "Hard",
    "color": "#38bdf8",
    "avatarBg": "linear-gradient(135deg, #0284c7, #38bdf8)",
    "skills": {
      "passive": {
        "name": "Magic Master",
        "tag": "Passive • Assassin Synergy",
        "desc": "Harley's mastery of magic allows his Basic Attacks and skills to reduce the enemy's Magic Defense by 2 and increase his Attack Speed by 5%-10% (scales with level) for 3s on hit. This effect stacks up to 10 times. Harley's Basic Attacks deal 60( +50% Total Physical Attack) (+60% Total Magic Power) (Magic Damage).",
        "counterTip": "Track Harley's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Poker Trick",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Harley throws 3 waves of cards (3 cards per wave), with each card dealing 130( +25% Total Magic Power) (Magic Damage) to enemies. After the same target is hit 3 times, the damage will decay to 50% on subsequent hits.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Space Escape",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Harley blinks in the designated direction, leaving a magic hat at his starting location and increasing his Movement Speed by 60% for 2s. (Use Again): Use again within 4s to return to the hat's location and cancel the Movement Speed effect.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Deadly Magic",
        "tag": "Ultimate • High Impact",
        "desc": "Harley casts a magic ring of fire at an enemy hero, dealing 200( +60% Total Magic Power) (Magic Damage) and slowing them by 40% for 1.5s. The ring will stay around the target, during which Harley can hit the ring to damage the target. The ring will explode after 4s, dealing (Magic Damage) equal to 200( +50% Total Magic Power) plus 30% of the damage taken by the target while the ring was active. [C8The ring of fire can be blocked by other enemy heroes before it reaches its target.]",
        "counterTip": "Respect Harley's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Assassin Carry",
      "Physical Damage",
      "High Skill Ceiling"
    ],
    "powerSpikes": {
      "early": 4,
      "mid": 5,
      "late": 3
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "Rapid mobility bridges distance and eliminates isolated targets."
      },
      {
        "heroId": "gord",
        "reason": "Blinks past Gord stuns and deletes during channel."
      }
    ],
    "counteredBy": [
      {
        "heroId": "khufra",
        "tier": "S",
        "reason": "Bouncing Ball cancels dash abilities and grounds momentum."
      },
      {
        "heroId": "franco",
        "tier": "S",
        "reason": "Suppression ultimate cannot be purified and locks Harley down."
      },
      {
        "heroId": "antique_cuirass",
        "tier": "A",
        "reason": "Reduces skill damage scaling by 12% across multi-hit combos."
      }
    ],
    "avoidPicks": [
      "khufra",
      "franco",
      "minsitthar"
    ],
    "recommendedSpell": "Retribution",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Harley's core kit advantage.",
      "Watch for Harley's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Harley during key objective contests."
    ],
    "secondaryLane": "Mid"
  },
  {
    "id": "irithel",
    "avatar": "assets/heroes/irithel.png",
    "name": "Irithel",
    "role": "Marksman",
    "lane": "Gold",
    "damageType": "Physical",
    "difficulty": "Medium",
    "color": "#fbbf24",
    "avatarBg": "linear-gradient(135deg, #d97706, #f59e0b)",
    "skills": {
      "passive": {
        "name": "Jungle Heart",
        "tag": "Passive • Marksman Synergy",
        "desc": "Irithel and Leo's immaculate teamwork allows her to shoot while moving. Each Basic Attack will shoot 2 crossbow bolt(s) (but takes longer to refill) that deal ( +55% Total Physical Attack) (Physical Damage) per bolt (inherits a portion of Attack Effects). Moving will build up (Jungle Heart), up to a maximum of 10 units, and cause the next Basic Attack to unleash 1 additional bolt(s).",
        "counterTip": "Track Irithel's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Strafe",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Irithel launches a volley of arrows on the target area, dealing 330( +60% Total Physical Attack) (Physical Damage) to enemies within and reducing their Physical Defense by 15 for 3s.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Force of The Queen",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Leo lets out a piercing roar, dealing 200( +60% Total Physical Attack) (Physical Damage) to nearby enemies and slowing them by 40% for 2s.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Heavy Crossbow",
        "tag": "Ultimate • High Impact",
        "desc": "Irithel orders Leo to leap in the target direction and empowers her crossbow for 10s. For the duration, she gains 30 Movement Speed and her Basic Attacks shoot enhanced crossbow bolts, dealing 120( +60% Total Physical Attack) (Physical Damage) to the target and nearby units. (Jungle Heart) also accumulates faster for the duration.",
        "counterTip": "Respect Irithel's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Marksman Carry",
      "Physical Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 2,
      "mid": 4,
      "late": 5
    },
    "counters": [
      {
        "heroId": "tigreal",
        "reason": "Can out-range and kite Tigreal outside his melee engage radius."
      },
      {
        "heroId": "hylos",
        "reason": "High DPS melts Hylos HP pool from safe distance."
      }
    ],
    "counteredBy": [
      {
        "heroId": "saber",
        "tier": "S",
        "reason": "Instant point-and-click lock on airborne deletes Irithel before repositioning."
      },
      {
        "heroId": "blade_armor",
        "tier": "S",
        "reason": "Blade Armor reflects basic attack physical damage right back."
      },
      {
        "heroId": "khufra",
        "tier": "A",
        "reason": "Bouncing Ball and Tyrants Rage halt escape dashes."
      }
    ],
    "avoidPicks": [
      "saber",
      "khufra",
      "fanny"
    ],
    "recommendedSpell": "Flicker / Vengeance",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Irithel's core kit advantage.",
      "Watch for Irithel's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Irithel during key objective contests."
    ]
  },
  {
    "id": "grock",
    "avatar": "assets/heroes/grock.png",
    "name": "Grock",
    "role": "Tank",
    "lane": "Roam",
    "damageType": "Magic",
    "difficulty": "Hard",
    "color": "#10b981",
    "avatarBg": "linear-gradient(135deg, #047857, #10b981)",
    "skills": {
      "passive": {
        "name": "Earthen Force",
        "tag": "Passive • Tank Synergy",
        "desc": "When near a wall or turret, Grock gains 10% Movement Speed, 15 (+8*Hero Level) Physical Defense, and 18 (+4.8*Hero Level) HP Regen. Each point of Grock's extra Physical Attack increases his Physical Defense by 0.5.",
        "counterTip": "Track Grock's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Power of Nature",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Grock charges his weapon with the (Power of Nature) and then launches a powerful sweep, dealing 300( +160% Extra Physical Attack) (Physical Damage) to nearby enemies and slowing them by 40% for 2s. Damage dealt will increase the longer the skill is channeled, up to 250%. Using (Power of Nature) near a wall will grant Control Immunity.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Guardian's Barrier",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Grock conjures a stone wall at the target location, dealing 300( +50% Total Physical Attack) (Physical Damage) to nearby enemies. The stone wall lasts 5s and can block enemies who try to pass through.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Wild Charge",
        "tag": "Ultimate • High Impact",
        "desc": "Grock charges in the target direction, dealing 360( +75% Total Physical Attack) (Physical Damage) to enemies in his path and knocking them airborne. If he hits a wall or turret during the charge, he deals an additional 360( +90% Total Physical Attack) (Physical Damage) to nearby enemies and stuns them for 1.8s.",
        "counterTip": "Respect Grock's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Tank Carry",
      "Magic Damage",
      "High Skill Ceiling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "Frontline crowd control locks down squishy carries."
      },
      {
        "heroId": "miya",
        "reason": "Heavy armor and taunts/stuns disrupt basic attack rhythm."
      }
    ],
    "counteredBy": [
      {
        "heroId": "karrie",
        "tier": "S",
        "reason": "Lightwheel True Damage completely bypasses high armor and magic defense."
      },
      {
        "heroId": "lunox",
        "tier": "S",
        "reason": "Chaos magic penetration shreds % Max HP frontliners."
      },
      {
        "heroId": "demon_hunter_sword",
        "tier": "A",
        "reason": "DHS passive deals 8% current HP on every basic attack."
      }
    ],
    "avoidPicks": [
      "karrie",
      "lunox",
      "claude"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Grock's core kit advantage.",
      "Watch for Grock's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Grock during key objective contests."
    ],
    "secondaryLane": "Jungle"
  },
  {
    "id": "gatotkaca",
    "avatar": "assets/heroes/gatotkaca.png",
    "name": "Gatotkaca",
    "role": "Tank",
    "lane": "Roam",
    "damageType": "Magic",
    "difficulty": "Easy",
    "color": "#10b981",
    "avatarBg": "linear-gradient(135deg, #047857, #10b981)",
    "skills": {
      "passive": {
        "name": "Steel Bones",
        "tag": "Passive • Tank Synergy",
        "desc": "Gatotkaca gains Physical Defense equal to 2% of his lost HP (up to 200). For every 300 damage he takes (calculated before damage reduction), he gains 5 Rage (up to 100). Upon reaching over 25 Rage, Gatotkaca's next Basic Attack becomes enhanced, consuming all Rage to deal extra (Magic Damage) and recover HP. The extra damage scales with his Rage, level, and Magic Power.",
        "counterTip": "Track Gatotkaca's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Blast Iron Fist",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Gatotkaca slams the ground, creating a shattered zone in the target direction while dealing 200( +150% Total Magic Power) (Magic Damage) to enemies within. Enemies in the shattered zone will take 100( +20% Total Magic Power) (Magic Damage) per second and be slowed by 30%.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Unbreakable",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Gatotkaca begins channeling, then sprints in the target direction with a battle cry, forcing enemies on the path to attack him and deal 200( +100% Total Magic Power) (Magic Damage) for 1.5s. The sprint distance scales with the channel time. Canceling the Skill reduces 50% of the remaining Cooldown.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Avatar of the Guardian",
        "tag": "Ultimate • High Impact",
        "desc": "Gatotkaca jumps to the target location, dealing 500( +300% Total Magic Power) (Magic Damage) to nearby enemies and knocking them airborne for 1s. Enemies near the center of the area will be knocked airborne for a longer duration, while enemies on the fringes will be pulled to the center. The camera will move with the skill indicator but won't grant extra sight.",
        "counterTip": "Respect Gatotkaca's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Tank Carry",
      "Magic Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "Frontline crowd control locks down squishy carries."
      },
      {
        "heroId": "miya",
        "reason": "Heavy armor and taunts/stuns disrupt basic attack rhythm."
      }
    ],
    "counteredBy": [
      {
        "heroId": "karrie",
        "tier": "S",
        "reason": "Lightwheel True Damage completely bypasses high armor and magic defense."
      },
      {
        "heroId": "lunox",
        "tier": "S",
        "reason": "Chaos magic penetration shreds % Max HP frontliners."
      },
      {
        "heroId": "demon_hunter_sword",
        "tier": "A",
        "reason": "DHS passive deals 8% current HP on every basic attack."
      }
    ],
    "avoidPicks": [
      "karrie",
      "lunox",
      "claude"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Gatotkaca's core kit advantage.",
      "Watch for Gatotkaca's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Gatotkaca during key objective contests."
    ],
    "secondaryLane": "Jungle"
  },
  {
    "id": "odette",
    "avatar": "assets/heroes/odette.png",
    "name": "Odette",
    "role": "Mage",
    "lane": "Mid",
    "damageType": "Magic",
    "difficulty": "Easy",
    "color": "#c084fc",
    "avatarBg": "linear-gradient(135deg, #7e22ce, #c084fc)",
    "skills": {
      "passive": {
        "name": "Lakeshore Ambience",
        "tag": "Passive • Mage Synergy",
        "desc": "Each skill cast grants extra range on Odette's next Basic Attack within 8s and causes it to bounce between enemies (or an enemy and herself if only one enemy is in range), dealing 144-200( +50% Total Magic Power) (Magic Damage) per hit. Odette's skills will also trigger this effect when hitting an enemy. This effect stacks up to 3 times.",
        "counterTip": "Track Odette's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Avian Authority",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Odette releases a magic swan in the target direction, dealing 300( +150% Total Magic Power) (Magic Damage) to enemies hit and slowing them by 30% for 2s.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Blue Nova",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Odette releases a set of magic energy balls in the target direction, dealing 250( +50% Total Magic Power) (Magic Damage) to the first enemy hit and immobilizing them for 1.5s. After hitting an enemy, another energy ball will split off and attack a nearby enemy (prioritizes enemy heroes), dealing them 250( +50% Total Magic Power) (Magic Damage) and immobilizing them for 1.5s.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Swan Song",
        "tag": "Ultimate • High Impact",
        "desc": "Odette begins to dance, gaining a 1400( +150% Total Magic Power) shield while dealing up to 2400( +900% Total Magic Power) (Magic Damage) to enemies in a large area around her for 5s. The bounce speed and frequency of (Lakeshore Ambience)'s sound wave in the area are also enhanced when the skill is active. Use again while the skill is active to dash in the target direction. [C8The skill is a channeling cast and will be interrupted if Odette is hit by high level control effects (knocked airborne, transformed, etc.) or if she performs another action.]",
        "counterTip": "Respect Odette's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Mage Carry",
      "Magic Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "High burst combo deletes squishy immobile marksmen instantly."
      },
      {
        "heroId": "miya",
        "reason": "AoE magic damage out-bursts Miya in early/mid game teamfights."
      }
    ],
    "counteredBy": [
      {
        "heroId": "athenas_shield",
        "tier": "S",
        "reason": "Athena’s Shield absorbs 25% of magic burst, preventing one-shots."
      },
      {
        "heroId": "ling",
        "tier": "S",
        "reason": "Ling wall-jumping bypasses ground skillshots and dives Odette effortlessly."
      },
      {
        "heroId": "saber",
        "tier": "A",
        "reason": "Airborne lock prevents Odette from casting defensive spells."
      }
    ],
    "avoidPicks": [
      "ling",
      "fanny",
      "saber"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Odette's core kit advantage.",
      "Watch for Odette's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Odette during key objective contests."
    ]
  },
  {
    "id": "lancelot",
    "avatar": "assets/heroes/lancelot.png",
    "name": "Lancelot",
    "role": "Assassin",
    "lane": "Jungle",
    "damageType": "Physical",
    "difficulty": "Medium",
    "color": "#38bdf8",
    "avatarBg": "linear-gradient(135deg, #0284c7, #38bdf8)",
    "skills": {
      "passive": {
        "name": "Soul Cutter",
        "tag": "Passive • Assassin Synergy",
        "desc": "Each time Lancelot charges, his damage is increased by 7.5% for 4s, up to 30%.",
        "counterTip": "Track Lancelot's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Puncture",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Lancelot charges in the target direction, dealing 100( +50% Total Physical Attack) (Physical Damage) to enemies along the way and applying a (Sword Mark) to the first unmarked enemy hit. The (Sword Mark) lasts 5s. If Lancelot successfully applies a (Sword Mark) to an enemy, the cooldown of this skill will reset.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Thorned Rose",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Lancelot strikes in the target direction 3 times, each time dealing 170( +130% Extra Physical Attack) (Physical Damage) to enemies hit (damage is reduced when multiple enemies are hit). He's untargetable and invincible during this process. Enemies in the center of the area take all the 3 hits and are slowed by 20% for 0.5s. The slow effect can stack.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Phantom Execution",
        "tag": "Ultimate • High Impact",
        "desc": "After a short delay, Lancelot performs an executioner's strike in the target direction, dealing 350( +170% Total Physical Attack) (Physical Damage) to enemies hit. He is invincible throughout the process.",
        "counterTip": "Respect Lancelot's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Assassin Carry",
      "Physical Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 4,
      "mid": 5,
      "late": 3
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "Rapid mobility bridges distance and eliminates isolated targets."
      },
      {
        "heroId": "gord",
        "reason": "Blinks past Gord stuns and deletes during channel."
      }
    ],
    "counteredBy": [
      {
        "heroId": "khufra",
        "tier": "S",
        "reason": "Bouncing Ball cancels dash abilities and grounds momentum."
      },
      {
        "heroId": "franco",
        "tier": "S",
        "reason": "Suppression ultimate cannot be purified and locks Lancelot down."
      },
      {
        "heroId": "antique_cuirass",
        "tier": "A",
        "reason": "Reduces skill damage scaling by 12% across multi-hit combos."
      }
    ],
    "avoidPicks": [
      "khufra",
      "franco",
      "minsitthar"
    ],
    "recommendedSpell": "Retribution",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Lancelot's core kit advantage.",
      "Watch for Lancelot's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Lancelot during key objective contests."
    ]
  },
  {
    "id": "argus",
    "avatar": "assets/heroes/argus.png",
    "name": "Argus",
    "role": "Fighter",
    "lane": "EXP",
    "damageType": "Physical",
    "difficulty": "Hard",
    "color": "#f97316",
    "avatarBg": "linear-gradient(135deg, #c2410c, #ea580c)",
    "skills": {
      "passive": {
        "name": "Warmonger",
        "tag": "Passive • Fighter Synergy",
        "desc": "When Argus' Meteoric Sword reaches 100 (Malice Energy), he will launch a (Demonic Slash) with his next Basic Attack, dealing 200( +100% Total Physical Attack) (Physical Damage) and recovering 200( +10% Total Physical Attack) HP. This attack ignores 40% of the target's Physical Defense. Argus' Meteoric Sword gains 5 (Malice Energy) per second, and each of his Basic Attacks grants 10 (Malice Energy) (critical strikes grant an additional 5 energy).",
        "counterTip": "Track Argus's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Demonic Grip",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Argus stretches out a demonic hand in the target direction, dealing 125( +60% Extra Physical Attack) (Physical Damage) to the first enemy hero or Creep hit, stunning them for 0.7s, and pulling him and the target towards each other. If no enemy is hit, Argus pulls himself toward the hand's destination instead. (Use Again): Argus dashes and strikes in the target direction, dealing 175( +100% Extra Physical Attack) (Physical Damage) to enemies along the path.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Meteoric Sword",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "After a short delay, Argus thrusts his Meteoric Sword in the target direction, dealing 300( +100% Total Physical Attack) (Physical Damage) to enemies hit (200% damage against minions) and reducing their Movement Speed by 80% for 0.8s. The delay time will decrease as Argus' Attack Speed increases. Enemy heroes or Creeps hit will be (Cursed) for 4s, during which they will leave a Cursed Trail behind. Argus gains 40% Movement Speed while on a Cursed Trail. Argus' Basic Attacks on (Cursed) targets will grant double (Malice Energy). (Meteoric Sword) damage counts as Basic Attack damage and can trigger Attack Effects.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Eternal Evil",
        "tag": "Ultimate • High Impact",
        "desc": "Argus removes all debuffs on himself (except for Suppression) and enters (Eternal Evil) state, gaining (Death Immunity) for 4s. While in this state, 100% of his damage dealt to enemy heroes will be converted into HP for him once the state ends. Leaving the (Eternal Evil) state also resets enemy Turrets' damage increase against Argus.] (Passive:) Permanently increases the recharge of (Malice Energy) by 4 (per second).",
        "counterTip": "Respect Argus's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Fighter Carry",
      "Physical Damage",
      "High Skill Ceiling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "alucard",
        "reason": "Sustained frontline presence out-trades in close quarter duels."
      },
      {
        "heroId": "zilong",
        "reason": "Absorbs initial charge and overpowers in prolonged trades."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dominance_ice",
        "tier": "S",
        "reason": "Dominance Ice cuts lifesteal and shield regeneration by 50%."
      },
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Constant knockbacks and slow firewall kite Argus endlessly."
      },
      {
        "heroId": "baxia",
        "tier": "A",
        "reason": "Inherent anti-heal passive and mobility neutralize sustain."
      }
    ],
    "avoidPicks": [
      "valir",
      "karrie",
      "baxia"
    ],
    "recommendedSpell": "Flicker / Vengeance",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Argus's core kit advantage.",
      "Watch for Argus's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Argus during key objective contests."
    ],
    "secondaryLane": "Roam"
  },
  {
    "id": "lapu_lapu",
    "avatar": "assets/heroes/lapu_lapu.png",
    "name": "Lapu-Lapu",
    "role": "Fighter",
    "lane": "EXP",
    "damageType": "Physical",
    "difficulty": "Medium",
    "color": "#f97316",
    "avatarBg": "linear-gradient(135deg, #c2410c, #ea580c)",
    "skills": {
      "passive": {
        "name": "Homeland Defender",
        "tag": "Passive • Fighter Synergy",
        "desc": "Lapu-Lapu accumulates 10 (Bravery Blessing) each time he deals damage (halved for damage dealt to non-hero units). When (Bravery Blessing) is full, Lapu-Lapu's next (Basic Attack) will make him dash toward the target, dealing ( +150% Total Physical Attack) (Physical Damage) (cannot Crit) and granting him a shield that absorbs 250 (+65*Hero Level) damage for 2.5s.",
        "counterTip": "Track Lapu-Lapu's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Justice Blades",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Lapu-Lapu releases two boomerangs in the target direction, each boomerang dealing 140( +50% Total Physical Attack) (Physical Damage) to enemies hit on its way out and back. Enemies hit by both boomerangs take 50% damage from the second hit.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Jungle Warrior",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Lapu-Lapu dashes in the target direction, dealing 100( +50% Total Physical Attack) (Physical Damage) to enemies along the way.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Bravest Fighter",
        "tag": "Ultimate • High Impact",
        "desc": "Lapu-Lapu leaps to the target location while combining his twin blades into one, dealing 300( +80% Total Physical Attack) (Physical Damage) to nearby enemies upon landing and slowing them by 60% for 1s. (This skill cannot be interrupted.) Lapu-Lapu gains 3 times the (Bravery Blessing) from this skill and skills in transformed state. For the next 10s, Lapu-Lapu enters (Great Sword) stance and gains enhanced skills, 30 extra Physical & Magic Defense, and his Basic Attack damage is increased to 120%.",
        "counterTip": "Respect Lapu-Lapu's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Fighter Carry",
      "Physical Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "alucard",
        "reason": "Sustained frontline presence out-trades in close quarter duels."
      },
      {
        "heroId": "zilong",
        "reason": "Absorbs initial charge and overpowers in prolonged trades."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dominance_ice",
        "tier": "S",
        "reason": "Dominance Ice cuts lifesteal and shield regeneration by 50%."
      },
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Constant knockbacks and slow firewall kite Lapu-Lapu endlessly."
      },
      {
        "heroId": "baxia",
        "tier": "A",
        "reason": "Inherent anti-heal passive and mobility neutralize sustain."
      }
    ],
    "avoidPicks": [
      "valir",
      "karrie",
      "baxia"
    ],
    "recommendedSpell": "Flicker / Vengeance",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Lapu-Lapu's core kit advantage.",
      "Watch for Lapu-Lapu's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Lapu-Lapu during key objective contests."
    ],
    "secondaryLane": "Roam"
  },
  {
    "id": "roger",
    "avatar": "assets/heroes/roger.png",
    "name": "Roger",
    "role": "Fighter",
    "lane": "EXP",
    "damageType": "Physical",
    "difficulty": "Medium",
    "color": "#f97316",
    "avatarBg": "linear-gradient(135deg, #c2410c, #ea580c)",
    "skills": {
      "passive": {
        "name": "Full Moon Curse",
        "tag": "Passive • Fighter Synergy",
        "desc": "Roger can freely switch between human and wolf forms. In human form, Roger's Basic Attack and skills deal additional damage equal to 5% of the target's current HP. In wolf form, Roger's Basic Attack and skills deal additional damage equal to 5% of the target's lost HP. This effect can only deal up to 60 additional damage against Creeps.",
        "counterTip": "Track Roger's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Skill 1",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Core attack skill dealing Physical damage.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Open Fire",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Roger fires two quick shots in the target direction, dealing 250( +125% Total Physical Attack) (Physical Damage) in total to the enemy hit. The first shot is a hunter net that slows the enemy by 80% for 1.5s, while the second is a bullet that reduces the enemy's Physical Defense by 10 for 5s.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Hunter's Steps",
        "tag": "Ultimate • High Impact",
        "desc": "Roger gains 20% Movement Speed and 20% Attack Speed for 2.5s.",
        "counterTip": "Respect Roger's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Fighter Carry",
      "Physical Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "alucard",
        "reason": "Sustained frontline presence out-trades in close quarter duels."
      },
      {
        "heroId": "zilong",
        "reason": "Absorbs initial charge and overpowers in prolonged trades."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dominance_ice",
        "tier": "S",
        "reason": "Dominance Ice cuts lifesteal and shield regeneration by 50%."
      },
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Constant knockbacks and slow firewall kite Roger endlessly."
      },
      {
        "heroId": "baxia",
        "tier": "A",
        "reason": "Inherent anti-heal passive and mobility neutralize sustain."
      }
    ],
    "avoidPicks": [
      "valir",
      "karrie",
      "baxia"
    ],
    "recommendedSpell": "Flicker / Vengeance",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Roger's core kit advantage.",
      "Watch for Roger's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Roger during key objective contests."
    ],
    "secondaryLane": "Roam"
  },
  {
    "id": "aurora",
    "avatar": "assets/heroes/aurora.png",
    "name": "Aurora",
    "role": "Mage",
    "lane": "Mid",
    "damageType": "Magic",
    "difficulty": "Easy",
    "color": "#c084fc",
    "avatarBg": "linear-gradient(135deg, #7e22ce, #c084fc)",
    "skills": {
      "passive": {
        "name": "Pride of Ice",
        "tag": "Passive • Mage Synergy",
        "desc": "Upon taking fatal damage, Aurora freezes herself for 1.5s, becoming invincible during this time and gradually recovering 30% Max HP. This effect has a 150s cooldown. Aurora's freeze effects can also affect Turrets.",
        "counterTip": "Track Aurora's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Hailstone Blast",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Aurora summons an icy meteorite to strike at the target location, dealing 350( +90% Total Magic Power) (Magic Damage) and slowing targets hit by 40% for 1s. Afterward, 5 hailstones fall, each dealing 40( +10% Total Magic Power) (Magic Damage).",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Frosty Breeze",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Aurora blows Frosty Breeze in a fan-shaped area in the target direction, dealing 225( +75% Total Magic Power) (Magic Damage) to enemies hit, and creating a frozen area at the far-end of the attack that deals a total of 225( +75% Total Magic Power) (Magic Damage) to enemies in the area and freezes them for 1s.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Frigid Glacier",
        "tag": "Ultimate • High Impact",
        "desc": "Aurora creates a frost path in the target direction, dealing 100( +40% Total Magic Power) (Magic Damage) to enemies in the path and reducing their Movement Speed by 80% for 1.2s. The frost path gradually becomes glaciers that spread until reaching their maximum size and shattering, dealing 600( +150% Total Magic Power) (Magic Damage) to all enemies in the area and freezing targets for 1s. Every 100 Magic Power that Aurora has will increase the freeze duration by 0.2s.",
        "counterTip": "Respect Aurora's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Mage Carry",
      "Magic Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "High burst combo deletes squishy immobile marksmen instantly."
      },
      {
        "heroId": "miya",
        "reason": "AoE magic damage out-bursts Miya in early/mid game teamfights."
      }
    ],
    "counteredBy": [
      {
        "heroId": "athenas_shield",
        "tier": "S",
        "reason": "Athena’s Shield absorbs 25% of magic burst, preventing one-shots."
      },
      {
        "heroId": "ling",
        "tier": "S",
        "reason": "Ling wall-jumping bypasses ground skillshots and dives Aurora effortlessly."
      },
      {
        "heroId": "saber",
        "tier": "A",
        "reason": "Airborne lock prevents Aurora from casting defensive spells."
      }
    ],
    "avoidPicks": [
      "ling",
      "fanny",
      "saber"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Aurora's core kit advantage.",
      "Watch for Aurora's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Aurora during key objective contests."
    ]
  },
  {
    "id": "karrie",
    "avatar": "assets/heroes/karrie.png",
    "name": "Karrie",
    "role": "Marksman",
    "lane": "Gold",
    "damageType": "True Damage",
    "difficulty": "Medium",
    "color": "#14b8a6",
    "avatarBg": "linear-gradient(135deg, #0f766e, #14b8a6)",
    "skills": {
      "passive": {
        "name": "Lightwheel Mark",
        "tag": "Passive • % Max HP True Damage",
        "desc": "Basic attacks and skills add a Lightwheel Mark. At 5 stacks, the mark breaks, dealing 6%–8% of the target’s Max HP as True Damage.",
        "counterTip": "Stacking pure armor is useless against Karrie! Pick high attack-speed slow items like Dominance Ice and burst her down before 5 stacks."
      },
      "skill1": {
        "name": "Spinning Lightwheel",
        "tag": "Skill 1 • Slow Zone",
        "desc": "Karrie releases a spinning flywheel that halts upon hitting an enemy or reaching max distance, dealing continuous damage and slowing by 80%.",
        "counterTip": "Step out of the flywheel zone immediately to prevent rapid stack accumulation."
      },
      "skill2": {
        "name": "Phantom Step",
        "tag": "Skill 2 • Short Dash & Flywheel",
        "desc": "Karrie dashes in a target direction and releases a lightwheel at the nearest enemy, dealing damage and adding a mark stack.",
        "counterTip": "Very short cooldown during ultimate. Use hard CC to lock her down mid-dash."
      },
      "ultimate": {
        "name": "Speedy Lightwheel",
        "tag": "Ultimate • Double Basic Attacks",
        "desc": "Karrie enters Dual Wield state for 6-10s, increasing Movement Speed by 20% and firing two lightwheels with every basic attack.",
        "counterTip": "Disengage when she activates her ultimate; wait out the duration or burst her down with assassin dives."
      }
    },
    "tags": [
      "Tank Shredder",
      "Max HP True Damage",
      "Tank Meta Killer"
    ],
    "powerSpikes": {
      "early": 2,
      "mid": 4,
      "late": 5
    },
    "counters": [
      {
        "heroId": "tigreal",
        "reason": "Passive Lightwheel Mark deals percentage Max HP True Damage to heavy tanks."
      },
      {
        "heroId": "fredrinn",
        "reason": "Fredrinn huge HP pool melts rapidly under Karrie barrage."
      },
      {
        "heroId": "baxia",
        "reason": "Bypasses Baxia damage reduction with true damage."
      },
      {
        "heroId": "belerick",
        "reason": "Melts Belerick health bar despite his high HP pool."
      }
    ],
    "counteredBy": [
      {
        "heroId": "claude",
        "tier": "S",
        "reason": "Claude out-ranges Karrie and can burst her down in teamfights."
      },
      {
        "heroId": "lesley",
        "tier": "S",
        "reason": "Lesley heavily out-ranges Karrie short attack range and pokes her out of lane."
      },
      {
        "heroId": "hayabusa",
        "tier": "A",
        "reason": "Shadow dive burst deletes Karrie before she can stack 5 lightwheels."
      },
      {
        "heroId": "lolita",
        "tier": "A",
        "reason": "Lolita shield absorbs Karrie spinning lightwheel projectile stacks."
      }
    ],
    "avoidPicks": [
      "fredrinn",
      "tigreal",
      "belerick",
      "uranus"
    ],
    "recommendedSpell": "Flicker / Vengeance",
    "counterItems": [
      "BLADE_ARMOR",
      "WIND_OF_NATURE",
      "DOMINANCE_ICE"
    ],
    "tacticalTips": [
      "Karrie has a very short attack range (shorter than most marksmen). Exploit this with long-range poke or assassins.",
      "Do not pick double tank lineups into Karrie, as her passive deals up to 12% Max HP True Damage per trigger."
    ]
  },
  {
    "id": "hilda",
    "avatar": "assets/heroes/hilda.png",
    "name": "Hilda",
    "role": "Fighter",
    "lane": "EXP",
    "damageType": "Physical",
    "difficulty": "Medium",
    "color": "#f97316",
    "avatarBg": "linear-gradient(135deg, #c2410c, #ea580c)",
    "skills": {
      "passive": {
        "name": "Blessing of Wilderness",
        "tag": "Passive • Fighter Synergy",
        "desc": "Hilda regenerates 2% of her max HP per second while in the bush. When entering the bush, she gains a shield equal to 15% of her max HP. After leaving the bush, the shield lasts for 5s. This effect has a 10s cooldown. Hilda's Basic Attack and Skills apply a (Wilderness Mark) on hit, which lasts up to 4s and stacks up to 6. Each stack reduces the target's Physical Defense and Magic Defense by 4%.",
        "counterTip": "Track Hilda's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Combat Ritual",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Hilda activates the runic power of her great axe, increasing her Movement Speed by 60% for 3s and enhancing her next Basic Attack to deal 200( +100% Total Physical Attack) (Physical Damage) and slow the target by 40% for 3s. The attack will also deal 120( +60% Total Physical Attack) (Physical Damage) to enemies behind the target.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Art of Hunting",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Hilda locks onto an enemy target, each time dealing 220( +100% Total Physical Attack) (Physical Damage). Skill can be released 3 times at most. The 2nd attack will deal damage to target's surroundings, and the 3rd attack will knock back the target and surrounding enemies temporarily.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Power of Wildness",
        "tag": "Ultimate • High Impact",
        "desc": "Hilda launches a powerful slash on the target enemy, dealing 600( +250% Extra Physical Attack) (Physical Damage) and stunning them for 0.2s. Nearby enemies also take 60% damage. Each stack of (Wilderness Mark) makes (Power of Wildness) deal 2.5% of the target's Max HP as extra damage. At max stacks, (Power of Wildness) deals 20% of the target's Max HP as extra damage.",
        "counterTip": "Respect Hilda's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Fighter Carry",
      "Physical Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "alucard",
        "reason": "Sustained frontline presence out-trades in close quarter duels."
      },
      {
        "heroId": "zilong",
        "reason": "Absorbs initial charge and overpowers in prolonged trades."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dominance_ice",
        "tier": "S",
        "reason": "Dominance Ice cuts lifesteal and shield regeneration by 50%."
      },
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Constant knockbacks and slow firewall kite Hilda endlessly."
      },
      {
        "heroId": "baxia",
        "tier": "A",
        "reason": "Inherent anti-heal passive and mobility neutralize sustain."
      }
    ],
    "avoidPicks": [
      "valir",
      "karrie",
      "baxia"
    ],
    "recommendedSpell": "Flicker / Vengeance",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Hilda's core kit advantage.",
      "Watch for Hilda's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Hilda during key objective contests."
    ],
    "secondaryLane": "Roam"
  },
  {
    "id": "vexana",
    "avatar": "assets/heroes/vexana.png",
    "name": "Vexana",
    "role": "Mage",
    "lane": "Mid",
    "damageType": "Magic",
    "difficulty": "Easy",
    "color": "#c084fc",
    "avatarBg": "linear-gradient(135deg, #7e22ce, #c084fc)",
    "skills": {
      "passive": {
        "name": "Nether Touch",
        "tag": "Passive • Mage Synergy",
        "desc": "Vexana and the (Eternal Guard) inflict (Nether Curse) on enemies hit. The Curse lasts 5s and will cause the affected enemy to explode upon death, dealing 108-500( +60% Total Magic Power) (Magic Damage) to nearby enemies (base damage scales with level).",
        "counterTip": "Track Vexana's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Deathly Grasp",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Vexana unleashes a (Deathly Grasp) in the target direction, dealing 200( +60% Total Magic Power) (Magic Damage) to enemies in its path. The projectile stops upon hitting an enemy hero, terrifying them and knocking them back, then it explodes, dealing 200( +60% Total Magic Power) (Magic Damage) to nearby enemies and terrifying them for 1s.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Cursed Blast",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Vexana marks the target area with the power of the undead, striking it after a 0.8s delay and dealing 580( +165% Total Magic Power) (Magic Damage) to enemies hit.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Eternal Guard",
        "tag": "Ultimate • High Impact",
        "desc": "Vexana summons an (Eternal Guard) at the target location, dealing 500( +60% Total Magic Power) (Magic Damage) to enemies hit and knocking them airborne for 0.8s. The (Eternal Guard) then joins Vexana in battle for 15s. Each of the Eternal Guard's attacks deals 225( +40% Total Magic Power) plus 5% of the target's Max HP as (Magic Damage) to enemies in a large area.",
        "counterTip": "Respect Vexana's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Mage Carry",
      "Magic Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "High burst combo deletes squishy immobile marksmen instantly."
      },
      {
        "heroId": "miya",
        "reason": "AoE magic damage out-bursts Miya in early/mid game teamfights."
      }
    ],
    "counteredBy": [
      {
        "heroId": "athenas_shield",
        "tier": "S",
        "reason": "Athena’s Shield absorbs 25% of magic burst, preventing one-shots."
      },
      {
        "heroId": "ling",
        "tier": "S",
        "reason": "Ling wall-jumping bypasses ground skillshots and dives Vexana effortlessly."
      },
      {
        "heroId": "saber",
        "tier": "A",
        "reason": "Airborne lock prevents Vexana from casting defensive spells."
      }
    ],
    "avoidPicks": [
      "ling",
      "fanny",
      "saber"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Vexana's core kit advantage.",
      "Watch for Vexana's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Vexana during key objective contests."
    ]
  },
  {
    "id": "johnson",
    "avatar": "assets/heroes/johnson.png",
    "name": "Johnson",
    "role": "Tank",
    "lane": "Roam",
    "damageType": "Magic",
    "difficulty": "Medium",
    "color": "#10b981",
    "avatarBg": "linear-gradient(135deg, #047857, #10b981)",
    "skills": {
      "passive": {
        "name": "Electro Airbag",
        "tag": "Passive • Tank Synergy",
        "desc": "When Johnson's HP drops below 30%, he gains a 300( +700% Total Physical Defense) shield for 10s. Cooldown: 100s.",
        "counterTip": "Track Johnson's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Impact Wrench",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Johnson throws his wrench toward the target location, dealing 120( +220% Total Physical Defense) (Magic Damage) to enemies in its path. Enemies around the landing point are stunned for 0.8s.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Electromagnetic Waves",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Johnson raises his shield, continuously dealing 80( +60% Total Magic Power) (Magic Damage) to enemies in a fan-shaped area in the target direction and slowing them by 20%. Each instance of damage also increases the enemy's subsequent damage taken from the skill by 15% (up to 45%). This damage is increased by 60% against creeps. Johnson can cast Basic Attacks and skills for the duration.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Full Throttle",
        "tag": "Ultimate • High Impact",
        "desc": "Johnson transforms into a car and begins accelerating over time. An allied hero can use (Hop In) when near Johnson to board the car (only 1 allied hero can ride with Johnson). The car will explode upon hitting an enemy hero or obstacle, dealing 300( +160% Total Magic Power)-450( +280% Total Magic Power) (Magic Damage) to nearby enemies, stunning them for 0.5-1s (scales with the car's speed before impact), and creating an electrified zone at the location. The zone continuously deals 60( +20% Total Magic Power) (Magic Damage) and slows enemies within. While in car state, tap (Brake) to stop immediately or hold (Nitrous) to continuously gain speed for up to 5s. Johnson's location will be revealed to the enemy team for 3s when casting this skill. (Passive): Johnson's Physical Defense is increased by 10%.",
        "counterTip": "Respect Johnson's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Tank Carry",
      "Magic Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "Frontline crowd control locks down squishy carries."
      },
      {
        "heroId": "miya",
        "reason": "Heavy armor and taunts/stuns disrupt basic attack rhythm."
      }
    ],
    "counteredBy": [
      {
        "heroId": "karrie",
        "tier": "S",
        "reason": "Lightwheel True Damage completely bypasses high armor and magic defense."
      },
      {
        "heroId": "lunox",
        "tier": "S",
        "reason": "Chaos magic penetration shreds % Max HP frontliners."
      },
      {
        "heroId": "demon_hunter_sword",
        "tier": "A",
        "reason": "DHS passive deals 8% current HP on every basic attack."
      }
    ],
    "avoidPicks": [
      "karrie",
      "lunox",
      "claude"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Johnson's core kit advantage.",
      "Watch for Johnson's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Johnson during key objective contests."
    ],
    "secondaryLane": "Jungle"
  },
  {
    "id": "ruby",
    "avatar": "assets/heroes/ruby.png",
    "name": "Ruby",
    "role": "Fighter",
    "lane": "EXP",
    "secondaryLane": "Roam",
    "damageType": "Physical",
    "difficulty": "Medium",
    "color": "#e11d48",
    "avatarBg": "linear-gradient(135deg, #881337, #e11d48)",
    "skills": {
      "passive": {
        "name": "Be good!",
        "tag": "Passive • Leap & Hybrid Defense",
        "desc": "Ruby leaps a short distance after every skill cast, gaining 9–23 Physical & Magic Defense (stacks up to 3 times). Inherits 115% Spell Vamp.",
        "counterTip": "Anti-heal (Dominance Ice / Sea Halberd) is mandatory to neutralize her massive 115% spell vamp sustain."
      },
      "skill1": {
        "name": "Be good, let's dance!",
        "tag": "Skill 1 • Slash & Shockwave",
        "desc": "Ruby slashes forward, dealing physical damage and launching a shockwave that slows enemies by 40% for 2s.",
        "counterTip": "Sidestep the wave to prevent her gap-closing leap."
      },
      "skill2": {
        "name": "Don't run, Wolf King!",
        "tag": "Skill 2 • Dual Scythe Stun",
        "desc": "Ruby spins her scythe twice, dealing physical damage, pulling enemies slightly, and stunning them for 0.5s.",
        "counterTip": "Do not cluster tightly around Ruby; her short-range stuns interrupt channeling abilities."
      },
      "ultimate": {
        "name": "I'm offended!",
        "tag": "Ultimate • Wide Hook Pull & Stun",
        "desc": "Ruby sweeps her scythe in a wide cone, hooking all caught enemies back to her position and stunning them for 0.5s.",
        "counterTip": "Ruby frequently combos Ultimate + Flicker backward into her tower. Stay alert if she walks forward aggressively."
      }
    },
    "tags": [
      "Spell Vamp Lifesteal",
      "Scythe Hook Pull",
      "Continuous CC Hops"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 5,
      "late": 5
    },
    "counters": [
      {
        "heroId": "paquito",
        "reason": "Constant micro-stuns cancel Paquito rhythm and combos."
      },
      {
        "heroId": "fanny",
        "reason": "Scythe stuns easily interrupt Fanny mid-cable."
      }
    ],
    "counteredBy": [
      {
        "heroId": "baxia",
        "tier": "S",
        "reason": "Baxia built-in anti-heal passive reduces Ruby lifesteal to near zero."
      },
      {
        "heroId": "phoveus",
        "tier": "S",
        "reason": "Ruby hops after every single skill, constantly triggering Phoveus ultimate dive."
      },
      {
        "heroId": "dyrroth",
        "tier": "A",
        "reason": "Burst damage and armor reduction overpowers Ruby early game."
      },
      {
        "heroId": "diggie",
        "tier": "A",
        "reason": "Cleanses I’m Offended scythe hook for the entire team."
      }
    ],
    "avoidPicks": [
      "fanny",
      "paquito"
    ],
    "recommendedSpell": "Flicker",
    "counterItems": [
      "DOMINANCE_ICE",
      "SEA_HALBERD",
      "ANTIQUE_CUIRASS"
    ],
    "tacticalTips": [
      "Anti-heal is MANDATORY against Ruby. Without Dominance Ice / Sea Halberd, she heals from 10% to 100% in one minion wave.",
      "Phoveus hard-counters Ruby because she is forced to jump after every single skill cast."
    ]
  },
  {
    "id": "yi_sun_shin",
    "avatar": "assets/heroes/yi_sun_shin.png",
    "name": "Yi Sun-shin",
    "role": "Assassin",
    "lane": "Jungle",
    "damageType": "Physical",
    "difficulty": "Hard",
    "color": "#38bdf8",
    "avatarBg": "linear-gradient(135deg, #0284c7, #38bdf8)",
    "skills": {
      "passive": {
        "name": "Heavenly Vow",
        "tag": "Passive • Assassin Synergy",
        "desc": "Yi Sun-shin attacks with his (longbow) or (glaive) according to his distance from the target. (Weapon Mastery): After each weapon swap, the next two attacks will be enhanced. The first attack deals 70%-100% Crit Damage and the second attack deals 55%-70% Crit Damage. Each enhanced attack grants 20% Movement Speed for 1s and reduces the cooldown of (Traceless) by 1s. After every 180s or when Yi Sun-shin respawns, a (Turtle Ship) will spawn at the allied Base. Yi Sun-shin can board the (Turtle Ship), gaining 60% Movement Speed (decays to after s) and enhancing (Traceless).",
        "counterTip": "Track Yi Sun-shin's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Traceless",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Yi Sun-shin dashes forward and slashes with his glaive, dealing 150( +40% Total Physical Attack) (Physical Damage) and becoming immune to control effects for 1s.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Blood Floods",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "(Tap): Yi Sun-shin slashes swiftly with his glaive, dealing 240( +80% Total Physical Attack) (Physical Damage). (Hold): Yi Sun-shin shoots a powerful arrow, dealing 240( +80% Total Physical Attack) (Physical Damage) to the target. The arrow's damage scales with the hold time, up to 200%. This damage decays with the number of enemies hit but can't go below 40%. His Movement Speed is reduced by 20% while holding the skill. Yi Sun-shin gains (Weapon Mastery) immediately when this skill is used.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Mountain Shocker",
        "tag": "Ultimate • High Impact",
        "desc": "(Passive): Increases the damage of (Heavenly Vow's) first enhanced Basic Attack by 10% and second enhanced Basic Attack by 5%. (Active): Yi Sun-shin commands the naval fleet to launch 3 waves of cannon shots on the locations of all enemy heroes, revealing their positions and dealing 150( +50% Total Physical Attack) (Physical Damage) to enemies in the area with each wave. (When a target is hit multiple times by the same wave, a maximum of 150% damage will be dealt.)",
        "counterTip": "Respect Yi Sun-shin's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Assassin Carry",
      "Physical Damage",
      "High Skill Ceiling"
    ],
    "powerSpikes": {
      "early": 4,
      "mid": 5,
      "late": 3
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "Rapid mobility bridges distance and eliminates isolated targets."
      },
      {
        "heroId": "gord",
        "reason": "Blinks past Gord stuns and deletes during channel."
      }
    ],
    "counteredBy": [
      {
        "heroId": "khufra",
        "tier": "S",
        "reason": "Bouncing Ball cancels dash abilities and grounds momentum."
      },
      {
        "heroId": "franco",
        "tier": "S",
        "reason": "Suppression ultimate cannot be purified and locks Yi Sun-shin down."
      },
      {
        "heroId": "antique_cuirass",
        "tier": "A",
        "reason": "Reduces skill damage scaling by 12% across multi-hit combos."
      }
    ],
    "avoidPicks": [
      "khufra",
      "franco",
      "minsitthar"
    ],
    "recommendedSpell": "Retribution",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Yi Sun-shin's core kit advantage.",
      "Watch for Yi Sun-shin's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Yi Sun-shin during key objective contests."
    ],
    "secondaryLane": "Mid"
  },
  {
    "id": "moskov",
    "avatar": "assets/heroes/moskov.png",
    "name": "Moskov",
    "role": "Marksman",
    "lane": "Gold",
    "damageType": "Physical",
    "difficulty": "Medium",
    "color": "#818cf8",
    "avatarBg": "linear-gradient(135deg, #4338ca, #818cf8)",
    "skills": {
      "passive": {
        "name": "Spear of Quiescence",
        "tag": "Passive • Piercing Basic Attacks",
        "desc": "Moskov’s basic attacks pierce through targets, dealing damage to enemies behind them. Each basic attack reduces Skill 1 and Skill 2 cooldown by 0.8s.",
        "counterTip": "Never stand directly behind your frontline tank or minion wave in a straight line."
      },
      "skill1": {
        "name": "Abyss Walker",
        "tag": "Skill 1 • Teleport Dash & Attack Speed",
        "desc": "Moskov teleports to target location, increasing his Attack Speed by 1.15x–1.5x and enhancing attack penetration for 3s.",
        "counterTip": "His attack speed spikes massively after dash; build Blade Armor and Dominance Ice to shut him down."
      },
      "skill2": {
        "name": "Spear of Misery",
        "tag": "Skill 2 • Knockback Wall Stun",
        "desc": "Moskov strikes an enemy with a heavy spear, knocking them back. If knocked into another enemy or terrain/wall, both are stunned for 1.5s.",
        "counterTip": "NEVER stand near walls or terrain obstacles when fighting Moskov; positioning in open space eliminates his stun."
      },
      "ultimate": {
        "name": "Spear of Destruction",
        "tag": "Ultimate • Global Spear & Teleport",
        "desc": "Moskov hurls a spear across the entire map. Upon hitting an enemy hero, deals physical damage, slows, and allows Moskov to cast Shadow Step to teleport directly behind them.",
        "counterTip": "Keep track of the global spear projectile on the minimap and sidestep. Be prepared for his immediate teleport follow-up."
      }
    },
    "tags": [
      "Global Spear Ult",
      "Wall Stun",
      "High Attack Speed Penetration"
    ],
    "powerSpikes": {
      "early": 2,
      "mid": 4,
      "late": 5
    },
    "counters": [
      {
        "heroId": "chou",
        "reason": "Can push away Chou when he dashes in and wall-stun him."
      },
      {
        "heroId": "terizla",
        "reason": "Penetrates and kites Terizla easily with Abyss Walker."
      }
    ],
    "counteredBy": [
      {
        "heroId": "belerick",
        "tier": "S",
        "reason": "Belerick passive reflects Moskov piercing attacks straight back into him."
      },
      {
        "heroId": "lolita",
        "tier": "S",
        "reason": "Lolita shield completely absorbs Moskov basic attacks and his global spear."
      },
      {
        "heroId": "khufra",
        "tier": "A",
        "reason": "Bouncing Ball interrupts Moskov Abyss Walker dash."
      },
      {
        "heroId": "saber",
        "tier": "A",
        "reason": "Point-and-click airborne deletes Moskov from bushes."
      }
    ],
    "avoidPicks": [
      "terizla",
      "uranus",
      "estes"
    ],
    "recommendedSpell": "Inspire / Flicker",
    "counterItems": [
      "BLADE_ARMOR",
      "DOMINANCE_ICE",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Never fight Moskov near walls or jungle chokepoints where he can land Spear of Misery for a 1.5s wall stun.",
      "Blade Armor + Dominance Ice severely cripples his attack speed and lifesteal."
    ]
  },
  {
    "id": "estes",
    "avatar": "assets/heroes/estes.png",
    "name": "Estes",
    "role": "Support",
    "lane": "Roam",
    "damageType": "Magic",
    "difficulty": "Easy",
    "color": "#10b981",
    "avatarBg": "linear-gradient(135deg, #047857, #10b981)",
    "skills": {
      "passive": {
        "name": "Scripture of the Moon Elf",
        "tag": "Passive • Enhanced Rebound Shot",
        "desc": "Slowly recharges scripture energy. At 100 stacks, his next basic attack ricochets among enemies, dealing magic damage and slowing by 60%.",
        "counterTip": "Avoid clumping with low HP allies to prevent bounce damage."
      },
      "skill1": {
        "name": "Moonlight Immersion",
        "tag": "Skill 1 • Linked Single-Target Heal",
        "desc": "Estes links with target ally, instantly healing them and providing continuous HP regen and increased movement speed for 3s.",
        "counterTip": "Dominance Ice, Sea Halberd, and Glowing Wand cut his healing output by 50%."
      },
      "skill2": {
        "name": "Domain of Moon Goddess",
        "tag": "Skill 2 • Slow Ring Barrier",
        "desc": "Estes creates a circular domain of moonlight. Enemies touching the border take magic damage and are slowed by 90%.",
        "counterTip": "Do not walk through the outer ring perimeter to avoid the 90% slow."
      },
      "ultimate": {
        "name": "Blessing of Moon Goddess",
        "tag": "Ultimate • Teamwide Mass Heal",
        "desc": "Estes releases enhanced moonlight around him, continuously healing all nearby allied heroes and himself for 8 seconds.",
        "counterTip": "Baxia and anti-heal items are mandatory! Hard-burst Estes down first before he can sustain his entire team."
      }
    },
    "tags": [
      "Massive Team Heal",
      "Moonlight Immortality",
      "Clustered Deathball"
    ],
    "powerSpikes": {
      "early": 4,
      "mid": 5,
      "late": 4
    },
    "counters": [
      {
        "heroId": "paquito",
        "reason": "Continuous team heals nullify Paquito single-target burst in teamfights."
      },
      {
        "heroId": "chou",
        "reason": "Sustains through Chou pick-off attempts."
      }
    ],
    "counteredBy": [
      {
        "heroId": "baxia",
        "tier": "S",
        "reason": "Baxia rolls in and reduces Estes teamwide healing by up to 75% with Dominance Ice."
      },
      {
        "heroId": "atlas",
        "tier": "S",
        "reason": "Estes forces his team to cluster together; Atlas pulls all 5 for an instant ace."
      },
      {
        "heroId": "pharsa",
        "tier": "S",
        "reason": "Artillery air strike blankets Estes entire healing ring with magic bombs."
      }
    ],
    "avoidPicks": [
      "paquito",
      "saber"
    ],
    "recommendedSpell": "Revitalize / Flicker",
    "counterItems": [
      "DOMINANCE_ICE",
      "SEA_HALBERD",
      "GLOWING_WAND"
    ],
    "tacticalTips": [
      "EVERY single member of your team must build Anti-Heal (Dominance Ice, Sea Halberd, Glowing Wand) against Estes.",
      "Estes forces his team to group tightly together in his healing ring. Pick massive AOE heroes (Atlas, Pharsa) to punish them."
    ]
  },
  {
    "id": "cyclops",
    "avatar": "assets/heroes/cyclops.png",
    "name": "Cyclops",
    "role": "Mage",
    "lane": "Mid",
    "damageType": "Magic",
    "difficulty": "Hard",
    "color": "#c084fc",
    "avatarBg": "linear-gradient(135deg, #7e22ce, #c084fc)",
    "skills": {
      "passive": {
        "name": "Starlit Hourglass",
        "tag": "Passive • Mage Synergy",
        "desc": "Each time Cyclops hits an enemy with his skills, all his skill cooldowns are reduced by 0.5s.",
        "counterTip": "Track Cyclops's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Stardust Shock",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Cyclops casts two Stardust Disks in the target direction, each dealing 275( +60% Total Magic Power) (Magic Damage) to enemies in its path.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Planets Attack",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Cyclops conjures Starlit Spheres around himself while gaining 50% Movement Speed that decays over 2s. The spheres will automatically seek and attack nearby enemies (prioritizes enemy heroes), exploding on collision and dealing 200( +50% Total Magic Power) (Magic Damage) to the enemy. Enemies hit by multiple spheres will take reduced damage after the first hit.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Star Power Lockdown",
        "tag": "Ultimate • High Impact",
        "desc": "Cyclops creates a Planetary Sphere and sends it after the target enemy hero or Creep, dealing 550( +220% Total Magic Power) (Magic Damage) and immobilizing them for 1-2s (increases with travel distance).",
        "counterTip": "Respect Cyclops's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Mage Carry",
      "Magic Damage",
      "High Skill Ceiling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "High burst combo deletes squishy immobile marksmen instantly."
      },
      {
        "heroId": "miya",
        "reason": "AoE magic damage out-bursts Miya in early/mid game teamfights."
      }
    ],
    "counteredBy": [
      {
        "heroId": "athenas_shield",
        "tier": "S",
        "reason": "Athena’s Shield absorbs 25% of magic burst, preventing one-shots."
      },
      {
        "heroId": "ling",
        "tier": "S",
        "reason": "Ling wall-jumping bypasses ground skillshots and dives Cyclops effortlessly."
      },
      {
        "heroId": "saber",
        "tier": "A",
        "reason": "Airborne lock prevents Cyclops from casting defensive spells."
      }
    ],
    "avoidPicks": [
      "ling",
      "fanny",
      "saber"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Cyclops's core kit advantage.",
      "Watch for Cyclops's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Cyclops during key objective contests."
    ]
  },
  {
    "id": "alpha",
    "avatar": "assets/heroes/alpha.png",
    "name": "Alpha",
    "role": "Fighter",
    "lane": "EXP",
    "damageType": "True Damage",
    "difficulty": "Easy",
    "color": "#f97316",
    "avatarBg": "linear-gradient(135deg, #c2410c, #ea580c)",
    "skills": {
      "passive": {
        "name": "Beta, Advance!",
        "tag": "Passive • Fighter Synergy",
        "desc": "When Alpha uses a skill, Beta will be summoned to attack. Enemies that are hit by Beta 2 time(s) will be (Locked On). (Locked On): After Alpha deals damage to the target, Beta will fire a laser at them, dealing 80( +80% Extra Physical Attack) ((+8*Hero Level)) (True Damage) and briefly applying a powerful slow effect.",
        "counterTip": "Track Alpha's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Rotary Impact",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Alpha unleashes an energy wave in the target direction, dealing 100( +90% Extra Physical Attack) (Physical Damage) to enemies in its path and slowing them by 40% for 1s. Beta then strafes enemies along the same path, dealing 60( +30% Extra Physical Attack) (True Damage).",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Force Swing",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "After a short delay, Alpha swings his blade in the target direction, dealing 180( +100% Total Physical Attack) (Physical Damage) to enemies in a fan-shaped area and restoring 40( +30% Extra Physical Attack) HP for each enemy hit. Beta then strafes enemies in the same area, dealing 60( +30% Total Physical Attack) (True Damage).",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Spear of Alpha",
        "tag": "Ultimate • High Impact",
        "desc": "Beta dives to the target location, dealing 100( +20% Extra Physical Attack) (Physical Damage) to enemies hit and stunning them for 1s. Alpha then leaps towards the same location, knocking enemies in his path airborne and carrying them to the landing location. Alpha then slams down, dealing 250( +100% Extra Physical Attack) (Physical Damage) and slowing the enemies by 40% for 1.5s. Beta then attacks the same area 5 times, dealing 15( +30% Extra Physical Attack) (True Damage) each time.",
        "counterTip": "Respect Alpha's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Fighter Carry",
      "True Damage Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "alucard",
        "reason": "Sustained frontline presence out-trades in close quarter duels."
      },
      {
        "heroId": "zilong",
        "reason": "Absorbs initial charge and overpowers in prolonged trades."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dominance_ice",
        "tier": "S",
        "reason": "Dominance Ice cuts lifesteal and shield regeneration by 50%."
      },
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Constant knockbacks and slow firewall kite Alpha endlessly."
      },
      {
        "heroId": "baxia",
        "tier": "A",
        "reason": "Inherent anti-heal passive and mobility neutralize sustain."
      }
    ],
    "avoidPicks": [
      "valir",
      "karrie",
      "baxia"
    ],
    "recommendedSpell": "Vengeance / Flicker",
    "counterItems": [
      "TWILIGHT_ARMOR",
      "GUARDIAN_HELMET",
      "IMMORTALITY"
    ],
    "tacticalTips": [
      "Build Twilight Armor early to dismantle Alpha's core kit advantage.",
      "Watch for Alpha's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Alpha during key objective contests."
    ],
    "secondaryLane": "Jungle"
  },
  {
    "id": "sun",
    "avatar": "assets/heroes/sun.png",
    "name": "Sun",
    "role": "Fighter",
    "lane": "EXP",
    "damageType": "Physical",
    "difficulty": "Easy",
    "color": "#f97316",
    "avatarBg": "linear-gradient(135deg, #c2410c, #ea580c)",
    "skills": {
      "passive": {
        "name": "Swift Exchange",
        "tag": "Passive • Fighter Synergy",
        "desc": "Sun hurls his (Golden Staff) in the target direction, dealing 200( +40% Total Physical Attack) (Physical Damage) to enemies in its path. He conjures a Doppelganger at his location that lasts 5s and inherits 40% of his attributes (and a portion of Attack Effects), conceals himself, and moves with the (Golden Staff). Sun reappears and retrieves the (Golden Staff) when it hits an enemy hero or reaches the maximum range.",
        "counterTip": "Track Sun's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Endless Variety",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Sun hurls his (Golden Staff) in the target direction, dealing 200( +40% Total Physical Attack) (Physical Damage) to enemies in its path. Upon hitting an enemy hero or Creep, or reaching the maximum range, the (Golden Staff) morphs into a Doppelganger that lasts 5s and inherits 40% of Sun's attributes (and a portion of his Attack Effects). (Endless Variety) and (Swift Exchange) are learned and upgraded together and share the same cooldown.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Instantaneous Move",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Sun commands his Doppelgangers to strike at the target enemy with him, dealing 170( +40% Total Physical Attack) (Physical Damage) to the target and enemies behind them. This counts as Basic Attack damage and can trigger Attack Effects but cannot Crit.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Simian God",
        "tag": "Ultimate • High Impact",
        "desc": "Enemies hit by Sun and his Doppelgangers will have their Physical Defense reduced by 4% (stacks up to 10 times). Sun recovers HP equal to 50% of the Doppelganger's Physical Attack each time a Doppelganger deals damage.",
        "counterTip": "Respect Sun's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Fighter Carry",
      "Physical Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "alucard",
        "reason": "Sustained frontline presence out-trades in close quarter duels."
      },
      {
        "heroId": "zilong",
        "reason": "Absorbs initial charge and overpowers in prolonged trades."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dominance_ice",
        "tier": "S",
        "reason": "Dominance Ice cuts lifesteal and shield regeneration by 50%."
      },
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Constant knockbacks and slow firewall kite Sun endlessly."
      },
      {
        "heroId": "baxia",
        "tier": "A",
        "reason": "Inherent anti-heal passive and mobility neutralize sustain."
      }
    ],
    "avoidPicks": [
      "valir",
      "karrie",
      "baxia"
    ],
    "recommendedSpell": "Flicker / Vengeance",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Sun's core kit advantage.",
      "Watch for Sun's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Sun during key objective contests."
    ],
    "secondaryLane": "Roam"
  },
  {
    "id": "gord",
    "avatar": "assets/heroes/gord.png",
    "name": "Gord",
    "role": "Mage",
    "lane": "Mid",
    "damageType": "True Damage",
    "difficulty": "Easy",
    "color": "#c084fc",
    "avatarBg": "linear-gradient(135deg, #7e22ce, #c084fc)",
    "skills": {
      "passive": {
        "name": "Mystic Favor",
        "tag": "Passive • Mage Synergy",
        "desc": "After Gord hits an enemy 4 times with Basic Attacks or skills within a short period of time, the next attack on the target will deal an additional 140( +60% Total Magic Power) (True Damage) and slow them by 20% for 1s (the slow effect stacks up to 2 times).",
        "counterTip": "Track Gord's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Mystic Projectile",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Gord conjures a Mystic Orb that bounces in the target direction and explodes on the first enemy hit, dealing 270( +80% Total Magic Power) (Magic Damage) to enemies in the area, while stunning them and revealing their locations for 1s.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Mystic Injunction",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Gord creates an energy field in the target area, dealing 55( +16% Total Magic Power) (Magic Damage) every 0.3s to enemies within (up to 13 times).",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Mystic Gush",
        "tag": "Ultimate • High Impact",
        "desc": "Gord unleashes an energy beam in the target direction, dealing 110( +32% Total Magic Power) (Magic Damage) to enemies hit every 0.2s (up to 16 times). The direction of the beam can be adjusted using the Joystick.",
        "counterTip": "Respect Gord's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Mage Carry",
      "True Damage Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "High burst combo deletes squishy immobile marksmen instantly."
      },
      {
        "heroId": "miya",
        "reason": "AoE magic damage out-bursts Miya in early/mid game teamfights."
      }
    ],
    "counteredBy": [
      {
        "heroId": "athenas_shield",
        "tier": "S",
        "reason": "Athena’s Shield absorbs 25% of magic burst, preventing one-shots."
      },
      {
        "heroId": "ling",
        "tier": "S",
        "reason": "Ling wall-jumping bypasses ground skillshots and dives Gord effortlessly."
      },
      {
        "heroId": "saber",
        "tier": "A",
        "reason": "Airborne lock prevents Gord from casting defensive spells."
      }
    ],
    "avoidPicks": [
      "ling",
      "fanny",
      "saber"
    ],
    "recommendedSpell": "Vengeance / Flicker",
    "counterItems": [
      "TWILIGHT_ARMOR",
      "GUARDIAN_HELMET",
      "IMMORTALITY"
    ],
    "tacticalTips": [
      "Build Twilight Armor early to dismantle Gord's core kit advantage.",
      "Watch for Gord's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Gord during key objective contests."
    ]
  },
  {
    "id": "natalia",
    "avatar": "assets/heroes/natalia.png",
    "name": "Natalia",
    "role": "Assassin",
    "lane": "Jungle",
    "damageType": "Physical",
    "difficulty": "Very Hard",
    "color": "#38bdf8",
    "avatarBg": "linear-gradient(135deg, #0284c7, #38bdf8)",
    "skills": {
      "passive": {
        "name": "Assassin Instinct",
        "tag": "Passive • Assassin Synergy",
        "desc": "If Natalia stays in a bush without taking damage for 1s, she will enter (Camouflage) state and gain 15% Movement Speed. In this state, Natalia's next Basic Attack will teleport her behind her target and deal 200( +110% Total Physical Attack) (Physical Damage) while silencing the target for 0.25s. Dealing damage, taking damage or using skills will immediately end the (Camouflage) state, but her next Basic Attack will remain enhanced for another 1s. Natalia's base Crit Damage is reduced to 150%, but her damage to Creeps is increased to 150%.",
        "counterTip": "Track Natalia's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Claw Dash",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Natalia dashes in the target direction, dealing 250( +50% Total Physical Attack) (Physical Damage) to enemies in her path. After hitting an enemy, she can cast this skill again within 5s.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Smoke Bomb",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Natalia releases a (Smoke Bomb) at her location, slowing enemies within by 25% while Natalia becomes immune to enemy Basic Attacks for 4s.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "The Hunt",
        "tag": "Ultimate • High Impact",
        "desc": "(Passive): Natalia gains 15% extra Crit Chance. (Active): Natalia immediately enters (Assassin Instinct) state. Natalia can store up to 2 charges of her Ultimate and each charge has a recharge time of 30s. Creep kills will reduce the current remaining recharge time by 50% of the full recharge time.",
        "counterTip": "Respect Natalia's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Assassin Carry",
      "Physical Damage",
      "High Skill Ceiling"
    ],
    "powerSpikes": {
      "early": 4,
      "mid": 5,
      "late": 3
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "Rapid mobility bridges distance and eliminates isolated targets."
      },
      {
        "heroId": "gord",
        "reason": "Blinks past Gord stuns and deletes during channel."
      }
    ],
    "counteredBy": [
      {
        "heroId": "khufra",
        "tier": "S",
        "reason": "Bouncing Ball cancels dash abilities and grounds momentum."
      },
      {
        "heroId": "franco",
        "tier": "S",
        "reason": "Suppression ultimate cannot be purified and locks Natalia down."
      },
      {
        "heroId": "antique_cuirass",
        "tier": "A",
        "reason": "Reduces skill damage scaling by 12% across multi-hit combos."
      }
    ],
    "avoidPicks": [
      "khufra",
      "franco",
      "minsitthar"
    ],
    "recommendedSpell": "Retribution",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Natalia's core kit advantage.",
      "Watch for Natalia's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Natalia during key objective contests."
    ],
    "secondaryLane": "Mid"
  },
  {
    "id": "chou",
    "avatar": "assets/heroes/chou.png",
    "name": "Chou",
    "role": "Fighter",
    "lane": "EXP",
    "secondaryLane": "Roam",
    "damageType": "Physical",
    "difficulty": "Hard",
    "color": "#f97316",
    "avatarBg": "linear-gradient(135deg, #c2410c, #f97316)",
    "skills": {
      "passive": {
        "name": "Only Fast",
        "tag": "Passive • Enhanced Critical Punch & Slow",
        "desc": "After moving 8 yards, Chou’s next basic attack deals 180% damage, inflicts an 80% slow, and gains a shield.",
        "counterTip": "Keep spacing to avoid his opening enhanced punch and slow."
      },
      "skill1": {
        "name": "Jeet Kune Do",
        "tag": "Skill 1 • Triple Strike Knockup",
        "desc": "Chou punches forward 3 times. The 3rd punch knocks airborne all nearby enemies and resets Skill 2 cooldown.",
        "counterTip": "Watch for the 3rd strike animation; use Flicker or CC immunity to avoid the knockup setup."
      },
      "skill2": {
        "name": "Shunpo",
        "tag": "Skill 2 • CC Immune Dash & Shield",
        "desc": "Chou dashes forward, becoming immune to all Crowd Control during the dash, gaining a shield and physical penetration.",
        "counterTip": "Do not cast key CC while he is mid-dash because Shunpo grants complete CC immunity."
      },
      "ultimate": {
        "name": "The Way of Dragon",
        "tag": "Ultimate • Roundhouse Kick & Combo",
        "desc": "Chou roundhouse-kicks target enemy backward, dealing damage. Casting again airborne-strikes the target in mid-air for continuous damage.",
        "counterTip": "Purify can cleanse the initial kick if timed instantly before the second airborne activation."
      }
    },
    "tags": [
      "Displacement God",
      "CC Immunity",
      "High Versatility"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 5,
      "late": 4
    },
    "counters": [
      {
        "heroId": "pharsa",
        "reason": "Easily dashes through feathers and kicks Pharsa out of Feathered Air Strike."
      },
      {
        "heroId": "beatrix",
        "reason": "Kicks Beatrix into ally team or turret before she can shoot."
      },
      {
        "heroId": "yve",
        "reason": "Immune to Yve slows and kicks her out of Real World Manipulation."
      }
    ],
    "counteredBy": [
      {
        "heroId": "paquito",
        "tier": "S",
        "reason": "Paquito out-brawls Chou in 1v1 EXP trades with heavier shields and damage."
      },
      {
        "heroId": "minsitthar",
        "tier": "S",
        "reason": "King’s Calling grounds Chou, disabling Jeet Kune Do and Shunpo dashes completely."
      },
      {
        "heroId": "dyrroth",
        "tier": "A",
        "reason": "Dyrroth armor reduction destroys Chou before Chou can complete full combo."
      },
      {
        "heroId": "diggie",
        "tier": "A",
        "reason": "Time Journey cleanses Chou knockups and gives shields."
      },
      {
        "heroId": "franco",
        "tier": "A",
        "reason": "Suppression interrupts Chou ultimate immediately."
      }
    ],
    "avoidPicks": [
      "pharsa",
      "yve",
      "beatrix"
    ],
    "recommendedSpell": "Flicker",
    "counterItems": [
      "ANTIQUE_CUIRASS",
      "IMMORTALITY",
      "DOMINANCE_ICE"
    ],
    "tacticalTips": [
      "Track Chou Shunpo dash: when Shunpo is on cooldown, he loses his CC immunity and bonus physical penetration.",
      "Purify cannot break The Way of Dragon once you are already airborne, but you can Purify the initial Jeet Kune Do knockup."
    ]
  },
  {
    "id": "lolita",
    "avatar": "assets/heroes/lolita.png",
    "name": "Lolita",
    "role": "Support",
    "lane": "Roam",
    "damageType": "Physical",
    "difficulty": "Medium",
    "color": "#ec4899",
    "avatarBg": "linear-gradient(135deg, #9d174d, #ec4899)",
    "skills": {
      "passive": {
        "name": "Noumenon Energy Core",
        "tag": "Passive • Proximity Team Shield",
        "desc": "Lolita provides surrounding allied heroes with a shield that regenerates every 2.5s (stacks up to 3 times) as long as they stay near her.",
        "counterTip": "Esmeralda hard counters Lolita because Esmeralda absorbs the free shields Lolita gives to her team."
      },
      "skill1": {
        "name": "Charge!",
        "tag": "Skill 1 • Dash & Hammer Stun",
        "desc": "Lolita dashes forward and enhances her next basic attack to dash to an enemy and stun them for 0.8s.",
        "counterTip": "Dodge her short-range point-and-click stun with dash or cc-immunity."
      },
      "skill2": {
        "name": "Guardian's Bulwark",
        "tag": "Skill 2 • Projectile Reflection Shield",
        "desc": "Lolita raises a defensive shield that blocks and reflects all incoming enemy projectile attacks (Wanwan darts, Chang'e lasers, Claude ult, Cyclops balls).",
        "counterTip": "DO NOT FIRE PROJECTILE SKILLS into her blue shield; her shield reflects them straight back into your team!"
      },
      "ultimate": {
        "name": "Noumenon Blast",
        "tag": "Ultimate • Giant Cone Stun Wave",
        "desc": "Lolita channels for 2s, creating a giant cone fan that slows enemies by 75%. Upon release, slams down and stuns enemies for 2s.",
        "counterTip": "Cancel her channeling immediately with any hard CC, or walk out of the cone zone before 2s."
      }
    },
    "tags": [
      "Projectile Deflect Shield",
      "Teamwide Shield Passive",
      "Giant Fan Stun"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 5,
      "late": 5
    },
    "counters": [
      {
        "heroId": "claude",
        "reason": "Guardian’s Bulwark completely blocks Claude entire Blazing Duet ultimate."
      },
      {
        "heroId": "wanwan",
        "reason": "Blocks all Wanwan basic attack darts, preventing her from opening weaknesses."
      },
      {
        "heroId": "moskov",
        "reason": "Blocks Moskov attacks and global spear."
      },
      {
        "heroId": "brody",
        "reason": "Blocks Brody attacks and ultimate missiles."
      }
    ],
    "counteredBy": [
      {
        "heroId": "esmeralda",
        "tier": "S",
        "reason": "Esmeralda feasts on Lolita passive shield and gets free infinite barrier."
      },
      {
        "heroId": "chou",
        "tier": "A",
        "reason": "Chou can flank behind her shield or kick her out of Noumenon Blast charge."
      },
      {
        "heroId": "valir",
        "tier": "A",
        "reason": "Valir ground bursts bypass projectile shield and disrupt her ultimate."
      }
    ],
    "avoidPicks": [
      "claude",
      "wanwan",
      "moskov",
      "brody"
    ],
    "recommendedSpell": "Flicker",
    "counterItems": [
      "DOMINANCE_ICE",
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR"
    ],
    "tacticalTips": [
      "Lolita shield blocks ALL projectiles in MLBB (Claude ult, Wanwan darts, Lesley ult, Harley cards).",
      "Never draft projectile-heavy marksmen into Lolita.",
      "Flank her from behind or use melee heroes; her shield only protects from the front."
    ]
  },
  {
    "id": "freya",
    "avatar": "assets/heroes/freya.png",
    "name": "Freya",
    "role": "Fighter",
    "lane": "EXP",
    "damageType": "Physical",
    "difficulty": "Medium",
    "color": "#f97316",
    "avatarBg": "linear-gradient(135deg, #c2410c, #ea580c)",
    "skills": {
      "passive": {
        "name": "Power of Einherjar",
        "tag": "Passive • Fighter Synergy",
        "desc": "After casting a skill, Freya gains 200% Attack Speed for her next 2 Basic Attacks (this effect can stack up to 6 times). Freya gains 1 stack of (Sacred Orb) on each Basic Attack and can spend (Sacred Orb) stacks to cast (Spirit Combo) consecutively.",
        "counterTip": "Track Freya's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Leap of Faith",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Freya jumps to the target location, dealing 200( +80% Extra Physical Attack) (Physical Damage) to enemies hit and pulling them towards her.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Spirit Combo",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Freya strikes in the target direction, gaining a 60( +70% Extra Physical Attack) shield while dealing 20( +90% Total Physical Attack) (Physical Damage) to enemies hit and slowing them by 30% for 0.5s. Freya can cast this skill again within 3.5s at the cost of 2 stacks of (Sacred Orb). On the (3rd cast), Freya leaps into the air and smashes the area below, dealing 26( +108% Total Physical Attack) (Physical Damage) to enemies within range and knocking them airborne for 0.4s.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Valkyrie Descent",
        "tag": "Ultimate • High Impact",
        "desc": "Freya gains 6 stacks of (Sacred Orb) and enters the (Valkyrie) state, gaining a 600( +180% Total Physical Attack) shield and 30 Physical Attack. Meanwhile, her Basic Attacks become ranged and deal (splash) damage. The (Valkyrie) state lasts for 10s.",
        "counterTip": "Respect Freya's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Fighter Carry",
      "Physical Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "alucard",
        "reason": "Sustained frontline presence out-trades in close quarter duels."
      },
      {
        "heroId": "zilong",
        "reason": "Absorbs initial charge and overpowers in prolonged trades."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dominance_ice",
        "tier": "S",
        "reason": "Dominance Ice cuts lifesteal and shield regeneration by 50%."
      },
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Constant knockbacks and slow firewall kite Freya endlessly."
      },
      {
        "heroId": "baxia",
        "tier": "A",
        "reason": "Inherent anti-heal passive and mobility neutralize sustain."
      }
    ],
    "avoidPicks": [
      "valir",
      "karrie",
      "baxia"
    ],
    "recommendedSpell": "Flicker / Vengeance",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Freya's core kit advantage.",
      "Watch for Freya's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Freya during key objective contests."
    ],
    "secondaryLane": "Roam"
  },
  {
    "id": "hayabusa",
    "avatar": "assets/heroes/hayabusa.png",
    "name": "Hayabusa",
    "role": "Assassin",
    "lane": "Jungle",
    "damageType": "Physical",
    "difficulty": "Hard",
    "color": "#6366f1",
    "avatarBg": "linear-gradient(135deg, #3730a3, #6366f1)",
    "skills": {
      "passive": {
        "name": "Ninjutsu: Trace of Shadow",
        "tag": "Passive • Shadow Stacks",
        "desc": "Hayabusa applies Shadow Marks on hit (up to 4 stacks). Each stack increases Hayabusa’s damage by 5% (up to 20%).",
        "counterTip": "Cleanse stacks with Purify or disengage before he reaches 4 stacks."
      },
      "skill1": {
        "name": "Phantom Shuriken",
        "tag": "Skill 1 • 3-Way Shuriken & Energy",
        "desc": "Hayabusa throws 3 shurikens forward, dealing damage and slowing enemies. Hitting enemies restores energy.",
        "counterTip": "Do not stand at point-blank range where all 3 shurikens hit simultaneously."
      },
      "skill2": {
        "name": "Quad Shadow",
        "tag": "Skill 2 • 4-Way Shadow Teleport",
        "desc": "Hayabusa dashes forward and releases 4 phantom shadows in 4 directions. Casting again teleports him to any shadow location, reducing Skill 1 cooldown.",
        "counterTip": "Watch his shadow locations; avoid positioning near his recall shadows."
      },
      "ultimate": {
        "name": "Ougi: Shadow Kill",
        "tag": "Ultimate • Untargetable Phantom Slashes",
        "desc": "Hayabusa becomes untargetable, dealing rapid slashes to nearby enemies. Prioritizes enemies with highest shadow marks.",
        "counterTip": "Group with minions or ally heroes to split the slashes, or activate Winter Crown / Wind of Nature to take zero damage."
      }
    },
    "tags": [
      "Quad Shadow Teleport",
      "Single-Target Ougi Ult",
      "Unstoppable Split Push"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 5,
      "late": 5
    },
    "counters": [
      {
        "heroId": "beatrix",
        "reason": "Shadow dive into Ougi: Shadow Kill deletes isolated Beatrix with zero retaliation."
      },
      {
        "heroId": "kagura",
        "reason": "Shadows chase Kagura teleports and ultimate finishes her."
      },
      {
        "heroId": "karrie",
        "reason": "One-shots Karrie before she can build lightwheel stacks."
      }
    ],
    "counteredBy": [
      {
        "heroId": "saber",
        "tier": "S",
        "reason": "Instant point-and-click airborne burst kills Hayabusa before he can shadow away."
      },
      {
        "heroId": "khufra",
        "tier": "S",
        "reason": "Bouncing Ball interrupts Ninjutsu: Quad Shadow dashes."
      },
      {
        "heroId": "franco",
        "tier": "A",
        "reason": "Suppression catches Hayabusa when he shadow swaps."
      },
      {
        "heroId": "paquito",
        "tier": "A",
        "reason": "Paquito heavy burst and shield survives Hayabusa ultimate and beats him down."
      }
    ],
    "avoidPicks": [
      "beatrix",
      "kagura",
      "karrie"
    ],
    "recommendedSpell": "Retribution",
    "counterItems": [
      "WIND_OF_NATURE",
      "WINTER_CROWN",
      "ANTIQUE_CUIRASS"
    ],
    "tacticalTips": [
      "Hayabusa ultimate damage splits among all nearby targets. Group up with teammates or stand next to minion waves to dilute his ult damage!",
      "Wind of Nature completely negates all hits of Ougi: Shadow Kill."
    ]
  },
  {
    "id": "kagura",
    "avatar": "assets/heroes/kagura.png",
    "name": "Kagura",
    "role": "Mage",
    "lane": "Mid",
    "damageType": "Magic",
    "difficulty": "Hard",
    "color": "#06b6d4",
    "avatarBg": "linear-gradient(135deg, #0891b2, #06b6d4)",
    "skills": {
      "passive": {
        "name": "Yin Yang Gathering",
        "tag": "Passive • Umbrella Shield & Stun",
        "desc": "When Kagura retrieves her Seimei Umbrella, she gains a 280 shield, stuns surrounding enemies for 0.5s, and slows them by 60%.",
        "counterTip": "Do not stand directly between Kagura and her separated umbrella to avoid getting stunned upon recall."
      },
      "skill1": {
        "name": "Seimei Umbrella Open",
        "tag": "Skill 1 • Umbrella Projection & Vision",
        "desc": "Kagura moves the Seimei Umbrella to a target location, dealing magic damage and slowing enemies by 60%. Reveals bushes.",
        "counterTip": "Watch the umbrella position on the ground; her entire burst combo initiates from that position."
      },
      "skill2": {
        "name": "Rasho Umbrella Flee",
        "tag": "Skill 2 • Purify & Teleport Swap",
        "desc": "With umbrella: cleanses all CC and dashes. Without umbrella: teleports to the umbrella location, dealing magic damage and stunning enemies.",
        "counterTip": "Kagura has a built-in Purify; do not waste key CC spells when she has her umbrella in hand."
      },
      "ultimate": {
        "name": "Yin Yang Overturn",
        "tag": "Ultimate • Dual Shockwave & Vacuum Pull",
        "desc": "With umbrella: knocks back nearby enemies. Without umbrella: pulls all enemies around the umbrella toward the center after 1.5s, dealing lethal magic burst.",
        "counterTip": "Athena’s Shield and Radiant Armor prevent her full 1-3-1-2-3 combo from executing you from 100% to 0%."
      }
    },
    "tags": [
      "Seimei Umbrella Burst",
      "Built-in Purify",
      "Untargetable Escape"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 5,
      "late": 5
    },
    "counters": [
      {
        "heroId": "tigreal",
        "reason": "Built-in Purify on skill 2 dashes freely out of Tigreal Implosion."
      },
      {
        "heroId": "atlas",
        "reason": "Purifies out of Fatal Links and deletes Atlas backline."
      }
    ],
    "counteredBy": [
      {
        "heroId": "hayabusa",
        "tier": "S",
        "reason": "Shadows follow Kagura escapes and Ougi: Shadow Kill deletes her when she throws umbrella."
      },
      {
        "heroId": "chou",
        "tier": "A",
        "reason": "Fast kick combo catches Kagura before she reacts."
      },
      {
        "heroId": "franco",
        "tier": "A",
        "reason": "Suppression cannot be cleansed by Kagura Seimei Umbrella Purify."
      }
    ],
    "avoidPicks": [
      "tigreal",
      "atlas"
    ],
    "recommendedSpell": "Flicker / Flameshot",
    "counterItems": [
      "ATHENAS_SHIELD",
      "WINTER_CROWN"
    ],
    "tacticalTips": [
      "Attack Kagura when her umbrella is thrown away from her body. That is when her defense is lowered and her escape is on cooldown.",
      "Athena’s Shield completely negates her one-shot combo potential."
    ]
  },
  {
    "id": "minotaur",
    "avatar": "assets/heroes/minotaur.png",
    "name": "Minotaur",
    "role": "Tank",
    "lane": "Roam",
    "damageType": "Magic",
    "difficulty": "Medium",
    "color": "#10b981",
    "avatarBg": "linear-gradient(135deg, #047857, #10b981)",
    "skills": {
      "passive": {
        "name": "Rage Incarnate",
        "tag": "Passive • Tank Synergy",
        "desc": "When Minotaur applies a control effect to an enemy hero with a skill, he will also reduce their Hybrid Defense by 5 (+0.5*Hero Level) for 2s. When Minotaur heals an ally hero with a skill, he will also increase their Hybrid Defense by 5 (+0.5*Hero Level) for 2s. These effects are doubled in (Enraged) state.",
        "counterTip": "Track Minotaur's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Despair Stomp",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Minotaur jumps to the target location, dealing 280( +60% Total Physical Attack) (Physical Damage) to enemies in the area and briefly knocking them airborne. Enemies hit will also be slowed by 40% while Minotaur enhances his Basic Attacks to deal ( +3% Total HP) extra (Physical Damage) for 2s. (Enraged): Increases the AOE range and the damage dealt by ( +3% Total HP) (Physical Damage).",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Motivation Roar",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Minotaur motivates himself and nearby allied heroes, restoring 260( +100% Total Magic Power) HP to them and healing himself based on his lost HP. (Enraged): Minotaur gains (Enraged Regen) for 2s, during which he recovers HP each time he's hit by a Basic Attack.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Minoan Fury",
        "tag": "Ultimate • High Impact",
        "desc": "Minotaur enters (Enraged) state and smashes the ground 3 times. The first 2 hits deal 180( +85% Total Physical Attack) (Physical Damage) to nearby enemies and slow them by 70%, while the final hit deals 200( +85% Total Physical Attack) (True Damage) and knocks targets airborne. Minotaur is immune to control effects during this attack. The (Enraged) state lasts 12s and enhances Minotaur's skills for the duration.",
        "counterTip": "Respect Minotaur's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Tank Carry",
      "Magic Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "Frontline crowd control locks down squishy carries."
      },
      {
        "heroId": "miya",
        "reason": "Heavy armor and taunts/stuns disrupt basic attack rhythm."
      }
    ],
    "counteredBy": [
      {
        "heroId": "karrie",
        "tier": "S",
        "reason": "Lightwheel True Damage completely bypasses high armor and magic defense."
      },
      {
        "heroId": "lunox",
        "tier": "S",
        "reason": "Chaos magic penetration shreds % Max HP frontliners."
      },
      {
        "heroId": "demon_hunter_sword",
        "tier": "A",
        "reason": "DHS passive deals 8% current HP on every basic attack."
      }
    ],
    "avoidPicks": [
      "karrie",
      "lunox",
      "claude"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Minotaur's core kit advantage.",
      "Watch for Minotaur's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Minotaur during key objective contests."
    ],
    "secondaryLane": "Jungle"
  },
  {
    "id": "layla",
    "avatar": "assets/heroes/layla.png",
    "name": "Layla",
    "role": "Marksman",
    "lane": "Gold",
    "damageType": "Physical",
    "difficulty": "Easy",
    "color": "#fbbf24",
    "avatarBg": "linear-gradient(135deg, #d97706, #f59e0b)",
    "skills": {
      "passive": {
        "name": "Malefic Gun",
        "tag": "Passive • Marksman Synergy",
        "desc": "Layla deals increased damage to enemies farther away from her (starting at 100% and increasing to 115% at 6 units away). This does not include Turrets.",
        "counterTip": "Track Layla's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Malefic Bomb",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Layla fires a Malefic Bomb in the target direction, dealing 200( +80% Total Physical Attack) (Physical Damage) to the first enemy hit (can Crit). Upon hitting an enemy, Layla's Basic Attacks and (Void Projectile) gain extra range for 3s, and she gains 60% extra Movement Speed that decays over 1.2s. The duration of the Movement Speed boost is doubled if an enemy hero is hit.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Void Projectile",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Layla fires an orb of Malefic Energy at the target enemy that explodes on hit, dealing 170( +65% Total Physical Attack) (Physical Damage) to targets in the area and applying a (Magic Mark) on them for 3s. When Layla hits an enemy with a (Magic Mark), she deals 100( +35% Total Physical Attack) (Physical Damage) to nearby enemies and stuns them for 0.25s.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Destruction Rush",
        "tag": "Ultimate • High Impact",
        "desc": "Layla fires a blast of Malefic Energy in the target direction, dealing 500( +150% Total Physical Attack) (Physical Damage) to enemies in a line. (Passive:) The range of Layla's (Void Projectile) and Basic Attacks is increased by 0.6 units. Her sight range is also slightly increased each time this skill is upgraded.",
        "counterTip": "Respect Layla's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Marksman Carry",
      "Physical Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 2,
      "mid": 4,
      "late": 5
    },
    "counters": [
      {
        "heroId": "tigreal",
        "reason": "Can out-range and kite Tigreal outside his melee engage radius."
      },
      {
        "heroId": "hylos",
        "reason": "High DPS melts Hylos HP pool from safe distance."
      }
    ],
    "counteredBy": [
      {
        "heroId": "saber",
        "tier": "S",
        "reason": "Instant point-and-click lock on airborne deletes Layla before repositioning."
      },
      {
        "heroId": "blade_armor",
        "tier": "S",
        "reason": "Blade Armor reflects basic attack physical damage right back."
      },
      {
        "heroId": "khufra",
        "tier": "A",
        "reason": "Bouncing Ball and Tyrants Rage halt escape dashes."
      }
    ],
    "avoidPicks": [
      "saber",
      "khufra",
      "fanny"
    ],
    "recommendedSpell": "Flicker / Vengeance",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Layla's core kit advantage.",
      "Watch for Layla's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Layla during key objective contests."
    ]
  },
  {
    "id": "fanny",
    "avatar": "assets/heroes/fanny.png",
    "name": "Fanny",
    "role": "Assassin",
    "lane": "Jungle",
    "damageType": "Physical",
    "difficulty": "Very Hard",
    "color": "#0284c7",
    "avatarBg": "linear-gradient(135deg, #0369a1, #38bdf8)",
    "skills": {
      "passive": {
        "name": "Air Superiority",
        "tag": "Passive • Flight Momentum & Energy Regen",
        "desc": "Increases Fanny’s damage by 15%–30% while flying and applies Prey Marks (up to 2 stacks). Hitting marked targets restores 10 energy per mark.",
        "counterTip": "Disrupting her flight with hard CC denies her energy regeneration, leaving her stranded and helpless."
      },
      "skill1": {
        "name": "Tornado Strike",
        "tag": "Skill 1 • Whirling Blades",
        "desc": "Fanny whirls her blades, dealing physical damage to nearby enemies. Automatically triggers when she collides with an enemy during cable flight.",
        "counterTip": "Avoid grouping close together so she cannot hit multiple heroes and restore massive spell vamp."
      },
      "skill2": {
        "name": "Steel Cable",
        "tag": "Skill 2 • Core Cable Mobility",
        "desc": "Fanny shoots cables that pull her toward terrain walls. Each successive cable cast within 3s reduces energy cost by 1.",
        "counterTip": "Pick Khufra (Bouncing Ball blocks cables) or Minsitthar (King’s Calling completely grounds her)."
      },
      "ultimate": {
        "name": "Cut Throat",
        "tag": "Ultimate • High-Speed Execute",
        "desc": "Fanny rushes a target, dealing 500–860 (+240% Extra Physical Attack) Physical Damage. Deals +20% bonus damage per Prey Mark stack.",
        "counterTip": "Use Wind of Nature (WoN) or Winter Crown immediately when she dives you to absorb this single-target burst."
      }
    },
    "tags": [
      "Fastest Map Mobility",
      "Steel Cable Dive",
      "Insane Burst"
    ],
    "powerSpikes": {
      "early": 5,
      "mid": 5,
      "late": 3
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "Cables across half the map and one-shots Layla in 0.5 seconds."
      },
      {
        "heroId": "pharsa",
        "reason": "Dives Pharsa air strike without taking damage and executes her."
      },
      {
        "heroId": "valentina",
        "reason": "Valentina cannot use Fanny ultimate effectively; Fanny deletes her."
      }
    ],
    "counteredBy": [
      {
        "heroId": "khufra",
        "tier": "S",
        "reason": "Bouncing Ball completely cancels Fanny cables and knocks her airborne."
      },
      {
        "heroId": "minsitthar",
        "tier": "S",
        "reason": "King’s Calling disables all steel cables, grounding Fanny to a slow walk."
      },
      {
        "heroId": "franco",
        "tier": "S",
        "reason": "Bloody Hunt suppression stops Fanny instantly mid-flight."
      },
      {
        "heroId": "saber",
        "tier": "S",
        "reason": "Triple Sweep airborne lock-on stops Fanny dead in her tracks."
      },
      {
        "heroId": "phoveus",
        "tier": "A",
        "reason": "Fanny cable spam charges Phoveus ultimate indefinitely."
      }
    ],
    "avoidPicks": [
      "layla",
      "miya",
      "pharsa"
    ],
    "recommendedSpell": "Retribution",
    "counterItems": [
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE",
      "WINTER_CROWN",
      "TWILIGHT_ARMOR"
    ],
    "tacticalTips": [
      "Invade and steal Fanny’s Purple Buff at 1:00 min! Without Purple Buff, Fanny runs out of energy in two cables.",
      "Build Antique Cuirass and Wind of Nature to survive her initial cable burst.",
      "Pick Khufra, Minsitthar, or Franco to hard-lock her mobility."
    ]
  },
  {
    "id": "eudora",
    "avatar": "assets/heroes/eudora.png",
    "name": "Eudora",
    "role": "Mage",
    "lane": "Mid",
    "damageType": "Magic",
    "difficulty": "Easy",
    "color": "#c084fc",
    "avatarBg": "linear-gradient(135deg, #7e22ce, #c084fc)",
    "skills": {
      "passive": {
        "name": "Superconductor",
        "tag": "Passive • Mage Synergy",
        "desc": "Eudora's skills inflict (Superconductor) for 3s on hit and can trigger additional effects against enemies affected by (Superconductor).",
        "counterTip": "Track Eudora's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Forked Lightning",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Eudora casts forked lightning in the target direction, dealing 350( +150% Total Magic Power) (Magic Damage) to enemies in a fan-shaped area. Enemies affected by (Superconductor) will take 190( +30% Total Magic Power) extra (Magic Damage) after a short delay.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Ball Lightning",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Eudora hurls an orb of lightning at the target enemy, dealing 350( +80% Total Magic Power) (Magic Damage), stunning them for 1.2s, and reducing their Magic Defense by 10 for 1.8s. If the enemy is affected by (Superconductor), the lightning orb will bounce to up to 3 nearby enemies (prioritizes enemy heroes), dealing 175( +40% Total Magic Power) (Magic Damage) and stunning them for 0.9s.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Thunder’s Wrath",
        "tag": "Ultimate • High Impact",
        "desc": "Eudora calls down a blast of lightning on the target enemy, dealing 480( +180% Total Magic Power) (Magic Damage). If the enemy is affected by (Superconductor), dark clouds appear over their head and unleash an additional lightning strike on the area after 0.8s, dealing 440( +150% Total Magic Power) (Magic Damage) to enemies within and 360( +150% Total Magic Power) (Magic Damage) to nearby enemies.",
        "counterTip": "Respect Eudora's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Mage Carry",
      "Magic Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "High burst combo deletes squishy immobile marksmen instantly."
      },
      {
        "heroId": "miya",
        "reason": "AoE magic damage out-bursts Miya in early/mid game teamfights."
      }
    ],
    "counteredBy": [
      {
        "heroId": "athenas_shield",
        "tier": "S",
        "reason": "Athena’s Shield absorbs 25% of magic burst, preventing one-shots."
      },
      {
        "heroId": "ling",
        "tier": "S",
        "reason": "Ling wall-jumping bypasses ground skillshots and dives Eudora effortlessly."
      },
      {
        "heroId": "saber",
        "tier": "A",
        "reason": "Airborne lock prevents Eudora from casting defensive spells."
      }
    ],
    "avoidPicks": [
      "ling",
      "fanny",
      "saber"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Eudora's core kit advantage.",
      "Watch for Eudora's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Eudora during key objective contests."
    ]
  },
  {
    "id": "zilong",
    "avatar": "assets/heroes/zilong.png",
    "name": "Zilong",
    "role": "Fighter",
    "lane": "EXP",
    "damageType": "Magic",
    "difficulty": "Easy",
    "color": "#f97316",
    "avatarBg": "linear-gradient(135deg, #c2410c, #ea580c)",
    "skills": {
      "passive": {
        "name": "Dragon Flurry",
        "tag": "Passive • Fighter Synergy",
        "desc": "After every 3 Basic Attacks, Zilong triggers (Dragon Flurry) on the next Basic Attack, hitting the target 3 times. Each hit deals 30( +40% Total Physical Attack) Basic Attack damage and heals himself for 30( +20% Total Physical Attack) HP.",
        "counterTip": "Track Zilong's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Spear Flip",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Zilong flings the target enemy over his head, dealing 250( +80% Total Physical Attack) (Physical Damage).",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Spear Strike",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Zilong lunges at the target enemy, dealing 250( +60% Total Physical Attack) (Physical Damage) and reducing their Physical Defense by 15 for 2s. He then launches a Basic Attack on the same target. The cooldown of (Spear Strike) is reset each time Zilong kills an enemy.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Supreme Warrior",
        "tag": "Ultimate • High Impact",
        "desc": "Zilong removes all slow effects on himself and gains 40% Movement Speed, 45% Attack Speed, and Slow Immunity for 7.5s. For the duration, he can trigger (Dragon Flurry) after every 2 Basic Attacks (instead of the previous 3).",
        "counterTip": "Respect Zilong's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Fighter Carry",
      "Magic Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "alucard",
        "reason": "Sustained frontline presence out-trades in close quarter duels."
      },
      {
        "heroId": "zilong",
        "reason": "Absorbs initial charge and overpowers in prolonged trades."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dominance_ice",
        "tier": "S",
        "reason": "Dominance Ice cuts lifesteal and shield regeneration by 50%."
      },
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Constant knockbacks and slow firewall kite Zilong endlessly."
      },
      {
        "heroId": "baxia",
        "tier": "A",
        "reason": "Inherent anti-heal passive and mobility neutralize sustain."
      }
    ],
    "avoidPicks": [
      "valir",
      "karrie",
      "baxia"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Zilong's core kit advantage.",
      "Watch for Zilong's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Zilong during key objective contests."
    ],
    "secondaryLane": "Roam"
  },
  {
    "id": "franco",
    "avatar": "assets/heroes/franco.png",
    "name": "Franco",
    "role": "Tank",
    "lane": "Roam",
    "damageType": "Physical",
    "difficulty": "Hard",
    "color": "#94a3b8",
    "avatarBg": "linear-gradient(135deg, #475569, #94a3b8)",
    "skills": {
      "passive": {
        "name": "Wasteland Force",
        "tag": "Passive • Regen & Speed Out of Combat",
        "desc": "If no damage is taken for a short time, Franco gains 10% movement speed and regenerates 1% Max HP per second, building combat strength.",
        "counterTip": "Poke him periodically to reset his out-of-combat movement speed boost."
      },
      "skill1": {
        "name": "Iron Hook",
        "tag": "Skill 1 • Long-Range Skillshot Hook",
        "desc": "Franco launches an iron hook forward, pulling the first unit hit directly to himself and dealing physical damage.",
        "counterTip": "Stand behind friendly minions; weave left and right unpredictably; never walk in a straight line."
      },
      "skill2": {
        "name": "Fury Shock",
        "tag": "Skill 2 • Ground Slam Slow",
        "desc": "Franco slams the ground, dealing physical damage to nearby enemies and slowing them by 70% for 1.5s.",
        "counterTip": "Disengage quickly before he chains this slow into his ultimate."
      },
      "ultimate": {
        "name": "Bloody Hunt",
        "tag": "Ultimate • 1.8s Unbreakable Suppression",
        "desc": "Franco hacks an enemy hero 6 times, suppressing them for 1.8s. Suppression CANNOT be cleansed by Purify.",
        "counterTip": "Purify DOES NOT WORK on suppression! Build high defense, stay with your team, or have allies interrupt him with displacement CC."
      }
    },
    "tags": [
      "Iron Hook",
      "Unbreakable Suppression",
      "Buff Delay Specialist"
    ],
    "powerSpikes": {
      "early": 4,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "fanny",
        "reason": "Suppression (Bloody Hunt) CANNOT be purified or cancelled. Locks Fanny in place."
      },
      {
        "heroId": "ling",
        "reason": "Suppresses Ling immediately upon landing from his ultimate."
      },
      {
        "heroId": "claude",
        "reason": "Suppresses Claude the instant he blinks in to ult."
      },
      {
        "heroId": "yve",
        "reason": "Suppression cancels Yve Real World Manipulation ultimate."
      },
      {
        "heroId": "diggie",
        "reason": "Diggie ultimate CANNOT cleanse Franco suppression."
      }
    ],
    "counteredBy": [
      {
        "heroId": "belerick",
        "tier": "A",
        "reason": "Hooking Belerick into your team triggers Belerick taunt and destroys your squishies."
      },
      {
        "heroId": "tigreal",
        "tier": "A",
        "reason": "Hooking Tigreal gives Tigreal a free gap-closer for a 5-man Implosion."
      }
    ],
    "avoidPicks": [
      "fanny",
      "ling",
      "claude",
      "yve"
    ],
    "recommendedSpell": "Flicker",
    "counterItems": [
      "DOMINANCE_ICE",
      "ATHENAS_SHIELD",
      "IMMORTALITY"
    ],
    "tacticalTips": [
      "Suppression is the strongest CC in MLBB: it CANNOT be removed by Purify, Kagura S2, or Diggie Ult.",
      "Draft frontline tanks (Tigreal, Belerick) who LOVE getting hooked into the enemy team."
    ]
  },
  {
    "id": "karina",
    "avatar": "assets/heroes/karina.png",
    "name": "Karina",
    "role": "Assassin",
    "lane": "Jungle",
    "damageType": "Magic",
    "difficulty": "Medium",
    "color": "#38bdf8",
    "avatarBg": "linear-gradient(135deg, #0284c7, #38bdf8)",
    "skills": {
      "passive": {
        "name": "Shadow Combo",
        "tag": "Passive • Assassin Synergy",
        "desc": "Karina's third consecutive attack on the same enemy deals extra (True Damage) equal to 50 plus 5( +3% Total Magic Power)% of their lost HP (up to 2000 (True Damage) against creeps). If the target is an enemy hero, the cooldowns of Karina's non-Ultimate skills are reduced by 1.5s.",
        "counterTip": "Track Karina's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Dance of Blades",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Karina enters the (Dance of Blades) state for 3.5s, during which she gains 45% extra Movement Speed, blocks all incoming Basic Attacks, and reflects 100( +30% Total Magic Power) (Magic Damage) back to the attacker (the damage reflection effect has a cooldown of 0.4s). Karina's next Basic Attack within the duration deals 150( +55% Total Magic Power) (Magic Damage), slows the target by 45% for 1s, and is guaranteed to Crit. Casting the enhanced Basic Attack or (Shadow Assault) ends the (Dance of Blades) state early.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Dance of Death",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Karina launches a spinning slash, dealing 375( +125% Total Magic Power) (Magic Damage) to nearby enemies.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Shadow Assault",
        "tag": "Ultimate • High Impact",
        "desc": "Karina dashes to the target enemy hero, dealing them 350( +160% Total Magic Power) (Magic Damage), applying a (Shadow Mark) to them, and leaving a (Shadowform) behind them. The (Shadow Mark) and (Shadowform) both last 5s. If the enemy dies within the duration, the cooldown of this skill is reset. (Use Again): Karina dashes back to the (Shadowform)'s location, dealing 150( +50% Total Magic Power) (Magic Damage) to enemies along the way.",
        "counterTip": "Respect Karina's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Assassin Carry",
      "Magic Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 4,
      "mid": 5,
      "late": 3
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "Rapid mobility bridges distance and eliminates isolated targets."
      },
      {
        "heroId": "gord",
        "reason": "Blinks past Gord stuns and deletes during channel."
      }
    ],
    "counteredBy": [
      {
        "heroId": "khufra",
        "tier": "S",
        "reason": "Bouncing Ball cancels dash abilities and grounds momentum."
      },
      {
        "heroId": "franco",
        "tier": "S",
        "reason": "Suppression ultimate cannot be purified and locks Karina down."
      },
      {
        "heroId": "antique_cuirass",
        "tier": "A",
        "reason": "Reduces skill damage scaling by 12% across multi-hit combos."
      }
    ],
    "avoidPicks": [
      "khufra",
      "franco",
      "minsitthar"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Karina's core kit advantage.",
      "Watch for Karina's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Karina during key objective contests."
    ]
  },
  {
    "id": "rafaela",
    "avatar": "assets/heroes/rafaela.png",
    "name": "Rafaela",
    "role": "Support",
    "lane": "Roam",
    "damageType": "Magic",
    "difficulty": "Easy",
    "color": "#06b6d4",
    "avatarBg": "linear-gradient(135deg, #0891b2, #06b6d4)",
    "skills": {
      "passive": {
        "name": "Deity Penalization",
        "tag": "Passive • Support Synergy",
        "desc": "When Rafaela is killed, she turns into a beam of (Holy Light) and launches herself at her killer after a 2s delay. This attack deals (True Damage) equal to 20% of the target's Max HP upon hit and can be blocked by other enemy heroes, dealing damage to them instead. This effect won't be triggered if the killer is a non-hero enemy or if they're too far away.",
        "counterTip": "Track Rafaela's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Light of Retribution",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Rafaela strikes the three nearest enemies with (Light of Retribution), dealing them 225( +120% Total Magic Power) (Magic Damage), briefly revealing their positions, and slowing them by 40% for 1.5s. Enemies hit by (Light of Retribution) again within 5s will take 20% extra damage (this effect stacks up to 3 times).",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Holy Healing",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Rafaela calls upon (Holy Light), restoring 100( +35% Total Magic Power) HP to nearby allied heroes, plus an additional 150( +45% Total Magic Power) HP to herself and the most injured allied hero in range. Also increases the Movement Speed of nearby allied heroes by 30% and grants Slow Immunity for 1s. Every 20 point(s) of Magic Power will add 1% to the Movement Speed bonus.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Holy Baptism",
        "tag": "Ultimate • High Impact",
        "desc": "Rafaela unleashes the true power of (Holy Light) in the target direction, dealing 460( +120% Total Magic Power) (Magic Damage) to enemies in a line and stunning them for 1.2s.",
        "counterTip": "Respect Rafaela's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Support Carry",
      "Magic Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "alucard",
        "reason": "Sustained frontline presence out-trades in close quarter duels."
      },
      {
        "heroId": "zilong",
        "reason": "Absorbs initial charge and overpowers in prolonged trades."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dominance_ice",
        "tier": "S",
        "reason": "Dominance Ice cuts lifesteal and shield regeneration by 50%."
      },
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Constant knockbacks and slow firewall kite Rafaela endlessly."
      },
      {
        "heroId": "baxia",
        "tier": "A",
        "reason": "Inherent anti-heal passive and mobility neutralize sustain."
      }
    ],
    "avoidPicks": [
      "valir",
      "karrie",
      "baxia"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Rafaela's core kit advantage.",
      "Watch for Rafaela's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Rafaela during key objective contests."
    ]
  },
  {
    "id": "bane",
    "avatar": "assets/heroes/bane.png",
    "name": "Bane",
    "role": "Fighter",
    "lane": "EXP",
    "damageType": "Hybrid",
    "difficulty": "Easy",
    "color": "#f97316",
    "avatarBg": "linear-gradient(135deg, #c2410c, #ea580c)",
    "skills": {
      "passive": {
        "name": "Shark Bite",
        "tag": "Passive • Fighter Synergy",
        "desc": "Bane infuses his weapon with a stack of (Tidal Energy) each time he uses a skill (up to 2 stacks). Each of his subsequent Basic Attacks consumes a stack to deal (Physical Damage) equal to ( +100% Total Physical Attack) plus 3.5(+0.3*Hero Level)% of the target's Max HP to nearby enemies.",
        "counterTip": "Track Bane's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Crab Claw Cannon",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Bane fires his Crab Claw Cannon in the target direction, dealing 150( +160% Total Physical Attack) (Physical Damage) to the first enemy hit and then 150% damage to a random enemy behind them (prioritizes enemy heroes). Enemies hit are slowed by 10( +10% Total Magic Power)% for 1s. Every 100 (Physical Attack) Bane possesses reduces this skill's cooldown by an additional 8%.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Ale",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Bane chugs his ale, recovering 200( +150% Total Magic Power) plus 5( +1% Total Magic Power)% of his lost HP and gaining 50% extra Movement Speed that decays over 2.5s. (Use Again): Bane spits venom in the target direction, dealing 250( +180% Total Magic Power) (Magic Damage) (scales up to 150% with charging time) to enemies in a fan-shaped area. Every 100 (Magic Power) Bane possesses additionally reduces this skill's cooldown by 7%.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Deadly Catch",
        "tag": "Ultimate • High Impact",
        "desc": "Bane summons a school of sharks to charge in the target direction, dealing 600( +100% Total Physical Attack) (+170% Total Magic Power) (Magic Damage) to enemies hit, knocking them airborne for 0.8s, and slowing them by 65% (decays over 3s). This skill deals 40% damage to turrets.",
        "counterTip": "Respect Bane's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Fighter Carry",
      "Hybrid Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "alucard",
        "reason": "Sustained frontline presence out-trades in close quarter duels."
      },
      {
        "heroId": "zilong",
        "reason": "Absorbs initial charge and overpowers in prolonged trades."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dominance_ice",
        "tier": "S",
        "reason": "Dominance Ice cuts lifesteal and shield regeneration by 50%."
      },
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Constant knockbacks and slow firewall kite Bane endlessly."
      },
      {
        "heroId": "baxia",
        "tier": "A",
        "reason": "Inherent anti-heal passive and mobility neutralize sustain."
      }
    ],
    "avoidPicks": [
      "valir",
      "karrie",
      "baxia"
    ],
    "recommendedSpell": "Flicker / Vengeance",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Bane's core kit advantage.",
      "Watch for Bane's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Bane during key objective contests."
    ],
    "secondaryLane": "Roam"
  },
  {
    "id": "akai",
    "avatar": "assets/heroes/akai.png",
    "name": "Akai",
    "role": "Tank",
    "lane": "Roam",
    "damageType": "Magic",
    "difficulty": "Easy",
    "color": "#10b981",
    "avatarBg": "linear-gradient(135deg, #047857, #10b981)",
    "skills": {
      "passive": {
        "name": "Tai Chi",
        "tag": "Passive • Tank Synergy",
        "desc": "Akai gains a 25( +5% Total HP) shield for 4s on each skill cast and marks enemy heroes and Creeps hit by his skills. Akai's Basic Attacks deal 25( +5% Total HP) extra (Physical Damage) to marked enemies.",
        "counterTip": "Track Akai's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Headbutt",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Akai charges in the target direction, dealing 300( +50% Total Physical Attack) (Physical Damage) to enemies along the way. If Akai hits an enemy hero during this process, he'll knock them airborne for 0.5s and be able to roll in the Joystick's direction once. Akai can cast (Headbutt) during (Heavy Spin) to quickly adjust his position.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Body Slam",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Akai smashes the ground with his body, dealing 270( +6% Total HP) (Physical Damage) to nearby enemies and slowing them by 45% for 2s.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Heavy Spin",
        "tag": "Ultimate • High Impact",
        "desc": "Akai removes all debuffs on him and spins for 4s, gaining Slow Immunity while continuously dealing 200( +100% Extra Physical Attack) (Physical Damage) to nearby enemies and knocking them back. Enemy heroes knocked back will knock back other heroes they collide with during the process. Akai also gradually increases his Movement Speed by 70% over the duration. This skill can only be interrupted by Suppression and Morph effects.",
        "counterTip": "Respect Akai's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Tank Carry",
      "Magic Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "Frontline crowd control locks down squishy carries."
      },
      {
        "heroId": "miya",
        "reason": "Heavy armor and taunts/stuns disrupt basic attack rhythm."
      }
    ],
    "counteredBy": [
      {
        "heroId": "karrie",
        "tier": "S",
        "reason": "Lightwheel True Damage completely bypasses high armor and magic defense."
      },
      {
        "heroId": "lunox",
        "tier": "S",
        "reason": "Chaos magic penetration shreds % Max HP frontliners."
      },
      {
        "heroId": "demon_hunter_sword",
        "tier": "A",
        "reason": "DHS passive deals 8% current HP on every basic attack."
      }
    ],
    "avoidPicks": [
      "karrie",
      "lunox",
      "claude"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Akai's core kit advantage.",
      "Watch for Akai's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Akai during key objective contests."
    ],
    "secondaryLane": "Jungle"
  },
  {
    "id": "bruno",
    "avatar": "assets/heroes/bruno.png",
    "name": "Bruno",
    "role": "Marksman",
    "lane": "Gold",
    "damageType": "Physical",
    "difficulty": "Medium",
    "color": "#fbbf24",
    "avatarBg": "linear-gradient(135deg, #d97706, #f59e0b)",
    "skills": {
      "passive": {
        "name": "Mecha Legs",
        "tag": "Passive • Marksman Synergy",
        "desc": "Bruno gains 2% extra Crit Chance each time he deals damage with his skills (up to 10 stacks). Bruno has higher Physical Attack but only gains 80% extra Attack Speed from all sources.",
        "counterTip": "Track Bruno's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Volley Shot",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Bruno kicks a Powerball on his next Basic Attack, dealing 100( +100% Total Physical Attack) (Physical Damage) to the target, slowing them by 30%, and speeding up by 30% for 0.5s. The Powerball then bounces back toward Bruno and lands on the ground. He or allied heroes can retrieve the Powerball for another attack and reduce the cooldown of (Flying Tackle) by 1s.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Flying Tackle",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Bruno makes a slide tackle in the target direction, dealing 140( +40% Total Physical Attack) (Physical Damage) to enemies in his path and stunning them for 0.5s. If the Powerball is bouncing back, Bruno also draws the Powerball toward him.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Worldie",
        "tag": "Ultimate • High Impact",
        "desc": "Bruno kicks his Energy Ball at the target enemy hero, dealing 250( +83% Total Physical Attack) (Physical Damage) and knocking them back. The Energy Ball then bounces between nearby enemies up to 10 times, each time dealing 150( +50% Total Physical Attack) (Physical Damage). Each hit also reduces the enemy's Physical Defense by 4% for 8s (up to 3 stacks).",
        "counterTip": "Respect Bruno's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Marksman Carry",
      "Physical Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 2,
      "mid": 4,
      "late": 5
    },
    "counters": [
      {
        "heroId": "tigreal",
        "reason": "Can out-range and kite Tigreal outside his melee engage radius."
      },
      {
        "heroId": "hylos",
        "reason": "High DPS melts Hylos HP pool from safe distance."
      }
    ],
    "counteredBy": [
      {
        "heroId": "saber",
        "tier": "S",
        "reason": "Instant point-and-click lock on airborne deletes Bruno before repositioning."
      },
      {
        "heroId": "blade_armor",
        "tier": "S",
        "reason": "Blade Armor reflects basic attack physical damage right back."
      },
      {
        "heroId": "khufra",
        "tier": "A",
        "reason": "Bouncing Ball and Tyrants Rage halt escape dashes."
      }
    ],
    "avoidPicks": [
      "saber",
      "khufra",
      "fanny"
    ],
    "recommendedSpell": "Flicker / Vengeance",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Bruno's core kit advantage.",
      "Watch for Bruno's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Bruno during key objective contests."
    ]
  },
  {
    "id": "alucard",
    "avatar": "assets/heroes/alucard.png",
    "name": "Alucard",
    "role": "Fighter",
    "lane": "EXP",
    "damageType": "Physical",
    "difficulty": "Medium",
    "color": "#f97316",
    "avatarBg": "linear-gradient(135deg, #c2410c, #ea580c)",
    "skills": {
      "passive": {
        "name": "Pursuit",
        "tag": "Passive • Fighter Synergy",
        "desc": "After each skill cast, Alucard's next Basic Attack allows him to dash to the target's location and deal ( +140% Total Physical Attack) Physical Damage.",
        "counterTip": "Track Alucard's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Groundsplitter",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Alucard rolls to the target location and slams his blade on the ground, dealing 270( +110% Extra Physical Attack) (Physical Damage) to enemies hit and slowing them by 40% for 2s.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Whirling Smash",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Alucard launches a whirling slash, dealing 345( +120% Extra Physical Attack) (Physical Damage) to nearby enemies.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Fission Wave",
        "tag": "Ultimate • High Impact",
        "desc": "(Passive): Alucard permanently gains 10% Hybrid Lifesteal. (Active): Alucard absorbs the energy of enemies in the target area, reducing their Movement Speed by 30% and Hybrid Defense by 10. Alucard gains 10 Hybrid Defense for each enemy hero hit, and reduces the cooldown of his other skills to 50% for 6s. (Use Again): Alucard releases a shockwave in the target direction, dealing 400( +200% Extra Physical Attack) (Physical Damage) to enemies hit.",
        "counterTip": "Respect Alucard's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Fighter Carry",
      "Physical Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "alucard",
        "reason": "Sustained frontline presence out-trades in close quarter duels."
      },
      {
        "heroId": "zilong",
        "reason": "Absorbs initial charge and overpowers in prolonged trades."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dominance_ice",
        "tier": "S",
        "reason": "Dominance Ice cuts lifesteal and shield regeneration by 50%."
      },
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Constant knockbacks and slow firewall kite Alucard endlessly."
      },
      {
        "heroId": "baxia",
        "tier": "A",
        "reason": "Inherent anti-heal passive and mobility neutralize sustain."
      }
    ],
    "avoidPicks": [
      "valir",
      "karrie",
      "baxia"
    ],
    "recommendedSpell": "Flicker / Vengeance",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Alucard's core kit advantage.",
      "Watch for Alucard's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Alucard during key objective contests."
    ],
    "secondaryLane": "Roam"
  },
  {
    "id": "tigreal",
    "avatar": "assets/heroes/tigreal.png",
    "name": "Tigreal",
    "role": "Tank",
    "lane": "Roam",
    "damageType": "Physical",
    "difficulty": "Easy",
    "color": "#3b82f6",
    "avatarBg": "linear-gradient(135deg, #1d4ed8, #3b82f6)",
    "skills": {
      "passive": {
        "name": "Fearless",
        "tag": "Passive • Basic Attack Immunity Block",
        "desc": "Gains a layer of blessing when using skills or struck by basic attacks. At 4 stacks, Tigreal completely blocks the next incoming basic attack.",
        "counterTip": "Marksmen should pop his block with a cheap basic attack before casting high-damage skills."
      },
      "skill1": {
        "name": "Attack Wave",
        "tag": "Skill 1 • 3-Stage Shockwave",
        "desc": "Tigreal strikes the ground, sending shockwaves that deal physical damage and slow enemies by up to 65%.",
        "counterTip": "Dodge diagonally to avoid the line shockwave slow."
      },
      "skill2": {
        "name": "Sacred Hammer",
        "tag": "Skill 2 • Push & Airborne Knockup",
        "desc": "Tigreal charges forward, pushing all enemies along the way. Casting again knocks them airborne for 1s.",
        "counterTip": "Diggie’s ultimate or Purify completely negates the push and knockup combo."
      },
      "ultimate": {
        "name": "Implosion",
        "tag": "Ultimate • Channeling Vacuum Pull & Stun",
        "desc": "Tigreal channels for 1.5s, pulling all surrounding enemies toward himself and stunning them for 1.5s.",
        "counterTip": "Interrupt his channel immediately with Stun, Knockup, or Silence before the vacuum completes."
      }
    },
    "tags": [
      "5-Man Implosion Pull",
      "Turret Push",
      "Tanky Passive"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 5,
      "late": 4
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "Flicker Implosion pulls immobile marksmen with zero escape."
      },
      {
        "heroId": "miya",
        "reason": "Easily locks down Miya once stealth is baited."
      }
    ],
    "counteredBy": [
      {
        "heroId": "diggie",
        "tier": "S",
        "reason": "Time Journey cleanses Tigreal entire ultimate and wastes his Flicker."
      },
      {
        "heroId": "valentina",
        "tier": "S",
        "reason": "Valentina steals Tigreal Implosion and casts it back on his team with higher AP."
      },
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Valir knockback and fireball stuns completely prevent Tigreal from walking up."
      },
      {
        "heroId": "karrie",
        "tier": "A",
        "reason": "Karrie true damage shreds Tigreal before he can reposition."
      }
    ],
    "avoidPicks": [
      "layla",
      "miya"
    ],
    "recommendedSpell": "Flicker",
    "counterItems": [
      "DOMINANCE_ICE",
      "ATHENAS_SHIELD",
      "BLADE_ARMOR"
    ],
    "tacticalTips": [
      "Watch Tigreal Flicker cooldown! A Tigreal with Flicker is 5x more dangerous than one without it.",
      "Spread out when contesting Turtle or Lord so Tigreal cannot pull multiple teammates in one Implosion."
    ]
  },
  {
    "id": "clint",
    "avatar": "assets/heroes/clint.png",
    "name": "Clint",
    "role": "Marksman",
    "lane": "Gold",
    "damageType": "Physical",
    "difficulty": "Hard",
    "color": "#fbbf24",
    "avatarBg": "linear-gradient(135deg, #d97706, #f59e0b)",
    "skills": {
      "passive": {
        "name": "Double Shot",
        "tag": "Passive • Marksman Synergy",
        "desc": "After each skill cast, Clint's next Basic Attack within 4s penetrates a line of enemies, dealing 50( +120% Total Physical Attack) (Physical Damage). This damage can trigger attack effects, and the part affected by Physical Attack can Crit.",
        "counterTip": "Track Clint's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Quick Draw",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Clint fires 5 bullets in quick succession in the target direction, each dealing 250( +85% Total Physical Attack) (Physical Damage) to the enemy hit. The bullets will spread evenly across enemies in a fan-shaped area. Enemies hit by multiple bullets will take less damage after the first bullet.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Trapping Recoil",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Clint shoots a trap net in the target direction, slightly jumping back while dealing 140( +30% Total Physical Attack)( +150% Total Magic Power) (Physical Damage) to the first enemy hit and immobilizing them for 1.2s. Successfully hitting an enemy reduces the cooldown of this skill by 40%.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Grenade Bombardment",
        "tag": "Ultimate • High Impact",
        "desc": "Clint launches a grenade in the target direction that explodes on the first enemy hit, dealing 280( +100% Total Physical Attack) (Physical Damage) and slowing them by 25% for 1.2s. Clint gains a grenade charge every 12s (up to 5).",
        "counterTip": "Respect Clint's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Marksman Carry",
      "Physical Damage",
      "High Skill Ceiling"
    ],
    "powerSpikes": {
      "early": 2,
      "mid": 4,
      "late": 5
    },
    "counters": [
      {
        "heroId": "tigreal",
        "reason": "Can out-range and kite Tigreal outside his melee engage radius."
      },
      {
        "heroId": "hylos",
        "reason": "High DPS melts Hylos HP pool from safe distance."
      }
    ],
    "counteredBy": [
      {
        "heroId": "saber",
        "tier": "S",
        "reason": "Instant point-and-click lock on airborne deletes Clint before repositioning."
      },
      {
        "heroId": "blade_armor",
        "tier": "S",
        "reason": "Blade Armor reflects basic attack physical damage right back."
      },
      {
        "heroId": "khufra",
        "tier": "A",
        "reason": "Bouncing Ball and Tyrants Rage halt escape dashes."
      }
    ],
    "avoidPicks": [
      "saber",
      "khufra",
      "fanny"
    ],
    "recommendedSpell": "Flicker / Vengeance",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Clint's core kit advantage.",
      "Watch for Clint's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Clint during key objective contests."
    ]
  },
  {
    "id": "nana",
    "avatar": "assets/heroes/nana.png",
    "name": "Nana",
    "role": "Mage",
    "lane": "Mid",
    "damageType": "Magic",
    "difficulty": "Easy",
    "color": "#c084fc",
    "avatarBg": "linear-gradient(135deg, #7e22ce, #c084fc)",
    "skills": {
      "passive": {
        "name": "Molina's Gift",
        "tag": "Passive • Mage Synergy",
        "desc": "Upon taking fatal damage, Nana removes all debuffs on her and transforms, becoming untargetable and invincible, and gains 30% Movement Speed for 2s. She also recovers 10% Max HP over the duration. Nana can only transform once every 150s and cannot cast skills in the transformed form.",
        "counterTip": "Track Nana's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Magic Boomerang",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Nana hurls her Magic Boomerang in the target direction, dealing damage to enemies hit on its way out and back. The boomerang deals 320( +100% Total Magic Power) (Magic Damage) to the first enemy hit. For every additional enemy hit, the damage is reduced by 20% (max reduction of 60%).",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Molina Smooch",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Nana throws Molina at the target location, dealing 250( +50% Total Magic Power) (Magic Damage) to enemies within range and (Transforming) enemy heroes hit into small animals. If Molina does not hit an enemy hero, she will remain on the ground and chase the nearest enemy hero that comes into range, (Transforming) the first enemy hero she touches. (Transform): Reduces the target's Movement Speed by 30% and Magic Defense by 25% for 1.5s. Transformed heroes cannot attack or use skills.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Molina Blitz",
        "tag": "Ultimate • High Impact",
        "desc": "Nana summons Molina to strike the target area 3 times, each time dealing 440( +160% Total Magic Power) (Magic Damage) to enemies within and slowing them by 50% for 1s. Enemies hit consecutively will be stunned for 1s.",
        "counterTip": "Respect Nana's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Mage Carry",
      "Magic Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "High burst combo deletes squishy immobile marksmen instantly."
      },
      {
        "heroId": "miya",
        "reason": "AoE magic damage out-bursts Miya in early/mid game teamfights."
      }
    ],
    "counteredBy": [
      {
        "heroId": "athenas_shield",
        "tier": "S",
        "reason": "Athena’s Shield absorbs 25% of magic burst, preventing one-shots."
      },
      {
        "heroId": "ling",
        "tier": "S",
        "reason": "Ling wall-jumping bypasses ground skillshots and dives Nana effortlessly."
      },
      {
        "heroId": "saber",
        "tier": "A",
        "reason": "Airborne lock prevents Nana from casting defensive spells."
      }
    ],
    "avoidPicks": [
      "ling",
      "fanny",
      "saber"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Nana's core kit advantage.",
      "Watch for Nana's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Nana during key objective contests."
    ]
  },
  {
    "id": "saber",
    "avatar": "assets/heroes/saber.png",
    "name": "Saber",
    "role": "Assassin",
    "lane": "Jungle",
    "secondaryLane": "Roam",
    "damageType": "Physical",
    "difficulty": "Easy",
    "color": "#38bdf8",
    "avatarBg": "linear-gradient(135deg, #0369a1, #0284c7)",
    "skills": {
      "passive": {
        "name": "Enemy's Bane",
        "tag": "Passive • Armor Shred on Hit",
        "desc": "Dealing damage reduces the target’s Physical Defense by 3–7 points for 5s (stacks up to 5 times for 35 total armor reduction).",
        "counterTip": "Buy Warrior Boots and Antique Cuirass early so his passive cannot reduce your armor to zero."
      },
      "skill1": {
        "name": "Orbiting Swords",
        "tag": "Skill 1 • 5 Flying Swords",
        "desc": "Saber shoots 5 swords orbiting him. Basic attacks and skills shoot orbiting swords at enemies, dealing physical damage.",
        "counterTip": "Step back when swords are orbiting to avoid taking multi-sword projectile procs."
      },
      "skill2": {
        "name": "Charge",
        "tag": "Skill 2 • Dash & Empowered Strike",
        "desc": "Saber dashes forward, dealing physical damage to enemies in his path and empowering his next basic attack.",
        "counterTip": "Track his dash cooldown; without dash Saber has no escape mechanism."
      },
      "ultimate": {
        "name": "Triple Sweep",
        "tag": "Ultimate • Airborne Lock & Burst",
        "desc": "Saber dashes to an enemy hero, knocking them airborne for 1.2s and striking them 3 times for lethal physical burst.",
        "counterTip": "Dreadnaught Armor / Antique Cuirass and Wind of Nature completely negate this one-shot assassination."
      }
    },
    "tags": [
      "Point & Click Ult Lock",
      "Instant Armor Shred",
      "Squishy Deletion"
    ],
    "powerSpikes": {
      "early": 4,
      "mid": 5,
      "late": 3
    },
    "counters": [
      {
        "heroId": "fanny",
        "reason": "Triple Sweep locks onto Fanny mid-flight and deletes her."
      },
      {
        "heroId": "ling",
        "reason": "Instant airborne lock-on kills Ling before he can wall jump."
      },
      {
        "heroId": "claude",
        "reason": "Airborne lock-on deletes Claude before he can mirror swap or ult."
      },
      {
        "heroId": "hayabusa",
        "reason": "Prevents Hayabusa from using Quad Shadow escape."
      }
    ],
    "counteredBy": [
      {
        "heroId": "khufra",
        "tier": "S",
        "reason": "Bouncing Ball interrupts Saber charge."
      },
      {
        "heroId": "chou",
        "tier": "A",
        "reason": "Shunpo immunity dodges Saber airborne knockup."
      },
      {
        "heroId": "diggie",
        "tier": "A",
        "reason": "Time Journey cleanses Saber Triple Sweep airborne lock-on."
      },
      {
        "heroId": "belerick",
        "tier": "A",
        "reason": "Belerick laughs at Saber burst and taunts him."
      }
    ],
    "avoidPicks": [
      "fanny",
      "ling",
      "claude",
      "hayabusa"
    ],
    "recommendedSpell": "Retribution",
    "counterItems": [
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE",
      "TWILIGHT_ARMOR",
      "IMMORTALITY"
    ],
    "tacticalTips": [
      "Saber is the most straightforward counter to hyper-mobile squishies (Fanny, Ling, Claude).",
      "Wind of Nature, Antique Cuirass, or Winter Crown completely counters his single-combo assassination."
    ]
  },
  {
    "id": "alice",
    "avatar": "assets/heroes/alice.png",
    "name": "Alice",
    "role": "Mage",
    "lane": "Mid",
    "damageType": "Magic",
    "difficulty": "Hard",
    "color": "#c084fc",
    "avatarBg": "linear-gradient(135deg, #7e22ce, #c084fc)",
    "skills": {
      "passive": {
        "name": "Blood Ancestry",
        "tag": "Passive • Mage Synergy",
        "desc": "Alice restores 1.5% Max Mana per second, which increases to 3% when in combat against enemy heroes. Each time Alice levels up, her Movement Speed increases by 3 and Healing Received increases by 1%.",
        "counterTip": "Track Alice's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Flowing Blood",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Alice casts a sphere of blood energy in the target direction, dealing 400( +120% Total Magic Power) (Magic Damage) to enemies in its path. (Use Again): Alice immediately teleports to the blood sphere's location.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Blood Awe",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Alice deals 200( +75% Total Magic Power) plus 2.5( )% of the target's Max HP as (Magic Damage) to nearby enemies and immobilizes them for 0.5s. After the immobilize effect ends, the targets will be slowed by 70% for 1.5s. Creeps can only take up to 250 damage from the Max HP-based damage.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Blood Ode",
        "tag": "Ultimate • High Impact",
        "desc": "Alice enters the blood-draining state, consuming 60 Mana while dealing 30( +30% Total Magic Power) (Magic Damage) to nearby enemies every 0.5s. She recovers 40( +30% Total Magic Power) HP each time she damages an enemy hero (only 50% of that HP for other enemy units). Each time this effect damages an enemy hero, the cooldown of (Flowing Blood) is reduced by 0.2s and the cooldown of (Blood Awe) is reduced by 0.5s.",
        "counterTip": "Respect Alice's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Mage Carry",
      "Magic Damage",
      "High Skill Ceiling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "High burst combo deletes squishy immobile marksmen instantly."
      },
      {
        "heroId": "miya",
        "reason": "AoE magic damage out-bursts Miya in early/mid game teamfights."
      }
    ],
    "counteredBy": [
      {
        "heroId": "athenas_shield",
        "tier": "S",
        "reason": "Athena’s Shield absorbs 25% of magic burst, preventing one-shots."
      },
      {
        "heroId": "ling",
        "tier": "S",
        "reason": "Ling wall-jumping bypasses ground skillshots and dives Alice effortlessly."
      },
      {
        "heroId": "saber",
        "tier": "A",
        "reason": "Airborne lock prevents Alice from casting defensive spells."
      }
    ],
    "avoidPicks": [
      "ling",
      "fanny",
      "saber"
    ],
    "recommendedSpell": "Purify / Flicker",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Build Athenas Shield early to dismantle Alice's core kit advantage.",
      "Watch for Alice's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Alice during key objective contests."
    ],
    "secondaryLane": "EXP"
  },
  {
    "id": "balmond",
    "avatar": "assets/heroes/balmond.png",
    "name": "Balmond",
    "role": "Fighter",
    "lane": "EXP",
    "damageType": "Physical",
    "difficulty": "Easy",
    "color": "#f97316",
    "avatarBg": "linear-gradient(135deg, #c2410c, #ea580c)",
    "skills": {
      "passive": {
        "name": "Bloodthirst",
        "tag": "Passive • Fighter Synergy",
        "desc": "Balmond recovers 5% Max HP after killing a Minion or Creep, and 20% Max HP after killing a hero.",
        "counterTip": "Track Balmond's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Soul Lock",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Balmond charges in the target direction for a set distance or until he hits an enemy hero, dealing 150( +60% Total Physical Attack) (Physical Damage) to enemies along the way. The enemy hero hit will be knocked back slightly and slowed by 60% for 2s.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Cyclone Sweep",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Balmond gains 15% Movement Speed that decays over time and spins with his axe for 3s, dealing 25( +25% Total Physical Attack) (Physical Damage) per hit to nearby enemies up to 14 times. Each subsequent hit on the same enemy will deal 7.5% increased damage (up to 60%). The Physical Attack bonus portion of the damage can Crit.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Lethal Counter",
        "tag": "Ultimate • High Impact",
        "desc": "Balmond unleashes a huge strike in the target direction (cannot be interrupted), dealing (True Damage) equal to 150( +70% Total Physical Attack) plus 30% of the target's lost HP. This skill only deals up to 1000 damage to non-hero units.",
        "counterTip": "Respect Balmond's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Fighter Carry",
      "Physical Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "alucard",
        "reason": "Sustained frontline presence out-trades in close quarter duels."
      },
      {
        "heroId": "zilong",
        "reason": "Absorbs initial charge and overpowers in prolonged trades."
      }
    ],
    "counteredBy": [
      {
        "heroId": "dominance_ice",
        "tier": "S",
        "reason": "Dominance Ice cuts lifesteal and shield regeneration by 50%."
      },
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Constant knockbacks and slow firewall kite Balmond endlessly."
      },
      {
        "heroId": "baxia",
        "tier": "A",
        "reason": "Inherent anti-heal passive and mobility neutralize sustain."
      }
    ],
    "avoidPicks": [
      "valir",
      "karrie",
      "baxia"
    ],
    "recommendedSpell": "Flicker / Vengeance",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Balmond's core kit advantage.",
      "Watch for Balmond's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Balmond during key objective contests."
    ],
    "secondaryLane": "Jungle"
  },
  {
    "id": "miya",
    "avatar": "assets/heroes/miya.png",
    "name": "Miya",
    "role": "Marksman",
    "lane": "Gold",
    "damageType": "Physical",
    "difficulty": "Easy",
    "color": "#fbbf24",
    "avatarBg": "linear-gradient(135deg, #d97706, #f59e0b)",
    "skills": {
      "passive": {
        "name": "Moon Blessing",
        "tag": "Passive • Marksman Synergy",
        "desc": "Each time Miya hits a target with her Basic Attack, she gains 5% Attack Speed for 4s. Stacks up to 5 times. After reaching full stacks, Miya summons a (Moonlight Shadow) with each Basic Attack that deals 30( +30% Total Physical Attack) (Physical Damage) and inherits a portion of Attack Effects.",
        "counterTip": "Track Miya's passive triggers; avoid extended trades while the passive effect is active."
      },
      "skill1": {
        "name": "Moon Arrow",
        "tag": "Skill 1 • Poke / Damage",
        "desc": "Miya shoots two extra arrows with each Basic Attack, dealing 10( +100% Total Physical Attack) (Physical Damage) to the target enemy and 30% damage to nearby targets. This effect lasts 4s. Each extra arrow inherits a portion of Attack Effects.",
        "counterTip": "Side-step the skill projectile or maintain safe distance in lane."
      },
      "skill2": {
        "name": "Arrow of Eclipse",
        "tag": "Skill 2 • Utility / Mobility",
        "desc": "Miya launches an empowered arrow on the target area, dealing 270( +45% Total Physical Attack) (Physical Damage) to enemies within and immobilizing them for 1.2s. The arrow then splits into 8 scattering minor arrows, each dealing 30( +15% Total Physical Attack) (Physical Damage) to the first enemy hit and slowing them by 30% for 2s.",
        "counterTip": "Bait out this skill before committing your main burst combo."
      },
      "ultimate": {
        "name": "Hidden Moonlight",
        "tag": "Ultimate • High Impact",
        "desc": "Miya removes all debuffs on her and conceals herself, gaining 35% extra Movement Speed. This state lasts 2s or until she launches an attack. Miya gains full stacks of (Moon Blessing) upon leaving the state.",
        "counterTip": "Respect Miya's ultimate cooldown. Use defensive active items or crowd control to interrupt."
      }
    },
    "tags": [
      "Marksman Carry",
      "Physical Damage",
      "Reliable Scaling"
    ],
    "powerSpikes": {
      "early": 2,
      "mid": 4,
      "late": 5
    },
    "counters": [
      {
        "heroId": "tigreal",
        "reason": "Can out-range and kite Tigreal outside his melee engage radius."
      },
      {
        "heroId": "hylos",
        "reason": "High DPS melts Hylos HP pool from safe distance."
      }
    ],
    "counteredBy": [
      {
        "heroId": "saber",
        "tier": "S",
        "reason": "Instant point-and-click lock on airborne deletes Miya before repositioning."
      },
      {
        "heroId": "blade_armor",
        "tier": "S",
        "reason": "Blade Armor reflects basic attack physical damage right back."
      },
      {
        "heroId": "khufra",
        "tier": "A",
        "reason": "Bouncing Ball and Tyrants Rage halt escape dashes."
      }
    ],
    "avoidPicks": [
      "saber",
      "khufra",
      "fanny"
    ],
    "recommendedSpell": "Flicker / Vengeance",
    "counterItems": [
      "BLADE_ARMOR",
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE"
    ],
    "tacticalTips": [
      "Build Blade Armor early to dismantle Miya's core kit advantage.",
      "Watch for Miya's ultimate cooldown before initiating a full 5v5 teamfight.",
      "Coordinate crowd control to shut down Miya during key objective contests."
    ]
  },
  {
    "id": "zhuxin",
    "name": "Zhuxin",
    "role": "Mage",
    "lane": "Mid",
    "damageType": "Magic",
    "difficulty": "Medium",
    "color": "#c084fc",
    "avatarBg": "linear-gradient(135deg, #7e22ce, #c084fc)",
    "skills": {
      "passive": {
        "name": "Crimson Butterflies",
        "tag": "Passive • Mana & Shield Conversion",
        "desc": "Zhuxin converts spent Mana into Crimson Butterflies that dance around her, restoring Mana and generating a protective shield when airborne.",
        "counterTip": "Bait out her lantern channeling before jumping in; without mana, she loses her shielding and sustained air control."
      },
      "skill1": {
        "name": "Fluttering Grace",
        "tag": "Skill 1 • AoE Slow & Butterfly Marks",
        "desc": "Zhuxin sends butterflies in a target direction, dealing Magic Damage and applying stacks of Crimson Snare that heavily slow targets.",
        "counterTip": "Avoid clustering in tight choke points to prevent multiple members from taking simultaneous snare stacks."
      },
      "skill2": {
        "name": "Lantern Flare",
        "tag": "Skill 2 • Continuous Channel & Airborne Throw",
        "desc": "Zhuxin channels her spirit lantern, draining Mana to continuously damage and lift enemies into the air, throwing them to target location after max stacks.",
        "counterTip": "Use crowd control (stun, silence, suppress) immediately to break her channel before she reaches 10 butterfly stacks."
      },
      "ultimate": {
        "name": "Crimson Beacon",
        "tag": "Ultimate • Blink & Flying Storm Field",
        "desc": "Zhuxin blinks to a target location and takes flight, gaining a massive shield and movement speed while generating an expanding butterfly field that damages enemies.",
        "counterTip": "Build Radiant Armor or Athena’s Shield to mitigate the multi-hit damage from her flight field."
      }
    },
    "tags": [
      "Sustained Airborne",
      "Continuous AoE",
      "Zoning Control"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "tigreal",
        "reason": "Can continuously lift and disrupt Tigreal setups before he can ult."
      },
      {
        "heroId": "estes",
        "reason": "Constant airborne throwing separates Estes from his healing circle."
      },
      {
        "heroId": "balmond",
        "reason": "Interrupts Balmond Cyclone Sweep channel with repeated airborne throws."
      }
    ],
    "counteredBy": [
      {
        "heroId": "saber",
        "tier": "S",
        "reason": "Instant lock-on airborne deletes Zhuxin before she can channel Lantern Flare."
      },
      {
        "heroId": "lolita",
        "tier": "S",
        "reason": "Shield blocks butterfly projectiles and stun halts her continuous channeling."
      },
      {
        "heroId": "chou",
        "tier": "A",
        "reason": "Immunity kicks directly through butterfly slows to isolate and burst her."
      }
    ],
    "avoidPicks": [
      "tigreal",
      "hylos",
      "balmond"
    ],
    "recommendedSpell": "Flicker / Purify",
    "counterItems": [
      "RADIANT_ARMOR",
      "ATHENAS_SHIELD",
      "TOUGH_BOOTS"
    ],
    "tacticalTips": [
      "Break her Lantern Flare channeling with instant stuns or knockups.",
      "Radiant Armor severely diminishes her continuous tick damage.",
      "Keep spread out so she cannot lift multiple heroes simultaneously."
    ],
    "avatar": "assets/heroes/zhuxin.png"
  },
  {
    "id": "suyou",
    "name": "Suyou",
    "role": "Assassin",
    "lane": "Jungle",
    "secondaryLane": "EXP",
    "damageType": "Physical",
    "difficulty": "Hard",
    "color": "#38bdf8",
    "avatarBg": "linear-gradient(135deg, #0284c7, #38bdf8)",
    "skills": {
      "passive": {
        "name": "Transient Immortal",
        "tag": "Passive • Stance Shift Nuo Power",
        "desc": "Suyou harnesses mortal and immortal forms. Tap-casting skills triggers swift mortal agility, while hold-casting channels the immortal Nuo deity for heavy damage and damage reduction.",
        "counterTip": "Watch his casting posture: when he holds skills, he gains damage reduction; stun him before he releases his hold."
      },
      "skill1": {
        "name": "Blade Surge",
        "tag": "Skill 1 • Dash & Immortal Strike",
        "desc": "Tap: Dashes forward slashing enemies. Hold: Leaps forward slamming the ground with immortal strength, stunning the first enemy hero hit.",
        "counterTip": "Side-step his straight-line leap trajectory or interrupt the windup with hard CC."
      },
      "skill2": {
        "name": "Soul Sever",
        "tag": "Skill 2 • Fan Cleave & Multi-Slash",
        "desc": "Tap: Sweeps his blade dealing physical damage in a frontal arc. Hold: Unleashes a flurry of rapid slashes in front of him, healing based on damage dealt.",
        "counterTip": "Build Dominance Ice or Sea Halberd to cut his hold-cleave healing in half."
      },
      "ultimate": {
        "name": "Evil Queller",
        "tag": "Ultimate • Backward Glide & Heavy Piercing Shot",
        "desc": "Tap: Glides backward while shooting arrows forward. Hold: Charges a massive divine Nuo arrow that pierces through all enemies for devastating burst.",
        "counterTip": "Use Wind of Nature when he releases the charged arrow to absorb the massive physical burst."
      }
    },
    "tags": [
      "Dual Stance",
      "Burst / Mobility",
      "Hold-Cast Mechanics"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 5,
      "late": 4
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "Dual dashes effortlessly bridge distance and delete immobile marksmen."
      },
      {
        "heroId": "gord",
        "reason": "Blinks straight through Gord stun and channels immortal cleave."
      },
      {
        "heroId": "hanabi",
        "reason": "Hold-cleave cuts straight through Hanabi shield and locks her down."
      }
    ],
    "counteredBy": [
      {
        "heroId": "khufra",
        "tier": "S",
        "reason": "Bouncing Ball shuts down both tap-dashes and hold-leaps."
      },
      {
        "heroId": "franco",
        "tier": "S",
        "reason": "Iron Hook and Suppression bypass his immortal damage reduction."
      },
      {
        "heroId": "minsitthar",
        "tier": "A",
        "reason": "King's Calling grounds Suyou completely, disabling mortal mobility."
      }
    ],
    "avoidPicks": [
      "layla",
      "gord",
      "miya"
    ],
    "recommendedSpell": "Retribution / Flicker",
    "counterItems": [
      "ANTIQUE_CUIRASS",
      "BLADE_ARMOR",
      "DOMINANCE_ICE"
    ],
    "tacticalTips": [
      "Grounding effects from Minsitthar completely lock him out of both stances.",
      "Buy Antique Cuirass to reduce his skill-based physical scaling by 12%.",
      "Anticipate hold-skill windups and sidestep the linear hitboxes."
    ],
    "avatar": "assets/heroes/suyou.png"
  },
  {
    "id": "lukas",
    "name": "Lukas",
    "role": "Fighter",
    "lane": "EXP",
    "damageType": "Physical",
    "difficulty": "Medium",
    "color": "#f97316",
    "avatarBg": "linear-gradient(135deg, #c2410c, #ea580c)",
    "skills": {
      "passive": {
        "name": "Sacred Energy",
        "tag": "Passive • Beast Energy Stacking",
        "desc": "Lukas accumulates Sacred Energy through combat and taking damage. At full energy, he can trigger his Sacred Beast transformation.",
        "counterTip": "Disengage when his energy bar turns glowing gold to deny him optimal transformation timing."
      },
      "skill1": {
        "name": "Flash Step",
        "tag": "Skill 1 • Forward Thrust & Slash",
        "desc": "Lukas lunges forward dealing physical damage and gaining movement speed. In beast form, becomes a ferocious pounce that knocks enemies back.",
        "counterTip": "Keep distance near walls to avoid getting knocked into teamfights."
      },
      "skill2": {
        "name": "Unleashed Fury",
        "tag": "Skill 2 • Defensive Shield & Cleave",
        "desc": "Lukas roars gaining a damage absorption shield and cleaves in an area, slowing nearby enemies.",
        "counterTip": "Bait out the shield before using high burst abilities."
      },
      "ultimate": {
        "name": "Sacred Beast Transformation",
        "tag": "Ultimate • Beast Mode & Enhanced Skills",
        "desc": "Lukas unleashes the sacred beast within, expanding in size, gaining huge Max HP, CC resilience, and empowering all his skills into devastating feral attacks.",
        "counterTip": "Kite backwards when he transforms; build Demon Hunter Sword to shred his boosted Max HP."
      }
    },
    "tags": [
      "Transformation",
      "Frontline Brawler",
      "High Sustain"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 5
    },
    "counters": [
      {
        "heroId": "alucard",
        "reason": "Beast form CC resilience and knockback overpowers Alucard duels."
      },
      {
        "heroId": "zilong",
        "reason": "High shield and roar absorbs Zilong burst flip effortlessly."
      },
      {
        "heroId": "sun",
        "reason": "AoE beast slashes wipe Sun clones instantly while generating energy."
      }
    ],
    "counteredBy": [
      {
        "heroId": "karrie",
        "tier": "S",
        "reason": "True damage shreds through his immense beast HP and defensive shields."
      },
      {
        "heroId": "valir",
        "tier": "S",
        "reason": "Constant knockbacks and fireballs kite him endlessly even in beast mode."
      },
      {
        "heroId": "baxia",
        "tier": "A",
        "reason": "Anti-heal passive cuts through his sustain and roll counters his lunges."
      }
    ],
    "avoidPicks": [
      "alucard",
      "zilong",
      "sun"
    ],
    "recommendedSpell": "Vengeance / Flicker",
    "counterItems": [
      "DOMINANCE_ICE",
      "BLADE_ARMOR",
      "DEMON_HUNTER_SWORD"
    ],
    "tacticalTips": [
      "Pick % HP True Damage heroes (Karrie) to bypass his massive beast HP pool.",
      "Kite out his beast duration rather than facetanking his empowered slashes.",
      "Apply anti-heal early to reduce his combat health recovery."
    ],
    "avatar": "assets/heroes/lukas.png"
  },
  {
    "id": "kalea",
    "name": "Kalea",
    "role": "Support",
    "lane": "Roam",
    "damageType": "Magic",
    "difficulty": "Medium",
    "color": "#06b6d4",
    "avatarBg": "linear-gradient(135deg, #0891b2, #06b6d4)",
    "skills": {
      "passive": {
        "name": "Coral Blessing",
        "tag": "Passive • Water Barrier Aura",
        "desc": "Kalea grants nearby allies protective coral shields whenever she casts abilities, absorbing incoming damage and boosting movement speed.",
        "counterTip": "Burst her allies after the coral shields decay or poke from outside her aura range."
      },
      "skill1": {
        "name": "Wave Surge",
        "tag": "Skill 1 • Tidal Wave Slow",
        "desc": "Sends out rolling tidal waves that deal Magic Damage and slow enemy movement speed by 40%.",
        "counterTip": "Use Tough Boots to reduce the slow duration and sidestep the wave."
      },
      "skill2": {
        "name": "Tidal Shell",
        "tag": "Skill 2 • Ally Cleanse & Barrier",
        "desc": "Encases target ally in a protective bubble that purifies movement-impairing effects and absorbs burst damage.",
        "counterTip": "Bait out the bubble before committing your main CC chain."
      },
      "ultimate": {
        "name": "Abyssal Vortex",
        "tag": "Ultimate • Area Whirlpool Suction",
        "desc": "Creates a massive ocean whirlpool that pulls enemies toward the center, dealing continuous magic damage and grounding those trapped inside.",
        "counterTip": "Flicker out immediately before the center whirlpool collapses."
      }
    },
    "tags": [
      "Ally Shielding",
      "AoE Crowd Control",
      "Purify Utility"
    ],
    "powerSpikes": {
      "early": 2,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "tigreal",
        "reason": "Tidal Shell cleanses allies right out of Tigreal setup."
      },
      {
        "heroId": "atlas",
        "reason": "Whirlpool interrupts Atlas ejection and keeps team safe."
      },
      {
        "heroId": "franco",
        "reason": "Coral shields mitigate follow-up burst from hooks."
      }
    ],
    "counteredBy": [
      {
        "heroId": "esmeralda",
        "tier": "S",
        "reason": "Absorbs all coral shields Kalea gives to her team as free HP."
      },
      {
        "heroId": "baxia",
        "tier": "A",
        "reason": "Rolls past waves and applies anti-shield debuffs."
      },
      {
        "heroId": "saber",
        "tier": "A",
        "reason": "Deletes Kalea instantly before she can cast Abyssal Vortex."
      }
    ],
    "avoidPicks": [
      "tigreal",
      "atlas"
    ],
    "recommendedSpell": "Flicker / Revitalize",
    "counterItems": [
      "ATHENAS_SHIELD",
      "TOUGH_BOOTS",
      "DOMINANCE_ICE"
    ],
    "tacticalTips": [
      "Pick Esmeralda to turn her team-wide shields into your own unlimited health pool.",
      "Save dashes to escape the Abyssal Vortex pull area.",
      "Focus Kalea first in teamfights to deny her ally cleanse bubble."
    ],
    "avatar": "assets/heroes/kalea.png"
  },
  {
    "id": "zetian",
    "name": "Zetian",
    "role": "Mage",
    "lane": "Mid",
    "damageType": "Magic",
    "difficulty": "Hard",
    "color": "#e11d48",
    "avatarBg": "linear-gradient(135deg, #9f1239, #e11d48)",
    "skills": {
      "passive": {
        "name": "Imperial Decree",
        "tag": "Passive • Authority Marks",
        "desc": "Damaging enemies with skills marks them with Imperial Authority. Detonating 3 marks deals bonus magic damage and silences the target for 1s.",
        "counterTip": "Avoid trading prolonged skill hits to prevent the 1-second silence detonation."
      },
      "skill1": {
        "name": "Heavenly Strike",
        "tag": "Skill 1 • Scepter Beam Poke",
        "desc": "Fires a piercing celestial beam forward that deals heavy Magic Damage to all enemies in its path.",
        "counterTip": "Watch her scepter glow; sidestep the narrow linear hitbox."
      },
      "skill2": {
        "name": "Dragon Ward",
        "tag": "Skill 2 • Repel & Stun Barrier",
        "desc": "Summons royal dragon barriers around herself that knock back approaching enemies and grant a magic defense boost.",
        "counterTip": "Do not jump in recklessly; wait for her Dragon Ward to be on cooldown before diving."
      },
      "ultimate": {
        "name": "Sovereign Domain",
        "tag": "Ultimate • Massive Celestial Bombardment",
        "desc": "Zetian commands an orbital celestial bombardment over an enormous circular zone, raining down continuous golden meteors that stun and obliterate enemies.",
        "counterTip": "Use Athena’s Shield or Radiant Armor; step out of the golden perimeter immediately."
      }
    },
    "tags": [
      "Long Range Poke",
      "Silence / Repel",
      "Teamfight Artillery"
    ],
    "powerSpikes": {
      "early": 2,
      "mid": 4,
      "late": 5
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "Outranges and obliterates immobile marksmen with celestial beam."
      },
      {
        "heroId": "estes",
        "reason": "Imperial Decree silence stops Estes from casting healing ultimate."
      },
      {
        "heroId": "cecilion",
        "reason": "Dragon Ward repels Cecilion bats and out-bursts in late game."
      }
    ],
    "counteredBy": [
      {
        "heroId": "ling",
        "tier": "S",
        "reason": "Ling walls bypass her ground zoning and Tempest of Blades dodges bombardment."
      },
      {
        "heroId": "fanny",
        "tier": "S",
        "reason": "Cables past the Dragon Ward to burst her before beam winds up."
      },
      {
        "heroId": "lolita",
        "tier": "A",
        "reason": "Guardian shield absorbs Heavenly Strike beams."
      }
    ],
    "avoidPicks": [
      "layla",
      "estes",
      "hanabi"
    ],
    "recommendedSpell": "Flicker / Purify",
    "counterItems": [
      "ATHENAS_SHIELD",
      "RADIANT_ARMOR",
      "ROSE_GOLD_METEOR"
    ],
    "tacticalTips": [
      "Pick high mobility assassins (Ling, Fanny, Joy) to flank her from behind.",
      "Radiant Armor mitigates the multi-hit meteor damage from Sovereign Domain.",
      "Bait out Dragon Ward knockback before committing melee gap-closers."
    ],
    "avatar": "assets/heroes/zetian.png"
  },
  {
    "id": "obsidia",
    "name": "Obsidia",
    "role": "Marksman",
    "lane": "Gold",
    "damageType": "Physical",
    "difficulty": "Medium",
    "color": "#a855f7",
    "avatarBg": "linear-gradient(135deg, #6b21a8, #a855f7)",
    "skills": {
      "passive": {
        "name": "Void Shards",
        "tag": "Passive • Shard Detonation & Armor Shred",
        "desc": "Basic attacks embed dark crystal shards in targets. Upon 4 shards, the crystal detonates dealing bonus physical damage and shredding target armor by 25%.",
        "counterTip": "Disengage when 3 shards are stacked to let the crystal mark expire before detonation."
      },
      "skill1": {
        "name": "Crystal Barrage",
        "tag": "Skill 1 • Piercing Shard Volley",
        "desc": "Fires a fan of 5 void crystals that pierce through minions and deal physical damage to heroes.",
        "counterTip": "Hide behind frontline tanks who can absorb the fan barrage."
      },
      "skill2": {
        "name": "Shadow Glide",
        "tag": "Skill 2 • Quick Dash & Range Boost",
        "desc": "Dashes a short distance into shadow, enhancing her next 2 basic attacks with +100 Attack Range and bonus movement speed.",
        "counterTip": "Track her dash cooldown; she is vulnerable to dive for 6 seconds after using Shadow Glide."
      },
      "ultimate": {
        "name": "Dark Star Cataclysm",
        "tag": "Ultimate • Void Singularity Explosion",
        "desc": "Launches a void orb that creates an expanding dark star. After 1.5s, detonates pulling in all enemies and dealing massive physical burst.",
        "counterTip": "Flicker or dash away from the expanding singularity before the 1.5s collapse."
      }
    },
    "tags": [
      "Armor Shred",
      "AOE Pull",
      "Range Enhancement"
    ],
    "powerSpikes": {
      "early": 2,
      "mid": 4,
      "late": 5
    },
    "counters": [
      {
        "heroId": "tigreal",
        "reason": "Void Shards shred through high armor and Shadow Glide kites."
      },
      {
        "heroId": "hylos",
        "reason": "Melts high HP tanks easily with shard detonations."
      },
      {
        "heroId": "miya",
        "reason": "Outranges Miya in lane and reveals her with shard markings."
      }
    ],
    "counteredBy": [
      {
        "heroId": "blade_armor",
        "tier": "S",
        "reason": "Blade Armor and Vengeance reflect shard burst right back at her."
      },
      {
        "heroId": "saber",
        "tier": "S",
        "reason": "Instant point-and-click lock on deletes her before she can Shadow Glide."
      },
      {
        "heroId": "khufra",
        "tier": "A",
        "reason": "Bouncing Ball stops Shadow Glide dash and knocks her up."
      }
    ],
    "avoidPicks": [
      "hylos",
      "tigreal",
      "uranus"
    ],
    "recommendedSpell": "Inspire / Flicker",
    "counterItems": [
      "BLADE_ARMOR",
      "WIND_OF_NATURE",
      "ANTIQUE_CUIRASS"
    ],
    "tacticalTips": [
      "Buy Blade Armor to punish her multi-hit basic attack speed.",
      "Use Wind of Nature to become immune to the Dark Star Cataclysm physical burst.",
      "Dive her aggressively in the early game before her armor-shred scaling kicks in."
    ],
    "avatar": "assets/heroes/obsidia.png"
  },
  {
    "id": "sora",
    "name": "Sora",
    "role": "Assassin",
    "lane": "Jungle",
    "damageType": "Physical",
    "difficulty": "Hard",
    "color": "#38bdf8",
    "avatarBg": "linear-gradient(135deg, #0369a1, #38bdf8)",
    "skills": {
      "passive": {
        "name": "Windstrike Mastery",
        "tag": "Passive • Aerial Agility & Armor Penetration",
        "desc": "Moving builds Gale Stacks. At full stacks, Sora’s next basic attack teleports him behind the target dealing bonus damage with +30% Physical Penetration.",
        "counterTip": "Do not face backward when fighting him; anticipate his teleport behind you."
      },
      "skill1": {
        "name": "Gale Dash",
        "tag": "Skill 1 • Dual Rapid Slashes",
        "desc": "Dashes through enemies, leaving a wind trail that accelerates allies and allows a second free cast within 3s.",
        "counterTip": "Interrupt his second cast with hard CC before he can execute his combo."
      },
      "skill2": {
        "name": "Tempest Slash",
        "tag": "Skill 2 • Whirlwind Knockup",
        "desc": "Spins his blades creating a whirlwind that knocks up nearby enemies for 0.8s and grants physical lifesteal.",
        "counterTip": "Keep distance to avoid the whirlwind circle radius."
      },
      "ultimate": {
        "name": "Skybound Execution",
        "tag": "Ultimate • Airborne Lock & Downward Slam",
        "desc": "Locks onto an enemy hero and leaps into the clouds with them, becoming untargetable before slamming them into the earth for massive damage based on lost HP.",
        "counterTip": "Use Winter Crown or WoN just as he initiates the dive to negate the downward slam damage."
      }
    },
    "tags": [
      "Airborne Lockdown",
      "High Mobility",
      "Finisher Burst"
    ],
    "powerSpikes": {
      "early": 4,
      "mid": 5,
      "late": 3
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "Gale Dash closes distance instantly and skybound execution deletes."
      },
      {
        "heroId": "gord",
        "reason": "Teleports behind Gord laser and knocks up with Tempest Slash."
      },
      {
        "heroId": "hanabi",
        "reason": "Fast combo wipes Hanabi before she can stack bounce attacks."
      }
    ],
    "counteredBy": [
      {
        "heroId": "khufra",
        "tier": "S",
        "reason": "Bouncing Ball shuts down Gale Dash dashes and interrupts him."
      },
      {
        "heroId": "franco",
        "tier": "S",
        "reason": "Suppresses Sora the instant he lands from his ultimate."
      },
      {
        "heroId": "ruby",
        "tier": "A",
        "reason": "Endless hooks and scythe pulls disrupt his windstrike agility."
      }
    ],
    "avoidPicks": [
      "layla",
      "gord",
      "miya"
    ],
    "recommendedSpell": "Retribution / Flicker",
    "counterItems": [
      "ANTIQUE_CUIRASS",
      "WIND_OF_NATURE",
      "BLADE_ARMOR"
    ],
    "tacticalTips": [
      "Pick heroes with suppression (Franco, Kaja) to lock him down right as he lands.",
      "Equip Wind of Nature to survive the Skybound Execution finisher.",
      "Group closely in teamfights so his single-target execution is punished."
    ],
    "avatar": "assets/heroes/sora.png"
  },
  {
    "id": "hirara",
    "name": "Hirara",
    "role": "Fighter",
    "lane": "EXP",
    "damageType": "Physical",
    "difficulty": "Medium",
    "color": "#f43f5e",
    "avatarBg": "linear-gradient(135deg, #be123c, #fb7185)",
    "skills": {
      "passive": {
        "name": "Spirit Blade",
        "tag": "Passive • Blade Petal Lifesteal",
        "desc": "Skills leave spirit cherry petals on the battlefield. Walking over petals heals Hirara and empowers her basic attacks with extra physical reach.",
        "counterTip": "Step on her petals or zone her away from them with ranged poke to deny her healing."
      },
      "skill1": {
        "name": "Phantom Leap",
        "tag": "Skill 1 • Aerial Sword Pounce",
        "desc": "Leaps to target location stabbing her katana into the ground, slowing enemies by 50% and generating 2 petals.",
        "counterTip": "Watch the landing marker and dodge sideways."
      },
      "skill2": {
        "name": "Floral Barrier",
        "tag": "Skill 2 • CC Block & Deflection",
        "desc": "Assumes a parry stance for 0.75s, blocking the next incoming CC effect and countering with a wide slash.",
        "counterTip": "Do not waste your main stun during her defensive parry stance; wait for it to drop."
      },
      "ultimate": {
        "name": "Sakura Storm",
        "tag": "Ultimate • 360 Blossom Whirlwind",
        "desc": "Hirara dashes forward unleashing an explosive blossom storm that deals multi-hit physical damage and grants crowd control immunity for 2s.",
        "counterTip": "Disengage during the 2s storm; re-engage with burst immediately after."
      }
    },
    "tags": [
      "Parry Stance",
      "Petal Sustain",
      "AoE Blossom Strike"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "chou",
        "reason": "Floral Barrier blocks Chou kick and counters with slash."
      },
      {
        "heroId": "saber",
        "reason": "Can parry Saber airborne ult and heal with petal stacks."
      },
      {
        "heroId": "paquito",
        "reason": "Sustain from petals out-trades Paquito sustained boxing."
      }
    ],
    "counteredBy": [
      {
        "heroId": "baxia",
        "tier": "S",
        "reason": "Anti-heal cuts petal recovery by 50% and rolls counter her leap."
      },
      {
        "heroId": "karrie",
        "tier": "S",
        "reason": "True damage shreds through her parry and lifesteal sustain."
      },
      {
        "heroId": "valir",
        "tier": "A",
        "reason": "Knocks her away before she can collect ground petals."
      }
    ],
    "avoidPicks": [
      "chou",
      "saber",
      "alucard"
    ],
    "recommendedSpell": "Vengeance / Flicker",
    "counterItems": [
      "DOMINANCE_ICE",
      "BLADE_ARMOR",
      "SEA_HALBERD"
    ],
    "tacticalTips": [
      "Buy Dominance Ice immediately to stop her petal lifesteal.",
      "Bait out Floral Barrier before casting your primary CC abilities.",
      "Kite her away from scattered petals to deny her combat sustain."
    ],
    "avatar": "assets/heroes/hirara.png"
  },
  {
    "id": "ken",
    "name": "Ken",
    "role": "Tank",
    "lane": "Roam",
    "damageType": "Physical",
    "difficulty": "Easy",
    "color": "#84cc16",
    "avatarBg": "linear-gradient(135deg, #4d7c0f, #84cc16)",
    "skills": {
      "passive": {
        "name": "Iron Resolve",
        "tag": "Passive • Fortified Armor Stacking",
        "desc": "Taking damage increases Physical and Magic Defense by 4% per stack, up to 10 stacks (40% total defense bonus).",
        "counterTip": "Use True Damage or high penetration items to bypass his stacking defense bonuses."
      },
      "skill1": {
        "name": "Heavy Slam",
        "tag": "Skill 1 • Ground Slam & Stun",
        "desc": "Slams his fortified shield down, dealing Physical Damage based on his Max HP and stunning enemies for 1s.",
        "counterTip": "Keep spaced apart to avoid getting hit by the AoE ground stun."
      },
      "skill2": {
        "name": "Fortified Charge",
        "tag": "Skill 2 • Shield Rush & Knockback",
        "desc": "Charges forward knocking back all enemies caught in his path and granting a movement speed boost to allies behind him.",
        "counterTip": "Use dashes sideways to dodge the linear charge path."
      },
      "ultimate": {
        "name": "Earthshaker Fortress",
        "tag": "Ultimate • Earth Wall Enclosure & Tremor",
        "desc": "Ken leaps and erects stone barriers around a targeted area, trapping enemies inside for 3.5s while emitting continuous earth tremors.",
        "counterTip": "Use Flicker or blink abilities to jump over the stone walls."
      }
    },
    "tags": [
      "Terrain Creation",
      "High Defense Stacks",
      "Frontline Initiator"
    ],
    "powerSpikes": {
      "early": 3,
      "mid": 4,
      "late": 4
    },
    "counters": [
      {
        "heroId": "layla",
        "reason": "Traps immobile marksmen in earth walls and slams."
      },
      {
        "heroId": "miya",
        "reason": "Fortified charge knocks Miya out of position and blocks basic attacks."
      },
      {
        "heroId": "hanabi",
        "reason": "High defense stacks absorb Hanabi bounce attacks effortlessly."
      }
    ],
    "counteredBy": [
      {
        "heroId": "karrie",
        "tier": "S",
        "reason": "Lightwheel true damage shreds his 40% defense stacks instantly."
      },
      {
        "heroId": "lunox",
        "tier": "S",
        "reason": "Chaos magic penetration melts his high armor fortress."
      },
      {
        "heroId": "fanny",
        "tier": "A",
        "reason": "Fanny uses his earth walls to cable rapidly for infinite energy."
      }
    ],
    "avoidPicks": [
      "layla",
      "miya",
      "hanabi"
    ],
    "recommendedSpell": "Flicker / Petrify",
    "counterItems": [
      "DEMON_HUNTER_SWORD",
      "MALEFIC_ROAR",
      "DIVINE_GLAIVE"
    ],
    "tacticalTips": [
      "Pick heroes who can blink or dash over terrain walls (Fanny, Claude, Wanwan).",
      "Equip Malefic Roar or Divine Glaive to pierce his high stacking defense values.",
      "True Damage dealers (Karrie, Lesley) completely bypass his Iron Resolve passive."
    ],
    "avatar": "assets/heroes/ken.png"
  }
];

const MLBB_STRATEGY_GUIDES = {
  ANTI_DASH: {
    id: 'anti_dash',
    avatar: 'assets/heroes/anti_dash.png',
    title: 'Anti-Dash & Mobility Lockdown',
    desc: 'Against hyper-mobile assassins like Fanny, Ling, Joy, Wanwan, and Lancelot.',
    keyHeroes: ['minsitthar', 'khufra', 'phoveus', 'franco', 'saber'],
    rules: [
      'Minsitthar King’s Calling disables all blink & dash abilities entirely inside the arena.',
      'Khufra Bouncing Ball halts all dashes and knocks the enemy up.',
      'Phoveus turns enemy dashes into personal ultimate teleports and shields.',
      'Franco provides unbreakable Suppression that cannot be cleansed by Purify.'
    ]
  },
  ANTI_HEAL_SUSTAIN: {
    id: 'anti_heal',
    avatar: 'assets/heroes/anti_heal.png',
    title: 'Anti-Heal & Shield Breaker',
    desc: 'Against sustain monsters and healers like Estes, Esmeralda, Ruby, and Yu Zhong.',
    keyHeroes: ['baxia', 'dyrroth', 'karrie', 'valir'],
    rules: [
      'Baxia passive provides 50% continuous anti-heal; stacks with Dominance Ice to shut down healing completely.',
      'Dominance Ice (Tanks/Fighters), Sea Halberd (Marksmen/Assassins), and Glowing Wand (Mages) are mandatory first items.',
      'Dyrroth shreds 75% physical defense, melting high-armor sustain fighters before they can recover.',
      'Karrie true damage bypasses shields and high health bars.'
    ]
  },
  ANTI_WOMBO_COMBO: {
    id: 'anti_wombo',
    avatar: 'assets/heroes/anti_wombo.png',
    title: 'Anti-Wombo Combo & Setter Neutralizers',
    desc: 'Against heavy 5-man initiation setters like Atlas, Tigreal, Guinevere, and Minotaur.',
    keyHeroes: ['diggie', 'valentina', 'valir', 'kagura'],
    rules: [
      'Diggie Time Journey grants teamwide CC immunity and massive shields, turning 5-man sets into free counter-attacks.',
      'Valentina steals the enemy ultimate and uses it back against them with amplified magic damage.',
      'Purify battle spell is essential on squishy carries when Diggie is banned.'
    ]
  }
};


// Synthesized Web Audio API Sound Effects for Esports Feel

class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('mlbb_counter_sound_muted') === 'true';
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  isMuted() {
    return this.muted;
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('mlbb_counter_sound_muted', this.muted);
    return this.muted;
  }

  playHover() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.025, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {}
  }

  playSelect() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1040, this.ctx.currentTime + 0.09);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch (e) {}
  }

  playLockIn() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      // Rich two-tone cyber chord
      [587.33, 880, 1174.66].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + (i * 0.04));

        gain.gain.setValueAtTime(0.05, this.ctx.currentTime + (i * 0.04));
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + (i * 0.04));
        osc.stop(this.ctx.currentTime + 0.35);
      });
    } catch (e) {}
  }

  playTierS() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      // High-impact power fanfare
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + (i * 0.05));

        gain.gain.setValueAtTime(0.04, this.ctx.currentTime + (i * 0.05));
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + (i * 0.05));
        osc.stop(this.ctx.currentTime + 0.4);
      });
    } catch (e) {}
  }
}

const soundFX = new SoundFX();


// MLBB Counter Calculation & Draft Analysis Engine


class CounterEngine {
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



// Main Application Logic for MLBB Counter-Pick Strategy Assistant




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

})();
