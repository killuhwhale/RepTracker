import React, { FunctionComponent } from "react";
import styled from "styled-components/native";
import {
  CalcWorkoutStats,
  Container,
  displayJList,
  formatLongDate,
  WORKOUT_TYPES,
} from "../src/app_components/shared";
import {
  TSCaptionText,
  TSParagrapghText,
  TSTitleText,
  TSDateText,
  TSSnippetText,
} from "../src/app_components/Text/Text";

import { RootStackParamList } from "../src/navigators/RootStack";
import { StackScreenProps } from "@react-navigation/stack";
import { View } from "react-native";
import { StatsPanel } from "../src/app_components/Stats/StatsPanel";
import BannerAddMembership from "../src/app_components/ads/BannerAd";
import { useLocalSearchParams } from "expo-router";
import { useGetWorkoutByIDQuery } from "@/src/redux/api/apiSlice";
import WorkoutItemPreviewHorizontalList from "@/src/app_components/Cards/WorkoutItemPreviewHorizontalList";
import { useTheme } from "styled-components";

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
    for_date: _for_date,
    ownedByClass: _ownedByClass,
  } = params || {};

  const title = _title as string;
  const desc = _desc as string;
  const scheme_rounds = _scheme_rounds as string;
  const scheme_type = parseInt(_scheme_type as string);
  const instruction = _instruction as string;

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
  const theme = useTheme();

  return (
    <ScreenContainer>
      <BannerAddMembership />

      <View style={{ flex: 1, width: "100%" }}>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            width: "100%",
            flexDirection: "row",
          }}
        >
          <TSSnippetText textStyles={{ color: theme.palette.accent }}>
            {isSuccess && !isLoading
              ? `Exercises (${workout.workout_items.length})`
              : "no items"}
          </TSSnippetText>
        </View>

        <View style={{ flexGrow: 2, flexShrink: 1, flexBasis: 0 }}>
          <TSTitleText>
            {title.length < 1
              ? "Title here... (you didnt give a title)"
              : title}
          </TSTitleText>

          <TSCaptionText textStyles={{ padding: 6 }}>
            {desc.length < 1
              ? "Description here... (you didnt give a description)"
              : desc}
          </TSCaptionText>

          {instruction && instruction !== "undefined" ? (
            <TSSnippetText textStyles={{ padding: 6 }}>
              {instruction}
            </TSSnippetText>
          ) : (
            <></>
          )}

          <TSDateText textStyles={{ padding: 6 }}>
            {for_date
              ? formatLongDate(new Date(for_date))
              : "Unsure which date this is for..."}
          </TSDateText>
        </View>

        <View style={{ flexGrow: 4, flexBasis: 0, flexShrink: 1 }}>
          <StatsPanel tags={tags} names={names} />
        </View>

        <View
          style={{
            flexGrow: 5,
            flexBasis: 0,
            flexShrink: 1,
            justifyContent: "center",
          }}
        >
          <View style={{ marginTop: 8, padding: 6 }}>
            <TSParagrapghText>
              Type: {WORKOUT_TYPES[scheme_type]}{" "}
              {scheme_rounds.length > 0 &&
              scheme_rounds.indexOf("undefined") == -1
                ? displayJList(scheme_rounds)
                : ""}
            </TSParagrapghText>
          </View>

          {!isLoading && isSuccess ? (
            <WorkoutItemPreviewHorizontalList
              testID={""}
              data={workout.workout_items}
              schemeType={scheme_type}
              itemWidth={120}
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
