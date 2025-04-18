interface Weather {
  id: string;
  temperature: number;
  humidity: number;
  city_id: string;
  created_at: string;
}

interface WeatherHourly {
  hour: string;
  humidity: number;
  temperature: number;
}
