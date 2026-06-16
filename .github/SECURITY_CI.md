# Security CI

This repo runs an automated security scan on every PR and push to `main`
via `.github/workflows/security-scan.yml`. The workflow blocks merges when
any of these checks fail:

| Job                    | What it does                                                                 | Fails on                          |
| ---------------------- | ---------------------------------------------------------------------------- | --------------------------------- |
| `dependency-audit`     | `npm audit` over the installed dependency tree                               | Any **critical** vulnerability    |
| `secret-scan`          | gitleaks scan of the full git history                                        | Any secret match                  |
| `static-analysis`      | GitHub CodeQL with the `security-and-quality` query pack                     | New error-severity alerts         |
| `supabase-sql-lint`    | Greps `supabase/migrations/*.sql` for tables without RLS / overly permissive policies | Missing RLS on new tables |
| `required-checks`      | Gate job that aggregates all of the above                                    | Any upstream job failing          |

## Enforce as required status checks

To actually block merges, mark `Security Gate` as a required check:

1. Repo Settings → Branches → Branch protection rules → `main`.
2. Enable **Require status checks to pass before merging**.
3. Add **Security Gate** (and optionally the individual jobs).
4. Save.

## Local reproduction

```sh
bun install --frozen-lockfile
npx better-npm-audit audit --level critical
gitleaks detect --no-banner --redact
```

CodeQL only runs in CI.