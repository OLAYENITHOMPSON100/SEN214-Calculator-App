import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Modal, TextInput, Pressable, TouchableOpacity, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '../theme';
import { nPr, nCr, mean, variance, stddev, formatResult } from '../mathEngine';

interface InputModalProps {
  visible: boolean;
  type: 'nPr' | 'nCr' | 'STAT' | null;
  onClose: () => void;
  onInsertValue: (val: string) => void;
}

export const InputModal: React.FC<InputModalProps> = ({ visible, type, onClose, onInsertValue }) => {
  const [nVal, setNVal] = useState('');
  const [rVal, setRVal] = useState('');
  const [statVal, setStatVal] = useState('');

  // Results state
  const [computedResult, setComputedResult] = useState<number | null>(null);
  const [statResults, setStatResults] = useState<{ mean: number; variance: number; stddev: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Reset inputs when modal opens or changes type
  useEffect(() => {
    if (visible) {
      setNVal('');
      setRVal('');
      setStatVal('');
      setComputedResult(null);
      setStatResults(null);
      setErrorMsg('');
    }
  }, [visible, type]);

  const triggerHaptic = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {}
  };

  const handleCalculate = () => {
    triggerHaptic();
    setErrorMsg('');

    if (type === 'nPr' || type === 'nCr') {
      const n = parseInt(nVal, 10);
      const r = parseInt(rVal, 10);

      if (isNaN(n) || isNaN(r)) {
        setErrorMsg('Please enter valid integers for n and r.');
        return;
      }

      if (n < 0 || r < 0) {
        setErrorMsg('Inputs must be non-negative.');
        return;
      }

      if (n < r) {
        setErrorMsg('n must be greater than or equal to r (n ≥ r).');
        return;
      }

      const result = type === 'nPr' ? nPr(n, r) : nCr(n, r);

      if (isNaN(result)) {
        setErrorMsg('Calculation error. Check inputs.');
      } else {
        setComputedResult(result);
      }
    } else if (type === 'STAT') {
      if (!statVal.trim()) {
        setErrorMsg('Please enter comma-separated numbers.');
        return;
      }

      const numList = statVal
        .split(',')
        .map((v) => parseFloat(v.trim()))
        .filter((v) => !isNaN(v));

      if (numList.length === 0) {
        setErrorMsg('No valid numbers entered.');
        return;
      }

      if (numList.length === 1) {
        setErrorMsg('Enter at least 2 numbers for statistics.');
        return;
      }

      const calculatedMean = mean(numList);
      const calculatedVar = variance(numList);
      const calculatedStd = stddev(numList);

      setStatResults({
        mean: calculatedMean,
        variance: calculatedVar,
        stddev: calculatedStd,
      });
    }
  };

  const handleInsert = (valueStr: string) => {
    triggerHaptic();
    onInsertValue(valueStr);
    onClose();
  };

  const renderModalContent = () => {
    if (type === 'nPr' || type === 'nCr') {
      const isP = type === 'nPr';
      return (
        <View style={styles.contentContainer}>
          <Text style={styles.modalTitle}>{isP ? 'Permutations (nPr)' : 'Combinations (nCr)'}</Text>
          <Text style={styles.modalSub}>{isP ? 'P(n, r) = n! / (n-r)!' : 'C(n, r) = n! / (r! * (n-r)!)'}</Text>
          
          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Enter n (total items):</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="number-pad"
                value={nVal}
                onChangeText={setNVal}
                placeholder="e.g. 5"
                placeholderTextColor={theme.colors.textMuted}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Enter r (chosen items):</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="number-pad"
                value={rVal}
                onChangeText={setRVal}
                placeholder="e.g. 3"
                placeholderTextColor={theme.colors.textMuted}
              />
            </View>
          </View>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          {computedResult !== null && (
            <View style={styles.resultBox}>
              <Text style={styles.resultLabel}>Calculated Value:</Text>
              <Text style={styles.resultValue}>{formatResult(computedResult)}</Text>
              <TouchableOpacity
                style={styles.insertBtn}
                onPress={() => handleInsert(formatResult(computedResult))}
              >
                <Text style={styles.insertBtnText}>Insert Value</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={handleCalculate}>
              <Text style={styles.confirmBtnText}>Calculate</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (type === 'STAT') {
      return (
        <View style={styles.contentContainer}>
          <Text style={styles.modalTitle}>Statistics (Mean / Var / StdDev)</Text>
          <Text style={styles.modalSub}>Enter numbers separated by commas</Text>
          
          <Text style={styles.label}>Numeric Dataset:</Text>
          <TextInput
            style={styles.textInputFull}
            keyboardType="numbers-and-punctuation"
            value={statVal}
            onChangeText={setStatVal}
            placeholder="e.g. 10, 15, 20.5, 30"
            placeholderTextColor={theme.colors.textMuted}
          />

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          {statResults && (
            <View style={styles.statResultsContainer}>
              <View style={styles.statRow}>
                <View>
                  <Text style={styles.statLabel}>Mean (μ)</Text>
                  <Text style={styles.statValue}>{formatResult(statResults.mean)}</Text>
                </View>
                <TouchableOpacity
                  style={styles.statInsertBtn}
                  onPress={() => handleInsert(formatResult(statResults.mean))}
                >
                  <Text style={styles.statInsertBtnText}>Insert</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.statRow}>
                <View>
                  <Text style={styles.statLabel}>Sample Variance (s²)</Text>
                  <Text style={styles.statValue}>{formatResult(statResults.variance)}</Text>
                </View>
                <TouchableOpacity
                  style={styles.statInsertBtn}
                  onPress={() => handleInsert(formatResult(statResults.variance))}
                >
                  <Text style={styles.statInsertBtnText}>Insert</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.statRow}>
                <View>
                  <Text style={styles.statLabel}>Standard Dev (s)</Text>
                  <Text style={styles.statValue}>{formatResult(statResults.stddev)}</Text>
                </View>
                <TouchableOpacity
                  style={styles.statInsertBtn}
                  onPress={() => handleInsert(formatResult(statResults.stddev))}
                >
                  <Text style={styles.statInsertBtnText}>Insert</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={handleCalculate}>
              <Text style={styles.confirmBtnText}>Calculate</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.card}>
          {renderModalContent()}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1.5,
    borderRadius: 16,
    width: '90%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 5.84,
    elevation: 5,
  },
  contentContainer: {
    width: '100%',
  },
  modalTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 20,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  modalSub: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: 16,
  },
  label: {
    fontFamily: theme.fonts.bold,
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  inputWrapper: {
    width: '48%',
  },
  textInput: {
    backgroundColor: theme.colors.displayBackground,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontFamily: theme.fonts.regular,
    fontSize: 16,
    color: theme.colors.text,
  },
  textInputFull: {
    backgroundColor: theme.colors.displayBackground,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontFamily: theme.fonts.regular,
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 12,
  },
  errorText: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: theme.colors.error,
    marginBottom: 12,
    textAlign: 'center',
  },
  resultBox: {
    backgroundColor: theme.colors.displayBackground,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  resultLabel: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: theme.colors.textMuted,
    marginBottom: 4,
  },
  resultValue: {
    fontFamily: theme.fonts.bold,
    fontSize: 24,
    color: theme.colors.text,
    marginBottom: 10,
  },
  insertBtn: {
    backgroundColor: theme.colors.accent,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  insertBtnText: {
    fontFamily: theme.fonts.bold,
    fontSize: 14,
    color: theme.colors.equalsText,
  },
  statResultsContainer: {
    backgroundColor: theme.colors.displayBackground,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.border,
  },
  statLabel: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  statValue: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: theme.colors.text,
  },
  statInsertBtn: {
    backgroundColor: theme.colors.accent,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  statInsertBtnText: {
    fontFamily: theme.fonts.bold,
    fontSize: 12,
    color: theme.colors.equalsText,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cancelBtn: {
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    width: '48%',
  },
  cancelBtnText: {
    fontFamily: theme.fonts.bold,
    fontSize: 15,
    color: theme.colors.textMuted,
  },
  confirmBtn: {
    backgroundColor: theme.colors.accent,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    width: '48%',
  },
  confirmBtnText: {
    fontFamily: theme.fonts.bold,
    fontSize: 15,
    color: theme.colors.equalsText,
  },
});
