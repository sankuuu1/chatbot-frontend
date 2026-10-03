import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bgLogin from '../assets/bg-login.png';
import { AlertCircle } from 'lucide-react';
import bandhuLogo from '../assets/Gemini_Generated_Image_za4cfxza4cfxza4c-removebg-preview.png';
import { useAuth } from '../context/AuthContext';
import { updateUserPhoneNumber } from '../services/firebase';

const LoginFlow = ({ step }) => {
    const navigate = useNavigate();
    const { user, login } = useAuth();
    const [mobileNumber, setMobileNumber] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);
    const [authError, setAuthError] = useState('');
    const [googleSuccessInfo, setGoogleSuccessInfo] = useState(null);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    // Handle OTP input changes
    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return;
        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Focus next input
        if (element.nextSibling && element.value) {
            element.nextSibling.focus();
        }
    };

    const handleLoginSubmit = () => {
        if (mobileNumber.length >= 10) {
            navigate('/otp');
        } else {
            alert("कृपया वैध १० अंकी मोबाईल नंबर टाका");
        }
    };

    const handleOtpSubmit = () => {
        if (user?.uid && mobileNumber) {
            updateUserPhoneNumber(user.uid, mobileNumber);
        }
        navigate('/success');
    };

    // Handle Google Sign-In: Authenticates user, but keeps on phone screen to require phone number
    const handleGoogleLogin = async () => {
        setAuthError('');
        setIsGoogleLoading(true);
        const res = await login();
        setIsGoogleLoading(false);
        if (res.success && res.user) {
            setGoogleSuccessInfo({
                name: res.user.displayName || 'वापरकर्ता',
                email: res.user.email
            });
            // Keep on mobile number screen to capture phone number as required
        } else if (!res.success) {
            setAuthError(res.error || 'Google लॉगिन अयशस्वी झाले.');
        }
    };

    useEffect(() => {
        if (step === 'success') {
            const timer = setTimeout(() => {
                navigate('/home');
            }, 1800);
            return () => clearTimeout(timer);
        }
    }, [step, navigate]);

    return (
        <div className="login-flow" style={{
            backgroundImage: `url(${bgLogin})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            paddingBottom: '20px'
        }}>
            <div className="content-overlay" style={{
                background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.95) 75%, rgba(255,255,255,0.7) 100%)',
                padding: '24px',
                paddingTop: '36px',
                borderTopLeftRadius: '30px',
                borderTopRightRadius: '30px',
                minHeight: '55vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 -10px 25px rgba(0,0,0,0.08)'
            }}>

                {/* Header Badge */}
                <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                    <span style={{
                        backgroundColor: 'white',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: '700',
                        color: '#15803D',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                        border: '1px solid #DCFCE7'
                    }}>
                        ग्रामीण भारतासाठी बनवलेले 🇮🇳
                    </span>
                </div>

                {authError && (
                    <div style={{
                        background: '#FEF2F2',
                        border: '1px solid #FCA5A5',
                        borderRadius: '12px',
                        padding: '10px 14px',
                        marginBottom: '14px',
                        fontSize: '13px',
                        color: '#B91C1C',
                        width: '100%',
                        maxWidth: '380px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <AlertCircle size={18} style={{ flexShrink: 0 }} />
                        <span>{authError}</span>
                    </div>
                )}

                {googleSuccessInfo && (
                    <div style={{
                        background: '#F0FDF4',
                        border: '1px solid #86EFAC',
                        borderRadius: '12px',
                        padding: '10px 14px',
                        marginBottom: '14px',
                        fontSize: '13px',
                        color: '#166534',
                        width: '100%',
                        maxWidth: '380px',
                        textAlign: 'center',
                        fontWeight: '600'
                    }}>
                        ✅ Google ईमेल जोडला ({googleSuccessInfo.email}). कृपया सुरू ठेवण्यासाठी मोबाईल नंबर टाका.
                    </div>
                )}

                {step === 'login' && (
                    <div className="w-full flex-col flex items-center ani-fade-in" style={{ width: '100%', maxWidth: '380px' }}>
                        <h1 style={{ fontSize: '30px', fontWeight: '900', color: '#111827', margin: 0, marginBottom: '6px' }}>नमस्कार! 🙏</h1>
                        <p style={{ color: '#4B5563', marginBottom: '24px', fontSize: '15px', fontWeight: '500' }}>तुमचा विश्वासू शेती व शिक्षण मित्र.</p>

                        {/* MOBILE NUMBER INPUT */}
                        <div style={{ width: '100%', marginBottom: '16px' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                background: 'white',
                                borderRadius: '16px',
                                border: '1.5px solid #E5E7EB',
                                overflow: 'hidden',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                            }}>
                                <div style={{
                                    padding: '12px 14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    borderRight: '1px solid #E5E7EB',
                                    color: '#374151',
                                    fontSize: '13px',
                                    fontWeight: '700',
                                    whiteSpace: 'nowrap',
                                    background: '#F9FAFB',
                                    flexShrink: 0
                                }}>
                                    <span>🇮🇳</span>
                                    <span>+91</span>
                                </div>
                                <input
                                    type="tel"
                                    placeholder="१० अंकी मोबाईल नंबर"
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value)}
                                    style={{
                                        border: 'none',
                                        outline: 'none',
                                        padding: '12px 16px',
                                        width: '100%',
                                        fontSize: '15px',
                                        color: '#1F2937',
                                        background: 'transparent',
                                        fontFamily: 'inherit'
                                    }}
                                    maxLength={10}
                                />
                            </div>
                        </div>

                        {/* PRIMARY OTP SUBMIT BUTTON */}
                        <button
                            onClick={handleLoginSubmit}
                            style={{
                                width: '100%',
                                background: 'linear-gradient(135deg, #FF6F00 0%, #E65100 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '16px',
                                padding: '14px',
                                fontSize: '16px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(230,81,0,0.25)',
                                marginBottom: '16px'
                            }}
                        >
                            OTP पाठवा
                        </button>

                        {/* GOOGLE SIGN-IN BOTTOM SUBTLE LINK */}
                        <button
                            onClick={handleGoogleLogin}
                            disabled={isGoogleLoading}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#E65100',
                                fontSize: '14px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '6px 12px'
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                            </svg>
                            <span>{isGoogleLoading ? 'लॉगिन होत आहे...' : 'Google ने लॉगिन करा'}</span>
                        </button>

                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0 }}>नागपूरमध्ये प्रेमाने बनवलेले ❤️</p>
                        </div>
                    </div>
                )}

                {step === 'otp' && (
                    <div className="w-full flex-col flex items-center ani-fade-in" style={{ width: '100%', maxWidth: '380px' }}>
                        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: '#111827' }}>OTP सत्यापन</h1>
                        <p style={{ color: '#4B5563', marginBottom: '24px', fontSize: '14px' }}>तुमच्या नंबरवर पाठवलेला ४ अंकी कोड टाका:</p>

                        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    value={data}
                                    onChange={e => handleOtpChange(e.target, index)}
                                    onFocus={e => e.target.select()}
                                    style={{
                                        width: '54px',
                                        height: '54px',
                                        borderRadius: '16px',
                                        border: '1.5px solid #E5E7EB',
                                        background: 'white',
                                        textAlign: 'center',
                                        fontSize: '22px',
                                        fontWeight: 'bold',
                                        color: '#111827',
                                        outline: 'none',
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                                    }}
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleOtpSubmit}
                            style={{
                                width: '100%',
                                background: 'linear-gradient(135deg, #FF6F00 0%, #E65100 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '16px',
                                padding: '14px',
                                fontSize: '16px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(230,81,0,0.25)',
                                marginBottom: '14px'
                            }}
                        >
                            सत्यापित करा व पुढे जा
                        </button>

                        <button
                            onClick={() => navigate('/login')}
                            style={{ background: 'transparent', border: 'none', color: '#6B7280', fontSize: '13px', cursor: 'pointer' }}
                        >
                            ← नंबर बदला
                        </button>
                    </div>
                )}

                {step === 'success' && (
                    <div className="w-full flex-col flex items-center justify-center ani-text-enter" style={{ height: '100%', padding: '20px 0' }}>
                        <div style={{ position: 'relative', width: '160px', height: '160px', marginBottom: '8px' }}>
                            <img
                                src={bandhuLogo}
                                alt="Bandhu Text"
                                className="ani-text-enter"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                    clipPath: 'inset(35% 0 0 0)'
                                }}
                            />
                            <img
                                src={bandhuLogo}
                                alt="Bandhu Mic"
                                className="ani-mic-drop"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                    clipPath: 'inset(0 0 60% 0)'
                                }}
                            />
                        </div>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1B5E20', margin: 0 }}>स्वागत आहे!</h2>
                        <p style={{ fontSize: '14px', color: '#4B5563', marginTop: '6px' }}>बंधू ॲपमध्ये आपले स्वागत आहे...</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default LoginFlow;
