'use strict';
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');

// Minimal DOM harness, not a rendered-browser test.
class Element {
  constructor(id) {
    this.id = id; this.attrs = {}; this.events = {}; this.dataset = {};
    this.textContent = ''; this.tabIndex = 0; this.hidden = false;
    this.disabled = true; this.children = []; this.classes = new Set();
    this.classList = {
      add: x => this.classes.add(x), remove: x => this.classes.delete(x),
      contains: x => this.classes.has(x),
      toggle: (x, enabled) => enabled ? this.classes.add(x) : this.classes.delete(x)
    };
  }
  setAttribute(k, v) { this.attrs[k] = v; }
  getAttribute(k) { return this.attrs[k]; }
  addEventListener(k, fn) { assert.ok(!this.events[k], `Duplicate ${k}: ${this.id}`); this.events[k] = fn; }
  focus() { this.focused = true; }
  querySelectorAll() { return this.children; }
}
const selectors = ['.menu-toggle', '#navigation', '#area-title', '#area-text', '#area-panel',
  '[role=tablist]', '#copy-address', '#copy-status', '#enquiry-form', '#form-status',
  '#credits-button', '#credits', '#enquiry-form button[type=submit]', '#karl'];
const els = Object.fromEntries(selectors.map(id => [id, new Element(id)]));
const link = new Element('meet-karl-link'); link.setAttribute('href', '#karl');
els['#navigation'].children = [link];
const tabs = ['back', 'shoulders', 'hips', 'joints', 'muscles', 'posture', 'sport'].map(key => {
  const el = new Element(`tab-${key}`); el.dataset.area = key; return el;
});
const documentEvents = {}, media = {};
const document = {
  querySelector: selector => els[selector],
  querySelectorAll: selector => selector === '[role=tab]' ? tabs : [],
  addEventListener: (key, fn) => { documentEvents[key] = fn; }
};
let copied = '', denyClipboard = false;
const navigator = { clipboard: { writeText: async value => {
  if (denyClipboard) throw new Error('Permission denied'); copied = value;
} } };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../dist/app.js'), 'utf8'), {
  document, window: {}, navigator,
  matchMedia: query => media[query] ??= { matches: false, addEventListener(k, fn) { this.listener = fn; } }
});
const menu = els['.menu-toggle'], nav = els['#navigation'];
menu.events.click(); assert.equal(menu.attrs['aria-expanded'], 'true');
menu.events.click(); assert.equal(nav.classes.has('open'), false);
menu.events.click(); documentEvents.keydown({ key: 'Escape' });
assert.equal(nav.classes.has('open'), false); assert.ok(menu.focused);
menu.events.click(); link.events.click(); assert.ok(els['#karl'].focused);
assert.equal(els['#karl'].attrs.tabindex, '-1'); assert.equal(menu.attrs['aria-expanded'], 'false');
menu.events.click(); media['(max-width:850px)'].listener(); assert.equal(menu.attrs['aria-expanded'], 'false');
tabs.forEach(tab => {
  tab.events.click(); assert.equal(tab.attrs['aria-selected'], 'true');
  assert.equal(tabs.filter(t => t.attrs['aria-selected'] === 'true').length, 1);
  assert.equal(els['#area-panel'].attrs['aria-labelledby'], tab.id);
  assert.ok(els['#area-text'].textContent.length > 70);
});
for (const [index, key, expected] of [[6, 'ArrowRight', 0], [0, 'ArrowUp', 6], [2, 'Home', 0], [2, 'End', 6]]) {
  tabs[index].events.keydown({ key, preventDefault() {} });
  assert.equal(tabs[expected].attrs['aria-selected'], 'true');
  assert.ok(tabs[expected].focused);
}
media['(max-width:600px)'].matches = true; media['(max-width:600px)'].listener();
assert.equal(els['[role=tablist]'].attrs['aria-orientation'], 'horizontal');
let reset = false, prevented = false;
assert.equal(els['#enquiry-form button[type=submit]'].disabled, false);
els['#enquiry-form'].events.submit({ preventDefault() { prevented = true; }, target: { reset() { reset = true; } } });
assert.ok(reset && prevented); assert.match(els['#form-status'].textContent, /Nothing has been sent or stored/);
const credits = els['#credits-button'];
credits.events.click({ currentTarget: credits }); assert.equal(els['#credits'].hidden, false);
credits.events.click({ currentTarget: credits }); assert.equal(els['#credits'].hidden, true);
(async () => {
  await els['#copy-address'].events.click();
  assert.equal(copied, 'Salthill Osteopathic Clinic, 6 Monksfield, Salthill, Galway, H91 XN61, Ireland');
  assert.equal(els['#copy-status'].textContent, 'Address copied.');
  denyClipboard = true; await els['#copy-address'].events.click();
  assert.equal(els['#copy-status'].textContent, `Copy this address: ${copied}`);
  console.log('PASS: menu, Escape/focus, resize, 7 tabs, arrow/Home/End keys, mobile ARIA, demo form, credits, copy success/failure');
})().catch(error => { console.error(error); process.exitCode = 1; });
