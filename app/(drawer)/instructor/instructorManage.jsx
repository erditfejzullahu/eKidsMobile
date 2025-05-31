import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import DefaultHeader from '../../../components/DefaultHeader'
import { Platform } from 'react-native'
import { icons, images } from '../../../constants'
import * as Animatable from "react-native-animatable"
import ManageTypesDialog from '../../../components/ManageTypesDialog'
import useFetchFunction from '../../../hooks/useFetchFunction'
import { GetInstructorManageTypeData } from '../../../services/fetchingService'
import Loading from '../../../components/Loading'
import EmptyState from '../../../components/EmptyState'
import OnlineClassesCard from '../../../components/OnlineClassesCard'
import { useGlobalContext } from '../../../context/GlobalProvider'
import MeetingCardComponent from '../../../components/MeetingCardComponent'
import { useNavigateToSupport } from '../../../hooks/goToSupportType'
import SorterComponent from '../../../components/SorterComponent'
import { initialFilterData } from '../../../services/filterConfig'
import { useRouter } from 'expo-router'
import { useRole } from '../../../navigation/RoleProvider'
import StudentsItemComponent from '../../../components/StudentsItemComponent'

const InstructorManage = () => {
    const router = useRouter();
    const {role, isLoading: roleLoading} = useRole();
    useEffect(() => {
    if(!roleLoading && !['Instructor', 'Admin'].includes(role)){
        router.replace("/home")
    }
    }, [role])
    const {user, isLoading} = useGlobalContext();
    const [manageType, setManageType] = useState("Kurseve") //Courses = 0, Students = 1, Meetings = 2
    const [filterData, setFilterData] = useState({
        ...initialFilterData
    })
    const {data, isLoading: manageLoading, refetch} = useFetchFunction(() => GetInstructorManageTypeData(manageType === "Kurseve" ? 0 : manageType === "Studenteve" ? 1 : manageType === "Takimeve" ? 2 : {}, filterData))
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [manageData, setManageData] = useState([])

    const [loadedFirst, setLoadedFirst] = useState(false)
    const [moreLoading, setMoreLoading] = useState(false)

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
        sortViewOrder: data.shikime
        }))
    }

    const loadMore = () => {
        if(!manageData?.hasMore || moreLoading) return;
        setMoreLoading(true)
        setFilterData((prev) => ({
            ...prev,
            pageNumber: prev.pageNumber + 1
        }))
    }

    useEffect(() => {
      if(manageData?.data?.length > 0){
        setLoadedFirst(true)
      }
    }, [manageData])
    

    useEffect(() => {
        console.log(data, ' asdasd');
        
      if(data){
        if(filterData.pageNumber > 1){
            setManageData((prev) => ({
                ...prev,
                data: [...prev.data, ...data.data],
                hasMore: data.hasMore
            }))
        }else{
            setManageData(data)
        }
        setMoreLoading(false)
      }else{
        setManageData([])
        setMoreLoading(false)
      }
    }, [data])
    

    useEffect(() => {
      refetch()      
    }, [manageType])

    if((isLoading || isRefreshing || manageLoading) && !loadedFirst) return <Loading />
  return (
    <View className="flex-1">
    <FlatList 
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        className="h-full bg-primary"
        style={styles.box}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        contentContainerStyle={{paddingLeft: 16, paddingRight: 16, gap: 24}}
        data={manageData?.data}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => {
            switch (manageType) {
                case "Kurseve":
                    return <OnlineClassesCard userCategories={user?.data?.categories} classes={item} managePlace={true}/>
                case "Studenteve":
                    return <StudentsItemComponent currentUserData={user} item={item}/>
                case "Takimeve":
                    return <MeetingCardComponent item={item} managePlace={true}/>
                default:
                    break;
            }
        }}
        ListEmptyComponent={() => (
            <View className="border border-black-200 bg-oBlack " style={styles.box}>
                <EmptyState 
                    title={`Nuk u gjet asnje ${manageType === "Kurseve" ? "e dhene e ndonje Kursi" : manageType === "Studenteve" ? "e dhene Studentore" : manageType === "Takimeve" ? "e dhene e Takimeve" : "e dhene"}`}
                    subtitle={"Nese mendoni qe eshte gabim, rifreskoni dritaren apo kontaktoni Panelin e Ndihmes"}
                    showButton={true}
                    isSearchPage={true}
                    buttonTitle={"Drejtohuni tek Paneli Ndihmes"}
                    buttonFunction={() => useNavigateToSupport("report")}
                />
            </View>
        )}
        ListHeaderComponent={() => (
            <>
            <View className="relative">
                <DefaultHeader
                    showBorderBottom={true} 
                    headerTitle={`Menagjimi i ${manageType}`}
                    bottomSubtitle={"Ketu mund te menaxhoni te gjithe materialin e paraqitur. Filtroni nga pulsari ne te djathte. Per cdo pakjartesi, na kontaktoni tek Paneli i Ndihmes."}
                />
                <ManageTypesDialog manageType={manageType} sendManageType={(data) => setManageType(data)}/>
                <SorterComponent showSorter={true} sortButton={handleSorter}/>
            </View>
            </>
        )}
        ListFooterComponent={() => (
            <>
            <View className="my-2" />
            <View className="justify-center -mt-2 flex-row items-center gap-2">
            {manageData?.hasMore ? (
                <>
                <Text className="text-white font-psemibold text-sm">Ju lutem prisni...</Text>
                <ActivityIndicator color={"#FF9C01"} size={24} />
                </>
                ) : (
                <>
                <Text className="text-white font-psemibold text-sm">Nuk ka me {manageType === "Kurseve" ? "kurse" : manageType === "Studenteve" ? "studente" : "takime"}...</Text>
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
    />
    </View>
  )
}

export default InstructorManage

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
  });