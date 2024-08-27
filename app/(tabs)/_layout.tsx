import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import twrnc from "twrnc";

const FONTSIZE = 10;
const ICONSIZE = 27;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: twrnc.color("bg-blue-500"),
        tabBarActiveBackgroundColor: twrnc.color("bg-slate-950"),

        tabBarInactiveTintColor: twrnc.color("bg-slate-400"),
        tabBarInactiveBackgroundColor: twrnc.color("bg-slate-900"),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Workouts",
          tabBarLabelStyle: {
            fontSize: FONTSIZE,
          },

          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={ICONSIZE} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="StatsScreen"
        options={{
          title: "Stats",
          tabBarLabelStyle: {
            fontSize: FONTSIZE,
          },
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={ICONSIZE} name="signal" color={color} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="DailySnapshot"
        options={{
          title: "Daily",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="terminal" color={color} />
          ),
        }}
      /> */}
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarLabelStyle: {
            fontSize: FONTSIZE,
          },
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={ICONSIZE} name="user-secret" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="GymSearchScreen"
        options={{
          href: null, // Allows file to remain in (tabs) and be a route but not appear in the Tab Bar
        }}
      />
    </Tabs>
  );
}
