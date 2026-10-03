import React, { useState } from 'react';
import {
    X,
    Check,
    ChevronRight,
    ArrowLeft,
    FileText,
    ExternalLink,
    MessageSquare,
    Sparkles,
    Shield,
    Users,
    GraduationCap,
    Heart,
    Sprout,
    HelpCircle
} from 'lucide-react';
import { checkSchemeEligibility } from '../services/api';

const SchemeWizardModal = ({ isOpen, onClose, onAskBandhu, language = 'mr' }) => {
    const [step, setStep] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('farmer');
    const [landAcres, setLandAcres] = useState(2.0);
    const [hasWater, setHasWater] = useState(true);
    const [incomeRange, setIncomeRange] = useState(200000);
    const [studentLevel, setStudentLevel] = useState('degree');
    const [loading, setLoading] = useState(false);
    const [eligibleSchemes, setEligibleSchemes] = useState([]);
    const [expandedSchemeId, setExpandedSchemeId] = useState(null);

    if (!isOpen) return null;

    const handleRunCheck = async () => {
        setLoading(true);
        try {
            const profile = {
                category: selectedCategory,
                land_acres: landAcres,
                has_water_source: hasWater,
                income: incomeRange,
                student_level: studentLevel
            };
            const result = await checkSchemeEligibility(profile);
            if (result?.eligible_schemes) {
                setEligibleSchemes(result.eligible_schemes);
            }
            setStep(3);
        } catch (e) {
            console.error('Eligibility check error:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setStep(1);
        setEligibleSchemes([]);
        setExpandedSchemeId(null);
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 110,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif"
        }}>
            <div style={{
                background: '#FFFDF9',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '440px',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                overflow: 'hidden',
                animation: 'fadeIn 0.2s ease-out'
            }}>
                {/* Header */}
                <div style={{
                    padding: '16px 20px',
                    background: 'linear-gradient(135deg, #FF6F00 0%, #E65100 100%)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {step > 1 && (
                            <button
                                onClick={() => setStep(step - 1)}
                                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
                            >
                                <ArrowLeft size={16} />
                            </button>
                        )}
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0 }}>
                                🏛️ {language === 'mr' ? 'सरकारी योजना पात्रता शोधक' : language === 'hi' ? 'सरकारी योजना पात्रता खोजक' : 'Govt Scheme Eligibility Wizard'}
                            </h3>
                            <p style={{ fontSize: '11px', opacity: 0.9, margin: 0 }}>
                                MyScheme & MahaDBT मार्गदर्शक
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Progress Dots */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '12px 20px 0' }}>
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            style={{
                                width: s === step ? '24px' : '8px',
                                height: '6px',
                                borderRadius: '4px',
                                backgroundColor: s <= step ? '#E65100' : '#E5E7EB',
                                transition: 'all 0.2s ease'
                            }}
                        />
                    ))}
                </div>

                {/* Body Content */}
                <div style={{ padding: '16px 20px 20px', overflowY: 'auto', flex: 1 }}>
                    
                    {/* --- STEP 1: CATEGORY SELECTION --- */}
                    {step === 1 && (
                        <div>
                            <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#111827', margin: '0 0 6px 0' }}>
                                {language === 'mr' ? '१. तुम्ही कोण आहात?' : language === 'hi' ? '१. आप कौन हैं?' : '1. Who are you?'}
                            </h4>
                            <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 16px 0' }}>
                                {language === 'mr' ? 'तुमच्या प्रवर्गातील शासकीय योजना शोधण्यासाठी पर्याय निवडा:' : 'Select category to find relevant welfare schemes:'}
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {[
                                    { id: 'farmer', icon: '👨‍🌾', title_mr: 'शेतकरी (Farmer)', desc_mr: 'पीएम किसान, सौर पंप, पीक विमा, अवजारे' },
                                    { id: 'student', icon: '🎓', title_mr: 'विद्यार्थी (Student)', desc_mr: 'शिष्यवृत्ती, वसतिगृह भत्ता, शिक्षण शुल्क माफी' },
                                    { id: 'women', icon: '👩', title_mr: 'महिला (Women)', desc_mr: 'लाडकी बहीण योजना, स्वयंरोजगार, पोषण मदत' },
                                    { id: 'health', icon: '🏥', title_mr: 'आरोग्य / सर्व नागरिक (Health)', desc_mr: 'आयुष्मान भारत, महात्मा फुले जन आरोग्य योजना' },
                                ].map((cat) => (
                                    <div
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        style={{
                                            border: selectedCategory === cat.id ? '2px solid #E65100' : '1px solid #E5E7EB',
                                            background: selectedCategory === cat.id ? '#FFF8F0' : 'white',
                                            borderRadius: '16px',
                                            padding: '14px 16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            cursor: 'pointer',
                                            transition: 'all 0.15s ease'
                                        }}
                                    >
                                        <span style={{ fontSize: '24px' }}>{cat.icon}</span>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '14px', fontWeight: '800', color: selectedCategory === cat.id ? '#E65100' : '#111827', margin: 0 }}>
                                                {cat.title_mr}
                                            </p>
                                            <p style={{ fontSize: '11px', color: '#6B7280', margin: '2px 0 0 0' }}>
                                                {cat.desc_mr}
                                            </p>
                                        </div>
                                        {selectedCategory === cat.id && <Check size={18} color="#E65100" />}
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                style={{
                                    width: '100%',
                                    marginTop: '20px',
                                    background: '#E65100',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '16px',
                                    padding: '14px',
                                    fontSize: '15px',
                                    fontWeight: '800',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    cursor: 'pointer'
                                }}
                            >
                                <span>{language === 'mr' ? 'पुढील पायरी' : 'Next Step'}</span>
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}

                    {/* --- STEP 2: PROFILE DETAILS --- */}
                    {step === 2 && (
                        <div>
                            <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#111827', margin: '0 0 6px 0' }}>
                                {language === 'mr' ? '२. तुमची माहिती भरा' : '2. Fill Details'}
                            </h4>
                            <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 16px 0' }}>
                                {language === 'mr' ? 'अचूक योजना तपासण्यासाठी खालील पर्याय निवडा:' : 'Select details for exact eligibility matching:'}
                            </p>

                            {/* Farmer specific fields */}
                            {selectedCategory === 'farmer' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    <div>
                                        <label style={{ fontSize: '13px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '8px' }}>
                                            🌱 शेतजमीन क्षेत्र (Land Holding):
                                        </label>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                                            {[
                                                { label: '< २ एकर (अल्पभूधारक)', val: 1.5 },
                                                { label: '२ ते ५ एकर', val: 3.5 },
                                                { label: '> ५ एकर', val: 7.0 }
                                            ].map((opt) => (
                                                <button
                                                    key={opt.val}
                                                    onClick={() => setLandAcres(opt.val)}
                                                    style={{
                                                        padding: '10px 6px',
                                                        borderRadius: '12px',
                                                        border: landAcres === opt.val ? '2px solid #E65100' : '1px solid #E5E7EB',
                                                        background: landAcres === opt.val ? '#FFF8F0' : 'white',
                                                        color: landAcres === opt.val ? '#E65100' : '#4B5563',
                                                        fontSize: '11px',
                                                        fontWeight: '700',
                                                        cursor: 'pointer',
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ fontSize: '13px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '8px' }}>
                                            💧 पाण्याचा स्त्रोत (Water Source for Solar Pump):
                                        </label>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                            <button
                                                onClick={() => setHasWater(true)}
                                                style={{
                                                    padding: '10px',
                                                    borderRadius: '12px',
                                                    border: hasWater ? '2px solid #E65100' : '1px solid #E5E7EB',
                                                    background: hasWater ? '#FFF8F0' : 'white',
                                                    color: hasWater ? '#E65100' : '#4B5563',
                                                    fontSize: '12px',
                                                    fontWeight: '700',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                विहीर / बोअरवेल आहे ✅
                                            </button>
                                            <button
                                                onClick={() => setHasWater(false)}
                                                style={{
                                                    padding: '10px',
                                                    borderRadius: '12px',
                                                    border: !hasWater ? '2px solid #E65100' : '1px solid #E5E7EB',
                                                    background: !hasWater ? '#FFF8F0' : 'white',
                                                    color: !hasWater ? '#E65100' : '#4B5563',
                                                    fontSize: '12px',
                                                    fontWeight: '700',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                पाण्याचा स्त्रोत नाही ❌
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Student specific fields */}
                            {selectedCategory === 'student' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    <div>
                                        <label style={{ fontSize: '13px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '8px' }}>
                                            🎓 शिक्षणाचा प्रकार:
                                        </label>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                            {[
                                                { id: 'degree', label: 'पदवी / Engineering / Medical' },
                                                { id: 'diploma', label: '१०वी/१२वी नंतर Diploma/ITI' }
                                            ].map((lvl) => (
                                                <button
                                                    key={lvl.id}
                                                    onClick={() => setStudentLevel(lvl.id)}
                                                    style={{
                                                        padding: '10px',
                                                        borderRadius: '12px',
                                                        border: studentLevel === lvl.id ? '2px solid #E65100' : '1px solid #E5E7EB',
                                                        background: studentLevel === lvl.id ? '#FFF8F0' : 'white',
                                                        color: studentLevel === lvl.id ? '#E65100' : '#4B5563',
                                                        fontSize: '11px',
                                                        fontWeight: '700',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {lvl.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Income field */}
                            <div style={{ marginTop: '14px' }}>
                                <label style={{ fontSize: '13px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '8px' }}>
                                    💰 कुटुंबाचे वार्षिक उत्पन्न (Family Income):
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                    {[
                                        { label: '< ₹२.५ लाख', val: 180000 },
                                        { label: '< ₹८ लाख (EBC/OBC)', val: 500000 }
                                    ].map((inc) => (
                                        <button
                                            key={inc.val}
                                            onClick={() => setIncomeRange(inc.val)}
                                            style={{
                                                padding: '10px',
                                                borderRadius: '12px',
                                                border: incomeRange === inc.val ? '2px solid #E65100' : '1px solid #E5E7EB',
                                                background: incomeRange === inc.val ? '#FFF8F0' : 'white',
                                                color: incomeRange === inc.val ? '#E65100' : '#4B5563',
                                                fontSize: '12px',
                                                fontWeight: '700',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {inc.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleRunCheck}
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    marginTop: '22px',
                                    background: 'linear-gradient(135deg, #FF6F00 0%, #E65100 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '16px',
                                    padding: '14px',
                                    fontSize: '15px',
                                    fontWeight: '800',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 15px rgba(230,81,0,0.3)'
                                }}
                            >
                                <Sparkles size={18} />
                                <span>{loading ? 'योजना शोधत आहे...' : (language === 'mr' ? 'पात्र योजना शोधा' : 'Find Eligible Schemes')}</span>
                            </button>
                        </div>
                    )}

                    {/* --- STEP 3: ELIGIBLE SCHEMES RESULTS --- */}
                    {step === 3 && (
                        <div>
                            <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                                <span style={{
                                    background: '#E8F5E9',
                                    color: '#2E7D32',
                                    fontSize: '12px',
                                    fontWeight: '800',
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    display: 'inline-block',
                                    marginBottom: '6px'
                                }}>
                                    ✅ {eligibleSchemes.length} योजना सापडल्या
                                </span>
                                <h4 style={{ fontSize: '17px', fontWeight: '900', color: '#111827', margin: 0 }}>
                                    {language === 'mr' ? 'तुमच्यासाठी पात्र शासकीय योजना' : 'Eligible Government Schemes'}
                                </h4>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {eligibleSchemes.map((scheme) => {
                                    const isExpanded = expandedSchemeId === scheme.id;
                                    const schemeName = language === 'mr' ? scheme.name_mr : language === 'hi' ? scheme.name_hi : scheme.name_en;

                                    return (
                                        <div
                                            key={scheme.id}
                                            style={{
                                                background: 'white',
                                                border: '1px solid #FFE0B2',
                                                borderRadius: '18px',
                                                padding: '14px 16px',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                                            }}
                                        >
                                            {/* Top Tag & Benefit */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                                <span style={{
                                                    background: scheme.badge_color || '#FFF3E0',
                                                    color: scheme.badge_text_color || '#E65100',
                                                    fontSize: '11px',
                                                    fontWeight: '800',
                                                    padding: '2px 8px',
                                                    borderRadius: '8px'
                                                }}>
                                                    {scheme.tag}
                                                </span>
                                                <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: '600' }}>
                                                    {scheme.portal_name}
                                                </span>
                                            </div>

                                            <h5 style={{ fontSize: '14px', fontWeight: '800', color: '#111827', margin: '0 0 4px 0', lineHeight: '1.3' }}>
                                                {schemeName}
                                            </h5>
                                            <p style={{ fontSize: '13px', fontWeight: '700', color: '#E65100', margin: '0 0 6px 0' }}>
                                                💰 {scheme.benefit_amount}
                                            </p>
                                            <p style={{ fontSize: '12px', color: '#4B5563', margin: '0 0 10px 0', lineHeight: '1.4' }}>
                                                {scheme.benefit_summary_mr}
                                            </p>

                                            {/* Expand Documents Checklist */}
                                            {isExpanded && (
                                                <div style={{
                                                    background: '#F9FAFB',
                                                    border: '1px solid #E5E7EB',
                                                    borderRadius: '12px',
                                                    padding: '10px 12px',
                                                    marginBottom: '10px'
                                                }}>
                                                    <p style={{ fontSize: '12px', fontWeight: '800', color: '#111827', margin: '0 0 6px 0' }}>
                                                        📄 लागणारी कागदपत्रे (Required Documents):
                                                    </p>
                                                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '11px', color: '#4B5563', lineHeight: '1.6' }}>
                                                        {scheme.documents.map((doc, dIdx) => (
                                                            <li key={dIdx}>{doc}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                                                <button
                                                    onClick={() => setExpandedSchemeId(isExpanded ? null : scheme.id)}
                                                    style={{
                                                        background: '#F3F4F6',
                                                        border: 'none',
                                                        borderRadius: '10px',
                                                        padding: '6px 10px',
                                                        fontSize: '11px',
                                                        fontWeight: '700',
                                                        color: '#374151',
                                                        cursor: 'pointer',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}
                                                >
                                                    <FileText size={12} />
                                                    <span>{isExpanded ? 'कागदपत्रे लपवा' : 'कागदपत्रे पाहा'}</span>
                                                </button>

                                                {scheme.apply_url && (
                                                    <a
                                                        href={scheme.apply_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            background: '#E8F5E9',
                                                            border: 'none',
                                                            borderRadius: '10px',
                                                            padding: '6px 10px',
                                                            fontSize: '11px',
                                                            fontWeight: '700',
                                                            color: '#2E7D32',
                                                            textDecoration: 'none',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '4px'
                                                        }}
                                                    >
                                                        <ExternalLink size={12} />
                                                        <span>अर्ज करा</span>
                                                    </a>
                                                )}

                                                <button
                                                    onClick={() => {
                                                        onClose();
                                                        onAskBandhu(`${schemeName} बद्दल सविस्तर माहिती आणि अर्ज कसा करावा?`);
                                                    }}
                                                    style={{
                                                        background: '#FFF3E0',
                                                        border: 'none',
                                                        borderRadius: '10px',
                                                        padding: '6px 10px',
                                                        fontSize: '11px',
                                                        fontWeight: '700',
                                                        color: '#E65100',
                                                        cursor: 'pointer',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        marginLeft: 'auto'
                                                    }}
                                                >
                                                    <MessageSquare size={12} />
                                                    <span>बंधूला विचारा</span>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <button
                                onClick={handleReset}
                                style={{
                                    width: '100%',
                                    marginTop: '16px',
                                    background: '#F3F4F6',
                                    color: '#4B5563',
                                    border: 'none',
                                    borderRadius: '14px',
                                    padding: '10px',
                                    fontSize: '13px',
                                    fontWeight: '700',
                                    cursor: 'pointer'
                                }}
                            >
                                🔄 पुन्हा तपासा (Check Again)
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default SchemeWizardModal;
