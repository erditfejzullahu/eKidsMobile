import { StyleSheet, Text, View } from 'react-native'
import { Slot, SplashScreen, Stack } from 'expo-router'
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import GlobalProvider from '../context/GlobalProvider'
import { NotifierWrapper } from 'react-native-notifier';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import "../global.css"
import Drawer from 'expo-router/drawer';
import DrawerUpdaterProvider from '../navigation/DrawerUpdater';
import TopbarUpdaterProvider from '../navigation/TopbarUpdater';
import NotificationProvider from '../context/NotificationState';
import BlogsDrawerProvider from '../context/BlogsDrawerProvider';
import LessonCommentsProvider from '../context/LessonCommentsProvider';


import DonationModal from '../components/DonationModal'; 
// enableScreens();

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [fontsLoaded, error] = useFonts({
        "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
        "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-ExtraBold": require('../assets/fonts/Poppins-ExtraBold.ttf'),
        "Poppins-ExtraLight": require('../assets/fonts/Poppins-ExtraLight.ttf'),
        "Poppins-Light": require('../assets/fonts/Poppins-Light.ttf'),
        "Poppins-Medium": require('../assets/fonts/Poppins-Medium.ttf'),
        "Poppins-Regular": require('../assets/fonts/Poppins-Regular.ttf'),
        "Poppins-SemiBold": require('../assets/fonts/Poppins-SemiBold.ttf'),
        "Poppins-Thin": require('../assets/fonts/Poppins-Thin.ttf'),
    });

    useEffect(() => {
      const interval = setInterval(() => {
        setModalOpen(true)
      }, 3600000); // 1 ore
      return () => clearInterval(interval)
    }, [])
    

    useEffect(() => {
        if(error) throw error;

        if(fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded, error])

    if(!fontsLoaded && !error) return null;

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <GlobalProvider>
                <NotifierWrapper>
                    <NotificationProvider>
                        <DrawerUpdaterProvider>
                            <TopbarUpdaterProvider>
                                <BlogsDrawerProvider>
                                    <LessonCommentsProvider>
                                        <Stack screenOptions={{gestureEnabled: true}}>
                                            <Stack.Screen name="index" options={{ headerShown: false }} />
                                            <Stack.Screen name="(auth)" options={{ headerShown: false}} />
                                            <Stack.Screen name="(drawer)" options={{ headerShown: false, gestureEnabled: true }}/>
                                            {/* <Stack.Screen name="(drawer)" options={{ headerShown: false }} /> */}
                                            {/* <Stack.Screen name="(drawer)/(tabs)" options={{ headerShown: false }} /> */}
                                        </Stack>
                                    </LessonCommentsProvider>
                                </BlogsDrawerProvider>
                            </TopbarUpdaterProvider>
                        </DrawerUpdaterProvider>
                    </NotificationProvider>
                </NotifierWrapper>
            </GlobalProvider>
            <DonationModal open={modalOpen} setOpen={setModalOpen}/>
        </GestureHandlerRootView>
    )
}

export default RootLayout
