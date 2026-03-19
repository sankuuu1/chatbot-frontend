import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bgLogin from '../assets/bg-login.png';
import { ArrowRight, Mic } from 'lucide-react';
import bandhuLogo from '../assets/Gemini_Generated_Image_za4cfxza4cfxza4c-removebg-preview.png';

const LoginFlow = ({ step }) => {
    const navigate = useNavigate();
    const [mobileNumber, setMobileNumber] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);

    // Handle OTA input changes
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
            alert("Please enter a valid number");
        }
    };

    const handleOtpSubmit = () => {
        // Mock verification
        navigate('/success');
    };

    useEffect(() => {
        if (step === 'success') {
            const timer = setTimeout(() => {
                navigate('/home');
            }, 2000);
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
            paddingBottom: '40px'
        }}>
            <div className="content-overlay" style={{
                background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 60%, rgba(255,255,255,0) 100%)',
                padding: '24px',
                paddingTop: '60px',
                borderTopLeftRadius: '30px',
                borderTopRightRadius: '30px',
                minHeight: '50vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>

                {/* Header - Always visible in flow */}
                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <span style={{
                        backgroundColor: 'white',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }}>
                        ग्रामीण भारतासाठी बनवलेले 🇮🇳
                    </span>
                </div>

                {step === 'login' && (
                    <div className="w-full flex-col flex items-center ani-fade-in">
                        <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '10px' }}>नमस्कार!</h1>
                        <p style={{ color: '#666', marginBottom: '30px' }}>तुमचा मित्र आणि सल्लागार.</p>

                        <div className="w-full" style={{ marginBottom: '20px' }}>
                            <label style={{ fontSize: '14px', fontWeight: '600', color: '#444', marginBottom: '8px', display: 'block' }}>OTP पाठवण्यासाठी</label>
                            <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: '12px', border: '1px solid #ddd', padding: '5px' }}>
                                <div style={{ padding: '0 15px', display: 'flex', alignItems: 'center', borderRight: '1px solid #eee' }}>
                                    🇮🇳 <span style={{ fontWeight: 'bold', marginLeft: '5px' }}>+91</span>
                                </div>
                                <input
                                    type="tel"
                                    className="input-field"
                                    placeholder="१० अंकी मोबाईल नंबर"
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value)}
                                    style={{ border: 'none', boxShadow: 'none' }}
                                    maxLength={10}
                                />
                            </div>
                        </div>

                        <button className="btn-primary" onClick={handleLoginSubmit} style={{ marginBottom: '20px' }}>
                            OTP पाठवा
                        </button>

                        <div style={{ textAlign: 'center' }}>
                            <p style={{ color: '#888', fontSize: '14px', marginBottom: '8px' }}>लॉगिन न करता वापरा</p>
                        </div>

                        <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                            <p style={{ fontSize: '10px', color: '#ccc' }}>नागपूरमध्ये प्रेमाने बनवलेले ❤️</p>
                        </div>
                    </div>
                )}

                {step === 'otp' && (
                    <div className="w-full flex-col flex items-center ani-fade-in">
                        <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '10px' }}>नमस्कार!</h1>
                        <p style={{ color: '#666', marginBottom: '30px' }}>तुमचा मित्र आणि सल्लागार.</p>
                        <p style={{ marginBottom: '20px', fontSize: '14px' }}>तुमच्या नंबरवर एक कोड पाठवला आहे.</p>

                        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    value={data}
                                    onChange={e => handleOtpChange(e.target, index)}
                                    onFocus={e => e.target.select()}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '12px',
                                        border: '1px solid #ddd',
                                        textAlign: 'center',
                                        fontSize: '20px',
                                        fontWeight: 'bold'
                                    }}
                                />
                            ))}
                        </div>

                        <button className="btn-primary" onClick={handleOtpSubmit} style={{ marginBottom: '20px' }}>
                            लॉगिन करा
                        </button>
                        <p style={{ color: '#888', fontSize: '14px' }}>कोड पुन्हा पाठवा</p>
                    </div>
                )}

                {step === 'success' && (
                    <div className="w-full flex-col flex items-center justify-center ani-text-enter" style={{ height: '100%' }}>

                        <div style={{ position: 'relative', width: '180px', height: '180px', marginBottom: '8px' }}>
                            {/* Text Layer (Static/Fade) */}
                            <img
                                src={bandhuLogo}
                                alt="Bandhu Text"
                                className="ani-text-enter"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                    clipPath: 'inset(35% 0 0 0)' // Hides the top part (Mic)
                                }}
                            />

                            {/* Mic Layer (Animated Drop) */}
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
                                    clipPath: 'inset(0 0 60% 0)' // Hides the bottom part (Text)
                                }}
                            />
                        </div>

                        <p style={{ fontSize: '20px', color: '#4B5563', marginBottom: '40px' }}>स्वागत आहे</p>

                    </div>
                )}

            </div>
        </div>
    );
};

export default LoginFlow;
