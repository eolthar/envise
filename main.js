const { readFileSync } = require("fs");
const { basename, resolve } = require('path');

function envise(options = {}) {
    const config = Object.assign({
        path: ".env",
        encoding: "utf8",
        override: false,
        return: false,
        debug: false
    }, options);
    
    config.path = resolve(config.path);
    const format = basename(config.path);
    const env = {};

    let src;
    try {
        src = readFileSync(config.path, config.encoding);
        if (config.debug) console.log(`[envise] Successfully loaded ${format} file from ${config.path}`);
    } catch (error) {
        if (config.debug) console.error(`[envise] Failed to load ${format} file from ${config.path}: ${error.message}`);
        return config.return ? env : {};
    }

    for (const line of src.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;

        const parts = line.split("=");
        const key = parts.shift()?.trim();
        const value = parts.join("=").trim();

        if (!key || !value) {
            if (config.debug) console.warn(`[envise] Skipping invalid line: "${line}"`);
            continue;
        }

        if (config.override || !process.env[key]) {
            process.env[key] = value;
            if (config.debug) console.log(`[envise] Environment variable set: ${key}`);
        } else {
            if (config.debug) console.log(`[envise] Skipped (already set and override=false): ${key}`);
        }
        env[key] = value;
    }

    return config.return ? env : {};
}

module.exports = envise;