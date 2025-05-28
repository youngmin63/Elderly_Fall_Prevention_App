import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import BackButton from "../BackButton"; // Assuming you have a BackButton component

export default function SetupScreen3({ navigation, route }) {
  const [age, setAge] = useState("");
  const gender = route.params?.gender || "";

  const handleNext = () => {
    if (age && !isNaN(age)) {
      navigation.navigate("Setup4", { gender, age: Number(age) });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.title}>나이를 입력해주세요</Text>

        <TextInput
          style={styles.input}
          placeholder="예: 65"
          placeholderTextColor="#aaa"
          keyboardType="number-pad"
          value={age}
          onChangeText={setAge}
          maxLength={3}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.nextButton, !age && styles.disabledButton]}
            onPress={handleNext}
            disabled={!age || isNaN(age)}
          >
            <Text style={styles.nextButtonText}>다음</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F3F6",
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#232222",
    lineHeight: 32,
    marginBottom: 30,
    textAlign: "center", // Center align the title
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  buttonContainer: {
    marginTop: 40,
  },
  nextButton: {
    backgroundColor: "#3182F6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#AFCBFA",
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
