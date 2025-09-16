/* eslint-disable react-native/no-inline-styles */
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    TouchableOpacity,
    Alert,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from '@react-native-vector-icons/ionicons'

const CartScreen = () => {
    const [cartItems, setCartItems] = useState([]);

    const fetchCart = async () => {
        try {
            const user = await AsyncStorage.getItem('user');
            if (!user) return;
            const parsedUser = JSON.parse(user);

            const response = await axios.get(
                `http://10.0.2.2:5000/api/carts/${parsedUser.id}`,
            );

            console.log('Cart API result:', response.data);
            setCartItems(response.data.data || []);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // 👉 Cập nhật số lượng
    const updateQuantity = async (cartItemId, newQuantity) => {
        if (newQuantity <= 0) {
            handleRemove(cartItemId);
            return;
        }

        try {
            await axios.put(`http://10.0.2.2:5000/api/carts/update`, {
                cartItemId,
                quantity: newQuantity,
            });
            fetchCart();
        } catch (error) {
            console.log(error);
            Alert.alert('Lỗi', 'Không thể cập nhật số lượng');
        }
    };

    // 👉 Xoá sản phẩm
    const handleRemove = async cartItemId => {
        try {
            await axios.delete(`http://10.0.2.2:5000/api/carts/remove`, {
                data: { cartItemId },
            });
            fetchCart();
        } catch (error) {
            console.log(error);
            Alert.alert('Lỗi', 'Không thể xoá sản phẩm');
        }
    };

    // 👉 Render từng item
    const renderItem = ({ item }) => (
        <View style={styles.item}>
            {item.product?.image ? (
                <Image
                    source={{ uri: `http://10.0.2.2:5000/${item.product.image}` }}
                    style={styles.image}
                />
            ) : (
                <View style={styles.imagePlaceholder} />
            )}

            <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.product?.product_name}</Text>
                <Text>Size: {item.size?.size_name || 'Default'}</Text>
                <Text style={styles.price}>
                    {parseInt(item.price, 10).toLocaleString()} đ
                </Text>

                {/* Nút tăng/giảm số lượng */}
                <View style={styles.row}>
                    <TouchableOpacity
                        onPress={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Icon name="remove-circle-outline" size={28} color="#d32f2f" />
                    </TouchableOpacity>
                    <Text style={styles.qty}>{item.quantity}</Text>
                    <TouchableOpacity
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Icon name="add-circle-outline" size={28} color="#388e3c" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Nút xoá */}
            <TouchableOpacity onPress={() => handleRemove(item.id)}>
                <Icon name="trash-outline" size={28} color="#757575" />
            </TouchableOpacity>
        </View>
    );

    // 👉 Tính tổng tiền
    const totalPrice = cartItems.reduce(
        (sum, item) => sum + parseFloat(item.price) * item.quantity,
        0,
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Giỏ hàng</Text>
            <FlatList
                data={cartItems}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 10 }}
                ListEmptyComponent={
                    <Text style={{ textAlign: 'center', marginTop: 20 }}>
                        Giỏ hàng trống
                    </Text>
                }
            />

            {/* Tổng tiền */}
            {cartItems.length > 0 && (
                <View style={styles.footer}>
                    <Text style={styles.totalText}>
                        Tổng: {totalPrice.toLocaleString()} đ
                    </Text>
                    <TouchableOpacity style={styles.checkoutBtn}>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Thanh toán</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default CartScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
    item: {
        flexDirection: 'row',
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    image: { width: 80, height: 80, borderRadius: 8, marginRight: 10 },
    imagePlaceholder: {
        width: 80,
        height: 80,
        backgroundColor: '#ccc',
        borderRadius: 8,
        marginRight: 10,
    },
    name: { fontSize: 16, fontWeight: 'bold' },
    price: { color: '#d32f2f', marginTop: 5, fontWeight: 'bold' },
    row: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
    qty: { marginHorizontal: 10, fontSize: 16, fontWeight: 'bold' },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderTopWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#fafafa',
    },
    totalText: { fontSize: 18, fontWeight: 'bold', color: '#d32f2f' },
    checkoutBtn: {
        backgroundColor: '#1976d2',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
});
