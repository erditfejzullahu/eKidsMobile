import { View, Text, ScrollView, RefreshControl, Image, Platform, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import useFetchFunction from '../../../../hooks/useFetchFunction'
import { useGlobalContext} from '../../../../context/GlobalProvider'
import Loading from '../../../../components/Loading'
import { images } from '../../../../constants'
import { StyleSheet } from 'react-native'
import { getCompletedCourseDetails, getCourseCategories } from '../../../../services/fetchingService'
import FormField from '../../../../components/FormField'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CustomButton from '../../../../components/CustomButton'
import apiClient from '../../../../services/apiClient'
import NotifierComponent from '../../../../components/NotifierComponent'

const course = () => {
    const {course} = useLocalSearchParams();
    const {user, isLoading} = useGlobalContext();
    const [refreshing, setRefreshing] = useState(false)
    const [completeData, setCompleteData] = useState(null)
    const [showTestimonialInput, setShowTestimonialInput] = useState(false)

    const [testimonialValue, setTestimonialValue] = useState(null)
    

    const {data, refetch, isLoading: completeLoading} = useFetchFunction(() => getCompletedCourseDetails(course))

    const date = new Date(completeData?.createdAt);
    const formattedDate = date.toLocaleDateString('sq-AL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    
    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    }

    const {showNotification: successNotifier} = NotifierComponent({
        title: "Veprimi u krye me sukses!",
        description: "Deshmia u dergua me sukses... Ne shkarkim do paraqitet edhe deshmia juaj, dhe poashtu mund te perdoret nga ana jone!"
    })

    const {showNotification: errorNotifier} = NotifierComponent({
        title: "Dicka shkoi gabim!",
        description: "Ju lutem provoni perseri apo kontaktoni Panelin e Ndihmes!",
        alertType: "warning"
    })

    const sendTestimonial = async () => {
        try {
            const response = await apiClient.patch(`/api/CourseCompleted/${completeData?.id}/${completeData?.userId}`, testimonialValue, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(response.status === 200){
                successNotifier();
                await refetch();
            }
        } catch (error) {
            console.log(error);
            errorNotifier();
        }
        console.log(testimonialValue);
        
    }

    useEffect(() => {
      setCompleteData(null);
      refetch();
    }, [course])
    

    useEffect(() => {
      if(data){
        console.log(data);
        
        setCompleteData(data);
      }
    }, [data])
    

    if(isLoading && completeLoading){
        return (
            <Loading/>
        )
    }else{
        return (
            <KeyboardAwareScrollView
                className="h-full bg-primary p-4"
                
                refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ff9c01" colors={['#ff9c01', '#ff9c01', '#ff9c01']} />}
            >
                <View className="border border-black-200" style={styles.box}>
                    <View className="p-4 bg-oBlack">
                        <Text className="text-white uppercase font-pbold text-center text-xl">CERTIFIKATË e Pjesëmarrjes dhe Përfundimit të Kursit</Text>
                    </View>
                    <View className="flex-1 mt-2">
                        <Image 
                            source={images.rewardXl}
                            className="m-auto w-[100px] h-[100px]"
                            resizeMode='contain'
                            tintColor={"#FF9C01"}
                        />
                    </View>
                    <View className="mt-2 bg-oBlack p-4">
                        <Text className="text-white font-pregular text-sm text-center">Kjo certifikatë i lëshohet: <Text className="text-secondary font-psemibold underline">{user?.data?.userData?.firstname} {user?.data?.userData?.lastname}</Text> si deshmi te perfundimit me sukses te kursit:</Text>
                        <Text className="text-secondary uppercase font-pblack underline mt-2 text-center text-3xl">{completeData?.course?.courseName}</Text>
                    </View>
                    <View className="p-4">
                        <Text className="text-white text-sm italic" style={{fontStyle: "italic"}}>"Gjatë kursit, studenti ka demonstruar angazhim, njohuri dhe aftësi të shkëlqyera në temat përkatëse dhe është vlerësuar pozitivisht për përformancën e tij."</Text>
                    </View>
                    <View className="p-4 bg-oBlack flex-row justify-between border-b border-black-200">
                        <View className="flex-1">
                            <Text className="text-white font-pregular text-sm text-left">Kategoria:</Text>
                            <Text className="text-secondary uppercase font-pblack underline text-left text-base">{getCourseCategories(user?.data?.categories, completeData?.course?.courseCategory)}</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-pregular text-sm text-right">Data e perfundimit:</Text>
                            <Text className="text-secondary uppercase font-pblack underline text-right text-base">{formattedDate}</Text>
                        </View>
                    </View>
                    <View className="p-4 bg-oBlack">
                        <Text className="text-white text-xs italic">
                            Kjo certifikatë është lëshuar nga
                            <Text className="text-secondary font-bold"> ShokuMesimit </Text>,
                            një kompani e fuqizuar nga
                            <Text className="text-secondary font-bold"> Murrizi .Co </Text>.
                        </Text>
                    </View>
                </View>

                <View className="flex-row justify-between p-4 mt-2">
                    {(completeData?.testimonial === null) && <View className="flex-1 items-start" style={styles.box}>
                        <TouchableOpacity 
                            className="bg-oBlack p-6 py-2 rounded-[3px]"
                            onPress={() => setShowTestimonialInput(!showTestimonialInput)}
                            >
                            <Text className="text-white font-psemibold">Shkruaj deshmi</Text>
                        </TouchableOpacity>
                    </View>}
                    <View className="flex-1 items-end" style={styles.box}>
                        <TouchableOpacity className="bg-secondary p-6 py-2 rounded-[3px]">
                            <Text className="text-white font-psemibold">Shkarko</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {(completeData?.testimonial === null && showTestimonialInput) && <View>
                    <FormField 
                        title={"Shkruani ketu deshmine tuaj!"}
                        placeholder={"Gjate ketij kursi mesova ne lidhje me ..."}
                        otherStyles={"mt-2 mb-6"}
                        handleChangeText={(e) => setTestimonialValue(e)}
                        value={testimonialValue}
                    />
                    <CustomButton 
                        title={"Dergo deshmine"}
                        containerStyles={"!mb-4"}
                        handlePress={sendTestimonial}
                    />
                </View>}
            </KeyboardAwareScrollView>
        )
    }
}

const styles = StyleSheet.create({
    box: {
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.6,
                shadowRadius: 10,
              },
              android: {
                elevation: 8,
              },
        })
    },
  })

export default course