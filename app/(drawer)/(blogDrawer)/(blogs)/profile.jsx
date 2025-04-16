import { View, Text } from 'react-native'
import React from 'react'
import { Redirect } from 'expo-router'
import { useRole } from '../../../../navigation/RoleProvider';

const profile = () => {
  const {role} = useRole();
  if(role === "Instructor") return <Redirect href={'/instructor/instructorProfile'}/>
  else return <Redirect href={"(tabs)/profile"}/> 
  
}

export default profile