const test = require('node:test');
const assert = require('node:assert/strict');
const { isAdminRoleUser } = require('../app/admin-role.js');

test('detect admin from app metadata role', () => {
  assert.equal(isAdminRoleUser({ app_metadata: { role: 'admin' } }), true);
});

test('detect admin from profile flag', () => {
  assert.equal(isAdminRoleUser({ is_admin: true }), true);
});

test('detect admin from profile role value', () => {
  assert.equal(isAdminRoleUser({ role: 'admin' }), true);
});

test('reject non-admin user', () => {
  assert.equal(isAdminRoleUser({ app_metadata: { role: 'authenticated' } }), false);
});
