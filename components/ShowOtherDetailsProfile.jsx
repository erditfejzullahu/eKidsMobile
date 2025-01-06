import { View, Text, StyleSheet, Platform, TouchableOpacity, Image, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import { icons } from '../constants'

const ShowOtherDetailsProfile = () => {

    const [showModals, setShowModals] = useState({
        visibility: false,
        type: "",
    })

    const hideModals = () => {
        setShowModals({
            visibility: false,
            type: ""
        })
    }

    const openModal = (type) => {
        if(type === "education"){
            
        }else if(type === "softSkills"){

        }else if(type === "jobs"){

        }
    }

  return (
    <>
    <View className="m-4 p-4 bg-oBlack border border-black-200 rounded-[10px]">
      <View>
        <View className="gap-2 border-b border-black-200 pb-4">
            <Text className="text-white text-sm">Data e lindjes</Text>
            <View className="border border-black-200 bg-oBlack self-start rounded-[10px]" style={styles.box}>
                <RNDateTimePicker
                style={{marginLeft: -10}}
                    display="default"
                    value={new Date()}
                    maximumDate={new Date()}
                />
            </View>
        </View>
        <View className="gap-2 border-b border-black-200 py-4">
            <Text className="text-white text-sm">Edukimi shkollor</Text>
            <TouchableOpacity className="flex-1 bg-secondary items-center justify-center p-1.5 rounded-[10px]" style={styles.box}>
                <Image 
                    source={icons.plus}
                    className="h-10 border-2 border-secondary-100  rounded-full w-10"
                    tintColor={"#fff"}
                />
            </TouchableOpacity>
        </View>
        <View className="gap-2 border-b border-black-200 py-4">
            <Text className="text-white text-sm">Aftesi te buta</Text>
            <TouchableOpacity className="flex-1 bg-secondary items-center justify-center p-1.5 rounded-[10px]" style={styles.box}>
                <Image 
                    source={icons.plus}
                    className="h-10 border-2 border-secondary-100  rounded-full w-10"
                    tintColor={"#fff"}
                />
            </TouchableOpacity>
        </View>
        <View className="gap-2 border-b border-black-200 pt-4">
            <Text className="text-white text-sm">Punesimi</Text>
            <TouchableOpacity className="flex-1 bg-secondary items-center justify-center p-1.5 rounded-[10px]" style={styles.box}>
                <Image 
                    source={icons.plus}
                    className="h-10 border-2 border-secondary-100  rounded-full w-10"
                    tintColor={"#fff"}
                />
            </TouchableOpacity>
        </View>
      </View>
    </View>

    <Modal
    visible={false}
    transparent={true}
    animationType='fade'
    >
        <View className="flex-1 justify-center items-center" style={{backgroundColor: "rgba(0,0,0,0.4)"}}>
            <View style={styles.box} className="bg-primary p-4 rounded-[5px] border border-black-200 w-[80%] items-center">
                <View>
                    <Text className="text-white font-pregular text-xl">Edukimi shkollor</Text>
                </View>

                <View className="flex-row items-center gap-10 mt-4">
                    <TouchableOpacity className="bg-oBlack border border-black-200 rounded-[10px] p-2">
                        <Text className="text-white text-sm font-plight">Largo dritaren</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-secondary rounded-[10px] p-2 border border-white">
                        <Text className="text-white text-sm font-plight">Ruaj te dhenat</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
    </>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    inner: {
      flex: 1,
      justifyContent: 'center',
      padding: 16,
    },
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
  

export default ShowOtherDetailsProfile