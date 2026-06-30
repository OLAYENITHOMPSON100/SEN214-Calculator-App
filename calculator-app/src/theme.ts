export const theme = {
  colors: {
    background: '#0B1622',       // Deep Ocean Background
    surface: '#142D4C',          // Keys/Surface
    surfacePressed: '#1B3D66',   // Keys pressed state
    text: '#D4E4F7',             // Primary Text
    textMuted: '#7E9BB8',        // Inactive operators / live preview text
    border: '#1E3A5F',           // Subtle borders
    accent: '#9B75FF',           // Violet accent, lightened for dark theme contrast (from #7C4DFF)
    accentPressed: '#B599FF',    // Pressed violet accent
    equalsBackground: '#9B75FF', // Equals button background
    equalsPressed: '#B599FF',    // Equals button pressed state
    equalsText: '#FFFFFF',       // Text on equals button
    error: '#FF6B6B',            // Error color
    overlay: 'rgba(5, 11, 18, 0.85)', // Semi-transparent modal overlay
    displayBackground: '#060C14', // Recessed display panel background (Inset Panel)
  },
  keyShape: {
    borderRadius: 14,
    gap: 4,
    // Rounded squares have equal width and height. This will be computed dynamically in the component.
    shadow: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 3, // Android shadow
    },
  },
  fonts: {
    regular: 'DMSans_400Regular',
    bold: 'DMSans_700Bold',
  },
  displayStyle: {
    styleType: 'InsetPanel', // 0: Inset Panel
    borderWidth: 1.5,
    borderColor: '#1E3A5F',
    borderRadius: 14,
  },
};
