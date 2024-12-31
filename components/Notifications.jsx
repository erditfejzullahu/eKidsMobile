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
import { getNotifications, reqMakeNotificationsRead } from '../services/fetchingService';
import Loading from './Loading';

const Notifications = ({ onClose }) => {

    const {data, isLoading, refetch} = useFetchFunction(() => getNotifications())
    // const {data: readStatus, isLoading: readLoading, refetch: readRefetch} = useFetchFunction(() => reqMakeNotificationsRead())
    const [notificationData, setNotificationData] = useState(null)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const {isOpened, setIsOpened, currentConnection} = useNotificationContext();
    const handleOutsidePress = (event) => {
        // This ensures touches inside the ScrollView or children are ignored
        if (event.target === event.currentTarget) {
            setIsOpened(false);
        }
    };

    const makeReads = async () => {
        await reqMakeNotificationsRead();
        // console.log(response);
    }

    const onRefresh = async () => {
        setIsRefreshing(true)
        await refetch();
        setIsRefreshing(false)
    }

    const addOlderNotifications = async () => {
        console.log('log');
    }
    

    useEffect(() => {
      if(data){
        setNotificationData(data)
        console.log(data);
        
      }
    }, [data])

    useEffect(() => {
    
      return () => {
        reqMakeNotificationsRead() //make them read
      }
    }, [])
    

    // useEffect(() => {
    //   if(isOpened){
    //     currentConnection.invoke('markNotificationsAsRead');
    //     console.log(' ??');
        
    //   }
    // }, [isOpened])

    return (
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
            <Animatable.View
                animation="pulse"
                duration={400}
                className="w-full absolute h-full right-0 left-0"
                style={[{ backgroundColor: "rgba(0, 0, 0, 0.5)" }, styles.box]}
            >
                {isLoading 
                ? 
                    <View className="w-[95%] h-[60%] mt-[100px] z-20 m-auto border border-black-200 bg-oBlack rounded-[10px]">
                        <Loading />
                    </View> 
                : 
                    <View className="flex-1">
                        <TouchableWithoutFeedback style={styles.box}>
                            <FlatList
                                refreshControl={<RefreshControl onRefresh={onRefresh} tintColor="#ff9c01" colors={['#ff9c01', '#ff9c01', '#ff9c01']} refreshing={isRefreshing}/>}
                                className="w-[95%] max-h-[60%] mt-[100px] z-20 m-auto border border-black-200 bg-oBlack rounded-[10px]"
                                style={styles.box}
                                onEndReached={addOlderNotifications}
                                onEndReachedThreshold={0}
                                data={notificationData}
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
                                        >
                                            <TouchableOpacity 
                                            style={styles.box} 
                                            className={`border-b border-black-200 p-3 flex-row gap-2 flex-1 relative ${item?.type === 1 ? "bg-oBlack" : item?.type === 4 ? "bg-black" : "bg-primary"}`}
                                            // onPress={}
                                            >
                                                <View className="self-start">
                                                    <View>
                                                        <Image
                                                            // source={{uri: item?.type === 4 ? item?.notificationSender?.profilePicture : item?.notificationSender?.profilePicture}}
                                                            source={{uri: item?.notificationSender.profilePicture === null ? item?.notificationReceiver?.profilePicture : item?.notificationSender?.profilePicture}}
                                                            className="h-20 w-20 rounded-[5px]"
                                                            resizeMode="cover"
                                                        />
                                                    </View>
                                                    {item?.type === 4 &&
                                                    <View className="flex-row gap-2 mt-2 justify-between">
                                                        <TouchableOpacity className="bg-secondary rounded-[5px]">
                                                            <Image 
                                                                source={icons.checked}
                                                                className="w-7 h-7"
                                                                resizeMode='contain'
                                                                tintColor={"#fff"}
                                                                />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity className="bg-secondary rounded-[5px]">
                                                            <Image 
                                                                source={icons.close}
                                                                className="w-7 h-7 p-1"
                                                                resizeMode='contain'
                                                                tintColor={"#fff"}
                                                                />
                                                        </TouchableOpacity>
                                                    </View>}
                                                </View>
                                                <View className="flex-1">
                                                    <Text className="text-white font-psemibold text-base mb-1" numberOfLines={2}>{item?.type === 4 ? <>Kerkese miqesie nga <Text className="text-secondary">{item?.notificationSender?.name}</Text> </> : <>Informacion nga <Text className="text-secondary">ShokuMesimit</Text> </>}</Text>
                                                    <Text className="text-gray-400 font-plight text-xs mb-2" numberOfLines={3}>{item?.type === 4 ? <>Hej {item?.notificationReceiver?.name}, sapo te dergova kerkese miqesie... Pres pergjigjen tuaj!</> : item?.information}</Text>
                                                </View>
                                                <View className="absolute bottom-1 right-2">
                                                    <Text className="text-secondary font-psemibold text-xs">{formattedDate}</Text>
                                                </View>
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
                                ListEmptyComponent={() => (
                                    <View className="p-4 border-b border-black-200">
                                        <Text className="font-psemibold text-white text-lg">Nuk keni njoftime...</Text>
                                        <Text className="font-plight text-gray-400 text-xs">Nese mendoni qe ka ndodhur nje gabim, ju lutem rifreskoni dritaren apo kontaktoni Panelin e Ndihmes!</Text>
                                    </View>
                                )}
                            />
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
