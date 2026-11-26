import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runStatus, sumDownloads, pypiBelongsTo } from './repo-stats.js';

test('runStatus uses the conclusion only when completed', () => {
  assert.equal(runStatus({ status: 'completed', conclusion: 'failure' }), 'failure');
  assert.equal(runStatus({ status: 'in_progress', conclusion: null }), 'in_progress');
});

test('sumDownloads adds known counts and returns null for none', () => {
  assert.equal(sumDownloads(10, null, 5), 15);
  assert.equal(sumDownloads(null, undefined), null);
  assert.equal(sumDownloads(0, 0), null);
});

test('pypiBelongsTo requires a link to the owner on GitHub', () => {
  const mine = { project_urls: { Source: 'https://github.com/wattnet/wattnet-core' } };
  assert.equal(pypiBelongsTo('wattnet', mine), true);
  assert.equal(pypiBelongsTo('wattnet', { home_page: 'https://github.com/someone/docs' }), false);
  assert.equal(pypiBelongsTo('wattnet', {}), false);
});
