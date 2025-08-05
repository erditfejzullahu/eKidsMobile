import React, { memo, useRef, useState } from 'react';
import {
  Modal,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  PanResponder,
  Animated,
  ScrollView,
  TouchableWithoutFeedback,
  Text
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { icons } from '../constants';

const { width, height } = Dimensions.get('window');

const FullScreenImage = ({ images = [], visible, onClose, initialIndex = 0 }) => {
  if (!images || images.length === 0) {
    return null;
  }
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const scrollX = useRef(new Animated.Value(0)).current;
  const pan = useRef(new Animated.ValueXY()).current;
  const flatListRef = useRef(null);

  // Pan responder for swipe down to close
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      pan.setValue({ x: 0, y: gestureState.dy });
    },
    onPanResponderRelease: (_, gestureState) => {
      if (Math.abs(gestureState.dy) > 100) {
        onClose();
      } else {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true
        }).start();
      }
      pan.setValue({ x: 0, y: 0 });
    }
  });

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50
  }).current;

  const scrollToIndex = (index) => {
    flatListRef.current?.scrollToIndex({ animated: true, index });
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
    >
      <View style={styles.container}>
        {/* Close button */}
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={onClose}
          activeOpacity={0.8}
        >
          <Animatable.Image
            animation="pulse"
            iterationCount="infinite"
            source={icons.close}
            style={styles.closeIcon}
            tintColor="#fff"
          />
        </TouchableOpacity>

        {/* Main image carousel */}
        <Animated.View
          style={[styles.carouselContainer, { transform: pan.getTranslateTransform() }]}
          {...panResponder.panHandlers}
        >
          <Animated.FlatList
            ref={flatListRef}
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: item }}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>
            )}
            initialScrollIndex={initialIndex}
            getItemLayout={(data, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
          />
        </Animated.View>

        {/* Index indicator */}
        <View style={styles.indicatorContainer}>
          <Text style={styles.indicatorText}>
            {currentIndex + 1} / {images.length}
          </Text>
        </View>

        {/* Thumbnail slider */}
        <View style={styles.thumbnailContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailScroll}
          >
            {images.map((uri, index) => (
              <TouchableWithoutFeedback
                key={index}
                onPress={() => scrollToIndex(index)}
              >
                <View style={[
                  styles.thumbnail,
                  currentIndex === index && styles.activeThumbnail
                ]}>
                  <Image 
                    source={{ uri }}
                    style={styles.thumbnailImage}
                    resizeMode="cover"
                  />
                </View>
              </TouchableWithoutFeedback>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
  },
  carouselContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  imageContainer: {
    width,
    height: height - 85,
    // height: "100%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
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
  indicatorContainer: {
    position: 'absolute',
    top: 30,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  indicatorText: {
    color: '#fff',
    fontSize: 14,
  },
  thumbnailContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    height: 80,
  },
  thumbnailScroll: {
    paddingHorizontal: 10,
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  activeThumbnail: {
    borderColor: '#ff9c01',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
});

export default memo(FullScreenImage);