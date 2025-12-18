'use client';

import dynamic from 'next/dynamic';
import { TrafficEvent } from '@/types';

const Map = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-3"></div>
        <p className="text-gray-500">Loading map...</p>
      </div>
    </div>
  ),
});

interface MapWrapperProps {
  events: TrafficEvent[];
  selectedEvent: TrafficEvent | null;
  onEventSelect: (event: TrafficEvent) => void;
}

export default function MapWrapper(props: MapWrapperProps) {
  return <Map {...props} />;
}
