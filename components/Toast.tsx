import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Platform,
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface ToastProps {
    visible: boolean;
    message: string;
    type?: 'success' | 'error' | 'info';
    onHide: () => void;
    duration?: number;
}

const TOAST_CONFIG = {
    success: {
        icon: 'check-circle' as const,
        bg: '#10B981',
        iconColor: '#FFFFFF',
    },
    error: {
        icon: 'error' as const,
        bg: '#EF4444',
        iconColor: '#FFFFFF',
    },
    info: {
        icon: 'info' as const,
        bg: '#4A90D9',
        iconColor: '#FFFFFF',
    },
};

export default function Toast({
    visible,
    message,
    type = 'success',
    onHide,
    duration = 2500,
}: ToastProps) {
    const translateY = useRef(new Animated.Value(-120)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        if (visible) {
            // Slide in
            Animated.parallel([
                Animated.spring(translateY, {
                    toValue: 0,
                    tension: 80,
                    friction: 12,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.spring(scale, {
                    toValue: 1,
                    tension: 80,
                    friction: 12,
                    useNativeDriver: true,
                }),
            ]).start();

            // Auto hide
            const timer = setTimeout(() => {
                Animated.parallel([
                    Animated.timing(translateY, {
                        toValue: -120,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: 250,
                        useNativeDriver: true,
                    }),
                ]).start(() => {
                    onHide();
                });
            }, duration);

            return () => clearTimeout(timer);
        } else {
            translateY.setValue(-120);
            opacity.setValue(0);
            scale.setValue(0.9);
        }
    }, [visible]);

    if (!visible) return null;

    const config = TOAST_CONFIG[type];

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ translateY }, { scale }],
                    opacity,
                },
            ]}
        >
            <View style={[styles.toast, { backgroundColor: config.bg }]}>
                <View style={styles.iconContainer}>
                    <MaterialIcons name={config.icon} size={22} color={config.iconColor} />
                </View>
                <Text style={styles.message}>{message}</Text>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 56 : 36,
        left: 20,
        right: 20,
        zIndex: 9999,
        elevation: 9999,
        alignItems: 'center',
    },
    toast: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 14,
        borderRadius: 14,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 10,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    message: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
        lineHeight: 20,
    },
});
