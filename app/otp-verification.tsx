import BookNestLogo from '@/components/BookNestLogo';
import { useAuthStore } from '@/store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isSmallScreen = SCREEN_WIDTH < 380;

export default function OtpVerificationScreen() {
    const router = useRouter();
    const { otp, setOtp, phoneNumber, countryCode, setAuthenticated, confirmationResult, setLoading, isLoading } =
        useAuthStore();
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef<(TextInput | null)[]>([]);

    // Entrance animation
    const cardScale = useRef(new Animated.Value(0.9)).current;
    const cardOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(cardScale, {
                toValue: 1,
                tension: 60,
                friction: 12,
                useNativeDriver: true,
            }),
            Animated.timing(cardOpacity, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    // Countdown timer
    useEffect(() => {
        if (timer <= 0) {
            setCanResend(true);
            return;
        }
        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const handleOtpChange = (value: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const otpString = otp.join('');
        if (otpString.length < 6) {
            Alert.alert('Incomplete', 'Please enter the full 6-digit OTP');
            return;
        }

        if (!confirmationResult) {
            Alert.alert('Error', 'Verification session expired. Please go back and try again.');
            return;
        }

        setLoading(true);
        try {
            await confirmationResult.confirm(otpString);
            setAuthenticated(true);
            router.push('/complete-profile');
        } catch (error: any) {
            console.error('Verification Error:', error);
            Alert.alert('Verification Failed', error.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = () => {
        if (!canResend) return;
        setTimer(30);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        // In production, resend OTP
    };

    const isComplete = otp.every((digit) => digit !== '');

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.inner}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Animated.View
                    style={[
                        styles.card,
                        {
                            transform: [{ scale: cardScale }],
                            opacity: cardOpacity,
                        },
                    ]}
                >
                    {/* Header */}
                    <View style={styles.cardHeader}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => router.back()}
                        >
                            <Ionicons name="arrow-back" size={22} color="#1A2138" />
                        </TouchableOpacity>
                        <View style={styles.headerLogoRow}>
                            <BookNestLogo size={32} showCircle={false} />
                            <Text style={styles.headerTitle}>BookNest</Text>
                        </View>
                        <View style={{ width: 22 }} />
                    </View>

                    {/* Icon */}
                    <View style={styles.iconContainer}>
                        <BookNestLogo size={isSmallScreen ? 56 : 70} showCircle={true} />
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>Verify OTP</Text>
                    <Text style={styles.subtitle}>
                        Enter the 6 digit code sent to your phone
                    </Text>

                    {/* OTP Inputs */}
                    <View style={styles.otpRow}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => { inputRefs.current[index] = ref; }}
                                style={[
                                    styles.otpInput,
                                    digit ? styles.otpInputFilled : null,
                                ]}
                                maxLength={1}
                                keyboardType="number-pad"
                                value={digit}
                                onChangeText={(val) => handleOtpChange(val, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                selectTextOnFocus
                            />
                        ))}
                    </View>

                    {/* Verify Button */}
                    <TouchableOpacity
                        style={[styles.verifyBtn, (!isComplete || isLoading) && styles.verifyBtnDisabled]}
                        onPress={handleVerify}
                        activeOpacity={0.85}
                        disabled={isLoading}
                    >
                        <Text style={styles.verifyBtnText}>
                            {isLoading ? 'Verifying...' : 'Verify'}
                        </Text>
                    </TouchableOpacity>

                    {/* Timer & Resend */}
                    <View style={styles.timerRow}>
                        <View style={styles.timerBadge}>
                            <Text style={styles.timerText}>{timer}s</Text>
                        </View>
                        <Text style={styles.remainingText}>Remaining</Text>
                        <TouchableOpacity
                            onPress={handleResend}
                            disabled={!canResend}
                            style={{ marginLeft: 'auto' }}
                        >
                            <Text
                                style={[
                                    styles.resendText,
                                    !canResend && styles.resendTextDisabled,
                                ]}
                            >
                                Resend OTP
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Security badge */}
                    <View style={styles.securityBadge}>
                        <Text style={styles.securityText}>
                            SECURE VERIFICATION POWERED BY{'\n'}BOOKNEST
                        </Text>
                    </View>
                </Animated.View>

                {/* Support link */}
                <View style={styles.supportRow}>
                    <Text style={styles.supportText}>Didn't receive a code? </Text>
                    <TouchableOpacity>
                        <Text style={styles.supportLink}>Contact Support</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    inner: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: isSmallScreen ? 20 : 28,
        paddingVertical: 24,
    },
    card: {
        backgroundColor: 'transparent',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    backButton: {
        padding: 4,
    },
    headerLogoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A2138',
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1A2138',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 28,
        lineHeight: 20,
    },
    otpRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: isSmallScreen ? 4 : 6,
        marginBottom: 24,
    },
    otpInput: {
        flex: 1,
        maxWidth: 50,
        aspectRatio: 0.85,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        backgroundColor: '#F9FAFB',
        textAlign: 'center',
        fontSize: isSmallScreen ? 18 : 22,
        fontWeight: '700',
        color: '#1A2138',
    },
    otpInputFilled: {
        borderColor: '#2196F3',
        backgroundColor: '#EBF5FF',
    },
    verifyBtn: {
        backgroundColor: '#2196F3',
        borderRadius: 28,
        paddingVertical: 18,
        alignItems: 'center',
        shadowColor: '#2196F3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
        marginBottom: 20,
    },
    verifyBtnDisabled: {
        opacity: 0.7,
    },
    verifyBtnText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    timerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    timerBadge: {
        backgroundColor: '#EBF5FF',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 8,
    },
    timerText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#2196F3',
    },
    remainingText: {
        fontSize: 14,
        color: '#6B7280',
    },
    resendText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2196F3',
    },
    resendTextDisabled: {
        opacity: 0.4,
    },
    securityBadge: {
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 16,
        alignItems: 'center',
    },
    securityText: {
        fontSize: 11,
        color: '#B0BEC5',
        textAlign: 'center',
        letterSpacing: 1.2,
        fontWeight: '600',
        lineHeight: 16,
    },
    supportRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    supportText: {
        fontSize: 14,
        color: '#9CA3AF',
    },
    supportLink: {
        fontSize: 14,
        color: '#2196F3',
        fontWeight: '500',
    },
});
