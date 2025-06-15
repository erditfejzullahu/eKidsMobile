import React from 'react';
import { Modal, TouchableOpacity, View, StyleSheet, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { icons } from '../constants';

const FullScreenImage = ({ uri, visible, onClose }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
    >
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={onClose}
          activeOpacity={0.8}
        >
          <Animatable.Image
            animation="pulse"
            iterationCount="infinite"
            source={icons.close} // Update with your close icon
            style={styles.closeIcon}
            tintColor="#fff"
          />
        </TouchableOpacity>
        
        <Image 
          source={{ uri }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 10,
  },
  closeIcon: {
    width: 20,
    height: 20,
  },
});

export default FullScreenImage;