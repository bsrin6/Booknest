import { useCartStore } from '@/store/cartStore';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CartScreen() {
    const router = useRouter();
    const { items, removeItem, updateQuantity, getSubtotal, getTotalItems } = useCartStore();

    const subtotal = getSubtotal();
    const deliveryCharges = 0; // Free
    const processingFee = items.length > 0 ? 2.00 : 0;
    const totalAmount = subtotal + deliveryCharges + processingFee;
    const savings = items.length > 0 ? 5.00 : 0;

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.headerTop}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <MaterialIcons name="arrow-back" size={24} color="#1A1A2E" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Cart</Text>
                <Text style={styles.itemsCount}>{getTotalItems()} {getTotalItems() === 1 ? 'Item' : 'Items'}</Text>
            </View>
        </View>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <View style={styles.iconContainer}>
                <MaterialIcons name="shopping-cart" size={48} color="#4A90D9" />
            </View>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySubtitle}>
                Browse curriculum bundles and add{'\n'}books to your cart
            </Text>
            <TouchableOpacity
                style={styles.browseBtn}
                onPress={() => router.replace('/(tabs)')}
            >
                <Text style={styles.browseBtnText}>Browse Bundles</Text>
            </TouchableOpacity>
        </View>
    );

    if (items.length === 0) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <StatusBar barStyle="dark-content" />
                {renderHeader()}
                {renderEmptyState()}
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" />
            {renderHeader()}

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <Text style={styles.sectionTitle}>SELECTED BUNDLES</Text>

                {items.map((item) => (
                    <View key={item.id} style={styles.cartItem}>
                        <View style={styles.itemImageContainer}>
                            <Image source={item.image} style={styles.itemImage} contentFit="contain" />
                        </View>

                        <View style={styles.itemInfo}>
                            <View style={styles.itemHeader}>
                                <Text style={styles.itemTitle}>{item.title}</Text>
                                <TouchableOpacity onPress={() => removeItem(item.id)}>
                                    <MaterialIcons name="delete-outline" size={22} color="#9CA3AF" />
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.itemClass}>Class: {item.className}</Text>

                            <View style={styles.childInfo}>
                                <MaterialIcons name="person-outline" size={14} color="#4A90D9" />
                                <Text style={styles.childName}>{item.childName}</Text>
                            </View>

                            <View style={styles.itemFooter}>
                                <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>

                                <View style={styles.quantityContainer}>
                                    <TouchableOpacity
                                        style={styles.quantityBtn}
                                        onPress={() => updateQuantity(item.id, -1)}
                                    >
                                        <MaterialIcons name="remove" size={16} color="#1A1A2E" />
                                    </TouchableOpacity>
                                    <Text style={styles.quantityText}>{item.quantity}</Text>
                                    <TouchableOpacity
                                        style={styles.quantityBtn}
                                        onPress={() => updateQuantity(item.id, 1)}
                                    >
                                        <MaterialIcons name="add" size={16} color="#1A1A2E" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                ))}

                {/* Order Summary */}
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Order Summary</Text>

                    <View style={styles.divider} />

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Subtotal ({items.length} {items.length === 1 ? 'bundle' : 'bundles'})</Text>
                        <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
                    </View>

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Delivery Charges</Text>
                        <Text style={[styles.summaryValue, { color: '#10B981', fontWeight: '600' }]}>Free</Text>
                    </View>

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Processing Fee</Text>
                        <Text style={styles.summaryValue}>₹{processingFee.toFixed(2)}</Text>
                    </View>

                    <View style={[styles.divider, { marginVertical: 12 }]} />

                    <View style={styles.totalRow}>
                        <View>
                            <Text style={styles.totalLabel}>TOTAL AMOUNT</Text>
                            <Text style={styles.totalAmount}>₹{totalAmount.toFixed(2)}</Text>
                        </View>
                        <Text style={styles.savingsText}>You save ₹{savings.toFixed(2)}</Text>
                    </View>
                </View>

                <View style={{ height: 20 }} />
            </ScrollView>

            {/* Bottom Action */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.checkoutBtn}
                    activeOpacity={0.8}
                    onPress={() => router.push('/checkout-address')}
                >
                    <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
                    <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
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
        backgroundColor: '#FFFFFF',
        paddingBottom: 4,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    backBtn: {
        marginRight: 16,
    },
    headerTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    itemsCount: {
        fontSize: 15,
        fontWeight: '600',
        color: '#4A90D9',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 100,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#6B7280',
        letterSpacing: 0.5,
        marginBottom: 16,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 22,
        padding: 14,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    itemImageContainer: {
        width: 100,
        height: 100,
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 8,
    },
    itemImage: {
        width: '100%',
        height: '100%',
    },
    itemInfo: {
        flex: 1,
        marginLeft: 14,
        justifyContent: 'center',
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A2E',
        flex: 1,
        marginRight: 8,
    },
    itemClass: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    childInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 6,
    },
    childName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4A90D9',
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    itemPrice: {
        fontSize: 18,
        fontWeight: '800',
        color: '#4A90D9',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F8',
        borderRadius: 12,
        paddingHorizontal: 4,
    },
    quantityBtn: {
        padding: 8,
    },
    quantityText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A2E',
        width: 24,
        textAlign: 'center',
    },
    summaryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A2E',
        marginBottom: 16,
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginBottom: 12,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    summaryValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1A1A2E',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    totalLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#6B7280',
        marginBottom: 4,
    },
    totalAmount: {
        fontSize: 28,
        fontWeight: '900',
        color: '#1A1A2E',
    },
    savingsText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#10B981',
        marginBottom: 6,
    },
    bottomBar: {
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
    checkoutBtn: {
        flexDirection: 'row',
        backgroundColor: '#4A90D9',
        height: 60,
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
    checkoutBtnText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 80,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#EBF2FC',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A2E',
        marginBottom: 10,
    },
    emptySubtitle: {
        fontSize: 15,
        color: '#9CA3AF',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 28,
    },
    browseBtn: {
        backgroundColor: '#4A90D9',
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 16,
    },
    browseBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
