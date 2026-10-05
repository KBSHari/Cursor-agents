import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const htmlPath = join(dirname(fileURLToPath(import.meta.url)), 'index.html');
const html = readFileSync(htmlPath, 'utf8');

test('document title is exactly Hari-Agents', () => {
  assert.ok(html.includes('<title>Hari-Agents</title>'));
});

test('exactly one h1 Hari-Agents', () => {
  const exact = html.match(/<h1>Hari-Agents<\/h1>/g) ?? [];
  assert.equal(exact.length, 1);
  const headings = html.match(/<h1[\s>]/gi) ?? [];
  assert.equal(headings.length, 1);
});

test('single main wraps heading greeting tagline year and instruction', () => {
  const mains = html.match(/<main[\s>]/gi) ?? [];
  assert.equal(mains.length, 1);
  assert.match(
    html,
    /<main>\s*<h1>Hari-Agents<\/h1>\s*<p>Welcome to Hari-Agents<\/p>\s*<p>A personal agent workspace\.<\/p>\s*<p>2026<\/p>\s*<p>Page used for QA engineer<\/p>\s*<\/main>/
  );
});

test('visible year is the token 2026', () => {
  const paragraphTexts = [...html.matchAll(/<p>([^<]*)<\/p>/g)].map((match) => match[1]);
  assert.ok(
    paragraphTexts.includes('2026'),
    'expected a paragraph whose text is the year token 2026, not a longer digit run'
  );
});

test('exact instruction Page used for QA engineer is present', () => {
  const paragraphTexts = [...html.matchAll(/<p>([^<]*)<\/p>/g)].map((match) => match[1]);
  assert.ok(paragraphTexts.includes('Page used for QA engineer'));
});

test('greeting Welcome to Hari-Agents is present', () => {
  assert.ok(html.includes('Welcome to Hari-Agents'));
});

test('tagline A personal agent workspace. is present', () => {
  assert.ok(html.includes('A personal agent workspace.'));
});

test('no form element', () => {
  assert.ok(!html.includes('<form'));
});

test('no script element', () => {
  assert.ok(!html.includes('<script'));
});

test('no remote http or https URLs', () => {
  assert.ok(!html.includes('http://'));
  assert.ok(!html.includes('https://'));
});

test('styles.css is linked relatively', () => {
  assert.match(html, /<link\s+rel=["']stylesheet["']\s+href=["']styles\.css["']/);
});

test('viewport meta includes width=device-width', () => {
  assert.match(html, /<meta\s+name=["']viewport["'][^>]*>/);
  assert.ok(html.includes('width=device-width'));
});

test('html lang is en and charset is present', () => {
  assert.match(html, /<html\s+lang=["']en["']/);
  assert.match(html, /<meta\s+charset=["']utf-8["']/);
});

test('no analytics markers', () => {
  const lower = html.toLowerCase();
  assert.ok(!lower.includes('google-analytics'));
  assert.ok(!lower.includes('gtag('));
  assert.ok(!lower.includes('googletagmanager'));
  assert.ok(!lower.includes('analytics.js'));
});
