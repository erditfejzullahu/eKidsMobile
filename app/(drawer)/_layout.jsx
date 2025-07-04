import { View, Text, StyleSheet } from 'react-native'
import React, {useEffect, useState} from 'react'
import { Drawer } from 'expo-router/drawer'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import { icons } from '../../constants'
import { Image } from 'react-native'
import { useRouter, usePathname, router, Link, Stack, useSegments } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import { logout, refresh } from '../../services/authService'
import { useGlobalContext } from '../../context/GlobalProvider'
import { getMetaValue } from '../../services/fetchingService'
import Topbar from '../../components/Topbar'
import { useDrawerUpdater } from '../../navigation/DrawerUpdater'
import { ScrollView } from 'react-native-gesture-handler'
import CustomModal from '../../components/Modal'
import Notifications from '../../components/Notifications'
import { useNotificationContext } from '../../context/NotificationState'
import { getAccessToken, getRefreshToken } from '../../services/secureStorage'
import * as SignalR from '@microsoft/signalr';
import { Notifier, NotifierComponents, Easing } from 'react-native-notifier';
import { useRole } from '../../navigation/RoleProvider'
import { useNavigation } from 'expo-router'
import { CommonActions } from '@react-navigation/native'
import ThemeToggle from '../../components/ThemeToggle'
import { useColorScheme } from 'nativewind'

const showIcons = (icon, size, color) => {
    return(
        <Image 
            source={icon}
            style={{ tintColor: color, height: size, width: size }}
            resizeMode="contain"
        />
    )
}

const CustomHeader = (props) => {
    const {colorScheme} = useColorScheme();
    const navigation = useNavigation();

    const {role} = useRole();
    
    const pathname = usePathname();
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false)

    useEffect(() => {
      console.log(pathname, " pathi");
      
    }, [pathname])

    const { user, setIsLoggedIn, isLoggedIn, setUser, setIsLoading } = useGlobalContext();
    
    const userData = user?.data?.userData;    

    const changeIconColor = (path) => {
        return path === pathname ? "#FFA001" : colorScheme === 'dark' ? "#fff" : "#000";
    }

    const handleLogout = async () => {
        try {
            await logout();
            setIsLoggedIn(false)
            setUser(null)
            navigation.dispatch(CommonActions.reset({
                index: 0, routes: [{name: "(auth)", state: {routes: [{name: "sign-in"}]}}]
            }))
        } catch (error) {
            console.error('Error ne logout ', error);
            
        }
    }

    const {drawerItems, drawerItemsUpdated} = useDrawerUpdater(); //get routes from this


    const DrawerItems = ({ pathname, routerProps }) => {
        
        const routerToSpecificFix = (drawerProps, path, iconType) => {
            if(path.includes('/course/lesson/')){
                if(iconType === 48 || iconType === 49){
                    router.replace(path)
                }else{
                    setModalVisible(true)
                }
            }else{
                router.replace(path)
            }
            
            // console.log(drawerProps);
            // console.log(path);
            // setTimeout(() => {
                drawerProps.closeDrawer();
            // }, 50);
        }
        return (
            <>
                {drawerItems.map((item, index) => (
                    <DrawerItem
                        key={index}
                        icon={({ color, size }) => showIcons(item.icon, 22, changeIconColor(item.path, pathname))}
                        label={item.label}
                        labelStyle={colorScheme === 'dark' ? style.labelItemDark : style.labelItemWhite}
                        onPress={() => routerToSpecificFix(routerProps, item.path, item.icon)}
                        // onPress={() => router.replace(item.path)}
                    />
                ))}
                
            </>
        );
    };
    
    return(
        <>
    <View className="h-full bg-primary-light dark:bg-primary border-l border-gray-200 dark:border-black-200 pt-6">
        <DrawerContentScrollView {...props} contentContainerStyle={{height:'100%'}}>
            <View className="flex-col h-full justify-between">
                <View className="absolute right-0 -top-4 z-50">
                    <ThemeToggle />
                </View>
                <View className="border-b-2 border-white dark:border-black-200 pb-6">

                    <View className="justify-center items-center mb-6 pb-6 border-b-2 border-white dark:border-black-200">
                        <View className="bg-secondary dark:bg-secondary h-14 w-14 align-middle items-center justify-center rounded-[15px] mt-2">
                            <Image 
                                source={{uri: userData?.profilePictureUrl || icons.userProfile}}
                                className="h-12 w-12 rounded-[10px]"
                                resizeMode='contain'
                            />
                        </View>
                        <View className="mt-4 mb-3">
                            <Text className="text-oBlack dark:text-white text-xl font-psemibold text-center">{userData?.firstname} {userData?.lastname}</Text>
                            <Text className="text-gray-600 dark:text-gray-200 text-sm font-pregular text-center mt-2">{userData?.email}</Text>
                            {/* <Text className="text-gray-200 text-sm font-pregular text-center mt-2">{getMetaValue(userData?.userMeta, "UserRole")}</Text> */}
                            <Text className="text-gray-600 dark:text-gray-200 text-sm font-pregular text-center mt-2">{role === "Instructor" ? "Instruktor" : role === "Student" ? "Student" : "Administrator"}</Text>
                        </View>
                    </View>

                <ScrollView className={`${drawerItemsUpdated ? 'h-[300px]' : 'h-[350px]'}`}>
                    <DrawerItems pathname={pathname} routerProps={props.navigation} />
                </ScrollView>
                </View>
                <View className="pl-4 items-end justify-end m-4 " style={{height: "140px"}}>
                    <TouchableOpacity className="flex-row bg-gray-200 dark:bg-oBlack items-center gap-2 rounded-xl max-w-max w-max p-4 border-2 border-white dark:border-white pb-5"
                    // style={{backgroundColor: "#13131a"}}
                    onPress={handleLogout}
                    >
                            <Image 
                                source={icons.logout}
                                style={{tintColor: colorScheme === 'dark' ? "#fff" : "#000", height:22, width:22}}
                                resizeMode='contain'
                            />
                            <Text className="text-oBlack dark:text-white text-base font-pmedium m-0 p-0 max-w-max w-max">
                                Shkyçuni
                            </Text>
                    </TouchableOpacity>
                </View>
            </View>

        </DrawerContentScrollView>
    </View>

            <CustomModal
                visible={modalVisible}
                title={"Njoftim mbi levizjen!"}
                onlyCancelButton={true}
                cancelButtonText={"Largo dritaren"}
                onClose={() => setModalVisible(false)}
            >
                <View>
                    <Text className="text-sm font-plight text-oBlack dark:text-white text-center">Ju lutem procedoni me vazhdimesine e perfundimit te leksioneve me rradhe! Eshte per te miren tuaj! Ne rast te ndonje problemi kontaktoni panelin e ndihmes!</Text>
                </View>
            </CustomModal>
        </>
    )
}

const _layout = () => {
    const [connection, setConnection] = useState(null)
    const {isOpened, setIsOpened, notificationsCount, setNotificationsCount, setCurrentConnection } = useNotificationContext();
    
    useEffect(() => {
        const connectToHub = async () => {
            const token = await getAccessToken();
            if(!token){
                return;
            }
            
            const newConnection = new SignalR.HubConnectionBuilder()
                .withUrl('https://dove-well-officially.ngrok-free.app/notificationsHub', {
                    headers: {
                        "Authorization" : "Bearer " + token
                    }
                })
                .configureLogging(SignalR.LogLevel.Information)
                .build();
            
            setConnection(newConnection);
            setCurrentConnection(newConnection);

            const startConnection = async () => {
                try {
                    await newConnection.start();
                    // if(newConnection.state === SignalR.HubConnectionState.Connected){
                        await invokeNotifications(newConnection); 
                    // }
                    console.log("connected to notification hub");
                } catch (error) {
                    if(error.message.includes('401')){
                        try {
                            const refreshToken = await getRefreshToken();
                            const refreshResponse = await refresh(refreshToken)
                            if(refreshResponse){
                                await connectToHub();
                            }
                        } catch (error) {
                            console.error('in layout refreshtoken error', error);
                        }
                    }else{
                        await handleReconnect();
                    }
                }
            }

            newConnection.on('UnreadNotifications', (unreadNotificationsCount) => {
                //global state for unread notifications
                console.log(unreadNotificationsCount, ' counteri i notifications');
                setNotificationsCount(unreadNotificationsCount);
            })

            newConnection.on('ReceiveNotification', (notification) => {
                Notifier.showNotification({
                    title: notification?.type === 1 ? "Informacione per ju!" : notification?.type === 2 ? "Shqyrtoni veprimin!" : notification?.type === 3 ? "Shtoni kujdesin!" : notification?.type === 4 ? "Kerkese miqesie!" : "Nderveprim tjeter!",
                    description: notification?.type === 4 ? `Hej ${notification?.notificationReceiver?.name}, keni kerkese miqesie nga ${notification?.notificationSender?.name}!` : item?.Information,
                    showAnimationDuration: 800,
                    hideAnimationDuration: 800,
                    Component: NotifierComponents.Notification,
                    componentProps: {
                        titleStyle: { color: '#fff', fontFamily: "Poppins-SemiBold" }, 
                        descriptionStyle: { color: '#9ca3af' , fontFamily: "Poppins-Light"},
                        containerStyle: { backgroundColor: '#161622' },
                        imageSource: (notification?.type === 4 || notification?.type === 5) ? {uri: notification?.notificationSender?.profilePicture} : icons.warning,
                        imageStyle: {
                            resizeMode: "cover"
                        }
                    },
                    easing: Easing.bounce,
                    onPress: () => setIsOpened(true)
                })
                console.log(' erdh');
                
            })

            newConnection.onclose(async (error) => {
                console.log("connection closed? ", error);
                if(error?.statusCode === 401){
                    await startConnection();
                }else{
                    await handleReconnect();
                }
            })

            const handleReconnect = async () => {
                setTimeout(async () => {
                    await connectToHub();
                }, 5000);
            }

            await startConnection();

        }

        connectToHub();

        return () => {
            if(connection){
                connection.stop();
            }
        }
    }, [])

    const invokeNotifications = async (connectionPassed) => {
        try {
            if(connectionPassed.state === SignalR.HubConnectionState.Connected){
                await connectionPassed.invoke('NotificationsUnreadCount');
                console.log('invoked');
            }
            
        } catch (error) {
            console.log(error, ' error infoking noptification count');
            
        }
    }
    
    
    return (
        <>
        <Drawer
        drawerContent={(props) => <CustomHeader {...props} />}
        screenOptions={{
          drawerPosition: "right",
          header: (props) => <Topbar {...props} />,
        }}
        >
            {/* <Drawer.Screen name="(tabs)" options={{ title: 'Main Tabs' }} /> */}
        </Drawer>
        {isOpened && <Notifications />}
        {/* <Stack.Screen name='users'/> */}
        {/* <Stack.Screen name='(learnOnline)' /> */}
        {/* <Stack.Screen name='(learnOnline)/meetings/[id]' />
        <Stack.Screen name='(learnOnline)/onlineClass/[id]' />
        <Stack.Screen name='(learnOnline)/tutor' /> */}
        </>
    )
}

const style = StyleSheet.create({
    sliderContainer:{
        backgroundColor: "#13131a"
    },
    labelItemDark: {
        marginLeft: 5,
        fontSize:16,
        fontFamily: "Poppins-Medium",
        color: "#fff"
    },
    labelItemWhite: {
        marginLeft: 5,
        fontSize:16,
        fontFamily: "Poppins-Medium",
        color: "#000"
    }
})

export default _layout