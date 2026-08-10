import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Mic,
    Camera,
    BookOpen,
    Home,
    MessageSquare,
    Settings,
    ArrowRight,
    Sprout,
    ChevronDown
} from 'lucide-react';
import bandhuLogo from '../assets/Gemini_Generated_Image_za4cfxza4cfxza4c-removebg-preview.png';

const HomeDashboard = () => {
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState('');

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter' && searchInput.trim()) {
            navigate('/chat', { state: { query: searchInput.trim() } });
        }
    };

    return (
        <div style={{
            backgroundColor: '#FFFDF9',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            paddingBottom: '100px',
            fontFamily: "'Inter', system-ui, sans-serif"
        }}>

            {/* --- TOP HEADER --- */}
            <div style={{
                padding: '16px 20px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                        src={bandhuLogo}
                        alt="Bandhu"
                        style={{ height: '52px', width: 'auto', objectFit: 'contain' }}
                    />
                </div>

                {/* Top Right Language Dropdown Pill */}
                <button
                    onClick={() => navigate('/settings')}
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
                    <span>मराठी</span>
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

                {/* MIC BUTTON WITH CONCENTRIC GLOW RINGS */}
                <div style={{
                    position: 'relative',
                    height: '170px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '10px 0 4px'
                }}>
                    {/* Outer & Inner Soft Glow Rings */}
                    <div style={{
                        position: 'absolute',
                        width: '170px',
                        height: '170px',
                        borderRadius: '50%',
                        background: 'rgba(255, 237, 224, 0.65)',
                        zIndex: 1
                    }}></div>
                    <div style={{
                        position: 'absolute',
                        width: '135px',
                        height: '135px',
                        borderRadius: '50%',
                        background: 'rgba(255, 218, 185, 0.55)',
                        zIndex: 2
                    }}></div>

                    <button
                        onClick={() => navigate('/chat')}
                        style={{
                            width: '90px',
                            height: '90px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #FF6F00 0%, #E65100 100%)',
                            border: '4px solid white',
                            boxShadow: '0 8px 24px rgba(230,81,0,0.35)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10,
                            cursor: 'pointer',
                            transition: 'transform 0.15s ease'
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
                            background: 'transparent'
                        }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                        <button
                            onClick={() => alert("कॅमेरा वैशिष्ट्य लवकरच येत आहे!")}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E65100', padding: 0 }}
                        >
                            <Camera size={20} />
                        </button>
                        <div style={{ height: '18px', width: '1px', background: '#E5E7EB' }}></div>
                        <button
                            onClick={() => navigate('/chat')}
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
                        badgeBg="#E3F2FD"
                        arrowBg="#BBDEFB"
                        arrowColor="#0D47A1"
                        icon={<BookOpen size={26} color="#1565C0" strokeWidth={2} />}
                        onClick={() => navigate('/chat', { state: { category: 'education' } })}
                    />
                </div>

                {/* "सर्व विषय पाहा →" FULL-WIDTH BUTTON */}
                <button
                    onClick={() => navigate('/chat')}
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
                    <span>सर्व विषय पाहा</span>
                    <ArrowRight size={18} />
                </button>
            </div>


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
                    icon={<MessageSquare size={22} />}
                    label="माझे प्रश्न"
                    onClick={() => navigate('/chat')}
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
            padding: '10px 16px',
            fontSize: '13px',
            fontWeight: '600',
            color: '#1E293B',
            whiteSpace: 'nowrap',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
        }}
    >
        <span style={{ fontSize: '15px' }}>{icon}</span>
        <span>{text}</span>
    </button>
);

// Modern Category Card Component matching exact design
const CategoryCard = ({ title, subtitle, titleColor, cardBg, badgeBg, arrowBg, arrowColor, icon, onClick }) => (
    <div
        onClick={onClick}
        style={{
            background: cardBg || 'white',
            borderRadius: '24px',
            padding: '18px 16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '1px solid #EAF0EA',
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
