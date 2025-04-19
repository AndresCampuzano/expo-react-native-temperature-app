import { ScrollView, Text, View, ActivityIndicator, RefreshControl } from 'react-native';
import { MapPinIcon } from 'react-native-heroicons/outline';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import {
  getFutureWeatherRecords,
  getLast48HoursAverageWeatherRecords,
} from '@/api/weather.service';
import { useEffect, useState } from 'react';
import {
  todayFutureWeather,
  todayWeather,
  todayWeatherWithoutCurrentHourWeather,
  yesterdayWeather,
} from '@/utils/date';

export default function Index() {
  const [refreshing, setRefreshing] = useState(false);
  const [records, setRecords] = useState<{
    yesterday: (WeatherHourly | Weather)[];
    today: {
      previous: (WeatherHourly | Weather)[];
      current: WeatherHourly | Weather;
      future: FutureWeather[];
    };
  } | null>(null);

  const {
    data: hourlyRealData,
    isLoading: isLoadingHourlyRealData,
    isError: isErrorHourlyRealData,
    refetch: refetchHourlyRealData,
  } = useQuery({
    queryKey: ['weather'],
    queryFn: getLast48HoursAverageWeatherRecords,
  });

  const {
    data: hourlyFutureData,
    isLoading: isLoadingHourlyFutureData,
    isError: isErrorHourlyFutureData,
    refetch: refetchHourlyFutureData,
  } = useQuery({
    queryKey: ['weather-future'],
    queryFn: getFutureWeatherRecords,
  });

  useEffect(() => {
    if (
      hourlyRealData &&
      !isLoadingHourlyRealData &&
      !isErrorHourlyRealData &&
      hourlyFutureData &&
      !isLoadingHourlyFutureData &&
      !isErrorHourlyFutureData
    ) {
      const obj = {
        yesterday: yesterdayWeather(hourlyRealData),
        today: {
          previous: todayWeatherWithoutCurrentHourWeather(hourlyRealData),
          current: todayWeather(hourlyRealData)[todayWeather(hourlyRealData).length - 1],
          future: todayFutureWeather(hourlyFutureData, hourlyRealData),
        },
      };
      setRecords(obj);
    }
  }, [
    hourlyRealData,
    isLoadingHourlyRealData,
    isErrorHourlyRealData,
    hourlyFutureData,
    isLoadingHourlyFutureData,
    isErrorHourlyFutureData,
    refetchHourlyFutureData,
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchHourlyRealData();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {isLoadingHourlyRealData || isLoadingHourlyFutureData ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="black" />
        </View>
      ) : (
        <>
          <Text className={'w-full text-center mt-9 text-2xl'}>Today</Text>
          <View className={'relative flex justify-center flex-col'}>
            <LinearGradient
              colors={['#F8BE28', 'rgba(248, 190, 40, 0)']}
              style={{
                position: 'absolute',
                width: '75%',
                aspectRatio: 1,
                borderRadius: 9999,
                alignSelf: 'center',
                zIndex: -1,
              }}
            />
            <View className={'flex flex-col justify-center items-center text-center'}>
              <View className={'my-3 flex flex-row'}>
                <View>
                  <Text className={'text-[200px] font-extralight'}>
                    {records?.today.current.temperature.toFixed(0)}
                  </Text>
                </View>
                <View>
                  <Text className={'text-4xl font-light mt-[50px]'}>°C</Text>
                </View>
              </View>
              <View className={'flex flex-col items-center justify-center'}>
                <MapPinIcon color="black" size={32} />
                <Text className={'text-[170px] font-thin'}>BOG</Text>
              </View>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={true} className="mt-4">
            {/* today's weather */}
            {records?.today.previous?.map(item => (
              <View
                key={(item as WeatherHourly).hour}
                className="m-2 p-4 pb-10 bg-white rounded-lg w-28"
              >
                <Text className="text-lg font-bold">{item.temperature.toFixed(0)}°C</Text>
                <Text className="text-sm text-gray-500">
                  {new Date((item as WeatherHourly).hour).toLocaleTimeString([], {
                    hour: 'numeric',
                    hour12: true,
                  })}
                </Text>
              </View>
            ))}
            {/* current hour weather */}
            <View className="m-2 p-4 pb-10 bg-gray-300 rounded-lg w-28">
              <Text className="text-lg font-bold">
                {records?.today.current.temperature.toFixed(0)}°C
              </Text>
              <Text className="text-sm text-gray-500">Now</Text>
            </View>
            {/* future weather */}
            {records?.today.future?.map(item => (
              <View key={item.forecast_for} className="m-2 p-4 pb-10 bg-white rounded-lg w-28">
                <Text className="text-lg font-bold">{item.temperature.toFixed(0)}°C</Text>
                <Text className="text-sm text-gray-500">
                  {new Date(item.forecast_for).toLocaleTimeString([], {
                    hour: 'numeric',
                    hour12: true,
                  })}
                </Text>
              </View>
            ))}
          </ScrollView>
        </>
      )}
    </ScrollView>
  );
}
