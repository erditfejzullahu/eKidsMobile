import { View, Text } from 'react-native'
import React from 'react'
import { Notifier, NotifierComponents, Easing } from 'react-native-notifier';
import { icons } from '../constants';

const NotifierComponent = ({title, description, alertType = "success", onHideFunc = null}) => {
    const showNotification = () => {
        Notifier.showNotification({
            title: title,
            description: description,
            duration: 3000,
            showAnimationDuration: 800,
            hideAnimationDuration: 800,
            Component: NotifierComponents.Notification,
            componentProps: {
                alertType: alertType, // Can also be 'error' or 'info'
                titleStyle: { color: '#fff', fontFamily: "Poppins-SemiBold" }, 
                descriptionStyle: { color: '#9ca3af' },
                containerStyle: { backgroundColor: '#161622' },
                imageSource: alertType === "success" ? icons.checked : alertType === "error" ? icons.error : icons.warning,
                imageStyle: {
                    tintColor: '#ff9c01',
                },
            },
            easing: Easing.bounce,
            onHidden: onHideFunc
        });
    }
  return {showNotification}
}

export default NotifierComponent