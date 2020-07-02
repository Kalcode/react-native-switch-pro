import { Animated, Easing, PanResponder } from 'react-native';

export function animationSwitchWidth(
  animatedValue,
  toValue,
  callback = () => null,
) {
  Animated.timing(animatedValue, {
    useNativeDriver: false,
    toValue,
    duration: 200,
    easing: Easing.linear,
  }).start(callback);
}

export function animationSwitchPosition(
  animatedValue: Animated.Value,
  value: boolean,
  offset: number,
  callback: () => void,
) {
  Animated.timing(animatedValue, {
    useNativeDriver: false,
    toValue: value ? offset : -offset,
    duration: 200,
    easing: Easing.linear,
  }).start(callback);
}

export function createPanResponder({
  onPanResponderGrant,
  onPanResponderMove,
  onPanResponderRelease,
}) {
  return PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderTerminationRequest: () => true,
    onPanResponderGrant,
    onPanResponderMove,
    onPanResponderRelease,
  });
}

export function getCirclePosition(
  value,
  style,
  circleStyle,
) {
  const modifier = value ? 4 : -4;
  let position = modifier * -1;

  if (circleStyle && circleStyle.borderWidth) {
    position += modifier;
  }

  if (style && style.borderWidth) {
    position += modifier;
  }

  return position;
}

export function getInterpolatedActiveToInactiveColor(
  animatedValue,
  value,
  offset,
  { inactive, active },
) {
  return animatedValue.interpolate({
    inputRange: value ? [-offset, -1] : [1, offset],
    outputRange: [inactive, active],
    extrapolate: 'clamp',
  });
}
