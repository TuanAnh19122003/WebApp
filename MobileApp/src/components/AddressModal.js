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
    const [loading, setLoading] = useState(false);

    // Load provinces khi mở modal
    useEffect(() => {
        if (!visible) return;
        setLoading(true);
        axios.get(`${API_URL}/provinces`)
            .then(res => setProvinces(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [visible]);

    // Load districts khi province thay đổi
    useEffect(() => {
        if (!selectedProvince) return setDistricts([]);
        setLoading(true);
        axios.get(`${API_URL}/districts/${selectedProvince.code}`)
            .then(res => setDistricts(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [selectedProvince]);

    // Load wards khi district thay đổi
    useEffect(() => {
        if (!selectedDistrict) return setWards([]);
        setLoading(true);
        axios.get(`${API_URL}/wards/${selectedDistrict.code}`)
            .then(res => setWards(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [selectedDistrict]);

    const handleConfirm = () => {
        const fullAddress = [street, selectedWard?.name, selectedDistrict?.name, selectedProvince?.name]
            .filter(Boolean)
            .join(', ');
        onConfirm(fullAddress);
        onClose();
        // Reset selections nếu cần
        setStreet('');
        setSelectedProvince(null);
        setSelectedDistrict(null);
        setSelectedWard(null);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Chọn địa chỉ giao hàng</Text>

                    {loading && <ActivityIndicator size="large" color="#1890ff" />}

                    <ScrollView>
                        <TextInput
                            style={styles.input}
                            placeholder="Số nhà / Đường"
                            value={street}
                            onChangeText={setStreet}
                        />

                        <Text style={styles.label}>Tỉnh / Thành phố</Text>
                        <Picker
                            selectedValue={selectedProvince?.code || ''}
                            onValueChange={(code) => {
                                const province = provinces.find(p => p.code === code);
                                setSelectedProvince(province);
                                setSelectedDistrict(null);
                                setSelectedWard(null);
                            }}
                        >
                            <Picker.Item label="Chọn tỉnh/thành phố" value="" />
                            {provinces.map(p => (
                                <Picker.Item key={p.code} label={p.name} value={p.code} />
                            ))}
                        </Picker>

                        <Text style={styles.label}>Quận / Huyện</Text>
                        <Picker
                            selectedValue={selectedDistrict?.code || ''}
                            onValueChange={(code) => {
                                const district = districts.find(d => d.code === code);
                                setSelectedDistrict(district);
                                setSelectedWard(null);
                            }}
                        >
                            <Picker.Item label="Chọn quận/huyện" value="" />
                            {districts.map(d => (
                                <Picker.Item key={d.code} label={d.name} value={d.code} />
                            ))}
                        </Picker>

                        <Text style={styles.label}>Phường / Xã</Text>
                        <Picker
                            selectedValue={selectedWard?.code || ''}
                            onValueChange={(code) => {
                                const ward = wards.find(w => w.code === code);
                                setSelectedWard(ward);
                            }}
                        >
                            <Picker.Item label="Chọn phường/xã" value="" />
                            {wards.map(w => (
                                <Picker.Item key={w.code} label={w.name} value={w.code} />
                            ))}
                        </Picker>

                        <View style={styles.buttonGroup}>
                            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                                <Text style={styles.buttonText}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                                <Text style={styles.buttonText}>Xác nhận</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
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
