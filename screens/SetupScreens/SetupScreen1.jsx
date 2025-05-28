import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import BackButton from "../BackButton";
export default function SetupScreen1({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <View style={styles.innerContainer}>
        <Text style={styles.title}>
          당신의 프로필을{"\n"}입력해주세요
        </Text>

        <Text style={styles.subtitle}>
          간단한 정보를 바탕으로{"\n"}맞춤 운동을 추천해드릴게요
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Setup2")}
        >
          <Text style={styles.buttonText}>시작하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F3F6",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 60,
    
  },
  innerContainer: { 
    marginTop: 10,
    alignItems: "center", // ✅ 추가
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#232222",
    lineHeight: 34,
    textAlign: "center", // 텍스트 가운데 정렬
    
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    marginTop: 56,
    lineHeight: 22,
    textAlign: "center", // 텍스트 가운데 정렬  
  },
  buttonContainer: {
    marginBottom: 20,
    alignItems: "center", // 버튼을 가운데로 정렬
  },
  button: {
    backgroundColor: "#3182F6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    width: 200, // ✅ 원하는 너비로 제한 (또는 60%, 등 상대값도 가능)
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
