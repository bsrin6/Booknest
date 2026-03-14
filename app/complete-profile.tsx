import { useAuthStore } from '@/store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
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

export default function CompleteProfileScreen() {
    const router = useRouter();
    const {
        parentName,
        email,
        city,
        setParentName,
        setEmail,
        setCity,
        setProfileComplete,
    } = useAuthStore();

    const handleContinue = () => {
        if (!parentName.trim()) {
            Alert.alert('Required', 'Please enter your name');
            return;
        }
        setProfileComplete(true);
        // Navigate to kids management onboarding
        router.push('/manage-kids');
    };

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
                        <Ionicons name="arrow-back" size={24} color="#2196F3" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Complete Your Profile</Text>
                    <View style={{ width: 24 }} />
                </View>

                {/* Welcome */}
                <View style={styles.welcomeSection}>
                    <Text style={styles.welcomeTitle}>Welcome to BookNest!</Text>
                    <Text style={styles.welcomeSubtitle}>
                        Let's get your parent profile set up so you can start exploring
                        magical stories together.
                    </Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    {/* Parent Name */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.fieldLabel}>Parent Name</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your full name"
                                placeholderTextColor="#9CA3AF"
                                value={parentName}
                                onChangeText={setParentName}
                                autoCapitalize="words"
                            />
                        </View>
                    </View>

                    {/* Email */}
                    <View style={styles.fieldGroup}>
                        <View style={styles.labelRow}>
                            <Text style={styles.fieldLabel}>Email</Text>
                            <Text style={styles.optionalTag}>OPTIONAL</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="yourname@example.com"
                                placeholderTextColor="#9CA3AF"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    {/* City */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.fieldLabel}>City</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="location-outline"
                                size={20}
                                color="#9CA3AF"
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={[styles.input, styles.inputWithIcon]}
                                placeholder="Where do you read from?"
                                placeholderTextColor="#9CA3AF"
                                value={city}
                                onChangeText={setCity}
                                autoCapitalize="words"
                            />
                        </View>
                    </View>
                </View>

                {/* Terms */}
                <Text style={styles.termsText}>
                    By continuing, you agree to our terms of service{'\n'}and privacy
                    policy.
                </Text>

                {/* Continue Button */}
                <TouchableOpacity
                    style={[
                        styles.continueBtn,
                        !parentName.trim() && styles.continueBtnDisabled,
                    ]}
                    onPress={handleContinue}
                    activeOpacity={0.85}
                >
                    <Text style={styles.continueBtnText}>Continue</Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </TouchableOpacity>
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
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 28,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A2138',
    },
    welcomeSection: {
        marginBottom: 36,
    },
    welcomeTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1A2138',
        marginBottom: 12,
    },
    welcomeSubtitle: {
        fontSize: 15,
        color: '#6B7280',
        lineHeight: 22,
    },
    form: {
        gap: 24,
        marginBottom: 24,
    },
    fieldGroup: {},
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A2138',
        marginBottom: 10,
    },
    optionalTag: {
        fontSize: 11,
        fontWeight: '600',
        color: '#9CA3AF',
        letterSpacing: 1,
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1A2138',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    inputIcon: {
        marginLeft: 20,
    },
    inputWithIcon: {
        paddingLeft: 10,
    },
    termsText: {
        fontSize: 13,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
    },
    continueBtn: {
        flexDirection: 'row',
        backgroundColor: '#2196F3',
        borderRadius: 28,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#2196F3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    continueBtnDisabled: {
        opacity: 0.7,
    },
    continueBtnText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
