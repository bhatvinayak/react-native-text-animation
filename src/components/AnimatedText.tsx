import React, { useEffect, useRef } from "react";
import { Animated, Text, TextStyle, ViewStyle } from "react-native";

type AnimatedTextProps = {
  text: string; // Text to animate
  textStyle?: TextStyle; // Style for the text
  containerStyle?: ViewStyle; // Style for the container
  animationType?: AnimationType; // Type of animation
  duration?: number; // Duration of the animation
  startingDelay?: number; // Delay before starting the animation
  slideDistance?: number; // Distance for slide animations
  zoomScale?: number; // Scale for zoom animations
  iterations?: number; // Number of times to repeat the animation
  buffer?: number; // Cooldown between iterations
  rotationDegrees?: number; // Degrees for rotation animations
  bounceHeight?: number; // Height for bounce animations
};

type AnimationType =
  | "fade-in"
  | "fade-out"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "zoom"
  | "bounce"
  | "rotate"
  | "flip-horizontal"
  | "flip-vertical"
  | "none";

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  textStyle,
  containerStyle,
  animationType = "none",
  duration = 1000,
  startingDelay = 0,
  slideDistance = 50,
  zoomScale = 1.5,
  iterations = Infinity,
  buffer = 0,
  rotationDegrees = 360,
  bounceHeight = 20,
}) => {
  const animationValue = useRef(new Animated.Value(0)).current; // For fade, zoom, and bounce animations
  const translateXValue = useRef(new Animated.Value(0)).current; // For horizontal slide animations
  const translateYValue = useRef(new Animated.Value(0)).current; // For vertical slide animations
  const scaleValue = useRef(new Animated.Value(1)).current; // For zoom animations
  const rotateValue = useRef(new Animated.Value(0)).current; // For rotation animations

  // Animation configuration object
  const animationConfig: Record<
    AnimationType,
    { animation: Animated.CompositeAnimation | undefined }
  > = {
    "fade-in": {
      animation: Animated.timing(animationValue, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
    },
    "fade-out": {
      animation: Animated.timing(animationValue, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      }),
    },
    "slide-up": {
      animation: Animated.timing(translateYValue, {
        toValue: -slideDistance,
        duration,
        useNativeDriver: true,
      }),
    },
    "slide-down": {
      animation: Animated.timing(translateYValue, {
        toValue: slideDistance,
        duration,
        useNativeDriver: true,
      }),
    },
    "slide-left": {
      animation: Animated.timing(translateXValue, {
        toValue: -slideDistance,
        duration,
        useNativeDriver: true,
      }),
    },
    "slide-right": {
      animation: Animated.timing(translateXValue, {
        toValue: slideDistance,
        duration,
        useNativeDriver: true,
      }),
    },
    zoom: {
      animation: Animated.timing(scaleValue, {
        toValue: zoomScale,
        duration,
        useNativeDriver: true,
      }),
    },
    bounce: {
      animation: Animated.sequence([
        Animated.timing(translateYValue, {
          toValue: -bounceHeight,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(translateYValue, {
          toValue: 0,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ]),
    },
    rotate: {
      animation: Animated.timing(rotateValue, {
        toValue: rotationDegrees,
        duration,
        useNativeDriver: true,
      }),
    },
    "flip-horizontal": {
      animation: Animated.timing(rotateValue, {
        toValue: 180,
        duration,
        useNativeDriver: true,
      }),
    },
    "flip-vertical": {
      animation: Animated.timing(rotateValue, {
        toValue: 90,
        duration,
        useNativeDriver: true,
      }),
    },
    none: {
      animation: undefined, // No animation for "none"
    },
  };

  useEffect(() => {
    const animation = animationConfig[animationType].animation;

    if (animation) {
      Animated.sequence([
        Animated.delay(startingDelay),
        Animated.loop(
          Animated.sequence([
            animation,
            Animated.delay(buffer), // Apply buffer as cooldown between iterations
          ]),
          { iterations }
        ),
      ]).start();
    } else if (animationType === "none" || animationType === "fade-out") {
      animationValue.setValue(1);
    }
  }, [animationType, duration, startingDelay, iterations]);

  const animationStyles = {
    transform: [
      { translateY: translateYValue },
      { translateX: translateXValue },
      { scale: scaleValue },
      {
        rotate: rotateValue.interpolate({
          inputRange: [0, 360],
          outputRange: ["0deg", "360deg"],
        }),
      },
    ],
  };

  const opacityStyles = {
    opacity: animationType.includes("fade-") ? animationValue : 1,
  };

  return (
    <Animated.View style={[animationStyles, opacityStyles, containerStyle]}>
      <Text style={textStyle}>{text}</Text>
    </Animated.View>
  );
};

export default AnimatedText;
