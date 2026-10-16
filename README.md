# Delta Mcp

Independent headless Delta service. No browser, Web plugin, or graphical session is required.

## Runtime

Requires Node.js 22+ and Delta Core >=0.4.3 <0.5.0. Run `npm ci --omit=dev`, then `npm start` with `DELTA_HOME`, `DELTA_URL`, and a service `DELTA_TOKEN`. Executable services are trusted host code, not an OS sandbox.

## API

- `mcp.list`
- `mcp.catalog`
- `mcp.create`
- `mcp.revoke`
- `mcp.info`

Core authenticates API calls. Forwarded calls retain the original principal through a live, component-bound invocation; the caller is never trusted from JSON arguments. A caller must be authorized for both the compatibility endpoint and the destination capability. Existing owner access is unchanged; narrowly scoped keys may need the new service scopes.

## Data and migration

Profiles migrate atomically from the previous Web data directory, preserving profile IDs, secrets and issued token scopes. Migration refuses an active legacy Web process. The independent HTTP listener defaults to localhost:7730; Web can proxy existing `/mcp/:id` addresses. Configure a trusted HTTPS reverse proxy for remote use.

## Verification

Automated tests use isolated fixtures. Physical desktop restart, phone lifecycle, and production VPS acceptance are not implied by a passing test suite.
