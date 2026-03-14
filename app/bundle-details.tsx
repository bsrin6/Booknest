import { useCartStore } from '@/store/cartStore';
import { useKidsStore } from '@/store/kidsStore';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// This would ideally come from a shared data file
const ALL_BUNDLES = [
    {
        id: 'cbse-1-3',
        title: 'Early Learner Kit',
        curriculum: 'CBSC/Pinacle',
        gradeRange: '1-3',
        year: '2024-25',
        price: 49.99,
        bookCount: 8,
        extras: 'Activity Sheets Included',
        image: require('@/assets/images/books_mini_pack.png'),
        badge: 'POPULAR',
        description: 'This comprehensive kit covers all key subjects for early primary students. It includes workbooks for Math, English, and Science, along with interactive activity sheets designed to make learning fun and engaging.',
    },
    {
        id: 'cbse-4-full',
        title: 'Grade 4 Full Semester Kit',
        curriculum: 'CBSC/Pinacle',
        gradeRange: '4-6',
        year: '2024-25',
        price: 89.99,
        bookCount: 12,
        extras: 'Stationery Included',
        image: require('@/assets/images/books_stack.png'),
        badge: 'BEST SELLER',
        description: 'The ultimate semester companion for Grade 4 students. This kit includes all mandatory textbooks, practice workbooks, and a premium stationery set to ensure your child is fully prepared for their academic journey.',
    },
    {
        id: 'cbse-7-10',
        title: 'Senior School Bundle',
        curriculum: 'CBSC/Pinacle',
        gradeRange: '7-10',
        year: '2024-25',
        price: 129.99,
        bookCount: 15,
        extras: 'Reference Guide Included',
        image: require('@/assets/images/books_stack.png'),
        description: 'Designed for the rigors of senior school, this bundle provides in-depth materials for core subjects. Includes high-quality reference guides and sample papers to help students excel in their tests and examinations.',
    },
    {
        id: 'cbse-11-12',
        title: 'Board Exam Prep Kit',
        curriculum: 'CBSC/Pinacle',
        gradeRange: '11-12',
        year: '2024-25',
        price: 159.99,
        bookCount: 18,
        extras: 'Sample Papers Included',
        image: require('@/assets/images/books_stack.png'),
        badge: 'NEW',
        description: 'The definitive preparation kit for Board Exams. Featuring the latest curriculum textbooks, solved sample papers from the last 10 years, and expert-curated revision notes to boost exam confidence.',
    },
    {
        id: 'icse-1-3',
        title: 'ICSE Foundation Pack',
        curriculum: 'State/Lead',
        gradeRange: '1-3',
        year: '2024-25',
        price: 54.50,
        bookCount: 7,
        extras: 'Free Delivery',
        image: require('@/assets/images/books_mini_pack.png'),
        description: 'Build a strong academic foundation with our ICSE-aligned starter pack. Covers critical early concepts through vibrant illustrations and structured exercises tailored for the ICSE standards.',
    },
    {
        id: 'icse-4-6',
        title: 'Core Subjects Mini Pack',
        curriculum: 'State/Lead',
        gradeRange: '4-6',
        year: '2024-25',
        price: 45.50,
        bookCount: 5,
        extras: 'Free Delivery',
        image: require('@/assets/images/books_mini_pack.png'),
        description: 'A focused bundle covering the essential subjects for ICSE middle schoolers. Perfect for students looking for high-quality workbooks to supplement their classroom learning.',
    },
    {
        id: 'icse-7-10',
        title: 'ICSE Complete Bundle',
        curriculum: 'State/Lead',
        gradeRange: '7-10',
        year: '2024-25',
        price: 119.99,
        bookCount: 14,
        extras: 'Practice Papers',
        image: require('@/assets/images/books_stack.png'),
        badge: 'BEST SELLER',
        description: 'The holistic ICSE Senior School solution. Includes all textbooks, lab manuals, and extensive practice papers to ensure deep understanding of complex subjects.',
    },
    {
        id: 'ib-1-5',
        title: 'IB PYP Complete Pack',
        curriculum: 'State/Lead',
        gradeRange: '1-5',
        year: '2024-25',
        price: 199.99,
        bookCount: 10,
        extras: 'Digital Resources',
        image: require('@/assets/images/books_stack.png'),
        badge: 'PREMIUM',
        description: 'Inquiry-based learning at its best. This IB Primary Years Programme pack includes interdisciplinary workbooks and access to exclusive online digital resources.',
    },
    {
        id: 'ib-6-10',
        title: 'IB MYP Study Kit',
        curriculum: 'State/Lead',
        gradeRange: '6-10',
        year: '2024-25',
        price: 249.99,
        bookCount: 12,
        extras: 'Online Access',
        image: require('@/assets/images/books_mini_pack.png'),
        description: 'A comprehensive study kit for the IB Middle Years Programme. Focuses on developing critical thinking skills and global perspectives with curated reading materials.',
    },
    {
        id: 'science-lab',
        title: 'Science Lab Specials',
        curriculum: 'All Boards',
        gradeRange: '4-8',
        year: '2024-25',
        price: 29.00,
        bookCount: 3,
        extras: '',
        image: require('@/assets/images/science_lab.png'),
        badge: 'Coming Soon',
        comingSoon: true,
        description: 'Unleash the scientist within! This special edition bundle includes interactive experiment guides and observation journals suitable for curious minds across all boards.',
    },
    {
        id: 'art-craft',
        title: 'Art & Craft Collection',
        curriculum: 'All Boards',
        gradeRange: '1-12',
        year: '2024-25',
        price: 19.99,
        bookCount: 4,
        extras: 'Supplies Included',
        image: require('@/assets/images/science_lab.png'),
        description: 'A delightful collection of art and craft resources. Includes high-quality paper, creative guides, and project templates to inspire artistic expression for students of all ages.',
    },
];

export default function BundleDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { addItem } = useCartStore();
    const { kids, selectedKidId } = useKidsStore();
    const [isAdded, setIsAdded] = useState(false);

    const bundle = ALL_BUNDLES.find(b => b.id === id);
    const selectedKid = kids.find(k => k.id === selectedKidId) || kids[0];

    const handleAddToCart = () => {
        if (!bundle || bundle.comingSoon) return;

        addItem({
            id: `${bundle.id}-${Date.now()}`,
            bundleId: bundle.id,
            title: bundle.title,
            className: selectedKid?.className || bundle.gradeRange,
            childName: selectedKid?.name || 'Aiden Johnson',
            price: bundle.price,
            image: bundle.image
        });

        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);

        // Optionally navigate to cart
        router.push('/(tabs)/cart');
    };

    if (!bundle) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centered}>
                    <Text>Bundle not found</Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={{ color: '#4A90D9', marginTop: 10 }}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" />

            {/* Custom Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <MaterialIcons name="arrow-back" size={24} color="#1A1A2E" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Bundle Details</Text>
                <TouchableOpacity style={styles.shareBtn}>
                    <MaterialIcons name="share" size={22} color="#1A1A2E" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Image Section */}
                <View style={styles.imageContainer}>
                    <Image source={bundle.image} style={styles.bundleImage} contentFit="cover" />
                </View>

                {/* Content Section */}
                <View style={styles.content}>
                    <View style={styles.titleRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.title}>{bundle.title}</Text>
                            <Text style={styles.subtitle}>{bundle.curriculum} Curriculum • {bundle.year}</Text>
                        </View>
                        <View style={styles.priceTag}>
                            <Text style={styles.price}>₹{bundle.price.toFixed(2)}</Text>
                        </View>
                    </View>

                    {/* Quick Info Tags */}
                    <View style={styles.infoRow}>
                        <View style={styles.infoTag}>
                            <MaterialIcons name="school" size={16} color="#4A90D9" />
                            <Text style={styles.infoTagText}>Grade {bundle.gradeRange}</Text>
                        </View>
                        <View style={styles.infoTag}>
                            <MaterialIcons name="library-books" size={16} color="#10B981" />
                            <Text style={styles.infoTagText}>{bundle.bookCount} Books</Text>
                        </View>
                        {bundle.extras ? (
                            <View style={styles.infoTag}>
                                <MaterialIcons name="stars" size={16} color="#F59E0B" />
                                <Text style={styles.infoTagText}>{bundle.extras}</Text>
                            </View>
                        ) : null}
                    </View>

                    {/* Description */}
                    <Text style={styles.sectionTitle}>About this Bundle</Text>
                    <Text style={styles.description}>
                        {bundle.description || 'No description available for this bundle.'}
                    </Text>

                    {/* What's Inside */}
                    <Text style={styles.sectionTitle}>What's Inside</Text>
                    <View style={styles.itemsList}>
                        <View style={styles.itemRow}>
                            <View style={styles.itemDot} />
                            <Text style={styles.itemText}>Core Subject Textbooks (Set of {Math.floor(bundle.bookCount / 2)})</Text>
                        </View>
                        <View style={styles.itemRow}>
                            <View style={styles.itemDot} />
                            <Text style={styles.itemText}>Practice Workbooks & Journals</Text>
                        </View>
                        <View style={styles.itemRow}>
                            <View style={styles.itemDot} />
                            <Text style={styles.itemText}>Assessment & Sample Papers</Text>
                        </View>
                        {bundle.extras && (
                            <View style={styles.itemRow}>
                                <View style={styles.itemDot} />
                                <Text style={styles.itemText}>{bundle.extras}</Text>
                            </View>
                        )}
                    </View>

                    {/* Free Sample Disclaimer */}
                    <View style={styles.disclaimerBox}>
                        <MaterialIcons name="info-outline" size={20} color="#6B7280" />
                        <Text style={styles.disclaimerText}>
                            Includes free access to digital samples of select workbooks for the first 30 days.
                        </Text>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
                <View style={styles.totalSection}>
                    <Text style={styles.totalLabel}>Total Price</Text>
                    <Text style={styles.totalAmount}>₹{bundle.price.toFixed(2)}</Text>
                </View>
                <TouchableOpacity
                    style={[
                        styles.addToCartBtn,
                        bundle.comingSoon && styles.notifyBtn,
                        isAdded && styles.addedBtn
                    ]}
                    activeOpacity={0.8}
                    onPress={handleAddToCart}
                    disabled={bundle.comingSoon}
                >
                    <MaterialIcons
                        name={bundle.comingSoon ? "notifications" : (isAdded ? "check" : "shopping-cart")}
                        size={20}
                        color="#FFFFFF"
                    />
                    <Text style={styles.addToCartText}>
                        {bundle.comingSoon ? 'Notify Me' : (isAdded ? 'Added to Cart' : 'Add to Cart')}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
    },
    backBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#F3F4F8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    shareBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#F3F4F8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    imageContainer: {
        width: '100%',
        height: 300,
        backgroundColor: '#F8F9FC',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    bundleImage: {
        width: '100%',
        height: '100%',
    },
    badge: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: '#F59E0B',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        zIndex: 1,
    },
    badgeComingSoon: {
        backgroundColor: '#E5E7EB',
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    badgeTextComingSoon: {
        color: '#374151',
    },
    content: {
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1A1A2E',
    },
    subtitle: {
        fontSize: 15,
        color: '#6B7280',
        marginTop: 4,
    },
    priceTag: {
        backgroundColor: '#EBF2FC',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 14,
    },
    price: {
        fontSize: 22,
        fontWeight: '800',
        color: '#4A90D9',
    },
    infoRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 28,
    },
    infoTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        gap: 6,
    },
    infoTagText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A2E',
        marginBottom: 12,
        marginTop: 6,
    },
    description: {
        fontSize: 15,
        color: '#4B5563',
        lineHeight: 24,
        marginBottom: 28,
    },
    itemsList: {
        gap: 14,
        marginBottom: 28,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    itemDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4A90D9',
    },
    itemText: {
        fontSize: 15,
        color: '#374151',
        fontWeight: '500',
    },
    disclaimerBox: {
        flexDirection: 'row',
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 16,
        gap: 12,
        alignItems: 'center',
    },
    disclaimerText: {
        flex: 1,
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 32,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        gap: 20,
    },
    totalSection: {
        flex: 1,
    },
    totalLabel: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 2,
    },
    totalAmount: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1A1A2E',
    },
    addToCartBtn: {
        flex: 2,
        flexDirection: 'row',
        backgroundColor: '#4A90D9',
        height: 56,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        shadowColor: '#4A90D9',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 4,
    },
    addToCartText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    notifyBtn: {
        backgroundColor: '#1A1A2E',
        shadowColor: '#1A1A2E',
    },
    addedBtn: {
        backgroundColor: '#10B981',
        shadowColor: '#10B981',
    },
});
