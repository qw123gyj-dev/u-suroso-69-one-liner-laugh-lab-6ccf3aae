// One-Liner Laugh Lab — entry program (program/v1, Node 22, stdlib only).
// A robot vacuum's excuse for eating a sock, written to entry.txt.
// The program checks the line first, writes it, then reads it back and
// verifies the file holds exactly that one line, nothing more.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MAX_LENGTH = 200;
const OUTPUT_NAME = "entry.txt";

const joke =
  "I ate the sock because it was on the floor — I'm a vacuum, not a sock detective.";

function reject(reason: string): never {
  throw new Error(`Entry rejected: ${reason}`);
}

function countTerminators(text: string): number {
  let marks = 0;
  for (const ch of text) {
    if (ch === "." || ch === "!" || ch === "?") {
      marks += 1;
    }
  }
  return marks;
}

function countWords(text: string): number {
  return text.split(/\s+/).filter((w) => w.length > 0).length;
}

function checkJoke(text: string): void {
  if (text.includes("\n") || text.includes("\r")) {
    reject("the entry must be a single line with no line break in it");
  }
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    reject("the entry must not be blank or only whitespace");
  }
  if (trimmed.length > MAX_LENGTH) {
    reject(
      `the entry is ${trimmed.length} characters, over the ${MAX_LENGTH} limit`,
    );
  }
  if (trimmed !== text) {
    reject("the entry must not start or end with whitespace");
  }
  const marks = countTerminators(text);
  if (marks !== 1 || !text.endsWith(".")) {
    reject(
      `the entry must be exactly one sentence ending in a period (found ${marks} terminator(s))`,
    );
  }
}

checkJoke(joke);

const folder = process.env.MAKEFUN_OUTPUT_DIR || "/output";
if (!existsSync(folder)) {
  mkdirSync(folder, { recursive: true });
}
const target = join(folder, OUTPUT_NAME);
writeFileSync(target, joke, "utf8");

const roundTrip = readFileSync(target, "utf8");
if (roundTrip !== joke) {
  reject("the file read back did not match the entry exactly");
}
if (roundTrip.split("\n").length !== 1) {
  reject("the file read back must hold exactly one line");
}

console.log(`Wrote ${target}: ${joke}`);
console.log(
  `Characters: ${joke.length}, words: ${countWords(joke)}, sentences: 1`,
);
