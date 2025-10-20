import { View, Text, FlatList, Image, ScrollView, RefreshControl } from 'react-native'
import { useCallback, useEffect } from 'react'
import useFetchFunction from '../../../hooks/useFetchFunction'
import { getAllUsersStatstics, getMetaValue } from '../../../services/fetchingService'
import { useState } from 'react'
import { icons, images } from '../../../constants'
import SearchInput from "../../../components/SearchInput"
import Loading from '../../../components/Loading'
import * as Animatable from "react-native-animatable"
import { useColorScheme } from 'nativewind'
import { useShadowStyles } from '../../../hooks/useShadowStyles'

const AllStudentsStatistics = () => {
    const {colorScheme} = useColorScheme();
    const {shadowStyle} = useShadowStyles();
    const {data, isLoading, refetch} = useFetchFunction(() => getAllUsersStatstics(searchInput))
    const [usersData, setUsersData] = useState([])
    const [isRefreshing, setIsRefreshing] = useState(false)

    const [searchInput, setSearchInput] = useState('')

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true)
        setSearchInput("")        
        await refetch();
        setIsRefreshing(false)
    }, [setIsRefreshing, setSearchInput, refetch])

    const searchUsers = useCallback((data) => {        
        setSearchInput(data)
    }, [setSearchInput])
    
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
        className="h-full bg-primary-light dark:bg-primary"
        refreshControl={<RefreshControl tintColor="#ff9c01" colors={['#ff9c01', '#ff9c01', '#ff9c01']} refreshing={isRefreshing} onRefresh={onRefresh}/>}>
        <View className="my-4 px-4 mb-6">
                <Text className="text-2xl text-oBlack dark:text-white font-pmedium">Statistikat e perdoruesve
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
                    tintColor={colorScheme === "dark" ? "#fff" : "#000"}
                    className="size-8 bg-oBlack-light dark:bg-oBlack p-2 border-gray-200 dark:border-black-200 rounded-lg"
                    resizeMode='contain'
                />
            </Animatable.View>
        </View>
        <View className="mx-4 mb-4 border-b border-gray-200 dark:border-black-200 pb-4">
            <SearchInput 
                title={"Kerkoni perdorues"}
                placeholder={"Shkruani emrin e perdoruesit"}
                searchFunc={(data) => searchUsers(data)}
                valueData={searchInput}
            />
        </View>
        {searchInput !== "" && (
            <View className="px-4 pb-2">
                <Text className="text-oBlack dark:text-white text-sm">Te dhenat per kerkimin me emer: <Text className="text-secondary">{searchInput}</Text></Text>
            </View>
        )}
        {usersData.length > 0 ? <View className="flex-1 mr-4 ml-4 border-b border-gray-200 dark:border-black-200 pb-4">
            <FlatList
                data={usersData}
                className="flex-grow-0" 
                keyExtractor={(item) => `userdata-${item.id}`}
                contentContainerStyle={{ flexGrow: 0}}
                horizontal={true}
                renderItem={({item}) => (
                    <View className="flex-column rounded-r-md bg-oBlack-light dark:bg-oBlack self-start mt-2" style={shadowStyle}>
                        <View className="border-r border-t border-gray-200 dark:border-black-200 p-2">
                            <Text className="font-psemibold text-sm text-secondary">{item.name}</Text>
                        </View>
                        <View className="border-r border-t border-gray-200 dark:border-black-200 p-2">
                            <Text className="font-psemibold text-sm text-oBlack dark:text-white">{item.username}</Text>
                        </View>
                        <View className="border-r border-t border-gray-200 dark:border-black-200 p-2">
                            <Text className="font-psemibold text-sm text-oBlack dark:text-white">{item.email}</Text>
                        </View>
                        <View className="border-r border-t border-gray-200 dark:border-black-200 p-2">
                            <Text className="font-psemibold text-sm text-oBlack dark:text-white">{getMetaValue(item.userMeta, "Phone")}</Text>
                        </View>
                        <View className="border-r border-t border-gray-200 dark:border-black-200 p-2">
                            <Text className="font-psemibold text-sm text-oBlack dark:text-white">{item.coursesCreated}</Text>
                        </View>
                        <View className="border-r border-t border-gray-200 dark:border-black-200 p-2">
                            <Text className="font-psemibold text-sm text-oBlack dark:text-white">{item.lessonsCompleted}</Text>
                        </View>
                        <View className="border-r border-t border-gray-200 dark:border-black-200 p-2">
                            <Text className="font-psemibold text-sm text-oBlack dark:text-white">{item.quizzesCreated}</Text>
                        </View>
                        <View className="border-r border-t border-gray-200 dark:border-black-200 p-2">
                            <Text className="font-psemibold text-sm text-oBlack dark:text-white">{item.blogsCreated}</Text>
                        </View>
                        <View className="border-r border-t border-b border-gray-200 dark:border-black-200 p-2">
                            <Text className="font-psemibold text-sm text-oBlack dark:text-white">{item.commitmens}</Text>
                        </View>
                    </View>
                )}
                ListHeaderComponent={() => (
                    <>
                    <View className="flex-column rounded-l-md bg-oBlack-light dark:bg-oBlack mt-2 ml-2" style={shadowStyle}>
                        <View className="border-r border-l border-t p-2 border-gray-200 dark:border-black-200 rounded-tl-[5px]">
                            <Text className="font-plight text-sm text-oBlack dark:text-white">Emri</Text>
                        </View>
                        <View className="border-r border-l border-t border-gray-200 dark:border-black-200 p-2">
                            <Text className="font-plight text-sm text-oBlack dark:text-white">Nofka</Text>
                        </View>
                        <View className="border-r border-l border-t border-gray-200 dark:border-black-200 p-2">
                            <Text className="font-plight text-sm text-oBlack dark:text-white">Email</Text>
                        </View>
                        <View className="border-r border-l border-t border-gray-200 dark:border-black-200 p-2">
                            <Text className="font-plight text-sm text-oBlack dark:text-white">Numri</Text>
                        </View>
                        <View className="border-r border-l border-t border-gray-200 dark:border-black-200 p-2">
                            <Text className="font-plight text-sm text-oBlack dark:text-white">Kurset</Text>
                        </View>
                        <View className="border-r border-l border-t border-gray-200 dark:border-black-200 p-2">
                            <Text className="font-plight text-sm text-oBlack dark:text-white">Leksionet</Text>
                        </View>
                        <View className="border-r border-l border-t border-gray-200 dark:border-black-200 p-2">
                            <Text className="font-plight text-sm text-oBlack dark:text-white">Kuizet</Text>
                        </View>
                        <View className="border-r border-l border-t border-gray-200 dark:border-black-200 p-2">
                            <Text className="font-plight text-sm text-oBlack dark:text-white">Blogjet</Text>
                        </View>
                        <View className="border-r border-l border-t border-b border-gray-200 dark:border-black-200 p-2 rounded-bl-[5px]">
                            <Text className="font-plight text-sm text-oBlack dark:text-white">Angazhimet</Text>
                        </View>
                    </View>
                    </>
                )}
            />
        </View> : 
        <View className="m-4 border border-gray-200 dark:border-black-200 rounded-[5px] bg-oBlack p-4" style={shadowStyle}>
            <Text className="text-oBlack dark:text-white font-psemibold text-lg text-center">Nuk u gjet asnje e dhene. Provoni perseri!</Text>
        </View>}
        <View className="p-4">
            <Text className="text-oBlack dark:text-white font-plight text-sm">Ketu paraqiten angazhime e te gjithe perdoruesve te <Text className="text-secondary font-psemibold">ShokuMesimit</Text> dhe mund te kontaktoni personat adekuate me ane te butonit <Text className="text-secondary font-psemibold">Kontaktoni</Text>.</Text>      
            <Text className="text-oBlack dark:text-white font-plight text-sm mt-4">Me ane te seksionit te kerkimit te perdoruesve, ju mund te filtroni ne mes te gjithe perdoruesve qe jane aktual ne platformen <Text className="text-secondary font-psemibold">ShokuMesimit</Text>.</Text>
        </View>
    </ScrollView>
  )
}

export default AllStudentsStatistics