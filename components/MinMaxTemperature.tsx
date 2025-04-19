import React from 'react';
import { View, Text } from 'react-native';
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
  const markerPosition =
    ((currentTemperature - minTemperature) / (maxTemperature - minTemperature)) * 100;

  return (
    <View className="flex flex-col items-center mt-8">
      <View className="flex flex-row items-center justify-between w-full px-8">
        {!basicUI && (
          <>
            <Text style={{ color: textColor }} className="text-2xl font-semibold">
              {minTemperature.toFixed(0)}°
            </Text>
            <Text style={{ color: textColor }} className="text-2xl font-semibold">
              {maxTemperature.toFixed(0)}°
            </Text>
          </>
        )}
      </View>
      <View className="relative w-4/5">
        <LinearGradient
          colors={['rgba(7,210,180,0.5)', 'rgba(7,210,34,0.5)', 'rgba(255,214,0,0.8)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            height: 10,
            width: '100%',
            marginTop: 8,
            borderRadius: 5,
          }}
        />
        <View
          style={{ left: `${markerPosition}%` }}
          className="absolute top-1 transform -translate-x-2.5 items-center"
        >
          <View className="w-1.5 h-5 rounded-full bg-white" />
          <Text style={{ color: textColor }} className="mt-1 text-sm">
            {currentTemperature.toFixed(0)}°
          </Text>
        </View>
      </View>
    </View>
  );
};
