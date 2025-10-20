import { View, Text, FlatList, RefreshControl, Image, TouchableOpacity } from 'react-native'
import  { useCallback, useEffect, useState } from 'react'
import LearnOnlineHeader from '../../../components/LearnOnlineHeader'
import MeetingCardComponent from '../../../components/MeetingCardComponent'
import useFetchFunction from '../../../hooks/useFetchFunction'
import { GetAllMeetings } from '../../../services/fetchingService'
import Loading from '../../../components/Loading'
import EmptyState from '../../../components/EmptyState'
import SorterComponent from '../../../components/SorterComponent'
import { initialFilterData } from '../../../services/filterConfig'
import { ActivityIndicator } from 'react-native'
import { icons, images } from '../../../constants'
import { useRouter } from 'expo-router'
import { useShadowStyles } from '../../../hooks/useShadowStyles'
import { useColorScheme } from 'nativewind'
import { useNavigateToSupport } from '../../../hooks/goToSupportType'

const AllOnlineMeetings = () => {
  const {shadowStyle} = useShadowStyles();
  const {colorScheme} = useColorScheme();
  const navigateToSupport = useNavigateToSupport();
  const router = useRouter();
  const [filterData, setFilterData] = useState({
    ...initialFilterData
  })
  const {data, isLoading, refetch} = useFetchFunction(() => GetAllMeetings(filterData))

  const [meetingsData, setMeetingsData] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [loadedFirst, setLoadedFirst] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  const loadMore = useCallback(() => {
    if(!meetingsData?.hasMore || loadingMore) return;
    setLoadingMore(true)
    setFilterData((prev) => ({
      ...prev,
      pageNumber: prev.pageNumber + 1
    }))
  }, [setLoadingMore, setFilterData, loadingMore, meetingsData?.hasMore])

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true)
    setLoadedFirst(false)
    setFilterData({...initialFilterData})
    await refetch();
    setIsRefreshing(false)
  }, [setIsRefreshing, setLoadedFirst, refetch, setFilterData])

  useEffect(() => {
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
      setMeetingsData([])
    }
  }, [data])
  
  useEffect(() => {
    if(meetingsData?.meetings?.length > 0){
      setLoadedFirst(true)
    }
  }, [meetingsData])
  

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
  }, [setFilterData])

  if((isLoading || isRefreshing) && !loadedFirst) return <Loading />
  return (
    <View className="flex-1">
        <FlatList
          refreshControl={<RefreshControl tintColor="#ff9c01" colors={['#ff9c01', '#ff9c01', '#ff9c01']} refreshing={isRefreshing} onRefresh={onRefresh} />}
          className="h-full bg-primary-light dark:bg-primary"
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
              <LearnOnlineHeader headerTitle={"Klaset online"} sentInput={inputData}/>
              <View className="overflow-hidden">
                <SorterComponent showSorter={true} sortButton={handleSorter}/>
              </View>
              <TouchableOpacity onPress={() => router.replace('allUpcomingOnlineMeetings')} className="flex-row items-center justify-center gap-1.5 mx-auto px-3 border border-white bg-secondary py-1.5" style={shadowStyle}>
                <Text className="text-white font-plight text-sm">Klaset tuaja te ardhshme</Text>
                <Image 
                  source={icons.clock}
                  className="size-5"
                  resizeMode='contain'
                  tintColor={"#fff"}
                />
              </TouchableOpacity>
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
          ListEmptyComponent={() => (
            <View className="bg-oBlack border border-black-200" style={shadowStyle}>
              <EmptyState
                title={"Nuk ka takime ende!"}
                subtitle={"Nese mendoni qe eshte gabim, ju lutem rifreskoni dritaren apo kontaktoni Panelin e Ndihmes"}
                isSearchPage={true}
                buttonTitle={"Navigohuni tek Paneli Ndihmes"}
                buttonStyle={colorScheme === 'light' ? "!rounded-none !border !border-gray-200" : ""}
                buttonFunction={() => navigateToSupport('suport')}
              />
            </View>
          )}
        />
    </View>
  )
}

export default AllOnlineMeetings