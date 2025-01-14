import { View, Text, Image, Platform, StyleSheet, TextInput, ScrollView, Modal, Pressable, TouchableWithoutFeedback, Touchable, KeyboardAvoidingView } from 'react-native'
import React, { useLayoutEffect, useRef } from 'react'
import { TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { getAllTagsWithChilds, getCourseCategories, reqCreatePost } from '../services/fetchingService'
import { FlatList } from 'react-native-gesture-handler'
import { useEffect } from 'react'
import { icons, images } from '../constants'
import * as Animatable from "react-native-animatable"
import * as ImagePicker from "expo-image-picker"
import NotifierComponent from './NotifierComponent'
import useFetchFunction from "../hooks/useFetchFunction"
import { flatMap, flatten, flattenDeep, noop } from 'lodash'

const AddBlogComponent = ({userData, getUserOutside}) => {
    const user = userData?.data?.userData
    
    const categories = userData?.data?.categories

    const [selectedCategory, setSelectedCategory] = useState(null)
    const {data: tagData, isLoading: tagLoading, refetch: tagRefetch} = useFetchFunction(selectedCategory !== null ? () => getAllTagsWithChilds(selectedCategory) : noop)
    const [openCategories, setOpenCategories] = useState(false)
    const [tagsData, setTagsData] = useState(null)
    const [openTags, setOpenTags] = useState(false)
    const [inputFocused, setInputFocused] = useState(false)

    const [openPostStatus, setOpenPostStatus] = useState(false)

    const [postStatus, setPostStatus] = useState(1)

    const [openTagDialog, setOpenTagDialog] = useState(false)
    const [allTags, setAllTags] = useState(true)
    const [addTags, setAddTags] = useState(false)

    const [writtenTags, setWrittenTags] = useState(null)
    const [outputTags, setOutputTags] = useState([])
    const [enteredOnce, setEnteredOnce] = useState(false)

    const [blogContent, setBlogContent] = useState('')
    const [title, setTitle] = useState('')

    const [tagsSelected, setTagsSelected] = useState([])
    const [imageSelected, setImageSelected] = useState({
        type: "",
        base64: "",
        image: null
    })

    const [imageHeight, setImageHeight] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);

    const handleLayout = (event) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width); // Save container width
    };

    useLayoutEffect(() => {
        if (containerWidth === 0) return; // Ensure container width is set

        if (imageSelected.image) {
            // Dynamically calculate height for remote images
            console.log('hini');
            
            Image.getSize(
                imageSelected.image,
                (width, height) => {
                    const calculatedHeight = (height / width) * containerWidth;
                    setImageHeight(calculatedHeight);
                    console.log(imageHeight);
                },
                (error) => console.error('Error fetching image size:', error)
            );
        } else if (images.testimage) {
            // Dynamically calculate height for local images
            const { width, height } = Image.resolveAssetSource(images.testimage);
            const calculatedHeight = (height / width) * containerWidth;
            setImageHeight(calculatedHeight);
        }
    }, [imageSelected, containerWidth])

    const selectTags = (item) => {
        console.log(item, ' item');
        
        setTagsSelected((prevData) => {
            const relatedChild = tagsData.filter(tag => tag.parent_Id === item.id)
            const childTag = tagsData.find(tag => tag.parent_Id === item.id)
            const relatedOthers = tagsData.filter(tag => tag.parent_Id === item.parent_Id && tag.id !== item.id)
            const getParent = tagsData.filter(tag => tag.id === item.parent_Id)
            if(prevData.some((tag => tag.id === item.id))){
                return prevData.filter(tag => tag.id !== item.id && !relatedChild.some(rt => rt.id === tag.id) && !relatedOthers);
            }else {
                if(item.isChild){
                    const newTags = [
                        ...prevData,
                        {id: item.id, name: item.name, isChild: true},
                        ...relatedOthers.map(tag => ({id: tag.id, name: tag.name, isChild: true})),
                        ...getParent.map(tag => ({id: tag.id, name: tag.name, isChild: false}))
                    ]
                    console.log(newTags, 'tags');
                    
                    return newTags;
                }else{        
                    const newTags = [
                        ...prevData,
                        {id: item.id, name: item.name, isChild: false},
                        ...relatedChild.map(tag => ({id: tag.id, name: tag.name, isChild: true}))    
                    ]
                    return newTags;
                }
            }
        })
    }

    const addImages = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if(!permissionResult){
            console.log("permission");
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4,3],
            quality: 0,
            base64: true
        })

        if(!result.canceled){
            setImageSelected((prevData) => ({
                ...prevData,
                type: `data:${result.assets[0].mimeType};base64,`,
                base64: result.assets[0].base64,
                image: result.assets[0].uri
            }))
        }
    }

    const addCameraImage = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if(!permissionResult){
            console.log("no persmission");
        }
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4,3],
            quality: 0,
            base64: true
        })
        if(!result.canceled){
            setImageSelected((prevData) => ({
                ...prevData,
                type: `data:${result.assets[0].mimeType};base64,`,
                base64: result.assets[0].base64,
                image: result.assets[0].uri
            }))
        }
    }


    const tagsexample = ["Tagu 1", "Tagu 2", "Tagu 3", "Tagu 4", "Tagu 5"]

    const blogContentRef = useRef(null)

    const removeTag = (tag) => {
        if(outputTags.includes(tag)){
            setOutputTags((prevData) => prevData.filter((item) => item !== tag));
        }
        setWrittenTags((prevWrittenTags) => {
            const regex = new RegExp(`\\b${tag}\\b`, 'g');
            return prevWrittenTags.replace(regex, '').replace(/\s{2,}/g, ' ').trim();
        })
    }

    const switchFromTitle = (e) => {
        if(e.nativeEvent.key === 'Enter' && !enteredOnce){
            setEnteredOnce(true);
            setTimeout(() => {
                if (blogContentRef.current) {
                    blogContentRef.current.focus();
                }
            }, 100);
        }
    }

    const {showNotification: successNotification} = NotifierComponent({
        title: "Blogu i postua me sukses",
        description: "Per te pare postimet e tua mund te drejtoheni tek pjesa e profilit!"
    })

    const {showNotification: failedNotification} = NotifierComponent({
        title: "Dicka shkoi gabim!",
        description: "Ju lutem provoni perseri ne krijimin e postimit tuaj apo kontaktoni Panelin e Ndihmes",
        alertType: "warning"
    })   

    const createBlog = async () => {
        let payload = {};
        console.log(outputTags.length);
        
        if(addTags && outputTags.length > 0){
            payload = {
                blogDto: {
                    title: title,
                    content: blogContent,
                    categoryId: selectedCategory,
                    status: postStatus,
                    userId: user.id
                },
                tagDto: {
                    name: outputTags[0],
                    parentId: null,
                    category_Id: selectedCategory,
                    children: outputTags.slice(1).map(tag => ({
                        name: tag,
                        category_Id: selectedCategory
                    }))
                }
            }
            console.log(payload.tagDto.children,  ' ???');
            
        }else if(allTags && tagsSelected.length > 0){
            payload = {
                blogDto: {
                    title: title,
                    content: blogContent,
                    categoryId: selectedCategory,
                    tagId: tagsSelected[0].id,
                    status: postStatus,
                    userId: user.id
                },
                // tagDto: {
                //     name: "",
                //     parentId: "",
                //     category_Id: selectedCategory,
                //     children: tagsSelected.map(tag => ({
                //         name: tag.name,
                //         category_Id: selectedCategory
                //     }))
                // }
            }
        }

        const response = await reqCreatePost(payload);
        
        if(response){
            successNotification()
        }else{
            failedNotification()
        }
    }

    const removeOpenedDialogs = () => {
        setOpenTagDialog(false)
        setOpenPostStatus(false)
    }

    useEffect(() => {
        if(writtenTags !== null){
            const words = writtenTags.trim().split(/\s+/);
            if(words){
              setOutputTags(words)
            }
        }
        if(writtenTags === '' || writtenTags === null){
            setOutputTags([])
        }
    }, [writtenTags])
    

    useEffect(() => {        
      if(getUserOutside === true){
        setInputFocused(false)
      }
    }, [getUserOutside])
    
    useEffect(() => {        
      if(tagData){
        const flatten = flatMap(tagData, parent => [
            parent,
            ...parent.children.map(child => ({
                ...child,
                isChild: true
            }))
        ])        
        console.log(flatten);
        
        setTagsData(flatten)
      }else{
        setTagsData(null)
      }
    }, [tagData])

    useEffect(() => {
        tagRefetch()
    }, [selectedCategory])
    
    
    
  return (
      <TouchableWithoutFeedback onPress={removeOpenedDialogs}>
            {/* <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "position" : "height"} keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}> */}
            <View 
                className="relative bg-oBlack border border-black-200 rounded-[10px] flex-1"
                style={styles.box}
                >
                <View className="absolute -right-2 -top-2">
                    <TouchableOpacity className="bg-secondary p-2">
                        <Image
                            source={icons.fullscreen}
                            className="h-6 w-6"
                            tintColor={"#fff"}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>

                {/* profile */}
                <View className="flex-row gap-4 items-center px-4 pt-4">
                    <View>
                        <Image 
                            source={{uri: user?.profilePictureUrl}}
                            className="h-16 w-16 rounded-full border border-black-200"
                            resizeMode='contain'
                        />
                    </View>
                    <View className="gap-2">
                        <View>
                            <Text className="text-white font-psemibold">{user?.firstname} {user?.lastname}</Text>
                        </View>
                        <TouchableOpacity onPress={() => setOpenPostStatus(true)}>
                            <View className="flex-row gap-2 items-center relative z-50">
                                <View>
                                    <Text className="text-gray-400 font-pregular text-sm">{postStatus === 1 ? "Publik" : postStatus === 2 ? "Privat" : "Miqte"}</Text>
                                </View>
                                <View>
                                    <Image 
                                        source={icons.earth}
                                        className="h-4 w-4"
                                        resizeMode="contain"
                                        tintColor={"#9ca3af"}
                                    />
                                </View>
                                {openPostStatus && <Animatable.View animation="bounceIn" className="absolute -right-16 -bottom-10 bg-oBlack z-50 border border-black-200 rounded-[5px]" style={styles.box}>
                                <TouchableOpacity onPress={() => {setOpenPostStatus(false); setPostStatus(1);}} className="p-1.5 mx-2 border-b border-black-200">
                                    <Text className="text-white font-plight text-sm text-center">Publik</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {setOpenPostStatus(false); setPostStatus(2);}} className="p-1.5 mx-2 border-b border-black-200">
                                    <Text className="text-white font-plight text-sm text-center">Privat</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {setOpenPostStatus(false); setPostStatus(3);}} className="p-1.5 mx-2">
                                    <Text className="text-white font-plight text-sm text-center">Vetem miqte</Text>
                                </TouchableOpacity>
                            </Animatable.View>}
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* content  */}
                <View className={`${inputFocused ? "" : "mb-2"} mt-4 px-4`}>
                    <TextInput 
                        className="text-xl font-pbold text-white -z-10"
                        placeholder='Cfare titulli?'
                        placeholderTextColor="#9ca3af"
                        onChangeText={(e) => setTitle(e)}
                        onKeyPress={switchFromTitle}
                        value={title}
                        onFocus={() => setInputFocused(true)}
                        onBlur={() => setEnteredOnce(true)}
                    />
                    {enteredOnce && <TextInput
                        ref={blogContentRef}
                        className="text-gray-200 text-sm font-psemibold p-2 pl-0 -z-10"
                        placeholder='Cfare keni ne mendje?'
                        placeholderTextColor="#9ca3af"
                        multiline={true}
                        value={blogContent}
                        onChangeText={(e) => setBlogContent(e)}
                        onFocus={() => setInputFocused(true)}
                        // onBlur={() => setInputFocused(false)}
                    />}
                </View>
                
                {/* photos */}
                {inputFocused && <View>

                {(imageSelected.image !== null) && <View className="relative w-full mt-6 border border-black-200" onLayout={handleLayout}>
                    <Image 
                        source={{uri: imageSelected.image}}
                        style={{width: "100%", height: imageHeight || "auto"}}
                        resizeMode='contain'
                        />
                    <TouchableOpacity
                        className="bg-secondary border border-white rounded-full p-2 absolute -top-2 -right-2"
                        onPress={() => setImageSelected({type: "", base64: "", image: null})}
                        >
                        <Image 
                            source={icons.close}
                            className="h-4 w-4"
                            resizeMode='contain'
                            tintColor={"#fff"}
                            />
                    </TouchableOpacity>
                    </View>}
                </View>}
                {/* photos */}
                {inputFocused && <Animatable.View animation="fadeIn">
                    {/* etiketimet kategorine */}
                    <View className="flex-row justify-between mt-4 gap-2 px-4">
                        <View className="flex-1">
                            <View className="mb-2">
                                <Text className="text-white font-psemibold text-xs">Kategorite</Text>
                            </View>
                            {selectedCategory === null && 
                            <TouchableOpacity onPress={() => setOpenCategories(!openCategories)} className="border border-black-200 rounded-[5px] p-2 px-4 self-start">
                                <Text className="font-plight text-gray-400 text-sm">Zgjidh kategorine</Text>    
                            </TouchableOpacity>}
                            {selectedCategory !== null && <TouchableOpacity onPress={() => setOpenCategories(!openCategories)} className="border border-black-200 rounded-[5px] self-start p-2 px-4">
                                <Text className="font-psemibold text-gray-400 text-sm">{getCourseCategories(categories, selectedCategory)}</Text>
                            </TouchableOpacity>}
                            {openCategories && <View className="p-2 border border-black-200 rounded-[5px] bottom-0 bg-oBlack mt-2" style={styles.box}>
                                <FlatList
                                    className="h-[60px]"
                                    scrollEnabled={true}
                                    data={categories || []}
                                    keyExtractor={(item) => `categories-${item.CategoryID}`}
                                    renderItem={({item}) => (
                                        <TouchableOpacity 
                                            className="p-1 border-b border-black-200"
                                            onPress={() => {setSelectedCategory(item?.CategoryID), setOpenCategories(false)}}
                                            >
                                            <Text className="text-gray-400 font-plight text-sm">{item?.categoryName}</Text>
                                        </TouchableOpacity>
                                    )}
                                    showsVerticalScrollIndicator
                                />
                            </View>}
                        </View>
                        <View className="flex-1 relative">
                            <TouchableOpacity className="mb-2" onPress={() => setOpenTagDialog(true)}>
                                <Text className="text-white font-psemibold text-xs text-right">Etiketimet
                                    <Animatable.Image
                                        animation="pulse"
                                        iterationCount="infinite" 
                                        source={icons.infoFilled}
                                        className="h-4 w-4"
                                        resizeMode='contain'
                                        tintColor={"#ff9c01"}
                                    />
                                </Text>
                            </TouchableOpacity>
                            {openTagDialog && <Animatable.View animation="bounceIn" className="absolute right-0 bg-oBlack z-50 border border-black-200 rounded-[5px]" style={styles.box}>
                                <TouchableOpacity onPress={() => {setAllTags(true); setAddTags(false); setOpenTagDialog(false);}} className="p-1.5 mx-2 border-b border-black-200">
                                    <Text className="text-white font-plight text-sm text-center">Te gjitha</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {setAddTags(true); setAllTags(false); setOpenTagDialog(false);}} className="p-1.5 mx-2">
                                    <Text className="text-white font-plight text-sm text-center">Shto etiketime</Text>
                                </TouchableOpacity>
                            </Animatable.View>}
                            {addTags && <View>
                                {outputTags.length > 0 && 
                                    <FlatList 
                                        className="h-[60px] border border-black-200 rounded-[5px]"
                                        scrollEnabled={true}
                                        horizontal={true}
                                        contentContainerStyle={{ flexDirection: "row", gap: 6, padding: 6, flexBasis: "auto"}}
                                        data={outputTags || []}
                                        keyExtractor={(item, index) => `tagu-${index}`}
                                        renderItem={({item, index}) => (
                                            <View className={`${index === 0 ? "bg-secondary !border-white" : ""} border relative border-black-200 rounded-[5px] self-start p-2 px-4`}>
                                                <Text className={`${index === 0 ? "!text-white font-psemibold" : ""} font-plight text-gray-400 text-xs`}>{item}</Text>
                                                <TouchableOpacity onPress={() => removeTag(item)} className={`absolute -top-0.5 -right-0.5 bg-secondary p-1 rounded-full ${index === 0 ? "border border-white" : ""}`}>
                                                    <Image 
                                                        source={icons.close}
                                                        className="h-2 w-2"
                                                        tintColor={"#fff"}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    />}
                                <View className={`${outputTags.length > 0 ? "mt-2" : ""} `}>
                                    <TextInput 
                                        className="border border-black-200 text-gray-400 rounded-[5px] p-2"
                                        placeholder='Etiketimet...'
                                        placeholderTextColor={"#9ca3af"}
                                        onChangeText={(e) => setWrittenTags(e)}
                                        value={writtenTags}
                                        />
                                </View>
                            </View>}
                            {allTags && <View>
                                <TouchableOpacity onPress={() => setOpenTags(!openTags)} className="border border-black-200 rounded-[5px] p-2 px-4 self-start ml-auto">
                                    <Text className="font-plight text-gray-400 text-sm">Zgjidh etiketimet</Text>    
                                </TouchableOpacity>

                                {/* ktu me qit tagat flatlist qe zgjedhen */}
                                {tagsSelected.length > 0 && <FlatList 
                                        className="h-[60px] border border-black-200 rounded-[5px]"
                                        scrollEnabled={true}
                                        horizontal={true}
                                        contentContainerStyle={{ flexDirection: "row", gap: 6, padding: 6, flexBasis: "auto"}}
                                        data={tagsSelected || []}
                                        keyExtractor={(item) => `tagunew-${item?.id}`}
                                        renderItem={({item, index}) => (
                                            <View className={`${item.isChild ? "" : "bg-secondary !border-white"} border relative border-black-200 rounded-[5px] self-start p-2 px-4`}>
                                                <Text className={`${item.isChild ? "" : "!text-white font-psemibold"} font-plight text-gray-400 text-xs`}>{item?.name}</Text>
                                            </View>
                                        )}
                                    />}
                                {openTags && <View className="p-2 border border-black-200 rounded-[5px] bottom-0 bg-oBlack mt-2" style={styles.box}>
                                    <FlatList
                                        className="h-[60px]"
                                        scrollEnabled={true}
                                        data={tagsData || []}
                                        keyExtractor={(item) => `selectTags-${item?.id}`}
                                        renderItem={({item}) => (
                                            <TouchableOpacity 
                                                className="p-1 py-1.5 border-b border-black-200 relative"
                                                onPress={() => {selectTags(item)}}
                                                >
                                                <Text className="text-gray-400 font-plight text-sm">{item?.name}</Text>
                                                {tagsSelected.some(tag => tag.id === item.id) && <Image 
                                                    source={icons.tick}
                                                    resizeMode='contain'
                                                    className="w-4 h-4 absolute right-0 top-1.5"
                                                    tintColor={"#ff9c01"}
                                                />}
                                            </TouchableOpacity>
                                        )}
                                        ListEmptyComponent={() => (
                                            <View className="items-center justify-center m-auto content-center">
                                                <Text className="text-white text-sm font-psemibold">Ju lutem zgjidhni nje kategori</Text>
                                            </View>
                                        )}
                                        showsVerticalScrollIndicator
                                    />
                                </View>}
                            </View>}
                        </View>
                    </View>

                    {/* status and photos  */}
                    <View className="flex-row bg-primary justify-between items-center mt-4 p-4 rounded-b-[10px] border-t border-black-200" style={styles.box}>
                        <View className="flex-row items-center gap-4" >
                            <TouchableOpacity onPress={addImages}>
                                <Image 
                                    source={icons.imageGallery}
                                    className="h-6 w-6"
                                    resizeMode='contain'
                                    tintColor={"#9ca3af"}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={addCameraImage}>
                                <Image 
                                    source={icons.camera}
                                    className="h-6 w-6"
                                    resizeMode='contain'
                                    tintColor={"#9ca3af"}
                                />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => setOpenPostStatus(true)} className="flex-row gap-2 items-center">
                            <Image 
                                source={icons.earth}
                                className="h-6 w-6"
                                resizeMode="contain"
                                tintColor={"#9ca3af"}
                            />
                            <Text className="text-gray-400 font-pregular text-sm">{postStatus === 1 ? "Publik" : postStatus === 2 ? "Privat" : "Miqte"}</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="absolute bottom-0 right-0 left-0 bg-white self-start h-[0px]" >
                        <TouchableOpacity onPress={createBlog} className="bg-secondary px-4 justify-center items-center mx-auto h-10 -mt-6 rounded-[2px]" >
                            <Text className="text-white font-pmedium text-sm">Postoni</Text>
                        </TouchableOpacity>
                    </View>
                </Animatable.View>}
            </View>
            {/* </KeyboardAvoidingView> */}
        </TouchableWithoutFeedback>
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
  container: {
    flex: 1,
    // padding:40,
    // paddingBottom: 50
    // backgroundColor: "#000",
    // paddingBottom: 160
  },
  });
export default AddBlogComponent