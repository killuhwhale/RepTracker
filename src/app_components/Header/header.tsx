import React, { FunctionComponent, useEffect, useState } from "react";
import { useTheme } from "styled-components";
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

const Header: FunctionComponent<{ showBackButton: boolean }> = ({
  showBackButton,
}) => {
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
          <Icon
            testID={TestIDs.PlanetHome.name()}
            name="planet-outline"
            color={theme.palette.text}
            style={{
              fontSize: 23,
              marginRight: 12,
              color: "#0F9D58",
            }}
          />
          <GradientText text="FitTrackrr" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Header;
