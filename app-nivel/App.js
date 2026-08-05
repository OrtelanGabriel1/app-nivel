import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react me-native';
import { Accelerometer } from 'expo-sensors';

const { width } = Dimensions.get('window');
const CONTAINER_SIZE = width * 0.8;
const BUBBLE_SIZE = 50;
const RADIUS = (CONTAINER_SIZE - BUBBLE_SIZE) / 2;

// Limite para considerar nivelado (quanto menor, mais preciso)
const TOLERANCE = 0.05; 

export default function App() {
  const [{ x, y }, setData] = useState({ x: 0, y: 0 });
  const [subscription, setSubscription] = useState(null);

  const _subscribe = () => {
    // Configura a velocidade de atualização (60 FPS aprox.)
    Accelerometer.setUpdateInterval(16);
    setSubscription(
      Accelerometer.addListener((accelerometerData) => {
        setData(accelerometerData);
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  // Normaliza o movimento da bolha dentro do círculo central
  // Invertemos o X para acompanhar o movimento natural da bolha de ar
  const maxDistance = RADIUS;
  const bubbleX = Math.max(-maxDistance, Math.min(maxDistance, -x * maxDistance * 2));
  const bubbleY = Math.max(-maxDistance, Math.min(maxDistance, y * maxDistance * 2));

  // Verifica se está dentro da tolerância de nivelamento
  const isLeveled = Math.abs(x) < TOLERANCE && Math.abs(y) < TOLERANCE;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nível Digital</Text>
      
      {/* Alvo / Base do Nível */}
      <View style={[styles.targetContainer, { borderColor: isLeveled ? '#4CAF50' : '#E53935' }]}>
        {/* Marcador Central (Zona Ideal) */}
        <View style={styles.centerZone} />
        
        {/* Bolha */}
        <View
          style={[
            styles.bubble,
            {
              backgroundColor: isLeveled ? '#4CAF50' : '#E53935',
              transform: [
                { translateX: bubbleX },
                { translateY: bubbleY }
              ],
            },
          ]}
        />
      </View>

      <Text style={[styles.statusText, { color: isLeveled ? '#4CAF50' : '#E53935' }]}>
        {isLeveled ? 'NIVELADO' : 'INCLINADO'}
      </Text>

      <View style={styles.dataContainer}>
        <Text style={styles.dataText}>Eixo X: {x.toFixed(2)}</Text>
        <Text style={styles.dataText}>Eixo Y: {y.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 40,
  },
  targetContainer: {
    width: CONTAINER_SIZE,
    height: CONTAINER_SIZE,
    borderRadius: CONTAINER_SIZE / 2,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#2A2A2A',
  },
  centerZone: {
    position: 'absolute',
    width: BUBBLE_SIZE + 10,
    height: BUBBLE_SIZE + 10,
    borderRadius: (BUBBLE_SIZE + 10) / 2,
    borderWidth: 2,
    borderColor: '#666',
    borderStyle: 'dashed',
  },
  bubble: {
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    position: 'absolute',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statusText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 30,
  },
  dataContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  dataText: {
    color: '#AAA',
    fontSize: 14,
  },
});