/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-alert */
import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList, SafeAreaView
} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';

const ProductDetailScreen = ({ route, navigation }) => {
    const { product } = route.params;
    const [selectedSize, setSelectedSize] = useState(null);
    const [price, setPrice] = useState(null);

    useEffect(() => {
        if (product?.sizes?.length > 0) {
            setSelectedSize(product.sizes[0]);
            setPrice(product.sizes[0].price);
        }
    }, [product]);

    const handleSizePress = (size) => {
        setSelectedSize(size);
        setPrice(size.price);
    };

    const handleAddToCart = () => {
        alert('Đã thêm vào giỏ hàng!');
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Hình ảnh */}
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: `http://10.0.2.2:5000/${product.image}` }}
                    style={styles.productImage}
                />
            </View>

            {/* Nội dung chi tiết */}
            <ScrollView style={styles.infoContainer}>
                <Text style={styles.productName}>{product.product_name}</Text>

                {/* Mô tả sản phẩm */}
                {product.description ? (
                    <>
                        <Text style={styles.label}>Mô tả sản phẩm:</Text>
                        <Text style={styles.description}>{product.description}</Text>
                    </>
                ) : null}

                {/* Chọn size */}
                <Text style={styles.label}>Chọn Size:</Text>
                <FlatList
                    data={product.sizes}
                    horizontal
                    keyExtractor={(item) => item.size_id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.sizeButton,
                                selectedSize?.size_id === item.size_id && styles.sizeButtonSelected
                            ]}
                            onPress={() => handleSizePress(item)}
                        >
                            <Text style={styles.sizeText}>{item.size_name}</Text>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={{ paddingVertical: 10 }}
                    showsHorizontalScrollIndicator={false}
                />

                {/* Giá */}
                {price && (
                    <Text style={styles.price}>
                        Giá: {parseInt(price, 10).toLocaleString()} đ
                    </Text>
                )}
            </ScrollView>

            {/* Thanh điều hướng dưới cùng */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.backButtonBottom}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back-outline" size={24} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
                    <Icon name="cart-outline" size={22} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={styles.cartText}>Thêm vào giỏ hàng</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    imageContainer: {
        width: '100%',
        height: 300,
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    infoContainer: {
        flex: 1,
        padding: 20,
    },
    productName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4e342e',
        marginBottom: 16,
        fontFamily: 'serif',
    },
    label: {
        fontSize: 16,
        color: '#6d4c41',
        marginBottom: 8,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 15,
        color: '#5d4037',
        marginBottom: 16,
        lineHeight: 22,
    },
    sizeButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#bcaaa4',
        marginRight: 10,
        backgroundColor: '#fff',
    },
    sizeButtonSelected: {
        backgroundColor: '#bcaaa4',
    },
    sizeText: {
        fontSize: 16,
        color: '#4e342e',
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#6d4c41',
        marginTop: 20,
    },
    bottomBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fafafa',
    },
    backButtonOnly: {
        marginRight: 10,
    },
    cartButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#6d4c41',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        justifyContent: 'center',
    },
    cartText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backButtonBottom:{
        marginRight: 10,
        backgroundColor: '#6d4c41',
        padding: 12,
        borderRadius: 8
    }
});
