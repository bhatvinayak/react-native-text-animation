# AnimatedText React Native Package

`react-native-animated-text` is a simple React Native component that provides animations for text. You can animate text in different ways (e.g., fade-in, fade-out) and customize its behavior with props like duration, starting delay, iterations, and buffer.

## Features

- **Animation Types**: Fade-in, fade-out, and none.
- **Customizable Styles**: Apply custom text and container styles.
- **Control Animation Timing**: Set duration, starting delay, and cooldown buffer.

## Installation

```bash
npm install react-native-animated-text
```

## Usage

```bash
import AnimatedText from 'react-native-animated-text';

<AnimatedText
  text="Hello, World!"
  animationType="fade-in"
  duration={1000}
  startingDelay={500}
  iterations={3}
  buffer={200}
  textStyle={{ fontSize: 20 }}
  containerStyle={{ margin: 20 }}
/>
```

## Props

- **text**: The text to animate.
- **textStyle**: Custom style for the text.
- **containerStyle**: Custom style for the container.
- **animationType**: Animation to apply (e.g., 'fade-in', 'fade-out', 'none').
- **duration**: Duration of the animation (in milliseconds).
- **startingDelay:** Delay before starting the animation (in milliseconds).
- **iterations**: How many times the animation should repeat.
- **buffer**: Cooldown between animation iterations.

## License

Apache-2.0

## Author

Created and maintained B G Vinayak
