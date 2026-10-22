const assert = require('node:assert/strict');
const { test } = require('node:test');
const bcrypt = require('bcryptjs');
const state = { users: [], created: null, updated: null };
require.cache[require.resolve('../src/database/models')] = { exports: {
  User: {
    findAll: async ({ where } = {}) => where ? state.users.filter(user => user.mail === where.mail) : state.users,
    findOne: async ({ where }) => state.users.find(user => user.mail === where.mail) || null,
    create: async user => { state.created = user; },
    update: async user => { state.updated = user; },
  },
} };
const controller = require('../src/controllers/usersController');
const admin = require('../src/controllers/adminController');
function call(handler, req) {
  return new Promise((resolve, reject) => {
    const response = {
      redirect: location => resolve({ location }),
      render: (view, data) => resolve({ view, data }),
      clearCookie() {},
      cookie() {},
      status() { return response; },
      send: body => resolve({ body }),
    };
    handler(req, response, reject);
  });
}

test('registration persists a password hash and cannot choose an administrative role', async () => {
  state.users = [];
  await call(controller.save, { body: { nombre: 'New Person', correo: 'new@example.test', password: 'test-password-1', cmbRol: '1' }, file: { filename: 'avatar.png' } });
  assert.notEqual(state.created.password, 'test-password-1');
  assert.equal(await bcrypt.compare('test-password-1', state.created.password), true);
  assert.equal(state.created.roleId, 5);
  assert.equal(state.created.id, undefined);
});

test('login accepts a bcrypt password, rotates the session and binds the user id', async () => {
  const password = 'test-password-2';
  state.users = [{ id: 7, name: 'Admin', roleId: 1, mail: 'admin@example.test', password: await bcrypt.hash(password, 4) }];
  let regenerated = false;
  const fresh = { cookie: {}, save: done => done() };
  const req = { body: { correo: 'admin@example.test', password, preservar: 'on' }, session: { regenerate(done) { regenerated = true; req.session = fresh; done(); } } };
  const result = await call(controller.logged, req);
  assert.equal(result.location, '/admin/index');
  assert.equal(regenerated, true);
  assert.equal(req.session.userId, 7);
  assert.equal(req.session.Usuario, 'Admin');
  assert.equal(req.session.cookie.maxAge, 3600000);
});

test('legacy plaintext credentials do not authenticate before offline migration', async () => {
  state.users = [{ id: 7, name: 'Admin', roleId: 1, mail: 'admin@example.test', password: 'legacy-password' }];
  const req = { body: { correo: 'admin@example.test', password: 'legacy-password' }, session: {} };
  const result = await call(controller.logged, req);
  assert.equal(result.view, 'users/login');
  assert.equal(req.session.userId, undefined);
  assert.equal(result.data.oldData.password, undefined);
});

test('admin edits preserve the password unless a new one was supplied', async () => {
  const req = { params: { id: '7' }, session: {}, body: { nombre: 'Name', correo: 'name@example.test', cmbRol: '5', password: '' } };
  await call(admin.userUpdate, req);
  assert.equal(Object.hasOwn(state.updated, 'password'), false);
  req.body.password = 'replacement-password';
  await call(admin.userUpdate, req);
  assert.notEqual(state.updated.password, req.body.password);
  assert.equal(await bcrypt.compare(req.body.password, state.updated.password), true);
});
