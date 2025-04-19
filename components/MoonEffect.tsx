import React, { useRef } from 'react';
import { Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Clouds } from './Clouds';

export const MoonEffect = () => {
  const starOpacity1 = useRef(new Animated.Value(0)).current;
  const starOpacity2 = useRef(new Animated.Value(0)).current;
  const starOpacity3 = useRef(new Animated.Value(0)).current;
  const starOpacity4 = useRef(new Animated.Value(0)).current;

  const animateStar = (opacity: Animated.Value, delay: number) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  React.useEffect(() => {
    animateStar(starOpacity1, 0);
    animateStar(starOpacity2, 500);
    animateStar(starOpacity3, 1000);
    animateStar(starOpacity4, 1500);
  }, [starOpacity1, starOpacity2, starOpacity3, starOpacity4]);

  return (
    <>
      <LinearGradient
        colors={['#2944b4', 'rgba(48,86,243,0)']}
        style={{
          position: 'absolute',
          width: '75%',
          aspectRatio: 1,
          borderRadius: 9999,
          alignSelf: 'center',
          zIndex: -1,
        }}
      />
      {/* Stars */}
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
      {/* Clouds */}
      <Clouds
        cloudConfigs={[
          { size: 20, top: 50, duration: 10000, delay: 0 },
          { size: 30, top: 120, duration: 12000, delay: 3000 },
          { size: 25, top: 230, duration: 9000, delay: 5300 },
        ]}
        cloudColor="rgba(161,181,245,0.2)"
      />
    </>
  );
};
