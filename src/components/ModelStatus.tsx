import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../theme/colors';
import type {LoadProgress, ModelPhase} from '../modules/types';

interface ModelStatusProps {
  phase: ModelPhase;
  progress: LoadProgress | null;
}

const labels: Record<ModelPhase, string> = {
  idle: 'Model not loaded',
  loading: 'Loading Llama 3.2 1B…',
  ready: 'Ready for offline chat',
  generating: 'Generating…',
  error: 'Model error',
};

export function ModelStatus({phase, progress}: ModelStatusProps) {
  const percent = progress ? Math.round(progress.percent * 100) : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{labels[phase]}</Text>
      {phase === 'loading' && progress ? (
        <View style={styles.track}>
          <View style={[styles.fill, {width: `${percent}%`}]} />
          <Text style={styles.percent}>{percent}%</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },
  track: {
    marginTop: 8,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surfaceElevated,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.accent,
  },
  percent: {
    position: 'absolute',
    right: 0,
    fontSize: 10,
    color: colors.textMuted,
  },
});
