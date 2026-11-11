import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app.js';

test('Backend health endpoint returns HTTP 200', async () => {
  const response = await request(app).get('/');

  assert.equal(response.status, 200);
  assert.match(response.text, /Backend of wanderlust app is now accessible/);
});

test('Unknown endpoint returns HTTP 404', async () => {
  const response = await request(app).get('/ci-invalid-route');

  assert.equal(response.status, 404);
  assert.equal(response.body.success, false);
});
