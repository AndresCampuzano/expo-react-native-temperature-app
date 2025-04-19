import { Text, useColorScheme, View } from 'react-native';
import { DropIcon } from '@/assets/icons/DropIcon';

export const SquareItem = ({
  temperature,
  humidity,
  timestamp,
  textColor,
}: {
  temperature: number;
  humidity: number;
  timestamp?: string;
  textColor: string;
}) => {
  const colorScheme = useColorScheme();
  const dropIconColor = colorScheme === 'dark' ? '#607ce5' : '#e5ae23';

  return (
    <View key={timestamp} className="m-2 p-4 pb-10 rounded-lg w-28 flex">
      <Text style={{ color: textColor }} className={`${!timestamp ? 'font-bold' : ''}`}>
        {timestamp
          ? new Date(timestamp).toLocaleTimeString([], {
              hour: 'numeric',
              hour12: true,
            })
          : 'Now'}
      </Text>
      <Text style={{ color: textColor }} className="text-2xl font-bold mt-1">
        {temperature.toFixed(0)}°C
      </Text>
      <View className={'flex flex-row items-center'}>
        <DropIcon color={dropIconColor} />
        <Text style={{ color: dropIconColor }} className="text-lg ml-1 font-bold">
          {humidity.toFixed(0)}%
        </Text>
      </View>
    </View>
  );
};
