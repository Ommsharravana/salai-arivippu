export type EventType = 'rally' | 'festival' | 'procession' | 'protest' | 'other';

export type EventSeverity = 'high' | 'medium' | 'low';

export interface TrafficEvent {
  id: string;
  title: string;
  titleTamil?: string;
  type: EventType;
  severity: EventSeverity;
  location: {
    lat: number;
    lng: number;
    name: string;
    nameTamil?: string;
  };
  affectedRoads: string[];
  alternateRoutes?: string[];
  startTime: string;
  endTime: string;
  description?: string;
  source: 'official' | 'community' | 'radio';
  verified: boolean;
  reportedBy?: string;
  reportedAt: string;
}

export interface ReportFormData {
  title: string;
  type: EventType;
  locationName: string;
  lat: number;
  lng: number;
  affectedRoads: string;
  startTime: string;
  endTime: string;
  description: string;
}
