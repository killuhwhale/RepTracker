import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components/native";
import {
  Container,
  SCREEN_WIDTH,
  darkRed,
  mdFontSize,
  smFontSize,
  isDateInFuture,
  SCREEN_HEIGHT,
} from "../../src/app_components/shared";
import {
  TSCaptionText,
  TSParagrapghText,
  MediumText,
  TSInputText,
  TSSnippetText,
  TSTitleText,
  TSButtonText,
} from "../../src/app_components/Text/Text";
import Icon from "react-native-vector-icons/Ionicons";

import { useTheme } from "styled-components";
import {
  apiSlice,
  useDeleteGymMutation,
  useGetProfileGymClassFavsQuery,
  useGetProfileGymFavsQuery,
  useGetProfileViewQuery,
  useGetUserGymsQuery,
  useUpdateUsernameMutation,
} from "../../src/redux/api/apiSlice";

import { RootStackParamList } from "../../src/navigators/RootStack";
import twrnc from "twrnc";

import * as RootNavigation from "../../src/navigators/RootNavigation";
import { StackScreenProps } from "@react-navigation/stack";
import {
  ActivityIndicator,
  Modal,
  Platform,
  StyleProp,
  TouchableHighlight,
  TouchableOpacity,
  View,
  ViewStyle,
  Image,
  Animated,
} from "react-native";

import thanks from "@/assets/images/thanks.png";

import {
  GymCardProps,
  GymClass,
  GymClassCardProps,
} from "../../src/app_components/Cards/types";
import Input from "../../src/app_components/Input/input";
import { debounce } from "../../src/utils/algos";
import DeleteActionCancelModal from "../../src/app_components/modals/deleteByNameModal";
import { RegularButton } from "../../src/app_components/Buttons/buttons";
import { TestIDs } from "../../src/utils/constants";

import BannerAddMembership from "../../src/app_components/ads/BannerAd";
import ProfileSettingsModal from "../../src/app_components/modals/profileSettingsModal";
import { UserProps } from "../types";
import Purchases, {
  PurchasesOffering,
  PurchasesStoreProduct,
} from "react-native-purchases";
import { store } from "@/src/redux/store";
import AuthManager from "@/src/utils/auth";
export type Props = StackScreenProps<RootStackParamList, "Profile">;

const PageContainer = styled(Container)`
  background-color: ${(props) => props.theme.palette.backgroundColor};
  justify-content: space-between;
  width: 100%;
`;

const Touchable = styled.TouchableHighlight`
  height: 100%;
  border-radius: 25px;
`;

interface UserInfoPanelProps {
  user: UserProps;
}
interface GymsPanelProps {
  data: GymCardProps[];
  onDelete(gym: GymCardProps): void;
}
interface FavGymCardProps {
  id?: string | number;
  user_id: string;
  date: string;
  gym: GymCardProps;
}
interface FavGymsPanelProps {
  data: FavGymCardProps[];
}
interface FavGymClassCardProps {
  id?: string | number;
  user_id: string;
  date: string;
  gym_class: GymClass;
}
interface FavGymClassesPanelProps {
  data: FavGymClassCardProps[];
}

const UserInfoPanel: FunctionComponent<UserInfoPanelProps> = (props) => {
  const theme = useTheme();
  const { id, email, username, sub_end_date } = props.user || {
    id: 0,
    email: "",
    username: "",
  };
  const user = props.user || {
    id: 0,
    email: "",
    username: "",
    membership_on: false,
  };
  const [showEditusername, setShowEditUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(username);
  const [_updateUsername, { isLoading }] = useUpdateUsernameMutation();
  const [savedUsername, setSavedUsername] = useState(false);

  const manageUpdateUsername = async (text: string) => {
    const data = new FormData();
    data.append("username", text);
    if (!isLoading) {
      const res = await _updateUsername(data).unwrap();
      if (res.username) {
        setSavedUsername(true);
      }
    }
  };

  // Persist fucntion calls based on input params, allows debounce to work
  const updateUsername = useCallback(debounce(manageUpdateUsername, 2992), []);

  // This cleanup function should run on unmount
  useEffect(() => {
    return function cleanup() {
      if (!savedUsername && username !== newUsername) {
        manageUpdateUsername(newUsername); // Attempt to save username
      }
    };
  }, [props]);

  return (
    <View style={{ width: "100%" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon
          name={showEditusername ? "close" : "pencil"}
          testID={TestIDs.ProfileEditUsernameBtn.name()}
          style={{
            fontSize: 24,
            marginRight: 8,
            marginLeft: 8,
            zIndex: 99,
          }}
          onPress={() => {
            setShowEditUsername(!showEditusername);
          }}
          color={theme.palette.text}
        />

        {showEditusername ? (
          <Input
            testID={TestIDs.ProfileEditUsernameField.name()}
            containerStyle={{
              backgroundColor: theme.palette.transparent,
              height: 35,
              borderRadius: 8,
              marginHorizontal: 4,
            }}
            inputStyles={{ textAlign: "center", fontSize: mdFontSize }}
            label=""
            onChangeText={(t: string) => {
              setNewUsername(t);
              setSavedUsername(false);
              updateUsername(t);
            }}
            value={newUsername}
            placeholder="Username"
          />
        ) : (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              paddingLeft: 24,
            }}
          >
            <View style={{ flexBasis: 0, flexShrink: 1, flexGrow: 5 }}>
              <TSInputText textStyles={{ textAlign: "left" }}>
                {newUsername}
              </TSInputText>
            </View>

            <View style={{ flexBasis: 0, flexShrink: 1, flexGrow: 2 }}>
              <TSCaptionText
                textStyles={{
                  color: `${isDateInFuture(user) ? "#FFD700" : "#C0C000"}`,
                  marginLeft: 10,
                  textAlign: "left",
                  textAlignVertical: "center",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                {isDateInFuture(user) ? "Member" : "Non-member"}
              </TSCaptionText>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const GymsPanel: FunctionComponent<GymsPanelProps> = ({ data, onDelete }) => {
  const theme = useTheme();

  const goToGym = (gym: GymCardProps) => {
    console.log("Navigate user to GymClasView with ID: ", gym);
    RootNavigation.navigate("GymScreen", gym);
  };

  return (
    <View style={{ width: "100%" }}>
      {data.map((gym) => {
        const { id, date, desc, title, mainImage, logoImage, owner_id } = gym;
        return (
          <View
            style={{
              height: 35,
              justifyContent: "space-between",
              borderWidth: 1,
              borderColor: theme.palette.darkGray,
              borderRadius: 8,
              marginVertical: 8,
            }}
            key={`gym${id}`}
          >
            <RegularButton
              key={id}
              underlayColor={theme.palette.transparent}
              onPress={() => goToGym(gym)}
              testID={`${TestIDs.GymRowTouchable.name()}_${title}`}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 16,
                  alignContent: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <TSParagrapghText>{title}</TSParagrapghText>
                <Icon
                  name="remove-circle-sharp"
                  color={darkRed}
                  style={{
                    fontSize: 24,
                  }}
                  onPress={() => onDelete(gym)}
                />
              </View>
            </RegularButton>
          </View>
        );
      })}
    </View>
  );
};

const FavGymsPanel: FunctionComponent<FavGymsPanelProps> = (props) => {
  const theme = useTheme();

  const goToGym = (gym: GymCardProps) => {
    RootNavigation.navigate("GymScreen", gym);
  };
  return (
    <View style={{ width: "100%" }}>
      {props.data.map((favGym) => {
        const {
          id,
          date,
          gym: { title, id: gym_id },
        } = favGym;
        return (
          <View
            style={{ height: 50, justifyContent: "space-between" }}
            key={`gymfav${id}_${gym_id}`}
          >
            <Touchable
              key={id}
              underlayColor={theme.palette.transparent}
              activeOpacity={0.9}
              onPress={() => goToGym(favGym.gym)}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon
                  name="star"
                  onPress={() => {}}
                  color={theme.palette.text}
                  style={{ fontSize: 24, margin: 12 }}
                />
                <TSCaptionText numberOfLines={1} textStyles={{ width: "80%" }}>
                  {title}
                </TSCaptionText>
              </View>
            </Touchable>
          </View>
        );
      })}
    </View>
  );
};

const FavGymClassesPanel: FunctionComponent<FavGymClassesPanelProps> = (
  props
) => {
  const theme = useTheme();
  const goToGymClass = (gymClass: GymClassCardProps) => {
    console.log("Going to class w/ ", gymClass);
    RootNavigation.navigate("GymClassScreen", gymClass);
  };

  return (
    <View style={{ width: "100%" }}>
      {props.data.map((favGymClass) => {
        const {
          id,
          date,
          gym_class: {
            title,
            id: gym_class_id,
            gym: { title: gymTitle },
          },
        } = favGymClass;
        return (
          <View
            style={{ height: 50, justifyContent: "space-between" }}
            key={`favclass${id}_${gym_class_id}`}
          >
            <Touchable
              key={id}
              underlayColor={theme.palette.transparent}
              activeOpacity={0.9}
              onPress={() =>
                goToGymClass(
                  favGymClass.gym_class as unknown as GymClassCardProps
                )
              }
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon
                  name="star"
                  onPress={() => {}}
                  color={theme.palette.text}
                  style={{ fontSize: 24, margin: 12 }}
                />

                <TSCaptionText numberOfLines={1} textStyles={{ width: "85%" }}>
                  {title} - {gymTitle}
                </TSCaptionText>
              </View>
            </Touchable>
          </View>
        );
      })}
    </View>
  );
};

const Profile: FunctionComponent<Props> = () => {
  const theme = useTheme();

  // Force Logout... dev
  // const auth = AuthManager;
  // auth
  //   .logout()
  //   .then((res) => {
  //     console.log("ProfileSettings: Logged out");
  //   })
  //   .catch((err) => console.log("ProfileSettings Logout Error", err));

  const { data, isLoading, isSuccess, isError, error } =
    useGetProfileViewQuery("");

  const loadedProductsRef = useRef(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [makePurchaseLoading, setMakePurchaseLoading] = useState(false);

  const [curProducts, setCurProducts] = useState<
    PurchasesStoreProduct[] | null
  >(null);

  useEffect(() => {
    Purchases.invalidateCustomerInfoCache();
  }, []);

  const invalidateUser = () => {
    store.dispatch(apiSlice.util.invalidateTags(["User"]));
  };

  const makePurchase = async (product: PurchasesStoreProduct) => {
    try {
      console.log("Making purchase....");
      const purchaseRes = await Purchases.purchaseStoreProduct(product);
      console.log("Made purchases for IAP: ", product.identifier, purchaseRes);
    } catch (err) {
      console.error("Error purchasing sub: ", err);
    }
    try {
      setMakePurchaseLoading(true);
      setTimeout(() => {
        invalidateUser();
        setMakePurchaseLoading(false);
        startThankYouFadeIn();
      }, 2200);
    } catch (err) {
      console.log("Error invalidating user after makepurchase: ", err);
    }
  };

  // console.log("Profile user: ", error, data);

  if (data && !isLoading && !loadedProductsRef.current) {
    const setup = async () => {
      try {
        if (Platform.OS == "ios") {
          await Purchases.configure({
            apiKey: "appl_oJUBkeeihLnvPlQUJVxhUTCkHWo",
          });
          const products = await Purchases.getProducts(["sub_remove_ads"]);
          console.log("Got ios product: ", products);
          loadedProductsRef.current = true;
          setCurProducts(products);
        } else if (Platform.OS == "android") {
          await Purchases.configure({
            apiKey: "goog_ruuVJMgQrGOBuoxnbJSgzHnIQph",
          });
          const products = await Purchases.getProducts(["sub_remove_ads"]);
          console.log("Got android product: ", products);
          loadedProductsRef.current = true;
          setCurProducts(products);
        }

        await Purchases.setAttributes({
          userID: data?.user.id.toString(),
        });
        await Purchases.syncAttributesAndOfferingsIfNeeded();
      } catch (err) {
        console.log("Error getting offerings: ", err);
      }
    };

    Purchases.setDebugLogsEnabled(true);
    setup()
      .then(() => (loadedProductsRef.current = true))
      .catch(console.log);
  }

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const startThankYouFadeIn = () => {
    Animated.timing(fadeAnim, {
      delay: 500,
      toValue: 1, // Final opacity value (fully visible)
      duration: 7000, // Duration of the fade-in effect (10 second)
      useNativeDriver: true, // Optimize performance
    }).start();
  };

  if (isSuccess && isDateInFuture(data.user)) {
    startThankYouFadeIn();
  } else if (isSuccess && !isDateInFuture(data.user)) {
    fadeAnim.setValue(0);
  }

  return (
    <PageContainer>
      <BannerAddMembership />
      {isLoading ? (
        <ActivityIndicator size="small" color={theme.palette.text} />
      ) : isSuccess ? (
        <View style={{ flex: 1, width: "100%", marginTop: 12 }}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              width: "100%",
            }}
          >
            <TouchableHighlight
              hitSlop={{ bottom: 12, left: 12, right: 12, top: 12 }}
              onPress={() => setModalVisible(!modalVisible)}
              testID={TestIDs.OpenSettingsModalBtn.name()}
              style={{
                flex: 1,
                borderRadius: 12,
                justifyContent: "center",
                alignItems: "flex-end",
              }}
            >
              <Icon
                name="settings"
                color={theme.palette.text}
                style={{
                  fontSize: 24,
                  marginRight: 24,
                }}
              />
            </TouchableHighlight>
          </View>
          <View
            style={{
              flex: 2,
              flexDirection: "row",

              justifyContent: "flex-start",
            }}
          >
            <View style={{ flex: 5 }}>
              <UserInfoPanel user={data.user} />
            </View>
          </View>
          {Platform.OS === "ios" || Platform.OS === "android" ? (
            <View
              style={{
                flex: 8,
                flexDirection: "row",

                justifyContent: "flex-start",
              }}
            >
              {!isDateInFuture(data.user, true) ? (
                <View
                  style={{
                    width: "100%",
                    flex: 1,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <TSTitleText>In App Purchase</TSTitleText>
                  </View>

                  <View
                    style={{
                      flex: 9,
                      justifyContent: "flex-start",
                      alignContent: "flex-start",
                      alignItems: "flex-start",
                    }}
                  >
                    {makePurchaseLoading ? (
                      <ActivityIndicator
                        size="small"
                        color={theme.palette.text}
                      />
                    ) : (
                      <View
                        style={{
                          width: "100%",
                          flex: 1,
                          marginTop: 12,

                          borderRadius: 8,
                          justifyContent: "center",
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            justifyContent: "flex-start",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          {curProducts ? (
                            <View>
                              {curProducts.map((product) => {
                                return (
                                  <View
                                    style={{
                                      width: "80%",
                                      backgroundColor:
                                        twrnc.color("bg-blue-600"),
                                      borderRadius: 8,
                                    }}
                                    key={product.identifier}
                                  >
                                    <TouchableHighlight
                                      onPress={() =>
                                        makePurchase(product).catch((err) =>
                                          console.error(
                                            "Error makePurchase: ",
                                            err
                                          )
                                        )
                                      }
                                    >
                                      <View
                                        style={{
                                          marginVertical: 12,
                                          paddingHorizontal: 12,
                                        }}
                                      >
                                        <TSButtonText
                                          textStyles={{ textAlign: "center" }}
                                        >
                                          Remove Ads!
                                        </TSButtonText>
                                        <TSSnippetText
                                          textStyles={{ textAlign: "center" }}
                                        >
                                          {product.description}
                                        </TSSnippetText>
                                        <TSSnippetText
                                          textStyles={{ textAlign: "center" }}
                                        >
                                          {product.price} {product.currencyCode}{" "}
                                          / Month
                                        </TSSnippetText>
                                      </View>
                                    </TouchableHighlight>
                                  </View>
                                );
                              })}
                              <TSCaptionText>
                                With a Subscription:
                              </TSCaptionText>
                              <TSCaptionText>- remove all ads</TSCaptionText>
                              <TSCaptionText>
                                - create unlimited workouts{" "}
                                <TSCaptionText
                                  textStyles={{ color: "red", fontSize: 9 }}
                                >
                                  (limit 1 per day without membersip)
                                </TSCaptionText>
                              </TSCaptionText>
                              <TSCaptionText>
                                - support an independent developer
                              </TSCaptionText>
                            </View>
                          ) : (
                            <ActivityIndicator
                              size="small"
                              color={theme.palette.text}
                            />
                          )}
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              ) : (
                <View style={{ flex: 4 }}>
                  <TSParagrapghText textStyles={{ textAlign: "center" }}>
                    Thanks for your support!
                  </TSParagrapghText>
                  <Animated.Image
                    source={thanks}
                    style={[
                      {
                        width: SCREEN_WIDTH,
                        height: SCREEN_HEIGHT / 3,
                        borderRadius: 8,
                      },
                      { opacity: fadeAnim }, // Bind animated opacity to style
                    ]}
                  />
                </View>
              )}
            </View>
          ) : (
            <></>
          )}

          {/* {dataGymFavs?.favorite_gyms?.length > 0 ? (
            <View style={{ flex: 4, width: "100%" }}>
              <TSCaptionText>Favorite Gyms</TSCaptionText>
              <ScrollView>
                <FavGymsPanel data={dataGymFavs?.favorite_gyms} />
              </ScrollView>
            </View>
          ) : (
            <View style={{ flex: 4 }} />
          )}

          {dataGymClassFavs?.favorite_gym_classes?.length > 0 ? (
            <View style={{ flex: 4, width: "100%" }}>
              <TSCaptionText> Favorite Gym Classes</TSCaptionText>
              <ScrollView>
                <FavGymClassesPanel
                  data={dataGymClassFavs?.favorite_gym_classes}
                />
              </ScrollView>
            </View>
          ) : (
            <View style={{ flex: 4 }} />
          )}

          {usersGyms?.length ? (
            <View style={{ flex: 8, width: "100%" }}>
              <TSParagrapghText>My Gyms</TSParagrapghText>
              <ScrollView style={{ width: "100%" }}>
                <GymsPanel data={usersGyms} onDelete={onConfirmDelete} />
              </ScrollView>
            </View>
          ) : (
            <View style={{ flex: 6 }} />
          )} */}

          <ProfileSettingsModal
            modalVisible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
            user={data.user}
          />

          {/* <DeleteActionCancelModal
            confirmName={curDelGym.title}
            actionText="Delete gym"
            closeText="Close"
            onAction={onDelete}
            modalVisible={deleteGymModalVisible}
            onRequestClose={() => setDeleteGymModalVisibleVisible(false)}
          /> */}
        </View>
      ) : isError ? (
        <TSCaptionText>Error.... {error.toString()}</TSCaptionText>
      ) : (
        <TSCaptionText>No Data</TSCaptionText>
      )}
    </PageContainer>
  );
};

export default Profile;

/** Code for Favorites in body of Profile, replace once we are using gyms and classes
 *
 *
  // const {
  //   data: dataGymFavs,
  //   isLoading: isLoadingGymFavs,
  //   isSuccess: isSuccessGymFavs,
  //   isError: isErrorGymFavs,
  //   error: errorGymFavs,
  // } = useGetProfileGymFavsQuery("");

  // const {
  //   data: dataGymClassFavs,
  //   isLoading: isLoadingGymClassFavs,
  //   isSuccess: isSuccessGymClassFavs,
  //   isError: isErrorGymClassFavs,
  //   error: errorGymClassFavs,
  // } = useGetProfileGymClassFavsQuery("");

  // const {
  //   data: usersGyms,
  //   isLoading: userGymsLoading,
  //   isSuccess: gymIsSuccess,
  //   isError: gymIsError,
  //   error: gymError,
  // } = useGetUserGymsQuery("");

  // const [deleteGymModalVisible, setDeleteGymModalVisibleVisible] =
  //   useState(false);

  // const [curDelGym, setCurDelGym] = useState({} as GymCardProps);

  // const [deleteGymMutation, { isLoading: deleteGymLoading }] =
  //   useDeleteGymMutation();

  // const onConfirmDelete = (gym: GymCardProps) => {
  //   setCurDelGym(gym);
  //   setDeleteGymModalVisibleVisible(true);
  // };

  // const onDelete = async () => {
  //   try {
  //     const deletedGym = await deleteGymMutation(curDelGym.id).unwrap();
  //     console.log("Deleted Gym: ", deletedGym);
  //     setDeleteGymModalVisibleVisible(false);
  //   } catch (error) {
  //     console.log("Error deleting gym: ", error);
  //   }
  // };
 *
 */
