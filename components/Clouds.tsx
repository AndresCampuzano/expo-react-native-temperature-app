import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export const Clouds = ({
  cloudConfigs,
  cloudColor,
}: {
  cloudConfigs: { size: number; top: number; duration: number; delay: number }[];
  cloudColor: string;
}) => {
  const cloudPositions = useRef(cloudConfigs.map(() => new Animated.Value(-200))).current;
  const [cloudTops, setCloudTops] = useState(
    cloudConfigs.map(config => config.top + (Math.random() * 10 - 5))
  );

  useEffect(() => {
    cloudConfigs.forEach((config, index) => {
      const animateCloud = (position: Animated.Value) => {
        position.stopAnimation(); // Ensure no overlapping animations
        Animated.sequence([
          Animated.timing(position, {
            toValue: screenWidth + 100, // Move off the right side of the screen
            duration: config.duration,
            delay: config.delay,
            useNativeDriver: true,
          }),
          Animated.timing(position, {
            toValue: -200, // Reset to the left, off-screen
            duration: 0,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Update the top position with a new random value
          setCloudTops(prevTops =>
            prevTops.map((top, i) => (i === index ? config.top + (Math.random() * 10 - 5) : top))
          );
          animateCloud(position); // Restart the animation
        });
      };
      animateCloud(cloudPositions[index]);
    });
  }, [cloudConfigs, cloudPositions]);

  return (
    <>
      {cloudConfigs.map((config, index) => (
        <Animated.View
          key={index}
          style={{
            position: 'absolute',
            top: cloudTops[index],
            width: config.size * 4,
            height: config.size * 2,
            backgroundColor: cloudColor,
            borderRadius: config.size,
            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowOffset: { width: 10, height: 10 },
            shadowRadius: 0,
            transform: [{ translateX: cloudPositions[index] }],
          }}
        />
      ))}
    </>
  );
};
