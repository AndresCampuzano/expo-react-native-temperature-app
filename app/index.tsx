import { Text, View } from 'react-native';
import { MapPinIcon } from 'react-native-heroicons/outline';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import { getLast48HoursWeatherRecords } from '@/api/weather.service';
import { useEffect, useState } from 'react';

export default function Index() {
  const [lastRecord, setLastRecord] = useState<Weather | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['weather'],
    queryFn: getLast48HoursWeatherRecords,
  });

  useEffect(() => {
    console.log({
      data,
      isLoading,
      isError,
    });
    if (data && !isLoading && !isError) {
      const lastRecord = data[data.length - 1];
      setLastRecord(lastRecord);
    }
  }, [data, isLoading, isError]);
  return (
    <View className={'flex-1'}>
      <Text className={'w-full text-center mt-9 text-2xl'}>Today</Text>
      <View className={'relative flex justify-center flex-col'}>
        {/* Sun (Yellow Gradient Circle) */}
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
        {/* Main Content */}
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
    </View>
  );
}
