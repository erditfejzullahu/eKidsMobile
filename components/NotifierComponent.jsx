import { View, Text } from 'react-native'
import React from 'react'
import { Notifier, NotifierComponents, Easing } from 'react-native-notifier';
import { icons } from '../constants';

const NotifierComponent = ({title, description, alertType = "success", onHideFunc = null, customImage = null, theme = 'dark', onPressFunc = {}}) => {
    //theme can be dark or light
    const showNotification = () => {
        let imageSource;

        if (customImage) {
            imageSource = typeof customImage === 'string' ? { uri: customImage } : customImage;
        } else {
            imageSource = alertType === "success" ? icons.checked 
            : alertType === "error" ? icons.error 
            : icons.warning;
        }

        Notifier.showNotification({
            title: title,
            description: description,
            duration: 3000,
            showAnimationDuration: 800,
            hideAnimationDuration: 800,
            Component: NotifierComponents.Notification,
            componentProps: {
                maxDescriptionLines: customImage ? 2 : undefined,
                alertType: alertType, // Can also be 'error' "warning" or 'info'
                titleStyle: { color: theme === "dark" ? '#fff' : "#13131a", fontFamily: "Poppins-SemiBold" }, 
                descriptionStyle: { color: theme === "dark" ? '#9ca3af' : "#4b5563", fontFamily: "Poppins-Light" },
                containerStyle: { backgroundColor: theme === "dark" ? '#161622' : "#f8f5f2", elevation: 8, shadowColor: theme === "dark" ? "#000" : "#b8e1ff"},
                imageSource: imageSource,
                imageStyle: {
                    tintColor: '#ff9c01',
                    resizeMode: "contain",
                },
            },
            easing: Easing.bounce,
            onHidden: onHideFunc,
            onPress: onPressFunc
        });
    }
  return {showNotification}
}

export default NotifierComponent