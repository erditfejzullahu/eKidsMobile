import { View, Text, FlatList, Image, RefreshControl, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import useFetchFunction from '../../../hooks/useFetchFunction'
import { getAllUsers, reqGetAllUserTypes } from '../../../services/fetchingService'
import Loading from '../../../components/Loading'
import { icons, images } from '../../../constants'
import { useGlobalContext } from '../../../context/GlobalProvider'
import AllUsersInteractions from '../../../components/AllUsersInteractions'
import { router } from 'expo-router'
import { useRouter } from 'expo-router'
import { Platform } from 'react-native'
import AllUsersFilter from '../../../components/AllUsersFilter'

const AllMessages = () => {
  const router = useRouter();
  const {user, isLoading: userLoading } = useGlobalContext();
  const userData = user?.data?.userData;

  if(userLoading){
    return(
      <Loading />
    )
  }else{
    return (
      <View style={styles.box} className="bg-primary px-4 pb-4 h-full">
        <View className="border-b border-black-200 mb-4">
          <View className="my-4 border-b border-black-200 pb-4">
            <Text className="text-2xl text-white font-pmedium">Lajmetari juaj
              <View>
                <Image
                  source={images.path}
                  className="h-auto w-[100px] absolute -bottom-8 -left-12"
                  resizeMode='contain'
                />
              </View>
            </Text>
            <Text className="text-gray-200 text-sm font-plight mt-5">Ketu mund te komunikoni me komunitetin e <Text className="font-psemibold text-secondary">ShokuMesimit</Text> ne lidhje me tema te perditshme, aktualitetet e fundit apo ne lidhje me tematikat e kurseve apo kuizeve ne pergjithesi!</Text>
          </View>
          <View className="relative w-full mb-4">
            <View className="border border-black-200 rounded-[10px] p-2">
              <Text className="text-white font-pregular text-base mb-2">Detajet tuaja te komunikimit:</Text>
              <View className="flex-row bg-oBlack flex-wrap justify-between items-center p-4 border border-black-200 rounded-[10px]">
                <View className="">
                  <Image 
                    // source={{uri: userData?.profilePictureUrl}}
                    source={icons.profile}
                    className="h-14 w-14 rounded-[10px]"
                    resizeMode='contain'
                  />
                </View>
                <View>
                  <Text className="font-psemibold text-white text-lg">{userData?.firstname} {userData?.lastname}</Text>
                  <Text className="font-plight text-gray-200 text-xs">{userData?.email}</Text>
                </View>
                <View>
                  <TouchableOpacity onPress={() => router.replace('/profile')}>
                    <Image 
                      source={icons.resume}
                      className="h-12 w-12"
                      tintColor={"#ff9c01"}
                      resizeMode='contain'
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View>
          <AllUsersFilter userData={userData}/>
        </View>
        <View>
          <Text className="text-white font-plight text-sm">Mundesuar nga <Text className="text-secondary font-psemibold">Murrizi Co.</Text></Text>
        </View>
        </View>
    )
  }
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
})

export default AllMessages