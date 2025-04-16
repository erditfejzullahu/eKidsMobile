import { View, Text, Image } from 'react-native'
import React from 'react'
import { Stack, Tabs, Link, Redirect } from 'expo-router';
import { icons } from '../../../constants';
import { useRole } from '../../../navigation/RoleProvider';

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

const _layout = () => {
    const {role} = useRole();
    if(role === "Instructor") return <Redirect href={'/instructor/instructorHome'}/>
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
            name='allOnlineClasses'
            options={{
                title: "allOnlineClasses",
                headerShown: false,
                tabBarIcon: ({color, focused}) => (
                    <TabIcon 
                        icon={icons.onlineclasses}
                        color={color}
                        name="Klaset Online"
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
            name="allUpcomingMeetings"
            options={{
                title: "allUpcomingMeetings",
                headerShown: false,
                tabBarIcon: ({color, focused}) => (
                    <TabIcon 
                        icon={icons.upcoming}
                        color={color}
                        name="Klaset e ardhshme"
                        focused={focused}
                    />
                )
            }}
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
            name="upcomingMeetings/[id]"
            options={{tabBarVisible: false, href: null, headerShown: false}}
        />
    </Tabs>
    </>
  )
}

export default _layout