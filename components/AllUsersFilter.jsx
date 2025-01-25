import { View, Text, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native'
import React from 'react'
import AllUsersInteractions from './AllUsersInteractions'
import { useState } from 'react'
import { icons } from '../constants'
import { useEffect } from 'react'
import Loading from './Loading'
import useFetchFunction from '../hooks/useFetchFunction'
import { reqGetAllUserTypes } from '../services/fetchingService'

const AllUsersFilter = ({userData}) => {    
    const [userTypes, setUserTypes] = useState(1)
    const {data, isLoading, refetch} = useFetchFunction(() => reqGetAllUserTypes(userData?.id, userTypes))
    const [usersData, setUsersData] = useState([])

    const [isRefreshing, setIsRefreshing] = useState(false)
    const onRefresh = async () => {
        setIsRefreshing(true)
        await refetch();
        setIsRefreshing(false)
    }

    useEffect(() => {
      if(data){
        setUsersData(data)
        console.log(data);
        
      }
    }, [data])

    useEffect(() => {
      refetch();
    }, [userTypes])
    

    if(isLoading) return <View className="h-[100px]"><Loading /></View>
  return (
    <FlatList
    refreshControl={<RefreshControl onRefresh={onRefresh} tintColor="#ff9c01" colors={['#ff9c01', '#ff9c01', '#ff9c01']} refreshing={isRefreshing}/>}
    className="h-full bg-primary"
    data={usersData}
    contentContainerStyle={{gap: 14}}
    keyExtractor={(item) => 'user-' + item?.id?.toString()}
    renderItem={({item}) => (
    <AllUsersInteractions 
        usersData={item}
        currentUserData={userData}
    />
    )}
    ListHeaderComponent={() => (
        <View className="flex-row border border-black-200 rounded-[5px] overflow-hidden">
        <View className={`flex-1 items-center border-r border-black-200 ${userTypes === 1 ? "bg-oBlack" : ""}`}>
        <TouchableOpacity onPress={() => setUserTypes(1)} className="p-2 flex-row items-center gap-1">
            <Text className="font-plight text-white text-sm">Te gjithe</Text>
            <Image 
                source={icons.parents}
                className="w-4 h-4"
                resizeMode='contain'
                style={{tintColor: userTypes === 1 ? "#ff9c01" : "#fff"}}
            />
        </TouchableOpacity>
        </View>
        <View className={`flex-1 items-center border-r border-black-200 ${userTypes === 2 ? "bg-oBlack" : ""}`} >
        <TouchableOpacity onPress={() => setUserTypes(2)} className="p-2 flex-row items-center gap-1">
            <Text className="font-plight text-white text-sm">Miqte</Text>
            <Image 
                source={icons.friends}
                className="w-4 h-4"
                resizeMode='contain'
                style={{tintColor: userTypes === 2 ? "#ff9c01" : "#fff"}}
            />
        </TouchableOpacity>
        </View>
        <View className={`flex-1 items-center ${userTypes === 3 ? "bg-oBlack" : ""} `}>
        <TouchableOpacity onPress={() => setUserTypes(3)} className="p-2 flex-row items-center gap-1">
            <Text className="font-plight text-white text-sm">Te ngushte
            </Text>
            <Image 
                source={icons.heart}
                className="w-4 h-4"
                resizeMode='contain'
                style={{tintColor: userTypes === 3 ? "#ff9c01" : "#fff"}}
            />
        </TouchableOpacity>
        </View>
    </View>
    )}
    />
)
}

export default AllUsersFilter