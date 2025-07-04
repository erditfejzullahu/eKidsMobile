import { View, Text, Image } from 'react-native'
import React from 'react'
import { Stack, Tabs, Link, Redirect } from 'expo-router';
import { icons } from '../../../constants';
import { useRole } from '../../../navigation/RoleProvider';
import { useColorScheme } from 'nativewind';

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

const _layout = () => {
    const {colorScheme} = useColorScheme();
    // const {role} = useRole();
    // if(role === "Instructor") return <Redirect href={'/instructor/instructorHome'}/>
  return (
    <>
    {/* <Text>asdasd</Text> */}
    {/* <Stack screenOptions={{gestureEnabled: true, headerShown: false}}></Stack> */}
        {/* <Stack>
          <Stack.Screen name="all-quizzes" options={{ headerShown: false }} />
          <Stack.Screen name="my-quizzes" options={{headerShown: false}} />
        </Stack> */}
        {/* {children} */}
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
        <Tabs.Screen 
            name='allOnlineCourses'
            options={{
                title: "allOnlineCourses",
                headerShown: false,
                tabBarIcon: ({color, focused}) => (
                    <TabIcon 
                        icon={icons.onlineclasses}
                        color={color}
                        name="Kurset online"
                        focused={focused}
                    />
                )
            }}
        />
        <Tabs.Screen 
            name="allTutors"
            options={{
                title: "allTutors",
                headerShown: false,
                tabBarIcon: ({color, focused}) => (
                    <TabIcon 
                        icon={icons.tutor}
                        color={color}
                        name="Tutoret"
                        focused={focused}
                    />
                )
            }}
        />
        <Tabs.Screen 
            name="allOnlineMeetings"
            options={{
                title: "allOnlineMeetings",
                headerShown: false,
                tabBarIcon: ({color, focused}) => (
                    <TabIcon 
                        icon={icons.upcoming}
                        color={color}
                        name="Klaset online"
                        focused={focused}
                    />
                )
            }}
        />
        <Tabs.Screen 
            name="allUpcomingOnlineMeetings"
            options={{tabBarVisible: false, href: null, headerShown: false}}
        />
        <Tabs.Screen 
            name="onlineClass/[id]"
            options={{tabBarVisible: false, href: null, headerShown: false}}
        />
        <Tabs.Screen 
            name="tutor/[id]"
            options={{tabBarVisible: false, href: null, headerShown: false}}
        />
        <Tabs.Screen 
            name="meetings/[id]"
            options={{tabBarVisible: false, href: null, headerShown: false}}
        />
        <Tabs.Screen 
            name='tutorCourses/[id]'
            options={{tabBarVisible: false, href: null, headerShown: false}}
        />
    </Tabs>
    </>
  )
}

export default _layout