import { useAddressStore } from '@/store/addressStore';
import { useAuthStore } from '@/store/authStore';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CheckoutAddressScreen() {
    const router = useRouter();
    const { parentName, phoneNumber } = useAuthStore();
    const { setAddress } = useAddressStore();

    const [name, setName] = useState(parentName || '');
    const [phone, setPhone] = useState(phoneNumber || '');
    const [addressLine1, setAddressLine1] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');

    const handleSaveAddress = () => {
        if (!name.trim() || !phone.trim() || !addressLine1.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
            Alert.alert('Missing Information', 'Please fill in all mandatory fields denoted by *');
            return;
        }

        if (phone.length < 10) {
            Alert.alert('Invalid Phone', 'Please enter a valid 10-digit phone number');
            return;
        }

        if (pincode.length < 6) {
            Alert.alert('Invalid Pincode', 'Please enter a valid 6-digit pincode');
            return;
        }

        setAddress({
            parentName: name,
            phone: phone,
            addressLine1: addressLine1,
            city: city,
            state: state,
            pincode: pincode,
        });
        router.push('/payment');
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <MaterialIcons name="arrow-back" size={24} color="#1A1A2E" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Delivery Address</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Parent Name */}
                    <Text style={styles.fieldLabel}>Parent Name *</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter full name"
                            placeholderTextColor="#9CA3AF"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    {/* Phone */}
                    <Text style={styles.fieldLabel}>Phone *</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter mobile number"
                            placeholderTextColor="#9CA3AF"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                    </View>

                    {/* Address Line 1 */}
                    <Text style={styles.fieldLabel}>Address Line 1 *</Text>
                    <View style={[styles.inputContainer, styles.textAreaContainer]}>
                        <TextInput
                            style={[styles.textInput, styles.textArea]}
                            placeholder="House No., Building Name"
                            placeholderTextColor="#9CA3AF"
                            value={addressLine1}
                            onChangeText={setAddressLine1}
                            multiline
                            numberOfLines={3}
                            textAlignVertical="top"
                        />
                    </View>

                    {/* City and State */}
                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.fieldLabel}>City *</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="City"
                                    placeholderTextColor="#9CA3AF"
                                    value={city}
                                    onChangeText={setCity}
                                />
                            </View>
                        </View>
                        <View style={{ width: 16 }} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.fieldLabel}>State *</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="State"
                                    placeholderTextColor="#9CA3AF"
                                    value={state}
                                    onChangeText={setState}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Pincode */}
                    <Text style={styles.fieldLabel}>Pincode *</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="6-digit pincode"
                            placeholderTextColor="#9CA3AF"
                            value={pincode}
                            onChangeText={setPincode}
                            keyboardType="number-pad"
                            maxLength={6}
                        />
                    </View>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Save Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.saveBtn}
                    onPress={handleSaveAddress}
                    activeOpacity={0.8}
                >
                    <MaterialIcons name="save" size={20} color="#FFFFFF" />
                    <Text style={styles.saveBtnText}>Save Address</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backBtn: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A2E',
        marginBottom: 8,
        marginTop: 16,
    },
    inputContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    textAreaContainer: {
        height: 100,
        alignItems: 'flex-start',
    },
    textInput: {
        fontSize: 15,
        color: '#1A1A2E',
        width: '100%',
    },
    textArea: {
        height: '100%',
    },
    row: {
        flexDirection: 'row',
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 32,
        paddingTop: 16,
        backgroundColor: '#F8F9FC',
    },
    saveBtn: {
        flexDirection: 'row',
        backgroundColor: '#4A90D9',
        height: 58,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        shadowColor: '#4A90D9',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    saveBtnText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
