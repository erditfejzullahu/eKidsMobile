import { View, Text } from 'react-native'
import React from 'react'
import { Notifier, NotifierComponents, Easing } from 'react-native-notifier';
import { icons } from '../constants';

const NotifierComponent = ({title, description, alertType = "success", onHideFunc = null, customImage = null}) => {
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
                titleStyle: { color: '#fff', fontFamily: "Poppins-SemiBold" }, 
                descriptionStyle: { color: '#9ca3af', fontFamily: "Poppins-Light" },
                containerStyle: { backgroundColor: '#161622' },
                imageSource: imageSource,
                imageStyle: {
                    tintColor: '#ff9c01',
                    resizeMode: "contain",
                },
            },
            easing: Easing.bounce,
            onHidden: onHideFunc
        });
    }
  return {showNotification}
}

export default NotifierComponent