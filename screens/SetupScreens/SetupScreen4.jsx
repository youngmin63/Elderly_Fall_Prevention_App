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

export default function SetupScreen4({ navigation, route }) {
  const [weight, setWeight] = useState("");
  const { gender, age } = route.params;

  const handleNext = () => {
    if (weight && !isNaN(weight)) {
      navigation.navigate("Setup5", { gender, age, weight: Number(weight) });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.title}>몸무게를 입력해주세요</Text>

        <TextInput
          style={styles.input}
          placeholder="예: 70"
          placeholderTextColor="#aaa"
          keyboardType="number-pad"
          value={weight}
          onChangeText={setWeight}
          maxLength={3}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.nextButton, !weight && styles.disabledButton]}
            onPress={handleNext}
            disabled={!weight || isNaN(weight)}
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
    textAlign: "center",
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
