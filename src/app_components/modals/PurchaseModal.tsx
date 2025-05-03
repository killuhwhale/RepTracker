import React, { FunctionComponent } from "react";

import {
  Linking,
  Modal,
  Pressable,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
  StyleSheet,
} from "react-native";

import { LargeButton, RegularButton } from "../Buttons/buttons";
import { TSButtonText, TSParagrapghText, TSSnippetText } from "../Text/Text";
import { centeredViewStyle, modalViewStyle } from "./modalStyles";
import { useTheme } from "styled-components/native";
import { PurchasesStoreProduct } from "react-native-purchases";

const PurchaseModal: FunctionComponent<{
  product: null | PurchasesStoreProduct;
  modalVisible: boolean;
  onRequestClose(): void;
  makePurchase: (product: PurchasesStoreProduct | null) => Promise<void>;
}> = ({ product, modalVisible, onRequestClose, makePurchase }) => {
  const theme = useTheme();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => onRequestClose()}
    >
      <View
        style={[
          centeredViewStyle.centeredView,
          { backgroundColor: "#000000DD" },
        ]}
      >
        <TouchableOpacity
          style={[
            centeredViewStyle.centeredView,
            { width: "100%", height: "100%" },
          ]}
          onPress={() => onRequestClose()}
        >
          <View
            style={[
              modalViewStyle.modalView,
              {
                backgroundColor: theme.palette.darkGray,
                width: "80%",
                height: "85%",
              },
            ]}
          >
            <View style={{ width: "100%", height: "100%" }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 6,
                  marginBottom: 12,
                  width: "100%",
                }}
              >
                {product ? (
                  //   <TSButtonText textStyles={{}}>
                  //     {product.price} {product.currencyCode}/mo
                  //   </TSButtonText>
                  <PurchaseOptions
                    product={product}
                    websiteUrl="https://reptrackrr.com"
                    makePurchase={makePurchase}
                  />
                ) : (
                  <></>
                )}
              </View>

              <View
                style={{
                  flex: 2,
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-around",
                  alignContent: "center",
                  alignItems: "center",
                  paddingVertical: 12,
                }}
              >
                <LargeButton
                  onPress={onRequestClose}
                  btnStyles={{
                    backgroundColor: "#DB4437",
                  }}
                  text={"Close"}
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

interface PurchaseOptionsProps {
  /** The product object you fetched via your IAP library */
  product: PurchasesStoreProduct;
  /** URL to your Stripe-powered purchase page */
  websiteUrl: string;
  /** Called when user taps the in-app purchase button */
  makePurchase: (product: PurchasesStoreProduct | null) => Promise<void>;
}

const PurchaseOptions: React.FC<PurchaseOptionsProps> = ({
  product,
  websiteUrl,
  makePurchase,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.palette.backgroundColor, borderRadius: 8 },
      ]}
    >
      {/* 1. In-App Purchase Option */}
      <TSSnippetText
        textStyles={[styles.heading, { color: theme.palette.text }]}
      >
        Subscribe via App Store
      </TSSnippetText>
      <View style={[styles.card, { backgroundColor: theme.palette.AWE_Blue }]}>
        <TSSnippetText
          textStyles={[styles.title, { color: theme.palette.text }]}
        >
          {product.title}
        </TSSnippetText>

        <TSSnippetText
          textStyles={[styles.note, { color: theme.palette.text }]}
        >
          Manage Subscription with Apple in the App Store.
        </TSSnippetText>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && { opacity: 0.7 },
            { backgroundColor: theme.palette.primary.main },
          ]}
          onPress={() => makePurchase(product)}
          accessibilityRole="button"
        >
          <TSSnippetText
            textStyles={[styles.buttonText, { color: theme.palette.AWE_Green }]}
          >
            Subscribe {product.priceString}
          </TSSnippetText>
        </Pressable>
      </View>

      {/* 2. External Site Option */}
      <TSSnippetText
        textStyles={[
          styles.heading,
          { color: theme.palette.text, marginTop: 32 },
        ]}
      >
        Subscribe via Website
      </TSSnippetText>
      <View style={[styles.card, { backgroundColor: theme.palette.AWE_Blue }]}>
        <TSSnippetText
          textStyles={[styles.note, { color: theme.palette.text }]}
        >
          Manage Subscription on our website
        </TSSnippetText>
        <TSSnippetText
          textStyles={[styles.note, { color: theme.palette.text }]}
        >
          Checkout with Stripe
        </TSSnippetText>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && { opacity: 0.7 },
            { backgroundColor: theme.palette.primary.main },
          ]}
          onPress={() => Linking.openURL(websiteUrl)}
          accessibilityRole="button"
        >
          <TSSnippetText
            textStyles={[styles.buttonText, { color: theme.palette.AWE_Green }]}
          >
            Go to Website
          </TSSnippetText>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    // If you want a subtle shadow:
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  note: {
    fontSize: 12,
    fontStyle: "italic",
    marginBottom: 16,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  buttonOutline: {
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: "center",
    marginTop: 12,
  },
  buttonOutlineText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PurchaseModal;
