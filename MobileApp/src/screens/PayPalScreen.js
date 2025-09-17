/* eslint-disable react-native/no-inline-styles */
import React, { useState, useRef } from 'react';
import { View, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.0.2.2:5000';

const PayPalScreen = ({ route, navigation }) => {
    const { approveUrl, orderId } = route.params;
    const [loading, setLoading] = useState(true);
    const webviewRef = useRef(null);

    const handleNavigationStateChange = async (navState) => {
        const { url } = navState;

        // PayPal return URL khi thanh toán thành công
        if (url.includes('paypal-success')) {
            try {
                setLoading(true);

                // 1. Cập nhật trạng thái đơn hàng
                await axios.put(`${API_URL}/api/orders/status`, {
                    orderId,
                    status: 'paid'
                });

                // 2. Xóa giỏ hàng của user
                const storedUser = await AsyncStorage.getItem('user');
                if (storedUser) {
                    const user = JSON.parse(storedUser);
                    await axios.delete(`${API_URL}/api/carts/clear/${user.id}`);
                }

                Alert.alert('Thanh toán thành công!');
                navigation.navigate('Main');

            } catch (err) {
                console.error(err);
                Alert.alert('Thanh toán thành công nhưng có lỗi xảy ra!');
            } finally {
                setLoading(false);
            }
        }


        // PayPal return URL khi hủy thanh toán
        if (url.includes('payment-fail')) {
            Alert.alert('Thanh toán bị hủy!');
            navigation.goBack();
        }
    };

    return (
        <View style={{ flex: 1 }}>
            {loading && (
                <ActivityIndicator
                    size="large"
                    color="#1890ff"
                    style={styles.loadingIndicator}
                />
            )}
            <WebView
                ref={webviewRef}
                source={{ uri: approveUrl }}
                onLoadEnd={() => setLoading(false)}
                onNavigationStateChange={handleNavigationStateChange}
                startInLoadingState
            />
        </View>
    );
};

const styles = StyleSheet.create({
    loadingIndicator: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -15,
        marginTop: -15,
        zIndex: 10,
    },
});

export default PayPalScreen;
