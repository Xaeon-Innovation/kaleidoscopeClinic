import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import toIco from "to-ico";

const ROOT = process.cwd();
const SOURCE = join(ROOT, "public/images/logoTransparent2.png");

const GOLD = { r: 200, g: 165, b: 90 }; // #c8a55a
const LUMINANCE_THRESHOLD = 128;

async function createGoldMaster() {
  const { data, info } = await sharp(SOURCE)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const lum = Math.max(data[i], data[i + 1], data[i + 2]);
    if (lum >= LUMINANCE_THRESHOLD) {
      data[i] = GOLD.r;
      data[i + 1] = GOLD.g;
      data[i + 2] = GOLD.b;
      data[i + 3] = 255;
    } else {
      data[i + 3] = 0;
    }
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png();
}

async function writePng(pipeline, outputPath, size) {
  const buffer = await pipeline
    .clone()
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  await writeFile(outputPath, buffer);
  return buffer;
}

async function main() {
  const master = await createGoldMaster();

  await writePng(master, join(ROOT, "public/images/logo-gold.png"), 512);
  await writePng(master, join(ROOT, "app/icon.png"), 32);
  await writePng(master, join(ROOT, "app/icon1.png"), 48);
  await writePng(master, join(ROOT, "app/apple-icon.png"), 180);

  const icoSizes = [16, 32, 48];
  const icoBuffers = await Promise.all(
    icoSizes.map((size) =>
      master
        .clone()
        .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer()
    )
  );

  const ico = await toIco(icoBuffers);
  await writeFile(join(ROOT, "app/favicon.ico"), ico);

  console.log("Generated brand icons:");
  console.log("  public/images/logo-gold.png (512x512)");
  console.log("  app/icon.png (32x32)");
  console.log("  app/icon1.png (48x48)");
  console.log("  app/apple-icon.png (180x180)");
  console.log("  app/favicon.ico (16, 32, 48)");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
