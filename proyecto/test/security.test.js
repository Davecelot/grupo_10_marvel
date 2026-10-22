const assert = require('node:assert/strict');
const { test } = require('node:test');
const path = require('node:path');
const http = require('node:http');
const express = require('express');

const modelsPath = require.resolve('../src/database/models');
const state = { findAllCalls: 0, byId: null };
require.cache[modelsPath] = { exports: {
  User: {
    findAll: async () => { state.findAllCalls++; return [{ id: 1, name: 'shared-name', roleId: 1 }]; },
    findByPk: async id => state.byId && Number(id) === state.byId.id ? state.byId : null,
  },
} };

const remember = require('../src/middlewares/rememberUserMiddleware');
const validateAdmin = require('../src/middlewares/validateAdmin');

test('an unsigned display-name cookie cannot establish authentication', () => {
  const req = { cookies: { usuario: 'shared-name' }, session: {} };
  remember(req, { clearCookie: () => {} }, () => {});
  assert.equal(req.session.Usuario, undefined);
  assert.equal(req.session.userId, undefined);
});

test('admin authorization rejects display-name-only sessions without querying users', async () => {
  state.findAllCalls = 0;
  const result = {};
  const response = { locals: {}, sendStatus: code => { result.status = code; return response; }, end: () => {} };
  await validateAdmin({ session: { Usuario: 'shared-name' } }, response, () => { result.next = true; });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(result.status, 401);
  assert.equal(result.next, undefined);
  assert.equal(state.findAllCalls, 0);
});

test('admin role is resolved by authenticated user id, not a duplicate display name', async () => {
  state.byId = { id: 9, name: 'shared-name', roleId: 5 };
  const result = {};
  const response = { locals: {}, sendStatus: code => { result.status = code; return response; }, end: () => {} };
  await validateAdmin({ session: { userId: 9, Usuario: 'shared-name' } }, response, () => { result.next = true; });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(result.status, 403);
  assert.equal(result.next, undefined);
});

test('all administrator mutations reject anonymous requests before controllers or uploads', async () => {
  const controllersPath = require.resolve('../src/controllers/adminController');
  const mutations = [
    ['POST', '/createProducts'], ['POST', '/editProducts/delete/1'], ['PUT', '/editProducts/1'],
    ['POST', '/userCreate'], ['PUT', '/userEdit/1'], ['DELETE', '/userDelete/1'],
  ];
  let controllerCalls = 0;
  require.cache[controllersPath] = { exports: new Proxy({}, { get: () => (req, res) => { controllerCalls++; res.sendStatus(200); } }) };
  const app = express();
  app.use((req, res, next) => { req.session = {}; next(); });
  app.use(require('../src/routes/admin'));
  const server = app.listen(0, '127.0.0.1');
  try {
    await new Promise(resolve => server.once('listening', resolve));
    for (const [method, route] of mutations) {
      const response = await fetch(`http://127.0.0.1:${server.address().port}${route}`, { method });
      assert.equal(response.status, 401, `${method} ${route}`);
    }
    assert.equal(controllerCalls, 0);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
