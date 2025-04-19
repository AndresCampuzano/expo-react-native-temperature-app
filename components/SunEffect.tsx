import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Clouds } from './Clouds';

export const SunEffect = () => {
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
      <Clouds
        cloudConfigs={[
          { size: 20, top: 50, duration: 8000, delay: 0 },
          { size: 30, top: 100, duration: 10000, delay: 2000 },
          { size: 25, top: 150, duration: 12000, delay: 4000 },
        ]}
        cloudColor="rgba(255, 255, 255, 0.6)"
      />
    </>
  );
};
