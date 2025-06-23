import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import useFetchFunction from '../../../hooks/useFetchFunction'
import { initialFilterData } from '../../../services/filterConfig'
import Loading from '../../../components/Loading'
import MeetingCardComponent from '../../../components/MeetingCardComponent'
import LearnOnlineHeader from '../../../components/LearnOnlineHeader'
import SorterComponent from '../../../components/SorterComponent'
import { icons, images } from '../../../constants'
import { GetAllMeetings } from '../../../services/fetchingService'
import { ActivityIndicator } from 'react-native'
import EmptyState from '../../../components/EmptyState'
import { useRouter } from 'expo-router'
import { useShadowStyles } from '../../../hooks/useShadowStyles'
import { useColorScheme } from 'nativewind'

const AllUpcomingOnlineMeetings = () => {
  const {colorScheme} = useColorScheme();
  const {shadowStyle} = useShadowStyles();
    const router = useRouter();
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [filterData, setFilterData] = useState({...initialFilterData, userActiveMeetingsSection: true})    
    const {data, isLoading, refetch} = useFetchFunction(() => GetAllMeetings(filterData))
    const [loadedFirst, setLoadedFirst] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const [meetingsData, setMeetingsData] = useState(null)

    const loadMore = () => {
        if(!meetingsData?.hasMore || loadingMore) return;
        setLoadingMore(true)
        setFilterData((prev) => ({
            ...prev,
            pageNumber: prev.pageNumber + 1
        }))
    }

    const onRefresh = async () => {
        setIsRefreshing(true)
        setLoadedFirst(false)
        await refetch();
        setFilterData({...initialFilterData, userActiveMeetingSection: true})
        setIsRefreshing(false)
    }

    const inputData = (data) => {
        if(data){
          setLoadedFirst(false)
          setFilterData((prev) => ({
            ...prev,
            searchInput: data
          }))
        }
    }

    const handleSorter = (data) => {
        setFilterData((prev) => ({
          ...prev,
          sortByName: data.emri != null && "Title",
          sortNameOrder: data.emri,
          sortByDate: data.data != null && "CreatedAt",
          sortDateOrder: data.data,
          sortByViews: data.shikime != null && "Participants",
          sortViewOrder: data.shikime,
          pageSize: data.pageSize,
        }))
    }

    useEffect(() => {
      if(meetingsData?.meetings?.length > 0){
        setLoadedFirst(true)
      }
    }, [meetingsData])
    

    useEffect(() => {
        console.log(data);
        
      if(data?.meetings?.length > 0){
        if(filterData.pageNumber > 1){
            setMeetingsData((prev) => ({
                ...prev,
                meetings: [...prev.meetings, ...data.meetings],
                hasMore: data.hasMore
            }))
        }else{
            setMeetingsData(data)
        }
        setLoadingMore(false)
      }else{
        setLoadingMore(false)
        setMeetingsData(null)
      }
    }, [data])
    if((isLoading || isRefreshing) && !loadedFirst) return <Loading />
  return (
    <View className="flex-1">
      <FlatList 
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        data={meetingsData?.meetings}
        refreshControl={<RefreshControl tintColor="#ff9c01" colors={['#ff9c01', '#ff9c01', '#ff9c01']} refreshing={isRefreshing} onRefresh={onRefresh} />}
        className="h-full bg-primary-light dark:bg-primary"
        contentContainerStyle={{paddingLeft:16, paddingRight:16, gap:16}}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
            <MeetingCardComponent item={item} userActiveUpcomingMeetingsSection/>
        // e pasna bo edhe ni component po pak trash ListMeetingcomponent dicka 
        )}
        ListHeaderComponent={() => (
            <View className="gap-2">
                <LearnOnlineHeader headerTitle={"Klaset tua aktive"} sentInput={inputData}/>
                <View className="overflow-hidden">
                    <SorterComponent showSorter={true} sortButton={handleSorter}/>
                </View>
                <TouchableOpacity className="flex-row items-center justify-center gap-1.5 mx-auto px-3 border border-white bg-secondary py-1.5" style={shadowStyle}>
                    <Text className="text-white font-plight text-sm">Vleresoni takimet</Text>
                    <Image
                    source={icons.star}
                    className="size-5"
                    resizeMode='contain'
                    tintColor={"#fff"}
                    />
                </TouchableOpacity>
            </View>
        )}
        ListEmptyComponent={() => (
            <View className="bg-oBlack-light dark:bg-oBlack border border-gray-200 dark:border-black-200" style={shadowStyle}>
              <EmptyState
                title={"Nuk keni takime ne pritje!"}
                subtitle={"Nese mendoni qe eshte gabim, ju lutem rifreskoni dritaren apo kontaktoni Panelin e Ndihmes"}
                isSearchPage={true}
                buttonTitle={"Ndjek kurse"}
                buttonStyle={colorScheme === 'light' ? "!rounded-none !border !border-gray-200" : ""}
                buttonFunction={() => router.replace('allOnlineCourses')}
              />
            </View>
        )}
        ListFooterComponent={() => (
            <>
            <View className="mb-2" />
            <View className="justify-center -mt-2 flex-row items-center gap-2">
                {meetingsData?.hasMore ? (
                    <>
                    <Text className="text-oBlack dark:text-white font-psemibold text-sm">Ju lutem prisni...</Text>
                    <ActivityIndicator color={"#FF9C01"} size={24} />
                    </>
                    ) : (
                    <>
                    <Text className="text-oBlack dark:text-white font-psemibold text-sm">Nuk ka me takime online...</Text>
                    <Image
                        source={images.breakHeart}
                        className="size-5"
                        tintColor={"#FF9C01"}
                        resizeMode='contain'
                    />
                    </>
                )}
            </View>
            </>
        )}
      />
    </View>
  )
}

export default AllUpcomingOnlineMeetings

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