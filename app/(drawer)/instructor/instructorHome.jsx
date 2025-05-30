import { View, Text, FlatList, Image, TouchableOpacity, RefreshControl, StyleSheet, Platform } from 'react-native'
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

const InstructorHome = () => {
  const router = useRouter();
  const {user, isLoading} = useGlobalContext();
  const [filterData, setFilterData] = useState({
    ...initialFilterData
  })
  const {data, isLoading: coursesLoading, refetch} = useFetchFunction(() => GetInstructorsCourses(filterData))
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [coursesData, setCoursesData] = useState([])
  const [openSorter, setOpenSorter] = useState(false)
  const userData = user?.data?.userData;
  // console.log(user);

  const onRefresh = async () => {
    setIsRefreshing(true)
    setFilterData({...initialFilterData})
    await refetch();
    setIsRefreshing(false)
  }

  const handleSorter = (data) => {
    setFilterData((prev) => ({
      ...prev,
      sortByName: data.emri != null && "Name",
      sortNameOrder: data.emri,
      sortByDate: data.data != null && "CreatedAt",
      sortDateOrder: data.data,
      sortByViews: data.shikime != null && "ViewCount",
      sortViewOrder: data.shikime
    }))
  }

  useEffect(() => {
    refetch();
  }, [filterData])
  

  useEffect(() => {
    console.log(data, ' data');
    
    if(data){
      setCoursesData(data)
    }else{
      setCoursesData([])
    }
  }, [data])
  
  if(isLoading || coursesLoading || isRefreshing) return <Loading />
  return (
    <View className="flex-1">
      <FlatList 
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        className="h-full bg-primary"
        contentContainerStyle={{paddingLeft: 16, paddingRight: 16, gap:24}}
        keyExtractor={(item) => item.id}
        data={coursesData}
        renderItem={({item}) => (
          <OnlineClassesCard classes={item} userCategories={user?.data?.categories}/>
        )}
        ListHeaderComponent={() => (
          <>
          <View className="flex-row items-center gap-2 border-b border-black-200">
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
            <Text className="font-pregular text-gray-100 text-lg">Kurse nga koleget tuaj</Text>
          </View>

          <View className="mt-2">
            <SorterComponent showSorter={true} sortButton={handleSorter}/>
          </View>
          </>
        )}
        ListFooterComponent={() => (
          <View className="my-2">

          </View>
        )}
        ListEmptyComponent={() => (
          <View className="bg-oBlack border border-black-200" style={styles.box}>
            <EmptyState 
              title={"Nuk ka kurse ende!"}
              subtitle={"Nese mendoni qe eshte gabim, ju lutem rifreskoni dritaren apo kontaktoni Panelin e Ndihmes"}
              isSearchPage={true}
              buttonTitle={"Krijo kurse"}
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