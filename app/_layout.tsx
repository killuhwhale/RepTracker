import { Stack } from "expo-router";

import "react-native-gesture-handler";
import React, {
  FunctionComponent,
  useEffect,
  useState,
  PropsWithChildren,
  useRef,
} from "react";

import {
  DefaultTheme,
  ThemeProvider,
  useTheme,
} from "styled-components/native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme, View } from "react-native";
import { store } from "../src/redux/store";
import { Provider } from "react-redux";
import Header from "../src/app_components/Header/header";
import { apiSlice, useGetProfileViewQuery } from "../src/redux/api/apiSlice";

import AuthScreen from "@/app/AuthScreen";
import Uploady from "@rpldy/native-uploady";
import { BASEURL } from "../src/utils/constants";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import auth from "../src/utils/auth";
import twrnc from "twrnc";
import {
  getThemePreference,
  getToken,
  storeThemePreference,
} from "@/src/utils/tokenUtils";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import FullScreenSpinner from "@/src/app_components/Spinner";

const primaryColor = twrnc.color("bg-blue-600");
// const secondaryColor = twrnc.color('bg-emerald-900');
const secondaryColor = twrnc.color("bg-rose-900");
const tertiaryColor = twrnc.color("bg-violet-500");

const d_accent = twrnc.color("bg-sky-400");
const d_text = twrnc.color("bg-slate-50");
const d_lightGray = twrnc.color("bg-slate-300");
const d_gray = twrnc.color("bg-slate-500");
const d_darkGray = twrnc.color("bg-slate-700");
const d_background = twrnc.color("bg-slate-900");

const l_text = "#283618";
const l_lightGray = "#a8dadc";
const l_gray = "#457b9d";
const l_darkGray = "#1d3557";
const l_background = "#f1faee";

interface ThemeMap {
  [key: string]: DefaultTheme;
}

const DarkTheme: DefaultTheme = {
  borderRadius: "8px",
  palette: {
    primary: {
      main: "#005aff",
      contrastText: "#fff",
    },
    secondary: {
      main: secondaryColor!,
      contrastText: "#fff",
    },
    tertiary: {
      main: tertiaryColor!,
      contrastText: "#fff",
    },
    accent: d_accent!,
    transparent: "#34353578",
    black: "black",
    white: "white",
    text: d_text!,
    backgroundColor: d_background!,
    lightGray: d_lightGray!,
    gray: d_gray!,
    darkGray: d_darkGray!,
    IP_Btn_bg: "#005aff",
    IP_Clickable_bg: "#0F9D58",
    IP_Label_bg: "#1e1e1e",
    IP_Swipe_bg: "#00a896",
    IP_TextInput_bg: "#121212",
    AWE_Blue: "#4285F4",
    AWE_Red: "#DB4437",
    AWE_Yellow: "#F4B400",
    AWE_Green: "#00d1b2", // #00d1b2 => looks good in gradient... (OG: #0F9D58)
  },
};

const FeminineTheme: DefaultTheme = {
  borderRadius: "8px",
  palette: {
    primary: {
      main: "#D069B4", // Pink
      contrastText: "#fff",
    },
    secondary: {
      main: "#f7c9a7", // Light Gold (soft gold tone)
      contrastText: "#fff",
    },
    tertiary: {
      main: "#ff7f7f", // Soft Coral (complementary warm tone)
      contrastText: "#fff",
    },
    accent: d_accent!,
    transparent: "#34353578",
    black: "black",
    white: "white",
    text: d_text!,
    backgroundColor: d_background!,
    lightGray: d_lightGray!,
    gray: d_gray!,
    darkGray: d_darkGray!,
    IP_Btn_bg: "#f1a7c2", // Rose Pink button background
    IP_Clickable_bg: "#FF69B4", // Light Gold clickable background
    IP_Label_bg: "#1e1e1e",
    IP_Swipe_bg: "#ff7f7f", // Soft Coral swipe background
    IP_TextInput_bg: "#121212",
    AWE_Blue: "#6a8bff", // Softer, more feminine blue
    AWE_Red: "#e76a7b", // Softer, pink-tinged red
    AWE_Yellow: "#f4c200", // Softened, warmer yellow (a bit of gold)
    AWE_Green: "#8A00C4", // Awesome Purple
  },
};

const DEFAULT_USER_THEME = "DARK";
const THEMES: ThemeMap = {
  [DEFAULT_USER_THEME]: DarkTheme,
  FEM: FeminineTheme,
};
const AuthNew: FunctionComponent<PropsWithChildren> = (props) => {
  // This will check if we have a valid token by sending a request to server for user info.
  // This either loads the app or login page.

  const [loggedIn, setLoggedIn] = useState(false);
  const [registeredWithAuth, setRegisteredWithAuth] = useState(false);

  const {
    data: profileData,
    isLoading: isUserLoading,
    error: userError,
  } = useGetProfileViewQuery("");

  // useEffect(() => {

  // }, [registeredWithAuth])

  useEffect(() => {
    const a = async () => {
      try {
        // const token = await getToken();
        console.log("Auth gettoken response: ", profileData, profileData.user);
        if (profileData.user && profileData.user) {
          setLoggedIn(true);
        }
      } catch (err) {
        setLoggedIn(false);
      }

      setRegisteredWithAuth(true);
    };

    auth.listenLogout(() => {
      console.log("Listened for logout, setLoggedIn");
      setLoggedIn(false);
    });

    auth.listenLogin((loggedIn, msg) => {
      console.log("App.tsx listenLogin: ", loggedIn, msg);
      if (loggedIn) {
        console.log("Listne for login");
        console.log("Should log in");
        store.dispatch(
          apiSlice.util.invalidateTags([
            "Gyms",
            "UserGyms",
            "User",
            "UserAuth",
            "GymClasses",
            "GymClassWorkoutGroups",
            "UserWorkoutGroups",
            "WorkoutGroupWorkouts",
            "Coaches",
            "Members",
            "GymFavs",
            "GymClassFavs",
          ])
        );

        setLoggedIn(true);
      }
    }, "logInKey");

    // once user is done loading, check if user is found or not.
    if (!isUserLoading) {
      a();
    }
  }, [isUserLoading]);

  if (isUserLoading || !registeredWithAuth) {
    return <FullScreenSpinner></FullScreenSpinner>;
  }

  return (
    <View style={{ flex: 1 }}>
      {props && props.children ? (
        <View style={{ flex: 1 }}>
          {loggedIn ? (
            <View style={{ flex: 1 }}>{props.children[0]}</View>
          ) : (
            <View style={{ flex: 1 }}>{props.children[1]}</View>
          )}
        </View>
      ) : (
        <></>
      )}
    </View>
  );
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // const isDarkMode = useColorScheme() === "dark";
  // console.log("User's preffered color scheme", useColorScheme(), isDarkMode);

  const [showBackButton, setShowBackButton] = useState(false);
  const [userTheme, setUserTheme] = useState(DEFAULT_USER_THEME);
  const [userThemeLoading, setUserThemeLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const getThemePref = async () => {
      const themePrefrence = await getThemePreference();
      setUserTheme(themePrefrence);
      setUserThemeLoading(false);
    };

    getThemePref();
  }, []);

  if (!fontsLoaded || userThemeLoading) {
    return null;
  }

  return (
    <View style={{ height: "100%", width: "100%", backgroundColor: "red" }}>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: d_background, paddingBottom: 0 }}
      >
        <Provider store={store}>
          <ThemeProvider theme={userTheme ? THEMES[userTheme] : DarkTheme}>
            <Uploady destination={{ url: `${BASEURL}` }}>
              {/* <React.StrictMode> */}
              <GestureHandlerRootView>
                <View
                  style={{
                    flex: 1,
                    width: "100%",
                  }}
                >
                  <Header
                    showBackButton={showBackButton}
                    toggleState={setUserTheme}
                  />
                  <AuthNew>
                    <Stack screenOptions={{ headerShown: false }}>
                      <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}
                      />
                    </Stack>
                    <AuthScreen />
                  </AuthNew>
                </View>
              </GestureHandlerRootView>
              {/* </React.StrictMode> */}
            </Uploady>
          </ThemeProvider>
        </Provider>
      </SafeAreaView>
    </View>
  );
}
