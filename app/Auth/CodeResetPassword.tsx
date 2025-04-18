import React, { FunctionComponent } from "react";
import { View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { RegularButton } from "@/src/app_components/Buttons/buttons";
import Input, { AutoCaptilizeEnum } from "@/src/app_components/Input/input";
import {
  TSParagrapghText,
  TSCaptionText,
} from "@/src/app_components/Text/Text";
import { useTheme } from "styled-components";

interface CodeResetPasswordProps {
  resetPasswordError: string;
  setAuthMode(authMode: number): void;
  resetEmailError: string;
  validEmailRegex: RegExp;
  resetEmail: string;
  resetPassword: string;
  resetCode: string;
  hideResetPassword: boolean;
  setHideResetPassword(hide: boolean): void;
  changePassword(): void;
  setResetPassword(text: string): void;
  setResetEmailError(text: string): void;
  setResetEmail(text: string): void;
  setResetCode(text: string): void;
}

const CodeResetPasswordPage: FunctionComponent<CodeResetPasswordProps> = ({
  resetPasswordError,
  resetEmailError,
  validEmailRegex,
  resetEmail,
  resetPassword,
  resetCode,
  setHideResetPassword,
  hideResetPassword,
  setResetPassword,
  changePassword,
  setAuthMode,
  setResetEmailError,
  setResetEmail,
  setResetCode,
}) => {
  const theme = useTheme();
  return (
    <View style={{ flex: 10 }}>
      <TSParagrapghText textStyles={{ textAlign: "center", marginBottom: 16 }}>
        Enter the Code from the email sent to you
      </TSParagrapghText>
      <TSParagrapghText textStyles={{ textAlign: "center", marginBottom: 16 }}>
        in order to Reset Your Password
      </TSParagrapghText>

      <TSParagrapghText
        textStyles={{ textAlign: "center", marginBottom: 16, color: "red" }}
      >
        {resetPasswordError}
      </TSParagrapghText>

      <View style={{ height: 35, marginBottom: 16 }}>
        <Input
          containerStyle={{
            backgroundColor: theme.palette.gray,
            borderTopStartRadius: 8,
            borderTopEndRadius: 8,
          }}
          label=""
          placeholder="Email"
          isError={resetEmailError.length > 0}
          helperText={resetEmailError}
          autoCapitalize={AutoCaptilizeEnum.None}
          onChangeText={(_email: string) => {
            if (!validEmailRegex.test(_email)) {
              setResetEmailError("Invalid email");
            } else if (resetEmailError.length) {
              setResetEmailError("");
            }
            setResetEmail(_email);
          }}
          inputStyles={{ paddingLeft: 24 }}
          value={resetEmail}
        />
      </View>
      <View style={{ height: 35, marginBottom: 16 }}>
        <Input
          onChangeText={setResetCode}
          autoCapitalize={AutoCaptilizeEnum.None}
          label=""
          placeholder="Reset code"
          containerStyle={{
            backgroundColor: theme.palette.gray,
          }}
          value={resetCode}
          inputStyles={{ paddingLeft: 24 }}
        />
      </View>

      <View style={{ height: 35, marginBottom: 16 }}>
        <Input
          containerStyle={{
            backgroundColor: theme.palette.gray,
            borderBottomStartRadius: 8,
            borderBottomEndRadius: 8,
          }}
          label=""
          placeholder="New Password"
          value={resetPassword}
          onChangeText={setResetPassword}
          secureTextEntry={hideResetPassword}
          autoCapitalize={AutoCaptilizeEnum.None}
          inputStyles={{ paddingLeft: 24 }}
          trailing={
            <Icon
              name="eye"
              style={{ fontSize: 24, color: theme.palette.text }}
              onPress={() => setHideResetPassword(!hideResetPassword)}
            />
          }
        />
      </View>

      <View style={{ flexDirection: "row", marginTop: 16 }}>
        <View style={{ height: 45, width: "100%", paddingHorizontal: 8 }}>
          <RegularButton
            onPress={() => {
              changePassword();
            }}
            btnStyles={{
              backgroundColor: theme.palette.primary.main,
              paddingVertical: 8,
            }}
            text="Reset"
          />
        </View>
      </View>
    </View>
  );
};

export default CodeResetPasswordPage;
