import { View, Text, FlatList, RefreshControl, StyleSheet, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import LearnOnlineHeader from '../../../components/LearnOnlineHeader'
import LearnOnlineUpcomingClasses from '../../../components/LearnOnlineUpcomingClasses'
import MeetingCardComponent from '../../../components/MeetingCardComponent'
import useFetchFunction from '../../../hooks/useFetchFunction'
import { GetAllMeetings } from '../../../services/fetchingService'
import Loading from '../../../components/Loading'
import { Platform } from 'react-native'
import EmptyState from '../../../components/EmptyState'
import SorterComponent from '../../../components/SorterComponent'
import { initialFilterData } from '../../../services/filterConfig'
import { ActivityIndicator } from 'react-native'
import { images } from '../../../constants'

const testArray = [{id:1},{id:2},{id:3}]

const AllUpcomingMeetings = () => {
  const [filterData, setFilterData] = useState({
    ...initialFilterData
  })
  const {data, isLoading, refetch} = useFetchFunction(() => GetAllMeetings(filterData))

  const [meetingsData, setMeetingsData] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [loadedFirst, setLoadedFirst] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  const loadMore = () => {
    if(meetingsData?.hasMore || loadingMore) return;
    setLoadingMore(true)
    setFilterData((prev) => ({
      ...prev,
      pageNumber: prev.pageNumber + 1
    }))
  }

  const onRefresh = async () => {
    setIsRefreshing(true)
    setLoadedFirst(false)
    setFilterData({...initialFilterData})
    await refetch();
    setIsRefreshing(false)
  }

  useEffect(() => {
    console.log(data);
    if(data){
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
      setMeetingsData([])
    }
  }, [data])
  
  useEffect(() => {
    if(meetingsData?.meetings?.length > 0){
      setLoadedFirst(true)
    }
  }, [meetingsData])
  

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
      sortViewOrder: data.shikime
    }))
  }

  if((isLoading || isRefreshing) && !loadedFirst) return <Loading />
  return (
    <View className="flex-1">
        <FlatList
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
          className="h-full bg-primary"
          contentContainerStyle={{paddingLeft:16, paddingRight:16, gap:16}}
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          data={meetingsData?.meetings}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <MeetingCardComponent item={item}/>
            // e pasna bo edhe ni component po pak trash ListMeetingcomponent dicka 
          )}
          ListHeaderComponent={() => (
            <View className="gap-2">
              <LearnOnlineHeader headerTitle={"Klaset e pritura"} sentInput={inputData}/>
              <SorterComponent showSorter={true} sortButton={handleSorter}/>
            </View>
          )}
          ListFooterComponent={() => (
            <>
            <View className="mb-2" />
            <View className="justify-center -mt-2 flex-row items-center gap-2">
              {meetingsData?.hasMore ? (
                  <>
                  <Text className="text-white font-psemibold text-sm">Ju lutem prisni...</Text>
                  <ActivityIndicator color={"#FF9C01"} size={24} />
                  </>
                  ) : (
                  <>
                  <Text className="text-white font-psemibold text-sm">Nuk ka me takime online...</Text>
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
          ListEmptyComponent={() => (
            <View className="bg-oBlack border border-black-200" style={styles.box}>
              <EmptyState
                title={"Nuk ka takime ende!"}
                subtitle={"Nese mendoni qe eshte gabim, ju lutem rifreskoni dritaren apo kontaktoni Panelin e Ndihmes"}
                isSearchPage={true}
                buttonTitle={"Krijo kurse"}
                buttonFunction={() => router.replace('/instructor/addCourse')}
              />
            </View>
          )}
        />
    </View>
  )
}

export default AllUpcomingMeetings

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