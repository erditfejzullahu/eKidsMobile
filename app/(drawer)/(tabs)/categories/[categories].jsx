import { View, Text, Image, ScrollView, RefreshControl, FlatList } from 'react-native'
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

  const {user} = useGlobalContext(); //show category information no matter what
  
  const searchFunction = async (searchData, sortData) => {
    
    setSortingData({...sortingData, searchData: searchData})
    setRefreshing(true)
    try {
      
      const response = (categories === 'all' || categories === undefined)
        ? await fetchCategories(searchData || sortingData.searchData, sortData)
        : await fetchCategory(categories, searchData || sortingData.searchData, sortData)
      setAllData(response)
    } catch (error) {
      console.error(error);
      setAllData([])
    } finally {
      setRefreshing(false)
    }
  }
  
  const updateSearchData = (data) => {
    setSortingData((prevData) => ({
      ...prevData,
      searchParam: data
    }))
  }
  
  const onRefresh = async () => {
    setSortingData((prevData) => ({
      ...prevData,
      pageNumber: 1,
      pageSize: 15,
      sortByName: '',
      sortNameOrder: '',
      sortByDate: '',
      sortDateOrder: '',
      sortByPopular: '',
      sortPopularOrder: '',
      categoryId: categories || "",
      searchParam: ''
    }))
    await getCategories()
  }

  const getCategories = async () => {
    // console.log(categories, 'asdasdasd');
    
    setRefreshing(true)
    try {
      const response = (categories === 'all' || categories === undefined)
        ? await fetchCategories(sortingData)
        : await fetchCategory(sortingData)
        
        if(categories === 'all' || categories === undefined){
          setAllData((prevData) => {
            const existingIds = new Set(prevData.map((categories) => categories.CategoryID))
            const removeDups = response.filter((category) => !existingIds.has(category.CategoryID))
            return [...prevData, ...removeDups]
          });
        }else{
          setAllData(response);
          console.log(response);
          
        }
        
    } catch (error) {
      console.error(error);
      setAllData([])
    } finally {
      setRefreshing(false)
    }
  }

  const sortCategories = (data) => {
    setFilterData((prev) => ({
      ...prev,
      sortByName: (categories === "all" || categories === undefined) ? data.emri != null && "CategoryName" : data.emri != null && "CourseName",
      sortNameOrder: data.emri,
      sortByDate: data.data != null && "CreatedAt",
      sortDateOrder: data.data,
      sortByPopular: data.shikime != null && "ViewCount",
      sortPopularOrder: data.shikime
    }))
  }


  useEffect(() => {
    getCategories();
  }, [sortingData])
  

  // useEffect(() => {
  //   console.log(categories, " categorieseasd");
    
  //   getCategories()
  // }, [])
  

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
  
  if(refreshing){
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
            data={allData}
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
              <View className="mb-4"></View>
              // <CustomButton 
              //   title={"Më shumë kategori"}
              //   containerStyles={"mt-5 mb-5 mx-4"}
              // />
            )}
            refreshControl={<RefreshControl refreshing={refreshing} tintColor="#ff9c01" colors={['#ff9c01', '#ff9c01', '#ff9c01']} onRefresh={onRefresh} />}
          />
          :
          <FlatList 
          className="h-full"
            data={allData || []}
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
              <View className="mb-4"></View>
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