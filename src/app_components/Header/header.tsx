import React, { FunctionComponent, useEffect, useState } from "react";
import { useTheme } from "styled-components/native";
import { RootStackParamList } from "@/src/navigators/RootStack";
import { StackScreenProps } from "@react-navigation/stack";
export type Props = StackScreenProps<RootStackParamList, "Header">;
import { NavigationContext, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import * as RootNavigation from "@/src/navigators/RootNavigation";
import { TouchableOpacity, View } from "react-native";
import { TSParagrapghText } from "../Text/Text";
import { TestIDs } from "@/src/utils/constants";
import LinearGradient from "react-native-linear-gradient";
import GradientText from "./gradientText";
import { router } from "expo-router";
import { storeThemePreference } from "@/src/utils/tokenUtils";

const Header: FunctionComponent<{
  showBackButton: boolean;
  toggleState: React.Dispatch<React.SetStateAction<string>>;
}> = ({ showBackButton, toggleState }) => {
  const theme = useTheme();

  const handleNavToHome = () => {
    router.push({
      pathname: "/",
    });
  };

  return (
    <View
      style={{
        flexDirection: "row",

        justifyContent: "space-between",
        backgroundColor: theme.palette.backgroundColor,
      }}
    >
      {showBackButton ? (
        <TouchableOpacity
          activeOpacity={0.69}
          onPress={() => {
            RootNavigation.navigationRef.current?.goBack();
          }}
        >
          <View
            style={{ flexDirection: "row", paddingVertical: 8, marginLeft: 2 }}
          >
            <Icon
              name="chevron-back-outline"
              color={theme.palette.text}
              style={{
                fontSize: 23,

                color: "#0F9D58",
              }}
            />
          </View>
        </TouchableOpacity>
      ) : (
        <></>
      )}

      <TouchableOpacity activeOpacity={0.69} onPress={handleNavToHome}>
        <View
          style={{ flexDirection: "row", paddingVertical: 8, marginLeft: 12 }}
        >
          {/* <Icon
            testID={TestIDs.PlanetHome.name()}
            name="planet-outline"
            color={theme.palette.text}
            style={{
              fontSize: 23,
              marginRight: 12,
              color: "#0F9D58",
            }}
          /> */}
          <GradientText
            text="FitTrackrr"
            reversed={true}
            textStyles={{ fontFamily: "SpaceMono-Regular" }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.69}
        onPress={() => {
          toggleState((prevState) => {
            console.log("Setting user theme in header: ", prevState);

            const newState = prevState === "DARK" ? "FEM" : "DARK";
            storeThemePreference(newState)
              .then((r) => console.log("Stored userTheme: ", r))
              .catch((err) => console.log("Failed to store userTheme: ", err));
            return newState;
          });
        }}
        style={{ width: "100%", height: "100%", flex: 1 }}
      >
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            // backgroundColor: "red",
            justifyContent: "flex-end",
            alignItems: "center",
            marginRight: 8,
          }}
        >
          <Icon
            name="cloudy-night-outline"
            color={theme.palette.AWE_Green}
            style={{
              fontSize: 24,
            }}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Header;
