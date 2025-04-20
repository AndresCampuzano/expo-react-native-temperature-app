import React from 'react';
import { View, Text, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface MinMaxTemperatureProps {
  minTemperature: number;
  maxTemperature: number;
  currentTemperature: number;
  textColor: string;
  basicUI: boolean; // Hides the min/max temperature labels
}

export const MinMaxTemperature: React.FC<MinMaxTemperatureProps> = ({
  minTemperature,
  maxTemperature,
  currentTemperature,
  textColor,
  basicUI,
}) => {
  const colorScheme = useColorScheme();
  const markerBgColor = colorScheme === 'dark' ? '#c8cfdc' : '#ecebeb';

  const markerPosition =
    ((currentTemperature - minTemperature) / (maxTemperature - minTemperature)) * 100 - 3;

  return (
    <View className="flex flex-col items-center mt-8 pb-8 min-w-24">
      <View className="flex flex-row items-center justify-between w-full px-8">
        {!basicUI && (
          <>
            <Text style={{ color: textColor }} className="text-2xl font-semibold">
              {minTemperature}°
            </Text>
            <Text style={{ color: textColor }} className="text-2xl font-semibold">
              {maxTemperature}°
            </Text>
          </>
        )}
      </View>
      <View className="relative w-4/5">
        <LinearGradient
          colors={['rgba(7,210,180,0.5)', 'rgba(129,210,7,0.5)', 'rgba(255,214,0,0.8)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            height: 10,
            width: '100%',
            marginTop: 8,
            borderRadius: 3,
          }}
        />
        <View
          className="absolute top-1"
          style={{
            left: `${Math.min(Math.max(markerPosition + 3, 0), 100)}%`,
          }}
        >
          <View
            className={'shadow-md'}
            style={{ width: 6, height: 20, borderRadius: 9999, backgroundColor: markerBgColor }}
          />
          <Text
            style={{
              position: 'absolute',
              top: 16,
              left: -14,
              width: 40,
              textAlign: 'center',
              fontSize: basicUI ? 18 : 24,
              color: textColor,
              marginTop: 2,
            }}
          >
            {currentTemperature}°
          </Text>
        </View>
      </View>
    </View>
  );
};
