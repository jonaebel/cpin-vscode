import * as path from 'path';
import * as vscode from 'vscode';
import * as cpin from './cpin';

// ── Decoration manager ──────────────────────────────────────────────────────

const gutterDecorationType = vscode.window.createTextEditorDecorationType({
    gutterIconPath: path.join(__dirname, '..', 'media', 'note-gutter.svg'),
    gutterIconSize: 'contain',
    overviewRulerColor: new vscode.ThemeColor('editorOverviewRuler.warningForeground'),
    overviewRulerLane: vscode.OverviewRulerLane.Left,
});

async function refreshDecorations(editor: vscode.TextEditor): Promise<void> {
    const notes = await cpin.listBackground(editor.document.fileName);
    const ranges = notes.map(n =>
        new vscode.Range(n.line - 1, 0, n.line - 1, 0)
    );
    editor.setDecorations(gutterDecorationType, ranges);
}

// ── Extension lifecycle ─────────────────────────────────────────────────────

export function activate(context: vscode.ExtensionContext) {

    // Load decorations for the currently active editor immediately.
    if (vscode.window.activeTextEditor) {
        refreshDecorations(vscode.window.activeTextEditor);
    }

    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor) { refreshDecorations(editor); }
        }),
        vscode.workspace.onDidSaveTextDocument(doc => {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document === doc) {
                refreshDecorations(editor);
            }
        }),
    );

    // ── Commands ────────────────────────────────────────────────────────────

    const addNote = vscode.commands.registerCommand('cpin.addNote', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('cpin: no active editor.');
            return;
        }

        const file = editor.document.fileName;
        const line = editor.selection.active.line + 1; // VS Code lines are 0-based

        const content = await vscode.window.showInputBox({
            prompt: `Add note at ${file}:${line}`,
            placeHolder: 'Note content…',
        });
        if (!content) { return; } // cancelled or empty

        try {
            await cpin.add(file, line, content);
            await refreshDecorations(editor);
        } catch {
            return; // error already reported by cpin.ts (ENOENT) or binary stderr
        }
    });

    const removeNote = vscode.commands.registerCommand('cpin.removeNote', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('cpin: no active editor.');
            return;
        }

        const file = editor.document.fileName;
        const line = editor.selection.active.line + 1;

        const notes = await cpin.list(file).catch(() => null);
        if (!notes) { return; } // error already reported

        const hasNote = notes.some(n => n.line === line);
        if (!hasNote) {
            vscode.window.showWarningMessage(`cpin: no note at line ${line}.`);
            return;
        }

        try {
            await cpin.remove(file, line);
            await refreshDecorations(editor);
        } catch {
            return;
        }
    });

    context.subscriptions.push(addNote, removeNote);
}

export function deactivate() {}
