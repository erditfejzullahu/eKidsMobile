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

const Home = () => {

  const [refreshing, setRefreshing] = useState(false)

  const { user, isLoading: userDataLoading } = useGlobalContext()
  const [currentPage, setCurrentPage] = useState(1)
  const [allCourses, setAllCourses] = useState([])
  const [showLoadMore, setShowLoadMore] = useState(false)

  const [showSorter, setShowSorter] = useState(false)
  // const showSorter = useRef(false)
  const [sortData, setSortData] = useState({
    emri: '',
    data: '',
    shikime: '',
  })

  const [searchData, setSearchData] = useState('')
  const userData = user?.data?.userData;
  const categories = user?.data?.categories

  const [buttonLoading, setButtonLoading] = useState(false)

  const [dontRefresh, setDontRefresh] = useState(false)
  

  const { data: courses, refetch, isLoading } = useFetchFunction(() => fetchCourses(currentPage, 5, searchData, sortData))

  const onRefresh = useCallback(async (sortParam) => {
    setRefreshing(true)
    setCurrentPage(1);
    setAllCourses([]);
    if(sortParam !== 'withParam'){
      setSortData(null)
      setSearchData("")
    }
    await refetch();
    // setShowLoadMore(true);
    setDontRefresh(false)
    setRefreshing(false)
  }, [sortData, refetch])

  const loadMoreCourses = () => {
    
    if (isLoading || currentPage >= courses?.totalPages) {
      return
    }

    if(courses?.totalPages >= currentPage){
      setDontRefresh(true);
      setCurrentPage((prevPage) => prevPage + 1);
    }
    
  }

  const updateFilterData = useCallback((data) => {
    setSortData(data)
  }, [])

  const searchFunction = (data) => {
    setSearchData(data);
  }

  useEffect(() => {
    if (sortData) { 
      onRefresh('withParam');
    }
  }, [sortData]);

  useEffect(() => {
    if(searchData){
      onRefresh('withParam')
    }
  }, [searchData])
  

  useEffect(() => {
    
    if(courses?.courses){
      // console.log(courses);
      
      setAllCourses((prevCourses) => [
        ...prevCourses,
        ...courses.courses.filter(
            (newCourse) => !prevCourses.some((prevCourse) => prevCourse.id === newCourse.id)
        )
      ]);
      // console.log("lesson changed");
    }
    if(currentPage == courses?.totalPages){
      setShowLoadMore(false);
    }else{
      setShowLoadMore(true);
    }

    setShowLoadMore(currentPage < courses?.totalPages);
  }, [courses])

  useEffect(() => {
    if(currentPage <= courses.totalPages){
      setButtonLoading(true)
      refetch();
      setButtonLoading(false)
    }

    setShowLoadMore(currentPage < courses?.totalPages);
    // console.log(currentPage, courses.totalPages);
    
  }, [currentPage])
  

  
  if (!dontRefresh && (isLoading || userDataLoading)) {
    return (
      <Loading />
    );
  }else{
    return (
      <View className="bg-primary h-full">
        <FlatList 
          data={allCourses || []}
          keyExtractor={(item) => item?.id?.toString() || ''}
          renderItem={({ item }) => (
            <Courses 
              courses={item}
            />
          )}
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
  
              <View className={`w-full flex-row justify-between ${showSorter ? "mb-2" : ""}`}>
                <Text className="text-gray-100 text-lg font-pregular">
                  Kurset mësimore të fundit
                </Text>
                <TouchableOpacity 
                  className="relative"
                  onPress={() => setShowSorter(prev => !prev)}
                  >
                  <Image 
                    resizeMode='contain'
                    className="h-8 w-8  "
                    source={icons.sort}
                    style={{tintColor: "#ff9c01"}}
                  />
                </TouchableOpacity>
              </View>

              {/* filter */}
                <SorterComponent
                  showSorter={showSorter}
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
            />
          )}
          refreshControl={<RefreshControl refreshing={refreshing} tintColor="#ff9c01" colors={['#ff9c01', '#ff9c01', '#ff9c01']} onRefresh={onRefresh} />}
          ListFooterComponent={() =>
            showLoadMore ? (
              <View className="px-4">
                <CustomButton
                  title={"Më shumë material"}
                  containerStyles={"mb-5"}
                  handlePress={loadMoreCourses}
                  isLoading={buttonLoading}
                />
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