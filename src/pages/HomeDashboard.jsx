import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Mic,
    Camera,
    BookOpen,
    Home,
    MessageSquare,
    Info,
    Settings,
    ArrowRight,
    ArrowUp,
    Sprout,
    Heart,
    HelpCircle,
    ChevronDown,
    Check,
    X
} from 'lucide-react';
import bandhuLogo from '../assets/Gemini_Generated_Image_za4cfxza4cfxza4c-removebg-preview.png';
import { useChat } from '../context/ChatContext';

const HomeDashboard = () => {
    const navigate = useNavigate();
    const { selectedLangLabel, setLanguage, t } = useChat();
    const [searchInput, setSearchInput] = useState('');
    const [isLangModalOpen, setIsLangModalOpen] = useState(false);
    const [showAllCategories, setShowAllCategories] = useState(false);

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter' && searchInput.trim()) {
            navigate('/chat', { state: { query: searchInput.trim() } });
        }
    };

    const handleInputClick = () => {
        if (searchInput.trim()) {
            navigate('/chat', { state: { query: searchInput.trim() } });
        } else {
            navigate('/chat');
        }
    };

    const handleCameraClick = (e) => {
        e.stopPropagation();
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = (e) => {
            if (e.target.files && e.target.files[0]) {
                alert(`Photo selected: ${e.target.files[0].name}. (Sending to chat for analysis)`);
                navigate('/chat', { state: { hasImage: true, imageName: e.target.files[0].name } });
            }
        };
        fileInput.click();
    };

    return (
        <div style={{
            backgroundColor: '#FFFDF9',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            paddingBottom: '100px',
            fontFamily: "'Noto Sans Devanagari', 'Inter', system-ui, sans-serif"
        }}>

            {/* --- TOP HEADER --- */}
            <div style={{
                padding: '18px 20px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{
                    width: '76px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    overflow: 'hidden'
                }}>
                    <img
                        src={bandhuLogo}
                        alt="Bandhu"
                        style={{
                            width: '100%',
                            height: 'auto',
                            objectFit: 'contain',
                            transform: 'scale(1.2)',
                            transformOrigin: 'left center'
                        }}
                    />
                </div>

                {/* Top Right Language Dropdown Pill */}
                <button
                    onClick={() => setIsLangModalOpen(true)}
                    style={{
                        background: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '24px',
                        padding: '6px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1F2937',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                    }}
                >
                    <span>{selectedLangLabel}</span>
                    <ChevronDown size={16} color="#6B7280" />
                </button>
            </div>

            {/* --- EMOJI BADGE ABOVE GREETING --- */}
            <div style={{ padding: '0 20px', marginTop: '10px', textAlign: 'center' }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: '#FFF3E0',
                    marginBottom: '6px'
                }}>
                    <span style={{ fontSize: '22px' }}>🙏</span>
                </div>

                {/* GREETING HEADLINE */}
                <h1 style={{
                    fontSize: '34px',
                    fontWeight: '900',
                    color: '#111827',
                    margin: 0,
                    letterSpacing: '-0.5px'
                }}>
                    {t?.greeting || 'Hello!'}
                </h1>
                <p style={{
                    color: '#4B5563',
                    marginTop: '6px',
                    fontSize: '16px',
                    fontWeight: '500'
                }}>
                    {t?.greetingSub || 'How can I help you today?'}
                </p>

                {/* MIC BUTTON WITH DYNAMIC VOICE WAVES */}
                <div style={{
                    position: 'relative',
                    height: '180px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '10px 0 4px'
                }}>
                    <div className="voice-wave-ring voice-wave-1"></div>
                    <div className="voice-wave-ring voice-wave-2"></div>
                    <div className="voice-wave-ring voice-wave-3"></div>

                    <button
                        className="mic-pulse-btn"
                        onClick={() => navigate('/chat', { state: { autoListen: true } })}
                        style={{
                            width: '90px',
                            height: '90px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #FF6F00 0%, #E65100 100%)',
                            border: '4px solid white',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10,
                            cursor: 'pointer'
                        }}
                    >
                        <Mic size={40} strokeWidth={2.2} />
                    </button>
                </div>

                <p style={{ fontSize: '13px', color: '#1F2937', fontWeight: '700', marginTop: '2px' }}>
                    {t?.speakClearly || 'Tap to Speak'}
                </p>
            </div>

            {/* --- INPUT / SEARCH BAR WITH CAMERA & MIC ICONS --- */}
            <div style={{ padding: '0 20px', marginTop: '16px' }}>
                <div
                    onClick={handleInputClick}
                    style={{
                        background: 'white',
                        borderRadius: '18px',
                        border: '1px solid #E5E7EB',
                        padding: '10px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 3px 12px rgba(0,0,0,0.03)',
                        cursor: 'pointer'
                    }}
                >
                    <input
                        type="text"
                        placeholder={t?.askPlaceholder || 'Ask anything...'}
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={handleSearchSubmit}
                        style={{
                            border: 'none',
                            outline: 'none',
                            width: '100%',
                            fontSize: '15px',
                            color: '#1F2937',
                            background: 'transparent',
                            fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif"
                        }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                        <button
                            onClick={handleCameraClick}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E65100', padding: 0 }}
                        >
                            <Camera size={20} />
                        </button>
                        <div style={{ height: '18px', width: '1px', background: '#E5E7EB' }}></div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate('/chat', { state: { autoListen: true } });
                            }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E65100', padding: 0 }}
                        >
                            <Mic size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* --- SUGGESTION CHIPS --- */}
            <div style={{ padding: '24px 20px 0' }}>
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
                    <SuggestionChip
                        icon="🌧️"
                        text={t?.suggestions?.rain || "Will it rain today?"}
                        onClick={() => navigate('/chat', { state: { query: t?.suggestions?.rain || "Will it rain today?" } })}
                    />
                    <SuggestionChip
                        icon="📈"
                        text={t?.suggestions?.cotton || "Cotton market price?"}
                        onClick={() => navigate('/chat', { state: { query: t?.suggestions?.cotton || "Cotton market price?" } })}
                    />
                    <SuggestionChip
                        icon="🏛️"
                        text={t?.suggestions?.schemes || "Government schemes?"}
                        onClick={() => navigate('/chat', { state: { query: t?.suggestions?.schemes || "Government schemes?" } })}
                    />
                </div>
            </div>

            {/* --- LANGUAGE SELECTION MODAL --- */}
            {isLangModalOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(3px)',
                    zIndex: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '24px',
                        padding: '24px',
                        width: '100%',
                        maxWidth: '340px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827' }}>{t?.selectLanguage || 'Select Language'}</h3>
                            <button onClick={() => setIsLangModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                            {['मराठी', 'English', 'हिंदी'].map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => {
                                        setLanguage(lang);
                                        setIsLangModalOpen(false);
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '14px 16px',
                                        borderRadius: '16px',
                                        border: selectedLangLabel === lang ? '2px solid #E65100' : '1px solid #E5E7EB',
                                        background: selectedLangLabel === lang ? '#FFF8F0' : 'white',
                                        fontSize: '15px',
                                        fontWeight: selectedLangLabel === lang ? '700' : '500',
                                        color: selectedLangLabel === lang ? '#E65100' : '#374151',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <span>{lang}</span>
                                    {selectedLangLabel === lang && <Check size={18} color="#E65100" />}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setIsLangModalOpen(false)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '14px',
                                border: 'none',
                                background: '#E65100',
                                color: 'white',
                                fontWeight: '700',
                                fontSize: '15px',
                                cursor: 'pointer'
                            }}
                        >
                            {t?.confirm || 'Confirm'}
                        </button>
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
                padding: '10px 15px 12px',
                borderTop: '1px solid #F1F5F9',
                boxShadow: '0 -4px 15px rgba(0,0,0,0.03)',
                zIndex: 30
            }}>
                <NavItem
                    icon={<Home size={22} />}
                    label={t?.home || 'Home'}
                    active
                    onClick={() => navigate('/home')}
                />
                <NavItem
                    icon={<Info size={22} />}
                    label={t?.dailyInfo || 'Daily Info'}
                    onClick={() => navigate('/info')}
                />
                <NavItem
                    icon={<Settings size={22} />}
                    label={t?.settings || 'Settings'}
                    onClick={() => navigate('/settings')}
                />
            </div>

        </div>
    );
};

const SuggestionChip = ({ icon, text, onClick }) => (
    <button
        onClick={onClick}
        style={{
            background: 'white',
            border: '1px solid #E2E8F0',
            borderRadius: '30px',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: '600',
            color: '#1E293B',
            whiteSpace: 'nowrap',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}
    >
        <span>{icon}</span>
        <span>{text}</span>
    </button>
);

const NavItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            color: active ? '#E65100' : '#94A3B8',
            fontSize: '11px',
            fontWeight: active ? '700' : '500',
            cursor: 'pointer',
            padding: '4px 12px'
        }}
    >
        {icon}
        <span>{label}</span>
    </button>
);

export default HomeDashboard;
