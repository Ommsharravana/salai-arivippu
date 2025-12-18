'use client';

import { TrafficEvent } from '@/types';

interface EventListProps {
  events: TrafficEvent[];
  selectedEvent: TrafficEvent | null;
  onEventSelect: (event: TrafficEvent) => void;
}

export default function EventList({ events, selectedEvent, onEventSelect }: EventListProps) {
  const getEventTypeEmoji = (type: string) => {
    switch (type) {
      case 'rally': return '🎤';
      case 'festival': return '🎉';
      case 'procession': return '🚶';
      case 'protest': return '✊';
      default: return '⚠️';
    }
  };

  const getSeverityClass = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high': return 'severity-high';
      case 'medium': return 'severity-medium';
      case 'low': return 'severity-low';
    }
  };

  const getSeverityBadge = (severity: 'high' | 'medium' | 'low') => {
    const configs = {
      high: { class: 'tag-danger', label: 'AVOID' },
      medium: { class: 'tag-warning', label: 'CAUTION' },
      low: { class: 'tag-safe', label: 'MINOR' },
    };
    const config = configs[severity];

    return (
      <span className={`tag ${config.class} px-2 py-0.5 rounded`}>
        {config.label}
      </span>
    );
  };

  const getSourceBadge = (source: 'official' | 'community' | 'radio', verified: boolean) => {
    if (source === 'official') {
      return <span className="tag tag-info px-2 py-0.5 rounded">Official</span>;
    }
    if (verified) {
      return <span className="tag tag-safe px-2 py-0.5 rounded">Verified</span>;
    }
    return (
      <span className="tag px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
        Unverified
      </span>
    );
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const isActive = (event: TrafficEvent) => {
    const now = new Date();
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    return now >= start && now <= end;
  };

  if (events.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--alert-safe)]/10 flex items-center justify-center">
          <span className="text-3xl">✅</span>
        </div>
        <p className="text-white font-medium mb-1">All Clear</p>
        <p className="text-[var(--text-muted)] text-sm">No traffic alerts in your area</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-[var(--border-subtle)]">
      {events.map((event, idx) => (
        <div
          key={event.id}
          onClick={() => onEventSelect(event)}
          className={`
            p-4 cursor-pointer transition-all duration-200
            hover:bg-[var(--bg-card)]/50 hover-lift
            animate-slide-up
            ${getSeverityClass(event.severity)}
            ${selectedEvent?.id === event.id
              ? 'bg-[var(--bg-card)] ring-1 ring-[var(--accent-secondary)]/30'
              : ''
            }
          `}
          style={{ animationDelay: `${idx * 50}ms` }}
        >
          <div className="flex items-start gap-3">
            {/* Event Icon */}
            <div className="flex-shrink-0">
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center text-xl
                ${event.severity === 'high'
                  ? 'bg-[var(--alert-danger)]/20'
                  : event.severity === 'medium'
                    ? 'bg-[var(--alert-warning)]/15'
                    : 'bg-[var(--alert-safe)]/15'
                }
              `}>
                {getEventTypeEmoji(event.type)}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              {/* Title Row */}
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-semibold text-white truncate">{event.title}</h3>
                {isActive(event) && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--alert-danger)] text-white text-[10px] font-bold rounded tracking-wider pulse-live">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    LIVE
                  </span>
                )}
              </div>

              {/* Tamil Title */}
              {event.titleTamil && (
                <p className="text-[var(--text-secondary)] text-sm mb-2">{event.titleTamil}</p>
              )}

              {/* Location */}
              <div className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] mb-2">
                <svg className="w-3.5 h-3.5 text-[var(--accent-secondary)]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="truncate">{event.location.name}</span>
              </div>

              {/* Time */}
              <div
                className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-3"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                <span className="text-[var(--accent-secondary)]">{formatDate(event.startTime)}</span>
                <span>•</span>
                <span>{formatTime(event.startTime)} – {formatTime(event.endTime)}</span>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {getSeverityBadge(event.severity)}
                {getSourceBadge(event.source, event.verified)}
              </div>

              {/* Affected Roads */}
              <div className="mb-2">
                <p className="text-[var(--alert-danger)] text-[10px] font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  Avoid these roads
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {event.affectedRoads.map((road, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-[var(--alert-danger)]/10 text-[var(--alert-danger)] text-xs rounded border border-[var(--alert-danger)]/20"
                    >
                      {road}
                    </span>
                  ))}
                </div>
              </div>

              {/* Alternate Routes */}
              {event.alternateRoutes && event.alternateRoutes.length > 0 && (
                <div>
                  <p className="text-[var(--alert-safe)] text-[10px] font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Use instead
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {event.alternateRoutes.map((route, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-[var(--alert-safe)]/10 text-[var(--alert-safe)] text-xs rounded border border-[var(--alert-safe)]/20"
                      >
                        {route}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Selection indicator */}
            {selectedEvent?.id === event.id && (
              <div className="flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-[var(--accent-secondary)]"></div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
