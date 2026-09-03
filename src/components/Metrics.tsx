import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../theme/colors';
import type {GenerationMetrics} from '../modules/types';

interface MetricsProps {
  metrics: GenerationMetrics | null;
}

export function Metrics({metrics}: MetricsProps) {
  if (!metrics) {
    return null;
  }

  const tokensPerSecond = metrics.tokensPerSecond.toFixed(1);
  const elapsedSeconds = (metrics.elapsedMs / 1000).toFixed(1);

  return (
    <View style={styles.container}>
      <Text style={styles.item}>{tokensPerSecond} tok/s</Text>
      <Text style={styles.item}>{metrics.totalTokens} tokens</Text>
      <Text style={styles.item}>{elapsedSeconds}s</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  item: {
    color: colors.textMuted,
    fontSize: 12,
  },
});
