import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(dir, 'index.html'), 'utf8');

test('search input is type text', () => {
  assert.match(html, /<input[^>]*id=["']search-input["'][^>]*>/);
  assert.match(html, /<input[^>]*type=["']text["'][^>]*>/);
});

test('Clear is a type=button with visible Clear text', () => {
  assert.match(html, /<button[^>]*id=["']search-clear["'][^>]*>/);
  assert.match(html, /<button[^>]*type=["']button["'][^>]*>Clear<\/button>/);
});

test('no form element', () => {
  assert.ok(!html.includes('<form'));
});

test('classic search.js script without type=module', () => {
  assert.match(html, /<script\s+src=["']search\.js["']><\/script>/);
  assert.ok(!html.includes('type="module"'));
  assert.ok(!html.includes("type='module'"));
});

test('input is not type=search', () => {
  assert.ok(!html.includes('type="search"'));
  assert.ok(!html.includes("type='search'"));
});
