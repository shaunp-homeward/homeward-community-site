const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function bookingHarness() {
  let receive;
  const changes = [];
  const frame = { contentWindow: {}, style: { setProperty: (...args) => changes.push(args) } };
  const document = { querySelector: () => null, addEventListener() {}, getElementById: () => frame };
  const window = { addEventListener: (name, listener) => { if (name === 'message') receive = listener; } };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../src/v17/site.js'), 'utf8'), { document, window });
  return { frame, changes, send: (height, options = {}) => receive({ origin: 'https://calendly.com', source: frame.contentWindow, data: { event: 'calendly.page_height', payload: { height } }, ...options }) };
}

test('Calendly CSS pixel height expands the iframe for the complete booking form', () => {
  const { send, changes } = bookingHarness();
  send('1184px');
  assert.deepEqual(changes, [['height', '1184px', 'important']]);
});

test('Only the actual Calendly frame can resize the booking area', () => {
  const { send, changes } = bookingHarness();
  send('1184px', { origin: 'https://example.com' });
  send('1184px', { source: {} });
  send('1184px', { data: { event: 'other-event', payload: { height: '1184px' } } });
  send('100000px');
  send('calc(100vh)');
  assert.equal(changes.length, 0);
});
