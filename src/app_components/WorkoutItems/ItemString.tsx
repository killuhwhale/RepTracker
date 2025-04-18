import React, { FunctionComponent } from "react";
import { View } from "react-native";
import { useTheme } from "styled-components";
import { WorkoutItemProps } from "../Cards/types";
import { displayJList, DISTANCE_UNITS, DURATION_UNITS } from "../shared";
import { TSCaptionText } from "../Text/Text";

const ItemString: FunctionComponent<{
  item: WorkoutItemProps;
  schemeType: number;
  prefix: string;
  color?: string;
}> = ({ item, schemeType, prefix, color }) => {
  const theme = useTheme();

  let isWeightsCorrect = false;
  try {
    isWeightsCorrect =
      JSON.parse(item.weights).length > 0 && JSON.parse(item.weights)[0] > 0;
  } catch (err) {
    console.log("Error checking weights...");
  }

  return (
    <View
      style={{
        width: "100%",
        borderRadius: 8,
        padding: 4,
      }}
    >
      <TSCaptionText textStyles={{ color: color ?? "white" }}>
        {`${prefix} `}
        {item.sets > 0 && schemeType === 0 ? `${item.sets} x ` : ""}

        {item.reps !== "[0]"
          ? `${displayJList(item.reps)}  `
          : item.distance !== "[0]"
          ? `${displayJList(item.distance)} ${
              DISTANCE_UNITS[item.distance_unit]
            } `
          : item.duration !== "[0]"
          ? `${displayJList(item.duration)} ${
              DURATION_UNITS[item.duration_unit]
            } of `
          : ""}

        {item.name.name}
        {isWeightsCorrect ? ` @ ${displayJList(item.weights)}` : ""}
        {item.weight_unit === "%"
          ? ` percent of ${item.percent_of}`
          : isWeightsCorrect
          ? ` ${item.weight_unit}`
          : ""}

        {item.pause_duration > 0 ? ` for: ${item.pause_duration} s` : ""}
        {item.rest_duration > 0
          ? ` - Rest: ${item.rest_duration} ${
              DURATION_UNITS[item.rest_duration_unit]
            }`
          : ""}
      </TSCaptionText>
    </View>
  );
};

export default ItemString;
