import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function BalanceModeSelectScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 밸런스 측정 방법 선택</Text>
      <Text style={styles.subtitle}>측정할 방식을 선택해 주세요</Text>

      <TouchableOpacity
        style={styles.sensorButton}
        onPress={() => navigation.navigate("BalanceIntro")}
      >
        <Text style={styles.buttonText}>핸드폰을 들고 측정</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cameraButton}
        onPress={() => navigation.navigate("CameraBalanceIntroScreen")}
      >
        <Text style={styles.buttonText}>핸드폰 내려놓고 카메라로 측정</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { fontSize: 16, marginBottom: 40, color: '#555' },
  sensorButton: {
    backgroundColor: '#14AE5C',
    padding: 16,
    borderRadius: 30,
    width: 260,
    marginBottom: 20,
  },
  cameraButton: {
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 30,
    width: 260,
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
});
