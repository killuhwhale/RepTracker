import React, { FunctionComponent } from "react";
import { useTheme } from "styled-components";
import {
  TSCaptionText,
  TSDateText,
  TSParagrapghText,
  TSSnippetText,
  XSmallText,
} from "@/src/app_components/Text/Text";
import { router } from "expo-router";
import { WorkoutGroupCardProps } from "@/src/app_components/Cards/types";
import { Image, TouchableHighlight, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import twrnc from "twrnc";
import moc from "@/assets/bgs/moc.png";

import { green } from "@/src/app_components/shared";
import { dateFormatDayOfWeek } from "@/src/utils/algos";

const startColor = twrnc.color("bg-stone-900");
const endColor = twrnc.color("bg-teal-900");
const textColor = twrnc.color("bg-teal-50");

const WorkoutGroupGridItem: FunctionComponent<{
  card: WorkoutGroupCardProps;
  editable: boolean;
}> = (props) => {
  const theme = useTheme();

  const handlePress = () => {
    router.push({
      pathname: "/WorkoutScreen",
      params: {
        id: props.card.id,
      },
    });
  };

  return (
    <View
      style={{
        flexDirection: "column",
        margin: 8,
      }}
    >
      <TouchableHighlight
        style={{ borderRadius: 16 }}
        underlayColor="transparent"
        onPress={handlePress}
      >
        <LinearGradient
          colors={[startColor!, endColor!]} // Turquoise
          start={{ x: 0.0, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={{ flex: 1, borderRadius: 16 }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* <View style={{ flex: 5 }}>
              <View style={{ marginVertical: 4 }}>
                <TSSnippetText
                  numberOfLines={1}
                  textStyles={{ marginLeft: 16, color: textColor }}
                >
                  {props.card.title}
                </TSSnippetText>
                <TSDateText
                  numberOfLines={1}
                  textStyles={{
                    textAlign: "left",
                    marginLeft: 16,
                    color: textColor,
                  }}
                >
                  {dateFormatDayOfWeek(new Date(props.card.for_date))}{" "}
                </TSDateText>
              </View>
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
              {!props.card.finished ? (
                <Icon
                  name={"locate"}
                  color={green}
                  style={{ fontSize: 24, marginRight: 8 }}
                />
              ) : (
                <></>
              )}
            </View> */}
            <View
              style={{
                backgroundColor: theme.palette.backgroundColor,
                borderRadius: 16,
                padding: 16,
                margin: 8,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
                elevation: 4,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {/* <Icon
                name="barbell-outline"
                size={28}
                color={green}
                style={{ marginRight: 12 }}
              /> */}

              <Image
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 16,
                  marginRight: 12,
                }}
                source={moc}
              />
              <View style={{ flex: 1 }}>
                <TSSnippetText
                  numberOfLines={1}
                  textStyles={{ fontWeight: "bold", fontSize: 16 }}
                >
                  {props.card.title}
                </TSSnippetText>
                <TSDateText
                  numberOfLines={1}
                  textStyles={{
                    fontSize: 12,
                    color: "gray",
                    marginTop: 2,
                  }}
                >
                  {dateFormatDayOfWeek(new Date(props.card.for_date))}
                </TSDateText>
              </View>

              {props.card.finished ? (
                <View
                  style={{
                    backgroundColor: "#4ade80",
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12,
                  }}
                >
                  <XSmallText textStyles={{ color: "#064e3b" }}>
                    Done
                  </XSmallText>
                </View>
              ) : (
                <Icon name="play-circle-outline" size={24} color={green} />
              )}
            </View>
          </View>
        </LinearGradient>
      </TouchableHighlight>
    </View>
  );
};

export default WorkoutGroupGridItem;
