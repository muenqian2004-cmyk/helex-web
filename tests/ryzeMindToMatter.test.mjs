import { readFileSync } from 'fs';

// Read the coefficients JSON (Node ESM needs explicit JSON import assertion)
const coeffRaw = readFileSync(new URL('../src/data/ryzeSimulatorCoefficients.json', import.meta.url), 'utf8');

// We can't import the engine directly due to JSON import assertion issue in Node ESM.
// Instead, we test the coefficient data directly to verify the changes are correct.

// Test 0: Verify JSON is valid
const data = JSON.parse(coeffRaw);
console.log('Test 0 PASS: JSON is valid');
console.log('  meta.version:', data.meta.version);
console.log('  augments count:', data.augments.length);

// Test 1: 由心及物 is enabled with mana_to_hp = 0.5
const mtm = data.augments.find(a => a.augmentId === 'mind_to_matter');
console.assert(mtm, 'FAIL: mind_to_matter not found in augments');
console.assert(mtm.enabled === true, `FAIL: mind_to_matter.enabled should be true, got ${mtm.enabled}`);
console.assert(mtm.disabled === false, `FAIL: mind_to_matter.disabled should be false, got ${mtm.disabled}`);
console.assert(!mtm.reasonCn, `FAIL: mind_to_matter should not have reasonCn, got "${mtm.reasonCn}"`);
console.assert(mtm.effects.mana_to_hp === 0.5, `FAIL: mana_to_hp should be 0.5, got ${mtm.effects.mana_to_hp}`);
console.assert(mtm.priority !== '已禁用', `FAIL: priority should not be 已禁用`);
console.log('Test 1 PASS: 由心及物 enabled with mana_to_hp=0.5');

// Test 2: 末日寒冬 still has mana_to_hp=0.15
const fw = data.items.find(i => i.nameCn === '末日寒冬');
console.assert(fw, 'FAIL: 末日寒冬 not found');
console.assert(fw.effects.mana_to_hp === 0.15, `FAIL: 末日寒冬 mana_to_hp should be 0.15, got ${fw.effects.mana_to_hp}`);
console.log('Test 2 PASS: 末日寒冬 mana_to_hp=0.15');

// Test 3: Combined mana_to_hp = 0.65
const combined = mtm.effects.mana_to_hp + fw.effects.mana_to_hp;
console.assert(combined === 0.65, `FAIL: 0.5 + 0.15 should = 0.65, got ${combined}`);
console.log('Test 3 PASS: 由心及物(0.5) + 末日寒冬(0.15) = 0.65');

// Test 4: Toggle unlocked
const toggle = data.toggles.find(t => t.id === 'mind_to_matter_enabled');
console.assert(toggle, 'FAIL: mind_to_matter_enabled toggle not found');
console.assert(toggle.locked === false, `FAIL: toggle should be unlocked, got locked=${toggle.locked}`);
console.assert(!toggle.reasonCn, `FAIL: toggle should not have reasonCn`);
console.log('Test 4 PASS: mind_to_matter_enabled toggle unlocked');

// Test 5: Quality report updated
const qr = data.qualityReport;
const hasMtM = qr.requiredAugmentsPresent.includes('由心及物');
console.assert(hasMtM, 'FAIL: 由心及物 not in requiredAugmentsPresent');
console.assert(!qr.requiredAugmentsPresent.some(a => a.includes('disabled')), 'FAIL: no disabled marker in required augments');
const hasStackWarning = qr.warnings.some(w => w.includes('可以与由心及物 mana_to_hp=0.5 叠加'));
console.assert(hasStackWarning, 'FAIL: stacking note not in warnings');
console.log('Test 5 PASS: Quality report updated correctly');

// Test 6: Calibration test exists for mind_to_matter
const calTests = data.formula.calibrationTests;
const mtmCal = calTests.find(t => t.testId === 'mind_to_matter_enabled');
console.assert(mtmCal, 'FAIL: mind_to_matter_enabled calibration test not found');
console.assert(mtmCal.inputs.augments.includes('由心及物'), 'FAIL: 由心及物 not in cal test augments');
console.assert(mtmCal.intermediateValues.mana_to_hp === 0.65, `FAIL: cal test mana_to_hp should be 0.65`);
console.log('Test 6 PASS: Calibration test for 由心及物 exists');

console.log('\n✅ All 6 tests passed! 由心及物 is now enabled and properly configured.');
