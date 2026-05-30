export const AUDIO_KEY = 'hextech_audio_settings';

export const WELCOME_AUDIO_VOLUME = 0.6;

export const WELCOME_AUDIO_SOURCES = {
  zh: '/audio/welcome_zh.mp3',
  en: '/audio/welcome_en.mp3',
  ko: '/audio/welcome_ko.mp3',
};

export type WelcomeAudioLanguage = keyof typeof WELCOME_AUDIO_SOURCES;

export interface AudioSettings {
  enabled: boolean;
  language: WelcomeAudioLanguage;
}

type AudioStorage = Pick<Storage, 'getItem' | 'setItem'>;

export const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  enabled: true,
  language: 'zh',
};

const isWelcomeAudioLanguage = (value: unknown): value is WelcomeAudioLanguage =>
  typeof value === 'string' &&
  Object.prototype.hasOwnProperty.call(WELCOME_AUDIO_SOURCES, value);

const resolveStorage = (storage?: AudioStorage | null): AudioStorage | null => {
  if (storage) return storage;
  if (typeof localStorage === 'undefined') return null;
  return localStorage;
};

export function getWelcomeAudioSrc(language: unknown): string {
  const resolvedLanguage = isWelcomeAudioLanguage(language)
    ? language
    : DEFAULT_AUDIO_SETTINGS.language;
  return WELCOME_AUDIO_SOURCES[resolvedLanguage];
}

export function normalizeAudioSettings(value: unknown): AudioSettings {
  if (!value || typeof value !== 'object') {
    return { ...DEFAULT_AUDIO_SETTINGS };
  }

  const candidate = value as Partial<AudioSettings>;

  return {
    enabled:
      typeof candidate.enabled === 'boolean'
        ? candidate.enabled
        : DEFAULT_AUDIO_SETTINGS.enabled,
    language: isWelcomeAudioLanguage(candidate.language)
      ? candidate.language
      : DEFAULT_AUDIO_SETTINGS.language,
  };
}

export function loadAudioSettings(storage?: AudioStorage | null): AudioSettings {
  const targetStorage = resolveStorage(storage);
  if (!targetStorage) return { ...DEFAULT_AUDIO_SETTINGS };

  try {
    const raw = targetStorage.getItem(AUDIO_KEY);
    return raw ? normalizeAudioSettings(JSON.parse(raw)) : { ...DEFAULT_AUDIO_SETTINGS };
  } catch {
    return { ...DEFAULT_AUDIO_SETTINGS };
  }
}

export function saveAudioSettings(
  settings: AudioSettings,
  storage?: AudioStorage | null
): void {
  const targetStorage = resolveStorage(storage);
  if (!targetStorage) return;

  targetStorage.setItem(AUDIO_KEY, JSON.stringify(normalizeAudioSettings(settings)));
}
