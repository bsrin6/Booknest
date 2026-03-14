import { useCartStore } from '@/store/cartStore';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OrderSuccessScreen() {
    const router = useRouter();
    const { clearCart } = useCartStore();

    // Clear cart on mount
    useEffect(() => {
        clearCart();
    }, []);

    // Generate random order ID
    const orderId = `#BN-${Math.floor(10000 + Math.random() * 90000)}`;

    // Mock delivery dates
    const today = new Date();
    const startRange = new Date(today);
    startRange.setDate(today.getDate() + 3);
    const endRange = new Date(today);
    endRange.setDate(today.getDate() + 5);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const deliveryEstimate = `${formatDate(startRange)} - ${formatDate(endRange)}`;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.backBtn}>
                    <MaterialIcons name="arrow-back" size={24} color="#1A1A2E" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Order Success</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    {/* Success Icon */}
                    <View style={styles.iconOuter}>
                        <View style={styles.iconInner}>
                            <MaterialIcons name="check" size={48} color="#FFFFFF" />
                        </View>
                    </View>

                    {/* Success Message */}
                    <Text style={styles.successTitle}>Your order has been{'\n'}placed successfully</Text>
                    <Text style={styles.successSubtitle}>
                        Thank you for shopping with BookNest!{'\n'}Your books are being prepared for shipment.
                    </Text>

                    {/* Order Details Card */}
                    <View style={styles.detailsCard}>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Order ID</Text>
                            <Text style={styles.detailValue}>{orderId}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Delivery Estimate</Text>
                            <Text style={styles.detailValue}>{deliveryEstimate}</Text>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <TouchableOpacity
                        style={styles.trackBtn}
                        activeOpacity={0.8}
                        onPress={() => router.replace('/(tabs)/orders')}
                    >
                        <MaterialIcons name="local-shipping" size={20} color="#FFFFFF" />
                        <Text style={styles.trackBtnText}>Track Order</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.homeBtn}
                        activeOpacity={0.8}
                        onPress={() => router.replace('/(tabs)')}
                    >
                        <MaterialIcons name="home" size={20} color="#4A90D9" />
                        <Text style={styles.homeBtnText}>Go to Home</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
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
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 40,
    },
    iconOuter: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#EBF2FC',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        shadowColor: '#4A90D9',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 10,
    },
    iconInner: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#4A90D9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    successTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1A1A2E',
        textAlign: 'center',
        lineHeight: 32,
        marginBottom: 16,
    },
    successSubtitle: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
    },
    detailsCard: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    detailValue: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 16,
    },
    trackBtn: {
        width: '100%',
        flexDirection: 'row',
        backgroundColor: '#4A90D9',
        height: 60,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 16,
        shadowColor: '#4A90D9',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    trackBtnText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    homeBtn: {
        width: '100%',
        flexDirection: 'row',
        backgroundColor: '#EBF2FC',
        height: 60,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 40,
    },
    homeBtnText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#4A90D9',
    },
});
