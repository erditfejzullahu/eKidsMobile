import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import DefaultHeader from "../../../../components/DefaultHeader"
import EmptyState from "../../../../components/EmptyState"
import { Platform } from 'react-native'
import SorterComponent from "../../../../components/SorterComponent"
import { useGlobalContext } from '../../../../context/GlobalProvider'
import useFetchFunction from '../../../../hooks/useFetchFunction'
import { initialFilterData } from '../../../../services/filterConfig'
import { images } from '../../../../constants'
import Loading from '../../../../components/Loading'
import OnlineClassesCard from "../../../../components/OnlineClassesCard"

const TutorCourses = () => {
    const {id} = useLocalSearchParams();
    const {user, isLoading} = useGlobalContext();
    const [coursesData, setCoursesData] = useState([])
    const {data, isLoading: courseLoading, refetch} = useFetchFunction(() => {});
    const userData = user?.data?.userData;
    const [loadedFirst, setLoadedFirst] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const [filterData, setFilterData] = useState({...initialFilterData})

    const onRefresh = async () => {
        setIsRefreshing(true)
        setLoadedFirst(false)
        setFilterData({...initialFilterData})
        await refetch();
        setIsRefreshing(false)
    }

    const loadMore = () => {
        if(!coursesData?.hasMore || loadingMore) return;
        setLoadingMore(true)
        setFilterData((prev) => ({
            ...prev,
            pageNumber: prev.pageNumber + 1
        }))
    }

    const handleSorter = async (data) => {
        setLoadedFirst(false)
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
      refetch()
    }, [filterData])
    

    useEffect(() => {
      if(coursesData?.courses?.length > 0){
        setLoadedFirst(true)
      }
    }, [coursesData])
    
    useEffect(() => {
      if(data){
        if(filterData.pageNumber > 1){
            setCoursesData((prev) => ({
                ...prev,
                courses: [...prev.courses, ...data.courses],
                hasMore: data.hasMore,
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
    
if((isLoading || courseLoading) && !loadedFirst) return <Loading />
  return (
    <View className="flex-1">
        <FlatList 
            className="h-full bg-primary px-4"
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
            onEndReached={loadMore}
            onEndReachedThreshold={0.1}
            data={[]}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => (
                <OnlineClassesCard classes={item} userCategories={user?.data?.categories}/>
            )}
            ListHeaderComponent={() => (
                <>
                <DefaultHeader headerTitle={`Kurset e {personit}`} showBorderBottom={true} bottomSubtitle={"Shfrytezoni rubrikat perkatese per te naviguar dhe ndervepruar me kurset e paraqitura me poshte"}/>
                <SorterComponent 
                    showSorter={true}
                    sortButton={(data) => handleSorter(data)}
                />
                </>
            )}
            ListEmptyComponent={() => (
                <View className="bg-oBlack border border-black-200 pt-3 mt-4" styles={styles.box}>
                    <EmptyState 
                        title={"Nuk ka kurse te krijuara"}
                        titleStyle={"!font-plight"}
                        subtitle={"Nuk ka kurse te krijuara ende nga {personi}. Mund ta kontaktoni permes butonit me poshte"}
                        subtitleStyle={"!font-plight"}
                        buttonTitle={"Kontaktoje"}
                        isBookMarkPage
                        buttonFunction={() => {}}
                    />
                </View>
            )}
            ListFooterComponent={() => (
                <>
                    <View className="mb-2" />
                    {coursesData?.length > 0 && (
                        <View className="justify-center -mt-2 flex-row items-center gap-2">
                        {coursesData?.hasMore ? (
                            <>
                            <Text className="text-white font-psemibold text-sm">Ju lutem prisni...</Text>
                            <ActivityIndicator color={"#FF9C01"} size={24} />
                            </>
                            ) : (
                            <>
                            <Text className="text-white font-psemibold text-sm">Nuk ka me kurse...</Text>
                            <Image
                                source={images.breakHeart}
                                className="size-5"
                                tintColor={"#FF9C01"}
                                resizeMode='contain'
                            />
                            </>
                        )}
                        </View>
                    )}
                </>
            )}
        />
    </View>
  )
}

export default TutorCourses

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