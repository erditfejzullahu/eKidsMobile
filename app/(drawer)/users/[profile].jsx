import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Image, StyleSheet, Platform, Dimensions, Touchable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Redirect, useLocalSearchParams } from 'expo-router'
import useFetchFunction from '../../../hooks/useFetchFunction'
import { acceptFriendRequest, getUserProfile, getUserRelationStatus, makeUserFriendReq, removeFriendReq, removeFriendRequestReq } from '../../../services/fetchingService'
import Loading from "../../../components/Loading"
import {useGlobalContext} from "../../../context/GlobalProvider"
import { getMetaValue, reqGetAllUserTypes } from '../../../services/fetchingService'
import { icons, images } from '../../../constants'
import NotifierComponent from '../../../components/NotifierComponent'
import { navigateToMessenger } from '../../../hooks/useFetchFunction'
import { useRouter } from 'expo-router'
import { Modal } from 'react-native'
import CustomModal from '../../../components/Modal'
import ProfileCoursesComponent from '../../../components/ProfileCoursesComponent'
import ProfileQuizzesComponent from '../../../components/ProfileQuizzesComponent'
import UserCourseCreated from '../../../components/UserCourseCreated'
import UserQuizzesCreated from '../../../components/UserQuizzesCreated'
import { ContributionGraph, ProgressChart } from 'react-native-chart-kit'
import { FlatList } from 'react-native-gesture-handler'
import * as Animatable from "react-native-animatable"
import EmptyState from '../../../components/EmptyState'
import BlogsProfile from '../../../components/BlogsProfile'
import DiscussionsProfile from '../../../components/DiscussionsProfile'

const Profiles = () => {
    const {profile} = useLocalSearchParams();
    
    const {user, isLoading: userLoading} = useGlobalContext();
    const userData = user?.data?.userData;
    // if(parseInt(profile) === parseInt(userData?.id)) return <Redirect href={"/profile"}/>
    const router = useRouter();

    useEffect(() => {
      if(!userLoading && (parseInt(profile) === parseInt(userData?.id))){
        router.replace('/profile')
      }
    }, [profile, userData])
    
    
    const {data, isLoading, refetch} = useFetchFunction(() => getUserProfile(profile))
    const {data: relationData, isLoading: relationReloading, refetch: relationRefetch} = useFetchFunction(() => getUserRelationStatus(userData?.id, profile));
    
    const [profileData, setProfileData] = useState(null)
    const [softSkills, setSoftSkills] = useState([])
    const [isRefreshing, setIsRefreshing] = useState(true)

    const currentYear = new Date().getFullYear();
    const startDate = new Date(`${currentYear}-01-01`); // January 1st
    const endDate = new Date(`${currentYear}-12-31`); // December 31st
    const numDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    const chartConfig = {
      backgroundGradientFrom: "#1E2923",
      backgroundGradientFromOpacity: 0,
      backgroundGradientTo: "#08130D",
      backgroundGradientToOpacity: 0.5,
      color: (opacity = 1) => `rgba(255, 156, 1, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255 ,255, ${opacity})`,
      strokeWidth: 2, // optional, default 3
      barPercentage: 0.5,
      useShadowColorFromDataset: false // optional
    };
    
    const [showQuizzes, setShowQuizzes] = useState(false)
    const [showCourses, setShowCourses] = useState(false)
    const [showCreatedQuizzes, setShowCreatedQuizzes] = useState(false)
    const [showCreatedCourses, setShowCreatedCourses] = useState(false)

    const [relationStatus, setRelationStatus] = useState(null)
    const [removeFriendModal, setRemoveFriendModal] = useState(false)
    const [allFriendsModal, setAllFriendsModal] = useState(false)
    const [showFriendListOptions, setShowFriendListOptions] = useState([])

    const [profileAboutData, setProfileAboutData] = useState(true)
    const [personalInformation, setPersonalInformation] = useState(false)
    const [professionalInformation, setProfessionalInformation] = useState(false)
    const [allFriendsData, setAllFriendsData] = useState([])

    const [skillsPart, setSkillsPart] = useState(false)
    const [commitmentPart, setCommitmentPart] = useState(true)
    const [projectsPart, setProjectsPart] = useState(false)

    const refreshData = async () => {
      setIsRefreshing(true)
      await refetch();
      await relationRefetch();
      setIsRefreshing(false)
    }

    const profileImage = () => {

    }

    const { showNotification: successFriendReq } = NotifierComponent({
      title: "Kerkesa shkoi me sukes!",
      description: "Per statusin e miqesise do te njoftoheni tek seksioni i notifikimeve",
    })

    const {showNotification: successFriendDeletion} = NotifierComponent({
      title: "Kerkesa shkoi me sukses!",
      description: `Sapo e larguat ${profileData?.firstname} ${profileData?.lastname} nga statusi juaj miqesor me perdorues!`
    })

    const { showNotification: failedReq } = NotifierComponent({
      title: "Dicka shkoi gabim!",
      description: "Ju lutem provoni perseri apo kontaktoni Panelin e Ndihmes!",
      alertType: "warning"
    })

    const makeFriend = async () => {
      console.log(userData?.id);
      
      const payload = {
        userId: userData?.id,
        receiverId: profile,
        information: "user req",
        type: 4
      };
      const response = await makeUserFriendReq(payload)
      if(response === 200){
        successFriendReq()
        await relationRefetch();
      }else{
        failedReq()
      }
    }

    const removeOnWaitingFriend = async () => {
      const response = await removeFriendRequestReq(userData?.id, profile);
      if(response === 200){
        await relationRefetch();
      }else{
        failedReq();
      }
    }

    const removeFriend = async () => {
      const response = await removeFriendReq(userData?.id, profile)
      if(response === 200){
        successFriendDeletion()
        setRemoveFriendModal(false);
        await refreshData()
      }else{
        setRemoveFriendModal(false);
        failedReq()
      }
    }

    const getAllFriends = async () => {
      const response = await reqGetAllUserTypes(profileData?.id, 2)
      if(response){
        // console.log(response);
        setAllFriendsData(response)
      }else{
        setAllFriendsData([])
      }
    }

    const goToMessenger = (user) => {
      // console.log(user);
      
      const otherUserData = {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        profilePictureUrl: user.profilePictureUrl
      }
      setAllFriendsModal(false)
      setShowFriendListOptions([])
      
      navigateToMessenger(router, otherUserData, userData);
    }

    const showOptionsFriendList = (id) => {
      setShowFriendListOptions([id])
    }

    useEffect(() => {
      if(allFriendsModal){
        if(allFriendsData.length === 0){
          getAllFriends()
        }
      }
    }, [allFriendsModal])

    const outputRelation = () => {
      if(relationStatus === null){
        return 0 // Shto miqesine 0
      }else{
        if((relationStatus?.senderId !== userData?.id) && relationStatus?.status === 1){
          return 1 //ma ka qu aj mu // 1 //Shoqerohu!
        }else if((relationStatus?.senderId === userData?.id) && relationStatus?.status === 1){
          return 2 // ja kom qu un atij // 2 //Ne pritje
        }else if((relationStatus?.receiverId !== userData?.id) && relationStatus?.status === 1){
          return 1;
        }else if((relationStatus?.receiverId === userData?.id) && relationStatus?.status === 1){
          return 2;
        }else{
          return 3 //shoqerohu
        }
      }
    }
    
    

    useEffect(() => {
      if(relationData){
        setRelationStatus(relationData);        
      }else{        
        setRelationStatus(null);
      }
      // console.log(relationStatus === null);
    }, [relationData])

    useEffect(() => {
      setProfileData(null);
      setRelationStatus(null)
      setSoftSkills([])
      // refetch();
      // relationRefetch();
      refreshData();
    }, [profile])
    

   

    useEffect(() => {
      if(data){        
        setProfileData(data)        
        setSoftSkills((prevData) => {
          const currentData = prevData || [];
          if(data?.userInformation?.softSkills !== null){
            const softSkills = (() => {
              try {
                const parsedData = JSON.parse(data?.userInformation?.softSkills)
                return Array.isArray(parsedData) ? parsedData : data?.userInformation?.softSkills;
              } catch (error) {
                return []
              }
            })();
            
            return [...softSkills]
          }
          return currentData;
        })
        // console.log(data);
        // console.log(softSkills);
        setIsRefreshing(false)
      }else {
        setProfileData(null)
        setIsRefreshing(false)
      }
    }, [data])
    
    

    const acceptFriend = async () => {
      const response = await acceptFriendRequest(relationStatus?.senderId, relationStatus?.receiverId)
      if(response === 200){
        await refreshData();
      }else{
        failedReq()
      }
    }

    useEffect(() => {
      if(!showQuizzes && !showCourses && !showCreatedCourses && !showCreatedQuizzes){
        setProfileAboutData(true)
      }else{
        setProfileAboutData(false)
      }

      if(profileAboutData){
        setPersonalInformation(false)
        setProfessionalInformation(true)
      }
    }, [showQuizzes, showCourses, showCreatedCourses, showCreatedQuizzes])
    
    useEffect(() => {
      if (data?.role === "Instructor" && !isLoading) {
        router.replace(`/tutor/${data?.instructorId}`);
      }
    }, [data, isLoading]);
    


    if(isLoading || userLoading || relationReloading || isRefreshing) return <Loading />
  return (
    <View>
    <ScrollView
      refreshControl={< RefreshControl onRefresh={refreshData} tintColor="#ff9c01" colors={['#ff9c01', '#ff9c01', '#ff9c01']} refreshing={isRefreshing} />}
      className="h-full bg-primary"
    >
      {/* profile part */}
      <View className="w-full items-center justify-center pb-4 mb-4 relative" style={styles.box}>
        <BlogsProfile userData={profileData}/> 
        <DiscussionsProfile userData={profileData}/> 
          <View className="h-16 w-16 bg-secondary rounded-[15px] justify-center items-center mt-10">
            <TouchableOpacity onPress={profileImage}>
              <Image 
                source={{uri: profileData?.profilePictureUrl || icons.userProfile}}
                className="h-12 w-12 rounded-[10px]"
                resizeMode='contain'
              />
            </TouchableOpacity>
          </View>
          <View className="mt-4">
            <Text className="text-white text-xl font-psemibold text-center">{profileData?.firstname} {profileData?.lastname}</Text>
            <Text className="text-gray-200 text-sm font-pregular text-center mt-2">{profileData?.email}</Text>
            <Text className="text-gray-200 text-sm font-pregular text-center mt-2">{getMetaValue(profileData?.userMeta, "UserRole")}</Text>
            <View className="flex-row justify-between w-[300px] mt-6 gap-4">
              <TouchableOpacity onPress={() => setAllFriendsModal(true)} className="border border-black-200 rounded-[10px] px-6 py-2 bg-oBlack flex-1">
                <Text className="text-gray-200 text-base font-pregular text-center">Komuniteti:</Text>
                {/* <Text className="text-secondary text-lg font-psemibold text-center">{getMetaValue(userData?.userMeta, "LessonsCompleted")}</Text> */}
                <Text className="text-secondary text-lg font-psemibold text-center">{profileData?.friends?.length}</Text>

              </TouchableOpacity>
              <View className="border border-black-200 rounded-[10px] px-6 py-2 bg-oBlack flex-1">
                <Text className="text-gray-200 text-base font-pregular text-center">Telefoni:</Text>
                <Text className="text-secondary text-lg font-psemibold text-center">{getMetaValue(profileData?.userMeta, "Phone")}</Text>
              </View>
            </View>
          </View>
      </View>
      {/* profile part */}

      <View className="max-w-[350px] mb-4 flex-row flex-1 mx-auto gap-4" style={styles.box}>
        <TouchableOpacity onPress={outputRelation() === 0 ? makeFriend : outputRelation() === 1 ? acceptFriend : outputRelation() === 2 ? removeOnWaitingFriend : outputRelation() === 3 ? () => setRemoveFriendModal(true) : {}} className="bg-secondary py-3 w-[150px] rounded-[10px] border border-white flex-row items-center justify-center gap-2">
          <Text className="text-white font-psemibold text-base text-center">{outputRelation() === 0 ? "Shto miqesine" : outputRelation() === 1 ? "Shoqerohu!" : outputRelation() === 2 ? "Ne pritje" : outputRelation() === 3 ? "Largo miqesine" : "default"}</Text>
          <Image 
            source={icons.friends}
            className="w-6 h-6"
            resizeMode='contain'
            tintColor={"#fff"}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateToMessenger(router, profileData, userData)} className="bg-oBlack py-3 w-[150px] rounded-[10px] border border-black-200 flex-row items-center justify-center gap-2">
          <Text className="text-white font-psemibold text-base text-center">Kontakto</Text>
          <Image 
            source={icons.report}
            className="w-6 h-6"
            resizeMode='contain'
            tintColor={"#fff"}
          />
        </TouchableOpacity>
      </View>

      {/* toggle part */}
      <View className="w-full border-t border-black-200 ">
        <View className="flex-row justify-between w-full border-b border-black-200">
          <View className="w-1/2  border-r border-black-200" style={{backgroundColor: showQuizzes ? "#13131a" : "transparent"}}>
            <TouchableOpacity 
              className="flex-row py-4 items-center gap-2 justify-center text-center"
              onPress={() => {setShowQuizzes(!showQuizzes), setShowCourses(false), setShowCreatedCourses(false), setShowCreatedQuizzes(false)}}
            >
              <Image 
                source={icons.quiz}
                style={{tintColor: showQuizzes ? "#ff9c01" : "#fff"}}
                className="h-6 w-6 bg-secon"
                resizeMode="contain"
              />
              <Text className="text-sm text-white font-pregular">Progresi Kuizeve</Text>
            </TouchableOpacity>
          </View>
          <View className="w-1/2" style={{backgroundColor: showCourses ? "#13131a" : "transparent"}}>
            <TouchableOpacity 
              className="flex-row  py-4 items-center gap-2 justify-center text-center"
              onPress={() => {setShowCourses(!showCourses), setShowQuizzes(false), setShowCreatedCourses(false), setShowCreatedQuizzes(false)}}
              >
              <Image 
                source={icons.progress}
                className="h-6 w-6"
                resizeMode="contain"
                style={{tintColor: showCourses ? "#ff9c01" : "#FFF"}}
              />
              <Text className="text-sm text-white font-pregular">Progresi Kurseve</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>        
      {/* toggle part */}

      {/* other toggle part */}
      <View className="flex-row items-center w-[98%] mx-auto border border-black-200 rounded-lg mt-2 overflow-hidden" style={styles.box}>
        <View className={` ${showCreatedQuizzes ? "bg-oBlack" : ""} p-2 w-1/2 border-r border-black-200`}>
          <TouchableOpacity onPress={() => {setShowCreatedQuizzes(!showCreatedQuizzes), setShowCourses(false), setShowQuizzes(false), setShowCreatedCourses(false)}} className="items-center gap-2 flex-row justify-center">
            <View>
              <Image 
                source={images.mortarBoard} 
                style={{tintColor: showCreatedQuizzes ? "#FF9C01" : "#fff"}} 
                className="w-6 h-6"
                resizeMode='contain'
                />
            </View>
            <Text className="text-sm text-center text-white font-pregular">Kuize te krijuara</Text>
          </TouchableOpacity>
        </View>
        <View className={`${showCreatedCourses ? "bg-oBlack" : ""} w-1/2 p-2`}>
          <TouchableOpacity onPress={() => {setShowCreatedCourses(!showCreatedCourses), setShowCourses(false), setShowQuizzes(false), setShowCreatedQuizzes(false)}} className="items-center gap-2 flex-row justify-center">
            <View>
              <Image 
                source={icons.lectures} 
                style={{tintColor: showCreatedCourses ? "#FF9C01" : "#fff"}} 
                className="w-6 h-6"
                resizeMode='contain'
                />
            </View>
            <Text className="text-sm text-center text-white font-pregular">Kurse te krijuara</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* other toggle part */}

      {showCourses && (profileData?.courseCompleted?.length > 0 ? <View>
        <ProfileCoursesComponent 
          userDataId={profile}
          courseData={profileData?.courseCompleted}
          userCategories={user?.data?.categories}
        />
      </View>: 
      <View className="mx-4 pt-4 mt-6 rounded-[5px] border border-black-200 bg-oBlack" style={styles.box}>
        <EmptyState 
          title={"Nuk u gjet asnje progress!"}
          subtitle={"Perdoruesi nuk ka filluar perfundimin e ndonje kursi!"}
          showButton={false}
          titleStyle={"!font-psemibold"}
        />
      </View>)}

      {showQuizzes && (profileData?.quizzesCompleted?.length > 0 ? <View>
        <ProfileQuizzesComponent 
          quizzesCompleted={profileData?.quizzesCompleted}
          userCategories={user?.data?.categories}
        />
      </View> : 
      <View className="mx-4 pt-4 mt-6 rounded-[5px] border border-black-200 bg-oBlack" style={styles.box}>
        <EmptyState 
          title={"Nuk u gjet asnje progress!"}
          subtitle={"Perdoruesi nuk ka filluar perfundimin e ndonje kuizi!"}
          showButton={false}
          titleStyle={"!font-psemibold"}
        />
      </View>)}

      {showCreatedCourses && (profileData?.courseCreated?.length > 0 ? <View>
        <UserCourseCreated 
          userCourses={profileData?.courseCreated}
          userCategories={user?.data?.categories}
          />
      </View> :
      <View className="mx-4 pt-4 mt-6 rounded-[5px] border border-black-200 bg-oBlack" style={styles.box}>
        <EmptyState 
          title={"Nuk u gjet asnje kurs!"}
          subtitle={"Perdoruesi nuk ka krijuar kurse ende!"}
          showButton={false}
          titleStyle={"!font-psemibold"}
        />
      </View>)}

      {showCreatedQuizzes && (profileData?.quizzes?.length > 0 ? <View>
        <UserQuizzesCreated 
          quizzesCreated={profileData?.quizzes}
          userCategories={user?.data?.categories}
        />
      </View> :
      <View className="mx-4 pt-4 mt-6 rounded-[5px] border border-black-200 bg-oBlack" style={styles.box}>
        <EmptyState 
          title={"Nuk u gjet asnje kuiz!"}
          subtitle={"Perdoruesi nuk ka krijuar kuize ende!"}
          showButton={false}
          titleStyle={"!font-psemibold"}
        />
      </View>)}

      {profileAboutData && 
        <View>
          <View className="flex-row mx-auto p-2 flex-1 mt-2 bg-oBlack border border-black-200 rounded-[10px] justify-between w-[260px]" style={styles.box}>
          <TouchableOpacity onPress={() => {setPersonalInformation(true), setProfessionalInformation(false)}} className="flex-1 items-center border-r border-black-200">
              <Text className={`${personalInformation ? "text-secondary font-pregular" : "text-white"} text-sm font-plight text-center`}>Informacione personale</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {setProfessionalInformation(true), setPersonalInformation(false)}} className="flex-1 items-center">
              <Text className={`${professionalInformation ? "text-secondary font-pregular" : "text-white"} text-sm font-plight text-center`}>Informacione Profesionale</Text>
          </TouchableOpacity>
          </View>

          {personalInformation && 
          <View className="m-4 bg-oBlack border rounded-[10px] border-black-200" style={styles.box}>
          <View className="m-4 my-2 border-b border-black-200 flex-row justify-between">
            <View>
              <Text className="text-white font-plight text-sm">Abonimi:</Text>
              <Text className="text-secondary font-psemibold">Abonues rekurent</Text>
            </View>
            <View>
              <Text className="text-white font-plight text-sm text-right">Angazhimi:</Text>
              <Text className="text-secondary font-psemibold text-right">Mesatar</Text>
            </View>
          </View>
          <View className="m-4 my-2 flex-row justify-between border-b border-black-200">
            <View>
              <Text className="text-white font-plight text-sm">Nofka:</Text>
              <Text className="text-secondary font-psemibold">{profileData?.username}</Text>
            </View>
            <View>
              <Text className="text-white font-plight text-sm text-right">Roli i krijimit:</Text>
              <Text className="text-secondary font-psemibold text-right">Pioner</Text>
            </View>
          </View>
          <View className="m-4 my-2 border-b border-black-200 flex-row justify-between">
            <View>
              <Text className="text-white font-plight text-sm">Data lindjes:</Text>
              <Text className="text-secondary font-psemibold">{profileData?.userInformation?.birthday || "Nuk ka informate"}</Text>
            </View>
            <View>
              <Text className="text-white font-plight text-sm text-right">Profesioni:</Text>
              <Text className="text-secondary font-psemibold text-right">Programer</Text>
            </View>
          </View>
          </View>}

          {professionalInformation && 
          <View className="m-4 bg-oBlack border rounded-[10px] border-black-200" style={styles.box}>
            <View className="flex-row flex-1 border-b border-black-200">
              <View className="flex-1 items-center border-r border-black-200">
                <TouchableOpacity onPress={() => {setSkillsPart(true), setCommitmentPart(false), setProjectsPart(false)}} className="p-2">
                  <Text className={`${skillsPart ? "text-secondary" : "text-white"} font-plight text-sm`}>Aftesite</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-1 items-center border-r border-black-200">
                <TouchableOpacity onPress={() => {setCommitmentPart(true), setSkillsPart(false), setProjectsPart(false)}} className="p-2">
                  <Text className={`${commitmentPart ? "text-secondary" : "text-white"} font-plight text-sm`}>Angazhimi</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-1 items-center">
                <TouchableOpacity className="p-2" onPress={() => {setProjectsPart(true), setSkillsPart(false), setCommitmentPart(false)}}>
                  <Text className={`${projectsPart ? "text-secondary" : "text-white"} font-plight text-sm`}>Projekte</Text>
                </TouchableOpacity>
              </View>
            </View>

            {skillsPart && 
            <View className="p-4">
              <View className="gap-3">
                <View>
                  <Text className="text-secondary font-psemibold text-xs">Edukimi shkollor:</Text>
                  {profileData?.userInformation?.userEducation?.length > 0 ? profileData?.userInformation?.userEducation.map((item, index) => (
                    <View key={`usereducation-${index}`}>
                      <Text className="text-white font-psemibold text-base">{index + 1}. {item.place_Name} ({item.start_Year}) - {typeof(item.end_Year) === "number" ? "(" + item.end_Year + ")" : "(Ende)"}</Text>
                      <Text className="text-gray-400 text-sm font-plight">{item.field}</Text>
                    </View>
                  )) : <Text className="text-gray-400 text-sm font-plight">Nuk ka informata</Text>} 
                  
                </View>
                {profileData?.userInformation?.userJobs?.length > 0 ? profileData?.userInformation?.userJobs.map((item, index) => (
                  <View key={`userjobs-${index}`}>
                    <Text className="text-secondary font-psemibold text-xs">Punesimi:</Text>
                    <Text className="text-white font-psemibold text-base">{index + 1}. {item.job_Title} ({item.start_Year}) - {typeof(item.end_Year) === 'number' ? "(" + item.end_Year + ")" : "(Ende)"}</Text>
                    <Text className="text-gray-400 text-sm font-plight">{item.job_Place}</Text>
                  </View>
                )) : <Text className="text-gray-400 text-sm font-plight">Nuk ka informata</Text>} 
                <View>
                  <Text className="text-secondary font-psemibold text-xs">Aftesite:</Text>
                  <View>
                    <Text className="text-white font-plight text-base"><Text className="text-gray-400 font-plight">1. </Text> HTML</Text>
                  </View>
                </View>
                <View>
                  <Text className="text-secondary font-psemibold text-xs">Aftesi te buta:</Text>
                  {softSkills.length > 0 ? softSkills.map((item, index) => (
                    <Text key={`softskills-${index}`} className="text-white font-plight text-base"><Text className="text-gray-400">{index + 1}.</Text> {item} </Text>
                  )): <Text className="text-gray-400 text-sm font-plight">Nuk ka informata</Text>}
                </View>
              </View>
            </View>}

            {commitmentPart && 
            <View className="flex-1">
              <Text className="text-white font-plight text-sm p-2 bg-oBlack" style={styles.box}>Angazhimi llogaritet nga sa here ju brenda dites jeni paraqitur ne aplikacion dhe keni ndervepruar ne aplikacion!</Text>
              <ScrollView horizontal>
                <ContributionGraph 
                  values={profileData?.commitsData || []}
                  showOutOfRangeDays={true}
                  width={1200}
                  onDayPress={(date) => console.log(date)}
                  endDate={endDate}
                  numDays={numDays}
                  height={220}
                  // radius={32}
                  chartConfig={chartConfig}
                />
              </ScrollView>
            </View>}

          </View>}


      </View>}



      <CustomModal
      visible={removeFriendModal}
      showButtons={true}
      title={"Njoftim mbi veprimin"}
      onClose={() => setRemoveFriendModal(false)}
      onProcced={removeFriend}
      cancelButtonText={"Largoni dritaren!"}
      proceedButtonText={"Largo miqesine!"}
      >
        <Text className="text-white font-plight text-sm text-center my-2">Nga ky veprim ju largoni miqesine me <Text className="text-secondary font-psemibold">{profileData?.firstname} {profileData?.lastname}.</Text> Nese jeni te sigurte vazhdoni me veprimin nga butoni me poshte ose largoni dritaren!</Text>
      </CustomModal>

      <Modal
      visible={allFriendsModal}
      transparent={true}
      animationType="slide"
      onClose={() => setAllFriendsModal(false)}
      >
        <View className="flex-1 justify-center items-center" style={{backgroundColor: "rgba(0,0,0,0.4)"}}>
          <View className="h-[80%] w-[80%] bg-oBlack rounded-[10px] border border-black-200 justify-between" style={styles.box}>
            <View className="border-b border-black-200 flex-1">
              <FlatList 
              scrollEnabled={true}
                contentContainerStyle={{gap:6}}
                data={allFriendsData}
                keyExtractor={(item) => `userfriends-${item.id}`}
                ListHeaderComponent={() => (
                <View className="mx-auto my-4 border-b border-black-200 bg-oBlack rounded-b-[10px]" style={styles.box}>
                  <Text className="text-white font-psemibold text-2xl text-center border-b border-secondary self-start">Lista e miqesise</Text>
                </View>
                )}
                renderItem={({item}) => (
                  <View className="border-b border-t p-2 border-black-200 flex-row gap-2 bg-oBlack" style={styles.box}>
                    <View>
                      <Image 
                        source={{uri: item?.profilePictureUrl}}
                        className="h-14 w-14 border border-black-200 rounded-[10px]"
                        resizeMode='contain'
                      />
                    </View>
                    <View className="flex-row items-center justify-between flex-1 relative">
                      {showFriendListOptions.includes(item.id) && 
                      <Animatable.View animation="bounceIn" className="absolute bg-oBlack right-0 z-20 p-2 border border-black-200 rounded-[10px]" style={styles.box}>
                        <TouchableOpacity onPress={() => router.replace(`(profiles)/${item.id}`)} className="p-2 items-center border-b border-black-200">
                          <Text className="text-white font-plight text-sm">Vizito profilin</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="p-2 items-center" onPress={() => goToMessenger(item)}>
                          <Text className="text-white font-plight text-sm">Kontaktoni</Text>
                        </TouchableOpacity>
                      </Animatable.View>}
                      <View>
                        <Text className="text-white font-psemibold text-lg mb-1">{item?.firstname} {item?.lastname}</Text>
                        <Text className="text-gray-400 font-plight text-xs">Student</Text>
                      </View>
                      <View>
                        <TouchableOpacity onPress={() => showOptionsFriendList(item.id)}>
                          <Image 
                            source={icons.more}
                            className="h-10 w-10"
                            resizeMode='contain'
                            tintColor={"#FF9C01"}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )}
              />
            </View>
            <View className="h-[60px]">
              <TouchableOpacity className="bg-oBlack border-t items-center justify-center flex-1 border-black-200" style={styles.box} onPress={() => {setAllFriendsModal(false), setShowFriendListOptions([])}}>
                <Text className="text-sm font-psemibold text-white">Largoni dritaren</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
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
});

export default Profiles