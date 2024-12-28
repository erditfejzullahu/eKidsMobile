import { 
    View, 
    Text, 
    ScrollView, 
    Dimensions, 
    Image, 
    StyleSheet, 
    Platform, 
    TouchableWithoutFeedback, 
    KeyboardAvoidingView 
} from 'react-native';
import React from 'react';
import { images } from '../constants';
import * as Animatable from 'react-native-animatable';
import { useNotificationContext } from '../context/NotificationState';

const Notifications = ({ onClose }) => {
    const screenHeight = Dimensions.get('window').height; // Get full screen height
    const scrollViewHeight = screenHeight - 180;
    const {setIsOpened} = useNotificationContext();
    const handleOutsidePress = (event) => {
        // This ensures touches inside the ScrollView or children are ignored
        if (event.target === event.currentTarget) {
            setIsOpened(false);
            console.log('asd');
            
        }
    };

    return (
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
            <Animatable.View
                animation="pulse"
                duration={400}
                className="w-full absolute h-full right-0 left-0"
                style={[{ backgroundColor: "rgba(0, 0, 0, 0.5)" }, styles.box]}
            >
                <View className="flex-1">
                    <TouchableWithoutFeedback style={styles.box}>
                        <ScrollView
                            className="w-[95%] max-h-[60%] mt-[100px] z-20 m-auto border border-black-200 bg-oBlack rounded-[10px]"
                            style={styles.box}
                        >
                            <View style={styles.box} className="border-b border-black-200 p-3 flex-row gap-2 flex-1">
                                <View className="self-start">
                                    <Image
                                        source={images.testimage}
                                        className="h-20 w-20 rounded-[5px]"
                                        resizeMode="cover"
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white font-psemibold text-xl" numberOfLines={1}>Njoftimi</Text>
                                    <Text className="text-gray-400 font-plight text-sm" numberOfLines={3}>Pershkrimi</Text>
                                </View>
                            </View>
                        </ScrollView>
                    </TouchableWithoutFeedback>
                </View>
            </Animatable.View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    box: {
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
        }),
    },
});

export default Notifications;
