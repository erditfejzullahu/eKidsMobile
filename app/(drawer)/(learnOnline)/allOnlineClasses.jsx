import { View, Text, Image, FlatList, StyleSheet, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { images } from '../../../constants'
import SorterComponent from "../../../components/SorterComponent"
import OnlineClassesCard from '../../../components/OnlineClassesCard';
import { Platform } from 'react-native';
import LearnOnlineHeader from '../../../components/LearnOnlineHeader';
import useFetchFunction from '../../../hooks/useFetchFunction';
import { GetInstructorsCourses } from '../../../services/fetchingService';
import Loading from '../../../components/Loading';
import { useGlobalContext } from '../../../context/GlobalProvider';
import EmptyState from '../../../components/EmptyState';
import { initialFilterData } from '../../../services/filterConfig';


const AllOnlineClasses = () => {
  const [filterData, setFilterData] = useState({
    ...initialFilterData
  })
  const {data, isLoading, refetch} = useFetchFunction(() => GetInstructorsCourses(filterData)) // TODO: add pagination
  const {user, isLoading: userLoading} = useGlobalContext();
  const [coursesData, setCoursesData] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const onRefresh = async () => {
    setIsRefreshing(true)
    setFilterData({...initialFilterData})
    await refetch();
    setIsRefreshing(false)
  }

  const handleSorter = async (data) => {
    setFilterData((prev) => ({
      ...prev,
      sortByName: data.emri != null && "Name",
      sortNameOrder: data.emri,
      sortByDate: data.data != null && "CreatedAt",
      sortDateOrder: data.data,
      sortByViews: data.shikime != null && "ViewCount",
      sortViewOrder: data.shikime
    }))
  }

  useEffect(() => {
    refetch()
  }, [filterData])
  

  useEffect(() => {
    console.log(data, '  data')
    setCoursesData(data || [])
  }, [data])
  
  if(isLoading || isRefreshing || userLoading) return <Loading />
  return (
    <View className="flex-1 bg-primary">
        <FlatList
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
            data={coursesData}
            contentContainerStyle={{gap:24, paddingLeft: 16, paddingRight: 16}}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => (
                <OnlineClassesCard classes={item} userCategories={user?.data?.categories}/>
            )}
            ListHeaderComponent={() => (
                <View className="border-b border-black-200 pb-4 overflow-hidden -mb-2">
                <LearnOnlineHeader headerTitle={"Kurset Online"} sentInput={(data) => console.log(data)}/>
                <SorterComponent showSorter={true} sortButton={handleSorter}/>
                </View>
            )}
            ListFooterComponent={() => (
              <View className="mb-4"></View>
            )}
            ListEmptyComponent={() => (
              <View className="bg-oBlack border border-black-200" style={styles.box}>
                <EmptyState
                  title={"Nuk ka kurse ende!"}
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

export default AllOnlineClasses

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