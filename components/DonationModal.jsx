import { View, Text, Modal, StyleSheet, Platform, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

const DonationModal = ({open, setOpen}) => {
    const [openModal, setOpenModal] = useState(true)
  return (
    <Modal
        visible={open}
        transparent={true}
        animationType='slide'
        onRequestClose={() => setOpenModal(false)}
    >
        <View className="flex-1 justify-center items-center" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
            <View className="h-auto p-4 w-[90%] bg-oBlack rounded-[10px] border border-black-200 justify-between" style={styles.box}>
                <Text className="text-white text-center font-psemibold text-xl">Ju pelqen <Text className="text-secondary">ShokuMesimit</Text>?</Text>
                <Text className="text-gray-400 text-sm font-plight text-center mt-2">Dhuroni nje donacion per te mbeshtetur projektet tona!</Text>
                <View className="mt-4 flex-row items-center gap-4">
                    <TouchableOpacity className="p-2 bg-secondary rounded-md items-center flex-1" style={styles.box}>
                        <Text className="text-white font-psemibold text-base">Na jep nje dore :)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2 bg-secondary rounded-md items-center flex-1" style={styles.box} onPress={() => setOpen(false)}>
                        <Text className="text-black font-psemibold text-base">Largo dritaren</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
  )
}

export default DonationModal

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