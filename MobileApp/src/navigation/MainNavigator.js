import { View, Text } from 'react-native'
import React from 'react'
import HomeScreen from '../screens/HomeScreen';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
    return (
        <Stack.Navigator initialRouteName='Splash' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Splash' component={SplashScreen} />
            <Stack.Screen name='Home' component={HomeScreen} />
            <Stack.Screen name='Login' component={LoginScreen} />
            <Stack.Screen name='Register' component={RegisterScreen} />
        </Stack.Navigator>
    )
}

export default MainNavigator