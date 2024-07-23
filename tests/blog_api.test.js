const { test, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const api = supertest(app);

after(async () => {
  mongoose.connection.close();
});

test('returns the correct amount of blog posts', async () => {
  const res = await api.get('/api/blogs');

  assert.strictEqual(res.body.length, 2);
});