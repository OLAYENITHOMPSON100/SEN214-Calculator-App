import React, { useRef } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { theme } from '../theme';

interface DisplayProps {
  expression: string;
  result: string;
  isFinalResult: boolean;
}

export const Display: React.FC<DisplayProps> = ({ expression, result, isFinalResult }) => {
  const expressionScrollRef = useRef<ScrollView>(null);
  const resultScrollRef = useRef<ScrollView>(null);

  // Prettify the expression for visual clarity
  const formatDisplayExpression = (expr: string) => {
    if (!expr) return '';
    return expr
      .replace(/\*/g, '×')
      .replace(/\//g, '÷')
      .replace(/pi/g, 'π')
      .replace(/sqrt/g, '√');
  };

  return (
    <View style={styles.container}>
      {/* Inset Panel recessed design */}
      <View style={styles.panel}>
        
        {/* Top Line: Expression */}
        <View style={styles.expressionContainer}>
          <ScrollView
            ref={expressionScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            onContentSizeChange={() => expressionScrollRef.current?.scrollToEnd({ animated: true })}
          >
            <Text style={styles.expressionText}>
              {formatDisplayExpression(expression) || ' '}
            </Text>
          </ScrollView>
        </View>

        {/* Bottom Line: Result */}
        <View style={styles.resultContainer}>
          <ScrollView
            ref={resultScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            onContentSizeChange={() => resultScrollRef.current?.scrollToEnd({ animated: true })}
          >
            <Text
              style={[
                styles.resultText,
                { color: isFinalResult ? theme.colors.text : theme.colors.textMuted }
              ]}
            >
              {result}
            </Text>
          </ScrollView>
        </View>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    width: '100%',
  },
  panel: {
    backgroundColor: theme.colors.displayBackground,
    borderWidth: theme.displayStyle.borderWidth,
    borderColor: theme.displayStyle.borderColor,
    borderRadius: theme.displayStyle.borderRadius,
    padding: 16,
    height: 150,
    justifyContent: 'space-between',
    // Subtle inset elevation & inner shadow approximation for iOS/Android
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
  },
  expressionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '100%',
  },
  resultContainer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '100%',
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexGrow: 1,
  },
  expressionText: {
    fontFamily: theme.fonts.regular,
    fontSize: 22,
    color: theme.colors.textMuted,
    textAlign: 'right',
  },
  resultText: {
    fontFamily: theme.fonts.bold,
    fontSize: 44,
    textAlign: 'right',
  },
});
