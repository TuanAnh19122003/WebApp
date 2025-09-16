/* eslint-disable react/no-unstable-nested-components */
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from '@react-native-vector-icons/ionicons';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CartScreen from '../screens/CartScreen';
import OrderScreen from '../screens/OrderScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName='Home'
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#4e342e',
                tabBarInactiveTintColor: '#8d6e63',
                tabBarStyle: {
                    backgroundColor: '#d7ccc8',
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    } else if (route.name === 'Cart') {
                        iconName = focused ? 'cart' : 'cart-outline';
                    } else if (route.name === 'Order') {
                        iconName = focused ? 'list' : 'list-outline';
                    }
                    return <Icon name={iconName} size={size} color={color} />
                }
            })}
        >
            <Tab.Screen name='Home' component={HomeScreen}/>
            <Tab.Screen name='Cart' component={CartScreen}/>
            <Tab.Screen name='Order' component={OrderScreen}/>
            <Tab.Screen name='Profile' component={ProfileScreen}/>
        </Tab.Navigator>
    )
}

export default TabNavigator

const styles = StyleSheet.create({})