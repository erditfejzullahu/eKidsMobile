import { View, Text, Image, RefreshControl, Platform } from 'react-native'
import {useState, useEffect, useMemo, useCallback} from 'react'
import { useGlobalContext } from '../../../context/GlobalProvider'
import { images, icons } from '../../../constants'
import { getCompletedQuizzesByUser, getCourseCategories, GetInstructorsUserProfileProgresses, getMetaValue, updateProfilePicture, updateUserDetails } from '../../../services/fetchingService'
import { TouchableOpacity } from 'react-native'
import FormField from '../../../components/FormField'
import CustomButton from '../../../components/CustomButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Loading from '../../../components/Loading'
import { userDetails } from '../../../services/necessaryDetails'
import UserProgressComponent from '../../../components/UserProgressComponent'
import NotifierComponent from '../../../components/NotifierComponent'
import * as ImagePicker from 'expo-image-picker';
import useFetchFunction from '../../../hooks/useFetchFunction'
import { getCompletedLessons } from '../../../services/fetchingService'
import * as Animatable from 'react-native-animatable'
import { Link, Redirect } from 'expo-router'
import EmptyState from '../../../components/EmptyState'
import { useRouter } from 'expo-router'
import ShowOtherDetailsProfile from '../../../components/ShowOtherDetailsProfile'
import DiscussionsProfile from '../../../components/DiscussionsProfile'
import BlogsProfile from '../../../components/BlogsProfile'
import { useRole } from '../../../navigation/RoleProvider'
import OnlineClassesCard from '../../../components/OnlineClassesCard'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { personalInformations } from '../../../schemas/profileSchema'
import { useColorScheme } from 'nativewind'
import { useShadowStyles } from '../../../hooks/useShadowStyles'
import * as Linking from "expo-linking"

const bounceDownAnimation = {
  0: { transform: [{ translateY: 0 }] },
  0.5: { transform: [{ translateY: 5 }] }, // Move down by 10 units
  1: { transform: [{ translateY: 0 }] }, // Back to original position
};
  

const Profile = () => {
  const {colorScheme} = useColorScheme();
  const {shadowStyle} = useShadowStyles();
  const {role} = useRole()
  if(role === "Instructor") return <Redirect href={'/instructor/instructorProfile'}/>
  const router = useRouter();
  const { user, isLoading, setUser } = useGlobalContext();
  // console.log(isLoading, 'loading');
  const userData = user?.data?.userData;
  
  const userCategories = user?.data?.categories

  const {data, isLoading: completedLoading, refetch} = useFetchFunction(() => getCompletedLessons())
  const {data: completedQuizzes, isLoading: quizzesLoading, refetch: quizzesRefetch} = useFetchFunction(() => getCompletedQuizzesByUser(userData?.id))
  
  useEffect(() => {
    if(data){
      setCompletedCourseData(data);
    }
  }, [data])

  
  const [showDetails, setShowDetails] = useState(true)
  const [changePassword, setChangePassword] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [completedCourses, setCompletedCourses] = useState(false)
  const [completedCourseData, setCompletedCourseData] = useState(null)
  const [showMoreCompleted, setShowMoreCompleted] = useState([])
  const [showCompletedQuizzes, setShowCompletedQuizzes] = useState(false)
  const [completedQuizzesData, setCompletedQuizzesData] = useState(null)
  const [showMoreInQuizzes, setShowMoreInQuizzes] = useState([])

  const [showOnlineCoursesProgress, setShowOnlineCoursesProgress] = useState(false)
  const [onlineCoursesData, setOnlineCoursesData] = useState([])

  const [showImportantDetails, setShowImportantDetails] = useState(true)
  const [showOtherDetails, setShowOtherDetails] = useState(false)

  const {control, handleSubmit, reset, trigger, watch, formState: {errors, isSubmitting}} = useForm({
    resolver: zodResolver(personalInformations),
    defaultValues: useMemo(() => ({
      name: "",
      lastname: "",
      password: "",
      confirmPassword: "",
      username: "",
      email: "",
      phone: "",
      age: 13
    }), []),
    mode: "onTouched"
  })

  useEffect(() => {
    if(userData){
      // console.log(userData, ' userdata');
      
      reset({
        name: userData?.firstname,
        lastname: userData?.lastname,
        username: userData?.username,
        email: userData?.email,
        phoneNumber: getMetaValue(userData.userMeta, "Phone"),
        age: userData?.age
      })

    }
  }, [userData, reset])
  

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      const updatedUser = await userDetails(); // Fetch updated user data
      setUser(updatedUser); // Update the context with new user data
      // You can update form state here as well, if needed
      await refetch();
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [setRefreshing, userDetails, setUser, refetch])

  useEffect(() => {
    if(completedQuizzes){
      setCompletedQuizzesData(completedQuizzes)
      // console.log(completedQuizzes);
      
    }else{
      setCompletedQuizzesData(null)
    }
  }, [completedQuizzes])
  

  const [onlineCoursesLoading, setOnlineCoursesLoading] = useState(false)

  
  useEffect(() => {
    const showOnlineCoursesProgresses = async () => {
      setOnlineCoursesLoading(true)
      
      const response = await GetInstructorsUserProfileProgresses(userData?.id)
      
      setOnlineCoursesData(response)
      setOnlineCoursesLoading(false)
    }

    if(showOnlineCoursesProgress){
      showOnlineCoursesProgresses()
    }
  }, [showOnlineCoursesProgress])

  const togglePassword = useCallback(() => {
    setChangePassword(!changePassword)
  }, [changePassword, setChangePassword])

  const updateSuccessful = useMemo(() => {
    const { showNotification } = NotifierComponent({
      title: "Te dhenat u perditesuan me sukses!",
      theme: colorScheme,
    });
    return showNotification;
  }, [colorScheme]);

  const updateFailed = useMemo(() => {
    const { showNotification } = NotifierComponent({
      title: "Dicka shkoi gabim!",  // Fixed typo: was 'tite'
      description: "Ju lutem provoni perseri apo kontaktoni Panelin e Ndihmes",
      alertType: "warning",
      theme: colorScheme
    });
    return showNotification;
  }, [colorScheme]);

  const profileUpdateSuccess = useMemo(() => {
    const { showNotification } = NotifierComponent({
      title: "Fotoja juaj e profilit u perditesua me sukses!",
      theme: colorScheme
    });
    return showNotification;
  }, [colorScheme]);

  const profilePicIsUploading = useMemo(() => {
    const { showNotification } = NotifierComponent({
      title: "Fotoja e profilit eshte duke u perditesuar...",
      theme: colorScheme
    });
    return showNotification;
  }, [colorScheme]);



  const updateDetails = useCallback(async (data) => {
    const age = parseInt(data.age);
    
    const response = await updateUserDetails({
      "firstname": data.name,
      "lastname": data.lastname,
      "username": data.username,
      "password": data?.password,
      "confirmPassword": data?.confirmPassword,
      "email": data.email,
      "age": age,
      "phone": data.phoneNumber
    })

    if(response === 200){
      updateSuccessful();
      onRefresh()
    }else{
      updateFailed();
    }
  }, [updateUserDetails, updateSuccessful, onRefresh, updateFailed])

  const [image, setImage] = useState({
    type: '',
    base64: '',
  });

  const permissionNotification = useMemo(() => {
    const {showNotification} = NotifierComponent({
      title: "Nevojitet leje!",
      description: "Klikoni per te shtuar lejet e posacshme",
      alertType: "warning",
      onPressFunc: () => Linking.openSettings(),
      theme: colorScheme
    })
    return showNotification;
  }, [colorScheme])

  const profileImage = useCallback(async () => {
    
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if(!permissionResult){
      permissionNotification();
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0,
      base64: true,
    })

    // console.log(result);

    if(!result.canceled){
      setImage((prevData) => ({
        ...prevData,
        type: `data:${result.assets[0].mimeType};base64,`,
        base64: result.assets[0].base64
      }));      
      // changeProfilePicture(image);
    }
    
  }, [setImage, permissionNotification])

  useEffect(() => {
    if(image.type && image.base64){
      changeProfilePicture(image);
    }
  }, [image])
  

  const changeProfilePicture = useCallback(async (base64Data) => {
    // console.log(base64Data);
    profilePicIsUploading()
    const formattedBase64 = `${base64Data.type}${base64Data.base64}`;
    // console.log(formattedBase64);
    
    try {
      const response = await updateProfilePicture(userData?.id, {"base64Profile": formattedBase64});
      if(response === 200){
        profileUpdateSuccess();
        onRefresh();
      }else{
        updateFailed()
      }
    } catch (error) {
      updateFailed()
    } finally {
      setImage({type: "", base64: ""})
    }
  }, [profilePicIsUploading, profileUpdateSuccess, onRefresh, updateFailed, setImage])
  
  if(refreshing || isLoading){
    return(
      <Loading />
    )
  }else{
    return (
      <KeyboardAwareScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true} // Ensures Android support
        keyboardShouldPersistTaps="handled"
        className="h-full bg-primary-light dark:bg-primary"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ff9c01" colors={['#ff9c01', '#ff9c01', '#ff9c01']}/>
        }
      >
        {/* profile part */}
        <View className="w-full items-center justify-center mb-8 relative" style={shadowStyle}>
          <DiscussionsProfile userData={user}/>
          <BlogsProfile userData={user}/>

          <View className="h-16 w-16 bg-secondary rounded-[15px] justify-center items-center mt-10">
            <TouchableOpacity onPress={profileImage}>
              <Image 
                // source={userData?.profilePictureUrl ? userData?.profilePictureUrl : icons.userProfile}
                source={{uri: userData?.profilePictureUrl || icons.userProfile}}
                className="h-12 w-12 rounded-[10px]"
                resizeMode='contain'
                // style={{tintColor:"#fff"}}
              />
            </TouchableOpacity>
          </View>
          <View className="mt-4">
            <Text className="text-oBlack dark:text-white text-xl font-psemibold text-center">{userData?.firstname} {userData?.lastname}</Text>
            <Text className="text-gray-600 dark:text-gray-200 text-sm font-pregular text-center mt-2">{userData?.email}</Text>
            <Text className="text-gray-600 dark:text-gray-200 text-sm font-pregular text-center mt-2">{getMetaValue(userData?.userMeta, "UserRole")}</Text>
            <View className="flex-row justify-between w-[80%] mt-6">
              <View className="bg-oBlack-light dark:bg-oBlack border border-gray-200 dark:border-black-200 p-4 py-2 rounded-xl">
                <Text className="text-gray-600 dark:text-gray-200 text-base font-pregular text-center">Të kryera:</Text>
                {/* <Text className="text-secondary text-lg font-psemibold text-center">{getMetaValue(userData?.userMeta, "LessonsCompleted")}</Text> */}
                <Text className="text-secondary text-lg font-psemibold text-center">{completedCourseData?.length}</Text>

              </View>
              <View className="bg-oBlack-light dark:bg-oBlack border border-gray-200 dark:border-black-200 p-4 py-2 rounded-xl">
                <Text className="text-gray-600 dark:text-gray-200 text-base font-pregular text-center">Telefoni:</Text>
                <Text className="text-secondary text-lg font-psemibold text-center">{getMetaValue(userData?.userMeta, "Phone")}</Text>
              </View>
            </View>
          </View>
        </View>
        {/* profile part */}
  
        {/* toggle part */}
        <View className="w-full border-t border-gray-200 dark:border-black-200">
          <View className="flex-row justify-between w-full border-b border-gray-200 dark:border-black-200">
            <View className={`w-1/2 py-4 border-r border-gray-200 dark:border-black-200 ${showDetails ? "bg-[#d9d9d9] dark:bg-oBlack" : "bg-primary-light dark:bg-primary"}`}>
              <TouchableOpacity 
                className="flex-row items-center gap-2 justify-center text-center"
                onPress={() => setShowDetails(true)}
              >
                <Image 
                  source={icons.resume}
                  style={{tintColor: showDetails ? "#ff9c01" : colorScheme === 'dark' ? "#fff" : "#000"}}
                  className="h-6 w-6 bg-secon"
                  resizeMode="contain"
                />
                <Text className="text-sm text-oBlack dark:text-white font-pregular">Detajet e llogarisë</Text>
              </TouchableOpacity>
            </View>
            <View className={`w-1/2 py-4 ${!showDetails ? "bg-[#d9d9d9] dark:bg-oBlack" : "bg-primary-light dark:bg-primary"}`}>
              <TouchableOpacity 
                className="flex-row items-center gap-2 justify-center text-center"
                onPress={() => setShowDetails(false)}
                >
                <Image 
                  source={icons.progress}
                  className="h-6 w-6"
                  resizeMode="contain"
                  style={{tintColor: !showDetails ? "#ff9c01" : colorScheme === "dark" ? "#FFF" : "#000"}}
                />
                <Text className="text-sm text-oBlack dark:text-white font-pregular">Progresi juaj</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* toggle part */}
  
        {/* user details */}
        { showDetails ? <>
          <View className="flex-row items-center w-[98%] mx-auto border border-gray-200 dark:border-black-200 rounded-lg mt-2 overflow-hidden" style={shadowStyle}>
              <View className={` ${showImportantDetails ? "bg-[#d9d9d9] dark:bg-oBlack" : "bg-primary-light dark:bg-primary"} p-2 border-r border-gray-200 dark:border-black-200 flex-1`}>
                <TouchableOpacity onPress={() => {setShowImportantDetails(true), setShowOtherDetails(false)}} className="items-center gap-2 flex-row justify-center">
                  <View>
                    <Image 
                      source={icons.info} 
                      style={{tintColor: showImportantDetails ? "#FF9C01" : colorScheme === "dark" ? "#fff" : "#000"}} 
                      className="w-6 h-6"
                      resizeMode='contain'
                      />
                  </View>
                  <Text className="text-sm text-center text-oBlack dark:text-white font-pregular">Te dhenat kryesore</Text>
                </TouchableOpacity>
              </View>
              <View className={`${showOtherDetails ? "bg-[#d9d9d9] dark:bg-oBlack" : "bg-primary-light dark:bg-primary"} flex-1 p-2`}>
                <TouchableOpacity onPress={() => {setShowOtherDetails(true), setShowImportantDetails(false)}} className="items-center gap-2 flex-row justify-center">
                  <View>
                    <Image 
                      source={icons.infoFilled} 
                      style={{tintColor: showOtherDetails ? "#FF9C01" : colorScheme === "dark" ? "#fff" : "#000"}}
                      className="w-6 h-6"
                      resizeMode='contain'
                      />
                  </View>
                  <Text className="text-sm text-center text-oBlack dark:text-white font-pregular">Informacione te tjera</Text>
                </TouchableOpacity>
              </View>
          </View>

          {showImportantDetails && 
            <View className="px-4 mb-4 mt-4 gap-3">
              <View>
                <Controller 
                  control={control}
                  name="name"
                  render={({field: {onChange, value}}) => (
                    <FormField
                      title={"Emri"}
                      placeholder={"Shkruani emrin tuaj këtu"}
                      value={value}
                      handleChangeText={onChange}
                    />
                  )}
                />
                <Text className="text-xs text-gray-600 dark:text-gray-400 font-plight mt-1">Per kualitet me te mire te veprimit ne platforme, shkruani emrin tuaj te vertete.</Text>
                {errors.name && (
                  <Text className="text-red-500 text-xs font-plight">{errors.name.message}</Text>
                )}
              </View>
              <View>
                <Controller 
                  control={control}
                  name="lastname"
                  render={({field: {onChange, value}}) => (
                    <FormField
                      title={"Mbiemri"}
                      placeholder={"Shkruani mbiemrin tuaj këtu"}
                      value={value}
                      handleChangeText={onChange}
                    />
                  )}
                />
                <Text className="text-xs text-gray-600 dark:text-gray-400 font-plight mt-1">Per kualitet me te mire te veprimit ne platforme, shkruani mbiemrin tuaj te vertete.</Text>
                {errors.lastname && (
                  <Text className="text-red-500 text-xs font-plight">{errors.lastname.message}</Text>
                )}
              </View>
              <View>
                <Controller 
                  control={control}
                  name="username"
                  render={({field: {onChange, value}}) => (
                    <FormField
                      title={"Emri juaj i perdoruesit"}
                      placeholder={"Shkruani nofken tuaj këtu"}
                      value={value}
                      handleChangeText={onChange}
                    />
                  )}
                />
                <Text className="text-xs text-gray-600 dark:text-gray-400 font-plight mt-1">Shkruani se si deshironi te paraqiteni ju ne platforme.</Text>
                {errors.username && (
                  <Text className="text-red-500 text-xs font-plight">{errors.username.message}</Text>
                )}
              </View>
              <View>
                <Controller 
                  control={control}
                  name="email"
                  render={({field: {onChange, value}}) => (
                    <FormField
                      title={"Emaili juaj"}
                      placeholder={"Shkruani emailin tuaj ketu"}
                      value={value}
                      handleChangeText={onChange}
                    />
                  )}
                />
                <Text className="text-xs text-gray-600 dark:text-gray-400 font-plight mt-1"><Text className="text-secondary">Vemendje:</Text> Ne ndryshim te emailit, ju duhet te verifikoni emailin e ri.</Text>
                {errors.email && (
                  <Text className="text-red-500 text-xs font-plight">{errors.email.message}</Text>
                )}
              </View>
              <View>
                <Controller 
                  control={control}
                  name="phoneNumber"
                  render={({field: {onChange, value}}) => (
                    <FormField
                      title={"Numri juaj"}
                      placeholder={"Shkruani numrin tuaj ketu"}
                      value={value}
                      handleChangeText={onChange}
                      keyboardType="phone-pad"
                    />
                  )}
                />
                <Text className="text-xs text-gray-600 dark:text-gray-400 font-plight mt-1">Paraqitni numrin tuaj ne perdorim aktual.</Text>
                {errors.phoneNumber && (
                  <Text className="text-red-500 text-xs font-plight">{errors.phoneNumber.message}</Text>
                )}
              </View>
              <View>
                <Controller 
                  control={control}
                  name="age"
                  render={({field: {onChange, value}}) => (
                    <FormField
                      title={"Mosha juaj"}
                      placeholder={"Shkruani moshen tuaj ketu"}
                      value={value ? String(value) : ""}
                      handleChangeText={(text) => onChange(parseInt(text))}
                      keyboardType="phone-pad"
                    />
                  )}
                />
                <Text className="text-xs text-gray-600 dark:text-gray-400 font-plight mt-1">Paraqitni moshen tuaj reale.</Text>
                {errors.age && (
                  <Text className="text-red-500 text-xs font-plight">{errors.age.message}</Text>
                )}
              </View>
                <View>
                  <TouchableOpacity
                    onPress={togglePassword}
                    className=""
                  >
                    <Text className="text-base text-secondary font-psemibold">{changePassword ? "Nuk dua të ndryshoj fjalëkalimin" : "Dëshironi të ndryshoni fjalëkalimin?"}</Text>
                  </TouchableOpacity>
                </View>
              {changePassword ? 
                <>
                <View>
                  <Controller 
                    control={control}
                    name="password"
                    render={({field: {onChange, value}}) => (
                      <FormField
                        title={"Fjalekalimi juaj"}
                        placeholder={"Shkruani fjalekalimin tuaj te ri ketu"}
                        value={value}
                        handleChangeText={onChange}
                        secureTextEntry
                      />
                    )}
                  />
                  <Text className="text-xs text-gray-600 dark:text-gray-400 font-plight mt-1">Shkruani nje fjalekalim te forte.</Text>
                  {errors.password && (
                    <Text className="text-red-500 text-xs font-plight">{errors.password.message}</Text>
                  )}
                </View>
                <View>
                  <Controller 
                    control={control}
                    name="confirmPassword"
                    render={({field: {onChange, value}}) => (
                      <FormField
                        title={"Konfirmoni fjalekalimin"}
                        placeholder={"Shkruani fjalekalimin tuaj te ri ketu"}
                        value={value}
                        handleChangeText={onChange}
                        secureTextEntry
                      />
                    )}
                  />
                  <Text className="text-xs text-gray-600 dark:text-gray-400 font-plight mt-1">Konfirmoni fjalekalimin e shkruar me larte.</Text>
                  {errors.confirmPassword && (
                    <Text className="text-red-500 text-xs font-plight">{errors.confirmPassword.message}</Text>
                  )}
                </View>
                </> : null}
                <CustomButton 
                  title={"Përditësoni të dhënat"}
                  containerStyles={"w-full mt-5"}
                  isLoading={isSubmitting}
                  handlePress={handleSubmit(updateDetails)}
                />
            </View>}

          {showOtherDetails && <ShowOtherDetailsProfile userId={userData?.id} />}
        </> : 
            <>
              <View className="flex-row items-center w-[98%] mx-auto border border-gray-200 dark:border-black-200 rounded-lg mt-2 mb-4 relative" style={shadowStyle}>
                <View className={` rounded-l-md ${completedCourses ? "bg-[#d9d9d9] dark:bg-oBlack" : "bg-primary-light dark:bg-primary"}  w-1/2 border-r border-gray-200 dark:border-black-200`}>
                  <TouchableOpacity onPress={() => {setCompletedCourses(!completedCourses), setShowCompletedQuizzes(false), setShowOnlineCoursesProgress(false)}} className="items-center gap-2 p-2 flex-row justify-center">
                    <View>
                      <Image 
                        source={images.mortarBoard} 
                        style={{tintColor: completedCourses ? "#FF9C01" : colorScheme === "dark" ? "#fff" : "#000"}} 
                        className="w-6 h-6"
                        resizeMode='contain'
                        />
                    </View>
                    <Text className="text-sm text-center text-oBlack dark:text-white font-pregular">Kurse te perfunduara</Text>
                  </TouchableOpacity>
                </View>


                <View className="absolute right-0 left-0 -bottom-6 items-center z-50 justify-center mx-auto">
                  <Animatable.View animation="pulse" iterationCount="infinite">
                    <TouchableOpacity onPress={() => {setShowCompletedQuizzes(false), setCompletedCourses(false), setShowOnlineCoursesProgress(!showOnlineCoursesProgress)}} className={`flex-row items-center justify-center gap-2 ${showOnlineCoursesProgress ? "bg-[#d9d9d9] dark:bg-oBlack" : "bg-primary-light dark:bg-primary"} border border-gray-200 dark:border-black-200 rounded-md p-2 py-1`} style={shadowStyle}>
                      <Image 
                        source={icons.parents} 
                        style={{tintColor: showOnlineCoursesProgress ? "#FF9C01" : colorScheme === "dark" ? "#fff" : "#000"}} 
                        className="w-6 h-6"
                        resizeMode='contain'
                        />
                      <Text className="text-sm text-center text-oBlack dark:text-white font-pregular">Progresi <Text className="text-secondary">Meso Online</Text></Text>
                    </TouchableOpacity>
                  </Animatable.View>
                </View>


                <View className={`rounded-r-md ${showCompletedQuizzes ? "bg-[#d9d9d9] dark:bg-oBlack" : "bg-primary-light dark:bg-primary"} w-1/2 `}>
                  <TouchableOpacity onPress={() => {setShowCompletedQuizzes(!showCompletedQuizzes), setCompletedCourses(false), setShowOnlineCoursesProgress(false)}} className="items-center gap-2 p-2 flex-row justify-center">
                    <View>
                      <Image 
                        source={icons.quiz} 
                        style={{tintColor: showCompletedQuizzes ? "#FF9C01" : colorScheme === "dark" ? "#fff" : "#000"}}
                        className="w-6 h-6"
                        resizeMode='contain'
                        />
                    </View>
                    <Text className="text-sm text-center text-oBlack dark:text-white font-pregular">Kuize te perfunduara</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
                {(completedCourses && completedCourseData?.length > 0) ? <View className="mb-2">
                  {completedCourseData.map((item) => {
                    
                    const date = new Date(item?.createdAt); // Ensure createdAt is properly parsed
                    const formattedDate = date.toLocaleDateString('sq-AL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    });

                    return(
                      <View 
                        key={"progressItem-" + item?.id}
                        style={shadowStyle}
                        className="bg-oBlack-light dark:bg-oBlack rounded-[10px] border border-gray-200 dark:border-black-200 m-4 p-4 relative"
                      >
                        <View className="flex-row justify-between border-b border-gray-200 dark:border-black-200 pb-4 items-center gap-2">
                          <View className="gap-4 flex-col flex-[0.5]">
                            <View>
                              <Text className="text-xs font-plight text-oBlack dark:text-white">Emri i kursit:</Text>
                              <Text className="text-base font-psemibold text-oBlack dark:text-white">{item?.course?.courseName}</Text>
                            </View>
                            <View>
                              <Text className="text-xs font-plight text-oBlack dark:text-white">Kategoria:</Text>
                              <Text className="text-base font-psemibold text-oBlack dark:text-white">{getCourseCategories(userCategories, item?.course?.courseCategory)}</Text>
                            </View>
                          </View>
                          <View className="flex-[0.5] rounded-[10px]  overflow-hidden">
                            <Image 
                              source={images.testimage}
                              className="h-[100px] w-full border border-white dark:border-black-200 rounded-[10px]"
                              resizeMode='cover'
                            />
                          </View>
                        </View>


                        <View className="absolute left-2 top-2">
                          <Image 
                            source={images.mortarBoard}
                            className="h-20 w-20 opacity-20"
                            resizeMode='contain'
                            tintColor={"#FF9C01"}
                          />
                        </View>
                        <Animatable.View 
                          className="absolute -bottom-3 items-center justify-center right-0 left-0 "
                          duration={1000}
                          iterationCount="infinite"
                          animation={bounceDownAnimation}
                          >
                          <TouchableOpacity onPress={() => setShowMoreCompleted((prevData) => prevData.includes(item?.id) ? prevData.filter((existingIds) => existingIds !== item?.id) : [...prevData, item?.id])}><Text className="text-white font-psemibold text-xs bg-secondary px-2 py-1 rounded-[5px]">{showMoreCompleted.includes(item?.id) ? "Me pak" : "Me shume"}</Text></TouchableOpacity>
                        </Animatable.View>

                        {/* more details */}
                        {showMoreCompleted.includes(item?.id) && <View className="mt-4 overflow-hidden relative">
                          <View className="absolute bottom-0 right-2">
                            <Image 
                              source={images.reward}
                              className="h-20 w-20 opacity-20"
                              resizeMode='contain'
                              tintColor={"#FF9C01"}
                            />
                          </View>
                          <Animatable.View
                          animation="fadeInLeft"
                          duration={700}
                          >
                            <Text className="text-base font-psemibold text-oBlack dark:text-white">Pershkrimi i kursit:</Text>
                            <Text className="text-xs font-light text-gray-600 dark:text-gray-400">{item?.course?.courseDescription}</Text>
                          </Animatable.View>
                          <View className="flex-row items-end justify-between overflow-hidden">
                            <View className="flex-1">
                              <Link className="text-secondary font-psemibold text-xs underline" href={`/completed/${item?.course?.id}`}>Drejtohuni per me shume</Link>
                            </View>
                            <Animatable.View 
                              className="flex-1"
                              animation="fadeInRight"
                              duration={700}
                            >
                              <Text className="text-xs font-light text-oBlack dark:text-white text-right">Perfunduar me:</Text>
                              <Text className="text-base font-psemibold text-oBlack dark:text-white text-right">{formattedDate}</Text>
                            </Animatable.View>
                          </View>
                        </View>}
                        {/* more details */}
                      </View>
                    )
                  })}
                </View> : (completedCourses && <View style={shadowStyle} className=" mx-4 mt-4 bg-oBlack-light dark:bg-oBlack border border-gray-200 dark:border-black-200 rounded-[5px] p-0.5 py-4 pt-5">
                  <EmptyState
                      title={"Nuk u gjet asnje kurs i perfunduar"}
                      titleStyle={"!font-pregular mb-2"}
                      subtitle={"Nese mendoni qe ka ndodhur nje gabim, rifreskoni dritaren apo vazhdoni kurset e mbetura duke klikuar ne butonin e meposhtem!"}
                      buttonTitle={"Vazhdoni kurset"}
                      buttonFunction={() => router.replace('/categories')}
                  />
                </View>)}
              {(!completedCourses && !showCompletedQuizzes && !showOnlineCoursesProgress) &&
              <UserProgressComponent
                userDataId={userData?.id}
              />}
                {(showCompletedQuizzes && completedQuizzesData?.length > 0) ? 
                <View className="mb-4">
                    {completedQuizzesData && completedQuizzesData.map((item) => {
                      // console.log(item);
                      const date = new Date(item?.createdAt); // Ensure createdAt is properly parsed
                      const formattedDate = date.toLocaleDateString('sq-AL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      });
                      return(
                        <View 
                          key={"quizCompleted-" + item?.id}
                          style={shadowStyle}
                          className="bg-oBlack-light dark:bg-oBlack rounded-[10px] border border-gray-200 dark:border-black-200 m-4 p-4 relative"
                        >
                          <View className="flex-row justify-between border-b border-black-200 pb-4 items-center gap-2">
                            <View className="gap-4 flex-col flex-[0.5]">
                              <View>
                                <Text className="text-xs font-plight text-oBlack dark:text-white">Emri i kuizit:</Text>
                                <Text className="text-base font-psemibold text-oBlack dark:text-white">{item?.quiz?.quizName}</Text>
                              </View>
                              <View>
                                <Text className="text-xs font-plight text-oBlack dark:text-white">Kategoria:</Text>
                                <Text className="text-base font-psemibold text-oBlack dark:text-white">{getCourseCategories(userCategories, item?.quiz?.quizCategory)}</Text>
                              </View>
                            </View>
                            <View className="gap-4 flex-col flex-[0.5]">
                              <View>
                                <Text className="text-xs font-plight text-oBlack dark:text-white">Gabimet:</Text>
                                <Text className="text-base font-psemibold text-oBlack dark:text-white"><Text className="text-secondary">{item?.mistakes}</Text> {item?.mistakes === 1 ? "Gabim" : "Gabime"} </Text>
                              </View>
                              <View>
                                <Text className="text-xs font-plight text-oBlack dark:text-white">Koha:</Text>
                                <Text className="text-base font-psemibold text-oBlack dark:text-white">{item?.duration}</Text>
                              </View>
                            </View>
                          </View>

                          <View className="absolute left-2 top-2">
                            <Image 
                              source={images.mortarBoard}
                              className="h-20 w-20 opacity-20"
                              resizeMode='contain'
                              tintColor={"#FF9C01"}
                            />
                          </View>
                          <Animatable.View 
                            className="absolute -bottom-3 items-center justify-center right-0 left-0 "
                            duration={1000}
                            iterationCount="infinite"
                            animation={bounceDownAnimation}
                          >
                            <TouchableOpacity onPress={() => setShowMoreInQuizzes((prevData) => prevData.includes(item?.id) ? prevData.filter((existingId => existingId !== item?.id)) : [...prevData, item?.id])}><Text className="text-white font-psemibold text-xs bg-secondary px-2 py-1 rounded-[5px]">{showMoreInQuizzes.includes(item?.id) ? "Me pak" : "Me shume"}</Text></TouchableOpacity>
                          </Animatable.View>
                            {showMoreInQuizzes.includes(item?.id) && <View className="mt-4 overflow-hidden relative">
                            <View className="absolute bottom-0 right-2">
                              <Image 
                                source={images.reward}
                                className="h-20 w-20 opacity-20"
                                resizeMode='contain'
                                tintColor={"#FF9C01"}
                              />
                            </View>
                              <Animatable.View
                                animation="fadeInLeft"
                                duration={700}
                              >
                                <Text className="text-base font-psemibold text-oBlack dark:text-white">Pershkrimi i kuizit:</Text>
                                <Text className="text-xs font-light text-gray-600 dark:text-gray-400">{item?.quiz?.quizDescription}</Text>
                              </Animatable.View>

                              <View className="flex-row items-end justify-between overflow-hidden">
                                <View className="flex-1">
                                  <Link className="text-secondary font-psemibold text-xs underline" href={`/quiz/${item?.quiz?.id}`}>Drejtohuni per ne kuiz</Link>
                                </View>
                                <Animatable.View 
                                  className="flex-1"
                                  animation="fadeInRight"
                                  duration={700}
                                >
                                  <Text className="text-xs font-light text-oBlack dark:text-white text-right">Perfunduar me:</Text>
                                  <Text className="text-base font-psemibold text-oBlack dark:text-white text-right">{formattedDate}</Text>
                                </Animatable.View>
                              </View>
                          </View>}
                        </View>
                      )
                    })}
                </View> : 
                (showCompletedQuizzes &&  <View style={shadowStyle} className=" mx-4 mt-4 bg-oBlack-light dark:bg-oBlack border border-gray-200 mb-4 dark:border-black-200 rounded-[5px] p-0.5 py-4 pt-5">
                  <EmptyState
                      title={"Nuk u gjet asnje kuiz i perfunduar"}
                      titleStyle={"!font-pregular mb-2"}
                      subtitle={"Nese mendoni qe ka ndodhur nje gabim, rifreskoni dritaren apo vazhdoni kuizet e mbetura duke klikuar ne butonin e meposhtem!"}
                      buttonTitle={"Vazhdoni kuizet"}
                      buttonFunction={() => router.replace('/all-quizzes')}
                  />
                </View> )}

                {showOnlineCoursesProgress && (
                  (onlineCoursesLoading ? <View className="mt-10"><Loading /></View> : 
                    (onlineCoursesData.length > 0 ? (
                      (onlineCoursesData.map((item, idx) => (
                        <View key={`onlineprogress-${idx}`} className="mx-4 mt-8 mb-6">
                          <OnlineClassesCard classes={item} userCategories={userCategories} profilePlace={true} />
                        </View>
                    )))
                  ) : (
                    <View style={shadowStyle} className=" mx-4 my-4 bg-oBlack-light dark:bg-oBlack border border-gray-200 dark:border-black-200 rounded-[5px] p-0.5 py-4 pt-5">
                      <EmptyState
                        title={"Nuk u gjet asnje progress i Takimeve Online"}
                        titleStyle={"!font-pregular mb-2"}
                        subtitle={"Nese mendoni qe ka ndodhur nje gabim, rifreskoni dritaren apo filloni shfletimin e ndonje Kursi Online duke klikuar ne butonin e meposhtem!"}
                        buttonTitle={"Shfletoni Kurse Online"}
                        buttonFunction={() => router.replace('/allOnlineMeetings')}
                        />
                    </View>
                  ))
                )
                )}

            </>
        }
        {/* user details */}
        
      </KeyboardAwareScrollView>
    )
  }
}

export default Profile