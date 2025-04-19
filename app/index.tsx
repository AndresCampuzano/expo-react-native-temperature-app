import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  useColorScheme,
} from 'react-native';
import { MapPinIcon } from 'react-native-heroicons/outline';
import { useQuery } from '@tanstack/react-query';
import {
  getFutureWeatherRecords,
  getLast48HoursAverageWeatherRecords,
} from '@/api/weather.service';
import React, { useEffect, useState, useRef } from 'react';
import {
  todayFutureWeather,
  todayWeather,
  todayWeatherWithoutCurrentHourWeather,
  tomorrowFutureWeather,
  yesterdayWeather,
} from '@/utils/date';
import { SquareItem } from '@/components/SquareItem';
import { LineChart } from 'react-native-chart-kit';
import { MoonEffect } from '@/components/MoonEffect';
import { SunEffect } from '@/components/SunEffect';
import { DropIcon } from '@/assets/icons/DropIcon';
import { Clouds } from '@/components/Clouds';

export default function Index() {
  const unifiedScrollRef = useRef<ScrollView>(null);
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
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#091857' : '#F0ECC6';
  const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';
  const chartLineColor = colorScheme === 'dark' ? '#d7d7d7' : '#F8BE28';
  const chartBackgroundColor = colorScheme === 'dark' ? '#b6b6b6' : '#F8BE28';
  const cloudsColor = colorScheme === 'dark' ? 'rgba(161,181,245,0.2)' : 'rgba(255, 255, 255, 0.3)';

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
    if (unifiedScrollRef.current && records?.today.previous.length) {
      setTimeout(() => {
        const itemWidth = 111;
        const offset = (screenWidth - itemWidth) / 2;
        unifiedScrollRef.current?.scrollTo({
          x: records.today.previous.length * itemWidth - offset,
          animated: true,
        });
      }, 100); // Delay to ensure layout is ready
    }
  }, [records, screenWidth]);

  const chartWidth =
    ((records?.today.previous.length || 0) +
      1 + // "Now" item
      (records?.today.future.length || 0)) *
    112; // Width of each data item

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
        color: () => chartLineColor,
        strokeWidth: 2,
      },
    ],
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      await refetchHourlyRealData();
      await refetchHourlyFutureData();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [refetchHourlyRealData, refetchHourlyFutureData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchHourlyRealData();
    await refetchHourlyFutureData();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {isLoadingHourlyRealData || isLoadingHourlyFutureData ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={textColor} />
        </View>
      ) : (
        <>
          <Text style={{ color: textColor }} className={'w-full text-center text-2xl mt-28'}>
            Today
          </Text>
          <View className={'relative flex justify-center flex-col mb-[5%]'}>
            {colorScheme === 'dark' ? <MoonEffect /> : <SunEffect />}
            <View className={'flex flex-col justify-center items-center text-center'}>
              <View className={'mb-10 flex flex-row'}>
                <View>
                  <Text style={{ color: textColor }} className={'text-[210px] font-extralight'}>
                    {records?.today.current.temperature.toFixed(0)}
                  </Text>
                </View>
                <View>
                  <Text style={{ color: textColor }} className={'text-4xl font-light mt-[50px]'}>
                    °C
                  </Text>
                </View>
              </View>
              <View className={'flex flex-row items-center justify-center'}>
                <MapPinIcon color={textColor} size={28} />
                <Text style={{ color: textColor }} className={'text-3xl'}>
                  BOG
                </Text>
              </View>
              <View className={'flex flex-row items-center justify-center'}>
                <DropIcon color={textColor} size={35} />
                <Text style={{ color: textColor }} className={'text-[110px] font-extralight'}>
                  {records?.today.current.humidity.toFixed(0)}%
                </Text>
              </View>
            </View>
          </View>

          <ScrollView
            ref={unifiedScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ width: chartWidth }}
          >
            <View style={{ flex: 1, marginHorizontal: 0, paddingHorizontal: 0 }}>
              <LineChart
                data={chartData}
                width={chartWidth + 50}
                height={70}
                chartConfig={{
                  backgroundColor,
                  backgroundGradientFrom: backgroundColor,
                  backgroundGradientTo: backgroundColor,
                  color: () => chartBackgroundColor,
                  fillShadowGradient: chartBackgroundColor,
                  fillShadowGradientOpacity: 0.4,
                  propsForBackgroundLines: {
                    strokeWidth: 0,
                  },
                }}
                withHorizontalLabels={false}
                withVerticalLabels={false}
                bezier
                style={{
                  marginLeft: -20,
                }}
              />
              <View className="flex-row mt-4">
                {/* today's weather previous records */}
                {records?.today.previous?.map(item => (
                  <SquareItem
                    key={(item as WeatherHourly).hour}
                    temperature={item.temperature}
                    humidity={item.humidity}
                    timestamp={(item as WeatherHourly).hour}
                    textColor={textColor}
                    className="opacity-60"
                  />
                ))}
                {/* current hour weather */}
                <SquareItem
                  temperature={records?.today.current.temperature || 0}
                  humidity={records?.today.current.humidity || 0}
                  textColor={textColor}
                />
                {/* today's future weather records */}
                {records?.today.future?.map(item => (
                  <SquareItem
                    key={item.forecast_for}
                    temperature={item.temperature}
                    humidity={item.humidity}
                    timestamp={item.forecast_for}
                    textColor={textColor}
                  />
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Tomorrow's Forecast Table */}
          <Text style={{ color: textColor }} className={'w-full text-center mt-9 text-2xl'}>
            Tomorrow's Forecast
          </Text>
          <View className="mt-4 relative">
            {records?.tomorrow.map(item => (
              <View
                key={item.forecast_for}
                className="flex flex-row justify-between items-center px-4 py-2 border-b border-gray-500"
              >
                <Text style={{ color: textColor }} className="text-lg w-20">
                  {new Date(item.forecast_for).toLocaleTimeString([], {
                    hour: 'numeric',
                    hour12: true,
                  })}
                </Text>
                <Text style={{ color: textColor }} className="text-lg -ml-2">
                  {item.temperature.toFixed(0)}°C
                </Text>
                <View className="flex flex-row items-center">
                  <DropIcon color={textColor} size={20} />
                  <Text style={{ color: textColor }} className="text-lg ml-1">
                    {item.humidity.toFixed(0)}%
                  </Text>
                </View>
              </View>
            ))}
            <Clouds
              cloudConfigs={[
                { size: 20, top: 320, duration: 8000, delay: 0 },
                { size: 30, top: 180, duration: 10000, delay: 2000 },
                { size: 12, top: 800, duration: 10000, delay: 2000 },
                { size: 25, top: 450, duration: 12000, delay: 4000 },
              ]}
              cloudColor={cloudsColor}
            />
          </View>
        </>
      )}
    </ScrollView>
  );
}
