import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    Linking,
    ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AddressModal from '../components/AddressModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.0.2.2:5000';

const CheckoutScreen = ({ route, navigation }) => {
    const { cartItems = [], totalPrice = 0 } = route.params || {};

    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('user');
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                    setFirstName(parsedUser.firstname || '');
                    setLastName(parsedUser.lastname || '');
                    setPhone(parsedUser.phone || '');
                }
            } catch (error) {
                console.error('Lỗi đọc user từ AsyncStorage', error);
            }
        };
        fetchUser();
    }, []);

    const userId = user?.id;

    const handleConfirmOrder = async () => {
        if (!address || !phone) {
            return Alert.alert('Vui lòng nhập đầy đủ thông tin giao hàng');
        }

        if (!cartItems.length) {
            return Alert.alert('Giỏ hàng trống');
        }

        try {
            setLoading(true);

            // Chuẩn bị dữ liệu order
            const items = cartItems.map(item => ({
                productId: item.productId || item.product?.id,
                sizeId: item.sizeId || item.size?.id,
                quantity: item.quantity,
                price: item.price,
            }));

            const orderData = {
                userId,
                items,
                totalPrice: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
                note: '',
                shipping_address: address,
                paymentMethod: paymentMethod.toLowerCase(),
            };

            const res = await axios.post(`${API_URL}/api/orders`, orderData);

            if (paymentMethod === 'paypal' && res.data.approveUrl) {
                Linking.openURL(res.data.approveUrl).catch(err =>
                    Alert.alert('Không thể mở PayPal', err.message)
                );
                return;
            }
            
            await axios.delete(`${API_URL}/api/carts/clear/${userId}`);
            Alert.alert('Đặt hàng thành công!');
            navigation.navigate('Main');

        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi khi đặt hàng');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Xác nhận đơn hàng</Text>

            <Text style={styles.label}>Họ và tên</Text>
            <TextInput
                style={styles.input}
                value={`${lastname} ${firstname}`}
                onChangeText={text => {
                    const parts = text.trim().split(' ');
                    setLastName(parts[0] || '');
                    setFirstName(parts.slice(1).join(' ') || '');
                }}
                placeholder="Nhập họ và tên"
            />

            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="Nhập số điện thoại"
            />

            <Text style={styles.label}>Địa chỉ giao hàng</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <TextInput
                    style={styles.input}
                    value={address}
                    placeholder="Chọn địa chỉ"
                    editable={false}
                />
            </TouchableOpacity>

            <AddressModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onConfirm={setAddress}
            />

            <Text style={styles.label}>Phương thức thanh toán</Text>
            <View style={styles.radioGroup}>
                <TouchableOpacity onPress={() => setPaymentMethod('COD')} style={styles.radioOption}>
                    <View style={[styles.radioCircle, paymentMethod === 'COD' && styles.radioSelected]} />
                    <Text style={styles.radioLabel}>Thanh toán khi nhận hàng (COD)</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setPaymentMethod('paypal')} style={styles.radioOption}>
                    <View style={[styles.radioCircle, paymentMethod === 'paypal' && styles.radioSelected]} />
                    <Text style={styles.radioLabel}>Thanh toán qua PayPal</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={handleConfirmOrder}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Xác nhận đặt hàng</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginTop: 10,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 10,
        fontSize: 16,
    },
    radioGroup: {
        marginTop: 10,
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    radioCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#555',
        marginRight: 10,
    },
    radioSelected: {
        backgroundColor: '#1890ff',
    },
    radioLabel: {
        fontSize: 16,
    },
    button: {
        backgroundColor: '#1890ff',
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default CheckoutScreen;
