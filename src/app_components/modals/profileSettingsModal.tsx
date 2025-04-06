import React, { FunctionComponent, useState } from "react";
import {
  Linking,
  Modal,
  TouchableHighlight,
  View,
  ViewStyle,
} from "react-native";
import { useTheme } from "styled-components";
import Icon from "react-native-vector-icons/Ionicons";
import { RegularButton } from "../Buttons/buttons";
import * as RootNavigation from "@/src/navigators/RootNavigation";
import ActionCancelModal from "./ActionCancelModal";
import AuthManager from "@/src/utils/auth";
import { centeredViewStyle, settingsModalViewStyle } from "./modalStyles";
import {
  MediumText,
  TSCaptionText,
  TSParagrapghText,
  TSSnippetText,
  TSTitleText,
} from "../Text/Text";
import { TestIDs } from "@/src/utils/constants";
import { router } from "expo-router";
import { DOMAIN_NAME } from "@/src/utils/constants";
import { apiSlice } from "@/src/redux/api/apiSlice";
import { store } from "@/src/redux/store";

const invalidateUser = () => {
  store.dispatch(apiSlice.util.invalidateTags(["User"]));
};

const ProfileSettingsModalRow: FunctionComponent<{
  onAction(): void;
  title: string;
  testID?: string;
  color?: string;
  variant?: number;
}> = (props) => {
  const theme = useTheme();

  const variantStyles = [
    {
      width: "100%",
      height: "100%",
      justifyContent: "center",
      borderRadius: 8,
      paddingLeft: 8,
    },
    {
      width: "75%",
      height: "60%",
      justifyContent: "center",
      borderRadius: 8,
      paddingLeft: 8,
    },
    ,
    {
      width: "75%",
      height: "60%",
      justifyContent: "center",
      borderRadius: 8,
      paddingLeft: 8,
    },
  ] as ViewStyle[];

  const variant = props.variant ? props.variant : 0;
  return (
    <View
      style={{
        width: "100%",
        height: 45,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        marginVertical: 8,
      }}
    >
      <TouchableHighlight
        style={[variantStyles[variant]]}
        testID={props.testID}
        underlayColor={theme.palette.transparent}
        onPress={() => {
          props.onAction();
        }}
      >
        <TSSnippetText
          textStyles={{
            textAlign: variant === 0 ? "left" : "center",
            color:
              variant === 0
                ? theme.palette.text
                : variant === 1
                ? theme.palette.secondary.main
                : theme.palette.primary.main,
          }}
        >
          {props.title}
        </TSSnippetText>
      </TouchableHighlight>
    </View>
  );
};

const ProfileSettingsModal: FunctionComponent<{
  user: { email: string; id: string; username: string };
  modalVisible: boolean;
  onRequestClose(): void;
}> = (props) => {
  const theme = useTheme();
  const auth = AuthManager;

  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const logout = () => {
    console.log("Loggin out");
    auth
      .logout()
      .then((res) => {
        console.log("ProfileSettings: Logged out");
      })
      .catch((err) => console.log("ProfileSettings Logout Error", err));
  };

  const handleNavToCreateWorkoutGroupScreen = () => {
    router.push({
      pathname: "/input_pages/gyms/CreateWorkoutGroupScreen",
      params: {
        ownedByClass: 0,
        ownerID: props.user.id as string,
      },
    });
    props.onRequestClose();
  };

  const handleNavToChangePassword = () => {
    router.push({
      pathname: "/input_pages/users/ResetPassword",
    });
    props.onRequestClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={props.onRequestClose}
    >
      <View style={centeredViewStyle.centeredView}>
        <View
          style={{
            ...settingsModalViewStyle.settingsModalView,
            backgroundColor: theme.palette.darkGray,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
              flex: 1,
            }}
          >
            <TSTitleText>Settings</TSTitleText>
          </View>

          <View
            style={{
              alignItems: "flex-end",
              width: "100%",
              justifyContent: "flex-end",
              marginBottom: 32,
              flexDirection: "row",
              flex: 1,
            }}
          >
            <TouchableHighlight
              underlayColor="#00000022"
              style={{ borderRadius: 8 }}
              onPress={() => {
                invalidateUser();
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  padding: 12,
                }}
              >
                <Icon
                  name="refresh"
                  color="blue"
                  style={{ fontSize: 24, marginRight: 4 }}
                />
                <TSCaptionText>Sub Status</TSCaptionText>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="#00000022"
              style={{ borderRadius: 8 }}
              onPress={() => {
                setShowConfirmLogout(true);
              }}
            >
              <View
                style={{
                  alignItems: "flex-end",
                  width: "100%",
                  padding: 12,
                }}
              >
                <Icon
                  name="log-out"
                  color="red"
                  style={{ fontSize: 24, marginRight: 4 }}
                />
                <TSCaptionText>Logout</TSCaptionText>
              </View>
            </TouchableHighlight>
          </View>

          <View style={{ flex: 4, width: "100%" }}>
            {/* <ProfileSettingsModalRow
              testID={TestIDs.CreateGymScreenBtn.name()}
              onAction={() => {
                RootNavigation.navigate('CreateGymScreen', {});
                props.onRequestClose();
              }}
              title="Create Gym"
            />
            <View
              style={{
                borderTopWidth: 1,
                height: 1,
                borderColor: theme.palette.text,
              }}
            />

            <ProfileSettingsModalRow
              testID={TestIDs.CreateGymClassScreenBtn.name()}
              onAction={() => {
                RootNavigation.navigate('CreateGymClassScreen', {});
                props.onRequestClose();
              }}
              title="Create Gym Class"
            />
             */}

            <View
              style={{
                borderTopWidth: 1,
                height: 1,
                borderColor: theme.palette.text,
              }}
            />

            <ProfileSettingsModalRow
              testID={TestIDs.CreateWorkoutGroupScreenBtn.name()}
              onAction={handleNavToCreateWorkoutGroupScreen}
              title="Create Personal Workout Group"
            />
            <View
              style={{
                borderTopWidth: 1,
                height: 1,
                borderColor: theme.palette.text,
              }}
            />
            <ProfileSettingsModalRow
              testID={TestIDs.ResetPasswordScreenBtn.name()}
              onAction={handleNavToChangePassword}
              title="Change Password"
            />
            <View
              style={{
                borderTopWidth: 1,
                height: 1,
                borderColor: theme.palette.text,
              }}
            />
            <ProfileSettingsModalRow
              onAction={() => {
                Linking.openURL(
                  `https://www.apple.com/legal/internet-services/itunes/dev/stdeula/`
                );
                props.onRequestClose();
              }}
              variant={2}
              color={theme.palette.primary.main}
              title="Terms of Use (EULA)"
            />
            <ProfileSettingsModalRow
              onAction={() => {
                Linking.openURL(
                  `https://gist.github.com/killuhwhale/1613abbf3258807a5bc78e5fc5e569fb`
                );
                props.onRequestClose();
              }}
              variant={2}
              color={theme.palette.primary.main}
              title="Privacy Policy"
            />
            <ProfileSettingsModalRow
              onAction={() => {
                Linking.openURL(`https://${DOMAIN_NAME}/removeAccount`);
                props.onRequestClose();
              }}
              variant={1}
              color={theme.palette.secondary.main}
              title="Remove Account"
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              alignContent: "flex-end",
              flex: 2,
              height: "100%",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <RegularButton
              testID={TestIDs.CloseProfileSettingsBtn.name()}
              underlayColor={theme.palette.secondary.main}
              onPress={props.onRequestClose}
              btnStyles={{
                backgroundColor: theme.palette.primary.main,
                width: "75%",
              }}
              text="Close"
            />
          </View>
          {showConfirmLogout ? (
            <ActionCancelModal
              containerStyle={{ borderWidth: 2, borderColor: "white" }}
              actionText="Logout"
              closeText="Close"
              modalText={"Are you sure?"}
              onAction={() => logout()}
              modalVisible={showConfirmLogout}
              onRequestClose={() => setShowConfirmLogout(false)}
            />
          ) : (
            <></>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ProfileSettingsModal;
