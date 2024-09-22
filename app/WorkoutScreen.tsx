import React, { FunctionComponent, useMemo, useRef, useState } from "react";
import styled from "styled-components/native";
import {
  COMPLETED_WORKOUT_MEDIA,
  Container,
  MEDIA_CLASSES,
  WORKOUT_MEDIA,
  CalcWorkoutStats,
  formatLongDate,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  lightRed,
  red,
  green,
} from "../src/app_components/shared";
import {
  TSCaptionText,
  TSParagrapghText,
  LargeText,
  TSTitleText,
  TSDateText,
} from "../src/app_components/Text/Text";

import { useTheme } from "styled-components";
import { WorkoutCardFullList } from "../src/app_components/Cards/cardList";

import { RootStackParamList } from "../src/navigators/RootStack";
import { StackScreenProps } from "@react-navigation/stack";
import {
  WorkoutCardProps,
  WorkoutDualItemProps,
  WorkoutGroupCardProps,
  WorkoutGroupProps,
  WorkoutItemProps,
  WorkoutItems,
} from "../src/app_components/Cards/types";
import { ScrollView } from "react-native-gesture-handler";
import {
  Switch,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  useDeleteCompletedWorkoutGroupMutation,
  useDeleteWorkoutGroupMutation,
  useFinishWorkoutGroupMutation,
  useGetCompletedWorkoutByWorkoutIDQuery,
  useGetCompletedWorkoutQuery,
  useGetUserInfoQuery,
  useGetWorkoutsForGymClassWorkoutGroupQuery,
  useGetWorkoutsForUsersWorkoutGroupQuery,
} from "../src/redux/api/apiSlice";

import Icon from "react-native-vector-icons/Ionicons";

import { MediaURLSliderClass } from "../src/app_components/MediaSlider/MediaSlider";
import ActionCancelModal from "../src/app_components/modals/ActionCancelModal";
import { StatsPanel } from "../src/app_components/Stats/StatsPanel";
import { RegularButton } from "../src/app_components/Buttons/buttons";
import { TestIDs } from "../src/utils/constants";
import BannerAddMembership from "../src/app_components/ads/BannerAd";
import FinishDualWorkoutItems from "../src/app_components/modals/finishDualWorkoutItems";
import { router, useLocalSearchParams } from "expo-router";
import DuplicateWorkoutGroupModal from "@/src/app_components/modals/DuplicateWorkoutGroupModal";
import { dateFormatDayOfWeek } from "@/src/utils/algos";
export type Props = StackScreenProps<RootStackParamList, "WorkoutScreen">;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const hasUnfinsihedDualItems = (workouts: WorkoutCardProps[]) => {
  let found = false;
  workouts.forEach((workout) => {
    if (workout.scheme_type > 2) {
      //  Check dualItems
      workout.workout_items?.forEach((item: WorkoutDualItemProps) => {
        if (!item.finished) {
          found = true;
        }
      });
    }
  });
  return found;
};

type WSHeaderProps = {
  oGIsSuccess: boolean;
  completedIsSuccess: boolean;
  showingOGWorkoutGroup: boolean;
  oGIsLoading: boolean;
  isFinished: boolean;
  personalWorkout: boolean;
  WGOwner: boolean;
  workoutGroup: WorkoutGroupCardProps;
  setShowingOGWorkoutGroup: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirmDelete(): void;
  setShowDuplicateModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const WorkoutScreenHeader: FunctionComponent<WSHeaderProps> = ({
  oGIsSuccess,
  completedIsSuccess,
  showingOGWorkoutGroup,
  oGIsLoading,
  workoutGroup,
  isFinished,
  personalWorkout,
  WGOwner,
  setShowingOGWorkoutGroup,
  onConfirmDelete,
  setShowDuplicateModal,
}) => {
  const theme = useTheme();
  return (
    <View style={{ flex: 1, width: "100%", height: "100%" }}>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "center",
          marginTop: 16,
        }}
      >
        <View style={{ flex: 1, justifyContent: "center", width: "100%" }}>
          {oGIsSuccess && completedIsSuccess ? (
            <TouchableHighlight
              onPress={() => setShowingOGWorkoutGroup(!showingOGWorkoutGroup)}
            >
              <View style={{ width: "100%", alignItems: "center" }}>
                <Icon
                  name="podium"
                  color={
                    showingOGWorkoutGroup && !oGIsLoading
                      ? theme.palette.text
                      : "red"
                  }
                  style={{ fontSize: 24 }}
                />

                <TSCaptionText textStyles={{ textAlign: "center" }}>
                  {showingOGWorkoutGroup && !oGIsLoading ? "og" : "completed"}
                </TSCaptionText>
              </View>
            </TouchableHighlight>
          ) : (
            <></>
          )}
        </View>

        <View style={{ flex: 3 }}>
          <TSTitleText textStyles={{ textAlign: "center", marginVertical: 8 }}>
            {workoutGroup.title}
          </TSTitleText>
        </View>

        <View
          style={{
            flex: 1,
            width: "100%",
            justifyContent: "flex-end",
            flexDirection: "row",
            paddingLeft: 12,
          }}
        >
          {showingOGWorkoutGroup &&
          !oGIsLoading &&
          isFinished &&
          !personalWorkout ? (
            // Currently nothing will happen
            <Icon
              name="rocket"
              color={
                completedIsSuccess
                  ? theme.palette.primary.main
                  : theme.palette.text
              }
              style={{ fontSize: 24, marginRight: 16 }}
              onPress={
                completedIsSuccess || (!isFinished && personalWorkout)
                  ? () => {
                      console.log("Not implemented WorkoutScreen rocket icon");
                    }
                  : () => {
                      console.log("Not implemented WorkoutScreen rocket icon");
                    } // navigateToCompletedWorkoutGroupScreen
              }
            />
          ) : (
            <></>
          )}
        </View>
      </View>

      {WGOwner ? (
        <View
          style={{
            flex: 2,
            flexDirection: "row",
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
          <View
            style={{
              flex: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
          ></View>
          {isFinished ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon
                style={{ fontSize: 24 }}
                name="copy-outline"
                color={theme.palette.primary.main}
                onPress={() => setShowDuplicateModal(true)}
              />
              <TSCaptionText textStyles={{ textAlign: "center" }}>
                Duplicate
              </TSCaptionText>
            </View>
          ) : (
            <></>
          )}
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Icon
              style={{ fontSize: 24 }}
              name="close-circle-outline"
              color="red"
              onPress={onConfirmDelete}
              testID={TestIDs.DeleteWorkoutBtn.name()}
            />
            <TSCaptionText textStyles={{ textAlign: "center" }}>
              Delete
            </TSCaptionText>
          </View>
        </View>
      ) : (
        <></>
      )}
    </View>
  );
};

const WorkoutScreen: FunctionComponent = () => {
  const params = useLocalSearchParams();
  const { id } = params || {}; // Workout group

  const theme = useTheme();
  const [showClassIsDeleted, setShowClassIsDeleted] = useState(false);
  const [curGroupID, setCurGroupID] = useState(id);
  const [showFinishDualWorkoutItems, setShowFinishDualWorkoutItems] =
    useState(false);

  const {
    data: userData,
    isLoading: userIsloading,
    isSuccess: userIsSuccess,
    isError: userIsError,
    error: userError,
  } = useGetUserInfoQuery("");

  let mediaClass = -1;
  let isShowingOGWorkoutGroup = true;

  // Data to use for View
  let oGData = {} as WorkoutGroupProps;
  let oGIsLoading = true;
  let oGIsSuccess = false;
  let oGIsError = false;
  let oGError: any = "";

  const {
    data,
    isLoading: dataIsLoading,
    isSuccess,
    isError,
    error,
  } = useGetWorkoutsForUsersWorkoutGroupQuery(curGroupID);

  oGData = data;
  oGIsLoading = dataIsLoading;
  oGIsSuccess = isSuccess;
  oGIsError = isError;
  oGError = error;

  let completedData = {} as WorkoutGroupProps;
  let completedIsLoading = true;
  let completedIsSuccess = false;
  let completedIsError = false;
  let completedError: any = "";

  const [finishWorkoutGroup, _isLoading] = useFinishWorkoutGroupMutation();

  // if (owned_by_class == undefined) {
  //   // WE have a completed workout group
  //   // console.log("WE have a completed workout group");
  //   // const { data, isLoading, isSuccess, isError, error } =
  //   //   useGetCompletedWorkoutQuery(id);
  //   // completedData = data;
  //   // completedIsLoading = isLoading;
  //   // completedIsSuccess = isSuccess;
  //   // completedIsError = isError;
  //   // completedError = error;

  //   // if (workout_group) {
  //   //   const { data, isLoading, isSuccess, isError, error } =
  //   //     useGetWorkoutsForGymClassWorkoutGroupQuery(workout_group);
  //   //   oGData = data;
  //   //   // console.log('Getting OG data...', data);
  //   //   if (data !== undefined) {
  //   //     console.log("Getting OG data...", data);
  //   //     if (data.err_type >= 0 && !showClassIsDeleted) {
  //   //       setShowClassIsDeleted(true);
  //   //       isShowingOGWorkoutGroup = false;
  //   //     }
  //   //   }

  //   //   // WHen OG workout is deleted {"err_type": 0, "error": "Failed get Gym class's workouts."}
  //   //   oGIsLoading = isLoading;
  //   //   oGIsSuccess = isSuccess;
  //   //   oGIsError = isError;
  //   //   oGError = error;
  //   // }

  //   // Fetch OG Workout by ID
  // } else if (owned_by_class) {
  //   // we have OG workout owneed by class
  //   // console.log('OG workout owneed by class');
  //   // const { data, isLoading, isSuccess, isError, error } =
  //   //   useGetWorkoutsForGymClassWorkoutGroupQuery(id);
  //   // // console.log('Owned by class, data: ', data);
  //   // oGData = data;
  //   // oGIsLoading = isLoading;
  //   // oGIsSuccess = isSuccess;
  //   // oGIsError = isError;
  //   // oGError = error;

  //   // // This 'completed' should come from ogData query.
  //   // const {
  //   //   data: dataCompleted,
  //   //   isLoading: isLoadingCompleted,
  //   //   isSuccess: isSuccessCompleted,
  //   //   isError: isErrorCompleted,
  //   //   error: errorCompleted,
  //   // } = useGetCompletedWorkoutByWorkoutIDQuery(id);

  //   // console.log('Completed data: ', dataCompleted);

  //   // if (dataCompleted && dataCompleted.completed_workouts?.length > 0) {
  //   //   completedData = dataCompleted;
  //   //   completedIsLoading = isLoadingCompleted;
  //   //   completedIsSuccess = isSuccessCompleted;
  //   //   completedIsError = isErrorCompleted;
  //   //   completedError = errorCompleted;
  //   // }
  // } else {
  //   // console.log("With this version, we only get owned_by_class == False....");
  //   // const { data, isLoading, isSuccess, isError, error } =
  //   //   useGetWorkoutsForUsersWorkoutGroupQuery(curGroupID);

  // }

  const title = oGData?.title ?? "";
  const [showingOGWorkoutGroup, setShowingOGWorkoutGroup] = useState(
    isShowingOGWorkoutGroup
  );

  const workoutGroup: WorkoutGroupProps =
    showingOGWorkoutGroup && oGData
      ? oGData
      : !showingOGWorkoutGroup && completedData
      ? completedData
      : ({} as WorkoutGroupProps);

  // const isOGWorkoutGroup = workoutGroup.workouts ? true : false
  mediaClass = showingOGWorkoutGroup ? WORKOUT_MEDIA : COMPLETED_WORKOUT_MEDIA;

  const [editable, setEditable] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const [deleteWorkoutGroupMutation, { isLoading: isDeleteOGWorkoutGroup }] =
    useDeleteWorkoutGroupMutation();
  const [
    deleteCompletedWorkoutGroup,
    { isLoading: isDeleteCompletedWorkoutGroup },
  ] = useDeleteCompletedWorkoutGroupMutation();
  const [deleteWorkoutGroupModalVisible, setDeleteWorkoutGroupModalVisible] =
    useState(false);
  const [showFinishWorkoutGroupModal, setShowFinishWorkoutGroupModal] =
    useState(false);

  const workouts = workoutGroup.workouts
    ? workoutGroup.workouts
    : workoutGroup.completed_workouts
    ? workoutGroup.completed_workouts
    : [];

  const [tags, names] = useMemo(() => {
    const calc = new CalcWorkoutStats();

    calc.calcMulti(workouts, workoutGroup.owned_by_class);

    return calc.getStats();
  }, [workouts]);

  // Show when:
  //  - OgWorkout is Finished
  //  - The oGworkout is not personally created by the current user
  const isFinished = workoutGroup.finished || false;

  // Used to determine if user is viewing their own workout.
  const personalWorkout =
    userData?.id == oGData?.owner_id && !oGData?.owned_by_class;

  // When a user is viewing a classWorkout and they are owner. Missing when the owner is viewing a WorkoutGroup that a class owns....
  // Figure out a better way to tell who is the owner. aybe this should come from the server....
  const WGOwner =
    (workoutGroup.owner_id == userData?.id && !workoutGroup.owned_by_class) ||
    (workoutGroup.user_owner_id == userData?.id &&
      workoutGroup.owned_by_class) ||
    Object.keys(workoutGroup).indexOf("completed_workouts") >= 0;

  const navToWorkoutScreenWithItems = (
    workoutGroupID: string,
    workoutGroupTitle: string,
    workoutID: string,
    schemeType: number,
    items: WorkoutItems,
    workoutTitle: string,
    workoutDesc: string,
    scheme_rounds: string,
    instruction: string
  ) => {
    router.navigate({
      pathname: "/input_pages/gyms/CreateWorkoutScreen",
      params: {
        workoutGroupID,
        workoutGroupTitle,
        workoutID,
        schemeType,
        initItems: JSON.stringify(items),
        workoutTitle,
        workoutDesc,
        scheme_rounds,
        instruction,
      },
    });
  };

  const navToWorkoutScreen = (
    workoutGroupID: string,
    workoutGroupTitle: string,
    schemeType: number
  ) => {
    router.navigate({
      pathname: "/input_pages/gyms/CreateWorkoutScreen",
      params: {
        workoutGroupID,
        workoutGroupTitle,
        schemeType,
        workoutTitle: "",
        workoutDesc: "",
        initItems: JSON.stringify([]),
      },
    });
  };

  const openCreateWorkoutScreenForStandard = () => {
    navToWorkoutScreen(oGData.id.toString(), title, 0);
  };
  const openCreateWorkoutScreenForReps = () => {
    navToWorkoutScreen(oGData.id.toString(), title, 1);
  };
  const openCreateWorkoutScreenForRounds = () => {
    navToWorkoutScreen(oGData.id.toString(), title, 2);
  };
  const openCreateWorkoutScreenCreative = () => {
    navToWorkoutScreen(oGData.id.toString(), title, 3);
  };
  const openCreateWorkoutScreenForTimeScore = () => {
    navToWorkoutScreen(oGData.id.toString(), title, 4);
  };

  const openCreateWorkoutScreenForTimeLimit = () => {
    navToWorkoutScreen(oGData.id.toString(), title, 5);
  };

  const onConfirmDelete = () => {
    setDeleteWorkoutGroupModalVisible(true);
  };

  const disableDeleteBtnRed = useRef(false);
  const onDelete = async () => {
    if (showingOGWorkoutGroup && !disableDeleteBtnRed.current) {
      disableDeleteBtnRed.current = true;
      const delData = new FormData();
      delData.append("owner_id", oGData.owner_id);
      delData.append("owned_by_class", oGData.owned_by_class);
      delData.append("id", oGData.id);
      console.log("Deleteing workout GORUP", delData);
      const deletedWorkoutGroup = await deleteWorkoutGroupMutation(
        delData
      ).unwrap();
      console.log("Deleting result: ", deletedWorkoutGroup);
    } else {
      const delData = new FormData();
      delData.append("owner_id", completedData.owner_id);
      delData.append("owned_by_class", completedData.owned_by_class);
      delData.append("id", completedData.id);
      console.log("Deleteing completed workout GORUP", delData);
      const deletedWorkoutGroup = await deleteCompletedWorkoutGroup(
        delData
      ).unwrap();
      console.log("Del WG res: ", deletedWorkoutGroup);
    }
    setDeleteWorkoutGroupModalVisible(false);
    disableDeleteBtnRed.current = false;
    router.push("/");
  };

  const promptUpdateDualItems = () => {
    const shouldShow = hasUnfinsihedDualItems(workouts);
    if (shouldShow) {
      console.log(
        "User needs to submit their results if this is not owned by a class"
      );
      console.log("Workouts length: ", workoutGroup.workouts?.length);
      // Show a modal to allow the user to enter the information for the workouts
      setShowFinishDualWorkoutItems(true);
    }

    console.log("Should prompt user to complete dual items: ", shouldShow);
    return shouldShow;
  };

  const _finishGroupWorkout = async () => {
    // console.log(
    //   'Need to check......: ',
    //   hasUnfinsihedDualItems(workouts),
    //   workouts,
    // );

    // Allow user to submit finish to WorkoutGroup for class.
    const data = new FormData();
    data.append("group", oGData.id.toString());
    try {
      const res = await finishWorkoutGroup(data).unwrap();
      console.log("res finsih", res);
      setShowFinishWorkoutGroupModal(false);
    } catch (err) {
      console.log("Error finishing workout", err);
    }
  };

  const navigateToCompletedWorkoutGroupScreen = () => {
    console.log("Sending data to screen: ", oGData);
    if (oGData && Object.keys(oGData).length > 0) {
      // navigation.navigate('CreateCompletedWorkoutScreen', oGData);
      console.log(
        "Should be navigating to // navigation.navigate('CreateCompletedWorkoutScreen', oGData);"
      );
    }
  };

  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  const onDuplicateGroup = (groupID: number) => {
    // setCurGroupID(groupID.toString());
    router.push({
      pathname: "/WorkoutScreen",
      params: {
        id: groupID,
      },
    });
  };

  return (
    <View
      style={{
        height: "100%",
        width: SCREEN_WIDTH,
      }}
    >
      <BannerAddMembership />
      <ScrollView
        style={{
          backgroundColor: theme.palette.backgroundColor,
          height: "100%",
        }}
        testID={TestIDs.WorkoutScreenScrollView.name()}
        contentContainerStyle={{
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flexShrink: 1, flexGrow: 2, flexBasis: 0 }}>
            <WorkoutScreenHeader
              WGOwner={WGOwner}
              completedIsSuccess={completedIsSuccess}
              isFinished={isFinished}
              oGIsLoading={oGIsLoading}
              oGIsSuccess={oGIsSuccess}
              onConfirmDelete={onConfirmDelete}
              personalWorkout={personalWorkout}
              setShowingOGWorkoutGroup={setShowingOGWorkoutGroup}
              showingOGWorkoutGroup={showingOGWorkoutGroup}
              workoutGroup={workoutGroup}
              setShowDuplicateModal={setShowDuplicateModal}
            />
          </View>

          {/* {workoutGroup.media_ids &&
          JSON.parse(workoutGroup.media_ids).length > 0 ? (
            <Row style={{height: 300}}>
              <MediaURLSliderClass
                data={JSON.parse(workoutGroup.media_ids)}
                mediaClassID={workoutGroup.id}
                mediaClass={MEDIA_CLASSES[mediaClass]}
              />
            </Row>
          ) : (
            <View style={{margin: 69}}>
              <TSCaptionText>Add some pictures next time!</TSCaptionText>
            </View>
          )} */}

          <View
            style={{
              width: "100%",
              alignItems: "flex-end",
              flexShrink: 1,
              flexGrow: 2,
              flexBasis: 0,
            }}
          >
            <TSDateText>
              {dateFormatDayOfWeek(new Date(workoutGroup.for_date))}
            </TSDateText>
          </View>

          <View
            style={{
              width: "100%",
              alignItems: "flex-start",
              padding: 6,
              marginBottom: 12,
              flexShrink: 1,
              flexGrow: 2,
              flexBasis: 0,
            }}
          >
            <TSCaptionText>{workoutGroup.caption}</TSCaptionText>
          </View>

          <View style={{ flexShrink: 1, flexGrow: 5, flexBasis: 0 }}>
            {oGData && showingOGWorkoutGroup && oGData.finished === false ? (
              <View
                style={{
                  flex: 2,
                  flexDirection: "row",
                  marginBottom: 12,
                  justifyContent: "flex-end",
                  alignContent: "flex-end",
                  alignItems: "flex-end",
                  width: "100%",
                }}
              >
                <View
                  style={{
                    flexDirection: "column",

                    width: "80%",
                  }}
                >
                  <View
                    style={{
                      display: showCreate ? "flex" : "none",
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <View style={{ width: "30%", padding: 6 }}>
                      <RegularButton
                        onPress={openCreateWorkoutScreenForStandard.bind(this)}
                        testID={TestIDs.CreateRegularWorkoutBtn.name()}
                        btnStyles={{
                          backgroundColor: "#4285F4",
                        }}
                        text="Standard"
                      />
                    </View>
                    <View style={{ width: "30%", padding: 6 }}>
                      <RegularButton
                        onPress={openCreateWorkoutScreenForReps.bind(this)}
                        btnStyles={{
                          backgroundColor: "#DB4437",
                        }}
                        text="Reps"
                      />
                    </View>
                  </View>

                  <View
                    style={{
                      display: showCreate ? "flex" : "none",
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <View style={{ width: "30%", padding: 6 }}>
                      <RegularButton
                        onPress={openCreateWorkoutScreenForRounds.bind(this)}
                        btnStyles={{
                          backgroundColor: "#F4B400",
                        }}
                        text="Rounds"
                      />
                    </View>
                    <View style={{ width: "30%", padding: 6 }}>
                      <RegularButton
                        onPress={openCreateWorkoutScreenCreative.bind(this)}
                        btnStyles={{
                          backgroundColor: "#0F9D58",
                        }}
                        text="Creative"
                      />
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: showCreate ? "column" : "row",
                    justifyContent: "center",
                    height: "100%",
                    marginRight: 8,
                    paddingRight: 8,
                  }}
                >
                  <View style={{ marginHorizontal: 6 }}>
                    <RegularButton
                      onPress={() => setShowCreate(!showCreate)}
                      testID={TestIDs.ToggleShowCreateWorkoutBtns.name()}
                      btnStyles={{
                        backgroundColor: showCreate
                          ? theme.palette.gray
                          : green,
                      }}
                      text={showCreate ? "X" : "Add Workout"}
                    />
                  </View>
                  {workouts.length > 0 ? (
                    <View style={{ marginHorizontal: 6 }}>
                      <RegularButton
                        onPress={() => setShowFinishWorkoutGroupModal(true)}
                        textStyles={{ marginHorizontal: 12 }}
                        btnStyles={{
                          backgroundColor: theme.palette.primary.main,
                          display: !showCreate ? "flex" : "none",
                        }}
                        text="Finish"
                      />
                    </View>
                  ) : (
                    <></>
                  )}
                </View>
              </View>
            ) : (
              <></>
            )}

            {oGData && oGData.finished ? (
              <></>
            ) : (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  width: "100%",
                  marginBottom: 12,
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                {workouts.length ? (
                  <TouchableWithoutFeedback
                    onPress={() => setEditable(!editable)}
                  >
                    <View style={{ alignItems: "flex-end", marginRight: 16 }}>
                      <Switch
                        value={editable}
                        onValueChange={(v) => {
                          setEditable(!editable);
                        }}
                        trackColor={{
                          true: theme.palette.primary.contrastText,
                          false: theme.palette.primary.contrastText,
                        }}
                        thumbColor={editable ? red : theme.palette.gray}
                      />
                      <TSCaptionText
                        textStyles={{ color: editable ? red : "white" }}
                      >
                        Delete mode
                        {editable
                          ? ": hold title of workout below to remove."
                          : ""}
                      </TSCaptionText>
                    </View>
                  </TouchableWithoutFeedback>
                ) : (
                  <></>
                )}
              </View>
            )}
          </View>

          <Row style={{ width: "100%", borderRadius: 8 }} />

          <View style={{ flexShrink: 1, flexGrow: 5, flexBasis: 0 }}>
            {workouts.length ? (
              <>
                <Row style={{ width: "100%" }}>
                  <TSTitleText textStyles={{ marginLeft: 6 }}>
                    Stats
                  </TSTitleText>
                </Row>

                <View
                  style={{
                    flex: 4,
                    width: "100%",
                    borderRadius: 8,
                    // backgroundColor: theme.palette.gray,
                    paddingVertical: 20,
                    paddingLeft: 10,
                  }}
                >
                  <Row>
                    <StatsPanel tags={tags} names={names} />
                  </Row>
                </View>

                <Row style={{ width: "100%", borderRadius: 8 }} />

                <Row style={{ width: "100%" }}>
                  <TSTitleText textStyles={{ marginLeft: 6 }}>
                    Workouts
                  </TSTitleText>
                </Row>

                <Row style={{ width: "100%" }}>
                  {(showingOGWorkoutGroup && oGIsLoading) ||
                  (!showingOGWorkoutGroup && completedIsLoading) ? (
                    <TSCaptionText>Loading....</TSCaptionText>
                  ) : (showingOGWorkoutGroup && oGIsSuccess) ||
                    (!showingOGWorkoutGroup && completedIsSuccess) ? (
                    <WorkoutCardFullList
                      data={workouts}
                      editable={editable}
                      group={workoutGroup}
                      navToWorkoutScreenWithItems={navToWorkoutScreenWithItems}
                    />
                  ) : (showingOGWorkoutGroup && oGIsError) ||
                    (!showingOGWorkoutGroup && completedIsError) ? (
                    <TSCaptionText>
                      Error.... {oGError.toString() | completedError.toString()}
                    </TSCaptionText>
                  ) : (
                    <TSCaptionText>No Data</TSCaptionText>
                  )}
                </Row>
              </>
            ) : (
              <></>
            )}
          </View>
        </View>

        <ActionCancelModal
          actionText="Delete"
          closeText="Close"
          modalText={`Delete ${title}${showingOGWorkoutGroup ? "" : ""}?`}
          onAction={onDelete}
          modalVisible={deleteWorkoutGroupModalVisible}
          onRequestClose={() => setDeleteWorkoutGroupModalVisible(false)}
        />

        <ActionCancelModal
          actionText="Finish"
          closeText="Close"
          modalText={`Finish ${title}?`}
          onAction={() => {
            setShowFinishWorkoutGroupModal(false);
            if (!promptUpdateDualItems()) {
              _finishGroupWorkout()
                .then((res) => console.log("workout group finished", res))
                .catch((err) => console.log("Failed to finish workout: ", err));
            }
          }}
          modalVisible={showFinishWorkoutGroupModal}
          onRequestClose={() => setShowFinishWorkoutGroupModal(false)}
        />
      </ScrollView>

      <View
        style={{
          display: `${
            showClassIsDeleted && showingOGWorkoutGroup ? "flex" : "none"
          }`,
          position: "absolute",
          width: "100%",
          height: SCREEN_HEIGHT * 0.75,
          top: SCREEN_HEIGHT * 0.15,

          backgroundColor: "#4c0519",
        }}
      >
        <LargeText textStyles={{ marginTop: 32 }}>
          {" "}
          Wokout Deleted by Class{" "}
        </LargeText>
      </View>

      <DuplicateWorkoutGroupModal
        owner_id={oGData?.owner_id}
        actionText="Duplicate"
        closeText="Cancel"
        modalText="Duplicate Workout Group"
        modalVisible={showDuplicateModal}
        onRequestClose={() => setShowDuplicateModal(false)}
        key={"duplicatemodal"}
        workouts={workouts}
        onDuplicateGroup={onDuplicateGroup}
      />
      {workoutGroup.workouts && workoutGroup.workouts?.length > 0 ? (
        <FinishDualWorkoutItems
          bodyText="How many did you do?"
          workoutGroup={workoutGroup}
          key={"showFinishedDualItems"}
          closeText="Close"
          modalVisible={showFinishDualWorkoutItems}
          onRequestClose={() => setShowFinishDualWorkoutItems(false)}
          setShowFinishWorkoutGroupModal={() =>
            setShowFinishWorkoutGroupModal(false)
          }
        />
      ) : (
        <></>
      )}
    </View>
  );
};

export default WorkoutScreen;
