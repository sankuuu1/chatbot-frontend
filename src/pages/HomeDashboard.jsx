import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Mic,
    BookOpen,
    Tractor,
    Heart,
    HelpCircle,
    Home,
    MessageSquare,
    Settings,
    ArrowRight,
    Sprout
} from 'lucide-react';
import bandhuLogo from '../assets/Gemini_Generated_Image_za4cfxza4cfxza4c-removebg-preview.png';

const HomeDashboard = () => {
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const [userName, setUserName] = useState('संतोष जाधव');

    useEffect(() => {
        fetch(`${API_URL}/api/settings`)
            .then(res => res.json())
            .then(data => {
                if (data && data.name) setUserName(data.name);
            })
            .catch(err => console.log('Could not fetch settings:', err));
    }, [API_URL]);

    const getInitial = (name) => {
        if (!name) return 'सं';
        const trimmed = name.trim();
        return trimmed.length > 1 ? trimmed.slice(0, 2) : trimmed;
    };

    return (
        <div style={{
            backgroundColor: '#FFFBF2',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            paddingBottom: '90px'
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

                {/* Profile Circle Button on Top Right */}
                <button
                    onClick={() => navigate('/settings')}
                    title={`प्रोफाइल: ${userName}`}
                    style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #E65100 0%, #D35400 100%)',
                        border: '2px solid white',
                        boxShadow: '0 3px 10px rgba(211, 84, 0, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '800',
                        fontSize: '16px',
                        cursor: 'pointer',
                        flexShrink: 0
                    }}
                >
                    {getInitial(userName)}
                </button>
            </div>

            {/* --- MAIN GREETING --- */}
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <h1 style={{
                    fontSize: '30px',
                    fontWeight: '900',
                    color: '#1F2937',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                }}>
                    नमस्कार! <span style={{ fontSize: '28px' }}>🙏</span>
                </h1>
                <p style={{
                    color: '#4B5563',
                    marginTop: '6px',
                    fontSize: '16px',
                    fontWeight: '500'
                }}>
                    बोला, बंधू समजून घेईल.
                </p>

                {/* MIC BUTTON WITH GLOW RINGS */}
                <div style={{
                    position: 'relative',
                    height: '140px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '18px 0 10px'
                }}>
                    <div className="ripple-effect ripple-1" style={{ width: '110px', height: '110px' }}></div>
                    <div className="ripple-effect ripple-2" style={{ width: '110px', height: '110px' }}></div>
                    <button
                        onClick={() => navigate('/chat')}
                        style={{
                            width: '94px',
                            height: '94px',
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
                        <Mic size={44} />
                    </button>
                </div>

                <p style={{ fontSize: '13px', color: '#1F2937', fontWeight: '700', marginTop: '4px' }}>
                    बोलण्यासाठी मायकवर टॅप करा
                </p>
            </div>

            {/* --- QUICK SUGGESTION CHIPS --- */}
            <div style={{
                display: 'flex',
                gap: '10px',
                overflowX: 'auto',
                padding: '20px 20px 10px',
                justifyContent: 'flex-start'
            }}>
                <SuggestionChip
                    icon="🌧️"
                    text="आज पाऊस पडेल का?"
                    onClick={() => navigate('/chat', { state: { query: 'आज पाऊस पडेल का?' } })}
                />
                <SuggestionChip
                    icon="🐛"
                    text="कापसावर कीड आली आहे"
                    onClick={() => navigate('/chat', { state: { category: 'farming', query: 'कापसावर कीड आली आहे' } })}
                />
                <SuggestionChip
                    icon="📖"
                    text="७वी गणित समजाव"
                    onClick={() => navigate('/chat', { state: { category: 'education', query: '७वी गणित समजाव' } })}
                />
            </div>


            {/* --- CATEGORIES SECTION --- */}
            <div style={{ padding: '10px 20px 20px' }}>
                <h3 style={{
                    fontSize: '18px',
                    fontWeight: '800',
                    color: '#111827',
                    marginBottom: '14px'
                }}>
                    कशाबद्दल मदत हवी?
                </h3>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px'
                }}>
                    {/* FARMING CARD */}
                    <CategoryCard
                        title="शेती"
                        subtitle="पीक, कीड, बाजारभाव, फवारणी सल्ला"
                        titleColor="#1B5E20"
                        badgeBg="#E8F5E9"
                        arrowBg="#C8E6C9"
                        arrowColor="#1B5E20"
                        icon={<Sprout size={26} color="#2E7D32" />}
                        onClick={() => navigate('/chat', { state: { category: 'farming' } })}
                    />

                    {/* EDUCATION CARD */}
                    <CategoryCard
                        title="शिक्षण"
                        subtitle="अभ्यास, गृहपाठ, प्रश्न व स्पष्टीकरण"
                        titleColor="#0D47A1"
                        badgeBg="#E3F2FD"
                        arrowBg="#BBDEFB"
                        arrowColor="#0D47A1"
                        icon={<BookOpen size={26} color="#1565C0" />}
                        onClick={() => navigate('/chat', { state: { category: 'education' } })}
                    />

                    {/* HEALTH CARD */}
                    <CategoryCard
                        title="आरोग्य"
                        subtitle="लक्षणे, प्राथमिक माहिती, आरोग्य सल्ला"
                        titleColor="#B71C1C"
                        badgeBg="#FFEBEE"
                        arrowBg="#FFCDD2"
                        arrowColor="#B71C1C"
                        icon={<Heart size={26} color="#C62828" />}
                        onClick={() => navigate('/chat', { state: { category: 'health' } })}
                    />

                    {/* HELP CARD */}
                    <CategoryCard
                        title="मदत"
                        subtitle="दैनंदिन प्रश्न, सरकारी माहिती, इतर मदत"
                        titleColor="#E65100"
                        badgeBg="#FFF3E0"
                        arrowBg="#FFE0B2"
                        arrowColor="#E65100"
                        icon={<HelpCircle size={26} color="#EF6C00" />}
                        onClick={() => navigate('/chat', { state: { category: 'help' } })}
                    />
                </div>
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
                padding: '10px 15px',
                borderTop: '1px solid #F3F4F6',
                boxShadow: '0 -4px 15px rgba(0,0,0,0.04)',
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

// Suggestion Chip Component with Emoji Icon
const SuggestionChip = ({ icon, text, onClick }) => (
    <button
        onClick={onClick}
        style={{
            background: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '24px',
            padding: '10px 16px',
            fontSize: '13px',
            fontWeight: '600',
            color: '#374151',
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
const CategoryCard = ({ title, subtitle, titleColor, badgeBg, arrowBg, arrowColor, icon, onClick }) => (
    <div
        onClick={onClick}
        style={{
            background: 'white',
            borderRadius: '20px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
            border: '1px solid #F3F4F6',
            cursor: 'pointer',
            minHeight: '130px',
            position: 'relative'
        }}
    >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: badgeBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
            }}>
                {icon}
            </div>
            <div>
                <h4 style={{ fontSize: '16px', fontWeight: '800', color: titleColor, marginBottom: '4px' }}>
                    {title}
                </h4>
                <p style={{ fontSize: '11px', color: '#6B7280', lineHeight: '1.4', fontWeight: '500' }}>
                    {subtitle}
                </p>
            </div>
        </div>

        {/* Circular Arrow Button at Bottom Right */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: arrowBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: arrowColor
            }}>
                <ArrowRight size={16} />
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
        {React.cloneElement(icon, { color: active ? '#E65100' : '#9CA3AF' })}
        <span style={{
            fontSize: '11px',
            marginTop: '4px',
            color: active ? '#E65100' : '#6B7280',
            fontWeight: active ? '700' : '500'
        }}>
            {label}
        </span>
    </button>
);

export default HomeDashboard;
