import React, { FunctionComponent, useState } from "react";
import {
  StyleSheet,
  View,
  Switch,
  ScrollView,
  TouchableWithoutFeedback,
  ActivityIndicator,
  TouchableHighlight,
} from "react-native";
import { useTheme } from "styled-components";
import styled from "styled-components/native";

import Icon from "react-native-vector-icons/Ionicons";
import {
  SmallText,
  TSCaptionText,
  TSListTitleText,
  TSParagrapghText,
  TSTitleText,
} from "../../../src/app_components/Text/Text";
import {
  Container,
  SCREEN_HEIGHT,
  WORKOUT_TYPES,
  STANDARD_W,
  ROUNDS_W,
  CREATIVE_W,
  REPS_W,
  numFilter,
  numFilterWithSpaces,
  parseNumList,
  jList,
  mdFontSize,
  limitTextLength,
  WorkoutDualItemCreativePenaltyLimit,
  WorkoutTitleLimit,
  WorkoutDescLimit,
  SchemeTextLimit,
  CreateSchemeInstructionLimit,
} from "../../../src/app_components/shared";

import {
  useCreateWorkoutMutation,
  useCreateWorkoutItemsMutation,
  useCreateWorkoutDualItemsMutation,
  useUpdateWorkoutMutation,
  useUpdateWorkoutItemsMutation,
  useUpdateWorkoutDualItemsMutation,
} from "../../../src/redux/api/apiSlice";

import { RootStackParamList } from "../../../src/navigators/RootStack";
import { StackScreenProps } from "@react-navigation/stack";
import {
  AnyWorkoutItem,
  WorkoutDualItemProps,
  WorkoutItemProps,
  WorkoutItems,
} from "../../../src/app_components/Cards/types";

import Input from "../../../src/app_components/Input/input";

import { TestIDs } from "../../../src/utils/constants";
import AddItem from "./AddWorkoutItemPanel";
import AlertModal from "../../../src/app_components/modals/AlertModal";
import CreateWorkoutItemList from "./workoutScreen/CreateWorkoutItemList";
import CreateWorkoutDualItemList from "./workoutScreen/CreateWorkoutDualItemList";
import SchemeField from "./workoutScreen/Schemes";
import { router, useLocalSearchParams } from "expo-router";

export type Props = StackScreenProps<RootStackParamList, "CreateWorkoutScreen">;

const PageContainer = styled(Container)`
  background-color: ${(props) => props.theme.palette.backgroundColor};
  justify-content: space-between;
  width: 100%;
`;

export const pickerStyle = StyleSheet.create({
  containerStyle: { color: "white" },
  itemStyle: {
    height: SCREEN_HEIGHT * 0.05,
    textAlign: "center",
    fontSize: 12,
  },
});

interface AddWorkoutItemProps {
  success: boolean;
  errorType: number;
  errorMsg: string;
}

const verifyWorkoutItem = (
  _item: WorkoutItemProps,
  schemeType: number,
  schemeRounds: string
): { success: boolean; errorType: number; errorMsg: string } => {
  // For standard workouts: weights must match sets per item...
  // Reps are single and weights are multiple
  if (WORKOUT_TYPES[schemeType] == STANDARD_W) {
    // check weights match sets 0 || 1 -> 1 or ==
    const itemSets = _item.sets;
    const weightList = parseNumList(_item.weights);
    console.log("Verifyin Standard_w", weightList, itemSets, weightList.length);

    if (itemSets != weightList.length && weightList.length != 1) {
      console.log("Not VALID!");
      return {
        success: false,
        errorType: 3,
        errorMsg:
          "The weights must match the number of sets \n\nFor Example\n1 set  ==> 50\n2 sets ==> 50 (same wt ea set)\n2 sets ==> 50 60\n3 sets ==> 50 60 70\n3 sets ==> 40 (same wt ea set)",
      };
    }
  }

  // For reps based workout,  weights must match repScheme, repscheme must be entered.
  // Reps are single and weights are multiple
  else if (WORKOUT_TYPES[schemeType] == REPS_W) {
    const weightList = parseNumList(_item.weights);
    console.log("Edit item verify: ", weightList);
    if (parseNumList(schemeRounds).length < 1) {
      return {
        success: false,
        errorType: 0,
        errorMsg: "Please add number of reps per round",
      };
    }

    if (
      weightList.length > 1 &&
      weightList.length !== parseNumList(schemeRounds).length
    ) {
      return {
        success: false,
        errorType: 2,
        errorMsg: "Weights must match repscheme",
      };
    }
  }

  // For rounds based workout, reps and weights must match repScheme
  // Reps and weights are multiple nums
  else if (WORKOUT_TYPES[schemeType] == ROUNDS_W) {
    // If scheme rounds have not been entered....
    console.log("Current shcemeRounds ", schemeRounds);
    if (!schemeRounds || schemeRounds.length == 0) {
      return {
        success: false,
        errorType: 0,
        errorMsg: "Please add number of rounds",
      };
    }

    // IF item does not match number of rounds
    // Ensure reps is 1 number of matches the number of roungs
    // Eg 5 Rounds => Reps [1] or [5,5,3,3,1] (different sets for each round)

    console.log("Bad item reps? ", _item.reps);
    const itemRepsList = parseNumList(_item.reps);
    const itemWeightsList = parseNumList(_item.weights);

    if (
      itemRepsList.length > 1 &&
      itemRepsList.length !== parseInt(schemeRounds)
    ) {
      console.log("Dont add item!", itemRepsList, schemeRounds);
      return { success: false, errorType: 1, errorMsg: "Match rounds" };
    }
    if (
      itemWeightsList.length > 1 &&
      itemWeightsList.length !== parseInt(schemeRounds)
    ) {
      console.log("Dont add item!", itemWeightsList, schemeRounds);
      return { success: false, errorType: 1, errorMsg: "Match rounds" };
    }
  }
  // For Time Based workouts, reps and weights should just be single, no check required.
  // Reps and weights are single
  return { success: true, errorType: -1, errorMsg: "" };
};

const uuid = () => Math.floor(Math.random() * 1000000).toString();

const appendUUID = (items: WorkoutItems) => {
  return items.map((item) => {
    return { ...item, uuid: uuid() };
  });
};

const CreateWorkoutScreen: FunctionComponent = () => {
  const theme = useTheme();
  const params = useLocalSearchParams();
  const {
    workoutGroupID: _workoutGroupID,
    workoutGroupTitle: _workoutGroupTitle,
    workoutID: _workoutID,
    schemeType: _schemeType,
    workoutTitle,
    workoutDesc,
    initItems,

    scheme_rounds,
    instruction: _instruction,
  } = params;

  const [workoutGroupID, workoutGroupTitle, workoutID, schemeType] = [
    _workoutGroupID as string,
    _workoutGroupTitle as string,
    _workoutID as string,
    parseInt(_schemeType as string),
  ];

  const _items: WorkoutItems = appendUUID(JSON.parse(initItems as string));
  const [items, setItems] = useState(_items);

  const [title, setTitle] = useState(workoutTitle as string);
  const [desc, setDesc] = useState(workoutDesc as string);
  const [schemeRounds, setSchemeRounds] = useState(scheme_rounds as string);
  const [instruction, setInstruction] = useState(_instruction as string);

  const [showAddSSID, setShowAddSSID] = useState(false);
  const [curColor, setCurColor] = useState(-1);
  const [createWorkout, { isLoading: workoutIsLoading }] =
    useCreateWorkoutMutation();
  const [updateWorkout, { isLoading: updateWorkoutIsLoading }] =
    useUpdateWorkoutMutation();
  const [createWorkoutItem, { isLoading: workoutItemIsLoading }] =
    useCreateWorkoutItemsMutation();
  const [updateWorkoutItem, { isLoading: updateWorkoutItemIsLoading }] =
    useUpdateWorkoutItemsMutation();

  const [createWorkoutDualItem, { isLoading: workoutDualItemIsLoading }] =
    useCreateWorkoutDualItemsMutation();

  const [updateWorkoutDualItem, { isLoading: updateWorkoutDualItemIsLoading }] =
    useUpdateWorkoutDualItemsMutation();

  const [schemeRoundsError, setSchemeRoundsError] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [createWorkoutError, setCreateWorkoutError] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const _createWorkoutWithItems = async (_isUpdateMode: boolean) => {
    // Need to get file from the URI
    if (items.length == 0 || items.length > 15) return setShowAlert(true);
    setIsCreating(true);

    const workoutData = new FormData();
    const data = new FormData();
    workoutData.append("group", workoutGroupID);
    workoutData.append("title", title);
    workoutData.append("desc", desc);
    workoutData.append("instruction", instruction ?? "");
    workoutData.append("scheme_type", schemeType.toString());
    workoutData.append("scheme_rounds", schemeRounds);

    if (_isUpdateMode) {
      workoutData.append("id", workoutID);
    }

    console.log(
      "Creatting workout with Group ID and Data: ",
      workoutGroupID,
      workoutData
    );

    // Create Workout
    // 1. Create Workout
    // 2. Then Create workout items...

    // Update Workout
    // 1. Update Workout: title, desc, rep_shceme, instructions
    // 2. Then Create workout items...

    try {
      const data = new FormData();

      let createdWorkout = null;
      if (_isUpdateMode) {
        if (
          title != workoutTitle ||
          desc != workoutDesc ||
          instruction != instruction ||
          schemeRounds != scheme_rounds
        ) {
          console.log("Updating workout! updateWorkout");
          createdWorkout = await updateWorkout(workoutData).unwrap();
        }
      } else {
        createdWorkout = await createWorkout(workoutData).unwrap();
      }

      console.log("Workout res ", createdWorkout);

      if (!createdWorkout) {
        // Use Default Workout, only the workoutID is needed below
        createdWorkout = {
          date: "",
          desc: "",
          group: "",
          id: workoutID,
          instruction: "",
          scheme_rounds: "",
          scheme_type: 1,
          title: "",
          err_type: -1,
        };
      }

      // TODO() Catch this error better, shoudl return a specific error num for  unique constraint errors.
      // eslint-disable-next-line dot-notation
      if (createdWorkout["err_type"] >= 0) {
        console.log("Failed to create workout", createdWorkout.error);
        setCreateWorkoutError("Workout with this name already exists.");
        setIsCreating(false);
        return;
      }

      items.forEach((item, idx) => {
        console.log("Creating item: ", item);
        item.order = idx;
        item.workout = createdWorkout.id;
        if ("finished" in item) {
          item.finished = false;
        }

        delete item["uuid"];
        if (schemeType <= 2) {
          // These scheme types do not have penalty field, only exists on DualItems
          if ("penalty" in item) {
            console.log("Removing Penaly");
            delete item["penalty"];
          }
        }
      });

      data.append("items", JSON.stringify(items));
      data.append("workout", createdWorkout.id);
      data.append("workout_group", workoutGroupID);
      let createdItems;

      if (schemeType <= 2) {
        // For reg, reps, and rounds type workouts, the description is the prescription.
        if (_isUpdateMode) {
          console.log("Update workout items: updateWorkoutItem");
          createdItems = await updateWorkoutItem(data).unwrap();
        } else {
          createdItems = await createWorkoutItem(data).unwrap();
        }
      } else {
        // For Time based workouts, or do you best workouts, we store prescription and record separately
        if (_isUpdateMode) {
          console.log("Update workout items: updateWorkoutDualItem");
          createdItems = await updateWorkoutDualItem(data).unwrap();
        } else {
          createdItems = await createWorkoutDualItem(data).unwrap();
        }
      }

      console.log("Workout item res", createdItems);

      // TODO handle errors
      if (createdItems) {
        router.back();
      }
    } catch (err) {
      console.log("Error creating workout", err);
    }

    setIsCreating(false);
  };

  const removeItem = (idx) => {
    const _items = [...items];
    _items.splice(idx, 1);
    setItems(_items);
  };

  const addWorkoutItem = (
    item: AnyWorkoutItem,
    shouldUpdateItem: boolean
  ): AddWorkoutItemProps => {
    const _item = { ...item };

    const { success, errorType, errorMsg } = verifyWorkoutItem(
      _item,
      schemeType,
      schemeRounds
    );

    if (!success) {
      if (errorType === 0) {
        setSchemeRoundsError(true);
      }
      return { success, errorType, errorMsg };
    }
    if (schemeRoundsError) {
      setSchemeRoundsError(false);
    }

    _item.weights = jList(_item.weights);
    _item.reps = jList(_item.reps);
    _item.duration = jList(_item.duration);
    _item.distance = jList(_item.distance);

    // Set recorded info from default values given by user reps => r_reps etc...

    if (schemeType > 2) {
      // Creative workouts w/ dual items. Pre fill recorded values...
      _item.r_weights = _item.weights;
      _item.r_reps = _item.reps;
      _item.r_duration = _item.duration;
      _item.r_distance = _item.distance;

      _item.r_percent_of = _item.percent_of;
      _item.r_weight_unit = _item.weight_unit;
      _item.r_distance_unit = _item.distance_unit;
      _item.r_duration_unit = _item.duration_unit;
      _item.r_pause_duration = _item.pause_duration;
      _item.r_rest_duration = _item.rest_duration;
      _item.r_rest_duration_unit = _item.rest_duration_unit;
      _item.r_sets = _item.sets;
    }

    console.log("Add item, Recorded info: ", _item);

    // we can do an update here instead.....
    if (shouldUpdateItem) {
      const updatedItems = items.map((itemState) => {
        if (itemState.uuid === _item.uuid) {
          return _item;
        }
        return itemState;
      });

      setItems(updatedItems);
    } else {
      _item.uuid = uuid();
      console.log("~~~~Adding item: ", _item);
      setItems([...items, _item]);
    }

    return { success: true, errorType: -1, errorMsg: "" };
  };

  const addPenalty = (penalty: string, selectedIdx: number) => {
    if (items.length > 0) {
      const updatedItems = items.map((item: WorkoutDualItemProps, idx) => {
        if (idx === selectedIdx) {
          item.penalty = penalty;
        }
        return item;
      });

      setItems(updatedItems);
    }
  };

  const removeItemSSID = (idx) => {
    console.log("Removing idx: ", idx);
    const newItems = [...items];
    const newItem = newItems[idx];
    newItem.ssid = -1;
    newItems[idx] = newItem;
    setItems(newItems);
  };

  const addItemToSSID = (idx) => {
    const newItems = [...items];

    const newItem = newItems[idx];
    if (newItem.ssid == -1) {
      newItem.ssid = curColor;
      console.log(newItem.ssid);
      newItems[idx] = newItem;
      setItems(newItems);
    }
  };

  const updateItemConstant = (idx: number) => {
    // Determines if an item should ignore a RepScheme.
    // "Do a constant number of reps each round."
    if (idx < 0 || idx >= items.length) {
      return;
    }

    const item = { ...items[idx] };
    item.constant = !item.constant;
    const newItems = [...items];
    newItems[idx] = item;
    setItems(newItems);
    console.log("Toggled item as constant", item);
  };

  const [itemToUpdate, setItemToUpdate] = useState<
    null | WorkoutItemProps | WorkoutDualItemProps
  >(null);

  const [toggleUpdateHack, setToggleUpdateHack] = useState(false);

  const requestUpdate = (
    item: WorkoutItemProps | WorkoutDualItemProps | null
  ) => {
    setItemToUpdate(item);
    setToggleUpdateHack(!toggleUpdateHack);
  };

  const isUpdateMode = initItems.length > 2;

  return (
    <PageContainer>
      <ScrollView style={{ flex: 1, width: "100%" }}>
        <View style={{ flex: 1, justifyContent: "center", width: "100%" }}>
          <TSParagrapghText textStyles={{ textAlign: "center" }}>
            Create Workout
          </TSParagrapghText>
          <TSCaptionText textStyles={{ textAlign: "center" }}>
            {workoutGroupTitle}
          </TSCaptionText>
        </View>

        {createWorkoutError.length ? (
          <TSTitleText textStyles={{ color: "red" }}>
            {createWorkoutError}
          </TSTitleText>
        ) : (
          <></>
        )}

        <View
          style={{
            flexShrink: 2,
            flexGrow: 3,
            flexBasis: 0,

            justifyContent: "center",
            width: "100%",
          }}
        >
          <View style={{ height: 35, marginBottom: 8 }}>
            <Input
              onChangeText={(t) => {
                setTitle(limitTextLength(t, WorkoutTitleLimit));
                setCreateWorkoutError("");
                setIsCreating(false);
              }}
              value={title}
              label=""
              testID={TestIDs.CreateWorkoutTitleField.name()}
              placeholder="Title"
              inputStyles={{
                justifyContent: "center",
                alignItems: "center",
              }}
              containerStyle={{
                width: "100%",
                backgroundColor: theme.palette.darkGray,
                borderRadius: 8,
                paddingHorizontal: 8,
              }}
              leading={
                <Icon
                  name="remove-outline"
                  color={theme.palette.text}
                  style={{ fontSize: mdFontSize }}
                />
              }
            />
          </View>

          <View style={{ height: 35 }}>
            <Input
              label=""
              placeholder="Description"
              testID={TestIDs.CreateWorkoutDescField.name()}
              value={desc}
              onChangeText={(t) =>
                setDesc(limitTextLength(t, WorkoutDescLimit))
              }
              containerStyle={{
                width: "100%",
                backgroundColor: theme.palette.darkGray,
                borderRadius: 8,
                paddingHorizontal: 8,
              }}
              leading={
                <Icon
                  name="remove-outline"
                  color={theme.palette.text}
                  style={{ fontSize: mdFontSize }}
                />
              }
            />
          </View>

          <SchemeField
            schemeType={schemeType}
            schemeRounds={schemeRounds}
            setSchemeRounds={(t) =>
              setSchemeRounds(limitTextLength(t, SchemeTextLimit))
            }
            setInstruction={(t) =>
              setInstruction(limitTextLength(t, CreateSchemeInstructionLimit))
            }
            schemeRoundsError={schemeRoundsError}
            setSchemeRoundsError={setSchemeRoundsError}
            instruction={instruction}
          />
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            width: "100%",
            justifyContent: "flex-end",
            paddingRight: 12,
          }}
        >
          <View style={{ width: "20%" }}>
            {!isCreating ? (
              <TouchableHighlight
                testID={TestIDs.CreateWorkoutCreateBtn.name()}
                style={{ marginBottom: 6 }}
                onPress={() => _createWorkoutWithItems(isUpdateMode)}
              >
                <View
                  style={{ justifyContent: "center", alignItems: "flex-end" }}
                >
                  <Icon
                    name={
                      isUpdateMode
                        ? "arrow-up-circle-outline"
                        : "add-circle-outline"
                    }
                    size={24}
                    style={{ marginRight: 4 }}
                    color={theme.palette.text}
                  />
                  <TSCaptionText textStyles={{ textAlign: "right" }}>
                    {isUpdateMode ? "Update" : "Create"}
                  </TSCaptionText>
                </View>
              </TouchableHighlight>
            ) : (
              <ActivityIndicator size="small" color={theme.palette.text} />
            )}
          </View>
        </View>

        <View
          style={{
            flex: 4,
            width: "100%",
            justifyContent: "center",
          }}
        >
          <AddItem
            addWorkoutItem={addWorkoutItem}
            schemeType={schemeType}
            itemToUpdate={itemToUpdate}
            toggleUpdateHack={toggleUpdateHack}
            requestUpdate={requestUpdate}
          />
        </View>

        <View
          style={{
            flex: 6,
            justifyContent: "flex-start",
            alignContent: "flex-start",
            alignItems: "flex-start",
            height: "100%",
            width: "100%",
          }}
        >
          <View style={{ height: "100%", width: "100%", marginTop: 8 }}>
            {schemeType <= 2 ? (
              <CreateWorkoutItemList
                items={items}
                schemeType={schemeType}
                curColor={curColor}
                showAddSSID={showAddSSID}
                itemToUpdate={itemToUpdate}
                setShowAddSSID={setShowAddSSID}
                setCurColor={setCurColor}
                removeItemSSID={removeItemSSID}
                addItemToSSID={addItemToSSID}
                updateItemConstant={updateItemConstant}
                removeItem={removeItem}
                requestUpdate={requestUpdate}
              />
            ) : (
              <CreateWorkoutDualItemList
                items={items as WorkoutDualItemProps[]}
                schemeType={schemeType}
                itemToUpdate={itemToUpdate}
                removeItem={removeItem}
                addPenalty={addPenalty}
                requestUpdate={requestUpdate}
              />
            )}
          </View>
        </View>
      </ScrollView>

      <AlertModal
        closeText="Close"
        bodyText={
          items.length == 0
            ? "Workout must contain workout items."
            : "This account can only create 15 workout items per workout max."
        }
        modalVisible={showAlert}
        onRequestClose={() => setShowAlert(false)}
      />
    </PageContainer>
  );
};

export default CreateWorkoutScreen;
export { verifyWorkoutItem };
