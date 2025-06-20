import { View, Text, FlatList, Image, Platform, ScrollView, RefreshControl } from 'react-native'
import React, { useEffect } from 'react'
import useFetchFunction from '../../../hooks/useFetchFunction'
import { getAllUsersStatstics, getMetaValue } from '../../../services/fetchingService'
import { useState } from 'react'
import { icons, images } from '../../../constants'
import { StyleSheet } from 'react-native'
import SearchInput from "../../../components/SearchInput"
import Loading from '../../../components/Loading'
import * as Animatable from "react-native-animatable"

const AllStudentsStatistics = () => {
    const {data, isLoading, refetch} = useFetchFunction(() => getAllUsersStatstics(searchInput))
    const [usersData, setUsersData] = useState([])
    const [isRefreshing, setIsRefreshing] = useState(false)

    const [searchInput, setSearchInput] = useState('')

    const onRefresh = async () => {
        setIsRefreshing(true)
        setSearchInput("")        
        await refetch();
        setIsRefreshing(false)
    }

    const searchUsers = (data) => {        
        setSearchInput(data)
    }
    
    useEffect(() => {
      refetch();
    }, [searchInput])
    

    useEffect(() => {
      if(data){
        setUsersData(data)
      }
    }, [data])
    
    if(isLoading || isRefreshing) return <Loading />
  return (
    <ScrollView 
        className="h-full bg-primary"
        refreshControl={<RefreshControl tintColor="#ff9c01" colors={['#ff9c01', '#ff9c01', '#ff9c01']} refreshing={isRefreshing} onRefresh={onRefresh}/>}>
        <View className="my-4 px-4 mb-6">
                <Text className="text-2xl text-white font-pmedium">Statistikat e perdoruesve
                <View>
                    <Image 
                        source={images.path}
                        className="h-auto w-[100px] absolute -bottom-8 -left-12"
                        resizeMode='contain'
                    />
                </View>
                </Text>
        </View>
        <View className="absolute flex items-center justify-center left-0 bottom-0 top-0 z-20">
            <Animatable.View 
                animation={{
                    0: { translateX: 0, opacity: 1 },   // Start position
                    0.5: { translateX: 10, opacity: 1 }, // Moves slightly to the right
                    1: { translateX: 0, opacity: 0.2 }  // Comes back & fades out
                }} 
                duration={2000} iterationCount="infinite">
                <Image
                    source={icons.rightArrow}
                    tintColor={"#fff"}
                    className="size-8 bg-oBlack p-2 border rounded-lg"
                    resizeMode='contain'
                />
            </Animatable.View>
        </View>
        <View className="mx-4 mb-4 border-b border-black-200 pb-4">
            <SearchInput 
                title={"Kerkoni perdorues"}
                placeholder={"Shkruani emrin e perdoruesit"}
                searchFunc={(data) => searchUsers(data)}
                valueData={searchInput}
            />
        </View>
        {searchInput !== "" && (
            <View className="px-4 pb-2">
                <Text className="text-white text-sm">Te dhenat per kerkimin me emer: <Text className="text-secondary">{searchInput}</Text></Text>
            </View>
        )}
        {usersData.length > 0 ? <View className="flex-1 mr-4 ml-4 border-b border-black-200 pb-4">
            <FlatList
                data={usersData}
                className="flex-grow-0" 
                keyExtractor={(item) => `userdata-${item.id}`}
                contentContainerStyle={{ flexGrow: 0}}
                horizontal={true}
                renderItem={({item}) => (
                    <View className="flex-column bg-oBlack self-start mt-2" style={styles.box}>
                        <View className="border-r border-t border-black-200 p-2">
                            <Text className="font-psemibold text-sm text-secondary">{item.name}</Text>
                        </View>
                        <View className="border-r border-t border-black-200 p-2">
                            <Text className="font-psemibold text-sm text-white">{item.username}</Text>
                        </View>
                        <View className="border-r border-t border-black-200 p-2">
                            <Text className="font-psemibold text-sm text-white">{item.email}</Text>
                        </View>
                        <View className="border-r border-t border-black-200 p-2">
                            <Text className="font-psemibold text-sm text-white">{getMetaValue(item.userMeta, "Phone")}</Text>
                        </View>
                        <View className="border-r border-t border-black-200 p-2">
                            <Text className="font-psemibold text-sm text-white">{item.coursesCreated}</Text>
                        </View>
                        <View className="border-r border-t border-black-200 p-2">
                            <Text className="font-psemibold text-sm text-white">{item.lessonsCompleted}</Text>
                        </View>
                        <View className="border-r border-t border-black-200 p-2">
                            <Text className="font-psemibold text-sm text-white">{item.quizzesCreated}</Text>
                        </View>
                        <View className="border-r border-t border-black-200 p-2">
                            <Text className="font-psemibold text-sm text-white">{item.blogsCreated}</Text>
                        </View>
                        <View className="border-r border-t border-b border-black-200 p-2">
                            <Text className="font-psemibold text-sm text-white">{item.commitmens}</Text>
                        </View>
                    </View>
                )}
                ListHeaderComponent={() => (
                    <>
                    <View className="flex-column bg-oBlack mt-2 ml-2" style={styles.box}>
                        <View className="border-r border-l border-t p-2 border-black-200 rounded-tl-[5px]">
                            <Text className="font-plight text-sm text-white">Emri</Text>
                        </View>
                        <View className="border-r border-l border-t border-black-200 p-2">
                            <Text className="font-plight text-sm text-white">Nofka</Text>
                        </View>
                        <View className="border-r border-l border-t border-black-200 p-2">
                            <Text className="font-plight text-sm text-white">Email</Text>
                        </View>
                        <View className="border-r border-l border-t border-black-200 p-2">
                            <Text className="font-plight text-sm text-white">Numri</Text>
                        </View>
                        <View className="border-r border-l border-t border-black-200 p-2">
                            <Text className="font-plight text-sm text-white">Kurset</Text>
                        </View>
                        <View className="border-r border-l border-t border-black-200 p-2">
                            <Text className="font-plight text-sm text-white">Leksionet</Text>
                        </View>
                        <View className="border-r border-l border-t border-black-200 p-2">
                            <Text className="font-plight text-sm text-white">Kuizet</Text>
                        </View>
                        <View className="border-r border-l border-t border-black-200 p-2">
                            <Text className="font-plight text-sm text-white">Blogjet</Text>
                        </View>
                        <View className="border-r border-l border-t border-b border-black-200 p-2 rounded-bl-[5px]">
                            <Text className="font-plight text-sm text-white">Angazhimet</Text>
                        </View>
                    </View>
                    </>
                )}
            />
        </View> : 
        <View className="m-4 border border-black-200 rounded-[5px] bg-oBlack p-4" style={styles.box}>
            <Text className="text-white font-psemibold text-lg text-center">Nuk u gjet asnje e dhene. Provoni perseri!</Text>
        </View>}
        <View className="p-4">
            <Text className="text-white font-plight text-sm">Ketu paraqiten angazhime e te gjithe perdoruesve te <Text className="text-secondary font-psemibold">ShokuMesimit</Text> dhe mund te kontaktoni personat adekuate me ane te butonit <Text className="text-secondary font-psemibold">Kontaktoni</Text>.</Text>      
            <Text className="text-white font-plight text-sm mt-4">Me ane te seksionit te kerkimit te perdoruesve, ju mund te filtroni ne mes te gjithe perdoruesve qe jane aktual ne platformen <Text className="text-secondary font-psemibold">ShokuMesimit</Text>.</Text>
        </View>
    </ScrollView>
  )
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
  });
export default AllStudentsStatistics