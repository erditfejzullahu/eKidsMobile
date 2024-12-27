import { View, Text, FlatList, Image, RefreshControl, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import useFetchFunction from '../../../hooks/useFetchFunction'
import { getAllUsers } from '../../../services/fetchingService'
import Loading from '../../../components/Loading'
import { icons, images } from '../../../constants'
import { useGlobalContext } from '../../../context/GlobalProvider'
import AllUsersInteractions from '../../../components/AllUsersInteractions'
import { router } from 'expo-router'
import { useRouter } from 'expo-router'
import { Platform } from 'react-native'

const AllMessages = () => {
  const router = useRouter();
  const {data, isLoading, refetch} = useFetchFunction(() => getAllUsers())
  const {user, isLoading: userLoading } = useGlobalContext();
  const userData = user?.data?.userData;
  // console.log(userData, 'asdasd');
  
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [allUsers, setAllUsers] = useState(null)

  const [messengerPeopleFilter, setMessengerPeopleFilter] = useState({
    showBy: 'all'
  })

  const onRefresh = () => {
    setIsRefreshing(true)
    refetch();
    setIsRefreshing(false)
  }

  useEffect(() => {
    if(data){
      // const filteredData = data.filter(user => user.id !== userData?.id)
      // setAllUsers(filteredData);
      setAllUsers(data);
    }else{
      setAllUsers(null);
    }
  }, [data])

  useEffect(() => {
    // console.log("messenger filter changed, so change users filtered");
    
  }, [messengerPeopleFilter])
  

  if(isLoading || userLoading){
    return(
      <Loading />
    )
  }else{
    return (
      <FlatList
        
        refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={isRefreshing}/>}
        className="h-full bg-primary px-4"
        data={allUsers}
        contentContainerStyle={{gap: 14}}
        keyExtractor={(item) => 'user-' + item?.id?.toString()}
        renderItem={({item}) => (
          <AllUsersInteractions 
            usersData={item}
            currentUserData={userData}
          />
        )}
        ListHeaderComponent={() => (
          <>
          <View style={styles.box} className="-mb-4">
          <View className="my-4 border-b border-black-200 pb-4">
            <Text className="text-2xl text-white font-pmedium">Lajmetari juaj
              <View>
                <Image
                  source={images.path}
                  className="h-auto w-[100px] absolute -bottom-8 -left-12"
                  resizeMode='contain'
                />
              </View>
            </Text>
            <Text className="text-gray-200 text-xs font-plight mt-5">Ketu mund te komunikoni me komunitetin e <Text className="font-psemibold text-secondary">ShokuMesimit</Text> ne lidhje me tema te perditshme, aktualitetet e fundit apo ne lidhje me tematikat e kurseve apo kuizeve ne pergjithesi!</Text>
          </View>
          <View className="relative w-full mb-8">
            <View className="border border-black-200 rounded-[10px] p-2">
              <Text className="text-white font-pregular text-base mb-2">Detajet tuaja te komunikimit:</Text>
              <View className="flex-row bg-oBlack flex-wrap justify-between items-center p-4 border border-black-200 rounded-[10px]">
                <View className="">
                  <Image 
                    // source={{uri: userData?.profilePictureUrl}}
                    source={icons.profile}
                    className="h-14 w-14 rounded-[10px]"
                    resizeMode='contain'
                  />
                </View>
                <View>
                  <Text className="font-psemibold text-white text-lg">{userData?.firstname} {userData?.lastname}</Text>
                  <Text className="font-plight text-gray-200 text-xs">{userData?.email}</Text>
                </View>
                <View>
                  <TouchableOpacity onPress={() => router.replace('/profile')}>
                    <Image 
                      source={icons.resume}
                      className="h-12 w-12"
                      tintColor={"#ff9c01"}
                      resizeMode='contain'
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>



            <View className="flex-row mt-4 border border-black-200 rounded-[5px] overflow-hidden">
              <View className={`flex-1 items-center border-r border-black-200 ${messengerPeopleFilter.showBy === 'all' ? "bg-oBlack" : ""}`}>
                <TouchableOpacity onPress={() => setMessengerPeopleFilter((prevData) => ({...prevData, showBy: 'all'}))} className="p-2 flex-row items-center gap-1">
                  <Text className="font-plight text-white text-sm">Te gjithe</Text>
                  <Image 
                      source={icons.parents}
                      className="w-4 h-4"
                      resizeMode='contain'
                      style={{tintColor: messengerPeopleFilter.showBy === 'all' ? "#ff9c01" : "#fff"}}
                  />
                </TouchableOpacity>
              </View>
              <View className={`flex-1 items-center border-r border-black-200 ${messengerPeopleFilter.showBy === 'only-friends' ? "bg-oBlack" : ""}`} >
                <TouchableOpacity onPress={() => setMessengerPeopleFilter((prevData) => ({...prevData, showBy: 'only-friends'}))} className="p-2 flex-row items-center gap-1">
                  <Text className="font-plight text-white text-sm">Miqte</Text>
                  <Image 
                      source={icons.friends}
                      className="w-4 h-4"
                      resizeMode='contain'
                      style={{tintColor: messengerPeopleFilter.showBy === 'only-friends' ? "#ff9c01" : "#fff"}}
                  />
                </TouchableOpacity>
              </View>
              <View className={`flex-1 items-center ${messengerPeopleFilter.showBy === 'close-friends' ? "bg-oBlack" : ""} `}>
                <TouchableOpacity onPress={() => setMessengerPeopleFilter((prevData) => ({...prevData, showBy: 'close-friends'}))} className="p-2 flex-row items-center gap-1">
                  <Text className="font-plight text-white text-sm">Te ngushte
                  </Text>
                  <Image 
                      source={icons.heart}
                      className="w-4 h-4"
                      resizeMode='contain'
                      style={{tintColor: messengerPeopleFilter.showBy === 'close-friends' ? "#ff9c01" : "#fff"}}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View  className="absolute border-b w-1/2 border-black-200 -bottom-4 left-[25%] m-auto items-center justify-center"/>
          </View>
          </View>
          </>
        )}
        ListFooterComponent={() => (
          <View className="mt-2 mb-6 relative">
            <View  className="absolute border-t border-black-200 top-0 right-[25%] w-1/2"/>
            <Text className="text-white font-plight text-xs pt-4">Mundesuar nga <Text className="text-secondary font-psemibold">Murrizi Co.</Text></Text>
          </View>
        )}
      />
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
})

export default AllMessages