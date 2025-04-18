import React, { FunctionComponent, useState } from "react";
import styled from "styled-components/native";
import {
  Container,
  MEDIA_CLASSES,
  SCREEN_WIDTH,
  darkRed,
  withSpaceURL,
} from "@/src/app_components/shared";
import {
  SmallText,
  TSCaptionText,
  TSParagrapghText,
  TSTitleText,
} from "@/src/app_components/Text/Text";
import { useTheme } from "styled-components";
import Icon from "react-native-vector-icons/Ionicons";
import { RootStackParamList } from "@/src/navigators/RootStack";
import { StackScreenProps } from "@react-navigation/stack";
import { Image, View } from "react-native";
import {
  useDeleteGymClassMutation,
  useFavoriteGymClassMutation,
  useGetCoachesForGymClassQuery,
  useGetGymClassDataViewQuery,
  useGetMembersForGymClassQuery,
  useGetProfileGymClassFavsQuery,
  useUnfavoriteGymClassMutation,
} from "@/src/redux/api/apiSlice";

import { GymClassCardProps } from "@/src/app_components/Cards/types";

import ManageMembersModal from "@/src/app_components/modals/memberModal";
import ManageCoachesModal from "@/src/app_components/modals/coachModal";

import DeleteActionCancelModal from "@/src/app_components/modals/deleteByNameModal";

import { TouchableHighlight } from "react-native-gesture-handler";
import FilterGrid from "@/src/app_components/Grids/FilterGrid";
import { WorkoutGroupSquares } from "@/src/app_components/Grids/WorkoutGroups/WorkoutGroupSquares";
import { TestIDs } from "@/src/utils/constants";
import moc from "@/assets/bgs/moc.png";
import BannerAddMembership from "@/src/app_components/ads/BannerAd";
export type Props = StackScreenProps<RootStackParamList, "GymClassScreen">;

const GymClassScreenContainer = styled(Container)`
  background-color: ${(props) => props.theme.palette.backgroundColor};
  justify-content: space-between;

  width: 100%;
`;

const FavoriteGymClass: FunctionComponent<{
  id: string;
}> = (props) => {
  const { id } = props;

  const {
    data: dataGymClassFavs,
    isLoading: isLoadingGymClassFavs,
    isSuccess: isSuccessGymClassFavs,
    isError: isErrorGymClassFavs,
    error: errorGymClassFavs,
  } = useGetProfileGymClassFavsQuery("");

  const [favoriteGymClassMutation, { isLoading: favGymLoading }] =
    useFavoriteGymClassMutation();
  const [unfavoriteGymClassMutation, { isLoading: unfavGymLoading }] =
    useUnfavoriteGymClassMutation();
  const isFavorited = (
    classes: {
      id: number;
      user_id: string;
      date: string;
      gym_class: GymClassCardProps;
    }[]
  ) => {
    let faved = false;
    classes.forEach((favClass) => {
      if (favClass.gym_class.id == id) {
        faved = true;
      }
    });
    return faved;
  };

  const favObj = new FormData();
  favObj.append("gym_class", id);

  return (
    <View>
      {dataGymClassFavs &&
      !isLoadingGymClassFavs &&
      isFavorited(dataGymClassFavs?.favorite_gym_classes) ? (
        <TouchableHighlight onPress={() => unfavoriteGymClassMutation(favObj)}>
          <View style={{ alignItems: "center" }}>
            <Icon name="star" color={darkRed} style={{ fontSize: 24 }} />
            <SmallText>Unfavorite</SmallText>
          </View>
        </TouchableHighlight>
      ) : (
        <TouchableHighlight onPress={() => favoriteGymClassMutation(favObj)}>
          <View style={{ alignItems: "center" }}>
            <Icon name="star" color="white" style={{ fontSize: 24 }} />
            <SmallText>Favorite</SmallText>
          </View>
        </TouchableHighlight>
      )}
    </View>
  );
};

const GymClassScreen: FunctionComponent<Props> = ({
  navigation,
  route: { params },
}) => {
  const theme = useTheme();
  const {
    id,
    logoImage,
    mainImage,
    title,
    desc,
    gym,
    date,
    private: is_private,
  } = params || {};

  const [deleteGymClassModalVisible, setDeleteGymClassModalVisibleVisible] =
    useState(false);
  const [showCoachModal, setShowCoachModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);

  const {
    data: allMembers,
    isLoading: membersLoading,
    isSuccess: membersIsSuccess,
    isError: membersIsError,
    error: membersError,
  } = useGetMembersForGymClassQuery(id);

  const {
    data: allCoaches,
    isLoading: coachesLoading,
    isSuccess: coachesIsSuccess,
    isError: coachesIsError,
    error: coachesError,
  } = useGetCoachesForGymClassQuery(id);

  const { data, isLoading, isSuccess, isError, error } =
    useGetGymClassDataViewQuery(id);

  const [deleteGymClassMutation, { isLoading: isDeleteGymClassLoading }] =
    useDeleteGymClassMutation();
  const mainURL = withSpaceURL("main", parseInt(id), MEDIA_CLASSES[1]);
  const logoURL = withSpaceURL("logo", parseInt(id), MEDIA_CLASSES[1]);

  // Separate workout groups into separate query for better caching.
  const onConfirmDelete = () => {
    setDeleteGymClassModalVisibleVisible(true);
  };
  const onDelete = async () => {
    // Pass data to invalidate tags in order to refresh class list
    if (!gym || !id) {
      console.log("Error deleting GymClass");
      return;
    }

    const data = {
      gymID: gym,
      gymClassID: id,
    };
    console.log("Deleting gymClass", data);
    const deletedGym = await deleteGymClassMutation(data).unwrap();
    console.log("Deleted Gym: ", deletedGym);
    setDeleteGymClassModalVisibleVisible(false);
    if (deletedGym.id) {
      navigation.goBack();
    }
  };

  // TODO replace with separate use...
  const workoutGroups = data?.workout_groups || [];

  const [useDefault, setUseDefault] = useState(false);

  const handleError = () => {
    setUseDefault(true);
  };
  return (
    <GymClassScreenContainer>
      <BannerAddMembership />
      <View
        style={{
          marginTop: 20,
          flexDirection: "row",
          paddingLeft: 32,
          width: "100%",
          flex: 2,
          alignItems: "center",
          flexShrink: 1,
        }}
      >
        <Image
          style={{
            // marginTop: 42,
            // height: 92,
            // width: 92,
            resizeMode: "center",
            borderRadius: 8,
            flex: 1,
          }}
          source={useDefault ? moc : { uri: mainURL }}
          onError={() => {
            handleError();
          }}
        />
        <View
          style={{
            flex: 2,
            marginLeft: 16,
            alignItems: "center",
          }}
        >
          <TSTitleText textStyles={{ textAlign: "center" }}>
            {title}{" "}
            {data?.user_is_owner
              ? "(Owner)"
              : data?.user_is_coach
              ? "(Coach)"
              : ""}
          </TSTitleText>
        </View>

        <View style={{ flex: 1, alignItems: "center" }}>
          <FavoriteGymClass id={id} />
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          width: "100%",
          flex: 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            paddingLeft: 32,
            paddingTop: 12,
            flex: 1,
            alignItems: "center",
            // backgroundColor: 'red',
          }}
        >
          <TSCaptionText>{desc}</TSCaptionText>
        </View>

        {data?.user_is_owner ? (
          <TouchableHighlight onPress={() => setShowCoachModal(true)}>
            <View style={{ paddingHorizontal: 8, alignItems: "center" }}>
              <Icon
                name="ios-stopwatch-outline"
                color={theme.palette.primary.main}
                style={{ fontSize: 24 }}
              />
              <SmallText>
                Coaches: {allCoaches?.length ? allCoaches.length : 0}
              </SmallText>
            </View>
          </TouchableHighlight>
        ) : (
          <></>
        )}
        {data?.user_is_owner || data?.user_is_coach ? (
          <TouchableHighlight onPress={() => setShowMembersModal(true)}>
            <View style={{ paddingHorizontal: 8, alignItems: "center" }}>
              <Icon
                name="ios-people-outline"
                color={theme.palette.secondary.main}
                style={{ fontSize: 24 }}
              />
              <SmallText>
                Members: {allMembers?.length ? allMembers.length : 0}
              </SmallText>
            </View>
          </TouchableHighlight>
        ) : (
          <></>
        )}
      </View>

      {!isLoading && data && data.user_can_edit ? (
        <View style={{ flex: 1 }}>
          <View
            style={{
              marginVertical: 8,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <TouchableHighlight
              style={{
                borderRadius: 8,
                flexDirection: "row",
                justifyContent: "center",
              }}
              onPress={() => {
                navigation.navigate("CreateWorkoutGroupScreen", {
                  ownedByClass: true,
                  ownerID: id,
                  gymClassProps: params,
                });
              }}
              testID={TestIDs.CreateWorkoutGroupScreenForClassBtn.name()}
            >
              <View
                style={{
                  backgroundColor: theme.palette.accent,
                  padding: 2,
                  marginRight: 8,
                  borderRadius: 112,
                }}
              >
                <Icon
                  name="add"
                  color={theme.palette.text}
                  style={{ fontSize: 24 }}
                />
              </View>
            </TouchableHighlight>

            {data?.user_is_owner ? (
              <Icon
                onPress={onConfirmDelete}
                name="remove-circle-sharp"
                color={darkRed}
                style={{ fontSize: 24, marginHorizontal: 8 }}
              />
            ) : (
              <></>
            )}
          </View>
        </View>
      ) : (
        <></>
      )}

      <View style={{ flex: 8, width: "100%", paddingHorizontal: 12 }}>
        <FilterGrid
          searchTextPlaceHolder="Search Workouts"
          uiView={WorkoutGroupSquares}
          items={workoutGroups}
          extraProps={{
            editable: data ? data.user_can_edit : false,
          }}
        />
      </View>
      <ManageMembersModal
        modalVisible={showMembersModal}
        onRequestClose={() => setShowMembersModal(false)}
        gymClassID={id}
      />
      <ManageCoachesModal
        modalVisible={showCoachModal}
        onRequestClose={() => setShowCoachModal(false)}
        gymClassID={id}
      />

      <DeleteActionCancelModal
        confirmName={title}
        actionText="Delete gym class"
        closeText="Close"
        onAction={onDelete}
        modalVisible={deleteGymClassModalVisible}
        onRequestClose={() => setDeleteGymClassModalVisibleVisible(false)}
      />
    </GymClassScreenContainer>
  );
};

export default GymClassScreen;
