'use client';

import React, { useState } from 'react';
import { useI18n } from '@/i18n/context';
import { VoiceAssistButton } from '@/components/VoiceAssistButton';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ShieldCheck,
  PhoneCall,
  Mic,
  MicOff,
  AlertCircle
} from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  source?: string;
  verified?: boolean;
}

export default function AssistantPage() {
  const { language } = useI18n();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'assistant',
      text:
        language === 'ta'
          ? 'வணக்கம்! நான் பெரியாக்கோட்டை டிஜிட்டல் உதவி வழிகாட்டி. அரசு சான்றிதழ்கள், விவசாய மானியங்கள், அல்லது நால்ரோடு இ-சேவை மைய உதவிகள் குறித்து உங்கள் கேள்வியைக் கேளுங்கள்.'
          : 'Welcome! I am the Periyakottai Digital Public Assistant. Ask questions about government certificates, farmer subsidies, or e-Seva centre procedures.',
      source: 'அரசு சரிபார்க்கப்பட்ட வழிகாட்டி',
      verified: true
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const sampleQuestions = [
    {
      label: language === 'ta' ? 'பட்டா பெயர் மாற்றம் செய்ய என்ன ஆவணங்கள் வேண்டும்?' : 'Documents for Patta transfer?',
      q: 'பட்டா பெயர் மாற்றம் ஆவணங்கள்'
    },
    {
      label: language === 'ta' ? 'சொட்டு நீர் பாசன மானியம் யாருக்கு கிடைக்கும்?' : 'Who gets drip irrigation subsidy?',
      q: 'சொட்டு நீர் பாசன மானியம்'
    },
    {
      label: language === 'ta' ? 'மகளிர் உரிமைத் தொகை தகுதி என்ன?' : 'Who qualifies for Magalir Urimai?',
      q: 'கலைஞர் மகளிர் உரிமைத் திட்டம் தகுதி'
    },
    {
      label: language === 'ta' ? 'ஒட்டன்சத்திரம் வட்டாட்சியர் அலுவலக எண்?' : 'Oddanchatram Tahsildar contact number?',
      q: 'ஒட்டன்சத்திரம் வட்டாட்சியர்'
    }
  ];

  const handleSend = async (questionToSend?: string) => {
    const q = (questionToSend || inputText).trim();
    if (!q || loading) return;

    const userMsg: ChatMessage = { sender: 'user', text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, language })
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        sender: 'assistant',
        text: data.answer || (language === 'ta' ? 'தகவலை பெற இயலவில்லை.' : 'Failed to retrieve answer.'),
        source: data.source,
        verified: data.verified
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text:
            language === 'ta'
              ? 'இணைப்பில் பிழை ஏற்பட்டுள்ளது. தயவுசெய்து நால்ரோடு மையத்தை 9790382437 என்ற எண்ணில் அழைக்கவும்.'
              : 'Connection error. Please call the centre directly at 9790382437.',
          verified: false
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'ta' ? 'ta-IN' : 'en-IN';
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setIsListening(false);
      handleSend(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full text-xs font-bold">
          <Sparkles className="w-4 h-4 text-emerald-700" />
          <span>{language === 'ta' ? 'உதவி வழிகாட்டி' : 'Knowledge Assistant'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950">
          {language === 'ta' ? 'பெரியாக்கோட்டை டிஜிட்டல் உதவி AI' : 'Bilingual Public Service Assistant'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          {language === 'ta'
            ? 'அரசு சேவைகள், ஆவணங்கள் மற்றும் அலுவலகங்கள் குறித்து உங்கள் கேள்விகளை கேளுங்கள். சரிபார்க்கப்பட்ட அரசு விதிகளிலிருந்து பதிலளிக்கப்படும்.'
            : 'Ask questions in Tamil or English. Answers are strictly synthesized from verified government directories.'}
        </p>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-3xl border-2 border-emerald-300 shadow-lg flex flex-col h-[520px] overflow-hidden">
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-emerald-700 text-white rounded-tr-none'
                    : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {msg.sender === 'assistant' && (
                  <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                    {msg.source && (
                      <span className="flex items-center gap-1 font-semibold text-emerald-800">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{msg.source}</span>
                      </span>
                    )}
                    <VoiceAssistButton textToSpeak={msg.text} size="sm" />
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 italic pl-10">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce delay-100"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce delay-200"></span>
              <span>{language === 'ta' ? 'பதிலை தேடுகிறது...' : 'Searching verified knowledge base...'}</span>
            </div>
          )}
        </div>

        {/* Sample Quick Chips */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-slate-400 font-bold shrink-0">{language === 'ta' ? 'கேட்கலாம்:' : 'Try:'}</span>
          {sampleQuestions.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sample.q)}
              className="shrink-0 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 px-2.5 py-1 rounded-full border border-slate-200 transition-colors"
            >
              {sample.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                language === 'ta'
                  ? 'உங்கள் கேள்வியை தட்டச்சு செய்யவும் அல்லது மைக்ரோஃபோனை அழுத்தவும்...'
                  : 'Type your question or click microphone...'
              }
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-600 text-xs sm:text-sm text-slate-900 focus:outline-none"
            />

            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-3 rounded-xl transition-colors ${
                isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title="பேசி கேள்வி கேட்க"
              aria-label="Voice input"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white p-3 rounded-xl transition-all"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Human Contact Banner */}
      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="text-center sm:text-left">
          <span className="font-bold text-emerald-950 block">
            {language === 'ta' ? 'சிக்கலான கேள்விகளுக்கு நேரடி மனித உதவி:' : 'Prefer speaking with a person?'}
          </span>
          <span className="text-slate-600">
            {language === 'ta'
              ? 'நால்ரோடு இ-சேவை மைய ஆபரேட்டர் முருகேசன் கு - 9790382437'
              : 'Murugesan K, Nalroad Makkal e-Seva Centre - 9790382437'}
          </span>
        </div>
        <a
          href="tel:9790382437"
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shrink-0"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>97903 82437</span>
        </a>
      </div>
    </div>
  );
}
