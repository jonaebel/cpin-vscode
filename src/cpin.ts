import * as vscode from 'vscode';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

const INSTALL_DOCS_URL = 'https://github.com/jonaebel/cpin/blob/main/cpin-cli/README.md';

// Note struct
export interface Note {
    file: string;
    line: number;
    content: string;
}

function binaryPath(): string {
    return vscode.workspace.getConfiguration('cpin').get<string>('binaryPath') ?? 'cpin';
}

function isEnoent(err: unknown): boolean {
    return (err as NodeJS.ErrnoException).code === 'ENOENT';
}

function notifyBinaryNotFound(): void {
    vscode.window.showErrorMessage(
        'cpin binary not found. Install it from the cpin-cli repository.',
        'Open install docs'
    ).then(selection => {
        if (selection === 'Open install docs') {
            vscode.env.openExternal(vscode.Uri.parse(INSTALL_DOCS_URL));
        }
    });
}

async function run(args: string[], explicit = false): Promise<string> {
    try {
        const { stdout } = await execFileAsync(binaryPath(), args);
        return stdout;
    } catch (err) {
        if (explicit && isEnoent(err)) {
            notifyBinaryNotFound();
        }
        throw err;
    }
}

/** Parse plain-text `file:line:content\n` output into Note[]. */
function parseNotes(output: string): Note[] {
    return output
        .split('\n')
        .filter(line => line.trim() !== '')
        .flatMap(line => {
            const firstColon = line.indexOf(':');
            if (firstColon === -1) return [];
            const secondColon = line.indexOf(':', firstColon + 1);
            if (secondColon === -1) return [];
            const file = line.slice(0, firstColon);
            const lineNum = parseInt(line.slice(firstColon + 1, secondColon), 10);
            const content = line.slice(secondColon + 1);
            if (!file || isNaN(lineNum)) return [];
            return [{ file, line: lineNum, content }];
        });
}

export async function add(file: string, line: number, content: string): Promise<void> {
    await run(['add', `${file}:${line}`, content], true);
}

export async function list(file: string): Promise<Note[]> {
    const output = await run(['list', file], true);
    return parseNotes(output);
}

export async function listAll(): Promise<Note[]> {
    const output = await run(['list'], true);
    return parseNotes(output);
}

export async function remove(file: string, line: number): Promise<void> {
    await run(['remove', `${file}:${line}`], true);
}

export async function search(query: string): Promise<Note[]> {
    const output = await run(['search', query], true);
    return parseNotes(output);
}

export async function exportJson(): Promise<Note[]> {
    const output = await run(['export', '--json'], true);
    const raw = JSON.parse(output) as Array<{ file: string; line: number; note: string }>;
    return raw.map(r => ({ file: r.file, line: r.line, content: r.note }));
}

export async function exportMd(): Promise<string> {
    return run(['export', '--md'], true);
}

/** For background decoration refreshes — ENOENT is silent. */
export async function listBackground(file: string): Promise<Note[]> {
    try {
        const output = await run(['list', file]);
        return parseNotes(output);
    } catch {
        return [];
    }
}

export async function listAllBackground(): Promise<Note[]> {
    try {
        const output = await run(['list']);
        return parseNotes(output);
    } catch {
        return [];
    }
}
