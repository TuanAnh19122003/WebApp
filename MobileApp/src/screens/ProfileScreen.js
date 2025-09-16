/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    PermissionsAndroid,
    Platform,
    Alert,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ProfileScreen = () => {
    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const API_URL = 'http://10.0.2.2:5000';

    useEffect(() => {
        const fetchUser = async () => {
            const storedUser = await AsyncStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        };
        fetchUser();
    }, []);

    // permission Android
    const requestPermission = async () => {
        if (Platform.OS === 'android') {
            const permission =
                Platform.Version >= 33
                    ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
                    : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

            const granted = await PermissionsAndroid.request(permission, {
                title: 'Quyền truy cập ảnh',
                message: 'Ứng dụng cần quyền để chọn ảnh từ thư viện',
                buttonPositive: 'OK',
            });

            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
    };

    const pickImage = async () => {
        const hasPermission = await requestPermission();
        if (!hasPermission) {
            Alert.alert('Thông báo', 'Bạn chưa cấp quyền truy cập ảnh');
            return;
        }

        launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
            if (response.didCancel) return;
            if (response.errorCode) {
                Alert.alert('Lỗi', response.errorMessage || 'Không thể chọn ảnh');
                return;
            }
            const asset = response.assets?.[0];
            setPreviewImage(asset.uri);
            setFile({
                uri: asset.uri,
                type: asset.type,
                name: asset.fileName || `image_${Date.now()}.jpg`,
            });
        });
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const formData = new FormData();

            formData.append('firstname', user.firstname);
            formData.append('lastname', user.lastname);
            formData.append('phone', user.phone);

            if (file) {
                formData.append('image', file); // check lại key backend
            }

            const token = await AsyncStorage.getItem('token');

            const res = await axios.put(`${API_URL}/api/users/${user.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            Alert.alert('Thành công', res.data.message || 'Cập nhật thành công');
            setUser(res.data.data);
            await AsyncStorage.setItem('user', JSON.stringify(res.data.data));

            setIsEditing(false);
            setPreviewImage(null);
            setFile(null);
        } catch (err) {
            console.log('Update error:', err.response?.data || err.message);
            Alert.alert('Lỗi', err.response?.data?.message || 'Cập nhật thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity onPress={isEditing ? pickImage : null}>
                <Image
                    source={
                        previewImage
                            ? { uri: previewImage }
                            : user.image
                                ? { uri: `${API_URL}/${user.image}` }
                                : require('../assets/img/avatar-placeholder.png')
                    }
                    style={styles.avatar}
                />
            </TouchableOpacity>

            <View style={styles.card}>
                <Text style={styles.label}>Họ</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Họ"
                    value={user.lastname}
                    onChangeText={(text) => setUser({ ...user, lastname: text })}
                    editable={isEditing}
                />

                <Text style={styles.label}>Tên</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Tên"
                    value={user.firstname}
                    onChangeText={(text) => setUser({ ...user, firstname: text })}
                    editable={isEditing}
                />

                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: '#f5f5f5' }]}
                    placeholder="Email"
                    value={user.email}
                    editable={false}
                />

                <Text style={styles.label}>Số điện thoại</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Số điện thoại"
                    value={user.phone}
                    onChangeText={(text) => setUser({ ...user, phone: text })}
                    editable={isEditing}
                />
            </View>

            <View style={styles.actions}>
                {isEditing ? (
                    <>
                        <TouchableOpacity
                            style={[styles.btn, styles.cancelBtn]}
                            onPress={() => setIsEditing(false)}
                        >
                            <Text style={styles.btnText}>Hủy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.btn, styles.saveBtn]}
                            onPress={handleSave}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.btnText}>Lưu</Text>
                            )}
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity
                        style={[styles.btn, styles.editBtn]}
                        onPress={() => setIsEditing(true)}
                    >
                        <Text style={styles.btnText}>Chỉnh sửa</Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f9fafb',
        paddingTop: 50
    },
    avatar: {
        width: 140,
        height: 140,
        borderRadius: 70,
        marginBottom: 20,
        backgroundColor: '#eee',
        borderWidth: 3,
        borderColor: '#1976d2',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
    },
    card: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    actions: {
        flexDirection: 'row',
        marginTop: 10,
    },
    btn: {
        flex: 1,
        paddingVertical: 12,
        marginHorizontal: 5,
        borderRadius: 8,
        alignItems: 'center',
    },
    editBtn: {
        backgroundColor: '#1976d2',
    },
    saveBtn: {
        backgroundColor: '#388e3c',
    },
    cancelBtn: {
        backgroundColor: '#d32f2f',
    },
    btnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
