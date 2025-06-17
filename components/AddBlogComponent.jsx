import { View, Text, Image, Platform, StyleSheet, TextInput, ScrollView, Modal, Pressable, TouchableWithoutFeedback, Touchable, KeyboardAvoidingView } from 'react-native'
import React, { useCallback, useLayoutEffect, useMemo, useRef } from 'react'
import { TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { getAllBlogTags, getCourseCategories, reqCreatePost } from '../services/fetchingService'
import { FlatList } from 'react-native-gesture-handler'
import { useEffect } from 'react'
import { icons, images } from '../constants'
import * as Animatable from "react-native-animatable"
import * as ImagePicker from "expo-image-picker"
import NotifierComponent from './NotifierComponent'
import useFetchFunction from "../hooks/useFetchFunction"
import _, { flatMap, flatten, flattenDeep, noop } from 'lodash'
import FullScreenImage from './FullScreenImage'

const AddBlogComponent = ({userData, getUserOutside, sendRefreshCall}) => {

    //tagsselected is select by click from all tags,
    //outputtags is written

    const user = userData?.data?.userData
    
    const categories = userData?.data?.categories

    const [selectedCategory, setSelectedCategory] = useState(null)
    const {data: tagData, isLoading: tagLoading, refetch: tagRefetch} = useFetchFunction(() => getAllBlogTags(searchTagQuery))
    const [searchTagQuery, setSearchTagQuery] = useState("")
    const [openCategories, setOpenCategories] = useState(false)
    const [tagsData, setTagsData] = useState([])
    const [openTags, setOpenTags] = useState(false)
    const [inputFocused, setInputFocused] = useState(false)

    const [openPostStatus, setOpenPostStatus] = useState(false)

    const [postStatus, setPostStatus] = useState(1)

    const [openTagDialog, setOpenTagDialog] = useState(false)
    const [allTags, setAllTags] = useState(true)
    const [addTags, setAddTags] = useState(false)

    const [blogCreating, setBlogCreating] = useState(false)

    const [writtenTags, setWrittenTags] = useState(null)
    const [outputTags, setOutputTags] = useState([])
    const [enteredOnce, setEnteredOnce] = useState(false)

    const [blogContent, setBlogContent] = useState('')
    const [title, setTitle] = useState('')

    const [tagsSelected, setTagsSelected] = useState([])

    const [imagesSelected, setImagesSelected] = useState([])

    const [fullscreenModalOptions, setFullscreenModalOptions] = useState({
        visible: false,
        images: [],
        index: 0
    })

    const [makeCreateBlogFullscreen, setMakeCreateBlogFullscreen] = useState(false)

    const [imageHeight, setImageHeight] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);

    const handleLayout = (event) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width); // Save container width
    };

    const selectTags = (item) => {
        setTagsSelected((prev) => {
            const exists = prev.some(tag => tag.id === item.id)
            if(exists){
                return prev.filter(tag => tag.id !== item.id)
            }else{
                return [...prev, item];
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
            // allowsEditing: true,
            allowsMultipleSelection: true,
            aspect: [4,3],
            quality: 0,
            base64: true
        })
        // console.log(result);
        

        if(!result.canceled){
            const selectedImages = result.assets.map((image) => ({
                type: `data:${image.mimeType};base64,`,
                base64: image.base64,
                image: image.uri
            }))
            
            setImagesSelected(selectedImages)
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
            const newImage = [{
                type: `data:${result.assets[0].mimeType};base64,`,
                base64: result.assets[0].base64,
                image: result.assets[0].uri
            }]
            setImagesSelected(newImage)
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

    const {showNotification: titleContentError} = NotifierComponent({
        title: "Dicka shkoi gabim!",
        description: "Ju lutem mbushni titullin dhe permbajtjen e blogut",
        alertType: "warning"
    })   
    const {showNotification: tagsSelectedError} = NotifierComponent({
        title: "Dicka shkoi gabim!",
        description: "Ju lutem zgjidhni nje ose me shume etiketime, apo krijoni tuajat",
        alertType: "warning"
    })   
    const {showNotification: outputTagsError} = NotifierComponent({
        title: "Dicka shkoi gabim!",
        description: "Ju lutem shkruani nje ose me shume etiketime, apo zgjidhni nga egzistueset",
        alertType: "warning"
    })   

    const createBlog = async () => {
        
        
        if(title.trim() === "" || title.trim() === null){
            titleContentError()
            return;
        }
        if(allTags && tagsSelected.length === 0){
            tagsSelectedError()
            return;
        }
        if(addTags && outputTags.length === 0){
            outputTagsError()
            return;
        }
        setBlogCreating(true)
        
        let theTags = []

        if(addTags){
            const writtenTags = outputTags.map(tag => ({name: tag}));
            theTags = writtenTags;
        }else if(allTags){
            const selectedTags = tagsSelected.map(tag => ({name: tag.name}));
            theTags = selectedTags
        }
        
        const payload = {
            title: title,
            categoryId: selectedCategory,
            userId: user.id,
            status: postStatus,
            content: blogContent,
            images: imagesSelected.length > 0 ? imagesSelected.map(({type, base64 }) => ({image: type + base64})) : null,
            tags: theTags
        }

        console.log(payload, ' ??');
        const response = await reqCreatePost(payload);
                
        if(response){
            successNotification()
            sendRefreshCall();
            setTitle('');
            setBlogContent('');
            setImagesSelected([]);
            setTagsSelected([]);
            setOutputTags([]);
            setWrittenTags(null);
            setSelectedCategory(null);
        }else{
            failedNotification()
        }
        setBlogCreating(false)
    }

    const removeOpenedDialogs = () => {
        setOpenTagDialog(false)
        setOpenPostStatus(false)
    }

    const debounceTagsSearchingRef = useRef();
    const debounceTagsSearching = useMemo(() => {
        const fn = _.debounce((text) => setSearchTagQuery(text), 500)
        debounceTagsSearchingRef.current = fn;
        return fn;
    },[])
    
    useEffect(() => {
      tagRefetch();
    }, [searchTagQuery])
    

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
      setTagsData(tagData || [])
    }, [tagData])

    useEffect(() => {
      if(makeCreateBlogFullscreen){
        setEnteredOnce(true)
        setInputFocused(true)
        setOpenCategories(true)
        setOpenTags(true)
      }
    }, [makeCreateBlogFullscreen])
    

    useEffect(() => {
        tagRefetch()
        console.log(tagData)
    }, [selectedCategory])
    
    useEffect(() => {
      
      return () => {
        debounceTagsSearchingRef.current?.cancel();
      }
    }, [])
    
    const renderMainContent = () => (
        <View 
            className={`relative bg-oBlack border border-black-200 rounded-[10px] flex-1`}
            style={styles.box}
            >
            {!makeCreateBlogFullscreen && <View className="absolute -right-2 -top-2">
                <TouchableOpacity className="bg-secondary p-2" onPress={() => setMakeCreateBlogFullscreen(true)}>
                    <Image
                        source={icons.fullscreen}
                        className="h-6 w-6"
                        tintColor={"#fff"}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>}

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
                    <TouchableOpacity onPress={() => setOpenPostStatus(!openPostStatus)}>
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
                            {openPostStatus && <Animatable.View animation="bounceIn" className="absolute -right-16 -bottom-12 bg-oBlack z-50 border border-black-200 rounded-[5px]" style={styles.box}>
                            <TouchableOpacity onPress={() => {setOpenPostStatus(false); setPostStatus(1);}} className="p-1.5 justify-center mx-2 border-b border-black-200 flex-row items-center gap-2">
                                <Text className="text-white font-plight text-sm text-center">Publik</Text>
                                {postStatus === 1 && <Image 
                                    source={icons.tick}
                                    className="size-5"
                                    resizeMode='contain'
                                    tintColor={"#FF9C01"}
                                />}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {setOpenPostStatus(false); setPostStatus(2);}} className="p-1.5 mx-2 border-b border-black-200 flex-row items-center justify-center gap-2">
                                <Text className="text-white font-plight text-sm text-center">Privat</Text>
                                {postStatus === 2 && <Image 
                                    source={icons.tick}
                                    className="size-5"
                                    resizeMode='contain'
                                    tintColor={"#FF9C01"}
                                />}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {setOpenPostStatus(false); setPostStatus(3);}} className="p-1.5 mx-2 flex-row items-center justify-center gap-2">
                                <Text className="text-white font-plight text-sm text-center">Vetem miqte</Text>
                                {postStatus === 3 && <Image 
                                    source={icons.tick}
                                    className="size-5"
                                    resizeMode='contain'
                                    tintColor={"#FF9C01"}
                                />}
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
            {inputFocused && <View className={`${makeCreateBlogFullscreen ? "flex-1" : "flex-1"}`}>

            {(imagesSelected.length > 0) && <View className="relative flex-1 gap-2 flex-row w-full mt-6 border border-black-200" onLayout={handleLayout}>
                {imagesSelected.slice(0, 3).map((item, index) => (
                    <View key={`image-${index}`} className="flex-1">
                        <TouchableOpacity onPress={() => setFullscreenModalOptions((prev) => ({...prev, visible: true, images: imagesSelected.map(img => img.image), index: index}))}>
                            <Image
                                source={{uri: item.image}}
                                style={{width: "100%", height: 200}}
                                resizeMode='contain'
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-secondary border border-white rounded-full p-2 absolute -top-2 -right-2 z-50"
                            onPress={() => setImagesSelected((prevData) => prevData.filter((_, i) => i !== index))}
                            >
                            <Image 
                                source={icons.close}
                                className="h-4 w-4"
                                resizeMode='contain'
                                tintColor={"#fff"}
                                />
                        </TouchableOpacity>
                        {index === 2 && imagesSelected.length > 3 && (
                            <TouchableOpacity 
                                onPress={() => setFullscreenModalOptions((prev) => ({...prev, images: imagesSelected.map(img => img.image), index: 3, visible: true}))}
                                className="absolute inset-0 bg-black/50 flex items-center justify-center"
                            >
                                <Text className="text-white font-psemibold text-xl">+{imagesSelected.length - 3}</Text>
                                <Text className="text-white font-plight text-sm">Me shume</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))}
                
                </View>}
                {/* {imagesSelected.length > 3 && (
                    <TouchableOpacity  className="flex-1 bg-secondary border border-white p-2 items-center justify-center" style={styles.box}>
                        <Text className="text-white font-psemibold text-xl">+{imagesSelected.length - 3}</Text>
                        <Text className="text-white text-xs font-plight">Me shume</Text>
                    </TouchableOpacity>
                )} */}
            </View>}
            {/* photos */}
            {inputFocused && <Animatable.View animation="fadeIn">
                {/* etiketimet kategorine */}
                <View className="flex-row justify-between mt-4 gap-2 px-4">
                    <View className="flex-1">
                        <View className="mb-2">
                            <Text className="text-white font-psemibold text-xs">Kategorite</Text>
                        </View>
                        <View className="flex-row items-center gap-2">
                            {selectedCategory === null && 
                            <TouchableOpacity onPress={() => setOpenCategories(!openCategories)} className="border border-black-200 rounded-[5px] p-2 px-4 self-start">
                                <Text className="font-plight text-gray-400 text-sm">E pakategorizuar</Text>    
                            </TouchableOpacity>}
                            {selectedCategory !== null && <TouchableOpacity onPress={() => setOpenCategories(!openCategories)} className="border border-black-200 rounded-[5px] self-start p-2 px-4">
                                <Text className="font-psemibold text-gray-400 text-sm">{getCourseCategories(categories, selectedCategory)}</Text>
                            </TouchableOpacity>}
                            {selectedCategory !== null && <TouchableOpacity onPress={() => {setSelectedCategory(null); setOpenCategories(false)}}>
                                <Image 
                                    source={icons.close}
                                    className="w-3 h-3"
                                    resizeMode='contain'
                                    tintColor={"#FF9C01"}
                                />
                            </TouchableOpacity>}
                        </View>
                        {openCategories && <View className="p-2 border border-black-200 rounded-[5px] bottom-0 bg-oBlack mt-2" style={styles.box}>
                            <FlatList
                                className={`${makeCreateBlogFullscreen ? "h-[100px]" : "h-[60px]"}`}
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
                            <TouchableOpacity onPress={() => {setAllTags(true); setAddTags(false); setOpenTagDialog(false);}} className="p-1.5 flex-row items-center gap-2 justify-center mx-2 border-b border-black-200">
                                <Text className="text-white  font-plight text-sm text-center">Te gjitha</Text>
                                {allTags && <Image 
                                    source={icons.tick}
                                    className="size-5"
                                    resizeMode='contain'
                                    tintColor={"#FF9C01"}
                                />}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {setAddTags(true); setAllTags(false); setOpenTagDialog(false);}} className="p-1.5 mx-2 flex-row items-center gap-2 justify-center">
                                <Text className="text-white font-plight text-sm text-center">Shto etiketime</Text>
                                {addTags && <Image 
                                    source={icons.tick}
                                    className="size-5"
                                    resizeMode='contain'
                                    tintColor={"#FF9C01"}
                                />}
                            </TouchableOpacity>
                        </Animatable.View>}
                        {addTags && <View>
                            {outputTags.length > 0 && 
                                <FlatList 
                                    className={`${makeCreateBlogFullscreen ? "h-[100px]" : "h-[60px]"} border border-black-200 rounded-[5px]`}
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
                                    className={`${makeCreateBlogFullscreen ? "h-[100px]" : "h-[60px]"} border border-black-200 rounded-[5px]`}
                                    scrollEnabled={true}
                                    horizontal={true}
                                    contentContainerStyle={{ flexDirection: "row", gap: 6, padding: 6, flexBasis: "auto"}}
                                    data={tagsSelected || []}
                                    keyExtractor={(item) => `tagunew-${item?.id}`}
                                    renderItem={({item, index}) => (
                                        <View className={`${index !== 1 ? "" : "bg-secondary !border-white"} border relative border-black-200 rounded-[5px] self-start p-2 px-4`}>
                                            <Text className={`${index !== 1 ? "" : "!text-white font-psemibold"} font-plight text-gray-400 text-xs`}>{item?.name}</Text>
                                        </View>
                                    )}
                                />}
                            {openTags && <View className="p-2 border border-black-200 rounded-[5px] bottom-0 bg-oBlack mt-2" style={styles.box}>
                                <TextInput
                                    className="bg-primary text-white font-plight text-sm p-2 rounded mb-2 border border-black-200"
                                    placeholder="Kerkoni etiketime..."
                                    style={styles.box}
                                    placeholderTextColor="#999"
                                    onChangeText={(text) => debounceTagsSearching(text)}
                                />
                                <FlatList
                                    className={`${makeCreateBlogFullscreen ? "h-[100px]" : "h-[60px]"}`}
                                    scrollEnabled={true}
                                    data={tagsData}
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
                                            <Text className="text-white text-sm font-psemibold">Nuk ka etiketime te disponueshme</Text>
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
                    <TouchableOpacity onPress={() => setOpenPostStatus(!openPostStatus)} className="flex-row gap-2 items-center">
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
                    <TouchableOpacity disabled={blogCreating} onPress={createBlog} className={`bg-secondary px-4 justify-center items-center mx-auto h-10 -mt-6 rounded-[2px] ${blogCreating ? "opacity-50" : ""}`} >
                        <Text className="text-white font-pmedium text-sm">Postoni</Text>
                    </TouchableOpacity>
                </View>
            </Animatable.View>}
            <FullScreenImage 
                visible={fullscreenModalOptions.visible}
                images={fullscreenModalOptions.images}
                initialIndex={fullscreenModalOptions.index}
                onClose={() => setFullscreenModalOptions({visible: false, images: [], index: 0})}
            />
        </View>
    )
    
  return (
      <TouchableWithoutFeedback onPress={removeOpenedDialogs}>
            {/* <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "position" : "height"} keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}> */}
            {makeCreateBlogFullscreen ? (
                <Modal
                    hardwareAccelerated={true}
                    statusBarTranslucent={true}
                    visible={makeCreateBlogFullscreen}
                    animationType="slide"
                    onRequestClose={() => setMakeCreateBlogFullscreen(false)}
                >
                    <Pressable onPress={removeOpenedDialogs} style={styles.fullscreenContainer}>
                    <View className="h-full">
                        <TouchableOpacity 
                            style={styles.closeFullscreenButton}
                            onPress={() => setMakeCreateBlogFullscreen(false)}
                        >
                            <Image
                                source={icons.close}
                                className="h-6 w-6"
                                tintColor={"#fff"}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                        {renderMainContent()}
                    </View>
                    </Pressable>
                </Modal>
            ) : (
                <KeyboardAvoidingView 
                    style={styles.container} 
                    behavior={Platform.OS === "ios" ? "position" : "height"} 
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
                >
                    {renderMainContent()}
                </KeyboardAvoidingView>
            )}
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
    },
    fullscreenContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        padding: 20,
        paddingTop: 50,
    },
    closeFullscreenButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 100,
        backgroundColor: '#FF9C01',
        padding: 10,
        borderRadius: 20,
    },
  });
export default AddBlogComponent