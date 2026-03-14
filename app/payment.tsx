import { useAddressStore } from '@/store/addressStore';
import { useCartStore } from '@/store/cartStore';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Linking,
    Modal,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type PaymentMethod = 'UPI' | 'CARD';

export default function PaymentScreen() {
    const router = useRouter();
    const { getSubtotal, getTotalItems } = useCartStore();
    const { address } = useAddressStore();
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('UPI');
    const [upiId, setUpiId] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState('');

    const subtotal = getSubtotal();
    const deliveryFee = 0;
    const totalAmount = subtotal + deliveryFee;

    const handlePaymentAction = () => {
        if (selectedMethod === 'CARD') {
            if (!cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim()) {
                Alert.alert("Required Fields", "Please enter your Card Number, Expiry Date, and CVV to proceed.");
                return;
            }
        } else if (selectedMethod === 'UPI') {
            if (!upiId.trim()) {
                Alert.alert("Required Fields", "Please enter your UPI ID to proceed.");
                return;
            }
        }

        setIsProcessing(true);
        // Simulate initial processing
        setTimeout(() => {
            setIsProcessing(false);
            if (selectedMethod === 'CARD') {
                setShowOtpModal(true);
            } else {
                router.push('/order-success');
            }
        }, 1500);
    };

    const handleLaunchUPI = async (appName: string) => {
        const upiUrl = `upi://pay?pa=booknest@bank&pn=BookNest&am=${totalAmount}&cu=INR&tn=Order%20Payment`;

        try {
            const supported = await Linking.canOpenURL(upiUrl);
            if (supported) {
                setIsProcessing(true);
                // In a real environment, this opens the app selection or specific app
                await Linking.openURL(upiUrl);

                // Simulate returning from the app
                setTimeout(() => {
                    setIsProcessing(false);
                    router.push('/order-success');
                }, 2000);
            } else {
                Alert.alert(
                    "UPI App Not Found",
                    `To pay with ${appName}, please ensure you have a UPI app installed.`,
                    [{ text: "OK", onPress: () => handlePaymentAction() }]
                );
            }
        } catch (error) {
            // Fallback for simulation
            setIsProcessing(true);
            setTimeout(() => {
                setIsProcessing(false);
                router.push('/order-success');
            }, 1500);
        }
    };

    const handleVerifyOtp = () => {
        if (otp.length === 6) {
            setIsProcessing(true);
            setTimeout(() => {
                setIsProcessing(false);
                setShowOtpModal(false);
                router.push('/order-success');
            }, 1500);
        }
    };

    const renderStepIndicator = () => (
        <View style={styles.stepContainer}>
            <View style={styles.stepItem}>
                <View style={[styles.stepCircle, styles.stepCircleActive]}>
                    <Text style={styles.stepNumber}>1</Text>
                </View>
                <Text style={styles.stepLabel}>CART</Text>
            </View>
            <View style={styles.stepLine} />
            <View style={styles.stepItem}>
                <View style={[styles.stepCircle, styles.stepCircleActive]}>
                    <Text style={styles.stepNumber}>2</Text>
                </View>
                <Text style={styles.stepLabel}>PAYMENT</Text>
            </View>
            <View style={[styles.stepLine, styles.stepLineInactive]} />
            <View style={styles.stepItem}>
                <View style={[styles.stepCircle, styles.stepCircleInactive]}>
                    <Text style={[styles.stepNumber, styles.stepNumberInactive]}>3</Text>
                </View>
                <Text style={[styles.stepLabel, styles.stepLabelInactive]}>CONFIRM</Text>
            </View>
        </View>
    );

    const renderPaymentOption = (id: PaymentMethod, title: string, subtitle: string, icon: any) => {
        const isSelected = selectedMethod === id;
        return (
            <View style={[styles.paymentOptionContainer, isSelected && styles.paymentOptionContainerSelected]}>
                <TouchableOpacity
                    style={[styles.paymentOption, isSelected && styles.paymentOptionSelected]}
                    onPress={() => setSelectedMethod(id)}
                    activeOpacity={0.7}
                >
                    <View style={[styles.optionIconContainer, isSelected && styles.optionIconContainerSelected]}>
                        <MaterialIcons name={icon} size={24} color={isSelected ? "#4A90D9" : "#6B7280"} />
                    </View>
                    <View style={styles.optionTextContainer}>
                        <Text style={styles.optionTitle}>{title}</Text>
                        <Text style={styles.optionSubtitle}>{subtitle}</Text>
                    </View>
                    <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                        {isSelected && <View style={styles.radioInner} />}
                    </View>
                </TouchableOpacity>

                {isSelected && id === 'UPI' && (
                    <View style={styles.methodDetails}>
                        <View style={styles.upiApps}>
                            <TouchableOpacity
                                style={styles.upiAppItem}
                                onPress={() => handleLaunchUPI('Google Pay')}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.upiIcon, { backgroundColor: '#4285F4' }]}>
                                    <MaterialIcons name="account-balance" size={16} color="#FFFFFF" />
                                </View>
                                <Text style={styles.upiAppText}>GPay</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.upiAppItem}
                                onPress={() => handleLaunchUPI('PhonePe')}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.upiIcon, { backgroundColor: '#5f259f' }]}>
                                    <MaterialIcons name="account-balance-wallet" size={16} color="#FFFFFF" />
                                </View>
                                <Text style={styles.upiAppText}>PhonePe</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.inputLabel}>Enter UPI ID</Text>
                        <View style={styles.methodInputContainer}>
                            <TextInput
                                style={styles.methodInput}
                                placeholder="name@bankname"
                                value={upiId}
                                onChangeText={setUpiId}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity>
                                <Text style={styles.verifyText}>VERIFY</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {isSelected && id === 'CARD' && (
                    <View style={styles.methodDetails}>
                        <Text style={styles.inputLabel}>Card Number</Text>
                        <View style={styles.methodInputContainer}>
                            <TextInput
                                style={styles.methodInput}
                                placeholder="XXXX XXXX XXXX XXXX"
                                value={cardNumber}
                                onChangeText={setCardNumber}
                                keyboardType="number-pad"
                            />
                            <MaterialIcons name="credit-card" size={20} color="#9CA3AF" />
                        </View>
                        <View style={styles.row}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.inputLabel}>Expiry</Text>
                                <View style={styles.methodInputContainer}>
                                    <TextInput
                                        style={styles.methodInput}
                                        placeholder="MM/YY"
                                        value={cardExpiry}
                                        onChangeText={setCardExpiry}
                                        keyboardType="number-pad"
                                    />
                                </View>
                            </View>
                            <View style={{ width: 16 }} />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.inputLabel}>CVV</Text>
                                <View style={styles.methodInputContainer}>
                                    <TextInput
                                        style={styles.methodInput}
                                        placeholder="XXX"
                                        value={cardCvv}
                                        onChangeText={setCardCvv}
                                        keyboardType="number-pad"
                                        secureTextEntry
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <MaterialIcons name="arrow-back" size={24} color="#1A1A2E" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Payment</Text>
                </View>
                <MaterialIcons name="security" size={24} color="#4A90D9" />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    automaticallyAdjustKeyboardInsets={true}
                >
                    {renderStepIndicator()}

                    {/* Delivery Address Card */}
                    <View style={styles.addressCard}>
                        <View style={styles.addressHeader}>
                            <View style={styles.addressHeaderLeft}>
                                <MaterialIcons name="location-on" size={20} color="#4A90D9" />
                                <Text style={styles.addressTitle}>Delivery Address</Text>
                            </View>
                            <TouchableOpacity onPress={() => router.back()}>
                                <Text style={styles.changeText}>Change</Text>
                            </TouchableOpacity>
                        </View>
                        {address ? (
                            <View style={styles.addressContent}>
                                <Text style={styles.recipientName}>{address.parentName}</Text>
                                <Text style={styles.addressText}>
                                    {address.addressLine1}, {address.city}, {address.state} - {address.pincode}
                                </Text>
                                <Text style={styles.phoneText}>Phone: {address.phone}</Text>
                            </View>
                        ) : (
                            <Text style={styles.noAddressText}>No address selected</Text>
                        )}
                    </View>

                    {/* Order Summary Card */}
                    <View style={styles.summaryCard}>
                        <View style={styles.summaryHeader}>
                            <MaterialIcons name="shopping-bag" size={20} color="#1A1A2E" />
                            <Text style={styles.summaryTitle}>Order Summary</Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Total ({getTotalItems()} Items)</Text>
                            <Text style={styles.summaryAmount}>₹{subtotal.toFixed(2)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Express Delivery</Text>
                            <Text style={styles.freeText}>FREE</Text>
                        </View>

                        <View style={styles.summaryDivider} />

                        <View style={styles.summaryRow}>
                            <Text style={styles.totalLabel}>Total Amount</Text>
                            <Text style={styles.totalAmount}>₹{totalAmount.toFixed(2)}</Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Select Payment Method</Text>

                    {/* Payment Options */}
                    {renderPaymentOption('UPI', 'UPI', 'Google Pay, PhonePe, WhatsApp', 'account-balance-wallet')}
                    {renderPaymentOption('CARD', 'Credit/Debit Card', 'Visa, Mastercard, Amex, Discover', 'credit-card')}

                    <View style={styles.securityBadge}>
                        <MaterialIcons name="lock" size={14} color="#9CA3AF" />
                        <Text style={styles.securityText}>SECURE 256-BIT SSL ENCRYPTED</Text>
                    </View>

                    <View style={{ height: 140 }} />
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Bottom Bar */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.payBtn, isProcessing && styles.payBtnDisabled]}
                    activeOpacity={0.8}
                    onPress={handlePaymentAction}
                    disabled={isProcessing}
                >
                    {isProcessing ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                        <>
                            <Text style={styles.payBtnText}>Pay ₹{totalAmount.toFixed(2)} Securely</Text>
                            <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
                        </>
                    )}
                </TouchableOpacity>

                {/* OTP Modal */}
                <Modal visible={showOtpModal} transparent animationType="fade">
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                    >
                        <View style={styles.modalBg}>
                            <View style={styles.otpCard}>
                                <View style={styles.bankHeader}>
                                    <MaterialIcons name="account-balance" size={24} color="#1A2138" />
                                    <Text style={styles.bankName}>BookNest Secure Bank</Text>
                                </View>
                                <Text style={styles.otpTitle}>Verify Transaction</Text>
                                <Text style={styles.otpSubtitle}>
                                    A 6-digit OTP has been sent to your registered mobile number for the payment of ₹{totalAmount.toFixed(2)}.
                                </Text>
                                <View style={styles.otpInputContainer}>
                                    <TextInput
                                        style={[styles.otpInput, { letterSpacing: 8 }]}
                                        placeholder="000000"
                                        value={otp}
                                        onChangeText={setOtp}
                                        keyboardType="number-pad"
                                        maxLength={6}
                                        textAlign="center"
                                        autoFocus={true}
                                    />
                                </View>
                                <TouchableOpacity
                                    style={[styles.verifyBtn, otp.length < 6 && styles.verifyBtnDisabled]}
                                    onPress={handleVerifyOtp}
                                    disabled={otp.length < 6 || isProcessing}
                                >
                                    {isProcessing ? (
                                        <ActivityIndicator color="#FFFFFF" />
                                    ) : (
                                        <Text style={styles.verifyBtnText}>Verify & Pay</Text>
                                    )}
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setShowOtpModal(false)}>
                                    <Text style={styles.cancelText}>Cancel Transaction</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </Modal>
                <View style={styles.footerLogos}>
                    <View style={styles.miniLogo} />
                    <View style={styles.miniLogo} />
                    <View style={styles.miniLogo} />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backBtn: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 40,
    },
    // Step Indicator
    stepContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
    },
    stepItem: {
        alignItems: 'center',
    },
    stepCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4A90D9',
        marginBottom: 4,
    },
    stepCircleActive: {
        backgroundColor: '#4A90D9',
    },
    stepCircleInactive: {
        backgroundColor: '#E5E7EB',
    },
    stepNumber: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    stepNumberInactive: {
        color: '#9CA3AF',
    },
    stepLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#6B7280',
    },
    stepLabelInactive: {
        color: '#9CA3AF',
    },
    stepLine: {
        width: 80,
        height: 2,
        backgroundColor: '#4A90D9',
        marginHorizontal: 10,
        marginTop: -16,
    },
    stepLineInactive: {
        backgroundColor: '#E5E7EB',
    },
    // Summary Card
    summaryCard: {
        backgroundColor: '#F8F9FC',
        borderRadius: 24,
        padding: 20,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    summaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    summaryAmount: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    freeText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#10B981',
    },
    summaryDivider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 12,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1A1A2E',
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: '800',
        color: '#4A90D9',
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1A1A2E',
        marginBottom: 18,
    },
    // Payment Options
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1.5,
        borderColor: '#F3F4F6',
    },
    paymentOptionSelected: {
        borderColor: '#4A90D9',
        backgroundColor: '#F7FAFF',
    },
    optionIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    optionIconContainerSelected: {
        backgroundColor: '#EBF2FC',
    },
    optionTextContainer: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    optionSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioOuterSelected: {
        borderColor: '#4A90D9',
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4A90D9',
    },
    securityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: 20,
    },
    securityText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#9CA3AF',
        letterSpacing: 0.5,
    },
    // Footer
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 32,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    payBtn: {
        flexDirection: 'row',
        backgroundColor: '#4A90D9',
        height: 60,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        shadowColor: '#4A90D9',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    payBtnText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    payBtnDisabled: {
        backgroundColor: '#B0C4DE',
    },
    footerLogos: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginTop: 16,
    },
    miniLogo: {
        width: 36,
        height: 20,
        backgroundColor: '#F3F4F8',
        borderRadius: 4,
    },
    paymentOptionContainer: {
        marginBottom: 16,
    },
    paymentOptionContainerSelected: {
    },
    methodDetails: {
        padding: 16,
        paddingTop: 0,
        backgroundColor: '#F7FAFF',
    },
    upiApps: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    upiAppItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        gap: 8,
    },
    upiIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    upiLetter: {
        fontSize: 12,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    upiAppText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#374151',
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
        marginBottom: 6,
        marginTop: 12,
    },
    methodInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    methodInput: {
        flex: 1,
        fontSize: 14,
        color: '#1A1A2E',
    },
    verifyText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#4A90D9',
    },
    row: {
        flexDirection: 'row',
    },
    // Address Card
    addressCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    addressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    addressHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    addressTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    changeText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4A90D9',
    },
    addressContent: {
        paddingLeft: 28,
    },
    recipientName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A2E',
        marginBottom: 4,
    },
    addressText: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
        marginBottom: 4,
    },
    phoneText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
    },
    noAddressText: {
        fontSize: 14,
        color: '#9CA3AF',
        fontStyle: 'italic',
        paddingLeft: 28,
    },
    // Modal Styles
    modalBg: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        padding: 24,
    },
    otpCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
    },
    bankHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 20,
        alignSelf: 'flex-start',
    },
    bankName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    otpTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1A1A2E',
        marginBottom: 8,
    },
    otpSubtitle: {
        fontSize: 13,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 18,
        marginBottom: 24,
    },
    otpInputContainer: {
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        width: '100%',
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 24,
    },
    otpInput: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A1A2E',
        textAlign: 'center',
    },
    verifyBtn: {
        backgroundColor: '#4A90D9',
        width: '100%',
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    verifyBtnDisabled: {
        backgroundColor: '#B0C4DE',
    },
    verifyBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    cancelText: {
        color: '#EF4444',
        fontSize: 14,
        fontWeight: '600',
    },
});
