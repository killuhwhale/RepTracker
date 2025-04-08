import React, {
  FunctionComponent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { useTheme } from "styled-components/native";
import {
  WorkoutGroupCardProps,
  WorkoutGroupProps,
} from "@/src/app_components/Cards/types";

import FilterGrid from "@/src/app_components/Grids/FilterGrid";
import { WorkoutGroupSquares } from "@/src/app_components/Grids/WorkoutGroups/WorkoutGroupSquares";
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
import { router } from "expo-router";
import twrnc from "twrnc";
import { TestIDs } from "@/src/utils/constants";

/** Must match backend!!!
 *
 * class WorkoutGroupPagination(PageNumberPagination):
    page_size = 1

 */
const PAGE_SIZE = 20;

const UserWorkoutsScreen: FunctionComponent = (props) => {
  const theme = useTheme();

  const [page, setPage] = useState(1);
  const {
    data: dataWG,
    isLoading: isLoadingWG,
    isSuccess: isSuccessWG,
    isError: isErrorWG,
    error: errorWG,
  } = useGetProfileWorkoutGroupsQuery(page);

  const [workouts, setWorkouts] = useState<WorkoutGroupProps[]>([]);
  const maxPage = Math.ceil((dataWG?.count ? dataWG?.count : 1) / PAGE_SIZE);

  const loadMore = () => {
    if (!isLoadingWG && dataWG?.next) {
      console.log("Loading more: maxPage: ", maxPage, dataWG?.count, PAGE_SIZE);
      setPage(Math.min(maxPage, page + 1));
    }
  };

  const currentWorkoutGroupsRef = useRef<{ [key: number]: number }>({});
  // Update workout list when new data arrives
  useEffect(() => {
    if (dataWG && dataWG?.results && dataWG?.results.length > 0) {
      setWorkouts((prevWorkouts) => {
        const newWorkouts: WorkoutGroupProps[] = [];

        [...dataWG?.results].map((wgRes: WorkoutGroupProps) => {
          if (!(wgRes.id in currentWorkoutGroupsRef.current)) {
            newWorkouts.push(wgRes);
            currentWorkoutGroupsRef.current[wgRes.id] = 1;
          }

          return wgRes;
        });

        return [...prevWorkouts, ...newWorkouts].sort((a, b) =>
          a.for_date > b.for_date ? -1 : 1
        );
      });
    } else {
      setWorkouts([]);
    }
  }, [dataWG]);

  let userWorkouts =
    !isLoadingWG && isSuccessWG && dataWG && dataWG?.results
      ? ([...dataWG?.results] as WorkoutGroupCardProps[])
      : [];

  // console.log("dataWG: ", dataWG);

  const { data, isLoading, isSuccess, isError, error } =
    useGetProfileViewQuery("");

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
      <View style={{ padding: 12, flex: 10, height: "100%", width: "100%" }}>
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
              backgroundColor: theme.palette.AWE_Green,
              padding: 4,
              borderRadius: 112,
            }}
          >
            <Icon
              name="add"
              testID={TestIDs.CreateWorkoutGroupScreenBtn.name()}
              color={theme.palette.text}
              style={{ fontSize: 20 }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <FilterGrid
            searchTextPlaceHolder="Search Workouts"
            uiView={WorkoutGroupSquares}
            items={workouts}
            loadMore={loadMore}
            extraProps={{
              editable: true, // not useful, not going to use
            }}
          />
        </View>
      </View>
      {userWorkouts.length ? (
        <></>
      ) : isLoadingWG || dataWG?.count > 0 ? (
        <View
          style={{
            flex: 10,
            height: "100%",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="small" color={theme.palette.text} />
        </View>
      ) : (
        <View
          style={{
            flex: 60,
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
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
