import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, Modal } from 'react-native'
import React, { useRef, useState } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import { icons, images } from '../constants'
import { Platform } from 'react-native'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'
import * as Animatable from "react-native-animatable"
import * as ImagePicker from "expo-image-picker"
import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system';
import Loading from './Loading'
import useFetchFunction from '../hooks/useFetchFunction'
import { createBlogComment, getCommentsByBlog, reqGetAllUserTypes, reqLikeBlog, reqLikeBlogComment } from '../services/fetchingService'
import _ from 'lodash'
import { useEffect } from 'react'
import NotifierComponent from './NotifierComponent'

const BlogCardInteractions = ({blog, userData, fullBlogSection = false}) => {
    const user = userData?.data?.userData;
    
    const [openComments, setOpenComments] = useState(fullBlogSection === true ? true : false)
    const [commentWritten, setCommentWritten] = useState("")
    const [commentData, setCommentData] = useState([])
    const [hasMore, setHasMore] = useState(false)
    const [replyComment, setReplyComment] = useState('')

    const [pagination, setPagination] = useState({
        pageNumber: 1,
        pageSize: 15
    })

    const [blogTemporaryLike, setBlogTemporaryLike] = useState(blog?.isLiked)
    const [commentTemporaryLike, setCommentTemporaryLike] = useState([])

    const [sendToFriends, setSendToFriends] = useState(false)
    const [friendsData, setFriendsData] = useState([])

    const commentsRef = useRef(null)

    const [openReplies, setOpenReplies] = useState([])
    const [pickedItem, setPickedItem] = useState({
        type: "",
        base64: "",
        fileName: ""
    })

    const handleReplies = (index) => {
        setOpenReplies((prevData) => {
            if(prevData.includes(index)){
                const newArray = prevData.filter(idx => idx !== index)
                return newArray
            }else{
                return [...prevData, index]
            }
        })
    }

    const getAllRepliesWithDepth = (data, depth = 0) => {
        return data.map(item => {
            const replies = item.replies || [];
            const updatedItem = {...item, depth};
            return [updatedItem, ...getAllRepliesWithDepth(replies, depth + 1)]
        })
    }

    const handleCommentVisibility = async () => {
        await getComments()
        setOpenComments(!openComments)
    }

    useEffect(() => {
      if(fullBlogSection){
        getComments()
      }
    }, [fullBlogSection])
    
    useEffect(() => {
      getComments();
    }, [pagination.pageNumber])
    

    const getComments = async () => {
        const response = await getCommentsByBlog(blog.id, user.id, fullBlogComments, pagination)
        if(response){
            // console.log(response, ' komente')
            setCommentData(_.flattenDeep(getAllRepliesWithDepth(response.blogComments)))
            setHasMore(response.hasMore)

        }else{
            setCommentData([])
            setHasMore(false)
        }
    }

    const {showNotification: successComment} = NotifierComponent({
        title: "Sapo keni komentuar me sukses",
    })
    const {showNotification: unsuccessfulComment} = NotifierComponent({
        title: "Dicka shkoi gabim",
        description: "Ne krijimin e komentit tuaj dicka shkoi gabim. Ju lutem provoni perseri",
        alertType: "warning"
    })

    const createComment = async (parentId) => {
        let payload = {
            blogId: blog.id,
            comment_Content: parentId ? replyComment : commentWritten,
            base64Data: pickedItem.base64 !== "" ? `${base64Data.type}${base64Data.base64}` : null,
            parentId: parentId || null,
            userId: user.id
        }
        console.log(payload);
        
        
        const response = await createBlogComment(payload);
        if(response === 200){
            successComment()
            await getComments();
            commentsRef?.current?.scrollToEnd({animated: true});
            setCommentWritten("")
            setReplyComment("")
            blog.commentsCount = blog.commentsCount + 1
            setOpenReplies([])
        }else{
            unsuccessfulComment()
        }
    }
    
    
    const deleteItem = () => {
        setPickedItem({
            type: "",
            base64: "",
            fileName: ""
        })
    }

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({type: '*/*',})

            if(!result.canceled){

                const base64string = await FileSystem.readAsStringAsync(result.assets[0].uri)

                setPickedItem((prevData) => ({
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

    const openCamera = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync()
        if(!permissionResult){
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0,
            base64: true
        })

        // console.log(result);
        

        if(!result.canceled){
            setPickedItem((prevData) => ({
                ...prevData,
                type: `data:${result.assets[0].mimeType};base64,`,
                base64: result.assets[0].base64,
                fileName: result.assets[0].fileName
            }))
            // console.log(image);
        }
    }
    const addImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if(!permissionResult){
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0,
            base64: true
        })

        // console.log(result);
        

        if(!result.canceled){
            setPickedItem((prevData) => ({
                ...prevData,
                type: `data:${result.assets[0].mimeType};base64,`,
                base64: result.assets[0].base64,
                fileName: result.assets[0].fileName
            }))
            // console.log(image);
        }
    }
    
    const {showNotification: unsuccessBlogLike} = NotifierComponent({
        title: "Dicka shkoi gabim",
        description: "Dicka shkoi gabim ne ndryshimin e statutit te pelqimit, provoni perseri!",
        alertType: "warning"
    })

    const likeBlog = async (blogId, userId) => {
        const response = await reqLikeBlog(blogId, userId)
        console.log(response);
        
        if(response.message === "LikeAdd"){
            setBlogTemporaryLike(true)
        }else if(response.message === "LikeRemove"){
            setBlogTemporaryLike(false)
        }else{
            unsuccessBlogLike()
        }
    }

    const likeBlogComment = async (commentId, userId, blogId) => {        
        const response = await reqLikeBlogComment(commentId, userId, blogId)
        console.log(response);
        
        if(response.message === "LikeAdd"){
            // await getComments();
            setCommentTemporaryLike((prevData) => [...prevData, commentId])
        }else if(response.message === "LikeRemove"){
            setCommentTemporaryLike((prevData) => {
                if(prevData.includes(commentId)){
                    return prevData.filter((idx) => idx !== commentId)
                }
            })
        }else{
            unsuccessBlogLike();
        }
    }

    const [allFriendsLoading, setAllFriendsLoading] = useState(false)

    const getAllFriends = async () => {
        setAllFriendsLoading(true)
        const response = await reqGetAllUserTypes(user.id, 1);
        if(response){
            setFriendsData(response)
        }else{
            setFriendsData([])
        }
        setAllFriendsLoading(false)
    }

    useEffect(() => {
      if(sendToFriends){
        getAllFriends()
      }
    }, [sendToFriends])
    

  return (
    <>
    <View className="flex-1">
        <View className="flex-row items-center justify-center gap-4 bg-primary mx-4 -mb-4 z-50 border border-black-200 rounded-[5px] flex-1" style={styles.box}>
            <View className="border-r pr-1.5 border-black-200 flex-1">
                <TouchableOpacity onPress={() => likeBlog(blog?.id, user?.id)} className="flex-row items-center justify-center gap-1.5 py-2">
                    <Text className={`${(blog?.isLiked || blogTemporaryLike) ? "text-secondary" : "text-white"} font-psemibold text-xs`}>{(blog?.isLiked || blogTemporaryLike) ? "I pelqyer" : "Pelqeni"}</Text>
                    <View className="relative">
                        <View>
                        <Image
                            source={icons.star}
                            className="w-4 h-4 mb-0.5"
                            resizeMode='contain'
                            tintColor={`${(blog?.isLiked || blogTemporaryLike) ? "#FF9C01" : "#fff"}`}
                        />
                        </View>
                        <View className="absolute -right-2 left-0 -bottom-2 items-center justify-center">
                            <Text className={`${(blog?.isLiked || blogTemporaryLike) ? "text-white" : "text-secondary"} font-psemibold text-sm`}>{(blogTemporaryLike || blog?.isLiked) ? blog?.likes + 1 : blog?.likes}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
            <View className="border-r pr-1.5 border-black-200 items-center flex-1 justify-center">
                <TouchableOpacity onPress={() => handleCommentVisibility()} className="flex-row items-center justify-center gap-1.5 py-2">
                    <Text className={`${openComments ? "text-secondary" : "text-white"}  font-psemibold text-xs`}>Komentoni</Text>
                    <View className="relative">
                        <View>
                        <Image
                            source={icons.chat}
                            className="w-4 h-4 mb-0.5"
                            resizeMode='contain'
                            tintColor={openComments ? "#FF9C01" : "#fff"}
                        />
                        </View>
                        <View className="absolute -right-2 left-0 -bottom-2 items-center justify-center">
                            <Text className={`${openComments ? "text-white" : "text-secondary"} font-psemibold text-sm`}>{blog?.commentsCount}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
            <View className="items-center justify-center flex-1">
                <TouchableOpacity onPress={() => setSendToFriends(true)} className="flex-row items-center justify-center gap-1.5 py-2">
                    <Text className="text-white font-psemibold text-xs">Shperndaje</Text>
                    <Image 
                        source={icons.friends}
                        className="w-4 h-4 mb-0.5"
                        resizeMode='contain'
                        tintColor={"#fff"}
                    />
                </TouchableOpacity>
            </View>
        </View>
        {openComments && <Animatable.View animation="fadeIn" className={`mt-6 bg-primary mx-4 rounded-[5px] border border-black-200 flex-1 ${commentData?.length > 0 ? "h-[300px]" : "h-auto"}`}>
            <FlatList
                ref={commentsRef}
                data={commentData}
                showsVerticalScrollIndicator={true}
                className="z-20"
                nestedScrollEnabled={true}
                contentContainerStyle={{gap:10}}
                scrollEnabled={true}
                keyExtractor={(item) => `comment-${item.commentId}`}
                renderItem={({item, index}) => {

                    const date = new Date(item?.createdAt);
                    const formattedDate = date.toLocaleDateString('sq-AL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        });
                    
                    const getParentId = commentData.find((comment) => comment.commentId === item.parentId);
                    // console.log(getParentId, ' parent');
                    
                    return (
                        <>
                        <View style={styles.box} className={`${item.depth === 1 ? "ml-8" : item.depth > 1 ? "ml-16" : ""} flex-row h-full gap-4 flex-1 bg-oBlack m-2 mb-0.5 items-center p-4 pt-3 border border-black-200 rounded-[5px]`}>
                            <View>
                                <Image 
                                    source={{uri: item.user.profilePicture}}
                                    className="h-10 w-10 rounded-full"
                                    resizeMode='contain'
                                />
                            </View>
                            <View className="flex-1 justify-center relative">
                                <View className="flex-1 justify-center">
                                    <Text className="font-psemibold text-base text-white">{item.user.name}</Text>
                                </View>
                                <View className="flex-1 mb-1">
                                    <Text className="font-plight text-gray-400 text-xs">{getParentId ? <><Text className="font-psemibold text-secondary">@{getParentId.user.name}</Text> {item.comment_Content}</> : item.comment_Content}</Text>
                                </View>

                            <View className="absolute left-0 flex-row gap-4 -bottom-5 -mb-1">
                                <View style={styles.box}>
                                    <TouchableOpacity onPress={() => likeBlogComment(item.commentId, user.id, blog.id)} className={`${(item.isLiked || commentTemporaryLike.includes(item.commentId)) ? "bg-secondary" : "bg-oBlack"} relative border border-black-200 rounded-[5px] py-0.5 px-1.5 items-center flex-row gap-0.5`}>
                                        <Text className={`font-pmedium text-xs text-white`}>{(item.isLiked || commentTemporaryLike.includes(item.commentId)) ? "Pelqyer" : "Pelqe"}</Text>                                            
                                            <Image 
                                                source={icons.star}
                                                className="h-4 w-4"
                                                resizeMode='contain'
                                                tintColor={"#fff"}
                                            />
                                            <View className="absolute right-1 -bottom-2 items-center justify-center">
                                                <Text className={`${(item.isLiked || commentTemporaryLike.includes(item.commentId)) ? "text-white" : "text-secondary"} z-50 font-psemibold text-xs`}>{commentTemporaryLike.includes(item.commentId) ? item.likes + 1 : item.likes}</Text>
                                            </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.box}>
                                    <TouchableOpacity onPress={() => handleReplies(item.commentId)} className={`${openReplies.includes(item.commentId) ? "bg-secondary" : "bg-oBlack"}  border border-black-200 rounded-[5px] py-0.5 px-1.5 items-center flex-row gap-0.5`}>
                                        <Text className="font-pmedium text-xs text-white">Repliko</Text>
                                        <Image
                                            source={icons.chat}
                                            className="h-4 w-4"
                                            resizeMode='contain'
                                            tintColor={"#fff"}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View className="absolute -right-5 -top-4" style={styles.box}>
                                <TouchableOpacity className="bg-primary border border-black-200 rounded-[5px] px-2 py-1">
                                    <Text className="text-white font-plight text-xs">{formattedDate}</Text>
                                </TouchableOpacity>
                            </View>

                            </View>
                        </View>

                            {/* replies */}
                        {openReplies.includes(item.commentId) && (<View className={`${item.depth === 0 ? "ml-4" : item.depth === 1 ? "ml-12" : "ml-20"} flex-row items-center gap-4 bg-primary border rounded-[5px] border-black-200 p-3 pt-4 pb-2 m-2 mt-4 relative`} style={styles.box}>
                            <View className="absolute -right-2 -top-2 bg-oBlack border gap-1  p-1 border-black-200 rounded-[5px] flex-row items-center">
                                <View>
                                    <Image source={icons.upArrow} className="h-4 w-4" tintColor={"#fff"}/>
                                </View>
                                <View>
                                    <Text className="font-psemibold text-secondary text-xs">{item.user.name}</Text>
                                </View>
                            </View>
                            <View className="items-center justify-center">
                                <Image 
                                    source={{uri: user.profilePictureUrl}}
                                    className="h-10 w-10 rounded-full"
                                />
                            </View>
                            <View className="flex-1 gap-2">
                                <Text className="font-psemibold text-base text-white">{user.firstname} {user.lastname}</Text>
                                <TextInput 
                                    className="border text-gray-400 font-plight text-xs border-black-200 bg-oBlack rounded-[5px] p-2 flex-1"
                                    placeholder={`Replikoni tek ${item.user.name}`}
                                    value={replyComment}
                                    onChangeText={(e) => setReplyComment(e)}
                                    placeholderTextColor={"#4b5563"}
                                    onSubmitEditing={() => createComment(item.commentId)}
                                />
                            </View>
                        </View>)}
                        </>
                    )
                }}
                ListFooterComponent={() => (
                    ((hasMore && !fullBlogSection) && <View className="m-2">
                        <TouchableOpacity onPress={() => setPagination((prevValue) => ({...prevValue, pageNumber: prevValue.pageNumber + 1}))}>
                            <Text className="text-secondary text-xs font-psemibold">Shfaq me shume</Text>
                        </TouchableOpacity>
                    </View>)
                )}
                ListEmptyComponent={() => (
                    <View className="p-2 mt-4">
                        <Text className="text-secondary text-center font-psemibold text-sm">Nuk ka ende komente, shpreh mendimin tuaj ketu!</Text>
                    </View>
                )}
            />
            <View className="bg-oBlack border-t px-2 py-3 rounded-b-[5px] z-50 border-black-200 gap-4 flex-row relative" style={styles.box}>

                {pickedItem.type !== '' && pickedItem.base64 !== '' && <View className="absolute z-50 gap-4 items-center justify-center right-[8px] bottom-[44] bg-oBlack border border-black-200 rounded-[5px] p-4 w-[160px]">
                <View>
                    {pickedItem.type.includes('image') ? (
                        <Image 
                        source={{ uri: `${pickedItem.type}${pickedItem.base64}` }}
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
                        <Text className="text-white font-pmedium text-center text-xs" numberOfLines={2}>{pickedItem.fileName || 'random'}</Text>
                    </View>
                    <View className="absolute -right-1 -top-1">
                        <TouchableOpacity className="bg-white p-1.5 rounded-full overflow-hidden" onPress={deleteItem}>
                            <Image
                                source={icons.close}
                                tintColor={"#000"}
                                className="w-2 h-2"
                            />
                        </TouchableOpacity>
                    </View>
                </View>}

                <View className="items-center flex-row gap-3">
                    <TouchableOpacity onPress={addImage}>
                        <Image 
                            source={icons.imageGallery}
                            className="h-5 w-5"
                            resizeMode='contain'
                            tintColor={"#fff"}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={openCamera}>
                        <Image 
                            source={icons.camera}
                            className="h-5 w-5"
                            resizeMode='contain'
                            tintColor={"#fff"}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={pickDocument}>
                        <Image 
                            source={icons.documents}
                            className="h-5 w-5"
                            resizeMode='contain'
                            tintColor={"#fff"}
                        />
                    </TouchableOpacity>
                </View>
                <View className="flex-1">
                    <TextInput 
                        className="text-white font-pmedium text-sm border border-black-200 rounded-[5px] p-1 bg-primary"
                        placeholder='Shkruani nje koment...'
                        onChangeText={(e) => setCommentWritten(e)}
                        value={commentWritten}
                        onSubmitEditing={() => createComment(null)}
                    />
                </View>
            </View>
        </Animatable.View>}
        
    </View>
    <Modal
        visible={sendToFriends}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSendToFriends(false)}
    >
        <View className="flex-1 justify-center items-center" style={{backgroundColor: "rgba(0,0,0,0.4)"}}>
            <View className="h-[80%] w-[80%] bg-primary rounded-[10px] border border-black-200" style={styles.box}>
                {allFriendsLoading && <Loading />}
                {!allFriendsLoading && <View className="flex-1 justify-between">
                    <View className="flex-1">
                        <FlatList 
                            data={friendsData}
                            contentContainerStyle={{flexGrow: 1, gap:10, padding:10}}
                            ListHeaderComponent={() => (
                            <View className="pb-6">
                                <Text className="font-psemibold text-2xl text-white">Lista e miqve
                                    <View>
                                        <Image 
                                            source={images.path}
                                            className="h-auto w-[100px] absolute -bottom-8 -left-12"
                                            resizeMode='contain'
                                        />
                                    </View>
                                </Text>
                            </View>
                            )}
                            keyExtractor={(item) => `friends-${item.id}`}
                            renderItem={({item}) => {
                                // console.log(item);
                                return (
                                    <TouchableOpacity className="bg-oBlack border p-3 border-black-200 rounded-[5px] flex-row items-center justify-between" style={styles.box}>
                                        <View className="flex-row items-center gap-4">
                                            <View>
                                                <Image 
                                                    source={{uri: item.profilePictureUrl}}
                                                    className="h-14 w-14 rounded-full border border-black-200"
                                                    resizeMode='contain'
                                                />
                                            </View>
                                            <View>  
                                                <Text className="text-white font-psemibold text-sm">{item.firstname} {item.lastname}</Text>
                                                <Text className="text-gray-400 font-plight text-xs">{item.username}</Text>
                                                <Text className="text-secondary font-plight text-xs">Mik</Text>
                                            </View>
                                        </View>
                                        <View>
                                            <Image 
                                                source={icons.rightArrow}
                                                className="h-4 w-4"
                                                tintColor={"#FF9C01"}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                )
                            }}
                        />
                        <TouchableOpacity className="items-center p-4 justify-center bg-oBlack border-t border-black-200" onPress={() => setSendToFriends(false)}>
                            <Text className="font-pregular text-white text-sm">Largoni dritaren</Text>
                        </TouchableOpacity>
                    </View>
                </View>}
            </View>
        </View>
    </Modal>
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
export default BlogCardInteractions