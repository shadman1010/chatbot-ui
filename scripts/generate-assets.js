#!/usr/bin/env node
/**
 * Simple asset generator producing minimal valid PNG files for Expo build.
 * Avoids invalid 0-byte placeholder PNGs that cause Jimp MIME errors in prebuild.
 */
const fs = require('fs');
const path = require('path');

// 1x1 transparent PNG binary (proper PNG signature + IHDR + IDAT + IEND)
const tinyPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=='
const buffer = Buffer.from(tinyPngBase64, 'base64');

const files = [
  'icon.png',
  'adaptive-icon.png',
  'splash.png',
  'favicon.png'
];

const assetsDir = path.join(process.cwd(), 'assets');
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

files.forEach(f => {
  const p = path.join(assetsDir, f);
  fs.writeFileSync(p, buffer);
  console.log(`Wrote minimal PNG: ${p}`);
});

console.log('Asset generation complete. Replace with real branding images later.');
