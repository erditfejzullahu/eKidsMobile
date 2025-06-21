import { View, Text } from 'react-native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme } from 'nativewind'

const AuthLayout = () => {
  const {colorScheme} = useColorScheme();
  return (
      <>
        <Stack>
          <Stack.Screen
            name="sign-in"
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen
            name="sign-up"
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen 
            name="forgot-password"
            options={{
              headerShown: false
            }}
          />
        </Stack>

        <StatusBar translucent backgroundColor="transparent" style={`${colorScheme === 'light' ? "dark" : "light"}`}/>
      </>
      
  )
}

export default AuthLayout