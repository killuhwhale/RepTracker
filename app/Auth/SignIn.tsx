import React, { FunctionComponent } from "react";
import { ScrollView, View } from "react-native";
import { RegularButton } from "../../src/app_components/Buttons/buttons";
import { TestIDs } from "../../src/utils/constants";
import {
  TSCaptionText,
  TSParagrapghText,
} from "../../src/app_components/Text/Text";
import Input, { AutoCaptilizeEnum } from "../../src/app_components/Input/input";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from "styled-components";

interface SignInProps {
  email: string;
  emailHelperText: string;
  onEmailChange(text: string): void;
  onPasswordChange(text: string): void;
  password: string;
  hidePassword: boolean;
  setHidePassword(hide: boolean): void;
  login(): void;
  setAuthMode(authMode: number): void;
  showSignInFailedText: boolean;
}

const SignInComp: FunctionComponent<SignInProps> = ({
  onEmailChange,
  emailHelperText,
  onPasswordChange,
  hidePassword,
  setHidePassword,
  password,
  login,
  setAuthMode,
  email,
  showSignInFailedText,
}) => {
  const theme = useTheme();
  return (
    <View style={{ flex: 1, width: "100%" }} testID="signInScreen">
      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
        <View
          style={{ justifyContent: "space-evenly", height: "35%", flex: 4 }}
        >
          <TSParagrapghText
            textStyles={{ textAlign: "center", marginBottom: 16 }}
          >
            Sign In
          </TSParagrapghText>

          <View style={{ height: 35, marginVertical: 32 }}>
            <Input
              testID={TestIDs.SignInEmailField.name()}
              onChangeText={onEmailChange}
              autoCapitalize={AutoCaptilizeEnum.None}
              label=""
              isError={emailHelperText.length > 0}
              placeholder="Email"
              keyboardType="email-address"
              containerStyle={{
                backgroundColor: theme.palette.gray,
                borderTopStartRadius: 8,
                borderTopEndRadius: 8,
                height: "100%",
              }}
              value={email}
              leading={
                <Icon name="person" style={{ color: theme.palette.text }} />
              }
              helperText={emailHelperText}
            />
          </View>
          <View style={{ height: 35, marginBottom: 16 }}>
            <Input
              testID={TestIDs.SignInPasswordField.name()}
              onChangeText={onPasswordChange.bind(this)}
              label=""
              placeholder="Password"
              containerStyle={{
                backgroundColor: theme.palette.gray,
                borderBottomStartRadius: 8,
                borderBottomEndRadius: 8,
              }}
              value={password}
              secureTextEntry={hidePassword}
              leading={
                <Icon
                  name="person"
                  style={{ color: theme.palette.text }}
                  onPress={() => setHidePassword(!hidePassword)}
                />
              }
              trailing={
                <Icon
                  name="eye"
                  style={{ color: theme.palette.text, marginRight: 8 }}
                  onPress={() => setHidePassword(!hidePassword)}
                />
              }
            />
          </View>
        </View>

        <View style={{ flexDirection: "row", flex: 1 }}>
          <View
            style={{
              height: 45,
              width: "100%",
              paddingHorizontal: 8,
              marginTop: 16,
            }}
          >
            <RegularButton
              testID={TestIDs.SignInSubmit.name()}
              onPress={() => {
                login();
              }}
              btnStyles={{
                backgroundColor: theme.palette.primary.main,
                paddingVertical: 8,
              }}
              text="Sign In"
            />
          </View>
        </View>
        {showSignInFailedText ? (
          <View style={{ height: 35, marginVertical: 32 }}>
            <TSCaptionText>
              No active account found with the given credentials.
            </TSCaptionText>
            <TSCaptionText>
              Confirm your email or check your password
            </TSCaptionText>
          </View>
        ) : (
          <></>
        )}
      </ScrollView>
    </View>
  );
};

export default SignInComp;
