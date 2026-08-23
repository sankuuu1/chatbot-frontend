import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Pencil,
    Volume2,
    VolumeX,
    Bell,
    HelpCircle,
    LogOut,
    Home,
    MessageSquare,
    Settings,
    ChevronRight,
    Play,
    Check,
    X,
    User,
    Zap,
    Phone,
    Info,
    Shield
} from 'lucide-react';

const SettingsPage = () => {
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const [settings, setSettings] = useState({
        name: 'संतोष जाधव',
        phone: '+919876543210',
        speech_speed: 1.0,
        auto_play_speech: true,
        notifications_enabled: true,
        crop_alerts_enabled: true,
        dark_mode: false,
        save_history: true
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isPlayingTest, setIsPlayingTest] = useState(false);

    // Modals
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [editName, setEditName] = useState('');
    const [editPhone, setEditPhone] = useState('');

    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    // Fetch settings on mount
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch(`${API_URL}/api/settings`);
                if (res.ok) {
                    const data = await res.json();
                    setSettings(data);
                }
            } catch (err) {
                console.error("Failed to fetch settings from backend:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, [API_URL]);

    // Show transient toast message
    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 2500);
    };

    // Save setting change to backend
    const updateSetting = async (updatedFields) => {
        const newSettings = { ...settings, ...updatedFields };
        setSettings(newSettings);
        setSaving(true);
        try {
            const res = await fetch(`${API_URL}/api/settings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedFields)
            });
            if (res.ok) {
                showToast("सेटिंग्ज जतन केल्या!");
            }
        } catch (err) {
            console.error("Failed to update settings:", err);
            showToast("सेटिंग्ज अपडेट करण्यात त्रुटी");
        } finally {
            setSaving(false);
        }
    };

    // Open Profile Edit Modal
    const handleOpenEditProfile = () => {
        setEditName(settings.name);
        setEditPhone(settings.phone);
        setIsEditProfileOpen(true);
    };

    // Save Profile Modal Changes
    const handleSaveProfile = () => {
        if (!editName.trim()) return;
        updateSetting({ name: editName.trim(), phone: editPhone.trim() });
        setIsEditProfileOpen(false);
    };

    // Test Speech Synthesis in Marathi
    const handleTestAudio = () => {
        if (!('speechSynthesis' in window)) {
            alert("तुमच्या ब्राऊजरमध्ये आवाज ऐकण्याची सुविधा उपलब्ध नाही.");
            return;
        }

        window.speechSynthesis.cancel(); // Stop any existing speech
        setIsPlayingTest(true);

        const sampleText = "नमस्कार! मी बंधू, तुमचा वैयक्तिक सहाय्यक. मी तुम्हाला मदत करण्यासाठी तयार आहे.";
        const utterance = new SpeechSynthesisUtterance(sampleText);
        utterance.lang = 'mr-IN';
        utterance.rate = parseFloat(settings.speech_speed) || 1.0;

        utterance.onend = () => setIsPlayingTest(false);
        utterance.onerror = () => setIsPlayingTest(false);

        window.speechSynthesis.speak(utterance);
    };

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div style={{ backgroundColor: '#FFFBF2', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', paddingBottom: '90px' }}>

            {/* --- HEADER --- */}
            <div style={{
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#FFFBF2',
                position: 'sticky',
                top: 0,
                zIndex: 20
            }}>
                <button
                    onClick={() => navigate('/home')}
                    style={{
                        background: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#374151',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                    }}
                >
                    <ArrowLeft size={20} />
                </button>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1F2937' }}>सेटिंग्ज</h2>
                <div style={{ width: '40px' }}></div> {/* Balance layout */}
            </div>

            {/* --- TOAST NOTIFICATION --- */}
            {toastMessage && (
                <div style={{
                    position: 'fixed',
                    top: '70px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#10B981',
                    color: 'white',
                    padding: '8px 18px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 100,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                }}>
                    <Check size={16} />
                    <span>{toastMessage}</span>
                </div>
            )}

            <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* --- 1. USER PROFILE CARD --- */}
                <div style={{
                    background: 'white',
                    borderRadius: '24px',
                    padding: '20px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: '1px solid #F3F4F6'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: '#D35400',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: '0 4px 10px rgba(211,84,0,0.25)',
                            flexShrink: 0
                        }}>
                            <User size={30} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', marginBottom: '4px' }}>
                                {settings.name}
                            </h3>
                            <p style={{ fontSize: '13px', color: '#6B7280', fontWeight: '500' }}>
                                {settings.phone}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleOpenEditProfile}
                        style={{
                            background: '#FFF3E0',
                            border: 'none',
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#D35400',
                            cursor: 'pointer'
                        }}
                    >
                        <Pencil size={18} />
                    </button>
                </div>


                {/* --- 2. VOICE & SPEECH SETTINGS CARD --- */}
                <div style={{
                    background: 'white',
                    borderRadius: '24px',
                    padding: '20px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                    border: '1px solid #F3F4F6'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                        <div style={{ background: '#FFF4E6', padding: '8px', borderRadius: '12px', color: '#D35400' }}>
                            <Volume2 size={20} />
                        </div>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1F2937' }}>आवाज आणि भाषण</h3>
                    </div>

                    {/* Speech Speed Slider */}
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>बोलण्याचा वेग</span>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#D35400', background: '#FFF3E0', padding: '2px 8px', borderRadius: '10px' }}>
                                {settings.speech_speed}x
                            </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px' }}>
                            <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: '600' }}>हळू</span>
                            <input
                                type="range"
                                min="0.5"
                                max="1.5"
                                step="0.1"
                                value={settings.speech_speed}
                                onChange={(e) => updateSetting({ speech_speed: parseFloat(e.target.value) })}
                                style={{
                                    flex: 1,
                                    accentColor: '#D35400',
                                    height: '6px',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}
                            />
                            <Zap size={18} color="#D35400" />
                            <span style={{ fontSize: '12px', color: '#D35400', fontWeight: '600' }}>जलद</span>
                        </div>
                    </div>

                    {/* Auto-play Speech Switch */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid #F3F4F6', borderBottom: '1px solid #F3F4F6' }}>
                        <div>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#1F2937' }}>उत्तर आपोआप बोला</p>
                            <p style={{ fontSize: '11px', color: '#6B7280' }}>उत्तर आल्यावर आवाज ऐकवला जाईल</p>
                        </div>
                        <ToggleSwitch
                            checked={settings.auto_play_speech}
                            onChange={(val) => updateSetting({ auto_play_speech: val })}
                        />
                    </div>

                    {/* Test Audio Button */}
                    <button
                        onClick={handleTestAudio}
                        style={{
                            marginTop: '15px',
                            width: '100%',
                            background: isPlayingTest ? '#FFF3E0' : '#F9FAFB',
                            border: '1px solid #E5E7EB',
                            borderRadius: '14px',
                            padding: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#D35400',
                            cursor: 'pointer'
                        }}
                    >
                        <Play size={16} style={{ fill: '#D35400' }} />
                        <span>{isPlayingTest ? 'आवाज ऐकवत आहे...' : 'आवाज तपासा (Test Voice)'}</span>
                    </button>
                </div>


                {/* --- 3. NOTIFICATIONS CARD --- */}
                <div style={{
                    background: 'white',
                    borderRadius: '24px',
                    padding: '20px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                    border: '1px solid #F3F4F6'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                        <div style={{ background: '#FFF4E6', padding: '8px', borderRadius: '12px', color: '#D35400' }}>
                            <Bell size={20} />
                        </div>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1F2937' }}>सूचना (Notifications)</h3>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <div>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#1F2937' }}>महत्त्वाचे अपडेट्स</p>
                            <p style={{ fontSize: '11px', color: '#6B7280' }}>अ‍ॅप अपडेट व महत्त्वाची माहिती</p>
                        </div>
                        <ToggleSwitch
                            checked={settings.notifications_enabled}
                            onChange={(val) => updateSetting({ notifications_enabled: val })}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #F3F4F6' }}>
                        <div>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#1F2937' }}>हवामान व पीक सूचना</p>
                            <p style={{ fontSize: '11px', color: '#6B7280' }}>पाऊस व शेतीविषयक दैनंदिन सल्ले</p>
                        </div>
                        <ToggleSwitch
                            checked={settings.crop_alerts_enabled}
                            onChange={(val) => updateSetting({ crop_alerts_enabled: val })}
                        />
                    </div>
                </div>


                {/* --- 4. HELP & SUPPORT CARD --- */}
                <div style={{
                    background: 'white',
                    borderRadius: '24px',
                    padding: '20px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                    border: '1px solid #F3F4F6'
                }}>
                    <div
                        onClick={() => setIsHelpModalOpen(true)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ background: '#FFF4E6', padding: '8px', borderRadius: '12px', color: '#D35400' }}>
                                <HelpCircle size={20} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1F2937' }}>मदत आणि संपर्क</h3>
                                <p style={{ fontSize: '11px', color: '#6B7280' }}>प्रश्न विचारा किंवा संपर्क साधा</p>
                            </div>
                        </div>
                        <ChevronRight size={20} color="#9CA3AF" />
                    </div>
                </div>


                {/* --- 5. LOGOUT BUTTON --- */}
                <div style={{ marginTop: '10px', marginBottom: '10px', textAlign: 'center' }}>
                    <button
                        onClick={() => setIsLogoutModalOpen(true)}
                        style={{
                            background: '#FFF5F5',
                            border: '1px solid #FECDD3',
                            padding: '14px 28px',
                            borderRadius: '30px',
                            fontSize: '15px',
                            fontWeight: '700',
                            color: '#E11D48',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(225,29,72,0.08)'
                        }}
                    >
                        <LogOut size={18} />
                        <span>बाहेर पडा (Logout)</span>
                    </button>
                </div>

                {/* --- FOOTER INFO --- */}
                <div style={{ textAlign: 'center', margin: '5px 0 15px' }}>
                    <p style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: '500' }}>
                        आवृत्ती १.०.० • ग्रामीण भारतासाठी बनवलेले 🇮🇳
                    </p>
                </div>

            </div>


            {/* --- EDIT PROFILE MODAL --- */}
            {isEditProfileOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ background: 'white', borderRadius: '24px', padding: '24px', width: '100%', maxWidth: '360px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827' }}>माहिती बदला</h3>
                            <button onClick={() => setIsEditProfileOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px', display: 'block' }}>पूर्ण नाव</label>
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #D1D5DB', fontSize: '15px', outline: 'none' }}
                            />
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px', display: 'block' }}>मोबाईल नंबर</label>
                            <input
                                type="tel"
                                value={editPhone}
                                onChange={(e) => setEditPhone(e.target.value)}
                                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #D1D5DB', fontSize: '15px', outline: 'none' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setIsEditProfileOpen(false)}
                                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #E5E7EB', background: '#F9FAFB', fontWeight: '600', color: '#4B5563', cursor: 'pointer' }}
                            >
                                रद्द करा
                            </button>
                            <button
                                onClick={handleSaveProfile}
                                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#D35400', fontWeight: '700', color: 'white', cursor: 'pointer' }}
                            >
                                जतन करा
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* --- HELP & SUPPORT MODAL --- */}
            {isHelpModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ background: 'white', borderRadius: '24px', padding: '24px', width: '100%', maxWidth: '360px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827' }}>मदत केंद्र</h3>
                            <button onClick={() => setIsHelpModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ fontSize: '14px', color: '#4B5563', lineHeight: '1.6', marginBottom: '20px' }}>
                            <p style={{ marginBottom: '10px' }}><strong>१. अ‍ॅप कसे वापरावे?</strong><br />मुख्य स्क्रीनवरील मायक्रोफोन बटण दाबून तुमच्या भाषेत बोला.</p>
                            <p style={{ marginBottom: '10px' }}><strong>२. संपर्क क्रमांक:</strong><br />टोल-फ्री सहाय्यता: १८००-१२३-४५६७</p>
                            <p><strong>३. ईमेल:</strong><br />support@bandhu.in</p>
                        </div>

                        <button
                            onClick={() => setIsHelpModalOpen(false)}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', background: '#D35400', fontWeight: '700', color: 'white', cursor: 'pointer' }}
                        >
                            ठीक आहे
                        </button>
                    </div>
                </div>
            )}


            {/* --- LOGOUT CONFIRMATION MODAL --- */}
            {isLogoutModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ background: 'white', borderRadius: '24px', padding: '24px', width: '100%', maxWidth: '340px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                        <div style={{ background: '#FFF5F5', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#E11D48' }}>
                            <LogOut size={24} />
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', marginBottom: '8px' }}>बाहेर पडायचे?</h3>
                        <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '24px' }}>तुम्हाला अ‍ॅपमधून बाहेर पडायचे आहे का?</p>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setIsLogoutModalOpen(false)}
                                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #E5E7EB', background: '#F9FAFB', fontWeight: '600', color: '#4B5563', cursor: 'pointer' }}
                            >
                                नाही
                            </button>
                            <button
                                onClick={handleLogout}
                                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#E11D48', fontWeight: '700', color: 'white', cursor: 'pointer' }}
                            >
                                होय, बाहेर पडा
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* --- BOTTOM NAVIGATION BAR --- */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                maxWidth: '420px',
                background: 'white',
                display: 'flex',
                justifyContent: 'space-around',
                padding: '12px 15px',
                borderTop: '1px solid #E5E7EB',
                boxShadow: '0 -4px 15px rgba(0,0,0,0.04)',
                zIndex: 30
            }}>
                <NavItem icon={<Home size={22} color="#9CA3AF" />} label="मुख्य" onClick={() => navigate('/home')} />
                <NavItem icon={<MessageSquare size={22} color="#9CA3AF" />} label="संभाषण" onClick={() => navigate('/chat')} />
                <NavItem icon={<Settings size={22} color="#D35400" />} label="सेटिंग्ज" active onClick={() => navigate('/settings')} />
            </div>

        </div>
    );
};

// Custom Toggle Switch Component
const ToggleSwitch = ({ checked, onChange }) => (
    <button
        type="button"
        onClick={() => onChange(!checked)}
        style={{
            width: '48px',
            height: '26px',
            borderRadius: '15px',
            background: checked ? '#D35400' : '#E5E7EB',
            border: 'none',
            position: 'relative',
            cursor: 'pointer',
            transition: 'background 0.2s',
            padding: '2px'
        }}
    >
        <div style={{
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            background: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            transform: checked ? 'translateX(22px)' : 'translateX(0)',
            transition: 'transform 0.2s'
        }} />
    </button>
);

// Bottom Navigation Item Component
const NavItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: active ? '#FFF4E6' : 'transparent',
            border: 'none',
            padding: '6px 16px',
            borderRadius: '18px',
            cursor: 'pointer',
            transition: 'background 0.2s'
        }}
    >
        {React.cloneElement(icon, { color: active ? '#D35400' : '#9CA3AF' })}
        <span style={{
            fontSize: '11px',
            marginTop: '3px',
            color: active ? '#D35400' : '#6B7280',
            fontWeight: active ? '700' : '500'
        }}>
            {label}
        </span>
    </button>
);

export default SettingsPage;
