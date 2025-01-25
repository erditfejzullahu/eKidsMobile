import { View, Text, FlatList, Image } from 'react-native'
import React, { useEffect } from 'react'
import useFetchFunction from '../../../hooks/useFetchFunction'
import { getAllUsersStatstics, getMetaValue } from '../../../services/fetchingService'
import { useState } from 'react'
import { images } from '../../../constants'

const AllStudentsStatistics = () => {
    const {data, isLoading, refetch} = useFetchFunction(() => getAllUsersStatstics())
    const [usersData, setUsersData] = useState([])

    useEffect(() => {
      if(data){
        setUsersData(data)
      }
    }, [data])
    
  return (
    <View className="h-full bg-primary">
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
      <FlatList
        data={usersData}
        className="flex-grow-0"
        keyExtractor={(item) => `userdata-${item.id}`}
        contentContainerStyle={{ flexGrow: 0 }}
        horizontal={true}
        renderItem={({item}) => (
            <View className="flex-column bg-oBlack self-start mt-2">
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
            <View className="flex-column bg-oBlack mt-2 ml-2">
                <View className="border-r border-l border-t p-2 border-black-200">
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
                <View className="border-r border-l border-t border-b border-black-200 p-2">
                    <Text className="font-plight text-sm text-white">Angazhimet</Text>
                </View>
            </View>
            </>
        )}
      />
        <View className="p-4">
            <Text className="text-white font-plight text-sm">Ketu paraqiten angazhime e te gjithe perdoruesve te <Text className="text-secondary font-psemibold">ShokuMesimit</Text> dhe mund te kontaktoni personat adekuate me ane te butonit <Text className="text-secondary font-psemibold">Kontaktoni</Text>.</Text>      
            <Text className="text-white font-plight text-sm mt-4">Me ane te seksionit te kerkimit te perdoruesve, ju mund te filtroni ne mes te gjithe perdoruesve qe jane aktual ne platformen <Text className="text-secondary font-psemibold">ShokuMesimit</Text>.</Text>
        </View>
    </View>
  )
}

export default AllStudentsStatistics