import { StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Animatable from 'react-native-animatable';

const SplashScreen = ({ navigation }) => {
    const [progress, setProgress] = useState(0);
    const [startProgress, setStartProgress] = useState(false);

    useEffect(() => {
        let interval;
        if (startProgress) {
            interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + 1;
                });
            }, 20);
        }
        return () => clearInterval(interval);
    }, [startProgress]);

    useEffect(() => {
        if (progress === 100) {
            navigation.replace('Login');
        }
    }, [progress, navigation]);

    return (
        <View style={styles.container}>
            <Animatable.View
                animation="fadeInDown"
                duration={1000}
                style={styles.iconContainer}
            >
                <Image
                    source={require('../assets/img/logo-coffee.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </Animatable.View>

            <Animatable.Text
                animation="fadeInUp"
                delay={500}
                duration={800}
                style={styles.title}
            >
                Coffee Shop
            </Animatable.Text>

            <Animatable.Text
                animation="fadeInUp"
                delay={900}
                duration={800}
                style={styles.slogan}
                onAnimationEnd={() => setStartProgress(true)}
            >
                Taste the perfect brew
            </Animatable.Text>

            <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{progress}%</Text>
        </View>
    );
};

export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F5F0',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    iconContainer: {
        backgroundColor: '#EADDC8',
        padding: 5,
        borderRadius: 100,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 6,
    },
    logo: {
        width: 200,
        height: 200,
        borderRadius: 100,
    },
    title: {
        fontSize: 36,
        fontFamily: 'serif',
        fontWeight: 'bold',
        color: '#3B2F2F',
        marginBottom: 6,
    },
    slogan: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#A47149',
        marginBottom: 20,
    },
    loadingText: {
        fontSize: 18,
        color: '#4B2E2B',
        fontFamily: 'serif',
    },
    progressContainer: {
        width: '80%',
        height: 10,
        backgroundColor: '#E0DAD0',
        borderRadius: 5,
        overflow: 'hidden',
        marginTop: 20,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#4B2E2B',
    },
    progressText: {
        marginTop: 8,
        fontSize: 16,
        color: '#4B2E2B',
        fontWeight: '600',
        fontFamily: 'serif',
    },

});