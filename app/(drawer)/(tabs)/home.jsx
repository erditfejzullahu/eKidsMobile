import { View, Text, ScrollView, FlatList, Image, RefreshControl, ActivityIndicator } from 'react-native'
import React, {useState, useEffect, useCallback, useRef} from 'react'
import { useGlobalContext } from '../../../context/GlobalProvider'
import { images, icons } from '../../../constants'
import SearchInput from '../../../components/SearchInput'
import { StatusBar } from 'expo-status-bar'
import Courses from '../../../components/Courses'
import EmptyState from '../../../components/EmptyState'
import Sliders from '../../../components/Sliders'
import useFetchFunction from '../../../hooks/useFetchFunction'
import { fetchCourses } from '../../../services/fetchingService'
import Loading from '../../../components/Loading'
import CustomButton from '../../../components/CustomButton'
import { TouchableOpacity } from 'react-native-gesture-handler'
import SorterComponent from '../../../components/SorterComponent'
import { initialFilterData } from '../../../services/filterConfig'
import { useNavigateToSupport } from '../../../hooks/goToSupportType'

const Home = () => {

  const [refreshing, setRefreshing] = useState(false)

  const { user, isLoading: userDataLoading } = useGlobalContext()
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

  const onRefresh = async () => {
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
  }

  const loadMoreCourses = useCallback(() => {
    if(!allCourses.hasMore || showLoadMore) return;
      setShowLoadMore(true)
      setFilterData((prev) => ({
        ...prev,
        pageNumber: prev.pageNumber + 1
      }))
  }, [allCourses.courses, showLoadMore])

  const updateFilterData = (data) => {
    setLoadedFirst(false)
    setFilterData((prev) => ({
      ...prev,
      sortByName: data.emri != null && "CourseName",
      sortNameOrder: data.emri,
      sortByDate: data.data != null && "CreatedAt",
      sortDateOrder: data.data,
      sortByViews: data.shikime != null && "ViewCount",
      sortViewOrder: data.shikime
    }))
  }

  const searchFunction = (data) => {
    setLoadedFirst(false)
    setFilterData((prevData) => ({
      ...prevData,
      searchParam: data
    }))
  }
  
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
      <View className="bg-primary h-full">
        <FlatList 
          data={allCourses.courses}
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
                <Text className="font-pmedium text-sm text-gray-100">
                  Mirë se erdhët përsëri
                </Text>
                <Text className="relative text-2xl font-psemibold text-white">
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
  
              <View className="w-full flex-1 pt-6 pb-8">
                <Text className="text-gray-100 text-lg font-pregular ">
                  Të gjitha kategoritë
                </Text>
                <Sliders 
                  posts={categories || []}
                  keyID={"CategoryID"}
                  dataCategory={"categories"}
                />
              </View>
  
              <View className={`w-full flex-row justify-between mb-2`}>
                <Text className="text-gray-100 text-lg font-pregular">
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
            <EmptyState 
              title={"Nuk është gjetur ndonjë përmbajtje"}
              subtitle={"Ju lutem kontaktoni Seksionin e Ndihmës apo bëni kërkesën e krijimit të një materiali të ri mësimor të specifikuar!"}
              buttonTitle={"Vazhdoni me veprimin!"}
              isSearchPage={false}
              buttonFunction={() => useNavigateToSupport("report")}
            />
          )}
          refreshControl={<RefreshControl refreshing={refreshing} tintColor="#ff9c01" colors={['#ff9c01', '#ff9c01', '#ff9c01']} onRefresh={onRefresh} />}
          ListFooterComponent={() =>
            showLoadMore ? (
              <View className="px-4 justify-center pb-4 -mt-5 flex-row items-center gap-2">
                <Text className="text-white font-psemibold text-sm">Ju lutem prisni...</Text>
                <ActivityIndicator color={"#FF9C01"} size={24} />
              </View>
            ) : null
          }
        />
        


      <StatusBar backgroundColor='#161622' style='light'/>
      </View>
      
    )
  }

  
}

export default Home