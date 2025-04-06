import {
  useGetAdUnitsQuery,
  useGetUserInfoQuery,
} from "@/src/redux/api/apiSlice";
import {
  GAMBannerAd,
  BannerAdSize,
  TestIds,
  InterstitialAd,
  AdEventType,
} from "react-native-google-mobile-ads";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";

import { useTheme } from "styled-components";
import { RegularButton } from "@/src/app_components/Buttons/buttons";
import { Platform, View } from "react-native";
import { UserProps } from "@/app/types";

const INTERSTITIAL_AD_UNIT =
  Platform.OS == "ios" ? "ios_interstitial" : "android_interstitial";

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

  const { data, isLoading } = useGetAdUnitsQuery("");
  const interstitialRef = useRef<InterstitialAd | null>(null);

  const [loaded, setLoaded] = useState(false);
  const adUnit =
    !isLoading && data && data[INTERSTITIAL_AD_UNIT].length > 0
      ? data[INTERSTITIAL_AD_UNIT]
      : TestIds.INTERSTITIAL;

  console.log("adUnit: ", adUnit);

  useEffect(() => {
    if (!interstitialRef.current) {
      interstitialRef.current = InterstitialAd.createForAdRequest(adUnit, {
        requestNonPersonalizedAdsOnly: true,
        keywords: ["fitness", "fashion", "clothing"],
      });
    }

    const onAdLoaded = () => setLoaded(true);

    const unsubscribe = interstitialRef.current.addAdEventListener(
      AdEventType.LOADED,
      onAdLoaded
    );

    // Event listener for ad closed
    const onAdClosed = () => {
      setLoaded(false);
      interstitialRef.current?.load(); // Reload the ad when it is closed
      if (props.onClose) props.onClose(); // Execute onClose prop if provided
    };
    const unsubscribeClosed = interstitialRef.current.addAdEventListener(
      AdEventType.CLOSED,
      onAdClosed
    );

    // Start loading the interstitial straight away

    interstitialRef.current.load();

    // Unsubscribe from events on unmount
    return () => {
      unsubscribe();
      unsubscribeClosed();
    };
  }, []);

  // Function to show the ad if loaded
  const showAd = () => {
    if (loaded) {
      interstitialRef.current?.show();
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
