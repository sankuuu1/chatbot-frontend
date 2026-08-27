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

const HomeDashboard = () => {
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState('');
    const [selectedLang, setSelectedLang] = useState('मराठी');
    const [isLangModalOpen, setIsLangModalOpen] = useState(false);
    const [showAllCategories, setShowAllCategories] = useState(false);

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter' && searchInput.trim()) {
            navigate('/chat', { state: { query: searchInput.trim() } });
        }
    };

    // Camera Upload Trigger
    const handleCameraClick = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = (e) => {
            if (e.target.files && e.target.files[0]) {
                alert(`फोटो निवडला: ${e.target.files[0].name}. (विश्लेषणासाठी चॅटकडे पाठवत आहे)`);
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
                    <span>{selectedLang}</span>
                    <ChevronDown size={16} color="#6B7280" />
                </button>
            </div>

            {/* --- EMOJI BADGE ABOVE GREETING --- */}
            <div style={{ textAlign: 'center', marginTop: '4px' }}>
                <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: '#FFF3E0',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
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
                    नमस्कार!
                </h1>
                <p style={{
                    color: '#4B5563',
                    marginTop: '6px',
                    fontSize: '16px',
                    fontWeight: '500'
                }}>
                    बोला, <span style={{ color: '#E65100', fontWeight: '700' }}>बंधू</span> समजून घेईल.
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
                    {/* DYNAMIC VOICE WAVE RINGS */}
                    <div className="voice-wave-ring voice-wave-1"></div>
                    <div className="voice-wave-ring voice-wave-2"></div>
                    <div className="voice-wave-ring voice-wave-3"></div>

                    <button
                        className="mic-pulse-btn"
                        onClick={() => navigate('/chat')}
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
                    बोलण्यासाठी टॅप करा
                </p>
            </div>


            {/* --- INPUT / SEARCH BAR WITH CAMERA & MIC ICONS --- */}
            <div style={{ padding: '0 20px', marginTop: '16px' }}>
                <div style={{
                    background: 'white',
                    borderRadius: '18px',
                    border: '1px solid #E5E7EB',
                    padding: '10px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 3px 12px rgba(0,0,0,0.03)'
                }}>
                    <input
                        type="text"
                        placeholder="तुमचा प्रश्न लिहा..."
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
                            title="फोटो अपलोड करा"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E65100', padding: 0 }}
                        >
                            <Camera size={20} />
                        </button>
                        <div style={{ height: '18px', width: '1px', background: '#E5E7EB' }}></div>
                        <button
                            onClick={() => navigate('/chat')}
                            title="आवाजाने बोला"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E65100', padding: 0 }}
                        >
                            <Mic size={20} />
                        </button>
                    </div>
                </div>
            </div>


            {/* --- SECTION 1: काही उदाहरणे --- */}
            <div style={{ marginTop: '20px' }}>
                <p style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#4B5563',
                    margin: '0 20px 8px'
                }}>
                    काही उदाहरणे
                </p>

                <div style={{
                    display: 'flex',
                    gap: '10px',
                    overflowX: 'auto',
                    padding: '0 20px 10px'
                }}>
                    <SuggestionChip
                        icon="🌧️"
                        text="आज पाऊस पडेल का?"
                        onClick={() => navigate('/chat', { state: { query: 'आज पाऊस पडेल का?' } })}
                    />
                    <SuggestionChip
                        icon="🍃"
                        text="कापसावर कीड आली आहे?"
                        onClick={() => navigate('/chat', { state: { category: 'farming', query: 'कापसावर कीड आली आहे' } })}
                    />
                </div>
            </div>


            {/* --- SECTION 2: बंधू कशात मदत करू? --- */}
            <div style={{ padding: '10px 20px 20px' }}>
                <h3 style={{
                    fontSize: '19px',
                    fontWeight: '800',
                    color: '#111827',
                    margin: '0 0 14px'
                }}>
                    बंधू कशात मदत करू?
                </h3>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px'
                }}>
                    {/* FARMING CARD - SOFT GREEN TINT */}
                    <CategoryCard
                        title="शेती"
                        subtitle="पीक, कीड, बाजारभाव, फवारणी सल्ला"
                        titleColor="#1B5E20"
                        cardBg="#F4F8F4"
                        cardBorder="#E2EFE2"
                        badgeBg="#E8F5E9"
                        arrowBg="#C8E6C9"
                        arrowColor="#1B5E20"
                        icon={<Sprout size={26} color="#2E7D32" strokeWidth={2} />}
                        onClick={() => navigate('/chat', { state: { category: 'farming' } })}
                    />

                    {/* EDUCATION CARD - SOFT BLUE TINT */}
                    <CategoryCard
                        title="शिक्षण"
                        subtitle="अभ्यास, गृहपाठ, प्रश्न व स्पष्टीकरण"
                        titleColor="#0D47A1"
                        cardBg="#F4F8FC"
                        cardBorder="#E2EDF8"
                        badgeBg="#E3F2FD"
                        arrowBg="#BBDEFB"
                        arrowColor="#0D47A1"
                        icon={<BookOpen size={26} color="#1565C0" strokeWidth={2} />}
                        onClick={() => navigate('/chat', { state: { category: 'education' } })}
                    />

                    {/* EXPANDED CATEGORIES (HEALTH & HELP) */}
                    {showAllCategories && (
                        <>
                            {/* HEALTH CARD - SOFT PINK TINT */}
                            <CategoryCard
                                title="आरोग्य"
                                subtitle="लक्षणे, प्राथमिक माहिती, आरोग्य सल्ला"
                                titleColor="#B71C1C"
                                cardBg="#FFF5F5"
                                cardBorder="#FDE8E8"
                                badgeBg="#FFEBEE"
                                arrowBg="#FFCDD2"
                                arrowColor="#B71C1C"
                                icon={<Heart size={26} color="#C62828" strokeWidth={2} />}
                                onClick={() => navigate('/chat', { state: { category: 'health' } })}
                            />

                            {/* HELP CARD - SOFT AMBER TINT */}
                            <CategoryCard
                                title="मदत"
                                subtitle="दैनंदिन प्रश्न, सरकारी माहिती, इतर मदत"
                                titleColor="#E65100"
                                cardBg="#FFFDF0"
                                cardBorder="#FEF3C7"
                                badgeBg="#FFF3E0"
                                arrowBg="#FFE0B2"
                                arrowColor="#E65100"
                                icon={<HelpCircle size={26} color="#EF6C00" strokeWidth={2} />}
                                onClick={() => navigate('/chat', { state: { category: 'help' } })}
                            />
                        </>
                    )}
                </div>

                {/* "सर्व विषय पाहा →" / "कमी विषय पाहा ↑" TOGGLE BUTTON */}
                <button
                    onClick={() => setShowAllCategories(!showAllCategories)}
                    style={{
                        width: '100%',
                        marginTop: '16px',
                        background: '#FFF8F0',
                        border: '1px solid #FFE0B2',
                        borderRadius: '24px',
                        padding: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        color: '#E65100',
                        fontWeight: '700',
                        fontSize: '15px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(230,81,0,0.04)'
                    }}
                >
                    <span>{showAllCategories ? 'कमी विषय पाहा' : 'सर्व विषय पाहा'}</span>
                    {showAllCategories ? <ArrowUp size={18} /> : <ArrowRight size={18} />}
                </button>
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
                            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827' }}>भाषा निवडा (Language)</h3>
                            <button onClick={() => setIsLangModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                            {['मराठी', 'English', 'हिंदी'].map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => {
                                        setSelectedLang(lang);
                                        setIsLangModalOpen(false);
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '14px 16px',
                                        borderRadius: '16px',
                                        border: selectedLang === lang ? '2px solid #E65100' : '1px solid #E5E7EB',
                                        background: selectedLang === lang ? '#FFF8F0' : 'white',
                                        fontSize: '15px',
                                        fontWeight: selectedLang === lang ? '700' : '500',
                                        color: selectedLang === lang ? '#E65100' : '#374151',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <span>{lang}</span>
                                    {selectedLang === lang && <Check size={18} color="#E65100" />}
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
                            निश्चित करा (Confirm)
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
                    label="मुख्य"
                    active
                    onClick={() => navigate('/home')}
                />
                <NavItem
                    icon={<Info size={22} />}
                    label="आजची माहिती"
                    onClick={() => navigate('/info')}
                />
                <NavItem
                    icon={<Settings size={22} />}
                    label="सेटिंग्ज"
                    onClick={() => navigate('/settings')}
                />
            </div>

        </div>
    );
};

// Suggestion Chip Component
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
        <span style={{ fontSize: '15px' }}>{icon}</span>
        <span>{text}</span>
    </button>
);

// Modern Category Card Component
const CategoryCard = ({ title, subtitle, titleColor, cardBg, cardBorder, badgeBg, arrowBg, arrowColor, icon, onClick }) => (
    <div
        onClick={onClick}
        style={{
            background: cardBg || 'white',
            borderRadius: '24px',
            padding: '18px 16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: `1px solid ${cardBorder || '#EAF0EA'}`,
            cursor: 'pointer',
            minHeight: '145px',
            position: 'relative'
        }}
    >
        <div>
            <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: badgeBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px'
            }}>
                {icon}
            </div>
            <h4 style={{ fontSize: '18px', fontWeight: '800', color: titleColor, marginBottom: '4px', margin: 0 }}>
                {title}
            </h4>
            <p style={{ fontSize: '11px', color: '#64748B', lineHeight: '1.4', fontWeight: '500', marginTop: '4px', margin: 0 }}>
                {subtitle}
            </p>
        </div>

        {/* Circular Arrow Button at Bottom Right */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: arrowBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: arrowColor
            }}>
                <ArrowRight size={16} strokeWidth={2.2} />
            </div>
        </div>
    </div>
);

// Bottom Navigation Item Component
const NavItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'transparent',
            border: 'none',
            padding: '4px 16px',
            cursor: 'pointer',
            position: 'relative'
        }}
    >
        {active && (
            <div style={{
                position: 'absolute',
                top: '-10px',
                width: '36px',
                height: '3px',
                background: '#E65100',
                borderRadius: '2px'
            }} />
        )}
        {React.cloneElement(icon, { color: active ? '#E65100' : '#94A3B8', strokeWidth: 2 })}
        <span style={{
            fontSize: '11px',
            marginTop: '4px',
            color: active ? '#E65100' : '#64748B',
            fontWeight: active ? '700' : '500'
        }}>
            {label}
        </span>
    </button>
);

export default HomeDashboard;
