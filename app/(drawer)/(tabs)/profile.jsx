import { View, Text, Image, Alert, StyleSheet, RefreshControl, ActivityIndicator, Platform, Touchable } from 'react-native'
import React, {useState, useEffect} from 'react'
import { useGlobalContext } from '../../../context/GlobalProvider'
import { images, icons } from '../../../constants'
import { getCourseCategories, getMetaValue, updateProfilePicture, updateUserDetails } from '../../../services/fetchingService'
import { TouchableOpacity } from 'react-native'
import FormField from '../../../components/FormField'
import { ScrollView } from 'react-native'
import CustomButton from '../../../components/CustomButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Loading from '../../../components/Loading'
import { userDetails } from '../../../services/necessaryDetails'
import UserProgressComponent from '../../../components/UserProgressComponent'
import NotifierComponent from '../../../components/NotifierComponent'
import { currentUserID } from '../../../services/authService'
import * as ImagePicker from 'expo-image-picker';
import useFetchFunction from '../../../hooks/useFetchFunction'
import { getCompletedLessons } from '../../../services/fetchingService'
import * as Animatable from 'react-native-animatable'
import { Link } from 'expo-router'

const profile = () => {

  const { user, isLoading, setUser } = useGlobalContext();
  // console.log(isLoading, 'loading');
  const userData = user?.data?.userData;
  const userCategories = user?.data?.categories

  const {data, isLoading: completedLoading, refetch} = useFetchFunction(() => getCompletedLessons())
  
  useEffect(() => {
    if(data){
      setCompletedCourseData(data);
    }
  }, [data])

  const bounceDownAnimation = {
    0: { transform: [{ translateY: 0 }] },
    0.5: { transform: [{ translateY: 5 }] }, // Move down by 10 units
    1: { transform: [{ translateY: 0 }] }, // Back to original position
  };
  
  const [showDetails, setShowDetails] = useState(true)
  const [changePassword, setChangePassword] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [completedCourses, setCompletedCourses] = useState(false)
  const [completedCourseData, setCompletedCourseData] = useState(null)
  const [showMoreCompleted, setShowMoreCompleted] = useState(false)

  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    password: '',
    confirmPassword: '',
    username: '',
    email: '',
    phone: '',
  })


  const onRefresh = async () => {
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
  }

  useEffect(() => {
    if(userData){
      setForm({
        firstname: userData.firstname,
        lastname: userData.lastname,
        username: userData.username,
        email: userData.email,
        phone: getMetaValue(userData.userMeta, "Phone")
      })
    }
  }, [userData])

  const togglePassword = () => {
    setChangePassword(!changePassword)
    setForm({
      ...form,
      password: '',
      confirmPassword: ''
    })
  }

  const {showNotification: alertPassword} = NotifierComponent({
    title: "Mbushni fushat e kerkuara!",
    description: "Ju lutem mbushni fushat e fjalëkalimeve dhe sigurohuni të shkruani fjalëkalimet e kërkuara!",
    alertType: "warning"
  })

  const {showNotification: alertFields} = NotifierComponent({
    title: "Ju lutem mbushni fushat e kërkuara!",
    alertType: "warning"
  })

  const {showNotification: updateSuccessful} = NotifierComponent({
    title: "Te dhenat u perditesuan me sukses!"
  })

  const {showNotification: updateFailed} = NotifierComponent({
    tite: "Dicka shkoi gabim!",
    description: "Ju lutem provoni perseri apo kontaktoni Panelin e Ndihmes",
    alertType: "warning"
  })

  const {showNotification: profileUpdateSuccess} = NotifierComponent({
    title: "Fotoja juaj e profilit u perditesua me sukses!"
  }) 




  const updateDetails = async () => {
    const userId = await currentUserID();
    if(changePassword){
      if(!form.password || !form.confirmPassword || (form.password !== form.confirmPassword)){
        alertPassword()
      }else if(!form.firstname || !form.lastname || !form.username || !form.email || !form.phone){
        alertFields();
      }else{
        try {
          const response = await updateUserDetails(userId, "changePassword", {
            "firstname": form.firstname,
            "lastname": form.lastname,
            "username": form.username,
            "password": form.password,
            "confirmPassword": form.confirmPassword,
            "email": form.email,
          })
          if(response === 200){
            updateSuccessful();
            onRefresh()
          }else{
            updateFailed();
          }
        } catch (error) {
          console.error(error);
          
        }
      }
    }else{
      if(!form.firstname || !form.lastname || !form.username || !form.email || !form.phone){
        alertFields();
      }else{
        try {
          const response = await updateUserDetails(userId, "", {
            "firstname": form.firstname,
            "lastname": form.lastname,
            "username": form.username,
            "password": form.password,
            "confirmPassword": form.confirmPassword,
            "email": form.email,
          })
          if(response === 200){
            updateSuccessful();
            onRefresh()
          }else{
            updateFailed();
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  const [image, setImage] = useState({
    type: '',
    base64: '',
  });

  const profileImage = async () => {
    
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if(!permissionResult){
      // console.log(permissionResult);
      
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    })

    // console.log(result);

    if(!result.canceled){
      setImage((prevData) => ({
        ...prevData,
        type: `data:${result.assets[0].mimeType};base64,`,
        base64: result.assets[0].base64
      }));      
      changeProfilePicture(image);
    }
    
  }

  const changeProfilePicture = async (base64Data) => {
    // console.log(base64Data);
    
    const userId = await currentUserID();
    const formattedBase64 = `${base64Data.type}${base64Data.base64}`;
    // console.log(formattedBase64);
    
    try {
      const response = await updateProfilePicture(userId, {"base64Profile": formattedBase64});
      if(response === 200){
        profileUpdateSuccess();
        onRefresh();
      }else{
        updateFailed()
      }
    } catch (error) {
      console.error(error, '????');
    }
  }

  if(refreshing){
    return(
      <Loading />
    )
  }else{
    return (
      <ScrollView 
        className="h-full bg-primary"
        refreshControl={
          <RefreshControl 
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ff9c01" colors={['#ff9c01', '#ff9c01', '#ff9c01']}/>
        }
      >
        {/* profile part */}
        <View className="w-full items-center justify-center mb-8">
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
            <Text className="text-white text-xl font-psemibold text-center">{userData?.firstname} {userData?.lastname}</Text>
            <Text className="text-gray-200 text-sm font-pregular text-center mt-2">{userData?.email}</Text>
            <Text className="text-gray-200 text-sm font-pregular text-center mt-2">{getMetaValue(userData?.userMeta, "UserRole")}</Text>
            <View className="flex-row justify-between w-[250px] mt-6">
              <View>
                <Text className="text-gray-200 text-base font-pregular text-center">Të kryera:</Text>
                {/* <Text className="text-secondary text-lg font-psemibold text-center">{getMetaValue(userData?.userMeta, "LessonsCompleted")}</Text> */}
                <Text className="text-secondary text-lg font-psemibold text-center">{completedCourseData?.length}</Text>

              </View>
              <View>
                <Text className="text-gray-200 text-base font-pregular text-center">Telefoni:</Text>
                <Text className="text-secondary text-lg font-psemibold text-center">{getMetaValue(userData?.userMeta, "Phone")}</Text>
              </View>
            </View>
          </View>
        </View>
        {/* profile part */}
  
        {/* toggle part */}
        <View className="w-full border-t border-black-200 ">
          <View className="flex-row justify-between w-full border-b border-black-200">
            <View className="w-1/2 py-4 border-r border-black-200" style={{backgroundColor: showDetails ? "#13131a" : "transparent"}}>
              <TouchableOpacity 
                className="flex-row items-center gap-2 justify-center text-center"
                onPress={() => setShowDetails(true)}
              >
                <Image 
                  source={icons.resume}
                  style={{tintColor: showDetails ? "#ff9c01" : "#fff"}}
                  className="h-6 w-6 bg-secon"
                  resizeMode="contain"
                />
                <Text className="text-sm text-white font-pregular">Detajet e llogarisë</Text>
              </TouchableOpacity>
            </View>
            <View className="w-1/2 py-4" style={{backgroundColor: !showDetails ? "#13131a" : "transparent"}}>
              <TouchableOpacity 
                className="flex-row items-center gap-2 justify-center text-center"
                onPress={() => setShowDetails(false)}
                >
                <Image 
                  source={icons.progress}
                  className="h-6 w-6"
                  resizeMode="contain"
                  style={{tintColor: !showDetails ? "#ff9c01" : "#FFF"}}
                />
                <Text className="text-sm text-white font-pregular">Progresi juaj</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* toggle part */}
  
        {/* user details */}
        { showDetails ? <>
        <KeyboardAwareScrollView style={styles.container}
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true} // Ensures Android support
        extraScrollHeight={50} // Adjust the scroll height when the keyboard is open
        keyboardShouldPersistTaps="handled"
        >
          <View className="px-4 mb-4">
            <FormField
              title={"Emri"}
              placeholder={"Shkruani emrin tuaj këtu"}
              value={form.firstname}
              handleChangeText={(e) => setForm({ ...form, firstname: e })}
              otherStyles={"mt-5"}
            />
            <FormField 
              title={"Mbiemri"}
              placeholder={"Shkruani mbiemrin tuaj këtu"}
              value={form.lastname}
              handleChangeText={(e) => setForm({ ...form, lastname: e })}
              otherStyles={"mt-5"}
            />
            <FormField 
              title={"Nofka juaj"}
              placeholder={"Shkruani nofkën tuaj këtu"}
              value={form.username}
              handleChangeText={(e) => setForm({ ...form, username: e })}
              otherStyles={"mt-5"}
            />
            <FormField 
              title={"Emaili juaj"}
              placeholder={"Shkruani emailin tuaj këtu"}
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e})}
              otherStyles={"mt-5"}
              keyboardType="email-address"
            />
            <FormField 
              title={"Numri juaj i telefonit"}
              placeholder={"044-536-900"}
              value={form.phone}
              handleChangeText={(e) => setForm({ ...form, phone: e })}
              otherStyles={"mt-5"}
              keyboardType="number-pad"
            />
              <TouchableOpacity
                onPress={togglePassword}
                className="mt-5"
              >
                <Text className="text-base text-secondary font-psemibold">{changePassword ? "Nuk dua të ndryshoj fjalëkalimin" : "Dëshironi të ndryshoni fjalëkalimin?"}</Text>
              </TouchableOpacity>
            {changePassword ? 
              <>
              <View>
                <FormField 
                  title={"Ndryshoni fjalëkalimin"}
                  placeholder={"Shkruani fjalëkalimin e ri"}
                  value={form.password}
                  handleChangeText={(e) => setForm({ ...form, password: e })}
                  otherStyles={"mt-5"}
                />
                <FormField 
                  title={"Konfirmoni fjalëkalimin e ri"}
                  placeholder={"Shkruani fjalëkalimin e mësipërm"}
                  value={form.confirmPassword}
                  handleChangeText={(e) => setForm({ ...form, confirmPassword: e })}
                  otherStyles={"mt-5"}
                />
              </View>
              </> : null}
              <CustomButton 
                title={"Përditësoni të dhënat"}
                containerStyles={"w-full mt-5"}
                isLoading={submitLoading}
                handlePress={updateDetails}
              />
          </View>
        </KeyboardAwareScrollView>
        </> : 
            <>
              <View className={` ${completedCourses ? "bg-oBlack" : ""} border-b border-black-200 p-2`}>
                <TouchableOpacity onPress={() => setCompletedCourses(!completedCourses)} className="items-center gap-2 flex-row justify-center">
                  <View>
                    <Image 
                      source={images.mortarBoard} 
                      style={{tintColor: completedCourses ? "#FF9C01" : "#fff"}} 
                      className="w-6 h-6"
                      resizeMode='contain'
                      />
                  </View>
                  <Text className="text-sm text-center text-white font-pregular">Kurse te perfunduara</Text>
                </TouchableOpacity>
              </View>
                {completedCourses && <View className="mb-2">
                  {completedCourseData.map((item) => {
                    
                    const date = new Date(item?.createdAt); // Ensure createdAt is properly parsed
                    const formattedDate = date.toLocaleDateString('sq-AL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    });

                    return(
                      <View 
                        key={item?.id}
                        style={styles.box}
                        className="bg-oBlack rounded-[10px] border border-black-200 m-4 p-4 relative"
                      >
                        <View className="flex-row justify-between border-b border-black-200 pb-4 items-center gap-2">
                          <View className="gap-4 flex-col flex-[0.5]">
                            <View>
                              <Text className="text-xs font-plight text-white">Emri i kursit:</Text>
                              <Text className="text-base font-psemibold text-white">{item?.course?.courseName}</Text>
                            </View>
                            <View>
                              <Text className="text-xs font-plight text-white">Kategoria:</Text>
                              <Text className="text-base font-psemibold text-white">{getCourseCategories(userCategories, item?.course?.courseCategory)}</Text>
                            </View>
                          </View>
                          <View className="flex-[0.5] rounded-[10px]  overflow-hidden">
                            <Image 
                              source={images.testimage}
                              className="h-[100px] w-full border border-black-200 rounded-[10px]"
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
                          <TouchableOpacity onPress={() => setShowMoreCompleted(!showMoreCompleted)}><Text className="text-white font-psemibold text-xs bg-secondary px-2 py-1 rounded-[5px]">{showMoreCompleted ? "Me pak" : "Me shume"}</Text></TouchableOpacity>
                        </Animatable.View>

                        {/* more details */}
                        {showMoreCompleted && <View className="mt-4 overflow-hidden relative">
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
                            <Text className="text-base font-psemibold text-white">Pershkrimi i kursit:</Text>
                            <Text className="text-xs font-light text-white">{item?.course?.courseDescription}</Text>
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
                              <Text className="text-xs font-light text-white text-right">Perfunduar me:</Text>
                              <Text className="text-base font-psemibold text-white text-right">{formattedDate}</Text>
                            </Animatable.View>
                          </View>
                        </View>}
                        {/* more details */}
                      </View>
                    )
                  })}
                </View>}
              {!completedCourses &&<UserProgressComponent
                userData={userData}
              />}
            </>
        }
        {/* user details */}
        
      </ScrollView>
    )
  }
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


export default profile