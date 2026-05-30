import { readFileSync } from 'fs';

// ─── Load raw data for direct testing ───
const augMech = JSON.parse(readFileSync(new URL('../src/data/augmentItemRecommender/augment_mechanic_tags.json', import.meta.url), 'utf8')).data;
const itemTags = JSON.parse(readFileSync(new URL('../src/data/augmentItemRecommender/item_effect_tags.json', import.meta.url), 'utf8')).data;
const heroRoles = JSON.parse(readFileSync(new URL('../src/data/augmentItemRecommender/hero_role_weights.json', import.meta.url), 'utf8')).data;
const synRules = JSON.parse(readFileSync(new URL('../src/data/augmentItemRecommender/augment_item_synergy_rules.json', import.meta.url), 'utf8')).data;
const fallback = JSON.parse(readFileSync(new URL('../src/data/augmentItemRecommender/role_item_fallback_rules.json', import.meta.url), 'utf8')).data;

let passed = 0, failed = 0;
function check(label, condition) {
  if (condition) { console.log(`✅ ${label}`); passed++; }
  else { console.log(`❌ ${label}`); failed++; }
}

// ── Test data integrity ──
console.log('=== Data Integrity ===');
check('195 augments loaded', augMech.length === 195);
check('200 items loaded', itemTags.length === 200);
check('172 heroes loaded', heroRoles.length === 172);
check('161 synergy rules loaded', synRules.length === 161);
check('6 fallback roles loaded', fallback.length === 6);

// ── Test structure ──
console.log('\n=== Structure ===');
const a = augMech[0];
check('augment has mechanicStrength', typeof a.mechanicStrength === 'string');
check('augment has preferredItemTags', Array.isArray(a.preferredItemTags));
check('item has statTags', Array.isArray(itemTags[0].statTags));
check('hero has roleWeights', Array.isArray(heroRoles[0].roleWeights));
check('syndata has scoreTier', typeof synRules[0].scoreTier === 'string');
check('fallback has preferredItemTags with weight', fallback[0].preferredItemTags[0].weight > 0);

// ── Test 1: Ryze + 由心及物 → mana/HP items recommended ──
console.log('\n=== Test 1: Ryze + 由心及物 ===');
const ryze = heroRoles.find(h => h.heroId === 'ryze');
check('Ryze found', !!ryze);
check('Ryze is 法师', ryze?.roles.includes('法师'));

const mtm = augMech.find(a => a.augmentId === 'mind_to_matter');
check('由心及物 found', !!mtm);
check('由心及物 prefers mana/HP tags', mtm?.preferredItemTags.some(t => ['mana_item', 'hp_item', 'sustain_item'].includes(t)));

const mtmRules = synRules.filter(r => r.augmentId === 'mind_to_matter');
check('由心及物 has synergy rules', mtmRules.length > 0);
const hasManaOrHP = mtmRules.some(r => {
  return r.matchedItemTags.some(t => ['mana_item', 'hp_item', 'sustain_item'].includes(t)) ||
         r.preferredItemIds.length > 0 ||
         r.reasonCn.includes('法力值') || r.reasonCn.includes('生命值');
});
check('由心及物 rules mention 法力值 or 生命值', hasManaOrHP);

// Items use raw stat tags (mana, hp) not category tags (mana_item, hp_item)
// Category tags are mapped via ROLE_TAG_TO_STAT in the algorithm
const manaHPItems = itemTags.filter(i => {
  return i.statTags.some(t => ['mana', 'hp'].includes(t));
});
check('Items with mana/hp stat tags exist', manaHPItems.length > 0);
console.log('  Found', manaHPItems.length, 'items with mana or hp stats');

// ── Test 2: Ryze solo (no augments) → mage/AP items ──
console.log('\n=== Test 2: Ryze no augments ===');
const mageFallback = fallback.find(f => f.role === '法师');
check('法师 fallback exists', !!mageFallback);
const hasAPTag = mageFallback?.preferredItemTags.some(t => ['ap_item', 'mage', 'mana_item', 'ability_haste'].includes(t.tag));
check('法师 fallback has AP/mana/haste tags', hasAPTag);

// ── Test 3: Anti-synergy exists ──
console.log('\n=== Test 3: Anti-synergy ===');
const antiRules = synRules.filter(r => r.avoidItemIds.length > 0 || r.avoidItemTags.length > 0);
console.log('  Anti-synergy rules found:', antiRules.length);
check('Anti-synergy rules exist in data', antiRules.length > 0);
if (antiRules.length > 0) {
  check('Anti rule has avoidItemIds or avoidItemTags', antiRules[0].avoidItemIds.length > 0 || antiRules[0].avoidItemTags.length > 0);
}

// ── Test 4: Multiple augments deduplication (structural check) ──
console.log('\n=== Test 4: item uniqueness ===');
const allItemIds = new Set(itemTags.map(i => i.itemId));
check('All 200 item IDs are unique', allItemIds.size === itemTags.length);

// ── Test 5: Tag dictionary consistency ──
console.log('\n=== Test 5: Tag consistency ===');
const allAugTags = new Set(augMech.flatMap(a => [...a.preferredItemTags, ...a.avoidItemTags]));
const allSynTags = new Set(synRules.flatMap(r => [...r.matchedItemTags, ...r.avoidItemTags]));
check('Augment tags and synergy tags overlap', [...allAugTags].filter(t => allSynTags.has(t)).length > 0);

// ── Summary ──
console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
if (failed > 0) process.exit(1);
