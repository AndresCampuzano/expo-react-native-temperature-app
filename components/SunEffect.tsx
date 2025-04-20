import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';

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
    </>
  );
};
