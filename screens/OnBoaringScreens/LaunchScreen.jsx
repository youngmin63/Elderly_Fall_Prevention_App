import React, { useEffect } from "react";
import { SafeAreaView, View, ScrollView, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function LaunchScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Onboarding2");
    }, 2000); // 2초 후 이동

    return () => clearTimeout(timer); // 언마운트 시 클린업
  }, []);


  useEffect(() => {
    const clearExpiredToken = async () => {
      const token = await AsyncStorage.getItem("usertoken");
      // 원하면 JWT decode 해서 만료 검사도 가능
      if (token) {
        await AsyncStorage.removeItem("usertoken"); // 앱 재시작 시 항상 초기화
      }
    };
    clearExpiredToken();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.view}>
          <Text style={styles.text}>{"\n균형\n\n마당"}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
  },
  text: {
    color: "#212020",
    fontSize: 40,
    fontWeight: "bold",
  },
  view: {
    alignItems: "center",
    marginTop: 300,
    marginBottom: 359,
  },
});
