import React, {useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {colors} from '../theme/colors';

interface ComposerProps {
  disabled: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
}

export function Composer({disabled, onSend, onStop}: ComposerProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }
    onSend(trimmed);
    setText('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Ask anything, fully offline…"
        placeholderTextColor={colors.textMuted}
        multiline
        editable={!disabled}
      />
      <Pressable
        style={styles.button}
        onPress={disabled ? onStop : handleSend}
        disabled={!disabled && !text.trim()}>
        {disabled ? (
          <ActivityIndicator size="small" color={colors.text} />
        ) : (
          <Text style={styles.buttonText}>Send</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    padding: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.surfaceElevated,
    color: colors.text,
    fontSize: 15,
  },
  button: {
    minWidth: 56,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: colors.accent,
  },
  buttonText: {
    color: colors.text,
    fontWeight: '600',
  },
});
