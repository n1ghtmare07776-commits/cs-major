# Security

This project is currently a client-only game prototype with no authentication, server API, or payment flow.

## Secrets Management

No secrets are required for core gameplay. Do not add API keys or private credentials to the repository.

If a future feature needs external services, store secrets outside source control and document the generic handling model here without naming specific secret variables.

## Data Sensitivity

Save data should contain only local game state:

- campaign year.
- drafted roster.
- cup results.
- settings.

Do not store personal information, account identifiers, or analytics identifiers in v0.1.

## Threat Model

| Threat | Mitigation | Status |
|---|---|---|
| Malicious save data | Validate parsed save shape before use | Planned with save/load |
| Script injection through narrative text | Keep narrative as local content, render as text | Planned with UI |
| Untrusted live roster data | No runtime roster fetching | In place by policy |

## Dependencies

Use few dependencies. Prefer established build and test tools over niche packages.

Review dependency additions for:

- browser bundle size.
- maintenance health.
- license compatibility.
- unnecessary network behavior.

