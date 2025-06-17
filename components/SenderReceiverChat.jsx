import { View, Text, Image, TouchableOpacity, StyleSheet, Platform, Modal } from 'react-native'
import React from 'react'
import { icons, images } from '../constants';
import { useState } from 'react';
import * as Animatable from 'react-native-animatable'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing';
import * as Progress from 'react-native-progress';
import { getCourseCategories } from '../services/fetchingService';
import { useGlobalContext } from '../context/GlobalProvider';
import Loading from './Loading';
import { useRouter } from 'expo-router';
import CountdownTimer from './CountdownTimer';
import FullScreenImage from './FullScreenImage';


const SenderReceiverChat = ({renderItem, currentUser, conversationUserData}) => {
    const router = useRouter();
    const {user, isLoading} = useGlobalContext();
    const categories = user?.data?.categories;
    const [progress, setProgress] = useState(0)
    const [modalVisible, setModalVisible] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)

    const [currentImageUrl, setCurrentImageUrl] = useState([])
    const [fullScreenImageVisible, setFullScreenImageVisible] = useState(false)

    const date = new Date(renderItem?.createdAt);
    const formattedDate = date.toLocaleDateString('sq-AL', {
      year: 'numeric',
      month: 'long',  // Full month name
      day: 'numeric',
    });

    const sharedItemDates = new Date(renderItem?.quiz ? renderItem?.quiz?.createdAt : renderItem?.course ? renderItem?.course?.createdAt : renderItem?.lesson ? renderItem?.lesson?.createdAt : renderItem?.blog ? renderItem?.blog?.createdAt : renderItem?.discussion ? renderItem?.discussion?.createdAt : renderItem?.instructor ? renderItem?.instructor?.createdAt : renderItem?.instructorCourse ? renderItem?.instructorCourse?.createdAt : renderItem?.instructorLesson ? renderItem?.instructorLesson?.createdAt : undefined);
    const formateSharedItemDates = sharedItemDates.toLocaleDateString('sq-AL', {
        year: 'numeric',
        month: 'long',  // Full month name
        day: 'numeric',
    })

    const formattedDateExtended = date.toLocaleString('sq-AL', {
        year: 'numeric',
        month: 'long',   // Full month name
        day: 'numeric',
        hour: '2-digit', // 2-digit hour
        minute: '2-digit', // 2-digit minute
        second: '2-digit', // 2-digit second
        hour12: false    // Use 24-hour format
      });

    // console.log(renderItem);

    const handleGoToLocation = (item) => {
        if(item === null) return;

        if(item.lesson){
            router.replace(`/categories/course/lesson/${item?.lesson?.id}`)
        }else if(item.course){
            router.replace(`/categories/course/${item?.course?.id}`)
        }else if(item.quiz){
            router.replace(`/quiz/${item?.quiz?.id}`)
        }else if(item.blog){
            router.replace(`(blogs)/${item?.blog?.id}`)
        }else if(item.discussion){
            router.replace(`/`)
        }else if(item.instructor){
            router.replace(`/tutor/${item?.instructor?.id}`)
        }else if(item.instructorCourse){
            router.replace(`/onlineClass/${item?.instructorCourse?.id}`)
        }else if(item.instructorLesson){    
            router.replace(`/`) //route to that specific onlinemeeting or smth else
        }else if(item.onlineMeeting){
            router.replace(`/meetings/${item?.onlineMeeting?.id}`)
        }
    }
    
    const downloadFile = async () => {
        try {
            setIsDownloading(true);
            setProgress(0)

            const getName = renderItem?.fileUrl.substring(renderItem?.fileUrl.lastIndexOf('/') + 1)

            const downloadResumable = FileSystem.createDownloadResumable(
                renderItem?.fileUrl,
                FileSystem.documentDirectory + getName,
                {},
                (downloadProgress) => {
                    const progressPercentage =
                        (downloadProgress.totalBytesWritten /
                            downloadProgress.totalBytesExpectedToWrite) *
                        100;
                    setProgress(progressPercentage.toFixed(0));
                }
            );

            const {uri} = await downloadResumable.downloadAsync();

            if(await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri)
            }else{
                console.log("sharing not awailable");
            }

        } catch (error) {
            console.error(error);
        } finally {
            setIsDownloading(false)
            setProgress(0)
        }
        

    }
    
  return (
    <>
    <View className="px-4" style={styles.box}>
        {renderItem?.senderUsername === currentUser?.username ? (
            <View className={`flex-row-reverse items-center gap-4`}>
                <View className="bg-oBlack mb-auto rounded-full border border-black-200 p-2">
                    <Image 
                        source={{uri: currentUser?.profilePictureUrl || icons.profile}}
                        className="h-8 w-8 rounded-full"
                        resizeMode='contain'
                    />
                </View>
                <View className={`p-4 rounded-[10px] flex-1 border border-black-200`} style={{backgroundColor : "#232533"}}>
                    <View>
                        <Text className="font-psemibold text-lg text-white">{currentUser?.firstname} {currentUser?.lastname}</Text>
                    </View>
                    <View className="relative">
                        {renderItem?.content && renderItem?.fileUrl ? (
                            <>
                                <View className="max-h-[200px] my-2">
                                    <TouchableOpacity onLongPress={downloadFile} onPress={() => {setCurrentImageUrl([renderItem?.fileUrl]); setFullScreenImageVisible(true)}}>
                                        <Image 
                                            source={{uri: renderItem?.fileUrl}}
                                            resizeMode='cover'
                                            className="h-full max-h-[200px] rounded-[10px]"
                                        />
                                    </TouchableOpacity>
                                </View>

                                {isDownloading && <Animatable.View animation="fadeIn" easing="ease-in-out" duration={400} className="mb-2">
                                    <Progress.Bar progress={progress / 100} unfilledColor='#d9d9d9' color="#ff9c01" borderWidth={0} height={8} width={null}/>
                                </Animatable.View>}
                                <View>
                                    <Text className="font-plight text-sm text-gray-400 mb-2">{renderItem?.content}</Text>
                                </View>
                            </>
                        ) : renderItem?.content && !renderItem?.fileUrl ? (
                            <Text className="font-plight text-sm text-gray-400 mb-2">{renderItem?.content}</Text>
                        ) : !renderItem?.content && renderItem?.fileUrl ? (
                            <View className="max-h-[200px] my-2 mb-4">
                                <TouchableOpacity onLongPress={downloadFile} onPress={() => {setCurrentImageUrl([renderItem?.fileUrl]); setFullScreenImageVisible(true)}}>
                                    <Image
                                        source={{ uri: renderItem?.fileUrl }}
                                        resizeMode='cover'
                                        className="h-full max-h-[200px] rounded-[10px]"
                                    />
                                </TouchableOpacity>
                            </View>
                        ) : (renderItem?.quiz || renderItem?.course || renderItem?.lesson || renderItem?.blog || renderItem?.discussion || renderItem?.instructor || renderItem?.instructorCourse || renderItem?.instructorLessons || renderItem?.onlineMeeting) ? (
                            <>
                            <View className="bg-oBlack border border-black-200 p-4 rounded-[5px] mb-4 mt-2" style={styles.box}>
                                <TouchableOpacity className="absolute top-0 right-0" onPress={() => handleGoToLocation(renderItem)}>
                                    <Animatable.Text animation="pulse" iterationCount="infinite" duration={1000} className="text-white font-psemibold text-xs  px-2 py-0.5 rounded-bl-[5px] rounded-tr-[5px] bg-secondary border-b border-l border-black-200" style={styles.box}>{renderItem?.course ? "Shfleto kursin" : renderItem?.lesson ? "Ndiq ligjeraten" : renderItem?.quiz ? "Ploteso kuizin" : renderItem?.blog ? "Shfleto blogun" : renderItem?.discussion ? "Shfleto diskutimin" : renderItem?.instructor ? "Vizito instruktorin" : renderItem?.instructorLesson ? "Shfleto leksionin" : renderItem?.instructorCourse ? "Shfleto kursin" : renderItem?.onlineMeeting ? "Ndiq takimin" : "None"}</Animatable.Text>
                                </TouchableOpacity>
                                <View>
                                    <Text className="text-white font-psemibold text-base border-b border-secondary self-start" numberOfLines={1}>{renderItem?.quiz ? renderItem?.quiz?.quizName : renderItem?.course ? renderItem.course?.courseName : renderItem?.lesson ? renderItem?.lesson?.lessonName : renderItem?.blog ? renderItem?.blog?.title : renderItem?.discussion ? renderItem?.discussion?.title : renderItem?.instructor ? renderItem?.instructor?.name : renderItem?.instructorLesson ? renderItem?.instructorLesson?.title : renderItem?.instructorCourse ? renderItem?.instructorCourse?.name : renderItem?.onlineMeeting ? renderItem?.onlineMeeting?.title : "None"}</Text>
                                </View>
                                <View className="my-2 flex-row gap-2">
                                    <View className="flex-1">
                                        <Text className="text-gray-400 font-plight text-sm" numberOfLines={3}>{renderItem?.quiz ? renderItem?.quiz?.quizDescription : renderItem?.lesson ? renderItem?.lesson?.lessonExcerpt : renderItem?.course ? renderItem?.course?.courseDescription : renderItem?.blog ? renderItem?.blog?.content : renderItem?.discussion ? renderItem?.discussion?.content : renderItem?.instructor ? `Ndiq kurset e ${renderItem?.instructor?.name}` : renderItem?.instructorLesson ? renderItem?.instructorLesson?.content : renderItem?.instructorCourse ? renderItem?.instructorCourse?.description : renderItem?.onlineMeeting ? renderItem?.onlineMeeting?.description : "None"}</Text>
                                    </View>
                                    <View>
                                        {(renderItem?.course?.lessonFeaturedImage || renderItem?.lesson?.lessonFeaturedImage || renderItem?.blog?.profilePictureUrl || renderItem?.discussion?.user?.profilePictureUrl || renderItem?.instructor || renderItem?.instructorCourse?.image || renderItem?.instructorLesson?.image) ? (<Image 
                                            source={{uri: renderItem?.course ? renderItem?.course?.courseFeaturedImage : renderItem?.lesson ? renderItem?.lesson?.courseFeaturedImage : renderItem?.blog ? renderItem?.blog?.profilePictureUrl : renderItem?.discussion ? renderItem?.discussion?.user?.profilePictureUrl : renderItem?.instructor ? renderItem?.instructor?.profilePictureUrl : renderItem?.instructorLesson ? renderItem?.instructorLesson?.image : renderItem?.instructorCourse ? renderItem?.instructorCourse?.image : images.logoNew}}
                                            className="h-20 w-20 border border-secondary rounded-[5px]"
                                            resizeMode='cover'
                                        />) : (
                                            <Image 
                                                source={renderItem?.quiz ? icons.quiz : renderItem?.onlineMeeting ? icons.onlineMeeting : renderItem?.lesson ? icons.lectures : renderItem?.course ? icons.courses : renderItem?.blog ? icons.blogs : renderItem?.discussion ? icons.discussion : renderItem?.instructorCourse ? icons.courses : renderItem?.instructorLesson ? icons.lesson : images.logoNew}
                                                className="h-20 w-20 p-2 border border-secondary rounded-[5px]"
                                                tintColor={"#fff"}
                                                resizeMode='cover'
                                            />
                                        )}
                                    </View>
                                </View>
                                <Text style={styles.box} className="text-white font-psemibold text-xs absolute bottom-0 left-0 px-2 py-0.5 rounded-bl-[5px] rounded-tr-[5px] bg-secondary border-t border-r border-black-200">{renderItem?.onlineMeeting === null ? formateSharedItemDates : (renderItem?.onlineMeeting?.status === 0 || renderItem?.onlineMeeting?.status === 3) ? <CountdownTimer meetingData={renderItem?.onlineMeeting}/> : "Ka perfunduar"}</Text>
                                {(renderItem?.course || renderItem?.lesson || renderItem?.quiz || renderItem?.blog?.categoryId || renderItem?.instructorLesson?.categoryId || renderItem?.instructorCourse?.categoryId) ? (
                                    <Text style={styles.box} className="text-white font-psemibold text-xs absolute bottom-0 right-0 px-2 py-0.5 rounded-br-[5px] rounded-tl-[5px] bg-oBlack border-t border-l border-black-200">{getCourseCategories(categories, renderItem?.course ? renderItem?.course?.courseCategory : renderItem?.lesson ? renderItem?.lesson?.courseCategory : renderItem?.quiz ? renderItem?.quiz?.quizCategory : renderItem?.blog ? renderItem?.blog?.categoryId : renderItem?.instructorLesson ? renderItem?.instructorLesson?.categoryId : renderItem?.instructorCourse ? renderItem?.instructorCourse?.categoryId : 1)}</Text>
                                ) : (
                                    <Text style={styles.box} className="text-white font-psemibold text-xs absolute bottom-0 right-0 px-2 py-0.5 rounded-br-[5px] rounded-tl-[5px] bg-oBlack border-t border-l border-black-200">{renderItem?.blog ? "Blog" : renderItem?.instructorLesson ? "Leksion" : renderItem?.instructorCourse ? "Kurs" : renderItem?.instructor ? "Instruktor" : renderItem?.discussion ? "Diskutim" : renderItem?.onlineMeeting ? "Takim Online" : "None"}</Text>
                                )}
                            </View>
                            </>
                        ) : (<Text className="text-white text-sm italic">Mesazhi eshte fshire</Text>)}
                        
                        <TouchableOpacity onPress={() => setModalVisible(true)} className="absolute flex-row items-center justify-center p-0.5 px-2 gap-2 -bottom-4 -right-4 bg-secondary rounded-tl-[5px] rounded-br-[5px]">
                            <Text className="font-psemibold text-xs text-white">{formattedDate}</Text>
                            <Image 
                                source={icons.infoFilled}
                                className="h-4 w-4 absolute -top-2 -right-2"
                                tintColor={"#fff"}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        ) : (
            <View className={`flex-row items-center gap-4`}>
                <View className="bg-oBlack rounded-full border border-black-200 p-2">
                    <Image 
                        source={{uri: conversationUserData?.receiverProfilePic || icons.profile}}
                        className="h-8 w-8 rounded-full"
                        resizeMode='contain'
                    />
                </View>
                <View className={`p-4 rounded-[10px] flex-1 border border-black-200`} style={{backgroundColor : "#13131a"}}>
                    <View>
                        <Text className="font-psemibold text-lg text-white">{conversationUserData?.receiverFirstname} {conversationUserData?.receiverLastname}</Text>
                    </View>
                    <View className="relative">
                        {renderItem?.content && renderItem?.fileUrl ? (
                            <>
                                <View className="max-h-[200px] my-2">
                                    <TouchableOpacity onLongPress={downloadFile} onPress={() => {setCurrentImageUrl([renderItem?.fileUrl]); setFullScreenImageVisible(true)}}>
                                        <Image 
                                            source={{uri: renderItem?.fileUrl}}
                                            resizeMode='cover'
                                            className="h-full max-h-[200px] rounded-[10px]"
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <Text className="font-plight text-sm text-gray-400 mb-2">{renderItem?.content}</Text>
                                </View>
                            </>
                        ) : renderItem?.content && !renderItem?.fileUrl ? (
                            <Text className="font-plight text-sm text-gray-400 mb-2">{renderItem?.content}</Text>
                        ) : !renderItem?.content && renderItem?.fileUrl ? (
                            <View className="max-h-[200px] my-2 mb-4">``
                                <TouchableOpacity onLongPress={downloadFile} onPress={() => {setCurrentImageUrl([renderItem?.fileUrl]); setFullScreenImageVisible(true)}}>
                                    <Image
                                        source={{ uri: renderItem?.fileUrl }}
                                        resizeMode='cover'
                                        className="h-full max-h-[200px] rounded-[10px]"
                                    />
                                </TouchableOpacity>
                            </View>
                        ) : (renderItem?.quiz || renderItem?.course || renderItem?.lesson || renderItem?.blog || renderItem?.discussion || renderItem?.instructor || renderItem?.instructorCourse || renderItem?.instructorLesson || renderItem?.onlineMeeting) ? (
                            <View className="bg-primary border border-black-200 p-4 rounded-[5px] mb-4 mt-2" style={styles.box}>
                                <TouchableOpacity
                                    onPress={() => handleGoToLocation(renderItem)}
                                    className="absolute top-0 right-0"
                                >
                                    <Animatable.Text animation="pulse" iterationCount="infinite" duration={1000}
                                        className="text-white font-psemibold text-xs absolute px-2 py-0.5 rounded-bl-[5px] rounded-tr-[5px] bg-secondary border-b border-l border-black-200"
                                        style={styles.box}
                                        
                                    >
                                        {renderItem?.course ? "Shfleto kursin" : renderItem?.lesson ? "Ndiq ligjeraten" : renderItem?.quiz ? "Ploteso kuizin" : renderItem?.blog ? "Shfleto blogun" : renderItem?.discussion ? "Shfleto diskutimin" : renderItem?.instructor ? "Vizito instruktorin" : renderItem?.instructorLesson ? "Shfleto leksionin" : renderItem?.instructorCourse ? "Shfleto kursin" : renderItem?.onlineMeeting ? "Ndiq takimin" : "None"}
                                    </Animatable.Text>
                                </TouchableOpacity>
                                <View>
                                    <Text className="text-white font-psemibold text-base border-b border-secondary self-start" numberOfLines={1}>{renderItem?.quiz ? renderItem?.quiz?.quizName : renderItem?.course ? renderItem.course?.courseName : renderItem?.lesson ? renderItem?.lesson?.lessonName : renderItem?.blog ? renderItem?.blog?.title : renderItem?.discussion ? renderItem?.discussion?.title : renderItem?.instructor ? renderItem?.instructor?.name : renderItem?.instructorLesson ? renderItem?.instructorLesson?.title : renderItem?.instructorCourse ? renderItem?.instructorCourse?.name : renderItem?.onlineMeeting ? renderItem?.onlineMeeting?.title : "None"}</Text>
                                </View>
                                <View className="my-2 flex-row gap-2">
                                    <View className="flex-1">
                                        <Text className="text-gray-400 font-plight text-sm" numberOfLines={3}>{renderItem?.quiz ? renderItem?.quiz?.quizDescription : renderItem?.lesson ? renderItem?.lesson?.lessonExcerpt : renderItem?.course ? renderItem?.course?.courseDescription : renderItem?.blog ? renderItem?.blog?.content : renderItem?.discussion ? renderItem?.discussion?.content : renderItem?.instructor ? `Ndiq kurset e ${renderItem?.instructor?.name}` : renderItem?.instructorLesson ? renderItem?.instructorLesson?.content : renderItem?.instructorCourse ? renderItem?.instructorCourse?.description : renderItem?.onlineMeeting ? renderItem?.onlineMeeting?.description : "None"}</Text>
                                    </View>
                                    <View>
                                        {(renderItem?.course?.lessonFeaturedImage || renderItem?.lesson?.lessonFeaturedImage || renderItem?.blog?.profilePictureUrl || renderItem?.discussion?.user?.profilePictureUrl || renderItem?.instructor || renderItem?.instructorCourse?.image || renderItem?.instructorLesson?.image) ? (<Image 
                                            source={{uri: renderItem?.course ? renderItem?.course?.courseFeaturedImage : renderItem?.lesson ? renderItem?.lesson?.courseFeaturedImage : renderItem?.blog ? renderItem?.blog?.profilePictureUrl : renderItem?.discussion ? renderItem?.discussion?.user?.profilePictureUrl : renderItem?.instructor ? renderItem?.instructor?.profilePictureUrl : renderItem?.instructorLesson ? renderItem?.instructorLesson?.image : renderItem?.instructorCourse ? renderItem?.instructorCourse?.image : images.logoNew}}
                                            className="h-20 w-20 border border-secondary rounded-[5px]"
                                            resizeMode='cover'
                                        />) : (
                                            <Image 
                                                source={renderItem?.quiz ? icons.quiz : renderItem?.onlineMeeting ? icons.onlineMeeting : renderItem?.lesson ? icons.lectures : renderItem?.course ? icons.courses : renderItem?.blog ? icons.blogs : renderItem?.discussion ? icons.discussion : renderItem?.instructorCourse ? icons.courses : renderItem?.instructorLesson ? icons.lesson : images.logoNew}
                                                className="h-20 w-20 p-2 border border-secondary rounded-[5px]"
                                                tintColor={"#fff"}
                                                resizeMode='cover'
                                            />
                                        )}
                                    </View>
                                </View>
                                <Text style={styles.box} className="text-white font-psemibold text-xs absolute bottom-0 left-0 px-2 py-0.5 rounded-bl-[5px] rounded-tr-[5px] bg-secondary border-t border-r border-black-200">{renderItem?.onlineMeeting === null ? formateSharedItemDates : (renderItem?.onlineMeeting?.status === 0 || renderItem?.onlineMeeting?.status === 3) ? <CountdownTimer meetingData={renderItem?.onlineMeeting}/> : "Ka perfunduar"}</Text>
                                {(renderItem?.course || renderItem?.lesson || renderItem?.quiz || renderItem?.blog?.categoryId || renderItem?.instructorLesson?.categoryId || renderItem?.instructorCourse?.categoryId) ? (
                                    <Text style={styles.box} className="text-white font-psemibold text-xs absolute bottom-0 right-0 px-2 py-0.5 rounded-br-[5px] rounded-tl-[5px] bg-oBlack border-t border-l border-black-200">{getCourseCategories(categories, renderItem?.course ? renderItem?.course?.courseCategory : renderItem?.lesson ? renderItem?.lesson?.courseCategory : renderItem?.quiz ? renderItem?.quiz?.quizCategory : renderItem?.blog ? renderItem?.blog?.categoryId : renderItem?.instructorLesson ? renderItem?.instructorLesson?.categoryId : renderItem?.instructorCourse ? renderItem?.instructorCourse?.categoryId : 1)}</Text>
                                ) : (
                                    <Text style={styles.box} className="text-white font-psemibold text-xs absolute bottom-0 right-0 px-2 py-0.5 rounded-br-[5px] rounded-tl-[5px] bg-oBlack border-t border-l border-black-200">{renderItem?.blog ? "Blog" : renderItem?.instructorLesson ? "Leksion" : renderItem?.instructorCourse ? "Kurs" : renderItem?.instructor ? "Instruktor" : renderItem?.discussion ? "Diskutim" : renderItem?.onlineMeeting ? "Takim Online" : "None"}</Text>
                                )}
                            </View>
                        ) : (<Text className="text-white text-sm italic">Mesazhi eshte fshire</Text>)}
                        
                        <TouchableOpacity onPress={() => setModalVisible(true)} className="absolute flex-row items-center justify-center p-0.5 px-2 gap-2 -bottom-4 -right-4 bg-secondary rounded-tl-[5px] rounded-br-[5px]">
                            <Text className="font-psemibold text-xs text-white">{formattedDate}</Text>
                            <Animatable.Image
                                animation="pulse"
                                iterationCount="infinite"
                                easing="ease-in-out" 
                                source={icons.infoFilled}
                                className="h-4 w-4 absolute -top-2 -right-2"
                                tintColor={"#fff"}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )}
        
    </View>
    <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
    >
        <View className="flex-1 justify-center items-center" style={{backgroundColor: "rgba(0,0,0,0.4)"}}>
            <View style={styles.box} className="bg-primary p-4 rounded-[5px] border border-black-200 w-[200px] items-center">
                {/* <View className="w-full items-center">
                    <Text className="font-psemibold text-lg text-white mb-2 border-b border-secondary">Detajet e mesazhit</Text>
                </View> */}
                <View>
                    <Text className="font-pbold text-white text-sm">E derguar me:</Text>
                    <Text className="font-plight text-gray-400 text-sm">{formattedDateExtended}</Text>
                </View>

                {renderItem?.senderUsername === currentUser?.username && (
                <View className="mt-2 flex-row items-center gap-1 justify-end w-full">
                    <View>
                        <Image 
                            source={icons.eyes}
                            className="h-6 w-6"
                            resizeMode='contain'
                            tintColor={"#fff"}
                        />
                    </View>
                    
                        <View>
                            <Text className="text-secondary font-psemibold text-sm">{renderItem?.isRead ? "Eshte pare" : "Nuk eshte pare"}</Text>
                        </View>
                </View>
                )}
                
                <View className="absolute -top-1 -right-1">
                    <TouchableOpacity onPress={() => setModalVisible(false)} className="bg-white p-1 rounded-full">
                        <Image 
                            source={icons.close}
                            tintColor={"#000"}
                            className="h-2 w-2"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>    
    </Modal>
    <FullScreenImage 
        visible={fullScreenImageVisible}
        images={currentImageUrl}
        initialIndex={0}
        onClose={() => setFullScreenImageVisible(false)}
    />
    </>
  )
}

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

export default SenderReceiverChat