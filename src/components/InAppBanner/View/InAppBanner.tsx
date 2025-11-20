import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { BannerProps } from "../Model/BannerProps";

const InAppBanner: React.FC<BannerProps> = ({ title, body, onPress, onClose }) => {
  return (
    <View style={styles.overlayContainer}>
      {/* 🔹 Overlay behind banner */}
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />

      {/* 🔹 Actual Banner */}
      <TouchableOpacity style={styles.banner} onPress={onPress} activeOpacity={0.9}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)"
  },

  banner: {
    width: "92%",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6
  },

  title: {
    fontWeight: "bold",
    fontSize: 17,
  },

  body: {
    marginTop: 4,
    fontSize: 14,
    color: "#333"
  },
});

export default InAppBanner;

