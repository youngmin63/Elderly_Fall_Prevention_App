import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

// 📌 새로 추가: 하단 탭 네비게이터 컴포넌트
import MainTabs from "./components/Maintabs.jsx";

// 📌 기존 온보딩/로그인 관련 스크린
import LaunchScreen from "./screens/OnBoaringScreens/LaunchScreen.jsx";
import OnboardingScreen2 from "./screens/OnBoaringScreens/OnBoarding2.jsx";
import OnboardingScreen3 from "./screens/OnBoaringScreens/OnBoarding3.jsx";
import OnboardingScreen4 from "./screens/OnBoaringScreens/OnBoarding4.jsx";
import forgotPwScreen from "./screens/SingupScreens/ForgotPwScreen.jsx";
import LoginScreen from "./screens/SingupScreens/LoginScreen.jsx";
import SignupScreen from "./screens/SingupScreens/SignupScreen.jsx";

// 📌 세팅 화면
import SetupScreen1 from "./screens/SetupScreens/SetupScreen1.jsx";
import SetupScreen2 from "./screens/SetupScreens/SetupScreen2.jsx";
import SetupScreen3 from "./screens/SetupScreens/SetupScreen3.jsx";
import SetupScreen4 from "./screens/SetupScreens/SetupScreen4.jsx";
import SetupScreen5 from "./screens/SetupScreens/SetupScreen5.jsx";
import SetupScreen6 from "./screens/SetupScreens/SetupScreen6.jsx";
import SetupScreen7 from "./screens/SetupScreens/SetupScreen7.jsx";

// 📌 밸런스, 분석, 커뮤니티, 프로필 내부 서브 스크린들
import TotalRecordScreen from "./screens/AnalyzeScreens/TotalRecordScreen.jsx";
import ArticleScreen from "./screens/BalanceScreens/ArticleScreen.jsx";
import BalanceIntroScreen from "./screens/BalanceScreens/BalanceIntroScreen.jsx";
import BalanceManualScreen from "./screens/BalanceScreens/BalanceManualcreen.jsx";
import BalanceModeSelectScreen from "./screens/BalanceScreens/BalanceModeSelectScreen.jsx";
import BalanceResultScreen from "./screens/BalanceScreens/BalanceResultScreen.jsx";
import BalanceTestScreen2 from "./screens/BalanceScreens/BalanceTestScreen2.jsx";
import CameraBalanceIntroScreen from "./screens/BalanceScreens/CameraBalanceIntroScreen.jsx";
import CameraBalanceMeasureScreen from "./screens/BalanceScreens/CameraBalanceMeasureScreen.jsx";
import ExerciseDetailScreen from "./screens/BalanceScreens/ExerciseDetailScreen.jsx";
import ExerciseRecommendationResultScreen from "./screens/BalanceScreens/ExerciseRecommendationResultScreen.jsx";
import ExerciseRecommendScreen from "./screens/BalanceScreens/ExerciseRecommendScreen.jsx";
import ExerciseSummaryScreen from "./screens/BalanceScreens/ExerciseSummaryScreen.jsx";

import FriendAddScreen from "./screens/CommunityScreens/FriendAddScreen.jsx";
import BalanceHistoryScreen from "./screens/ProfileScreens/BalanceHistoryScreen.jsx";
import FriendRequestsScreen from "./screens/ProfileScreens/FriendRequestsScreen.jsx";
import FriendsScreen from "./screens/ProfileScreens/FriendsScreen.jsx";
import MyInfoScreen from "./screens/ProfileScreens/MyInfoScreen.jsx";
import SettingScreen from "./screens/ProfileScreens/SettingScreen.jsx";
import WorkoutHistoryScreen from "./screens/ProfileScreens/WorkoutHistoryScreen.jsx";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* ✅ 온보딩/로그인 관련 화면 */}
        <Stack.Screen name="Launch" component={LaunchScreen} />
        <Stack.Screen name="Onboarding2" component={OnboardingScreen2} />
        <Stack.Screen name="Onboarding3" component={OnboardingScreen3} />
        <Stack.Screen name="Onboarding4" component={OnboardingScreen4} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ForgotPw" component={forgotPwScreen} />

        {/* ✅ 사용자 설정 화면 */}
        <Stack.Screen name="Setup1" component={SetupScreen1} />
        <Stack.Screen name="Setup2" component={SetupScreen2} />
        <Stack.Screen name="Setup3" component={SetupScreen3} />
        <Stack.Screen name="Setup4" component={SetupScreen4} />
        <Stack.Screen name="Setup5" component={SetupScreen5} />
        <Stack.Screen name="Setup6" component={SetupScreen6} />
        <Stack.Screen name="Setup7" component={SetupScreen7} />

        {/* ✅ 메인 탭바가 포함된 화면 */}
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{
            gestureEnabled: false, // ✅ 제스처 끄기
          }}
        />

        {/* ✅ 밸런스, 분석, 커뮤니티 하위 화면들 */}

        <Stack.Screen name="TotalRecord" component={TotalRecordScreen} />
        <Stack.Screen name="Article" component={ArticleScreen} />
        <Stack.Screen name="BalanceTest2" component={BalanceTestScreen2} />
        <Stack.Screen name="BalanceResult" component={BalanceResultScreen} />
        <Stack.Screen name="BalanceManual" component={BalanceManualScreen} />
        <Stack.Screen
          name="BalanceModeSelectScreen"
          component={BalanceModeSelectScreen}
        />
        <Stack.Screen name="BalanceIntro" component={BalanceIntroScreen} />
        <Stack.Screen
          name="CameraBalanceIntroScreen"
          component={CameraBalanceIntroScreen}
        />
        <Stack.Screen
          name="CameraBalanceMeasureScreen"
          component={CameraBalanceMeasureScreen}
        />
        <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
        <Stack.Screen
          name="ExerciseRecommendationResult"
          component={ExerciseRecommendationResultScreen}
        />
        <Stack.Screen
          name="ExerciseRecommendation"
          component={ExerciseRecommendScreen}
        />
        <Stack.Screen
          name="ExerciseSummary"
          component={ExerciseSummaryScreen}
        />
        <Stack.Screen
          name="BalanceHistoryScreen"
          component={BalanceHistoryScreen}
        />
        <Stack.Screen name="MyInfoScreen" component={MyInfoScreen} />
        <Stack.Screen
          name="WorkoutHistoryScreen"
          component={WorkoutHistoryScreen}
        />
        <Stack.Screen name="SettingsScreen" component={SettingScreen} />
        <Stack.Screen name="FriendAddScreen" component={FriendAddScreen} />
        <Stack.Screen name="FriendsScreen" component={FriendsScreen} />
        <Stack.Screen
          name="FriendRequestsScreen"
          component={FriendRequestsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
