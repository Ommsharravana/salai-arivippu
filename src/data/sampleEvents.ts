import { TrafficEvent } from '@/types';

// Sample events for Tamil Nadu - focused on Erode/Namakkal region
export const sampleEvents: TrafficEvent[] = [
  {
    id: '1',
    title: 'Political Rally - Pirindura Toll Gate',
    titleTamil: 'அரசியல் பேரணி - பிரிந்துரா சுங்கச்சாவடி',
    type: 'rally',
    severity: 'high',
    location: {
      lat: 11.3410,
      lng: 77.7172,
      name: 'Pirindura Toll Gate, NH544',
      nameTamil: 'பிரிந்துரா சுங்கச்சாவடி',
    },
    affectedRoads: ['NH544', 'Erode-Salem Highway', 'Toll Gate Junction'],
    alternateRoutes: ['Old Tiruchengode Road', 'Perundurai Bypass', 'Bhavani Road'],
    startTime: '2025-12-18T16:00:00',
    endTime: '2025-12-18T19:00:00',
    description: 'Large political gathering expected. Heavy traffic from 3 PM onwards.',
    source: 'community',
    verified: true,
    reportedBy: 'Local Reporter',
    reportedAt: '2025-12-18T10:00:00',
  },
  {
    id: '2',
    title: 'Temple Festival Procession',
    titleTamil: 'கோயில் திருவிழா ஊர்வலம்',
    type: 'festival',
    severity: 'medium',
    location: {
      lat: 11.4168,
      lng: 77.7316,
      name: 'Erode Town Center',
      nameTamil: 'ஈரோடு நகர மையம்',
    },
    affectedRoads: ['Perundurai Road', 'Brough Road', 'EVN Road'],
    alternateRoutes: ['Bypass Road', 'Karur Road'],
    startTime: '2025-12-19T18:00:00',
    endTime: '2025-12-19T22:00:00',
    description: 'Annual temple procession. Roads closed for chariot.',
    source: 'official',
    verified: true,
    reportedAt: '2025-12-17T14:00:00',
  },
  {
    id: '3',
    title: 'Election Campaign - Namakkal',
    titleTamil: 'தேர்தல் பிரச்சாரம் - நாமக்கல்',
    type: 'rally',
    severity: 'high',
    location: {
      lat: 11.2189,
      lng: 78.1674,
      name: 'Namakkal Bus Stand Area',
      nameTamil: 'நாமக்கல் பேருந்து நிலையம்',
    },
    affectedRoads: ['Trichy Road', 'Salem Road', 'Bus Stand Road'],
    alternateRoutes: ['Paramathi Road', 'Inner Ring Road'],
    startTime: '2025-12-20T10:00:00',
    endTime: '2025-12-20T14:00:00',
    description: 'Election campaign meeting. Expect heavy crowds.',
    source: 'radio',
    verified: false,
    reportedAt: '2025-12-18T08:00:00',
  },
  {
    id: '4',
    title: 'Weekly Market Day',
    titleTamil: 'வாராந்திர சந்தை தினம்',
    type: 'other',
    severity: 'low',
    location: {
      lat: 11.3394,
      lng: 77.7264,
      name: 'Komarapalayam Market',
      nameTamil: 'கோமாரபாளையம் சந்தை',
    },
    affectedRoads: ['Market Road', 'Gandhi Road'],
    alternateRoutes: ['Bypass via Hospital Road'],
    startTime: '2025-12-18T06:00:00',
    endTime: '2025-12-18T12:00:00',
    description: 'Regular weekly market. Moderate congestion expected.',
    source: 'community',
    verified: true,
    reportedAt: '2025-12-17T20:00:00',
  },
  {
    id: '5',
    title: 'VIP Movement - Salem',
    titleTamil: 'விஐபி பயணம் - சேலம்',
    type: 'other',
    severity: 'high',
    location: {
      lat: 11.6643,
      lng: 78.1460,
      name: 'Salem Junction',
      nameTamil: 'சேலம் சந்திப்பு',
    },
    affectedRoads: ['Chennai-Salem Highway', 'Five Roads Junction', 'Omalur Road'],
    alternateRoutes: ['Attur Road', 'Mettur Road'],
    startTime: '2025-12-18T14:00:00',
    endTime: '2025-12-18T16:00:00',
    description: 'VIP convoy passing through. Short road closures expected.',
    source: 'official',
    verified: true,
    reportedAt: '2025-12-18T09:00:00',
  },
];

export const getActiveEvents = (events: TrafficEvent[]): TrafficEvent[] => {
  const now = new Date();
  return events.filter(event => {
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    // Show events that are active now or starting within 2 hours
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    return (now >= start && now <= end) || (start <= twoHoursFromNow && start >= now);
  });
};

export const getUpcomingEvents = (events: TrafficEvent[]): TrafficEvent[] => {
  const now = new Date();
  const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  return events.filter(event => {
    const start = new Date(event.startTime);
    return start > now && start <= twentyFourHoursFromNow;
  });
};
