import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const MoonEffect = () => {
  const starOpacity1 = useRef(new Animated.Value(1)).current;
  const starOpacity2 = useRef(new Animated.Value(1)).current;
  const starOpacity3 = useRef(new Animated.Value(1)).current;
  const starOpacity4 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const twinkle = (opacity: Animated.Value, duration: number, delay: number) => {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.3,
          duration,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
      ]).start(() => twinkle(opacity, duration, delay));
    };

    twinkle(starOpacity1, 1200, 0);
    twinkle(starOpacity2, 1500, 300);
    twinkle(starOpacity3, 1000, 600);
    twinkle(starOpacity4, 1800, 900);
  }, [starOpacity1, starOpacity2, starOpacity3, starOpacity4]);

  return (
    <>
      <LinearGradient
        colors={['#091857', 'rgba(9, 24, 87, 0.5)', 'rgba(255, 255, 255, 0)']}
        style={{
          position: 'absolute',
          width: '75%',
          aspectRatio: 1,
          borderRadius: 9999,
          alignSelf: 'center',
          zIndex: -1,
          shadowColor: '#FFFFFF',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.5,
          shadowRadius: 20,
        }}
      />
      <Animated.View
        style={{
          position: 'absolute',
          top: '10%',
          left: '20%',
          width: 7,
          height: 7,
          borderRadius: 5,
          backgroundColor: '#FFFFFF',
          shadowColor: '#FFFFFF',
          shadowOpacity: 0.8,
          shadowRadius: 10,
          opacity: starOpacity1,
        }}
      />
      <Animated.View
        style={{
          position: 'absolute',
          top: '5%',
          right: '15%',
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: '#FFFFFF',
          shadowColor: '#FFFFFF',
          shadowOpacity: 0.6,
          shadowRadius: 8,
          opacity: starOpacity2,
        }}
      />
      <Animated.View
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '30%',
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: '#FFFFFF',
          shadowColor: '#FFFFFF',
          shadowOpacity: 0.5,
          shadowRadius: 6,
          opacity: starOpacity3,
        }}
      />
      <Animated.View
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '20%',
          width: 6,
          height: 6,
          borderRadius: 6,
          backgroundColor: '#FFFFFF',
          shadowColor: '#FFFFFF',
          shadowOpacity: 0.9,
          shadowRadius: 12,
          opacity: starOpacity4,
        }}
      />
    </>
  );
};
