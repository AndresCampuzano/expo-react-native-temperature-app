import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { MapPinIcon } from 'react-native-heroicons/outline';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import {
  getFutureWeatherRecords,
  getLast48HoursAverageWeatherRecords,
} from '@/api/weather.service';
import { useEffect, useState, useRef } from 'react';
import {
  todayFutureWeather,
  todayWeather,
  todayWeatherWithoutCurrentHourWeather,
  tomorrowFutureWeather,
  yesterdayWeather,
} from '@/utils/date';
import { SquareItem } from '@/components/SquareItem';
import { LineChart } from 'react-native-chart-kit';

export default function Index() {
  const horizontalScrollRef = useRef<ScrollView>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [records, setRecords] = useState<{
    yesterday: (WeatherHourly | Weather)[];
    today: {
      previous: (WeatherHourly | Weather)[];
      current: WeatherHourly | Weather;
      future: FutureWeather[];
    };
    tomorrow: FutureWeather[];
  } | null>(null);

  const screenWidth = Dimensions.get('window').width;

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
        tomorrow: tomorrowFutureWeather(hourlyFutureData),
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

  // Scroll to center the "Now" section
  useEffect(() => {
    if (horizontalScrollRef.current && records?.today.previous.length) {
      setTimeout(() => {
        const itemWidth = 112;
        const offset = (screenWidth - itemWidth) / 2;
        horizontalScrollRef.current?.scrollTo({
          x: records.today.previous.length * itemWidth - offset,
          animated: true,
        });
      }, 100);
    }
  }, [records, screenWidth]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchHourlyRealData();
    setRefreshing(false);
  };

  const chartData = {
    labels: [
      ...(records?.today.previous.map((item, index) =>
        index % 2 === 0
          ? new Date((item as WeatherHourly).hour).toLocaleTimeString([], {
              hour: 'numeric',
              hour12: true,
            })
          : ''
      ) || []),
      'Now',
      ...(records?.today.future.map((item, index) =>
        index % 2 === 0
          ? new Date(item.forecast_for).toLocaleTimeString([], {
              hour: 'numeric',
              hour12: true,
            })
          : ''
      ) || []),
    ],
    datasets: [
      {
        data: [
          ...(records?.today.previous.map(item => item.temperature) || []),
          records?.today.current.temperature || 0,
          ...(records?.today.future.map(item => item.temperature) || []),
        ],
        color: () => '#F8BE28',
        strokeWidth: 2,
      },
    ],
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

          {/* Minimal chart */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
            <LineChart
              data={chartData}
              width={screenWidth} // Full screen width
              height={220}
              chartConfig={{
                backgroundColor: 'rgba(255,255,255,0)',
                backgroundGradientFrom: 'rgba(255,255,255,0)',
                backgroundGradientTo: 'rgba(255,255,255,0)',
                decimalPlaces: 1,
                color: () => '#F8BE28',
                style: {
                  borderRadius: 16,
                },
                propsForBackgroundLines: {
                  strokeWidth: 0, // Remove grid lines
                },
              }}
              bezier
            />
          </ScrollView>

          {/* Horizontal ScrollView */}
          <ScrollView
            ref={horizontalScrollRef}
            horizontal
            showsHorizontalScrollIndicator={true}
            className="mt-4"
          >
            {/* today's weather */}
            {records?.today.previous?.map(item => (
              <SquareItem
                key={(item as WeatherHourly).hour}
                temperature={item.temperature}
                humidity={item.humidity}
                timestamp={(item as WeatherHourly).hour}
              />
            ))}
            {/* current hour weather */}
            <SquareItem
              temperature={records?.today.current.temperature || 0}
              humidity={records?.today.current.humidity || 0}
            />
            {/* today's future weather */}
            {records?.today.future?.map(item => (
              <SquareItem
                key={item.forecast_for}
                temperature={item.temperature}
                humidity={item.humidity}
                timestamp={item.forecast_for}
              />
            ))}
          </ScrollView>
        </>
      )}
    </ScrollView>
  );
}
