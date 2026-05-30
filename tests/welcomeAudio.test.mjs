import assert from 'node:assert/strict';

const {
  DEFAULT_AUDIO_SETTINGS,
  WELCOME_AUDIO_SOURCES,
  getWelcomeAudioSrc,
  loadAudioSettings,
  saveAudioSettings,
} = await import('../src/lib/welcomeAudio.ts');

assert.equal(WELCOME_AUDIO_SOURCES.zh, '/audio/welcome_zh.mp3');
assert.equal(WELCOME_AUDIO_SOURCES.en, '/audio/welcome_en.mp3');
assert.equal(WELCOME_AUDIO_SOURCES.ko, '/audio/welcome_ko.mp3');
assert.equal(getWelcomeAudioSrc('zh'), '/audio/welcome_zh.mp3');
assert.equal(getWelcomeAudioSrc('en'), '/audio/welcome_en.mp3');
assert.equal(getWelcomeAudioSrc('ko'), '/audio/welcome_ko.mp3');
assert.equal(getWelcomeAudioSrc('unknown'), '/audio/welcome_zh.mp3');

const store = new Map();
const storage = {
  getItem: (key) => (store.has(key) ? store.get(key) : null),
  setItem: (key, value) => store.set(key, String(value)),
};

assert.deepEqual(loadAudioSettings(storage), DEFAULT_AUDIO_SETTINGS);
saveAudioSettings({ enabled: true, language: 'ko' }, storage);
assert.deepEqual(loadAudioSettings(storage), { enabled: true, language: 'ko' });

store.set('hextech_audio_settings', JSON.stringify({ enabled: false, language: 'en' }));
assert.deepEqual(loadAudioSettings(storage), { enabled: false, language: 'en' });

store.set('hextech_audio_settings', JSON.stringify({ enabled: true, language: 'bad' }));
assert.deepEqual(loadAudioSettings(storage), { enabled: true, language: 'zh' });

console.log('welcome audio settings and sources are valid');
