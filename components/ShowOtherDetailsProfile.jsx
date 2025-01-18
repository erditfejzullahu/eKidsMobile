import { View, Text, StyleSheet, Platform, TouchableOpacity, Image, Modal, Dimensions, ScrollView, Touchable } from 'react-native'
import React, { useEffect, useState } from 'react'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import { icons } from '../constants'
import FormField from './FormField'
import { Picker } from '@react-native-picker/picker'
import { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { getUserOtherInformations, reqUpdateUserInformation, updateUserOtherInformations } from '../services/fetchingService'
import NotifierComponent from './NotifierComponent'
import useFetchFunction from '../hooks/useFetchFunction'
import Loading from './Loading'

const ShowOtherDetailsProfile = ({userId}) => {

    const {data, isLoading, refetch} = useFetchFunction(() => getUserOtherInformations(userId))
    const [userOtherData, setUserOtherData] = useState({})

    useEffect(() => {
      if(data){
        setUserOtherData(data)
      }else{
        setUserOtherData([])
      }
    }, [data])
    

    const { width: screenWidth } = Dimensions.get('window');
    const widthForModal = screenWidth * 0.7

    const [showModals, setShowModals] = useState({
        visibility: false,
        type: "",
    })
    const [howManySections, setHowManySections] = useState({
        howManyEducation: 1,
        howManyJobs: 1,
        howManySoftSkills: 1,
    })
    const [userInformationData, setUserInformationData] = useState({
                userId: userId,
                birthDay: new Date(),
                softSkills: [],
                userEducations: [
                    {
                        place_Name: "",
                        school_Degree: '1',
                        field: "",
                        start_Year: 0,
                        end_Year: null
                    }
                ],
                userJobs: [
                    {
                        job_Place: "",
                        job_Title: "",
                        start_Year: 0,
                        end_Year: null
                    }
                ],
            })

    useEffect(() => {
      if(Object.keys(userOtherData) !== 0){
        setUserInformationData((prevData) => ({
            ...prevData,
            birthDay: new Date(userOtherData.birthday),
            softSkills: typeof userOtherData.softSkills === 'string' ? JSON.parse(userOtherData.softSkills) : userOtherData.softSkills,
            userEducations: userOtherData.userEducations,
            userJobs: userOtherData.userJobs
        }))        
      }
    }, [userOtherData])
    
    
    const arrangeData = (text, type, index) => {
        setUserInformationData(prevData => {
            const updatedUserEducations = [...prevData.userEducations]
            const updatedUserJobs = [...prevData.userJobs]
            const updatedSoftSkills = [...prevData.softSkills]

            if(!updatedUserEducations[index]){
                updatedUserEducations[index] = {
                    place_Name: "",
                    school_Degree: "1",
                    field: "",
                    start_Year: 0,
                    end_Year: 0,
                }
            }
            if(!updatedUserJobs[index]){
                updatedUserJobs[index] = {
                    job_Place: "",
                    job_Title: "",
                    start_Year: 0,
                    end_Year: 0
                }
            }

            if(type === "emri"){
                updatedUserEducations[index].place_Name = text;            
            }else if(type === "drejtimi"){
                updatedUserEducations[index].field = text
            }else if(type === "mbaruat"){
                updatedUserEducations[index].end_Year = text;
            }else if(type === "filluat"){
                updatedUserEducations[index].start_Year = text;
            }else if(type === 'niveli'){
                updatedUserEducations[index].school_Degree = parseInt(text);
            }else if(type === "emri_punes"){
                updatedUserJobs[index].job_Place = text;
            }else if(type === "titulli_punes"){
                updatedUserJobs[index].job_Title = text;
            }else if(type === "filluat_punen"){
                updatedUserJobs[index].start_Year = text;
            }else if(type === "mbaruat_punen"){
                updatedUserJobs[index].end_Year = text;
            }else if(type === "aftesi_buta"){
                updatedSoftSkills[index].soft_Skill = text;
            }
            // console.log(updatedUserEducations);
            
            return {
                ...prevData,
                userEducations: updatedUserEducations,
            }
        })
    }

    const removeSpecificIndex = (index) => {
        if(showModals.type === "education"){
            setUserInformationData((prevData) => ({
                ...prevData,
                userEducations: prevData.userEducations.filter((_, idx) => idx !== index)
            }));
            setHowManySections((prevValue) => ({
                ...prevValue,
                howManyEducation: prevValue.howManyEducation - 1
            }))
        }else if(showModals.type === "jobs"){
            setUserInformationData((prevData) => ({
                ...prevData,
                userJobs: prevData.userJobs.filter((_, idx) => idx !== index)
            }))
            setHowManySections((prevValue) => ({
                ...prevValue,
                howManyJobs: prevValue.howManyJobs - 1
            }))
        }else{
            setUserInformationData((prevData) => ({
                ...prevData,
                softSkills: prevData.softSkills.filter((_, idx) => idx !== index)
            }))
            setHowManySections((prevValue) => ({
                ...prevValue,
                howManySoftSkills: prevValue.howManySoftSkills - 1
            }))
        }
    }

    const {showNotification: successUpdate} = NotifierComponent({
        title: "Sapo perditesuat te dhenat tuaja me sukses!"
    })

    const {showNotification: unsuccessfulUpdate} = NotifierComponent({
        title: "Dicka shkoi gabim!",
        description: "Ju lutem provoni perseri apo kontaktoni Panelin e Ndihmes!",
        alertType: "warning"
    })

    const {showNotification: fillFields} = NotifierComponent({
        title: "Ju lutem mbushini te gjitha fushat!",
        alertType: "warning"
    })

    const [showInformationStepTick, setShowInformationStepTick] = useState({
        education: false,
        softSkills: false,
        jobs: false
    })

    const checkIfDataValid = (type) => {
        if(type === "education"){
            if(userInformationData.userEducations.every((education) => {
                return (
                    education.place_Name.trim() !== "" &&
                    education.school_Degree > 0 &&
                    education.field.trim() !== "" &&
                    (education.start_Year.toString().trim() !== "" || parseInt(education.start_Year) > 1930) &&
                    (education.end_Year === null || parseInt(education.end_Year) > 1930)
                )
            })){
                setShowModals({visibility: false, type: ""})
                setShowInformationStepTick((prevData) => ({
                    ...prevData,
                    education: true
                }))
            }else{
                fillFields()
            }
        }else if(type === "jobs"){
            if(userInformationData.userJobs.every((jobs) => {
                return (
                    jobs.job_Place.trim() !== "" &&
                    jobs.job_Title.trim() !== "" &&
                    (jobs.start_Year.toString().trim() !== "" || parseInt(jobs.start_Year) > 1930) &&
                    (jobs.end_Year === null || parseInt(jobs.end_Year) > 1930)
                )
            })){
                setShowModals({visibility: false, type: ""})
                setShowInformationStepTick((prevData) => ({
                    ...prevData,
                    jobs: true
                }))
            }else{
                fillFields()
            }
        }else if(type === "softSkills"){
            if(userInformationData.softSkills.length > 0){
                setShowModals({visibility: false, type: ""})
                setShowInformationStepTick((prevData) => ({
                    ...prevData,
                    softSkills: true
                }))
            }else{
                fillFields()
            }
        }
    }

    const updateInformations = async () => {
        if(userOtherData && Object.keys(userOtherData).length !== 0){            
            const birthday = userInformationData.birthDay;
            const formattedDate = birthday.toISOString().split("T")[0];
            console.log(formattedDate);
            
            const updatedUserInformation = {
                ...userInformationData,
                softSkills: JSON.stringify(userInformationData.softSkills),
                birthDay: formattedDate
            }
            const response = await updateUserOtherInformations(userOtherData?.id, updatedUserInformation);
            if(response === 200){
                await refetch();
            }else{
                unsuccessfulUpdate()
            }
        }else{
            if(showInformationStepTick.education === true && showInformationStepTick.jobs === true && showInformationStepTick.softSkills){

                const birthday = userInformationData.birthDay;
                const formattedDate = birthday.toISOString().split("T")[0];
                const updatedData = {
                    ...userInformationData,
                    softSkills: JSON.stringify(userInformationData.softSkills),
                    birthday: formattedDate
                }
                
                const response = await reqUpdateUserInformation(updatedData);
                if(response === 200){
                    successUpdate()
                }else{
                    unsuccessfulUpdate()
                }
            }else{
                fillFields()
            }
        }
    }

    // useEffect(() => {
    //     console.log(showModals.type);
    //     console.log(howManySections, ' ??');
        
    // }, [showModals.type, howManySections]);    

    
    const handleChangeDate = (event, date) => {
        if(date){
            setUserInformationData((prevData) => ({
                ...prevData,
                birthDay: date
            }))
        }
    }

    const clearData = (type) => {
        if(userOtherData && Object.keys(userOtherData).length === 0){
            setUserInformationData((prevData) => {
                if(type === "education"){
                    return {
                        ...prevData,
                        userEducations: [
                            {
                                place_Name: "",
                                school_Degree: '1',
                                field: "",
                                start_Year: 0,
                                end_Year: null
                            }
                        ]
                    }
                }else if(type === "softSkills"){
                    return {
                        ...prevData,
                        softSkills: []
                    }
                }else if(type === "jobs"){
                    return {
                        ...prevData,
                        userJobs: [
                            {
                                job_Place: "",
                                job_Title: "",
                                start_Year: 0,
                                end_Year: null
                            }
                        ]
                    }
                }
            })
        }
        setShowModals({visibility: false, type: ""})
    }
    
if(isLoading) return (<View className="mt-6 flex-1 border border-black-200 rounded-[5px] mx-4 p-4"><Loading /></View>)
  return (
    <>

    <View className="m-4 p-4 bg-oBlack border border-black-200 rounded-[10px]">
      <View>
        <View className="gap-2 border-b border-black-200 pb-4" style={styles.box}>
            <Text className="text-white text-sm">Data e lindjes</Text>
            <View className="border border-black-200 bg-oBlack self-start rounded-[10px] overflow-hidden" >
                <RNDateTimePicker
                    style={{marginLeft: -15}}
                    display="default"
                    onChange={handleChangeDate}
                    value={userInformationData.birthDay}
                    maximumDate={new Date()}
                />
            </View>
        </View>
        <View className="gap-2 border-b border-black-200 py-4">
            <View className="flex-row">
                <Text className="text-white text-sm">Edukimi shkollor</Text>
                {showInformationStepTick.education && <Image 
                    source={icons.tick}
                    className="w-6 h-6"
                    tintColor={"#ff9c01"}
                />}
            </View>
            <TouchableOpacity onPress={() => setShowModals({visibility: true, type: "education"})} className="flex-1 bg-secondary items-center justify-center p-1.5 rounded-[10px]" style={styles.box}>
                <Image 
                    source={icons.plus}
                    className="h-10 border-2 border-secondary-100  rounded-full w-10"
                    tintColor={"#fff"}
                />
            </TouchableOpacity>
        </View>
        <View className="gap-2 border-b border-black-200 py-4">
            <View className="flex-row">
                <Text className="text-white text-sm">Aftesi te buta</Text>
                {showInformationStepTick.softSkills && <Image 
                    source={icons.tick}
                    className="w-6 h-6"
                    tintColor={"#ff9c01"}
                />}
            </View>
            <TouchableOpacity onPress={() => setShowModals({visibility: true, type: "softSkills"})} className="flex-1 bg-secondary items-center justify-center p-1.5 rounded-[10px]" style={styles.box}>
                <Image 
                    source={icons.plus}
                    className="h-10 border-2 border-secondary-100  rounded-full w-10"
                    tintColor={"#fff"}
                />
            </TouchableOpacity>
        </View>
        <View className="gap-2 border-b border-black-200 pt-4">
            <View className="flex-row">
                <Text className="text-white text-sm">Punesimi</Text>
                {showInformationStepTick.jobs && <Image 
                    source={icons.tick}
                    className="w-6 h-6"
                    tintColor={"#ff9c01"}
                />}
            </View>
            <TouchableOpacity onPress={() => setShowModals({visibility: true, type: "jobs"})} className="flex-1 bg-secondary items-center justify-center p-1.5 rounded-[10px]" style={styles.box}>
                <Image 
                    source={icons.plus}
                    className="h-10 border-2 border-secondary-100  rounded-full w-10"
                    tintColor={"#fff"}
                />
            </TouchableOpacity>
        </View>
        <View className="my-4 bg-primary border border-black-200 rounded-[5px] overflow-hidden" style={styles.box}>
            <TouchableOpacity onPress={updateInformations}>
                <Text className="text-white font-psemibold text-center p-4">Perditeso te dhenat</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>

    <Modal
    visible={showModals.visibility}
    transparent={true}
    onRequestClose={() => setShowModals({visibility: false, type: ""})}
    animationType='fade'
    >
        <View className="flex-1 justify-center items-center" style={{backgroundColor: "rgba(0,0,0,0.4)"}}>
            <ScrollView style={styles.box} className="bg-primary p-4 rounded-[5px] border border-black-200 w-[85%] max-h-[80vh]" contentContainerStyle={{alignItems: "center"}}>
                <View className="bg-oBlack w-full p-2 rounded-t-[10px] border border-oBlack mb-3" style={styles.box}>
                    <Text className="text-white font-pregular text-center text-2xl">{showModals.type === "education" ? "Edukimi shkollor" : showModals.type === "jobs" ? "Eksperienca profesionale" : "Aftesi te buta"}</Text>
                </View>

                {[...Array(showModals.type === "education" ? howManySections.howManyEducation : showModals.type === "jobs" ? howManySections.howManyJobs : howManySections.howManySoftSkills)].map((_, index) => {
                    // console.log(index, ' indeksi');
                    // console.log(showModals);
                    const isLastIndex = 
                        index === (showModals.type === "education"
                            ? howManySections.howManyEducation - 1
                            : showModals.type === "jobs"
                            ? howManySections.howManyJobs - 1
                            : {})
                    // console.log(howManySections, ' seksionet');
                    return (
                        <View key={`informations-${index}`}>
                            <View className="w-full items-start gap-6 mt-4 border-b border-black-200 pb-4">
                                {(showModals.type === "education" || showModals.type === "jobs") &&
                                <View className="w-full gap-2">
                                <View className="flex-row gap-2 w-full">
                                    <View className="flex-1">
                                        <FormField 
                                            title={showModals.type === "education" ? "Emri shkolles" : "Vendi punes"}
                                            otherStyles={"w-full"}
                                            value={showModals.type === "education" ? userInformationData?.userEducations[index]?.place_Name : userInformationData?.userJobs[index]?.job_Place}
                                            placeholder={"Shkruani ketu emrin e shkolles, kolegjit..."}
                                            handleChangeText={showModals.type === "education" ? (e) => arrangeData(e, 'emri', index) : (e) => arrangeData(e, 'emri_punes', index)}
                                            inputParentStyle={"!h-14 !rounded-[10px] "}
                                            titleStyle={"!text-sm"}
                                        />
                                    </View>
                                    <View className="flex-[0.2]">
                                        <TouchableOpacity className="h-14 items-center justify-center rounded-[10px] border-2 border-white mt-auto bg-secondary" onPress={isLastIndex ? (showModals.type === "education" ? () => setHowManySections((prevValues) => ({...prevValues, howManyEducation: prevValues.howManyEducation + 1})) : () => setHowManySections((prevValues) => ({...prevValues, howManyJobs: prevValues.howManyJobs + 1}))) : () => removeSpecificIndex(index)}>
                                            <Image
                                                source={isLastIndex ? icons.plus : icons.close}
                                                className="h-6 w-6"
                                                tintColor={"#fff"}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {showModals.type === "education" && <View>
                                    <Text className="text-gray-100 font-pmedium text-sm">Niveli shkolles</Text>
                                    <View className="-my-4">
                                        <Picker
                                            selectedValue={userInformationData?.userEducations[index]?.school_Degree.toString()}
                                            onValueChange={(e) => arrangeData(e, 'niveli', index)}
                                            placeholder={{ label: "Zhgjidhni nivelin shkollor", value: '' }}
                                            style={[pickerSelectStyles, {width: widthForModal, height:180}]}
                                            itemStyle={{color: "#fff", fontFamily: "Poppins-Regular"}}
                                        >
                                            <Picker.Item key={1} label='Shkolla Fillore' value='1'/>
                                            <Picker.Item key={2} label='Shkolla E Mesme' value='2'/>
                                            <Picker.Item key={3} label='Fakulteti' value='3'/>
                                            <Picker.Item key={4} label='Master' value='4'/>
                                            <Picker.Item key={5} label='Trajnim' value='5'/>
                                        </Picker>
                                    </View>
                                </View>}
                                <View>
                                    <FormField 
                                        title={showModals.type === "education" ? "Drejtimi" : "Titulli i punes"}
                                        otherStyles={"w-full"}
                                        value={showModals.type === "education" ? userInformationData?.userEducations[index]?.field : userInformationData?.userJobs[index]?.job_Title}
                                        placeholder={"Shkruani ketu drejtimin tuaj..."}
                                        handleChangeText={showModals.type === "education" ? (e) => arrangeData(e, 'drejtimi', index) : (e) => arrangeData(e, 'titulli_punes', index)}
                                        inputParentStyle={"!h-14 !rounded-[10px] "}
                                        titleStyle={"!text-sm"}
                                    />
                                </View>
                                <View className="flex-row justify-between gap-2">
                                    <View className="flex-1">
                                        <FormField 
                                            title={"Filluat"}
                                            otherStyles={"w-full"}
                                            value={showModals.type === "education" ? userInformationData?.userEducations[index]?.start_Year?.toString() : userInformationData?.userJobs[index]?.start_Year?.toString()}
                                            placeholder={"2020..."}
                                            handleChangeText={showModals.type === "education" ? (e) => arrangeData(e, 'filluat', index) : (e) => arrangeData(e, "filluat_punen", index)}
                                            titleStyle={"!text-sm"}
                                            inputParentStyle={"!h-14 !rounded-[10px] "}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                    <View className="flex-1">
                                        <FormField 
                                            title={"Mbaruat"}
                                            otherStyles={"w-full"}
                                            value={showModals.type === "education" ? userInformationData?.userEducations[index]?.end_Year?.toString() : userInformationData?.userJobs[index]?.end_Year?.toString()}
                                            placeholder={"2025...Ende?"}
                                            handleChangeText={showModals.type === "education" ? (e) => arrangeData(e, 'mbaruat', index) : (e) => arrangeData(e, 'mbaruat_punen', index)}
                                            titleStyle={"!text-sm"}
                                            inputParentStyle={"!h-14 !rounded-[10px] "}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                </View>
                                </View>}

                                {showModals.type === "softSkills" && <View className="flex-row gap-2">
                                    <View className="flex-1">
                                        <FormField 
                                            title={"Aftesia " + (index + 1)}
                                            otherStyles={"w-full"}
                                            placeholder={"Shkruani ketu aftesine tuaj te bute..."}
                                            value={userInformationData?.softSkills[index] || ""}
                                            handleChangeText={(e) => {
                                                setUserInformationData((prevData) => {
                                                    const softSkillsArray = [...prevData.softSkills];
                                                    softSkillsArray[index] = e;
                                                    return {...prevData, softSkills: softSkillsArray};
                                                })
                                            }}
                                            inputParentStyle={"!h-14 !rounded-[10px]"}
                                            titleStyle={"!text-sm"}
                                        />
                                    </View>
                                    <View className="flex-[0.2]">
                                        <TouchableOpacity className="h-14 items-center justify-center rounded-[10px] border-2 border-white mt-auto bg-secondary" onPress={(index === howManySections.howManySoftSkills - 1) ? () => setHowManySections((prevValue) => ({...prevValue, howManySoftSkills: prevValue.howManySoftSkills + 1})) : () => removeSpecificIndex(index)}>
                                            <Image 
                                                source={index === howManySections.howManySoftSkills - 1 ? icons.plus : icons.close}
                                                className="h-6 w-6"
                                                tintColor={"#fff"}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>}
                            </View>
                            
                        </View>
                    )
                })}

                <View className="flex-row items-center justify-between w-full flex-wrap my-6">
                    <TouchableOpacity onPress={() => clearData(showModals.type) }
                        className="bg-oBlack border-2 border-black-200 rounded-[10px] p-3 py-4"
                        >
                        <Text className="text-white text-sm font-psemibold">Largo dritaren</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => checkIfDataValid(showModals.type)} className="bg-secondary rounded-[10px] p-3 py-4 border-2 border-white">
                        <Text className="text-white text-sm font-psemibold">Ruaj te dhenat</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    </Modal>
    </>
  )
}

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 2,
      borderColor: 'rgb(35 37 51)',
      borderRadius: 16,
      marginTop:7,
      color: 'rgba(255,255,255)',
      paddingLeft: 16,
      height:64,
      backgroundColor:'rgb(30 30 45)',
      fontWeight:'700',
    },
    inputAndroid: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 2,
      borderColor: 'rgb(35 37 51)',
      borderRadius: 16,
      marginTop:7,
      color: 'rgba(255,255,255)',
      paddingLeft: 16,
      height:64,
      backgroundColor:'rgb(30 30 45)',
      fontWeight:'700'
    },
  });

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    inner: {
      flex: 1,
      justifyContent: 'center',
      padding: 16,
    },
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
  

export default ShowOtherDetailsProfile