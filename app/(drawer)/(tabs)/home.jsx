import { View, Text, FlatList, Image, RefreshControl, ActivityIndicator} from 'react-native'
import {useState, useEffect, useCallback, useRef} from 'react'
import { useGlobalContext } from '../../../context/GlobalProvider'
import { images } from '../../../constants'
import SearchInput from '../../../components/SearchInput'
import { StatusBar } from 'expo-status-bar'
import Courses from '../../../components/Courses'
import EmptyState from '../../../components/EmptyState'
import Sliders from '../../../components/Sliders'
import useFetchFunction from '../../../hooks/useFetchFunction'
import { fetchCourses } from '../../../services/fetchingService'
import Loading from '../../../components/Loading'
import SorterComponent from '../../../components/SorterComponent'
import { initialFilterData } from '../../../services/filterConfig'
import { useNavigateToSupport } from '../../../hooks/goToSupportType'
import { useColorScheme } from 'nativewind'
import { useShadowStyles } from '../../../hooks/useShadowStyles'

const Home = () => {  
  const {colorScheme} = useColorScheme();
  const [refreshing, setRefreshing] = useState(false)

  const { user, isLoading: userDataLoading } = useGlobalContext()
  const {shadowStyle} = useShadowStyles();

  const [currentPage, setCurrentPage] = useState(1)
  const [allCourses, setAllCourses] = useState([])
  const [showLoadMore, setShowLoadMore] = useState(false)

  const [filterData, setFilterData] = useState({
    ...initialFilterData,
    searchParam: ''
  })

  const [searchData, setSearchData] = useState('')
  const userData = user?.data?.userData;
  const categories = user?.data?.categories

  const { data: courses, refetch, isLoading } = useFetchFunction(() => fetchCourses(filterData))

  const [loadedFirst, setLoadedFirst] = useState(false)

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    setCurrentPage(1);
    setLoadedFirst(false)
    setAllCourses([]);

    setFilterData((prevData) => ({
      ...prevData,
      pageNumber: 1,
      pageSize: 15,
      sortByName: '',
      sortNameOrder: '',
      sortByDate: '',
      sortDateOrder: '',
      sortByViews: '',
      sortViewOrder: '',
      categoryId: '',
      searchParam: ''
    }))

    await refetch();
    setRefreshing(false)
  }, [])

  const loadMoreCourses = useCallback(() => {
    if(!allCourses.hasMore || showLoadMore) return;
      setShowLoadMore(true)
      setFilterData((prev) => ({
        ...prev,
        pageNumber: prev.pageNumber + 1
      }))
  }, [allCourses.courses, showLoadMore])

  const updateFilterData = useCallback((data) => {
    setLoadedFirst(false)
    setFilterData((prev) => ({
      ...prev,
      sortByName: data.emri != null && "CourseName",
      sortNameOrder: data.emri,
      sortByDate: data.data != null && "CreatedAt",
      sortDateOrder: data.data,
      sortByViews: data.shikime != null && "ViewCount",
      sortViewOrder: data.shikime,
      pageSize: data.pageSize,
    }))
  }, [])

  const searchFunction = useCallback((data) => {
    setLoadedFirst(false)
    setFilterData((prevData) => ({
      ...prevData,
      searchParam: data
    }))
  }, [])
  
  useEffect(() => {
    refetch();    
  }, [filterData])
  
  useEffect(() => {
    if(allCourses.length > 0){
      setLoadedFirst(true)
    }
  }, [allCourses])
  

  useEffect(() => {    
    if(courses){
      if(filterData.pageNumber > 1){
        setAllCourses(prev => ({
          ...prev,
          courses: [...prev.courses, ...courses.courses],
          hasMore: courses.hasMore
        }))
      }else{
        setAllCourses(courses)
      }
      // setLoadedFirst(true)
      setShowLoadMore(false)
    }else{
      setAllCourses([])
      setShowLoadMore(false)
    }
  }, [courses])
  
  if (((isLoading || userDataLoading) && !loadedFirst)) {
    return (
      <Loading />
    );
  }else{
    return (
      <View className={`bg-primary-light dark:bg-primary h-full`}>
        <FlatList 
        showsVerticalScrollIndicator={false}
          data={allCourses?.courses}
          keyExtractor={(item) => "courses-" + item?.id}
          renderItem={({ item }) => (
            <Courses 
              courses={item}
            />
          )}
          onEndReached={loadMoreCourses}
          onEndReachedThreshold={0.1}
          ListHeaderComponent={() => (
            <View className="my-6 px-4 space-y-6">
              <View className="justify-between items-start flex-row mb-6">
                <View>
                <Text className={`font-pmedium text-sm text-gray-600 dark:text-gray-100 `}>
                  Mirë se erdhët përsëri
                </Text>
                <Text className="relative text-2xl font-psemibold text-oBlack dark:text-white">
                  {userData?.firstname + ' ' + userData?.lastname}
                  <View>
                    <Image 
                      source={images.path}
                      resizeMode="contain"
                      className="h-auto w-[100px] absolute -bottom-8 -left-12"
                    />
                  </View>
                </Text>
                </View>
  
                <View className="mt-1.5 h-14">
                  <Image 
                    source={images.logoNew}
                    className="w-[80px] h-[45px]"
                    resizeMode="cover"
                  />
                </View>
              </View>
              <SearchInput 
                placeholder={'Kërkoni material mësimor...'}
                searchFunc={searchFunction}
                valueData={searchData}
              />
  
              <View className="w-full flex-1 pt-6 pb-0 dark:pb-3">
                <Text className="text-oBlack -mb-4 dark:mb-0 dark:text-gray-100 text-lg font-pregular ">
                  Të gjitha kategoritë
                </Text>
                <Sliders 
                  posts={categories || []}
                  keyID={"CategoryID"}
                  dataCategory={"categories"}
                />
              </View>
  
              <View className={`w-full flex-row justify-between mb-2`}>
                <Text className="text-oBlack dark:text-gray-100 text-lg font-pregular">
                  Kurset mësimore të fundit
                </Text>
              </View>

              {/* filter */}
                <SorterComponent
                  showSorter={true}
                  sortButton={updateFilterData}
                />
              {/* filter  */}
            </View>
          )}
          ListEmptyComponent={() => (
            <View className="bg-oBlack-light dark:bg-oBlack mx-4 py-2 pt-4 border border-gray-200 dark:border-black-200 mb-4" style={shadowStyle}>
              <EmptyState 
                title={"Nuk është gjetur ndonjë përmbajtje"}
                subtitle={"Ju lutem kontaktoni Seksionin e Ndihmës apo bëni kërkesën e krijimit të një materiali të ri mësimor të specifikuar!"}
                buttonTitle={"Vazhdoni me veprimin!"}
                buttonStyle={colorScheme === 'light' ? "!rounded-none !border !border-gray-200" : ""}
                isSearchPage={false}
                buttonFunction={() => useNavigateToSupport("report")}
              />
            </View>
          )}
          refreshControl={<RefreshControl refreshing={refreshing} tintColor="#ff9c01" colors={['#ff9c01', '#ff9c01', '#ff9c01']} onRefresh={onRefresh} />}
          ListFooterComponent={() =>
            showLoadMore ? (
              <View className="px-4 justify-center pb-4 -mt-5 flex-row items-center gap-2">
                <Text className="text-oBlack dark:text-white font-psemibold text-sm">Ju lutem prisni...</Text>
                <ActivityIndicator color={"#FF9C01"} size={24} />
              </View>
            ) : null
          }
        />
        


      <StatusBar translucent backgroundColor="transparent" style={`${colorScheme === 'light' ? "dark" : "light"}`}/>
      </View>
      
    )
  }

  
}

export default Home