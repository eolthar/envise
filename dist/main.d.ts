declare class Envise {
    private variables;
    constructor(path?: string);
    get: (key: string) => string | undefined;
    delete: (key: string) => void;
    exists: (key: string) => boolean;
    load(path?: string): void;
    save(path?: string): void;
    keys(): string[];
    clear(): void;
    set(key: string, value: string): void;
    private deleteVariable;
    private parse;
    private escape;
    private proxy;
}
declare const _default: Envise;
export default _default;
