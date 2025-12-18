'use client';

import { useState } from 'react';
import { EventType, ReportFormData, TrafficEvent } from '@/types';

interface ReportFormProps {
  onSubmit: (event: TrafficEvent) => void;
  onClose: () => void;
}

export default function ReportForm({ onSubmit, onClose }: ReportFormProps) {
  const [formData, setFormData] = useState<ReportFormData>({
    title: '',
    type: 'rally',
    locationName: '',
    lat: 11.3410,
    lng: 77.7172,
    affectedRoads: '',
    startTime: '',
    endTime: '',
    description: '',
  });

  const [step, setStep] = useState(1);

  const eventTypes: { value: EventType; label: string; labelTamil: string; emoji: string }[] = [
    { value: 'rally', label: 'Political Rally', labelTamil: 'அரசியல் பேரணி', emoji: '🎤' },
    { value: 'festival', label: 'Festival/Procession', labelTamil: 'விழா/ஊர்வலம்', emoji: '🎉' },
    { value: 'protest', label: 'Protest/Dharna', labelTamil: 'போராட்டம்', emoji: '✊' },
    { value: 'other', label: 'Other', labelTamil: 'மற்றவை', emoji: '⚠️' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newEvent: TrafficEvent = {
      id: Date.now().toString(),
      title: formData.title,
      type: formData.type,
      severity: 'medium',
      location: {
        lat: formData.lat,
        lng: formData.lng,
        name: formData.locationName,
      },
      affectedRoads: formData.affectedRoads.split(',').map(r => r.trim()).filter(r => r),
      startTime: formData.startTime,
      endTime: formData.endTime,
      description: formData.description,
      source: 'community',
      verified: false,
      reportedBy: 'Anonymous',
      reportedAt: new Date().toISOString(),
    };

    onSubmit(newEvent);
    onClose();
  };

  const quickLocations = [
    { name: 'Pirindura Toll Gate', lat: 11.3410, lng: 77.7172 },
    { name: 'Erode Bus Stand', lat: 11.3428, lng: 77.7186 },
    { name: 'Komarapalayam', lat: 11.3394, lng: 77.7264 },
    { name: 'Namakkal Bus Stand', lat: 11.2189, lng: 78.1674 },
    { name: 'Salem Junction', lat: 11.6643, lng: 78.1460 },
  ];

  const getStepIndicator = () => {
    return (
      <div className="flex items-center justify-center gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`
                w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold
                transition-all duration-300
                ${step === s
                  ? 'bg-gradient-to-br from-[var(--accent-primary)] to-[var(--alert-danger)] text-white'
                  : step > s
                    ? 'bg-[var(--alert-safe)]/20 text-[var(--alert-safe)] border border-[var(--alert-safe)]/30'
                    : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)]'
                }
              `}
            >
              {step > s ? '✓' : s}
            </div>
            {s < 3 && (
              <div
                className={`
                  w-8 h-0.5 mx-1
                  ${step > s ? 'bg-[var(--alert-safe)]' : 'bg-[var(--border-subtle)]'}
                `}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[var(--bg-deep)]/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative glass-panel rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-5 border-b border-[var(--border-subtle)] bg-gradient-to-r from-[var(--alert-danger)]/10 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <h2
                className="text-xl tracking-wider text-white"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                REPORT ALERT
              </h2>
              <p className="text-[var(--text-muted)] text-xs mt-0.5">
                அறிவிப்பு பதிவு செய்க
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-center transition-all duration-200 hover:border-[var(--alert-danger)]/50"
            >
              <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5">
          {getStepIndicator()}

          {/* Step 1: Event Type */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center mb-6">
                <p className="text-[var(--text-secondary)] text-sm">
                  What type of event is this?
                </p>
                <p className="text-[var(--text-muted)] text-xs mt-1">
                  என்ன வகையான நிகழ்வு?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {eventTypes.map((type, idx) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, type: type.value });
                      setStep(2);
                    }}
                    className={`
                      p-4 rounded-xl border-2 text-center transition-all duration-300
                      hover:scale-[1.02] hover:shadow-lg animate-slide-up
                      ${formData.type === type.value
                        ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-card)]/50 hover:border-[var(--accent-secondary)]/50'
                      }
                    `}
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <span className="text-3xl block mb-2">{type.emoji}</span>
                    <span className="text-sm font-medium text-white block">{type.label}</span>
                    <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">{type.labelTamil}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="text-center mb-4">
                <p className="text-[var(--text-secondary)] text-sm">
                  Where is this happening?
                </p>
                <p className="text-[var(--text-muted)] text-xs mt-1">
                  எங்கே நடக்கிறது?
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Quick Select
                </label>
                <div className="flex flex-wrap gap-2">
                  {quickLocations.map((loc, idx) => (
                    <button
                      key={loc.name}
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          locationName: loc.name,
                          lat: loc.lat,
                          lng: loc.lng,
                        });
                      }}
                      className={`
                        px-3 py-1.5 text-xs rounded-lg transition-all duration-200 animate-fade-in
                        ${formData.locationName === loc.name
                          ? 'bg-[var(--accent-secondary)] text-white'
                          : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-secondary)]/50'
                        }
                      `}
                      style={{ animationDelay: `${idx * 30}ms` }}
                    >
                      {loc.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Or type location name
                </label>
                <input
                  type="text"
                  value={formData.locationName}
                  onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                  placeholder="e.g., Near Perundurai Bus Stand"
                  className="w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-secondary)] focus:ring-1 focus:ring-[var(--accent-secondary)]/30 transition-all"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 px-4 py-3 rounded-xl bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:border-[var(--text-muted)] transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!formData.locationName}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-[var(--accent-secondary)] to-[var(--accent-tertiary)] text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[var(--accent-secondary)]/20 transition-all"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Details */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., DMK Rally at Main Road"
                  className="w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-secondary)] focus:ring-1 focus:ring-[var(--accent-secondary)]/30 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--alert-danger)] uppercase tracking-wider mb-2 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  Roads to Avoid *
                </label>
                <input
                  type="text"
                  value={formData.affectedRoads}
                  onChange={(e) => setFormData({ ...formData, affectedRoads: e.target.value })}
                  placeholder="NH544, Main Road, Bus Stand Road"
                  className="w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--alert-danger)]/30 rounded-xl text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--alert-danger)] focus:ring-1 focus:ring-[var(--alert-danger)]/30 transition-all"
                  required
                />
                <p className="text-[10px] text-[var(--text-muted)] mt-1.5 flex items-center gap-1">
                  <span>Separate with commas</span>
                  <span className="text-[var(--text-muted)]">•</span>
                  <span>காற்புள்ளியால் பிரிக்கவும்</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                    Start Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-white text-sm focus:outline-none focus:border-[var(--accent-secondary)] transition-all [color-scheme:dark]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                    End Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-white text-sm focus:outline-none focus:border-[var(--accent-secondary)] transition-all [color-scheme:dark]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Additional Details
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Any other information..."
                  rows={2}
                  className="w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-secondary)] focus:ring-1 focus:ring-[var(--accent-secondary)]/30 transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 px-4 py-3 rounded-xl bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:border-[var(--text-muted)] transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3.5 rounded-xl bg-gradient-to-r from-[var(--alert-danger)] to-[var(--accent-primary)] text-white font-bold hover:shadow-lg hover:shadow-[var(--alert-danger)]/30 transition-all flex items-center justify-center gap-2"
                >
                  <span className="text-lg">🚨</span>
                  <span>REPORT</span>
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Footer hint */}
        <div className="px-5 pb-4">
          <p className="text-center text-[10px] text-[var(--text-muted)]">
            Your report will be verified by community members
          </p>
        </div>
      </div>
    </div>
  );
}
