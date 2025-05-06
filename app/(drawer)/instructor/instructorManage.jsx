import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import DefaultHeader from '../../../components/DefaultHeader'
import { Platform } from 'react-native'
import { icons } from '../../../constants'
import * as Animatable from "react-native-animatable"
import ManageTypesDialog from '../../../components/ManageTypesDialog'
import useFetchFunction from '../../../hooks/useFetchFunction'
import { GetInstructorManageTypeData } from '../../../services/fetchingService'
import Loading from '../../../components/Loading'
import EmptyState from '../../../components/EmptyState'
import OnlineClassesCard from '../../../components/OnlineClassesCard'
import { useGlobalContext } from '../../../context/GlobalProvider'
import MeetingCardComponent from '../../../components/MeetingCardComponent'

const InstructorManage = () => {
    const {user, isLoading} = useGlobalContext();
    const [manageType, setManageType] = useState("Kurseve") //Courses = 0, Students = 1, Meetings = 2
    const {data, isLoading: manageLoading, refetch} = useFetchFunction(() => GetInstructorManageTypeData(manageType === "Kurseve" ? 0 : manageType === "Studenteve" ? 1 : manageType === "Takimeve" ? 2 : {}))
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [manageData, setManageData] = useState([])

    const onRefresh = async () => {
        setIsRefreshing(true)
        await refetch();
        setIsRefreshing(false)
    }

    useEffect(() => {
        console.log(data, ' asdasd');
        
      if(data){
        setManageData(data)
      }else{
        setManageData([])
      }
    }, [data])
    

    useEffect(() => {
      refetch()      
    }, [manageType])

    if(isLoading || isRefreshing || manageLoading) return <Loading />
  return (
    <View className="flex-1">
    <FlatList 
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        className="h-full bg-primary"
        style={styles.box}
        contentContainerStyle={{paddingLeft: 16, paddingRight: 16, gap: 24}}
        data={manageData}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => {
            switch (manageType) {
                case "Kurseve":
                    return <OnlineClassesCard userCategories={user?.data?.categories} classes={item} managePlace={true}/>
                case "Studenteve":

                    break;
                case "Takimeve":
                    return <MeetingCardComponent item={item} managePlace={true}/>
                    break;
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
                    buttonFunction={() => console.log("Drejtohu tek paneli ndihmes")}
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
                
            </View>
            </>
        )}
        ListFooterComponent={() => (
            <View className="my-4"></View>
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