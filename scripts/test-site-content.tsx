import React from 'react';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { renderSiteInline, SiteText } from '../src/siteContent';
import { EDITABLE_SITE_FIELDS } from '../src/siteContentCatalog';

test('literal HTML remains escaped text, only limited markup is enabled', () => {
  const html = renderToStaticMarkup(
    <span>{renderSiteInline('A **szép** és *fontos* zene.\n<script>alert(1)</script>')}</span>
  );
  assert.match(html, /<strong>szép<\/strong>/);
  assert.match(html, /<em>fontos<\/em>/);
  assert.match(html, /<br\/>/);
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(!html.includes('<script>'));
});

test('default copy stays visible without a database response', () => {
  const html = renderToStaticMarkup(
    <SiteText id="home.intro" fallback="Eredeti, jóváhagyott tananyag." />
  );
  assert.match(html, /Eredeti, jóváhagyott tananyag/);
});

test('approved simple styles do not inject HTML or arbitrary attributes', () => {
  const html = renderToStaticMarkup(
    <SiteText id="home.title" fallback="X" previewEntry={{
      text: '**Új** cím',
      style: { color: 'indigo', size: 'large', spacing: 'relaxed' }
    }} />
  );
  assert.match(html, /text-indigo-700/);
  assert.match(html, /text-lg/);
  assert.match(html, /leading-loose/);
  assert.match(html, /<strong>Új<\/strong>/);
});

test('all catalog fields have unique, stable keys covered by PHP validation', () => {
  assert.ok(EDITABLE_SITE_FIELDS.length > 40);
  const keys = EDITABLE_SITE_FIELDS.map(field => field.id);
  assert.equal(new Set(keys).size, keys.length, 'duplicate editor IDs');
  const valid = /^(?:home\.(?:title|intro)|navbar\.(?:chapters|flashcards|matching|quiz|eartraining|dashboard)|chapter\.[a-z0-9-]+\.(?:title|description)|sub\.[a-z0-9-]+\.(?:title|summary|paragraph\.[0-9]{1,3})|module\.(?:creative|musicHistory|musicPedagogy|musicExpressions)\.(?:title|description))$/;
  for (const field of EDITABLE_SITE_FIELDS) {
    assert.match(field.id, valid);
    assert.ok(field.fallback.trim().length > 0);
  }
});
