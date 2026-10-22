const assert = require('node:assert/strict');
const { test } = require('node:test');
const { Sequelize, DataTypes } = require('sequelize');

test('patched Sequelize UUID dependency still supports model default UUIDs', async () => {
  const sequelize = new Sequelize('compatibility-test', 'test', '', { dialect: 'mysql', logging: false });
  try {
    const Record = sequelize.define('Record', { id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true } });
    const first = Record.build();
    const second = Record.build();
    assert.match(first.id, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    assert.notEqual(first.id, second.id);
  } finally { await sequelize.close(); }
});
