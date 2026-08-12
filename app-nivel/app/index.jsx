import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LevelIndicator } from "../components/LevelIndicator";
import { useLevelSensor } from "../hooks/useLevelSensor";

const TOLERANCE_DEG = 2;

export default function HomeScreen() {
  const { tiltX, tiltY, tiltTotal, isLevel, available } =
    useLevelSensor(TOLERANCE_DEG);

  if (available === false) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Sensor indisponível</Text>
        <Text style={styles.subtitle}>
          Este dispositivo não possui acelerômetro ou o acesso a ele está
          bloqueado.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Nível</Text>
      <Text style={styles.subtitle}>
        Apoie o dispositivo sobre a superfície que deseja medir
      </Text>

      <View style={styles.indicatorWrapper}>
        <LevelIndicator tiltX={tiltX} tiltY={tiltY} isLevel={isLevel} />
      </View>

      <View style={styles.statusBox}>
        <Text style={[styles.statusText, isLevel && styles.statusTextOk]}>
          {isLevel ? "PLANO ✔" : "NÃO ESTÁ PLANO"}
        </Text>
        <Text style={styles.angleText}>
          Inclinação total: {tiltTotal.toFixed(1)}°
        </Text>
        <View style={styles.axisRow}>
          <Text style={styles.axisText}>X: {tiltX.toFixed(1)}°</Text>
          <Text style={styles.axisText}>Y: {tiltY.toFixed(1)}°</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    alignItems: "center",
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  subtitle: {
    fontSize: 14,
    color: "#94A3B8",
    marginTop: 6,
    textAlign: "center",
  },
  indicatorWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  statusBox: {
    alignItems: "center",
    paddingBottom: 32,
  },
  statusText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#F87171",
    letterSpacing: 1,
  },
  statusTextOk: {
    color: "#4ADE80",
  },
  angleText: {
    marginTop: 8,
    fontSize: 15,
    color: "#CBD5E1",
  },
  axisRow: {
    flexDirection: "row",
    gap: 24,
    marginTop: 4,
  },
  axisText: {
    fontSize: 13,
    color: "#64748B",
  },
});
