// Generate public/brand/favicon.ico from public/brand/logo-mark.svg.
// Uses optional deps (sharp + png-to-ico). Exits non-zero quietly if unavailable so the
// brand-fetch script can fall back to the committed favicon.
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const brandDir = join(here, "..", "public", "brand");

async function main() {
  const sharp = (await import("sharp")).default;
  const pngToIco = (await import("png-to-ico")).default;
  const svg = await readFile(join(brandDir, "logo-mark.svg"));
  const sizes = [16, 32, 48];
  const pngs = await Promise.all(
    sizes.map((s) => sharp(svg, { density: 384 }).resize(s, s).png().toBuffer()),
  );
  const ico = await pngToIco(pngs);
  await writeFile(join(brandDir, "favicon.ico"), ico);
}

main().catch(() => process.exit(1));
