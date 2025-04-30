import React, { FunctionComponent, useEffect, useState } from "react";
import { MediumText } from "../Text/Text";

import { Keyboard, Modal, TouchableWithoutFeedback, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from "styled-components/native";
import { RegularButton } from "../Buttons/buttons";
import Input, { AutoCaptilizeEnum } from "../Input/input";
import { mdFontSize, SCREEN_HEIGHT } from "../shared";
import { centeredViewStyle, modalViewStyle } from "./modalStyles";

const TextFieldModal: FunctionComponent<{
  modalVisible: boolean;
  onRequestClose(): void;
  closeText: string;
  bodyText: string;
  initText: string;

  onAction(penalty: string): void;
}> = ({
  modalVisible,
  onRequestClose,
  closeText,
  bodyText,
  initText,

  onAction,
}) => {
  const theme = useTheme();
  const [text, setText] = useState(initText);

  useEffect(() => {
    if (text != initText) {
      setText(initText);
    }
  }, [initText]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={onRequestClose}
    >
      <View style={centeredViewStyle.centeredView}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
          style={[
            centeredViewStyle.centeredView,
            { width: "100%", height: "100%" },
          ]}
        >
          <View
            style={{
              ...modalViewStyle.modalView,
              backgroundColor: theme.palette.darkGray,
              height: "90%",
            }}
          >
            <View style={{ height: "100%", justifyContent: "space-between" }}>
              <View style={{ marginTop: 20, flex: 2 }}>
                <MediumText>{bodyText}</MediumText>
              </View>

              <View style={{ marginBottom: 50, flex: 9 }}>
                <Input
                  placeholder=""
                  onChangeText={setText}
                  value={text}
                  label=""
                  autoCapitalize={AutoCaptilizeEnum.Sent}
                  multiline
                  containerStyle={{
                    width: "100%",
                    backgroundColor: theme.palette.backgroundColor,
                    borderRadius: 8,
                    paddingHorizontal: 8,
                  }}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  leading={
                    <Icon
                      name="flame"
                      color={theme.palette.text}
                      style={{ fontSize: mdFontSize }}
                    />
                  }
                />
              </View>

              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                <RegularButton
                  onPress={() => {
                    setText("");
                    onRequestClose();
                  }}
                  btnStyles={{
                    backgroundColor: theme.palette.AWE_Red,
                    justifyContent: "center",
                    paddingHorizontal: 24,
                  }}
                  text={closeText}
                />
                <RegularButton
                  onPress={() => {
                    onAction(text);
                    setText("");
                    onRequestClose();
                  }}
                  btnStyles={{
                    backgroundColor: theme.palette.AWE_Green,
                    justifyContent: "center",
                    paddingHorizontal: 24,
                  }}
                  text="Submit"
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
};

export default TextFieldModal;
