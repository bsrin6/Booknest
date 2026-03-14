import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type OrderStatus = 'All Orders' | 'Processing' | 'Shipped' | 'Delivered';

interface Order {
    id: string;
    orderId: string;
    title: string;
    recipient: string;
    date: string;
    status: 'Processing' | 'Packed' | 'Shipped' | 'Delivered';
    image: any;
}

const MOCK_ORDERS: Order[] = [
    {
        id: '1',
        orderId: '#BN-8901',
        title: 'Adventure Bundle',
        recipient: 'Leo Smith',
        date: 'Oct 24, 2023',
        status: 'Processing',
        image: require('@/assets/images/books_mini_pack.png'),
    },
    {
        id: '2',
        orderId: '#BN-8842',
        title: 'Science Explorer',
        recipient: 'Mia Wong',
        date: 'Oct 22, 2023',
        status: 'Packed',
        image: require('@/assets/images/science_lab.png'),
    },
    {
        id: '3',
        orderId: '#BN-8752',
        title: 'Fairy Tale Classics',
        recipient: 'Noah Brown',
        date: 'Oct 19, 2023',
        status: 'Shipped',
        image: require('@/assets/images/books_stack.png'),
    },
    {
        id: '4',
        orderId: '#BN-8610',
        title: 'First Reader Pack',
        recipient: 'Mia Wong',
        date: 'Oct 12, 2023',
        status: 'Delivered',
        image: require('@/assets/images/books_mini_pack.png'),
    },
];

export default function OrdersScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<OrderStatus>('All Orders');

    const filteredOrders = MOCK_ORDERS.filter(order => {
        if (activeTab === 'All Orders') return true;
        if (activeTab === 'Processing') return order.status === 'Processing' || order.status === 'Packed';
        return order.status === activeTab;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Processing': return { bg: '#EBF2FC', text: '#4A90D9' };
            case 'Packed': return { bg: '#FFF7ED', text: '#F59E0B' };
            case 'Shipped': return { bg: '#F5F3FF', text: '#7C3AED' };
            case 'Delivered': return { bg: '#ECFDF5', text: '#10B981' };
            default: return { bg: '#F3F4F6', text: '#6B7280' };
        }
    };

    const renderOrderItem = ({ item }: { item: Order }) => {
        const colors = getStatusColor(item.status);
        return (
            <View style={styles.orderCard}>
                <View style={styles.cardMain}>
                    <View style={styles.imageWrapper}>
                        <Image source={item.image} style={styles.orderImage} contentFit="contain" />
                    </View>

                    <View style={styles.detailsContainer}>
                        <View style={styles.statusRow}>
                            <View style={[styles.statusBadge, { backgroundColor: colors.bg }]}>
                                <Text style={[styles.statusText, { color: colors.text }]}>{item.status}</Text>
                            </View>
                            <Text style={styles.orderDate}>{item.date}</Text>
                        </View>

                        <Text style={styles.orderTitle}>{item.title}</Text>
                        <Text style={styles.orderFor}>For: <Text style={styles.recipientName}>{item.recipient}</Text></Text>
                    </View>
                </View>

                <View style={styles.cardFooter}>
                    <Text style={styles.orderId}>{item.orderId}</Text>
                    <TouchableOpacity style={styles.viewDetailsBtn}>
                        <Text style={styles.viewDetailsText}>View Details</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const tabs: OrderStatus[] = ['All Orders', 'Processing', 'Shipped', 'Delivered'];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <MaterialIcons name="arrow-back" size={24} color="#1A1A2E" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Orders History</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
                    {tabs.map(tab => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tab, activeTab === tab && styles.activeTab]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={filteredOrders}
                renderItem={renderOrderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <MaterialIcons name="receipt-long" size={60} color="#E5E7EB" />
                        <Text style={styles.emptyText}>No orders found in {activeTab}</Text>
                    </View>
                }
            />
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
    tabsContainer: {
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    tabsScroll: {
        paddingHorizontal: 10,
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginHorizontal: 4,
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#4A90D9',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#9CA3AF',
    },
    activeTabText: {
        color: '#4A90D9',
    },
    listContent: {
        padding: 20,
        paddingBottom: 40,
    },
    orderCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        marginBottom: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
    },
    cardMain: {
        flexDirection: 'row',
        padding: 16,
        gap: 16,
    },
    imageWrapper: {
        width: 80,
        height: 80,
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    orderImage: {
        width: '100%',
        height: '100%',
    },
    detailsContainer: {
        flex: 1,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
    },
    orderDate: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    orderTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A2E',
        marginBottom: 4,
    },
    orderFor: {
        fontSize: 13,
        color: '#6B7280',
    },
    recipientName: {
        fontWeight: '600',
        color: '#374151',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    orderId: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    viewDetailsBtn: {
        backgroundColor: '#4A90D9',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    viewDetailsText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    emptyState: {
        paddingTop: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        marginTop: 16,
        fontSize: 15,
        color: '#9CA3AF',
        textAlign: 'center',
    },
});
