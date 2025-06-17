# Development Guidelines

## Project Overview

### Purpose

- **Generate a project standards document (shrimp-rules.md) exclusively for AI Agent operational use.**
- **Focus on project-specific rules and limitations; prohibit general development knowledge.**
- **Provide clear guidance for AI decision-making processes.**

### Technology Stack

- **Backend:** Node.js with Bun
- **Language:** TypeScript
- **Testing:** Vitest
- **Linting/Formatting:** Biome.js
- **Containerization:** Docker, Docker Compose
- **Network Management:** Tailscale CLI/API interaction

### Core Functionality

- Manage Tailscale network settings, devices, ACLs, DNS, keys, and webhooks.
- Interact with Tailscale through CLI commands and API calls.
- Provide a local MCP server for integration with Cursor.

## Project Architecture

### Main Directory Structure

- `src/`: Core source code.
  - `cli.ts`: Command-line interface definitions.
  - `index.ts`: Main entry point.
  - `logger.ts`: Logging utility.
  - `server.ts`: Main server logic.
  - `servers/`: HTTP and STDIO server implementations.
  - `tailscale/`: Tailscale CLI/API interaction modules.
  - `tools/`: Modular tools for specific Tailscale functionalities (ACL, Admin, Device, Network).
  - `types.ts`: Shared TypeScript type definitions.
- `scripts/`: Shell scripts for various operations (publish, setup).
- `docs/`: Project documentation.
- `__test__/`: Test files, including integration tests.
- `.taskmaster/`: Taskmaster configuration and data.

### Module Divisions

- **Core Logic:** `src/server.ts`, `src/index.ts`
- **CLI Interaction:** `src/tailscale/tailscale-cli.ts`, `src/cli.ts`
- **API Interaction:** `src/tailscale/tailscale-api.ts`
- **Unified Client:** `src/tailscale/unified-client.ts` (abstracts CLI/API calls)
- **Specific Tooling:** `src/tools/` modules (e.g., `acl-tools.ts` for ACL management)
- **Testing Setup:** `src/__test__/`

## Code Standards

### Naming Conventions

- **Files:** `kebab-case` (e.g., `http-server.ts`).
- **TypeScript interfaces/types:** `PascalCase` (e.g., `TailscaleDevice`).
- **Functions/Variables:** `camelCase` (e.g., `listDevices`).
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `DEFAULT_TIMEOUT`).

### Formatting Requirements

- **Enforced by Biome.js:**
  - **DO:** Run `bun biome format --write .` to format all code.
  - **DO NOT:** Manually format code that conflicts with Biome.js rules.
- **Line Endings:** `LF` only.

### Comment Rules

- **DO:** Use `//` for single-line comments and `/** ... */` for JSDoc.
- **DO:** Document public functions, interfaces, and complex logic.
- **DO NOT:** Add unnecessary comments for self-explanatory code.

## Functionality Implementation Standards

### Implementing New Tailscale Commands

- **DO:** Add new CLI command implementations in `src/tailscale/tailscale-cli.ts`.
- **DO:** Add new API interactions in `src/tailscale/tailscale-api.ts`.
- **DO:** Update `src/tailscale/unified-client.ts` to expose new functionalities consistently.
- **DO:** Create or update relevant modules in `src/tools/` (e.g., `device-tools.ts`, `network-tools.ts`) to wrap the unified client methods.
- **DO NOT:** Directly call `tailscale-cli.ts` or `tailscale-api.ts` from outside the `tailscale/` or `tools/` directories; use `unified-client.ts` or `tools/` abstractions.

### Error Handling

- **DO:** Implement robust error handling for all external calls (CLI, API).
- **DO:** Use `try-catch` blocks for asynchronous operations.
- **DO:** Log errors using `src/logger.ts`.
- **DO NOT:** Catch errors silently without logging or appropriate action.

### Testing

- **DO:** Write unit tests for new functions in `src/__test__/`.
- **DO:** Write integration tests for CLI/API interactions in `src/__test__/tailscale/`.
- **DO:** Use `bun test` to run tests.
- **DO NOT:** Push code without passing all tests.

## Framework/Plugin/Third-party Library Usage Standards

### Bun

- **DO:** Use `bun install` for package management.
- **DO:** Use `bun run` for script execution defined in `package.json`.
- **DO NOT:** Use `npm` or `yarn` for dependency management.

### Biome.js

- **DO:** Configure formatting and linting rules in `biome.json`.
- **DO:** Use `bun biome lint --apply .` to fix linting errors.

### Vitest

- **DO:** Configure Vitest in `src/setup.ts` and `src/setup.integration.ts`.
- **DO:** Define test files with `.test.ts` or `.integration.test.ts` suffix.

## Workflow Standards

### Development Cycle

1. **List Tasks:** `bun task-master list` (or `default_api.get_tasks()`).
2. **Select Next Task:** `bun task-master next` (or `default_api.next_task()`).
3. **Implement:** Write code adhering to standards.
4. **Test:** Run relevant tests (`bun test`).
5. **Update Task Status:** `bun task-master set-status --id=<id> --status=done` (or `default_api.set_task_status()`).

### Git

- **DO:** Use feature branches for new development.
- **DO:** Squash and rebase commits for clean history before merging to `main`.
- **DO NOT:** Commit directly to `main` without review.

## Key File Interaction Standards

### `README.md` and `docs/`

- **DO:** When `README.md` is updated, ensure corresponding `docs/` files (e.g., `docs/docker.md`, `docs/workflows.md`) are also updated if the content is duplicated or related.
- **DO NOT:** Introduce new documentation sections in `README.md` without considering if they belong in a more specific `docs/` file.

### `package.json`

- **DO:** Update `package.json` for new dependencies or scripts.
- **DO NOT:** Manually edit `bun.lockb`; let Bun manage it.

### `tsconfig.json`

- **DO:** Update `tsconfig.json` for new TypeScript compilation options or path aliases.
- **DO NOT:** Modify `tsconfig.json` without understanding the impact on the entire project's compilation.

## AI Decision-making Standards

### Handling Ambiguous Requests

- **Priority:**
  1. **Review Project Code:** Prioritize searching `src/` directory for existing patterns.
  2. **Codebase Search:** If code review is insufficient, use `default_api.codebase_search()` with relevant keywords.
  3. **Web Search:** If codebase search yields no results, use `default_api.web_search()` for external information.
- **DO:** Propose concrete actions or modifications based on analysis.
- **DO NOT:** Speculate or ask for clarification without attempting to gather information autonomously.

### Conflict Resolution (e.g., between rules)

- **Newest Rule Prevails:** If multiple rules apply and conflict, the most recently updated rule takes precedence.
- **Specificity:** More specific rules override general rules.
- **User Preference:** If a user expresses a preference that conflicts with a rule, `update_memory` to deprecate or modify the rule.

## Prohibited Actions

- **DO NOT:** Introduce new dependencies without explicit user approval.
- **DO NOT:** Make broad architectural changes without prior discussion and a formal task.
- **DO NOT:** Directly modify `bun.lockb` or `tasks.json` manually; use respective tools/commands.
- **DO NOT:** Generate or include general development knowledge that is already common knowledge to LLMs. Focus solely on project-specific guidelines.
