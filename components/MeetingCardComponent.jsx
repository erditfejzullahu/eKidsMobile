import { View, Text, TouchableOpacity, Image } from 'react-native'
import { memo, useCallback, useMemo, useState } from 'react'
import { icons, images } from '../constants';
import * as Animatable from "react-native-animatable"
import { useNavigation } from 'expo-router';
import { useRouter } from 'expo-router';
import NotifierComponent from './NotifierComponent';
import CountdownTimer from "./CountdownTimer"
import { useColorScheme } from 'nativewind';
import { useShadowStyles } from '../hooks/useShadowStyles';

const MeetingCardComponent = ({item, managePlace = false, viewProfilePlace = false, userActiveUpcomingMeetingsSection = false}) => {
    const {shadowStyle} = useShadowStyles();
    const {colorScheme} = useColorScheme();
    const router = useRouter();
    const navigation = useNavigation();
    const [showDetails, setShowDetails] = useState(false)

    if(item === null) return;

    const getStatus = () => {
        switch (item.status) {
            case 0:
                return "Ne pritje";
            case 1:
                return "I perfunduar";
            case 2:
                return "Anuluar";
            case 3:
                return "Ka filluar";
            default:
                return "Ne pritje"
        }
    }

    const formatDuration = useMemo(() => {
        if(!item.durationTime){
            return "Takim pa limit kohor"
        }
        if(item.durationTime < 60){
            return (
                <>
                    <Text className="text-secondary">{item.durationTime}</Text><Text className="text-oBlack dark:text-white"> minuta</Text>
                </>
            )
        }else{
            const hours = item.durationTime / 60;
            return (
                <>
                    <Text className="text-secondary">{hours}</Text><Text className="text-oBlack dark:text-white"> ore</Text>
                </>
            )
        }
    }, [])

    const date = new Date(item.createdAt).toLocaleDateString("sq-AL", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    })

    const {showNotification: editNotification} = useMemo(() => NotifierComponent({
        title: "Gabim!",
        description: "Per shkak qe statusi i takimit nuk eshte ne kohen e ardhshme, ky takim nuk mund te perditesohet!",
        alertType: "warning",
        theme: colorScheme
    }), [colorScheme])

    const editPress = useCallback(() => {
        if(item.status === "Nuk ka filluar ende"){
            navigation.navigate("addScheduleMeeting", {
                meetingData: item,
                updateData: true
            })
        }else{
            editNotification();
        }
    }, [navigation])

    const handleCardPress = useCallback(() => {
        router.push(`meetings/${item.id}`)
    }, [router])

  return (
    <TouchableOpacity onPress={handleCardPress} className="bg-oBlack-light dark:bg-oBlack border border-gray-200 dark:border-black-200 relative p-2" style={shadowStyle}>

        {managePlace && (<Animatable.View animation="pulse" duration={1000} iterationCount="infinite" className="absolute right-0 left-0 top-8 items-center justify-center z-50">
            <TouchableOpacity onPress={editPress} className="z-50  mx-auto items-center justify-center bg-oBlack-light dark:bg-oBlack px-4 py-2 border border-gray-200 dark:border-black-200 w-[80%]" style={shadowStyle}>
                <Image 
                    source={icons.edit}
                    className="size-5"
                    resizeMode='contain'
                    tintColor={"#ff9c01"}
                />
            </TouchableOpacity>
        </Animatable.View>)}

        {!viewProfilePlace && <Text className="absolute -left-2 -top-2 z-50 bg-secondary border border-white px-2 py-0.5 font-psemibold text-sm text-white max-w-[130px]" style={shadowStyle}>{item?.status}</Text>}
        {item.status !== 0 && <Text className="absolute -top-2 -right-2 z-50 bg-oBlack-light dark:bg-oBlack border border-gray-200 dark:border-black-200 px-2 py-0.5 font-psemibold text-sm text-oBlack dark:text-white" style={shadowStyle}><Text className="text-secondary">{item.participants}</Text> Pjesemarres</Text>}

        {/* logic to make when it starts notification and stuff */}
        {/* {item.status === 0 && 
            <TouchableOpacity className="absolute -top-2 -right-2 z-50 bg-oBlack-light dark:bg-oBlack" style={shadowStyle}>
            <Animatable.Text animation="pulse" iterationCount="infinite" className=" border border-gray-200 dark:border-black-200 px-3 py-1 font-psemibold text-sm text-oBlack dark:text-white">Njoftohuni</Animatable.Text>
            </TouchableOpacity>
        } */}
        {/* logic to make when it starts notification and stuff */}
        
        <Text className="absolute -bottom-2 -left-2 border border-gray-200 dark:border-black-200 bg-primary-light dark:bg-primary px-3 py-1 font-psemibold text-sm text-oBlack dark:text-white" style={shadowStyle}>{date}</Text>
        <Text className="absolute -bottom-2 -right-2 border border-gray-200 dark:border-black-200 bg-primary-light dark:bg-primary px-3 py-1 font-psemibold text-sm text-oBlack dark:text-white" style={shadowStyle}>{formatDuration}</Text>
        <View className="h-[120px] border border-gray-200 dark:border-black-200 relative" style={shadowStyle}>
            {item.course?.image ? (
                <Image 
                    source={{uri: item.course.image}}
                    className="h-full w-full"
                    resizeMode='cover'
                />
            ) : (
                <Image
                    source={images.logoNew}
                    className="h-full w-full py-2 bg-primary-light dark:bg-primary"
                    resizeMode='contain'
                />
            )}

            <Animatable.View animation="pulse" iterationCount="infinite" className="absolute right-0 left-0 -bottom-3 items-center">
                <TouchableOpacity className="bg-oBlack-light dark:bg-oBlack border border-gray-200 dark:border-black-200 px-3 py-1" style={shadowStyle} onPress={() => setShowDetails(!showDetails)}>
                    <Image 
                        source={showDetails ? icons.upArrow : icons.downArrow}
                        className="size-5"
                        resizeMode='contain'
                        tintColor={"#FF9C01"}
                    />
                    {/* <Text className="text-white font-psemibold text-sm">Shfaq detaje</Text> */}
                </TouchableOpacity>
            </Animatable.View>
        </View>
        <View className="mt-3 mb-6">
            <View>
                <Text className="text-oBlack dark:text-white font-pmedium text-xl">{item.title}</Text>
                {item.description ? <Text className="text-gray-600 dark:text-gray-100 font-plight text-xs mt-1">{item.description}</Text> : <Text className="text-gray-100 italic text-xs mt-1">Pa pershkrim...</Text>}
            </View>

            {showDetails && <Animatable.View animation="bounceIn" className="border p-2 flex-row flex-wrap gap-4 items-center justify-between border-gray-200 dark:border-black-200 bg-primary-light dark:bg-primary mt-2 relative" style={shadowStyle}>
                <Text className="text-oBlack dark:text-white font-psemibold text-sm absolute z-50 -top-4 -right-4 bg-oBlack-light dark:bg-oBlack border border-gray-200 dark:border-black-200 px-2 py-1 rotate-12" style={shadowStyle}>
                    Detajet e takimit
                </Text>
                <Image 
                    source={icons.onlineMeeting}
                    className="absolute right-4 top-8 rotate-[30deg] opacity-30"
                    resizeMode='contain'
                    tintColor={"#FF9C01"}
                />
                <Image 
                    source={icons.videoConference}
                    className="absolute left-4 bottom-8 opacity-30"
                    resizeMode='contain'
                    tintColor={"#FF9C01"}
                />
                <View className={`flex-col justify-between ${viewProfilePlace ? "w-full" : "min-w-[200px]"} gap-4`}>
                    <View className="border border-gray-200 dark:border-black-200 bg-oBlack-light dark:bg-oBlack p-2 w-full" style={shadowStyle}>
                        <Text className="text-oBlack dark:text-white font-plight text-sm">Temat diskutuese</Text>
                        <Text className="text-gray-600 dark:text-gray-400 text-sm font-plight ml-2">- {item.course ? item.course.name : "Nuk ka kurs te zgjedhur"}</Text>
                        <Text className="text-gray-600 dark:text-gray-400 text-sm font-plight ml-4">- {item.lesson ? item.lesson.title : "Nuk ka leksion te zgjedhur"}</Text>
                    </View>
                    <Animatable.View animation="pulse" iterationCount="infinite">
                        <TouchableOpacity onPress={() => router.push(`meetings/${item.id}`)} className="bg-oBlack-light dark:bg-oBlack border border-gray-200 dark:border-black-200 p-2" style={shadowStyle}>
                            <Text className="text-secondary font-psemibold text-sm text-center">Ndiq takimin</Text>
                        </TouchableOpacity>
                    </Animatable.View>
                </View>
                {!viewProfilePlace && (<View className="flex-none min-w-[200px] ml-auto">
                    <View className="flex-col gap-2 items-center bg-oBlack-light dark:bg-oBlack border border-gray-200 dark:border-black-200 p-2" style={shadowStyle}>
                        <View className="border border-gray-200 dark:border-black-200" style={shadowStyle}>
                            <Image 
                                source={{uri: item.instructor?.profilePictureUrl}}
                                className="size-14"
                                resizeMode='contain'
                            />
                        </View>
                        <View>
                            <Text className="text-oBlack dark:text-white font-psemibold text-base text-center" numberOfLines={1}>{item.instructor?.name}</Text>
                            <Text className="text-gray-600 dark:text-gray-400 text-xs font-plight text-center">{item.instructor?.email}</Text>
                            <Text className="text-gray-600 dark:text-gray-400 text-xs font-plight text-center">{item.instructor?.username}</Text>
                        </View>
                    </View>
                </View>)}
            </Animatable.View>}

        </View>

            {userActiveUpcomingMeetingsSection && (
                <View className="absolute items-center justify-center left-0 right-0 -bottom-2">
                    <View className="bg-primary-light dark:bg-primary border border-gray-200 dark:border-black-200 px-2 py-1" style={shadowStyle}>
                        <CountdownTimer meetingData={item} textStyle={"!normal-case !text-sm !text-secondary !font-pblack"}/>
                    </View>
                </View>
            )}
    </TouchableOpacity>
  )
}

export default memo(MeetingCardComponent)