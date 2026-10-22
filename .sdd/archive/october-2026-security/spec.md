# Marvel security remediation

Why: the audit found vulnerable dependencies, unprotected admin mutations, client-controlled authentication, plaintext passwords and unrestricted uploads.
What: update dependencies and protect the existing Express/EJS workflow with server-side identity, hashed passwords, CSRF protection and bounded image uploads.
Approval: the user explicitly authorized all necessary security remediation and remote updates; self-review covers reversible implementation changes. No worktree, no remote push by the delegated agent.
Constraints: preserve intended public catalogue behavior, never log secrets or upload executable files, keep application credentials out of source, retain server-side authorization on every admin operation. Existing plaintext credentials must require an explicit offline migration; do not silently retain plaintext login as a fallback.

Independent task scope: this specification owns only grupo_10_marvel.

| Task | State | Verification |
| --- | --- | --- |
| Dependency patching and supported Node pin | DONE | npm audit; install/build smoke |
| Authentication and admin authorization | DONE | node:test regression HTTP/middleware tests |
| Upload and CSRF boundaries | DONE | node:test multipart and forgery checks |
| Documentation and final review | DONE | full test suite, audit and diff review |

Validation: all regression tests pass; npm audit reports no high/critical vulnerabilities; local app can render a form and protect mutations with a stubbed DB boundary. Database deployment/migration is an explicit external operation requiring real credentials and is not performed against unknown production data.

Final verification (2026-10-22): 20/20 tests, full audit zero, diff checks and independent committee/guard HIGH. Upload paths fit existing schema. Nonblocking caveat: files may be orphaned after database failure and administrator user editing ignores an uploaded image. Production database migration and persistent session store require deployment configuration and were not performed. Remote integration evidence is tracked in the workspace report.
