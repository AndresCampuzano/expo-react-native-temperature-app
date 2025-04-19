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

interface FutureWeather {
  id: string;
  city_id: string;
  temperature: number;
  humidity: number;
  forecast_for: string;
  created_at: string;
}
