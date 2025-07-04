import { View, Text, FlatList, Image, TouchableOpacity, RefreshControl, StyleSheet, Platform, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../../../context/GlobalProvider'
import Loading from '../../../components/Loading';
import DefaultHeader from '../../../components/DefaultHeader';
import { icons, images } from '../../../constants';
import SorterComponent from '../../../components/SorterComponent';
import OnlineClassesCard from '../../../components/OnlineClassesCard';
import useFetchFunction from '../../../hooks/useFetchFunction';
import { GetInstructorsCourses } from '../../../services/fetchingService';
import EmptyState from "../../../components/EmptyState"
import { useRouter } from 'expo-router';
import { initialFilterData } from '../../../services/filterConfig';
import { useRole } from '../../../navigation/RoleProvider';
import { useShadowStyles } from '../../../hooks/useShadowStyles';
import { useColorScheme } from 'nativewind';

const InstructorHome = () => {
  const {shadowStyle} = useShadowStyles();
  const {colorScheme} = useColorScheme();
  const router = useRouter();
  const {role, isLoading: roleLoading} = useRole();
  useEffect(() => {
    if(!roleLoading && !['Instructor', 'Admin'].includes(role)){
      router.replace("/home")
    }
  }, [role])
  const {user, isLoading} = useGlobalContext();
  const [filterData, setFilterData] = useState({
    ...initialFilterData
  })

  const [loadedFirst, setLoadedFirst] = useState(false)
  const [moreLoading, setMoreLoading] = useState(false)

  const {data, isLoading: coursesLoading, refetch} = useFetchFunction(() => GetInstructorsCourses(filterData))
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [coursesData, setCoursesData] = useState([])
  const [openSorter, setOpenSorter] = useState(false)
  const userData = user?.data?.userData;
  // console.log(user);

  const onRefresh = async () => {
    setIsRefreshing(true)
    setLoadedFirst(false)
    setFilterData({...initialFilterData})
    await refetch();
    setIsRefreshing(false)
  }

  const handleSorter = (data) => {
    setLoadedFirst(false)
    setFilterData((prev) => ({
      ...prev,
      sortByName: data.emri != null && "Name",
      sortNameOrder: data.emri,
      sortByDate: data.data != null && "CreatedAt",
      sortDateOrder: data.data,
      sortByViews: data.shikime != null && "ViewCount",
      sortViewOrder: data.shikime,
      pageSize: data.pageSize,
    }))
  }

  useEffect(() => {
    refetch();
  }, [filterData])
  
  useEffect(() => {
    if(coursesData?.courses?.length > 0){
      setLoadedFirst(true)
    }
  }, [coursesData])

  const loadMore = () => {
    if(!coursesData.hasMore || moreLoading) return;
    setMoreLoading(true)
    setFilterData((prev) => ({
      ...prev,
      pageNumber: prev.pageNumber + 1
    }))
  }
  

  useEffect(() => {
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
      setMoreLoading(false)
    }else{
      setMoreLoading(false)
      setCoursesData([])
    }
  }, [data])
  
  if((isLoading || coursesLoading || isRefreshing) && !loadedFirst) return <Loading />
  return (
    <View className="flex-1">
      <FlatList 
        refreshControl={<RefreshControl tintColor="#ff9c01" colors={['#ff9c01', '#ff9c01', '#ff9c01']} refreshing={isRefreshing} onRefresh={onRefresh} />}
        className="h-full bg-primary-light dark:bg-primary"
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        contentContainerStyle={{paddingLeft: 16, paddingRight: 16, gap:24}}
        keyExtractor={(item) => item.id}
        data={coursesData?.courses}
        renderItem={({item}) => (
          <OnlineClassesCard classes={item} userCategories={user?.data?.categories}/>
        )}
        ListHeaderComponent={() => (
          <>
          <View className="flex-row items-center gap-2 border-b border-gray-200 dark:border-black-200">
            <View className="flex-1">
              <DefaultHeader showBorderBottom={false} headerTitle={`${userData?.firstname + " " + userData?.lastname}`} topSubtitle={"Miresevjen perseri,"} bottomSubtitle={"Ju jeni duke vepruar ne baze te rolit te instruktorit. Per cdo pakjartesi mund te kontaktoni Panelin e Ndihmes!"}/>
            </View>
            <View className="flex-[0.30] items-end">
              <Image 
                source={images.logoNew}
                className="w-24 h-24"
                resizeMode='contain'
              />
            </View>
          </View>

          <View className="mt-2 flex-row items-center justify-between">
            <Text className="font-pregular text-gray-700 dark:text-gray-100 text-lg">Kurse nga koleget tuaj</Text>
          </View>

          <View className="mt-2">
            <SorterComponent showSorter={true} sortButton={handleSorter}/>
          </View>
          </>
        )}
        ListFooterComponent={() => (
          <>
            <View className="my-2" />
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
              buttonTitle={"Krijo kurse"}
              buttonStyle={colorScheme === 'light' ? "!rounded-none !border !border-gray-200" : ""}
              buttonFunction={() => router.replace('/instructor/addCourse')}
            />
          </View>
        )}
      />
    </View>
  )
}

export default InstructorHome

const styles = StyleSheet.create({
  box: {
      ...Platform.select({
          ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.6,
              shadowRadius: 10,
            },
            android: {
              elevation: 8,
            },
      })
  },
})