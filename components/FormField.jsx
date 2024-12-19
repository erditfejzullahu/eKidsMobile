import { View, Text, TextInput } from 'react-native'
import React, {useState} from 'react'
import { TouchableOpacity, Image } from 'react-native'
import { images, icons } from '../constants'

const FormField = ({ title, value, placeholder, handleChangeText, otherStyles, ...props }) => {
    const [showPassword, setShowPassword] = useState(false)

    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    return (
        <View className={`space-y-2 ${otherStyles}`}>
            <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
            <View className="border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row mt-2">
                <TextInput
                    className="flex-1 text-white font-psemibold text-base"
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    onChangeText={handleChangeText}
                    secureTextEntry={(title === 'Fjalëkalimi' && !showPassword) || (title === 'Ndryshoni fjalëkalimin' && !showPassword) || (title === 'Konfirmoni fjalëkalimin e ri' && !showConfirmPassword)}
                    {...props}
                />

                {(title === 'Fjalëkalimi') || (title === 'Ndryshoni fjalëkalimin') && (
                    <TouchableOpacity onPress={() => 
                        setShowPassword(!showPassword)}>
                            <Image 
                                source={!showPassword ? icons.eye : icons.eyeHide}
                                className="w-6 h-6"
                                resizeMode="contain"
                            />
                    </TouchableOpacity>
                )}

                {(title === 'Konfirmoni fjalëkalimin e ri') && (
                    <TouchableOpacity onPress={() => 
                        setShowConfirmPassword(!showConfirmPassword)}>
                            <Image 
                                source={!showConfirmPassword ? icons.eye : icons.eyeHide}
                                className="w-6 h-6"
                                resizeMode="contain"
                            />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}

export default FormField