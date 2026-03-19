import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, BookOpen, Tractor, Heart, HelpCircle, Home, User, Settings, Clock } from 'lucide-react';
import bandhuLogo from '../assets/Gemini_Generated_Image_za4cfxza4cfxza4c-removebg-preview.png';

const HomeDashboard = () => {
    const navigate = useNavigate();

    return (
        <div style={{ backgroundColor: '#FFFBF2', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {/* Header */}
            <div style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                        src={bandhuLogo}
                        alt="Bandhu"
                        style={{ height: '90px', width: 'auto', objectFit: 'contain', marginLeft: '-10px' }}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '5px 10px', borderRadius: '20px', border: '1px solid #ddd' }}>
                    <span style={{ color: 'white', background: '#d35400', padding: '2px 8px', borderRadius: '10px', fontSize: '12px', marginRight: '5px' }}>मराठी</span>
                    <span style={{ fontSize: '12px', color: '#888' }}>Eng</span>
                </div>
            </div>

            {/* Main Greeting & Mic */}
            <div style={{ textAlign: 'center', marginTop: '0px' }}>
                <p style={{ fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                    🙏 नमस्कार!
                </p>
                <p style={{ color: '#666', marginTop: '5px' }}>निर्धास्त बोला, मी तुमची भाषा समजतो</p>

                {/* Mic Button with Ripples */}
                <div style={{ position: 'relative', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '15px 0' }}>
                    <div className="ripple-effect ripple-1"></div>
                    <div className="ripple-effect ripple-2"></div>
                    <div className="ripple-effect ripple-3"></div>
                    <button
                        onClick={() => navigate('/chat')}
                        style={{
                            width: '90px',
                            height: '90px',
                            borderRadius: '50%',
                            background: '#D35400',
                            border: '4px solid white',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10,
                            cursor: 'pointer'
                        }}>
                        <Mic size={40} />
                    </button>
                    {/* Circle Rings SVG BG - simulated with divs above */}
                </div>
            </div>

            {/* Quick Chips */}
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '0 20px', paddingBottom: '15px', justifyContent: 'center' }}>
                <div className="chip" style={chipStyle}>आज पाऊस पडेल का?</div>
                <div className="chip" style={chipStyle} onClick={() => navigate('/chat')}>कापसावर कीड आली आहे</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                <div className="chip" style={chipStyle}>७वी गणित समजाव</div>
            </div>


            {/* Grid Menu */}
            <div style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '80px' }}>
                <MenuCard
                    icon={<BookOpen size={24} color="#d35400" />}
                    title="शिक्षण"
                    subtitle="शालेय प्रश्न व स्पष्टीकरण"
                    onClick={() => navigate('/chat', { state: { category: 'education' } })}
                />
                <MenuCard
                    icon={<Tractor size={24} color="#d35400" />}
                    title="शेती"
                    subtitle="पीक, कीड, बाजारभाव"
                    onClick={() => navigate('/chat', { state: { category: 'farming' } })}
                />
                <MenuCard
                    icon={<Heart size={24} color="#d35400" />}
                    title="आरोग्य"
                    subtitle="लक्षणे व प्राथमिक सल्ला"
                    onClick={() => navigate('/chat', { state: { category: 'health' } })}
                />
                <MenuCard
                    icon={<HelpCircle size={24} color="#d35400" />}
                    title="मदत"
                    subtitle="दैनंदिन प्रश्न"
                    onClick={() => navigate('/chat', { state: { category: 'help' } })}
                />
            </div>

            {/* Footer Info */}
            <div style={{ textAlign: 'center', paddingBottom: '100px' }}>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#d35400', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                    <span style={{ border: '1px solid #d35400', borderRadius: '50%', padding: '2px' }}>✓</span> ग्रामीण भारतासाठी बनवलेले
                </p>
            </div>


            {/* Bottom Nav */}
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
                padding: '15px',
                borderTop: '1px solid #eee',
                boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
            }}>
                < NavItem icon={< Home size={24} color="#d35400" />} label="मुख्य" active />
                <NavItem icon={<Settings size={24} color="#999" />} label="सेटिंग्ज" />
                <NavItem icon={<User size={24} color="#999" />} label="प्रोफाइल" />
            </div>
        </div >
    );
};

const chipStyle = {
    background: 'white',
    padding: '8px 16px',
    borderRadius: '20px',
    border: '1px solid #ddd',
    fontSize: '13px',
    whiteSpace: 'nowrap',
    fontWeight: '600',
    color: '#444',
    cursor: 'pointer'
};

const MenuCard = ({ icon, title, subtitle, onClick }) => (
    <div onClick={onClick} style={{ background: 'white', padding: '15px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', cursor: 'pointer' }}>
        <div style={{ background: '#FFF4E6', width: '45px', height: '45px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
            {icon}
        </div>
        <h4 style={{ fontWeight: 'bold', marginBottom: '2px', fontSize: '14px' }}>{title}</h4>
        <p style={{ fontSize: '10px', color: '#888' }}>{subtitle}</p>
    </div>
);

const NavItem = ({ icon, label, active }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
        {icon}
        <span style={{ fontSize: '10px', marginTop: '4px', color: active ? '#d35400' : '#999', fontWeight: active ? 'bold' : 'normal' }}>{label}</span>
    </div>
);

export default HomeDashboard;
