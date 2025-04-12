import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { useGlobalContext } from '../../../context/GlobalProvider'
import Loading from '../../../components/Loading';
import DefaultHeader from '../../../components/DefaultHeader';

const instructorHome = () => {
  const {user, isLoading} = useGlobalContext();
  if(isLoading) return <Loading />
  const userData = user.data.userData;
  console.log(userData);
  
  return (
    <View className="flex-1">
      <FlatList 
        className="h-full bg-primary"
        contentContainerStyle={{paddingLeft: 16, paddingRight: 16}}
        ListHeaderComponent={() => (
          <DefaultHeader showBorderBottom headerTitle={`${userData.firstname + " " + userData.lastname}`} topSubtitle={"Miresevjen perseri,"} bottomSubtitle={"Ju jeni duke vepruar ne baze te rolit te instruktorit. Per cdo pakjartesi mund te kontaktoni Panelin e Ndihmes!"}/>
        )}
      />
    </View>
  )
}

export default instructorHome