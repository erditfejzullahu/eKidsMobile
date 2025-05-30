import { View, Text, FlatList, RefreshControl, StyleSheet } from 'react-native'
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

const testArray = [{id:1},{id:2},{id:3}]

const AllUpcomingMeetings = () => {
  const [filterData, setFilterData] = useState({
    ...initialFilterData
  })
  const {data, isLoading, refetch} = useFetchFunction(() => GetAllMeetings(filterData))

  const [meetingsData, setMeetingsData] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const onRefresh = async () => {
    setIsRefreshing(true)
    setFilterData({...initialFilterData})
    await refetch();
    setIsRefreshing(false)
  }

  useEffect(() => {
    console.log(data);
    
    setMeetingsData(data || [])
  }, [data])
  

  const inputData = (data) => {
    console.log(data)
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

  if(isLoading || isRefreshing) return <Loading />
  return (
    <View className="flex-1">
        <FlatList
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
          className="h-full bg-primary"
          contentContainerStyle={{paddingLeft:16, paddingRight:16, gap:16}}
          data={meetingsData}
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
            <View className="my-2"></View>
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