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
  const [showMobileList, setShowMobileList] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
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
  };

  return (
    <div className="min-h-screen gradient-mesh relative overflow-hidden">
      {/* Background pattern */}
      <div className="pattern-overlay fixed inset-0 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-[var(--border-subtle)]">
        <div className="glass-panel">
          <div className="max-w-[1800px] mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo & Title */}
              <div className="flex items-center gap-4 animate-slide-in">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--alert-danger)] to-[var(--accent-primary)] flex items-center justify-center">
                    <span className="text-2xl">🚨</span>
                  </div>
                  {activeCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--alert-danger)] rounded-full pulse-live" />
                  )}
                </div>
                <div>
                  <h1
                    className="text-3xl tracking-wider text-white"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    சாலை அறிவிப்பு
                  </h1>
                  <p className="text-[var(--text-muted)] text-xs tracking-widest uppercase mt-0.5">
                    Tamil Nadu Traffic Intelligence
                  </p>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-4 animate-slide-in delay-200">
                {/* Live Status */}
                {activeCount > 0 && (
                  <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-lg bg-[var(--alert-danger)]/10 border border-[var(--alert-danger)]/30">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--alert-danger)] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--alert-danger)]"></span>
                    </span>
                    <span
                      className="text-[var(--alert-danger)] text-sm font-semibold tracking-wide glitch-text"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {activeCount} LIVE
                    </span>
                  </div>
                )}

                {/* Time */}
                <div
                  className="hidden md:block text-[var(--text-secondary)] text-sm"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {currentTime.toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>

                {/* Report Button */}
                <button
                  onClick={() => setShowReportForm(true)}
                  className="btn-primary px-5 py-2.5 rounded-lg flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="hidden sm:inline font-semibold">Report Alert</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Region Bar */}
      <div className="relative z-10 border-b border-[var(--border-subtle)] bg-[var(--bg-panel)]/50">
        <div className="max-w-[1800px] mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Region Tags */}
            <div className="flex items-center gap-2 animate-slide-in delay-100">
              <span className="text-[var(--text-muted)] text-xs uppercase tracking-wider mr-2">Coverage:</span>
              {['Erode', 'Namakkal', 'Salem', 'Karur'].map((region, idx) => (
                <span
                  key={region}
                  className="tag tag-info px-2.5 py-1 rounded"
                  style={{ animationDelay: `${(idx + 1) * 100}ms` }}
                >
                  {region}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm">
              <span className="text-[var(--text-muted)]">
                <span className="text-white font-semibold">{events.length}</span> events tracked
              </span>

              {/* Mobile toggle */}
              <button
                onClick={() => setShowMobileList(!showMobileList)}
                className="lg:hidden btn-ghost px-3 py-1.5 rounded-lg text-xs"
              >
                {showMobileList ? '🗺️ Map' : '📋 List'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="relative z-10 border-b border-[var(--border-subtle)] bg-[var(--bg-panel)]/30">
        <div className="max-w-[1800px] mx-auto px-6">
          <div className="flex gap-1">
            {[
              { key: 'all', label: 'All Alerts', count: events.length },
              { key: 'active', label: 'Active Now', count: activeCount, urgent: true },
              { key: 'upcoming', label: 'Upcoming', count: events.filter(e => new Date(e.startTime) > now).length },
            ].map((tab, idx) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'all' | 'active' | 'upcoming')}
                className={`
                  relative px-5 py-3.5 text-sm font-medium transition-all duration-300
                  animate-fade-in
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

      {/* Main Content */}
      <main className="relative z-10 max-w-[1800px] mx-auto p-6">
        <div className="flex gap-6 h-[calc(100vh-280px)] min-h-[500px]">
          {/* Event List Panel */}
          <div
            className={`
              w-full lg:w-[420px] flex-shrink-0
              glass-panel rounded-2xl overflow-hidden flex flex-col
              animate-slide-in
              ${showMobileList ? 'block' : 'hidden lg:flex'}
            `}
          >
            {/* Panel Header */}
            <div className="p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-card)]/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2
                    className="text-lg tracking-wide text-white"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    TRAFFIC ALERTS
                  </h2>
                  <p className="text-[var(--text-muted)] text-xs mt-0.5">
                    {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} in view
                  </p>
                </div>
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-[var(--alert-danger)]" />
                  <span className="w-2 h-2 rounded-full bg-[var(--alert-warning)]" />
                  <span className="w-2 h-2 rounded-full bg-[var(--alert-safe)]" />
                </div>
              </div>
            </div>

            {/* Event List */}
            <div className="flex-1 overflow-y-auto">
              <EventList
                events={filteredEvents}
                selectedEvent={selectedEvent}
                onEventSelect={setSelectedEvent}
              />
            </div>
          </div>

          {/* Map Panel */}
          <div
            className={`
              flex-1 glass-panel rounded-2xl overflow-hidden relative
              animate-fade-in delay-200
              ${showMobileList ? 'hidden lg:block' : 'block'}
            `}
          >
            {/* Map Header Overlay */}
            <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-[var(--bg-deep)]/80 to-transparent pointer-events-none">
              <div className="flex items-center justify-between">
                <span
                  className="text-white/60 text-xs uppercase tracking-widest"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  Live Map View
                </span>
                <span
                  className="text-[var(--accent-secondary)] text-xs"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {selectedEvent ? `📍 ${selectedEvent.location.name}` : 'Tamil Nadu Region'}
                </span>
              </div>
            </div>

            <MapWrapper
              events={filteredEvents}
              selectedEvent={selectedEvent}
              onEventSelect={setSelectedEvent}
            />

            {/* Scan lines effect */}
            <div className="scan-lines absolute inset-0 pointer-events-none rounded-2xl" />
          </div>
        </div>
      </main>

      {/* Info Footer */}
      <div className="relative z-10 border-t border-[var(--border-subtle)] bg-[var(--bg-panel)]/50">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* How it works */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--alert-warning)]/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">💡</span>
              </div>
              <div>
                <p className="text-[var(--text-secondary)] text-sm">
                  <span className="text-white font-medium">Community-powered alerts.</span>{' '}
                  Report rallies, festivals, and road closures before they happen.
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="tag tag-info px-2 py-0.5 rounded text-[10px]">Community</span>
                  <span className="tag tag-safe px-2 py-0.5 rounded text-[10px]">FM Radio</span>
                  <span className="tag tag-warning px-2 py-0.5 rounded text-[10px]">Official</span>
                </div>
              </div>
            </div>

            {/* Branding */}
            <div className="text-right">
              <p
                className="text-[var(--text-muted)] text-xs tracking-wider"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                PROTOTYPE v0.1 • Built for Tamil Nadu
              </p>
            </div>
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
