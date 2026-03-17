import * as vscode from 'vscode';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);


// Note struct 
export interface Note {
    file: string;
    line: number;
    content: string;
}

function binaryPath(): string {
    return vscode.workspace.getConfiguration('cpin').get<string>('binaryPath') ?? 'cpin';
}

async function run(args: string[]): Promise<string> {
    const { stdout } = await execFileAsync(binaryPath(), args);
    return stdout;
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
    await run(['add', `${file}:${line}`, content]);
}

export async function list(file: string): Promise<Note[]> {
    const output = await run(['list', file]);
    return parseNotes(output);
}

export async function listAll(): Promise<Note[]> {
    const output = await run(['list']);
    return parseNotes(output);
}

export async function remove(file: string, line: number): Promise<void> {
    await run(['remove', `${file}:${line}`]);
}

export async function search(query: string): Promise<Note[]> {
    const output = await run(['search', query]);
    return parseNotes(output);
}

export async function exportJson(): Promise<Note[]> {
    const output = await run(['export', '--json']);
    const raw = JSON.parse(output) as Array<{ file: string; line: number; note: string }>;
    return raw.map(r => ({ file: r.file, line: r.line, content: r.note }));
}

export async function exportMd(): Promise<string> {
    return run(['export', '--md']);
}
