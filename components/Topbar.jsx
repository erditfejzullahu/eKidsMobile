import { View, Text, Image } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../constants'
import { TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { useNavigation } from 'expo-router'
import { DrawerActions } from '@react-navigation/native'

const Topbar = () => {
    const router = useRouter()
    const navigator = useNavigation();
  return (
    <SafeAreaView className="relative" style={{backgroundColor: "#13131a", height: 90, borderBottomColor: "#232533", borderBottomWidth: 1}}>
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
        <View className="justify-center items-end" style={{height:40}}>
            <TouchableOpacity
                onPress={() => navigator.dispatch(DrawerActions.openDrawer())}
            >
                <Image 
                    source={images.hamburger}
                    resizeMode="contain"
                    className="h-6 w-6 mr-4"
                />
            </TouchableOpacity>
        </View>
      </View>

      <StatusBar backgroundColor='#13131a' style='light'/>

    </SafeAreaView>
  )
}

export default Topbar