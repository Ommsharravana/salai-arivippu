'use client';

import { useState, useEffect } from 'react';
import { TrafficEvent } from '@/types';
import { sampleEvents } from '@/data/sampleEvents';
import MapWrapper from '@/components/MapWrapper';
import EventList from '@/components/EventList';
import ReportForm from '@/components/ReportForm';

export default function Home() {
  const [events, setEvents] = useState<TrafficEvent[]>(sampleEvents);
  const [selectedEvent, setSelectedEvent] = useState<TrafficEvent | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'upcoming'>('all');
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const now = currentTime;

  const filteredEvents = events.filter((event) => {
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    if (activeTab === 'active') {
      return (now >= start && now <= end) || (start <= twoHoursFromNow && start >= now);
    }
    if (activeTab === 'upcoming') {
      return start > now;
    }
    return true;
  });

  const activeCount = events.filter((event) => {
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    return now >= start && now <= end;
  }).length;

  const handleAddEvent = (newEvent: TrafficEvent) => {
    setEvents([newEvent, ...events]);
    setSelectedEvent(newEvent);
    setMobileView('list');
  };

  return (
    <div className="min-h-screen min-h-[100dvh] gradient-mesh relative overflow-hidden flex flex-col">
      {/* Background pattern */}
      <div className="pattern-overlay fixed inset-0 pointer-events-none" />

      {/* Header - Compact on mobile */}
      <header className="relative z-10 border-b border-[var(--border-subtle)] flex-shrink-0">
        <div className="glass-panel">
          <div className="px-4 py-3 md:px-6 md:py-4">
            <div className="flex items-center justify-between">
              {/* Logo & Title */}
              <div className="flex items-center gap-3 animate-slide-in">
                <div className="relative">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-[var(--alert-danger)] to-[var(--accent-primary)] flex items-center justify-center">
                    <span className="text-xl md:text-2xl">🚨</span>
                  </div>
                  {activeCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-[var(--alert-danger)] rounded-full pulse-live" />
                  )}
                </div>
                <div>
                  <h1
                    className="text-xl md:text-3xl tracking-wider text-white"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    சாலை அறிவிப்பு
                  </h1>
                  <p className="text-[var(--text-muted)] text-[10px] md:text-xs tracking-widest uppercase">
                    Traffic Intelligence
                  </p>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-2 md:gap-4 animate-slide-in delay-200">
                {/* Live Status - Hidden on smallest screens */}
                {activeCount > 0 && (
                  <div className="hidden xs:flex items-center gap-2 px-2 py-1.5 md:px-4 md:py-2 rounded-lg bg-[var(--alert-danger)]/10 border border-[var(--alert-danger)]/30">
                    <span className="relative flex h-2 w-2 md:h-2.5 md:w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--alert-danger)] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-full w-full bg-[var(--alert-danger)]"></span>
                    </span>
                    <span
                      className="text-[var(--alert-danger)] text-xs md:text-sm font-semibold tracking-wide"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {activeCount} LIVE
                    </span>
                  </div>
                )}

                {/* Report Button */}
                <button
                  onClick={() => setShowReportForm(true)}
                  className="btn-primary px-3 py-2 md:px-5 md:py-2.5 rounded-lg flex items-center gap-2 min-h-[44px]"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="hidden sm:inline font-semibold text-sm md:text-base">Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filter Tabs - Scrollable on mobile */}
      <div className="relative z-10 border-b border-[var(--border-subtle)] bg-[var(--bg-panel)]/30 flex-shrink-0">
        <div className="px-4 md:px-6">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            {[
              { key: 'all', label: 'All', count: events.length },
              { key: 'active', label: 'Active', count: activeCount, urgent: true },
              { key: 'upcoming', label: 'Soon', count: events.filter(e => new Date(e.startTime) > now).length },
            ].map((tab, idx) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'all' | 'active' | 'upcoming')}
                className={`
                  relative px-4 py-3 text-sm font-medium transition-all duration-300 whitespace-nowrap
                  min-h-[44px] min-w-[44px]
                  animate-fade-in flex-shrink-0
                  ${activeTab === tab.key
                    ? 'text-white'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                  }
                `}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {tab.label}
                  <span
                    className={`
                      tag px-1.5 py-0.5 rounded text-[10px]
                      ${activeTab === tab.key
                        ? tab.urgent ? 'tag-danger' : 'tag-info'
                        : 'bg-[var(--bg-elevated)] text-[var(--text-muted)]'
                      }
                    `}
                  >
                    {tab.count}
                  </span>
                </span>
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content - Full height, stacked on mobile */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Event List Panel - Full screen on mobile when active */}
        <div
          className={`
            flex-1 lg:flex-none lg:w-[400px] xl:w-[420px]
            glass-panel lg:rounded-none overflow-hidden flex flex-col
            transition-transform duration-300 ease-out
            ${mobileView === 'list' ? 'translate-x-0' : '-translate-x-full absolute inset-0'}
            lg:translate-x-0 lg:relative lg:border-r lg:border-[var(--border-subtle)]
          `}
        >
          {/* Panel Header */}
          <div className="p-3 md:p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-card)]/50 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h2
                  className="text-base md:text-lg tracking-wide text-white"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  ALERTS
                </h2>
                <p className="text-[var(--text-muted)] text-[10px] md:text-xs">
                  {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-[var(--alert-danger)]" />
                <span className="w-2 h-2 rounded-full bg-[var(--alert-warning)]" />
                <span className="w-2 h-2 rounded-full bg-[var(--alert-safe)]" />
              </div>
            </div>
          </div>

          {/* Event List - Scrollable */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <EventList
              events={filteredEvents}
              selectedEvent={selectedEvent}
              onEventSelect={(event) => {
                setSelectedEvent(event);
                setMobileView('map');
              }}
            />
          </div>
        </div>

        {/* Map Panel - Full screen on mobile when active */}
        <div
          className={`
            flex-1 relative overflow-hidden
            transition-transform duration-300 ease-out
            ${mobileView === 'map' ? 'translate-x-0' : 'translate-x-full absolute inset-0'}
            lg:translate-x-0 lg:relative
          `}
        >
          {/* Map Header Overlay */}
          <div className="absolute top-0 left-0 right-0 z-10 p-3 md:p-4 bg-gradient-to-b from-[var(--bg-deep)]/80 to-transparent pointer-events-none">
            <div className="flex items-center justify-between">
              <span
                className="text-white/60 text-[10px] md:text-xs uppercase tracking-widest"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Live Map
              </span>
              <span
                className="text-[var(--accent-secondary)] text-[10px] md:text-xs truncate max-w-[200px]"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {selectedEvent ? `📍 ${selectedEvent.location.name}` : 'Tamil Nadu'}
              </span>
            </div>
          </div>

          <MapWrapper
            events={filteredEvents}
            selectedEvent={selectedEvent}
            onEventSelect={setSelectedEvent}
          />

          {/* Scan lines effect */}
          <div className="scan-lines absolute inset-0 pointer-events-none" />

          {/* Back button on mobile map view */}
          <button
            onClick={() => setMobileView('list')}
            className="lg:hidden absolute bottom-24 left-4 z-20 w-12 h-12 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden relative z-20 border-t border-[var(--border-subtle)] bg-[var(--bg-panel)]/95 backdrop-blur-lg flex-shrink-0 safe-area-bottom">
        <div className="flex">
          <button
            onClick={() => setMobileView('list')}
            className={`
              flex-1 flex flex-col items-center gap-1 py-3 min-h-[60px]
              transition-colors duration-200
              ${mobileView === 'list' ? 'text-[var(--accent-secondary)]' : 'text-[var(--text-muted)]'}
            `}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span className="text-[10px] font-medium">Alerts</span>
            {activeCount > 0 && mobileView !== 'list' && (
              <span className="absolute top-2 left-1/2 -translate-x-1/2 translate-x-4 w-2 h-2 bg-[var(--alert-danger)] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setMobileView('map')}
            className={`
              flex-1 flex flex-col items-center gap-1 py-3 min-h-[60px]
              transition-colors duration-200
              ${mobileView === 'map' ? 'text-[var(--accent-secondary)]' : 'text-[var(--text-muted)]'}
            `}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span className="text-[10px] font-medium">Map</span>
          </button>

          <button
            onClick={() => setShowReportForm(true)}
            className="flex-1 flex flex-col items-center gap-1 py-3 min-h-[60px] text-[var(--accent-primary)]"
          >
            <div className="w-10 h-10 -mt-5 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--alert-danger)] flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-[10px] font-medium">Report</span>
          </button>
        </div>
      </nav>

      {/* Desktop Footer - Hidden on mobile */}
      <div className="hidden lg:block relative z-10 border-t border-[var(--border-subtle)] bg-[var(--bg-panel)]/50 flex-shrink-0">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[var(--text-muted)] text-xs">Coverage:</span>
                {['Erode', 'Namakkal', 'Salem', 'Karur'].map((region) => (
                  <span key={region} className="tag tag-info px-2 py-0.5 rounded text-[10px]">
                    {region}
                  </span>
                ))}
              </div>
            </div>
            <p
              className="text-[var(--text-muted)] text-xs tracking-wider"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              PROTOTYPE v0.1
            </p>
          </div>
        </div>
      </div>

      {/* Report Form Modal */}
      {showReportForm && (
        <ReportForm
          onSubmit={handleAddEvent}
          onClose={() => setShowReportForm(false)}
        />
      )}
    </div>
  );
}
