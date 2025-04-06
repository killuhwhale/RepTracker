import React, { FunctionComponent } from "react";
import { ScrollView, View } from "react-native";
import { RegularButton } from "@/src/app_components/Buttons/buttons";
import { TestIDs } from "@/src/utils/constants";
import { TSParagrapghText } from "@/src/app_components/Text/Text";
import Input, { AutoCaptilizeEnum } from "@/src/app_components/Input/input";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from "styled-components";

import ResetPasswordViaEmail from "@/src/app_components/passwords/resetPasswordViaEmail";

interface ResetPasswordAuthPageProps {
  setAuthMode(authMode: number): void;
}
// Forgot Password
const ResetPasswordAuthPage: FunctionComponent<ResetPasswordAuthPageProps> = ({
  setAuthMode,
}) => {
  const theme = useTheme();
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "space-evenly",
        flex: 10,
      }}
    >
      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
        <View style={{ flex: 3, justifyContent: "center" }}>
          <ResetPasswordViaEmail />
        </View>
      </ScrollView>
    </View>
  );
};

export default ResetPasswordAuthPage;
