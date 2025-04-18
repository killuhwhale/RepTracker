import React, { FunctionComponent, useState } from "react";

import { View } from "react-native";
import { TSParagrapghText, TSCaptionText } from "../Text/Text";
import { RegularButton } from "../Buttons/buttons";
import { post } from "@/src/utils/fetchAPI";
import { BASEURL } from "@/src/utils/constants";
import Input, { AutoCaptilizeEnum } from "../Input/input";
import { useTheme } from "styled-components/native";
import { validEmailRegex } from "@/src/utils/algos";

const ResetPasswordViaEmail: FunctionComponent = () => {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const sendEmail = async () => {
    setErrorMsg("");
    if (email.length <= 0) {
      return;
    }

    const emailData = {
      // 'email': 'andayac@gmail.com',
      email: email,
    };

    const url = `${BASEURL}user/send_reset_code/`;
    const result = await (await post(url, emailData)).json();
    if (result.error) {
      setErrorMsg(result.error);
    } else {
      // console.log('Send email res:', result, await result.formData());
      console.log("Send email res:", result);
      setShowHint(true);
    }
  };

  return (
    <View style={{ width: "100%" }}>
      <TSParagrapghText
        textStyles={{
          textAlign: "center",
          marginBottom: 16,
          marginHorizontal: 30,
        }}
      >
        Please enter the email registered to your account
      </TSParagrapghText>

      <View style={{ height: 35, marginBottom: 16 }}>
        <Input
          containerStyle={{
            backgroundColor: theme.palette.gray,
            borderRadius: 8,
          }}
          label="Email"
          placeholder="Email"
          isError={emailError.length > 0}
          helperText={emailError}
          autoCapitalize={AutoCaptilizeEnum.None}
          onChangeText={(_email: string) => {
            if (!validEmailRegex.test(_email)) {
              setEmailError("Invalid email");
            } else if (emailError.length) {
              setEmailError("");
            }
            setEmail(_email);
          }}
          inputStyles={{ paddingLeft: 24 }}
          value={email}
        />
      </View>

      <View style={{ alignItems: "center" }}>
        <RegularButton
          btnStyles={{
            width: "100%",
            justifyContent: "center",
            backgroundColor: theme.palette.primary.main,
          }}
          textStyles={{ textAlign: "center", paddingVertical: 8 }}
          onPress={sendEmail}
          text="Send Reset Code"
          disabled={showHint}
        />
      </View>

      <View style={{ alignItems: "center", marginTop: 32 }}>
        {errorMsg.length > 0 ? (
          <TSCaptionText
            textStyles={{ textAlign: "center", marginBottom: 16, color: "red" }}
          >
            {errorMsg}
          </TSCaptionText>
        ) : showHint ? (
          <TSCaptionText
            textStyles={{
              textAlign: "center",
              marginBottom: 1,
              color: theme.palette.AWE_Green,
            }}
          >
            Only one code will be sent per email every 15mins
          </TSCaptionText>
        ) : (
          <></>
        )}
      </View>
    </View>
  );
};
export default ResetPasswordViaEmail;
