import React, { useEffect, useRef } from 'react';
import { Animated, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const SunEffect = () => {
  const screenWidth = Dimensions.get('window').width;

  const cloudPosition1 = useRef(new Animated.Value(-200)).current;
  const cloudPosition2 = useRef(new Animated.Value(-300)).current;
  const cloudPosition3 = useRef(new Animated.Value(-400)).current;

  useEffect(() => {
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

    animateCloud(cloudPosition1, 8000, 0);
    animateCloud(cloudPosition2, 10000, 2000);
    animateCloud(cloudPosition3, 12000, 4000);
  }, [cloudPosition1, cloudPosition2, cloudPosition3, screenWidth]);

  const Cloud = ({ position, size, top }: { position: Animated.Value; size: number; top: number }) => (
    <Animated.View
      style={{
        position: 'absolute',
        top,
        width: size * 4,
        height: size * 2,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
      <Cloud position={cloudPosition1} size={20} top={50} />
      <Cloud position={cloudPosition2} size={30} top={100} />
      <Cloud position={cloudPosition3} size={25} top={150} />
    </>
  );
};
