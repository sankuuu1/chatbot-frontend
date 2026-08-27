import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MapPin,
    ChevronDown,
    ChevronRight,
    MessageSquare,
    Info,
    Settings,
    Home,
    Droplets,
    Sprout,
    Sun,
    CloudRain,
    Sparkles
} from 'lucide-react';

const DailyInfoPage = () => {
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const [activeCategory, setActiveCategory] = useState('सर्व');
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    const [infoData, setInfoData] = useState({
        location: "नागपूर, महाराष्ट्र",
        weather: {
            temperature: 28,
            condition: "ढगाळ वातावरण",
            rain_probability: 70,
            unit: "अंश सेल्सिअस",
            time_label: "आज"
        },
        forecast: [
            { day: "आज", high: 31, low: 23, icon: "🌧️" },
            { day: "उद्या", high: 30, low: 23, icon: "🌧️" },
            { day: "गुरु", high: 32, low: 24, icon: "⛅" },
            { day: "शुक्र", high: 30, low: 22, icon: "⛅" }
        ],
        advisory: {
            title: "शेतकऱ्यांसाठी सूचना",
            text: "आज पेरणी किंवा खत देण्यासाठी योग्य दिवस नाही."
        },
        articles: [
            {
                id: "1",
                category: "शेती",
                tag_color: "#E8F5E9",
                tag_text_color: "#2E7D32",
                title: "सोयाबीनच्या बाजारभावात वाढ",
                subtitle: "विदर्भातील बाजारभावात आज बदल",
                time_ago: "२ तासांपूर्वी",
                image_url: "https://images.unsplash.com/photo-1599599810694-b5b37304c041?auto=format&fit=crop&w=300&q=80"
            },
            {
                id: "2",
                category: "शिक्षण",
                tag_color: "#F3E5F5",
                tag_text_color: "#7B1FA2",
                title: "शिष्यवृत्ती अर्ज करण्याची अंतिम तारीख वाढली",
                subtitle: "अर्ज करण्याची नवीन तारीख ३१ जुलै",
                time_ago: "४ तासांपूर्वी",
                image_url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=300&q=80"
            },
            {
                id: "3",
                category: "सरकारी योजना",
                tag_color: "#FFF3E0",
                tag_text_color: "#E65100",
                title: "पीएम किसान योजनेचा १६ वा हप्ता लवकरच",
                subtitle: "लाभार्थ्यांच्या खात्यात थेट जमा",
                time_ago: "६ तासांपूर्वी",
                image_url: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=300&q=80"
            },
            {
                id: "4",
                category: "स्थानिक",
                tag_color: "#E3F2FD",
                tag_text_color: "#1565C0",
                title: "नागपूर विभागात पुढील ३ दिवस मुसळधार पावसाचा इशारा",
                subtitle: "हवामान खात्याचा यलो अलर्ट जारी",
                time_ago: "१ तासापूर्वी",
                image_url: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=300&q=80"
            },
            {
                id: "5",
                category: "रोजगार",
                tag_color: "#EFEBE9",
                tag_text_color: "#4E342E",
                title: "कृषी विभागात ५०० जागांसाठी नोकरभरती जाहीर",
                subtitle: "ऑनलाइन अर्ज प्रक्रिया सुरू",
                time_ago: "५ तासांपूर्वी",
                image_url: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=300&q=80"
            }
        ]
    });

    useEffect(() => {
        const fetchDailyInfo = async () => {
            try {
                const res = await fetch(`${API_URL}/api/daily-info`);
                if (res.ok) {
                    const data = await res.json();
                    setInfoData(data);
                }
            } catch (err) {
                console.error("Failed to fetch daily info:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDailyInfo();
    }, [API_URL]);

    const categories = ['सर्व', 'शेती', 'शिक्षण', 'सरकारी योजना', 'स्थानिक', 'रोजगार'];

    const filteredArticles = activeCategory === 'सर्व'
        ? infoData.articles
        : infoData.articles.filter(item => item.category === activeCategory);

    const handleAskBandhu = (article) => {
        const query = article ? `मला "${article.title}" बद्दल अधिक माहिती सांगा.` : "आजच्या महत्त्वाच्या बातम्या आणि हवामानाबद्दल सांगा.";
        navigate('/chat', { state: { query: query } });
    };

    return (
        <div style={{
            backgroundColor: '#FFFDF9',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            paddingBottom: '100px',
            fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif"
        }}>

            {/* --- TOP HEADER --- */}
            <div style={{ padding: '20px 20px 10px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        आजची <span style={{ color: '#E65100' }}>माहिती</span>
                        <span style={{ fontSize: '24px' }}>☀️</span>
                    </h1>
                    <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px', fontWeight: '500' }}>
                        महत्त्वाची माहिती, तुमच्यासाठी
                    </p>
                </div>

                {/* Location Pill */}
                <button style={{
                    background: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '24px',
                    padding: '8px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#1F2937',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                }}>
                    <MapPin size={15} color="#E65100" />
                    <span>{infoData.location}</span>
                    <ChevronDown size={16} color="#6B7280" />
                </button>
            </div>


            {/* --- WEATHER & ADVISORY CARD --- */}
            <div style={{ padding: '0 20px', marginTop: '10px' }}>
                <div style={{
                    background: 'white',
                    borderRadius: '24px',
                    padding: '20px',
                    border: '1px solid #F3F4F6',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                }}>

                    {/* Main Weather Overview Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '15px', alignItems: 'center', paddingBottom: '16px' }}>

                        {/* Temperature Side */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ fontSize: '42px', lineHeight: '1' }}>⛅</div>
                            <div>
                                <div style={{ fontSize: '36px', fontWeight: '900', color: '#111827', lineHeight: '1' }}>
                                    {infoData.weather.temperature}°
                                </div>
                                <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: '600', marginTop: '4px' }}>
                                    अंश सेल्सिअस
                                </div>
                                <div style={{ fontSize: '12px', color: '#4B5563', fontWeight: '600', marginTop: '2px' }}>
                                    {infoData.weather.condition}
                                </div>
                            </div>
                        </div>

                        {/* Rain Probability Side */}
                        <div style={{
                            borderLeft: '1px solid #F3F4F6',
                            paddingLeft: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: '#FFF3E0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '4px'
                            }}>
                                <Droplets size={20} color="#E65100" />
                            </div>
                            <div style={{ fontSize: '22px', fontWeight: '900', color: '#111827', lineHeight: '1' }}>
                                {infoData.weather.rain_probability}%
                            </div>
                            <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: '600', marginTop: '4px' }}>
                                पावसाची शक्यता
                            </div>
                            <div style={{ fontSize: '10px', color: '#9CA3AF', fontWeight: '600', marginTop: '2px' }}>
                                {infoData.weather.time_label}
                            </div>
                        </div>
                    </div>

                    {/* 4-Day Forecast Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '8px',
                        padding: '12px 0',
                        borderTop: '1px solid #F3F4F6',
                        borderBottom: '1px solid #F3F4F6',
                        margin: '4px 0 14px'
                    }}>
                        {infoData.forecast.map((fc, i) => (
                            <div key={i} style={{
                                textAlign: 'center',
                                background: i === 0 ? '#FFF8F0' : '#F9FAFB',
                                border: i === 0 ? '1px solid #FFE0B2' : '1px solid #F3F4F6',
                                borderRadius: '14px',
                                padding: '8px 4px'
                            }}>
                                <span style={{
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    color: i === 0 ? '#E65100' : '#6B7280',
                                    display: 'block',
                                    marginBottom: '4px'
                                }}>
                                    {fc.day}
                                </span>
                                <span style={{ fontSize: '16px', display: 'block', marginBottom: '2px' }}>{fc.icon}</span>
                                <span style={{ fontSize: '11px', fontWeight: '700', color: '#111827' }}>
                                    {fc.high}° <span style={{ color: '#9CA3AF', fontWeight: '500' }}>/ {fc.low}°</span>
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Farmer Advisory Banner */}
                    <div
                        onClick={() => navigate('/chat', { state: { query: 'शेतकऱ्यांसाठी आजची सूचना काय आहे?' } })}
                        style={{
                            background: '#FFF8F0',
                            border: '1px solid #FFE0B2',
                            borderRadius: '16px',
                            padding: '12px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '50%',
                                background: '#FFF3E0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <Sprout size={20} color="#E65100" />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#E65100', margin: 0 }}>
                                    {infoData.advisory.title}
                                </h4>
                                <p style={{ fontSize: '11px', color: '#4B5563', fontWeight: '600', margin: '2px 0 0' }}>
                                    {infoData.advisory.text}
                                </p>
                            </div>
                        </div>
                        <ChevronRight size={18} color="#E65100" />
                    </div>

                </div>
            </div>


            {/* --- NEWS & SCHEMES SECTION --- */}
            <div style={{ marginTop: '24px' }}>

                {/* Section Header */}
                <div style={{ padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', margin: 0 }}>
                        महत्त्वाच्या बातम्या
                    </h3>
                    <button style={{ background: 'none', border: 'none', color: '#E65100', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                        <span>सर्व बातम्या</span>
                        <ChevronRight size={16} />
                    </button>
                </div>

                {/* Category Filter Chips */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    overflowX: 'auto',
                    padding: '0 20px 14px'
                }}>
                    {categories.map((cat) => {
                        const active = activeCategory === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                style={{
                                    background: active ? '#E65100' : 'white',
                                    color: active ? 'white' : '#4B5563',
                                    border: active ? 'none' : '1px solid #E5E7EB',
                                    borderRadius: '24px',
                                    padding: '8px 18px',
                                    fontSize: '13px',
                                    fontWeight: active ? '700' : '600',
                                    whiteSpace: 'nowrap',
                                    cursor: 'pointer',
                                    boxShadow: active ? '0 3px 10px rgba(230,81,0,0.25)' : '0 1px 3px rgba(0,0,0,0.02)'
                                }}
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>

                {/* News Article Cards List */}
                <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filteredArticles.map((article) => (
                        <div
                            key={article.id}
                            onClick={() => handleAskBandhu(article)}
                            style={{
                                background: 'white',
                                borderRadius: '20px',
                                padding: '16px',
                                border: '1px solid #F3F4F6',
                                display: 'flex',
                                gap: '14px',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                {/* Category Badge Tag */}
                                <span style={{
                                    background: article.tag_color,
                                    color: article.tag_text_color,
                                    fontSize: '10px',
                                    fontWeight: '800',
                                    padding: '3px 9px',
                                    borderRadius: '10px',
                                    display: 'inline-block',
                                    marginBottom: '6px'
                                }}>
                                    {article.category}
                                </span>

                                {/* Title */}
                                <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#111827', lineHeight: '1.3', margin: '0 0 4px' }}>
                                    {article.title}
                                </h4>

                                {/* Subtitle */}
                                <p style={{ fontSize: '11px', color: '#6B7280', fontWeight: '500', margin: '0 0 6px', lineHeight: '1.4' }}>
                                    {article.subtitle}
                                </p>

                                {/* Time Ago */}
                                <span style={{ fontSize: '10px', color: '#9CA3AF', fontWeight: '500' }}>
                                    {article.time_ago}
                                </span>
                            </div>

                            {/* Thumbnail Image */}
                            <div style={{ width: '84px', height: '84px', borderRadius: '16px', overflow: 'hidden', flexShrink: 0 }}>
                                <img
                                    src={article.image_url}
                                    alt={article.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* "Ask Bandhu About This" Action Banner */}
                <div style={{ padding: '16px 20px 0' }}>
                    <button
                        onClick={() => handleAskBandhu(selectedArticle)}
                        style={{
                            width: '100%',
                            background: 'white',
                            border: '1px solid #FFE0B2',
                            borderRadius: '20px',
                            padding: '14px 18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            color: '#E65100',
                            fontWeight: '700',
                            fontSize: '14px',
                            cursor: 'pointer',
                            boxShadow: '0 3px 12px rgba(230,81,0,0.06)'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: '#FFF3E0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <MessageSquare size={18} color="#E65100" />
                            </div>
                            <span>या बातमीबद्दल बंधूला विचारा</span>
                        </div>
                        <ChevronRight size={18} color="#E65100" />
                    </button>
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
                    icon={<MessageSquare size={22} />}
                    label="माझे प्रश्न"
                    onClick={() => navigate('/chat')}
                />
                <NavItem
                    icon={<Info size={22} />}
                    label="आजची माहिती"
                    active
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
        {active ? (
            <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: '#E65100',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 4px 10px rgba(230,81,0,0.3)',
                marginTop: '-12px'
            }}>
                {React.cloneElement(icon, { color: 'white', size: 20 })}
            </div>
        ) : (
            React.cloneElement(icon, { color: '#94A3B8', strokeWidth: 2 })
        )}
        <span style={{
            fontSize: '11px',
            marginTop: active ? '2px' : '4px',
            color: active ? '#E65100' : '#64748B',
            fontWeight: active ? '700' : '500'
        }}>
            {label}
        </span>
    </button>
);

export default DailyInfoPage;
