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
};

type AnimationType =
  | "fade-in"
  | "fade-out"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "zoom"
  | "none";

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  textStyle,
  containerStyle,
  animationType = "none",
  duration = 1000,
  startingDelay = 0,
  slideDistance = 0,
  zoomScale = 1,
  iterations = Infinity,
  buffer = 0,
}) => {
  const animationValue = useRef(
    new Animated.Value(animationType === "fade-out" ? 1 : 0)
  ).current; // For fade animations
  const translateXValue = useRef(new Animated.Value(0)).current; // For horizontal slide animations
  const translateYValue = useRef(new Animated.Value(0)).current; // For vertical slide animations
  const scaleValue = useRef(new Animated.Value(1)).current; // For zoom animations

  useEffect(() => {
    const animation = getAnimation(animationType, duration);

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

  const getAnimation = (type: AnimationType, duration: number) => {
    switch (type) {
      case "fade-in":
        return Animated.timing(animationValue, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        });
      case "fade-out":
        return Animated.timing(animationValue, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        });
      case "slide-up":
        return Animated.timing(translateYValue, {
          toValue: -slideDistance, // Adjust this value as needed
          duration,
          useNativeDriver: true,
        });
      case "slide-down":
        return Animated.timing(translateYValue, {
          toValue: slideDistance, // Adjust this value as needed
          duration,
          useNativeDriver: true,
        });
      case "slide-left":
        return Animated.timing(translateXValue, {
          toValue: -slideDistance, // Adjust this value as needed
          duration,
          useNativeDriver: true,
        });
      case "slide-right":
        return Animated.timing(translateXValue, {
          toValue: slideDistance, // Adjust this value as needed
          duration,
          useNativeDriver: true,
        });
      case "zoom":
        return Animated.timing(scaleValue, {
          toValue: zoomScale,
          duration,
          useNativeDriver: true,
        });

      default:
        return undefined;
    }
  };

  const animationStyles = {
    transform: [
      {
        translateY:
          animationType.includes("slide-up") ||
          animationType.includes("slide-down")
            ? translateYValue
            : 0,
      },
      {
        translateX:
          animationType.includes("slide-right") ||
          animationType.includes("slide-left")
            ? translateXValue
            : 0,
      },
      { scale: animationType === "zoom" ? scaleValue : 1 },
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
