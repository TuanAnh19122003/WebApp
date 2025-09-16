import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const OrderScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>OrderScreen</Text>
        </View>
    )
}

export default OrderScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 30,
        fontFamily: 'serif',
        fontWeight: 'bold'
    }
})