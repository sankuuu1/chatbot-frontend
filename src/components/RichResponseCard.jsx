import React from 'react';

const RichResponseCard = ({ data }) => {
    if (!data) return null;

    // Helper for Education Card (Triangle)
    if (data.type === 'education') {
        return (
            <div style={{ background: 'white', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginTop: '10px' }}>
                <h3 style={{ color: '#e67e22', fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
                    {data.title}
                </h3>

                {/* Visual Diagram Placeholder */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', position: 'relative', height: '120px' }}>
                    {/* CSS Triangle */}
                    <div style={{
                        width: 0,
                        height: 0,
                        borderLeft: '60px solid transparent',
                        borderRight: '60px solid transparent',
                        borderBottom: '100px solid white',
                        borderBottomColor: '#FFF8E1',
                        position: 'relative'
                    }}>
                        {/* Outline */}
                        <div style={{
                            position: 'absolute',
                            top: '0px',
                            left: '-60px',
                            width: 0,
                            height: 0,
                            borderLeft: '60px solid transparent',
                            borderRight: '60px solid transparent',
                            borderBottom: '100px solid #333',
                            zIndex: -1
                        }}></div>

                        {/* Dashed Height Line */}
                        <div style={{
                            position: 'absolute',
                            left: '0px',
                            top: '5px',
                            height: '95px',
                            borderLeft: '2px dashed #e67e22',
                            zIndex: 2
                        }}></div>

                        {/* Height Label */}
                        <div style={{ position: 'absolute', top: '40px', left: '5px', background: 'white', padding: '2px 5px', fontSize: '10px', color: '#e67e22', fontWeight: 'bold' }}>
                            उंची (Height)
                        </div>

                        {/* Base Label */}
                        <div style={{ position: 'absolute', bottom: '-20px', left: '-30px', width: '60px', textAlign: 'center', fontSize: '10px', fontWeight: 'bold', color: '#333' }}>
                            पाया (Base)
                        </div>
                    </div>
                </div>

                {/* Formula Box */}
                <div style={{ background: '#FFF3E0', borderRadius: '12px', padding: '15px', marginBottom: '20px', textAlign: 'center' }}>
                    <p style={{ fontSize: '12px', color: '#e67e22', fontWeight: 'bold', marginBottom: '5px' }}>सूत्र (FORMULA)</p>
                    <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>{data.formula}</p>
                </div>

                <div style={{ fontSize: '13px', color: '#555', lineHeight: '1.6' }}>
                    {data.content.map((item, idx) => (
                        <p key={idx} style={{ marginBottom: '8px' }}>
                            <strong>{idx + 1}. {item.label}:</strong> {item.desc}
                        </p>
                    ))}
                </div>

                <div style={{ marginTop: '15px', background: '#F5F5F5', padding: '10px', borderRadius: '8px', fontSize: '11px', color: '#777', display: 'flex', gap: '8px' }}>
                    <span>ℹ️</span>
                    <span>ही माहिती शालेय पुस्तकावर आधारित आहे. अधिक अभ्यासासाठी इयत्ता ७ वी चे गणिताचे पुस्तक पहा.</span>
                </div>
            </div>
        );
    }

    // Helper for Farming Card
    if (data.type === 'farming') {
        return (
            <div style={{ background: 'white', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginTop: '10px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px', color: '#2ecc71' }}>{data.title}</h2>
                <ul style={{ paddingLeft: '20px', marginBottom: '20px', color: '#333', lineHeight: '1.6' }}>
                    {data.points.map((pt, i) => (
                        <li key={i} style={{ marginBottom: '10px' }}>{pt}</li>
                    ))}
                </ul>
                <div style={{ marginTop: '20px', background: '#E8F5E9', border: '1px solid #C8E6C9', borderRadius: '16px', padding: '15px', display: 'flex', gap: '10px' }}>
                    <span>ℹ️</span>
                    <p style={{ fontSize: '12px', color: '#2e7d32', lineHeight: '1.4' }}>
                        ही माहिती केवळ सामान्य मार्गदर्शनासाठी आहे. फवारणीपूर्वी स्थानिक कृषी तज्ञांचा सल्ला अवश्य घ्या.
                    </p>
                </div>
            </div>
        );
    }

    // Default / Health
    if (data.type === 'health') {
        return (
            <div style={{ background: 'white', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginTop: '10px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px', color: '#e74c3c' }}>{data.title}</h2>
                <ul style={{ paddingLeft: '20px', color: '#333', lineHeight: '1.6' }}>
                    {data.points.map((pt, i) => (
                        <li key={i} style={{ marginBottom: '10px' }}>{pt}</li>
                    ))}
                </ul>
            </div>
        );
    }

    return null;
};

export default RichResponseCard;
