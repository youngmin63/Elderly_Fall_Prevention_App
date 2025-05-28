// App.js (다국어 통합 버전 + 매뉴얼 스크린 추가 + 영어 버전 매뉴얼)
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import axios from "axios";
import { Video } from "expo-av";
import { Accelerometer, Gyroscope } from "expo-sensors";
import * as Speech from "expo-speech";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
const Stack = createNativeStackNavigator();

function SetupScreen({ navigation }) {
  const [gender, setGender] = useState(null);
  const [age, setAge] = useState("");
  const [language, setLanguage] = useState(null);

  const handleStart = async () => {
    if (!gender || !age || !language) {
      Alert.alert("모든 정보를 입력해주세요.");
      return;
    }
    await AsyncStorage.setItem("gender", gender);
    await AsyncStorage.setItem("age", age);
    await AsyncStorage.setItem("language", language);
    navigation.navigate("BalanceIntro", { language });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>간단한 정보를 입력해주세요</Text>

      <Text style={styles.label}>언어 선택 / Language</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.genderButton,
            language === "korean" && styles.selected,
          ]}
          onPress={() => setLanguage("korean")}
        >
          <Text style={styles.buttonText}>한국어</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.genderButton,
            language === "english" && styles.selected,
          ]}
          onPress={() => setLanguage("english")}
        >
          <Text style={styles.buttonText}>English</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>성별</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.genderButton, gender === "male" && styles.selected]}
          onPress={() => setGender("male")}
        >
          <Text style={styles.buttonText}>남성</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.genderButton, gender === "female" && styles.selected]}
          onPress={() => setGender("female")}
        >
          <Text style={styles.buttonText}>여성</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>나이</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={age}
        onChangeText={setAge}
        placeholder="예: 25"
      />

      <TouchableOpacity style={styles.startButton} onPress={handleStart}>
        <Text style={styles.startText}>시작하기 / Start</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function BalanceIntroScreen({ route, navigation }) {
  const { language } = route.params;
  const isKR = language === "korean";
  const texts = isKR
    ? {
        title: "📋 측정 전 안내",
        line1: "- 총 20초 동안 눈을 감고 한 발로 균형을 유지합니다.",
        line2: "- 자이로센서와 가속도센서로 몸의 흔들림 정도를 계산합니다.",
        line3: "- 측정 중에는 반드시 눈을 감고 자세를 유지해 주세요.",
        next: "이해했어요",
      }
    : {
        title: "📋 Before You Start",
        line1:
          "- Maintain balance on one foot for 20 seconds with eyes closed.",
        line2: "- Gyroscope and accelerometer will measure your body sway.",
        line3:
          "- Please keep your eyes closed and hold still during measurement.",
        next: "Next",
      };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{texts.title}</Text>
      <View style={{ marginVertical: 24 }}>
        <Text style={styles.instructionText}>{texts.line1}</Text>
        <Text style={styles.instructionText}>{texts.line2}</Text>
        <Text style={styles.instructionText}>{texts.line3}</Text>
      </View>
      <TouchableOpacity
        style={styles.startButton}
        onPress={() =>
          navigation.navigate("BalanceManual", { language, foot: "left" })
        }
      >
        <Text style={styles.startText}>{texts.next}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function BalanceManualScreen({ route, navigation }) {
  const { language, foot } = route.params;
  const handleNext = () =>
    navigation.navigate("BalanceTest2", { language, foot });

  const isKR = language === "korean";
  const isLeft = foot === "left";

  const texts = isKR
    ? {
        guide1: "📱 휴대폰 → ",
        ear: "오른쪽 귀",
        foot: isLeft
          ? "왼쪽 무릎 안쪽\n👁️ 눈을 감고 자세를 유지해 주세요."
          : "오른쪽 무릎 안쪽\n👁️ 눈을 감고 자세를 유지해 주세요.",
        caution: "절대로 핸드폰을 귀에서 떼지 마세요.",
        sound: "소리를 켜 주세요.",
        manualTitle: "📘 측정 안내",
        instruction1: isLeft
          ? "- 왼발로 20초간 균형을 유지합니다."
          : "- 오른발로 20초간 균형을 유지합니다.",
        instruction2: "- 자이로센서와 가속도센서가 몸의 흔들림을 측정합니다.",
        instruction3: "- 눈을 감고 자세를 유지해 주세요.",
        exitHint:
          "- 측정 중 발이 땅에 닿는순간 ,\n  핸드폰을 귀에서 떼고 화면을 두 번 터치해 주세요.\n  그러면 측정이 종료됩니다.",
        next: "이해했어요",
      }
    : {
        guide1: "📱 Phone → ",
        ear: "Right ear",
        foot: isLeft
          ? "Inner side of left knee\n👁️ Keep your eyes closed during the test."
          : "Inner side of right knee\n👁️ Keep your eyes closed during the test.",
        caution: "Do not remove the phone from your ear during measurement.",
        sound: "Please make sure sound is on.",
        manualTitle: "📘 How it works",
        instruction1: isLeft
          ? "- Maintain balance on your left foot for 20 seconds."
          : "- Maintain balance on your right foot for 20 seconds.",
        instruction2: "- Gyroscope and accelerometer measure your body’s sway.",
        instruction3:
          "- Keep your eyes closed and maintain posture during the test.",
        exitHint:
          "- Once you lost your balance and the foot touched the ground \n  remove the phone from your ear and double tap the screen.\n  This will end the test.",
        next: "Got it!",
      };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Video
          source={require("./assets/videos/balance-guide-fixed.mp4")}
          style={{ width: "100%", height: 320 }}
          resizeMode="contain"
          shouldPlay
          isLooping
        />

        <View
          style={{ paddingHorizontal: 24, marginTop: 32, alignItems: "center" }}
        >
          <Text
            style={{
              fontSize: 18,
              textAlign: "center",
              color: "#232222",
              lineHeight: 28,
              marginBottom: 28,
            }}
          >
            {texts.guide1}
            <Text style={{ fontWeight: "bold" }}>{texts.ear}</Text>
            {"\n"}
            🦶{" "}
            {isKR
              ? isLeft
                ? "오른발 → "
                : "왼발 → "
              : isLeft
              ? "Left foot → "
              : "Right foot → "}
            <Text style={{ fontWeight: "bold" }}>{texts.foot}</Text>
            {"\n\n"}
            {isKR ? "측정 중에는 " : "During measurement, "}
            <Text style={{ fontWeight: "bold" }}>{texts.caution}</Text>
            {"\n\n"}
            🔊 {isKR ? "무음 모드일 경우 " : "If silent mode is on, "}
            <Text style={{ fontWeight: "bold" }}>{texts.sound}</Text>
          </Text>

          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#14AE5C",
              marginBottom: 10,
            }}
          >
            {texts.manualTitle}
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: "#444",
              lineHeight: 26,
              textAlign: "left",
              alignSelf: "stretch",
              marginBottom: 12,
            }}
          >
            {texts.instruction1}
            {"\n"}
            {texts.instruction2}
            {"\n"}
            {texts.instruction3}
          </Text>

          <Text
            style={{
              fontSize: 15,
              color: "#777",
              lineHeight: 24,
              fontStyle: "italic",
              textAlign: "left",
              alignSelf: "stretch",
              marginBottom: 36,
            }}
          >
            {texts.exitHint}
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: "#14AE5C",
              paddingVertical: 16,
              paddingHorizontal: 40,
              borderRadius: 30,
            }}
            onPress={handleNext}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
              {texts.next}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ThankYouScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>
        ✅ Measurement complete!{"\n"}Thank you for participating 🙏
      </Text>
    </SafeAreaView>
  );
}

function BalanceTestScreen2({ route, navigation }) {
  const lang = route.params?.language || "korean";
  const foot = route.params?.foot || "left";

  const texts = {
    korean: {
      speak1:
        foot === "left"
          ? "눈을 감고 왼발로 서 주세요. 왼쪽 무릎에 오른 발을 대 주세요"
          : "눈을 감고 오른발로 서 주세요. 오른쪽 무릎에 왼 발을 대 주세요",
      speak2: "3초 후 측정을 시작합니다. 자세를 유지해주세요",
      guide1: "📱 휴대폰을 귀에 댄 후",
      guide2: "화면을 두 번 터치해주세요",
      timerLabel: "측정 중",
      done: "측정 종료",
      audio: "🎧 소리가 나오는 중입니다...",
      notice: "※ 소리가 들리지 않는다면 음량과 무음 모드를 확인해주세요.",
    },
    english: {
      speak1:
        foot === "left"
          ? "Please stand on your left foot and place the other foot against your knee."
          : "Please stand on your right foot and place the other foot against your knee.",
      speak2: "We will begin in 3 seconds. Please stay still.",
      guide1: "📱 Hold phone to your ear",
      guide2: "Double tap the screen",
      timerLabel: "Measuring",
      done: "Measurement complete.",
      audio: "🎧 Audio is playing...",
      notice: "※ Please ensure your volume is up and not in silent mode.",
    },
  }[lang];

  const [isMeasuring, setIsMeasuring] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(0);
  const gyroData = useRef([]);
  const accelData = useRef([]);
  const gyroRef = useRef(null);
  const accelRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const lastTap = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const intervalRef = useRef(null); // ✅ 타이머 ID를 전역에서 저장

  const speak = (text, onDone) => {
    const isAndroid = Platform.OS === "android";
    const rate = isAndroid ? 1.5 : 0.5;
    const pitch = isAndroid ? 1.0 : 1.2;

    setIsSpeaking(true);
    Speech.speak(text, {
      rate,
      pitch,
      language: lang === "korean" ? "ko-KR" : "en-US",
      onDone: () => {
        setIsSpeaking(false);
        if (onDone) onDone();
      },
    });
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    if (lastTap.current && now - lastTap.current < 200) {
      if (isMeasuring) {
        stopMeasurement(); // ✅ 측정 중이면 측정 종료
      } else {
        handleStart(); // ✅ 측정 전이면 시작
      }
    }
    lastTap.current = now;
  };

  const handleStart = () => {
    if (isMeasuring || isSpeaking) return;
    Speech.stop();
    speak(texts.speak1, () => {
      speak(texts.speak2, () => {
        setTimeout(
          () =>
            speak("3...", () => {
              setTimeout(
                () =>
                  speak("2...", () => {
                    setTimeout(
                      () =>
                        speak("1...", () => {
                          setTimeout(
                            () =>
                              speak(
                                lang === "korean" ? "시작!" : "Start!",
                                () => startMeasurement()
                              ),
                            700
                          );
                        }),
                      700
                    );
                  }),
                700
              );
            }),
          700
        );
      });
    });
  };

  const startMeasurement = () => {
    setIsMeasuring(true);
    timerRef.current = 0;
    setTimer(0);
    gyroData.current = [];
    accelData.current = [];

    Gyroscope.setUpdateInterval(50);
    Accelerometer.setUpdateInterval(50);
    gyroRef.current = Gyroscope.addListener((d) => gyroData.current.push(d));
    accelRef.current = Accelerometer.addListener((d) =>
      accelData.current.push(d)
    );

    intervalRef.current = setInterval(() => {
      timerRef.current += 1;
      setTimer(timerRef.current);

      Speech.speak(`${timerRef.current}`, {
        rate: Platform.OS === "android" ? 1.2 : 0.6,
        pitch: 1.0,
        language: lang === "korean" ? "ko-KR" : "en-US",
      });

      if (timerRef.current >= 20) stopMeasurement(); // ✅ 매개변수 제거
    }, 1000);
  };

  const calculateBalanceScore = (gyroRecords, accelRecords) => {
    // 사용자 기준 Z축 = 좌우 흔들림 강조
    const gyroInstability =
      gyroRecords.reduce(
        (s, { x, y, z }) => s + Math.abs(x) + Math.abs(y) + 1.5 * Math.abs(z),
        0
      ) / gyroRecords.length;

    const accelInstability =
      accelRecords.reduce(
        (s, { x, y, z }) => s + Math.abs(Math.sqrt(x * x + y * y + z * z) - 1),
        0
      ) / accelRecords.length;
    const rawScore = 100 - (gyroInstability * 10 + accelInstability * 50);
    return Math.max(0, Math.min(100, Math.round(rawScore)));
  };

  const stopMeasurement = async () => {
    Speech.stop(); // ✅ 재생 중인 음성 중단
    clearInterval(intervalRef.current);
    gyroRef.current?.remove();
    accelRef.current?.remove();
    setIsMeasuring(false);

    const duration = timerRef.current;
    const rawScore = calculateBalanceScore(gyroData.current, accelData.current);
    const adjustedScore = Math.round(rawScore * Math.min(duration / 20, 1));
    speak(texts.done);

    const getLocalISODate = () => {
      const tzoffset = new Date().getTimezoneOffset() * 60000;
      return new Date(Date.now() - tzoffset).toISOString().slice(0, -1);
    };

    try {
      const gender = await AsyncStorage.getItem("gender");
      const age = await AsyncStorage.getItem("age");
      await axios.post(
        "https://fc29-34-70-17-142.ngrok-free.app/api/balance/raw",
        {
          date: getLocalISODate(),
          balanceScore: adjustedScore,
          duration,
          gender,
          age,
          foot,
          gyro: gyroData.current.map(({ x, y, z }) => ({ x, y, z })),
          accel: accelData.current.map(({ x, y, z }) => ({ x, y, z })),
        }
      );
    } catch (e) {
      console.log("Failed to save:", e);
    }

    if (foot === "left") {
      Alert.alert("왼발 측정 완료", "이제 오른발을 측정합니다.");
      navigation.navigate("BalanceManual", { language: lang, foot: "right" });
    } else {
      navigation.navigate("ThankYou");
    }
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => {
      Speech.stop(); // ✅ 음성 안내 강제 종료
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={handleDoubleTap}>
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          {isMeasuring ? (
            <View style={styles.measureContainer}>
              <Text style={styles.timerLabel}>{texts.timerLabel}</Text>
              <Text style={styles.timer}>{timer} sec</Text>
            </View>
          ) : (
            <Animated.View style={[styles.guideCircle, { opacity: fadeAnim }]}>
              <Text style={styles.guideText}>{texts.guide1}</Text>
              <Text style={styles.guideTextBold}>{texts.guide2}</Text>
            </Animated.View>
          )}
          {isSpeaking && (
            <Text style={styles.speakingNotice}>{texts.audio}</Text>
          )}
        </View>
        <Text style={styles.soundNotice}>{texts.notice}</Text>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Setup">
        <Stack.Screen
          name="Setup"
          component={SetupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BalanceIntro"
          component={BalanceIntroScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BalanceManual"
          component={BalanceManualScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BalanceTest2"
          component={BalanceTestScreen2}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ThankYou"
          component={ThankYouScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", padding: 24 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  guideCircle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "#E6F4EA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  guideText: { fontSize: 16, color: "#333" },
  guideTextBold: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#14AE5C",
    marginTop: 6,
  },
  timerLabel: { fontSize: 18, color: "#888", marginBottom: 8 },
  timer: { fontSize: 56, fontWeight: "bold", color: "#14AE5C" },
  measureContainer: { alignItems: "center" },
  soundNotice: {
    marginTop: 20,
    fontSize: 13,
    color: "#888",
    textAlign: "center",
  },
  speakingNotice: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },
  label: { fontSize: 16, color: "#555", marginBottom: 8 },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  genderButton: {
    backgroundColor: "#ddd",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  selected: { backgroundColor: "#14AE5C" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 32,
  },
  startButton: {
    backgroundColor: "#14AE5C",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  startText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  text: {
    fontSize: 18,
    textAlign: "center",
    paddingHorizontal: 20,
    color: "#333",
  },

  instructionText: {
    fontSize: 16,
    color: "#444",
    lineHeight: 28,
    marginBottom: 12,
    textAlign: "left",
  },
});
