export function todayWeather(data: Weather[]): Weather[] {
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  return data.filter(record => {
    const recordDate = new Date(record.created_at);
    return recordDate >= startOfToday && recordDate < endOfToday;
  });
}

export function calculateHourlyAverages(data: Weather[]): WeatherHourly[] {
  const groupedByHour: Record<
    string,
    { temperatureSum: number; humiditySum: number; count: number }
  > = {};

  data.forEach(record => {
    const hour = new Date(record.created_at).toISOString().slice(0, 13) + ':00:00Z'; // Round to the hour
    if (!groupedByHour[hour]) {
      groupedByHour[hour] = { temperatureSum: 0, humiditySum: 0, count: 0 };
    }
    groupedByHour[hour].temperatureSum += record.temperature;
    groupedByHour[hour].humiditySum += record.humidity;
    groupedByHour[hour].count += 1;
  });

  return Object.entries(groupedByHour).map(([hour, { temperatureSum, humiditySum, count }]) => ({
    hour,
    temperature: temperatureSum / count,
    humidity: humiditySum / count,
  }));
}
