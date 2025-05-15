import React, { useEffect, useState } from 'react';
import { Image, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { icons } from '../constants';
import apiClient from '../services/apiClient';
import Loading from './Loading';

const FullscreenWebViewModal = ({ visible, onClose, url }) => {
  const [connectionReady, setConnectionReady] = useState(false)
  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        await apiClient.get(`/api/Users/Check-Authorization`)        
        setConnectionReady(true)
      } catch (error) {
        console.error(error.response.data);
      } finally {
        setConnectionReady(true)
      }
    }
    checkAuthorization();
  }, [])
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <TouchableOpacity onPress={onClose} className="absolute z-50 items-center justify-center top-10 right-4 bg-oBlack rounded-md border border-black-200 p-2">
        <Image 
          source={icons.close}
          className="size-5"
          resizeMode='contain'
          tintColor={"#ff9c01"}
        />
      </TouchableOpacity>

      {!connectionReady ? (
        <Loading />
      ) : (
        <WebView
          source={{ 
            uri: url,
            headers: {
              Cookie: 'your_cookie_key=your_cookie_value' // Set your cookies here
            }
          }}
            style={styles.webview}
            sharedCookiesEnabled={true} // Shares cookies with the device's browser
            thirdPartyCookiesEnabled={true} // Allows third-party cookies (mostly for Android)
            javaScriptEnabled={true}
            domStorageEnabled={true} // Required for localStorage/sessionStorage
            startInLoadingState={true}
            allowsBackForwardNavigationGestures={true} // iOS swipe navigation
            // Android-specific optimizations
            androidLayerType="hardware" // Better rendering performance
            androidHardwareAccelerationDisabled={false} // Enable hardware acceleration
            mixedContentMode="always" // Allow mixed content (HTTP/HTTPS)
            onMessage={(event) => {
              // Handle messages from the web page
              if (event.nativeEvent.data === 'CLOSE_MODAL') {
                onClose();
              }
            }}
            injectedJavaScript={`
              // Example: Listen for messages from the web page
              window.addEventListener('message', function(event) {
                if (event.data === 'CLOSE_MODAL') {
                  window.ReactNativeWebView.postMessage('CLOSE_MODAL');
                }
              });
              true;
            `}
        />
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    marginTop: 0 // Adjust if you have status bar issues
  }
});

export default FullscreenWebViewModal;