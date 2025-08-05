import { View, Text, Image, FlatList, RefreshControl, ActivityIndicator } from 'react-native'
import { useCallback, useEffect, useState } from 'react'
import { images } from '../../../constants'
import SorterComponent from "../../../components/SorterComponent"
import OnlineClassesCard from '../../../components/OnlineClassesCard';
import LearnOnlineHeader from '../../../components/LearnOnlineHeader';
import useFetchFunction from '../../../hooks/useFetchFunction';
import { GetInstructorsCourses } from '../../../services/fetchingService';
import Loading from '../../../components/Loading';
import { useGlobalContext } from '../../../context/GlobalProvider';
import EmptyState from '../../../components/EmptyState';
import { initialFilterData } from '../../../services/filterConfig';
import { useShadowStyles } from '../../../hooks/useShadowStyles';
import { useColorScheme } from 'nativewind';
import { useNavigateToSupport } from '../../../hooks/goToSupportType';

const AllOnlineCourses = () => {
  const navigateToSupport = useNavigateToSupport();
  const {colorScheme} = useColorScheme();
  const {shadowStyle} = useShadowStyles();
  const [filterData, setFilterData] = useState({
    ...initialFilterData
  })
  const {data, isLoading, refetch} = useFetchFunction(() => GetInstructorsCourses(filterData)) // TODO: add pagination
  const {user, isLoading: userLoading} = useGlobalContext();
  const [coursesData, setCoursesData] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [loadedFirst, setLoadedFirst] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  const loadMore = useCallback(() => {
    if(!coursesData?.hasMore || loadingMore) return;
    setLoadingMore(true)
    setFilterData((prev) => ({
      ...prev,
      pageNumber: prev.pageNumber + 1
    }))
  }, [setLoadingMore, setFilterData, coursesData?.hasMore, loadingMore])

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true)
    setLoadedFirst(false)
    setFilterData({...initialFilterData})
    await refetch();
    setIsRefreshing(false)
  }, [])

  const handleSorter = useCallback(async (data) => {
    setLoadedFirst(false)
    setFilterData((prev) => ({
      ...prev,
      sortByName: data.emri != null && "Name",
      sortNameOrder: data.emri,
      sortByDate: data.data != null && "CreatedAt",
      sortDateOrder: data.data,
      sortByViews: data.shikime != null && "ViewCount",
      sortViewOrder: data.shikime,
      pageSize: data.pageSize
    }))
  }, [setLoadedFirst, setFilterData])

  useEffect(() => {
    refetch()
  }, [filterData])

  useEffect(() => {
    if(coursesData?.courses?.length > 0){
      setLoadedFirst(true)
    }
  }, [coursesData])
  
  const inputData = useCallback((data) => {
    if(data){
      setLoadedFirst(false)
      setFilterData((prev) => ({
        ...prev,
        searchInput: data
      }))
    }
  }, [setLoadedFirst, setFilterData])

  useEffect(() => {
    console.log(data, '  data')
    if(data){
      if(filterData.pageNumber > 1){
        setCoursesData((prev) => ({
          ...prev,
          courses: [...prev.courses, ...data.courses],
          hasMore: data.hasMore
        }))
      }else{
        setCoursesData(data)
      }
      setLoadingMore(false)
    }else{
      setLoadingMore(false)
      setCoursesData([])
    }
  }, [data])
  
  if((isLoading || isRefreshing || userLoading) && !loadedFirst) return <Loading />
  return (
    <View className="flex-1 bg-primary-light dark:bg-primary">
        <FlatList
            refreshControl={<RefreshControl tintColor="#ff9c01" colors={['#ff9c01', '#ff9c01', '#ff9c01']} refreshing={isRefreshing} onRefresh={onRefresh} />}
            data={coursesData?.courses}
            onEndReached={loadMore}
            onEndReachedThreshold={0.1}
            contentContainerStyle={{gap:24, paddingLeft: 16, paddingRight: 16}}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => (
                <OnlineClassesCard classes={item} userCategories={user?.data?.categories}/>
            )}
            ListHeaderComponent={() => (
                <View className="border-b border-gray-200 dark:border-black-200 pb-4 overflow-hidden -mb-2">
                <LearnOnlineHeader headerTitle={"Kurset Online"} sentInput={inputData}/>
                <SorterComponent showSorter={true} sortButton={handleSorter}/>
                </View>
            )}
            ListFooterComponent={() => (
              <>
              <View className="mb-2" />
              <View className="justify-center -mt-2 flex-row items-center gap-2">
                {coursesData?.hasMore ? (
                    <>
                    <Text className="text-oBlack dark:text-white font-psemibold text-sm">Ju lutem prisni...</Text>
                    <ActivityIndicator color={"#FF9C01"} size={24} />
                    </>
                    ) : (
                    <>
                    <Text className="text-oBlack dark:text-white font-psemibold text-sm">Nuk ka me kurse...</Text>
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
                  title={"Nuk ka kurse ende!"}
                  subtitle={"Nese mendoni qe eshte gabim, ju lutem rifreskoni dritaren apo kontaktoni Panelin e Ndihmes"}
                  isSearchPage={true}
                  buttonTitle={"Navigohuni tek Paneli Ndihmes"}
                  buttonStyle={colorScheme === 'light' ? "!rounded-none !border !border-gray-200" : ""}
                  buttonFunction={() => navigateToSupport('support')}
                />
              </View>
            )}
        />

        
    </View>
  )
}

export default AllOnlineCourses