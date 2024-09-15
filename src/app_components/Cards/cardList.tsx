import React, { FunctionComponent } from "react";
import styled from "styled-components/native";
import { useTheme } from "styled-components";
import {
  GymCardListProps,
  GymClassCardListProps,
  WorkoutCardListProps,
  GymCardProps,
  GymClassCardProps,
  WorkoutDualItemProps,
  WorkkoutItemsList,
} from "./types";
import GymCard from "./GymCard";
import GymClassCard from "./GymClassCard";
import WorkoutCard from "./WorkoutCard";

import { FlatList, View } from "react-native";

// import {NamePanelItem, TagPanelItem, WorkoutStats} from '../Stats/StatsPanel';

import WorkoutItemPanel from "../WorkoutItems/ItemPanel";
import { TestIDs } from "../../utils/constants";

export const StyledList = styled.FlatList`
  width: 100%;
  padding-left: 12px;
  padding-right: 12px;
  padding-bottom: 15px;
  padding-top: 15px;
`;

const NarrowList = styled.FlatList`
  width: 100%;
  padding-left: 12px;
  padding-bottom: 6px;
`;

const GymCardList: FunctionComponent<GymCardListProps> = (props) => {
  const theme = useTheme();

  return (
    <StyledList
      data={props.data}
      horizontal={false}
      contentContainerStyle={{ flexGrow: 1 }}
      ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
      keyExtractor={({ id }: any) => id.toString()}
      renderItem={({ item }: { item: GymCardProps }) => {
        return <GymCard {...item} />;
      }}
    />
  );
};

const GymClassCardList: FunctionComponent<GymClassCardListProps> = (props) => {
  const theme = useTheme();

  return (
    <StyledList
      data={props.data}
      horizontal={false}
      contentContainerStyle={{
        alignItems: "center",
        justifyContent: "space-between",
      }}
      ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
      keyExtractor={({ id }: any) => id.toString()}
      renderItem={({ item }: { item: GymClassCardProps }) => (
        <GymClassCard {...item} />
      )}
    />
  );
};

const WorkoutCardFullList: FunctionComponent<WorkoutCardListProps> = (
  props
) => {
  const theme = useTheme();
  // Testing

  // WorkoutCardItemList - List containing WorkoutItems, count for items per workout
  return (
    <View
      testID={TestIDs.WorkoutCardList.name()}
      style={{
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {props.data.map((item) => {
        const num_items = item.workout_items?.length || 0;

        console.log("WorkoutCardFullList Group", props.group.finished);
        // WorkoutCardFullList Group
        // On Animate Finish
        return (
          <WorkoutCard
            testID={`${TestIDs.WorkoutCardItemList}_${item.title}_${num_items}`}
            key={`wcfl__${item.id}`}
            {...item}
            editable={props.editable}
            for_date={props.group.for_date}
            group={props.group}
            ownedByClass={props.group.owned_by_class}
            navToWorkoutScreenWithItems={() => {
              console.log("Editing workout: ", item.title, item.desc);
              props.navToWorkoutScreenWithItems(
                props.group.id.toString(),
                props.group.title,
                item.id.toString(),
                item.scheme_type,
                item.workout_items ?? [],
                item.title,
                item.desc,
                item.scheme_rounds,
                item.instruction ?? ""
              );
            }}
          />
        );
      })}
    </View>
  );
};

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

export {
  GymCardList,
  GymClassCardList,
  WorkoutItemPreviewHorizontalList,
  // WorkoutStatsByTagHorizontalList,
  // WorkoutStatsByNameHorizontalList,
  WorkoutCardFullList,
};
