import React, { useEffect, useRef } from "react";
import { Animated, Text, TextStyle, ViewStyle } from "react-native";

type AnimatedTextProps = {
  text: string; // Text to animate
  textStyle?: TextStyle; // Style for the text
  containerStyle?: ViewStyle; // Style for the container
  animationType?: AnimationType; // Type of animation
  duration?: number; // Duration of the animation
  startingDelay?: number; // Delay before starting the animation
  iterations?: number; // Number of times to repeat the animation
  buffer?: number; // Cooldown between iterations
};

type AnimationType = "fade-in" | "fade-out" | "none";

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  textStyle,
  containerStyle,
  animationType = "none",
  duration = 1000,
  startingDelay = 0,
  iterations = 1,
  buffer = 0,
}) => {
  const animationValue = useRef(new Animated.Value(0)).current;

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
    } else if (animationType === "none") {
      // Set opacity to 1 if no animation is applied
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
      default:
        return undefined;
    }
  };

  return (
    <Animated.View
      style={[
        {
          opacity: animationValue,
        },
        containerStyle,
      ]}
    >
      <Text style={textStyle}>{text}</Text>
    </Animated.View>
  );
};

export default AnimatedText;
