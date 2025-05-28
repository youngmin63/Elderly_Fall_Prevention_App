import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function CameraBalanceIntroScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📸 전면 카메라 균형 측정</Text>
      <Text style={styles.subtitle}>다음 안내에 따라 준비해 주세요:</Text>

      <View style={styles.guideBox}>
        <Text style={styles.bullet}>✅ 스마트폰을 책상에 고정해 주세요</Text>
        <Text style={styles.bullet}>✅ 화면 속 전신이 잘 보이도록 거리를 조절하세요</Text>
        <Text style={styles.bullet}>✅ 자세를 바르게 한 후, 시작을 눌러 주세요</Text>
      </View>

      <Image
        source={require('../../assets/balance_camera_pose.png')}
        style={styles.image}
        resizeMode="contain"
      />

      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate('CameraBalanceMeasureScreen')}
      >
        <Text style={styles.startButtonText}>측정 시작</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { fontSize: 16, marginBottom: 20 },
  guideBox: { width: '100%', padding: 16, backgroundColor: '#f0f0f0', borderRadius: 12 },
  bullet: { fontSize: 16, marginVertical: 4 },
  image: { width: '100%', height: 240, marginVertical: 24 },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  startButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
