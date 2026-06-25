import "server-only";

import { readFile, writeFile, rename } from "node:fs/promises";
import { join } from "node:path";

import { DATA_DIR, DATA_FILES, type DataFileKey } from "./paths";

/**
 * Read a JSON data file. Throws if missing/corrupt so callers fail loudly during
 * development rather than silently serving empty data.
 */
export async function readData<T>(key: DataFileKey): Promise<T> {
  const filePath = join(DATA_DIR, DATA_FILES[key]);
  const raw = await readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

/**
 * Atomically write a JSON data file: write to a temp file in the same directory, then
 * rename over the target so readers never observe a partially written file.
 */
export async function writeData<T>(key: DataFileKey, data: T): Promise<void> {
  const filePath = join(DATA_DIR, DATA_FILES[key]);
  const tmpPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(tmpPath, JSON.stringify(data, null, 2) + "\n", "utf-8");
  await rename(tmpPath, filePath);
}
