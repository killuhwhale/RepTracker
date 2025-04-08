// components/WorkoutMaxes.js
import React, {
  useState,
  useEffect,
  useCallback,
  FunctionComponent,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import {
  useGetUserWorkoutMaxesQuery,
  useGetWorkoutNamesQuery,
  useUpdateWorkoutMaxMutation,
} from "@/src/redux/api/apiSlice";
import { useLocalSearchParams, useRouter } from "expo-router";
import { WorkoutNameProps } from "@/src/app_components/Cards/types";
import { useTheme } from "styled-components/native";
import { filter } from "@/src/utils/algos";
import Input from "@/src/app_components/Input/input";
import PickerFilterListView from "@/src/app_components/modals/pickerFilterListView";
import { TSListTitleText } from "@/src/app_components/Text/Text";
import { lightenHexColor } from "@/src/app_components/shared";

const MaxRowItem: FunctionComponent<{}> = ({}) => {
  return <View></View>;
};

interface CurrentMaxProps {
  id: string;
  max_value: number;
  unit: string;
  last_updated: string;
}

interface WorkoutMaxProps {
  id: string;
  name: string;
  current_max: CurrentMaxProps;
}

const WorkoutMaxes = () => {
  const params = useLocalSearchParams();
  // console.log("WorkoutMaxes params: ", params);

  const [refreshing, setRefreshing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newMaxValue, setNewMaxValue] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("kg");

  const {
    data: workoutItems,
    isLoading: isItemsLoading,
    isSuccess,
    isError,
    error: itemsError,
  } = useGetWorkoutNamesQuery("");
  const workoutNames = workoutItems as WorkoutNameProps[];

  // Get workout items with current max values
  const {
    data: workoutItemMaxes,
    isLoading,
    isFetching,
    error: getWorkoutsError,
    refetch,
  } = useGetUserWorkoutMaxesQuery(params.userID);

  const workoutItemMaxesMap: Map<string, WorkoutMaxProps> = workoutItemMaxes
    ? new Map<string, WorkoutMaxProps>(
        workoutItemMaxes.map((wnm: WorkoutMaxProps) => {
          console.log("wnm: ", wnm);
          return [wnm.id, wnm];
        })
      )
    : new Map<string, WorkoutMaxProps>();

  // Update workout max mutation
  const [updateWorkoutMax, { isLoading: isUpdating }] =
    useUpdateWorkoutMaxMutation();

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Pull to refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // Start editing a workout max
  const startEditing = (item) => {
    setEditingId(item.id);
    setNewMaxValue(
      item.current_max ? item.current_max.max_value.toString() : ""
    );
    setSelectedUnit(item.current_max ? item.current_max.unit : "kg");
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setNewMaxValue("");
  };

  // Save updated max value
  const saveMax = async (workoutNameId: string) => {
    if (!newMaxValue || isNaN(parseFloat(newMaxValue))) {
      Alert.alert(
        "Invalid Value",
        "Please enter a valid number for the max value."
      );
      return;
    }

    try {
      await updateWorkoutMax({
        user_id: params.userID,
        workout_name_id: workoutNameId,
        max_value: parseFloat(newMaxValue),
        unit: selectedUnit,
        notes: "Updated from app",
      }).unwrap();

      setEditingId(null);
      setNewMaxValue("");
    } catch (err) {
      Alert.alert("Error", "Failed to update max value. Please try again.");
      console.error("Failed to update max:", err);
    }
  };
  const router = useRouter();
  // View history for a workout item
  const viewHistory = (item: any) => {
    console.log("TODO() need to naviate to details page...");
    // navigation.navigate('WorkoutMaxHistory', {

    // });
    router.push({
      pathname: "/UserWorkoutMaxHistory",
      params: {
        workoutItemId: item.id,
        workoutName: item.name,
        userID: params.userID,
      },
    });
  };

  // Toggle unit between kg and lb
  const toggleUnit = () => {
    setSelectedUnit(selectedUnit === "kg" ? "lb" : "kg");

    // Convert the value when changing units
    if (newMaxValue && !isNaN(parseFloat(newMaxValue))) {
      if (selectedUnit === "kg") {
        // Convert kg to lb (1 kg = 2.20462 lb)
        setNewMaxValue((parseFloat(newMaxValue) * 2.20462).toFixed(1));
      } else {
        // Convert lb to kg (1 lb = 0.453592 kg)
        setNewMaxValue((parseFloat(newMaxValue) * 0.453592).toFixed(1));
      }
    }
  };

  const theme = useTheme();

  const [stringData, setOgData] = useState<string[]>(
    workoutNames ? workoutNames.map((workoutName) => workoutName.name) : []
  );
  const [filterResult, setFilterResult] = useState<number[]>(
    Array.from(Array(stringData.length).keys()).map((idx) => idx)
  );

  const [term, setTerm] = useState("");

  const filterText = (term: string) => {
    // Updates filtered data.
    console.log("Filter text: ", term, stringData);
    const { items, marks } = filter(term, stringData, { word: false });
    setFilterResult(items);
    setTerm(term);
  };

  useEffect(() => {
    // console.log('Running init filter effect');
    setOgData(
      workoutNames ? workoutNames.map((gymClass) => gymClass.name) : []
    );
    setFilterResult(
      Array.from(Array(workoutNames?.length || 0).keys()).map((idx) => idx)
    );
  }, [workoutNames]);

  // console.log("workoutItemMaxes: ", workoutItemMaxes);
  // Render each workout item
  const renderWorkoutItem = (props: any) => {
    const item = props.workoutName;
    const maxItem: WorkoutMaxProps | undefined = workoutItemMaxesMap.get(
      item.id
    );
    const isEditing = editingId === item.id;

    return (
      <View
        style={[
          styles.itemContainer,
          {
            backgroundColor: theme.palette.backgroundColor,
            borderWidth: 1,
            borderColor: theme.palette.AWE_Yellow,
          },
        ]}
      >
        <View style={styles.itemHeader}>
          <Text
            style={[
              styles.itemName,
              { color: lightenHexColor(theme.palette.primary.main, 1.35) },
            ]}
          >
            {item.name}
          </Text>

          <TouchableOpacity
            style={[
              styles.historyButton,
              { backgroundColor: lightenHexColor(theme.palette.text, 0.92) },
            ]}
            onPress={() => viewHistory(item)}
          >
            <Ionicons
              name="time-outline"
              size={20}
              color={theme.palette.AWE_Green}
            />
            <Text
              style={[
                styles.historyButtonText,
                { color: theme.palette.AWE_Green },
              ]}
            >
              History
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.maxContainer}>
          {!isEditing ? (
            // Display current max value
            <View style={styles.currentMaxContainer}>
              <Text style={[styles.maxLabel, { color: theme.palette.text }]}>
                Current Max:
              </Text>
              <Text
                style={[
                  styles.maxValue,
                  { color: lightenHexColor(theme.palette.AWE_Red, 0.92) },
                ]}
              >
                {maxItem?.current_max
                  ? `${maxItem.current_max.max_value} ${maxItem.current_max.unit}`
                  : "Not set"}
              </Text>
              <TouchableOpacity
                style={[
                  styles.editButton,
                  {
                    backgroundColor: lightenHexColor(theme.palette.text, 0.25),
                  },
                ]}
                onPress={() => startEditing(item)}
              >
                <Ionicons
                  name="pencil"
                  size={16}
                  color={theme.palette.AWE_Green}
                />
              </TouchableOpacity>
            </View>
          ) : (
            // Edit max value form
            <View style={styles.editContainer}>
              <TextInput
                style={styles.input}
                value={newMaxValue}
                onChangeText={setNewMaxValue}
                keyboardType="numeric"
                autoFocus
                selectTextOnFocus
              />

              <TouchableOpacity
                style={styles.unitToggleButton}
                onPress={toggleUnit}
              >
                <Text style={styles.unitToggleText}>{selectedUnit}</Text>
              </TouchableOpacity>

              <View style={styles.editActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={cancelEditing}
                  disabled={isUpdating}
                >
                  <Text style={styles.actionButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.saveButton]}
                  onPress={() => saveMax(item.id)}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.actionButtonText}>Save</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  if (isLoading || isItemsLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={styles.loadingText}>Loading workout items...</Text>
      </View>
    );
  }

  if (getWorkoutsError) {
    console.log("getWorkoutsError: ", getWorkoutsError);
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle" size={48} color="#e74c3c" />
        <Text style={styles.errorText}>
          {getWorkoutsError.data?.message || "Failed to load workout items"}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.palette.backgroundColor },
      ]}
    >
      <Text style={[styles.description, { color: theme.palette.text }]}>
        Record your current max for each exercise. This helps calculate your
        intensity factor during workouts.
      </Text>
      <View
        style={{
          height: 25,
          borderWidth: 1,
          borderColor: "white",
          marginBottom: 12,
          borderRadius: 8,
        }}
      >
        <Input
          onChangeText={filterText}
          value={term}
          inputStyles={{ fontSize: 14 }}
          focus={true}
          containerStyle={{
            width: "100%",
            backgroundColor: theme.palette.backgroundColor,
            borderRadius: 8,
          }}
          leading={
            <Icon
              name="search"
              style={{ fontSize: 16 }}
              color={theme.palette.text}
            />
          }
          label=""
          placeholder="Searfg"
        />
      </View>

      <View style={{ flex: 1 }}>
        <PickerFilterListView
          data={workoutItems.filter(
            (_: any, i: number) => filterResult.indexOf(i) >= 0
          )}
          extraProps={{
            onSelect: (item: WorkoutNameProps) =>
              console.log("User selected: ", item),
          }}
          RowView={renderWorkoutItem}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
    // backgroundColor: "#f5f5f5",
    padding: 12,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 22,
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  historyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f7ff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  historyButtonText: {
    color: "#4a90e2",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 4,
  },
  maxContainer: {
    marginTop: 8,
  },
  currentMaxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  maxLabel: {
    fontSize: 12,
    color: "#666",
    marginRight: 8,
  },
  maxValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  editButton: {
    // backgroundColor: "#4a90e2",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  editContainer: {
    marginTop: 8,
  },
  input: {
    backgroundColor: "#f6f6f6",
    borderRadius: 8,
    fontSize: 18,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  unitToggleButton: {
    alignSelf: "flex-start",
    backgroundColor: "#eee",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
  },
  unitToggleText: {
    fontWeight: "bold",
    color: "#666",
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    marginLeft: 12,
    minWidth: 80,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#eee",
  },
  saveButton: {
    backgroundColor: "#4a90e2",
  },
  actionButtonText: {
    fontWeight: "bold",
    color: "#fff",
  },
  errorText: {
    marginTop: 12,
    marginBottom: 20,
    fontSize: 16,
    color: "#e74c3c",
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#4a90e2",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyContainer: {
    padding: 30,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
});

export default WorkoutMaxes;
