import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View, StyleSheet } from 'react-native';

const Dot: React.FC<{ delay: number }> = ({ delay }) => {
  const scale = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1, duration: 350, delay, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.3, duration: 350, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [scale, delay]);
  return <Animated.View style={[styles.dot, { transform: [{ scale }] }]} />;
};

export const TypingIndicator: React.FC = () => (
  <View style={styles.container}>
    <Dot delay={0} />
    <Dot delay={150} />
    <Dot delay={300} />
  </View>
);

const styles = StyleSheet.create({
  container: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, marginHorizontal: 3, backgroundColor: '#9CA3AF' }
});
