import { fetchFromService } from '@/api/fetchFromService';

const API = process.env.EXPO_PUBLIC_WEATHER_API ?? '';
const CITY_ID = process.env.EXPO_PUBLIC_CITY_ID ?? '';

export async function getLast48HoursWeatherRecords() {
  return fetchFromService<Weather[]>(
    API,
    `/api/weather?city_id=${CITY_ID}&hourly_average=true&get_last=48`
  );
}
