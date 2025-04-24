// src/screens/TemplateWorkoutsScreen.tsx

import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useTheme } from "styled-components/native";
import { Container, TEMPLATE_NAMES } from "@/src/app_components/shared";
import {
  TSCaptionText,
  TSParagrapghText,
} from "@/src/app_components/Text/Text";
import { RegularButton } from "@/src/app_components/Buttons/buttons";
import { WorkoutGroupSquares } from "@/src/app_components/Grids/WorkoutGroups/WorkoutGroupSquares";
import { useGetTemplateWorkoutGroupsQuery } from "@/src/redux/api/apiSlice";
import { useGenerate531Template } from "@/src/app_components/templates/fivethreeone";
import Icon from "react-native-vector-icons/Ionicons";
import { useGillispieTemplate } from "@/src/app_components/templates/gillispie";

const TEMPLATE_NAMES_DISPLAY = {
  [TEMPLATE_NAMES[0]]: "Wendler",
  [TEMPLATE_NAMES[1]]: "Gillispie",
};

export default function TemplateWorkoutsScreen() {
  const theme = useTheme();
  const [selected, setSelected] = useState<string | null>(null);

  const {
    data: groups,
    isLoading: loading,
    isFetching: fetchingMore,
    refetch,
  } = useGetTemplateWorkoutGroupsQuery(selected ?? "", {
    skip: !selected,
  });

  const loadMore = () => console.log("Not paginated...");
  const { five_3_1, isLoading: isTemplateLoading } = useGenerate531Template();
  const { generateGillispieTemplate } = useGillispieTemplate();

  const handleGenerateTemplate = async () => {
    if (selected == TEMPLATE_NAMES[0]) {
      console.log("Generating template for: ", TEMPLATE_NAMES[0]);
      await five_3_1();
      refetch();
    } else if (selected == TEMPLATE_NAMES[1]) {
      console.log("Generating template for: ", TEMPLATE_NAMES[1]);
      await generateGillispieTemplate();
      refetch();
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.palette.backgroundColor }}
    >
      {/* Header */}
      <View style={{ flex: 3 }}>
        <TSCaptionText
          textStyles={{
            color: theme.palette.text,
            marginVertical: 12,
            fontSize: 18,
            textAlign: "center",
          }}
        >
          Select a Template
        </TSCaptionText>

        {/* Pill-style picker */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillScroll}
        >
          {TEMPLATE_NAMES.map((name) => {
            const isActive = name === selected;
            return (
              <TouchableOpacity
                key={name}
                onPress={() => setSelected(name)}
                style={[
                  styles.pill,
                  {
                    backgroundColor: isActive
                      ? theme.palette.secondary.main
                      : theme.palette.primary.main,
                  },
                ]}
              >
                <TSCaptionText
                  textStyles={{
                    color: isActive
                      ? theme.palette.primary.contrastText
                      : theme.palette.secondary.contrastText,
                  }}
                >
                  {TEMPLATE_NAMES_DISPLAY[name]}
                </TSCaptionText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Description card */}
        {selected && (
          <View
            style={[
              styles.descriptionCard,
              { backgroundColor: theme.palette.AWE_Green },
            ]}
          >
            <TSParagrapghText textStyles={{ color: theme.palette.text }}>
              {getTemplateDescription(selected)}
            </TSParagrapghText>
          </View>
        )}
      </View>

      <View style={{ flex: 8 }}>
        {/* Workout groups grid */}
        {selected &&
          (loading ? (
            <ActivityIndicator
              size="large"
              color={theme.palette.primary.main}
              style={{ marginTop: 32 }}
            />
          ) : !loading && groups && groups.length > 0 ? (
            <WorkoutGroupSquares
              data={groups ?? []}
              loadMore={loadMore}
              extraProps={{}}
            />
          ) : (
            <View style={{ flex: 3 }}>
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
                  handleGenerateTemplate();
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
                  <TSParagrapghText>Gen Template</TSParagrapghText>
                </View>
              </RegularButton>
            </View>
          ))}
      </View>
    </SafeAreaView>
  );
}

// you can replace this with real descriptions fetched from your API
function getTemplateDescription(name: string): string {
  switch (name) {
    case TEMPLATE_NAMES[0]:
      return "The classic Wendler 5/3/1 cycle: four weeks of strength focus using percentage of your 1RM.";
    case TEMPLATE_NAMES[1]:
      return "Push / Pull / Legs split, 6 days a week. Great for hypertrophy.";

    default:
      return "";
  }
}

const styles = StyleSheet.create({
  pillScroll: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 6,
    height: 32,
  },
  descriptionCard: {
    borderRadius: 12,
    padding: 12,
    marginVertical: 16,
  },
});
