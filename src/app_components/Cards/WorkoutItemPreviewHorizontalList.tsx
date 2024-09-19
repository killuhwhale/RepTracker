import { FunctionComponent } from "react";
import WorkoutItemPanel from "../WorkoutItems/ItemPanel";
import { WorkkoutItemsList, WorkoutDualItemProps } from "./types";
import { useTheme } from "styled-components";
import { FlatList } from "react-native";

const WorkoutItemPreviewHorizontalList: FunctionComponent<{
  data: WorkkoutItemsList;
  schemeType: number;
  itemWidth: number;
  testID?: string;
  ownedByClass: boolean;
}> = (props) => {
  const theme = useTheme();
  return (
    <FlatList
      data={props.data}
      horizontal={true}
      contentContainerStyle={{
        alignItems: "center",
        justifyContent: "space-between",
        // width: '100%', baddd
        paddingLeft: 12,
        paddingRight: 12,
        paddingBottom: 15,
        paddingTop: 15,
      }}
      accessibilityLabel={props.testID}
      testID={props.testID}
      keyExtractor={(item: any, idx) => {
        // id.toString();
        return `${idx}_${item.id}`;
      }}
      renderItem={(renderProps) => {
        const index = renderProps.index == undefined ? 0 : renderProps.index;

        return (
          <WorkoutItemPanel
            item={renderProps.item as WorkoutDualItemProps}
            schemeType={props.schemeType}
            itemWidth={props.itemWidth}
            idx={index + 1}
            ownedByClass={props.ownedByClass}
          />
        );
      }}
      style={{ height: "100%" }}
    />
  );
};

export default WorkoutItemPreviewHorizontalList;
