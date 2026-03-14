import { useAuthStore } from '@/store/authStore';
import { useKidsStore } from '@/store/kidsStore';
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

export default function ProfileScreen() {
    const router = useRouter();
    const { parentName, email, resetAuth } = useAuthStore();
    const { kids } = useKidsStore();

    const handleLogout = () => {
        resetAuth();
        router.replace('/login');
    };

    const renderMenuItem = (
        icon: any,
        title: string,
        subtitle?: string,
        onPress?: () => void,
        isDestructive = false
    ) => (
        <TouchableOpacity
            style={styles.menuItem}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.menuIconContainer, isDestructive && styles.destructiveIconContainer]}>
                <MaterialIcons name={icon} size={24} color={isDestructive ? "#EF4444" : "#4A90D9"} />
            </View>
            <View style={styles.menuTextContainer}>
                <Text style={[styles.menuTitle, isDestructive && styles.destructiveText]}>{title}</Text>
                {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" />

            {/* Custom Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <MaterialIcons name="arrow-back" size={24} color="#1A1A2E" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <TouchableOpacity style={styles.settingsBtn}>
                    <MaterialIcons name="settings" size={24} color="#1A1A2E" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Profile Header Section */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400"
                            style={styles.avatar}
                        />
                        <TouchableOpacity style={styles.editBadge}>
                            <MaterialIcons name="edit" size={14} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.userName}>{parentName || 'Sarah Mitchell'}</Text>
                    <Text style={styles.userEmail}>{email || 'sarah.m@booknest.com'}</Text>
                </View>

                {/* Menu Items */}
                <View style={styles.menuSection}>
                    {renderMenuItem(
                        'face',
                        'Manage Kids',
                        `${kids.length} profiles active`,
                        () => router.push('/manage-kids')
                    )}
                    {renderMenuItem(
                        'location-on',
                        'Saved Addresses',
                        undefined,
                        () => { } // Navigation would go here
                    )}
                    {renderMenuItem(
                        'payment',
                        'Payment Methods',
                        undefined,
                        () => { } // Navigation would go here
                    )}
                </View>

                <View style={[styles.menuSection, { marginTop: 24 }]}>
                    {renderMenuItem(
                        'logout',
                        'Logout',
                        undefined,
                        handleLogout,
                        true
                    )}
                </View>

                {/* Footer Info */}
                <View style={styles.footer}>
                    <Text style={styles.versionText}>BOOKNEST V2.4.12</Text>
                    <Text style={styles.tagline}>Made with love for readers</Text>
                </View>

                <View style={{ height: 40 }} />
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
        backgroundColor: '#F8F9FC',
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
    settingsBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        paddingTop: 20,
        paddingBottom: 40,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 20,
    },
    avatar: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 4,
        borderColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
    },
    editBadge: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: '#4A90D9',
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 3,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    userName: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1A1A2E',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 15,
        color: '#6B7280',
        fontWeight: '500',
    },
    menuSection: {
        paddingHorizontal: 20,
        gap: 16,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 8,
        elevation: 2,
    },
    menuIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#EBF2FC',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    destructiveIconContainer: {
        backgroundColor: '#FEF2F2',
    },
    menuTextContainer: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    destructiveText: {
        color: '#EF4444',
    },
    menuSubtitle: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
        fontWeight: '500',
    },
    footer: {
        marginTop: 48,
        alignItems: 'center',
    },
    versionText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#9CA3AF',
        letterSpacing: 1,
        marginBottom: 6,
    },
    tagline: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
    },
});
