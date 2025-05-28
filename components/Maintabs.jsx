import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";

// 각 탭에 해당하는 화면들
import AnalyzeScreen from "../screens/AnalyzeScreens/AnalyzeScreen.jsx";
import BalanceScreen from "../screens/BalanceScreens/BalanceScreen.jsx";
import CommunityScreen from "../screens/CommunityScreens/CommuniyScreen.jsx";
import ProfileScreen from "../screens/ProfileScreens/ProfileScreen.jsx";

// 커스텀 탭바 (토스 스타일로 만든 하단 바)
import BottomTabBar from "./BottomTabBar.jsx";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }} // 모든 스크린에 헤더 표시
      tabBar={(props) => <BottomTabBar {...props} />} // 커스텀 탭바 적용
    >
      <Tab.Screen
        name="Balance"
        component={BalanceScreen}
        options={{ tabBarLabel: "밸런스" }}
      />

      <Tab.Screen
        name="Analyze"
        component={AnalyzeScreen}
        options={{ tabBarLabel: "분석" }}
      />

      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{
          tabBarLabel: "커뮤니티",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: "프로필" }}
      />
    </Tab.Navigator>
  );
}
