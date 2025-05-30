import { View, Text, Image, FlatList, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { images } from '../../../constants'
import LearnOnlineHeader from '../../../components/LearnOnlineHeader'
import LearnOnlineTutorCard from '../../../components/LearnOnlineTutorCard';
import useFetchFunction from '../../../hooks/useFetchFunction';
import { GetAllInstructors } from '../../../services/fetchingService';
import Loading from '../../../components/Loading';
import SorterComponent from '../../../components/SorterComponent';
import { initialFilterData } from '../../../services/filterConfig';


const AllTutors = () => {
  const [filterData, setFilterData] = useState({
    ...initialFilterData
  })
  const {data, isLoading, refetch} = useFetchFunction(() => GetAllInstructors(filterData))
  const [instructorsData, setInstructorsData] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const onRefresh = async () => {
    setIsRefreshing(true)
    setFilterData({...initialFilterData})
    await refetch();
    setIsRefreshing(false)
  }

  useEffect(() => {
    setInstructorsData(data || [])  
  }, [data])

  useEffect(() => {
    refetch();
  }, [filterData])
  

  const inputData = (data) => {
    console.log(data)
  }
  
  const handleSorter = (data) => {
    setFilterData((prev) => ({
      ...prev,
      sortByName: data.emri != null && "InstructorName",
      sortNameOrder: data.emri,
      sortByDate: data.data != null && "WhenBecameInstructor",
      sortDateOrder: data.data,
      sortByViews: data.shikime != null && "InstructorStudents",
      sortViewOrder: data.shikime
    }))
  }

  if(isRefreshing || isLoading) return <Loading />
  return (
    <View className="flex-1">
        <FlatList 
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
          className="h-full bg-primary"
          contentContainerStyle={{paddingLeft:16, paddingRight:16, gap:16}}
          data={instructorsData}
          keyExtractor={(item) => item.userId}
          renderItem={({item}) => (
            <LearnOnlineTutorCard item={item}/>
          )}
          ListHeaderComponent={() => (
            <View className="gap-2">
              <LearnOnlineHeader headerTitle={"Te gjithe tutoret"} sentInput={inputData}/>
              <SorterComponent showSorter={true} sortButton={handleSorter}/>
            </View>
          )}
          ListFooterComponent={() => (
            <View className="my-2"></View>
          )}
        />
    </View>
  )
}

export default AllTutors