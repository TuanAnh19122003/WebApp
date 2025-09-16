import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Switch } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from '@react-native-vector-icons/ionicons';
import CheckBox from '@react-native-community/checkbox';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showpass, setShowpass] = useState(false);
    const [remember, setRemember] = useState(false);

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://10.0.2.2:5000/api/auth/login', {
                email,
                password
            });
            const { user, message } = response.data;

            console.log('User: ', response.data);
            await AsyncStorage.setItem('user', JSON.stringify(user));
            await AsyncStorage.setItem('token', response.data.token);

            if (remember) {
                await AsyncStorage.setItem('email', email);
                await AsyncStorage.setItem('password', password);
            } else {
                await AsyncStorage.removeItem('email');
                await AsyncStorage.removeItem('password');
            }

            Alert.alert('Thông báo', message);
            navigation.navigate('Main');
        } catch (error) {
            if (error.response?.data?.message) {
                Alert.alert('Lỗi đăng nhập', error.response.data.message);
            } else {
                Alert.alert('Lỗi kết nối', 'Không thể kết nối tới máy chủ');
            }
        }
    };


    useEffect(() => {
        const loadCredentials = async () => {
            try {
                const savedEmail = await AsyncStorage.getItem('email');
                const savedPassword = await AsyncStorage.getItem('password');
                if (savedEmail && savedPassword) {
                    setEmail(savedEmail);
                    setPassword(savedPassword);
                    setRemember(true);
                }
            } catch (error) {
                console.error('Lỗi khi load thông tin đăng nhập:', error);
            }
        };
        loadCredentials();
    }, []);


    const handleRegister = () => {
        navigation.navigate('Register')
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.textWel}>Welcome</Text>
                <Text style={styles.textLogin}>Please sign in to continue</Text>
            </View>

            <View style={styles.body}>
                <View style={styles.form}>
                    <View style={styles.textInput}>
                        <Icon name='mail-outline' size={22} style={styles.icon} />
                        <TextInput
                            placeholder='Email or Username'
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
                            secureTextEntry={!showpass}
                        />
                        <TouchableOpacity
                            style={styles.iconEye}
                            onPress={() => setShowpass(prev => !prev)}
                            accessibilityLabel="Toggle password visibility"
                        >
                            <Icon name={showpass ? 'eye' : 'eye-off'} size={22} color='#888' />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.authOption}>
                        <View style={styles.rememberContainer}>
                            <CheckBox
                                value={remember}
                                onValueChange={setRemember}
                                tintColors={{ true: '#6d4c41', false: '#999' }}
                            />
                            <Text style={styles.textAuth}>Remember me</Text>
                        </View>
                        <TouchableOpacity onPress={() => Alert.alert('Thông báo', 'Tính năng đang phát triển')}>
                            <Text style={styles.textAuth}>Forgot password?</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin}>
                        <Text style={styles.loginText}>Login</Text>
                    </TouchableOpacity>

                    <View style={styles.orLine}>
                        <View style={styles.line} />
                        <Text style={styles.orText}>OR</Text>
                        <View style={styles.line} />
                    </View>

                    <View style={styles.loginWith}>
                        <TouchableOpacity style={styles.loginIcon}>
                            <Icon name="logo-google" size={55} color="#db4a39" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.loginIcon}>
                            <Icon name="logo-facebook" size={55} color="#3b5998" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.loginIcon}>
                            <Icon name="logo-apple" size={55} color="#000" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>Don't have an account?</Text>
                    <TouchableOpacity onPress={handleRegister}>
                        <Text style={styles.signupLink}> Register</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F5F0',
        paddingTop: 30
    },
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    rememberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    authOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    textAuth: {
        fontSize: 14,
        color: '#3B2F2F',
        fontFamily: 'serif',
    },
    buttonLogin: {
        backgroundColor: '#4B2E2B',
        paddingVertical: 14,
        borderRadius: 15,
        alignItems: 'center',
        elevation: 2,
        marginBottom: 15,
    },
    loginText: {
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
