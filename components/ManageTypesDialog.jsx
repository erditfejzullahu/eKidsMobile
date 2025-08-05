import { Text, Image, StyleSheet, Platform } from 'react-native'
import { memo, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { icons } from '../constants'
import * as Animatable from "react-native-animatable"
import { useShadowStyles } from '../hooks/useShadowStyles'
import { useColorScheme } from 'nativewind'

const manageTypes = [
    {id:1, label:"Kurseve"},
    {id:2, label:"Studenteve"},
    {id:3, label:"Takimeve"}
]

const ManageTypesDialog = ({manageType, sendManageType}) => {
    const {shadowStyle} = useShadowStyles();
    const {colorScheme} = useColorScheme();
    const [dialogOpened, setDialogOpened] = useState(false)

  return (
    <>
        <TouchableOpacity onPress={() => setDialogOpened(!dialogOpened)} className="bg-secondary absolute right-2 top-2 self-start p-2 rounded-md" style={shadowStyle}>
            <Image
                source={dialogOpened ? icons.upArrow : icons.downArrow}
                className="size-5"
                resizeMode='contain'
                tintColor={colorScheme === "dark" ? "#000" : "#fff"}
            />
        </TouchableOpacity>
        {dialogOpened && (<Animatable.View animation="bounceIn" className="absolute !z-50 right-8 -bottom-3 bg-oBlack-light dark:bg-oBlack border border-gray-200 dark:border-black-200 rounded-md" style={shadowStyle}>
            {manageTypes.map((item, idx) => (
                <TouchableOpacity 
                    onPress={() => {sendManageType(item.label); setDialogOpened(false)}}
                    key={item.id} className={`${(idx !== manageTypes.length - 1) ? "border-b border-gray-200 dark:border-black-200" : ""} ${manageType === item.label ? "flex-row items-center justify-between gap-1" : ""} p-2 px-4`}>
                    <Text className={`font-plight text-sm text-center ${manageType === item.label ? "text-secondary" : "text-oBlack dark:text-white"}`}>{item.label}</Text>
                    {manageType === item.label && (<Image 
                        source={icons.tick}
                        className="size-5"
                        tintColor={"#FF9C01"}
                        resizeMode='contain'
                    />)}
                </TouchableOpacity>
            ))}
        </Animatable.View>)}         
    </>
  )
}

export default memo(ManageTypesDialog)