import { View, Text, Image, TextInput, ScrollView } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons, images } from '../constants'
import { TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { useNavigation } from 'expo-router'
import { DrawerActions } from '@react-navigation/native'
import { useState } from 'react'
import { useTopbarUpdater } from '../navigation/TopbarUpdater'
import { useNotificationContext } from '../context/NotificationState'

const Topbar = () => {
    const router = useRouter()
    const navigator = useNavigation();
    const [retrivedData, setRetrivedData] = useState(null)
    const [notificationsOpened, setNotificationsOpened] = useState(false)
    const {showSearcher} = useTopbarUpdater();
    const {isOpened, setIsOpened} = useNotificationContext();

  return (
    <SafeAreaView className="relative h-[90px]" style={{backgroundColor: "#13131a", borderBottomColor: "#232533", borderBottomWidth: 1}}>
      <View className="flex-row justify-between" style={{height:40}}>
        <View className="justify-center items-end">
            <TouchableOpacity
                onPress={() => router.replace('(drawer)/(tabs)/home')}
            >
                <Image 
                    source={images.logoNoText}
                    resizeMode="contain"
                    className="h-10 w-10 ml-4"
                />
            </TouchableOpacity>
        </View>
        {showSearcher && <View className="jusitfy-center items-center flex-1">
            <TextInput 
                placeholder='Kerkoni perdorues...'
                placeholderTextColor={"#414141"}
                className="border bg-primary border-black-200 h-10 mt-1 p-2 rounded-[5px] w-[80%]"
            />
        </View>}
        <View className="justify-center flex-row gap-4 items-center" style={{height:40}}>
            <View>
                <TouchableOpacity
                    onPress={() => setIsOpened(true)}
                >
                    <Image 
                        source={icons.notifications}
                        className="h-6 w-6"
                        resizeMode='contain'
                        tintColor={isOpened ? "#FF9C01" : "#CDCDE0"}
                    />
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity
                    onPress={() => navigator.dispatch(DrawerActions.openDrawer())}
                >
                    <Image 
                        source={images.hamburger}
                        resizeMode="contain"
                        className="h-6 w-6 mr-4"
                        tintColor={"#CDCDE0"}
                    />
                </TouchableOpacity>
            </View>
        </View>
      </View>

      {showSearcher && <View className="w-[90%] absolute overflow-hidden m-auto mt-[82px] bg-oBlack left-[5%]">
        <ScrollView className="max-h-[200px] border border-black-200 rounded-[5px] overflow-hidden">
            <TouchableOpacity className="p-2">
                <View className="border-b pb-2 border-black-200 flex-row items-center justify-between">
                    <View className="flex-row gap-3 items-center">
                        <View>
                            <Image 
                                source={images.testimage}
                                className="h-14 w-14 rounded-[3px]"
                                resizeMode='cover'
                            />
                        </View>
                        <View>
                            <Text className="font-psemibold text-lg mb-0.5 text-white">Erdit Fejzullahu</Text>
                            <Text className="font-pregular text-xs text-gray-400">Mik</Text>
                        </View>
                    </View>
                    <View>
                        <Image 
                            source={icons.rightArrow}
                            tintColor={"FF9C01"}
                            className="mr-2"
                        />
                    </View>
                </View>
            </TouchableOpacity>
        </ScrollView>
      </View>}

      <StatusBar backgroundColor='#13131a' style='light'/>

    </SafeAreaView>
  )
}

export default Topbar