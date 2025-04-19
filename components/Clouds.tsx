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
  const [currentPositions, setCurrentPositions] = useState(
    cloudConfigs.map(() => -200) // Initial positions
  );

  const calculateShadowOffset = (translateX: number) => {
    const centerX = screenWidth / 2;
    if (translateX < -200) return -10;
    if (translateX > screenWidth + 100) return 10;
    return ((translateX - centerX) / centerX) * 10;
  };

  useEffect(() => {
    const listeners: string[] = [];

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

      // Add a listener to track the current value of the Animated.Value
      const listenerId = cloudPositions[index].addListener(({ value }) => {
        setCurrentPositions(prevPositions =>
          prevPositions.map((pos, i) => (i === index ? value : pos))
        );
      });
      listeners.push(listenerId);

      animateCloud(cloudPositions[index]);
    });

    // Cleanup listeners on unmount
    return () => {
      listeners.forEach((id, index) => cloudPositions[index].removeListener(id));
    };
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
            shadowOffset: {
              width: calculateShadowOffset(currentPositions[index]),
              height: 10,
            },
            shadowRadius: 0,
            transform: [{ translateX: cloudPositions[index] }],
          }}
        />
      ))}
    </>
  );
};
