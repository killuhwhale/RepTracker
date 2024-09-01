import React, { FunctionComponent } from "react";
import { TouchableOpacity, View } from "react-native";
import { useTheme } from "styled-components";
import { WorkoutGroupCardProps } from "@/src/app_components/Cards/types";

import FilterGrid from "@/src/app_components/Grids/FilterGrid";
import { WorkoutGroupSquares } from "@/src/app_components/Grids/GymClasses/WorkoutGroupSquares";
import {
  useGetProfileViewQuery,
  useGetProfileWorkoutGroupsQuery,
} from "@/src/redux/api/apiSlice";
import {
  TSParagrapghText,
  TSCaptionText,
} from "@/src/app_components/Text/Text";
import { RegularButton } from "@/src/app_components/Buttons/buttons";

import Icon from "react-native-vector-icons/Ionicons";
import BannerAddMembership from "@/src/app_components/ads/BannerAd";
import { router, useNavigation } from "expo-router";

const UserWorkoutsScreen: FunctionComponent = (props) => {
  const theme = useTheme();

  const {
    data: dataWG,
    isLoading: isLoadingWG,
    isSuccess: isSuccessWG,
    isError: isErrorWG,
    error: errorWG,
  } = useGetProfileWorkoutGroupsQuery("");

  const { data, isLoading, isSuccess, isError, error } =
    useGetProfileViewQuery("");

  const _userWorkouts =
    !isLoadingWG && isSuccessWG
      ? ([
          ...dataWG.workout_groups?.created_workout_groups,
          ...dataWG.workout_groups?.completed_workout_groups,
        ] as WorkoutGroupCardProps[])
      : [];

  const userWorkouts = _userWorkouts.sort((a, b) =>
    a.for_date > b.for_date ? -1 : 1
  );

  const navigation = useNavigation();

  const handleNavCreateWorkoutGroupScreen = () => {
    console.log("Navigating to CreateWorkoutGroupScreen");
    router.push({
      pathname: "/input_pages/gyms/CreateWorkoutGroupScreen",
      params: {
        ownedByClass: 0,
        ownerID: data.user.id as string,
      },
    });
  };

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        flex: 1,
        backgroundColor: theme.palette.backgroundColor,
      }}
    >
      <BannerAddMembership />
      {userWorkouts.length ? (
        <View style={{ padding: 12, flex: 1, height: "100%", width: "100%" }}>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity
              activeOpacity={0.69}
              onPress={handleNavCreateWorkoutGroupScreen}
              style={{
                backgroundColor: theme.palette.accent,
                padding: 4,
                borderRadius: 112,
              }}
            >
              <Icon
                name="add"
                color={theme.palette.text}
                style={{ fontSize: 24 }}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 10 }}>
            <FilterGrid
              searchTextPlaceHolder="Search Workouts"
              uiView={WorkoutGroupSquares}
              items={userWorkouts}
              extraProps={{
                editable: true,
              }}
            />
          </View>
        </View>
      ) : (
        <View
          style={{ height: "100%", width: "100%", justifyContent: "center" }}
        >
          <TSCaptionText textStyles={{ textAlign: "center", marginBottom: 22 }}>
            No workouts!
          </TSCaptionText>
          {data && !isLoading ? (
            <View style={{ width: "50%", alignSelf: "center" }}>
              <RegularButton
                underlayColor="#cacaca30"
                btnStyles={{
                  backgroundColor: "#cacaca00",
                  borderTopColor: "#cacaca92",
                  borderBottomColor: "#cacaca92",
                  borderWidth: 2,
                  width: "100%",
                }}
                onPress={() => {
                  router.push({
                    pathname: "/input_pages/gyms/CreateWorkoutGroupScreen",
                    params: {
                      ownedByClass: 0,
                      ownerID: data.user.id,
                    },
                  });
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Icon
                    name="add"
                    color={theme.palette.text}
                    style={{ fontSize: 32, marginRight: 16 }}
                  />
                  <TSParagrapghText>New workout</TSParagrapghText>
                </View>
              </RegularButton>
            </View>
          ) : (
            <></>
          )}
        </View>
      )}
    </View>
  );
};

export default UserWorkoutsScreen;
