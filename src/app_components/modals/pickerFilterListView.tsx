import React, { FunctionComponent, useState, useRef, useEffect } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { useTheme } from "styled-components";

import RNPickerSelect from "react-native-picker-select";

import { TSCaptionText } from "../Text/Text";
import { WorkoutNameProps } from "../Cards/types";
import { useGetWorkoutNamesQuery } from "../../redux/api/apiSlice";
import { TestIDs } from "../../utils/constants";
import Input from "../Input/input";

import { AddItemFontsize } from "../shared";
import { TouchableHighlight } from "react-native-gesture-handler";

interface WorkoutNameRowItemProps {
  workoutName: WorkoutNameProps;
  onSelect(workoutName: WorkoutNameProps): void;
}

class WorkoutNameRowItem extends React.PureComponent<WorkoutNameRowItemProps> {
  render() {
    return (
      <TouchableOpacity
        testID={this.props.workoutName.name}
        onPress={() => this.props.onSelect(this.props.workoutName)}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
            paddingHorizontal: 16,
            flex: 1,
            borderBottomColor: "white",
            borderBottomWidth: 1,
            paddingVertical: 8,
          }}
        >
          <TSCaptionText>{this.props.workoutName.name}</TSCaptionText>
        </View>
      </TouchableOpacity>
    );
  }
}

// const WorkoutNameRowItem: FunctionComponent<WorkoutNameRowItemProps> = (
//   props: WorkoutNameRowItemProps,
// ) => {
//   return (
//     <TouchableHighlight
//       underlayColor="white"
//       style={{borderColor: 'red', borderWidth: 1}}
//       onPress={() => {
//         console.log('alskdnasklnd');
//       }}>
//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'center',
//           alignItems: 'center',
//           alignContent: 'center',
//           paddingHorizontal: 16,
//           flex: 1,
//           borderBottomColor: 'white',
//           borderBottomWidth: 1,
//           paddingVertical: 8,
//         }}>
//         <TSCaptionText>{props.workoutName.name}</TSCaptionText>
//       </View>
//     </TouchableHighlight>
//   );
// };

const PickerFilterListView: FunctionComponent<{
  data: [WorkoutNameProps];
  onSelect(workoutName: WorkoutNameProps): void;
}> = (props) => {
  /** The list view to display the filtered results. */
  const theme = useTheme();

  return (
    <View>
      <FlatList
        data={props.data}
        horizontal={false}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{ flexGrow: 1 }}
        keyExtractor={({ id }: any) => id.toString()}
        renderItem={({ item }: { item: WorkoutNameProps }) => {
          // console.log('WorkoutName item: ', item);
          return (
            <WorkoutNameRowItem workoutName={item} onSelect={props.onSelect} />
          );
        }}
      />
    </View>
  );
};

export default PickerFilterListView;
