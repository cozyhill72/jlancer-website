import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync, readdirSync} from 'node:fs';
import {resolve, dirname, relative} from 'node:path';
const root = resolve('site');
const walk = directory => readdirSync(directory, {withFileTypes: true}).flatMap(entry => entry.isDirectory() ? walk(resolve(directory, entry.name)) : [resolve(directory, entry.name)]);
const paths = walk(root);
const files = paths.map(path => relative(root, path).replaceAll('\\', '/'));
test('Every local link, asset and section target exists on project Pages paths', () => {
  for (const path of paths.filter(path => path.endsWith('.html'))) {
    const html = readFileSync(path, 'utf8');
    for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(https:|mailto:)/.test(url)) continue;
      assert.ok(!url.startsWith('/'), `Root-relative path breaks project Pages: ${url}`);
      if (url.startsWith('#')) assert.ok(html.includes(`id="${url.slice(1)}"`), `Missing ${url}`);
      else assert.ok(existsSync(resolve(dirname(path), url)), `Missing ${url}`);
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
  assert.deepEqual(files.sort(), ['.nojekyll','chamsae/terms/index.html','index.html','main.js','mark.svg','privacy.html','style.css'].sort());
  for (const path of paths) {
    const source=readFileSync(path,'utf8');
    const file=relative(root,path);
    assert.ok(!/(?:github_pat_|ghp_)[A-Za-z0-9_]{20,}|-----BEGIN .*PRIVATE KEY-----/.test(source), `Potential secret: ${file}`);
    assert.ok(!/\b(?:localStorage|sessionStorage|document\.cookie)\b/.test(source));
  }
});
test('Published terms contain the approved v1.0 text, all 11 articles, effective date and privacy policy', () => {
  const html=readFileSync(resolve(root,'chamsae/terms/index.html'),'utf8');
  for (let article=1; article<=11; article++) assert.ok(html.includes(`제${article}조 (`), `Missing article ${article}`);
  for (const expected of ['v1.0','2026년 11월 5일','운영자:</strong> 제이랜서','https://cozyhill72.github.io/chamsae-bangatgan-privacy/','본 약관은 상단에 기재된 시행일부터 적용합니다.']) assert.ok(html.includes(expected), `Missing terms content: ${expected}`);
});

