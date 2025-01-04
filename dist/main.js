"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
class Envise {
    variables = {};
    constructor(path) {
        this.load(path);
    }
    get = this.proxy((key) => this.variables[key]);
    delete = this.proxy((key) => this.deleteVariable(key));
    exists = this.proxy((key) => key in this.variables);
    load(path = '.env') {
        const fullPath = (0, path_1.resolve)(process.cwd(), path);
        if (!(0, fs_1.existsSync)(fullPath))
            return;
        this.variables = this.parse((0, fs_1.readFileSync)(fullPath, 'utf8'));
    }
    save(path = '.env') {
        const fullPath = (0, path_1.resolve)(process.cwd(), path);
        const content = Object.entries(this.variables)
            .map(([key, value]) => `${key}=${this.escape(value)}`)
            .join('\n');
        (0, fs_1.writeFileSync)(fullPath, content, 'utf8');
    }
    keys() {
        return Object.keys(this.variables);
    }
    clear() {
        this.variables = {};
    }
    set(key, value) {
        this.variables[key] = value;
    }
    deleteVariable(key) {
        if (key in this.variables) {
            delete this.variables[key];
        }
    }
    parse(content) {
        return content
            .split(/\r?\n/)
            .filter(line => line.trim() && !line.startsWith('#') && line.includes('='))
            .reduce((acc, line) => {
            const [key, ...valueParts] = line.split('=');
            acc[key.trim()] = valueParts.join('=').trim().replace(/^['"]|['"]$/g, '');
            return acc;
        }, {});
    }
    escape(value) {
        return /[\s#]/.test(value) ? `"${value.replace(/"/g, '\\"')}"` : value;
    }
    proxy(handler) {
        return new Proxy(handler, {
            get: (target, prop) => typeof prop === 'string' ? handler(prop) : undefined,
            apply: (target, thisArg, args) => {
                if (typeof args[0] === 'string') {
                    return target.apply(thisArg, args);
                }
            }
        });
    }
}
exports.default = new Envise();
