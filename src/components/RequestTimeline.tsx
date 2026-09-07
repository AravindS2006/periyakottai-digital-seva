'use client';

import React from 'react';
import { useI18n } from '@/i18n/context';
import { CheckCircle2, Clock, AlertCircle, Check, ArrowDown } from 'lucide-react';
import { RequestStatus, GrievanceStatus, TimelineNote } from '@/types';

interface RequestTimelineProps {
  type?: 'request' | 'grievance';
  currentStatus: RequestStatus | GrievanceStatus;
  notes?: TimelineNote[];
  timelineEvents?: { date: string; status: string; note: string }[];
}

export function RequestTimeline({
  type = 'request',
  currentStatus,
  notes = [],
  timelineEvents = []
}: RequestTimelineProps) {
  const { language } = useI18n();

  const requestSteps: { key: RequestStatus; label: { ta: string; en: string } }[] = [
    { key: 'Submitted', label: { ta: 'பதிவு செய்யப்பட்டது', en: 'Submitted' } },
    { key: 'Under Review', label: { ta: 'பரிசீலனையில்', en: 'Under Review' } },
    { key: 'In Progress', label: { ta: 'நடவடிக்கையில்', en: 'In Progress' } },
    { key: 'Ready for Citizen', label: { ta: 'சான்றிதழ் தயார்', en: 'Ready for Citizen' } },
    { key: 'Completed', label: { ta: 'நிறைவு பெற்றது', en: 'Completed' } }
  ];

  const grievanceSteps: { key: GrievanceStatus; label: { ta: string; en: string } }[] = [
    { key: 'Received', label: { ta: 'புகார் பெறப்பட்டது', en: 'Received' } },
    { key: 'Forwarded to Official', label: { ta: 'அதிகாரிக்கு அனுப்பப்பட்டது', en: 'Forwarded' } },
    { key: 'Action Pending', label: { ta: 'கள ஆய்வு / நடவடிக்கை', en: 'Action Pending' } },
    { key: 'Resolved', label: { ta: 'தீர்வு காணப்பட்டது', en: 'Resolved' } },
    { key: 'Closed', label: { ta: 'முடிவு செய்யப்பட்டது', en: 'Closed' } }
  ];

  const steps = type === 'request' ? requestSteps : grievanceSteps;
  let currentIdx = steps.findIndex((s) => s.key === currentStatus);
  if (currentIdx === -1) {
    if (currentStatus === 'Completed' || currentStatus === 'Closed' || currentStatus === 'Resolved') {
      currentIdx = steps.length - 1;
    } else {
      currentIdx = 0;
    }
  }

  return (
    <div className="py-4">
      {/* Progress Bar Header */}
      <div className="relative flex items-center justify-between mb-8 max-w-2xl mx-auto px-2">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 w-full bg-slate-200 -z-0"></div>
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-emerald-600 transition-all duration-500 -z-0"
          style={{
            width: `${Math.max(0, (currentIdx / (steps.length - 1)) * 100)}%`
          }}
        ></div>

        {steps.map((step, idx) => {
          const isCompleted = idx <= currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm border-2 transition-all ${
                  isCurrent
                    ? 'bg-amber-400 border-amber-600 text-slate-950 ring-4 ring-amber-100 scale-110'
                    : isCompleted
                    ? 'bg-emerald-600 border-emerald-700 text-white'
                    : 'bg-white border-slate-300 text-slate-400'
                }`}
              >
                {isCompleted && !isCurrent ? (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <span
                className={`mt-2 text-[10px] sm:text-xs font-bold text-center max-w-[70px] sm:max-w-[90px] leading-tight ${
                  isCurrent
                    ? 'text-emerald-950 font-extrabold'
                    : isCompleted
                    ? 'text-emerald-800'
                    : 'text-slate-400'
                }`}
              >
                {step.label[language]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Detailed Timeline Feed */}
      <div className="mt-8 bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-4">
          {language === 'ta' ? 'நடவடிக்கை பதிவுகள் (Activity Log):' : 'Status Updates & Notes:'}
        </h4>

        <div className="space-y-4">
          {notes.length > 0 ? (
            notes.map((note, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{note.author}</span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(note.date).toLocaleString(language === 'ta' ? 'ta-IN' : 'en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
                    {note.message}
                  </p>
                </div>
              </div>
            ))
          ) : timelineEvents.length > 0 ? (
            timelineEvents.map((event, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-xs text-emerald-800">{event.status}</span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(event.date).toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-IN')}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
                    {event.note}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 italic">
              {language === 'ta' ? 'கூடுதல் குறிப்புகள் எதுவும் இல்லை.' : 'No remarks logged yet.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
