/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-shadow */
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, TextInput, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { getGreeting } from '../utils/greeting'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from '@react-native-vector-icons/ionicons';
import axios from 'axios';

const HomeScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');


    const fetchUser = async () => {
        try {
            const user = await AsyncStorage.getItem('user');
            if (user) {
                setUser(JSON.parse(user));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSearch = (text) => {
        setSearchQuery(text);
        const filtered = products.filter(product =>
            product.product_name &&
            product.product_name.toLowerCase().includes(text.toLowerCase())
        );

        if (selectedCategoryId !== null) {
            const categoryFiltered = filtered.filter(product => product.category_id === selectedCategoryId);
            setFilteredProducts(categoryFiltered);
        } else {
            setFilteredProducts(filtered);
        }
    };

    const fetchToken = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                setToken(token);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchCategory = async () => {
        try {
            const response = await axios.get('http://10.0.2.2:5000/api/categories');
            const dataWithAll = [{ id: null, name: 'Tất cả' }, ...response.data.data];
            setCategories(dataWithAll);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchProduct = async () => {
        try {
            const response = await axios.get('http://10.0.2.2:5000/api/products/with-sizes');
            const rawData = response.data.data;

            const grouped = {};
            rawData.forEach(item => {
                const pid = item.product_id;
                if (!grouped[pid]) {
                    grouped[pid] = {
                        product_id: item.product_id,
                        product_name: item.product_name,
                        image: item.image,
                        description: item.description,
                        category_id: item.category_id,
                        category_name: item.category_name,
                        sizes: []
                    };
                }

                if (item.size_id && item.size_name) {
                    grouped[pid].sizes.push({
                        size_id: item.size_id,
                        size_name: item.size_name,
                        price: item.final_price
                    });
                }
            });

            const validProducts = Object.values(grouped);
            setProducts(validProducts);
            setFilteredProducts(validProducts);
            setSelectedCategoryId(null);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchUser();
        fetchToken();
        fetchCategory();
        fetchProduct();
    }, []);

    const handleCategoryPress = (categoryId) => {
        setSelectedCategoryId(categoryId);
        if (categoryId === null) {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter(product => product.category_id === categoryId);
            setFilteredProducts(filtered);
        }
    };

    const handleAddToCart = async (product) => {
        try {
            const user = await AsyncStorage.getItem('user');
            if (!user) {
                Alert.alert('Thông báo', 'Bạn cần đăng nhập để mua hàng');
                return;
            }

            const parsedUser = JSON.parse(user);
            const sizeId = product.sizes?.[0]?.size_id || null;

            const response = await axios.post('http://10.0.2.2:5000/api/carts/add', {
                userId: parsedUser.id,
                productId: product.product_id,
                sizeId,
                quantity: 1
            });

            if (response.data) {
                Alert.alert('Thành công', 'Sản phẩm đã được thêm vào giỏ hàng!');
            }
        } catch (error) {
            console.log('Add to cart error:', error);
            Alert.alert('Lỗi', 'Không thể thêm vào giỏ hàng');
        }
    };


    const renderCategory = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.categoryContainer,
                selectedCategoryId === item.id && { backgroundColor: '#bcaaa4' },
            ]}
            onPress={() => handleCategoryPress(item.id)}
        >
            <Text style={styles.categoryName}>{item.name}</Text>
        </TouchableOpacity>
    );

    const renderProduct = ({ item }) => (
        <TouchableOpacity
            style={styles.productCard}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
        >
            {item.image ? (
                <Image
                    source={{ uri: `http://10.0.2.2:5000/${item.image}` }}
                    style={styles.productImage}
                />
            ) : (
                <View style={styles.placeholderImage}>
                    <Icon name="image-outline" size={40} color="#bdbdbd" />
                </View>
            )}
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.product_name}</Text>
                <View style={styles.priceRow}>
                    <Text style={styles.productPrice}>
                        {item.sizes?.[0]?.price
                            // eslint-disable-next-line radix
                            ? parseInt(item.sizes[0].price).toLocaleString() + ' đ'
                            : 'Chưa có giá'}
                    </Text>
                    <TouchableOpacity style={styles.cartButton} onPress={() => handleAddToCart(item)}>
                        <Icon name="cart-outline" size={20} color="#4e342e" />
                    </TouchableOpacity>

                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.infoContainer}>
                    <Text style={styles.greeting}>{getGreeting()},</Text>
                    <Text style={styles.name}>
                        {user ? `${user.lastname} ${user.firstname}` : 'Nguyễn Văn A'}
                    </Text>
                </View>

                {user?.image ? (
                    <Image
                        source={{ uri: `http://10.0.2.2:5000/${user.image}` }}
                        style={styles.avatar}
                    />
                ) : (
                    <Icon name='person-circle-outline' size={70} color='#4e342e' />
                )}
            </View>
            <View style={styles.body}>
                <View style={styles.searchContainer}>
                    <TextInput
                        placeholder='Search'
                        value={searchQuery}
                        onChangeText={handleSearch}
                        style={styles.input}
                    />
                    <Icon
                        name='search-outline'
                        size={30}
                        color='#4e342e'
                        style={styles.iconSearch}
                        onPress={() => { Alert.alert('Tìm kiếm', 'Tìm kiếm thành công') }}
                    />
                </View>
                <FlatList
                    data={categories}
                    renderItem={renderCategory}
                    keyExtractor={(item) => (item.id !== null ? item.id.toString() : 'all')}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryList}
                />
                {filteredProducts.length > 0 ? (
                    <FlatList
                        data={filteredProducts.filter(item => item.product_id != null)}
                        keyExtractor={(item) => item.product_id.toString()}
                        renderItem={renderProduct}
                        contentContainerStyle={styles.productList}
                        numColumns={2}
                    />

                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Không có sản phẩm cho danh mục này.</Text>
                    </View>
                )}
            </View>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: '#F9F5F0',
    },

    header: {
        flex: 1,
        backgroundColor: '#d7ccc8',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: 20,
    },

    infoContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },

    greeting: {
        fontSize: 16,
        color: '#6d4c41',
        fontFamily: 'serif',
        marginBottom: 2,
    },

    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4e342e',
        fontFamily: 'serif',
    },

    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#ccc',
    },

    body: {
        flex: 5,
        backgroundColor: '#fff',
        paddingTop: 20,
    },

    searchContainer: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        width: "100%",
        top: -40,
    },

    input: {
        height: 60,
        width: "95%",
        margin: 10,
        elevation: 5,
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
        fontSize: 18,
    },

    iconSearch: {
        position: 'absolute',
        right: 20,
    },

    categoryName: {
        fontSize: 18,
        color: '#4e342e',
        fontFamily: 'serif',
    },

    categoryList: {
        paddingTop: 20,
        paddingHorizontal: 10,
        paddingVertical: 15,
    },

    categoryContainer: {
        backgroundColor: '#E9D5C0',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginRight: 10,
        height: 55,
        textAlign: 'center',
        justifyContent: 'center'
    },

    // eslint-disable-next-line no-dupe-keys
    categoryName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4e342e',
        fontFamily: 'serif',
    },

    productList: {
        paddingTop: 10,
        paddingHorizontal: 10,
        paddingBottom: 20,
    },

    productCard: {
        width: '48%',
        backgroundColor: '#fff8f0',
        margin: 5,
        borderRadius: 12,
        padding: 10,
        elevation: 2,
        alignItems: 'center',
    },

    productImage: {
        width: 150,
        height: 150,
        borderRadius: 10,
    },

    productInfo: {
        width: '100%',
        marginTop: 10,
    },

    productName: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4e342e',
        marginBottom: 6,
    },

    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    productPrice: {
        fontSize: 14,
        color: '#6d4c41',
    },

    cartButton: {
        padding: 6,
        backgroundColor: '#e0cfc3',
        borderRadius: 8,
    },

    emptyContainer: {
        flex: 1,
        alignItems: 'center',
    },

    emptyText: {
        marginTop: 20,
        fontSize: 16,
        color: '#9e9e9e',
    },

    placeholderImage: {
        width: 150,
        height: 150,
        borderRadius: 10,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
})