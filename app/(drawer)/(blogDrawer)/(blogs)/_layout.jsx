import { View, Text, Image } from 'react-native'
import React from 'react'
import { Link, Tabs } from 'expo-router'
import { icons } from '../../../../constants'
import { useColorScheme } from 'nativewind'

const TabIcon = ({icon, color, name, focused}) => {
    return (
        <View className="flex-col gap-1 h-full">
            <View className="items-center justify-center">
                <Image 
                    source={icon}
                    resizeMode='contain'
                    tintColor={color}
                    className={`w-6 h-full`}
                />
            </View>
            <View className="w-full">
                <Text className={`${focused ? "font-psemibold" : "font-pregular"} text-sm text-oBlack dark:text-white w-full`}>{name}</Text>
            </View>
        </View>
    )
}

const BlogsLayout = () => {
    const {colorScheme} = useColorScheme();
  return (
    <>
    <Tabs
        backBehavior="history"
        screenOptions={{
            tabBarShowLabel: false,
            tabBarActiveTintColor: '#FFA001',
            tabBarInactiveTintColor: colorScheme === "light" ? "#000" : '#CDCDE0',
            tabBarStyle: {
              backgroundColor: colorScheme === 'light' ? "#fcf6f2" : "#13131a",
              borderTopWidth: 1,
              borderTopColor: colorScheme === 'light' ? "#e5e7eb" : '#232533',
              height: 90,
            },
        }}
    >
        {/* <Tabs.Screen 
            name='blogCategories'
            options={{
                title: "blogCategories",
                headerShown: false,
                tabBarIcon: ({color, focused}) => (
                    <TabIcon 
                        icon={icons.home}
                        color={color}
                        name="Postimet"
                        focused={focused}
                    />
                )
            }}
        /> */}
        <Tabs.Screen 
            name='blogAll'
            options={{
                title: "blogAll",
                headerShown: false,
                tabBarIcon: ({color, focused}) => (
                    <TabIcon 
                        icon={icons.blogs}
                        color={color}
                        name="Te rejat"
                        focused={focused}
                    />
                )
            }}
        />
        {/* <Tabs.Screen 
            name='blogTags'
            options={{
                title: "blogTags",
                headerShown: false,
                tabBarIcon: ({color, focused}) => (
                    <TabIcon 
                        icon={icons.home}
                        color={color}
                        name="Kategorite"
                        focused={focused}
                    />
                )
            }}
        /> */}
        <Tabs.Screen 
            name="discussions"
            options={{
                title: "discussions",
                headerShown: false,
                tabBarIcon: ({color, focused}) => (
                    <TabIcon 
                        icon={icons.discussion}
                        color={color}
                        name="Diskutimet"
                        focused={focused}
                    />
                )
            }}
        />
        <Tabs.Screen 
            name="profile"
            options={{
                title: "profile",
                headerShown: false,
                tabBarIcon: ({color, focused}) => (
                    <TabIcon 
                        icon={icons.profile}
                        color={color}
                        name="Profili"
                        focused={focused}
                    />
                )
            }}
        />
        <Tabs.Screen 
              name="[blogs]"
              options={{tabBarVisible: false, href: null, headerShown: false}}
            />
    </Tabs>
    </>
  )
}

export default BlogsLayout