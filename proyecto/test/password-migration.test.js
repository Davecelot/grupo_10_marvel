const assert = require('node:assert/strict');
const { test } = require('node:test');
const bcrypt = require('bcryptjs');
const { migratePasswords, migrationFailureMessage } = require('../scripts/hash-legacy-passwords');
function database(rows, type = 'VARCHAR(200)') {
  let writes = 0;
  const records = rows.map((password, id) => ({ id, password, async update(values) { writes++; Object.assign(this, values); } }));
  return {
    records,
    writes: () => writes,
    User: { findAll: async () => records },
    sequelize: {
      getQueryInterface: () => ({ describeTable: async () => ({ password: { type } }) }),
      transaction: async operation => operation({ LOCK: { UPDATE: 'UPDATE' } }),
    },
  };
}

test('legacy password migration dry-run writes nothing, apply is idempotent and preserves hashes', async () => {
  const existing = await bcrypt.hash('already-secure-password', 4);
  const db = database(['legacy-password', existing]);
  assert.equal(await migratePasswords(db), 1);
  assert.equal(db.writes(), 0);
  assert.equal(await migratePasswords(db, { apply: true }), 1);
  assert.equal(await bcrypt.compare('legacy-password', db.records[0].password), true);
  assert.equal(db.records[1].password, existing);
  assert.equal(await migratePasswords(db, { apply: true }), 0);
  assert.equal(db.writes(), 1);
});

test('migration refuses undersized columns and resets requiring unsafe credentials before any writes', async () => {
  const short = database(['legacy-password'], 'VARCHAR(50)');
  await assert.rejects(migratePasswords(short, { apply: true }), /at least 60/);
  assert.equal(short.writes(), 0);
  const invalid = database(['legacy-password', 'é'.repeat(37)]);
  await assert.rejects(migratePasswords(invalid, { apply: true }), /password reset/);
  assert.equal(invalid.writes(), 0);
});

test('migration reports safe failure categories and account ids without credential values', async () => {
  const invalid = database(['legacy-password', 'é'.repeat(37)]);
  const error = await migratePasswords(invalid, { apply: true }).catch(error => error);
  const message = migrationFailureMessage(error);
  assert.match(message, /LEGACY_PASSWORD_RESET_REQUIRED/);
  assert.match(message, /account 1/);
  assert.doesNotMatch(message, /legacy-password|é/);
  const column = await migratePasswords(database(['legacy-password'], 'VARCHAR(50)')).catch(error => error);
  assert.match(migrationFailureMessage(column), /PASSWORD_COLUMN_TOO_SHORT/);
  assert.doesNotMatch(migrationFailureMessage(new Error('database credential fixture')), /credential fixture/);
});
