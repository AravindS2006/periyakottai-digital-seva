'use client';

import React, { useState } from 'react';
import { useI18n } from '@/i18n/context';
import { Volume2, VolumeX } from 'lucide-react';
import { speakText, stopSpeaking } from '@/lib/tts';

interface VoiceAssistButtonProps {
  textToSpeak: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function VoiceAssistButton({
  textToSpeak,
  size = 'md',
  className = ''
}: VoiceAssistButtonProps) {
  const { language } = useI18n();
  const [isPlaying, setIsPlaying] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
    } else {
      speakText(
        textToSpeak,
        language,
        () => setIsPlaying(true),
        () => setIsPlaying(false)
      );
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1 gap-1',
    md: 'text-xs sm:text-sm px-3 py-1.5 gap-1.5',
    lg: 'text-sm sm:text-base px-4 py-2 gap-2'
  }[size];

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center rounded-lg font-semibold transition-all border ${
        isPlaying
          ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-400'
          : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
      } ${sizeClasses} ${className}`}
      title={isPlaying ? 'நிறுத்து' : 'கேட்டு அறிய'}
      aria-label={isPlaying ? 'Stop speech audio' : 'Listen audio in Tamil or English'}
    >
      {isPlaying ? (
        <>
          <VolumeX className="w-4 h-4 text-amber-700 animate-pulse" />
          <span>{language === 'ta' ? 'நிறுத்து' : 'Stop'}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-emerald-700" />
          <span>{language === 'ta' ? 'கேட்டு அறிய' : 'Listen'}</span>
        </>
      )}
    </button>
  );
}
