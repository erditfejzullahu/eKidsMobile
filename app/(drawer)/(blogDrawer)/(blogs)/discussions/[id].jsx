import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react'
import { FlatList, Image, KeyboardAvoidingView, RefreshControl, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native'
import useFetchFunction from '../../../../../hooks/useFetchFunction';
import { createDiscussionAnswerAsync, getDiscussionById, getDiscussionsAnswers, handleDiscussionVoteFunc } from '../../../../../services/fetchingService';
import Loading from "../../../../../components/Loading"
import { Platform } from 'react-native';
import { icons } from '../../../../../constants';
import { TouchableOpacity } from 'react-native';
import RenderHTML from 'react-native-render-html';
import { useRouter } from 'expo-router';
import { CoreBridge, RichText, TenTapStartKit, Toolbar, useEditorBridge, useEditorContent } from '@10play/tentap-editor';
import Placeholder from '@tiptap/extension-placeholder';
import DiscussionCommentsSort from '../../../../../components/DiscussionCommentsSort';
import DiscussionsCommentCard from '../../../../../components/DiscussionsCommentCard';
import { currentUserID } from '../../../../../services/authService';
import DiscussionVotesComponent from '../../../../../components/DiscussionVotesComponent';
import EmptyState from "../../../../../components/EmptyState"
import NotifierComponent from '../../../../../components/NotifierComponent';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import CreateDiscussionAnswer from '../../../../../components/CreateDiscussionAnswer';
const discussionComments = [
  {
    id: 1,
    userId: 101,
    username: "CodeMaster99",
    avatar: "https://example.com/avatars/user1.png",
    content: "You can fix this error by updating your React Native version to 0.73.2. It was a bug in older versions.",
    createdAt: "2025-04-05T08:30:00Z",
    upvotes: 15,
    downvotes: 2,
    isAnswer: true,
    replies: [
      {
        id: 11,
        userId: 102,
        username: "DevGirl_21",
        avatar: "https://example.com/avatars/user2.png",
        content: "Yep, this worked for me. Also had to clear the cache!",
        createdAt: "2025-04-05T09:15:00Z",
        upvotes: 5,
        downvotes: 0,
      },
      {
        id: 12,
        userId: 103,
        username: "frontendFan",
        avatar: "https://example.com/avatars/user3.png",
        content: "React Native cache is always the hidden monster 😩",
        createdAt: "2025-04-05T10:00:00Z",
        upvotes: 3,
        downvotes: 1,
      }
    ]
  },
  {
    id: 2,
    userId: 104,
    username: "JS_Wizard",
    avatar: "https://example.com/avatars/user4.png",
    content: "You could also use Expo EAS build, it handles most native dependencies better.",
    createdAt: "2025-04-05T08:45:00Z",
    upvotes: 8,
    downvotes: 1,
    isAnswer: false,
    replies: []
  },
  {
    id: 3,
    userId: 105,
    username: "NoobCoder",
    avatar: "https://example.com/avatars/user5.png",
    content: "Still having this issue after updating, anyone else?",
    createdAt: "2025-04-05T09:00:00Z",
    upvotes: 2,
    downvotes: 0,
    isAnswer: false,
    replies: [
      {
        id: 13,
        userId: 106,
        username: "StackPro",
        avatar: "https://example.com/avatars/user6.png",
        content: "Did you also run `npx react-native-clean-project`?",
        createdAt: "2025-04-05T09:20:00Z",
        upvotes: 4,
        downvotes: 0,
      }
    ]
  }
];

const discussion = () => {
  const router = useRouter();
    const {id} = useLocalSearchParams();
    const {data, isLoading, refetch} = useFetchFunction(() => getDiscussionById(id))
    const {data: answersData, isLoading: answersLoading, refetch: answersRefetch} = useFetchFunction(() => getDiscussionsAnswers(id))
    const [discussionData, setDiscussionData] = useState(null)
    const [discussionAnswerData, setDiscussionAnswerData] = useState([]);
    const [discussionRefreshing, setDiscussionRefreshing] = useState(false);
    const [discussionCommentMade, setDiscussionCommentMade] = useState("")
    const [htmlContent, setHtmlContent] = useState({html: ""})

    const {width} = useWindowDimensions();
  
    const date = new Date(discussionData?.createdAt).toLocaleDateString("sq-AL", {
      day: "numeric",
      month: "short",
      year: "2-digit"
    })

    
    
    
    const onRefresh = async () => {
      setDiscussionRefreshing(true)
      await refetch();
      await answersRefetch();
      setDiscussionRefreshing(false)
    }    

    useEffect(() => {
      if(data){
        setDiscussionData(data);
        setHtmlContent((prevData) => ({
          ...prevData,
          html: discussionData?.content
        }))
      }else{
        setDiscussionData(null);
      }
    }, [data])

    useEffect(() => {
      if(answersData){
        setDiscussionAnswerData(answersData);
      }else{
        setDiscussionAnswerData([])
      }
      console.log(answersData, ' answerdata');
    }, [answersData])
    

    useEffect(() => {
      refetch();
      answersRefetch();
    }, [id])
    
    if(isLoading || discussionRefreshing || answersLoading) return <Loading />
    
  return (
    <View className="flex-1 h-full bg-primary">
      <KeyboardAwareFlatList
      className="h-full flex-1"
        // contentContainerStyle={{paddingLeft: 16, paddingRight: 16}}
        refreshControl={<RefreshControl refreshing={discussionRefreshing} onRefresh={onRefresh}/>}
        contentContainerStyle={{gap:24}}
        data={discussionAnswerData?.data}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <DiscussionsCommentCard item={item}/>
        )}
        ListHeaderComponent={() => (
          <>
          <View className="flex-1">
          <View className="bg-oBlack relative p-4 flex-row justify-between gap-2 items-start border-b border-black-200" style={styles.box}>
              <TouchableOpacity onPress={() => router.back()} className="bg-primary border border-black-200 absolute left-4 -bottom-2 px-6 py-0.5 rounded-md" style={styles.box}>
                <Image 
                  source={icons.leftArrow}
                  className="h-4 w-4"
                  resizeMode='contain'
                  tintColor={"#FF9C01"}
                />
              </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-2xl font-psemibold text-white">{discussionData?.title}</Text>
              <View className="flex-row items-center gap-2 justify-between flex-wrap mt-1">
              <Text className="text-gray-400 text-xs font-plight">Krijuar <Text className="text-secondary font-psemibold">{date}</Text></Text>
              <Text className="text-gray-400 text-xs font-plight">E shikuar <Text className="text-secondary font-psemibold">{discussionData?.views} here</Text></Text>
              <Text className="text-white text-xs bg-primary border border-black-200 font-psemibold px-2 py-1 rounded-md" style={styles.box}>{discussionData?.edited ? "E modifikuar" : "E pa modifikuar"}</Text>
              </View>
            </View>
            <View>
            <TouchableOpacity className="bg-primary p-3 border border-black-200 rounded-md" style={styles.box} onPress={() => router.push(`(blogs)/discussions/addDiscussion`)}>
            <Image 
              source={icons.plus}
              className="h-6 w-6"
              resizeMode='contain'
              tintColor={"#ff9c01"}
            />
            </TouchableOpacity>
            </View>
          </View>
          
          <View className="border-b-8 border-black-200 pb-8">
            <DiscussionVotesComponent discussionData={discussionData}/>

            <View className="flex-1 bg-oBlack p-4 border-t border-b border-black-200 relative" style={styles.box}>
              <View className="absolute left-0 right-0 -top-5 min-w-full">
                <View className="flex-row items-center gap-1 bg-primary self-start mx-auto px-2 py-1 border border-black-200 rounded-md z-20" style={styles.box}>
                  {discussionData?.user === null ? <Image 
                    source={icons.profile}
                    className="h-3 w-3"
                    resizeMode='contain'
                  /> :
                  <Image 
                    source={{uri: discussionData?.profilePictureUrl}}
                    className="h-3 w-3"
                    resizeMode='contain'
                  />}
                  <Text className="text-secondary font-plight text-sm">{discussionData?.user === null ? "Anonim" : discussionData?.user?.name}</Text>
                </View>
              </View>
              <ScrollView className="mb-4 max-h-[400px] bg-primary border border-black-200 p-2">
                <RenderHTML
                    tagsStyles={{
                    h1: {color:"white", fontFamily: 'Poppins-Black', marginTop:"1.5em", marginBottom: "0.5em"},
                    h2: {color:"white", fontFamily: 'Poppins-Bold', marginTop:"1.25em", marginBottom: "0.75em"},
                    h3: {color:"white", fontFamily: 'Poppins-Medium', marginTop: "1em", marginBottom: "0.5em"},
                    h4: {color:"white", fontFamily: "Poppins-Medium", marginTop: "0.75em", marginBottom: "0.5em"},
                    h5: {color:"white", fontFamily:"Poppins-Regular", marginTop:"0.5em", marginBottom: "0.25em"},
                    p: {color:"#9ca3af", fontFamily: "Poppins-Light", fontSize: 12, marginTop: "0px", marginBottom: "10px"},
                    strong: {color:"white", fontFamily: "Poppins-Bold", fontSize: 12},
                    li: {color:"white", fontFamily: "Poppins-Light", fontSize: 12, marginTop: "0.25em", marginBottom: "0.25em"},
                    ol: {color: "white", fontFamily: "Poppins-Bold", fontSize: 12,  marginTop: "1em", marginBottom: "1em"},
                    ul: {color: "white", fontFamily: "Poppins-Bold", fontSize: 12, marginTop: "1em", marginBottom: "1em"},
                    }}
                    contentWidth={width}
                    source={htmlContent}
                    classesStyles={{ //for classes exmpl yellow clr
                    special: { color: 'green', fontStyle: 'italic' },
                    }}
                    systemFonts={['Poppins-Black', 'Poppins-Bold', 'Poppins-ExtraBold', 'Poppins-Light', 'Poppins-Medium', 'Poppins-Regular', 'Popping-SemiBold']}
                />
              </ScrollView>
              <TouchableOpacity className="absolute -bottom-3 left-2 bg-primary border border-black-200 rounded-md flex-row gap-1.5 px-3 py-1.5 items-center" style={styles.box}>
                  <Text className="font-psemibold text-sm text-white">Shperndaje</Text>
                  <Image
                    source={icons.share}
                    className="h-4 w-4"
                    resizeMode='contain'
                    tintColor={"#ff9c01"}
                  />
              </TouchableOpacity>
              <TouchableOpacity className="absolute -bottom-3 right-2 bg-primary border border-black-200 rounded-md flex-row gap-1.5 px-3 py-1.5 items-center" style={styles.box}>
                  <Text className="font-psemibold text-sm text-white">Komento</Text>
                  <Image
                    source={icons.chat}
                    className="h-4 w-4"
                    resizeMode='contain'
                    tintColor={"#ff9c01"}
                  />
              </TouchableOpacity>
            </View>
            <Image />
          </View>

          {/* comments and sorting comments */}
          <View className="flex-row items-center justify-between px-4 mt-4">
            <View>
            <Text className="text-secondary font-psemibold text-base">
              {discussionAnswerData.length === 0 ? (
                <>
                  <Text className="text-white">Filloni me </Text>
                  <Text className="text-secondary">komentin e parë</Text>
                </>
              ) : (
                <>
                  {discussionAnswerData?.answersCount} <Text className="text-white">përgjigjje/komente</Text>
                </>
              )}
            </Text>

            </View>
            {discussionAnswerData.length > 0 &&<View>
              <DiscussionCommentsSort />
            </View>}
          </View>
          </View>
          {/* comments and sorting comments */}
          </>
        )}
        ListFooterComponent={() => (
          <CreateDiscussionAnswer id={id} sentSuccessResponse={(newComment) => setDiscussionAnswerData((prevData) => [newComment, ...prevData])}/>
        )}
        ListEmptyComponent={() => (
          <View className="border-t pb-4 border-b border-black-200 bg-oBlack" style={styles.box}>
            <EmptyState 
              title={"Nuk ka ende pergjigjje/koment"}
              subtitle={"Filloni komentimin/pergjigjjen mbi kete diskutim"}
              isSearchPage={true}
              showButton={false}
            />
          </View>
        )}
      />
    </View>
  )
}

export default discussion

const styles = StyleSheet.create({
    box: {
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.6,
                shadowRadius: 10,
            },
            android: {
                elevation: 8,
            },
        })
    },
});