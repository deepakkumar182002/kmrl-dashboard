// Kochi Metro Railway Line and Station Data

export interface MetroStation {
  id: string;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  line: string;
  stationCode: string;
  type: 'terminal' | 'interchange' | 'regular';
  facilities: string[];
  opened: string;
}

// Kochi Metro Line 1 (Blue Line) - Aluva to Pettah
export const kochiMetroStations: MetroStation[] = [
  {
    id: 'ALV',
    name: 'Aluva',
    coordinates: { lat: 10.1102, lng: 76.3530 },
    line: 'Line 1',
    stationCode: 'ALV',
    type: 'terminal',
    facilities: ['Parking', 'Bus Terminal', 'Auto Stand', 'Taxi Stand'],
    opened: '2017-06-19'
  },
  {
    id: 'PUL',
    name: 'Pulinchode',
    coordinates: { lat: 10.0987, lng: 76.3445 },
    line: 'Line 1',
    stationCode: 'PUL',
    type: 'regular',
    facilities: ['Parking', 'Auto Stand'],
    opened: '2017-06-19'
  },
  {
    id: 'CMP',
    name: 'Companypady',
    coordinates: { lat: 10.0856, lng: 76.3365 },
    line: 'Line 1',
    stationCode: 'CMP',
    type: 'regular',
    facilities: ['Auto Stand'],
    opened: '2017-06-19'
  },
  {
    id: 'AMB',
    name: 'Ambattukavu',
    coordinates: { lat: 10.0721, lng: 76.3281 },
    line: 'Line 1',
    stationCode: 'AMB',
    type: 'regular',
    facilities: ['Parking', 'Auto Stand'],
    opened: '2017-06-19'
  },
  {
    id: 'MUT',
    name: 'Muttom',
    coordinates: { lat: 10.0598, lng: 76.3203 },
    line: 'Line 1',
    stationCode: 'MUT',
    type: 'regular',
    facilities: ['Depot Access', 'Parking'],
    opened: '2017-06-19'
  },
  {
    id: 'KKD',
    name: 'Kalamassery',
    coordinates: { lat: 10.0525, lng: 76.3146 },
    line: 'Line 1',
    stationCode: 'KKD',
    type: 'regular',
    facilities: ['Parking', 'Shopping Complex', 'Auto Stand'],
    opened: '2017-06-19'
  },
  {
    id: 'CUD',
    name: 'CUSAT',
    coordinates: { lat: 10.0456, lng: 76.3098 },
    line: 'Line 1',
    stationCode: 'CUD',
    type: 'regular',
    facilities: ['University Access', 'Parking'],
    opened: '2017-06-19'
  },
  {
    id: 'PTK',
    name: 'Pathadipalam',
    coordinates: { lat: 10.0389, lng: 76.3043 },
    line: 'Line 1',
    stationCode: 'PTK',
    type: 'regular',
    facilities: ['Auto Stand'],
    opened: '2017-06-19'
  },
  {
    id: 'EDK',
    name: 'Edapally',
    coordinates: { lat: 10.0256, lng: 76.3012 },
    line: 'Line 1',
    stationCode: 'EDK',
    type: 'regular',
    facilities: ['Shopping Mall', 'Parking', 'Bus Stand'],
    opened: '2017-06-19'
  },
  {
    id: 'CNG',
    name: 'Changampuzha Park',
    coordinates: { lat: 10.0156, lng: 76.2987 },
    line: 'Line 1',
    stationCode: 'CNG',
    type: 'regular',
    facilities: ['Park Access', 'Auto Stand'],
    opened: '2017-06-19'
  },
  {
    id: 'PLR',
    name: 'Palarivattom',
    coordinates: { lat: 10.0045, lng: 76.2945 },
    line: 'Line 1',
    stationCode: 'PLR',
    type: 'interchange',
    facilities: ['Parking', 'Shopping', 'Bus Stand', 'Future Line 2 Interchange'],
    opened: '2017-06-19'
  },
  {
    id: 'JLN',
    name: 'JLN Stadium',
    coordinates: { lat: 9.9934, lng: 76.2891 },
    line: 'Line 1',
    stationCode: 'JLN',
    type: 'regular',
    facilities: ['Stadium Access', 'Parking'],
    opened: '2017-06-19'
  },
  {
    id: 'KLM',
    name: 'Kaloor',
    coordinates: { lat: 9.9823, lng: 76.2834 },
    line: 'Line 1',
    stationCode: 'KLM',
    type: 'regular',
    facilities: ['Auto Stand', 'Shopping'],
    opened: '2017-06-19'
  },
  {
    id: 'LIS',
    name: 'Lissie',
    coordinates: { lat: 9.9712, lng: 76.2789 },
    line: 'Line 1',
    stationCode: 'LIS',
    type: 'regular',
    facilities: ['Hospital Access', 'Auto Stand'],
    opened: '2017-06-19'
  },
  {
    id: 'MAS',
    name: 'MG Road',
    coordinates: { lat: 9.9612, lng: 76.2743 },
    line: 'Line 1',
    stationCode: 'MAS',
    type: 'regular',
    facilities: ['Shopping District', 'Parking', 'Commercial Area'],
    opened: '2017-06-19'
  },
  {
    id: 'MRN',
    name: 'Maharajas',
    coordinates: { lat: 9.9534, lng: 76.2701 },
    line: 'Line 1',
    stationCode: 'MRN',
    type: 'regular',
    facilities: ['College Access', 'Auto Stand'],
    opened: '2017-06-19'
  },
  {
    id: 'ERN',
    name: 'Ernakulam South',
    coordinates: { lat: 9.9456, lng: 76.2658 },
    line: 'Line 1',
    stationCode: 'ERN',
    type: 'regular',
    facilities: ['Railway Station Connection', 'Bus Stand'],
    opened: '2017-06-19'
  },
  {
    id: 'KDV',
    name: 'Kadavanthra',
    coordinates: { lat: 9.9378, lng: 76.2612 },
    line: 'Line 1',
    stationCode: 'KDV',
    type: 'regular',
    facilities: ['Residential Area', 'Auto Stand'],
    opened: '2017-06-19'
  },
  {
    id: 'ELM',
    name: 'Elamkulam',
    coordinates: { lat: 9.9298, lng: 76.2567 },
    line: 'Line 1',
    stationCode: 'ELM',
    type: 'regular',
    facilities: ['Auto Stand'],
    opened: '2017-06-19'
  },
  {
    id: 'VYT',
    name: 'Vyttila',
    coordinates: { lat: 9.9218, lng: 76.2523 },
    line: 'Line 1',
    stationCode: 'VYT',
    type: 'interchange',
    facilities: ['Bus Terminal', 'Parking', 'Shopping'],
    opened: '2017-06-19'
  },
  {
    id: 'THK',
    name: 'Thaikoodam',
    coordinates: { lat: 9.9145, lng: 76.2487 },
    line: 'Line 1',
    stationCode: 'THK',
    type: 'regular',
    facilities: ['Auto Stand'],
    opened: '2017-06-19'
  },
  {
    id: 'PET',
    name: 'Pettah',
    coordinates: { lat: 9.9067, lng: 76.2445 },
    line: 'Line 1',
    stationCode: 'PET',
    type: 'terminal',
    facilities: ['Bus Stand', 'Auto Stand', 'Commercial Area'],
    opened: '2017-06-19'
  }
];

// Metro Line Track Coordinates (simplified polyline)
export const metroLineCoordinates = kochiMetroStations.map(station => [
  station.coordinates.lat,
  station.coordinates.lng
] as [number, number]);

// Depot and Maintenance Facilities
export const metroDepots = [
  {
    id: 'MUT_DEPOT',
    name: 'Muttom Depot',
    coordinates: { lat: 10.0598, lng: 76.3203 }, // Near Muttom Station
    type: 'Main Depot',
    capacity: '25 trains',
    facilities: ['Maintenance', 'Cleaning', 'Storage', 'Operations Control']
  }
];

const metroData = {
  stations: kochiMetroStations,
  trackLine: metroLineCoordinates,
  depots: metroDepots
};

export default metroData;