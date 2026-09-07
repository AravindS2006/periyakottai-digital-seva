// Web Speech API wrapper for Tamil and English Text-to-Speech

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function speakText(
  text: string,
  lang: 'ta' | 'en' = 'ta',
  onStart?: () => void,
  onEnd?: () => void
): void {
  if (!isSpeechSupported()) {
    console.warn('Speech synthesis not supported in this browser');
    return;
  }

  // Cancel any ongoing speech
  stopSpeaking();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9; // Slightly slower for rural audience clarity
  utterance.pitch = 1.0;

  if (lang === 'ta') {
    utterance.lang = 'ta-IN';
  } else {
    utterance.lang = 'en-IN';
  }

  // Attempt to find a native voice
  const voices = window.speechSynthesis.getVoices();
  const targetVoice = voices.find((v) => 
    lang === 'ta' ? v.lang.includes('ta') : (v.lang.includes('en-IN') || v.lang.includes('en-US'))
  );

  if (targetVoice) {
    utterance.voice = targetVoice;
  }

  if (onStart) utterance.onstart = onStart;
  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
}
