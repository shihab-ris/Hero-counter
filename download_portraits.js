import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_HEROES } from './data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.join(__dirname, 'assets', 'heroes');
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

// Read the gist JSON
const gistPath = 'C:/Users/Qbits/.gemini/antigravity-ide/brain/294c284d-7810-4cdc-9984-51a4375d14a2/.system_generated/steps/63/content.md';
let data = [];
if (fs.existsSync(gistPath)) {
  const content = fs.readFileSync(gistPath, 'utf8');
  const jsonText = content.substring(content.indexOf('{'));
  data = JSON.parse(jsonText).data || [];
}

console.log(`Loaded ${data.length} heroes from gist.`);

// Create lookup by normalized name
const cdnMap = new Map();
data.forEach(h => {
  const clean = h.hero_name.toLowerCase().replace(/[^a-z0-9]/g, '');
  cdnMap.set(clean, h.portrait);
});

// Fallback high quality portraits from official Fandom wiki for any missing hero
const wikiPortraits = {
  fanny: 'https://static.wikia.nocookie.net/mobile-legends/images/7/7f/Hero171-portrait.png',
  wanwan: 'https://static.wikia.nocookie.net/mobile-legends/images/8/8f/Hero891-portrait.png',
  claude: 'https://static.wikia.nocookie.net/mobile-legends/images/b/b3/Hero651-portrait.png',
  beatrix: 'https://static.wikia.nocookie.net/mobile-legends/images/9/90/Hero1051-portrait.png',
  lesley: 'https://static.wikia.nocookie.net/mobile-legends/images/6/6f/Hero531-portrait.png',
  karrie: 'https://static.wikia.nocookie.net/mobile-legends/images/6/65/Hero401-portrait.png',
  brody: 'https://static.wikia.nocookie.net/mobile-legends/images/9/98/Hero1001-portrait.png',
  moskov: 'https://static.wikia.nocookie.net/mobile-legends/images/2/25/Hero311-portrait.png',
  chou: 'https://static.wikia.nocookie.net/mobile-legends/images/6/6a/Hero261-portrait.png',
  yuzhong: 'https://static.wikia.nocookie.net/mobile-legends/images/9/91/Hero951-portrait.png',
  yu_zhong: 'https://static.wikia.nocookie.net/mobile-legends/images/9/91/Hero951-portrait.png',
  paquito: 'https://static.wikia.nocookie.net/mobile-legends/images/a/a2/Hero1031-portrait.png',
  dyrroth: 'https://static.wikia.nocookie.net/mobile-legends/images/5/52/Hero841-portrait.png',
  terizla: 'https://static.wikia.nocookie.net/mobile-legends/images/2/25/Hero821-portrait.png',
  minsitthar: 'https://static.wikia.nocookie.net/mobile-legends/images/3/30/Hero731-portrait.png',
  esmeralda: 'https://static.wikia.nocookie.net/mobile-legends/images/8/86/Hero811-portrait.png',
  ruby: 'https://static.wikia.nocookie.net/mobile-legends/images/f/fe/Hero291-portrait.png',
  valentina: 'https://static.wikia.nocookie.net/mobile-legends/images/5/50/Hero1101-portrait.png',
  pharsa: 'https://static.wikia.nocookie.net/mobile-legends/images/5/56/Hero521-portrait.png',
  yve: 'https://static.wikia.nocookie.net/mobile-legends/images/7/7f/Hero1041-portrait.png',
  kagura: 'https://static.wikia.nocookie.net/mobile-legends/images/2/29/Hero251-portrait.png',
  kadita: 'https://static.wikia.nocookie.net/mobile-legends/images/7/77/Hero751-portrait.png',
  lunox: 'https://static.wikia.nocookie.net/mobile-legends/images/4/4b/Hero681-portrait.png',
  diggie: 'https://static.wikia.nocookie.net/mobile-legends/images/4/49/Hero461-portrait.png',
  tigreal: 'https://static.wikia.nocookie.net/mobile-legends/images/1/15/Hero061-portrait.png',
  atlas: 'https://static.wikia.nocookie.net/mobile-legends/images/d/d4/Hero931-portrait.png',
  khufra: 'https://static.wikia.nocookie.net/mobile-legends/images/2/2b/Hero781-portrait.png',
  franco: 'https://static.wikia.nocookie.net/mobile-legends/images/3/3d/Hero101-portrait.png',
  estes: 'https://static.wikia.nocookie.net/mobile-legends/images/5/57/Hero341-portrait.png',
  lolita: 'https://static.wikia.nocookie.net/mobile-legends/images/8/87/Hero191-portrait.png',
  belerick: 'https://static.wikia.nocookie.net/mobile-legends/images/0/05/Hero671-portrait.png',
  ling: 'https://static.wikia.nocookie.net/mobile-legends/images/3/35/Hero871-portrait.png',
  hayabusa: 'https://static.wikia.nocookie.net/mobile-legends/images/3/30/Hero211-portrait.png',
  baxia: 'https://static.wikia.nocookie.net/mobile-legends/images/7/75/Hero861-portrait.png',
  fredrinn: 'https://static.wikia.nocookie.net/mobile-legends/images/a/ab/Hero1171-portrait.png',
  saber: 'https://static.wikia.nocookie.net/mobile-legends/images/a/a2/Hero031-portrait.png',
  nolan: 'https://static.wikia.nocookie.net/mobile-legends/images/c/c8/Hero1221-portrait.png',
  joy: 'https://static.wikia.nocookie.net/mobile-legends/images/c/c5/Hero1181-portrait.png',
  phoveus: 'https://static.wikia.nocookie.net/mobile-legends/images/1/1b/Hero1061-portrait.png',
  valir: 'https://static.wikia.nocookie.net/mobile-legends/images/e/e4/Hero571-portrait.png'
};

async function downloadImage(url, destPath) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  const buffer = await res.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(buffer));
}

async function run() {
  const mapping = {};

  for (const hero of INITIAL_HEROES) {
    const cleanName = hero.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    let url = cdnMap.get(cleanName) || cdnMap.get(hero.id.toLowerCase().replace(/[^a-z0-9]/g, '')) || wikiPortraits[hero.id] || wikiPortraits[cleanName];

    const destFile = `${hero.id}.png`;
    const destPath = path.join(ASSETS_DIR, destFile);
    const relativeUrl = `assets/heroes/${destFile}`;

    console.log(`Processing ${hero.name} (${hero.id})...`);

    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
      console.log(`  -> Already exists locally: ${relativeUrl}`);
      mapping[hero.id] = relativeUrl;
      continue;
    }

    if (url) {
      try {
        await downloadImage(url, destPath);
        console.log(`  -> Downloaded from ${url.substring(0, 50)}...`);
        mapping[hero.id] = relativeUrl;
      } catch (err) {
        console.warn(`  -> Download failed: ${err.message}. Trying backup wiki url...`);
        const backupUrl = wikiPortraits[hero.id] || wikiPortraits[cleanName];
        if (backupUrl && backupUrl !== url) {
          try {
            await downloadImage(backupUrl, destPath);
            console.log(`  -> Downloaded backup from ${backupUrl.substring(0, 50)}...`);
            mapping[hero.id] = relativeUrl;
          } catch (e2) {
            console.error(`  -> Backup failed as well: ${e2.message}`);
            mapping[hero.id] = url; // fallback to CDN url
          }
        } else {
          mapping[hero.id] = url; // fallback to CDN url
        }
      }
    } else {
      console.warn(`  -> No URL found for ${hero.name}`);
    }
  }

  // Save mapping to JSON
  fs.writeFileSync(path.join(__dirname, 'hero_images_map.json'), JSON.stringify(mapping, null, 2));
  console.log('Finished! Saved mapping to hero_images_map.json');
}

run();
