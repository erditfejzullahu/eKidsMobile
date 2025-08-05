import { View, Text, Image, TouchableOpacity, Platform } from 'react-native'
import { icons, images } from '../../../../../constants'
import { useRouter } from 'expo-router'
import CreateDiscussionForm from '../../../../../components/CreateDiscussionForm'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useColorScheme } from 'nativewind'
import { useShadowStyles } from '../../../../../hooks/useShadowStyles'
const AddDiscussion = () => {
    const router = useRouter();
    const {colorScheme} = useColorScheme();
    const {shadowStyle} = useShadowStyles();
  return (
    <KeyboardAwareScrollView  className="h-full bg-primary-light dark:bg-primary px-4" keyboardShouldPersistTaps="handled" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View className="my-4 flex-row items-center gap-2 relative border-b border-gray-200 dark:border-black-200 pb-6">
            <TouchableOpacity onPress={() => router.back()} className="absolute top-0 right-0 border border-white dark:border-0 bg-gray-200 dark:bg-secondary p-2 rounded-md" style={shadowStyle}>
                <Image 
                    source={icons.leftArrow}
                    className="h-6 w-6"
                    resizeMode='contain'
                    tintColor={ colorScheme === "dark" ? "#fff" : "#FF9C01"}
                />
            </TouchableOpacity>
            <View>
                <Text className="text-2xl text-oBlack dark:text-white font-pmedium">Krijo nje diskutim
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

export default AddDiscussion