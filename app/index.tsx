import BookNestLogo from '@/components/BookNestLogo';
import BookWatermark from '@/components/BookWatermark';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
    const router = useRouter();
    const [progress, setProgress] = useState(0);
    const progressAnim = useRef(new Animated.Value(0)).current;
    const logoScale = useRef(new Animated.Value(0.5)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;
    const barOpacity = useRef(new Animated.Value(0)).current;
    const versionOpacity = useRef(new Animated.Value(0)).current;

    // Watermark animations
    const wm1Opacity = useRef(new Animated.Value(0)).current;
    const wm2Opacity = useRef(new Animated.Value(0)).current;
    const wm3Opacity = useRef(new Animated.Value(0)).current;
    const wm4Opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Stagger entrance animations
        Animated.sequence([
            // Logo entrance
            Animated.parallel([
                Animated.spring(logoScale, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
                Animated.timing(logoOpacity, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ]),
            // Text fade in
            Animated.timing(textOpacity, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            // Watermarks fade in
            Animated.stagger(150, [
                Animated.timing(wm1Opacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(wm2Opacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(wm3Opacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(wm4Opacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]),
            // Progress bar and version
            Animated.parallel([
                Animated.timing(barOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(versionOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();

        // Progress simulation
        const startTime = Date.now();
        const duration = 3500; // 3.5 seconds total

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const pct = Math.min(Math.round((elapsed / duration) * 100), 100);
            setProgress(pct);

            Animated.timing(progressAnim, {
                toValue: pct / 100,
                duration: 50,
                easing: Easing.linear,
                useNativeDriver: false,
            }).start();

            if (pct >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    router.replace('/login');
                }, 500);
            }
        }, 50);

        return () => clearInterval(interval);
    }, []);

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    const getStatusText = () => {
        if (progress < 30) return 'Setting up your library...';
        if (progress < 60) return 'Loading your books...';
        if (progress < 90) return 'Almost ready...';
        return 'Welcome!';
    };

    return (
        <View style={styles.container}>
            {/* Background watermark decorations */}
            <Animated.View style={[styles.watermark1, { opacity: wm1Opacity }]}>
                <BookWatermark size={90} opacity={0.15} color="#B0C4DE" />
            </Animated.View>
            <Animated.View style={[styles.watermark2, { opacity: wm2Opacity }]}>
                <BookWatermark size={70} opacity={0.1} color="#B0C4DE" />
            </Animated.View>
            <Animated.View style={[styles.watermark3, { opacity: wm3Opacity }]}>
                <BookWatermark size={100} opacity={0.12} color="#B0C4DE" />
            </Animated.View>
            <Animated.View style={[styles.watermark4, { opacity: wm4Opacity }]}>
                <BookWatermark size={80} opacity={0.08} color="#B0C4DE" />
            </Animated.View>

            {/* Logo section */}
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        transform: [{ scale: logoScale }],
                        opacity: logoOpacity,
                    },
                ]}
            >
                <BookNestLogo size={140} showCircle={true} />
            </Animated.View>

            {/* App Name */}
            <Animated.View style={{ opacity: textOpacity }}>
                <Text style={styles.appName}>BookNest</Text>
                <Text style={styles.tagline}>School books made simple</Text>
            </Animated.View>

            {/* Progress Section */}
            <Animated.View style={[styles.progressSection, { opacity: barOpacity }]}>
                <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>{getStatusText()}</Text>
                    <Text style={styles.progressPercent}>{progress}%</Text>
                </View>
                <View style={styles.progressBarBg}>
                    <Animated.View
                        style={[styles.progressBarFill, { width: progressWidth }]}
                    />
                </View>
            </Animated.View>

            {/* Version info */}
            <Animated.View style={[styles.versionContainer, { opacity: versionOpacity }]}>
                <Text style={styles.versionText}>V2.4.0 • ACADEMIC YEAR 24/25</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    // Watermark positions
    watermark1: {
        position: 'absolute',
        top: height * 0.06,
        left: width * 0.05,
    },
    watermark2: {
        position: 'absolute',
        top: height * 0.15,
        right: width * 0.08,
    },
    watermark3: {
        position: 'absolute',
        bottom: height * 0.18,
        right: width * 0.1,
    },
    watermark4: {
        position: 'absolute',
        bottom: height * 0.25,
        left: width * 0.08,
    },
    logoContainer: {
        marginBottom: 24,
    },
    appName: {
        fontSize: 36,
        fontWeight: '800',
        color: '#1A2138',
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    tagline: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 8,
        fontWeight: '400',
    },
    progressSection: {
        width: '100%',
        marginTop: 60,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    progressLabel: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    progressPercent: {
        fontSize: 14,
        color: '#2196F3',
        fontWeight: '700',
    },
    progressBarBg: {
        height: 8,
        backgroundColor: '#E0E7EF',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#2196F3',
        borderRadius: 4,
    },
    versionContainer: {
        position: 'absolute',
        bottom: 50,
    },
    versionText: {
        fontSize: 12,
        color: '#9CA3AF',
        letterSpacing: 1.5,
        fontWeight: '500',
    },
});
