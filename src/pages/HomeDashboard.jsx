import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Mic,
    BookOpen,
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
            backgroundColor: '#FFFDF7',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            paddingBottom: '90px',
            fontFamily: "'Inter', system-ui, sans-serif"
        }}>

            {/* --- TOP HEADER --- */}
            <div style={{
                padding: '18px 22px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                        src={bandhuLogo}
                        alt="Bandhu"
                        style={{ height: '48px', width: 'auto', objectFit: 'contain' }}
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
                        background: '#D84315',
                        border: '2px solid white',
                        boxShadow: '0 4px 12px rgba(216, 67, 21, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '800',
                        fontSize: '17px',
                        cursor: 'pointer',
                        flexShrink: 0
                    }}
                >
                    {getInitial(userName)}
                </button>
            </div>

            {/* --- MAIN GREETING --- */}
            <div style={{ textAlign: 'center', marginTop: '12px' }}>
                <h1 style={{
                    fontSize: '32px',
                    fontWeight: '800',
                    color: '#111827',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    margin: 0
                }}>
                    नमस्कार! <span style={{ fontSize: '30px' }}>🙏</span>
                </h1>
                <p style={{
                    color: '#4B5563',
                    marginTop: '6px',
                    fontSize: '16px',
                    fontWeight: '500'
                }}>
                    बोला, बंधू समजून घेईल.
                </p>

                {/* MIC BUTTON WITH CONCENTRIC GLOW RINGS */}
                <div style={{
                    position: 'relative',
                    height: '180px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '12px 0 6px'
                }}>
                    {/* Concentric Soft Background Rings matching mockup */}
                    <div style={{
                        position: 'absolute',
                        width: '180px',
                        height: '180px',
                        borderRadius: '50%',
                        background: 'rgba(255, 235, 218, 0.65)',
                        zIndex: 1
                    }}></div>
                    <div style={{
                        position: 'absolute',
                        width: '140px',
                        height: '140px',
                        borderRadius: '50%',
                        background: 'rgba(255, 210, 170, 0.55)',
                        zIndex: 2
                    }}></div>

                    <button
                        onClick={() => navigate('/chat')}
                        style={{
                            width: '92px',
                            height: '92px',
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
                        <Mic size={42} strokeWidth={2.2} />
                    </button>
                </div>

                <p style={{ fontSize: '14px', color: '#1F2937', fontWeight: '700', marginTop: '2px' }}>
                    बोलण्यासाठी मायकवर टॅप करा
                </p>
            </div>

            {/* --- QUICK SUGGESTION CHIPS --- */}
            <div style={{
                display: 'flex',
                gap: '12px',
                overflowX: 'auto',
                padding: '24px 20px 12px',
                justifyContent: 'center'
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
            </div>


            {/* --- CATEGORIES SECTION --- */}
            <div style={{ padding: '12px 20px 20px' }}>
                <h3 style={{
                    fontSize: '20px',
                    fontWeight: '800',
                    color: '#0F172A',
                    marginBottom: '16px'
                }}>
                    कशाबद्दल मदत हवी?
                </h3>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '14px'
                }}>
                    {/* FARMING CARD */}
                    <CategoryCard
                        title="शेती"
                        subtitle="पीक, कीड, बाजारभाव, फवारणी सल्ला"
                        titleColor="#1B5E20"
                        badgeBg="#E8F5E9"
                        arrowBg="#C8E6C9"
                        arrowColor="#1B5E20"
                        icon={<Sprout size={28} color="#2E7D32" strokeWidth={2} />}
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
                        icon={<BookOpen size={28} color="#1565C0" strokeWidth={2} />}
                        onClick={() => navigate('/chat', { state: { category: 'education' } })}
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
                padding: '10px 15px 12px',
                borderTop: '1px solid #F1F5F9',
                boxShadow: '0 -4px 15px rgba(0,0,0,0.03)',
                zIndex: 30
            }}>
                <NavItem
                    icon={<Home size={24} />}
                    label="मुख्य"
                    active
                    onClick={() => navigate('/home')}
                />
                <NavItem
                    icon={<MessageSquare size={24} />}
                    label="माझे प्रश्न"
                    onClick={() => navigate('/chat')}
                />
                <NavItem
                    icon={<Settings size={24} />}
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
            border: '1px solid #E2E8F0',
            borderRadius: '30px',
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: '700',
            color: '#1E293B',
            whiteSpace: 'nowrap',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}
    >
        <span style={{ fontSize: '16px' }}>{icon}</span>
        <span>{text}</span>
    </button>
);

// Modern Category Card Component matching exact design
const CategoryCard = ({ title, subtitle, titleColor, badgeBg, arrowBg, arrowColor, icon, onClick }) => (
    <div
        onClick={onClick}
        style={{
            background: 'white',
            borderRadius: '24px',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            border: '1px solid #F1F5F9',
            cursor: 'pointer',
            minHeight: '140px',
            position: 'relative'
        }}
    >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{
                width: '50px',
                height: '50px',
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
                <h4 style={{ fontSize: '18px', fontWeight: '800', color: titleColor, marginBottom: '4px' }}>
                    {title}
                </h4>
                <p style={{ fontSize: '11px', color: '#64748B', lineHeight: '1.4', fontWeight: '500' }}>
                    {subtitle}
                </p>
            </div>
        </div>

        {/* Circular Arrow Button at Bottom Right */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
            <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: arrowBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: arrowColor
            }}>
                <ArrowRight size={18} strokeWidth={2.2} />
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
