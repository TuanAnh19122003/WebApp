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
import React, { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from '@react-native-vector-icons/ionicons';
import { useFocusEffect } from '@react-navigation/native';

const CartScreen = ({ navigation }) => {
    const [cartItems, setCartItems] = useState([]);

    const fetchCart = async () => {
        try {
            const user = await AsyncStorage.getItem('user');
            if (!user) return;
            const parsedUser = JSON.parse(user);

            const response = await axios.get(
                `http://10.0.2.2:5000/api/carts/${parsedUser.id}`,
            );

            setCartItems(response.data.data || []);
        } catch (error) {
            console.log(error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchCart();
        }, [])
    );

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

            <View style={{ flex: 1, marginHorizontal: 10 }}>
                <Text style={styles.name}>{item.product?.product_name}</Text>
                <Text style={styles.size}>Size: {item.size?.name || 'Default'}</Text>
                <Text style={styles.price}>
                    {parseInt(item.price, 10).toLocaleString()} đ
                </Text>

                <View style={styles.row}>
                    <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Icon name="remove" size={20} color="#fff" />
                    </TouchableOpacity>

                    <Text style={styles.qty}>{item.quantity}</Text>

                    <TouchableOpacity
                        style={[styles.qtyBtn, { backgroundColor: '#4caf50' }]}
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Icon name="add" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity onPress={() => handleRemove(item.id)} style={styles.deleteBtn}>
                <Icon name="trash" size={24} color="#d32f2f" />
            </TouchableOpacity>
        </View>
    );

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
                contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 100 }}
                ListEmptyComponent={
                    <Text style={{ textAlign: 'center', marginTop: 50, fontSize: 16 }}>
                        Giỏ hàng trống
                    </Text>
                }
            />

            {cartItems.length > 0 && (
                <View style={styles.footer}>
                    <Text style={styles.totalText}>
                        Tổng: {totalPrice.toLocaleString()} đ
                    </Text>
                    <TouchableOpacity
                        style={styles.checkoutBtn}
                        onPress={() =>
                            navigation.navigate('Checkout', { cartItems, totalPrice })
                        }>
                        <Text style={styles.checkoutText}>
                            Thanh toán
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default CartScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
        paddingTop: 50,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 10,
        marginVertical: 6,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    image: { width: 80, height: 80, borderRadius: 10 },
    imagePlaceholder: { width: 80, height: 80, borderRadius: 10, backgroundColor: '#ccc' },
    name: { fontSize: 16, fontWeight: 'bold' },
    size: { fontSize: 14, color: '#555', marginTop: 3 },
    price: { color: '#d32f2f', fontWeight: 'bold', marginTop: 5, fontSize: 15 },
    row: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    qtyBtn: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#1976d2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    qty: { marginHorizontal: 10, fontSize: 16, fontWeight: 'bold' },
    deleteBtn: { padding: 5 },
    footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 15,
        backgroundColor: '#fff',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: -2 },
        shadowRadius: 4,
        elevation: 5,
    },
    totalText: { fontSize: 18, fontWeight: 'bold', color: '#d32f2f' },
    checkoutBtn: {
        backgroundColor: '#1976d2',
        paddingHorizontal: 25,
        paddingVertical: 12,
        borderRadius: 10,
    },
    checkoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
