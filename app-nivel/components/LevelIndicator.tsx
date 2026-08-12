import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, useWindowDimensions } from "react-native";

type Props = {
  tiltX: number;
  tiltY: number;
  isLevel: boolean;
};

const RING_SIZE = 260;
const BUBBLE_SIZE = 56;
// Quantos graus de inclinação levam a bolha até a borda do anel
const MAX_TILT_FOR_EDGE = 25;

export function LevelIndicator({ tiltX, tiltY, isLevel }: Props) {
  const bubbleX = useRef(new Animated.Value(0)).current;
  const bubbleY = useRef(new Animated.Value(0)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;

  const { width } = useWindowDimensions();
  const ringSize = Math.min(RING_SIZE, width * 0.75);
  const maxOffset = (ringSize - BUBBLE_SIZE) / 2;

  useEffect(() => {
    const clampedX = Math.max(-MAX_TILT_FOR_EDGE, Math.min(MAX_TILT_FOR_EDGE, tiltX));
    const clampedY = Math.max(-MAX_TILT_FOR_EDGE, Math.min(MAX_TILT_FOR_EDGE, tiltY));

    Animated.spring(bubbleX, {
      toValue: (clampedX / MAX_TILT_FOR_EDGE) * maxOffset,
      useNativeDriver: true,
      speed: 18,
      bounciness: 6,
    }).start();

    Animated.spring(bubbleY, {
      toValue: (clampedY / MAX_TILT_FOR_EDGE) * maxOffset,
      useNativeDriver: true,
      speed: 18,
      bounciness: 6,
    }).start();
  }, [tiltX, tiltY, maxOffset]);

  useEffect(() => {
    Animated.timing(colorAnim, {
      toValue: isLevel ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isLevel]);

  const bubbleColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#F87171", "#4ADE80"],
  });

  const ringColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#334155", "#22C55E"],
  });

  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={[
          styles.ring,
          {
            width: ringSize,
            height: ringSize,
            borderRadius: ringSize / 2,
            borderColor: ringColor,
          },
        ]}
      >
        <View style={styles.crosshairH} />
        <View style={styles.crosshairV} />
        <View
          style={[
            styles.targetCircle,
            { width: ringSize * 0.28, height: ringSize * 0.28, borderRadius: (ringSize * 0.28) / 2 },
          ]}
        />

        <Animated.View
          style={[
            styles.bubble,
            {
              backgroundColor: bubbleColor,
              transform: [{ translateX: bubbleX }, { translateY: bubbleY }],
            },
          ]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0F172A",
  },
  crosshairH: {
    position: "absolute",
    width: "70%",
    height: 1,
    backgroundColor: "#334155",
  },
  crosshairV: {
    position: "absolute",
    width: 1,
    height: "70%",
    backgroundColor: "#334155",
  },
  targetCircle: {
    position: "absolute",
    borderWidth: 1,
    borderColor: "#475569",
  },
  bubble: {
    position: "absolute",
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
});
