import React, { FunctionComponent, useMemo, useState } from "react";
import {
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import styled from "styled-components/native";
import { useTheme } from "styled-components";
import { TSCaptionText } from "../../src/app_components/Text/Text";
import {
  Container,
  SCREEN_HEIGHT,
  CalcWorkoutStats,
} from "../../src/app_components/shared";
import { RootStackParamList } from "../../src/navigators/RootStack";
import { StackScreenProps } from "@react-navigation/stack";
import { useGetCompletedWorkoutGroupsForUserByDateRangeQuery } from "../../src/redux/api/apiSlice";
import {
  AnyWorkoutItem,
  WorkoutCardProps,
  WorkoutGroupProps,
} from "../../src/app_components/Cards/types";
import DatePicker from "react-native-date-picker";

import TotalsBarChart from "../../src/app_components/charts/barChart";
import TotalsLineChart from "../../src/app_components/charts/lineChart";
import TotalsPieChart from "../../src/app_components/charts/pieChart";
import FreqCalendar from "../../src/app_components/charts/freqCalendar";
import BannerAddMembership from "../../src/app_components/ads/BannerAd";
import { StatsPanel } from "../../src/app_components/Stats/StatsPanel";
import { dateFormat } from "@/src/utils/algos";
export type Props = StackScreenProps<RootStackParamList, "StatsScreen">;

const ScreenContainer = styled(Container)`
  background-color: ${(props) => props.theme.palette.backgroundColor};
  justify-content: space-between;
  width: 100%;
`;

// Convert,String date (res from db) as UTC to local time as String
export const _date = (
  dateString: string,
  tz: string = "America/Los_Angeles"
) => {
  let d = new Date(dateFormat(new Date(dateString)));
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
  }).format(d);
};

const StatsScreen: FunctionComponent<Props> = () => {
  const theme = useTheme();
  const oneday = 1000 * 60 * 60 * 24;
  const today = new Date();
  const now = today.getTime();
  const five_days_ago = new Date(now - oneday * 15);

  const [startDate, setStartDate] = useState<Date>(five_days_ago);
  const [endDate, setEndDate] = useState<Date>(today);

  const { data, isLoading, isSuccess, isError, error } =
    useGetCompletedWorkoutGroupsForUserByDateRangeQuery({
      id: "0",
      startDate: dateFormat(startDate),
      endDate: dateFormat(endDate),
    });

  const [allWorkouts, workoutTagStats, workoutNameStats] = useMemo(() => {
    if (data && data.length > 0) {
      let _allWorkouts: WorkoutCardProps[] = [];
      let _workoutTagStats: {}[] = [];
      let _workoutNameStats: {}[] = [];
      const calc = new CalcWorkoutStats();

      data.forEach((workoutGroup: WorkoutGroupProps) => {
        const workouts: WorkoutCardProps[] =
          (workoutGroup.completed_workouts
            ? workoutGroup.completed_workouts
            : workoutGroup.workouts) ?? [];

        _allWorkouts.push(...workouts); // Collect all workouts for bar data

        calc.calcMulti(workouts);
        const [tags, names] = calc.getStats();
        _workoutTagStats.push({ ...tags, date: workoutGroup.for_date });
        _workoutNameStats.push({ ...names, date: workoutGroup.for_date });
        calc.reset();
      });
      return [_allWorkouts, _workoutTagStats, _workoutNameStats];
    }
    return [[], [], []];
  }, [data]);

  // console.log('\n\n', 'WorkotuTag Stats: ', workoutTagStats, '\n\n');

  const [tags, names] = useMemo(() => {
    const calc = new CalcWorkoutStats();
    calc.calcMulti(allWorkouts);
    return calc.getStats();
  }, [allWorkouts, data]);

  const tagLabels: string[] = Array.from(new Set(Object.keys(tags)));
  const nameLabels: string[] = Array.from(new Set(Object.keys(names)));

  // I dont need to show all of these
  // This is on both Bar and Line Chart....
  // But if the current dataset shows zero for one of these, it should not show.
  const dataTypes = [
    "totalDistanceM",
    "totalKgM",
    "totalKgSec",
    "totalKgs",
    "totalLbM",
    "totalLbSec",
    "totalLbs",
    "totalReps",
    "totalTime",
  ];

  // Abbrev. for dataTypes
  const dataTypeYAxisSuffix = [
    "m",
    "kg*m",
    "kg*sec",
    "kgs",
    "lb*m",
    "lb*sec",
    "lbs",
    "reps",
    "sec",
  ];

  const dataReady = workoutTagStats.length || workoutNameStats.length;

  return (
    <ScreenContainer>
      {/* Date Picker */}
      <BannerAddMembership />
      <View style={{ flex: 2, width: "100%", alignItems: "center" }}>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            height: 24,
            backgroundColor: theme.palette.darkGray,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 15,
            borderBottomWidth: 2,
            borderColor: theme.palette.text,
          }}
        >
          <View style={{ flex: 1 }}>
            <TSCaptionText
              textStyles={{ textAlign: "center", paddingLeft: 16 }}
            >
              Start Date
            </TSCaptionText>
          </View>
          <View style={{ flex: 1 }}>
            <TSCaptionText
              textStyles={{ textAlign: "center", paddingLeft: 16 }}
            >
              End Date
            </TSCaptionText>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            width: "100%",
            backgroundColor: theme.palette.darkGray,
            justifyContent: "center",
            alignItems: "center",
            borderBottomWidth: 2,
            borderColor: theme.palette.text,
            marginBottom: 15,
          }}
        >
          <DatePicker
            date={startDate}
            onDateChange={setStartDate}
            mode="date"
            locale="en"
            theme="dark"
            maximumDate={new Date(new Date().getTime() + oneday)}
            style={{
              flex: 1,
              height: SCREEN_HEIGHT * 0.06,
              transform: [{ scale: 0.65 }],
            }}
          />
          <DatePicker
            date={endDate}
            onDateChange={setEndDate}
            mode="date"
            locale="en"
            theme="dark"
            style={{
              flex: 1,
              height: SCREEN_HEIGHT * 0.06,
              transform: [{ scale: 0.65 }],
            }}
          />
        </View>
      </View>

      <View style={{ flex: 8 }}>
        <View style={{ height: 20 }}>
          <TSCaptionText>
            Found {dataReady ? data?.length : 0}{" "}
            {dataReady && data?.length == 1 ? "workout" : "workouts"}
          </TSCaptionText>
        </View>

        <ScrollView>
          {dataReady ? (
            <>
              {Platform.OS === "ios" ? (
                <></>
              ) : (
                <FreqCalendar
                  startDate={startDate}
                  endDate={endDate}
                  data={data}
                />
              )}

              <View style={{ marginBottom: 24 }}>
                <StatsPanel tags={tags} names={names} />
              </View>

              <TotalsBarChart dataTypes={dataTypes} tags={tags} names={names} />

              <View
                style={{
                  width: "100%",
                  borderBottomWidth: 1,
                  borderColor: theme.palette.text,
                  marginVertical: 8,
                }}
              ></View>

              <TotalsLineChart
                dataTypes={dataTypes}
                nameLabels={nameLabels}
                tagLabels={tagLabels}
                dataTypeYAxisSuffix={dataTypeYAxisSuffix}
                workoutNameStats={workoutNameStats}
                workoutTagStats={workoutTagStats}
              />

              <View
                style={{
                  width: "100%",
                  borderBottomWidth: 1,
                  borderColor: theme.palette.text,
                  marginVertical: 8,
                }}
              ></View>

              <TotalsPieChart dataTypes={dataTypes} tags={tags} names={names} />
            </>
          ) : (
            <></>
          )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
};

export default StatsScreen;
