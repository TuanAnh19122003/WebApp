import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrderScreen = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const API_URL = 'http://10.0.2.2:5000';

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const storedUser = await AsyncStorage.getItem('user');
                if (!storedUser) {
                    Alert.alert('User không tồn tại');
                    return;
                }

                const user = JSON.parse(storedUser);
                const userId = user.id;

                const res = await axios.get(`${API_URL}/api/orders/user/${userId}/details`);
                setOrders(res.data.data);
            } catch (error) {
                console.error(error);
                Alert.alert('Lấy lịch sử đơn hàng thất bại');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const renderOrderItem = ({ item }) => (
        <View style={styles.orderCard}>
            <Text style={styles.orderTitle}>Đơn hàng #{item.id} - Trạng thái: {item.status}</Text>
            <Text>Ngày tạo: {new Date(item.createdAt).toLocaleString()}</Text>
            <Text>Ghi chú: {item.note || '-'}</Text>
            <Text>Địa chỉ giao hàng: {item.shipping_address}</Text>

            <View style={styles.tableHeader}>
                <Text style={styles.cell}>Sản phẩm</Text>
                <Text style={styles.cell}>Size</Text>
                <Text style={styles.cell}>SL</Text>
                <Text style={styles.cell}>Giá</Text>
                <Text style={styles.cell}>Tổng</Text>
            </View>

            {item.order_item.map((orderItem) => (
                <View key={orderItem.id} style={styles.tableRow}>
                    <Text style={styles.cell}>{orderItem.product.name}</Text>
                    <Text style={styles.cell}>{orderItem.size.name}</Text>
                    <Text style={styles.cell}>{orderItem.quantity}</Text>
                    <Text style={styles.cell}>
                        {Number(orderItem.price).toLocaleString('vi-VN', { minimumFractionDigits: 0 })} VND
                    </Text>
                    <Text style={styles.cell}>
                        {(Number(orderItem.price) * Number(orderItem.quantity)).toLocaleString('vi-VN', { minimumFractionDigits: 0 })} VND
                    </Text>
                </View>
            ))}

            <Text style={styles.total}>
                Tổng đơn hàng: {Number(item.total_price).toLocaleString('vi-VN', { minimumFractionDigits: 0 })} VND
            </Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#1890ff" />
                <Text>Đang tải...</Text>
            </View>
        );
    }

    if (!orders.length) {
        return (
            <View style={styles.container}>
                <Text>Bạn chưa có đơn hàng nào.</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <FlatList
                data={orders}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    orderCard: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 15,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    orderTitle: {
        fontWeight: 'bold',
        marginBottom: 5,
        fontSize: 16,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 5,
        marginTop: 10,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    cell: {
        flex: 1,
        textAlign: 'center',
    },
    total: {
        textAlign: 'right',
        fontWeight: 'bold',
        marginTop: 10,
    },
});

export default OrderScreen;
