import { 
    View, 
    Text, 
    ScrollView, 
    Dimensions, 
    Image, 
    StyleSheet, 
    Platform, 
    TouchableWithoutFeedback, 
    KeyboardAvoidingView, 
    FlatList,
    RefreshControl,
    TouchableOpacity
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { icons, images } from '../constants';
import * as Animatable from 'react-native-animatable';
import { useNotificationContext } from '../context/NotificationState';
import useFetchFunction from '../hooks/useFetchFunction';
import { acceptFriendRequest, getNotifications, removeFriendRequestReq, reqDeleteNotification, reqMakeNotificationsRead } from '../services/fetchingService';
import Loading from './Loading';
import { SwipeListView } from 'react-native-swipe-list-view';
import NotifierComponent from './NotifierComponent';
import { useRouter } from 'expo-router';

const Notifications = ({ onClose }) => {
    const router = useRouter();
    const [paginationParams, setPaginationParams] = useState({
        pageSize: 15,
        pageNumber: 1
    })
    const {data, isLoading, refetch} = useFetchFunction(() => getNotifications(paginationParams))
    // const {data: readStatus, isLoading: readLoading, refetch: readRefetch} = useFetchFunction(() => reqMakeNotificationsRead())
    const [notificationData, setNotificationData] = useState({notifications: [], hasMore: false})
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [loadedFirst, setLoadedFirst] = useState(false)
    const {isOpened, setIsOpened, currentConnection} = useNotificationContext();
    const handleOutsidePress = (event) => {
        // This ensures touches inside the ScrollView or children are ignored
        if (event.target === event.currentTarget) {
            setIsOpened(false);
            setLoadedFirst(false)
        }
    };

    const onRefresh = async () => {
        setIsRefreshing(true)
        setLoadedFirst(false)
        setNotificationData([])
        await refetch();
        setIsRefreshing(false)
    }

    const loadMore = async () => {
        if(!notificationData?.hasMore || isLoadingMore) return;
        setIsLoadingMore(false)
        setPaginationParams((prev) => ({
            ...prev,
            pageNumber: prev.pageNumber + 1
        }))
    }
    
    useEffect(() => {
      if(notificationData?.notifications?.length > 0 && data){
        setLoadedFirst(true)
      }else if(data === null){
        setLoadedFirst(true)
      }
    }, [notificationData, data])
    

    useEffect(() => {
        console.log(data);
        if(data){
            if(paginationParams.pageNumber > 1){
                setNotificationData((prev) => ({
                    ...prev,
                    notifications: [...prev.notifications, data.notifications],
                    hasMore: data.hasMore
                }))
            }else{
                setNotificationData(data)
            }
            setIsLoadingMore(false)
        }else{
            setIsLoadingMore(false)
            setNotificationData(null)
        }
    }, [data])

    useEffect(() => {
    
      return () => {
        reqMakeNotificationsRead() //make them read
      }
    }, [])
    
    const deleteNotification = async (item) => {
        const response = await reqDeleteNotification(item?.id)
        if(response === 200){
            setNotificationData((prev) => {
                if(!prev || !prev.notifications) return prev;
                const updatedNotifications = prev.notifications.filter((nItem) => nItem.id !== item.id)
                return {
                    ...prev,
                    notifications: updatedNotifications,
                    hasMore: prev.hasMore
                }
            })
        }
    }


    const {showNotification: errorInRequests} = NotifierComponent({
        title: "Dicka shkoi gabim",
        description: "Ju lutem provoni perseri apo kontaktoni Panelin e Ndihmes",
        alertType: "warning"
    })

    const {showNotification: acceptedFriendRequest} = NotifierComponent({
        title: "Sapo keni pranuar kerkesen e miqesise me sukses",
    })

    const {showNotification: removedFriendRequest} = NotifierComponent({
        title: "Sapo keni pranuar kerkesen e miqesise me sukses",
    })
    
    const acceptFriendReq = async (item) => {
        const response = await acceptFriendRequest(item.userId);
        if(response === 200){
            acceptedFriendRequest()
            await refetch()
        }else{
            errorInRequests()
        }
    }

    

    const handleNotificationClick = (notification) => {        
        if(notification.type === 6){ //friend accepted
            setIsOpened(false)
            router.replace(`/users/${notification.userId}`)
        }
    }

    const handleRemoveFriendRequest = async (item) => {
        const response = await removeFriendRequestReq(item?.userId)
        if(response === 200){
            await refetch()
            setNotificationData((prev) => {
                if(!prev || !prev.notifications) return prev;
                const updatedNotifications = prev.notifications.filter((nItem) => nItem.id !== item.id)
                return {
                    ...prev,
                    notifications: updatedNotifications,
                    hasMore: prev.hasMore
                }
            })
        }else{
            errorInRequests();
        }
    }
    
    const outputNotificationWithType = (item) => {
        console.log(item , " asdasdhgasyu7dghasyudhausdh");
        
        // LoginActivity = 10
        // PasswordReset = 11
        // registeredAccount = 12
        // CustomInformationOrPRomotionSendToUserOrAll = 17 ; informata bazike promocione etj
        // ProgressTrackingInformation = 18
        // CompletedProgressNotification = 19

        switch (item.type) {
            case 10:
            case 11:
            case 12:
            case 17:
            case 18:
            case 19:
                return <>
                    <View className="self-start">
                        <View>
                            <Image
                                // source={{uri: item?.type === 4 ? item?.notificationSender?.profilePicture : item?.notificationSender?.profilePicture}}
                                source={{uri: item.notificationReceiver?.profilePicture}}
                                className="h-20 w-20 rounded-[5px]"
                                resizeMode="cover"
                            />
                        </View>
                    </View>
                    <View className="flex-1">
                        <Text className="text-white font-psemibold text-lg" numberOfLines={2}>{item.notificationReceiver.name}</Text>
                        <Text className="font-plight text-xs text-gray-400">{item.information}</Text>
                    </View>
                </>
            case 13:
                // FriendRequestSended = 13
                return <>
                    <View className="self-start ">
                        <View>
                            <Image
                                // source={{uri: item?.type === 4 ? item?.notificationSender?.profilePicture : item?.notificationSender?.profilePicture}}
                                source={{uri: item?.notificationSender.profilePicture}}
                                className="h-20 w-20 rounded-[5px]"
                                resizeMode="cover"
                            />
                        </View>
                        
                    </View>
                    <View className="flex-1">
                        <Text className="text-white font-psemibold text-lg" numberOfLines={2}>Njoftim social</Text>
                        <Text className="font-plight text-xs text-gray-400">Ju keni derguar nje ftese miqesie tek <Text className="text-secondary">{item.notificationSender?.name}</Text></Text>
                        <View className="mt-2">
                            <TouchableOpacity onPress={() => handleRemoveFriendRequest(item)} className="bg-oBlack self-start px-4 py-0.5 rounded-md border-black-200 border" style={styles.box}>
                                <Text className="font-psemibold text-sm text-secondary text-center">Anuloni</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </>
            case 14: 
                // FriendRequestRecieved = 14
                return <>
                <View className="self-start">
                    <View>
                        <Image
                            // source={{uri: item?.type === 4 ? item?.notificationSender?.profilePicture : item?.notificationSender?.profilePicture}}
                            source={{uri: item?.notificationSender?.profilePicture}}
                            className="h-20 w-20 rounded-[5px]"
                            resizeMode="cover"
                        />
                    </View>
                    <View className="flex-row gap-2 mt-2 justify-between">
                        <TouchableOpacity onPress={() => acceptFriendReq(item)} className="bg-secondary rounded-[5px]">
                            <Image 
                                source={icons.checked}
                                className="w-7 h-7"
                                resizeMode='contain'
                                tintColor={"#fff"}
                                />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleRemoveFriendRequest(item)} className="bg-secondary rounded-[5px]">
                            <Image 
                                source={icons.close}
                                className="w-7 h-7 p-1"
                                resizeMode='contain'
                                tintColor={"#fff"}
                                />
                        </TouchableOpacity>
                    </View>
                </View>
                <View className="flex-1">
                    <Text className="text-white font-psemibold text-lg" numberOfLines={2}>Njoftim social</Text>
                    <Text className="font-plight text-xs text-gray-400">Hej {item.notificationReceiver.name.split(" ")[0]}, <Text className="text-secondary">{item.notificationSender?.name}</Text> ju ka derguar ftese miqesie... Nderveproni ne baze te butonave poshte imazhit.</Text>
                </View>
                </>
            case 15:
                // FriendRequestSenderAccepted = 15 ; ta ka pranu friendin
                return <>
                    <View className="self-start">
                        <View>
                            <Image
                                // source={{uri: item?.type === 4 ? item?.notificationSender?.profilePicture : item?.notificationSender?.profilePicture}}
                                source={{uri: item.notificationSender?.profilePicture}}
                                className="h-20 w-20 rounded-[5px]"
                                resizeMode="cover"
                            />
                        </View>
                    </View>
                    <View className="flex-1">
                        <Text className="text-white font-psemibold text-lg" numberOfLines={2}>Njoftim social</Text>
                        <Text className="font-plight text-xs text-gray-400"><Text className="text-secondary">{item.notificationSender?.name}</Text> ka pranuar kerkesen tende te miqesise</Text>
                    </View>
                </>
            case 16:
                // FriendRequestReceiverAccepted = 16 ; ti e ke pranu friendin
                return <>
                    <View className="self-start">
                        <View>
                            <Image
                                // source={{uri: item?.type === 4 ? item?.notificationSender?.profilePicture : item?.notificationSender?.profilePicture}}
                                source={{uri: item.notificationSender?.profilePicture}}
                                className="h-20 w-20 rounded-[5px]"
                                resizeMode="cover"
                            />
                        </View>
                    </View>
                    <View className="flex-1">
                        <Text className="text-white font-psemibold text-lg" numberOfLines={2}>Njoftim social</Text>
                        <Text className="font-plight text-xs text-gray-400">Ju keni pranuar kerkesen e miqesise me <Text className="text-secondary">{item.notificationSender?.name}</Text></Text>
                    </View>
                </>
            default:
                <Text className="p-4">asdasdasdasdasd</Text>
                break;
            }
    }

    const removalButton = ({item}) => (
        <TouchableOpacity onPress={() => deleteNotification(item)} className="bg-secondary items-end p-6 flex-1 justify-center">
            <Image 
                source={icons.trashbin}
                className="h-10 w-10"
                resizeMode="contain"
                tintColor="#fff"
            />
        </TouchableOpacity>
    )

    return (
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
            <Animatable.View
                animation="pulse"
                duration={400}
                className="w-full absolute h-full right-0 left-0"
                style={[{ backgroundColor: "rgba(0, 0, 0, 0.5)" }, styles.box]}
            >
                {isLoading && !loadedFirst
                ? 
                    <View className="w-[95%] h-[60%] mt-[100px] z-20 m-auto border border-black-200 bg-oBlack rounded-[10px]">
                        <Loading />
                    </View> 
                : 
                    <View className="flex-1">
                        <TouchableWithoutFeedback style={styles.box}>
                            <View className="w-[95%] max-h-[70%] mt-[100px] z-20 m-auto border border-black-200 bg-oBlack rounded-md">
                                <SwipeListView
                                    className="h-full rounded-md"
                                    refreshControl={<RefreshControl onRefresh={onRefresh} tintColor="#ff9c01" colors={['#ff9c01', '#ff9c01', '#ff9c01']} refreshing={isRefreshing}/>}
                                    onEndReached={loadMore}
                                    onEndReachedThreshold={0.1}
                                    data={notificationData?.notifications}
                                    keyExtractor={(item) => item?.id}
                                    renderItem={({item}) => {
                                        const date = new Date(item?.createdAt);
                                        const formattedDate = date.toLocaleDateString('sq-AL', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        });
                                        return (
                                            
                                            <Animatable.View
                                                animation={item?.isRead === false ? {
                                                    0: { opacity: 0.5 }, 
                                                    0.5: { opacity: 1 },
                                                    1: { opacity: 0.5 },
                                                } : undefined}
                                                duration={1000} 
                                                iterationCount="infinite"
                                                easing="ease-in-out" 
                                                useNativeDriver
                                            >
                                                <TouchableOpacity 
                                                onPress={() => handleNotificationClick(item)}
                                                style={styles.box} 
                                                className={`border-b border-black-200 p-3 flex-row gap-2 flex-1 relative ${item?.type === 1 ? "bg-oBlack" : item?.type === 4 ? "bg-black" : "bg-primary"}`}
                                                // onPress={}
                                                >
                                                    
                                                    <View className="absolute bottom-1 right-2">
                                                        <Text className="text-secondary font-psemibold text-xs">{formattedDate}</Text>
                                                    </View>
                                                    {outputNotificationWithType(item)}                                                    
                                                    {item?.isRead === false && 
                                                        <View className="absolute left-2 top-2 bg-secondary rounded-lg p-0.5">
                                                            <Image 
                                                                source={icons.eyes}
                                                                className="h-6 w-6"
                                                                tintColor={"#fff"}
                                                            />
                                                        </View>
                                                    }
                                                </TouchableOpacity>  
                                            </Animatable.View>     
                                        )
                                    }}
                                    renderHiddenItem={removalButton}
                                    disableRightSwipe={true}
                                    rightOpenValue={-75}
                                    ListEmptyComponent={() => (
                                        <View className="p-4 border-b border-black-200">
                                            <Text className="font-psemibold text-white text-lg">Nuk keni njoftime...</Text>
                                            <Text className="font-plight text-gray-400 text-xs">Nese mendoni qe ka ndodhur nje gabim, ju lutem rifreskoni dritaren apo kontaktoni Panelin e Ndihmes!</Text>
                                        </View>
                                    )}
                                />
                                <TouchableOpacity onPress={() => undefined} className="border-t border-black-200 items-center justify-center min-h-[50px] z-50 bg-primary rounded-b-md" style={styles.box}>
                                    <Text className="font-psemibold text-base text-white">Shiko te gjitha</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                
                }
            </Animatable.View>
        </TouchableWithoutFeedback>
    );
};

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
        }),
    },
});

export default Notifications;
