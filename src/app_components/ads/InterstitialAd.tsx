import { useGetUserInfoQuery } from "../../redux/api/apiSlice";
import {
  GAMBannerAd,
  BannerAdSize,
  TestIds,
  InterstitialAd,
  AdEventType,
} from "react-native-google-mobile-ads";
import React, { FunctionComponent, useEffect, useState } from "react";

import { useTheme } from "styled-components";
import { RegularButton } from "../Buttons/buttons";
import { View } from "react-native";
import { UserProps } from "@/app/types";

const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ["fashion", "clothing"],
});

const InterstitialAdMembership: FunctionComponent<{
  onClose?(): void;
  text: string;
  testID?: string;
  show?: boolean;
}> = (props) => {
  const theme = useTheme();
  const {
    data: _userData,
    isLoading: userIsloading,
    isSuccess: userIsSuccess,
    isError: userIsError,
    error: userError,
  } = useGetUserInfoQuery("");

  const userData = _userData as UserProps;

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const onAdLoaded = () => setLoaded(true);

    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.LOADED,
      onAdLoaded
    );

    // Event listener for ad closed
    const onAdClosed = () => {
      setLoaded(false);
      interstitial.load(); // Reload the ad when it is closed
      if (props.onClose) props.onClose(); // Execute onClose prop if provided
    };
    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      onAdClosed
    );

    // Start loading the interstitial straight away
    interstitial.load();

    // Unsubscribe from events on unmount
    return () => {
      unsubscribe();
      unsubscribeClosed();
    };
  }, []);

  // Function to show the ad if loaded
  const showAd = () => {
    if (loaded) {
      interstitial.show();
    }
  };

  useEffect(() => {
    if (props.show) {
      showAd(); // Trigger the ad display based on the `show` prop
    }
  }, [props.show, loaded]);

  return <View></View>;
};

export default InterstitialAdMembership;
