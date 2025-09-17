/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const API_URL = `http://10.0.2.2:5000/api/address`;

const AddressModal = ({ visible, onClose, onConfirm }) => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);
    const [street, setStreet] = useState('');

    const [loadingProvince, setLoadingProvince] = useState(false);
    const [loadingDistrict, setLoadingDistrict] = useState(false);
    const [loadingWard, setLoadingWard] = useState(false);

    // Load provinces khi mở modal
    useEffect(() => {
        if (!visible) return;
        setLoadingProvince(true);
        axios.get(`${API_URL}/provinces`)
            .then(res => setProvinces(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoadingProvince(false));
    }, [visible]);

    // Load districts khi province thay đổi
    useEffect(() => {
        if (!selectedProvince) {
            setDistricts([]);
            setSelectedDistrict(null);
            return;
        }
        setLoadingDistrict(true);
        axios.get(`${API_URL}/districts/${selectedProvince.code}`)
            .then(res => setDistricts(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoadingDistrict(false));
    }, [selectedProvince]);

    // Load wards khi district thay đổi
    useEffect(() => {
        if (!selectedDistrict) {
            setWards([]);
            setSelectedWard(null);
            return;
        }
        setLoadingWard(true);
        axios.get(`${API_URL}/wards/${selectedDistrict.code}`)
            .then(res => setWards(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoadingWard(false));
    }, [selectedDistrict]);

    const handleConfirm = () => {
        if (!street && !selectedWard) {
            return Alert.alert('Vui lòng nhập hoặc chọn đầy đủ địa chỉ');
        }
        const fullAddress = [street, selectedWard?.name, selectedDistrict?.name, selectedProvince?.name]
            .filter(Boolean)
            .join(', ');
        onConfirm(fullAddress);
        handleClose();
    };

    const handleClose = () => {
        // Reset state khi bấm Hủy hoặc Xác nhận
        setStreet('');
        setSelectedProvince(null);
        setSelectedDistrict(null);
        setSelectedWard(null);
        setDistricts([]);
        setWards([]);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.overlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.title}>Chọn địa chỉ giao hàng</Text>

                            {(loadingProvince || loadingDistrict || loadingWard) && (
                                <ActivityIndicator size="large" color="#1890ff" style={{ marginVertical: 10 }} />
                            )}

                            <ScrollView keyboardShouldPersistTaps="handled">
                                <TextInput
                                    style={styles.input}
                                    placeholder="Số nhà / Đường"
                                    value={street}
                                    onChangeText={setStreet}
                                />

                                <Text style={styles.label}>Tỉnh / Thành phố</Text>
                                {provinces.length > 0 ? (
                                    <Picker
                                        selectedValue={selectedProvince?.code || ''}
                                        onValueChange={(code) => {
                                            const province = provinces.find(p => p.code === code);
                                            setSelectedProvince(province || null);
                                            setSelectedDistrict(null);
                                            setSelectedWard(null);
                                        }}
                                    >
                                        <Picker.Item label="Chọn tỉnh/thành phố" value="" />
                                        {provinces.map(p => (
                                            <Picker.Item key={p.code} label={p.name} value={p.code} />
                                        ))}
                                    </Picker>
                                ) : (
                                    <Text>Đang tải tỉnh/thành phố...</Text>
                                )}

                                <Text style={styles.label}>Quận / Huyện</Text>
                                {districts.length > 0 ? (
                                    <Picker
                                        selectedValue={selectedDistrict?.code || ''}
                                        onValueChange={(code) => {
                                            const district = districts.find(d => d.code === code);
                                            setSelectedDistrict(district || null);
                                            setSelectedWard(null);
                                        }}
                                    >
                                        <Picker.Item label="Chọn quận/huyện" value="" />
                                        {districts.map(d => (
                                            <Picker.Item key={d.code} label={d.name} value={d.code} />
                                        ))}
                                    </Picker>
                                ) : (
                                    <Text>Chọn tỉnh/thành phố trước</Text>
                                )}

                                <Text style={styles.label}>Phường / Xã</Text>
                                {wards.length > 0 ? (
                                    <Picker
                                        selectedValue={selectedWard?.code || ''}
                                        onValueChange={(code) => {
                                            const ward = wards.find(w => w.code === code);
                                            setSelectedWard(ward || null);
                                        }}
                                    >
                                        <Picker.Item label="Chọn phường/xã" value="" />
                                        {wards.map(w => (
                                            <Picker.Item key={w.code} label={w.name} value={w.code} />
                                        ))}
                                    </Picker>
                                ) : (
                                    <Text>Chọn quận/huyện trước</Text>
                                )}

                                <View style={styles.buttonGroup}>
                                    <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
                                        <Text style={styles.buttonText}>Hủy</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                                        <Text style={styles.buttonText}>Xác nhận</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        maxHeight: '90%',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 10,
        marginBottom: 15,
    },
    label: {
        marginTop: 10,
        marginBottom: 5,
        fontSize: 14,
        fontWeight: '600',
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#ccc',
        padding: 12,
        borderRadius: 6,
        marginRight: 10,
        alignItems: 'center',
    },
    confirmButton: {
        flex: 1,
        backgroundColor: '#1890ff',
        padding: 12,
        borderRadius: 6,
        marginLeft: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default AddressModal;
