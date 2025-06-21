import { Platform } from "react-native";
import { StyleSheet } from "react-native";

export const shadowStyles = StyleSheet.create({
    light: {
        ...Platform.select({
            ios: {
                shadowColor: "#b8e1ff",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.6,
                shadowRadius: 10,
              },
              android: {
                elevation: 8,
              },
        })
    },
    dark: {
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.6,
                shadowRadius: 10,
              },
              android: {
                elevation: 8,
              },
        })
    },
})