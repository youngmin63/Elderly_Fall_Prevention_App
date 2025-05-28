import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import BackButton from "../BackButton"; // Assuming you have a BackButton component

export default function ForgotPwScreen({ navigation }) {
  const [email, setEmail] = useState("");

  const handleSend = () => {
    if (!email.includes("@")) {
      Alert.alert("이메일 오류", "올바른 이메일 주소를 입력해주세요.");
      return;
    }
    Alert.alert("전송 완료", "비밀번호 재설정 링크를 이메일로 보내드렸습니다.");
    setEmail("");
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
         <Text style={styles.screenTitle}>비밀번호 찾기</Text>
      </View>

      <View style={styles.innerContainer}>
        <Text style={styles.title}>비밀번호를 잊으셨나요?</Text>
        <Text style={styles.description}>
          입력하신 이메일 주소로{"\n"}재설정 링크를 보내드립니다.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="이메일 주소"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TouchableOpacity
          style={[styles.sendButton, !email && styles.disabledButton]}
          onPress={handleSend}
          disabled={!email}
        >
          <Text style={styles.sendButtonText}>전송하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F3F6",
    paddingHorizontal: 24,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    marginBottom: 40,
    paddingHorizontal: 24, // ✅ 추가
  },
  backText: {
    fontSize: 18,
    color: "#232222",
    marginRight: 12,
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#232222",
  },
  innerContainer: {
    flex: 1,
   
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#232222",
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
    marginBottom: 32,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 24,
    width: "85%", // ✅ 추가
  },
  sendButton: {
    backgroundColor: "#3182F6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    width: "85%", // ✅ 추가
  },
  disabledButton: {
    backgroundColor: "#AFCBFA",
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
