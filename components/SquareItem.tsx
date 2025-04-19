import { Text, View } from 'react-native';
import { DropIcon } from '@/assets/icons/DropIcon';

export const SquareItem = ({
  temperature,
  humidity,
  timestamp,
}: {
  temperature: number;
  humidity: number;
  timestamp?: string;
}) => {
  return (
    <View key={timestamp} className="m-2 p-4 pb-10  rounded-lg w-28">
      <Text className="text-gray-500">
        {timestamp
          ? new Date(timestamp).toLocaleTimeString([], {
              hour: 'numeric',
              hour12: true,
            })
          : 'Now'}
      </Text>
      <Text className="text-2xl font-bold mt-1">{temperature.toFixed(0)}°C</Text>
      <View className={'flex flex-row items-center'}>
        <DropIcon color="#F8BE28" />
        <Text className="text-lg ml-1 text-[##F8BE28] font-bold">{humidity.toFixed(0)}%</Text>
      </View>
    </View>
  );
};
