import { readFileSync, existsSync, writeFileSync } from 'fs';
import { resolve } from 'path';

class Envise {
    private variables: Record<string, string> = {};

    constructor(path?: string) {
        this.load(path);
    }

    public get = this.proxy((key: string): string | undefined => this.variables[key]);
    public delete = this.proxy((key: string): void => this.deleteVariable(key));
    public exists = this.proxy((key: string): boolean => key in this.variables);

    public load(path = '.env') {
        const fullPath = resolve(process.cwd(), path);
        if (!existsSync(fullPath)) return;
        this.variables = this.parse(readFileSync(fullPath, 'utf8'));
    }

    public save(path = '.env') {
        const fullPath = resolve(process.cwd(), path);
        const content = Object.entries(this.variables)
            .map(([key, value]) => `${key}=${this.escape(value)}`)
            .join('\n');
        writeFileSync(fullPath, content, 'utf8');
    }

    public keys(): string[] {
        return Object.keys(this.variables);
    }

    public clear() {
        this.variables = {};
    }

    public set(key: string, value: string): void {
        this.variables[key] = value;
    }

    private deleteVariable(key: string): void {
        if (key in this.variables) {
            delete this.variables[key];
        }
    }

    private parse(content: string): Record<string, string> {
        return content
            .split(/\r?\n/)
            .filter(line => line.trim() && !line.startsWith('#') && line.includes('='))
            .reduce((acc: Record<string, string>, line: string) => {
                const [key, ...valueParts] = line.split('=');
                acc[key.trim()] = valueParts.join('=').trim().replace(/^['"]|['"]$/g, '');
                return acc;
            }, {});
    }

    private escape(value: string): string {
        return /[\s#]/.test(value) ? `"${value.replace(/"/g, '\\"')}"` : value;
    }

    private proxy<T extends (key: string, ...args: any[]) => any>(handler: T): T {
        return new Proxy(handler, {
            get: (target, prop: string) => typeof prop === 'string' ? handler(prop) : undefined,
            apply: (target, thisArg, args) => {
                if (typeof args[0] === 'string') {
                    return target.apply(thisArg, args as [string, ...any[]]);
                }
            }
        }) as T;
    }
}

export default new Envise();
