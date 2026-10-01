import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { validateInquiry, validateInquiryField } from '../scripts/form-validation.mjs';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('the editorial theme stylesheet exposes its palette and motion safeguards', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');

  assert.match(html, /<link\b[^>]*\bhref=["']styles\.css["'][^>]*>/i);
  assert.match(css, /--forest\s*:\s*#24342b\b/i);
  assert.match(css, /--cream\s*:\s*#f3efe6\b/i);
  assert.match(css, /--orange\s*:\s*#d85a3a\b/i);
  assert.match(css, /@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)/i);
});

test('the theme preserves accessible accent text and native focus outlines', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');

  assert.match(css, /--orange-text\s*:\s*#[0-9a-f]{6}\b/i);
  assert.doesNotMatch(css, /outline\s*:\s*0\b/i);
});

test('mobile navigation remains available until JavaScript enhances it', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');

  assert.doesNotMatch(css, /^\s*\.desktop-nav\s*\{\s*display\s*:\s*none\s*;/m);
  assert.match(css, /^\s*\.js\s+\.desktop-nav\s*\{\s*display\s*:\s*none\s*;/m);
  assert.match(css, /^\s*\.js\s+\.mobile-nav-toggle\s*\{\s*display\s*:\s*block\s*;/m);
});

test('the approved brand image assets are present', async () => {
  for (const asset of ['logo-mark.svg', 'logo-lockup.png', 'food-table.webp', 'interior.webp', 'floorplan-100p.webp', 'floorplan-100p-isometric-v2.webp', 'floorplan-100p-2d-v2.webp', 'floorplan-100p-render-v2.webp']) {
    await assert.doesNotReject(
      access(new URL(`../assets/${asset}`, import.meta.url)),
      `missing dist/assets/${asset}`,
    );
  }
});

test('the official BAPSANGGUNG lockup replaces the temporary header and footer marks', async () => {
  await assert.doesNotReject(access(new URL('../assets/logo-lockup.png', import.meta.url)));

  const headerLogo = html.match(/<a\b[^>]*class=["']site-logo["'][\s\S]*?<\/a>/i)?.[0];
  const footerLogo = html.match(/<footer>[\s\S]*?<\/footer>/i)?.[0];

  assert.ok(headerLogo);
  assert.match(headerLogo, /src=["']assets\/logo-lockup\.png["']/);
  assert.doesNotMatch(headerLogo, /logo-mark\.svg/);
  assert.match(footerLogo, /src=["']assets\/logo-lockup\.png["']/);
});

test('the official logo has responsive desktop and mobile sizing', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  assert.match(css, /\.site-logo\s+img[\s\S]*width\s*:\s*clamp\(/);
  assert.match(css, /\.footer-logo\s*\{[\s\S]*width\s*:/);
  assert.match(css, /@media\s*\(max-width:\s*760px\)[\s\S]*\.site-logo\s+img/);
});

test('the landing page exposes every primary content section', () => {
  for (const id of ['brand', 'menu', 'space', 'system', 'model', 'inquiry']) {
    assert.match(html, new RegExp(`\\bid=["']${id}["']`), `missing #${id}`);
  }
});

test('navigation and inquiry form include their accessible hooks', () => {
  assert.match(html, /<nav\b[^>]*\baria-label=["']주요 메뉴["'][^>]*>/i);
  assert.match(html, /<form\b[^>]*\bid=["']inquiry-form["'][^>]*>/i);
  assert.match(html, /\baria-live=["']polite["']/i);
});

test('the design-demo inquiry form remains inert until its handler is available', () => {
  const formTag = html.match(/<form\b[^>]*\bid=["']inquiry-form["'][^>]*>/i)?.[0];
  const buttonTag = html.match(/<button\b[^>]*\btype=["']button["'][^>]*>/i)?.[0];

  assert.ok(formTag, 'missing #inquiry-form');
  assert.doesNotMatch(formTag, /\baction\s*=/i);
  assert.doesNotMatch(formTag, /\bmethod\s*=/i);
  assert.ok(buttonTag, 'demo consultation control must be statically inert');
  assert.match(html, /<button\b[^>]*\btype=["']button["'][^>]*>\s*상담 데모 확인하기\s*<\/button>/i);
});

test('the 100평 store gallery exposes three accessible views', () => {
  assert.match(html, /role="tablist" aria-label="100평 표준매장 도면"/);
  assert.equal((html.match(/role="tab"/g) ?? []).length, 3);
  assert.equal((html.match(/role="tabpanel"/g) ?? []).length, 3);
  assert.match(html, /aria-selected="true"/);
  assert.match(html, /floorplan-100p-isometric-v2\.webp/);
  assert.match(html, /floorplan-100p-2d-v2\.webp/);
  assert.match(html, /floorplan-100p-render-v2\.webp/);
  assert.doesNotMatch(html, /role="tabpanel"[^>]*\bhidden\b/);
});

test('the menu presents about 60 illustrative dishes across all six categories', () => {
  assert.match(html, /약\s*60종\s*예시\s*메뉴/);

  for (const dish of [
    '흰쌀밥', '잡곡밥', '계절 볶음밥',
    '소고기미역국', '된장찌개', '김치찌개', '사골떡국',
    '제육볶음', '간장불고기', '닭볶음탕', '생선구이',
    '계절 나물', '잡채', '전', '김치', '샐러드',
    '잔치국수 또는 비빔국수',
    '식혜', '과일', '차',
  ]) {
    assert.match(html, new RegExp(dish), `missing illustrative menu item: ${dish}`);
  }
});

test('the 100평 concept allocates all 330㎡ and distinguishes guest and staff circulation', () => {
  const zoningAreas = [...html.matchAll(/<li\b[^>]*\bdata-area=["'](\d+)["'][^>]*>/gi)]
    .map((match) => Number(match[1]));

  assert.equal(zoningAreas.reduce((sum, area) => sum + area, 0), 330);
  for (const allocation of [
    '다이닝', '185㎡', '아일랜드 뷔페', '45㎡', '입구·대기·결제', '15㎡',
    '주방', '55㎡', '직원 세척', '15㎡', '창고·사무실', '15㎡',
  ]) {
    assert.match(html, new RegExp(allocation), `missing zoning allocation: ${allocation}`);
  }
  assert.match(html, /고객 동선/);
  assert.match(html, /직원 조리·보충·회수 동선/);
  assert.match(html, /개념 설계/);
  assert.match(html, /보조 출입구/);
  assert.match(html, /화장실·고객용 손씻는 공간을 좌석으로 전환/);
  assert.doesNotMatch(html, /<span>화장실<\/span>/);
});

test('the business model states conservative illustrative operating assumptions and exclusions', () => {
  for (const assumption of [
    '약 132석', '운영 인력', '12–16명', '1일 회전', '2\.0–2\.5회',
    '예상 투자', '6\.5–9억원', '보증금·권리금', '현장별 추가 공사',
    '상권', '임대 조건', '영업시간', '운영 방식', '수익을 보장하지 않습니다',
  ]) {
    assert.match(html, new RegExp(assumption), `missing business-model qualification: ${assumption}`);
  }
});

test('the gallery script supports click and keyboard tab navigation', async () => {
  const script = await readFile(new URL('../script.js', import.meta.url), 'utf8');
  assert.match(script, /addEventListener\('click'/);
  assert.match(script, /ArrowRight/);
  assert.match(script, /ArrowLeft/);
  assert.match(script, /panel\.hidden\s*=/);
});

test('inquiry validation reports every required field with exact messages', () => {
  assert.deepEqual(validateInquiry({ name: '', phone: '', region: '' }), {
    name: '이름을 입력해주세요.',
    phone: '연락처를 입력해주세요.',
    region: '희망 지역을 입력해주세요.',
  });
});

test('inquiry validation accepts a complete inquiry', () => {
  assert.deepEqual(
    validateInquiry({ name: '김창업', phone: '010-1234-5678', region: '수원' }),
    {},
  );
});

test('field validation keeps whitespace-only input invalid until meaningful input is entered', () => {
  assert.equal(validateInquiryField('name', '   '), '이름을 입력해주세요.');
  assert.equal(validateInquiryField('name', ' 김창업 '), undefined);
});

test('the interaction script prevents submission and contains no transmission or storage APIs', async () => {
  const script = await readFile(new URL('../script.js', import.meta.url), 'utf8');
  const handlerIndex = script.indexOf("form.addEventListener('submit'");
  const enableIndex = script.indexOf("submitButton.type = 'submit'");
  const inputHandlerIndex = script.indexOf("addEventListener('input'");
  const inputValidationIndex = script.indexOf('validateInquiryField(', inputHandlerIndex);

  assert.match(script, /preventDefault\s*\(/);
  assert.ok(handlerIndex >= 0, 'missing form submit handler');
  assert.ok(enableIndex > handlerIndex, 'submit must only be enabled after its handler is attached');
  assert.ok(inputValidationIndex > inputHandlerIndex, 'input changes must revalidate the edited field');
  assert.match(script, /status\.textContent\s*=\s*hasVisibleErrors\s*\?/);
  assert.doesNotMatch(script, /\bfetch\s*\(/);
  assert.doesNotMatch(script, /\blocalStorage\b/);
});
