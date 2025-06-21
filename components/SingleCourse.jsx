import { View, Text, Image, Touchable, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import { images, icons } from '../constants';
import { TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable'
import { Link } from 'expo-router';
import NotifierComponent from './NotifierComponent';
import { bookmarkStatus, startCourseProgress, deleteBookmark, makeBookmark } from '../services/fetchingService';
import { currentUserID } from '../services/authService';
import CustomModal from './Modal';
import { useColorScheme } from 'nativewind';

const SingleCourse = ({course}) => {
    const {colorScheme} = useColorScheme();
    const [toggleContent, setToggleContent] = useState(false)
    const [courseData, setCourseData] = useState(null)
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [modalVisible, setModalVisible] = useState({visibility: false, type: null, lessonName: null})

    const date = new Date(courseData?.createdAt);
    const formattedDate = date.toLocaleDateString('sq-AL', {
        year: 'numeric',
        month: 'long',  // Full month name
        day: 'numeric',
      });

    const {showNotification} = NotifierComponent({
        title: "Shfletim me sukses",
        description: `Detajet per ecurine tuaj mbi ${courseData?.courseName} mund t'i gjeni tek profili juaj!`,
        alertType: "success",
        theme: colorScheme
    })
    const {showNotification: errorNotification } = NotifierComponent({
        title: "Pengese ne shfletimin e kursit",
        description: "Ju lutem provoni perseri ose kontaktoni Panelin e Ndihmes",
        alertType: "error",
        theme: colorScheme
    })

    const startCourse = async () => {
        try {
            const userId = await currentUserID();
            const lessonId = courseData.lessons[0].id;            
            const response = await startCourseProgress(userId, courseData.id, lessonId)
            console.log(response, 'asd?');
            if(response){
                showNotification();
            }
        } catch (error) {
            errorNotification()
            console.error(error.response.data.message, '?????');
        }
    }

    const getBookmarkStatus = async () => {
        try {
            const userId = await currentUserID();
            const response = await bookmarkStatus(userId, courseData.id)         
               
            if(response.status === 404){
                setIsBookmarked(false)
            }else{
                setIsBookmarked(true)
            }
        } catch (error) {
            console.log(error);
            
        }
    }

    const courseBookmark = async () => {
        try {
            const userId = await currentUserID();
            if(!isBookmarked){
                const response = await makeBookmark(userId, courseData.id);                
                if(response){
                    setIsBookmarked(true);
                }
            }else{
                const response = await deleteBookmark(userId, courseData.id);                
                if(response){
                    setIsBookmarked(false)
                }
            }
            
        } catch (error) {
            console.error(error);
            
        }
    }

    const showModal = (item, type) => {
        if(type === 'textual'){
            setModalVisible({visibility: true, type: 'textual', lessonName: item?.lessonName})
        }else if(type === 'video') {
            setModalVisible({visibility: true, type: 'video', lessonName: item?.lessonName})
        }else if (type === 'quiz') {
            setModalVisible({visibility: true, type: 'quiz', lessonName: item?.lessonName})
        }
    }

    useEffect(() => {
      if(course){
        setCourseData(course)
      }
    }, [course])
    
    useEffect(() => {
      if(courseData){
        getBookmarkStatus()
      }
    }, [courseData])
    
    
  return (
    <View className="w-full ">
        <View className="relative">
            <View className="w-full">
                <ImageBackground 
                    source={images.testimage}
                    resizeMode='cover'
                    className="h-[200px] min-w-full"
                />
            </View>
            <View className="absolute top-0 right-0 p-2 rounded-bl-[5px]" style={{backgroundColor: "rgba(0,0,0,.4)"}}>
                <TouchableOpacity onPress={courseBookmark}>
                    <Image 
                        source={icons.heart}
                        className="h-8 w-8"
                        resizeMode='contain'
                        style={{tintColor: isBookmarked ? "#ff9c01" : "#000"}}
                    />
                </TouchableOpacity>
            </View>
        </View>
        <View className="flex-row border-t bg-primary-light dark:bg-oBlack border-b border-white dark:border-black-200">
            <View className="flex-1 items-center py-2 border-r border-white dark:border-black-200">
                <Text className="text-xs text-oBlack dark:text-white font-pregular">Autori:</Text>
                <Text className="text-sm text-secondary font-pbold">Anonim</Text>
            </View>
            <View className="flex-1 items-center py-2">
                <Text className="text-xs text-oBlack dark:text-white font-pregular">Data e leshimit:</Text>
                <Text className="text-sm text-secondary font-pbold">{formattedDate}</Text>
            </View>
        </View>

        <View className="flex-row w-full relative">
            <View className="w-full flex-row justify-between items-center">
                <View className="bg-primary-light dark:bg-primary p-4 max-w-[70%]">
                    <Text className="text-oBlack dark:text-white text-xl font-pregular w-max"  numberOfLines={2} >{courseData?.courseName}</Text>
                </View>
                <View className="p-4 bg-primary-light dark:bg-primary max-w-[30%] justify-end items-start">
                    <View className="w-max">
                        <TouchableOpacity
                            onPress={startCourse}
                        >
                            <Animatable.Image
                                animation="pulse"
                                iterationCount="infinite"
                                easing="ease-in-out" 
                                source={icons.play}
                                resizeMode='contain'
                                className="h-12 w-12 border-2 border-white dark:border-black-200 rounded-full "
                                style={{tintColor: "#ff9c01"}}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View className="absolute -z-10 my-auto items-center justify-center top-[50%] bottom-0 flex left-0 right-0 w-full">
                <View className="after:content-[''] after:absolute after:top-0 after:bottom-0 after:m-auto after:items-center after:justify-center after:flex after:h-[1px] bg-black-200 after:w-[100%]"/>
            </View>
        </View>

        <View className="w-full bg-oBlack-light dark:bg-oBlack">
            <View className={`justify-between relative  p-4 border-t border-white dark:border-black-200 ${ !toggleContent ? "border-b " : ""}`}>
            {toggleContent && <View className="absolute border-b border-black-200 w-[100%] ml-4 bottom-0 justify-center items-center" />}
                <TouchableOpacity
                    className="flex-row items-center justify-between"
                    onPress={() => setToggleContent(!toggleContent)}
                >
                    <View>
                        <Text className="text-oBlack dark:text-white font-pregular text-lg ">Permbajtja</Text>
                    </View>
                    <View>
                        <Image 
                            source={toggleContent ? icons.upArrow : icons.downArrow}
                            className="w-6 h-6"
                            resizeMode='contain'
                            style={{tintColor: "#ff9c01"}}
                        />
                    </View>
                </TouchableOpacity>
            </View>

            <View className={`${toggleContent ? "border-b border-white dark:border-black-200" : ""}`}>
                {toggleContent && courseData.lessons.map((lessonItem, index) => (
              <View
                className="p-2 my-2 relative justify-between flex-row items-center z-10"
                key={index}>
                    <View className="max-w-[60%]">
                        <View className="flex-row items-center justify-start bg-oBlack-light dark:bg-oBlack">
                            <Text className="text-secondary text-base font-pregular text-right min-w-[20px] bg-oBlack-light dark:bg-oBlack">{index + 1}.</Text><Text className="text-oBlack dark:text-white px-2 bg-oBlack-light dark:bg-oBlack font-psemibold text-lg w-full" numberOfLines={1}>{lessonItem.lessonName}</Text>
                        </View>
                    </View>
                
                <View className="flex-row gap-2 border dark:border-0 border-white bg-gray-200 p-2 rounded-md dark:p-0 dark:rounded-none dark:bg-oBlack pr-2">
                    <View>
                        <TouchableOpacity onPress={() => showModal(lessonItem, 'video')}>
                            <Animatable.Image
                                animation="pulse"
                                iterationCount="infinite" 
                                easing="ease-in-out" 
                                source={icons.videoCamera}
                                resizeMode='contain'
                                className="h-6 w-6"
                                style={{tintColor: "#ff9c01"}}
                            />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => showModal(lessonItem, 'quiz')}>
                            <Animatable.Image
                                animation="pulse"
                                iterationCount="infinite" 
                                easing="ease-in-out" 
                                source={icons.quiz}
                                resizeMode='contain'
                                className="h-6 w-6"
                                style={{tintColor: "#ff9c01"}}
                            />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => showModal(lessonItem, 'textual')}>
                            <Animatable.Image
                                animation="pulse"
                                iterationCount="infinite" 
                                easing="ease-in-out" 
                                source={icons.content}
                                resizeMode='contain'
                                className="h-6 w-6"
                                style={{tintColor: "#ff9c01"}}
                            />
                        </TouchableOpacity>
                    </View>
                    
                </View>

                <View className="absolute -z-10 my-auto items-center justify-center flex left-4 right-0 w-[90%]">
                    <View className=" after:content-[''] after:absolute after:top-0 after:bottom-0 after:m-auto after:items-center after:justify-center after:flex after:h-[1px] bg-black-200 after:w-[100%]"/>
                </View>
              </View>
            ))}
            </View>
        </View>
        <View className="w-full p-4">
            <Text className="text-gray-600 dark:text-gray-400 text-xs font-plight">Aplikoni per poziten e <Link href="/add-quiz" className="text-secondary font-pmedium underline">Pionerit</Link> duke shtuar materiale/kuize mesimore dhe perfitoni nga angazhimet e studenteve tone!</Text>
            <Text className="text-gray-600 dark:text-gray-400 text-xs font-plight mt-4">Per cdo pacartesi apo raportim te materialeve ose problemeve kontaktoni <Link href="/support?type=support" className="text-secondary font-pmedium underline">Panelin e Ndihmes</Link> apo <Link className="text-secondary font-pmedium underline" href="/support?type=report">Raporto Problemin</Link></Text>
        </View>

        <CustomModal
            visible={modalVisible.visibility}
            onClose={() => setModalVisible({visibility: false, type: null, lessonName: null})}
            showButtons={true}
            // autoCloseDuration={4000}
            title={"Informacione shtese!"}
            cancelButtonText={"Largo dritaren"}
            proceedButtonText={"Vazhdo me veprimin"}
            onlyCancelButton={true}
        >   
            {modalVisible.type === 'video' 
                ? (
                    <Text className="text-oBlack dark:text-white font-plight text-sm text-center">
                        Gjate vijushmerise suaj ne leksionin <Text className="text-secondary font-psemibold">{modalVisible.lessonName}</Text>, do keni permbajtje visuale!
                    </Text>
                ) : modalVisible.type === 'textual' ? (
                    <Text className="text-oBlack dark:text-white font-plight text-sm text-center">
                        Gjate vijushmerise suaj ne leksionin <Text className="text-secondary font-psemibold">{modalVisible.lessonName}</Text>, do keni permbajtje tekstuale!
                    </Text>
                ) : modalVisible.type === 'quiz' ? (
                    <Text className="text-oBlack dark:text-white font-plight text-sm text-center">
                        Gjate vijushmerise suaj ne leksionin <Text className="text-secondary font-psemibold">{modalVisible.lessonName}</Text>, do keni testime pas intervaleve te caktuara te progresit tuaj!
                    </Text>
                ) : null
            }
        </CustomModal>
    </View>
  )
}

export default SingleCourse