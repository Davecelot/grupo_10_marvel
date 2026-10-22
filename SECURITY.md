# Security maintenance

Use Node.js **24.22.1 or a later patched 24.x release**. The October 21, 2026 Node.js release fixes the Brotli decoder, TLS certificate validation, DNS and other issues described in the [official advisory](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases). `.nvmrc` and `proyecto/package.json` record the supported baseline.

## Validation

From `proyecto/`:

```sh
npm ci
npm test
npm audit
npm run dev
```

Development watching uses Node's built-in watcher rather than the vulnerable nodemon/chokidar/braces dependency chain. The scoped Sequelize UUID override uses the patched CommonJS-compatible UUID 11.1.1 line; a model-build regression test verifies its runtime compatibility. Multer 2 bounds multipart resource usage, and upload processing separately verifies allowed image signatures, extensions and MIME types before writing a generated filename. Invalid form submissions do not persist uploaded files.

## Deployment requirements

Keep the existing ignored database configuration in `proyecto/src/database/config/config.js`. Supply database credentials securely from the deployment environment, never from source control. `SESSION_SECRET` must be at least 32 characters in production. Generate and store it through the deployment secret manager; do not reuse the former hard-coded secret. HTTPS is required in production. When using a reverse proxy, configure `TRUST_PROXY` with only its trusted addresses or CIDRs so Express can recognize the original HTTPS connection safely. The default trusts no proxy.

Express's default in-memory session store is intended for development. A production operator must wire a persistent session store suitable for their infrastructure before deploying multiple processes; session loss otherwise signs users out. Existing username-only sessions and unsigned `usuario` cookies are intentionally invalidated by this security update. The remember option now extends the server-side session cookie instead of creating an authentication cookie containing a display name.

All administrator routes and user-directory API endpoints require an authenticated, current administrator record. The public movie catalogue remains accessible. Clients using `/api/users` must authenticate and send the server-issued session cookie; public cross-origin requests no longer expose user emails.

Every state-changing form carries a session-bound CSRF token. A non-browser client must first GET a form using a cookie jar, then submit `_csrf` with the same session, or send `X-CSRF-Token`. Multipart tokens are checked after bounded parsing and before persisting any file. Login and registration are each rate-limited to 20 attempts per IP per 15 minutes. Uploaded image files are limited to 2 MiB; SVG/HTML/executable files are rejected, and `nosniff` is set on responses.

## Existing plaintext passwords

New registrations and administrator password writes use bcrypt with cost 12. Empty administrator password edits preserve the previous hash. Passwords are never returned to form HTML or logged. The `users.password` model allows hashes; the supplied MySQL schema's 200-character column already has enough space for bcrypt.

**Before deploying against an existing database**, back it up and arrange a maintenance window. Confirm `users.password` can hold at least 60 characters, then run the explicit offline migration with that database's configuration:

```sh
cd proyecto
node scripts/hash-legacy-passwords.js --dry-run
node scripts/hash-legacy-passwords.js --apply
```

The script transactionally hashes only non-bcrypt records, prints counts rather than credentials, and rolls back if an empty or over-72-byte legacy password needs an account reset. It can be run again without hashing already-migrated bcrypt values. Legacy plaintext login is deliberately rejected; do not re-enable plaintext comparison to bypass the migration. This change does not connect to or alter a production database automatically.

The unused JSON file of sample user identities and credential material was emptied. Existing Git history can still contain the old examples; revoke any credential that was ever reused outside this demonstration. No history rewrite or production-secret rotation was performed as part of these source changes.
