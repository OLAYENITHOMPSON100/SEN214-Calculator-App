import React from 'react';
import { StyleSheet, Text, Pressable, ViewStyle, TextStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '../theme';

interface CalcButtonProps {
  label: string;
  onPress: () => void;
  type: 'digit' | 'operator' | 'function' | 'constant' | 'action' | 'bracket' | 'modal' | 'spacer';
  size: number; // width & height of the square button
}

export const CalcButton: React.FC<CalcButtonProps> = ({ label, onPress, type, size }) => {
  if (type === 'spacer') {
    return <Pressable style={[styles.spacer, { width: size, height: size }]} disabled />;
  }

  const handlePress = () => {
    // Premium touch haptic feedback
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {
      // Fail-safe in case haptics are not available (e.g. simulator)
    }
    onPress();
  };

  // Determine button background and text styles based on type
  const getButtonStyles = (pressed: boolean): { buttonStyle: ViewStyle; textStyle: TextStyle } => {
    let backgroundColor = theme.colors.surface;
    let textColor = theme.colors.text;
    let fontFamily = theme.fonts.regular;

    if (label === '=') {
      // Equals button gets the accent background
      backgroundColor = pressed ? theme.colors.equalsPressed : theme.colors.equalsBackground;
      textColor = theme.colors.equalsText;
      fontFamily = theme.fonts.bold;
    } else {
      if (pressed) {
        if (type === 'operator' || type === 'modal') {
          backgroundColor = theme.colors.surfacePressed;
        } else {
          backgroundColor = theme.colors.surfacePressed;
        }
      } else {
        backgroundColor = theme.colors.surface;
      }

      // Text colors
      if (type === 'operator') {
        textColor = theme.colors.accent; // Operators highlight
        fontFamily = theme.fonts.bold;
      } else if (type === 'action') {
        textColor = theme.colors.error; // Action buttons AC, DEL in error/alert color
        fontFamily = theme.fonts.bold;
      } else if (type === 'function' || type === 'modal') {
        textColor = theme.colors.accent; // Trigonometric/functions in violet accent color
        fontFamily = theme.fonts.regular;
      } else if (type === 'constant') {
        textColor = theme.colors.textMuted;
        fontFamily = theme.fonts.regular;
      }
    }

    return {
      buttonStyle: {
        backgroundColor,
        width: size,
        height: size,
        borderRadius: theme.keyShape.borderRadius,
        ...theme.keyShape.shadow,
        // If outlined style were chosen, we would apply border styles.
        // For Rounded Squares, we apply the background and shadows.
        borderWidth: 1,
        borderColor: theme.colors.border,
      },
      textStyle: {
        color: textColor,
        fontFamily,
        fontSize: size * 0.32, // Auto-scale font size based on key size
      },
    };
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,
        getButtonStyles(pressed).buttonStyle,
        pressed && styles.pressedScale, // Micro-animation: shrink slightly on press
      ]}
    >
      {({ pressed }) => (
        <Text style={[styles.text, getButtonStyles(pressed).textStyle]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacer: {
    backgroundColor: 'transparent',
  },
  text: {
    textAlign: 'center',
  },
  pressedScale: {
    transform: [{ scale: 0.94 }], // Premium click shrink effect
  },
});
