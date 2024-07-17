#!/usr/bin/env node

// A script to transform i18n json files to Rust rust-i18n crate supported format.

import { readdir } from "node:fs/promises";
import path from "node:path";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { program } from "commander";

program
    .version("0.1.0") //
    .description("i18n transform for Rust")
    .option("-s, --source [dir]", "Source directory", "../../")
    .option("-d, --destination [dir]", "Destination directory", "../../../../src-tauri/locales")
    .parse();

const baseDir = import.meta.dirname;

const sourceDir = path.join(baseDir, program.opts().source);
const destinationDir = path.join(baseDir, program.opts().destination);

const dirents = await readdir(path.join(sourceDir), { withFileTypes: true });
const locales = dirents
    .filter(f => f.isDirectory())
    .filter(f => f.name.length === 2)
    .map(f => f.name);

for (const locale of locales) {
    const destinationLocale: Record<string, unknown> = { _version: 1 };

    const localeFiles = await readdir(path.join(sourceDir, locale));
    for (const file of localeFiles) {
        const contents = readFileSync(path.join(sourceDir, locale, file), { encoding: "utf8" });
        const jsonContent = JSON.parse(contents);
        for (const [key, value] of Object.entries(jsonContent)) {
            destinationLocale[`${path.parse(file).name}.${key}`] = (value as string).replaceAll(/({{)(.*?)(}})/g, "%{$2}");
        }
    }

    const json = JSON.stringify(destinationLocale, null, 4);
    if (!existsSync(destinationDir)) {
        mkdirSync(destinationDir);
    }
    writeFileSync(path.join(destinationDir, `${locale}.json`), json);
}
