const { readFileSync } = require("fs");
const { resolve } = require("path");

function envise() {
    let src;
    try {
        src = readFileSync(resolve(process.cwd(), ".env"), "utf8");
    } catch {
        return;
    }

    for (const line of src.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;

        const parts = line.split("=");
        const key = parts.shift().trim();
        const value = parts.join("=").trim();

        if (!key || !value) continue;
        process.env[key] = value;
    }
}

envise();