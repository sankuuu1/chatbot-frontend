import React from 'react';

const DynamicSVGDiagram = ({ diagramType = 'triangle' }) => {
    const type = (diagramType || 'triangle').toLowerCase();

    if (type === 'circle') {
        return (
            <svg width="180" height="140" viewBox="0 0 180 140" style={{ margin: '0 auto', display: 'block' }}>
                <circle cx="90" cy="70" r="50" fill="#FFF3E0" stroke="#E65100" strokeWidth="3" />
                <line x1="90" y1="70" x2="140" y2="70" stroke="#E65100" strokeWidth="2" strokeDasharray="4" />
                <circle cx="90" cy="70" r="4" fill="#E65100" />
                <text x="105" y="62" fontSize="11" fill="#E65100" fontWeight="bold">त्रिज्या (r)</text>
            </svg>
        );
    }

    if (type === 'rectangle' || type === 'square') {
        return (
            <svg width="180" height="140" viewBox="0 0 180 140" style={{ margin: '0 auto', display: 'block' }}>
                <rect x="30" y="30" width="120" height="80" rx="4" fill="#FFF3E0" stroke="#E65100" strokeWidth="3" />
                <text x="90" y="125" textAnchor="middle" fontSize="11" fill="#333" fontWeight="bold">लांबी (Length)</text>
                <text x="15" y="75" fontSize="11" fill="#333" fontWeight="bold" transform="rotate(-90 15,75)">रुंदी (Width)</text>
            </svg>
        );
    }

    // Default: Triangle SVG Diagram
    return (
        <svg width="200" height="130" viewBox="0 0 200 130" style={{ margin: '0 auto', display: 'block' }}>
            <polygon points="100,15 30,105 170,105" fill="#FFF8E1" stroke="#E65100" strokeWidth="3" />
            <line x1="100" y1="15" x2="100" y2="105" stroke="#E65100" strokeWidth="2" strokeDasharray="4" />
            <text x="105" y="65" fontSize="11" fill="#E65100" fontWeight="bold">उंची (h)</text>
            <text x="100" y="122" textAnchor="middle" fontSize="11" fill="#333" fontWeight="bold">पाया (Base)</text>
        </svg>
    );
};

const RichResponseCard = ({ data }) => {
    if (!data) return null;

    // Helper for Education Card
    if (data.type === 'education') {
        return (
            <div style={{ background: 'white', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginTop: '10px' }}>
                <h3 style={{ color: '#e67e22', fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
                    {data.title}
                </h3>

                {/* SVG Visual Diagram */}
                <div style={{ marginBottom: '20px' }}>
                    <DynamicSVGDiagram diagramType={data.diagram_type} />
                </div>

                {/* Formula Box */}
                {data.formula && (
                    <div style={{ background: '#FFF3E0', borderRadius: '12px', padding: '15px', marginBottom: '20px', textAlign: 'center' }}>
                        <p style={{ fontSize: '12px', color: '#e67e22', fontWeight: 'bold', marginBottom: '5px' }}>सूत्र (FORMULA)</p>
                        <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>{data.formula}</p>
                    </div>
                )}

                {data.content && (
                    <div style={{ fontSize: '13px', color: '#555', lineHeight: '1.6' }}>
                        {data.content.map((item, idx) => (
                            <p key={idx} style={{ marginBottom: '8px' }}>
                                <strong>{idx + 1}. {item.label}:</strong> {item.desc}
                            </p>
                        ))}
                    </div>
                )}

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
                {data.points && (
                    <ul style={{ paddingLeft: '20px', marginBottom: '20px', color: '#333', lineHeight: '1.6' }}>
                        {data.points.map((pt, i) => (
                            <li key={i} style={{ marginBottom: '10px' }}>{pt}</li>
                        ))}
                    </ul>
                )}
                <div style={{ marginTop: '20px', background: '#E8F5E9', border: '1px solid #C8E6C9', borderRadius: '16px', padding: '15px', display: 'flex', gap: '10px' }}>
                    <span>ℹ️</span>
                    <p style={{ fontSize: '12px', color: '#2e7d32', lineHeight: '1.4' }}>
                        ही माहिती केवळ सामान्य मार्गदर्शनासाठी आहे. फवारणीपूर्वी स्थानिक कृषी तज्ञांचा सल्ला अवश्य घ्या.
                    </p>
                </div>
            </div>
        );
    }

    // Default / Health Card
    if (data.type === 'health') {
        return (
            <div style={{ background: 'white', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginTop: '10px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px', color: '#e74c3c' }}>{data.title}</h2>
                {data.points && (
                    <ul style={{ paddingLeft: '20px', color: '#333', lineHeight: '1.6' }}>
                        {data.points.map((pt, i) => (
                            <li key={i} style={{ marginBottom: '10px' }}>{pt}</li>
                        ))}
                    </ul>
                )}
                <div style={{ marginTop: '15px', background: '#FFEBEE', border: '1px solid #FFCDD2', borderRadius: '12px', padding: '12px', fontSize: '11px', color: '#C62828' }}>
                    ⚠️ टीप: गंभीर आजार किंवा तातडीच्या प्रसंगी त्वरित प्राथमिक आरोग्य केंद्र किंवा डॉक्टरांचा सल्ला घ्या.
                </div>
            </div>
        );
    }

    return null;
};

export default RichResponseCard;
