import React from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity, Text } from 'react-native';
import { theme } from '../theme';
import { CalcButton } from './CalcButton';
import { ButtonDef, basicLayout, scientificLayout, bottomBarLayout } from '../keyLayouts';

interface KeypadProps {
  onButtonPress: (action: string, type: ButtonDef['type']) => void;
  isScientific: boolean;
  setIsScientific: (val: boolean) => void;
}

export const Keypad: React.FC<KeypadProps> = ({ onButtonPress, isScientific, setIsScientific }) => {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const paddingHorizontal = 16;
  const gap = theme.keyShape.gap;
  const availableWidth = screenWidth - paddingHorizontal * 2;

  // Calculate button sizes based on column counts
  const basicCols = 3;
  
  // Height constraint: prevent keypad from overflowing screen height on smaller devices
  const maxBasicKeyHeight = (screenHeight * 0.48 - 5 * gap) / 6;
  const basicButtonSize = Math.min(
    (availableWidth - (basicCols - 1) * gap) / basicCols,
    maxBasicKeyHeight
  );

  const scientificCols = 6;
  const scientificButtonSize = (availableWidth - (scientificCols - 1) * gap) / scientificCols;

  const bottomBarCols = 5;
  const bottomBarButtonSize = (availableWidth - (bottomBarCols - 1) * gap) / bottomBarCols;

  const currentLayout = isScientific ? scientificLayout : basicLayout;
  const currentButtonSize = isScientific ? scientificButtonSize : basicButtonSize;

  return (
    <View style={styles.container}>
      
      {/* Premium Segmented Control for Mode Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.toggleButton,
            !isScientific && styles.toggleButtonActive,
            { marginRight: 4 }
          ]}
          onPress={() => setIsScientific(false)}
        >
          <Text
            style={[
              styles.toggleText,
              !isScientific ? styles.toggleTextActive : styles.toggleTextInactive
            ]}
          >
            Basic
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.toggleButton,
            isScientific && styles.toggleButtonActive,
            { marginLeft: 4 }
          ]}
          onPress={() => setIsScientific(true)}
        >
          <Text
            style={[
              styles.toggleText,
              isScientific ? styles.toggleTextActive : styles.toggleTextInactive
            ]}
          >
            Scientific
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Grid Area (Basic 3-col or Scientific 6-col) */}
      <View style={styles.gridContainer}>
        {currentLayout.map((row, rowIndex) => (
          <View
            key={`row-${rowIndex}`}
            style={[
              styles.row,
              {
                marginBottom: gap,
                justifyContent: isScientific ? 'space-between' : 'center',
              }
            ]}
          >
            {row.map((btn, colIndex) => (
              <View
                key={`btn-wrapper-${rowIndex}-${colIndex}`}
                style={!isScientific && { marginHorizontal: gap / 2 }}
              >
                <CalcButton
                  label={btn.label}
                  type={btn.type}
                  size={currentButtonSize}
                  onPress={() => onButtonPress(btn.action, btn.type)}
                />
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Spacing above Bottom Bar */}
      <View style={{ height: 4 }} />

      {/* Bottom Bar: Pinned Horizontal Operator Row */}
      <View style={styles.bottomBarRow}>
        {bottomBarLayout.map((btn, index) => (
          <CalcButton
            key={`bottom-btn-${index}`}
            label={btn.label}
            type={btn.type}
            size={bottomBarButtonSize}
            onPress={() => onButtonPress(btn.action, btn.type)}
          />
        ))}
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    width: '100%',
    paddingBottom: 24,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.displayBackground,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
    width: '100%',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 0.5,
  },
  toggleText: {
    fontFamily: theme.fonts.bold,
    fontSize: 14,
  },
  toggleTextActive: {
    color: theme.colors.accent,
  },
  toggleTextInactive: {
    color: theme.colors.textMuted,
  },
  gridContainer: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  bottomBarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
});
