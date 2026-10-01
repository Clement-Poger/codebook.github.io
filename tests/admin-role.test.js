const test = require('node:test');
const assert = require('node:assert/strict');
const { isAdminRoleUser } = require('../app/admin-role.js');

test('detect admin from app metadata role', () => {
  assert.equal(isAdminRoleUser({ app_metadata: { role: 'admin' } }), true);
});

test('detect admin from protected app metadata flag', () => {
  assert.equal(isAdminRoleUser({ app_metadata: { is_admin: true } }), true);
});

test('reject admin claims from user-editable metadata and profile fields', () => {
  assert.equal(isAdminRoleUser({ user_metadata: { role: 'admin', is_admin: true } }), false);
  assert.equal(isAdminRoleUser({ is_admin: true, role: 'admin', admin: true }), false);
});

test('reject non-admin user', () => {
  assert.equal(isAdminRoleUser({ app_metadata: { role: 'authenticated' } }), false);
});
