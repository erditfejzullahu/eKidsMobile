import { View, Text, FlatList, TouchableOpacity, TextInput, RefreshControl, StyleSheet, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { Image } from 'react-native';
import { icons, images } from '../../../constants';
import { KeyboardAwareFlatList, KeyboardAwareScrollView, KeyboardAwareSectionList } from 'react-native-keyboard-aware-scroll-view';
import useFetchFunction from '../../../hooks/useFetchFunction';
import SenderReceiverChat from '../../../components/SenderReceiverChat';
import { useGlobalContext } from '../../../context/GlobalProvider';
import Loading from '../../../components/Loading';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
import * as SignalR from '@microsoft/signalr';
import { getAccessToken, getRefreshToken, isTokenExpired } from '../../../services/secureStorage';
import { refresh } from '../../../services/authService';
import { fetchAllComments, reqReadMessages } from '../../../services/fetchingService';
import apiClient from '../../../services/apiClient';
import * as ImagePicker from 'expo-image-picker'
import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system';

const Conversation = () => {
    const router = useRouter();
    const conversation = useLocalSearchParams();
    const [paginationState, setPaginationState] = useState({pageNumber: 1, pageSize: 15})
    const {data, isLoading: commentsLoading, refetch} = useFetchFunction(() => fetchAllComments(conversation?.currentUserUsername, conversation?.receiverUsername, paginationState))
    const {user, isLoading} = useGlobalContext();

    const [openMoreDetails, setOpenMoreDetails] = useState(false) //duhet me kry

    const [connection, setConnection] = useState(null)
    const [receiver, setReceiver] = useState('')
    const [messages, setMessages] = useState({messages: [], hasMore: false})
    const [messageSent, setMessageSent] = useState('')
    const [textInputFocused, setTextInputFocused] = useState(false)

    const [loadedFirst, setLoadedFirst] = useState(false)
    const [isLoadingMore, setIsLoadingMore] = useState(false)

    const messageVal = useRef(null)

    const [image, setImage] = useState({
        type: '',
        base64: '',
        fileName: ''
    })

    const sendImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if(!permissionResult){
            console.log('show smth se se ka bo permission');
        }
        //TODO: implementim per kamera poashtu me shtu
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0,
            base64: true
        })

        // console.log(result);
        

        if(!result.canceled){
            setImage((prevData) => ({
                ...prevData,
                type: `data:${result.assets[0].mimeType};base64,`,
                base64: result.assets[0].base64,
                fileName: result.assets[0].fileName
            }))
            // console.log(image);
        }
    }

    //documents upload
    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({type: '*/*',})

            if(!result.canceled){

                const base64string = await FileSystem.readAsStringAsync(result.assets[0].uri)

                setImage((prevData) => ({
                    ...prevData,
                    type: `data:${result.assets[0].mimeType};base64,`,
                    base64: base64string,
                    fileName: result.assets[0].name
                }))
                // console.log(image);
                
            }
        } catch (error) {
            console.error(error);
        }
    }
    //documents upload
    
    const deleteImage = () => {
        setImage({
            type: "",
            base64: "",
            fileName: ""
        })
    }

    const updateReadMessages = async () => {
        const response = await reqReadMessages(conversation?.currentUserUsername, conversation?.receiverUsername)
        if(response === 200){
            console.log("Messages read succesfully");
        }else{
            console.log("Error reading messages");
        }
    }

    useEffect(() => {
      if(messages?.messages?.length > 0){
        setLoadedFirst(true)
      }else{
        if(commentsLoading && isLoading){
            setLoadedFirst(true)
        }
      }
    }, [messages, commentsLoading, isLoading])
    
    
    
    useEffect(() => {
      setReceiver(conversation?.receiverUsername)
      setMessages(null)
      refetch();
    }, [conversation?.conversation])

    useEffect(() => {
        console.log(data, " conversation");
      if(data){
        if(paginationState.pageNumber > 1){
            setMessages((prev) => ({
                ...prev,
                messages: [...prev.messages, ...data.messages],
                hasMore: data.hasMore
            }))
        }else{
            setMessages(data)      
        }
        setIsLoadingMore(false)
        updateReadMessages()
      }else{
        setIsLoadingMore(false)
        setMessages(null)
      }
    }, [data])

    //connectioni me hub dhe shtimi i mesazheve
    useEffect(() => {
        const connectToHub = async () => {
            const token = await getAccessToken();
            
            const isExpired = isTokenExpired(token);
            if(!token){
                // console.log('no token?? fix auth');
                return;
            }
            console.log("TOKEN: ", token);
            
            const newConnection = new SignalR.HubConnectionBuilder()
              .withUrl('https://dove-well-officially.ngrok-free.app/chatHub', {
                headers: {
                    "Authorization": "Bearer " + token
                }
                // accessTokenFactory: () => {
                //     return token;
                // }
              })
              .configureLogging(SignalR.LogLevel.Information)
              .build()
              
              setConnection(newConnection)

            const startConnection = async () => {
                // console.log('???asdasdasd???asdasdasd');
                
                try {
                    await newConnection.start()
                    console.log('Connected to chat hub');
                } catch (error) {                    
                    if(error.message.includes('401')){
                        try {
                            const refreshToken = await getRefreshToken();
                            const refreshResponse = await refresh(refreshToken)
                            if(refreshResponse){
                                await connectToHub();
                            }else{
                                console.log('not refreshed');
                            }
                        } catch (error) {
                            console.error('refreshtoken error ', error);
                        }
                        // console.error("in startconnection, ", error.message, ' asd');
                    }else{
                        await handleReconnect()
                    }
                }
            }

            newConnection.on('ReceiveMessage', (messageData) => {
                
                setMessages((prevMessages) => ({
                    messages: [
                        {
                            content: messageData.content,
                            createdAt: messageData.createdAt,
                            id: messageData.id,
                            isRead: messageData.isRead,
                            fileUrl: messageData.fileUrl,
                            receiver:{
                                firstname: messageData.receiver.firstname,
                                lastname: messageData.receiver.lastname,
                                profilePictureUrl: messageData.receiver.profilePictureUrl,
                                username: messageData.receiver.username
                            },
                            receiverUsername: messageData.receiverUsername,
                            sender:{
                                firstname: messageData.sender.firstname,
                                lastname: messageData.sender.lastname,
                                profilePictureUrl: messageData.sender.profilePictureUrl,
                                username: messageData.sender.username
                            },
                            senderUsername: messageData.senderUsername
                        },
                        ...prevMessages?.messages,
                    ],
                    hasMore: data?.hasMore
                }))
            })

            newConnection.on('MessageSent', (messageData) => {
                if(messageData?.receiver?.username === messageData?.sender?.username){
                    return;
                }
                console.log('message sent !!');
                
                setMessages((prevMessages) => ({
                    messages: [
                        {
                            content: messageData.content,
                            createdAt: messageData.createdAt,
                            id: messageData.id,
                            isRead: messageData.isRead,
                            fileUrl: messageData.fileUrl,
                            receiver:{
                                firstname: messageData.receiver.firstname,
                                lastname: messageData.receiver.lastname,
                                profilePictureUrl: messageData.receiver.profilePictureUrl,
                                username: messageData.receiver.username
                            },
                            receiverUsername: messageData.receiverUsername,
                            sender:{
                                firstname: messageData.sender.firstname,
                                lastname: messageData.sender.lastname,
                                profilePictureUrl: messageData.sender.profilePictureUrl,
                                username: messageData.sender.username
                            },
                            senderUsername: messageData.senderUsername
                        },
                        ...prevMessages?.messages,
                    ],
                    hasMore: data?.hasMore
                }))
            })

            newConnection.onclose(async (error) => {
                console.log('connection closed', error);
                if(error?.statusCode === 401){
                    await refreshAndConnect();
                }else{
                    handleReconnect();
                }
            })

            await startConnection();
        }

        
        const handleReconnect = async () => {
            setTimeout(async () => {
                console.log("attemting to reconnect to chat hub...");
                await connectToHub();
            }, 5000);
        }
        
        const refreshAndConnect = async () => {
            const refreshToken = await getRefreshToken();
            try {
                console.log("refreshing token");
                const newToken = await refresh(refreshToken)
                if(newToken){
                    console.log("token refreshed try again");
                    await connectToHub();
                }else{
                    console.log("unable to refresh token");
                    router.replace('/login')
                }
            } catch (error) {
                console.error("ne refresh and connect", error);
            }
        }

        connectToHub();
        
        return () => {
            if(connection){
                connection.stop();
            }
        }

    }, [])
    //connectioni me hub dhe shtimi i mesazheve

    const sendMessage = async () => {
        if(messageSent === '' || !messageSent && image.base64 === ''){
            console.log("enter a image or message");
            return;
        }

        const formattedBase64 = image.base64 !== '' ? `${image.type}${image.base64}` : null;
        // console.log(messageVal.text);
        // console.log(receiver, ' resiveri');
        
        try {
            await connection?.invoke('SendPrivateMessage', receiver, messageSent, formattedBase64)
            setImage({
                type: '',
                base64: '',
                fileName: ''
            })
            setMessageSent('')
        } catch (error) {
            console.error(error);
        }
    }

    
    //shtim i meszheve tvjetra
    const onEndReached = () => {
        if(!messages?.hasMore || isLoadingMore) return;
        setIsLoadingMore(true)
        setPaginationState((prev) => ({
            ...prev,
            pageNumber: prev.pageNumber + 1
        }))
    }

    useEffect(() => {
      refetch()
    }, [paginationState])
    

    const flatListRef = useRef(null) // implementim per me shku ne fund te meszhev me naj ikon posht a najsen

    if((isLoading || commentsLoading) && !loadedFirst) {
        return(
            <Loading />
        )
    } else {
        return (
        <KeyboardAvoidingView className="h-full" style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View className="h-full bg-primary flex-1">
                <View>
                    <View style={styles.box}  className="flex-row z-20 justify-between bg-oBlack p-4 relative border-b border-black-200">
                        <View className="flex-row gap-2 items-center">
                            <View className="mr-2">
                                <TouchableOpacity onPress={() => router.back()}>
                                    <Image 
                                        source={icons.leftArrow}
                                        className="h-6 w-6"
                                        resizeMode='contain'
                                        tintColor={"#ff9c01"}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View>
                                <Image 
                                    source={{ uri: conversation?.receiverProfilePic || icons.profile}}
                                    className="h-8 w-8 rounded-full"
                                    resizeMode='cover'
                                />
                            </View>
                            <View>
                                <Text className="text-white font-psemibold text-base">{conversation?.receiverFirstname} {conversation?.receiverLastname}</Text>
                            </View>
                        </View>

                        <View>
                            <TouchableOpacity onPress={() => setOpenMoreDetails(!openMoreDetails)}>
                                <Image 
                                    source={icons.more}
                                    className="h-8 w-8"
                                    resizeMode='contain'
                                    tintColor={"#ff9c01"}
                                />
                            </TouchableOpacity>
                        </View>

                        {openMoreDetails && <View className="absolute bg-oBlack right-6 p-2 z-20 rounded-[5px] border-black-200 border mt-[45px]">
                            <View className="border-b border-black-200">
                                <TouchableOpacity className="flex-row items-center" onPress={() => router.replace(`/users/${conversation?.conversation}`)}>
                                    <Text className="text-white p-1 font-pregular">Shikoni profilin</Text>
                                    <Image 
                                        source={icons.profile}
                                        className="h-4 w-4"
                                        resizeMode='contain'
                                    />
                                </TouchableOpacity>
                            </View>
                            <View className="border-b border-black-200">
                                <TouchableOpacity className="flex-row items-center">
                                    <Text className="text-white p-1 font-pregular">Se shpejti...</Text>
                                    <Image 
                                        source={icons.profile}
                                        className="h-4 w-4"
                                        resizeMode='contain'
                                    />
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity className="flex-row items-center">
                                    <Text className="text-white p-1 font-pregular">Se shpejti...</Text>
                                    <Image 
                                        source={icons.profile}
                                        className="h-4 w-4"
                                        resizeMode='contain'
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>}
                    </View>
                </View>
                <View className="flex-1">
                    <FlatList
                        // refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={isRefreshing}/>}
                        // className="flex-1"
                        extraScrollHeight={15}
                        ref={flatListRef}
                        onEndReached={onEndReached}
                        onEndReachedThreshold={0.1}
                        inverted //per me shku bot
                        data={messages?.messages} //per me reverse .reverse()
                        keyExtractor={(item) => 'chat-' + item?.id}
                        renderItem={({item}) => (
                            <SenderReceiverChat
                                renderItem={item}
                                currentUser={user?.data?.userData}
                                conversationUserData={conversation}
                            />
                        )}
                        ListFooterComponent={() => (
                            (messages?.messages?.length > 0 && (
                                (messages.hasMore && isLoadingMore ? (
                                    <View className="px-4 justify-center py-2 flex-row items-center gap-2">
                                        <Text className="text-white font-psemibold text-sm">Ju lutem prisni...</Text>
                                        <ActivityIndicator color={"#FF9C01"} size={24} />
                                    </View>
                                ) : (
                                    <View className="px-4 justify-center py-2 flex-row items-center gap-2">
                                        <Text className="text-white font-psemibold text-sm">Nuk ka me mesazhe...</Text>
                                        <Image
                                            source={images.breakHeart}
                                            className="size-5"
                                            tintColor={"#FF9C01"}
                                            resizeMode='contain'
                                        />
                                    </View>
                                ))
                            ))
                        )}
                        contentContainerStyle={{ flexGrow: 1, gap: 14, paddingTop: 12, paddingBottom: 16, justifyContent: 'flex-end'  }} //flexDirection: 'column-reverse' per me shku bot 
                    />
                </View>
                <View className={`relative ${textInputFocused ? "mb-24" : ""}`}>

                    {/* fotoja apo dokumenti zgjedhur */}
                    {image.type !== '' && image.base64 !== '' && <View className="absolute gap-4 items-center justify-center right-[8px] bottom-0 mb-[84px] bg-oBlack z-20 border border-black-200 rounded-[5px] p-4 w-[160px]">
                        <View>
                            {image.type.includes('image') ? (
                                <Image 
                                source={{ uri: `${image.type}${image.base64}` }}
                                className="h-24 w-32 rounded-[2px]"
                                resizeMode='cover'
                            />
                            ) : (  
                                <Image 
                                    source={icons.documents}
                                    className="h-20 rounded-[2px]"
                                    resizeMode='contain'
                                    tintColor={"#fff"}
                                />
                            )}
                        </View>
                        <View>
                            <Text className="text-white font-pmedium text-center text-xs" numberOfLines={2}>{image.fileName || 'random'}</Text>
                        </View>
                        <View className="absolute -right-1 -top-1">
                            <TouchableOpacity className="bg-white p-1.5 rounded-full overflow-hidden" onPress={deleteImage}>
                                <Image 
                                    source={icons.close}
                                    tintColor={"#000"}
                                    className="w-2 h-2"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>}
                    {/* fotoja apo dokumenti zgjedhur */}

                    <View className="bg-oBlack p-4 h-[76px] flex-row items-start justify-center gap-4 border-t border-black-200">
                        <View className="items-center flex-row gap-4">
                            <View className="flex-row items-center gap-2">
                                <View>
                                    <TouchableOpacity onPress={sendImage}>
                                        <Image
                                            source={icons.imageGallery}
                                            className="h-6 w-6"
                                            resizeMode='contain'
                                            tintColor={"#fff"}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <TouchableOpacity>
                                        <Image
                                            source={icons.microphone}
                                            className="h-6 w-6"
                                            resizeMode='contain'
                                            tintColor={"#fff"}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <TouchableOpacity onPress={pickDocument}>
                                        <Image 
                                            source={icons.documents}
                                            className="h-6 w-6"
                                            resizeMode='contain'
                                            tintColor={"#fff"}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View className="flex-1">
                                <TextInput
                                    ref={messageVal}
                                    className="bg-primary text-white border border-black-200 p-2 rounded-[5px]"
                                    placeholder='Shkruaj mesazhin ketu...'
                                    placeholderTextColor={"#414141"}
                                    // onChangeText={(text) => messageVal.text = text}
                                    onChangeText={(e) => setMessageSent(e)}
                                    value={messageSent}
                                    onSubmitEditing={() => sendMessage()}
                                    onFocus={() => setTextInputFocused(true)}
                                    onBlur={() => setTextInputFocused(false)}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
        )
    }
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
    container: {
        flex: 1,
        // padding:40,
        backgroundColor: "#000",
        // paddingBottom: 160
      },
      content: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
      },
})

export default Conversation