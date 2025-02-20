export default function Alea(...args: any[]): {
    (): number;
    next: /*elided*/ any;
    uint32(): number;
    fract53(): number;
    version: string;
    args: any[];
    exportState(): number[];
    importState(state: any): void;
};
