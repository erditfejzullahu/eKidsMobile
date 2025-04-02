import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import React from 'react'
import { icons, images } from '../../../../../constants'
import { useRouter } from 'expo-router'
import CreateDiscussionForm from '../../../../../components/CreateDiscussionForm'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const addDiscussion = () => {
    const router = useRouter();
  return (
    <KeyboardAwareScrollView  className="h-full bg-primary px-4" keyboardShouldPersistTaps="handled" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View className="my-4 flex-row items-center gap-2 relative border-b border-black-200 pb-6">
            <TouchableOpacity onPress={() => router.back()} className="absolute top-0 right-0 bg-secondary p-2 rounded-md" style={styles.box}>
                <Image 
                    source={icons.leftArrow}
                    className="h-6 w-6"
                    resizeMode='contain'
                    tintColor={"#fff"}
                />
            </TouchableOpacity>
            <View>
                <Text className="text-2xl text-white font-pmedium">Krijo nje diskutim
                    <View>
                    <Image
                        source={images.path}
                        className="h-auto w-[100px] absolute -bottom-8 -left-12"
                        resizeMode='contain'
                        />
                    </View>
                </Text>
            </View>
            <View>
                <Image 
                    source={icons.discussion}
                    className="size-6"
                    tintColor={"#ff9c01"}
                />
            </View>
        </View>
        <CreateDiscussionForm />
    </KeyboardAwareScrollView>
  )
}

export default addDiscussion

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