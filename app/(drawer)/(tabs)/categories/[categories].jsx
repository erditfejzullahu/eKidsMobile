import { View, Text, Image, ScrollView, RefreshControl, FlatList, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useGlobalSearchParams, useLocalSearchParams } from 'expo-router'
import { getCourseCategories } from '../../../../services/fetchingService';
import { images, icons } from '../../../../constants';
import Loading from '../../../../components/Loading';
import FilteredCourses from '../../../../components/FilteredCourses';
import AllCategories from '../../../../components/AllCategories';
import { fetchCategories, fetchCategory } from '../../../../services/fetchingService';
import SearchInput from '../../../../components/SearchInput';
import EmptyState from '../../../../components/EmptyState';
import CustomButton from '../../../../components/CustomButton';
import { useFocusEffect } from 'expo-router';
import {useGlobalContext} from '../../../../context/GlobalProvider'
import SorterComponent from '../../../../components/SorterComponent'
import { initialFilterData } from '../../../../services/filterConfig';
import { useNavigateToSupport } from '../../../../hooks/goToSupportType';

const Categories = () => {
  const { categories } = useLocalSearchParams();
  const [showAllCategories, setShowAllCategories] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [allData, setAllData] = useState([])
  const [sortingData, setSortingData] = useState({
    ...initialFilterData,
    categoryId: categories,
    searchParam: '',
  })
  const [loadedFirst, setLoadedFirst] = useState(false)
  const [showLoadingMore, setShowLoadingMore] = useState(false)

  const {user} = useGlobalContext(); //show category information no matter what
  
  const updateSearchData = (data) => {
    setSortingData((prevData) => ({
      ...prevData,
      searchParam: data
    }))
  }
  
  const onRefresh = async () => {
    setLoadedFirst(false)
    setAllData([])
    setSortingData((prevData) => ({
      ...prevData,
      pageNumber: 1,
      pageSize: 15,
      sortByName: '',
      sortNameOrder: '',
      sortByDate: '',
      sortDateOrder: '',
      sortByViews: '',
      sortViewOrder: '',
      categoryId: categories || "",
      searchParam: ''
    }))
    await getCategories()
  }

  const getCategories = async () => {
    setRefreshing(true)
    try {
      const response = (categories === 'all' || categories === undefined)
        ? await fetchCategories(sortingData)
        : await fetchCategory(sortingData)
        
        setLoadedFirst(true)
        console.log(response, ' asdasdasd');
        console.log(sortingData, ' sorting');
        
        if(sortingData.pageNumber > 1){
          setAllData((prev) => {
            if(showAllCategories){
              return {
                ...prev,
                categories: [...prev.categories, ...response.categories],
                hasMore: response.hasMore
              }
            }else{
              return {
                ...prev,
                courses: [...prev.courses, ...response.courses],
                hasMore: response.hasMore
              }
            }
          })
        }else{
          setAllData(response)
        }
        
    } catch (error) {
      console.error(error);
      setAllData([])
    } finally {
      setShowLoadingMore(false)
      setRefreshing(false)
    }
  }

  const loadMore = () => {
    if(!allData.hasMore || showLoadingMore) return;
    setShowLoadingMore(true)
    setSortingData((prev) => ({
      ...prev,
      pageNumber: prev.pageNumber + 1
    }))
  }

  const sortCategories = (data) => {
    setLoadedFirst(false)
    setSortingData((prev) => ({
      ...prev,
      sortByName: (categories === "all" || categories === undefined) ? data.emri != null && "CategoryName" : data.emri != null && "CourseName",
      sortNameOrder: data.emri,
      sortByDate: data.data != null && "CreatedAt",
      sortDateOrder: data.data,
      sortByViews: data.shikime != null && "ViewCount",
      sortViewOrder: data.shikime,
      pageSize: data.pageSize,
    }))
  }


  useEffect(() => {
    getCategories();
  }, [sortingData])

  useFocusEffect(
    useCallback(() => {
      if (categories === 'all' || categories === undefined) {
        setShowAllCategories(true)
      }else{
        setShowAllCategories(false)
      }
    }, [categories])
  )

  useEffect(() => {
    if(allData.length > 0){
      setLoadedFirst(true)
    }
  }, [allData])
  

  useEffect(() => {
    getCategories();
  }, [categories]);


  const catHeader = () => {
    return (
      <View className="px-4">
          <Text className="text-white font-pmedium text-2xl mt-4">
            {showAllCategories ? "Të gjitha kategoritë" : `Të gjitha kurset për kategorinë ${getCourseCategories(user?.data?.categories, parseInt(categories))}`}
            <View>
              <Image
                source={images.path}
                resizeMode="contain"
                className="h-auto w-[100px] absolute -bottom-8 -left-12"
              />
            </View>
          </Text>
          <View className="mt-6 pb-5 border-b border-black-200">
            <SearchInput 
                // value={searchInput.searchData}
                searchFunc={updateSearchData}
                placeholder={"Shkruani këtu kategorinë tuaj të dëshiruar"}
                keyboardType="email-address"
                valueData={sortingData.searchData}
            />
          </View>
          <View className="mt-6 overflow-hidden">
            <SorterComponent 
              showSorter={true}
              sortButton={sortCategories}
            />
          </View>
        </View>
    )
  }
  
  if(refreshing && !loadedFirst){
    return (
      <Loading />
    )
  }else{
    return (
      <View className="bg-primary h-full">
        <View>
          {showAllCategories ? 
          <FlatList 
            className="h-full"
            onEndReached={loadMore}
            onEndReachedThreshold={0.1}
            data={allData.categories}
            keyExtractor={(item) => item?.CategoryID?.toString()}
            renderItem={({ item }) => (
              <AllCategories
                userCategories={item}
              />
            )}
            ListHeaderComponent={() => (
              catHeader()
            )}
            ListEmptyComponent={() => (
              <View className="mt-6">
                <EmptyState 
                  title={"Nuk është gjetur ndonjë kategori"}
                  subtitle={"Nëse problemi vazhdon të shfaqet, bëni paraqitjen e rastit tek Seksioni i Ndihmës"}
                  buttonTitle={"Vazhdoni me veprimin!"}
                  buttonFunction={() => useNavigateToSupport("report")}
                  isSearchPage={false}
                />
              </View>
            )}
            ListFooterComponent={() => (
              <>
              {!showLoadingMore && <View className="my-4" />}
              {showLoadingMore && (
                <View className="px-4 justify-center py-4 flex-row items-center gap-2">
                  <Text className="text-white font-psemibold text-sm">Ju lutem prisni...</Text>
                  <ActivityIndicator color={"#FF9C01"} size={24} />
                </View>
              )}
              </>
            )}
            refreshControl={<RefreshControl refreshing={refreshing} tintColor="#ff9c01" colors={['#ff9c01', '#ff9c01', '#ff9c01']} onRefresh={onRefresh} />}
          />
          :
          <FlatList 
            className="h-full"
            onEndReached={loadMore}
            onEndReachedThreshold={0.1}
            data={allData.courses || []}
            keyExtractor={(item) => item?.id.toString() || ''}
            renderItem={({item}) => (
              <FilteredCourses 
                userCourses={item}
              />
            )}
            ListHeaderComponent={()=> (
              catHeader()
            )}
            ListEmptyComponent={() => (
              <View className="mt-6">
              <EmptyState 
                title={"Nuk është gjetur ndonje kurs mesimor"}
                subtitle={"Nëse problemi vazhdon të shfaqet, bëni paraqitjen e rastit tek Seksioni i Ndihmës"}
                buttonTitle={"Vazhdoni me veprimin!"}
                buttonFunction={() => useNavigateToSupport("report")}
                isSearchPage={false}
              />
              </View>
            )}
            ListFooterComponent={() => (
              <>
              {!showLoadingMore && <View className="my-4" />}
              {showLoadingMore && (
                <View className="px-4 justify-center py-4 flex-row items-center gap-2">
                  <Text className="text-white font-psemibold text-sm">Ju lutem prisni...</Text>
                  <ActivityIndicator color={"#FF9C01"} size={24} />
                </View>
              )}
              </>
            )}
            refreshControl={<RefreshControl refreshing={refreshing} tintColor="#ff9c01" colors={['#ff9c01', '#ff9c01', '#ff9c01']} onRefresh={onRefresh} />}
          />
          }
        </View>
      </View>
    )
  }
}

export default Categories