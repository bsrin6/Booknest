import Toast from '@/components/Toast';
import { useKidsStore } from '@/store/kidsStore';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Modal,
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

const CLASSES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const SECTIONS = ['A', 'B', 'C', 'D', 'E'];
const CURRICULA = ['State/Lead', 'CBSC/Pinacle'];

interface PickerModalProps {
    visible: boolean;
    title: string;
    options: string[];
    selected: string;
    onSelect: (value: string) => void;
    onClose: () => void;
}

function PickerModal({ visible, title, options, selected, onSelect, onClose }: PickerModalProps) {
    return (
        <Modal visible={visible} transparent animationType="slide">
            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{title}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <MaterialIcons name="close" size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={options}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[styles.modalOption, selected === item && styles.modalOptionSelected]}
                                onPress={() => {
                                    onSelect(item);
                                    onClose();
                                }}
                            >
                                <Text
                                    style={[
                                        styles.modalOptionText,
                                        selected === item && styles.modalOptionTextSelected,
                                    ]}
                                >
                                    {item}
                                </Text>
                                {selected === item && (
                                    <MaterialIcons name="check" size={20} color="#4A90D9" />
                                )}
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

export default function EditChildScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { kids, updateKid, removeKid } = useKidsStore();

    const [name, setName] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedCurriculum, setSelectedCurriculum] = useState('');
    const [schoolName, setSchoolName] = useState('');
    const [city, setCity] = useState('');

    const [showClassPicker, setShowClassPicker] = useState(false);
    const [showSectionPicker, setShowSectionPicker] = useState(false);
    const [showCurriculumPicker, setShowCurriculumPicker] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        const kid = kids.find(k => k.id === id);
        if (kid) {
            setName(kid.name);
            setSelectedClass(kid.className);
            setSelectedSection(kid.section);
            setSelectedCurriculum(kid.curriculum);
            setSchoolName(kid.school);
            setCity(kid.city);
        } else if (id) {
            Alert.alert("Error", "Profile not found");
            router.back();
        }
    }, [id, kids]);

    const handleSave = () => {
        if (!name.trim()) return;

        updateKid(id!, {
            name: name.trim(),
            school: schoolName.trim() || 'Unknown School',
            className: selectedClass || '1',
            section: selectedSection || 'A',
            curriculum: selectedCurriculum || 'CBSC/Pinacle',
            city: city.trim() || '',
        });

        // Show success toast
        setToastMessage(`${name.trim()}'s profile updated successfully! 🎉`);
        setShowToast(true);

        setTimeout(() => {
            router.back();
        }, 1500);
    };

    const handleDelete = () => {
        Alert.alert(
            "Delete Profile",
            `Are you sure you want to delete ${name}'s profile? This action cannot be undone.`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        removeKid(id!);
                        router.back();
                    }
                }
            ]
        );
    };

    const handleToastHide = () => {
        setShowToast(false);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Success Toast */}
            <Toast
                visible={showToast}
                message={toastMessage}
                type="success"
                onHide={handleToastHide}
                duration={1500}
            />
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <MaterialIcons name="arrow-back" size={24} color="#1A1A2E" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
                    <MaterialIcons name="delete-outline" size={24} color="#EF4444" />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Icon */}
                    <View style={styles.iconContainer}>
                        <View style={styles.iconCircle}>
                            <MaterialIcons name="person" size={52} color="#4A90D9" />
                        </View>
                    </View>

                    {/* Kid Name */}
                    <Text style={styles.fieldLabel}>Kid Name</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter child's name"
                            placeholderTextColor="#9CA3AF"
                            value={name}
                            onChangeText={setName}
                        />
                        <MaterialIcons name="person-outline" size={22} color="#9CA3AF" />
                    </View>

                    {/* Class and Section */}
                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.fieldLabel}>Class</Text>
                            <TouchableOpacity
                                style={styles.dropdownContainer}
                                onPress={() => setShowClassPicker(true)}
                            >
                                <Text style={[styles.dropdownText, !selectedClass && styles.placeholderText]}>
                                    {selectedClass || 'Select'}
                                </Text>
                                <MaterialIcons name="keyboard-arrow-down" size={22} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        <View style={{ width: 14 }} />

                        <View style={{ flex: 1 }}>
                            <Text style={styles.fieldLabel}>Section</Text>
                            <TouchableOpacity
                                style={styles.dropdownContainer}
                                onPress={() => setShowSectionPicker(true)}
                            >
                                <Text style={[styles.dropdownText, !selectedSection && styles.placeholderText]}>
                                    {selectedSection || 'Select'}
                                </Text>
                                <MaterialIcons name="keyboard-arrow-down" size={22} color="#6B7280" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Curriculum */}
                    <Text style={styles.fieldLabel}>Curriculum</Text>
                    <TouchableOpacity
                        style={styles.dropdownContainer}
                        onPress={() => setShowCurriculumPicker(true)}
                    >
                        <Text style={[styles.dropdownText, !selectedCurriculum && styles.placeholderText]}>
                            {selectedCurriculum || 'Select Board'}
                        </Text>
                        <MaterialIcons name="keyboard-arrow-down" size={22} color="#6B7280" />
                    </TouchableOpacity>

                    {/* School Name */}
                    <Text style={styles.fieldLabel}>School Name</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter school name"
                            placeholderTextColor="#9CA3AF"
                            value={schoolName}
                            onChangeText={setSchoolName}
                        />
                        <MaterialIcons name="school" size={22} color="#9CA3AF" />
                    </View>

                    {/* City */}
                    <Text style={styles.fieldLabel}>City</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter city"
                            placeholderTextColor="#9CA3AF"
                            value={city}
                            onChangeText={setCity}
                        />
                        <MaterialIcons name="location-on" size={22} color="#9CA3AF" />
                    </View>

                    <View style={{ height: 40 }} />

                    {/* Save Button */}
                    <TouchableOpacity
                        style={[styles.saveBtn, !name.trim() && styles.saveBtnDisabled]}
                        onPress={handleSave}
                        activeOpacity={0.8}
                        disabled={!name.trim()}
                    >
                        <MaterialIcons name="check" size={20} color="#FFFFFF" />
                        <Text style={styles.saveBtnText}>Update Profile</Text>
                    </TouchableOpacity>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Picker Modals */}
            <PickerModal
                visible={showClassPicker}
                title="Select Class"
                options={CLASSES}
                selected={selectedClass}
                onSelect={setSelectedClass}
                onClose={() => setShowClassPicker(false)}
            />
            <PickerModal
                visible={showSectionPicker}
                title="Select Section"
                options={SECTIONS}
                selected={selectedSection}
                onSelect={setSelectedSection}
                onClose={() => setShowSectionPicker(false)}
            />
            <PickerModal
                visible={showCurriculumPicker}
                title="Select Curriculum"
                options={CURRICULA}
                selected={selectedCurriculum}
                onSelect={setSelectedCurriculum}
                onClose={() => setShowCurriculumPicker(false)}
            />
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
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteBtn: {
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
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    iconContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    iconCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#EBF2FC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A2E',
        marginBottom: 8,
        marginTop: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    textInput: {
        flex: 1,
        fontSize: 15,
        color: '#1A1A2E',
    },
    row: {
        flexDirection: 'row',
    },
    dropdownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F9FAFB',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    dropdownText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#1A1A2E',
    },
    placeholderText: {
        color: '#9CA3AF',
    },
    saveBtn: {
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
    saveBtnDisabled: {
        backgroundColor: '#B0C4DE',
        shadowOpacity: 0.1,
    },
    saveBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: 400,
        paddingBottom: 30,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    modalTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    modalOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F9FAFB',
    },
    modalOptionSelected: {
        backgroundColor: '#EBF2FC',
    },
    modalOptionText: {
        fontSize: 15,
        color: '#374151',
    },
    modalOptionTextSelected: {
        fontWeight: '600',
        color: '#4A90D9',
    },
});
