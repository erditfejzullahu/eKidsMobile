import { View, Text, StyleSheet } from 'react-native'
import React, {useEffect, useState} from 'react'
import { Drawer } from 'expo-router/drawer'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import { icons } from '../../constants'
import { Image } from 'react-native'
import { useRouter, usePathname, router, Link, Stack, useSegments } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import { logout } from '../../services/authService'
import { useGlobalContext } from '../../context/GlobalProvider'
import { getMetaValue } from '../../services/fetchingService'
import Topbar from '../../components/Topbar'
import { useLocalSearchParams } from 'expo-router'
import { useDrawerUpdater } from '../../navigation/DrawerUpdater'
import { ScrollView } from 'react-native-gesture-handler'
import CustomModal from '../../components/Modal'
import Notifications from '../../components/Notifications'
import { useNotificationContext } from '../../context/NotificationState'

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
    
    
    const pathname = usePathname();
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false)

    useEffect(() => {
      console.log(pathname, " pathi");
      
    }, [pathname])

    const { user, setIsLoggedIn, isLoggedIn, setUser, setIsLoading } = useGlobalContext();
    
    const userData = user?.data?.userData;
    // console.log(userData);
    

    const changeIconColor = (path) => {
        // console.log(path);
        
        return path === pathname ? "#FFA001" : "#fff";
    }

    const handleLogout = async () => {
        try {
            await logout();
            setIsLoggedIn(false)
            setUser(null)
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
            setTimeout(() => {
                drawerProps.closeDrawer();
            }, 50);
        }
        return (
            <>
                {drawerItems.map((item, index) => (
                    <DrawerItem
                        key={index}
                        icon={({ color, size }) => showIcons(item.icon, 22, changeIconColor(item.path, pathname))}
                        label={item.label}
                        labelStyle={style.labelItem}
                        onPress={() => routerToSpecificFix(routerProps, item.path, item.icon)}
                        // onPress={() => router.replace(item.path)}
                    />
                ))}
                
            </>
        );
    };
    
    return(
        <>
    <View className="h-full bg-primary border-r-1 border-cyan-950 pt-6">
        <DrawerContentScrollView {...props} contentContainerStyle={{height:'100%'}}>
            <View className="flex-col h-full justify-between">
                
                <View className="border-b-2 border-black-200 pb-6">

                    <View className="justify-center items-center mb-6 pb-6 border-b-2 border-black-200">
                        <View className="bg-secondary h-14 w-14 align-middle items-center justify-center rounded-[15px] mt-2">
                            <Image 
                                source={{uri: userData?.profilePictureUrl || icons.userProfile}}
                                className="h-12 w-12 rounded-[10px]"
                                resizeMode='contain'
                            />
                        </View>
                        <View className="mt-4 mb-3">
                            <Text className="text-white text-xl font-psemibold text-center">{userData?.firstname} {userData?.lastname}</Text>
                            <Text className="text-gray-200 text-sm font-pregular text-center mt-2">{userData?.email}</Text>
                            <Text className="text-gray-200 text-sm font-pregular text-center mt-2">{getMetaValue(userData?.userMeta, "UserRole")}</Text>
                        </View>
                    </View>

                    {/* <TouchableOpacity onPress={router.push('/profile')}>??ASDA?</TouchableOpacity> */}

                    {/* <DrawerItem icon={({color, size}) => (
                        showIcons(icons.profile, 22, changeIconColor('/profile'))
                    )} 
                        label={'Profili im'}
                        labelStyle={{ ...style.labelItem, color: changeIconColor('/profile')}}
                        onPress={() => router.push('/profile')}
                    />
                    <DrawerItem icon={({color, size}) => (
                        showIcons(icons.parents, 22, changeIconColor('/all-parents'))
                        
                    )}
                        label={'Prindërit pjesëmarrës'}
                        labelStyle={{ ...style.labelItem, color: changeIconColor('/all-parents')}}
                        onPress={() => {
                            router.push('/all-parents')
                        }}
                    />
                    <DrawerItem icon={({color, size}) => (
                        showIcons(icons.students, 22, changeIconColor('/all-students'))
                    )}
                        label={'Statistikat studentore'}
                        labelStyle={{ ...style.labelItem, color: changeIconColor('/all-students')}}
                        onPress={() => {
                            router.push('/all-students')
                        }}
                    />
                    <DrawerItem icon={({color, size}) => (
                        showIcons(icons.plus, 22, changeIconColor('/add-quiz'))
                    )}
                        label={'Shto një kuiz'}
                        labelStyle={{ ...style.labelItem, color: changeIconColor('/add-quiz')}}
                        onPress={() => {
                            router.push('/add-quiz')
                        }}
                    />
                    <DrawerItem icon={({color, size}) => (
                        showIcons(icons.statistics, 22, changeIconColor('/my-statistics'))
                    )}
                        label={'Statistikat e mia'}
                        labelStyle={{ ...style.labelItem, color: changeIconColor('/my-statistics')}}
                        onPress={() => {
                            router.push('/my-statistics')
                        }}
                    />
                    <DrawerItem icon={({color, size}) => (
                        showIcons(icons.generalsStats, 22, changeIconColor('/general-statistics'))
                    )}
                        label={'Statistikat gjenerale'}
                        labelStyle={{ ...style.labelItem, color: changeIconColor('/general-statistics')}}
                        onPress={() => {
                            router.push('/general-statistics')
                        }}
                    /> */}

                <ScrollView className={`${drawerItemsUpdated ? 'h-[300px]' : ''}`}>
                    <DrawerItems pathname={pathname} routerProps={props.navigation} />
                </ScrollView>
                </View>
                <View className="pl-4 items-end justify-end m-4 " style={{height: "140px"}}>
                    <TouchableOpacity className="flex-row items-center gap-2 rounded-xl max-w-max w-max p-4 border-2 border-white pb-5"
                    style={{backgroundColor: "#13131a"}}
                    onPress={handleLogout}
                    >
                            <Image 
                                source={icons.logout}
                                style={{tintColor: "white", height:22, width:22}}
                                resizeMode='contain'
                            />
                            <Text className="text-white text-base font-pmedium m-0 p-0 max-w-max w-max">
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
                    <Text className="text-sm font-plight text-white text-center">Ju lutem procedoni me vazhdimesine e perfundimit te leksioneve me rradhe! Eshte per te miren tuaj! Ne rast te ndonje problemi kontaktoni panelin e ndihmes!</Text>
                </View>
            </CustomModal>
        </>
    )
}

const _layout = () => {
    const {isOpened, setIsOpened } = useNotificationContext();
    
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
        </>
    )
}

const style = StyleSheet.create({
    sliderContainer:{
        backgroundColor: "#13131a"
    },
    labelItem: {
        marginLeft: 5,
        fontSize:16,
        fontFamily: "Poppins-Medium",
        color: "#fff"
    }
})

export default _layout