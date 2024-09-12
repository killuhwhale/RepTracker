import { useGetUserInfoQuery } from "../../redux/api/apiSlice";
import {
  GAMBannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import React, { FunctionComponent } from "react";

import { isDateInFuture } from "../shared";
import { UserProps } from "@/app/types";
import { View } from "react-native";

const BannerAddMembership: FunctionComponent = () => {
  const {
    data: _userData,
    isLoading: userIsloading,
    isSuccess: userIsSuccess,
    isError: userIsError,
    error: userError,
  } = useGetUserInfoQuery("");

  const userData = _userData as UserProps;

  return (
    <View style={{ width: "100%" }}>
      {userIsloading ? (
        <></>
      ) : !userIsloading &&
        userData &&
        isDateInFuture(userData.sub_end_date) ? (
        <></>
      ) : (
        <GAMBannerAd
          unitId={TestIds.BANNER}
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
