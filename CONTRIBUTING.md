# Contributing to cpin-vscode

Thanks for your interest in contributing! This is the VS Code extension for [cpin](https://github.com/jonaebel/cpin), and contributions of all sizes are welcome — bug fixes, new features, docs, or packaging.

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm
- VS Code

### Build from source

```bash
git clone https://github.com/jonaebel/cpin-vscode.git
cd cpin-vscode
npm install
```

Open the folder in VS Code and press `F5` to launch the Extension Development Host.

### Project structure

```
cpin-vscode/
├── src/
│   └── extension.ts     # Extension entry point (activate/deactivate)
├── package.json         # Extension manifest and contribution points
├── tsconfig.json
└── README.md
```

The extension communicates with the `cpin` CLI binary under the hood. Notes are stored by the CLI in `.cpin/notes` in the project root.

## How to Contribute

### 1. Pick an issue

Check the [open issues](https://github.com/jonaebel/cpin-vscode/issues). Issues tagged `good first issue` are a great starting point if you're new to the codebase.

### 2. Fork and branch

```bash
git checkout -b feat/your-feature-name
# or
git checkout -b fix/your-bug-name
```

### 3. Make your changes

- Keep changes focused — one feature or fix per PR
- Follow the existing code style (see below)
- Test your changes manually in the Extension Development Host before submitting

### 4. Open a Pull Request

Push your branch and open a PR against `main`. Fill out the PR template and describe what you changed and why.

---

## Code Style

- TypeScript, compiled with strict mode
- 2-space indentation
- camelCase for variables and functions, PascalCase for types/classes
- Keep activation events minimal — only activate when needed
- Dispose of resources (subscriptions, watchers) properly in `deactivate()`

---

## Reporting Bugs

Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md) when opening an issue.

## Requesting Features

Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md). Check existing issues first to avoid duplicates.

---

## License

By contributing you agree that your contributions will be licensed under the [MIT License](LICENSE).
