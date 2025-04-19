import { fetchFromService } from '@/api/fetchFromService';

const API = process.env.EXPO_PUBLIC_WEATHER_API ?? '';
const CITY_ID = process.env.EXPO_PUBLIC_CITY_ID ?? '';

export async function getLast48HoursAverageWeatherRecords() {
  return fetchFromService<WeatherHourly[]>(
    API,
    `/api/weather?city_id=${CITY_ID}&hourly_average=true&get_last=48`
  );
}

export async function getFutureWeatherRecords() {
  return fetchFromService<FutureWeather[]>(API, `/api/predictions?city_id=${CITY_ID}`);
}
