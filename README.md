# cpin — VS Code Extension

> Work in progress

Sticky notes for your code. Attach notes to specific file:line positions — visible as gutter decorations, never touching your source files.

Requires the [cpin CLI](https://github.com/jonaebel/cpin) to be installed.

## Requirements

- `cpin` binary on your `$PATH` (`make install` . . . — see CLI [repo](https://github.com/jonaebel/cpin))

## Status

This extension is under active development and not yet published to the Marketplace.

## Roadmap

**v0.1 — Core commands**
The extension can talk to the `cpin` CLI. You can add a note to any line and remove it again using the command palette. If the `cpin` binary isn't installed, you get a clear message telling you what to do instead of a silent failure. Notes are saved — nothing shows up in the editor yet.

- Set up the internal CLI connection
- `Add Note` command (command palette / right-click)
- `Remove Note` command
- Extension activates automatically when you open a workspace
- Helpful error if the `cpin` binary is missing

**v0.2 — See your notes in the editor**
A small icon appears in the gutter next to every line that has a note. Hover over it to read the full note text. Optionally, a short preview also shows as dimmed text right after the line. Icons appear when you open a file and disappear as soon as you delete a note.

- Gutter icon for annotated lines
- Icons refresh automatically on file open and save
- Hover over the icon to read the note
- Optional inline preview text after the line
- Icons clear immediately after a note is removed

**v0.3 — Sidebar panel**
Browse all notes across your project in one place, grouped by file. Click any note to jump straight to that line.

**v0.4 — Search and export**
Search notes by keyword. Export as Markdown or JSON.

**v1.0 — Ready to publish**
Polished, tested, and on the VS Code Marketplace.
