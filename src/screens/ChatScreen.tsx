import React, {useCallback, useEffect, useRef} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {colors} from '../theme/colors';
import {useLLM} from '../hooks/useLLM';
import type {Message} from '../modules/types';
import {Composer} from '../components/Composer';
import {MessageBubble} from '../components/MessageBubble';
import {Metrics} from '../components/Metrics';
import {ModelStatus} from '../components/ModelStatus';

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ChatScreen() {
  const {phase, progress, metrics, streamingText, error, load, send, stop} =
    useLLM();

  const [messages, setMessages] = React.useState<Message[]>([]);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({animated: true});
  }, [messages, streamingText]);

  const prevPhase = useRef(phase);
  useEffect(() => {
    if (
      prevPhase.current === 'generating' &&
      (phase === 'ready' || phase === 'error')
    ) {
      setMessages(prev => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last && last.role === 'assistant') {
          next[next.length - 1] = {...last, content: streamingText};
        }
        return next;
      });
    }
    prevPhase.current = phase;
  }, [phase, streamingText]);

  const handleSend = useCallback(
    (text: string) => {
      setMessages(prev => [
        ...prev,
        {id: createId(), role: 'user', content: text},
        {id: createId(), role: 'assistant', content: ''},
      ]);
      send(text);
    },
    [send],
  );

  const lastMessage = messages[messages.length - 1];

  return (
    <View style={styles.container}>
      <ModelStatus phase={phase} progress={progress} />
      <Metrics metrics={metrics} />
      <ScrollView
        ref={scrollRef}
        style={styles.list}
        contentContainerStyle={styles.listContent}>
        {messages.map(message => {
          const isStreaming =
            message.id === lastMessage?.id &&
            message.role === 'assistant' &&
            phase === 'generating';
          return (
            <MessageBubble
              key={message.id}
              message={{
                ...message,
                content: isStreaming ? streamingText : message.content,
              }}
              streaming={isStreaming}
            />
          );
        })}
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
      </ScrollView>
      <Composer
        disabled={phase === 'generating'}
        onSend={handleSend}
        onStop={stop}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  errorBox: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.accentSoft,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
  },
});
