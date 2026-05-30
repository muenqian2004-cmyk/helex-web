import { useState, useCallback, useEffect, useRef } from 'react';
import { Sun, Volume2 } from 'lucide-react';
import { ThemeDialog, getStoredTheme } from './ThemeDialog';
import { AudioSettingsDialog } from './AudioSettingsDialog';
import ColorBends from './ColorBends';
import { Logo } from './Logo';
import {
  type AudioSettings,
  WELCOME_AUDIO_VOLUME,
  getWelcomeAudioSrc,
  loadAudioSettings,
} from '@/lib/welcomeAudio';

export function WelcomeScreen({ onEnter }: { onEnter: () => void }) {
  const [theme, setTheme] = useState(getStoredTheme());
  const [showTheme, setShowTheme] = useState(false);
  const [showAudio, setShowAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pendingPlaybackRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const check = () => setTheme(getStoredTheme());
    window.addEventListener('storage', check);
    return () => window.removeEventListener('storage', check);
  }, []);

  const onThemeClose = () => {
    setShowTheme(false);
    setTheme(getStoredTheme());
  };

  const clearPendingPlayback = useCallback(() => {
    const pendingPlayback = pendingPlaybackRef.current;
    if (!pendingPlayback) return;

    window.removeEventListener('pointerdown', pendingPlayback);
    window.removeEventListener('keydown', pendingPlayback);
    window.removeEventListener('touchstart', pendingPlayback);
    pendingPlaybackRef.current = null;
  }, []);

  const playWelcomeAudio = useCallback(
    (settings: AudioSettings) => {
      clearPendingPlayback();
      audioRef.current?.pause();
      audioRef.current = null;

      if (!settings.enabled) return;

      const audio = new Audio(getWelcomeAudioSrc(settings.language));
      audio.volume = WELCOME_AUDIO_VOLUME;
      audio.preload = 'auto';
      audioRef.current = audio;

      const retryAfterUserGesture = () => {
        clearPendingPlayback();
        audio.currentTime = 0;
        audio.play().catch(() => {});
      };

      audio.play().catch(() => {
        if (pendingPlaybackRef.current) return;

        pendingPlaybackRef.current = retryAfterUserGesture;
        window.addEventListener('pointerdown', retryAfterUserGesture, { once: true });
        window.addEventListener('keydown', retryAfterUserGesture, { once: true });
        window.addEventListener('touchstart', retryAfterUserGesture, { once: true });
      });
    },
    [clearPendingPlayback]
  );

  useEffect(() => {
    const settings = loadAudioSettings();
    playWelcomeAudio(settings);

    return () => {
      clearPendingPlayback();
      audioRef.current?.pause();
    };
  }, [clearPendingPlayback, playWelcomeAudio]);

  const onAudioSettingsChange = useCallback(
    (settings: AudioSettings) => {
      playWelcomeAudio(settings);
    },
    [playWelcomeAudio]
  );

  const isDark = theme === 'dark';

  const rootBg = isDark ? '#020208' : '#e8ecf4';
  const textColor = isDark ? '#ffffff' : '#1a1a2e';
  const mutedColor = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.5)';
  const btnTextColor = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';
  const btnBorderColor = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)';
  const btnBgColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)';
  const logoTextColor = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)';

  const sidePadding = 'clamp(0.5rem, 2.5vw, 36px)';

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden" style={{ background: rootBg }}>
      {/* ColorBends background */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <ColorBends
          rotation={160}
          speed={0.2}
          colors={["#5227FF", "#FF9FFC", "#7CFF67"]}
          transparent
          autoRotate={0}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          parallax={0.5}
          noise={0.15}
          iterations={1}
          intensity={1.5}
          bandWidth={6}
        />
      </div>

      {/* Content wrapper */}
      <div className="relative mx-auto h-full flex flex-col" style={{ maxWidth: '1240px', paddingLeft: sidePadding, paddingRight: sidePadding, zIndex: 1 }}>

        {/* Top Navbar */}
        <nav className="flex items-center justify-between shrink-0" style={{ paddingTop: 'clamp(1rem, 2.5vh, 2rem)' }}>
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Logo className="w-8 h-8 shrink-0" />
            <span
              className="text-sm font-medium tracking-widest select-none"
              style={{ fontFamily: '"TREND", "Geist Variable", sans-serif', color: logoTextColor }}
            >
              AERILIA
            </span>
          </div>

          {/* Right buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAudio(true)}
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border transition-all hover:scale-105 active:scale-95 cursor-pointer"
              style={{ color: btnTextColor, borderColor: btnBorderColor, background: btnBgColor }}
            >
              <Volume2 className="h-4 w-4" /> 音效
            </button>
            <button
              onClick={() => setShowTheme(true)}
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border transition-all hover:scale-105 active:scale-95 cursor-pointer"
              style={{ color: btnTextColor, borderColor: btnBorderColor, background: btnBgColor }}
            >
              <Sun className="h-4 w-4" /> 颜色
            </button>
          </div>
        </nav>

        {/* Hero Content — lower left */}
        <div className="flex-1 flex items-end" style={{ paddingBottom: 'clamp(4rem, 15vh, 10rem)' }}>
          <div style={{ maxWidth: '560px' }}>
            {/* Title line 1 */}
            <h1
              style={{
                fontFamily: '"新青年体", "Noto Serif CJK SC", "SimSun", "Songti SC", serif',
                fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
                lineHeight: 1.15,
                fontWeight: 700,
                color: textColor,
                margin: 0,
              }}
            >
              欢迎，尊敬的
            </h1>

            {/* Title line 2 */}
            <h1
              style={{
                fontFamily: '"新青年体", "Noto Serif CJK SC", "SimSun", "Songti SC", serif',
                fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
                lineHeight: 1.15,
                fontWeight: 700,
                color: textColor,
                margin: 0,
                marginBottom: 'clamp(0.6rem, 1.2vw, 1rem)',
              }}
            >
              英雄联盟召唤师
            </h1>

            {/* Description */}
            <p
              style={{
                fontFamily: '"新青年体", "Noto Serif CJK SC", "SimSun", "Songti SC", serif',
                fontSize: 'clamp(0.6rem, 1.25vw, 0.95rem)',
                lineHeight: 1.5,
                color: mutedColor,
                margin: 0,
                marginBottom: 'clamp(1.5rem, 2.5vw, 2.2rem)',
                maxWidth: '85%',
              }}
            >
              属于每个人的游戏工具
            </p>

            {/* Start button */}
            <button
              onClick={onEnter}
              className="relative inline-flex items-center justify-center rounded-full border transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer select-none"
              style={{
                width: '50%',
                minWidth: '140px',
                padding: '0.75rem 2rem',
                color: textColor,
                borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
                background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(8px)',
                fontSize: 'clamp(0.85rem, 1.1vw, 1rem)',
                letterSpacing: '0.05em',
              }}
            >
              Start
            </button>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      {showTheme && <ThemeDialog onClose={onThemeClose} />}
      {showAudio && (
        <AudioSettingsDialog
          onClose={() => setShowAudio(false)}
          onSettingsChange={onAudioSettingsChange}
        />
      )}
    </div>
  );
}
