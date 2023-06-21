export interface Activity {
  startTime: string;
  endTime: string;
  name: string;
}

export interface ActivityList {
  date: string;
  activities: Activity[];
  isEmpty: true;
}

// Foursquare api type
export interface GeoData {
  type: string;
  text: {
    primary: string;
    secondary: string;
    highlight: {
      start: number;
      length: number;
    };
  };
  geo: {
    name: string;
    center: {
      latitude: number;
      longitude: number;
    };
    bounds: {
      ne: {
        latitude: number;
        longitude: number;
      };
      sw: {
        latitude: number;
        longitude: number;
      };
    };
    cc: string;
    type: string;
  };
}
