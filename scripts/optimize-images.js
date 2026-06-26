/**
 * Image Optimization Script
 * Converts images to WebP format, resizes for web, and compresses.
 *
 * Usage: node scripts/optimize-images.js [--input ./raw-images] [--output ./public/media]
 *
 * Defaults:
 *   Input:  ./raw-images/
 *   Output: ./public/media/
 */

import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const inputDir = getArg('--input') || './raw-images';
const outputDir = getArg('--output') || './public/media';

function getArg(flag) {
  const idx = args.indexOf(flag);
  return idx > -1 ? args[idx + 1] : null;
}

// Config
const MAX_WIDTH = 1600;
const HERO_WIDTH = 1200;
const THUMB_WIDTH = 400;
const QUALITY = 82;

const SUPPORTED = ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.bmp'];

async function optimizeImages() {
  if (!fs.existsSync(inputDir)) {
    console.log(`Input directory "${inputDir}" does not exist. Creating it.`);
    fs.mkdirSync(inputDir, { recursive: true });
    console.log('Drop your raw images into this folder and run again.');
    return;
  }

  fs.mkdirSync(outputDir, { recursive: true });

  const files = fs.readdirSync(inputDir).filter(f => {
    const ext = path.extname(f).toLowerCase();
    return SUPPORTED.includes(ext);
  });

  if (files.length === 0) {
    console.log(`No supported images found in "${inputDir}".`);
    return;
  }

  console.log(`Processing ${files.length} images...`);

  let processed = 0;
  let totalSaved = 0;

  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const baseName = path.basename(file, path.extname(file));
    const outputPath = path.join(outputDir, `${baseName}.webp`);

    try {
      const inputStats = fs.statSync(inputPath);
      const metadata = await sharp(inputPath).metadata();

      // Determine target width based on filename hints
      let targetWidth = MAX_WIDTH;
      if (baseName.includes('hero') || baseName.includes('collage')) {
        targetWidth = HERO_WIDTH;
      } else if (baseName.includes('thumb') || baseName.includes('avatar')) {
        targetWidth = THUMB_WIDTH;
      }

      // Only downscale, never upscale
      const resizeWidth = metadata.width > targetWidth ? targetWidth : undefined;

      await sharp(inputPath)
        .resize(resizeWidth, undefined, {
          withoutEnlargement: true,
          fit: 'inside',
        })
        .webp({ quality: QUALITY, effort: 6 })
        .toFile(outputPath);

      const outputStats = fs.statSync(outputPath);
      const saved = inputStats.size - outputStats.size;
      totalSaved += Math.max(0, saved);
      processed++;

      const percent = ((saved / inputStats.size) * 100).toFixed(0);
      console.log(`  ✓ ${file} → ${baseName}.webp (${percent > 0 ? '-' + percent + '%' : 'optimized'})`);
    } catch (err) {
      console.error(`  ✗ ${file}: ${err.message}`);
    }
  }

  console.log(`\nDone. ${processed}/${files.length} images optimized.`);
  console.log(`Total space saved: ${(totalSaved / 1024).toFixed(0)} KB`);
}

optimizeImages();
