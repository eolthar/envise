const { readFileSync, existsSync, writeFileSync } = require('fs');
const { resolve } = require('path');

class Envise {
    #variables = {};

    constructor(path) {
        this.load(path);
        this.get = this.#proxy((key) => this.#variables[key]);
        this.exists = this.#proxy((key) => key in this.#variables);
    }

    load(path = ".env") {
        const fullPath = resolve(process.cwd(), path);

        if (!existsSync(fullPath)) {
            console.warn(`[Envise] .env file not found: ${fullPath}`);
            return;
        }

        try {
            const content = readFileSync(fullPath, 'utf8');
            this.#variables = this.#parse(content);
            console.log(`[Envise] .env file loaded: ${fullPath}`);
        } catch (error) {
            console.error(`[Envise] Failed to load .env file: ${error.message}`);
        }
    }

    save(path = ".env") {
        const fullPath = resolve(process.cwd(), path);
        
        if (!existsSync(fullPath)) {
            console.warn(`[Envise] .env file not found: ${fullPath}`);
            return;
        }

        const content = Object.entries(this.#variables)
            .map(([key, value]) => `${key}=${this.#escape(value)}`)
            .join('\n');

        try {
            writeFileSync(fullPath, content, 'utf8');
            console.log(`[Envise] .env file saved: ${fullPath}`);
        } catch (error) {
            console.error(`[Envise] Failed to save .env file: ${error.message}`);
        }
    }

    keys() {
        return Object.keys(this.#variables);
    }

    clear() {
        this.#variables = {};
    }

    set(key, value) {
        this.#variables[key] = value;
    }

    delete(key) {
        if (key in this.#variables) {
            delete this.#variables[key];
        }
    }

    #parse(content) {
        return content
            .split(/\r?\n/)
            .filter(line => line.trim() && !line.startsWith('#') && line.includes('='))
            .reduce((acc, line) => {
                const [key, ...valueParts] = line.split('=');
                acc[key.trim()] = valueParts.join('=').trim().replace(/^['"]|['"]$/g, '');
                return acc;
            }, {});
    }

    #escape(value) {
        if (/[\s#]/.test(value)) {
            return `"${value.replace(/"/g, '\\"')}"`;
        }
        return value;
    }

    #proxy(handler) {
        return new Proxy(handler, {
            get: (target, prop) => (typeof prop === 'string' ? handler(prop) : undefined),
            apply: (target, thisArg, args) => target(...args),
        });
    }
}

module.exports = new Envise();
