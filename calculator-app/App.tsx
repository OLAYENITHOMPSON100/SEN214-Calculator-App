import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, ActivityIndicator, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts, DMSans_400Regular, DMSans_700Bold } from '@expo-google-fonts/dm-sans';

import { theme } from './src/theme';
import { Display } from './src/components/Display';
import { Keypad } from './src/components/Keypad';
import { InputModal } from './src/components/InputModal';
import { evaluateExpression, tokenize } from './src/mathEngine';
import { ButtonDef } from './src/keyLayouts';

export default function App() {
  // Load DM Sans fonts
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_700Bold,
  });

  // Calculator State
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [isFinalResult, setIsFinalResult] = useState(false);
  const [isScientific, setIsScientific] = useState(false);
  
  // Modal State
  const [modalType, setModalType] = useState<'nPr' | 'nCr' | 'STAT' | null>(null);

  // loading screen until fonts are loaded
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }

  const handleClear = () => {
    setExpression('');
    setResult('0');
    setIsFinalResult(false);
  };

  const handleDelete = () => {
    if (isFinalResult || result === 'Error') {
      handleClear();
      return;
    }
    
    if (!expression) return;
    
    try {
      const tokens = tokenize(expression);
      if (tokens.length === 0) {
        updateExpression('');
        return;
      }
      
      // If the last token is '(' and the token before it is a FUNCTION, delete both (e.g. "sin(")
      if (
        tokens.length >= 2 &&
        tokens[tokens.length - 1].value === '(' &&
        tokens[tokens.length - 2].type === 'FUNCTION'
      ) {
        tokens.pop(); // Pop '('
        tokens.pop(); // Pop FUNCTION
      } else {
        tokens.pop(); // Pop last token
      }
      
      const reconstructed = tokens
        .map((t) => (t.value === 'u-' ? '-' : t.value))
        .join('');
        
      updateExpression(reconstructed);
    } catch (e) {
      // Fallback in case of tokenization issues
      updateExpression(expression.slice(0, -1));
    }
  };

  const updateExpression = (newExpr: string) => {
    setExpression(newExpr);
    setIsFinalResult(false);
    
    if (!newExpr) {
      setResult('0');
      return;
    }
    
    // Live preview update
    const liveVal = evaluateExpression(newExpr);
    if (liveVal !== 'Error') {
      setResult(liveVal);
    }
  };

  const handleEquals = () => {
    if (!expression) return;
    const finalVal = evaluateExpression(expression);
    setResult(finalVal);
    setIsFinalResult(true);
  };

  const handleButtonPress = (action: string, type: ButtonDef['type']) => {
    // If the calculator is in Error state, any key press recovers (clears error)
    if (result === 'Error') {
      handleClear();
      if (type === 'action') return; // Del/AC just clear the error
    }

    if (type === 'action') {
      if (action === 'clear') {
        handleClear();
      } else if (action === 'delete') {
        handleDelete();
      }
      return;
    }

    if (type === 'modal') {
      setModalType(action as 'nPr' | 'nCr' | 'STAT');
      return;
    }

    if (action === 'equals') {
      handleEquals();
      return;
    }

    let toInsert = action;

    // Handle fresh keypress after showing equals result
    if (isFinalResult) {
      setIsFinalResult(false);
      if (type === 'operator') {
        // Continue calculation using the previous result
        updateExpression(result + toInsert);
      } else {
        // Clear and start fresh
        if (toInsert === '.') {
          updateExpression('0.');
        } else {
          updateExpression(toInsert);
        }
      }
      return;
    }

    // Default character insertion rules
    if (expression === '' || expression === '0') {
      if (toInsert === '.') {
        updateExpression('0.');
      } else if (type === 'operator') {
        updateExpression('0' + toInsert);
      } else {
        updateExpression(toInsert);
      }
    } else {
      updateExpression(expression + toInsert);
    }
  };

  const handleInsertModalValue = (valueStr: string) => {
    if (result === 'Error') {
      setExpression(valueStr);
      setResult(valueStr);
      setIsFinalResult(false);
      return;
    }

    if (isFinalResult) {
      updateExpression(valueStr);
      return;
    }

    // Append the computed modal value to the current expression
    if (expression === '' || expression === '0') {
      updateExpression(valueStr);
    } else {
      // If it ends with a number and we insert a number, maybe add * or append directly
      const lastChar = expression[expression.length - 1];
      if (/[0-9]/.test(lastChar)) {
        updateExpression(expression + '×' + valueStr);
      } else {
        updateExpression(expression + valueStr);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={theme.colors.background} />
      
      {/* Premium Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>NUMERUS</Text>
        <Text style={styles.headerSubtitle}>Scientific Calculator</Text>
      </View>

      {/* Recessed Display Panel */}
      <Display
        expression={expression}
        result={result}
        isFinalResult={isFinalResult}
      />

      {/* Dynamic Keypad Layout */}
      <View style={styles.keypadWrapper}>
        <Keypad
          onButtonPress={handleButtonPress}
          isScientific={isScientific}
          setIsScientific={setIsScientific}
        />
      </View>

      {/* Combinatorics & Statistics Overlay Modals */}
      <InputModal
        visible={modalType !== null}
        type={modalType}
        onClose={() => setModalType(null)}
        onInsertValue={handleInsertModalValue}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 4,
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    color: theme.colors.accent,
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: -2,
    letterSpacing: 0.5,
  },
  keypadWrapper: {
    flexShrink: 1,
  },
});
