import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";

import matter from "gray-matter";

const CONTENT_DIR = join(process.cwd(), "content");

export interface ParsedContent<T> {
  data: T;
  body: string;
}

/** Read and parse a markdown file with frontmatter, e.g. loadContent("landing/hero.md"). */
export async function loadContent<T>(relativePath: string): Promise<ParsedContent<T>> {
  const raw = await readFile(join(CONTENT_DIR, relativePath), "utf-8");
  const parsed = matter(raw);
  return { data: parsed.data as T, body: parsed.content.trim() };
}
