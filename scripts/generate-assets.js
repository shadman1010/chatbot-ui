#!/usr/bin/env node
/**
 * Asset generator producing valid PNG images at sensible sizes so Expo prebuild (Jimp) doesn't fail.
 * Requires 'jimp' (dev dependency). Generates simple solid-color placeholders.
 */
const fs = require('fs');
const path = require('path');
let Jimp;
try {
  Jimp = require('jimp');
} catch (e) {
  console.error('\n[generate-assets] Missing peer deps. Run: npm install --save-dev jimp\n');
  process.exit(1);
}

const assetsDir = path.join(process.cwd(), 'assets');
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

async function write(name, img) {
  const file = path.join(assetsDir, name);
  await img.writeAsync(file);
  const { size } = fs.statSync(file);
  console.log(`✔ ${name} (${img.bitmap.width}x${img.bitmap.height}) - ${size} bytes`);
}

(async () => {
  // Colors chosen to match existing theme/splash
  const baseColor = '#121212';
  const accentColor = '#1E88E5';
  const splashColor = '#0F1115';
  const highlight = '#32D583';

  // Helper to draw a centered rounded rect glyph
  const drawGlyph = (img) => {
    const w = img.bitmap.width;
    const h = img.bitmap.height;
    const gw = Math.floor(w * 0.55);
    const gh = Math.floor(h * 0.55);
    const gx = Math.floor((w - gw)/2);
    const gy = Math.floor((h - gh)/2);
    for (let y = gy; y < gy + gh; y++) {
      for (let x = gx; x < gx + gw; x++) {
        // simple rounded corners
        const nx = (x - gx) / gw * 2 - 1;
        const ny = (y - gy) / gh * 2 - 1;
        if (nx*nx + ny*ny > 1.05) continue;
        img.setPixelColor(Jimp.cssColorToHex(accentColor), x, y);
      }
    }
    // Add a small diagonal highlight line
    for (let d = 0; d < Math.min(w,h); d+=Math.max(1,Math.floor(w/128))) {
      const x = d;
      const y = Math.floor(d*0.6);
      if (x < w && y < h) img.setPixelColor(Jimp.cssColorToHex(highlight), x, y);
    }
  };

  // 1024x1024 app icon with glyph
  const icon = new Jimp(1024, 1024, baseColor);
  drawGlyph(icon);
  await write('icon.png', icon);

  // Adaptive icon foreground (clone + slight variation so not identical buffer)
  const adaptive = icon.clone();
  // shift highlight by 1px to change checksum
  adaptive.scan(0,0,adaptive.bitmap.width, adaptive.bitmap.height, (x,y,idx)=>{
    if (x===1 && y < 50) adaptive.setPixelColor(Jimp.cssColorToHex(highlight), x, y);
  });
  await write('adaptive-icon.png', adaptive);

  // Splash (portrait typical high-res iPhone-ish size 1242x2436) with gradient band
  const splash = new Jimp(1242, 2436, splashColor);
  for (let y=0; y < splash.bitmap.height; y++) {
    if (y % 40 === 0) {
      const rowColor = y % 80 === 0 ? accentColor : baseColor;
      for (let x=0; x < splash.bitmap.width; x+=2) {
        splash.setPixelColor(Jimp.cssColorToHex(rowColor), x, y);
      }
    }
  }
  await write('splash.png', splash);

  // Favicon 64x64 with mini glyph
  const favicon = new Jimp(64, 64, baseColor);
  drawGlyph(favicon);
  await write('favicon.png', favicon);

  console.log('\nAsset generation complete. Replace with real branding images when ready.');
})().catch(err => {
  console.error('Failed to generate assets:', err);
  process.exit(1);
});
