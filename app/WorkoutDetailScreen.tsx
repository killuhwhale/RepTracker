import React, { FunctionComponent } from "react";
import styled from "styled-components/native";
import {
  CalcWorkoutStats,
  Container,
  displayJList,
  formatLongDate,
  SCREEN_HEIGHT,
  WORKOUT_TYPES,
} from "../src/app_components/shared";
import {
  TSCaptionText,
  TSParagrapghText,
  LargeText,
  TSTitleText,
} from "../src/app_components/Text/Text";
import { useTheme } from "styled-components";
import { WorkoutItemPreviewHorizontalList } from "../src/app_components/Cards/cardList";

import { RootStackParamList } from "../src/navigators/RootStack";
import { StackScreenProps } from "@react-navigation/stack";
import { View } from "react-native";
import { StatsPanel } from "../src/app_components/Stats/StatsPanel";
import BannerAddMembership from "../src/app_components/ads/BannerAd";
import { useLocalSearchParams } from "expo-router";
import { WorkoutItemProps } from "@/src/app_components/Cards/types";
import { useGetWorkoutByIDQuery } from "@/src/redux/api/apiSlice";

export type Props = StackScreenProps<RootStackParamList, "WorkoutDetailScreen">;

const ScreenContainer = styled(Container)`
  background-color: ${(props) => props.theme.palette.backgroundColor};
  justify-content: space-between;
  width: 100%;
  padding: 16px;
`;

/**
 *
 * @param schemeRounds
 * @param schemeType
 * @param items
 * @returns
 *
 * [{name: {primary: "lower"},...}, {},....]
 *
 * TAGS = {
 *  "lower": {
 *      totalReps: 10,
        totalLbs: 10,
        totalKgs: 10,
 *  },
 * }
 *
 *
 */

/**
 *  totalReps: 0,
    totalLbs: 0,
    totalKgs: 0,

    // Total duration seconds
    totalTime: 0,
    totalKgSec: 0,
    totalLbSec: 0,

    // Total Distance Meters
    totalDistanceM: 0,
    totalKgM: 0,
    totalLbM: 0,
*/

const WorkoutDetailScreen: FunctionComponent = () => {
  const params = useLocalSearchParams(); // returns string or string array, cannot serialize much....

  // TODO() Build or find query from APISlice to get workout items for this workout....

  // Thank goodness for type safety...
  const {
    id,
    title: _title,
    desc: _desc,
    scheme_rounds: _scheme_rounds,
    scheme_type: _scheme_type,
    instruction: _instruction,
    editable: _editable,
    for_date: _for_date,
    ownedByClass: _ownedByClass,
    workout_items: _workout_items,
  } = params || {};

  const title = _title as string;
  const desc = _desc as string;
  const scheme_rounds = _scheme_rounds as string;
  const scheme_type = parseInt(_scheme_type as string);
  const instruction = _instruction as string;
  const editable = parseInt(_editable as string);
  const for_date = _for_date as string;
  const ownedByClass = parseInt(_ownedByClass as string);

  const {
    data: workout,
    isLoading,
    isSuccess,
    isError,
    error: errorWorkoutByID,
  } = useGetWorkoutByIDQuery(id);
  console.log("Workout items: ", workout);

  const stats = new CalcWorkoutStats();
  stats.setWorkoutParams(
    scheme_rounds,
    scheme_type,
    workout?.workout_items ?? []
  );
  stats.calc();

  const [tags, names] = stats.getStats();
  // const tags = stats.tags;
  // const names = stats.names;

  return (
    <ScreenContainer>
      <BannerAddMembership />
      <TSTitleText>
        {isSuccess && !isLoading
          ? `${workout.workout_items.length} items`
          : "no items"}
      </TSTitleText>
      <View style={{ width: "100%", flex: 1 }}>
        <View style={{ flex: 1 }}>
          <TSTitleText>
            {title.length < 1 ? "Title here..." : title}
          </TSTitleText>

          <TSCaptionText textStyles={{ padding: 6 }}>
            {desc.length < 1 ? "Description here..." : desc}
          </TSCaptionText>
          {instruction ? (
            <TSParagrapghText textStyles={{ padding: 6 }}>
              {instruction}
            </TSParagrapghText>
          ) : (
            <></>
          )}
          <TSCaptionText textStyles={{ padding: 6 }}>
            {for_date
              ? formatLongDate(new Date(for_date))
              : "Unsure which date this is for..."}
          </TSCaptionText>
        </View>

        <View style={{ flex: 3 }}>
          <StatsPanel tags={tags} names={names} />
        </View>

        <View style={{ flex: 3, justifyContent: "center" }}>
          <View style={{ marginTop: 8, padding: 6 }}>
            <TSParagrapghText>
              {WORKOUT_TYPES[scheme_type]} {displayJList(scheme_rounds)}
            </TSParagrapghText>
          </View>

          {!isLoading && isSuccess ? (
            <WorkoutItemPreviewHorizontalList
              testID={""}
              data={workout.workout_items}
              schemeType={scheme_type}
              itemWidth={200}
              ownedByClass={ownedByClass == 1 ? true : false}
            />
          ) : (
            <></>
          )}
        </View>
      </View>
    </ScreenContainer>
  );
};

export default WorkoutDetailScreen;
