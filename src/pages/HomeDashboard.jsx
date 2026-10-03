import React, { useState, useEffect } from 'react';
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
    X,
    TrendingUp,
    TrendingDown,
    RefreshCw
} from 'lucide-react';
import bandhuLogo from '../assets/Gemini_Generated_Image_za4cfxza4cfxza4c-removebg-preview.png';
import { useChat } from '../context/ChatContext';
import { fetchMandiRates } from '../services/api';
import SchemeWizardModal from '../components/SchemeWizardModal';

const HomeDashboard = () => {
    const navigate = useNavigate();
    const { language, selectedLangLabel, setLanguage, t } = useChat();
    const [searchInput, setSearchInput] = useState('');
    const [isLangModalOpen, setIsLangModalOpen] = useState(false);
    const [isSchemeWizardOpen, setIsSchemeWizardOpen] = useState(false);
    const [showAllCategories, setShowAllCategories] = useState(false);
    const [mandiRates, setMandiRates] = useState([]);
    const [loadingMandi, setLoadingMandi] = useState(true);

    useEffect(() => {
        const loadRates = async () => {
            try {
                const res = await fetchMandiRates(language);
                if (res?.commodities) {
                    setMandiRates(res.commodities);
                }
            } catch (e) {
                console.warn('Could not load mandi rates:', e);
            } finally {
                setLoadingMandi(false);
            }
        };
        loadRates();
    }, [language]);

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
            paddingBottom: '140px',
            fontFamily: "'Noto Sans Devanagari', 'Inter', system-ui, sans-serif"
        }}>

            {/* --- TOP HEADER --- */}
            <div style={{
                padding: '20px 20px 0px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{
                    width: '78px',
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

            {/* --- GREETING HEADLINE --- */}
            <div style={{ padding: '0 20px', marginTop: '24px', textAlign: 'center' }}>
                <h1 style={{
                    fontSize: '32px',
                    fontWeight: '900',
                    color: '#111827',
                    margin: 0,
                    letterSpacing: '-0.5px'
                }}>
                    {t?.greeting || 'नमस्कार! मी बंधू. 🙏'}
                </h1>
                <p style={{
                    color: '#4B5563',
                    marginTop: '8px',
                    fontSize: '15px',
                    fontWeight: '500'
                }}>
                    {t?.greetingSub || 'सांगा, आज मी तुम्हाला कशी मदत करू शकतो?'}
                </p>

                {/* MIC BUTTON WITH SPACIOUS GAP */}
                <div style={{
                    position: 'relative',
                    height: '150px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '36px 0 16px'
                }}>
                    <div className="voice-wave-ring voice-wave-1"></div>
                    <div className="voice-wave-ring voice-wave-2"></div>
                    <div className="voice-wave-ring voice-wave-3"></div>

                    <button
                        className="mic-pulse-btn"
                        onClick={() => navigate('/chat', { state: { autoListen: true } })}
                        style={{
                            width: '82px',
                            height: '82px',
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
                        <Mic size={38} strokeWidth={2.2} />
                    </button>
                </div>

                <p style={{ fontSize: '13px', color: '#64748B', fontWeight: '600', marginTop: '4px' }}>
                    {t?.speakClearly || 'तुमचा प्रश्न स्पष्टपणे बोला'}
                </p>
            </div>

            {/* --- INPUT / SEARCH BAR WITH SPACIOUS GAP --- */}
            <div style={{ padding: '0 20px', marginTop: '32px' }}>
                <div
                    onClick={handleInputClick}
                    style={{
                        background: 'white',
                        borderRadius: '20px',
                        border: '1px solid #E5E7EB',
                        padding: '12px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                        cursor: 'pointer'
                    }}
                >
                    <input
                        type="text"
                        placeholder={t?.askPlaceholder || 'इथे प्रश्न लिहा किंवा विचारा...'}
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

            {/* --- SECTION 1: SUGGESTION CHIPS WITH SPACIOUS GAP --- */}
            <div style={{ marginTop: '24px' }}>
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    overflowX: 'auto',
                    padding: '0 20px 4px'
                }}>
                    <SuggestionChip
                        icon="🌧️"
                        text={t?.suggestions?.rain || "आज पाऊस पडेल का?"}
                        onClick={() => navigate('/chat', { state: { query: t?.suggestions?.rain || "आज पाऊस पडेल का?" } })}
                    />
                    <SuggestionChip
                        icon="📈"
                        text={t?.suggestions?.cotton || "कापसाचा बाजारभाव?"}
                        onClick={() => navigate('/chat', { state: { query: t?.suggestions?.cotton || "कापसाचा बाजारभाव?" } })}
                    />
                    <SuggestionChip
                        icon="🏛️"
                        text={t?.suggestions?.schemes || "सरकारी योजना कोणती आहे?"}
                        onClick={() => setIsSchemeWizardOpen(true)}
                    />
                </div>
            </div>

            {/* --- SECTION: LIVE AGMARKNET MANDI RATES CAROUSEL --- */}
            {mandiRates && mandiRates.length > 0 && (
                <div style={{ marginTop: '20px', padding: '0 20px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '10px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '15px' }}>📊</span>
                            <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#111827', margin: 0 }}>
                                {language === 'mr' ? 'थेट बाजारभाव (Mandi Rates)' : language === 'hi' ? 'ताज़ा मंडी भाव' : 'Live Mandi Rates'}
                            </h4>
                            <span style={{
                                width: '7px',
                                height: '7px',
                                borderRadius: '50%',
                                backgroundColor: '#16A34A',
                                display: 'inline-block',
                                animation: 'pulse 1.2s infinite'
                            }} title="Agmarknet Live" />
                        </div>
                        <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: '600' }}>
                            महाराष्ट्र APMC
                        </span>
                    </div>

                    {/* Horizontal Scrollable Crop Cards */}
                    <div style={{
                        display: 'flex',
                        gap: '10px',
                        overflowX: 'auto',
                        paddingBottom: '6px'
                    }}>
                        {mandiRates.map((crop) => {
                            const cropName = language === 'mr' ? crop.name_mr : language === 'hi' ? crop.name_hi : crop.name_en;
                            const isUp = crop.trend === 'up';

                            return (
                                <div
                                    key={crop.commodity_id}
                                    onClick={() => navigate('/chat', { state: { query: `${cropName} चा आजचा बाजारभाव काय आहे आणि कधी विकावे?` } })}
                                    style={{
                                        background: 'white',
                                        border: '1px solid #FFE0B2',
                                        borderRadius: '16px',
                                        padding: '12px 14px',
                                        minWidth: '135px',
                                        flexShrink: 0,
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 8px rgba(230,81,0,0.06)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                                        <span style={{ fontSize: '20px' }}>{crop.icon}</span>
                                        <span style={{
                                            fontSize: '10px',
                                            fontWeight: '800',
                                            padding: '2px 6px',
                                            borderRadius: '8px',
                                            backgroundColor: isUp ? '#E8F5E9' : '#FFEBEE',
                                            color: isUp ? '#2E7D32' : '#C62828',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '2px'
                                        }}>
                                            {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                            {crop.trend_percentage ? `${crop.trend_percentage}%` : (isUp ? 'तेजी' : 'मंदी')}
                                        </span>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '13px', fontWeight: '700', color: '#1F2937', margin: 0, lineHeight: '1.2' }}>
                                            {cropName}
                                        </p>
                                        <p style={{ fontSize: '16px', fontWeight: '900', color: '#E65100', margin: '4px 0 0 0' }}>
                                            ₹{Number(crop.modal_price).toLocaleString('en-IN')}
                                        </p>
                                        <p style={{ fontSize: '10px', color: '#9CA3AF', margin: 0 }}>
                                            प्रति क्विंटल
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* --- SECTION 2: CATEGORY CARDS GRID (Positioned close to suggested questions) --- */}
            <div style={{ padding: '0 20px 24px', marginTop: '8px' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px'
                }}>
                    {/* FARMING CARD - SOFT GREEN TINT */}
                    <CategoryCard
                        title={t?.categories?.farming || "शेती"}
                        subtitle={t?.categorySubtitles?.farming || "पीक, कीड, बाजारभाव, फवारणी सल्ला"}
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
                        title={t?.categories?.education || "शिक्षण"}
                        subtitle={t?.categorySubtitles?.education || "अभ्यास, गृहपाठ, प्रश्न व स्पष्टीकरण"}
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
                                title={t?.categories?.health || "आरोग्य"}
                                subtitle={t?.categorySubtitles?.health || "लक्षणे, प्राथमिक माहिती, आरोग्य सल्ला"}
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
                                title={t?.categories?.schemes || "मदत व योजना"}
                                subtitle={t?.categorySubtitles?.schemes || "दैनंदिन प्रश्न, सरकारी माहिती, इतर मदत"}
                                titleColor="#E65100"
                                cardBg="#FFFDF0"
                                cardBorder="#FEF3C7"
                                badgeBg="#FFF3E0"
                                arrowBg="#FFE0B2"
                                arrowColor="#E65100"
                                icon={<HelpCircle size={26} color="#EF6C00" strokeWidth={2} />}
                                onClick={() => setIsSchemeWizardOpen(true)}
                            />
                        </>
                    )}
                </div>

                {/* TOGGLE BUTTON */}
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

            {/* --- GOVERNMENT SCHEMES ELIGIBILITY WIZARD MODAL --- */}
            <SchemeWizardModal
                isOpen={isSchemeWizardOpen}
                onClose={() => setIsSchemeWizardOpen(false)}
                onAskBandhu={(query) => navigate('/chat', { state: { query } })}
                language={language}
            />

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
        <span style={{ fontSize: '15px' }}>{icon}</span>
        <span>{text}</span>
    </button>
);

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
            minHeight: '135px',
            position: 'relative'
        }}
    >
        <div>
            <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: badgeBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px'
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

const NavItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            padding: '6px 0',
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
