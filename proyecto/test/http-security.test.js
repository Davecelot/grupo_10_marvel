const assert = require('node:assert/strict');
const { test, before, after } = require('node:test');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const sessionOptions = require('../src/security/sessionOptions');
const { csrfToken } = require('../src/middlewares/csrf');
const { imageUpload, MAX_IMAGE_BYTES } = require('../src/middlewares/imageUpload');
const state = { user: null, created: null, deleted: [] };
require.cache[require.resolve('../src/database/models')] = { exports: {
  User: {
    findOne: async ({ where }) => state.user?.mail === where.mail ? state.user : null,
    findByPk: async id => state.user?.id === id ? state.user : null,
    findAll: async () => [],
    create: async user => { state.created = user; },
    destroy: async ({ where }) => { state.deleted.push(['user', Number(where.id)]); },
  },
  Movie: { destroy: async ({ where }) => { state.deleted.push(['movie', Number(where.id)]); } },
  Rol: { findAll: async () => [] },
  sequelize: {},
} };
const app = require('../src/app');
let server, base;
before(async () => {
  state.user = { id: 3, name: 'Duplicate name', roleId: 5, mail: 'person@example.test', password: await bcrypt.hash('correct-password', 4) };
  server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => { await new Promise(resolve => server.close(resolve)); });

async function form() {
  const response = await fetch(base+'/users/login');
  const html = await response.text();
  const token = html.match(/name="_csrf" value="([a-f0-9]{64})"/)[1];
  return { response, html, token, cookie: response.headers.get('set-cookie').split(';')[0] };
}

test('real login forms carry a session-bound token and hardened cookies/headers', async () => {
  const { response, token } = await form();
  assert.equal(response.status, 200);
  assert.equal(token.length, 64);
  assert.match(response.headers.get('set-cookie'), /^marvel\.sid=/);
  assert.match(response.headers.get('set-cookie'), /HttpOnly/);
  assert.match(response.headers.get('set-cookie'), /SameSite=Lax/);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(response.headers.get('x-powered-by'), null);
});

test('login and logout reject absent, cross-session and malformed CSRF tokens', async () => {
  const first = await form();
  const second = await form();
  for (const [route, token] of [['login', null], ['login', second.token], ['cerrarSesion', first.token.replace(/./g, 'é')]]) {
    const response = await fetch(base+'/users/'+route, { method: 'POST', headers: { cookie: first.cookie, 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ correo: 'person@example.test', password: 'correct-password', ...token && { _csrf: token } }), redirect: 'manual' });
    assert.equal(response.status, 403);
  }
});

test('successful login changes the session id; logout invalidates it; user API is admin-only', async () => {
  const first = await form();
  const login = await fetch(base+'/users/login', { method: 'POST', headers: { cookie: first.cookie, 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ correo: 'person@example.test', password: 'correct-password', _csrf: first.token }), redirect: 'manual' });
  assert.equal(login.status, 302);
  const authenticated = login.headers.getSetCookie().find(value => value.startsWith('marvel.sid=')).split(';')[0];
  assert.notEqual(authenticated, first.cookie);
  const users = await fetch(base+'/api/users', { headers: { cookie: authenticated } });
  assert.equal(users.status, 403);
  const anon = await fetch(base+'/api/users');
  assert.equal(anon.status, 401);
  const page = await fetch(base+'/', { headers: { cookie: authenticated } });
  const token = (await page.text()).match(/name="_csrf" value="([a-f0-9]{64})"/)[1];
  const logout = await fetch(base+'/users/cerrarSesion', { method: 'POST', headers: { cookie: authenticated, 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ _csrf: token }), redirect: 'manual' });
  assert.equal(logout.status, 302);
  const stale = await fetch(base+'/api/users', { headers: { cookie: authenticated } });
  assert.equal(stale.status, 401);
});

test('production sessions require an external secret and secure HTTP-only cookies', () => {
  assert.throws(() => sessionOptions({ NODE_ENV: 'production' }), /SESSION_SECRET/);
  const config = sessionOptions({ NODE_ENV: 'production', SESSION_SECRET: 'unit-test-secret-of-sufficient-length' });
  assert.equal(config.cookie.secure, true);
  assert.equal(config.cookie.httpOnly, true);
  assert.equal(config.cookie.sameSite, 'lax');
});

test('administrator deletes reject tokenless and foreign-token multipart requests', async () => {
  const originalRole = state.user.roleId;
  state.user.roleId = 1;
  state.deleted = [];
  try {
    const first = await form();
    const login = await fetch(base+'/users/login', {
      method: 'POST', headers: { cookie: first.cookie, 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ correo: state.user.mail, password: 'correct-password', _csrf: first.token }),
      redirect: 'manual',
    });
    assert.equal(login.status, 302);
    const cookie = login.headers.getSetCookie().find(value => value.startsWith('marvel.sid=')).split(';')[0];
    const page = await fetch(base+'/users/login', { headers: { cookie } });
    const token = (await page.text()).match(/name="_csrf" value="([a-f0-9]{64})"/)[1];
    const foreign = await form();
    for (const [route, kind, id] of [
      ['/admin/editProducts/delete/73', 'movie', 73],
      ['/admin/userDelete/74?_method=DELETE', 'user', 74],
    ]) {
      for (const supplied of [undefined, foreign.token]) {
        const body = new FormData(); body.set('ignored', 'value');
        const result = await fetch(base+route, { method: 'POST',
          headers: { cookie, ...(supplied ? { 'x-csrf-token': supplied } : {}) }, body, redirect: 'manual' });
        assert.equal(result.status, 403, route);
        assert.deepEqual(state.deleted, []);
      }
      const body = new FormData(); body.set('ignored', 'value');
      const valid = await fetch(base+route, { method: 'POST',
        headers: { cookie, 'x-csrf-token': token }, body, redirect: 'manual' });
      assert.equal(valid.status, 302);
      assert.deepEqual(state.deleted, [[kind, id]]);
      state.deleted = [];
    }
  } finally { state.user.roleId = originalRole; }
});

test('multipart forgery, executable content and oversize uploads never reach disk', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'marvel-upload-'));
  const uploadApp = express();
  uploadApp.use(session(sessionOptions({})));
  uploadApp.use(csrfToken);
  uploadApp.get('/form', (req, res) => res.json({ token: res.locals.csrfToken }));
  uploadApp.post('/upload', imageUpload(directory, 'test'), (req, res) => res.json({ filename: req.file.filename }));
  uploadApp.use((error, req, res, next) => res.sendStatus(error.code === 'LIMIT_FILE_SIZE' ? 413 : 400));
  const uploadServer = uploadApp.listen(0, '127.0.0.1');
  await new Promise(resolve => uploadServer.once('listening', resolve));
  const url = `http://127.0.0.1:${uploadServer.address().port}`;
  try {
    const response = await fetch(url+'/form');
    const { token } = await response.json();
    const cookie = response.headers.get('set-cookie').split(';')[0];
    const png = Buffer.from([137,80,78,71,13,10,26,10]);
    for (const [name, mime, body, csrf, expected] of [
      ['image.png', 'image/png', png, 'forged', 403],
      ['attack.html', 'text/html', '<script>alert(1)</script>', token, 400],
      ['fake.png', 'image/png', '<script>alert(1)</script>', token, 400],
      ['large.png', 'image/png', Buffer.alloc(MAX_IMAGE_BYTES+1), token, 413],
    ]) {
      const form = new FormData();form.set('_csrf',csrf);form.set('imagen',new Blob([body],{type:mime}),name);
      const result = await fetch(url+'/upload',{method:'POST',headers:{cookie},body:form});
      assert.equal(result.status,expected,name);
      assert.deepEqual(await fs.readdir(directory),[]);
    }
    const valid = new FormData();valid.set('_csrf',token);valid.set('imagen',new Blob([png],{type:'image/png'}),'../../untrusted.png');
    const accepted = await fetch(url+'/upload',{method:'POST',headers:{cookie},body:valid});
    assert.equal(accepted.status,200);
    const {filename}=await accepted.json();
    assert.match(filename,/^[a-z]-[A-Za-z0-9_-]{22}\.png$/);
    assert.ok(('/images/movie-images/'+filename).length <= 50, 'stored movie path must fit existing schema');
    assert.ok(('/images/user-images/'+filename).length <= 50, 'stored user path must fit existing schema');
    assert.deepEqual(await fs.readdir(directory),[filename]);
  } finally {
    await new Promise(resolve => uploadServer.close(resolve));
    await fs.rm(directory,{recursive:true,force:true});
  }
});

test('registration accepts a valid CSRF/image form and stores only a password hash', async () => {
  const response = await fetch(base+'/users/register');
  const cookie = response.headers.get('set-cookie').split(';')[0];
  const token = (await response.text()).match(/name="_csrf" value="([a-f0-9]{64})"/)[1];
  const form = new FormData();
  form.set('_csrf',token);form.set('nombre','New Member');form.set('correo','new@example.test');
  form.set('password','new-test-password');form.set('conpassword','new-test-password');form.set('cmbRol','1');
  form.set('imagen',new Blob([Buffer.from([137,80,78,71,13,10,26,10])],{type:'image/png'}),'avatar.png');
  try {
    const result = await fetch(base+'/users/register',{method:'POST',headers:{cookie},body:form,redirect:'manual'});
    assert.equal(result.status,302);
    assert.equal(result.headers.get('location'),'/users/login');
    assert.equal(state.created.roleId,5);
    assert.ok(state.created.image.length <= 50, 'registration image must fit VARCHAR(50)');
    assert.equal(await bcrypt.compare('new-test-password',state.created.password),true);
  } finally {
    if(state.created?.image) await fs.unlink(path.join(__dirname,'../public',state.created.image));
  }
});

test('invalid registration forms do not persist an uploaded image', async () => {
  const directory = path.join(__dirname,'../public/images/user-images');
  const before = await fs.readdir(directory);
  const response = await fetch(base+'/users/register');
  const cookie = response.headers.get('set-cookie').split(';')[0];
  const token = (await response.text()).match(/name="_csrf" value="([a-f0-9]{64})"/)[1];
  const form = new FormData();form.set('_csrf',token);form.set('nombre','');form.set('correo','invalid');
  form.set('password','short');form.set('conpassword','different');
  form.set('imagen',new Blob([Buffer.from([137,80,78,71,13,10,26,10])],{type:'image/png'}),'avatar.png');
  const result = await fetch(base+'/users/register',{method:'POST',headers:{cookie},body:form});
  assert.equal(result.status,200);
  const html=await result.text();
  assert.match(html,/Las contraseñas deben coincidir/);
  assert.doesNotMatch(html,/value="short"|value="different"/);
  assert.deepEqual(await fs.readdir(directory),before);
});
