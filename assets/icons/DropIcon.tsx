import Svg, { Path } from 'react-native-svg';

export const DropIcon = ({ color }: { color: string }) => {
  return (
    <Svg width="11" height="16" viewBox="0 0 11 16">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10 7.25L5.5 0L1 7.25H1.06248C0.394501 8.16051 0 9.28419 0 10.5C0 13.5376 2.46243 16 5.5 16C8.53757 16 11 13.5376 11 10.5C11 9.28419 10.6055 8.16051 9.93752 7.25H10Z"
        fill={color}
      />
    </Svg>
  );
};
