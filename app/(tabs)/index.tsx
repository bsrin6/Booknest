import { useKidsStore } from '@/store/kidsStore';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface Bundle {
  id: string;
  title: string;
  curriculum: string;
  gradeRange: string; // e.g. "1-3", "4-6", "4", "1-12"
  year: string;
  price: number;
  bookCount: number;
  extras: string;
  image: any;
  badge?: string;
  comingSoon?: boolean;
}

// Master catalog of bundles with grade ranges
const ALL_BUNDLES: Bundle[] = [
  // CBSE bundles
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
  },
  // ICSE bundles
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
  },
  // IB bundles
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
  },
  // General / All boards
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
  },
];

// Check if a grade falls within a range like "4-6" or "4"
function gradeInRange(grade: number, range: string): boolean {
  if (range.includes('-')) {
    const [min, max] = range.split('-').map(Number);
    return grade >= min && grade <= max;
  }
  return grade === parseInt(range, 10);
}

export default function HomeScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { kids, selectedKidId, selectKid } = useKidsStore();
  const selectedKid = kids.find((k) => k.id === selectedKidId) || kids[0];

  const kidGrade = selectedKid ? parseInt(selectedKid.className, 10) : null;
  const kidCurriculum = selectedKid?.curriculum || '';

  // Build dynamic curriculum tabs based on the selected kid
  const curriculumTabs = useMemo(() => {
    const tabs = ['All'];
    if (kidCurriculum && !tabs.includes(kidCurriculum)) {
      tabs.push(kidCurriculum);
    }
    // Add other common curricula
    ['State/Lead', 'CBSC/Pinacle'].forEach((c) => {
      if (!tabs.includes(c)) tabs.push(c);
    });
    return tabs;
  }, [kidCurriculum]);

  // Filter bundles based on selected kid's grade + active tab
  const filteredBundles = useMemo(() => {
    let bundles = ALL_BUNDLES;

    // First filter by grade matching the selected kid
    if (kidGrade) {
      bundles = bundles.filter((b) => gradeInRange(kidGrade, b.gradeRange));
    }

    // Then filter by curriculum tab
    if (activeTab !== 'All') {
      bundles = bundles.filter(
        (b) => b.curriculum === activeTab || b.curriculum === 'All Boards'
      );
    }

    // Sort: kid's curriculum first, then best sellers, then rest
    bundles.sort((a, b) => {
      // Kid's curriculum first
      if (a.curriculum === kidCurriculum && b.curriculum !== kidCurriculum) return -1;
      if (b.curriculum === kidCurriculum && a.curriculum !== kidCurriculum) return 1;
      // Badges come first
      if (a.badge && !b.badge) return -1;
      if (b.badge && !a.badge) return 1;
      return 0;
    });

    return bundles.slice(0, 1);
  }, [activeTab, kidGrade, kidCurriculum]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('@/assets/images/avatar_sarah.png')}
            style={styles.avatar}
          />
          <View style={styles.headerText}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>Hello, Sarah</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <MaterialIcons name="notifications-none" size={26} color="#1A1A2E" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Kid Switcher */}
        <View style={styles.switcherCard}>
          <Text style={styles.switcherLabel}>Switching view for:</Text>
          <TouchableOpacity
            style={[styles.switcherDropdown, isDropdownOpen && styles.switcherDropdownOpen]}
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
            activeOpacity={0.7}
          >
            <Text style={styles.switcherValue}>
              {selectedKid
                ? `${selectedKid.name.split(' ')[0]} - Grade ${selectedKid.className} (${selectedKid.curriculum})`
                : 'Select a child'}
            </Text>
            <MaterialIcons name={isDropdownOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={24} color={isDropdownOpen ? "#4A90D9" : "#4A6FA5"} />
          </TouchableOpacity>

          {isDropdownOpen && (
            <View style={styles.dropdownList}>
              {kids.map((kid) => (
                <TouchableOpacity
                  key={kid.id}
                  style={[styles.dropdownItem, selectedKidId === kid.id && styles.dropdownItemActive]}
                  onPress={() => {
                    selectKid(kid.id);
                    setIsDropdownOpen(false);
                  }}
                >
                  <View style={styles.dropdownItemLeft}>
                    <View style={[styles.avatarMini, { backgroundColor: selectedKidId === kid.id ? '#4A90D9' : '#E5E7EB' }]}>
                      <Text style={[styles.avatarMiniText, { color: selectedKidId === kid.id ? '#FFFFFF' : '#6B7280' }]}>
                        {kid.name.charAt(0)}
                      </Text>
                    </View>
                    <View>
                      <Text style={[styles.dropdownItemTitle, selectedKidId === kid.id && styles.dropdownItemTitleActive]}>
                        {kid.name}
                      </Text>
                      <Text style={styles.dropdownItemSubtitle}>
                        Grade {kid.className} ({kid.curriculum})
                      </Text>
                    </View>
                  </View>
                  {selectedKidId === kid.id && (
                    <MaterialIcons name="check-circle" size={20} color="#4A90D9" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Curriculum Bundles Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Curriculum Bundles</Text>
        </View>

        {/* Personalized note */}
        {selectedKid && (
          <View style={styles.personalizedNote}>
            <MaterialIcons name="auto-awesome" size={16} color="#4A90D9" />
            <Text style={styles.personalizedText}>
              Showing bundles for Grade {selectedKid.className} • {selectedKid.curriculum}
            </Text>
          </View>
        )}

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {curriculumTabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.filterTab,
                activeTab === tab && styles.filterTabActive,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeTab === tab && styles.filterTabTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Empty state */}
        {filteredBundles.length === 0 && (
          <View style={styles.emptyBundles}>
            <MaterialIcons name="search-off" size={42} color="#D1D5DB" />
            <Text style={styles.emptyBundlesTitle}>No Bundles Found</Text>
            <Text style={styles.emptyBundlesSubtitle}>
              No bundles available for this combination.{'\n'}Try selecting "All" to see everything.
            </Text>
          </View>
        )}

        {/* Bundle Cards */}
        {filteredBundles.map((bundle) => (
          <View key={bundle.id} style={styles.bundleCard}>
            {/* Image */}
            <View style={styles.bundleImageContainer}>
              {bundle.badge && bundle.badge !== 'BEST SELLER' && (
                <View
                  style={[
                    styles.badge,
                    bundle.comingSoon && styles.badgeComingSoon,
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      bundle.comingSoon && styles.badgeTextComingSoon,
                    ]}
                  >
                    {bundle.badge}
                  </Text>
                </View>
              )}
              {/* Curriculum tag on image */}
              <View style={styles.curriculumTag}>
                <Text style={styles.curriculumTagText}>{bundle.curriculum}</Text>
              </View>
              <Image
                source={bundle.image}
                style={styles.bundleImage}
                contentFit="cover"
              />
            </View>

            {/* Details */}
            <View style={styles.bundleDetails}>
              <View style={styles.bundleTitleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bundleTitle}>{bundle.title}</Text>
                  <Text style={styles.bundleSubtitle}>
                    {bundle.curriculum} Curriculum • {bundle.year}
                  </Text>
                </View>
                <Text style={[styles.bundlePrice, bundle.comingSoon && { color: '#1A1A2E' }]}>
                  ₹{bundle.price.toFixed(2)}
                </Text>
              </View>

              <View style={styles.bundleMeta}>
                <View style={styles.metaItem}>
                  <MaterialIcons name="library-books" size={14} color="#6B7280" />
                  <Text style={styles.metaText}>
                    {bundle.bookCount} {bundle.bookCount === 1 ? 'Workbook' : 'Books'}
                  </Text>
                </View>
                {bundle.extras ? (
                  <View style={styles.metaItem}>
                    <MaterialIcons
                      name={bundle.extras.includes('Delivery') ? 'local-shipping' : 'inventory-2'}
                      size={14}
                      color="#6B7280"
                    />
                    <Text style={styles.metaText}>{bundle.extras}</Text>
                  </View>
                ) : null}
                <View style={styles.metaItem}>
                  <MaterialIcons name="school" size={14} color="#6B7280" />
                  <Text style={styles.metaText}>Grade {bundle.gradeRange}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.viewBundleBtn,
                  bundle.comingSoon && styles.notifyBtn,
                ]}
                activeOpacity={0.8}
                onPress={() => router.push({
                  pathname: '/bundle-details',
                  params: { id: bundle.id }
                })}
              >
                <Text
                  style={[
                    styles.viewBundleBtnText,
                    bundle.comingSoon && styles.notifyBtnText,
                  ]}
                >
                  {bundle.comingSoon ? 'Notify Me' : 'View Bundle →'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

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
    gap: 12,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#E0E7F1',
  },
  headerText: {
    gap: 2,
  },
  welcomeText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '400',
  },
  userName: {
    fontSize: 18,
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  switcherCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  switcherLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  switcherDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F8',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  switcherDropdownOpen: {
    borderColor: '#4A90D9',
    backgroundColor: '#F7FAFF',
  },
  switcherValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  dropdownList: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  dropdownItemActive: {
    backgroundColor: '#F0F7FF',
  },
  dropdownItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarMini: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarMiniText: {
    fontSize: 14,
    fontWeight: '700',
  },
  dropdownItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  dropdownItemTitleActive: {
    color: '#1A1A2E',
  },
  dropdownItemSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90D9',
  },
  personalizedNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  personalizedText: {
    fontSize: 13,
    color: '#4A90D9',
    fontWeight: '500',
  },
  tabsContainer: {
    gap: 10,
    marginBottom: 18,
    paddingRight: 10,
  },
  filterTab: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  filterTabActive: {
    backgroundColor: '#4A90D9',
    borderColor: '#4A90D9',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  emptyBundles: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyBundlesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B7280',
    marginTop: 4,
  },
  emptyBundlesSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
  bundleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
  },
  bundleImageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  bundleImage: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    zIndex: 1,
  },
  badgeComingSoon: {
    backgroundColor: '#E5E7EB',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  badgeTextComingSoon: {
    color: '#374151',
  },
  curriculumTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(74, 144, 217, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 1,
  },
  curriculumTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  bundleDetails: {
    padding: 16,
  },
  bundleTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bundleTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  bundleSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 3,
  },
  bundlePrice: {
    fontSize: 19,
    fontWeight: '700',
    color: '#4A90D9',
    marginLeft: 10,
  },
  bundleMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 14,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  viewBundleBtn: {
    backgroundColor: '#4A90D9',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  viewBundleBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  notifyBtn: {
    backgroundColor: '#F3F4F8',
  },
  notifyBtnText: {
    color: '#9CA3AF',
  },
});
