import { View, Text, TouchableOpacity, Image, StyleSheet, Platform, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { Drawer } from 'react-native-drawer-layout';
import { Link, Stack } from 'expo-router';
import { icons, images } from '../../../constants';
import { usePathname, useRouter } from 'expo-router';
import { useShadowStyles } from '../../../hooks/useShadowStyles';
import { useColorScheme } from 'nativewind';

const DrawerContent = ({closeDrawer}) => {
    const {shadowStyle} = useShadowStyles();
    const {colorScheme} = useColorScheme();
    const router = useRouter();
    const pathname = usePathname();
    
    return (
        <ScrollView contentContainerStyle={{justifyContent: "space-between"}} className="flex-1 bg-primary-light dark:bg-primary">
            <View className="gap-4 pt-4">
                <View className="ml-4 mt-2 mb-4">
                    <Text className="font-pmedium text-2xl text-oBlack dark:text-white">Fushat aktuale
                        <View>
                            <Image 
                                source={images.path}
                                className="h-auto w-[100px] absolute -bottom-8 -left-12"
                                resizeMode='contain'
                            />
                        </View>
                    </Text>
                </View>
                <View className={`ml-2 ${pathname === "/statistics/1" ? "mr-2": "mr-8"}`}>
                    <TouchableOpacity onPress={() => {router.replace('/statistics/1'); closeDrawer()}} className="flex-row items-center p-2 bg-oBlack-light dark:bg-oBlack rounded-[5px] border border-gray-200 dark:border-black-200 gap-2" style={shadowStyle}>
                        <Text className="font-plight text-lg text-oBlack dark:text-white">Kurset e kryera</Text>
                        <Image 
                            source={icons.courses}
                            className="h-6 w-6"
                            tintColor={pathname === "/statistics/1" ? "#FF9C01" : colorScheme === "dark" ? "#fff" : "#000"}
                        />
                    </TouchableOpacity>
                </View>
                <View className={`ml-2 ${pathname === "/statistics/2" ? "mr-2": "mr-8"}`}>
                    <TouchableOpacity onPress={() => {router.replace('/statistics/2'); closeDrawer()}} className="flex-row items-center p-2 bg-oBlack-light dark:bg-oBlack rounded-[5px] border border-gray-200 dark:border-black-200 gap-2" style={shadowStyle}>
                        <Text className="font-plight text-lg text-oBlack dark:text-white">Kurset offline te krijuara</Text>
                        <Image 
                            source={icons.learning}
                            className="h-6 w-6"
                            tintColor={pathname === "/statistics/2" ? "#FF9C01" : colorScheme === "dark" ? "#fff" : "#000"}
                        />
                    </TouchableOpacity>
                </View>
                <View className={`ml-2 ${pathname === "/statistics/3" ? "mr-2": "mr-8"}`}>
                    <TouchableOpacity onPress={() => {router.replace('/statistics/3'); closeDrawer()}} className="flex-row items-center p-2 bg-oBlack-light dark:bg-oBlack rounded-[5px]  border border-gray-200 dark:border-black-200 gap-2" style={shadowStyle}>
                        <Text className="font-plight text-lg text-oBlack dark:text-white">Kuizet e kryera</Text>
                        <Image 
                            source={icons.quiz}
                            className="h-6 w-6"
                            tintColor={pathname === "/statistics/3" ? "#FF9C01" : colorScheme === "dark" ? "#fff" : "#000"}
                        />
                    </TouchableOpacity>
                </View>
                <View className={`ml-2 ${pathname === "/statistics/4" ? "mr-2": "mr-8"}`}>
                    <TouchableOpacity onPress={() => {router.replace('/statistics/4'); closeDrawer()}} className="flex-row items-center p-2 bg-oBlack-light dark:bg-oBlack rounded-[5px]  border border-gray-200 dark:border-black-200 gap-2" style={shadowStyle}>
                        <Text className="font-plight text-lg text-oBlack dark:text-white">Kuizet e krijuara</Text>
                        <Image 
                            source={icons.quiz}
                            className="h-6 w-6"
                            tintColor={pathname === "/statistics/4" ? "#FF9C01" : colorScheme === "dark" ? "#fff" : "#000"}
                        />
                    </TouchableOpacity>
                </View>
                <View className={`ml-2 ${pathname === "/statistics/5" ? "mr-2": "mr-8"}`}>
                    <TouchableOpacity onPress={() => {router.replace('/statistics/5'); closeDrawer()}} className="flex-row items-center p-2 bg-oBlack-light dark:bg-oBlack rounded-[5px]  border border-gray-200 dark:border-black-200 gap-2" style={shadowStyle}>
                        <Text className="font-plight text-lg text-oBlack dark:text-white">Blogjet</Text>
                        <Image 
                            source={icons.blogs}
                            className="h-6 w-6"
                            tintColor={pathname === "/statistics/5" ? "#FF9C01" : colorScheme === "dark" ? "#fff" : "#000"}
                        />
                    </TouchableOpacity>
                </View>
                <View className={`ml-2 ${pathname === "/statistics/6" ? "mr-2": "mr-8"}`}>
                    <TouchableOpacity onPress={() => {router.replace('/statistics/6'); closeDrawer()}} className="flex-row items-center p-2 bg-oBlack-light dark:bg-oBlack rounded-[5px]  border border-gray-200 dark:border-black-200 gap-2" style={shadowStyle}>
                        <Text className="font-plight text-lg text-oBlack dark:text-white">Diskutimet</Text>
                        <Image 
                            source={icons.discussion}
                            className="h-6 w-6"
                            tintColor={pathname === "/statistics/6" ? "#FF9C01" : colorScheme === "dark" ? "#fff" : "#000"}
                        />
                    </TouchableOpacity>
                </View>
                <View className={`ml-2 ${pathname === "/statistics/7" ? "mr-2": "mr-8"}`}>
                    <TouchableOpacity onPress={() => {router.replace('/statistics/7'); closeDrawer()}} className="flex-row items-center p-2 bg-oBlack-light dark:bg-oBlack rounded-[5px]  border border-gray-200 dark:border-black-200 gap-2" style={shadowStyle}>
                        <Text className="font-plight text-lg text-oBlack dark:text-white">Takime Online</Text>
                        <Image 
                            source={icons.onlineMeeting}
                            className="h-6 w-6"
                            tintColor={pathname === "/statistics/7" ? "#FF9C01" : colorScheme === "dark" ? "#fff" : "#000"}
                        />
                    </TouchableOpacity>
                </View>
                <View className={`ml-2 ${pathname === "/statistics/8" ? "mr-2": "mr-8"}`}>
                    <TouchableOpacity onPress={() => {router.replace('/statistics/8'); closeDrawer()}} className="flex-row items-center p-2 bg-oBlack-light dark:bg-oBlack rounded-[5px]  border border-gray-200 dark:border-black-200 gap-2" style={shadowStyle}>
                        <Text className="font-plight text-lg text-oBlack dark:text-white">Nderveprimet</Text>
                        <Image 
                            source={icons.commitment}
                            className="h-6 w-6"
                            tintColor={pathname === "/statistics/8" ? "#FF9C01" : colorScheme === "dark" ? "#fff" : "#000"}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View>
                <Image 
                    source={images.logoNew}
                    className="w-[80%] h-fit m-auto px-4 pr-5"
                    resizeMode='contain'
                />
                <Text className="text-oBlack dark:text-white font-plight text-lg mx-4 text-center">Platforma me e re per mesimin tuaj ditor online.</Text>
            </View>
            <View className="m-4 mb-6">
                <Text className="text-oBlack dark:text-white font-psemibold text-sm">Realizuar nga <Link href={"https://murrizi.org"} accessibilityRole="link" className="text-secondary">Murrizi Co.</Link></Text>
            </View>
        </ScrollView>
    )
}

const _layout = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  return (
    <>
        <Drawer
            drawerPosition="left"
            open={isDrawerOpen}
            onOpen={() => setIsDrawerOpen(true)}
            onClose={() => setIsDrawerOpen(false)}
            renderDrawerContent={() => <DrawerContent closeDrawer={() => setIsDrawerOpen(false)} />}
            drawerStyle={{
                width: 300,
            }}
        >
            <Stack screenOptions={{gestureEnabled: true, headerShown: false}}></Stack>
        </Drawer>
    </>
  )
}
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
      })
  },
  });
export default _layout