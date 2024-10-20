import {
  useGetAdUnitsQuery,
  useGetUserInfoQuery,
} from "../../redux/api/apiSlice";
import {
  GAMBannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import React, { FunctionComponent } from "react";

import { isDateInFuture } from "../shared";
import { UserProps } from "@/app/types";
import { Platform, View } from "react-native";

const BANNER_AD_UNIT = Platform.OS == "ios" ? "ios_banner" : "android_banner";

const BannerAddMembership: FunctionComponent = () => {
  const {
    data: _userData,
    isLoading: userIsloading,
    isSuccess: userIsSuccess,
    isError: userIsError,
    error: userError,
  } = useGetUserInfoQuery("");

  const userData = _userData as UserProps;
  const { data, isLoading } = useGetAdUnitsQuery("");

  const adUnit =
    !isLoading && data[BANNER_AD_UNIT].length > 0
      ? data[BANNER_AD_UNIT]
      : TestIds.BANNER;
  console.log("Ad data: ", data);
  return (
    <View style={{ width: "100%" }}>
      {userIsloading ? (
        <></>
      ) : !userIsloading && userData && isDateInFuture(userData) ? (
        <></>
      ) : (
        <GAMBannerAd
          unitId={adUnit}
          sizes={[BannerAdSize.FULL_BANNER]}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      )}
    </View>
  );
};

export default BannerAddMembership;
