import { View, Text, Image, StyleSheet } from 'react-native'
import { Tabs, Redirect } from 'expo-router'
import { icons, images } from '../../../constants'
import { useRouter } from 'expo-router'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Topbar from '../../../components/Topbar'
import { usePathname } from 'expo-router'
import { useEffect } from 'react'

const TabIcon = ({ icon, color, name, focused, onPress, extraImageStyle}) => {
  return (
      <TouchableOpacity onPress={onPress}>
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
  const router = useRouter();
  const pathname = usePathname();
  const handleCategoryPress = () => {
    
    if((pathname.includes('categories') && pathname !== '/categories/all')){
      router.replace('/categories/all')
    }
  };
  return (
    <>
        <Tabs
          // initialRouteName='home'
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
        </Tabs>
        
    </>
  )
}


export default TabsLayout