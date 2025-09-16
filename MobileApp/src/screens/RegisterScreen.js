/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native'
import React, { useState } from 'react'
import Icon from '@react-native-vector-icons/ionicons';
import axios from 'axios';

const RegisterScreen = ({ navigation }) => {
    const [lastname, setLastName] = useState('');
    const [firstname, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const handleRegister = () => {
        try {
            const response = axios.post('http://10.0.2.2:5000/api/auth/register', {
                lastname,
                firstname,
                email,
                password
            })
            console.log(response.data);
            Alert.alert('Thông báo', 'Đăng ký thành công');
            navigation.navigate('Login');
        } catch (error) {
            console.log(error);
            Alert.alert('Lỗi đăng ký', 'Đăng ký không thành công');
        }
    }

    const handleLogin = () => {
        navigation.navigate('Login')
    }


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.textWel}>Register</Text>
                <Text style={styles.textLogin}>Create a new account</Text>
            </View>


            <View style={styles.body}>
                <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
                    <View style={styles.textInput}>
                        <Icon name='person-circle-outline' size={22} style={styles.icon} />
                        <TextInput
                            placeholder='Last Name'
                            style={styles.input}
                            value={lastname}
                            onChangeText={setLastName}
                        />
                    </View>

                    <View style={styles.textInput}>
                        <Icon name='person-add-outline' size={22} style={styles.icon} />
                        <TextInput
                            placeholder='First Name'
                            style={styles.input}
                            value={firstname}
                            onChangeText={setFirstName}
                        />
                    </View>


                    <View style={styles.textInput}>
                        <Icon name='mail-outline' size={22} style={styles.icon} />
                        <TextInput
                            placeholder='Email'
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.textInput}>
                        <Icon name='lock-closed-outline' size={22} style={styles.icon} />
                        <TextInput
                            placeholder='Password'
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPass}
                        />
                        <TouchableOpacity
                            style={styles.iconEye}
                            onPress={() => setShowPass(prev => !prev)}
                        >
                            <Icon name={showPass ? 'eye' : 'eye-off'} size={22} color='#3B2F2F' />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.textInput}>
                        <Icon name='lock-closed-outline' size={22} style={styles.icon} />
                        <TextInput
                            placeholder='Confirm Password'
                            style={styles.input}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirmPass}
                        />
                        <TouchableOpacity
                            style={styles.iconEye}
                            onPress={() => setShowConfirmPass(prev => !prev)}
                        >
                            <Icon name={showConfirmPass ? 'eye' : 'eye-off'} size={22} color='#3B2F2F' />
                        </TouchableOpacity>
                    </View>

                    <View style={{ paddingTop: 20 }}>
                        <TouchableOpacity style={styles.buttonRegister} onPress={handleRegister}>
                            <Text style={styles.registerText}>Register</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>

                <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>Already have an account?</Text>
                    <TouchableOpacity onPress={handleLogin}>
                        <Text style={styles.signupLink}> Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default RegisterScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F5F0',
    },
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 30
    },
    textWel: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#3B2F2F',
        fontFamily: 'serif',
    },
    textLogin: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#3B2F2F',
        marginTop: 5,
        fontFamily: 'serif',
    },
    body: {
        flex: 4,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 25,
    },
    form: {
        flex: 1,
        paddingTop: 70
    },
    textInput: {
        position: 'relative',
        marginBottom: 20,
    },
    input: {
        paddingLeft: 40,
        height: 50,
        backgroundColor: '#f5f5f5',
        color: '#3B2F2F',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
        fontFamily: 'serif',
    },
    icon: {
        position: 'absolute',
        top: 13,
        left: 10,
        color: '#3B2F2F',
        zIndex: 1
    },
    iconEye: {
        position: 'absolute',
        top: 13,
        right: 15,
    },
    textAuth: {
        fontSize: 14,
        color: '#3B2F2F',
        fontFamily: 'serif',
    },
    buttonRegister: {
        backgroundColor: '#6d4c41',
        paddingVertical: 14,
        borderRadius: 15,
        alignItems: 'center',
        elevation: 2,
        marginBottom: 15,
    },
    registerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        fontFamily: 'serif',
    },
    orLine: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        paddingTop: 15
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#999',
    },
    orText: {
        marginHorizontal: 10,
        color: '#666',
        fontSize: 14,
        fontFamily: 'serif',
    },
    loginWith: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    loginIcon: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#f2f2f2',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 30,
    },
    signupText: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'serif',
    },
    signupLink: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#3B2F2F',
        fontFamily: 'serif',
    },
});
