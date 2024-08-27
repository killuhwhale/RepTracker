import { Dimensions, Platform } from "react-native";
import styled from "styled-components/native";
import { WorkoutStats } from "../app_components/Stats/StatsPanel";
import { SPACES_URL } from "../utils/constants";
import {
  WorkkoutItemsList,
  WorkoutCardProps,
  WorkoutDualItemProps,
  AnyWorkoutItem,
  WorkoutItemProps,
} from "./Cards/types";

import twrnc from "twrnc";

export const Container = styled.View`
  flex: 1;
  align-items: center;
  background-color: ${(props) => props.theme.palette.backgroundColor};
`;

const KG2LB = 2.20462;
const LB2KG = 0.453592;

export const SCREEN_WIDTH = Dimensions.get("screen").width;
export const SCREEN_HEIGHT = Dimensions.get("screen").height;
export function lightenHexColor(hexColor: string, factor: number): string {
  // Convert hex to RGB
  let r: number = parseInt(hexColor.substring(1, 3), 16);
  let g: number = parseInt(hexColor.substring(3, 5), 16);
  let b: number = parseInt(hexColor.substring(5, 7), 16);

  // Lighten the color
  r = Math.round(r * factor);
  g = Math.round(g * factor);
  b = Math.round(b * factor);

  // Ensure values are within [0, 255]
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  // Convert RGB back to HEX
  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export const lightRed = twrnc.color("bg-red-400");
export const red = twrnc.color("bg-red-500");
export const darkRed = twrnc.color("bg-red-800");
export const green = twrnc.color("bg-emerald-600");

export const tsPageTitle: number = Platform.OS === "ios" ? 20 : 20;
export const tsParagrapgh: number = Platform.OS === "ios" ? 12 : 12;
export const tsListTitle: number = Platform.OS === "ios" ? 14 : 14; // medium weight
export const tsSnippet: number = Platform.OS === "ios" ? 11 : 11;
export const tsCaption: number = Platform.OS === "ios" ? 11 : 11; // lighter color
export const tsButton: number = Platform.OS === "ios" ? 14 : 14; // medium weight
export const tsInput: number = Platform.OS === "ios" ? 16 : 16;
export const tsDate: number = Platform.OS === "ios" ? 9 : 9;

// Deprecated....
export const titleFontSize: number = Platform.OS === "ios" ? 44 : 44;
export const lgFontSize: number = Platform.OS === "ios" ? 32 : 32;
export const regFontSize: number = Platform.OS === "ios" ? 20 : 20;
export const mdFontSize: number = Platform.OS === "ios" ? 18 : 18;
export const smFontSize: number = Platform.OS === "ios" ? 12 : 12;
export const xsmFontSize: number = Platform.OS === "ios" ? 10 : 10;

export const STANDARD_W = "STANDARD";
export const REPS_W = "REPS";
export const ROUNDS_W = "ROUNDS";
export const CREATIVE_W = "CREATIVE";

export const WORKOUT_TYPES: Array<string> = [
  STANDARD_W,
  REPS_W,
  ROUNDS_W,
  CREATIVE_W,
];
export const WORKOUT_TYPE_LABELS: Array<string> = [
  "",
  "Rep scheme",
  "Rounds",
  "Time",
  "Score",
];
export const AddItemFontsize = 14;

export const DURATION_UNITS: Array<string> = ["sec", "mins"];
export const WEIGHT_UNITS: Array<string> = ["kg", "lb", "%"];
export const WEIGHT_UNITS_SET: Set<string> = new Set(["kg", "lb"]);
export const PERCENTAGE_UNITS: Set<string> = new Set(["%"]);
export const BODYWEIGHT_UNITS: Set<string> = new Set(["bw"]);
export const DISTANCE_UNITS_SET: Set<string> = new Set(["m", "yd"]);
export const DISTANCE_UNITS: Array<string> = ["m", "yd"];

export const GYM_MEDIA = 0;
export const CLASS_MEDIA = 1;
export const WORKOUT_MEDIA = 2;
export const NAME_MEDIA = 3;
export const USER_MEDIA = 4;
export const COMPLETED_WORKOUT_MEDIA = 5;
export const MEDIA_CLASSES: Array<string> = [
  "gyms",
  "classes",
  "workouts",
  "names",
  "users",
  "completedWorkouts",
];

export const GymTitleLimit = 50;
export const GymDescLimit = 280;
export const GymClassTitleLimit = 50;
export const GymClassDescLimit = 280;
export const WorkoutGroupTitleLimit = 50;
export const WorkoutGroupDescLimit = 280;
export const WorkoutTitleLimit = 50;
export const WorkoutDescLimit = 280;
export const CompletedWorkoutGroupCaptionLimit = 280;
export const WorkoutDualItemCreativePenaltyLimit = 280;
export const MaxDigits = 9;
export const SchemeTextLimit = 20;
export const CreateSchemeInstructionLimit = 100;

// Url for Digital Ocean Spaces API
export const withSpaceURL = (
  url: string,
  mediaClassID: number,
  mediaClass: string
) => {
  return `${SPACES_URL}/fitform/${mediaClass}/${mediaClassID}/${url}`;
};

export const nanOrNah = (str: string) => {
  return isNaN(parseInt(str)) ? 0 : parseInt(str);
};
export const numFilter = (str: string): string => {
  const r = str.replace(/[^0-9]/g, "");
  return r;
};
export const numFilterWithSpaces = (str: string): string => {
  const r = str.replace(/[^0-9\s]/g, "");
  const hasSpace = r[r.length - 1] === " ";
  return hasSpace ? r.trim() + " " : r.trim();
};
export const displayJList = (weights: string) => {
  return weights ? weights.toString().replace("[", "").replace("]", "") : " ";
};
// Converts string of nums to stringified number[]
export const jList = (str: string): string => {
  const S = str.trim();
  if (!S) {
    return JSON.stringify([]);
  }
  return JSON.stringify(S.split(" ").map((strnum: string) => parseInt(strnum)));
};

export function jsonCopy<T>(item: T): T {
  return JSON.parse(JSON.stringify(item));
}

export const defaultStats = {
  totalReps: 0,
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
  key: "",
} as WorkoutStats;

const dotProd = (a: number[], b: number[]): number => {
  if (!a.length || !b.length || !(a.length === b.length)) {
    return 0;
  }
  const A = [...a];
  b.forEach((n, i) => {
    A[i] *= b[i];
  });

  return A.reduce((p, c) => p + c, 0);
};

const expandArray = (arr, len) => {
  // If arr is length 1, we will expand the arr to length: len and fill with value: arr[0] else we willl fill with 0 .
  return arr.length < 2
    ? Array.from({ length: len }, (v, i) => (arr.length == 1 ? arr[0] : 0))
    : arr;
};

export class CalcWorkoutStats {
  /** To use:
   *
   * setWorkoutParams(schemeRounds, schemeType, items)
   * calc()
   *
   */
  schemeRounds: string;
  schemeType: number;
  items: WorkkoutItemsList;

  isFormatted = false;
  ownedByClass = false;
  tags = {};
  names = {};

  // Formatted values
  fTags = {};
  fNames = {};

  constructor() {
    this.schemeRounds = "";
    this.schemeType = -1;
    this.items = [];
  }

  getStats() {
    if (!this.isFormatted) {
      Object.keys(this.tags).map((key) => {
        if (!this.fTags[key]) {
          this.fTags[key] = {};
        }

        Object.keys(this.tags[key]).map((inKey) => {
          if (inKey == "key") {
            this.fTags[key][inKey] = this.tags[key][inKey];
          } else {
            this.fTags[key][inKey] = parseInt(this.tags[key][inKey]);
          }
        });
      });

      Object.keys(this.names).map((key) => {
        if (!this.fNames[key]) {
          this.fNames[key] = {};
        }

        Object.keys(this.names[key]).map((inKey) => {
          if (inKey == "key") {
            this.fNames[key][inKey] = this.names[key][inKey];
          } else {
            this.fNames[key][inKey] = parseInt(this.names[key][inKey]);
          }
        });
      });
    }

    this.isFormatted = true;
    return [this.fTags, this.fNames];
  }

  setWorkoutParams(
    schemeRounds: string,
    schemeType: number,
    items: WorkkoutItemsList
  ) {
    this.schemeRounds = schemeRounds;
    this.schemeType = schemeType;
    this.items = items;
  }

  calcItemReps(
    item: AnyWorkoutItem,
    pCat: string,
    workoutName: string,
    quantity: number | null,
    totalVol: number,
    sets: number | null
  ) {
    if (sets && quantity) {
      this.tags[pCat].totalReps += sets * quantity;
      this.names[workoutName].totalReps += sets * quantity;
    }

    // Convert weights based on native item weight unit
    if (item.weight_unit == "kg") {
      this.tags[pCat].totalLbs += totalVol * KG2LB;
      this.names[workoutName].totalLbs += totalVol * KG2LB;

      this.tags[pCat].totalKgs += totalVol;
      this.names[workoutName].totalKgs += totalVol;
    } else {
      this.tags[pCat].totalLbs += totalVol;
      this.names[workoutName].totalLbs += totalVol;

      this.tags[pCat].totalKgs += totalVol * LB2KG;
      this.names[workoutName].totalKgs += totalVol * LB2KG;
    }
  }

  calcItemDuration(
    item: AnyWorkoutItem,
    pCat: string,
    workoutName: string,
    quantity: number | null,
    totalVol: number,
    sets: number | null
  ) {
    // If unit is in seconds, our value is already in seconds, else it is in mins, multiple to convert to seconds.
    const durUnitMultiplier = item.duration_unit === 0 ? 1 : 60;
    if (sets && quantity) {
      this.tags[pCat].totalTime += quantity * sets * durUnitMultiplier;
      this.names[workoutName].totalTime += quantity * sets * durUnitMultiplier;
    }

    if (item.weight_unit == "kg") {
      this.tags[pCat].totalKgSec += totalVol;
      this.names[workoutName].totalKgSec += totalVol;

      this.tags[pCat].totalLbSec += totalVol * KG2LB;
      this.names[workoutName].totalLbSec += totalVol * KG2LB;
    } else {
      this.tags[pCat].totalKgSec += totalVol * LB2KG;
      this.names[workoutName].totalKgSec += totalVol * LB2KG;

      this.tags[pCat].totalLbSec += totalVol;
      this.names[workoutName].totalLbSec += totalVol;
    }
  }

  calcItemDistance(
    item: AnyWorkoutItem,
    pCat: string,
    workoutName: string,
    quantity: number | null,
    totalVol: number,
    sets: number | null
  ) {
    // Distance
    if (sets && quantity) {
      this.tags[pCat].totalDistanceM += quantity * sets;
      this.names[workoutName].totalReps += quantity * sets;
    }

    if (item.weight_unit == "kg") {
      this.tags[pCat].totalKgM += totalVol;
      this.names[workoutName].totalKgM += totalVol;

      this.tags[pCat].totalLbM += totalVol * KG2LB;
      this.names[workoutName].totalLbM += totalVol * KG2LB;
    } else {
      this.tags[pCat].totalKgM += totalVol * LB2KG;
      this.names[workoutName].totalKgM += totalVol * LB2KG;

      this.tags[pCat].totalLbM += totalVol;
      this.names[workoutName].totalLbM += totalVol;
    }
  }

  calcStandardScheme(item: AnyWorkoutItem, pCat: string, workoutName: string) {
    const weights = JSON.parse(item.weights);
    // Expand a single value arrray
    const itemWeights = expandArray(weights, item.sets);
    const itemReps = JSON.parse(item.reps);
    const itemDuration = JSON.parse(item.duration);
    const durationUnit = item.duration_unit;
    const itemDistance = JSON.parse(item.distance);

    // Quantity is single, weights are mutlitple
    const quantity = itemReps[0]
      ? itemReps[0]
      : itemDuration[0]
      ? itemDuration[0]
      : itemDistance[0]
      ? itemDistance[0]
      : 0;

    const totalVol =
      quantity *
      (weights.length == 0 ? 0 : itemWeights.reduce((p, c) => p + c, 0));
    // console.log('CALC Standard Scheme:: ', quantity, weights, itemWeights);
    if (itemReps[0]) {
      //Reps
      this.calcItemReps(item, pCat, workoutName, quantity, totalVol, item.sets);
    } else if (itemDuration[0]) {
      // Duration
      this.calcItemDuration(
        item,
        pCat,
        workoutName,
        quantity,
        totalVol,
        item.sets
      );
    } else if (itemDistance[0]) {
      this.calcItemDistance(
        item,
        pCat,
        workoutName,
        quantity,
        totalVol,
        item.sets
      );
    }
  }

  calcRepsScheme(item: AnyWorkoutItem, pCat: string, workoutName: string) {
    const repsPerRounds = parseNumList(this.schemeRounds); // Comes from previous screen, param, string
    const reps = JSON.parse(item.reps);
    const itemReps =
      reps.length === 1 ? expandArray(reps, repsPerRounds.length) : reps;

    const durations = JSON.parse(item.duration);
    const itemDuration =
      durations.length === 1
        ? expandArray(durations, repsPerRounds.length)
        : durations;

    const distances = JSON.parse(item.distance);
    const itemDistance =
      distances.length === 1
        ? expandArray(distances, repsPerRounds.length)
        : distances;

    const weights = JSON.parse(item.weights); // Comes from API, JSON string list
    const itemWeights =
      weights.length == 1
        ? expandArray(weights, repsPerRounds.length)
        : weights;

    repsPerRounds.forEach((roundReps, idx) => {
      const quantity = itemReps[idx]
        ? itemReps[idx]
        : itemDuration[idx]
        ? itemDuration[idx]
        : itemDistance[idx]
        ? itemDistance[idx]
        : 0;

      // If the item is constant then we do not do it according to the current round reps
      // E.g we do not do the quanitity 21,15,9 times, we do it once per round.
      const totalVol =
        (item.constant ? 1 : roundReps) * quantity * itemWeights[idx];

      // console.log(
      //   'Total vol: ',
      //   quantity,
      //   itemDuration,
      //   item.name.name,
      //   totalVol,
      //   itemWeights,
      //   weights,
      // );
      // Reps
      if (itemReps[0]) {
        this.calcItemReps(
          item,
          pCat,
          workoutName,
          itemReps[idx],
          totalVol,
          item.constant ? 1 : roundReps
        );
      } else if (itemDuration[0]) {
        // Duration
        this.calcItemDuration(
          item,
          pCat,
          workoutName,
          itemDuration[idx],
          totalVol,
          item.constant ? 1 : roundReps
        );
      } else if (itemDistance[0]) {
        this.calcItemDistance(
          item,
          pCat,
          workoutName,
          itemDistance[idx],
          totalVol,
          item.constant ? 1 : roundReps
        );
      }
    });
  }

  calcRoundsScheme(item: AnyWorkoutItem, pCat: string, workoutName: string) {
    const rounds = parseInt(this.schemeRounds);
    const reps = JSON.parse(item.reps);
    const distance = JSON.parse(item.reps);
    const duration = JSON.parse(item.reps);
    const _weights = JSON.parse(item.reps);

    const itemReps = reps.length === 1 ? expandArray(reps, rounds) : reps;
    const itemDistance =
      distance.length === 1 ? expandArray(distance, rounds) : distance;
    const itemDuration =
      duration.length === 1 ? expandArray(duration, rounds) : duration;
    const weights =
      _weights.length === 1 ? expandArray(_weights, rounds) : _weights;

    // Reps
    if (itemReps[0]) {
      //Reps
      // If the
      const totalVol = dotProd(itemReps, weights);
      // console.log("Dot Product: ", quantity, weights, totalVol)
      this.tags[pCat].totalReps += itemReps.reduce((p, c) => p + c, 0);
      this.names[workoutName].totalReps += itemReps.reduce((p, c) => p + c, 0);
      this.calcItemReps(item, pCat, workoutName, null, totalVol, null);
    } else if (itemDuration[0]) {
      const totalVol = dotProd(itemDuration, weights);
      this.tags[pCat].totalTime += itemDuration.reduce((p, c) => p + c, 0);
      this.names[workoutName].totalTime += itemDuration.reduce(
        (p, c) => p + c,
        0
      );
      this.calcItemDuration(item, pCat, workoutName, null, totalVol, null);
    } else if (itemDistance[0]) {
      const totalVol = dotProd(itemDistance, weights);
      this.tags[pCat].totalDistanceM += itemDistance.reduce((p, c) => p + c, 0);
      this.names[workoutName].totalDistanceM += itemDistance.reduce(
        (p, c) => p + c,
        0
      );
      this.calcItemDistance(item, pCat, workoutName, null, totalVol, null);
    }
  }

  getRecord(item: AnyWorkoutItem, key: string) {
    return item[`r_${key}`];
  }

  // calcRecordScheme essentailly will calculate anything (really doesnt calculate anything, just reports or tallys up the total from the recorded values unless owned by class.)
  calcRecordScheme(item: AnyWorkoutItem, pCat: string, workoutName: string) {
    // Problem is, we dont know how much was accomplished until after the fact.
    // WE can calculate what a single round would be, then once we save this as completed, we can calculate the toatls....
    // For now, we will calc a single round only.
    // Wellll welll well, we finally have a solution....
    // Now we just need to know if this is owned by the class because then we will calculate normally with .reps and not .r_reps
    // But when the item is from  a workout that is completed => completedDualItem, or regular => workoutItem
    //   Then, if the workout is owned by a class, it will be normal.
    // if ownedByClass // should onyl be true when user is on WorkoutsScreen viewing a class workout
    //    const itemReps = JSON.parse(item.reps);
    // else //
    //    const itemReps = JSON.parse(item.r_reps);
    //
    //
    //
    //

    const itemReps = this.ownedByClass
      ? JSON.parse(item.reps)
      : JSON.parse(this.getRecord(item, "reps"));
    const itemDuration = this.ownedByClass
      ? JSON.parse(item.duration)
      : JSON.parse(this.getRecord(item, "duration"));
    const itemDistance = this.ownedByClass
      ? JSON.parse(item.distance)
      : JSON.parse(this.getRecord(item, "distance"));
    const weights = this.ownedByClass
      ? JSON.parse(item.weights)
      : JSON.parse(this.getRecord(item, "weights"));

    // Reps
    if (itemReps[0]) {
      //Reps
      const totalVol = dotProd(itemReps, weights);
      this.calcItemReps(item, pCat, workoutName, itemReps[0], totalVol, 1);
      // console.log("Dot Product: ", quantity, weights, totalVol)
    } else if (itemDuration[0]) {
      const totalVol = dotProd(itemDuration, weights);
      this.calcItemDuration(
        item,
        pCat,
        workoutName,
        itemDuration[0],
        totalVol,
        1
      );
    } else if (itemDistance[0]) {
      const totalVol = dotProd(itemDistance, weights);
      this.calcItemDistance(
        item,
        pCat,
        workoutName,
        itemDistance[0],
        totalVol,
        1
      );
    }
  }

  checkInItemTagAndName(pCat: string, workoutName: string) {
    if (!this.tags[pCat]) {
      this.tags[pCat] = { ...defaultStats, key: pCat } as WorkoutStats;
    }
    if (!this.names[workoutName]) {
      this.names[workoutName] = {
        ...defaultStats,
        key: workoutName,
      } as WorkoutStats;
    }
  }
  //Given a single WorkoutGroup, calc stats
  calc(): boolean {
    this.isFormatted = false;
    try {
      this.items.forEach((item) => {
        // Tags
        const pCat = item.name.primary?.title;
        const sCat = item.name.secondary?.title;
        if (pCat === undefined) {
          console.log("Primary category is undefined: ", item.name, item);
        }
        // Title
        const workoutName = item.name.name;
        this.checkInItemTagAndName(pCat, workoutName);

        if (WORKOUT_TYPES[this.schemeType] == STANDARD_W) {
          // console.log('calculating Standarad!!!!!!!!!!111');
          this.calcStandardScheme(item, pCat, workoutName);
        } else if (WORKOUT_TYPES[this.schemeType] == REPS_W) {
          this.calcRepsScheme(item, pCat, workoutName);
        } else if (WORKOUT_TYPES[this.schemeType] == ROUNDS_W) {
          this.calcRoundsScheme(item, pCat, workoutName);
        }
        // else if (WORKOUT_TYPES[this.schemeType] == CREATIVE_W) {
        // The other workout types are all record types with r_ prefix
        // calcDuationScheme will calculate all of these types. No
        else {
          this.calcRecordScheme(item, pCat, workoutName);
        }
      });
      // console.log('Calc res ', this.getStats());
      return true;
    } catch (err) {
      console.log("Calc err: ", err);
    }

    return false;
  }

  calcMulti(data: WorkoutCardProps[], ownedByClass = false) {
    this.isFormatted = false;
    this.ownedByClass = ownedByClass;
    // console.log('CalcMulti Data: ', data);
    data.forEach((workout) => {
      const {
        scheme_rounds,
        scheme_type,
        workout_items,
        completed_workout_items,
      } = workout as WorkoutCardProps;
      // console.log(
      //   '\n\n Calc Multiz: ',
      //   workout_items,
      //   completed_workout_items,
      //   '\n\n',
      // );

      this.setWorkoutParams(
        scheme_rounds,
        scheme_type,
        workout_items
          ? workout_items
          : completed_workout_items
          ? completed_workout_items
          : []
      );

      this.calc();
    });
  }

  reset() {
    this.schemeRounds = "";
    this.schemeType = -1;
    this.ownedByClass = false;
    this.items = [];

    this.tags = {};
    this.names = {};
    this.fTags = {};
    this.fNames = {};
  }
}

export const parseNumList = (reps): number[] => {
  // Converts string of number into number[]

  // A string is representing a single number or a list of space delimited numbers.
  // Works for reps and weights, now we will support "[1,2,3]"
  const result = JSON.parse(jList(reps));
  return result.length > 0 ? result : [0];
};

export const formatLongDate = (date: Date) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();
  // console.log('Long date: ', monthNames[monthIndex] + ' ' + day + ', ' + year);
  return monthNames[monthIndex] + " " + day + ", " + year;
};

export function isDateInFuture(date: Date): boolean {
  const currentDate = new Date();
  if (typeof date == typeof "") {
    date = new Date(date);
  }
  return date > currentDate;
}

export function limitTextLength(t: string, limit: number) {
  return t.length > limit ? t.substring(0, limit) : t;
}

export const isMember = (sub_end_date: Date) => {
  return sub_end_date && new Date(sub_end_date) > new Date();
};
