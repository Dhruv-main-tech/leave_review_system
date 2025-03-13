import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/Themed';

interface RadioButtonProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

export default function RadioButton({ label, selected, onSelect }: RadioButtonProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onSelect}>
      <View style={styles.radioOuter}>
        {selected && <View style={styles.radioInner} />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  radioOuter: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#2196F3',
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
  },
}); 