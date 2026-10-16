# Delta MCP

Expose deliberately selected Delta capabilities to MCP clients through independently scoped gateway profiles.

Independent headless Delta service. No browser, Web plugin, or graphical session is required. Web, Desktop and Android are optional clients; Android delegates desktop-only operations to a trusted paired desktop/VPS node.

## Install and use

Install **Delta MCP** from the official Delta plugin catalog on the node where this service should run. Compatible Web/native hosts show which optional service dependencies are installed, disabled or incompatible. Installing Web is not required to keep this service running.

For an owner-operated Core CLI installation:

```sh
delta call packages.install --json '{"id":"dev.delta.mcp"}'
```

Create a gateway profile from **MCP gateways** in Web/Desktop, or use the API listed below. Choose the tools and data restrictions explicitly, then configure the MCP client with that profile's URL and secret. Treat the secret as a credential. Revoking a profile removes its access; a gateway is not an owner-login shortcut. The listener can run on a headless VPS without any visual environment.

The supervisor owns service startup. Do not run a second manual copy against an active managed profile. Back up the profile before migration or incompatible upgrades; uninstalling a UI client is not a data backup.

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

## Development and verification

Run `npm ci` and `npm test` in this repository. Direct `npm start` is for a deliberately configured service environment; an ordinary UI client should not receive its service credential.


Automated tests use isolated fixtures. Physical desktop restart, phone lifecycle, and production VPS acceptance are not implied by a passing test suite.
