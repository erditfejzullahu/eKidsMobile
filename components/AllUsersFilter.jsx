import { View, Text, FlatList, TouchableOpacity, Image, RefreshControl, TextInput } from 'react-native'
import React, { memo, useCallback } from 'react'
import AllUsersInteractions from './AllUsersInteractions'
import { useState } from 'react'
import { icons } from '../constants'
import { useEffect } from 'react'
import Loading from './Loading'
import useFetchFunction from '../hooks/useFetchFunction'
import { reqGetAllUserTypes } from '../services/fetchingService'
import MessengerSearchInput from './MessengerSearchInput'
import { StyleSheet } from 'react-native'
import { Platform } from 'react-native'
import * as Animatable from "react-native-animatable"
import { useShadowStyles } from '../hooks/useShadowStyles'
import { useColorScheme } from 'nativewind'

const AllUsersFilter = ({userData}) => {    
    const {shadowStyle} = useShadowStyles();
    const {colorScheme} = useColorScheme();
    const [userTypes, setUserTypes] = useState(1)
    const {data, isLoading, refetch} = useFetchFunction(() => reqGetAllUserTypes(userData?.id, userTypes, searchParam))
    const [usersData, setUsersData] = useState([])

    const [showSearchInput, setShowSearchInput] = useState(false)
    const [searchParam, setSearchParam] = useState("")

    const [isRefreshing, setIsRefreshing] = useState(false)
    const onRefresh = useCallback(async () => {
        setIsRefreshing(true)
        setSearchParam("")
        await refetch();
        setIsRefreshing(false)
    }, [])
    

    useEffect(() => {
      if(data){
        setUsersData(data)
        
      }
    }, [data])

    useEffect(() => {
      refetch();
    }, [userTypes, searchParam])
    

    if(isLoading) return <View className="h-[100px]"><Loading /></View>
  return (
    <View className="flex-1">
        <FlatList
        refreshControl={<RefreshControl onRefresh={onRefresh} tintColor="#ff9c01" colors={['#ff9c01', '#ff9c01', '#ff9c01']} refreshing={isRefreshing}/>}
        className="h-full bg-primary-light dark:bg-primary"
        data={usersData}
        contentContainerStyle={{gap: 14, paddingLeft: 16, paddingRight: 16}}
        keyExtractor={(item) => 'user-' + item?.id?.toString()}
        renderItem={({item}) => (
        <AllUsersInteractions 
            usersData={item}
            currentUserData={userData}
        />
        )}
        ListHeaderComponent={() => (
            <View className="flex-row rounded-[5px] relative items-center pt-4" style={shadowStyle}>
                {!showSearchInput && <Animatable.View className="flex-row flex-1 items-center" animation={"fadeInLeft"} easing={"ease-in-out"} duration={500}><View className={`flex-1 rounded-tl-md rounded-bl-md items-center border border-white dark:border-black-200 ${userTypes === 1 ? "bg-gray-200 dark:bg-oBlack" : ""}`}>
                <TouchableOpacity onPress={() => setUserTypes(1)} className="p-2 flex-row items-center gap-1">
                    <Text className="font-plight text-oBlack dark:text-white text-sm">Te gjithe</Text>
                    <Image 
                        source={icons.parents}
                        className="w-4 h-4"
                        resizeMode='contain'
                        style={{tintColor: userTypes === 1 ? "#ff9c01" : colorScheme === "dark" ? "#fff" : "#000"}}
                    />
                </TouchableOpacity>
                </View>
                <View className={`flex-1 items-center border border-l-0 border-white dark:border-black-200 ${userTypes === 2 ? "bg-gray-200 dark:bg-oBlack" : ""}`} >
                <TouchableOpacity onPress={() => setUserTypes(2)} className="p-2 flex-row items-center gap-1">
                    <Text className="font-plight text-oBlack dark:text-white text-sm">Miqte</Text>
                    <Image 
                        source={icons.friends}
                        className="w-4 h-4"
                        resizeMode='contain'
                        style={{tintColor: userTypes === 2 ? "#ff9c01" : colorScheme === "dark" ? "#fff" : "#000"}}
                    />
                </TouchableOpacity>
                </View>
                <View className={`flex-1 border border-l-0 border-white dark:border-black-200 items-center ${userTypes === 3 ? "bg-gray-200 dark:bg-oBlack" : ""} rounded-tr-md rounded-br-md`}>
                <TouchableOpacity onPress={() => setUserTypes(3)} className="p-2 flex-row items-center gap-1">
                    <Text className="font-plight text-oBlack dark:text-white text-sm">Te ngushte
                    </Text>
                    <Image 
                        source={icons.heart}
                        className="w-4 h-4"
                        resizeMode='contain'
                        style={{tintColor: userTypes === 3 ? "#ff9c01" : colorScheme === "dark" ? "#fff" : "#000"}}
                    />
                </TouchableOpacity>
                </View></Animatable.View>}
                {showSearchInput && (
                    <MessengerSearchInput sendText={(data) => setSearchParam(data)}/>
                )}
                <View className="ml-2">
                    <TouchableOpacity onPress={() => setShowSearchInput(!showSearchInput)} className="bg-secondary rounded-full border border-white p-2">
                        <Animatable.Image
                            animation={"fadeIn"}
                            duration={500}
                            source={showSearchInput ? icons.close : icons.search}
                            tintColor={"#fff"}
                            className="size-4"
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )}
        />
    </View>
)
}

export default memo(AllUsersFilter)
