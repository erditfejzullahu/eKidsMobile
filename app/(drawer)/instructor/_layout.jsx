import { View, Text, Image, StyleSheet } from 'react-native'
import { Tabs, Redirect, Link, Stack } from 'expo-router'
import { icons, images } from '../../../constants'
import { TouchableOpacity } from 'react-native'
import { useEffect } from 'react'
import { useRole } from '../../../navigation/RoleProvider'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme } from 'nativewind'

const TabIcon = ({ icon, color, name, focused, onPress, extraImageStyle}) => {
  return (
      <View onPress={onPress}>
        <View className="flex-col gap-1 h-full">
          <View className="items-center justify-center">
            <Image 
              source={icon}
              resizeMode='contain'
              tintColor={color}
              className={`w-6 h-full ${extraImageStyle}`}
            />
          </View>
          {name && <View className="w-full">
            <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-sm w-full`} style={{color:color}}>
              {name}
            </Text>
          </View>}
        </View>
    </View>
  )
}


const InstructorLayout = () => {
  const {colorScheme} = useColorScheme();
  const router = useRouter();
    const {role, refreshRole, isLoading} = useRole();
    useEffect(() => {
      refreshRole()
    }, [])
    
    useEffect(() => {
      if(!isLoading && !['Instructor', 'Admin'].includes(role)){
        router.replace('/home')
      }
    }, [role])
    
    if(role !== "Instructor" && role !== "Admin") return <Redirect href="/home"/>
    
  return (
    <>
        <Tabs
          // initialRouteName='home'
          backBehavior='history'
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
            // header: () => <Topbar />,
          }}
          >
            
            <Tabs.Screen
                name="instructorHome"
                options={{
                  title: "instructorHome",
                  headerShown: false,
                  tabBarIcon: ({ color, focused}) => (
                    <TabIcon
                      icon={icons.home}
                      color={color}
                      name="Ballina"
                      focused={focused}
                    />
                  ),
                  
                }}
            />
            <Tabs.Screen
              name="addScheduleMeeting"
              initialParams={undefined}
              options={{
                title:"addScheduleMeeting",
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                  <TabIcon
                    icon={icons.plus}
                    color={color}
                    name=""
                    focused={focused}
                    extraImageStyle={"min-w-8 !h-full"}
                  />
                ),
                tabBarIconStyle: {height:"100%", justifyContent:"center", alignItems: "center", margin: "auto"}
              }}
            />
            <Tabs.Screen
              name="instructorProfile"
              options={{
                title: "instructorProfile",
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (

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
              name="addCourse"
              options={{href: null, headerShown: false}}
            />
            <Tabs.Screen 
              name='instructorManage'
              options={{href: null, headerShown: false}}
            />
        </Tabs>
        <StatusBar translucent backgroundColor="transparent" style={`${colorScheme === 'light' ? "dark" : "light"}`}/>
    </>
  )
}


export default InstructorLayout