import { useEffect, useRef, useState } from "react";
import { Accelerometer } from "expo-sensors";

export type LevelReading = {
  /** Inclinação no eixo X (esquerda/direita), em graus */
  tiltX: number;
  /** Inclinação no eixo Y (frente/trás), em graus */
  tiltY: number;
  /** Módulo total de inclinação, em graus */
  tiltTotal: number;
  /** true se estiver dentro da tolerância definida como "plano" */
  isLevel: boolean;
};

const UPDATE_INTERVAL_MS = 60;
// Suavização exponencial para evitar tremulação da leitura
const SMOOTHING = 0.15;

/**
 * Hook que usa o acelerômetro do dispositivo para determinar se a
 * superfície onde o aparelho está apoiado está plana (nivelada).
 *
 * @param toleranceDeg ângulo máximo (em graus) para considerar "plano"
 */
export function useLevelSensor(toleranceDeg = 2) {
  const [reading, setReading] = useState<LevelReading>({
    tiltX: 0,
    tiltY: 0,
    tiltTotal: 0,
    isLevel: false,
  });
  const [available, setAvailable] = useState<boolean | null>(null);

  const smoothed = useRef({ x: 0, y: 0, z: 1 });

  useEffect(() => {
    let subscription: ReturnType<typeof Accelerometer.addListener> | null =
      null;

    Accelerometer.isAvailableAsync().then((isAvailable) => {
      setAvailable(isAvailable);
      if (!isAvailable) return;

      Accelerometer.setUpdateInterval(UPDATE_INTERVAL_MS);

      subscription = Accelerometer.addListener(({ x, y, z }) => {
        // Suaviza a leitura bruta do sensor
        smoothed.current.x += (x - smoothed.current.x) * SMOOTHING;
        smoothed.current.y += (y - smoothed.current.y) * SMOOTHING;
        smoothed.current.z += (z - smoothed.current.z) * SMOOTHING;

        const { x: sx, y: sy, z: sz } = smoothed.current;

        // Ângulo de inclinação em relação ao plano horizontal
        // (quando o aparelho está deitado sobre uma mesa, z ≈ ±1 e x,y ≈ 0)
        const tiltX = (Math.atan2(sx, Math.sqrt(sy * sy + sz * sz)) * 180) / Math.PI;
        const tiltY = (Math.atan2(sy, Math.sqrt(sx * sx + sz * sz)) * 180) / Math.PI;
        const tiltTotal = Math.sqrt(tiltX * tiltX + tiltY * tiltY);

        setReading({
          tiltX,
          tiltY,
          tiltTotal,
          isLevel: tiltTotal <= toleranceDeg,
        });
      });
    });

    return () => {
      subscription?.remove();
    };
  }, [toleranceDeg]);

  return { ...reading, available };
}
