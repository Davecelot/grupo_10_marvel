#!/usr/bin/env node
const bcrypt = require('bcryptjs');
const hashed = value => typeof value === 'string' && /^\$2[aby]\$\d\d\$[./A-Za-z0-9]{53}$/.test(value);

function migrationFailureMessage(error) {
  if (error.code === 'PASSWORD_COLUMN_TOO_SHORT') {
    return '[PASSWORD_COLUMN_TOO_SHORT] The users.password column must hold at least 60 characters.';
  }
  if (error.code === 'LEGACY_PASSWORD_RESET_REQUIRED') {
    const account = Number.isSafeInteger(error.userId) && error.userId >= 0 ? ` for account ${error.userId}` : '';
    return `[LEGACY_PASSWORD_RESET_REQUIRED] Reset the password${account} before retrying; migration rolled back.`;
  }
  // Never forward database messages, SQL or bound values to diagnostics.
  return '[MIGRATION_FAILED] Verify database connectivity and local configuration; no credentials were printed.';
}

async function migratePasswords(db, { apply = false } = {}) {
  const description = await db.sequelize.getQueryInterface().describeTable('users');
  const type = description.password?.type || '';
  const width = /(?:VAR)?CHAR\((\d+)\)/i.exec(type);
  if (!/TEXT/i.test(type) && (!width || Number(width[1]) < 60)) {
    throw Object.assign(new Error('The users.password column must hold at least 60 characters before migration.'), {
      code: 'PASSWORD_COLUMN_TOO_SHORT',
    });
  }
  return db.sequelize.transaction(async transaction => {
    const users = await db.User.findAll({ attributes: ['id', 'password'], transaction, lock: transaction.LOCK.UPDATE });
    const candidates = users.filter(user => !hashed(user.password));
    // Validate every row before changing any; the transaction also rolls back
    // if a write fails partway through the migration.
    for (const user of candidates) {
      if (typeof user.password !== 'string' || !user.password || Buffer.byteLength(user.password, 'utf8') > 72) {
        throw Object.assign(new Error('A legacy credential requires an account password reset; migration rolled back.'), {
          code: 'LEGACY_PASSWORD_RESET_REQUIRED', userId: Number(user.id),
        });
      }
    }
    if (apply) {
      for (const user of candidates) {
        await user.update({ password: await bcrypt.hash(user.password, 12) }, { transaction });
      }
    }
    return candidates.length;
  });
}

module.exports = { migratePasswords, migrationFailureMessage };

// Explicit offline upgrade: never connect to a database when imported by tests.
if (require.main === module) {
  if (!process.argv.includes('--apply') && !process.argv.includes('--dry-run')) {
    console.error('Usage: node scripts/hash-legacy-passwords.js --dry-run | --apply');
    process.exitCode = 1;
  } else {
    const db = require('../src/database/models');
    const apply = process.argv.includes('--apply');
    migratePasswords(db, { apply }).then(count => {
      console.log(`${apply ? 'Migrated' : 'Would migrate'} ${count} legacy password records. No credentials were printed.`);
    }).catch(error => {
      console.error(migrationFailureMessage(error));
      process.exitCode = 1;
    }).finally(() => db.sequelize.close());
  }
}
