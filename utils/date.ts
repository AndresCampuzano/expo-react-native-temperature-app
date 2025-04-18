export function todayWeather(data: Weather[] | WeatherHourly[]): (Weather | WeatherHourly)[] {
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  return data.filter(record => {
    const recordDate = 'created_at' in record ? new Date(record.created_at) : new Date(record.hour);
    return recordDate >= startOfToday && recordDate < endOfToday;
  });
}

export function yesterdayWeather(data: Weather[] | WeatherHourly[]): (Weather | WeatherHourly)[] {
  const today = new Date();
  const startOfYesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
  const endOfYesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  return data.filter(record => {
    const recordDate = 'created_at' in record ? new Date(record.created_at) : new Date(record.hour);
    return recordDate >= startOfYesterday && recordDate < endOfYesterday;
  });
}

/**
 * Get today's weather records without the current hour of data.
 */
export function todayWeatherWithoutCurrentHourWeather(
  data: Weather[] | WeatherHourly[]
): (Weather | WeatherHourly)[] {
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  return data.filter(record => {
    const recordDate = 'created_at' in record ? new Date(record.created_at) : new Date(record.hour);
    return (
      recordDate >= startOfToday &&
      recordDate < endOfToday &&
      recordDate.getHours() !== today.getHours()
    );
  });
}

/**
 * Return the future weather records for today, excluding the real data.
 */
export function todayFutureWeather(
  data: FutureWeather[],
  realData: Weather[] | WeatherHourly[]
): FutureWeather[] {
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  // Deduplicate data by keeping the most recent entry based on created_at
  const uniqueDataMap = new Map<string, FutureWeather>();
  data.forEach(record => {
    const recordDate = new Date(record.forecast_for).toISOString();
    if (
      !uniqueDataMap.has(recordDate) ||
      (record.created_at &&
        new Date(record.created_at) > new Date(uniqueDataMap.get(recordDate)!.created_at!))
    ) {
      uniqueDataMap.set(recordDate, record);
    }
  });
  const deduplicatedData = Array.from(uniqueDataMap.values());

  const realDataDates = new Set(
    realData.map(record =>
      'created_at' in record
        ? new Date(record.created_at).toISOString()
        : new Date(record.hour).toISOString()
    )
  );

  return deduplicatedData.filter(record => {
    const recordDate = new Date(record.forecast_for);
    return (
      recordDate >= startOfToday &&
      recordDate < endOfToday &&
      !realDataDates.has(recordDate.toISOString())
    );
  });
}

/**
 * Get the future weather records for tomorrow.
 */
export function tomorrowFutureWeather(data: FutureWeather[]): FutureWeather[] {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const startOfTomorrow = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
  const endOfTomorrow = new Date(
    tomorrow.getFullYear(),
    tomorrow.getMonth(),
    tomorrow.getDate() + 1
  );

  // Deduplicate data by keeping the most recent entry based on created_at
  const uniqueDataMap = new Map<string, FutureWeather>();
  data.forEach(record => {
    const recordDate = new Date(record.forecast_for).toISOString();
    if (
      !uniqueDataMap.has(recordDate) ||
      (record.created_at &&
        new Date(record.created_at) > new Date(uniqueDataMap.get(recordDate)!.created_at!))
    ) {
      uniqueDataMap.set(recordDate, record);
    }
  });

  return Array.from(uniqueDataMap.values()).filter(record => {
    const recordDate = new Date(record.forecast_for);
    return recordDate >= startOfTomorrow && recordDate < endOfTomorrow;
  });
}
