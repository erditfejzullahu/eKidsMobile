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

  const [buttonLoading, setButtonLoading] = useState(false)  

  const { data: courses, refetch, isLoading } = useFetchFunction(() => fetchCourses(filterData))

  const onRefresh = async () => {
    setRefreshing(true)
    setCurrentPage(1);
    setAllCourses([]);

    setFilterData((prevData) => ({
      ...prevData,
      pageNumber: 1,
      pageSize: 15,
      sortByName: '',
      sortNameOrder: '',
      sortByDate: '',
      sortDateOrder: '',
      sortByPopular: '',
      sortPopularOrder: '',
      categoryId: '',
      searchParam: ''
    }))

    await refetch();
    setRefreshing(false)
  }

  const loadMoreCourses = () => {
    // setDontRefresh(true);
    if(!showLoadMore){
      return;
    }
    setFilterData((prevData) => ({
      ...prevData,
      pageNumber: parseInt(prevData.pageNumber) + 1
    }))
    console.log(filterData.pageNumber);
  }

  const updateFilterData = (data) => {
    setFilterData((prev) => ({
      ...prev,
      sortByName: data.emri != null && "CourseName",
      sortNameOrder: data.emri,
      sortByDate: data.data != null && "CreatedAt",
      sortDateOrder: data.data,
      sortByPopular: data.shikime != null && "ViewCount",
      sortPopularOrder: data.shikime
    }))
  }

  const searchFunction = (data) => {
    setFilterData((prevData) => ({
      ...prevData,
      searchParam: data
    }))
  }

  useEffect(() => {
    refetch();    
  }, [filterData])

  useEffect(() => {
    if(courses){
      if(showLoadMore){
        setAllCourses((prevData) => {
          if(prevData){
            const existingIds = new Set(prevData.map((course) => course.id))
            const newCourses = courses.filter((course) => !existingIds.has(course.id))
            return[...prevData, ...newCourses]
          }
        })
      }else{
        setAllCourses(courses)
      }
    }else{
      setAllCourses([])
      setShowLoadMore(false)
    }
  }, [courses])
  
  if ((isLoading || userDataLoading)) {
    return (
      <Loading />
    );
  }else{
    return (
      <View className="bg-primary h-full">
        <FlatList 
          data={allCourses}
          keyExtractor={(item) => "courses-" + item?.id}
          renderItem={({ item }) => (
            <Courses 
              courses={item}
            />
          )}
          onEndReached={loadMoreCourses}
          onEndReachedThreshold={0}
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