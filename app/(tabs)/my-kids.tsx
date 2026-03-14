import { Kid, useKidsStore } from '@/store/kidsStore';
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

const avatarMap: Record<string, any> = {
    boy: require('@/assets/images/avatar_boy.png'),
    girl: require('@/assets/images/avatar_girl.png'),
};

function KidCard({ kid }: { kid: Kid }) {
    const router = useRouter();

    return (
        <View style={styles.kidCard}>
            <View style={styles.kidAvatar}>
                {kid.avatar && avatarMap[kid.avatar] ? (
                    <Image source={avatarMap[kid.avatar]} style={styles.kidAvatarImage} />
                ) : (
                    <View style={styles.kidAvatarPlaceholder}>
                        <MaterialIcons name="person" size={32} color="#9CA3AF" />
                    </View>
                )}
            </View>

            <View style={styles.kidInfo}>
                <Text style={styles.kidName}>{kid.name}</Text>
                <View style={styles.kidDetail}>
                    <MaterialIcons name="school" size={14} color="#6B7280" />
                    <Text style={styles.kidDetailText}>{kid.school}</Text>
                </View>
                <View style={styles.kidDetail}>
                    <MaterialIcons name="class" size={14} color="#6B7280" />
                    <Text style={styles.kidDetailText}>Class {kid.className}{kid.section}</Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.editBtn}
                onPress={() => router.push({ pathname: '/edit-child', params: { id: kid.id } })}
            >
                <MaterialIcons name="edit" size={20} color="#4A90D9" />
            </TouchableOpacity>
        </View>
    );
}

export default function MyKidsScreen() {
    const router = useRouter();
    const { kids } = useKidsStore();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.logoContainer}>
                        <MaterialIcons name="menu-book" size={22} color="#FFFFFF" />
                    </View>
                    <Text style={styles.headerTitle}>BookNest</Text>
                </View>
                <TouchableOpacity style={styles.notificationBtn}>
                    <MaterialIcons name="notifications-none" size={26} color="#1A1A2E" />
                </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Title Section */}
                <Text style={styles.pageTitle}>Your Kids</Text>
                <Text style={styles.pageSubtitle}>
                    Add your children to see their books and track progress.
                </Text>

                {/* Kid Cards */}
                {kids.map((kid) => (
                    <KidCard key={kid.id} kid={kid} />
                ))}

                {/* Empty State / Add More */}
                <View style={styles.emptyState}>
                    <View style={styles.emptyIcon}>
                        <MaterialIcons name="sentiment-satisfied" size={48} color="#4A90D9" />
                    </View>
                    <Text style={styles.emptyTitle}>Looking for someone else?</Text>
                    <Text style={styles.emptySubtitle}>
                        Add your other children to keep all{'\n'}their school libraries in one place.
                    </Text>
                </View>

                {/* Add New Child Button */}
                <TouchableOpacity
                    style={styles.addChildBtn}
                    onPress={() => router.push('/add-child')}
                    activeOpacity={0.8}
                >
                    <MaterialIcons name="add-circle-outline" size={22} color="#FFFFFF" />
                    <Text style={styles.addChildBtnText}>Add New Child</Text>
                </TouchableOpacity>

                <View style={{ height: 20 }} />
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
        paddingVertical: 12,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    logoContainer: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: '#4A90D9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    notificationBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 20,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    pageTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: '#1A1A2E',
        marginTop: 20,
        marginBottom: 6,
    },
    pageSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
        marginBottom: 20,
    },
    kidCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    kidAvatar: {
        marginRight: 14,
    },
    kidAvatarImage: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#E0E7F1',
    },
    kidAvatarPlaceholder: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#F3F4F8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    kidInfo: {
        flex: 1,
        gap: 3,
    },
    kidName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A2E',
        marginBottom: 2,
    },
    kidDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    kidDetailText: {
        fontSize: 13,
        color: '#6B7280',
    },
    editBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EBF2FC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    emptyIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#EBF2FC',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 6,
    },
    emptySubtitle: {
        fontSize: 13,
        color: '#9CA3AF',
        textAlign: 'center',
        lineHeight: 18,
    },
    addChildBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4A90D9',
        borderRadius: 16,
        paddingVertical: 16,
        gap: 8,
        shadowColor: '#4A90D9',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 5,
    },
    addChildBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
