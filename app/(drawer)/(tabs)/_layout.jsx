import { View, Text, Image, StyleSheet } from 'react-native'
import { Tabs, Redirect, Link } from 'expo-router'
import { icons, images } from '../../../constants'
import { useRouter } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import Topbar from '../../../components/Topbar'
import { usePathname } from 'expo-router'
import { useEffect } from 'react'
import * as Animatable from "react-native-animatable"
import { useRole } from '../../../navigation/RoleProvider'
import { useColorScheme } from 'nativewind'

const TabIcon = ({ icon, color, name, focused, onPress, extraImageStyle}) => {
  const isPressable = typeof onPress === 'function';
  
  return (
      <TouchableOpacity onPress={onPress} disabled={!isPressable}>
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
    </TouchableOpacity>
  )
}


const TabsLayout = () => {
  const {colorScheme} = useColorScheme();
  const {role} = useRole();
  if(role === "Instructor") return <Redirect href={'/instructor/instructorHome'}/>
  const router = useRouter();
  const pathname = usePathname();
  
  const handleCategoryPress = () => {
    if((pathname.includes('categories') && pathname !== '/categories/all')){
      console.log("te e para")
      router.back();
    }else{
      router.replace('/categories/all')
    }
  };
  return (
    <>
      <View
        className="absolute mx-auto items-center justify-center left-0 right-0 bottom-0"
      >
          <Animatable.View className="flex-row z-20 border-t border-l border-r border-black-200 rounded-t-[10px]" style={{marginBottom: 89}}
            duration={1000}
            animation="pulse"
            iterationCount="infinite"
            easing={"ease-in-out"}
          >
        <TouchableOpacity onPress={() => router.replace("(blogDrawer)/(blogs)/blogAll")} >
            <View className="flex-row gap-2 p-2.5">
              <View>
                <Text className="text-white ">Lajmet tona</Text>
              </View>
              <View>
                <Image 
                  source={icons.news}
                  className="h-6 w-6"
                  resizeMode='contain'
                  tintColor={pathname.includes('/blog') ? "#FFA001" : "#CDCDE0"}
                />
              </View>
            </View>
        </TouchableOpacity>
          </Animatable.View>
      </View>
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
                name="home"
                options={{
                  title: "home",
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
              name="categories"
              options={{
                title: "categories",
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                  <TabIcon
                    icon={icons.categories}
                    color={color}
                    name="Kategoritë"
                    focused={focused}
                    onPress={handleCategoryPress}
                  />
                )
              }}
            />
            <Tabs.Screen
              name="add-quiz"
              options={{
              
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
              name="bookmark"
              options={{
                title: "bookmark",
                headerShown:false,
                tabBarIcon: ({ color, focused }) => (
                  <TabIcon 
                    icon={icons.bookmark}
                    color={color}
                    name="Favoritët"
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
              name="completed"
              options={{tabBarVisible: false, href: null, headerShown: false}}
            />
            <Tabs.Screen 
              name="become-instructor"
              options={{tabBarVisible: false, href: null, headerShown: false}}
            />
            <Tabs.Screen 
              name="support"
              options={{tabBarVisible: false, href: null, headerShown: false}}
            />
        </Tabs>
        
    </>
  )
}


export default TabsLayout