/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Linking
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const CheckoutScreen = ({ route, navigation }) => {
    const { cartItems, totalPrice } = route.params;
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cod');

    const handlePlaceOrder = async () => {
        try {
            const user = await AsyncStorage.getItem('user');
            const parsedUser = JSON.parse(user);

            const items = cartItems.map(item => ({
                productId: item.productId,
                sizeId: item.sizeId,
                quantity: item.quantity,
                price: item.price,
                name: item.product?.product_name || 'Sản phẩm'
            }));

            const res = await axios.post('http://10.0.2.2:5000/api/orders', {
                userId: parsedUser.id,
                items,
                totalPrice,
                note: '',
                shipping_address: address || 'Hà Nội',
                paymentMethod
            });

            if (paymentMethod === 'cod') {
                setTimeout(() => {
                    Alert.alert(
                        'Thành công',
                        'Đặt hàng thành công (COD)',
                        [
                            { text: 'OK', onPress: () => navigation.navigate('Main') }
                        ],
                        { cancelable: false }
                    );
                }, 300);
            } else if (paymentMethod === 'paypal') {
                const approveUrl = res.data?.approveUrl;

                if (approveUrl) {
                    setTimeout(() => {
                        Alert.alert(
                            'PayPal',
                            'Mở trình duyệt để thanh toán',
                            [
                                { text: 'OK', onPress: () => Linking.openURL(approveUrl) }
                            ],
                            { cancelable: false }
                        );
                    }, 300);
                } else {
                    console.log("Không có approveUrl trong res.data:", res.data);
                    Alert.alert('Lỗi', 'Không nhận được link PayPal từ server');
                }
            }
        } catch (err) {
            console.log(err);
            Alert.alert('Lỗi', 'Không thể đặt hàng');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đặt hàng</Text>

            <Text style={styles.label}>Địa chỉ giao hàng</Text>
            <TextInput
                style={styles.input}
                placeholder="Nhập địa chỉ"
                value={address}
                onChangeText={setAddress}
            />

            <Text style={styles.label}>Phương thức thanh toán</Text>
            <TouchableOpacity
                style={[styles.methodBtn, paymentMethod === 'cod' && styles.selected]}
                onPress={() => setPaymentMethod('cod')}>
                <Text>Thanh toán khi nhận hàng (COD)</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.methodBtn, paymentMethod === 'paypal' && styles.selected]}
                onPress={() => setPaymentMethod('paypal')}>
                <Text>PayPal</Text>
            </TouchableOpacity>

            <Text style={styles.total}>Tổng: {totalPrice.toLocaleString()} đ</Text>

            <TouchableOpacity style={styles.confirmBtn} onPress={handlePlaceOrder}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Xác nhận đặt hàng</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
    label: { fontSize: 16, marginTop: 10 },
    input: {
        borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginTop: 5
    },
    methodBtn: {
        padding: 15, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginTop: 10
    },
    selected: { borderColor: '#1976d2', backgroundColor: '#e3f2fd' },
    total: { fontSize: 18, fontWeight: 'bold', marginTop: 20, color: '#d32f2f' },
    confirmBtn: {
        marginTop: 30, backgroundColor: '#1976d2',
        padding: 15, borderRadius: 8, alignItems: 'center'
    }
});
