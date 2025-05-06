import { View, Text, Image, StyleSheet, Platform, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { icons } from '../constants'
import * as Animatable from "react-native-animatable"

const ManageTypesDialog = ({manageType, sendManageType}) => {

    const [dialogOpened, setDialogOpened] = useState(false)
    const manageTypes = [
        {id:1, label:"Kurseve"},
        {id:2, label:"Studenteve"},
        {id:3, label:"Takimeve"}
    ]

  return (
    <>
        
            <TouchableOpacity onPress={() => setDialogOpened(!dialogOpened)} className="bg-secondary absolute right-2 top-2 self-start p-2 rounded-md" style={styles.box}>
                <Image
                    source={dialogOpened ? icons.upArrow : icons.downArrow}
                    className="size-5"
                    resizeMode='contain'
                    tintColor={"#000"}
                />
            </TouchableOpacity>
            {dialogOpened && (<Animatable.View animation="bounceIn" className="absolute !z-50 right-8 -bottom-6 bg-oBlack border border-black-200 rounded-md" style={styles.box}>
                {manageTypes.map((item, idx) => (
                    <TouchableOpacity 
                        onPress={() => {sendManageType(item.label); setDialogOpened(false)}}
                        key={item.id} className={`${(idx !== manageTypes.length - 1) ? "border-b border-black-200" : ""} ${manageType === item.label ? "flex-row items-center justify-between gap-1" : ""} p-2 px-4`}>
                        <Text className={`font-plight text-sm text-center ${manageType === item.label ? "text-secondary" : "text-white"}`}>{item.label}</Text>
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

export default ManageTypesDialog

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
  });