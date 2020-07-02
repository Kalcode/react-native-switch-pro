import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import {
  Animated,
  View,
} from 'react-native';
import {
  animationSwitchWidth,
  animationSwitchPosition,
  createPanResponder,
  getInterpolatedActiveToInactiveColor,
  getCirclePosition,
} from './helpers';
import styles from './styles';

export const SCALE = 6 / 5;

export const defaultAsyncPress = (callback = (value) => null) => {
  callback(true);
};


export default function ToggleSwitch({
  backgroundActive = '#43d551',
  backgroundInactive = '#dddddd',
  circleColorActive = 'white',
  circleColorInactive = 'white',
  circleStyle,
  disabled = false,
  height = 30,
  onAsyncPress = defaultAsyncPress,
  onSyncPress,
  style,
  value = false,
  width = 65,
  ...rest
}) {
  // Constructor
  const offset = useMemo(() => width - height + 1, [height, width]);
  const handlerSize = useMemo(() => height - 5, [height]);

  // Animated value refs
  const handlerAnimation = useRef(new Animated.Value(handlerSize)).current;
  const switchAnimation = useRef(new Animated.Value(value ? -1 : 1)).current;

  // State Declaration
  const [state, setState] = useState({
    value,
    toggleable: true,
    alignItems: value ? 'flex-end' : 'flex-start',
  });

  // Animation Callbacks
  const animateHandler = useCallback(
    (toValue, callback  = () => null) => {
      animationSwitchWidth(handlerAnimation, toValue, callback);
    },
    [handlerAnimation],
  );

  const animateSwitch = useCallback(
    (newValue, callback = () => null) => {
      animationSwitchPosition(switchAnimation, newValue, offset, callback);
    },
    [offset, switchAnimation],
  );

  // On Interaction Callbacks
  const toggleSwitchToValue = useCallback(
    (result, newValue, callback = (val) => null) => {
      animateHandler(handlerSize);

      if (result) {
        animateSwitch(newValue, () => {
          state.value = newValue;
          state.alignItems = newValue ? 'flex-end' : 'flex-start';
          setState({
            ...state,
          });

          // This used a callback
          // passed as a func to this.setState(value, callback)
          // So not exact
          setImmediate(() => {
            callback(newValue);
          });
          switchAnimation.setValue(newValue ? -1 : 1);
        });
      }
    },
    [animateHandler, animateSwitch, handlerSize, state, switchAnimation],
  );

  const toggleSwitch = useCallback(
    (result, callback = () => null) => {
      toggleSwitchToValue(result, !state.value, callback);
    },
    [state.value, toggleSwitchToValue],
  );

  //componentWillReceiveProps
  useEffect(() => {
    if (value === state.value) {
      return;
    }

    if (typeof value !== 'undefined') {
      toggleSwitchToValue(true, value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Pan Handler Callbacks
  const onPanResponderMove = useCallback(
    (_, gestureState) => {
      if (disabled) return;

      state.toggleable = state.value ? gestureState.dx < 10 : gestureState.dx > -10;
      setState({
        ...state,
      });
    },
    [disabled, state],
  );

  const onPanResponderGrant = useCallback(() => {
    if (disabled) return;

    state.toggleable = true;
    setState({
      ...state,
    });
    animateHandler(handlerSize * SCALE);
  }, [animateHandler, disabled, handlerSize, state]);

  const onPanResponderRelease = useCallback(() => {
    const { toggleable } = state;

    if (disabled) return;

    if (toggleable) {
      if (onSyncPress) {
        toggleSwitch(true, onSyncPress);
      } else {
        onAsyncPress(toggleSwitch);
      }
    } else {
      animateHandler(handlerSize);
    }
  }, [animateHandler, disabled, handlerSize, onAsyncPress, onSyncPress, state, toggleSwitch]);

  // Pan Responder Setup
  const _panResponder = useMemo(() => {
    return createPanResponder({
      onPanResponderMove,
      onPanResponderGrant,
      onPanResponderRelease,
    });
  }, [onPanResponderGrant, onPanResponderMove, onPanResponderRelease]);

  // Interpolating Values
  const interpolatedBackgroundColor = getInterpolatedActiveToInactiveColor(
    switchAnimation,
    state.value,
    offset,
    { active: backgroundActive, inactive: backgroundInactive },
  );

  const interpolatedCircleColor = getInterpolatedActiveToInactiveColor(
    switchAnimation,
    state.value,
    offset,
    { active: circleColorActive, inactive: circleColorInactive },
  );

  const circlePosition = useMemo(() => {
    return getCirclePosition(state.value, style, circleStyle);
  }, [circleStyle, state.value, style]);

  const interpolatedTranslateX = switchAnimation.interpolate({
    inputRange: state.value ? [-offset, -1] : [1, offset],
    outputRange: state.value ? [-offset, circlePosition] : [circlePosition, offset],
    extrapolate: 'clamp',
  });

  // Render
  return (
    <Animated.View
      {...rest}
      {..._panResponder.panHandlers}
      style={[
        styles.container,
        {
          width,
          height,
          alignItems: state.alignItems,
          borderRadius: height / 2,
          backgroundColor: interpolatedBackgroundColor,
        },
        style,
      ]}
    >
      <View style={styles.customCircleStyle}>
        <Animated.View
          style={[
            {
              backgroundColor: interpolatedCircleColor,
              width: handlerAnimation,
              height: handlerSize,
              borderRadius: height / 2,
              transform: [{ translateX: interpolatedTranslateX }],
            },
            circleStyle,
          ]}
        />
      </View>
    </Animated.View>
  );
}
