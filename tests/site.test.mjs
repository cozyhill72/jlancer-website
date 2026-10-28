import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync, readdirSync} from 'node:fs';
import {resolve, dirname} from 'node:path';
const root = resolve('site');
const files = readdirSync(root);
test('Every local link, asset and section target exists on project Pages paths', () => {
  for (const file of files.filter(f => f.endsWith('.html'))) {
    const html = readFileSync(resolve(root, file), 'utf8');
    for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(https:|mailto:)/.test(url)) continue;
      assert.ok(!url.startsWith('/'), `Root-relative path breaks project Pages: ${url}`);
      if (url.startsWith('#')) assert.ok(html.includes(`id="${url.slice(1)}"`), `Missing ${url}`);
      else assert.ok(existsSync(resolve(dirname(resolve(root, file)), url)), `Missing ${url}`);
    }
  }
});
test('Site has required truthful launch state, contact and privacy link', () => {
  const html = readFileSync(resolve(root,'index.html'),'utf8');
  for (const text of ['Google Play 출시 준비 중','mailto:cozyhill@jlancer.net','./privacy.html','콘셉트 예시']) assert.ok(html.includes(text));
  assert.ok(!html.includes('play.google.com/store'));
  assert.ok(!html.includes('blog.naver.com/'));
});
test('HTML pages provide mobile viewport, Korean language and content policy', () => {
  for (const file of files.filter(f=>f.endsWith('.html'))) {
    const html=readFileSync(resolve(root,file),'utf8');
    for (const expected of ['lang="ko"','name="viewport"','Content-Security-Policy','<main']) assert.ok(html.includes(expected), `${file}: ${expected}`);
    assert.ok(!/<script[^>]*src="https?:/.test(html));
  }
});
test('Only an explicit static file allowlist is published, without domain override', () => {
  assert.deepEqual(files.sort(), ['.nojekyll','index.html','main.js','mark.svg','privacy.html','style.css'].sort());
  for (const file of files) {
    const source=readFileSync(resolve(root,file),'utf8');
    assert.ok(!/(?:github_pat_|ghp_)[A-Za-z0-9_]{20,}|-----BEGIN .*PRIVATE KEY-----/.test(source), `Potential secret: ${file}`);
    assert.ok(!/\b(?:localStorage|sessionStorage|document\.cookie)\b/.test(source));
  }
});
