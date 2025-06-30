import { StatusBar } from 'expo-status-bar';
import { ImageBackground, ScrollView, Text, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import { images } from '../constants'
import { Redirect, router } from 'expo-router';
import CustomButton from '../components/CustomButton';
import { useGlobalContext } from '../context/GlobalProvider';
import 'react-native-gesture-handler'
import { useRole } from '../navigation/RoleProvider';
import { useEffect } from 'react';
import { useNavigation } from 'expo-router';
import { CommonActions } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import { useShadowStyles } from '../hooks/useShadowStyles';

export default function App() {
  const {shadowStyle} = useShadowStyles();
  const {colorScheme} = useColorScheme();
  const {role, refreshRole, isLoading: roleLoading} = useRole();
  const {isLoading, isLoggedIn} = useGlobalContext();
  // const router = useRouter();
  const navigation = useNavigation();
  // useEffect(() => {
  //   refreshRole();
  // }, [])

  // useEffect(() => {
  //   if(!isLoading && !roleLoading){
  //     if(isLoggedIn){
  //       const targetRoute = 
  //         role === "Instructor"
  //         ? {name: 'instructor/instructorHome'}
  //         : {name: '(drawer)/(tabs)/home'}
  //       navigation.dispatch(
  //         CommonActions.reset({
  //           index: 0,
  //           routes: [targetRoute]
  //         })
  //       )
  //       // if(["Instructor"].includes(role)){
  //       //   router.replace('/instructor/instructorHome')
  //       // }else{
  //       //   router.replace('/home')
  //       // }
  //     }
  //   }
  // }, [isLoggedIn, isLoading, role, roleLoading])
  
  
  if(!isLoading && !roleLoading) {
    if(isLoggedIn){
      const targetRoute = 
        role === "Instructor" 
        ? "/instructor/instructorHome"
        : "/home"
        return <Redirect href={`${targetRoute}`}/>
      }
    }

  return (
    <SafeAreaView className="bg-primary-light dark:bg-primary h-full">
      <ScrollView contentContainerStyle={{height: '100%'}}>
        <View className="w-full justify-center items-center h-full px-4">
          <Image 
            source={images.logoNew}
            className="w-fit h-[100px]"
            resizeMode="contain"
          />

        <View className="max-h-[150px] h-full relative w-full my-10">
          <View className="absolute -right-14 -bottom-8 h-full z-50 rotate-[20deg] border-2 rounded-lg border-secondary bg-oBlack-light dark:bg-oBlack" style={shadowStyle}>
            <Image 
              source={images.imageMan}
              className="max-w-[280px] flex-1 rounded-[4px]"
              resizeMode='cover'
            />
          </View>
          <View className="absolute -left-14 border-2 border-secondary -rotate-[15deg] rounded-lg -bottom-4 h-full bg-oBlack-light dark:bg-oBlack" style={shadowStyle}>
            <Image 
              source={images.imageGirl}
              className="max-w-[280px] flex-1 rounded-[4px]"
              resizeMode='cover'
            />
          </View>
        </View>

          <View className="relative w-full">
            <View className="relative mt-5">
              <Text className="text-2xl text-oBlack dark:text-white text-center font-pblack">Mësimi kurrë nuk ka qenë më efektiv me {' '}
              <Text className="text-secondary-200">Shokun e Mësimit</Text>
              </Text>

              <Image 
              source={images.path}
              className="w-full h-[15px] absolute -bottom-4 m-auto left-0 right-0"
              resizeMode='contain'
              />
            </View>
            <View>
              <Text className="text-sm text-center font-pregular text-gray-600 dark:text-white mt-6 relative">Aty ku çertifikimi i fushave të ndryshme nuk ka qenë kurrë më i lehtë!</Text>
            </View>
            <View className="absolute border-b border-white dark:border-black-200 w-1/2 items-center justify-center left-[25%] -bottom-3"></View>
          </View>
          <CustomButton 
            title="Vazhdoni me Kyçjen"
            handlePress={() => router.push('/sign-in')}
            containerStyles={colorScheme === 'light' ? "!rounded-none !border !border-gray-200 w-full mt-8" : "w-full mt-8"}
            textStyles="font-psemibold"
          />
        </View>
      </ScrollView>

      <StatusBar translucent backgroundColor="transparent" style={`${colorScheme === 'light' ? "dark" : "light"}`}/>

    </SafeAreaView>
  );
}
