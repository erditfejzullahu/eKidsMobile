import { View, Text, Image } from 'react-native'
import React from 'react'
import { Link, Tabs } from 'expo-router'
import { icons } from '../../../constants'

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
                <Text className={`${focused ? "font-psemibold" : "font-pregular"} text-sm text-white w-full`}>{name}</Text>
            </View>
        </View>
    )
}

const BlogsLayout = () => {
  return (
    <>
    <View className="absolute z-20 mx-auto items-center justify-center right-[45%] bg-oBlack p-2.5 rounded-t-[10px] border-t border-l border-r border-black-200" style={{bottom: "89"}}>
        <Image 
            source={icons.plus}
            className="h-6 w-6"
            resizeMode='contain'
        />
    </View>
    <Tabs
        backBehavior='history'
        screenOptions={{
            tabBarShowLabel: false,
            tabBarActiveTintColor: '#FFA001',
            tabBarInactiveTintColor: '#CDCDE0',
            tabBarStyle: {
            backgroundColor: "#13131a",
            borderTopWidth: 1,
            borderTopColor: '#232533',
            height: 90,
            },
        }}
    >
        <Tabs.Screen 
            name='blogCategories'
            options={{
                title: "blogCategories",
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
        />
        <Tabs.Screen 
            name='blogAll'
            options={{
                title: "blogAll",
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
        />
        <Tabs.Screen 
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
        />
    </Tabs>
    </>
  )
}

export default BlogsLayout