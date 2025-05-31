import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import { images } from '../constants'
import { Redirect, router } from 'expo-router';
import CustomButton from '../components/CustomButton';
import { useGlobalContext } from '../context/GlobalProvider';
import 'react-native-gesture-handler'
import { useRole } from '../navigation/RoleProvider';
import { useEffect } from 'react';

export default function App() {
  const {role, refreshRole} = useRole();
  useEffect(() => {
    refreshRole();
  }, [])
  const {isLoading, isLoggedIn} = useGlobalContext();
  
  if(!isLoading && isLoggedIn) return <Redirect href="/home"/>

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{height: '100%'}}>
        <View className="w-full justify-center items-center h-full px-4">
          <Image 
            source={images.logoNew}
            className="w-fit h-[100px]"
            resizeMode="contain"
          />

          <Image 
            source={images.cards}
            className="max-w-[380px] w-full h-[300px]"
            resizeMode='contain'
          />

          <View className="relative w-full">
            <View className="relative mt-5">
              <Text className="text-2xl text-white text-center font-pblack">Mësimi kurrë nuk ka qenë më efektiv me {' '}
              <Text className="text-secondary-200">Shokun e Mësimit</Text>
              </Text>

              <Image 
              source={images.path}
              className="w-full h-[15px] absolute -bottom-4 m-auto left-0 right-0"
              resizeMode='contain'
              />
            </View>
            <View>
              <Text className="text-sm text-center font-pregular text-white mt-6 relative">Aty ku çertifikimi i fushave të ndryshme nuk ka qenë kurrë më i lehtë!</Text>
            </View>
            <View className="absolute border-b border-black-200 w-1/2 items-center justify-center left-[25%] -bottom-3"></View>
          </View>
          <CustomButton 
            title="Vazhdoni me Kyçjen"
            handlePress={() => router.push('/sign-in')}
            containerStyles="w-full mt-8"
            textStyles="font-psemibold"
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor='#161622' style='light'/>

    </SafeAreaView>
  );
}
