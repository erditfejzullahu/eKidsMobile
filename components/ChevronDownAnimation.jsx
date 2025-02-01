import { View } from "react-native";
import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import Svg, { Polyline } from "react-native-svg";

// Convert Polyline to Animated component
const AnimatedPolyline = Animated.createAnimatedComponent(Polyline);

const ChevronDownAnimation = () => {
  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const fadeAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim1, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(fadeAnim2, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(fadeAnim3, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.delay(500), // Pause before restarting
        Animated.timing(fadeAnim1, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(fadeAnim2, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(fadeAnim3, { toValue: 0, duration: 300, useNativeDriver: true }),
      ])
    );

    animation.start();
    return () => animation.stop(); // Clean up when unmounting
  }, []);

  return (
    <View>
      <Svg width="40" height="40" viewBox="0 0 100 100">
        <AnimatedPolyline
          points="20,30 50,60 80,30"
          stroke="#ff9001"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={fadeAnim1}
        />
        <AnimatedPolyline
          points="20,50 50,80 80,50"
          stroke="#ff9001"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={fadeAnim2}
        />
        <AnimatedPolyline
          points="20,70 50,100 80,70"
          stroke="#ff9001"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={fadeAnim3}
        />
      </Svg>
    </View>
  );
};

export default ChevronDownAnimation;
