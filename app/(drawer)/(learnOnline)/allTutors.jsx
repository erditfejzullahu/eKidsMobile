import { View, Text, Image, FlatList, RefreshControl } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { images } from '../../../constants'
import LearnOnlineHeader from '../../../components/LearnOnlineHeader'
import LearnOnlineTutorCard from '../../../components/LearnOnlineTutorCard';
import useFetchFunction from '../../../hooks/useFetchFunction';
import { GetAllInstructors } from '../../../services/fetchingService';
import Loading from '../../../components/Loading';
import SorterComponent from '../../../components/SorterComponent';
import { initialFilterData } from '../../../services/filterConfig';
import { ActivityIndicator } from 'react-native';
import EmptyState from '../../../components/EmptyState';
import { useShadowStyles } from '../../../hooks/useShadowStyles';
import { useNavigateToSupport } from '../../../hooks/goToSupportType';
import { useColorScheme } from 'nativewind';

const AllTutors = () => {
  const navigationToSupport = useNavigateToSupport();
  const {shadowStyle} = useShadowStyles();
  const {colorScheme} = useColorScheme();
  const [filterData, setFilterData] = useState({
    ...initialFilterData
  })
  const {data, isLoading, refetch} = useFetchFunction(() => GetAllInstructors(filterData))
  const [instructorsData, setInstructorsData] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [loadedFirst, setLoadedFirst] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  const loadMore = useCallback(() => {
    if(!instructorsData?.hasMore || loadingMore) return;
    setLoadingMore(true)
    setFilterData((prev) => ({
      ...prev,
      pageNumber: prev.pageNumber + 1
    }))
  }, [setLoadingMore, setFilterData, instructorsData?.hasMore, loadingMore])

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true)
    setLoadedFirst(false)
    setFilterData({...initialFilterData})
    await refetch();
    setIsRefreshing(false)
  }, [setIsRefreshing, setLoadedFirst, setFilterData, refetch])

  useEffect(() => {
    console.log(data);
    
    if(data){
      if(filterData.pageNumber > 1){
        setInstructorsData((prev) => ({
          ...prev,
          instructors: [...prev?.instructors, ...data.instructors],
          hasMore: data.hasMore
        }))
      }else{
        setInstructorsData(data)
      }
      setLoadingMore(false)
    }else{
      setLoadingMore(false)
      setInstructorsData([])  
    }
  }, [data])

  useEffect(() => {
    refetch();
  }, [filterData])
  

  const inputData = useCallback((data) => {
    if(data){
      setLoadedFirst(false)
      setFilterData((prev) => ({
        ...prev,
        searchInput: data
      }))
    }
  }, [setLoadedFirst, setFilterData])
  
  const handleSorter = useCallback((data) => {
    setLoadedFirst(false)
    setFilterData((prev) => ({
      ...prev,
      sortByName: data.emri != null && "InstructorName",
      sortNameOrder: data.emri,
      sortByDate: data.data != null && "WhenBecameInstructor",
      sortDateOrder: data.data,
      sortByViews: data.shikime != null && "InstructorStudents",
      sortViewOrder: data.shikime,
      pageSize: data.pageSize,
    }))
  }, [setLoadedFirst, setFilterData])

  useEffect(() => {
    if(instructorsData?.instructors?.length > 0){
      setLoadedFirst(true)
    }
  }, [instructorsData])
  

  if((isRefreshing || isLoading) && !loadedFirst) return <Loading />
  return (
    <View className="flex-1">
        <FlatList 
          refreshControl={<RefreshControl tintColor="#ff9c01" colors={['#ff9c01', '#ff9c01', '#ff9c01']} refreshing={isRefreshing} onRefresh={onRefresh} />}
          className="h-full bg-primary-light dark:bg-primary"
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          contentContainerStyle={{paddingLeft:16, paddingRight:16, gap:16}}
          data={instructorsData?.instructors}
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
            <>
            <View className="mb-2" />
            <View className="justify-center -mt-2 flex-row items-center gap-2">
              {instructorsData?.hasMore ? (
                  <>
                  <Text className="text-oBlack dark:text-white font-psemibold text-sm">Ju lutem prisni...</Text>
                  <ActivityIndicator color={"#FF9C01"} size={24} />
                  </>
                  ) : (
                  <>
                  <Text className="text-oBlack dark:text-white font-psemibold text-sm">Nuk ka me tutore...</Text>
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
            <View className="bg-oBlack-light dark:bg-oBlack border border-gray-200 dark:border-black-200" style={shadowStyle}>
              <EmptyState
                title={"Nuk ka instruktor ende!"}
                subtitle={"Nese mendoni qe eshte gabim, ju lutem rifreskoni dritaren apo kontaktoni Panelin e Ndihmes"}
                isSearchPage={true}
                buttonTitle={"Navigohuni tek Paneli Ndihmes"}
                buttonStyle={colorScheme === 'light' ? "!rounded-none !border !border-gray-200" : ""}
                buttonFunction={() => navigationToSupport('support')}
              />
            </View>
          )}
        />
    </View>
  )
}

export default AllTutors