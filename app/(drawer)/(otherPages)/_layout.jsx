import { View, Text } from 'react-native'
import React from 'react'
import { Redirect, Stack } from 'expo-router'
import Topbar from '../../../components/Topbar'
import { useRole } from '../../../navigation/RoleProvider'

const _layout = ({children}) => {
  const {role} = useRole();
  if(role === "Instructor") return <Redirect href={'/instructor/instructorHome'}/>
  return (
    <>
    {/* E para i specifikon krejt options jon per krejt e edyta specifikim per secilin file... */}
    <Stack screenOptions={{gestureEnabled: true, headerShown: false}}></Stack>
    {/* <Stack>
      <Stack.Screen name="all-quizzes" options={{ headerShown: false }} />
      <Stack.Screen name="my-quizzes" options={{headerShown: false}} />
    </Stack> */}
    {children}
    </>
  )
}

export default _layout