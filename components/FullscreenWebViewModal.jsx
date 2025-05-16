import React, { useEffect, useRef, useState } from 'react';
import { Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { icons } from '../constants';
import apiClient from '../services/apiClient';
import Loading from './Loading';
import { getAccessToken, getRefreshToken } from '../services/secureStorage';

const FullscreenWebViewModal = ({ visible, onClose, url }) => {
  const [connectionReady, setConnectionReady] = useState(false)
  const [tokens, setTokens] = useState({
    accessToken: null,
    refreshToken: null
  })
  const webViewRef = useRef(null);
  useEffect(() => {
    const controller = new AbortController();
    const checkAuthorization = async () => {
      try {
        await apiClient.get(`/api/Users/Check-Authorization`, {
          signal: controller.signal
        })        
        const accessTkn = await getAccessToken();
        const refreshTkn = await getRefreshToken();
        setTokens({
          accessToken: accessTkn,
          refreshToken: refreshTkn
        })
        setConnectionReady(true)
      } catch (error) {
        console.error(error.response.data);
      } finally {
        setConnectionReady(true)
      }
    }
    if(visible){
      setConnectionReady(false)
      checkAuthorization();
    }

    return () => {
      controller.abort();
    }
  }, [visible])
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View className="absolute left-0 top-10 right-0 z-50 items-center justify-center">
      <TouchableOpacity onPress={onClose} className="bg-oBlack rounded-md border border-black-200 p-2">
        <Image 
          source={icons.close}
          className="size-5"
          resizeMode='contain'
          tintColor={"#ff9c01"}
        />
      </TouchableOpacity>
      </View>

      {!connectionReady ? (
        <Loading />
      ) : (
        <WebView
          ref={webViewRef}
          source={{ 
            uri: url,
          }}
          scalesPageToFit={true}
          useWebView2={true}
          allowsInlineMediaPlayback={true}
            style={styles.webview}
            sharedCookiesEnabled={true} // Shares cookies with the device's browser
            thirdPartyCookiesEnabled={true} // Allows third-party cookies (mostly for Android)
            javaScriptEnabled={true}
            javaScriptCanOpenWindowsAutomatically={true}
            domStorageEnabled={true} // Required for localStorage/sessionStorage
            startInLoadingState={true}
            allowsBackForwardNavigationGestures={true} // iOS swipe navigation
            // Android-specific optimizations
            androidLayerType="hardware" // Better rendering performance
            androidHardwareAccelerationDisabled={false} // Enable hardware acceleration
            allowFileAccess={true}
            mediaCapturePermissionGrantType="grant"
            mediaPlaybackRequiresUserAction={false}
            onError={(s) => console.log("WebView Error:", s.nativeEvent)}
            allowUniversalAccessFromFileURLs={true}
            allowFileAccessFromFileURLs={true}
            allowsAirPlayForMediaPlayback={true}
            allowsFullscreenVideo={true}
            webviewDebuggingEnabled={true}
            lackPermissionToDownloadMessage='testtest'
            mixedContentMode="always" // Allow mixed content (HTTP/HTTPS)
            originWhitelist={['*']}
            // onMessage={(event) => {
            //   // Handle messages from the web page
            //   if (event.nativeEvent.data === 'CLOSE_MODAL') {
            //     onClose();
            //   }
            // }}
            // injectedJavaScript={`
            //   // Example: Listen for messages from the web page
            //   window.addEventListener('message', function(event) {
            //     if (event.data === 'CLOSE_MODAL') {
            //       window.ReactNativeWebView.postMessage('CLOSE_MODAL');
            //     }
            //   });
            //   true;
            // `}
            onLoadEnd={() => {
              const message = JSON.stringify({
                type: "SET_TOKENS",
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken
              })
              console.log('Message being sent:', message);
              webViewRef.current.injectJavaScript(`
                console.log('About to post message from WebView');
                window.postMessage(${JSON.stringify(message)}, '*');
                true;
                `)
            }}
            onMessage={(event) => {
              try {
                const data = JSON.parse(event.nativeEvent.data);
                if(data.type === "ERROR"){
                  console.log("Webview error:", data.message);
                } else if(data.type === "SUCCESS"){
                  console.log("webview success:", data.message);
                }
              } catch (error) {
                console.error("invalid message from webview:", error);
              }
            }}
        />
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    marginTop: 0,
  }
});

export default FullscreenWebViewModal;