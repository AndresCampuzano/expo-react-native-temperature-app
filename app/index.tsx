import { ScrollView, Text, View, ActivityIndicator, RefreshControl } from 'react-native';
import { MapPinIcon } from 'react-native-heroicons/outline';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import { getLast48HoursWeatherRecords } from '@/api/weather.service';
import { useEffect, useState } from 'react';
import { calculateHourlyAverages, todayWeather } from '@/utils/date';

export default function Index() {
  const [lastRecord, setLastRecord] = useState<Weather | null>(null);
  const [realRecords, setRealRecords] = useState<WeatherHourly[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['weather'],
    queryFn: getLast48HoursWeatherRecords,
  });

  // Refetch every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  useEffect(() => {
    if (data && !isLoading && !isError) {
      setRealRecords(calculateHourlyAverages(todayWeather(data)));

      const lastRecord = data[data.length - 1];
      setLastRecord(lastRecord);
    }
  }, [data, isLoading, isError]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {isLoading ? (
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
                    {lastRecord?.temperature.toFixed(0)}
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
            {realRecords?.map(item => (
              <View key={item.hour} className="m-2 p-4 bg-white rounded-lg w-28">
                <Text className="text-lg font-bold">{item.temperature.toFixed(0)}°C</Text>
                <Text className="text-sm text-gray-500">
                  {new Date(item.hour).toLocaleString()}
                </Text>
              </View>
            ))}
          </ScrollView>
        </>
      )}
    </ScrollView>
  );
}
