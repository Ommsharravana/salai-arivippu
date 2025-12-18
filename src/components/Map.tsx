'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TrafficEvent } from '@/types';

// Fix for default marker icons in Next.js
const createCustomIcon = (severity: 'high' | 'medium' | 'low') => {
  const colors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#22c55e',
  };

  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${colors[severity]};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

interface MapProps {
  events: TrafficEvent[];
  selectedEvent: TrafficEvent | null;
  onEventSelect: (event: TrafficEvent) => void;
}

function FlyToEvent({ event }: { event: TrafficEvent | null }) {
  const map = useMap();

  useEffect(() => {
    if (event) {
      map.flyTo([event.location.lat, event.location.lng], 14, {
        duration: 1,
      });
    }
  }, [event, map]);

  return null;
}

export default function Map({ events, selectedEvent, onEventSelect }: MapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  // Center on Tamil Nadu - Erode region
  const center: [number, number] = [11.3410, 77.7172];

  const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#22c55e';
    }
  };

  const getEventTypeEmoji = (type: string) => {
    switch (type) {
      case 'rally': return '🎤';
      case 'festival': return '🎉';
      case 'procession': return '🚶';
      case 'protest': return '✊';
      default: return '⚠️';
    }
  };

  return (
    <MapContainer
      center={center}
      zoom={10}
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FlyToEvent event={selectedEvent} />

      {events.map((event) => (
        <div key={event.id}>
          {/* Affected area circle */}
          <Circle
            center={[event.location.lat, event.location.lng]}
            radius={event.severity === 'high' ? 2000 : event.severity === 'medium' ? 1500 : 1000}
            pathOptions={{
              color: getSeverityColor(event.severity),
              fillColor: getSeverityColor(event.severity),
              fillOpacity: 0.2,
              weight: 2,
            }}
          />

          {/* Event marker */}
          <Marker
            position={[event.location.lat, event.location.lng]}
            icon={createCustomIcon(event.severity)}
            eventHandlers={{
              click: () => onEventSelect(event),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{getEventTypeEmoji(event.type)}</span>
                  <h3 className="font-bold text-gray-900">{event.title}</h3>
                </div>
                {event.titleTamil && (
                  <p className="text-sm text-gray-600 mb-2">{event.titleTamil}</p>
                )}
                <p className="text-sm text-gray-700 mb-2">{event.location.name}</p>
                <div className="text-xs text-gray-500 mb-2">
                  {new Date(event.startTime).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })} - {new Date(event.endTime).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <div className="flex flex-wrap gap-1">
                  {event.affectedRoads.slice(0, 3).map((road, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded"
                    >
                      {road}
                    </span>
                  ))}
                </div>
              </div>
            </Popup>
          </Marker>
        </div>
      ))}
    </MapContainer>
  );
}
