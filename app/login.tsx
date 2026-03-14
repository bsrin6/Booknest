import { useAuthStore } from '@/store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const COUNTRY_CODES = [
    { code: '+91', label: '🇮🇳 +91' },
    { code: '+1', label: '🇺🇸 +1' },
    { code: '+44', label: '🇬🇧 +44' },
    { code: '+61', label: '🇦🇺 +61' },
    { code: '+971', label: '🇦🇪 +971' },
];

export default function LoginScreen() {
    const router = useRouter();
    const { phoneNumber, countryCode, setPhoneNumber, setCountryCode, setLoading, isLoading } =
        useAuthStore();
    const [showCountryCodes, setShowCountryCodes] = useState(false);

    const handleSendOtp = async () => {
        if (phoneNumber.length < 10) {
            Alert.alert('Invalid Number', 'Please enter a valid phone number');
            return;
        }

        setLoading(true);
        // Temporarily bypassing Firebase auth
        setTimeout(() => {
            setLoading(false);
            router.push('/otp-verification');
        }, 800);
    };

    const selectedCountry =
        COUNTRY_CODES.find((c) => c.code === countryCode) || COUNTRY_CODES[0];

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#1A2138" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>BookNest</Text>
                    <View style={{ width: 24 }} />
                </View>

                {/* Welcome Section */}
                <View style={styles.welcomeSection}>
                    <Text style={styles.welcomeTitle}>Welcome</Text>
                    <Text style={styles.welcomeSubtitle}>
                        Login to order books for your kids
                    </Text>
                </View>

                {/* Phone Input Section */}
                <View style={styles.inputSection}>
                    <Text style={styles.inputLabel}>Phone Number</Text>

                    <View style={styles.phoneRow}>
                        {/* Country Code Picker */}
                        <TouchableOpacity
                            style={styles.countryCodeBtn}
                            onPress={() => setShowCountryCodes(!showCountryCodes)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.countryCodeText}>{countryCode}</Text>
                            <Ionicons
                                name={showCountryCodes ? 'chevron-up' : 'chevron-down'}
                                size={16}
                                color="#6B7280"
                            />
                        </TouchableOpacity>

                        {/* Phone Number Input */}
                        <View style={styles.phoneInputContainer}>
                            <TextInput
                                style={styles.phoneInput}
                                placeholder="Enter your number"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="phone-pad"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                maxLength={10}
                            />
                        </View>
                    </View>

                    {/* Country Code Dropdown */}
                    {showCountryCodes && (
                        <View style={styles.dropdown}>
                            {COUNTRY_CODES.map((country) => (
                                <TouchableOpacity
                                    key={country.code}
                                    style={[
                                        styles.dropdownItem,
                                        country.code === countryCode && styles.dropdownItemActive,
                                    ]}
                                    onPress={() => {
                                        setCountryCode(country.code);
                                        setShowCountryCodes(false);
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.dropdownText,
                                            country.code === countryCode &&
                                            styles.dropdownTextActive,
                                        ]}
                                    >
                                        {country.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* Send OTP Button */}
                <TouchableOpacity
                    style={[
                        styles.sendOtpBtn,
                        (phoneNumber.length < 10 || isLoading) && styles.sendOtpBtnDisabled,
                    ]}
                    onPress={handleSendOtp}
                    activeOpacity={0.85}
                    disabled={isLoading}
                >
                    <Text style={styles.sendOtpText}>
                        {isLoading ? 'Sending...' : 'Send OTP'}
                    </Text>
                </TouchableOpacity>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        By continuing, you agree to BookNest's
                    </Text>
                    <View style={styles.footerLinks}>
                        <TouchableOpacity>
                            <Text style={styles.footerLink}>Terms of Service</Text>
                        </TouchableOpacity>
                        <Text style={styles.footerText}> and </Text>
                        <TouchableOpacity>
                            <Text style={styles.footerLink}>Privacy Policy</Text>
                        </TouchableOpacity>
                    </View>
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
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A2138',
    },
    welcomeSection: {
        marginBottom: 32,
    },
    welcomeTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1A2138',
        marginBottom: 8,
    },
    welcomeSubtitle: {
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '400',
    },
    inputSection: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A2138',
        marginBottom: 12,
    },
    phoneRow: {
        flexDirection: 'row',
        gap: 12,
    },
    countryCodeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F7FA',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 6,
        minWidth: 90,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    countryCodeText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A2138',
    },
    phoneInputContainer: {
        flex: 1,
        backgroundColor: '#F5F7FA',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    phoneInput: {
        fontSize: 16,
        color: '#1A2138',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    dropdown: {
        marginTop: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    dropdownItem: {
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    dropdownItemActive: {
        backgroundColor: '#EBF5FF',
    },
    dropdownText: {
        fontSize: 15,
        color: '#374151',
    },
    dropdownTextActive: {
        color: '#2196F3',
        fontWeight: '600',
    },
    sendOtpBtn: {
        backgroundColor: '#2196F3',
        borderRadius: 28,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#2196F3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    sendOtpBtnDisabled: {
        opacity: 0.7,
    },
    sendOtpText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    footer: {
        marginTop: 40,
        marginBottom: 20,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 13,
        color: '#6B7280',
    },
    footerLinks: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    footerLink: {
        fontSize: 13,
        color: '#2196F3',
        textDecorationLine: 'underline',
        fontWeight: '500',
    },
});
