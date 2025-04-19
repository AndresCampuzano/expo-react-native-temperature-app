import React, { useEffect, useRef } from 'react';
import { Animated, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const MoonEffect = () => {
  const screenWidth = Dimensions.get('window').width;

  // Animated values for star opacity
  const starOpacity1 = useRef(new Animated.Value(0)).current;
  const starOpacity2 = useRef(new Animated.Value(0)).current;
  const starOpacity3 = useRef(new Animated.Value(0)).current;
  const starOpacity4 = useRef(new Animated.Value(0)).current;

  // Animated values for cloud positions
  const cloudPosition1 = useRef(new Animated.Value(-200)).current;
  const cloudPosition2 = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    // Animate star opacity
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

    animateStar(starOpacity1, 0);
    animateStar(starOpacity2, 500);
    animateStar(starOpacity3, 1000);
    animateStar(starOpacity4, 1500);

    // Animate clouds
    const animateCloud = (position: Animated.Value, duration: number, delay: number) => {
      Animated.sequence([
        Animated.timing(position, {
          toValue: screenWidth + 100, // Move off the right side of the screen
          duration,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(position, {
          toValue: -200, // Reset to the left, off-screen
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start(() => animateCloud(position, duration, delay));
    };

    animateCloud(cloudPosition1, 10000, 0);
    animateCloud(cloudPosition2, 12000, 3000);
  }, [
    starOpacity1,
    starOpacity2,
    starOpacity3,
    starOpacity4,
    cloudPosition1,
    cloudPosition2,
    screenWidth,
  ]);

  const Cloud = ({
    position,
    size,
    top,
  }: {
    position: Animated.Value;
    size: number;
    top: number;
  }) => (
    <Animated.View
      style={{
        position: 'absolute',
        top,
        width: size * 4,
        height: size * 2,
        backgroundColor: 'rgba(161,181,245,0.2)',
        borderRadius: size,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        transform: [{ translateX: position }], // Use translateX for horizontal movement
      }}
    />
  );

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
      <Cloud position={cloudPosition1} size={20} top={50} />
      <Cloud position={cloudPosition2} size={30} top={120} />
    </>
  );
};
